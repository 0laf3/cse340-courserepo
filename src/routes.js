import express from "express";

import { homePage } from "./controllers/index.js";

import {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    showEditOrganizationForm,
    processEditOrganizationForm,
    organizationValidation,
    organizationEditValidation
} from "./controllers/organizations.js";

import {
    showProjectsPage,
    showProjectDetailsPage
} from "./controllers/projects.js";

import {
    categoriesPage,
    categoryDetailsPage
} from "./controllers/categories.js";

import {
    testError,
    notFound,
    errorHandler
} from "./controllers/errors.js";

const router = express.Router();

// ========================================
// Home
// ========================================

router.get(
    "/",
    homePage
);

// ========================================
// Organizations
// ========================================

// List all organizations
router.get(
    "/organizations",
    showOrganizationsPage
);

// Organization details
router.get(
    "/organization/:id",
    showOrganizationDetailsPage
);

// ========================================
// New Organization
// ========================================

// Display new organization form
router.get(
    "/new-organization",
    showNewOrganizationForm
);

// Process new organization form
router.post(
    "/new-organization",
    organizationValidation,
    processNewOrganizationForm
);

// ========================================
// Edit Organization
// ========================================

// Display edit organization form
router.get(
    "/edit-organization/:id",
    showEditOrganizationForm
);

// Process edit organization form
router.post(
    "/edit-organization/:id",
    organizationEditValidation,
    processEditOrganizationForm
);

// ========================================
// Projects
// ========================================

// Upcoming projects
router.get(
    "/projects",
    showProjectsPage
);

// Project details
router.get(
    "/project/:id",
    showProjectDetailsPage
);

// ========================================
// Categories
// ========================================

// List all categories
router.get(
    "/categories",
    categoriesPage
);

// Category details
router.get(
    "/category/:id",
    categoryDetailsPage
);

// ========================================
// Error Testing
// ========================================

// Test route for 500 errors
router.get(
    "/test-error",
    testError
);

// ========================================
// Error Handling
// ========================================

// 404 handler
router.use(notFound);

// Global error handler
router.use(errorHandler);

export default router;