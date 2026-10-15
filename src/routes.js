
import express from "express";

import {
    homePage
} from "./controllers/index.js";

import {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    showEditOrganizationForm,
    processEditOrganizationForm,
    processDeleteOrganization,
    organizationValidation,
    organizationEditValidation
} from "./controllers/organizations.js";

import {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    showEditProjectForm,
    processEditProjectForm,
    projectValidation
} from "./controllers/projects.js";

import {
    categoriesPage,
    categoryDetailsPage,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    categoryValidation,
    showAssignCategoriesForm,
    processAssignCategoriesForm
} from "./controllers/categories.js";

import {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    requireRole,
    showDashboard
} from "./controllers/users.js";

import {
    testError,
    notFound,
    errorHandler
} from "./controllers/errors.js";

const router = express.Router();

// ========================================
// Home
// ========================================

router.get("/", homePage);

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
// New Organization (ADMIN ONLY)
// ========================================

// Display new organization form
router.get(
    "/new-organization",
    requireRole("admin"),
    showNewOrganizationForm
);

// Process new organization form
router.post(
    "/new-organization",
    requireRole("admin"),
    organizationValidation,
    processNewOrganizationForm
);

// ========================================
// Edit Organization (ADMIN ONLY)
// ========================================

// Display edit organization form
router.get(
    "/edit-organization/:id",
    requireRole("admin"),
    showEditOrganizationForm
);

// Process edit organization form
router.post(
    "/edit-organization/:id",
    requireRole("admin"),
    organizationEditValidation,
    processEditOrganizationForm
);

// ========================================
// Delete Organization (ADMIN ONLY)
// ========================================

router.post(
    "/delete-organization/:id",
    requireRole("admin"),
    processDeleteOrganization
);

// ========================================
// Projects
// ========================================

// List upcoming projects
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
// New Project (ADMIN ONLY)
// ========================================

// Display new project form
router.get(
    "/new-project",
    requireRole("admin"),
    showNewProjectForm
);

// Process new project form
router.post(
    "/new-project",
    requireRole("admin"),
    projectValidation,
    processNewProjectForm
);

// ========================================
// Edit Project (ADMIN ONLY)
// ========================================

// Display edit project form
router.get(
    "/edit-project/:id",
    requireRole("admin"),
    showEditProjectForm
);

// Process edit project form
router.post(
    "/edit-project/:id",
    requireRole("admin"),
    projectValidation,
    processEditProjectForm
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
// New Category (ADMIN ONLY)
// ========================================

// Display new category form
router.get(
    "/new-category",
    requireRole("admin"),
    showNewCategoryForm
);

// Process new category form
router.post(
    "/new-category",
    requireRole("admin"),
    categoryValidation,
    processNewCategoryForm
);

// ========================================
// Edit Category (ADMIN ONLY)
// ========================================

// Display edit category form
router.get(
    "/edit-category/:id",
    requireRole("admin"),
    showEditCategoryForm
);

// Process edit category form
router.post(
    "/edit-category/:id",
    requireRole("admin"),
    categoryValidation,
    processEditCategoryForm
);

// ========================================
// Assign Categories to Project (ADMIN ONLY)
// ========================================

// Display assign categories form
router.get(
    "/assign-categories/:projectId",
    requireRole("admin"),
    showAssignCategoriesForm
);

// Process assign categories form
router.post(
    "/assign-categories/:projectId",
    requireRole("admin"),
    processAssignCategoriesForm
);

// ========================================
// Error Testing
// ========================================

router.get(
    "/test-error",
    testError
);

// ========================================
// User Registration
// ========================================

router.get(
    "/register",
    showUserRegistrationForm
);

router.post(
    "/register",
    processUserRegistrationForm
);

// ========================================
// User Login and Logout
// ========================================

router.get(
    "/login",
    showLoginForm
);

router.post(
    "/login",
    processLoginForm
);

router.get(
    "/logout",
    processLogout
);

// ========================================
// User Dashboard
// ========================================

router.get(
    "/dashboard",
    requireLogin,
    showDashboard
);

// ========================================
// Error Handling
// ========================================

// 404 handler
router.use(notFound);

// Global error handler
router.use(errorHandler);

export default router;
