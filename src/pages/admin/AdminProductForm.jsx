import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { RiArrowLeftLine, RiLoader4Line, RiSaveLine, RiImageAddLine } from 'react-icons/ri';
import * as Sentry from '@sentry/browser';
import toast from 'react-hot-toast';

export default function AdminProductForm() {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [imagePreview, setImagePreview] = useState(null);
  
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();
  
  // Fetch categories and product data if editing
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await fetch('/api/categories');
        if (!categoriesResponse.ok) {
          throw new Error('Failed to fetch categories');
        }
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);
        
        // If editing, fetch product data
        if (isEditing) {
          const productsResponse = await fetch('/api/products');
          if (!productsResponse.ok) {
            throw new Error('Failed to fetch products');
          }
          const productsData = await productsResponse.json();
          const product = productsData.find(p => p.id === Number(id));
          
          if (!product) {
            toast.error('Produto não encontrado');
            navigate('/admin/products');
            return;
          }
          
          // Set form values
          reset({
            name: product.name,
            description: product.description || '',
            price: product.price,
            imageUrl: product.imageUrl || '',
            categoryId: product.categoryId || '',
            isCombo: product.isCombo || false
          });
          
          // Set image preview
          if (product.imageUrl) {
            setImagePreview(product.imageUrl);
          }
        }
        
        setInitialLoading(false);
      } catch (err) {
        console.error('Error fetching form data:', err);
        Sentry.captureException(err);
        toast.error(`Erro ao carregar dados: ${err.message}`);
        setInitialLoading(false);
      }
    };
    
    fetchData();
  }, [id, isEditing, navigate, reset]);
  
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      // Format price as number
      const formattedData = {
        ...data,
        price: Number(data.price),
        categoryId: data.categoryId ? Number(data.categoryId) : null,
        isCombo: !!data.isCombo
      };
      
      // Add id if editing
      if (isEditing) {
        formattedData.id = Number(id);
      }
      
      // Send to API
      const response = await fetch('/api/products', {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formattedData)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to ${isEditing ? 'update' : 'create'} product`);
      }
      
      toast.success(`Produto ${isEditing ? 'atualizado' : 'criado'} com sucesso!`);
      navigate('/admin/products');
    } catch (err) {
      console.error('Error saving product:', err);
      Sentry.captureException(err);
      toast.error(`Erro ao salvar produto: ${err.message}`);
      setLoading(false);
    }
  };
  
  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setValue('imageUrl', url);
    setImagePreview(url);
  };

  if (initialLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <RiLoader4Line className="text-primary-600 text-4xl animate-spin mb-4" />
        <p className="text-gray-600">Carregando dados do produto...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center">
        <Link to="/admin/products" className="text-primary-600 hover:text-primary-800 mr-4">
          <RiArrowLeftLine size={20} />
        </Link>
        <h1 className="text-2xl font-bold">{isEditing ? 'Editar Produto' : 'Novo Produto'}</h1>
      </div>
      
      <div className="bg-white rounded-xl shadow-card p-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              {/* Product Details */}
              <div className="mb-4">
                <label htmlFor="name" className="label">Nome do produto *</label>
                <input
                  id="name"
                  type="text"
                  className={`input ${errors.name ? 'border-red-500' : ''}`}
                  placeholder="Nome do produto"
                  {...register('name', { required: 'Nome é obrigatório' })}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>
              
              <div className="mb-4">
                <label htmlFor="description" className="label">Descrição</label>
                <textarea
                  id="description"
                  className="input min-h-24"
                  placeholder="Descrição do produto"
                  {...register('description')}
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="price" className="label">Preço *</label>
                <input
                  id="price"
                  type="number"
                  step="0.01"
                  className={`input ${errors.price ? 'border-red-500' : ''}`}
                  placeholder="0.00"
                  {...register('price', { 
                    required: 'Preço é obrigatório',
                    min: {
                      value: 0.01,
                      message: 'Preço deve ser maior que zero'
                    }
                  })}
                />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
              </div>
              
              <div className="mb-4">
                <label htmlFor="categoryId" className="label">Categoria</label>
                <select
                  id="categoryId"
                  className="input"
                  {...register('categoryId')}
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2 h-4 w-4"
                    {...register('isCombo')}
                  />
                  <span>Este produto é um combo</span>
                </label>
              </div>
            </div>
            
            <div>
              {/* Image Section */}
              <div className="mb-4">
                <label htmlFor="imageUrl" className="label">URL da imagem</label>
                <input
                  id="imageUrl"
                  type="text"
                  className="input"
                  placeholder="https://..."
                  {...register('imageUrl')}
                  onChange={handleImageUrlChange}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Insira a URL de uma imagem online do produto
                </p>
              </div>
              
              <div className="mt-4 border border-dashed border-gray-300 rounded-lg aspect-video overflow-hidden bg-gray-50 flex items-center justify-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <RiImageAddLine size={40} className="mx-auto mb-2" />
                    <p>Adicione uma URL de imagem para visualizar</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <Link
              to="/admin/products"
              className="btn btn-secondary mr-4"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              className="btn btn-primary flex items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <RiLoader4Line className="animate-spin mr-2" />
                  Salvando...
                </>
              ) : (
                <>
                  <RiSaveLine className="mr-2" />
                  Salvar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}