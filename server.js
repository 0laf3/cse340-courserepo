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

const NODE_ENV =
    process.env.NODE_ENV?.toLowerCase() || "development";

const PORT = process.env.PORT || 3000;

const SESSION_SECRET =
    process.env.SESSION_SECRET ||
    "development-secret-change-this";

// ========================================
// File paths
// ========================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ========================================
// EJS configuration
// ========================================

app.set(
    "view engine",
    "ejs"
);

app.set(
    "views",
    path.join(__dirname, "src", "views")
);

// ========================================
// Request parsing middleware
// ========================================

app.use(express.urlencoded({
    extended: true
}));

app.use(express.json());

// ========================================
// Session middleware
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
// Flash message middleware
// IMPORTANT: Must come AFTER session
// ========================================

app.use(flash);

// ========================================
// Global template variables
// ========================================

app.use((req, res, next) => {
    res.locals.NODE_ENV = NODE_ENV;
    next();
});

// ========================================
// Development logging
// ========================================

app.use((req, res, next) => {
    if (NODE_ENV === "development") {
        console.log(`${req.method} ${req.url}`);
    }

    next();
});

// ========================================
// Static files
// CSS, images, JavaScript
// ========================================

app.use(express.static(path.join(__dirname, 'public')));

// ========================================
// Routes
// ========================================

app.use("/", routes);

// ========================================
// Start server
// ========================================

app.listen(PORT, async () => {
    console.log(
        `Server running on port ${PORT}`
    );

    console.log(
        `Environment: ${NODE_ENV}`
    );

    try {
        await testConnection();

        console.log(
            "Database connection successful."
        );
    } catch (error) {
        console.error(
            "Database connection failed:",
            error
        );
    }
});