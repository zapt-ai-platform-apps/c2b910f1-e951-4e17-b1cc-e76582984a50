import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  RiDashboardLine, 
  RiStore2Line, 
  RiFileList3Line,
  RiLogoutBoxLine
} from 'react-icons/ri';

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    navigate('/admin/login');
  };
  
  const menuItems = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: <RiDashboardLine size={20} />,
    },
    {
      name: 'Produtos',
      path: '/admin/products',
      icon: <RiStore2Line size={20} />,
    },
    {
      name: 'Pedidos',
      path: '/admin/orders',
      icon: <RiFileList3Line size={20} />,
    },
  ];

  return (
    <div className="hidden md:block w-64 bg-white shadow-md overflow-y-auto">
      <div className="p-4">
        <h1 className="text-xl font-bold text-primary-600 mb-8">Painel Admin</h1>
        
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-primary-100 text-primary-800'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer mt-8"
          >
            <RiLogoutBoxLine size={20} />
            <span>Sair</span>
          </button>
        </nav>
      </div>
    </div>
  );
}