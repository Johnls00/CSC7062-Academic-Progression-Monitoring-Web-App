document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('ModuleSearch');
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