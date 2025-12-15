# Quick Start Guide

## Installation Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Application**
   ```bash
   npm run dev
   ```
   
   This will start:
   - Backend server on `http://localhost:5000`
   - Frontend on `http://localhost:3000`

3. **Access the Application**
   - Open your browser and go to `http://localhost:3000`
   - Login with:
     - Email: `admin@restaurant.com`
     - Password: `admin123`

## Features Overview

### 🏠 Dashboard
- View real-time statistics
- Monitor bookings, orders, and revenue
- System status overview

### 📅 Bookings
- Create and manage table reservations
- View all bookings with filters
- Edit or cancel bookings

### 🪑 Tables
- Visual table management
- Update table status (Available/Reserved/Occupied)
- View table capacity and location

### 🍽️ Menu
- Add, edit, and delete menu items
- Organize by categories
- Set availability status

### 📋 Orders
- Create new orders
- Track order status (Pending → Preparing → Ready → Served)
- View order totals

### 👥 Customers
- Maintain customer database
- Store preferences and contact information
- Track customer history

### 👔 Staff
- Manage staff members
- Assign roles (Waiter, Chef, Manager, etc.)
- Track staff status

### 💬 Feedback
- View customer reviews
- Submit new feedback
- Rating system (1-5 stars)

### 🌐 Public Booking
- Customer-facing booking page
- Accessible at `/public-booking`
- No login required for customers

## Default Data

The system comes pre-loaded with:
- 8 tables (various capacities and locations)
- 5 sample menu items
- 2 staff members
- Admin user account

## API Access

All API endpoints are available at `http://localhost:5000/api`

Most endpoints require authentication (JWT token) except:
- `POST /api/auth/login`
- `POST /api/bookings` (public booking)
- `POST /api/feedback` (public feedback)

## Troubleshooting

**Port already in use?**
- Change the port in `server/index.js` (line 9)
- Update `NEXT_PUBLIC_API_URL` if needed

**Database issues?**
- The database is auto-created in `server/data/database.json`
- Delete this file to reset to default data

**CORS errors?**
- Ensure backend is running on port 5000
- Check that API_URL matches in your environment

## Next Steps

1. Customize menu items
2. Add your staff members
3. Configure tables to match your restaurant
4. Update admin credentials
5. Deploy to production (see README.md)

