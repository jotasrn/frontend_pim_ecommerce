import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, UserRound, Search, Menu, X, Leaf, LogOut, ListOrdered, MapPin, Settings, Moon, Sun } from 'lucide-react';
import { useCarrinho } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import NavLink from './NavLink'; 

interface NavbarProps {
  onLoginClick: () => void;
  onCartClick: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLoginClick, onCartClick, searchTerm, onSearchChange }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { getTotalItens } = useCarrinho();
  const { usuario, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggleTheme = () => {
    toggleTheme();
    setShowUserMenu(false);
  };

  const toggleMobileMenu = () => setShowMobileMenu(!showMobileMenu);
  const toggleUserMenu = () => setShowUserMenu(!showUserMenu);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  }

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
            ? 'bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700'
            : 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-transparent' 
      }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        <Link to="/" className="flex items-center space-x-2">
          <Leaf className="h-6 w-6 text-green-500" strokeWidth={2} />
          <span className="font-semibold text-lg text-gray-800 dark:text-gray-100">Hortifruti</span>
        </Link>

        <div className="hidden md:flex space-x-6 text-gray-700 dark:text-gray-300">
          <NavLink to="/" className="hover:text-green-500 transition-colors">Início</NavLink>
          <NavLink to="/#produtos" className="hover:text-green-500 transition-colors">Produtos</NavLink>
          <NavLink to="/#sobre" className="hover:text-green-500 transition-colors">Sobre</NavLink>
          <NavLink to="/#contato" className="hover:text-green-500 transition-colors">Contato</NavLink>
        </div>

        <div className="flex items-center space-x-4 text-gray-700 dark:text-gray-300">
          <div className="hidden md:flex items-center relative">
            <input type="text" placeholder="Buscar produtos..."
              className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-48 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              value={searchTerm} 
              onChange={handleSearchInput}
            />
            <Search className="absolute right-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
          </div>

          <div className="relative" ref={userMenuRef}>
            {usuario ? (
              <button onClick={toggleUserMenu} className="flex items-center hover:text-green-500 transition-colors" aria-label="Minha Conta">
                <UserRound className="h-6 w-6" />
                <span className="ml-1 text-sm font-medium hidden lg:inline">{usuario.nome.split(' ')[0]}</span>
              </button>
            ) : (
              <button onClick={onLoginClick} className="hover:text-green-500 transition-colors" aria-label="Login">
                <UserRound className="h-6 w-6" />
              </button>
            )}

            {usuario && showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg py-2 z-50 border border-gray-100 dark:border-gray-700 animate-fadeIn">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{usuario.nomeCompleto || usuario.nome}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{usuario.email}</p>
                </div>
                <nav className="mt-2 text-gray-700 dark:text-gray-300">
                  <Link to="/minha-conta" onClick={() => setShowUserMenu(false)} className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-green-600 dark:hover:text-green-400">
                    <Settings className="w-4 h-4 mr-3" /> Minha Conta
                  </Link>
                  <Link to="/minha-conta/pedidos" onClick={() => setShowUserMenu(false)} className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-green-600 dark:hover:text-green-400">
                    <ListOrdered className="w-4 h-4 mr-3" /> Histórico de Pedidos
                  </Link>
                  <Link to="/minha-conta/enderecos" onClick={() => setShowUserMenu(false)} className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-green-600 dark:hover:text-green-400">
                    <MapPin className="w-4 h-4 mr-3" /> Meus Endereços
                  </Link>
                  <button onClick={handleToggleTheme}
                    className="w-full text-left flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-green-600 dark:hover:text-green-400">
                    {theme === 'dark' ? <Sun className="w-4 h-4 mr-3" /> : <Moon className="w-4 h-4 mr-3" />}
                    {theme === 'dark' ? 'Tema Claro' : 'Tema Escuro'}
                  </button>
                </nav>
                <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                  <button onClick={handleLogout} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:font-medium">
                    <LogOut className="w-4 h-4 mr-3" /> Sair
                  </button>
                </div>
              </div>
            )}
          </div>

          <button onClick={onCartClick} className="hover:text-green-500 transition-colors relative" aria-label="Carrinho">
            <ShoppingCart className="h-6 w-6" />
            {getTotalItens() > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                {getTotalItens() > 9 ? '9+' : getTotalItens()}
              </span>
            )}
          </button>
          <button className="md:hidden hover:text-green-500 transition-colors" onClick={toggleMobileMenu} aria-label={showMobileMenu ? "Fechar Menu" : "Abrir Menu"}>
            {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {showMobileMenu && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 animate-slideDown text-gray-700 dark:text-gray-300">
          <div className="p-4 flex flex-col space-y-2">
            <NavLink to="/" className="py-2 hover:text-green-500" onClick={toggleMobileMenu}>Início</NavLink>
            <NavLink to="/#produtos" className="py-2 hover:text-green-500" onClick={toggleMobileMenu}>Produtos</NavLink>
            <NavLink to="/#sobre" className="py-2 hover:text-green-500" onClick={toggleMobileMenu}>Sobre</NavLink>
            <NavLink to="/#contato" className="py-2 hover:text-green-500" onClick={toggleMobileMenu}>Contato</NavLink>
            <div className="relative mt-2">
              <input type="text" placeholder="Buscar produtos..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                value={searchTerm} 
                onChange={handleSearchInput}
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;