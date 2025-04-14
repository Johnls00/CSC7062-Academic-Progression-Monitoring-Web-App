const connection = require('../config/config');

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

module.exports = {
    getAllAdminUserIds,
    getUserIdWithEmail,
    getUserWithUserId
}