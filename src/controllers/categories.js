import {
    body,
    validationResult
} from "express-validator"

import {
    getAllCategories,
    getCategoryDetails,
    createCategory,
    updateCategory,
    getProjectsByCategoryId,
    getCategoriesByServiceProjectId,
    updateCategoryAssignments
} from "../models/categories.js"

import {
    getProjectDetails
} from "../models/projects.js"

// ========================================
// Category Validation
// ========================================

export const categoryValidation = [
    body("name")
        .trim()
        .escape()
        .notEmpty()
        .withMessage(
            "Category name is required"
        )
        .isLength({
            min: 3,
            max: 100
        })
        .withMessage(
            "Category name must be between 3 and 100 characters"
        )
]

// ========================================
// Display Categories
// ========================================

/**
 * Display all categories.
 */
export const categoriesPage = async (
    req,
    res
) => {
    try {
        const categories =
            await getAllCategories()

        res.render(
            "categories",
            {
                title:
                    "Service Project Categories",
                categories
            }
        )
    } catch (error) {
        console.error(
            "Error displaying categories page:",
            error
        )

        res.status(500).render(
            "500",
            {
                title:
                    "Server Error"
            }
        )
    }
}

/**
 * Display the details of one category
 * and all service projects associated
 * with it.
 */
export const categoryDetailsPage = async (
    req,
    res
) => {
    try {
        const id =
            req.params.id

        const category =
            await getCategoryDetails(id)

        if (!category) {
            return res
                .status(404)
                .render(
                    "404",
                    {
                        title:
                            "Category Not Found"
                    }
                )
        }

        const projects =
            await getProjectsByCategoryId(id)

        res.render(
            "category",
            {
                title:
                    category.name,
                category,
                projects
            }
        )
    } catch (error) {
        console.error(
            "Error displaying category details:",
            error
        )

        res.status(500).render(
            "500",
            {
                title:
                    "Server Error"
            }
        )
    }
}

// ========================================
// Create Category
// ========================================

/**
 * Display the form for creating
 * a new category.
 */
export const showNewCategoryForm = (
    req,
    res
) => {
    res.render(
        "new-category",
        {
            title:
                "Add New Category"
        }
    )
}

/**
 * Process the create category form.
 */
export const processNewCategoryForm = async (
    req,
    res
) => {
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
            "/new-category"
        )
    }

    const {
        name
    } = req.body

    try {
        const categoryId =
            await createCategory(
                name
            )

        req.flash(
            "success",
            "Category created successfully!"
        )

        return res.redirect(
            `/category/${categoryId}`
        )
    } catch (error) {
        console.error(
            "Error creating category:",
            error
        )

        req.flash(
            "error",
            "There was an error creating the category."
        )

        return res.redirect(
            "/new-category"
        )
    }
}

// ========================================
// Edit Category
// ========================================

/**
 * Display the edit category form.
 */
export const showEditCategoryForm = async (
    req,
    res
) => {
    try {
        const categoryId =
            req.params.id

        const category =
            await getCategoryDetails(
                categoryId
            )

        if (!category) {
            return res
                .status(404)
                .render(
                    "404",
                    {
                        title:
                            "Category Not Found"
                    }
                )
        }

        res.render(
            "edit-category",
            {
                title:
                    "Edit Category",
                category
            }
        )
    } catch (error) {
        console.error(
            "Error loading edit category form:",
            error
        )

        res.status(500).render(
            "500",
            {
                title:
                    "Server Error"
            }
        )
    }
}

/**
 * Process the edit category form.
 */
export const processEditCategoryForm = async (
    req,
    res
) => {
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
            `/edit-category/${req.params.id}`
        )
    }

    const categoryId =
        req.params.id

    const {
        name
    } = req.body

    try {
        const updatedCategoryId =
            await updateCategory(
                categoryId,
                name
            )

        req.flash(
            "success",
            "Category updated successfully!"
        )

        return res.redirect(
            `/category/${updatedCategoryId}`
        )
    } catch (error) {
        console.error(
            "Error updating category:",
            error
        )

        req.flash(
            "error",
            "There was an error updating the category."
        )

        return res.redirect(
            `/edit-category/${categoryId}`
        )
    }
}

// ========================================
// Assign Categories to Project
// ========================================

/**
 * Display the form for assigning
 * categories to a project.
 */
export const showAssignCategoriesForm = async (
    req,
    res,
    next
) => {
    try {
        const projectId =
            req.params.projectId

        const projectDetails =
            await getProjectDetails(
                projectId
            )

        if (!projectDetails) {
            return res
                .status(404)
                .render(
                    "404",
                    {
                        title:
                            "Project Not Found"
                    }
                )
        }

        const categories =
            await getAllCategories()

        const assignedCategories =
            await getCategoriesByServiceProjectId(
                projectId
            )

        const title =
            "Assign Categories to Project"

        res.render(
            "assign-categories",
            {
                title,
                projectId,
                projectDetails,
                categories,
                assignedCategories
            }
        )
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
export const processAssignCategoriesForm = async (
    req,
    res
) => {
    try {
        const projectId =
            req.params.projectId

        let selectedCategoryIds =
            req.body.categoryIds || []

        // Ensure selectedCategoryIds
        // is always an array.
        if (
            !Array.isArray(
                selectedCategoryIds
            )
        ) {
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