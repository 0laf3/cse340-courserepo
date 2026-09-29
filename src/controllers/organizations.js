import {
    body,
    validationResult
} from "express-validator";

import {
    getAllOrganizations,
    getOrganizationDetails,
    createOrganization,
    updateOrganization
} from "../models/organizations.js";

import {
    getProjectsByOrganizationId
} from "../models/projects.js";

// ========================================
// Organization validation rules
// ========================================

export const organizationValidation = [

    // ========================================
    // Organization name
    // ========================================

    body("name")
        .trim()
        .escape()
        .notEmpty()
        .withMessage(
            "Organization name is required"
        )
        .isLength({
            min: 3,
            max: 150
        })
        .withMessage(
            "Organization name must be between 3 and 150 characters"
        ),

    // ========================================
    // Organization description
    // ========================================

    body("description")
        .trim()
        .escape()
        .notEmpty()
        .withMessage(
            "Organization description is required"
        )
        .isLength({
            max: 500
        })
        .withMessage(
            "Organization description cannot exceed 500 characters"
        ),

    // ========================================
    // Contact email
    // ========================================

    body("contactEmail")
        .trim()
        .normalizeEmail()
        .notEmpty()
        .withMessage(
            "Contact email is required"
        )
        .isEmail()
        .withMessage(
            "Please provide a valid email address"
        )
];

// ========================================
// Edit organization validation rules
// ========================================

export const organizationEditValidation = [

    // Use the same validation rules as the
    // new organization form.
    ...organizationValidation,

    // ========================================
    // Logo filename
    // ========================================

    body("logoFilename")
        .trim()
        .escape()
        .notEmpty()
        .withMessage(
            "Logo filename is required"
        )
        .isLength({
            max: 255
        })
        .withMessage(
            "Logo filename cannot exceed 255 characters"
        )
];

// ========================================
// Display all organizations
// ========================================

export async function showOrganizationsPage(
    req,
    res
) {
    try {

        const organizations =
            await getAllOrganizations();

        res.render(
            "organizations",
            {
                title: "Partner Organizations",
                organizations
            }
        );

    } catch (error) {

        console.error(
            "Error displaying organizations page:",
            error
        );

        res.status(500).render(
            "500",
            {
                title: "Server Error"
            }
        );
    }
}

// ========================================
// Display organization details
// ========================================

export async function showOrganizationDetailsPage(
    req,
    res
) {
    try {

        const id = req.params.id;

        const organization =
            await getOrganizationDetails(id);

        // Organization does not exist
        if (!organization) {

            return res.status(404).render(
                "404",
                {
                    title: "Organization Not Found"
                }
            );
        }

        const projects =
            await getProjectsByOrganizationId(id);

        res.render(
            "organization",
            {
                title: organization.name,
                organization,
                projects
            }
        );

    } catch (error) {

        console.error(
            "Error displaying organization details:",
            error
        );

        res.status(500).render(
            "500",
            {
                title: "Server Error"
            }
        );
    }
}

// ========================================
// Display new organization form
// ========================================

export async function showNewOrganizationForm(
    req,
    res
) {

    res.render(
        "new-organization",
        {
            title: "Add New Organization"
        }
    );
}

// ========================================
// Process new organization form
// ========================================

export async function processNewOrganizationForm(
    req,
    res
) {

    // ========================================
    // Check validation results
    // ========================================

    const results = validationResult(req);

    // ========================================
    // Validation failed
    // ========================================

    if (!results.isEmpty()) {

        results.array().forEach((error) => {

            req.flash(
                "error",
                error.msg
            );

        });

        return res.redirect(
            "/new-organization"
        );
    }

    // ========================================
    // Validation passed
    // ========================================

    try {

        const {
            name,
            description,
            contactEmail
        } = req.body;

        // ========================================
        // Placeholder logo
        // ========================================

        const logoFilename =
            "placeholder-logo.png";

        // ========================================
        // Create organization
        // ========================================

        const organizationId =
            await createOrganization(
                name,
                description,
                contactEmail,
                logoFilename
            );

        // ========================================
        // Success message
        // ========================================

        req.flash(
            "success",
            "Organization added successfully!"
        );

        // ========================================
        // Redirect to organization
        // ========================================

        return res.redirect(
            `/organization/${organizationId}`
        );

    } catch (error) {

        console.error(
            "Error creating organization:",
            error
        );

        req.flash(
            "error",
            "There was a problem adding the organization."
        );

        return res.status(500).render(
            "new-organization",
            {
                title: "Add New Organization"
            }
        );
    }
}

// ========================================
// Display edit organization form
// ========================================

export async function showEditOrganizationForm(
    req,
    res
) {
    try {

        // Get organization ID from URL
        const id = req.params.id;

        // Get organization from database
        const organizationDetails =
            await getOrganizationDetails(id);

        // Organization does not exist
        if (!organizationDetails) {

            return res.status(404).render(
                "404",
                {
                    title: "Organization Not Found"
                }
            );
        }

        // Display edit form
        res.render(
            "edit-organization",
            {
                title: "Edit Organization",
                organizationDetails
            }
        );

    } catch (error) {

        console.error(
            "Error displaying edit organization form:",
            error
        );

        res.status(500).render(
            "500",
            {
                title: "Server Error"
            }
        );
    }
}

// ========================================
// Process edit organization form
// ========================================

export async function processEditOrganizationForm(
    req,
    res
) {

    // Get organization ID from URL
    const organizationId = req.params.id;

    // Check validation results
    const results = validationResult(req);

    // ========================================
    // Validation failed
    // ========================================

    if (!results.isEmpty()) {

        results.array().forEach((error) => {

            req.flash(
                "error",
                error.msg
            );

        });

        return res.redirect(
            `/edit-organization/${organizationId}`
        );
    }

    // ========================================
    // Validation passed
    // ========================================

    try {

        const {
            name,
            description,
            contactEmail,
            logoFilename
        } = req.body;

        // Update organization
        await updateOrganization(
            organizationId,
            name,
            description,
            contactEmail,
            logoFilename
        );

        // Success message
        req.flash(
            "success",
            "Organization updated successfully!"
        );

        // Return to organization details
        return res.redirect(
            `/organization/${organizationId}`
        );

    } catch (error) {

        console.error(
            "Error updating organization:",
            error
        );

        req.flash(
            "error",
            "There was a problem updating the organization."
        );

        return res.redirect(
            `/edit-organization/${organizationId}`
        );
    }
}