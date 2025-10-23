// src/pages/PaginaInicial.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Venda } from '../types';

// Certifique-se que os nomes dos imports correspondem aos seus arquivos
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

import ModalLogin from '../components/modals/LoginModal.tsx';
import ModalRegistro from '../components/modals/RegistroModal.tsx';
import ModalCarrinho from '../components/modals/CarrinhoModal.tsx';
import ModalPagamento from '../components/modals/PagamentoModal.tsx';
import ModalExibirPix from '../components/modals/ModalExibirPix';
import ModalExibirBoleto from '../components/modals/ModalExibirBoleto';

const PaginaInicial: React.FC = () => {
  const [modalLoginAberto, setModalLoginAberto] = useState(false);
  const [modalRegistoAberto, setModalRegistoAberto] = useState(false);
  const [modalCarrinhoAberto, setModalCarrinhoAberto] = useState(false);
  const [modalPagamentoAberto, setModalPagamentoAberto] = useState(false);
  const [modalPixAberto, setModalPixAberto] = useState(false);
  const [modalBoletoAberto, setModalBoletoAberto] = useState(false);
  const [vendaPendente, setVendaPendente] = useState<Venda | null>(null);

  const { usuario, carregando } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (usuario && !carregando && (modalLoginAberto || modalRegistoAberto)) {
      setModalLoginAberto(false);
      setModalRegistoAberto(false);
    }
  }, [usuario, carregando, modalLoginAberto, modalRegistoAberto]); // Dependências corretas

  // --- Funções de Controle dos Modais ---

  const abrirModalLogin = () => { if (!usuario && !carregando) { setModalRegistoAberto(false); setModalLoginAberto(true); } }
  const fecharModalLogin = () => setModalLoginAberto(false);
  const abrirModalRegistro = () => { setModalLoginAberto(false); setModalRegistoAberto(true); }
  const fecharModalRegistro = () => setModalRegistoAberto(false);
  const voltarParaLogin = () => { setModalRegistoAberto(false); setModalLoginAberto(true); }
  const abrirModalCarrinho = () => setModalCarrinhoAberto(true);
  const fecharModalCarrinho = () => setModalCarrinhoAberto(false);
  const fecharModalPagamento = () => setModalPagamentoAberto(false);

  const fecharModaisPendentes = () => {
    setModalPixAberto(false);
    setModalBoletoAberto(false);
    setVendaPendente(null);
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

  // --- Funções de Sucesso do Pagamento ---

  const handleSucessoCartao = () => {
      setModalPagamentoAberto(false);
      navigate('/minha-conta/pedidos');
  }

  const handleSucessoPix = (vendaGerada: Venda) => {
      setModalPagamentoAberto(false);
      setVendaPendente(vendaGerada);
      setModalPixAberto(true);
  }

  const handleSucessoBoleto = (vendaGerada: Venda) => {
      setModalPagamentoAberto(false);
      setVendaPendente(vendaGerada);
      setModalBoletoAberto(true);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 relative transition-colors duration-300">
      <VoltarAoTopo />
      <Navbar
        onLoginClick={abrirModalLogin}
        onCartClick={abrirModalCarrinho}
      />

      <BannerPrincipal />
      <BannerDestaques />
      <Diferenciais />
      <CatalogoProdutos />
      <Sobre />
      <Contato />
      <BoletimInformativo />

      <Rodape />

      {/* --- Modais --- */}

      {modalLoginAberto && (
        <ModalLogin
          onClose={fecharModalLogin}
          onRegisterClick={abrirModalRegistro}
        />
      )}

      {modalRegistoAberto && (
        <ModalRegistro
          onClose={fecharModalRegistro}
          onLoginClick={voltarParaLogin}
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
          aoSucessoPix={handleSucessoPix}
          aoSucessoBoleto={handleSucessoBoleto}
        />
      )}

      {modalPixAberto && vendaPendente && (
          <ModalExibirPix
              venda={vendaPendente}
              onClose={fecharModaisPendentes}
          />
      )}

      {modalBoletoAberto && vendaPendente && (
          <ModalExibirBoleto
              venda={vendaPendente}
              onClose={fecharModaisPendentes}
          />
      )}
    </div>
  );
}

export default PaginaInicial;