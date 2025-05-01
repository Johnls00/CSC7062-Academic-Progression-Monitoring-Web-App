// public/js/degree-search.js

/**
 * Adds search functionality to the degree table.
 * Filters table rows based on user input in the 'DegreeSearch' input field.
 * 
 * @file public/js/degree-search.js
 * @description Attaches an input event listener to filter rows in a table with class 'sticky-header'.
 * The search is case-insensitive and hides rows that do not match the query.
 */
document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('DegreeSearch');
    if (!searchInput) return;
  
    searchInput.addEventListener('input', function () {
      const searchValue = this.value.toLowerCase();
      const rows = document.querySelectorAll('.sticky-header tbody tr');
  
      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchValue) ? '' : 'none';
      });
    });
  });