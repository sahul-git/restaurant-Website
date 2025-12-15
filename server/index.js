const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
// Use bodyParser (variable name), not "body-parser"
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database file path
const DB_PATH = path.join(__dirname, 'data', 'database.json');

// Initialize database
async function initDatabase() {
  const dbDir = path.join(__dirname, 'data');
  try {
    await fs.mkdir(dbDir, { recursive: true });
    const dbExists = await fs.access(DB_PATH).then(() => true).catch(() => false);
    
    if (!dbExists) {
      const initialData = {
        users: [
          {
            id: '1',
            username: 'admin',
            email: 'admin@restaurant.com',
            password: await bcrypt.hash('admin123', 10),
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
      await fs.writeFile(DB_PATH, JSON.stringify(initialData, null, 2));
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Read database
async function readDB() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return null;
  }
}

// Write database
async function writeDB(data) {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing database:', error);
    return false;
  }
}

// Auth middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
}

// Initialize database on startup
initDatabase();

// ==================== AUTH ROUTES ====================
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const db = await readDB();
  
  const user = db.users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET);
  res.json({ token, user: { id: user.id, email: user.email, role: user.role, name: user.name } });
});

// ==================== TABLE ROUTES ====================
app.get('/api/tables', async (req, res) => {
  const db = await readDB();
  res.json(db.tables);
});

app.get('/api/tables/:id', async (req, res) => {
  const db = await readDB();
  const table = db.tables.find(t => t.id === req.params.id);
  if (!table) return res.status(404).json({ error: 'Table not found' });
  res.json(table);
});

