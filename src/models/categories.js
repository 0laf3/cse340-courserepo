import pool from "./db.js"


/**
 * Get all categories.
 */
export async function getAllCategories() {
    try {
        const result = await pool.query(`
            SELECT
                category_id,
                name
            FROM categories
            ORDER BY name ASC
        `)

        return result.rows
    } catch (error) {
        console.error("Error fetching categories:", error)
        throw error
    }
}


/**
 * Get the details of one category.
 */
export async function getCategoryDetails(id) {
    try {
        const result = await pool.query(
            `
            SELECT
                category_id,
                name
            FROM categories
            WHERE category_id = $1
            `,
            [id]
        )

        return result.rows[0]
    } catch (error) {
        console.error(
            "Error fetching category details:",
            error
        )
        throw error
    }
}


/**
 * Get all service projects that belong to a specific category.
 */
export async function getProjectsByCategoryId(id) {
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
            JOIN project_categories AS pc
                ON sp.project_id = pc.project_id
            JOIN categories AS c
                ON pc.category_id = c.category_id
            JOIN organizations AS o
                ON sp.organization_id = o.organization_id
            WHERE c.category_id = $1
            ORDER BY sp.date ASC
            `,
            [id]
        )

        return result.rows
    } catch (error) {
        console.error(
            "Error fetching projects by category:",
            error
        )
        throw error
    }
}


/**
 * Get all categories assigned to a specific service project.
 */
export async function getCategoriesByServiceProjectId(projectId) {
    try {
        const result = await pool.query(
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
            [projectId]
        )

        return result.rows
    } catch (error) {
        console.error(
            "Error fetching categories for project:",
            error
        )
        throw error
    }
}


/**
 * Assign one category to one service project.
 *
 * This function is intentionally not exported because
 * it is only used by updateCategoryAssignments().
 */
async function assignCategoryToProject(
    projectId,
    categoryId
) {
    try {
        const result = await pool.query(
            `
            INSERT INTO project_categories
                (project_id, category_id)
            VALUES
                ($1, $2)
            `,
            [projectId, categoryId]
        )

        return result
    } catch (error) {
        console.error(
            "Error assigning category to project:",
            error
        )
        throw error
    }
}


/**
 * Replace all category assignments for a service project.
 */
export async function updateCategoryAssignments(
    projectId,
    categoryIds
) {
    try {
        // Delete existing category assignments.
        await pool.query(
            `
            DELETE FROM project_categories
            WHERE project_id = $1
            `,
            [projectId]
        )

        // Add the newly selected categories.
        for (const categoryId of categoryIds) {
            await assignCategoryToProject(
                projectId,
                categoryId
            )
        }
    } catch (error) {
        console.error(
            "Error updating category assignments:",
            error
        )
        throw error
    }
}