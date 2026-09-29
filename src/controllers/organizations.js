import {
    body,
    validationResult
} from "express-validator"


import {
    getAllOrganizations,
    getOrganizationDetails,
    createOrganization,
    updateOrganization,
    deleteOrganization
} from "../models/organizations.js"


/**
 * Validation rules for creating an organization.
 */
export const organizationValidation = [

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
]


/**
 * Validation rules for editing an organization.
 */
export const organizationEditValidation = [

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
]


/**
 * Display all organizations.
 */
export async function showOrganizationsPage(
    req,
    res
) {
    try {
        const organizations =
            await getAllOrganizations()

        res.render(
            "organizations",
            {
                title: "Service Organizations",
                organizations
            }
        )
    } catch (error) {
        console.error(
            "Error displaying organizations page:",
            error
        )

        res.status(500).render(
            "500",
            {
                title: "Server Error"
            }
        )
    }
}


/**
 * Display the details of one organization.
 */
export async function showOrganizationDetailsPage(
    req,
    res
) {
    try {
        const id = req.params.id

        const organization =
            await getOrganizationDetails(id)

        if (!organization) {
            return res.status(404).render(
                "404",
                {
                    title: "Organization Not Found"
                }
            )
        }

        res.render(
            "organization",
            {
                title: organization.name,
                organization
            }
        )
    } catch (error) {
        console.error(
            "Error displaying organization details:",
            error
        )

        res.status(500).render(
            "500",
            {
                title: "Server Error"
            }
        )
    }
}


/**
 * Display the New Organization form.
 */
export function showNewOrganizationForm(
    req,
    res
) {
    res.render(
        "new-organization",
        {
            title: "Add New Organization"
        }
    )
}


/**
 * Process the New Organization form.
 */
export async function processNewOrganizationForm(
    req,
    res
) {
    const errors =
        validationResult(req)

    if (!errors.isEmpty()) {

        errors.array().forEach(
            (error) => {
                req.flash(
                    "error",
                    error.msg
                )
            }
        )

        return res.redirect(
            "/new-organization"
        )
    }

    const {
        name,
        description,
        contactEmail,
        logoFilename
    } = req.body

    try {

        const organizationId =
            await createOrganization(
                name,
                description,
                contactEmail,
                logoFilename
            )

        req.flash(
            "success",
            "Organization created successfully!"
        )

        return res.redirect(
            `/organization/${organizationId}`
        )

    } catch (error) {

        console.error(
            "Error creating organization:",
            error
        )

        req.flash(
            "error",
            "There was an error creating the organization."
        )

        return res.redirect(
            "/new-organization"
        )
    }
}


/**
 * Display the Edit Organization form.
 */
export async function showEditOrganizationForm(
    req,
    res
) {
    try {

        const organizationId =
            req.params.id

        const organization =
            await getOrganizationDetails(
                organizationId
            )

        if (!organization) {
            return res.status(404).render(
                "404",
                {
                    title: "Organization Not Found"
                }
            )
        }

        res.render(
            "edit-organization",
            {
                title: "Edit Organization",
                organization
            }
        )

    } catch (error) {

        console.error(
            "Error loading edit organization form:",
            error
        )

        res.status(500).render(
            "500",
            {
                title: "Server Error"
            }
        )
    }
}


/**
 * Process the Edit Organization form.
 */
export async function processEditOrganizationForm(
    req,
    res
) {
    const errors =
        validationResult(req)

    if (!errors.isEmpty()) {

        errors.array().forEach(
            (error) => {
                req.flash(
                    "error",
                    error.msg
                )
            }
        )

        return res.redirect(
            `/edit-organization/${req.params.id}`
        )
    }

    const organizationId =
        req.params.id

    const {
        name,
        description,
        contactEmail,
        logoFilename
    } = req.body

    try {

        const updatedOrganizationId =
            await updateOrganization(
                organizationId,
                name,
                description,
                contactEmail,
                logoFilename
            )

        req.flash(
            "success",
            "Organization updated successfully!"
        )

        return res.redirect(
            `/organization/${updatedOrganizationId}`
        )

    } catch (error) {

        console.error(
            "Error updating organization:",
            error
        )

        req.flash(
            "error",
            "There was an error updating the organization."
        )

        return res.redirect(
            `/edit-organization/${organizationId}`
        )
    }
}


/**
 * Process deleting an organization.
 */
export async function processDeleteOrganization(
    req,
    res
) {
    const organizationId =
        req.params.id

    try {

        await deleteOrganization(
            organizationId
        )

        req.flash(
            "success",
            "Organization deleted successfully!"
        )

        return res.redirect(
            "/organizations"
        )

    } catch (error) {

        console.error(
            "Error deleting organization:",
            error
        )

        /*
         * If the organization has projects,
         * explain why it cannot be deleted.
         */
        if (
            error.message ===
            "Cannot delete an organization that has service projects."
        ) {
            req.flash(
                "error",
                "This organization cannot be deleted because it has service projects assigned to it."
            )
        } else if (
            error.message ===
            "Organization not found"
        ) {
            req.flash(
                "error",
                "Organization was not found."
            )
        } else {
            req.flash(
                "error",
                "There was an error deleting the organization."
            )
        }

        return res.redirect(
            "/organizations"
        )
    }
}