const connection = require("../config/config");
const userModel = require("../models/userModel");

async function getAllStudentConversationsForAdmin() {
  const admin_user_ids = await userModel.getAllAdminUserIds();

  // select all messages for the admin accounts and save to array 
  let allMessages = [];

  for (const admin_id of admin_user_ids) {
    const [messages] = await connection.query(
      "SELECT * FROM `message` WHERE `recipient_user_id` = ? OR `sender_user_id` = ?",
      [admin_id, admin_id]
    );

    allMessages = allMessages.concat(messages);
  }

  //get the conversation id for each message and link it to the message
  for (const message of allMessages) {
    const messageSubject = await connection.query(
      "SELECT `subject` FROM `conversation` WHERE `conversation_id` = ?",
      message.conversation_id
    );
    message.subject = messageSubject[0][0]?.subject || "No subject";
  }

  // Order by timestamp
  
  console.log("all messages: ", allMessages);
  //sort all messages in conversations
  const conversations = {};

  allMessages.forEach(message => {
    const conversation_id = message.conversation_id;
    if (!conversations[conversation_id]) {
      conversations[conversation_id] = [];
    }
    conversations[conversation_id].push(message);
  });

  // conversations.sort((a, b) => new Date(b[0].timestamp) - new Date(a[0].timestamp));
  
  console.log("all converstion: ", conversations);
  return conversations;
}

async function getSenderName(message_id) {
  
  
}

module.exports = {
  getAllStudentConversationsForAdmin,
};
