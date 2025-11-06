// src/components/modals/ModalRegistro.tsx
import React, { useState } from 'react';
import { X, Eye, EyeOff} from 'lucide-react';
import { GoogleIcon } from '../icons/GoogleIcon';
import { RegistroRequest } from '../../types';
import LoadingSpinner from '../shared/LoadingSpinner';

interface ModalRegistroProps {
  onClose: () => void;
  onLoginClick: () => void;
  onSubmeterManual: (data: RegistroRequest) => void;
  onTriggerGoogleLogin: () => void; 
  isLoading: boolean;
}

const ModalRegistro: React.FC<ModalRegistroProps> = ({
  onClose,
  onLoginClick,
  onSubmeterManual,
  onTriggerGoogleLogin, 
  isLoading
}) => {
  
  const [dadosFormulario, setDadosFormulario] = useState<RegistroRequest>({
    nomeCompleto: '', email: '', senha: '', cpf: '', telefone: '',
  });
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDadosFormulario(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagemErro('');
    if (dadosFormulario.senha !== confirmarSenha) {
      setMensagemErro('As senhas não correspondem.');
      return;
    }
    if (dadosFormulario.senha.length < 6) {
      setMensagemErro('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    onSubmeterManual(dadosFormulario);
  };

  const handleGoogleLoginClick = () => {
     onTriggerGoogleLogin(); 
  }

  const estaCarregando = isLoading;

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto border dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Criar Conta na Hortifruti</h2>
            <button onClick={onClose} disabled={estaCarregando} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-50 transition-colors" aria-label="Fechar">
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
            Registar-se com Google
          </button>

          <div className="mt-4 mb-4">
             <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300 dark:border-gray-600"></div></div><div className="relative flex justify-center text-sm"><span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">OU</span></div></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="nomeCompleto-reg" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome Completo</label>
              <input type="text" id="nomeCompleto-reg" name="nomeCompleto" value={dadosFormulario.nomeCompleto} onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-60"
                placeholder="Seu nome completo" required disabled={estaCarregando} />
            </div>
            <div>
              <label htmlFor="email-reg" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input type="email" id="email-reg" name="email" value={dadosFormulario.email} onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-60"
                placeholder="seu@email.com" required disabled={estaCarregando} />
            </div>
            <div>
              <label htmlFor="cpf-reg" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CPF</label>
              <input type="text" id="cpf-reg" name="cpf" value={dadosFormulario.cpf} onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-60"
                placeholder="000.000.000-00" required disabled={estaCarregando} />
            </div>
            <div>
              <label htmlFor="telefone-reg" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Telefone (com DDD)</label>
              <input type="tel" id="telefone-reg" name="telefone" value={dadosFormulario.telefone} onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-60"
                placeholder="(61) 99999-9999" required disabled={estaCarregando} />
            </div>
            <div>
              <label htmlFor="password-reg" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Senha</label>
              <div className="relative">
                <input type={mostrarSenha ? "text" : "password"} id="password-reg" name="senha" value={dadosFormulario.senha} onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-60"
                  placeholder="Pelo menos 6 caracteres" required disabled={estaCarregando} />
                <button type="button" aria-label={mostrarSenha ? "Esconder senha" : "Mostrar senha"}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-50"
                  onClick={() => setMostrarSenha(!mostrarSenha)} disabled={estaCarregando}>
                  {mostrarSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="confirm-password-reg" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirmar Senha</label>
              <input type={mostrarSenha ? "text" : "password"} id="confirm-password-reg" name="confirmarSenha" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-60"
                placeholder="Repita a senha" required disabled={estaCarregando} />
            </div>
            <button type="submit" disabled={estaCarregando}
              className={`w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800 disabled:opacity-70 disabled:cursor-not-allowed transition-colors`}
            >
              {estaCarregando ? <LoadingSpinner size="sm" text="Aguarde..." /> : 'Continuar'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Já tem uma conta?{' '}
              <button onClick={onLoginClick} disabled={estaCarregando} className="font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300 disabled:opacity-50 transition-colors">
                Faça login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalRegistro;