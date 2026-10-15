import pool from "./db.js";
import bcrypt from "bcrypt";

/**
 * Create a new user.
 * New registrations receive the "user" role.
 */
export const createUser = async (name, email, password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO users (
                name,
                email,
                password_hash,
                role_id
            )
            VALUES (
                $1,
                $2,
                $3,
                (SELECT role_id FROM roles WHERE role_name = 'user')
            )
            RETURNING user_id, name, email`,
            [name, email, passwordHash]
        );

        return result.rows[0];
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};

/**
 * Find a user by email.
 * Includes the user's role for authentication.
 */
const findUserByEmail = async (email) => {
    try {
        const result = await pool.query(
            `SELECT
                u.user_id,
                u.name,
                u.email,
                u.password_hash,
                r.role_name
            FROM users AS u
            JOIN roles AS r
                ON u.role_id = r.role_id
            WHERE u.email = $1`,
            [email]
        );

        return result.rows[0];
    } catch (error) {
        console.error("Error finding user:", error);
        throw error;
    }
};

/**
 * Authenticate a user using their email and password.
 */
export const authenticateUser = async (email, password) => {
    try {
        const normalizedEmail = email.trim().toLowerCase();
        const user = await findUserByEmail(normalizedEmail);

        if (!user) {
            return null;
        }

        const passwordMatches = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordMatches) {
            return null;
        }

        const {
            password_hash,
            ...safeUser
        } = user;

        return safeUser;
    } catch (error) {
        console.error("Error authenticating user:", error);
        throw error;
    }
};

/**
 * Retrieve all registered users and their roles.
 */
export const getAllUsers = async () => {
    try {
        const result = await pool.query(
            `SELECT
                u.user_id,
                u.name,
                u.email,
                r.role_name
            FROM users AS u
            JOIN roles AS r
                ON u.role_id = r.role_id
            ORDER BY u.name ASC`
        );

        return result.rows;
    } catch (error) {
        console.error("Error retrieving users:", error);
        throw error;
    }
};
