import { getAllProjects } from '../models/projects.js';

/**
 * Display all service projects.
 */
export const projectsPage = async (req, res) => {
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
};