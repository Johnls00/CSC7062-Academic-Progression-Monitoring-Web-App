/**
 * Handles student-side interactivity for editing personal profile information.
 * Includes logic for:
 * - Enabling and disabling input fields.
 * - Showing and hiding Edit, Save, and Cancel buttons.
 * - Submitting the updated form data.
 *
 * @file public/js/edit-student-details-student.js
 * @module editStudentDetailsStudent
 * @description Binds event listeners for editing a student's personal details.
 */
document.addEventListener("DOMContentLoaded", () => {
  const editBtn = document.getElementById("edit-btn");
  const saveBtn = document.getElementById("save-btn");
  const studentDetailsForm = document.getElementById("student-details-form");
  const inputs = studentDetailsForm.querySelectorAll("input");
  const cancelBtn = document.getElementById("cancel-btn");

  editBtn.addEventListener("click", () => {
    inputs.forEach((input) => {
      if (!input.hasAttribute("readonly")) {
        input.removeAttribute("disabled");
      }
    }); // Enable inputs
    editBtn.classList.add("is-hidden"); // Hide Edit button
    cancelBtn.classList.remove("is-hidden"); // Show cancel button
    saveBtn.classList.remove("is-hidden"); // Show Save button
  });

  cancelBtn.addEventListener("click", () => {
    inputs.forEach((input) => input.setAttribute("disabled", true)); // Disable all inputs again
    saveBtn.classList.add("is-hidden"); // Hide Save button
    cancelBtn.classList.add("is-hidden"); // Hide cancel button
    editBtn.classList.remove("is-hidden"); // Show Edit button
  });

  saveBtn.addEventListener("click", () => {
    studentDetailsForm.submit();
  });
});
