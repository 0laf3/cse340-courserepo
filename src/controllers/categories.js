import {
    getAllCategories,
    getCategoryDetails,
    getProjectsByCategoryId,
    getCategoriesByServiceProjectId,
    updateCategoryAssignments
} from "../models/categories.js"

import {
    getProjectDetails
} from "../models/projects.js"

/**
 * Display all categories.
 */
export async function categoriesPage(req, res) {
    try {
        const categories = await getAllCategories()

        res.render("categories", {
            title: "Service Project Categories",
            categories
        })
    } catch (error) {
        console.error("Error displaying categories page:", error)

        res.status(500).render("500", {
            title: "Server Error"
        })
    }
}

/**
 * Display the details of one category
 * and all service projects associated with it.
 */
export async function categoryDetailsPage(req, res) {
    try {
        const id = req.params.id

        const category = await getCategoryDetails(id)

        if (!category) {
            return res.status(404).render("404", {
                title: "Category Not Found"
            })
        }

        const projects = await getProjectsByCategoryId(id)

        res.render("category", {
            title: category.name,
            category,
            projects
        })
    } catch (error) {
        console.error("Error displaying category details:", error)

        res.status(500).render("500", {
            title: "Server Error"
        })
    }
}

/**
 * Display the form for assigning categories to a project.
 */
export async function showAssignCategoriesForm(
    req,
    res,
    next
) {
    try {
        const projectId = req.params.projectId

        const projectDetails =
            await getProjectDetails(projectId)

        if (!projectDetails) {
            return res.status(404).render("404", {
                title: "Project Not Found"
            })
        }

        const categories =
            await getAllCategories()

        const assignedCategories =
            await getCategoriesByServiceProjectId(
                projectId
            )

        const title =
            "Assign Categories to Project"

        res.render("assign-categories", {
            title,
            projectId,
            projectDetails,
            categories,
            assignedCategories
        })
    } catch (error) {
        console.error(
            "Error displaying assign categories form:",
            error
        )

        next(error)
    }
}

/**
 * Process the category assignment form.
 */
export async function processAssignCategoriesForm(
    req,
    res
) {
    try {
        const projectId = req.params.projectId

        let selectedCategoryIds =
            req.body.categoryIds || []

        // Ensure selectedCategoryIds is always an array.
        if (!Array.isArray(selectedCategoryIds)) {
            selectedCategoryIds = [
                selectedCategoryIds
            ]
        }

        await updateCategoryAssignments(
            projectId,
            selectedCategoryIds
        )

        req.flash(
            "success",
            "Categories updated successfully."
        )

        return res.redirect(
            `/project/${projectId}`
        )
    } catch (error) {
        console.error(
            "Error updating project categories:",
            error
        )

        req.flash(
            "error",
            "There was an error updating the project categories."
        )

        return res.redirect(
            `/project/${req.params.projectId}`
        )
    }
}