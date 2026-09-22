import {
    getUpcomingProjects,
    getProjectDetails
} from "../models/projects.js"

const NUMBER_OF_UPCOMING_PROJECTS = 5

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