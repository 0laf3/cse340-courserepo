import pool from "./db.js";

/**
 * Get all organizations.
 */
export async function getAllOrganizations() {
    try {
        const result = await pool.query(`
            SELECT
                organization_id,
                name,
                description,
                contact_email,
                logo_filename
            FROM organizations
            ORDER BY name ASC
        `);

        return result.rows;

    } catch (error) {

        console.error(
            "Error fetching organizations:",
            error
        );

        throw error;
    }
}

/**
 * Get the details of one organization.
 */
export async function getOrganizationDetails(id) {
    try {

        const result = await pool.query(
            `
            SELECT
                organization_id,
                name,
                description,
                contact_email,
                logo_filename
            FROM organizations
            WHERE organization_id = $1
            `,
            [id]
        );

        return result.rows[0];

    } catch (error) {

        console.error(
            "Error fetching organization details:",
            error
        );

        throw error;
    }
}

/**
 * Create a new organization in the database.
 *
 * @param {string} name
 * @param {string} description
 * @param {string} contactEmail
 * @param {string} logoFilename
 * @returns {number} The ID of the newly created organization.
 */
export async function createOrganization(
    name,
    description,
    contactEmail,
    logoFilename
) {

    const result = await pool.query(
        `
        INSERT INTO organizations
            (
                name,
                description,
                contact_email,
                logo_filename
            )
        VALUES
            ($1, $2, $3, $4)
        RETURNING organization_id
        `,
        [
            name,
            description,
            contactEmail,
            logoFilename
        ]
    );

    if (result.rows.length === 0) {
        throw new Error(
            "Failed to create organization"
        );
    }

    if (
        process.env.ENABLE_SQL_LOGGING === "true"
    ) {

        console.log(
            "Created new organization with ID:",
            result.rows[0].organization_id
        );
    }

    return result.rows[0].organization_id;
}

/**
 * Update an existing organization.
 *
 * @param {number|string} organizationId
 * @param {string} name
 * @param {string} description
 * @param {string} contactEmail
 * @param {string} logoFilename
 * @returns {number} The updated organization ID.
 */
export async function updateOrganization(
    organizationId,
    name,
    description,
    contactEmail,
    logoFilename
) {

    try {

        const result = await pool.query(
            `
            UPDATE organizations
            SET
                name = $1,
                description = $2,
                contact_email = $3,
                logo_filename = $4
            WHERE organization_id = $5
            RETURNING organization_id
            `,
            [
                name,
                description,
                contactEmail,
                logoFilename,
                organizationId
            ]
        );

        // No organization was updated
        if (result.rows.length === 0) {

            throw new Error(
                "Organization not found"
            );
        }

        if (
            process.env.ENABLE_SQL_LOGGING === "true"
        ) {

            console.log(
                "Updated organization with ID:",
                result.rows[0].organization_id
            );
        }

        return result.rows[0].organization_id;

    } catch (error) {

        console.error(
            "Error updating organization:",
            error
        );

        throw error;
    }
}