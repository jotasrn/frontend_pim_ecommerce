import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import ApiErrorBoundary from './components/ApiErrorBoundary';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastContainer } from './components/Toast';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { GoogleOAuthProvider } from '@react-oauth/google';

import { Venda, RegistroRequest } from './types';
import { showToast } from './utils/toastHelper';
import { formatApiError } from './utils/apiHelpers';

import PaginaInicial from './pages/HomePage';
import Navbar from './components/shared/Navbar';
import Rodape from './components/shared/Rodape';
import LoadingSpinner from './components/shared/LoadingSpinner';
import PaginaMinhaConta from './pages/PaginaMinhaConta';
import PaginaPedidos from './pages/PaginaPedidos';
import PaginaEnderecos from './pages/PaginaEnderecos';
import PaginaPoliticas from './pages/PaginaPoliticas';
import PaginaFaq from './pages/PaginaFaq';
import PaginaResetarSenha from './pages/PaginaResetarSenha';

import ReloadPrompt from './components/shared/ReloadPrompt';
import PwaInstallPrompt from './components/shared/PwaInstallPrompt';
import ModalLogin from './components/modals/ModalLogin';
import ModalRegistro from './components/modals/ModalRegistro';
import ModalCarrinho from './components/modals/ModalCarrinho';
import ModalPagamento from './components/modals/ModalPagamento';
import ModalExibirBoleto from './components/modals/ModalExibirBoleto';
import ModalTermos from './components/modals/ModalTermos';
import ModalNotificacaoEntrega from './components/modals/ModalNotificacaoEntrega';

type AcaoPendenteRegistro = {
  tipo: 'manual' | 'google-register';
  dados?: RegistroRequest;
};

type OpcaoEntrega = 'entrega' | 'retirada';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { usuario, carregando } = useAuth();

  if (carregando) {
    return (
      <div className="flex justify-center items-center h-screen dark:bg-gray-900">
        <LoadingSpinner text="A verificar autenticação..." />
      </div>
    );
  }

  if (!usuario) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

interface ClienteLayoutProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onLoginClick: () => void;
  onCartClick: () => void;
}

const ClienteLayout: React.FC<ClienteLayoutProps> = ({
  searchTerm,
  onSearchChange,
  onLoginClick,
  onCartClick
}) => (
  <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 relative transition-colors duration-300">
    <Navbar
      onLoginClick={onLoginClick}
      onCartClick={onCartClick}
      searchTerm={searchTerm}
      onSearchChange={onSearchChange}
    />
    <main className="pt-20 flex-grow">
      <Outlet />
    </main>
    <Rodape />
  </div>
);

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "");
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

const AppContent: React.FC = () => {
  const [modalLoginAberto, setModalLoginAberto] = useState(false);
  const [modalRegistoAberto, setModalRegistoAberto] = useState(false);
  const [modalCarrinhoAberto, setModalCarrinhoAberto] = useState(false);
  const [modalPagamentoAberto, setModalPagamentoAberto] = useState(false);
  const [modalBoletoAberto, setModalBoletoAberto] = useState(false);
  const [vendaPendente, setVendaPendente] = useState<Venda | null>(null);

  const [modalTermosAberto, setModalTermosAberto] = useState(false);
  const [modalNotificacaoAberto, setModalNotificacaoAberto] = useState(false);
  
  const [acaoPendente, setAcaoPendente] = useState<AcaoPendenteRegistro | null>(null);
  const [isGoogleLoginFlow, setIsGoogleLoginFlow] = useState(false);
  
  const [filtroPromocaoId, setFiltroPromocaoId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.usuario && !auth.carregando && (modalLoginAberto || modalRegistoAberto || modalTermosAberto)) {
      setModalLoginAberto(false);
      setModalRegistoAberto(false);
      setModalTermosAberto(false);
      setAcaoPendente(null);
    }
  }, [auth.usuario, auth.carregando, modalLoginAberto, modalRegistoAberto, modalTermosAberto]);

  const abrirModalLogin = useCallback(() => { 
    if (!auth.usuario && !auth.carregando) { 
        setModalRegistoAberto(false); 
        setModalLoginAberto(true); 
    }
  }, [auth.usuario, auth.carregando]);

  const handleFinalizarGoogleLogin = useCallback(async () => {
     try {
         await auth.finalizarLoginGoogle();
     } catch (err) {
         showToast.error(formatApiError(err));
         abrirModalLogin();
     }
  }, [auth, abrirModalLogin]);

  useEffect(() => {
    if (auth.googleCodePendente) {
      if (isGoogleLoginFlow) {
        setModalLoginAberto(false);
        handleFinalizarGoogleLogin();
      } else {
        setAcaoPendente({ tipo: 'google-register' });
        setModalRegistoAberto(false);
        setModalTermosAberto(true);
      }
    }
  }, [auth.googleCodePendente, isGoogleLoginFlow, handleFinalizarGoogleLogin]);

  const fecharModalLogin = () => setModalLoginAberto(false);
  const abrirModalRegistro = () => { setModalLoginAberto(false); setModalRegistoAberto(true); }
  const fecharModalRegistro = () => setModalRegistoAberto(false);
  const voltarParaLogin = () => { setModalRegistoAberto(false); setModalLoginAberto(true); }
  const abrirModalCarrinho = () => setModalCarrinhoAberto(true);
  const fecharModalCarrinho = () => setModalCarrinhoAberto(false);
  const fecharModalPagamento = () => setModalPagamentoAberto(false);

  const fecharModaisPendentes = () => {
    setModalBoletoAberto(false);
    setVendaPendente(null);
    if (!modalNotificacaoAberto) {
      navigate('/minha-conta/pedidos');
    }
  }

  const handleCheckout = () => {
    fecharModalCarrinho();
    if (auth.usuario) { setModalPagamentoAberto(true); }
    else { abrirModalLogin(); }
  };

  const handleSucessoCartao = (opcaoEntrega: OpcaoEntrega) => {
    setModalPagamentoAberto(false);
    if (opcaoEntrega === 'entrega') {
      setModalNotificacaoAberto(true);
    } else {
      navigate('/minha-conta/pedidos');
    }
  }

  const handleSucessoBoleto = (vendaGerada: Venda, opcaoEntrega: OpcaoEntrega) => {
    setModalPagamentoAberto(false);
    setVendaPendente(vendaGerada);
    setModalBoletoAberto(true);
    if (opcaoEntrega === 'entrega') {
      setModalNotificacaoAberto(true);
    }
  }
  
  const fecharModalNotificacaoEIrParaPedidos = () => {
    setModalNotificacaoAberto(false);
    navigate('/minha-conta/pedidos');
  }

  const handleSubmeterManual = (data: RegistroRequest) => {
    setAcaoPendente({ tipo: 'manual', dados: data });
    setModalRegistoAberto(false);
    setModalTermosAberto(true);
  };

  const handleTriggerGoogleRegister = () => {
    setIsGoogleLoginFlow(false);
    auth.loginComGoogle();
  };
  
  const handleTriggerGoogleLogin = () => {
    setIsGoogleLoginFlow(true);
    auth.loginComGoogle();
  };
  
  const handleCancelarTermos = () => {
    if (acaoPendente?.tipo === 'google-register') {
        auth.cancelarLoginGoogle();
    }
    setAcaoPendente(null);
    setModalTermosAberto(false);
  };

  const handleConfirmarTermos = async () => {
    if (!acaoPendente) return;
    try {
      if (acaoPendente.tipo === 'manual' && acaoPendente.dados) {
        await auth.registrar(acaoPendente.dados);
      } 
      else if (acaoPendente.tipo === 'google-register') {
        await auth.finalizarLoginGoogle();
      }
    } catch (err) {
      showToast.error(formatApiError(err));
      setAcaoPendente(null);
      setModalTermosAberto(false);
      if (acaoPendente.tipo === 'manual') {
          abrirModalRegistro();
      }
    }
  };

  const handlePromocaoClick = (id: number) => {
    setFiltroPromocaoId(prevId => (prevId === id ? null : id));
    const secaoProdutos = document.getElementById('produtos');
    if (secaoProdutos) {
        secaoProdutos.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLimparFiltroPromocao = () => {
    setFiltroPromocaoId(null);
  };

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <PaginaInicial
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onLoginClick={abrirModalLogin}
              onCartClick={abrirModalCarrinho}
              filtroPromocaoId={filtroPromocaoId}
              onLimparFiltroPromocao={handleLimparFiltroPromocao}
              onPromocaoClick={handlePromocaoClick}
            />
          }
        />

        <Route 
          element={
            <ClienteLayout 
              searchTerm={searchTerm} 
              onSearchChange={setSearchTerm} 
              onLoginClick={abrirModalLogin} 
              onCartClick={abrirModalCarrinho} 
            />
          }
        >
          <Route path="/politicas" element={<PaginaPoliticas />} />
          <Route path="/faq" element={<PaginaFaq />} />
          <Route path="/resetar-senha" element={<PaginaResetarSenha />} />
        </Route>

        <Route
          path="/minha-conta"
          element={
            <ProtectedRoute>
              <ClienteLayout 
                searchTerm={searchTerm} 
                onSearchChange={setSearchTerm}
                onLoginClick={abrirModalLogin} 
                onCartClick={abrirModalCarrinho} 
              />
            </ProtectedRoute>
          }
        >
          <Route index element={<PaginaMinhaConta />} />
          <Route path="pedidos" element={<PaginaPedidos />} />
          <Route path="enderecos" element={<PaginaEnderecos />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {modalLoginAberto && (
        <ModalLogin
          onClose={fecharModalLogin}
          onRegisterClick={abrirModalRegistro}
          onTriggerGoogleLogin={handleTriggerGoogleLogin}
        />
      )}

      {modalRegistoAberto && (
        <ModalRegistro
          onClose={fecharModalRegistro}
          onLoginClick={voltarParaLogin}
          onSubmeterManual={handleSubmeterManual}
          onTriggerGoogleLogin={handleTriggerGoogleRegister}
          isLoading={auth.carregando}
        />
      )}

      {modalCarrinhoAberto && (
        <ModalCarrinho
          onClose={fecharModalCarrinho}
          onCheckout={handleCheckout}
        />
      )}

      {modalPagamentoAberto && (
        <ModalPagamento
          aoFechar={fecharModalPagamento}
          aoSucessoCartao={handleSucessoCartao}
          aoSucessoBoleto={handleSucessoBoleto}
        />
      )}

      {modalTermosAberto && (
        <ModalTermos
          isOpen={modalTermosAberto}
          onClose={handleCancelarTermos}
          onConfirm={handleConfirmarTermos}
          isLoading={auth.carregando}
        />
      )}

      {modalBoletoAberto && vendaPendente && (
          <ModalExibirBoleto
              venda={vendaPendente}
              onClose={fecharModaisPendentes}
          />
      )}
      
      {modalNotificacaoAberto && !modalBoletoAberto && (
        <ModalNotificacaoEntrega
          onClose={fecharModalNotificacaoEIrParaPedidos}
        />
      )}
    </>
  );
}

function App() {
  return (
    <ApiErrorBoundary>
      <GoogleOAuthProvider clientId={googleClientId}>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <Router>
                <ToastContainer />
                <ReloadPrompt />
                <PwaInstallPrompt />
                <Elements stripe={stripePromise}>
                  <AppContent />
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