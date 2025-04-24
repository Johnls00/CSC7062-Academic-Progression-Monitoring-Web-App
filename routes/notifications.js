const express = require('express');
const router = express.Router();

const connection = require("../config/config");

router.post("/send-notification", async (req, res) => {
  const { cohort, subject, message } = req.body;

  if (!cohort || !subject || !message) {
    return res
      .status(400)
      .json({ message: "Subject and message are required." });
  }

  try {
    // Get student IDs first
    const [cohort_student_ids] = await connection.query(
      "SELECT `user_id` FROM `student` WHERE `sId` LIKE ?",
      [`%${cohort}%`]
    );
  
    console.log("user ids: ", cohort_student_ids);
  
    // Create the notification once
    const [newNotification] = await connection.query(
      "INSERT INTO notification (subject, content, timestamp) VALUES (?, ?, NOW())",
      [subject, message]
    );
  
    const notificationId = newNotification.insertId;
  
    // Link the notification to each student
    for (const student of cohort_student_ids) {
      await connection.query(
        "INSERT INTO `user_notifications`(`user_id`, `notification_id`) VALUES (?, ?)",
        [student.user_id, notificationId]
      );
    }
  
    res.json({ message: "Notification sent successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send notification." });
  }
});


module.exports = router;
