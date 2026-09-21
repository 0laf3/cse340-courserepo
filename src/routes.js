import express from 'express';

import { homePage } from './controllers/index.js';

import {
    showOrganizationsPage,
    showOrganizationDetailsPage
} from './controllers/organizations.js';

import {
    showProjectsPage,
    showProjectDetailsPage
} from './controllers/projects.js';

import { categoriesPage } from './controllers/categories.js';

import {
    testError,
    notFound,
    errorHandler
} from './controllers/errors.js';

const router = express.Router();

// Home
router.get('/', homePage);

// Organizations
router.get('/organizations', showOrganizationsPage);

// Organization details
router.get('/organization/:id', showOrganizationDetailsPage);

// Projects
router.get('/projects', showProjectsPage);

// Project details
router.get('/project/:id', showProjectDetailsPage);

// Categories
router.get('/categories', categoriesPage);

// Test route for 500 errors
router.get('/test-error', testError);

// Catch-all route for 404 errors
router.use(notFound);

// Global error handler
router.use(errorHandler);

export default router;