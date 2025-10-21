// src/pages/PaginaInicial.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom'; 

import Navbar from '../components/shared/Navbar';
import BannerPrincipal from '../components/BannerPrincipal.tsx';
import BannerDestaques from '../components/BannerDestaques';
import Diferenciais from '../components/Diferenciais';      
import CatalogoProdutos from '../components/CatalogoProdutos'; 
import Sobre from '../components/Sobre';                 
import Contato from '../components/Contato';                
import BoletimInformativo from '../components/BoletimInformativo'; 
import Rodape from '../components/shared/Rodape';        
import VoltarAoTopo from '../components/shared/VoltarAoTopo';   

import ModalLogin from '../components/modals/LoginModal';        
import ModalRegistro from '../components/modals/RegistroModal';    
import ModalCarrinho from '../components/modals/CarrinhoModal';     
import ModalPagamento from '../components/modals/PagamentoModal';  

const PaginaInicial: React.FC = () => {
  const [modalLoginAberto, setModalLoginAberto] = useState(false);
  const [modalRegistoAberto, setModalRegistoAberto] = useState(false);
  const [modalCarrinhoAberto, setModalCarrinhoAberto] = useState(false);
  const [modalPagamentoAberto, setModalPagamentoAberto] = useState(false);

  const { usuario, carregando } = useAuth();
  const navigate = useNavigate(); 

  useEffect(() => {
    if (usuario && !carregando && (modalLoginAberto || modalRegistoAberto)) {
      setModalLoginAberto(false);
      setModalRegistoAberto(false);
    }
  }, [usuario, carregando]);

  // --- Funções de Controle dos Modais ---

  const abrirModalLogin = () => {
      if (!usuario && !carregando) {
          setModalRegistoAberto(false);
          setModalLoginAberto(true);
      }
  }
  const fecharModalLogin = () => setModalLoginAberto(false);

  const abrirModalRegistro = () => {
setModalLoginAberto(false); 
      setModalRegistoAberto(true);
  }
  const fecharModalRegistro = () => setModalRegistoAberto(false);

  const voltarParaLogin = () => {
      setModalRegistoAberto(false);
      setModalLoginAberto(true);
  }

  const abrirModalCarrinho = () => setModalCarrinhoAberto(true);
  const fecharModalCarrinho = () => setModalCarrinhoAberto(false);

  const fecharModalPagamento = () => setModalPagamentoAberto(false);
  const handleSucessoPagamento = () => {
      setModalPagamentoAberto(false);
      navigate('/minha-conta/pedidos');
  }

  const handleCheckout = () => {
    fecharModalCarrinho();
    if (usuario) {
      setModalPagamentoAberto(true);
    } else {
      abrirModalLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 relative transition-colors duration-300">
      <VoltarAoTopo />
      <Navbar
        onLoginClick={abrirModalLogin}
        onCartClick={abrirModalCarrinho}
      />

      {/* Seções da Página Inicial */}
      <BannerPrincipal />
      <BannerDestaques />
      <Diferenciais />
      {/* Certifique-se que CatalogoProdutos não tem dependências de estado que deveriam estar aqui */}
      <CatalogoProdutos />
      <Sobre />
      <Contato />
      <BoletimInformativo />

      <Rodape />

      {/* --- Modais --- */}

      {/* Modal de Login */}
      {modalLoginAberto && (
        <ModalLogin
          onClose={fecharModalLogin}
          onRegisterClick={abrirModalRegistro}
        />
      )}

      {/* Modal de Registro */}
      {modalRegistoAberto && (
        <ModalRegistro
          onClose={fecharModalRegistro}
          onLoginClick={voltarParaLogin}
        />
      )}

      {/* Modal do Carrinho */}
      {modalCarrinhoAberto && (
        <ModalCarrinho
          onClose={fecharModalCarrinho}
          onCheckout={handleCheckout}
        />
      )}

      {/* Modal de Pagamento */}
      {modalPagamentoAberto && (
        <ModalPagamento
          aoFechar={fecharModalPagamento}
          aoSucesso={handleSucessoPagamento}
        />
      )}
    </div>
  );
}

export default PaginaInicial;