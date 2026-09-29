import {
    body,
    validationResult
} from "express-validator"

import {
    getUpcomingProjects,
    getProjectDetails,
    createProject
} from "../models/projects.js"

import {
    getAllOrganizations
} from "../models/organizations.js"

const NUMBER_OF_UPCOMING_PROJECTS = 5

/**
 * Validation rules for creating a new service project.
 */
export const projectValidation = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ min: 3, max: 200 })
        .withMessage(
            "Title must be between 3 and 200 characters"
        ),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required")
        .isLength({ max: 1000 })
        .withMessage(
            "Description must be less than 1000 characters"
        ),

    body("location")
        .trim()
        .notEmpty()
        .withMessage("Location is required")
        .isLength({ max: 200 })
        .withMessage(
            "Location must be less than 200 characters"
        ),

    body("date")
        .notEmpty()
        .withMessage("Date is required")
        .isISO8601()
        .withMessage("Date must be a valid date format"),

    body("organizationId")
        .notEmpty()
        .withMessage("Organization is required")
        .isInt()
        .withMessage(
            "Organization must be a valid integer"
        )
]

/**
 * Display the five next upcoming service projects.
 */
export async function showProjectsPage(req, res) {
    try {
        const projects = await getUpcomingProjects(
            NUMBER_OF_UPCOMING_PROJECTS
        )

        res.render("projects", {
            title: "Upcoming Service Projects",
            projects
        })
    } catch (error) {
        console.error("Error displaying projects page:", error)

        res.status(500).render("500", {
            title: "Server Error"
        })
    }
}

/**
 * Display the details of one service project.
 */
export async function showProjectDetailsPage(req, res) {
    try {
        const id = req.params.id

        const project = await getProjectDetails(id)

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
        console.error("Error displaying project details:", error)

        res.status(500).render("500", {
            title: "Server Error"
        })
    }
}

/**
 * Display the form for creating a new service project.
 */
export async function showNewProjectForm(req, res, next) {
    try {
        const organizations = await getAllOrganizations()

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
 * Process the new service project form.
 */
export async function processNewProjectForm(req, res) {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash("error", error.msg)
        })

        return res.redirect("/new-project")
    }

    const {
        title,
        description,
        location,
        date,
        organizationId
    } = req.body

    try {
        const newProjectId = await createProject(
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

        return res.redirect("/new-project")
    }
}