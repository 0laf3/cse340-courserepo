import db from "./db.js";
import bcrypt from "bcrypt";

// ========================================
// Create User
// ========================================
export const createUser = async (name, email, passwordHash) => {
  const query = `
    INSERT INTO users (name, email, password_hash, role_id)
    VALUES (
      $1,
      $2,
      $3,
      (SELECT role_id FROM roles WHERE role_name = $4)
    )
    RETURNING user_id
  `;

  const queryParams = [
    name.trim(),
    email.trim().toLowerCase(),
    passwordHash,
    "user"
  ];

  try {
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
      throw new Error("Failed to create user.");
    }

    return result.rows[0].user_id;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// ========================================
// Find User by Email (Private Helper)
// ========================================
const findUserByEmail = async (email) => {
  const query = `
    SELECT
      u.user_id,
      u.name,
      u.email,
      u.password_hash,
      r.role_name
    FROM users AS u
    JOIN roles AS r
      ON u.role_id = r.role_id
    WHERE u.email = $1
  `;

  const result = await db.query(query, [
    email.trim().toLowerCase()
  ]);

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
};

// ========================================
// Verify Password (Private Helper)
// ========================================
const verifyPassword = async (password, passwordHash) => {
  return bcrypt.compare(password, passwordHash);
};

// ========================================
// Authenticate User
// ========================================
export const authenticateUser = async (email, password) => {
  if (
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return null;
  }

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return null;
    }

    const passwordIsValid = await verifyPassword(
      password,
      user.password_hash
    );

    if (!passwordIsValid) {
      return null;
    }

    // Never return the password hash to the controller.
    const {
      password_hash,
      ...authenticatedUser
    } = user;

    return authenticatedUser;
  } catch (error) {
    console.error("Error authenticating user:", error);
    throw error;
  }
};

// ========================================
// Get All Registered Users
// ========================================
export const getAllUsers = async () => {
  const query = `
    SELECT
      u.user_id,
      u.name,
      u.email,
      r.role_name
    FROM users AS u
    JOIN roles AS r
      ON u.role_id = r.role_id
    ORDER BY u.name ASC
  `;

  try {
    const result = await db.query(query);
    return result.rows;
  } catch (error) {
    console.error("Error retrieving users:", error);
    throw error;
  }
};