document.addEventListener("DOMContentLoaded", function () {
    // const deleteProgramBtns = document.querySelectorAll(".delete-module-btn");
    const addProgramBtn = document.getElementById("add-program-btn");
  
    addModuleBtn.addEventListener("click", () => {
      document.getElementById("add-program-btn").submit();
    });
  
    
  });





function showNewProgramForm(event) {
    event.preventDefault();
    const form = document.getElementById("newProgramForm");
    form.style.display = form.style.display === "none" ? "block" : "none";
  }