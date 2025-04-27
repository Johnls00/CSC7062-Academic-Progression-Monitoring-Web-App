document.addEventListener("DOMContentLoaded", () => {
  const revealAddModuleFormBtn = document.getElementById(
    "reveal-add-module-form-btn"
  );
  const addModuleForm = document.getElementById("add-module-form");
  const addModuleBtn = document.getElementById("add-module-btn");
  const cancelModulesBtn = document.getElementById("cancel-modules-btn");
  const deleteProgramModuleBtns = document.querySelectorAll(".delete-program-module-btn");

  revealAddModuleFormBtn.addEventListener("click", () => {
    addModuleForm.classList.remove("is-hidden");
    addModuleBtn.classList.remove("is-hidden");
    cancelModulesBtn.classList.remove("is-hidden");
    revealAddModuleFormBtn.classList.add("is-hidden");
  });

  if (cancelModulesBtn) {
    cancelModulesBtn.addEventListener("click", () => {
      addModuleBtn.classList.add("is-hidden");
      cancelModulesBtn.classList.add("is-hidden");
      addModuleBtn.classList.add("is-hidden");
      addModuleForm.classList.add("is-hidden");
      addModuleForm.reset();
    });
  }

  if (addModuleBtn) {
    addModuleBtn.addEventListener("click", () => {
      addModuleBtn.classList.remove("is-hidden");
      cancelModulesBtn.classList.remove("is-hidden");
      addModuleBtn.classList.remove("is-hidden");
      addModuleForm.classList.remove("is-hidden");
    });
  }

  addModuleBtn.addEventListener("click", () => {
    try {
      const name = addModuleForm
        .querySelector('input[name="new_module_name"]')
        .value.trim();
      const level = addModuleForm
        .querySelector('select[name="new_module_level"]')
        .value.trim();
      const semester = addModuleForm
        .querySelector('select[name="new_module_semester"]')
        .value.trim();
      const core = addModuleForm
        .querySelector('select[name="new_module_core"]')
        .value.trim();

      if (!name || !level || !semester || !core) {
        alert("Please fill out all fields before submitting.");
        return;
      }

      addModuleForm.submit();
    } catch (error) {
      console.error("Error adding module:", error);
      alert("Failed to add program module.");
    }
  });

  cancelModulesBtn.addEventListener("click", () => {
    addModuleForm.classList.add("is-hidden");
    addModuleBtn.classList.add("is-hidden");
    revealAddModuleFormBtn.classList.remove("is-hidden");
  });

  // Delete button functionality
  deleteProgramModuleBtns.forEach((button) => {
    button.addEventListener("click", () => {
      console.log("Delete button clicked");

      if (confirm("Are you sure you want to delete this degree module?")) {
        const programModuleId = button.dataset.program_module_id;

        fetch(`/admin/degree-details/delete-degree-module/${programModuleId}`, {
          method: "DELETE",
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error("Program module Deletion failed");
            }
          })
          .then((data) => {
            alert(data.message);
            window.location.reload();
          })
          .catch((error) => {
            console.error("Error deleting Program module:", error);
            alert("Failed to delete program module.");
          });
      }
    });
  });
});
