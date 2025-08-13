import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ServiceInfoProvider } from './contexts/ServiceInfoContext';

// Customer Pages
import HomePage from './pages/customer/HomePage';
import ProductListingPage from './pages/customer/ProductListingPage';
import ProductDetailsPage from './pages/customer/ProductDetailsPage';
import CartPage from './pages/customer/CartPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import OrderConfirmationPage from './pages/customer/OrderConfirmationPage';
import LoginPage from './pages/customer/LoginPage';
import SignupPage from './pages/customer/SignupPage';
import UserProfilePage from './pages/customer/UserProfilePage';
import OrderTrackingPage from './pages/customer/OrderTrackingPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductManagement from './pages/admin/ProductManagement';
import OrderManagement from './pages/admin/OrderManagement';
import InventoryPage from './pages/admin/InventoryPage';
import UserManagement from './pages/admin/UserManagement';
import EmailManagement from './pages/admin/EmailManagement';

// Layout Components
import CustomerLayout from './components/layout/CustomerLayout';
import AdminLayout from './components/layout/AdminLayout';

// Protected Route Component
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <HelmetProvider>
      <ServiceInfoProvider>
        <AuthProvider>
          <CartProvider>
            <Router>
            <div className="App">
              <Routes>
                {/* Customer Routes */}
                <Route path="/" element={<CustomerLayout />}>
                  <Route index element={<HomePage />} />
                  <Route path="products" element={<ProductListingPage />} />
                  <Route path="products/:category" element={<ProductListingPage />} />
                  <Route path="product/:id" element={<ProductDetailsPage />} />
                  <Route path="cart" element={<CartPage />} />
                  <Route path="checkout" element={
                    <ProtectedRoute>
                      <CheckoutPage />
                    </ProtectedRoute>
                  } />
                  <Route path="order-confirmation/:orderId" element={
                    <ProtectedRoute>
                      <OrderConfirmationPage />
                    </ProtectedRoute>
                  } />
                  <Route path="profile" element={
                    <ProtectedRoute>
                      <UserProfilePage />
                    </ProtectedRoute>
                  } />
                  <Route path="track-order" element={<OrderTrackingPage />} />
                </Route>
                
                {/* Auth Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                
                {/* Admin Routes */}
                <Route path="/admin" element={
                  <ProtectedRoute adminOnly>
                    <AdminLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<ProductManagement />} />
                  <Route path="orders" element={<OrderManagement />} />
                  <Route path="inventory" element={<InventoryPage />} />
                  <Route path="users" element={<UserManagement />} />
                  <Route path="emails" element={<EmailManagement />} />
                </Route>
              </Routes>
              
              {/* Global Toast Notifications */}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  success: {
                    duration: 3000,
                    theme: {
                      primary: '#10b981',
                      secondary: 'black',
                    },
                  },
                }}
              />
            </div>
            </Router>
          </CartProvider>
        </AuthProvider>
      </ServiceInfoProvider>
    </HelmetProvider>
  );
}

export default App;