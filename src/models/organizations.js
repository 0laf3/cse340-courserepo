import pool from './db.js';

export async function getAllOrganizations() {
    const result = await pool.query(`
        SELECT
            organization_id,
            name,
            description,
            contact_email,
            logo_filename
        FROM public.organizations;
    `);

    return result.rows;
}