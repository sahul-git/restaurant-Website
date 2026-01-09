// Common initialization and utility functions
// Ensure storage is initialized
if (typeof storage === 'undefined') {
  console.error('Storage not loaded! Make sure js/storage.js is loaded first.');
}

// Make functions globally accessible
window.showModal = showModal;
window.hideModal = hideModal;
window.formatDate = formatDate;
window.formatCurrency = formatCurrency;
window.getStatusColor = getStatusColor;
window.getRatingStars = getRatingStars;
window.getRatingColor = getRatingColor;
window.checkAuth = checkAuth;
window.renderNav = renderNav;
window.handleLogout = handleLogout;
window.toggleMobileMenu = toggleMobileMenu;

// Close modals when clicking outside
document.addEventListener('DOMContentLoaded', function() {
  // Close modal on outside click
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('fixed') && e.target.id && e.target.id.includes('Modal')) {
      e.target.classList.add('hidden');
    }
  });

  // Close modal on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const modals = document.querySelectorAll('[id$="Modal"]');
      modals.forEach(modal => {
        if (!modal.classList.contains('hidden')) {
          modal.classList.add('hidden');
        }
      });
    }
  });
});

// Helper to prevent form submission issues
function handleFormSubmit(formId, submitHandler) {
  const form = document.getElementById(formId);
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      try {
        submitHandler(e);
      } catch (error) {
        console.error('Form submission error:', error);
        alert('An error occurred: ' + error.message);
      }
    });
  }
}

// Helper to load data with error handling
function loadDataWithErrorHandling(loadFunction, errorMessage) {
  try {
    if (typeof loadFunction === 'function') {
      loadFunction();
    }
  } catch (error) {
    console.error(errorMessage, error);
    alert(errorMessage + ': ' + error.message);
  }
}
