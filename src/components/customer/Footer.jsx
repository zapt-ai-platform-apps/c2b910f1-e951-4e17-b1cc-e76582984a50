import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container-fluid">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold text-primary-500 mb-2">Queijos Burger</h3>
            <p className="text-gray-400 text-sm">O melhor hambúrguer da região</p>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-gray-400 text-sm">
              © {currentYear} Queijos Burger. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}