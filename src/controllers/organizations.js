import {
    getAllOrganizations,
    getOrganizationDetails
} from '../models/organizations.js';

import {
    getProjectsByOrganizationId
} from '../models/projects.js';

/**
 * Display all organizations.
 */
export const showOrganizationsPage = async (req, res) => {
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

/**
 * Display details for a specific organization.
 */
export const showOrganizationDetailsPage = async (req, res) => {
    try {
        const organizationId = req.params.id;

        const organizationDetails =
            await getOrganizationDetails(organizationId);

        const projects =
            await getProjectsByOrganizationId(organizationId);

        const title = 'Organization Details';

        res.render('organization', {
            title,
            organizationDetails,
            projects
        });
    } catch (error) {
        console.error('Error fetching organization details:', error);
        res.status(500).send('Server Error');
    }
};