import db from './db.js';

/**
 * Get all service projects along with their organization names.
 */
const getAllProjects = async () => {
    const query = `
        SELECT
            sp.project_id,
            sp.title,
            sp.organization_id,
            o.name AS organization_name,
            sp.description,
            sp.location,
            sp.date
        FROM service_project AS sp
        JOIN organizations AS o
            ON sp.organization_id = o.organization_id
        ORDER BY sp.date;
    `;

    const result = await db.query(query);

    return result.rows;
};

/**
 * Get all service projects associated with a specific organization.
 */
const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
        SELECT
            project_id,
            organization_id,
            title,
            description,
            location,
            date
        FROM service_project
        WHERE organization_id = $1
        ORDER BY date;
    `;

    const queryParams = [organizationId];

    const result = await db.query(query, queryParams);

    return result.rows;
};

// Export the model functions
export {
    getAllProjects,
    getProjectsByOrganizationId
};