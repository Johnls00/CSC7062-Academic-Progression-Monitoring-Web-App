

// file upload form handler
const fileInput = document.querySelector("#student-data-file input[type=file]");
fileInput.onchange = () => {
  if (fileInput.files.length > 0) {
    const fileName = document.querySelector("#student-data-file .file-name");
    fileName.textContent = fileInput.files[0].name;
  }
};

document
  .getElementById("process-file")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    try {
      const uploadData = new FormData(this);
      const response = await fetch("/uploadHandler", {
        method: "POST",
        body: uploadData,
      });

    //   const result = await response.json();
    //   const data = result.data;

    //   try {
    //     console.log(data);
    //     data.forEach(record => {
    //       handleStudent(record);
    //     });
    //   } catch (jsonErr) {
    //     console.error("Response not valid JSON:", data);
    //   }
    } catch (err) {
      console.error("Fetch failed:", err);
    }
  });
