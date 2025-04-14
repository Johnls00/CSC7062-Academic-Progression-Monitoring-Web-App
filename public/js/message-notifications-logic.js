// show the conversation and messages
//view selected message logic
document
  .querySelectorAll(".panel-block[data-conversation-id]")
  .forEach((link) => {
    // selects the element and makes it visable
    link.addEventListener("click", function (e) {
      const contentBox = document.querySelector(".conversationToggle");
      if (contentBox) {
        contentBox.style.display = "block";
      }
      //   clear all previous messages or notifications
      clearAllArticles("message-thread");
      clearAllArticles("notification-thread");
      clearAllArticles("new-message-thread");
      clearAllArticles("new-notification-thread");

      e.preventDefault();

      // Clear all highlights
      document.querySelectorAll(".panel-block").forEach((el) => {
        el.classList.remove("is-active");
      });

      // Highlight the current conversation
      this.classList.add("is-active");

      // Get the clicked conversation's ID and messages
      const conversationId = this.dataset.conversationId;
      const messages = window.allConversations[conversationId];
      window.activeConversationId = conversationId; // stored globally to be used elsewhere eg. replying
      window.activeRecipientUserId = messages[0].sender_user_id; // stored globally to be used elsewhere eg. replying

      //   debug lime
      console.log("messages in conversations = ", messages);
      console.log("recipient id", activeRecipientUserId);

      // Get the elements to update on the right side box
      const threadContainer = document.getElementById("message-thread");

      // Add a header to the top of the box
      const header = document.createElement("div");
      header.innerHTML = `
      <div class="columns">
        <div class="column is-full">
          <div class="box title is-full rounded-box hero" style="background-color: var(--blue-colour); padding: 1rem; margin-bottom: 1rem !important;">
            <div class="columns">
              <div class="column is-half">
                <p class="title">Conversation Thread</p>
                <small class="sub-title" style="color: white;" id="conversation-subject">Subject: </small> 
              </div>
              <div class="column is-half has-text-right">
                <a href="#" class="button is-light" id="send-reply">Send reply</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      `;
      threadContainer.appendChild(header);

      const headerSubject = threadContainer.querySelector(
        "#conversation-subject"
      );
      if (headerSubject) {
        headerSubject.textContent = `Subject: ${messages[0].subject}`;
      }

      // show each message to the thread
      messages.forEach((message) => {
        const article = document.createElement("article");
        article.className = "message";
        article.innerHTML = `
          <div class="message-header">
            <span>${new Date(message.timestamp).toLocaleString("en-GB", {
              dateStyle: "short",
              timeStyle: "short",
            })}</span>
            <span>Sender: ${message.sender_email}</span>
          </div>
          <div class="message-body">${message.content}</div>
        `;
        threadContainer.appendChild(article);
      });

      document.addEventListener("click", (event) => {
        if (event.target && event.target.id === "send-reply") {
          const replyForm = document.createElement("div");
          replyForm.id = "reply-form";
          const previousReplyForm = document.getElementById("reply-form");
          if (previousReplyForm) previousReplyForm.remove();
          replyForm.innerHTML = `
            <div class="field">
              <label class="label">Reply Message:</label>
              <div class="control">
                <textarea class="textarea" id="reply-message-content" placeholder="Describe your issue here..." rows="6"></textarea>
              </div>
            </div>
            <button class="button is-primary is-fullwidth" style="padding: 1rem; margin-bottom: 1rem !important;" id="submit-reply">Submit</button>
          `;
          const threadContainer = document.getElementById("message-thread");
          threadContainer.insertBefore(replyForm, threadContainer.children[1]);

          document
            .querySelector("#submit-reply")
            .addEventListener("click", sendReply);
        }
      });
    });
  });

