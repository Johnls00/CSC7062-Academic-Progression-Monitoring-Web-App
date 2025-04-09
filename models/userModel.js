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

module.exports = {
    getAllAdminUserIds,
}