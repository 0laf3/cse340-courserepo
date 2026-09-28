/**
 * Flash Message Middleware
 *
 * Provides temporary message storage that survives redirects
 * but is consumed when retrieved by a template.
 *
 * Supported message types:
 * - success
 * - error
 * - warning
 * - info
 */

/**
 * Initialize flash message storage and provide
 * the req.flash() function.
 */
const flashMiddleware = (req, res, next) => {
    /**
     * req.flash() can be used in three ways:
     *
     * req.flash("success", "Message")
     *     -> Store a message.
     *
     * req.flash("success")
     *     -> Retrieve and clear success messages.
     *
     * req.flash()
     *     -> Retrieve and clear all messages.
     */
    req.flash = function (type, message) {

        // Initialize flash storage if it does not exist.
        if (!req.session.flash) {
            req.session.flash = {
                success: [],
                error: [],
                warning: [],
                info: []
            }
        }

        // SET MESSAGE
        // Two arguments means we are storing a message.
        if (type && message) {

            // Create the message type if it does not exist.
            if (!req.session.flash[type]) {
                req.session.flash[type] = []
            }

            // Add the message.
            req.session.flash[type].push(message)

            return
        }

        // GET MESSAGES OF ONE TYPE
        // One argument means retrieve messages of that type.
        if (type && !message) {

            const messages = req.session.flash[type] || []

            // Clear the messages after retrieving them.
            req.session.flash[type] = []

            return messages
        }

        // GET ALL MESSAGES
        // No arguments means retrieve every message type.
        const allMessages = req.session.flash

        // Clear all messages after retrieving them.
        req.session.flash = {
            success: [],
            error: [],
            warning: [],
            info: []
        }

        return allMessages
    }

    next()
}

/**
 * Make the flash function available to EJS templates.
 */
const flashLocals = (req, res, next) => {
    res.locals.flash = req.flash

    next()
}

/**
 * Combined flash middleware.
 *
 * flashMiddleware must run before flashLocals.
 */
const flash = (req, res, next) => {
    flashMiddleware(req, res, () => {
        flashLocals(req, res, next)
    })
}

export default flash