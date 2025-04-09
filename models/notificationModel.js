const connection = require("../config/config");


async function getAllNotifications() {

    const [allNotifications] = await connection.query("SELECT * FROM `notification`");
    return allNotifications;
    
}

module.exports = {
    getAllNotifications,
}