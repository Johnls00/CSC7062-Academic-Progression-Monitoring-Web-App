const express = require("express");
const router = express.Router();

const userModel = require("../models/userModel");

const connection = require("../config/config");
const session = require("express-session");

// sending a new message logic 
router.post("/send-new-message", async (req, res) => {
  //  contents of the new message
  const { email, subject, message } = req.body;
  // check that the user has filled the form
  if (!email || !subject || !message) {
    return res
      .status(400)
      .json({ message: "Email, Subject and message are required." });
  }

  try {
    // set the sender id
    const sender_user_id = req.session.user.user_id;

    // get the users id with the emails entered by the sender
    const [[recipient]] = await userModel.getUserIdWithEmail(email);
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found." });
    }
    const recipient_user_id = recipient.user_id;
    // create a new conversation with the Subject
    const [newConversation] = await connection.query(
      "INSERT INTO `conversation`(`subject`) VALUES (?)",
      [subject]
    );
    // save the conversation id
    const conversationId = newConversation.insertId;
    // save the conversation id

    // fill the message and send it to the db
    await connection.query(
      "INSERT INTO `message`(`sender_user_id`, `recipient_user_id`, `content`, `timestamp`, `conversation_id`) VALUES (?, ?, ?, NOW(), ?)",
      [sender_user_id, recipient_user_id, message, conversationId]
    );
    // tell user the messafe was sent
    res.json({ message: "Message sent successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send message." });
  }
});
// sending replys in a converstion logic
router.post("/send-reply", async (req, res) => {
    //  contents of the new message
  const { replyMessage, conversationId, recipientUserId} =
    req.body;
    // check the message has a content
  if (!replyMessage) {
    return res.status(400).json({ message: "A message is required." });
  }

  // inserting the message to the db 
  try {
    const senderUserId = req.session.user.user_id;
    console.log("sender id ", senderUserId);

    await connection.query(
      "INSERT INTO `message`(`sender_user_id`, `recipient_user_id`, `content`, `conversation_id`, `timestamp`) VALUES (?, ?, ?, ?, NOW())",
      [senderUserId, recipientUserId, replyMessage, conversationId]
    );
    
    res.json({ message: "Reply sent successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send message." });
  }
});
module.exports = router;
