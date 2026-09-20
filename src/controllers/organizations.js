import { getAllOrganizations } from '../models/organizations.js';

/**
 * Display all organizations.
 */
export const organizationsPage = async (req, res) => {
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
};