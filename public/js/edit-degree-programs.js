document.addEventListener("DOMContentLoaded", function () {
    const deleteProgramBtns = document.querySelectorAll(".delete-program-btn");
    const addProgramBtn = document.getElementById("add-program-btn");
  
    addProgramBtn.addEventListener("click", () => {
      document.getElementById("add-program-btn").submit();
    });
  
    deleteProgramBtns.forEach((button) => {
      button.addEventListener("click", () => {
        console.log("Delete button clicked");
  
        if (confirm("Are you sure you want to delete this degree program?")) {
          const programId = button.dataset.program_id;
  
          fetch(`/admin/degree-programs/delete-degree/${programId}`, {
            method: "DELETE",
          })
            .then((response) => {
              if (response.ok) {
                return response.json();
              } else {
                throw new Error("Program Deletion failed");
              }
            })
            .then((data) => {
              alert(data.message);
              window.location.href = `/admin/degree-programs`;
            })
            .catch((error) => {
              console.error("Error deleting Program:", error);
              alert("Failed to delete program.");
            });
        }
      });
    });
  });

function showNewProgramForm(event) {
    event.preventDefault();
    const form = document.getElementById("newProgramForm");
    form.style.display = form.style.display === "none" ? "block" : "none";
  }