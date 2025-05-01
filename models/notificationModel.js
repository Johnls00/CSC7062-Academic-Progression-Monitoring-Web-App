// models/notificatonModel.js
// required models
const connection = require("../config/config");

/**
 * Retrieves all notifications from the database and sorts them by timestamp in descending order.
 *
 * @function
 * @memberof module:notificationModel
 * @returns {Promise<Array>} An array of all notification objects sorted by timestamp.
 *
 * @throws Will throw an error if the database query fails.
 */
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

/**
 * Retrieves notifications for a specific user by joining user-notification associations and full notification records.
 * The results are sorted by timestamp in descending order.
 *
 * @function
 * @memberof module:notificationModel
 * @param {number} userId - The ID of the user to retrieve notifications for.
 * @returns {Promise<Array>} An array of notification objects for the user.
 *
 * @throws Will throw an error if the database queries fail.
 */
async function getUserNotifications(userId) {
    let allNotifications = [];

    const [allNotificationIds] = await connection.query(
    "SELECT `notification_id` FROM `user_notifications` WHERE `user_id` = ?",
    [userId]);

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
