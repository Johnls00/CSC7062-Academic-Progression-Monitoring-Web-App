document.addEventListener("DOMContentLoaded", function () {
  const deleteModuleBtns = document.querySelectorAll(".delete-module-btn");
  const addModuleBtn = document.getElementById("add-module-btn");

  addModuleBtn.addEventListener("click", () => {
    document.getElementById("add-module-form").submit();
  });

  deleteModuleBtns.forEach((button) => {
    button.addEventListener("click", () => {
      console.log("Delete button clicked");

      if (confirm("Are you sure you want to delete this module?")) {
        const moduleId = button.dataset.moduleId;

        fetch(`/admin/modules/delete-module/${moduleId}`, {
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
            window.location.href = `/admin/modules`;
          })
          .catch((error) => {
            console.error("Error deleting module:", error);
            alert("Failed to delete student module.");
          });
      }
    });
  });
});

function showNewModuleForm(event) {
  event.preventDefault();
  const form = document.getElementById("newModuleForm");
  form.style.display = form.style.display === "none" ? "block" : "none";
}
