import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RiStore2Line, RiFileList3Line, RiLoader4Line } from 'react-icons/ri';
import * as Sentry from '@sentry/browser';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    productCount: 0,
    orderCount: 0,
    pendingOrders: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch products
        const productsResponse = await fetch('/api/products');
        if (!productsResponse.ok) {
          throw new Error('Failed to fetch products');
        }
        const productsData = await productsResponse.json();
        
        // Fetch orders
        const ordersResponse = await fetch('/api/orders');
        if (!ordersResponse.ok) {
          throw new Error('Failed to fetch orders');
        }
        const ordersData = await ordersResponse.json();
        
        // Calculate stats
        const pendingOrders = ordersData.filter(order => 
          order.status === 'pending' || order.status === 'preparing'
        ).length;
        
        setStats({
          productCount: productsData.length,
          orderCount: ordersData.length,
          pendingOrders
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        Sentry.captureException(err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <RiLoader4Line className="text-primary-600 text-4xl animate-spin mb-4" />
        <p className="text-gray-600">Carregando informações...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <p>Erro ao carregar o dashboard: {error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 text-sm font-medium text-red-700 hover:text-red-800"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Total de Produtos</h3>
              <p className="text-3xl font-bold mt-2">{stats.productCount}</p>
            </div>
            <div className="bg-primary-100 p-4 rounded-full">
              <RiStore2Line className="text-primary-600 text-2xl" />
            </div>
          </div>
          <div className="mt-4">
            <Link 
              to="/admin/products" 
              className="text-primary-600 hover:text-primary-800 font-medium text-sm"
            >
              Ver produtos →
            </Link>
          </div>
        </div>
        
        <div className="card">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Total de Pedidos</h3>
              <p className="text-3xl font-bold mt-2">{stats.orderCount}</p>
            </div>
            <div className="bg-blue-100 p-4 rounded-full">
              <RiFileList3Line className="text-blue-600 text-2xl" />
            </div>
          </div>
          <div className="mt-4">
            <Link 
              to="/admin/orders" 
              className="text-primary-600 hover:text-primary-800 font-medium text-sm"
            >
              Ver pedidos →
            </Link>
          </div>
        </div>
        
        <div className="card">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Pedidos Pendentes</h3>
              <p className="text-3xl font-bold mt-2">{stats.pendingOrders}</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-full">
              <RiFileList3Line className="text-yellow-600 text-2xl" />
            </div>
          </div>
          <div className="mt-4">
            <Link 
              to="/admin/orders" 
              className="text-primary-600 hover:text-primary-800 font-medium text-sm"
            >
              Ver pedidos pendentes →
            </Link>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/admin/products/new"
            className="btn btn-primary flex items-center justify-center"
          >
            Adicionar Novo Produto
          </Link>
          <Link
            to="/admin/orders"
            className="btn btn-secondary flex items-center justify-center"
          >
            Gerenciar Pedidos
          </Link>
        </div>
      </div>
    </div>
  );
}