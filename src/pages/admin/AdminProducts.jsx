import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RiAddLine, RiLoader4Line, RiPencilLine, RiDeleteBin6Line } from 'react-icons/ri';
import * as Sentry from '@sentry/browser';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchProducts = async () => {
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
      console.error('Error fetching products:', err);
      Sentry.captureException(err);
      setError(err.message);
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProducts();
  }, []);
  
  const handleDeleteProduct = async (id, name) => {
    if (window.confirm(`Tem certeza que deseja excluir "${name}"?`)) {
      try {
        const response = await fetch('/api/products', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id })
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete product');
        }
        
        // Remove product from state
        setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
        toast.success(`${name} foi excluído com sucesso`);
      } catch (err) {
        console.error('Error deleting product:', err);
        Sentry.captureException(err);
        toast.error(`Erro ao excluir produto: ${err.message}`);
      }
    }
  };
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };
  
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Sem categoria';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <RiLoader4Line className="text-primary-600 text-4xl animate-spin mb-4" />
        <p className="text-gray-600">Carregando produtos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <p>Erro ao carregar produtos: {error}</p>
        <button 
          onClick={() => fetchProducts()}
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
        <h1 className="text-2xl font-bold">Produtos</h1>
        <Link
          to="/admin/products/new"
          className="btn btn-primary flex items-center"
        >
          <RiAddLine className="mr-1" />
          Novo Produto
        </Link>
      </div>
      
      {products.length === 0 ? (
        <div className="bg-white rounded-xl shadow-card p-8 text-center">
          <p className="text-gray-600 mb-4">Nenhum produto cadastrado ainda.</p>
          <Link
            to="/admin/products/new"
            className="btn btn-primary inline-flex items-center"
          >
            <RiAddLine className="mr-1" />
            Adicionar Produto
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 rounded bg-gray-200 overflow-hidden">
                          {product.imageUrl ? (
                            <img src={product.imageUrl} alt={product.name} className="h-10 w-10 object-cover" />
                          ) : (
                            <div className="h-10 w-10 flex items-center justify-center text-gray-400 text-xs">
                              Sem imagem
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{getCategoryName(product.categoryId)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatPrice(product.price)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.isCombo ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800">
                          Combo
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          Produto
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/admin/products/edit/${product.id}`}
                        className="text-primary-600 hover:text-primary-900 mr-3"
                      >
                        <RiPencilLine className="inline" /> Editar
                      </Link>
                      <button
                        onClick={() => handleDeleteProduct(product.id, product.name)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <RiDeleteBin6Line className="inline" /> Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}