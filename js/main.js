let currentCategory = 'villas';

document.addEventListener('DOMContentLoaded', () => {
  switchCategory('villas');
});

function switchCategory(category) {
  currentCategory = category;
  renderFilters(category);
  clearResults();
}