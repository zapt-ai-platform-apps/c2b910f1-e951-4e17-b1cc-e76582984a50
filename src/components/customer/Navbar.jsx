import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RiShoppingCart2Line, RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getCartCount } = useCart();
  const cartCount = getCartCount();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md py-4">
      <div className="container-fluid flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold text-primary-600">Queijos Burger</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-800 hover:text-primary-600 transition">
            Cardápio
          </Link>
          <button 
            onClick={() => navigate('/cart')}
            className="relative p-2 text-gray-800 hover:text-primary-600 transition cursor-pointer"
          >
            <RiShoppingCart2Line size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => navigate('/cart')}
            className="relative p-2 mr-4 text-gray-800 cursor-pointer"
          >
            <RiShoppingCart2Line size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          
          <button
            onClick={toggleMenu}
            className="text-gray-800 hover:text-primary-600 transition focus:outline-none cursor-pointer"
          >
            {isMenuOpen ? <RiCloseLine size={28} /> : <RiMenu3Line size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white">
          <div className="px-4 pt-2 pb-4 space-y-4">
            <Link 
              to="/" 
              className="block text-gray-800 hover:text-primary-600 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Cardápio
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}