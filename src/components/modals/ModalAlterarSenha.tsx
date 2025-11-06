// src/components/modals/ModalAlterarSenha.tsx
import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { X, Loader2, Eye, EyeOff } from 'lucide-react'; 
import { showToast } from '../../utils/toastHelper';
import { formatApiError } from '../../utils/apiHelpers'; 
import { authService } from '../../services/authService';

interface ModalAlterarSenhaProps {
  isOpen: boolean;
  onClose: () => void;
}

type SenhaFormData = {
  senhaAtual: string;
  novaSenha: string;
  confirmarNovaSenha: string;
};

const ModalAlterarSenha: React.FC<ModalAlterarSenhaProps> = ({ isOpen, onClose }) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<SenhaFormData>();
  const [erroApi, setErroApi] = useState<string | null>(null);
  const [mostrarSenha, setMostrarSenha] = useState(false); 

  const onSubmit: SubmitHandler<SenhaFormData> = async (data) => {
    setErroApi(null);
    if (data.novaSenha !== data.confirmarNovaSenha) {
      setErroApi("As novas senhas não coincidem.");
      return;
    }

    try {
      await authService.mudarSenha(data.senhaAtual, data.novaSenha);
      showToast.success("Senha alterada com sucesso!");
      reset();
      onClose();
    } catch (err) {
      setErroApi(formatApiError(err));
    }
  };

  const handleClose = () => {
    reset();
    setErroApi(null);
    setMostrarSenha(false);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md border dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Alterar Senha</h2>
          <button onClick={handleClose} disabled={isSubmitting} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {erroApi && (
              <div className="mb-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded text-center text-sm">
                {erroApi}
              </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="senhaAtual">Senha Atual</label>
            <div className="relative">
              <input 
                type={mostrarSenha ? "text" : "password"}
                id="senhaAtual"
                {...register("senhaAtual", { required: "Senha atual é obrigatória" })}
                className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-100 ${errors.senhaAtual ? 'border-red-500 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}`}
                disabled={isSubmitting}
              />
              <button type="button" aria-label={mostrarSenha ? "Esconder senha" : "Mostrar senha"}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                onClick={() => setMostrarSenha(!mostrarSenha)} disabled={isSubmitting}>
                {mostrarSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.senhaAtual && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.senhaAtual.message}</p>}
          </div>
          
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
          
          <div className="flex justify-end gap-3 pt-4 border-t dark:border-gray-700">
            <button type="button" onClick={handleClose} disabled={isSubmitting} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 disabled:opacity-50 flex items-center justify-center min-w-[100px] transition-colors shadow-sm">
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default ModalAlterarSenha;