import express from "express"
import path from "path"
import { fileURLToPath } from "url"

import routes from "./src/routes.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

const PORT = process.env.PORT || 3000

// ========================================
// EJS
// ========================================

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "src", "views"))


// ========================================
// Parse POST request data
// ========================================

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Make environment information available to EJS views
app.use((req, res, next) => {
    res.locals.NODE_ENV = process.env.NODE_ENV || "development"
    next()
})

// ========================================
// Static files
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
// Start server
// ========================================

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})