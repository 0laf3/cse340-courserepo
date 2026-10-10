
import express from "express"
import session from "express-session"
import { fileURLToPath } from "url"
import path from "path"

import routes from "./src/routes.js"
import flash from "./src/middleware/flash.js"
import { testConnection } from "./src/models/db.js"


// ========================================
// Application Setup
// ========================================

const app = express()

const NODE_ENV =
    process.env.NODE_ENV?.toLowerCase() || "development"

const PORT = process.env.PORT || 3000

const SESSION_SECRET =
    process.env.SESSION_SECRET ||
    "development-secret-change-this"


// ========================================
// File Paths
// ========================================

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


// ========================================
// EJS Configuration
// ========================================

app.set("view engine", "ejs")

app.set(
    "views",
    path.join(__dirname, "src", "views")
)


// ========================================
// Request Parsing Middleware
// ========================================

app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())


// ========================================
// Session Middleware
// ========================================

app.use(
    session({
        name: "connect.sid",
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 60 * 60 * 1000,
            httpOnly: true,
            secure: NODE_ENV === "production",
            sameSite: "lax"
        }
    })
)


// ========================================
// Flash Message Middleware
// Must come after session middleware
// ========================================

app.use(flash)


// ========================================
// Global Template Variables
// ========================================

app.use((req, res, next) => {
    res.locals.NODE_ENV = NODE_ENV;

    res.locals.isLoggedIn = Boolean(
        req.session && req.session.user
    );

    // Make the logged-in user's role available to EJS views.
    res.locals.user = req.session?.user || null;

    // Preserve the variable already used by your templates.
    res.locals.currentUser = req.session?.user || null;

    next();
});


// ========================================
// Development Logging
// ========================================

app.use((req, res, next) => {
    if (NODE_ENV === "development") {
        console.log(`${req.method} ${req.url}`)
    }

    next()
})


// ========================================
// Static Files
// CSS, Images, and JavaScript
// ========================================

app.use(
    express.static(
        path.join(__dirname, "public")
    )
)


// ========================================
// Routes
// ========================================

app.use("/", routes)


// ========================================
// Start Server
// ========================================

app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`)
    console.log(`Environment: ${NODE_ENV}`)

    try {
        await testConnection()

        console.log("Database connection successful.")
    } catch (error) {
        console.error(
            "Database connection failed:",
            error
        )
    }
})
