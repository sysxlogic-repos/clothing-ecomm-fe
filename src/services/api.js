import axios from 'axios';

// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper function to get service information
const getServiceInfo = (endpoint) => {
  const serviceMap = {
    '/auth': {
      name: 'Authentication Service',
      description: 'Handles user login, signup, and token verification',
      connectionSteps: [
        '1. Ensure backend authentication service is running on port 8080',
        '2. Verify JWT token configuration in environment variables',
        '3. Check database connection for user credentials storage',
        '4. Confirm OTP service integration (SMS/Email provider)'
      ]
    },
    '/products': {
      name: 'Product Catalog Service',
      description: 'Manages product information, categories, and inventory',
      connectionSteps: [
        '1. Start product microservice on designated port',
        '2. Connect to product database (MongoDB/PostgreSQL)',
        '3. Verify image storage service (AWS S3/CloudFront)',
        '4. Check search engine integration (Elasticsearch)'
      ]
    },
    '/orders': {
      name: 'Order Management Service',
      description: 'Processes orders, tracking, and order history',
      connectionSteps: [
        '1. Launch order processing service',
        '2. Connect to orders database',
        '3. Verify payment gateway integration',
        '4. Check shipping provider API connections'
      ]
    },
    '/payments': {
      name: 'Payment Processing Service',
      description: 'Handles payment transactions and refunds',
      connectionSteps: [
        '1. Configure payment gateway (Stripe/PayPal)',
        '2. Set up webhook endpoints for payment events',
        '3. Verify SSL certificates for secure transactions',
        '4. Test payment provider API credentials'
      ]
    },
    '/cart': {
      name: 'Shopping Cart Service',
      description: 'Manages user shopping cart and session data',
      connectionSteps: [
        '1. Start cart service with Redis/session storage',
        '2. Configure session timeout settings',
        '3. Verify user authentication integration',
        '4. Check cart persistence database connection'
      ]
    },
    '/users': {
      name: 'User Management Service',
      description: 'Handles user profiles and administrative functions',
      connectionSteps: [
        '1. Start user management microservice',
        '2. Connect to user database',
        '3. Verify role-based access control (RBAC)',
        '4. Check email notification service integration'
      ]
    },
    '/inventory': {
      name: 'Inventory Management Service',
      description: 'Tracks stock levels and inventory updates',
      connectionSteps: [
        '1. Launch inventory tracking service',
        '2. Connect to inventory database',
        '3. Set up real-time stock update webhooks',
        '4. Configure low-stock alert notifications'
      ]
    },
    '/emails': {
      name: 'Email Notification Service',
      description: 'Sends transactional and marketing emails',
      connectionSteps: [
        '1. Configure email service provider (SendGrid/AWS SES)',
        '2. Set up email templates and SMTP settings',
        '3. Verify domain authentication (SPF/DKIM)',
        '4. Test email delivery and bounce handling'
      ]
    },
    '/analytics': {
      name: 'Analytics & Reporting Service',
      description: 'Provides business intelligence and metrics',
      connectionSteps: [
        '1. Start analytics data processing service',
        '2. Connect to analytics database (ClickHouse/BigQuery)',
        '3. Set up data pipeline and ETL processes',
        '4. Configure real-time dashboard updates'
      ]
    },
    '/wishlist': {
      name: 'Wishlist Service',
      description: 'Manages user wishlists and favorites',
      connectionSteps: [
        '1. Start wishlist microservice',
        '2. Connect to user preferences database',
        '3. Verify user authentication integration',
        '4. Set up wishlist sharing functionality'
      ]
    },
    '/reviews': {
      name: 'Review & Rating Service',
      description: 'Handles product reviews and ratings',
      connectionSteps: [
        '1. Launch review management service',
        '2. Connect to reviews database',
        '3. Set up content moderation system',
        '4. Configure review notification system'
      ]
    },
    '/coupons': {
      name: 'Coupon & Discount Service',
      description: 'Manages promotional codes and discounts',
      connectionSteps: [
        '1. Start coupon validation service',
        '2. Connect to promotions database',
        '3. Set up usage tracking and limits',
        '4. Configure expiration and validation rules'
      ]
    }
  };

  // Find matching service based on endpoint
  for (const [path, info] of Object.entries(serviceMap)) {
    if (endpoint.includes(path)) {
      return info;
    }
  }

  return {
    name: 'Backend API Service',
    description: 'General backend service',
    connectionSteps: [
      '1. Ensure backend server is running',
      '2. Check network connectivity',
      '3. Verify API endpoint configuration',
      '4. Confirm service dependencies are available'
    ]
  };
};

