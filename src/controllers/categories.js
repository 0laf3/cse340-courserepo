import { getAllCategories } from '../models/categories.js';

/**
 * Display all service categories.
 */
export const categoriesPage = async (req, res) => {
    const title = 'Service Categories';

    try {
        const categories = await getAllCategories();

        res.render('categories', {
            title,
            categories
        });
    } catch (error) {
        console.error('Error fetching categories:', error);

        res.status(500).send('Unable to load service categories.');
    }
};