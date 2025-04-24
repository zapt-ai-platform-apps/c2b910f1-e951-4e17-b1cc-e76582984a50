import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  RiMenu3Line, 
  RiCloseLine, 
  RiDashboardLine, 
  RiStore2Line, 
  RiFileList3Line,
  RiLogoutBoxLine
} from 'react-icons/ri';

export default function AdminHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    navigate('/admin/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex justify-between items-center py-4 px-6">
        <div className="md:hidden">
          <button 
            onClick={toggleMenu}
            className="text-gray-800 cursor-pointer"
          >
            {isMenuOpen ? <RiCloseLine size={24} /> : <RiMenu3Line size={24} />}
          </button>
        </div>
        
        <div className="md:hidden">
          <h1 className="text-xl font-bold text-primary-600">Painel Admin</h1>
        </div>
        
        <div>
          {/* Right side content if needed */}
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <nav className="px-4 py-2 space-y-2">
            <Link
              to="/admin"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              <RiDashboardLine size={20} />
              <span>Dashboard</span>
            </Link>
            
            <Link
              to="/admin/products"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              <RiStore2Line size={20} />
              <span>Produtos</span>
            </Link>
            
            <Link
              to="/admin/orders"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              <RiFileList3Line size={20} />
              <span>Pedidos</span>
            </Link>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              <RiLogoutBoxLine size={20} />
              <span>Sair</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}