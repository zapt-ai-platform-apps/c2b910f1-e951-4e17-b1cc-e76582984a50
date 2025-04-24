import React, { useState, useEffect } from 'react';
import { RiLoader4Line, RiRefreshLine } from 'react-icons/ri';
import * as Sentry from '@sentry/browser';
import toast from 'react-hot-toast';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/orders');
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      setOrders(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching orders:', err);
      Sentry.captureException(err);
      setError(err.message);
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchOrders();
    
    // Refresh orders every 60 seconds
    const interval = setInterval(() => {
      fetchOrders();
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: orderId, status: newStatus })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update order status');
      }
      
      // Update local state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      
      toast.success(`Status atualizado: ${getStatusText(newStatus)}`);
    } catch (err) {
      console.error('Error updating order status:', err);
      Sentry.captureException(err);
      toast.error(`Erro ao atualizar status: ${err.message}`);
    }
  };
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'preparing': return 'Em preparo';
      case 'ready': return 'Pronto';
      case 'delivered': return 'Entregue';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <RiLoader4Line className="text-primary-600 text-4xl animate-spin mb-4" />
        <p className="text-gray-600">Carregando pedidos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <p>Erro ao carregar pedidos: {error}</p>
        <button 
          onClick={fetchOrders}
          className="mt-2 text-sm font-medium text-red-700 hover:text-red-800"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pedidos</h1>
        <button
          onClick={fetchOrders}
          className="btn btn-secondary flex items-center"
          disabled={loading}
        >
          {loading ? (
            <RiLoader4Line className="animate-spin mr-1" />
          ) : (
            <RiRefreshLine className="mr-1" />
          )}
          Atualizar
        </button>
      </div>
      
      {orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-card p-8 text-center">
          <p className="text-gray-600">Nenhum pedido encontrado.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-xl shadow-card overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <div className="flex items-center space-x-3">
                    <h2 className="font-semibold text-lg">Pedido #{order.id}</h2>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{formatDate(order.createdAt)}</p>
                </div>
                
                <div className="mt-2 sm:mt-0 flex items-center space-x-2">
                  <label htmlFor={`status-${order.id}`} className="text-sm font-medium">
                    Status:
                  </label>
                  <select
                    id={`status-${order.id}`}
                    className="input py-1 px-2 text-sm"
                    value={order.status}
                    onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                  >
                    <option value="pending">Pendente</option>
                    <option value="preparing">Em preparo</option>
                    <option value="ready">Pronto</option>
                    <option value="delivered">Entregue</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Informações do Cliente</h3>
                    <p className="mb-1"><span className="font-medium">Nome:</span> {order.customerName}</p>
                    <p className="mb-1"><span className="font-medium">Telefone:</span> {order.customerPhone}</p>
                    <p className="mb-1">
                      <span className="font-medium">Método:</span> {order.deliveryMethod === 'delivery' ? 'Entrega' : 'Retirada'}
                    </p>
                    {order.deliveryMethod === 'delivery' && order.address && (
                      <p className="mb-1"><span className="font-medium">Endereço:</span> {order.address}</p>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Resumo do Pedido</h3>
                    <div className="space-y-2 mb-4">
                      {JSON.parse(order.items).map((item, index) => (
                        <div key={index} className="flex justify-between">
                          <span>{item.quantity}x {item.name}</span>
                          <span>{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-2 border-t border-gray-200 flex justify-between font-bold">
                      <span>Total</span>
                      <span>{formatPrice(order.totalAmount)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 text-right">
                  <a
                    href={`https://wa.me/${order.customerPhone}?text=Olá, ${order.customerName}! Seu pedido #${order.id} está sendo processado.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-success"
                  >
                    Enviar Mensagem no WhatsApp
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}