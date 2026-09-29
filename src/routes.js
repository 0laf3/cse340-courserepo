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
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    projectValidation
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

router.get(
    "/organizations",
    showOrganizationsPage
);

router.get(
    "/organization/:id",
    showOrganizationDetailsPage
);

// ========================================
// New Organization
// ========================================

router.get(
    "/new-organization",
    showNewOrganizationForm
);

router.post(
    "/new-organization",
    organizationValidation,
    processNewOrganizationForm
);

// ========================================
// Edit Organization
// ========================================

router.get(
    "/edit-organization/:id",
    showEditOrganizationForm
);

router.post(
    "/edit-organization/:id",
    organizationEditValidation,
    processEditOrganizationForm
);

// ========================================
// Projects
// ========================================

router.get(
    "/projects",
    showProjectsPage
);

router.get(
    "/project/:id",
    showProjectDetailsPage
);

router.get(
    "/new-project",
    showNewProjectForm
);

router.post(
    "/new-project",
    projectValidation,
    processNewProjectForm
);

// ========================================
// Categories
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
// Error Testing
// ========================================

router.get(
    "/test-error",
    testError
);

// ========================================
// Error Handling
// ========================================

router.use(notFound);

router.use(errorHandler);

export default router;