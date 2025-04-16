document.addEventListener("DOMContentLoaded", () => {
  const editBtn = document.getElementById("edit-btn");
  const saveBtn = document.getElementById("save-btn");
  const form = document.getElementById("student-details-form");
  const inputs = form.querySelectorAll("input");
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
});
