
import express from "express";

import { homePage } from "./controllers/index.js";

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
    showDashboard,
    showUsersPage
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

router.get("/organizations", showOrganizationsPage);

router.get(
    "/organization/:id",
    showOrganizationDetailsPage
);

// ========================================
// New Organization (ADMIN ONLY)
// ========================================

router.get(
    "/new-organization",
    requireLogin,
    requireRole("admin"),
    showNewOrganizationForm
);

router.post(
    "/new-organization",
    requireLogin,
    requireRole("admin"),
    organizationValidation,
    processNewOrganizationForm
);

// ========================================
// Edit Organization (ADMIN ONLY)
// ========================================

router.get(
    "/edit-organization/:id",
    requireLogin,
    requireRole("admin"),
    showEditOrganizationForm
);

router.post(
    "/edit-organization/:id",
    requireLogin,
    requireRole("admin"),
    organizationEditValidation,
    processEditOrganizationForm
);

// ========================================
// Delete Organization (ADMIN ONLY)
// ========================================

router.post(
    "/delete-organization/:id",
    requireLogin,
    requireRole("admin"),
    processDeleteOrganization
);

// ========================================
// Projects
// ========================================

router.get("/projects", showProjectsPage);

router.get(
    "/project/:id",
    showProjectDetailsPage
);

// ========================================
// New Project (ADMIN ONLY)
// ========================================

router.get(
    "/new-project",
    requireLogin,
    requireRole("admin"),
    showNewProjectForm
);

router.post(
    "/new-project",
    requireLogin,
    requireRole("admin"),
    projectValidation,
    processNewProjectForm
);

// ========================================
// Edit Project (ADMIN ONLY)
// ========================================

router.get(
    "/edit-project/:id",
    requireLogin,
    requireRole("admin"),
    showEditProjectForm
);

router.post(
    "/edit-project/:id",
    requireLogin,
    requireRole("admin"),
    projectValidation,
    processEditProjectForm
);

// ========================================
// Categories
// ========================================

router.get("/categories", categoriesPage);

router.get(
    "/category/:id",
    categoryDetailsPage
);

// ========================================
// New Category (ADMIN ONLY)
// ========================================

router.get(
    "/new-category",
    requireLogin,
    requireRole("admin"),
    showNewCategoryForm
);

router.post(
    "/new-category",
    requireLogin,
    requireRole("admin"),
    categoryValidation,
    processNewCategoryForm
);

// ========================================
// Edit Category (ADMIN ONLY)
// ========================================

router.get(
    "/edit-category/:id",
    requireLogin,
    requireRole("admin"),
    showEditCategoryForm
);

router.post(
    "/edit-category/:id",
    requireLogin,
    requireRole("admin"),
    categoryValidation,
    processEditCategoryForm
);

// ========================================
// Assign Categories to Project (ADMIN ONLY)
// ========================================

router.get(
    "/assign-categories/:projectId",
    requireLogin,
    requireRole("admin"),
    showAssignCategoriesForm
);

router.post(
    "/assign-categories/:projectId",
    requireLogin,
    requireRole("admin"),
    processAssignCategoriesForm
);

// ========================================
// Error Testing
// ========================================

router.get("/test-error", testError);

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
// Users Page (ADMIN ONLY)
// ========================================

router.get(
    "/users",
    requireLogin,
    requireRole("admin"),
    showUsersPage
);

// ========================================
// Error Handling
// ========================================

// Keep these handlers last.
router.use(notFound);
router.use(errorHandler);

export default router;
