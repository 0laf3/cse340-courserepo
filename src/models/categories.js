import pool from './db.js';

export const getAllCategories = async () => {
    try {
        const result = await pool.query(`
            SELECT category_id, name
            FROM categories
            ORDER BY name ASC;
        `);

        return result.rows;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
};