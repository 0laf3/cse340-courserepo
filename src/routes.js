import express from 'express';

import { homePage } from './controllers/index.js';
import { organizationsPage } from './controllers/organizations.js';
import { projectsPage } from './controllers/projects.js';
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
router.get('/organizations', organizationsPage);

// Projects
router.get('/projects', projectsPage);

// Categories
router.get('/categories', categoriesPage);

// Test route for 500 errors
router.get('/test-error', testError);

// Catch-all route for 404 errors
router.use(notFound);

// Global error handler
router.use(errorHandler);

export default router;