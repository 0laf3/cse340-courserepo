import pool from './db.js';
/**
 * Get all service projects along with their organization names.
 */
export const getAllProjects = async () => {
    try {
        const result = await pool.query(`
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
            ORDER BY sp.date ASC;
        `);

        return result.rows;
    } catch (error) {
        console.error("Error fetching projects:", error);
        throw error;
    }
};