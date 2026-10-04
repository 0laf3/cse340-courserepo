import pool from "./db.js"

/**
 * Get all service projects for a specific organization.
 */
export const getProjectsByOrganizationId = async (
    organization_id
) => {
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
        console.error(
            "Error fetching projects by organization:",
            error
        )
        throw error
    }
}

/**
 * Get the next upcoming service projects.
 *
 * The number of projects is controlled by the controller.
 */
export const getUpcomingProjects = async (
    number_of_projects
) => {
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
        console.error(
            "Error fetching upcoming projects:",
            error
        )
        throw error
    }
}

/**
 * Get the details of one service project,
 * including its organization and categories.
 */
export const getProjectDetails = async (
    id
) => {
    try {
        const projectResult = await pool.query(
            `
            SELECT
                sp.project_id,
                sp.title,
                sp.description,
                sp.location,
                sp.date,
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

        /**
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
        console.error(
            "Error fetching project details:",
            error
        )
        throw error
    }
}

/**
 * Create a new service project.
 */
export const createProject = async (
    title,
    description,
    location,
    date,
    organizationId
) => {
    try {
        const result = await pool.query(
            `
            INSERT INTO service_project
                (
                    title,
                    description,
                    location,
                    date,
                    organization_id
                )
            VALUES
                (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5
                )
            RETURNING project_id
            `,
            [
                title,
                description,
                location,
                date,
                organizationId
            ]
        )

        if (result.rows.length === 0) {
            throw new Error(
                "Failed to create project"
            )
        }

        return result.rows[0].project_id
    } catch (error) {
        console.error(
            "Error creating project:",
            error
        )
        throw error
    }
}

/**
 * Update an existing service project.
 */
export const updateProject = async (
    projectId,
    title,
    description,
    location,
    date,
    organizationId
) => {
    try {
        const result = await pool.query(
            `
            UPDATE service_project
            SET
                title = $1,
                description = $2,
                location = $3,
                date = $4,
                organization_id = $5
            WHERE project_id = $6
            RETURNING project_id
            `,
            [
                title,
                description,
                location,
                date,
                organizationId,
                projectId
            ]
        )

        if (result.rows.length === 0) {
            throw new Error(
                "Failed to update project"
            )
        }

        return result.rows[0].project_id
    } catch (error) {
        console.error(
            "Error updating project:",
            error
        )
        throw error
    }
}