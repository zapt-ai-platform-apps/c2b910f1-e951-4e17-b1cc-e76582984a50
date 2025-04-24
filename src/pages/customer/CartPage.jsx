import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import CartItem from '@/components/customer/CartItem';
import { RiArrowLeftLine, RiShoppingCart2Line } from 'react-icons/ri';

export default function CartPage() {
  const { cart, clearCart, getTotalPrice } = useCart();
  const navigate = useNavigate();
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };
  
  const totalPrice = getTotalPrice();

  // Empty cart view
  if (cart.length === 0) {
    return (
      <div className="container-fluid py-8">
        <div className="flex flex-col items-center justify-center py-16">
          <RiShoppingCart2Line className="text-gray-400 text-6xl mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Seu carrinho está vazio</h2>
          <p className="text-gray-600 mb-6">Adicione itens ao seu carrinho para continuar.</p>
          <Link to="/" className="btn btn-primary">
            Ver cardápio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Seu Carrinho</h1>
        <Link to="/" className="flex items-center text-primary-600 hover:text-primary-800">
          <RiArrowLeftLine className="mr-1" />
          <span>Continuar comprando</span>
        </Link>
      </div>
      
      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        {/* Cart Items */}
        <div className="p-6">
          <div className="mb-2 pb-2 border-b border-gray-200 flex justify-between items-center">
            <h2 className="font-semibold">Itens do Pedido</h2>
            <button 
              onClick={clearCart}
              className="text-red-600 hover:text-red-800 text-sm cursor-pointer"
            >
              Limpar carrinho
            </button>
          </div>
          
          <div>
            {cart.map(item => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
        </div>
        
        {/* Cart Summary */}
        <div className="bg-gray-50 p-6 border-t border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-xl font-bold">{formatPrice(totalPrice)}</span>
          </div>
          
          <button
            onClick={() => navigate('/checkout')}
            className="btn btn-primary w-full py-3"
          >
            Finalizar pedido
          </button>
        </div>
      </div>
    </div>
  );
}