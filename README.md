# Restaurant Management System

A comprehensive restaurant management website with features for table booking, customer service, menu management, order tracking, staff management, and more.

## Features

- **Dashboard**: Real-time statistics and analytics
- **Table Booking**: Manage reservations and table availability
- **Table Management**: View and update table status (available, reserved, occupied)
- **Menu Management**: Add, edit, and manage menu items by category
- **Order Management**: Create and track orders with status updates
- **Customer Management**: Maintain customer database with preferences
- **Staff Management**: Manage staff members and their roles
- **Customer Feedback**: Collect and view customer reviews and ratings
- **Authentication**: Secure login system for staff

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: JSON file-based (easily migratable to MongoDB/PostgreSQL)
- **Authentication**: JWT tokens

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development servers:
```bash
npm run dev
```

This will start both the backend server (port 5000) and the Next.js frontend (port 3000).

Alternatively, you can run them separately:
```bash
# Backend only
npm run server

# Frontend only
npm run client
```

## Default Login Credentials

- **Email**: admin@restaurant.com
- **Password**: admin123

## Project Structure

```
restaurant-Website/
├── app/                    # Next.js app directory
│   ├── components/         # React components
│   ├── dashboard/          # Dashboard page
│   ├── bookings/           # Booking management
│   ├── tables/             # Table management
│   ├── menu/               # Menu management
│   ├── orders/             # Order management
│   ├── customers/          # Customer management
│   ├── staff/              # Staff management
│   └── feedback/           # Feedback management
├── server/                 # Express backend
│   ├── index.js           # Main server file
│   └── data/              # Database JSON files (auto-created)
├── lib/                    # Utility functions
│   └── api.js             # API client
└── package.json           # Dependencies
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login

### Tables
- `GET /api/tables` - Get all tables
- `GET /api/tables/:id` - Get table by ID
- `PUT /api/tables/:id` - Update table

### Bookings
- `GET /api/bookings` - Get all bookings (requires auth)
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id` - Update booking (requires auth)
- `DELETE /api/bookings/:id` - Delete booking (requires auth)

### Menu
- `GET /api/menu` - Get all menu items
- `POST /api/menu` - Create menu item (requires auth)
- `PUT /api/menu/:id` - Update menu item (requires auth)
- `DELETE /api/menu/:id` - Delete menu item (requires auth)

### Orders
- `GET /api/orders` - Get all orders (requires auth)
- `POST /api/orders` - Create order (requires auth)
- `PUT /api/orders/:id` - Update order (requires auth)

### Customers
- `GET /api/customers` - Get all customers (requires auth)
- `POST /api/customers` - Create customer (requires auth)
- `PUT /api/customers/:id` - Update customer (requires auth)

### Staff
- `GET /api/staff` - Get all staff (requires auth)
- `POST /api/staff` - Create staff member (requires auth)
- `PUT /api/staff/:id` - Update staff member (requires auth)

### Feedback
- `GET /api/feedback` - Get all feedback (requires auth)
- `POST /api/feedback` - Submit feedback

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics (requires auth)

## Usage

1. **Login**: Use the default credentials to access the admin panel
2. **Dashboard**: View real-time statistics and system status
3. **Manage Tables**: Update table status and view availability
4. **Handle Bookings**: Create, edit, and manage customer reservations
5. **Menu Management**: Add and update menu items organized by category
6. **Process Orders**: Create orders, track status, and manage workflow
7. **Customer Database**: Maintain customer information and preferences
8. **Staff Management**: Add and manage staff members
9. **Feedback**: View customer reviews and ratings

## Environment Variables

Create a `.env.local` file for custom configuration:

```
API_URL=http://localhost:5000/api
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Production Deployment

For production deployment:

1. Update JWT_SECRET in `server/index.js` to a secure random string
2. Consider migrating to a proper database (MongoDB, PostgreSQL)
3. Set up environment variables
4. Build the Next.js app: `npm run build`
5. Use a process manager like PM2 for the backend server

## Notes

- The database is stored in JSON files in `server/data/` directory
- All data persists between server restarts
- The system initializes with sample data on first run
- Authentication tokens are stored in localStorage

## License

MIT

