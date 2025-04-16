const connection = require('../config/config');
const bcrypt = require("bcryptjs");

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

async function getUserWithUserId(userId) {
    try {
        const [user] = await connection.query("SELECT * FROM `user` WHERE `user_id` = ?", userId);
        return user;
    } catch {
        throw new Error("Failed to fetch user");
    }
}

// create new user 
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