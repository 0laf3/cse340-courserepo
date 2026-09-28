import express from "express";
import session from "express-session";
import { fileURLToPath } from "url";
import path from "path";

import routes from "./src/routes.js";
import flash from "./src/middleware/flash.js";
import { testConnection } from "./src/models/db.js";

// ========================================
// Application setup
// ========================================

const app = express();

// Define the application environment
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || "development";

// Define the port
const PORT = process.env.PORT || 3000;

// Define the session secret
const SESSION_SECRET =
    process.env.SESSION_SECRET || "development-secret-change-this";

// Get the current file and directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ========================================
// EJS configuration
// ========================================

// Set EJS as the view engine
app.set("view engine", "ejs");

// Tell Express where the EJS views are located
app.set("views", path.join(__dirname, "src", "views"));

// ========================================
// Request parsing middleware
// ========================================

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Parse JSON request bodies
app.use(express.json());

// ========================================
// Session management
// ========================================

app.use(
    session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 60 * 60 * 1000
        }
    })
);

// ========================================
// Flash messages
// ========================================

app.use(flash);

// ========================================
// Global template variables
// ========================================

// Make NODE_ENV available to all EJS templates
app.use((req, res, next) => {
    res.locals.NODE_ENV = NODE_ENV;
    next();
});

// ========================================
// Development request logging
// ========================================

app.use((req, res, next) => {
    if (NODE_ENV === "development") {
        console.log(`${req.method} ${req.url}`);
    }

    next();
});

// ========================================
// Static files
// ========================================
//
// Files inside:
//
// public/css/
// public/images/
// public/js/
//
// are available from:
//
// /css/
// /images/
// /js/
//
// Example:
// public/css/main.css
// becomes:
// http://localhost:3000/css/main.css
//

app.use(express.static(path.join(__dirname, "public")));

// ========================================
// Application routes
// ========================================

app.use("/", routes);

// ========================================
// Start server
// ========================================

app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);

    try {
        await testConnection();
        console.log("Database connection successful.");
    } catch (error) {
        console.error("Database connection failed:", error);
    }
});