app.put('/api/tables/:id', authenticateToken, async (req, res) => {
  const db = await readDB();
  const index = db.tables.findIndex(t => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Table not found' });
  
  db.tables[index] = { ...db.tables[index], ...req.body };
  await writeDB(db);
  res.json(db.tables[index]);
});

// ==================== BOOKING ROUTES ====================
app.get('/api/bookings', authenticateToken, async (req, res) => {
  const db = await readDB();
  res.json(db.bookings);
});

app.post('/api/bookings', async (req, res) => {
  const db = await readDB();
  const { customerName, customerEmail, customerPhone, tableId, date, time, guests, specialRequests } = req.body;

  const booking = {
    id: uuidv4(),
    customerName,
    customerEmail,
    customerPhone,
    tableId,
    tableNumber: db.tables.find(t => t.id === tableId)?.number,
    date,
    time,
    guests,
    specialRequests: specialRequests || '',
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };

  db.bookings.push(booking);
  
  // Update table status
  const tableIndex = db.tables.findIndex(t => t.id === tableId);
  if (tableIndex !== -1) {
    db.tables[tableIndex].status = 'reserved';
  }

  await writeDB(db);
  res.status(201).json(booking);
});

app.put('/api/bookings/:id', authenticateToken, async (req, res) => {
  const db = await readDB();
  const index = db.bookings.findIndex(b => b.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Booking not found' });

  const oldTableId = db.bookings[index].tableId;
  db.bookings[index] = { ...db.bookings[index], ...req.body };

  // Update table statuses
  if (req.body.tableId && req.body.tableId !== oldTableId) {
    const oldTableIndex = db.tables.findIndex(t => t.id === oldTableId);
    if (oldTableIndex !== -1) db.tables[oldTableIndex].status = 'available';
    
    const newTableIndex = db.tables.findIndex(t => t.id === req.body.tableId);
    if (newTableIndex !== -1) db.tables[newTableIndex].status = 'reserved';
  }

  await writeDB(db);
  res.json(db.bookings[index]);
});

app.delete('/api/bookings/:id', authenticateToken, async (req, res) => {
  const db = await readDB();
  const index = db.bookings.findIndex(b => b.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Booking not found' });

  const booking = db.bookings[index];
  const tableIndex = db.tables.findIndex(t => t.id === booking.tableId);
  if (tableIndex !== -1) {
    db.tables[tableIndex].status = 'available';
  }

  db.bookings.splice(index, 1);
  await writeDB(db);
  res.json({ message: 'Booking deleted' });
});

// ==================== CUSTOMER ROUTES ====================
app.get('/api/customers', authenticateToken, async (req, res) => {
  const db = await readDB();
  res.json(db.customers);
});

app.post('/api/customers', authenticateToken, async (req, res) => {
  const db = await readDB();
  const customer = {
    id: uuidv4(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  db.customers.push(customer);
  await writeDB(db);
  res.status(201).json(customer);
});

app.put('/api/customers/:id', authenticateToken, async (req, res) => {
  const db = await readDB();
  const index = db.customers.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Customer not found' });
  
  db.customers[index] = { ...db.customers[index], ...req.body };
  await writeDB(db);
  res.json(db.customers[index]);
});

// ==================== MENU ROUTES ====================
app.get('/api/menu', async (req, res) => {
  const db = await readDB();
  res.json(db.menu);
});

app.post('/api/menu', authenticateToken, async (req, res) => {
  const db = await readDB();
  const item = {
    id: uuidv4(),
    ...req.body,
    available: req.body.available !== undefined ? req.body.available : true
  };
  db.menu.push(item);
  await writeDB(db);
  res.status(201).json(item);
});

app.put('/api/menu/:id', authenticateToken, async (req, res) => {
  const db = await readDB();
  const index = db.menu.findIndex(m => m.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Menu item not found' });
  
  db.menu[index] = { ...db.menu[index], ...req.body };
  await writeDB(db);
  res.json(db.menu[index]);
});

app.delete('/api/menu/:id', authenticateToken, async (req, res) => {
  const db = await readDB();
  const index = db.menu.findIndex(m => m.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Menu item not found' });
  
  db.menu.splice(index, 1);
  await writeDB(db);
  res.json({ message: 'Menu item deleted' });
});

// ==================== ORDER ROUTES ====================
app.get('/api/orders', authenticateToken, async (req, res) => {
  const db = await readDB();
  res.json(db.orders);
});

app.post('/api/orders', authenticateToken, async (req, res) => {
  const db = await readDB();
  const order = {
    id: uuidv4(),
    ...req.body,
    status: req.body.status || 'pending',
    createdAt: new Date().toISOString(),
    total: req.body.items.reduce((sum, item) => {
      const menuItem = db.menu.find(m => m.id === item.menuItemId);
      return sum + (menuItem?.price || 0) * item.quantity;
    }, 0)
  };
  db.orders.push(order);
  await writeDB(db);
  res.status(201).json(order);
});

app.put('/api/orders/:id', authenticateToken, async (req, res) => {
  const db = await readDB();
  const index = db.orders.findIndex(o => o.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Order not found' });
  
  db.orders[index] = { ...db.orders[index], ...req.body };
  await writeDB(db);
  res.json(db.orders[index]);
});

// ==================== STAFF ROUTES ====================
app.get('/api/staff', authenticateToken, async (req, res) => {
  const db = await readDB();
  res.json(db.staff);
});

app.post('/api/staff', authenticateToken, async (req, res) => {
  const db = await readDB();
  const staff = {
    id: uuidv4(),
    ...req.body,
    status: req.body.status || 'active'
  };
  db.staff.push(staff);
  await writeDB(db);
  res.status(201).json(staff);
});

app.put('/api/staff/:id', authenticateToken, async (req, res) => {
  const db = await readDB();
  const index = db.staff.findIndex(s => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Staff member not found' });
  
  db.staff[index] = { ...db.staff[index], ...req.body };
  await writeDB(db);
  res.json(db.staff[index]);
});

// ==================== FEEDBACK ROUTES ====================
app.get('/api/feedback', authenticateToken, async (req, res) => {
  const db = await readDB();
  res.json(db.feedback);
});

app.post('/api/feedback', async (req, res) => {
  const db = await readDB();
  const feedback = {
    id: uuidv4(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  db.feedback.push(feedback);
  await writeDB(db);
  res.status(201).json(feedback);
});

// ==================== DASHBOARD STATS ====================
app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
  const db = await readDB();
  const today = new Date().toISOString().split('T')[0];
  
  const stats = {
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
  
  res.json(stats);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

