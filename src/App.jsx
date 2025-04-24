import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CustomerLayout from '@/layouts/CustomerLayout';
import AdminLayout from '@/layouts/AdminLayout';
import HomePage from '@/pages/customer/HomePage';
import CartPage from '@/pages/customer/CartPage';
import CheckoutPage from '@/pages/customer/CheckoutPage';
import OrderSuccessPage from '@/pages/customer/OrderSuccessPage';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminProducts from '@/pages/admin/AdminProducts';
import AdminProductForm from '@/pages/admin/AdminProductForm';
import AdminOrders from '@/pages/admin/AdminOrders';
import AdminLogin from '@/pages/admin/AdminLogin';
import NotFound from '@/pages/NotFound';
import { CartProvider } from '@/context/CartContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <CartProvider>
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={<CustomerLayout />}>
            <Route index element={<HomePage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="success" element={<OrderSuccessPage />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/new" element={<AdminProductForm />} />
            <Route path="products/edit/:id" element={<AdminProductForm />} />
            <Route path="orders" element={<AdminOrders />} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </CartProvider>
    </div>
  );
}