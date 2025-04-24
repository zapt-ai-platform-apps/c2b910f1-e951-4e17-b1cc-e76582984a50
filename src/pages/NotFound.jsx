import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-gray-50">
      <h1 className="text-6xl font-bold text-primary-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Página não encontrada</h2>
      <p className="text-gray-600 mb-8 text-center">
        A página que você está procurando não existe ou foi removida.
      </p>
      <Link 
        to="/"
        className="btn btn-primary"
      >
        Voltar para a página inicial
      </Link>
    </div>
  );
}