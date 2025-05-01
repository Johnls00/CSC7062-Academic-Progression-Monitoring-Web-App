/**
 * Handles interactivity for the mass upload interface in the admin panel.
 * Includes logic for:
 * - Displaying the selected filename on file input change.
 * - Submitting the upload form asynchronously with fetch.
 * - Alerting the user on success or failure.
 *
 * @file public/js/mass-upload-handler.js
 * @module massUploadHandler
 * @description Provides file input preview and async form submission for student data import.
 */

// file upload form handler
const fileInput = document.querySelector("#student-data-file input[type=file]");
fileInput.onchange = () => {
  if (fileInput.files.length > 0) {
    const fileName = document.querySelector("#student-data-file .file-name");
    fileName.textContent = fileInput.files[0].name;
  }
};

document
  .getElementById("process-file")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    try {
      const uploadData = new FormData(this);
      const response = await fetch("/uploadHandler", {
        method: "POST",
        body: uploadData,
      });

      alert("successfully updated records.", response.status);
    } catch (err) {
      alert("failed to process the file", err);
      console.error("Fetch failed:", err);
    }
  });
