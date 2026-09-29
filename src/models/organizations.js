import pool from "./db.js"


/**
 * Get all organizations.
 */
export async function getAllOrganizations() {
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
            ORDER BY name ASC
            `
        )

        return result.rows
    } catch (error) {
        console.error(
            "Error fetching organizations:",
            error
        )
        throw error
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
        )

        if (result.rows.length === 0) {
            return null
        }

        return result.rows[0]
    } catch (error) {
        console.error(
            "Error fetching organization details:",
            error
        )
        throw error
    }
}


/**
 * Create a new organization.
 */
export async function createOrganization(
    name,
    description,
    contactEmail,
    logoFilename
) {
    try {
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
                (
                    $1,
                    $2,
                    $3,
                    $4
                )
            RETURNING organization_id
            `,
            [
                name,
                description,
                contactEmail,
                logoFilename
            ]
        )

        if (result.rows.length === 0) {
            throw new Error(
                "Failed to create organization"
            )
        }

        return result.rows[0].organization_id
    } catch (error) {
        console.error(
            "Error creating organization:",
            error
        )
        throw error
    }
}


/**
 * Update an existing organization.
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
        )

        if (result.rows.length === 0) {
            throw new Error(
                "Failed to update organization"
            )
        }

        return result.rows[0].organization_id
    } catch (error) {
        console.error(
            "Error updating organization:",
            error
        )
        throw error
    }
}


/**
 * Delete an organization.
 *
 * The organization can only be deleted if
 * it does not have any service projects.
 */
export async function deleteOrganization(
    organizationId
) {
    try {
        /*
         * Check whether the organization has
         * any service projects.
         */
        const projectResult = await pool.query(
            `
            SELECT
                COUNT(*) AS project_count
            FROM service_project
            WHERE organization_id = $1
            `,
            [organizationId]
        )

        const projectCount =
            Number(
                projectResult.rows[0].project_count
            )

        /*
         * Do not delete an organization that
         * still has projects.
         */
        if (projectCount > 0) {
            throw new Error(
                "Cannot delete an organization that has service projects."
            )
        }

        /*
         * Delete the organization.
         */
        const result = await pool.query(
            `
            DELETE FROM organizations
            WHERE organization_id = $1
            RETURNING organization_id
            `,
            [organizationId]
        )

        /*
         * Make sure an organization was actually deleted.
         */
        if (result.rows.length === 0) {
            throw new Error(
                "Organization not found"
            )
        }

        return result.rows[0].organization_id
    } catch (error) {
        console.error(
            "Error deleting organization:",
            error
        )
        throw error
    }
}