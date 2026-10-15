import {
    createUser,
    authenticateUser,
    getAllUsers
} from "../models/users.js";

/**
 * Display the registration form.
 */
export const showUserRegistrationForm = (req, res) => {
    res.render("register", {
        title: "Register"
    });
};

/**
 * Process user registration.
 */
export const processUserRegistrationForm = async (req, res) => {
    try {
        const name = req.body.name?.trim();
        const email = req.body.email?.trim().toLowerCase();
        const password = req.body.password;

        if (!name || !email || !password) {
            req.flash(
                "error",
                "Please provide your name, email, and password."
            );

            return res.redirect("/register");
        }

        if (password.length < 8) {
            req.flash(
                "error",
                "Your password must contain at least 8 characters."
            );

            return res.redirect("/register");
        }

        await createUser(name, email, password);

        req.flash(
            "success",
            "Registration successful. You can now log in."
        );

        return res.redirect("/login");
    } catch (error) {
        console.error("Registration error:", error);

        if (error.code === "23505") {
            req.flash(
                "error",
                "An account with that email address already exists."
            );

            return res.redirect("/register");
        }

        req.flash(
            "error",
            "Unable to register your account. Please try again."
        );

        return res.redirect("/register");
    }
};

/**
 * Display the login form.
 */
export const showLoginForm = (req, res) => {
    res.render("login", {
        title: "Login"
    });
};

/**
 * Process user login.
 */
export const processLoginForm = async (req, res) => {
    try {
        const email = req.body.email?.trim().toLowerCase();
        const password = req.body.password;

        if (!email || !password) {
            req.flash(
                "error",
                "Please enter your email and password."
            );

            return res.redirect("/login");
        }

        const user = await authenticateUser(email, password);

        if (!user) {
            req.flash(
                "error",
                "Invalid email or password."
            );

            return res.redirect("/login");
        }

        req.session.regenerate((sessionError) => {
            if (sessionError) {
                console.error(
                    "Session regeneration error:",
                    sessionError
                );

                req.flash(
                    "error",
                    "Unable to log in. Please try again."
                );

                return res.redirect("/login");
            }

            req.session.user = user;

            req.session.save((saveError) => {
                if (saveError) {
                    console.error(
                        "Session save error:",
                        saveError
                    );

                    return res.redirect("/login");
                }

                req.flash(
                    "success",
                    `Welcome, ${user.name}!`
                );

                return res.redirect("/dashboard");
            });
        });
    } catch (error) {
        console.error("Login error:", error);

        req.flash(
            "error",
            "An error occurred while logging in."
        );

        return res.redirect("/login");
    }
};

/**
 * Log out the current user.
 */
export const processLogout = (req, res) => {
    if (!req.session) {
        return res.redirect("/");
    }

    req.session.destroy((error) => {
        if (error) {
            console.error("Logout error:", error);
            return res.redirect("/dashboard");
        }

        res.clearCookie("connect.sid");
        return res.redirect("/");
    });
};

/**
 * Require the visitor to be logged in.
 */
export const requireLogin = (req, res, next) => {
    if (!req.session?.user) {
        req.flash(
            "error",
            "You must be logged in to access that page."
        );

        return res.redirect("/login");
    }

    next();
};

/**
 * Restrict a route to a specific role.
 */
export const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.session?.user) {
            req.flash(
                "error",
                "Please log in to access that page."
            );

            return res.redirect("/login");
        }

        if (req.session.user.role_name !== role) {
            req.flash(
                "error",
                "Access denied. Administrator permissions are required."
            );

            return res.redirect("/dashboard");
        }

        next();
    };
};

/**
 * Display the dashboard.
 */
export const showDashboard = (req, res) => {
    res.render("dashboard", {
        title: "Dashboard",
        user: req.session.user,
        name: req.session.user.name,
        email: req.session.user.email
    });
};

/**
 * Display all registered users.
 * The route must use requireLogin and requireRole("admin").
 */
export const showUsersPage = async (req, res) => {
    try {
        const users = await getAllUsers();

        return res.render("users", {
            title: "Registered Users",
            users,
            user: req.session.user
        });
    } catch (error) {
        console.error("Error displaying users page:", error);

        req.flash(
            "error",
            "Unable to load the registered users."
        );

        return res.redirect("/dashboard");
    }
};