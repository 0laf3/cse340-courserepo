
import bcrypt from "bcrypt";
import { 
    createUser,
    authenticateUser 
    
} from "../models/users.js";

export const showUserRegistrationForm = (req, res) => {
    res.render("register", {
        title: "Register"
    });
};

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

        return res.redirect("/");
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


export const showLoginForm = (req, res) => {
    res.render("login", {
        title: "Login"
    });
};

export const processLoginForm = async (req, res) => {
    const email =
        typeof req.body.email === "string"
            ? req.body.email.trim()
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

        // Regenerate the session before saving authenticated user data.
        req.session.regenerate((err) => {
            if (err) {
                console.error("Session regeneration failed:", err);
                req.flash("error", "Unable to log in. Please try again.");
                return res.redirect("/login");
            }

            req.session.user = user;

            req.session.save((saveError) => {
                if (saveError) {
                    console.error("Session save failed:", saveError);
                    return res.redirect("/login");
                }

                req.flash("success", "Login successful!");

                if (res.locals.NODE_ENV === "development") {
                    // The user object does not contain password_hash.
                    console.log("User logged in:", user);
                }

                return res.redirect("/");
            });
        });
    } catch (error) {
        console.error("Error during login:", error);
        req.flash(
            "error",
            "An error occurred during login. Please try again."
        );
        return res.redirect("/login");
    }
};

export const processLogout = (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.error("Error destroying session:", error);
            req.flash("error", "Unable to log out. Please try again.");
            return res.redirect("/");
        }

        // The session is destroyed, so use a redirect message only if
        // your flash middleware supports a separate post-session message.
        return res.redirect("/login");
    });
};