// Response interceptor for service information display
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const endpoint = error.config?.url || '';
    const serviceInfo = getServiceInfo(endpoint);
    
    // Create informative message instead of error
    const serviceMessage = {
      serviceName: serviceInfo.name,
      description: serviceInfo.description,
      connectionSteps: serviceInfo.connectionSteps,
      endpoint: `${API_BASE_URL}${endpoint}`,
      timestamp: new Date().toISOString(),
      originalError: error.message
    };

    console.log('🔌 Service Connection Info:', serviceMessage);
    
    // Optionally, you can log the error or handle it silently here instead of showing modal or toast.
    // Removed modal and toast triggers for service info.

    // Handle authentication specifically
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    // Return a generic error response instead of service info modal and mock data
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  sendOTP: (data) => api.post('/users/otp', data),
  login: (data) => api.post('/auth/login', data),
  signup: (data) => api.post('/users/register', data),
  verifyToken: (token) => api.get('/auth/verify', {
    headers: { Authorization: `Bearer ${token}` }
  }),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

// Products API
export const productsAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  getByCategory: (category, params) => api.get(`/products/category/${category}`, { params }),
  getFeatured: () => api.get('/products/featured'),
  getBestSellers: () => api.get('/products/best-sellers'),
  getNewArrivals: () => api.get('/products/new-arrivals'),
  search: (query, params) => api.get('/products/search', { params: { q: query, ...params } }),
  getCategories: () => api.get('/products/categories'),
  getFilters: () => api.get('/products/filters'),
  
  // Admin endpoints
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  updateStock: (id, stock) => api.patch(`/products/${id}/stock`, { stock }),
};

// Orders API
export const ordersAPI = {
  create: (data) => api.post('/orders', data),
  getById: (id) => api.get(`/orders/${id}`),
  getUserOrders: (userId) => api.get(`/orders/user/${userId}`),
  trackOrder: (orderId) => api.get(`/orders/${orderId}/track`),
  
  // Admin endpoints
  getAll: (params) => api.get('/orders', { params }),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
  getOrderStats: () => api.get('/orders/stats'),
};

// Cart API (if using server-side cart)
export const cartAPI = {
  get: () => api.get('/cart'),
  add: (data) => api.post('/cart/items', data),
  update: (itemId, data) => api.put(`/cart/items/${itemId}`, data),
  remove: (itemId) => api.delete(`/cart/items/${itemId}`),
  clear: () => api.delete('/cart'),
};

// Payment API
export const paymentAPI = {
  createPaymentIntent: (data) => api.post('/payments/create-intent', data),
  confirmPayment: (data) => api.post('/payments/confirm', data),
  getPaymentMethods: () => api.get('/payments/methods'),
  refund: (paymentId, amount) => api.post(`/payments/${paymentId}/refund`, { amount }),
};

// Users API (Admin)
export const usersAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  getUserStats: () => api.get('/users/stats'),
};

// Inventory API
export const inventoryAPI = {
  getAll: (params) => api.get('/inventory', { params }),
  getById: (id) => api.get(`/inventory/${id}`),
  update: (id, data) => api.put(`/inventory/${id}`, data),
  getLowStock: () => api.get('/inventory/low-stock'),
  getStockAlerts: () => api.get('/inventory/alerts'),
};

// Email API
export const emailAPI = {
  sendOrderConfirmation: (orderId) => api.post(`/emails/order-confirmation/${orderId}`),
  sendPaymentConfirmation: (paymentId) => api.post(`/emails/payment-confirmation/${paymentId}`),
  sendShippingNotification: (orderId) => api.post(`/emails/shipping-notification/${orderId}`),
  sendCustomEmail: (data) => api.post('/emails/custom', data),
  getEmailTemplates: () => api.get('/emails/templates'),
  updateEmailTemplate: (id, data) => api.put(`/emails/templates/${id}`, data),
};

// Analytics API
export const analyticsAPI = {
  getDashboardStats: () => api.get('/analytics/dashboard'),
  getSalesData: (period) => api.get(`/analytics/sales/${period}`),
  getTopProducts: (limit = 10) => api.get(`/analytics/top-products?limit=${limit}`),
  getCustomerInsights: () => api.get('/analytics/customers'),
  getRevenueData: (period) => api.get(`/analytics/revenue/${period}`),
};

// Wishlist API
export const wishlistAPI = {
  get: () => api.get('/wishlist'),
  add: (productId) => api.post('/wishlist', { productId }),
  remove: (productId) => api.delete(`/wishlist/${productId}`),
  clear: () => api.delete('/wishlist'),
};

// Reviews API
export const reviewsAPI = {
  getByProduct: (productId) => api.get(`/reviews/product/${productId}`),
  create: (data) => api.post('/reviews', data),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  delete: (id) => api.delete(`/reviews/${id}`),
  getAll: (params) => api.get('/reviews', { params }),
};

// Coupons API
export const couponsAPI = {
  validate: (code) => api.post('/coupons/validate', { code }),
  apply: (code, orderData) => api.post('/coupons/apply', { code, ...orderData }),
  
  // Admin endpoints
  getAll: (params) => api.get('/coupons', { params }),
  create: (data) => api.post('/coupons', data),
  update: (id, data) => api.put(`/coupons/${id}`, data),
  delete: (id) => api.delete(`/coupons/${id}`),
};

export default api;