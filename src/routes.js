import express from "express";

// ========================================
// Home
// ========================================

import { homePage } from "./controllers/index.js";

// ========================================
// Organizations
// ========================================

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

// ========================================
// Projects
// ========================================

import {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    showEditProjectForm,
    processEditProjectForm,
    projectValidation
} from "./controllers/projects.js";

// ========================================
// Categories
// ========================================

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

// ========================================
// User Authentication and Authorization
// ========================================

import {
    showRegisterForm,
    processRegisterForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    requireRole,
    showDashboard,
    showUsersPage
} from "./controllers/users.js";

// ========================================
// Error Handling
// ========================================

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
// Registration
// ========================================

router.get("/register", showRegisterForm);
router.post("/register", processRegisterForm);

// ========================================
// Login and Logout
// ========================================

router.get("/login", showLoginForm);
router.post("/login", processLoginForm);
router.get("/logout", processLogout);

// ========================================
// Dashboard
// ========================================

router.get(
    "/dashboard",
    requireLogin,
    showDashboard
);

// ========================================
// Users Page - Admin Only
// ========================================

router.get(
    "/users",
    requireRole("admin"),
    showUsersPage
);

// ========================================
// Organizations - Public Viewing
// ========================================

router.get(
    "/organizations",
    showOrganizationsPage
);

router.get(
    "/organization/:id",
    showOrganizationDetailsPage
);

// ========================================
// Organizations - Admin Only
// ========================================

router.get(
    "/new-organization",
    requireRole("admin"),
    showNewOrganizationForm
);

router.post(
    "/new-organization",
    requireRole("admin"),
    organizationValidation,
    processNewOrganizationForm
);

router.get(
    "/edit-organization/:id",
    requireRole("admin"),
    showEditOrganizationForm
);

router.post(
    "/edit-organization/:id",
    requireRole("admin"),
    organizationEditValidation,
    processEditOrganizationForm
);

router.post(
    "/delete-organization/:id",
    requireRole("admin"),
    processDeleteOrganization
);

// ========================================
// Projects - Public Viewing
// ========================================

router.get(
    "/projects",
    showProjectsPage
);

router.get(
    "/project/:id",
    showProjectDetailsPage
);

// ========================================
// Projects - Admin Only
// ========================================

router.get(
    "/new-project",
    requireRole("admin"),
    showNewProjectForm
);

router.post(
    "/new-project",
    requireRole("admin"),
    projectValidation,
    processNewProjectForm
);

router.get(
    "/edit-project/:id",
    requireRole("admin"),
    showEditProjectForm
);

router.post(
    "/edit-project/:id",
    requireRole("admin"),
    projectValidation,
    processEditProjectForm
);

// ========================================
// Categories - Public Viewing
// ========================================

router.get(
    "/categories",
    categoriesPage
);

router.get(
    "/category/:id",
    categoryDetailsPage
);

// ========================================
// Categories - Admin Only
// ========================================

router.get(
    "/new-category",
    requireRole("admin"),
    showNewCategoryForm
);

router.post(
    "/new-category",
    requireRole("admin"),
    categoryValidation,
    processNewCategoryForm
);

router.get(
    "/edit-category/:id",
    requireRole("admin"),
    showEditCategoryForm
);

router.post(
    "/edit-category/:id",
    requireRole("admin"),
    categoryValidation,
    processEditCategoryForm
);

// ========================================
// Category Assignment - Admin Only
// ========================================

router.get(
    "/assign-categories/:projectId",
    requireRole("admin"),
    showAssignCategoriesForm
);

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
// Error Handling
// Keep these at the end.
// ========================================

router.use(notFound);
router.use(errorHandler);

export default router;