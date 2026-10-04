import {
    body,
    validationResult
} from "express-validator"

import {
    getUpcomingProjects,
    getProjectDetails,
    createProject,
    updateProject
} from "../models/projects.js"

import {
    getAllOrganizations
} from "../models/organizations.js"

const NUMBER_OF_UPCOMING_PROJECTS = 5

/**
 * Validation rules for creating and editing projects.
 */
export const projectValidation = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isLength({
            min: 3,
            max: 200
        })
        .withMessage(
            "Title must be between 3 and 200 characters"
        ),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required")
        .isLength({
            max: 1000
        })
        .withMessage(
            "Description must be less than 1000 characters"
        ),

    body("location")
        .trim()
        .notEmpty()
        .withMessage("Location is required")
        .isLength({
            max: 200
        })
        .withMessage(
            "Location must be less than 200 characters"
        ),

    body("date")
        .notEmpty()
        .withMessage("Date is required")
        .isISO8601()
        .withMessage(
            "Date must be a valid date format"
        ),

    body("organizationId")
        .notEmpty()
        .withMessage("Organization is required")
        .isInt()
        .withMessage(
            "Organization must be a valid integer"
        )
]

/**
 * Display upcoming service projects.
 */
export const showProjectsPage = async (
    req,
    res
) => {
    try {
        const projects =
            await getUpcomingProjects(
                NUMBER_OF_UPCOMING_PROJECTS
            )

        res.render("projects", {
            title: "Upcoming Service Projects",
            projects
        })
    } catch (error) {
        console.error(
            "Error displaying projects page:",
            error
        )

        res.status(500).render("500", {
            title: "Server Error"
        })
    }
}

/**
 * Display the details of one service project.
 */
export const showProjectDetailsPage = async (
    req,
    res
) => {
    try {
        const id = req.params.id

        const project =
            await getProjectDetails(id)

        if (!project) {
            return res.status(404).render("404", {
                title: "Project Not Found"
            })
        }

        res.render("project", {
            title: project.title,
            project
        })
    } catch (error) {
        console.error(
            "Error displaying project details:",
            error
        )

        res.status(500).render("500", {
            title: "Server Error"
        })
    }
}

/**
 * Display the New Project form.
 */
export const showNewProjectForm = async (
    req,
    res,
    next
) => {
    try {
        const organizations =
            await getAllOrganizations()

        res.render("new-project", {
            title: "Add New Service Project",
            organizations
        })
    } catch (error) {
        console.error(
            "Error loading new project form:",
            error
        )

        next(error)
    }
}

/**
 * Process the New Project form.
 */
export const processNewProjectForm = async (
    req,
    res
) => {
    const errors = validationResult(req)

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
            "/new-project"
        )
    }

    const {
        title,
        description,
        location,
        date,
        organizationId
    } = req.body

    try {
        const newProjectId =
            await createProject(
                title,
                description,
                location,
                date,
                organizationId
            )

        req.flash(
            "success",
            "New service project created successfully!"
        )

        return res.redirect(
            `/project/${newProjectId}`
        )
    } catch (error) {
        console.error(
            "Error creating new project:",
            error
        )

        req.flash(
            "error",
            "There was an error creating the service project."
        )

        return res.redirect(
            "/new-project"
        )
    }
}

/**
 * Display the Edit Project form.
 */
export const showEditProjectForm = async (
    req,
    res,
    next
) => {
    try {
        const projectId =
            req.params.id

        /**
         * Get the existing project.
         */
        const project =
            await getProjectDetails(
                projectId
            )

        /**
         * Check whether the project exists.
         */
        if (!project) {
            return res.status(404).render(
                "404",
                {
                    title: "Project Not Found"
                }
            )
        }

        /**
         * Get all organizations for
         * the organization dropdown.
         */
        const organizations =
            await getAllOrganizations()

        /**
         * Render the edit form.
         */
        res.render(
            "edit-project",
            {
                title: "Edit Service Project",
                project,
                organizations
            }
        )
    } catch (error) {
        console.error(
            "Error loading edit project form:",
            error
        )

        next(error)
    }
}

/**
 * Process the Edit Project form.
 */
export const processEditProjectForm = async (
    req,
    res
) => {
    const errors = validationResult(req)

    /**
     * Check validation errors.
     */
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
            `/edit-project/${req.params.id}`
        )
    }

    const projectId =
        req.params.id

    const {
        title,
        description,
        location,
        date,
        organizationId
    } = req.body

    try {
        /**
         * Update the project in the database.
         */
        const updatedProjectId =
            await updateProject(
                projectId,
                title,
                description,
                location,
                date,
                organizationId
            )

        /**
         * Show success message.
         */
        req.flash(
            "success",
            "Service project updated successfully!"
        )

        /**
         * Redirect to the project details page.
         */
        return res.redirect(
            `/project/${updatedProjectId}`
        )
    } catch (error) {
        console.error(
            "Error updating service project:",
            error
        )

        req.flash(
            "error",
            "There was an error updating the service project."
        )

        return res.redirect(
            `/edit-project/${projectId}`
        )
    }
}