import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { RiLockLine, RiLoader4Line } from 'react-icons/ri';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the page to redirect to after login
  const from = location.state?.from?.pathname || '/admin';
  
  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // For this simple example, hardcoded password (in a real app, use proper authentication)
    const adminPassword = 'queijos123';
    
    setTimeout(() => {
      if (password === adminPassword) {
        // Set authentication in localStorage
        localStorage.setItem('adminAuthenticated', 'true');
        // Redirect to the page user tried to access, or dashboard
        navigate(from, { replace: true });
      } else {
        setError('Senha incorreta');
        setLoading(false);
      }
    }, 500); // Small timeout to simulate API call
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-xl shadow-card w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary-600 mb-2">Queijos Burger</h1>
          <p className="text-gray-600">Faça login para acessar o painel administrativo</p>
        </div>
        
        <form onSubmit={handleLogin}>
          <div className="mb-6">
            <label htmlFor="password" className="label">Senha</label>
            <div className="relative">
              <input
                id="password"
                type="password"
                className={`input pl-10 ${error ? 'border-red-500' : ''}`}
                placeholder="Digite a senha de administrador"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <RiLockLine className="absolute left-3 top-3 text-gray-500" />
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          
          <button
            type="submit"
            className="btn btn-primary w-full py-3 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <RiLoader4Line className="animate-spin mr-2" />
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}