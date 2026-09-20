/**
 * Display the home page.
 */
export const homePage = async (req, res) => {
    const title = 'Home';

    res.render('home', { title });
};