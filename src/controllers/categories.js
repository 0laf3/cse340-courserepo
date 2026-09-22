import {
    getAllCategories,
    getCategoryDetails,
    getProjectsByCategoryId
} from "../models/categories.js"

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