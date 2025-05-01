// models/messageModel.js
// required models
const connection = require("../config/config");
const userModel = require("../models/userModel");

/**
 * Retrieves and organizes all messages for admin users into conversations.
 * Each conversation has sender email and subject attached and sorted by latest timestamp.
 *
 * @function
 * @memberof module:messageModel
 * @returns {Promise<Object>} A dictionary of conversations with message arrays sorted by timestamp.
 *
 * @throws Will throw an error if querying messages or related data fails.
 */
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

  for (const message of allMessages) {
    const messageSender = await userModel.getUserWithUserId(
      message.sender_user_id
    );
    message.sender_email = messageSender[0].email || "No sender email";
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

  //sort all messages in to conversations
  let conversations = {};

  allMessages.forEach((message) => {
    const conversation_id = message.conversation_id;
    if (!conversations[conversation_id]) {
      conversations[conversation_id] = [];
    }
    conversations[conversation_id].push(message);
  });
  // sort the message in each conversation
  for (const id in conversations) {
    conversations[id].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
  }

  // Convert to array and sort conversations by most recent message
  const sortedConversationsArray = Object.entries(conversations).sort(
    (a, b) => {
      const latestA = new Date(a[1][0].timestamp);
      const latestB = new Date(b[1][0].timestamp);
      return latestB - latestA;
    }
  );

  conversations = Object.fromEntries(sortedConversationsArray);
  return conversations;
}

/**
 * Retrieves and organizes all messages for a specific user into conversations.
 * Each message includes sender email and conversation subject, sorted by most recent timestamp.
 *
 * @function
 * @memberof module:messageModel
 * @param {number} userId - The user ID to retrieve messages for.
 *
 * @returns {Promise<Object>} A dictionary of conversations sorted by latest message timestamp.
 *
 * @throws Will throw an error if querying messages or related data fails.
 */
async function getAllUserConversations(userId) {
  let allMessages = [];

  const [messages] = await connection.query(
    "SELECT * FROM `message` WHERE `recipient_user_id` = ? OR `sender_user_id` = ?",
    [userId, userId]
  );

  allMessages = allMessages.concat(messages);

  for (const message of allMessages) {
    const messageSender = await userModel.getUserWithUserId(
      message.sender_user_id
    );
    message.sender_email = messageSender[0].email || "No sender email";
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

  //sort all messages in to conversations
  let conversations = {};

  allMessages.forEach((message) => {
    const conversation_id = message.conversation_id;
    if (!conversations[conversation_id]) {
      conversations[conversation_id] = [];
    }
    conversations[conversation_id].push(message);
  });
  // sort the message in each conversation
  for (const id in conversations) {
    conversations[id].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
  }

  // Convert to array and sort conversations by most recent message
  const sortedConversationsArray = Object.entries(conversations).sort(
    (a, b) => {
      const latestA = new Date(a[1][0].timestamp);
      const latestB = new Date(b[1][0].timestamp);
      return latestB - latestA;
    }
  );

  conversations = Object.fromEntries(sortedConversationsArray);
  return conversations;
}

module.exports = {
  getAllStudentConversationsForAdmin,
  getAllUserConversations,
};
