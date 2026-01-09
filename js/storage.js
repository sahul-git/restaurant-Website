// Data storage using localStorage
class Storage {
  constructor() {
    this.initDatabase();
  }

  initDatabase() {
    if (!localStorage.getItem('restaurant_db')) {
      const initialData = {
        users: [
          {
            id: '1',
            username: 'admin',
            email: 'admin@restaurant.com',
            password: 'admin123', // Simple password for demo (no hashing)
            role: 'admin',
            name: 'Admin User'
          }
        ],
        tables: [
          { id: '1', number: 1, capacity: 2, status: 'available', location: 'Window' },
          { id: '2', number: 2, capacity: 4, status: 'available', location: 'Window' },
          { id: '3', number: 3, capacity: 4, status: 'available', location: 'Center' },
          { id: '4', number: 4, capacity: 6, status: 'available', location: 'Center' },
          { id: '5', number: 5, capacity: 8, status: 'available', location: 'Private' },
          { id: '6', number: 6, capacity: 2, status: 'available', location: 'Window' },
          { id: '7', number: 7, capacity: 4, status: 'available', location: 'Center' },
          { id: '8', number: 8, capacity: 6, status: 'available', location: 'Private' }
        ],
        bookings: [],
        customers: [],
        menu: [
          { id: '1', name: 'Margherita Pizza', category: 'Main Course', price: 12.99, description: 'Classic tomato and mozzarella', available: true },
          { id: '2', name: 'Caesar Salad', category: 'Appetizer', price: 8.99, description: 'Fresh romaine with caesar dressing', available: true },
          { id: '3', name: 'Grilled Salmon', category: 'Main Course', price: 18.99, description: 'Fresh salmon with vegetables', available: true },
          { id: '4', name: 'Chocolate Cake', category: 'Dessert', price: 6.99, description: 'Rich chocolate cake', available: true },
          { id: '5', name: 'Pasta Carbonara', category: 'Main Course', price: 14.99, description: 'Creamy pasta with bacon', available: true }
        ],
        orders: [],
        staff: [
          { id: '1', name: 'John Doe', role: 'Waiter', email: 'john@restaurant.com', phone: '123-456-7890', status: 'active' },
          { id: '2', name: 'Jane Smith', role: 'Chef', email: 'jane@restaurant.com', phone: '123-456-7891', status: 'active' }
        ],
        feedback: []
      };
      localStorage.setItem('restaurant_db', JSON.stringify(initialData));
    }
  }

  getDB() {
    return JSON.parse(localStorage.getItem('restaurant_db') || '{}');
  }

  saveDB(data) {
    localStorage.setItem('restaurant_db', JSON.stringify(data));
  }

