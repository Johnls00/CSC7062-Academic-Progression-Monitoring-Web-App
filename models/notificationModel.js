const connection = require("../config/config");

async function getAllNotifications() {
  const [allNotifications] = await connection.query(
    "SELECT * FROM `notification`"
  );

  // Order by timestamp in decending order
  allNotifications.sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );
  return allNotifications;
}

async function getUserNotifications(userId) {
    let allNotifications = [];

    const [allNotificationIds] = await connection.query(
    "SELECT `notification_id` FROM `user_notifications` WHERE `user_id` = ?",
    [userId]);

    console.log("notification id ", allNotificationIds);

    for (const notification_id of allNotificationIds) {
        const [notifications] = await connection.query("SELECT * FROM `notification` WHERE `notification_id` = ?",
            [notification_id.notification_id]
        );
        allNotifications = allNotifications.concat(notifications);
    }

    // Order by timestamp in decending order
    allNotifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    console.log(allNotifications);
    return allNotifications;
}

module.exports = {
  getAllNotifications,
  getUserNotifications,
};
