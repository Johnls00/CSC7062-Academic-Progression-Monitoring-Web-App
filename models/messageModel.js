const connection = require("../config/config");
const userModel = require("../models/userModel");

async function getAllStudentMessagesForAdmin() {
  const admin_user_ids = await userModel.getAllAdminUserIds();

  let allMessages = [];

  for (const admin_id of admin_user_ids) {
    const [messages] = await connection.query(
      "SELECT * FROM `message` WHERE `recipient_user_id` = ?",
      [admin_id]
    );

    allMessages = allMessages.concat(messages);
  }
  for (const message of allMessages) {
    const messageSubject = await connection.query(
      "SELECT `subject` FROM `conversation` WHERE `conversation_id` = ?",
      message.conversation_id
    );
    console.log(messageSubject);
    message.subject = messageSubject[0][0]?.subject || "No subject";
  }

  // Order by timestamp
  allMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  return allMessages;
}

module.exports = {
  getAllStudentMessagesForAdmin,
};
