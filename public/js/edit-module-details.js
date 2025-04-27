const deleteModuleBtn = document.getElementById("delete-module-btn");
const addModuleBtn = document.getElementById("add-module-btn");

addModuleBtn.addEventListener("click", () => {
  document.getElementById("add-module-form").submit();
});

// delete student module
deleteModuleBtn.addEventListener("click", () => {
  console.log("Delete button clicked");

  if (confirm("Are you sure you want to delete this module?")) {

    const moduleId = document.getElementById("module-id").value;

    fetch(`/admin/student/delete-student-module/${moduleId}`, {
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

function showNewModuleForm(event) {
  event.preventDefault();
  const form = document.getElementById("newModuleForm");
  form.style.display = form.style.display === "none" ? "block" : "none";
}