// view selected notification logic
document
  .querySelectorAll(".panel-block[data-notification-id]")
  .forEach((link) => {
    link.addEventListener("click", function (e) {
      // selects the element and makes it visable
      const contentBox = document.querySelector(".notificationToggle");
      if (contentBox) {
        contentBox.style.display = "block";
      }
      //   clear all previous messages or notifications
      clearAllArticles("message-thread");
      clearAllArticles("notification-thread");
      clearAllArticles("new-message-thread");
      clearAllArticles("new-notification-thread");

      e.preventDefault();

      // Clear all highlights
      document.querySelectorAll(".panel-block").forEach((el) => {
        el.classList.remove("is-active");
      });

      // Highlight the current notification
      this.classList.add("is-active");

      // Get the clicked notification's ID and messages
      const notificationId = this.dataset.notificationId;
      const notification = window.allNotifications.find(
        (n) => n.notification_id == notificationId
      );

      // Get the elements to update on the right side
      const threadContainer = document.getElementById("notification-thread");

      // Add a header directly into the thread container
      const header = document.createElement("div");
      header.innerHTML = `
        <box class="title is-full rounded-box hero" style="background-color: var(--blue-colour); padding: 1rem; margin-bottom: 1rem !important;" >
          <p class="title">Notification</p>
        </box>
      `;
      threadContainer.appendChild(header);

      // Append each message to the thread
      const article = document.createElement("article");
      article.className = "message";
      article.innerHTML = `
        <div class="message-header">
          <p>Subject: ${notification.subject}</p>
          <span class="has-text-right">${new Date(
            notification.timestamp
          ).toLocaleString("en-GB", {
            dateStyle: "short",
            timeStyle: "short",
          })}</span>
        </div>
        <div class="message-body">${notification.content}</div>
      `;
      threadContainer.appendChild(article);
    });
  });

// Show New Message Form
document
  .querySelector("#send-new-message")
  .addEventListener("click", function (e) {
    e.preventDefault();
    showNewMessageForm();
  });

// Render and attach new message form
function showNewMessageForm() {
  const contentBox = document.querySelector(".newMessageToggle");
  if (contentBox) {
    contentBox.style.display = "block";
  }

  clearAllArticles("message-thread");
  clearAllArticles("notification-thread");
  clearAllArticles("new-message-thread");
  clearAllArticles("new-notification-thread");

  const threadContainer = document.getElementById("new-message-thread");
  threadContainer.innerHTML = ""; // clear previous content

  const newMessage = document.createElement("div");
  newMessage.innerHTML = `
    <div class="box title is-full rounded-box hero" style="background-color: var(--blue-colour); padding: 1rem; margin-bottom: 1rem !important;" >
      <p class="title">New Message</p>
    </div>
    <div class="field">
      <label class="label">Email:</label>
      <div class="control">
        <input class="input" id="message-email" type="email" placeholder="e.g. alex@example.com" />
      </div>
    </div>
    <div class="field">
      <label class="label">Subject:</label>
      <div class="control">
        <input class="input" id="message-subject" type="text" placeholder="e.g. Subject of issue" />
      </div>
    </div>
    <div class="field">
      <label class="label">Message:</label>
      <div class="control">
        <textarea class="textarea" id="message-content" placeholder="Describe your issue here..." rows="6"></textarea>
      </div>
    </div>
    <button class="button is-primary is-fullwidth" id="submit-new-message">Send New Message</button>
  `;
  threadContainer.appendChild(newMessage);

  document
    .querySelector("#submit-new-message")
    .addEventListener("click", submitNewMessage);
}

// Handle message submission
async function submitNewMessage() {
  const email = document.getElementById("message-email").value;
  const subject = document.getElementById("message-subject").value;
  const message = document.getElementById("message-content").value;

  if (!email || !subject || !message) {
    alert("Please fill out all fields.");
    return;
  }

  try {
    const res = await fetch("/messages/send-new-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, subject, message }),
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.message || "New message sent!");
      clearAllArticles("new-message-thread");
      const contentBox = document.querySelector(".newMessageToggle");
      if (contentBox) contentBox.style.display = "none";
    } else {
      alert(data.message || "Failed to send Message.");
    }
  } catch (err) {
    alert("Something went wrong. Please try again.");
  }
}

