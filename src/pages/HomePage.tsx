import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Venda, RegistroRequest } from '../types';
import { showToast } from '../utils/toastHelper';
import { formatApiError } from '../utils/apiHelpers';

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

import ModalLogin from '../components/modals/ModalLogin';
import ModalRegistro from '../components/modals/ModalRegistro.tsx';
import ModalCarrinho from '../components/modals/ModalCarrinho.tsx';
import ModalPagamento from '../components/modals/ModalPagamento.tsx';
import ModalExibirPix from '../components/modals/ModalExibirPix';
import ModalExibirBoleto from '../components/modals/ModalExibirBoleto';
import ModalTermos from '../components/modals/ModalTermos';

type AcaoPendenteRegistro = {
  tipo: 'manual' | 'google-register';
  dados?: RegistroRequest;
};

const PaginaInicial: React.FC = () => {
  const [modalLoginAberto, setModalLoginAberto] = useState(false);
  const [modalRegistoAberto, setModalRegistoAberto] = useState(false);
  const [modalCarrinhoAberto, setModalCarrinhoAberto] = useState(false);
  const [modalPagamentoAberto, setModalPagamentoAberto] = useState(false);
  const [modalPixAberto, setModalPixAberto] = useState(false);
  const [modalBoletoAberto, setModalBoletoAberto] = useState(false);
  const [vendaPendente, setVendaPendente] = useState<Venda | null>(null);

  const [modalTermosAberto, setModalTermosAberto] = useState(false);
  const [acaoPendente, setAcaoPendente] = useState<AcaoPendenteRegistro | null>(null);
  const [isGoogleLoginFlow, setIsGoogleLoginFlow] = useState(false);

  const { 
      usuario, 
      carregando, 
      registrar, 
      loginComGoogle,
      googleCodePendente,
      finalizarLoginGoogle,
      cancelarLoginGoogle
  } = useAuth();
  
  const navigate = useNavigate();

  useEffect(() => {
    if (usuario && !carregando && (modalLoginAberto || modalRegistoAberto || modalTermosAberto)) {
      setModalLoginAberto(false);
      setModalRegistoAberto(false);
      setModalTermosAberto(false);
      setAcaoPendente(null);
    }
  }, [usuario, carregando, modalLoginAberto, modalRegistoAberto, modalTermosAberto]);

  useEffect(() => {
    if (googleCodePendente) {
      if (isGoogleLoginFlow) {
        setModalLoginAberto(false);
        handleFinalizarGoogleLogin();
      } else {
        setAcaoPendente({ tipo: 'google-register' });
        setModalRegistoAberto(false);
        setModalTermosAberto(true);
      }
    }
  }, [googleCodePendente, isGoogleLoginFlow]); 

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
    if (usuario) { setModalPagamentoAberto(true); }
    else { abrirModalLogin(); }
  };

  const handleSucessoCartao = () => { setModalPagamentoAberto(false); navigate('/minha-conta/pedidos'); }
  const handleSucessoPix = (vendaGerada: Venda) => { setModalPagamentoAberto(false); setVendaPendente(vendaGerada); setModalPixAberto(true); }
  const handleSucessoBoleto = (vendaGerada: Venda) => { setModalPagamentoAberto(false); setVendaPendente(vendaGerada); setModalBoletoAberto(true); }

  const handleSubmeterManual = (data: RegistroRequest) => {
    setAcaoPendente({ tipo: 'manual', dados: data });
    setModalRegistoAberto(false);
    setModalTermosAberto(true);
  };

  const handleTriggerGoogleRegister = () => {
    setIsGoogleLoginFlow(false);
    loginComGoogle();
  };
  
  const handleTriggerGoogleLogin = () => {
    setIsGoogleLoginFlow(true);
    loginComGoogle();
  };
  
  const handleFinalizarGoogleLogin = async () => {
     try {
         await finalizarLoginGoogle();
     } catch (err) {
         showToast.error(formatApiError(err));
         abrirModalLogin();
     }
  }

  const handleCancelarTermos = () => {
    if (acaoPendente?.tipo === 'google-register') {
        cancelarLoginGoogle();
    }
    setAcaoPendente(null);
    setModalTermosAberto(false);
  };

  const handleConfirmarTermos = async () => {
    if (!acaoPendente) return;
    try {
      if (acaoPendente.tipo === 'manual' && acaoPendente.dados) {
        await registrar(acaoPendente.dados);
      } 
      else if (acaoPendente.tipo === 'google-register') {
        await finalizarLoginGoogle();
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
          isLoading={carregando}
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

      {modalTermosAberto && (
        <ModalTermos
          isOpen={modalTermosAberto}
          onClose={handleCancelarTermos}
          onConfirm={handleConfirmarTermos}
          isLoading={carregando}
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