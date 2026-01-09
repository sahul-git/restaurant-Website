// Utility functions
function showModal(modalId) {
  document.getElementById(modalId).classList.remove('hidden');
}

function hideModal(modalId) {
  document.getElementById(modalId).classList.add('hidden');
}

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString();
}

function formatCurrency(amount) {
  return '$' + parseFloat(amount || 0).toFixed(2);
}

function getStatusColor(status) {
  const colors = {
    'confirmed': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800',
    'completed': 'bg-gray-100 text-gray-800',
    'pending': 'bg-yellow-100 text-yellow-800',
    'preparing': 'bg-blue-100 text-blue-800',
    'ready': 'bg-green-100 text-green-800',
    'served': 'bg-gray-100 text-gray-800',
    'available': 'bg-green-100 text-green-800 border-green-300',
    'reserved': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'occupied': 'bg-red-100 text-red-800 border-red-300',
    'active': 'bg-green-100 text-green-800',
    'inactive': 'bg-gray-100 text-gray-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

function getRatingStars(rating) {
  return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
}

function getRatingColor(rating) {
  if (rating >= 4) return 'text-green-600';
  if (rating >= 3) return 'text-yellow-600';
  return 'text-red-600';
}

function checkAuth() {
  if (!storage.isAuthenticated()) {
    window.location.href = 'index.html';
    return false;
  }
  return true;
}

function renderNav() {
  const user = storage.getUser();
  // Get current filename - works with both file:// and http:// protocols
  let pathname = window.location.pathname;
  if (pathname === '/' || pathname === '') {
    pathname = window.location.href.split('/').pop() || 'index.html';
  } else {
    pathname = pathname.split('/').pop();
  }
  // Handle file:// protocol
  if (pathname.includes('#')) {
    pathname = pathname.split('#')[0];
  }
  
  const navItems = [
    { href: 'dashboard.html', label: 'Dashboard', icon: '📊' },
    { href: 'bookings.html', label: 'Bookings', icon: '📅' },
    { href: 'tables.html', label: 'Tables', icon: '🪑' },
    { href: 'menu.html', label: 'Menu', icon: '🍽️' },
    { href: 'orders.html', label: 'Orders', icon: '📋' },
    { href: 'customers.html', label: 'Customers', icon: '👥' },
    { href: 'staff.html', label: 'Staff', icon: '👔' },
    { href: 'feedback.html', label: 'Feedback', icon: '💬' },
  ];

  const navHTML = `
    <nav class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center w-full">
            <div class="flex-shrink-0 flex items-center">
              <a href="dashboard.html" class="text-xl font-bold text-red-600 hover:text-red-700">Restaurant Management</a>
            </div>
            <div class="hidden md:ml-6 md:flex md:space-x-8 flex-1">
              ${navItems.map(item => {
                const isActive = pathname === item.href || pathname === item.href.split('.')[0];
                return `
                  <a
                    href="${item.href}"
                    class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive
                        ? 'border-red-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }"
                  >
                    <span class="mr-2">${item.icon}</span>
                    ${item.label}
                  </a>
                `;
              }).join('')}
            </div>
            <!-- Mobile menu button -->
            <div class="md:hidden ml-auto">
              <button
                id="mobileMenuButton"
                onclick="toggleMobileMenu()"
                class="text-gray-500 hover:text-gray-700 p-2"
              >
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
          <div class="hidden md:flex items-center">
            ${user ? `
              <span class="text-sm text-gray-700 mr-4">${user.name || user.email}</span>
              <button
                onclick="handleLogout()"
                class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
              >
                Logout
              </button>
            ` : ''}
          </div>
        </div>
        <!-- Mobile menu -->
        <div id="mobileMenu" class="hidden md:hidden border-t">
          <div class="px-2 pt-2 pb-3 space-y-1">
            ${navItems.map(item => {
              const isActive = pathname === item.href || pathname === item.href.split('.')[0];
              return `
                <a
                  href="${item.href}"
                  class="block px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? 'bg-red-50 text-red-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }"
                >
                  <span class="mr-2">${item.icon}</span>
                  ${item.label}
                </a>
              `;
            }).join('')}
            ${user ? `
              <div class="px-3 py-2 border-t mt-2">
                <div class="text-sm text-gray-700 mb-2">${user.name || user.email}</div>
                <button
                  onclick="handleLogout()"
                  class="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
                >
                  Logout
                </button>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    </nav>
  `;
  
  const navContainer = document.getElementById('nav-container');
  if (navContainer) {
    navContainer.innerHTML = navHTML;
  }
}

// Global functions for navigation
function handleLogout() {
  storage.logout();
  window.location.href = 'index.html';
}

function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  if (menu) {
    menu.classList.toggle('hidden');
  }
}
