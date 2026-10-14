
import pool from "./db.js";
import bcrypt from "bcrypt";

/**
 * Create a new user with the default user role.
 */
export const createUser = async (name, email, passwordHash) => {
    const defaultRole = "user";

    const query = `
        INSERT INTO users (
            name,
            email,
            password_hash,
            role_id
        )
        VALUES (
            $1,
            $2,
            $3,
            (
                SELECT role_id
                FROM roles
                WHERE role_name = $4
            )
        )
        RETURNING user_id
    `;

    const queryParams = [
        name,
        email,
        passwordHash,
        defaultRole
    ];

    const result = await pool.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error("Failed to create user.");
    }

    if (process.env.ENABLE_SQL_LOGGING === "true") {
        console.log(
            "Created new user with ID:",
            result.rows[0].user_id
        );
    }

    return result.rows[0].user_id;
};


/**
 * Find a user by email address.
 * This function is private to this model.
 */
const findUserByEmail = async (email) => {
    const query = `
        SELECT
            user_id,
            name,
            email,
            password_hash,
            role_id
        FROM users
        WHERE email = $1
    `;

    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
        return null;
    }

    return result.rows[0];
};

/**
 * Compare a plain-text password with its bcrypt hash.
 */
const verifyPassword = async (password, passwordHash) => {
    return bcrypt.compare(password, passwordHash);
};

/**
 * Authenticate a user and return safe user information.
 */
export const authenticateUser = async (email, password) => {
    const normalizedEmail = email.trim().toLowerCase();

    const user = await findUserByEmail(normalizedEmail);

    if (!user) {
        return null;
    }

    const passwordMatches = await verifyPassword(
        password,
        user.password_hash
    );

    if (!passwordMatches) {
        return null;
    }

    // Never expose the password hash to the session or views.
    const { password_hash, ...safeUser } = user;

    return safeUser;
};

