
import bcrypt from "bcrypt";
import { createUser } from "../models/users.js";

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
