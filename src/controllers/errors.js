/**
 * Generate a test 500 error.
 */
export const testError = (req, res, next) => {
    const err = new Error('This is a test error');
    err.status = 500;
    next(err);
};

/**
 * Handle requests for pages that do not exist.
 */
export const notFound = (req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
};

/**
 * Global error handler.
 */
export const errorHandler = (err, req, res, next) => {
    // Log error details for debugging
    console.error('Error occurred:', err.message);
    console.error('Stack trace:', err.stack);

    // Determine status and template
    const status = err.status || 500;
    const template = status === 404 ? '404' : '500';

    // Prepare data for the template
    const context = {
        title: status === 404 ? 'Page Not Found' : 'Server Error',
        error: err.message,
        stack: err.stack
    };

    // Render the appropriate error template
    res.status(status).render(`errors/${template}`, context);
};