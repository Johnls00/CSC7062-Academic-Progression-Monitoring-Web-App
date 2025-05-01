/**
 * Adds live search filtering to the module table.
 * Listens to input in the #ModuleSearch field and filters rows of the table accordingly.
 * Rows are shown or hidden based on whether their text content includes the search query.
 *
 * @file public/js/module-search.js
 * @module moduleSearch
 * @description Implements dynamic filtering of module list via case-insensitive substring match.
 */
document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("ModuleSearch");
  if (!searchInput) return;

  searchInput.addEventListener("input", function () {
    const searchValue = this.value.toLowerCase();
    const rows = document.querySelectorAll(".sticky-header tbody tr");

    rows.forEach((row) => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(searchValue) ? "" : "none";
    });
  });
});
