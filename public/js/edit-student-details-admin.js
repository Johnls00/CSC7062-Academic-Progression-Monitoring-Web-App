/**
 * Handles admin-side interactivity for editing a student's personal and academic records.
 * Includes logic for:
 * - Toggling form inputs for student and module edits.
 * - Submitting updates and additions.
 * - Deleting individual modules or entire student records via fetch API.
 *
 * @file public/js/edit-student-details-admin.js
 * @module editStudentDetailsAdmin
 * @description Binds event listeners to admin view buttons and forms for managing student records.
 */
document.addEventListener("DOMContentLoaded", () => {
  const editBtn = document.getElementById("edit-btn");
  const saveBtn = document.getElementById("save-btn");
  const studentDetailsForm = document.getElementById("student-details-form");
  const inputs = studentDetailsForm.querySelectorAll("input");
  const cancelBtn = document.getElementById("cancel-btn");
  const deleteStudentBtn = document.getElementById("delete-student-btn");

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

  // constants for module buttons
  const saveModulesBtn = document.getElementById("save-modules-btn");
  const cancelModulesBtn = document.getElementById("cancel-modules-btn");
  const editModulesBtn = document.getElementById("edit-modules-btn");
  const moduleInputs = document.querySelectorAll("#module-form input");
  const addModuleBtn = document.getElementById("add-module-btn");
  const addModuleForm = document.getElementById("add-module-form");
  const deleteStudentModuleBtn = document.getElementById(
    "delete-student-module-btn"
  );

  editModulesBtn.addEventListener("click", () => {
    document.querySelectorAll("#module-form input").forEach((input) => {
      if (!input.hasAttribute("readonly")) {
        input.removeAttribute("disabled");
      }
    });
    editModulesBtn.classList.add("is-hidden");
    saveModulesBtn.classList.remove("is-hidden");
    cancelModulesBtn.classList.remove("is-hidden");
    addModuleBtn.classList.remove("is-hidden");
    addModuleForm.classList.remove("is-hidden");
  });

  cancelModulesBtn.addEventListener("click", () => {
    moduleInputs.forEach((input) => input.setAttribute("disabled", true));
    cancelModulesBtn.classList.add("is-hidden");
    saveModulesBtn.classList.add("is-hidden");
    editModulesBtn.classList.remove("is-hidden");
  });

  saveModulesBtn.addEventListener("click", () => {
    document.getElementById("module-form").submit();
  });

  addModuleBtn.addEventListener("click", () => {
    document.getElementById("add-module-form").submit();
  });

  // delete student module
  deleteStudentModuleBtn.addEventListener("click", () => {
    console.log("Delete button clicked");

    if (
      confirm("Are you sure you want to delete this student module record?")
    ) {
      const sId = document.getElementById("student-sId").value;
      const userModuleId = document.getElementById("user-module-id").value;

      fetch(`/admin/student/delete-student-module/${userModuleId}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Module Deletion failed");
          }
        })
        .then((data) => {
          alert(data.message);
          window.location.href = `/admin/student/${sId}`;
        })
        .catch((error) => {
          console.error("Error deleting module:", error);
          alert("Failed to delete student module.");
        });
    }
  });

  // delete student button
  deleteStudentBtn.addEventListener("click", async () => {
    if (
      confirm(
        "Are you sure you want to delete this student and all their records?"
      )
    ) {
      const sId = document.getElementById("student-sId").value;

      fetch(`/admin/student/delete/${sId}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Deletion failed");
          }
        })
        .then((data) => {
          alert(data.message); // "Student deleted"
          window.location.href = "/admin/students";
        })
        .catch((error) => {
          console.error("Error deleting student:", error);
          alert("Failed to delete student.");
        });
    }
  });
});
