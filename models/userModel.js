// models/userModel
// required models
const connection = require('../config/config');
const bcrypt = require("bcryptjs");

/**
 * Retrieves user IDs of all users with the 'Admin' role.
 *
 * @function
 * @memberof module:userModel
 * @returns {Promise<Array<number>>} Array of admin user IDs.
 *
 * @throws Will throw an error if the database query fails.
 */
async function getAllAdminUserIds() {
    try {
        const [results] = await connection.query(
            "SELECT `user_id` FROM `user` WHERE `role` = ?", 
            ["Admin"]
        );
        const adminUserIds = results.map(row => row.user_id); 
        return adminUserIds;
    } catch (err) {
        throw new Error("Failed to fetch admin User Ids");
    }
}

/**
 * Retrieves the user ID for a given email address.
 *
 * @function
 * @memberof module:userModel
 * @param {string} email - The email to look up.
 * @returns {Promise<Array>} Query result containing user ID.
 *
 * @throws Will throw an error if the database query fails.
 */
async function getUserIdWithEmail(email) {
    try {
        const user_id = await connection.query(
            "SELECT `user_id` FROM `user` WHERE `email` = ?", 
            email
        );
        return user_id;
    } catch (err) {
        throw new Error("Failed to fetch User Ids");
    }
}

/**
 * Retrieves the full user record using a user ID.
 *
 * @function
 * @memberof module:userModel
 * @param {number} userId - The ID of the user to retrieve.
 * @returns {Promise<Array>} Array containing the user record.
 *
 * @throws Will throw an error if the database query fails.
 */
async function getUserWithUserId(userId) {
    try {
        const [user] = await connection.query("SELECT * FROM `user` WHERE `user_id` = ?", userId);
        return user;
    } catch {
        throw new Error("Failed to fetch user");
    }
}

/**
 * Creates a new user with a hashed password and a unique email if needed.
 *
 * @function
 * @memberof module:userModel
 * @param {Object} param0 - Object containing baseEmail, password, and role.
 * @param {string} param0.baseEmail - The base email to try.
 * @param {string} param0.password - The plain-text password.
 * @param {string} param0.role - The role of the new user (e.g. Admin, Student).
 * @returns {Promise<Object>} The newly created user's ID.
 *
 * @throws Will throw an error if email generation or insert fails.
 */
async function createUser({baseEmail, password, role}) {
    try {
        
        const email = await generateUniqueEmail(baseEmail);
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [newUser] = await connection.query(
            "INSERT INTO `user`(`email`, `password`, `salt`, `role`) VALUES (?, ?, ?, ?)",
            [email, hashedPassword, salt, role]
        );
        return {user_id: newUser.insertId};
    } catch (err) {
        throw new Error("Failed to create user: " + err.message);
    }
}

/**
 * Generates a unique email address by appending an incrementing number if needed.
 *
 * @function
 * @memberof module:userModel
 * @param {string} baseEmail - The base email to start with.
 * @returns {Promise<string>} A unique email address.
 *
 * @throws Will throw an error if checking email availability fails.
 */
async function generateUniqueEmail(baseEmail) {
    let email = baseEmail;
    let counter = 1;
  
    // loops through email possiblities until one is free
    while (true) {
        const [rows] = await getUserIdWithEmail(email);
        if (rows.length === 0) break; // breaks if the email is available
    
        const [firstPart, domain] = baseEmail.split("@");
        email = `${firstPart}${counter}@${domain}`;
        counter++;
      }
    
      return email;
  }

module.exports = {
    getAllAdminUserIds,
    getUserIdWithEmail,
    getUserWithUserId,
    createUser,
    generateUniqueEmail,
}