
import bcrypt from "bcrypt";

import {
    createUser,
    authenticateUser
} from "../models/users.js";

/**
 * Display the user registration form.
 */
export const showUserRegistrationForm = (req, res) => {
    return res.render("register", {
        title: "Register"
    });
};

/**
 * Process user registration.
 */
export const processUserRegistrationForm = async (req, res) => {
    const name =
        typeof req.body.name === "string"
            ? req.body.name.trim()
            : "";

    const email =
        typeof req.body.email === "string"
            ? req.body.email.trim().toLowerCase()
            : "";

    const password =
        typeof req.body.password === "string"
            ? req.body.password
            : "";

    if (!name || !email || !password) {
        req.flash("error", "Please complete all fields.");
        return res.redirect("/register");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        req.flash("error", "Please enter a valid email address.");
        return res.redirect("/register");
    }

    if (password.length < 7) {
        req.flash(
            "error",
            "Your password must contain at least 7 characters."
        );
        return res.redirect("/register");
    }

    try {
        const passwordHash = await bcrypt.hash(password, 10);

        await createUser(name, email, passwordHash);

        req.flash(
            "success",
            "Registration successful! Please log in."
        );

        return res.redirect("/login");
    } catch (error) {
        if (error.code === "23505") {
            req.flash(
                "error",
                "An account with that email already exists."
            );
        } else {
            console.error("Error registering user:", error);

            req.flash(
                "error",
                "An error occurred during registration. Please try again."
            );
        }

        return res.redirect("/register");
    }
};

/**
 * Display the login form.
 */
export const showLoginForm = (req, res) => {
    return res.render("login", {
        title: "Login"
    });
};

/**
 * Process user login.
 */
export const processLoginForm = async (req, res) => {
    const email =
        typeof req.body.email === "string"
            ? req.body.email.trim().toLowerCase()
            : "";

    const password =
        typeof req.body.password === "string"
            ? req.body.password
            : "";

    if (!email || !password) {
        req.flash("error", "Please enter your email and password.");
        return res.redirect("/login");
    }

    try {
        const user = await authenticateUser(email, password);

        if (!user) {
            req.flash("error", "Invalid email or password.");
            return res.redirect("/login");
        }

        // Regenerate the session to help prevent session fixation.
        await new Promise((resolve, reject) => {
            req.session.regenerate((err) => {
                if (err) {
                    return reject(err);
                }

                return resolve();
            });
        });

        // Store only safe, authenticated user information.
        // The user object now includes role_name.
        req.session.user = user;

        // Save the session before redirecting.
        await new Promise((resolve, reject) => {
            req.session.save((err) => {
                if (err) {
                    return reject(err);
                }

                return resolve();
            });
        });

        if (res.locals.NODE_ENV === "development") {
            console.log("User logged in:", {
                user_id: user.user_id,
                name: user.name,
                email: user.email,
                role_name: user.role_name
            });
        }

        req.flash("success", "Login successful!");

        return res.redirect("/dashboard");
    } catch (error) {
        console.error("Error during login:", error);

        // Never attempt a second response.
        if (res.headersSent) {
            return;
        }

        req.flash(
            "error",
            "Unable to log in. Please try again."
        );

        return res.redirect("/login");
    }
};

/**
 * Log out the current user.
 */
export const processLogout = (req, res, next) => {
    if (!req.session) {
        return res.redirect("/login");
    }

    req.session.destroy((error) => {
        if (error) {
            console.error("Error destroying session:", error);

            if (res.headersSent) {
                return;
            }

            return next(error);
        }

        return res.redirect("/login");
    });
};

/**
 * Middleware to protect routes that require authentication.
 */
export const requireLogin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        req.flash(
            "error",
            "You must be logged in to access that page."
        );

        return res.redirect("/login");
    }

    return next();
};

/**
 * Middleware factory to require a specific user role.
 *
 * @param {string} role - Required role, such as "admin".
 * @returns {Function} Express middleware.
 */
export const requireRole = (role) => {
    return (req, res, next) => {
        // Check whether the user is logged in.
        if (!req.session || !req.session.user) {
            req.flash(
                "error",
                "You must be logged in to access this page."
            );

            return res.redirect("/login");
        }

        // Check whether the user has the required role.
        if (req.session.user.role_name !== role) {
            req.flash(
                "error",
                "You do not have permission to access this page."
            );

            return res.redirect("/");
        }

        // The user has the required role.
        return next();
    };
};

/**
 * Display the logged-in user's dashboard.
 */
export const showDashboard = (req, res) => {
    if (!req.session || !req.session.user) {
        req.flash(
            "error",
            "You must be logged in to access that page."
        );

        return res.redirect("/login");
    }

    const user = req.session.user;

    return res.render("dashboard", {
        title: "Dashboard",
        name: user.name,
        email: user.email
    });
};
