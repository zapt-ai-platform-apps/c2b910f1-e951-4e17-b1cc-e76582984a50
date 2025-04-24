import React from 'react';
import { useCart } from '@/context/CartContext';
import { RiAddLine, RiSubtractLine, RiDeleteBin6Line } from 'react-icons/ri';

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <div className="flex items-center py-4 border-b border-gray-200">
      {/* Product Image */}
      <div className="w-20 h-20 rounded-md bg-gray-200 overflow-hidden mr-4">
        {item.imageUrl ? (
          <img 
            src={item.imageUrl} 
            alt={item.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
            Sem imagem
          </div>
        )}
      </div>
      
      {/* Product Details */}
      <div className="flex-1">
        <h3 className="font-medium">{item.name}</h3>
        <p className="text-gray-600 text-sm">{formatPrice(item.price)} cada</p>
      </div>
      
      {/* Quantity Controls */}
      <div className="flex items-center space-x-2">
        <button 
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          className="p-1 bg-gray-200 rounded-full text-gray-700 hover:bg-gray-300 transition cursor-pointer"
        >
          <RiSubtractLine size={16} />
        </button>
        
        <span className="w-8 text-center">{item.quantity}</span>
        
        <button 
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          className="p-1 bg-gray-200 rounded-full text-gray-700 hover:bg-gray-300 transition cursor-pointer"
        >
          <RiAddLine size={16} />
        </button>
      </div>
      
      {/* Total Price */}
      <div className="ml-4 mr-2 text-right min-w-20">
        <p className="font-semibold">
          {formatPrice(item.price * item.quantity)}
        </p>
      </div>
      
      {/* Delete Button */}
      <button 
        onClick={() => removeFromCart(item.id)}
        className="ml-2 p-2 text-gray-600 hover:text-red-600 transition cursor-pointer"
      >
        <RiDeleteBin6Line size={20} />
      </button>
    </div>
  );
}