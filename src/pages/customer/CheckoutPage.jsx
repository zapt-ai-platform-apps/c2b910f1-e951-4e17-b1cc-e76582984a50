import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useForm } from 'react-hook-form';
import { RiArrowLeftLine, RiLoader4Line } from 'react-icons/ri';
import * as Sentry from '@sentry/browser';

export default function CheckoutPage() {
  const { cart, getTotalPrice, clearCart } = useCart();
  const [deliveryMethod, setDeliveryMethod] = useState('pickup'); // 'pickup' or 'delivery'
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };
  
  // Redirect to cart if cart is empty
  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }
  
  const totalPrice = getTotalPrice();
  
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      // Prepare order data
      const orderData = {
        customerName: data.name,
        customerPhone: data.phone,
        deliveryMethod,
        address: deliveryMethod === 'delivery' ? data.address : null,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: Number(item.price),
          quantity: item.quantity
        })),
        totalAmount: totalPrice
      };
      
      // Send order to API
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create order');
      }
      
      const result = await response.json();
      
      // Clear cart and redirect to success page
      clearCart();
      navigate('/success', { 
        state: { 
          orderId: result.order.id,
          whatsappUrl: result.whatsappUrl
        } 
      });
    } catch (error) {
      console.error('Error creating order:', error);
      Sentry.captureException(error);
      alert('Erro ao criar o pedido. Por favor, tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-8">
      <div className="mb-6">
        <Link to="/cart" className="flex items-center text-primary-600 hover:text-primary-800">
          <RiArrowLeftLine className="mr-1" />
          <span>Voltar ao carrinho</span>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-card p-6">
            <h1 className="text-2xl font-bold mb-6">Finalizar Pedido</h1>
            
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Customer Info */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-4">Informações Pessoais</h2>
                
                <div className="mb-4">
                  <label htmlFor="name" className="label">Nome completo</label>
                  <input
                    id="name"
                    type="text"
                    className={`input ${errors.name ? 'border-red-500' : ''}`}
                    placeholder="Seu nome completo"
                    {...register('name', { required: 'Nome é obrigatório' })}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="phone" className="label">Telefone (WhatsApp)</label>
                  <input
                    id="phone"
                    type="tel"
                    className={`input ${errors.phone ? 'border-red-500' : ''}`}
                    placeholder="(00) 00000-0000"
                    {...register('phone', { 
                      required: 'Telefone é obrigatório',
                      pattern: {
                        value: /^[0-9]{10,11}$/,
                        message: 'Digite apenas números (DDD + número)'
                      }
                    })}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                </div>
              </div>
              
              {/* Delivery Method */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-4">Método de Entrega</h2>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <div 
                    className={`flex-1 p-4 border rounded-lg cursor-pointer transition ${
                      deliveryMethod === 'pickup' 
                        ? 'border-primary-500 bg-primary-50' 
                        : 'border-gray-300'
                    }`}
                    onClick={() => setDeliveryMethod('pickup')}
                  >
                    <div className="flex items-center mb-2">
                      <input
                        type="radio"
                        id="pickup"
                        name="deliveryMethod"
                        checked={deliveryMethod === 'pickup'}
                        onChange={() => setDeliveryMethod('pickup')}
                        className="mr-2"
                      />
                      <label htmlFor="pickup" className="font-medium">Retirada no Balcão</label>
                    </div>
                    <p className="text-sm text-gray-600">Retire seu pedido diretamente em nossa loja.</p>
                  </div>
                  
                  <div 
                    className={`flex-1 p-4 border rounded-lg cursor-pointer transition ${
                      deliveryMethod === 'delivery' 
                        ? 'border-primary-500 bg-primary-50' 
                        : 'border-gray-300'
                    }`}
                    onClick={() => setDeliveryMethod('delivery')}
                  >
                    <div className="flex items-center mb-2">
                      <input
                        type="radio"
                        id="delivery"
                        name="deliveryMethod"
                        checked={deliveryMethod === 'delivery'}
                        onChange={() => setDeliveryMethod('delivery')}
                        className="mr-2"
                      />
                      <label htmlFor="delivery" className="font-medium">Entrega</label>
                    </div>
                    <p className="text-sm text-gray-600">Receba seu pedido no conforto de sua casa.</p>
                  </div>
                </div>
              </div>
              
              {/* Address (only if delivery) */}
              {deliveryMethod === 'delivery' && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-4">Endereço de Entrega</h2>
                  
                  <div className="mb-4">
                    <label htmlFor="address" className="label">Endereço completo</label>
                    <textarea
                      id="address"
                      className={`input min-h-24 ${errors.address ? 'border-red-500' : ''}`}
                      placeholder="Rua, número, bairro, complemento, etc."
                      {...register('address', { 
                        required: deliveryMethod === 'delivery' ? 'Endereço é obrigatório para entrega' : false 
                      })}
                    />
                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
                  </div>
                </div>
              )}
              
              {/* Submit Button */}
              <div className="mt-8">
                <button
                  type="submit"
                  className="btn btn-primary w-full py-3 flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <RiLoader4Line className="animate-spin mr-2" />
                      Processando...
                    </>
                  ) : (
                    'Concluir Pedido'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-xl shadow-card p-6 sticky top-6">
            <h2 className="text-lg font-semibold mb-4">Resumo do Pedido</h2>
            
            <div className="border-t border-gray-200 pt-4">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between py-2">
                  <div>
                    <span className="font-medium">{item.quantity}x </span>
                    <span>{item.name}</span>
                  </div>
                  <span className="text-gray-800">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              
              <div className="border-t border-gray-200 pt-4 mt-2">
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}