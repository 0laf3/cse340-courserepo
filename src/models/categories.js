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
        console.error("Error fetching category details:", error)
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
        console.error("Error fetching projects by category:", error)
        throw error
    }
}