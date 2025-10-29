import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { showToast } from '../utils/toastHelper';
import { formatApiError } from '../utils/apiHelpers';
import { Loader2, KeyRound, CheckCircle, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import LoadingSpinner from '../components/shared/LoadingSpinner';

type ResetFormData = {
  novaSenha: string;
  confirmarNovaSenha: string;
};

const PaginaResetarSenha: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [token, setToken] = useState<string | null>(null);
  const [isLoadingToken, setIsLoadingToken] = useState(true);
  const [erroToken, setErroToken] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false); // Estado para o 'olhinho'

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ResetFormData>();

  useEffect(() => {
    const tokenDaUrl = searchParams.get('token');
    if (tokenDaUrl) {
      setToken(tokenDaUrl);
      setIsLoadingToken(false);
    } else {
      setErroToken("Token de redefinição não encontrado ou inválido. Por favor, solicite um novo link.");
      setIsLoadingToken(false);
    }
  }, [searchParams]);

  const onSubmit: SubmitHandler<ResetFormData> = async (data) => {
    if (data.novaSenha !== data.confirmarNovaSenha) {
      showToast.error("As senhas não coincidem.");
      return;
    }
    if (!token) {
      showToast.error("Token inválido.");
      return;
    }

    try {
      await authService.resetarSenha(token, data.novaSenha);
      showToast.success("Senha redefinida com sucesso! Você já pode fazer login.");
      setSucesso(true);
      reset();
      setTimeout(() => navigate('/'), 3000); 
    } catch (err) {
      showToast.error(formatApiError(err));
    }
  };

  if (isLoadingToken) {
    return <div className="h-64 flex items-center justify-center dark:bg-gray-900"><LoadingSpinner text="Verificando token..." /></div>;
  }

  if (erroToken) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md border dark:border-gray-700 text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Token Inválido</h2>
        <p className="text-gray-600 dark:text-gray-300">{erroToken}</p>
        <Link to="/" className="mt-6 inline-block text-green-600 dark:text-green-400 hover:underline">Voltar para a página inicial</Link>
      </div>
    );
  }

  if (sucesso) {
     return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md border dark:border-gray-700 text-center">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Sucesso!</h2>
        <p className="text-gray-600 dark:text-gray-300">Sua senha foi redefinida. Você será redirecionado em breve...</p>
      </div>
    );
  }

  return (
     <div className="max-w-md mx-auto my-16 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md border dark:border-gray-700">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">Redefinir sua Senha</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="novaSenha">Nova Senha</label>
            <div className="relative">
              <input 
                type={mostrarSenha ? "text" : "password"} 
                id="novaSenha"
                {...register("novaSenha", { required: "Nova senha é obrigatória", minLength: { value: 6, message: "Mínimo 6 caracteres"} })}
                className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-100 ${errors.novaSenha ? 'border-red-500 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}`}
                disabled={isSubmitting}
              />
              <button type="button" aria-label={mostrarSenha ? "Esconder senha" : "Mostrar senha"}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                onClick={() => setMostrarSenha(!mostrarSenha)} disabled={isSubmitting}>
                {mostrarSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.novaSenha && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.novaSenha.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="confirmarNovaSenha">Confirmar Nova Senha</label>
            <div className="relative">
              <input 
                type={mostrarSenha ? "text" : "password"} 
                id="confirmarNovaSenha"
                {...register("confirmarNovaSenha", { required: "Confirmação é obrigatória" })}
                className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-100 ${errors.confirmarNovaSenha ? 'border-red-500 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}`}
                disabled={isSubmitting}
              />
              <button type="button" aria-label={mostrarSenha ? "Esconder senha" : "Mostrar senha"}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                onClick={() => setMostrarSenha(!mostrarSenha)} disabled={isSubmitting}>
                {mostrarSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmarNovaSenha && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmarNovaSenha.message}</p>}
          </div>
          <button type="submit" disabled={isSubmitting}
            className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <KeyRound className="w-5 h-5 mr-2" />}
            {isSubmitting ? 'Salvando...' : 'Salvar Nova Senha'}
          </button>
        </form>
     </div>
  );
};

export default PaginaResetarSenha;