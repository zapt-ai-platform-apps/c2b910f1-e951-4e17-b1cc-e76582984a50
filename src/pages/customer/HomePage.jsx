import React, { useState, useEffect } from 'react';
import ProductCard from '@/components/customer/ProductCard';
import CategoryFilter from '@/components/customer/CategoryFilter';
import { RiLoader4Line } from 'react-icons/ri';
import * as Sentry from '@sentry/browser';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories and products on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories
        const categoriesResponse = await fetch('/api/categories');
        if (!categoriesResponse.ok) {
          throw new Error('Failed to fetch categories');
        }
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);
        
        // Fetch products
        const productsResponse = await fetch('/api/products');
        if (!productsResponse.ok) {
          throw new Error('Failed to fetch products');
        }
        const productsData = await productsResponse.json();
        setProducts(productsData);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching menu data:', err);
        Sentry.captureException(err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Filter products by selected category
  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(product => product.categoryId === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <RiLoader4Line className="text-primary-600 text-4xl animate-spin mb-4" />
        <p className="text-gray-600">Carregando cardápio...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <p className="text-red-600 mb-4">Erro ao carregar o cardápio: {error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="btn btn-primary"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="container-fluid py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Cardápio Digital</h1>
        <p className="text-gray-600">Escolha o seu pedido e receba em casa ou retire no balcão!</p>
      </div>
      
      {/* Category Filter */}
      <CategoryFilter 
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      
      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="product-grid">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">Nenhum produto encontrado nesta categoria.</p>
        </div>
      )}
    </div>
  );
}