  // Auth methods
  login(email, password) {
    const db = this.getDB();
    const user = db.users.find(u => u.email === email && u.password === password);
    if (user) {
      const userData = { id: user.id, email: user.email, role: user.role, name: user.name };
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', 'demo-token-' + Date.now());
      return { token: localStorage.getItem('token'), user: userData };
    }
    throw new Error('Invalid credentials');
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Generate ID
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Tables
  getTables() {
    return this.getDB().tables || [];
  }

  updateTable(id, data) {
    const db = this.getDB();
    const index = db.tables.findIndex(t => t.id === id);
    if (index !== -1) {
      db.tables[index] = { ...db.tables[index], ...data };
      this.saveDB(db);
      return db.tables[index];
    }
    throw new Error('Table not found');
  }

  // Bookings
  getBookings() {
    return this.getDB().bookings || [];
  }

  createBooking(data) {
    const db = this.getDB();
    const table = db.tables.find(t => t.id === data.tableId);
    const booking = {
      id: this.generateId(),
      ...data,
      tableNumber: table?.number,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };
    db.bookings.push(booking);
    
    // Update table status
    const tableIndex = db.tables.findIndex(t => t.id === data.tableId);
    if (tableIndex !== -1) {
      db.tables[tableIndex].status = 'reserved';
    }
    
    this.saveDB(db);
    return booking;
  }

  updateBooking(id, data) {
    const db = this.getDB();
    const index = db.bookings.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Booking not found');
    
    const oldTableId = db.bookings[index].tableId;
    db.bookings[index] = { ...db.bookings[index], ...data };
    
    // Update table statuses
    if (data.tableId && data.tableId !== oldTableId) {
      const oldTableIndex = db.tables.findIndex(t => t.id === oldTableId);
      if (oldTableIndex !== -1) db.tables[oldTableIndex].status = 'available';
      
      const newTableIndex = db.tables.findIndex(t => t.id === data.tableId);
      if (newTableIndex !== -1) db.tables[newTableIndex].status = 'reserved';
    }
    
    this.saveDB(db);
    return db.bookings[index];
  }

  deleteBooking(id) {
    const db = this.getDB();
    const index = db.bookings.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Booking not found');
    
    const booking = db.bookings[index];
    const tableIndex = db.tables.findIndex(t => t.id === booking.tableId);
    if (tableIndex !== -1) {
      db.tables[tableIndex].status = 'available';
    }
    
    db.bookings.splice(index, 1);
    this.saveDB(db);
    return { message: 'Booking deleted' };
  }

  // Customers
  getCustomers() {
    return this.getDB().customers || [];
  }

  createCustomer(data) {
    const db = this.getDB();
    const customer = {
      id: this.generateId(),
      ...data,
      createdAt: new Date().toISOString()
    };
    db.customers.push(customer);
    this.saveDB(db);
    return customer;
  }

  updateCustomer(id, data) {
    const db = this.getDB();
    const index = db.customers.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Customer not found');
    db.customers[index] = { ...db.customers[index], ...data };
    this.saveDB(db);
    return db.customers[index];
  }

  // Menu
  getMenu() {
    return this.getDB().menu || [];
  }

  createMenuItem(data) {
    const db = this.getDB();
    const item = {
      id: this.generateId(),
      ...data,
      available: data.available !== undefined ? data.available : true
    };
    db.menu.push(item);
    this.saveDB(db);
    return item;
  }

  updateMenuItem(id, data) {
    const db = this.getDB();
    const index = db.menu.findIndex(m => m.id === id);
    if (index === -1) throw new Error('Menu item not found');
    db.menu[index] = { ...db.menu[index], ...data };
    this.saveDB(db);
    return db.menu[index];
  }

  deleteMenuItem(id) {
    const db = this.getDB();
    const index = db.menu.findIndex(m => m.id === id);
    if (index === -1) throw new Error('Menu item not found');
    db.menu.splice(index, 1);
    this.saveDB(db);
    return { message: 'Menu item deleted' };
  }

  // Orders
  getOrders() {
    return this.getDB().orders || [];
  }

  createOrder(data) {
    const db = this.getDB();
    const total = data.items.reduce((sum, item) => {
      const menuItem = db.menu.find(m => m.id === item.menuItemId);
      return sum + (menuItem?.price || 0) * item.quantity;
    }, 0);
    
    const order = {
      id: this.generateId(),
      ...data,
      status: data.status || 'pending',
      createdAt: new Date().toISOString(),
      total
    };
    db.orders.push(order);
    this.saveDB(db);
    return order;
  }

  updateOrder(id, data) {
    const db = this.getDB();
    const index = db.orders.findIndex(o => o.id === id);
    if (index === -1) throw new Error('Order not found');
    db.orders[index] = { ...db.orders[index], ...data };
    this.saveDB(db);
    return db.orders[index];
  }

  // Staff
  getStaff() {
    return this.getDB().staff || [];
  }

  createStaff(data) {
    const db = this.getDB();
    const staff = {
      id: this.generateId(),
      ...data,
      status: data.status || 'active'
    };
    db.staff.push(staff);
    this.saveDB(db);
    return staff;
  }

  updateStaff(id, data) {
    const db = this.getDB();
    const index = db.staff.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Staff member not found');
    db.staff[index] = { ...db.staff[index], ...data };
    this.saveDB(db);
    return db.staff[index];
  }

  // Feedback
  getFeedback() {
    return this.getDB().feedback || [];
  }

  createFeedback(data) {
    const db = this.getDB();
    const feedback = {
      id: this.generateId(),
      ...data,
      createdAt: new Date().toISOString()
    };
    db.feedback.push(feedback);
    this.saveDB(db);
    return feedback;
  }

  // Dashboard stats
  getDashboardStats() {
    const db = this.getDB();
    const today = new Date().toISOString().split('T')[0];
    
    return {
      totalBookings: db.bookings.length,
      todayBookings: db.bookings.filter(b => b.date === today).length,
      totalOrders: db.orders.length,
      todayOrders: db.orders.filter(o => o.createdAt?.split('T')[0] === today).length,
      totalRevenue: db.orders.reduce((sum, o) => sum + (o.total || 0), 0),
      todayRevenue: db.orders
        .filter(o => o.createdAt?.split('T')[0] === today)
        .reduce((sum, o) => sum + (o.total || 0), 0),
      availableTables: db.tables.filter(t => t.status === 'available').length,
      totalTables: db.tables.length,
      pendingOrders: db.orders.filter(o => o.status === 'pending').length,
      totalCustomers: db.customers.length,
      totalMenuItems: db.menu.length,
      totalStaff: db.staff.length
    };
  }
}

// Global storage instance
const storage = new Storage();
