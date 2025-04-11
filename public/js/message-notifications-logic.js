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

      //   debug lime
      console.log("messages in conversations = ", messages);

      // Get the elements to update on the right side box
      const threadContainer = document.getElementById("message-thread");

      // Add a header to the top of the box
      const header = document.createElement("div");
      header.innerHTML = `
        <box class="title is-full rounded-box hero" style="background-color: var(--blue-colour); padding: 1rem; margin-bottom: 1rem !important;" >
                  <p class="title">Conversation Thread</p>
                  <small class="sub-title" style="color: white;" id="conversation-subject">Subject: </small>
        </box>
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
            <span>sender: ${message.sender}</span>
          </div>
          <div class="message-body">${message.content}</div>
        `;
        threadContainer.appendChild(article);
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
      // debug line
      console.log("messages in notifications = ", notification);

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

//new message logic
document
  .querySelector("#send-new-message")
  .addEventListener("click", function (e) {
    const contentBox = document.querySelector(".newMessageToggle");
    if (contentBox) {
      contentBox.style.display = "block";
    }

    clearAllArticles("message-thread");
    clearAllArticles("notification-thread");
    clearAllArticles("new-message-thread");
    clearAllArticles("new-notification-thread");

    e.preventDefault();

    const threadContainer = document.getElementById("new-message-thread");

    const newMessage = document.createElement("div");
    newMessage.innerHTML = `
      <box class="title is-full rounded-box hero" style="background-color: var(--blue-colour); padding: 1rem; margin-bottom: 1rem !important;" >
        <p class="title">New Message</p>
      </box>
       <div class="field">
                <div class="field">
                  <label class="label">Email:</label>
                  <div class="control">
                    <input
                      class="input"
                      type="email"
                      placeholder="e.g. alex@example.com"
                    />
                  </div>
                </div>

                <div class="field">
                  <label class="label">Subject:</label>
                  <div class="control">
                    <input
                      class="input"
                      type="text"
                      placeholder="e.g. Subject of issue"
                    />
                  </div>
                </div>

                <div class="field">
                  <label class="label">Message:</label>
                  <div class="control">
                    <textarea
                      class="textarea"
                      placeholder="Describe your issue here..."
                      rows="6"
                    ></textarea>
                  </div>
                </div>

                <button class="button is-primary is-fullwidth">Submit</button>
    `;
    threadContainer.appendChild(newMessage);
  });

  //new notification logic 
  document
  .querySelector("#send-new-notification")
  .addEventListener("click", function (e) {
    const contentBox = document.querySelector(".newNotificationToggle");
    if (contentBox) {
      contentBox.style.display = "block";
    }

    clearAllArticles("message-thread");
    clearAllArticles("notification-thread");
    clearAllArticles("new-message-thread");
    clearAllArticles("new-notification-thread");

    e.preventDefault();

    const threadContainer = document.getElementById("new-notification-thread");

    const newNotification = document.createElement("div");
    newNotification.innerHTML = `
      <box class="title is-full rounded-box hero" style="background-color: var(--blue-colour); padding: 1rem; margin-bottom: 1rem !important;" >
        <p class="title">New Notification</p>
      </box>
       <div class="field">
         <label class="label">Subject:</label>
         <div class="control">
           <input class="input" type="text" placeholder="e.g. Exam Reminder" />
         </div>
       </div>

       <div class="field">
         <label class="label">Message:</label>
         <div class="control">
           <textarea class="textarea" placeholder="Write your notification..." rows="6"></textarea>
         </div>
       </div>

       <button class="button is-primary is-fullwidth">Submit</button>
    `;
    threadContainer.appendChild(newNotification);
  });

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
