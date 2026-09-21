import {
    getUpcomingProjects,
    getProjectDetails
} from "../models/projects.js"


const NUMBER_OF_UPCOMING_PROJECTS = 5


/**
 * Display the upcoming service projects page.
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

        res.status(500).send("Unable to display projects.")
    }
}


/**
 * Display the details of a single service project.
 */
export async function showProjectDetailsPage(req, res) {
    try {
        const id = req.params.id

        const project = await getProjectDetails(id)

        res.render("project", {
            title: project.title,
            project
        })
    } catch (error) {
        console.error("Error displaying project details:", error)

        res.status(500).send("Unable to display project details.")
    }
}