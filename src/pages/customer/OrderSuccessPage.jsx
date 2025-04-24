import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { RiCheckboxCircleLine, RiWhatsappLine } from 'react-icons/ri';

export default function OrderSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get order data from location state, redirect if missing
  const { orderId, whatsappUrl } = location.state || {};
  
  useEffect(() => {
    if (!orderId) {
      // If no order data is passed, redirect to home
      navigate('/');
    }
  }, [orderId, navigate]);
  
  if (!orderId) {
    return null;
  }

  return (
    <div className="container-fluid py-12">
      <div className="max-w-lg mx-auto bg-white rounded-xl shadow-card p-8 text-center">
        <RiCheckboxCircleLine className="text-green-500 text-6xl mx-auto mb-4" />
        
        <h1 className="text-2xl font-bold mb-2">Pedido Realizado com Sucesso!</h1>
        <p className="text-gray-600 mb-6">
          Seu pedido #{orderId} foi registrado e está sendo processado.
        </p>
        
        {whatsappUrl && (
          <div className="mb-8">
            <p className="text-gray-700 mb-4">
              Acompanhe seu pedido pelo WhatsApp para receber atualizações em tempo real.
            </p>
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-success w-full flex items-center justify-center"
            >
              <RiWhatsappLine size={20} className="mr-2" />
              Acompanhar pelo WhatsApp
            </a>
          </div>
        )}
        
        <Link to="/" className="btn btn-primary w-full">
          Voltar para o Cardápio
        </Link>
      </div>
    </div>
  );
}