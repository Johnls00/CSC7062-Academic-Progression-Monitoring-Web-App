document.addEventListener("DOMContentLoaded", () => {
  const revealAddModuleFormBtn = document.getElementById(
    "reveal-add-module-form-btn"
  );
  const addModuleForm = document.getElementById("add-module-form");
  const addModuleBtn = document.getElementById("add-module-btn");
  const cancelModulesBtn = document.getElementById("cancel-modules-btn");

  revealAddModuleFormBtn.addEventListener("click", () => {
    addModuleForm.classList.remove("is-hidden");
    addModuleBtn.classList.remove("is-hidden");
    cancelModulesBtn.classList.remove("is-hidden");
    revealAddModuleFormBtn.classList.add("is-hidden");
  });

  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      saveBtn.classList.add("is-hidden");
      cancelBtn.classList.add("is-hidden");
      addModuleBtn.classList.add("is-hidden");
      addModuleForm.classList.add("is-hidden");
      addModuleForm.reset();
    });
  }

  if (addModuleBtn) {
    addModuleBtn.addEventListener("click", () => {
      saveBtn.classList.remove("is-hidden");
      cancelBtn.classList.remove("is-hidden");
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
  document.querySelectorAll(".delete-program-module-btn").forEach((btn) => {
    btn.addEventListener("click", async (event) => {
      const confirmed = confirm(
        "Are you sure you want to delete this module from the degree program?"
      );
      if (!confirmed) return;

      const row = btn.closest("tr");
      const programModuleIdInput = row.querySelector("input#program_module_id");
      if (!programModuleIdInput) {
        alert("Module ID not found.");
        return;
      }

      const programModuleId = programModuleIdInput.value;

      try {
        const response = await fetch(
          `/admin/degree-details/delete-degree-module/${programModuleId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete module");
        }

        const data = await response.json();
        alert(data.message || "Module deleted successfully.");
        location.reload();
      } catch (error) {
        console.error("Error deleting module:", error);
        alert("Failed to delete program module.");
      }
    });
  });
});
