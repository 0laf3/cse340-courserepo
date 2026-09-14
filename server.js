import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

import { testConnection } from './src/models/db.js';
import { getAllOrganizations } from './src/models/organizations.js';
import { getAllProjects } from './src/models/projects.js';
import { getAllCategories } from './src/models/categories.js';

// Define the application environment
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';

// Define the port number the server will listen on
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/**
 * Configure Express middleware
 */

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Tell Express where to find your templates
app.set('views', path.join(__dirname, 'src/views'));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Routes
 */

// Home
app.get('/', async (req, res) => {
    const title = 'Home';

    res.render('home', { title });
});

// Organizations
app.get('/organizations', async (req, res) => {
    try {
        const organizations = await getAllOrganizations();

        console.log('Organizations:', organizations);

        res.render('organizations', {
            title: 'Organizations',
            organizations
        });
    } catch (error) {
        console.error('Error fetching organizations:', error);
        res.status(500).send('Server Error');
    }
});

// Projects
app.get('/projects', async (req, res) => {
    try {
        const projects = await getAllProjects();

        console.log('Projects:', projects);

        res.render('projects', {
            title: 'Service Projects',
            projects
        });
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).send('Server Error');
    }
});

// Categories
app.get('/categories', async (req, res) => {
    const title = 'Service Categories';

    try {
        const categories = await getAllCategories();

        res.render('categories', {
            title,
            categories
        });
    } catch (error) {
        console.error('Error fetching categories:', error);

        res.status(500).send('Unable to load service categories.');
    }
});


// Start server
app.listen(PORT, async () => {
    try {
        await testConnection();

        console.log(`Server is running at http://127.0.0.1:${PORT}`);
        console.log(`Environment: ${NODE_ENV}`);
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
});