document
  .querySelector("#send-new-notification")
  .addEventListener("click", function (e) {
    e.preventDefault();

    const contentBox = document.querySelector(".newNotificationToggle");
    if (contentBox) {
      contentBox.style.display = "block";
    }

    clearAllArticles("message-thread");
    clearAllArticles("notification-thread");
    clearAllArticles("new-message-thread");
    clearAllArticles("new-notification-thread");

    renderNewNotificationForm();
  });

// Handle reply message
async function sendReply() {
  const replyMessage = document.getElementById("reply-message-content").value;
  const conversationId = window.activeConversationId;
  const recipientUserId = window.activeRecipientUserId;

  if (!replyMessage) {
    alert("Please fill out all fields.");
    return;
  }

  try {
    const res = await fetch("/messages/send-reply", {
      method: "POST",
      headers: { "content-Type": "application/json" },
      body: JSON.stringify({ replyMessage, conversationId, recipientUserId }),
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.message || "Reply message sent!");
      clearAllArticles("message-thread");
      const contentBox = document.querySelector(".conversationToggle");
      if (!contentBox) contentBox.style.display = "none";
    } else {
      alert(data.message || "Failed to send reply.");
    }
  } catch (err) {
    console.error("Error sending message:", err);
    alert("Something went wrong. Please try again.");
  }
}

//new notification logic
function renderNewNotificationForm() {
  const threadContainer = document.getElementById("new-notification-thread");
  threadContainer.innerHTML = ""; // Clear previous form if any

  const newNotification = document.createElement("div");
  newNotification.innerHTML = `
    <div class="box title is-full rounded-box hero" style="background-color: var(--blue-colour); padding: 1rem; margin-bottom: 1rem !important;" >
      <p class="title">New Notification</p>
    </div>
    <div class="field">
      <label class="label">Degree Cohort Code:</label>
      <div class="control">
        <input class="input" id="notification-cohort" type="text" placeholder="e.g. ifsy" />
      </div>
    </div>
    <div class="field">
      <label class="label">Subject:</label>
      <div class="control">
        <input class="input" id="notification-subject" type="text" placeholder="e.g. Exam Reminder" />
      </div>
    </div>
    <div class="field">
      <label class="label">Message:</label>
      <div class="control">
        <textarea class="textarea" id="notification-message" placeholder="Write your notification..." rows="6"></textarea>
      </div>
    </div>
    <button class="button is-primary is-fullwidth" id="submit-notification">Send Notification</button>
  `;

  threadContainer.appendChild(newNotification);

  const submitBtn = document.getElementById("submit-notification");
  if (submitBtn) {
    submitBtn.addEventListener("click", async () => {
      const cohort = document.getElementById("notification-cohort").value;
      const subject = document.getElementById("notification-subject").value;
      const message = document.getElementById("notification-message").value;

      if (!cohort || !subject || !message) {
        alert("Please fill out all fields.");
        return;
      }

      try {
        const res = await fetch("/notifications/send-notification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cohort, subject, message }),
        });

        const data = await res.json();

        if (res.ok) {
          alert(data.message || "Notification sent!");
          clearAllArticles("new-notification-thread");
          const contentBox = document.querySelector(".newNotificationToggle");
          if (contentBox) contentBox.style.display = "none";
        } else {
          alert(data.message || "Failed to send notification.");
        }
      } catch (err) {
        console.error("Error sending notification:", err);
        alert("Something went wrong. Please try again.");
      }
    });
  }
}

// function to help clear the previous messages or notification
function clearAllArticles(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = "";
  }
}

//contoller for tabs on the left side
const messagesTab = document.getElementById("messages-tab");
const notificationsTab = document.getElementById("notifications-tab");
const messagesSection = document.getElementById("messages-section");
const notificationsSection = document.getElementById("notifications-section");

messagesTab.addEventListener("click", (e) => {
  e.preventDefault();
  messagesTab.classList.add("is-active");
  notificationsTab.classList.remove("is-active");
  messagesSection.style.display = "block";
  notificationsSection.style.display = "none";
});

notificationsTab.addEventListener("click", (e) => {
  e.preventDefault();
  notificationsTab.classList.add("is-active");
  messagesTab.classList.remove("is-active");
  notificationsSection.style.display = "block";
  messagesSection.style.display = "none";
});
