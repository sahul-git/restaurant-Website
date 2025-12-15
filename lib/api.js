const API_URL = (typeof window !== 'undefined' 
  ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api')
  : 'http://localhost:5000/api')

async function fetchAPI(endpoint, options = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  if (options.body) {
    config.body = JSON.stringify(options.body)
  }

  const response = await fetch(`${API_URL}${endpoint}`, config)
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(error.error || 'Request failed')
  }

  return response.json()
}

export const api = {
  // Auth
  login: (email, password) => fetchAPI('/auth/login', {
    method: 'POST',
    body: { email, password },
  }),

  // Tables
  getTables: () => fetchAPI('/tables'),
  getTable: (id) => fetchAPI(`/tables/${id}`),
  updateTable: (id, data) => fetchAPI(`/tables/${id}`, {
    method: 'PUT',
    body: data,
  }),

  // Bookings
  getBookings: () => fetchAPI('/bookings'),
  createBooking: (data) => fetchAPI('/bookings', {
    method: 'POST',
    body: data,
  }),
  updateBooking: (id, data) => fetchAPI(`/bookings/${id}`, {
    method: 'PUT',
    body: data,
  }),
  deleteBooking: (id) => fetchAPI(`/bookings/${id}`, {
    method: 'DELETE',
  }),

  // Customers
  getCustomers: () => fetchAPI('/customers'),
  createCustomer: (data) => fetchAPI('/customers', {
    method: 'POST',
    body: data,
  }),
  updateCustomer: (id, data) => fetchAPI(`/customers/${id}`, {
    method: 'PUT',
    body: data,
  }),

  // Menu
  getMenu: () => fetchAPI('/menu'),
  createMenuItem: (data) => fetchAPI('/menu', {
    method: 'POST',
    body: data,
  }),
  updateMenuItem: (id, data) => fetchAPI(`/menu/${id}`, {
    method: 'PUT',
    body: data,
  }),
  deleteMenuItem: (id) => fetchAPI(`/menu/${id}`, {
    method: 'DELETE',
  }),

  // Orders
  getOrders: () => fetchAPI('/orders'),
  createOrder: (data) => fetchAPI('/orders', {
    method: 'POST',
    body: data,
  }),
  updateOrder: (id, data) => fetchAPI(`/orders/${id}`, {
    method: 'PUT',
    body: data,
  }),

  // Staff
  getStaff: () => fetchAPI('/staff'),
  createStaff: (data) => fetchAPI('/staff', {
    method: 'POST',
    body: data,
  }),
  updateStaff: (id, data) => fetchAPI(`/staff/${id}`, {
    method: 'PUT',
    body: data,
  }),

  // Feedback
  getFeedback: () => fetchAPI('/feedback'),
  createFeedback: (data) => fetchAPI('/feedback', {
    method: 'POST',
    body: data,
  }),

  // Dashboard
  getDashboardStats: () => fetchAPI('/dashboard/stats'),
}

