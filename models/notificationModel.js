const connection = require("../config/config");


async function getAllNotifications() {

    const [allNotifications] = await connection.query("SELECT * FROM `notification`");
    
    // Order by timestamp
    allNotifications.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    return allNotifications;
    
}

module.exports = {
    getAllNotifications,
};