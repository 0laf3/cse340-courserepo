import express from "express"

import { homePage } from "./controllers/index.js"

import {
    showOrganizationsPage,
    showOrganizationDetailsPage
} from "./controllers/organizations.js"

import {
    showProjectsPage,
    showProjectDetailsPage
} from "./controllers/projects.js"

import {
    categoriesPage,
    categoryDetailsPage
} from "./controllers/categories.js"

import {
    testError,
    notFound,
    errorHandler
} from "./controllers/errors.js"

const router = express.Router()

// Home
router.get("/", homePage)

// Organizations
router.get("/organizations", showOrganizationsPage)

// Organization details
router.get("/organization/:id", showOrganizationDetailsPage)

// Upcoming projects
router.get("/projects", showProjectsPage)

// Project details
router.get("/project/:id", showProjectDetailsPage)

// Categories
router.get("/categories", categoriesPage)

// Category details
router.get("/category/:id", categoryDetailsPage)

// Test route for 500 errors
router.get("/test-error", testError)

// 404 handler
router.use(notFound)

// Global error handler
router.use(errorHandler)

export default router