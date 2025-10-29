// src/components/modals/ModalLogin.tsx
import React, { useState } from 'react';
import { X, Eye, EyeOff, Send, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';
import { formatApiError } from '../../utils/apiHelpers';
import { GoogleIcon } from '../icons/GoogleIcon';
import LoadingSpinner from '../shared/LoadingSpinner';
import { showToast } from '../../utils/toastHelper';

interface ModalLoginProps {
  onClose: () => void;
  onRegisterClick: () => void;
  onTriggerGoogleLogin: () => void;
}

const ModalLogin: React.FC<ModalLoginProps> = ({ onClose, onRegisterClick, onTriggerGoogleLogin }) => {
  const [modo, setModo] = useState<'login' | 'esqueceu'>('login');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');
  
  const [processando, setProcessando] = useState(false);
  const { login, carregando: carregandoAuth } = useAuth();

  const estaCarregando = processando || carregandoAuth;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagemErro('');
    setProcessando(true);
    try {
      const usuarioLogado = await login(email, senha);
      if (usuarioLogado) {
        onClose();
      }
    } catch (err) {
      setMensagemErro(formatApiError(err));
    } finally {
      setProcessando(false);
    }
  };

  const handleEsqueceuSenhaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagemErro('');
    setProcessando(true);
    try {
      const resposta = await authService.solicitarResetSenha(email);
      showToast.success(resposta.message || "Link enviado com sucesso! Verifique seu e-mail.");
      setModo('login');
    } catch (err) {
      setMensagemErro(formatApiError(err));
    } finally {
      setProcessando(false);
    }
  };

  const handleGoogleLoginClick = () => {
     onTriggerGoogleLogin();
  }

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto border dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {modo === 'login' ? (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Entrar na Hortifruti</h2>
              <button onClick={onClose} disabled={estaCarregando} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-50">
                <X className="h-5 w-5" />
              </button>
            </div>

            {mensagemErro && (
              <div className="mb-4 bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 dark:border-red-600 text-red-700 dark:text-red-300 p-3 rounded text-sm">
                {mensagemErro}
              </div>
            )}

            <button
              type="button"
              onClick={handleGoogleLoginClick}
              disabled={estaCarregando}
              className="w-full flex justify-center items-center gap-3 py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800 disabled:opacity-70 transition-colors"
            >
              <GoogleIcon className="w-5 h-5" />
              Entrar com Google
            </button>

            <div className="mt-4 mb-4">
              <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300 dark:border-gray-600"></div></div><div className="relative flex justify-center text-sm"><span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">OU</span></div></div>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label htmlFor="email-login" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input type="email" id="email-login" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-60"
                  placeholder="seu@email.com" required disabled={estaCarregando} />
              </div>
              <div>
                <label htmlFor="password-login" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Senha</label>
                <div className="relative">
                  <input type={mostrarSenha ? "text" : "password"} id="password-login" value={senha} onChange={(e) => setSenha(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-60"
                    placeholder="••••••••" required disabled={estaCarregando} />
                  <button type="button" aria-label={mostrarSenha ? "Esconder senha" : "Mostrar senha"}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-50"
                    onClick={() => setMostrarSenha(!mostrarSenha)} disabled={estaCarregando}>
                    {mostrarSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                 <div className="text-right mt-1">
                     <button type="button" onClick={() => setModo('esqueceu')} disabled={estaCarregando} className="text-xs text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300 font-medium disabled:opacity-50">Esqueceu a senha?</button>
                 </div>
              </div>
              <button type="submit" disabled={estaCarregando}
                className={`w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800 disabled:opacity-70 disabled:cursor-not-allowed transition-colors`}
              >
                {estaCarregando ? <LoadingSpinner size="sm" /> : 'Entrar'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Não tem uma conta?{' '}
                <button onClick={onRegisterClick} disabled={estaCarregando} className="font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300 disabled:opacity-50 transition-colors">
                  Cadastre-se
                </button>
              </p>
            </div>
          </div>
        ) : (
          // --- MODO ESQUECEU A SENHA ---
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Redefinir Senha</h2>
              <button onClick={onClose} disabled={estaCarregando} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-50">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {mensagemErro && (
              <div className="mb-4 bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 dark:border-red-600 text-red-700 dark:text-red-300 p-3 rounded text-sm">
                {mensagemErro}
              </div>
            )}

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Digite o e-mail associado à sua conta e enviaremos um link para redefinir sua senha.
            </p>
            
            <form onSubmit={handleEsqueceuSenhaSubmit} className="space-y-4">
               <div>
                <label htmlFor="email-reset" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input type="email" id="email-reset" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-60"
                  placeholder="seu@email.com" required disabled={estaCarregando} />
              </div>
              <button type="submit" disabled={estaCarregando}
                className={`w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800 disabled:opacity-70 disabled:cursor-not-allowed transition-colors`}
              >
                {estaCarregando ? <LoadingSpinner size="sm" /> : <Send className="w-4 h-4 mr-2" />}
                {estaCarregando ? 'Enviando...' : 'Enviar Link de Redefinição'}
              </button>
            </form>
            
            <div className="mt-6 text-center">
                <button onClick={() => setModo('login')} disabled={estaCarregando} className="font-medium text-sm text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300 disabled:opacity-50 transition-colors flex items-center justify-center w-full">
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Voltar para o Login
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalLogin;