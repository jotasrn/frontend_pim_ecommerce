import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import ApiErrorBoundary from './components/ApiErrorBoundary';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastContainer } from './components/Toast';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { GoogleOAuthProvider } from '@react-oauth/google';

import HomePage from './pages/HomePage';
import Navbar from './components/shared/Navbar';
import Rodape from './components/shared/Rodape';
import LoadingSpinner from './components/shared/LoadingSpinner';
import PaginaMinhaConta from './pages/PaginaMinhaConta';
import PaginaPedidos from './pages/PaginaPedidos';
import PaginaEnderecos from './pages/PaginaEnderecos';
import PaginaPoliticas from './pages/PaginaPoliticas';

// --- Componentes de Layout e Proteção ---
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { usuario, carregando } = useAuth();

  if (carregando) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner text="A verificar autenticação..." />
      </div>
    );
  }

  if (!usuario) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const ClienteLayout: React.FC = () => (

  <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 relative transition-colors duration-300">
    <Navbar onLoginClick={() => { }} onCartClick={() => { }} />

    <main className="pt-20 flex-grow">
      <Outlet />
    </main>
    <Rodape />
  </div>
);

// --- Configuração das chaves ---

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "");
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

// --- Componente APP Principal ---

function App() {
  return (
    <ApiErrorBoundary>
      <GoogleOAuthProvider clientId={googleClientId}>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <Router>
                <ToastContainer />
                <Elements stripe={stripePromise}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route element={<ClienteLayout />}>
                      <Route path="/politicas" element={<PaginaPoliticas />} />
                    </Route>
                    <Route
                      path="/minha-conta"
                      element={<ProtectedRoute><ClienteLayout /></ProtectedRoute>}>
                      <Route index element={<PaginaMinhaConta />} />
                      <Route path="pedidos" element={<PaginaPedidos />} />
                      <Route path="enderecos" element={<PaginaEnderecos />} />
                    </Route>
                  </Routes>
                </Elements>
              </Router>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </GoogleOAuthProvider>
    </ApiErrorBoundary>
  );
}

export default App;