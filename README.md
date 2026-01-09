# Restaurant Management System

A complete restaurant management system built with pure HTML, CSS, and JavaScript. No backend required - all data is stored in the browser's localStorage.

## Features

- 📊 **Dashboard** - Overview of bookings, orders, revenue, and system status
- 📅 **Bookings Management** - Create, edit, and manage table reservations
- 🪑 **Table Management** - View and update table status (available, reserved, occupied)
- 🍽️ **Menu Management** - Add, edit, and manage menu items by category
- 📋 **Order Management** - Create orders, track status, and manage order flow
- 👥 **Customer Management** - Store and manage customer information
- 👔 **Staff Management** - Manage staff members and their roles
- 💬 **Feedback System** - Collect and view customer feedback
- 🌐 **Public Booking** - Public-facing table booking page

## Getting Started

### Option 1: Simple File Opening
1. Simply open `index.html` in your web browser
2. Login with default credentials:
   - Email: `admin@restaurant.com`
   - Password: `admin123`

### Option 2: Using a Local Server (Recommended)
1. Install dependencies (optional):
   ```bash
   npm install
   ```

2. Start a local server:
   ```bash
   npm start
   ```
   Or use any other static file server like:
   - Python: `python -m http.server 8080`
   - PHP: `php -S localhost:8080`
   - VS Code Live Server extension

3. Open your browser and navigate to `http://localhost:8080`

## File Structure

```
restaurant-Website/
├── index.html          # Login page
├── dashboard.html      # Main dashboard
├── bookings.html       # Booking management
├── tables.html         # Table management
├── menu.html           # Menu management
├── orders.html         # Order management
├── customers.html      # Customer management
├── staff.html          # Staff management
├── feedback.html       # Feedback management
├── public-booking.html # Public booking page
├── js/
│   ├── storage.js      # Data storage (localStorage)
│   └── utils.js        # Utility functions
└── package.json        # Project configuration
```

## Data Storage

All data is stored in the browser's localStorage. This means:
- Data persists between sessions
- Data is specific to each browser/device
- No server or database required
- Data can be cleared by clearing browser storage

## Default Data

The system comes with initial data:
- **User**: admin@restaurant.com / admin123
- **Tables**: 8 tables with various capacities
- **Menu**: 5 sample menu items
- **Staff**: 2 sample staff members

## Features

### Authentication
- Simple login system (no password hashing for demo purposes)
- Session management via localStorage
- Automatic redirect to dashboard after login

### Data Management
- All CRUD operations (Create, Read, Update, Delete)
- Real-time updates across pages
- Automatic ID generation
- Data validation

### UI/UX
- Modern, responsive design using Tailwind CSS
- Modal dialogs for forms
- Status indicators with color coding
- Loading states
- Error handling

## Browser Compatibility

Works in all modern browsers that support:
- ES6 JavaScript
- localStorage API
- CSS Grid and Flexbox

## Notes

- This is a frontend-only application
- Data is stored locally in the browser
- No data synchronization between devices
- Perfect for demos, prototypes, or single-user scenarios
- For production use, consider adding a backend API

## License

Free to use and modify.
