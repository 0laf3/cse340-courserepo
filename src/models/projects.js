import pool from "./db.js"

/**
 * Get all service projects for a specific organization.
 */
export async function getProjectsByOrganizationId(organization_id) {
    try {
        const result = await pool.query(
            `
            SELECT
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
            ORDER BY sp.date ASC
            `,
            [organization_id]
        )

        return result.rows
    } catch (error) {
        console.error("Error fetching projects by organization:", error)
        throw error
    }
}

/**
 * Get the next upcoming service projects.
 *
 * The number of projects is controlled by the controller.
 */
export async function getUpcomingProjects(number_of_projects) {
    try {
        const result = await pool.query(
            `
            SELECT
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
            LIMIT $1
            `,
            [number_of_projects]
        )

        return result.rows
    } catch (error) {
        console.error("Error fetching upcoming projects:", error)
        throw error
    }
}

/**
 * Get the details of one service project,
 * including its organization and categories.
 */
export async function getProjectDetails(id) {
    try {
        const projectResult = await pool.query(
            `
            SELECT
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
            WHERE sp.project_id = $1
            `,
            [id]
        )

        if (projectResult.rows.length === 0) {
            return null
        }

        const project = projectResult.rows[0]

        /*
         * Get all categories assigned to this project.
         */
        const categoryResult = await pool.query(
            `
            SELECT
                c.category_id,
                c.name
            FROM categories AS c
            JOIN project_categories AS pc
                ON c.category_id = pc.category_id
            WHERE pc.project_id = $1
            ORDER BY c.name ASC
            `,
            [id]
        )

        project.categories = categoryResult.rows

        return project
    } catch (error) {
        console.error("Error fetching project details:", error)
        throw error
    }
}