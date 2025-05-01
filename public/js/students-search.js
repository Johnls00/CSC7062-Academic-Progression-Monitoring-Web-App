/**
 * Adds filtering functionality to the student table.
 * Listens for input events on the #studentSearch field and filters rows in the table with class 'sticky-header'.
 * Only rows whose text content matches the input are displayed.
 *
 * @file public/js/students-search.js
 * @module studentsSearch
 * @description Enables dynamic, case-insensitive filtering of student records in a table.
 */
document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('studentSearch');
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