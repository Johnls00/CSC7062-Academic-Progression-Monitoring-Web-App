document.getElementById("edit-btn").addEventListener("click", () => {
  const form = document.getElementById("student-details-form");
  const inputs = form.querySelectorAll("input");

  inputs.forEach((input) => (input.disabled = false)); // Enable all inputs

  document.getElementById("save-btn").classList.remove("is-hidden"); // Show Save
  document.getElementById("edit-btn").classList.add("is-hidden"); // Hide Edit
});
