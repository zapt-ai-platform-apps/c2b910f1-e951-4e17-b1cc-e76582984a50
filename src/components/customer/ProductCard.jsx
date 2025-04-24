import React from 'react';
import { useCart } from '@/context/CartContext';
import { RiAddLine } from 'react-icons/ri';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  
  const handleAddToCart = () => {
    addToCart(product, 1);
    toast.success(`${product.name} adicionado ao carrinho!`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <div className="card group">
      {/* Product Image */}
      <div className="relative aspect-video mb-3 overflow-hidden rounded-lg bg-gray-200">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
            Sem imagem
          </div>
        )}
        
        {product.isCombo && (
          <span className="absolute top-2 left-2 badge badge-primary">
            Combo
          </span>
        )}
      </div>
      
      {/* Product Info */}
      <div>
        <h3 className="text-lg font-semibold mb-1 line-clamp-1">{product.name}</h3>
        
        {product.description && (
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
        )}
        
        <div className="flex items-center justify-between mt-2">
          <span className="text-lg font-bold text-primary-600">{formatPrice(product.price)}</span>
          
          <button 
            onClick={handleAddToCart}
            className="bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 transition cursor-pointer"
          >
            <RiAddLine size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}