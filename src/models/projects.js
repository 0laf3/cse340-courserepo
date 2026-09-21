import pool from "./db.js"

/**
 * Get all service projects for a specific organization.
 */
export async function getProjectsByOrganizationId(organization_id) {
    try {
        const result = await pool.query(
            `SELECT
                sp.project_id,
                sp.title,
                sp.description,
                sp.date,
                sp.location,
                sp.organization_id,
                o.name AS organization_name
            FROM service_project AS sp
            JOIN organizations AS o
                ON sp.organization_id = o.organization_id
            WHERE sp.organization_id = $1
            ORDER BY sp.date ASC`,
            [organization_id]
        )

        return result.rows
    } catch (error) {
        console.error("Error fetching projects by organization:", error)
        throw error
    }
}


/**
 * Get the next number_of_projects upcoming service projects.
 */
export async function getUpcomingProjects(number_of_projects) {
    try {
        const result = await pool.query(
            `SELECT
                sp.project_id,
                sp.title,
                sp.description,
                sp.date,
                sp.location,
                sp.organization_id,
                o.name AS organization_name
            FROM service_project AS sp
            JOIN organizations AS o
                ON sp.organization_id = o.organization_id
            WHERE sp.date >= CURRENT_TIMESTAMP
            ORDER BY sp.date ASC
            LIMIT $1`,
            [number_of_projects]
        )

        return result.rows
    } catch (error) {
        console.error("Error fetching upcoming projects:", error)
        throw error
    }
}


/**
 * Get a single service project by its ID.
 */
export async function getProjectDetails(id) {
    try {
        const result = await pool.query(
            `SELECT
                sp.project_id,
                sp.title,
                sp.description,
                sp.date,
                sp.location,
                sp.organization_id,
                o.name AS organization_name
            FROM service_project AS sp
            JOIN organizations AS o
                ON sp.organization_id = o.organization_id
            WHERE sp.project_id = $1`,
            [id]
        )

        return result.rows[0]
    } catch (error) {
        console.error("Error fetching project details:", error)
        throw error
    }
};