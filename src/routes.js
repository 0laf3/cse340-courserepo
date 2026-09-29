import express from "express"


import {
    homePage
} from "./controllers/index.js"


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
} from "./controllers/organizations.js"


import {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    showEditProjectForm,
    processEditProjectForm,
    projectValidation
} from "./controllers/projects.js"


import {
    categoriesPage,
    categoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm
} from "./controllers/categories.js"


import {
    testError,
    notFound,
    errorHandler
} from "./controllers/errors.js"


const router = express.Router()


// ========================================
// Home
// ========================================

router.get(
    "/",
    homePage
)


// ========================================
// Organizations
// ========================================

// List all organizations
router.get(
    "/organizations",
    showOrganizationsPage
)


// Organization details
router.get(
    "/organization/:id",
    showOrganizationDetailsPage
)


// ========================================
// New Organization
// ========================================

// Display new organization form
router.get(
    "/new-organization",
    showNewOrganizationForm
)


// Process new organization form
router.post(
    "/new-organization",
    organizationValidation,
    processNewOrganizationForm
)


// ========================================
// Edit Organization
// ========================================

// Display edit organization form
router.get(
    "/edit-organization/:id",
    showEditOrganizationForm
)


// Process edit organization form
router.post(
    "/edit-organization/:id",
    organizationEditValidation,
    processEditOrganizationForm
)


// ========================================
// Delete Organization
// ========================================

// Process delete organization
router.post(
    "/delete-organization/:id",
    processDeleteOrganization
)


// ========================================
// Projects
// ========================================

// Upcoming projects
router.get(
    "/projects",
    showProjectsPage
)


// Project details
router.get(
    "/project/:id",
    showProjectDetailsPage
)


// ========================================
// New Project
// ========================================

// Display new project form
router.get(
    "/new-project",
    showNewProjectForm
)


// Process new project form
router.post(
    "/new-project",
    projectValidation,
    processNewProjectForm
)


// ========================================
// Edit Project
// ========================================

// Display edit project form
router.get(
    "/edit-project/:id",
    showEditProjectForm
)


// Process edit project form
router.post(
    "/edit-project/:id",
    projectValidation,
    processEditProjectForm
)


// ========================================
// Categories
// ========================================

// List all categories
router.get(
    "/categories",
    categoriesPage
)


// Category details
router.get(
    "/category/:id",
    categoryDetailsPage
)


// ========================================
// Assign Categories to Project
// ========================================

// Display assign categories form
router.get(
    "/assign-categories/:projectId",
    showAssignCategoriesForm
)


// Process assign categories form
router.post(
    "/assign-categories/:projectId",
    processAssignCategoriesForm
)


// ========================================
// Error Testing
// ========================================

router.get(
    "/test-error",
    testError
)


// ========================================
// Error Handling
// ========================================

// 404 handler
router.use(
    notFound
)


// Global error handler
router.use(
    errorHandler
)


export default router