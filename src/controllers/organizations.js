import {
    getAllOrganizations,
    getOrganizationDetails,
    createOrganization
} from "../models/organizations.js"

import { getProjectsByOrganizationId } from "../models/projects.js"

/**
 * Display all organizations.
 */
export async function showOrganizationsPage(req, res) {
    try {
        const organizations = await getAllOrganizations()

        res.render("organizations", {
            title: "Partner Organizations",
            organizations
        })
    } catch (error) {
        console.error("Error displaying organizations page:", error)

        res.status(500).render("500", {
            title: "Server Error"
        })
    }
}

/**
 * Display the details of one organization
 * and all projects belonging to that organization.
 */
export async function showOrganizationDetailsPage(req, res) {
    try {
        const id = req.params.id

        const organization = await getOrganizationDetails(id)

        if (!organization) {
            return res.status(404).render("404", {
                title: "Organization Not Found"
            })
        }

        const projects = await getProjectsByOrganizationId(id)

        res.render("organization", {
            title: organization.name,
            organization,
            projects
        })
    } catch (error) {
        console.error(
            "Error displaying organization details:",
            error
        )

        res.status(500).render("500", {
            title: "Server Error"
        })
    }
}

/**
 * Display the new organization form.
 */
export async function showNewOrganizationForm(req, res) {
    const title = "Add New Organization"

    res.render("new-organization", {
        title
    })
}

/**
 * Process the new organization form.
 */
export async function processNewOrganizationForm(req, res) {
    const {
        name,
        description,
        contactEmail
    } = req.body

    // Use a placeholder logo until logo upload is added later.
    const logoFilename = "placeholder-logo.png"

    const organizationId = await createOrganization(
        name,
        description,
        contactEmail,
        logoFilename
    )

    res.redirect(`/organization/${organizationId}`)
}