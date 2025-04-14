const connection = require("../config/config");


async function getAllNotifications() {

    const [allNotifications] = await connection.query("SELECT * FROM `notification`");
    
    // Order by timestamp in decending order
    allNotifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return allNotifications;
    
}

module.exports = {
    getAllNotifications,
};