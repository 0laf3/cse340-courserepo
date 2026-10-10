import bcrypt from "bcrypt";

import {
  createUser,
  authenticateUser,
  getAllUsers
} from "../models/users.js";

// ========================================
// Show Registration Form
// ========================================
export const showRegisterForm = (req, res) => {
  res.render("register", {
    title: "Register"
  });
};

// ========================================
// Process Registration Form
// ========================================
export const processRegisterForm = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    !name.trim() ||
    !email.trim() ||
    !password
  ) {
    req.flash("error", "Please complete all required fields.");
    return res.redirect("/register");
  }

  const normalizedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();

  if (normalizedName.length < 2 || normalizedName.length > 100) {
    req.flash(
      "error",
      "Name must be between 2 and 100 characters."
    );
    return res.redirect("/register");
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(normalizedEmail)) {
    req.flash("error", "Please enter a valid email address.");
    return res.redirect("/register");
  }

  if (password.length < 7) {
    req.flash(
      "error",
      "Password must be at least 7 characters long."
    );
    return res.redirect("/register");
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    await createUser(
      normalizedName,
      normalizedEmail,
      passwordHash
    );

    req.flash(
      "success",
      "Registration successful! You can now log in."
    );

    return res.redirect("/login");
  } catch (error) {
    if (error.code === "23505") {
      req.flash(
        "error",
        "An account with this email already exists."
      );
      return res.redirect("/register");
    }

    console.error("Error processing registration:", error);
    return next(error);
  }
};

// ========================================
// Show Login Form
// ========================================
export const showLoginForm = (req, res) => {
  res.render("login", {
    title: "Login"
  });
};

// ========================================
// Process Login Form
// ========================================
export const processLoginForm = async (req, res, next) => {
  const { email, password } = req.body;

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email.trim() ||
    !password
  ) {
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
    req.session.regenerate((error) => {
      if (error) {
        return next(error);
      }

      req.session.user = {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role_name: user.role_name
      };

      req.session.save((saveError) => {
        if (saveError) {
          return next(saveError);
        }

        req.flash("success", "You have logged in successfully.");
        return res.redirect("/dashboard");
      });
    });
  } catch (error) {
    console.error("Error processing login:", error);
    return next(error);
  }
};

// ========================================
// Process Logout
// ========================================
export const processLogout = (req, res, next) => {
  if (!req.session) {
    return res.redirect("/login");
  }

  req.session.destroy((error) => {
    if (error) {
      return next(error);
    }

    res.clearCookie("connect.sid");
    return res.redirect("/login?logout=success");
  });
};

// ========================================
// Require Login
// ========================================
export const requireLogin = (req, res, next) => {
  if (!req.session || !req.session.user) {
    req.flash("error", "You must be logged in to access this page.");
    return res.redirect("/login");
  }

  return next();
};

// ========================================
// Require Specific Role
// ========================================
export const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.session || !req.session.user) {
      req.flash("error", "Please log in to access this page.");
      return res.redirect("/login");
    }

    if (req.session.user.role_name !== role) {
      req.flash(
        "error",
        "You do not have permission to access this page."
      );

      // Non-admin users return to their dashboard.
      return res.redirect("/dashboard");
    }

    return next();
  };
};

// ========================================
// Show Dashboard
// ========================================
export const showDashboard = (req, res) => {
  const user = req.session.user;

  return res.render("dashboard", {
    title: "Dashboard",
    name: user.name,
    email: user.email,
    user
  });
};

// ========================================
// Show Registered Users Page (Admin Only)
// ========================================
export const showUsersPage = async (req, res, next) => {
  try {
    const users = await getAllUsers();

    return res.render("users", {
      title: "Registered Users",
      users
    });
  } catch (error) {
    console.error("Error displaying users page:", error);
    return next(error);
  }
};