// src/components/modals/ModalConfirmarExclusao.tsx
import React from 'react';
import { X, Loader2, AlertTriangle } from 'lucide-react';

interface ModalConfirmarExclusaoProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

const ModalConfirmarExclusao: React.FC<ModalConfirmarExclusaoProps> = ({ isOpen, onClose, onConfirm, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md border dark:border-gray-700">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Confirmar Exclusão de Conta
          </h2>
          <button onClick={onClose} disabled={isLoading} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Você tem certeza que deseja excluir sua conta? Esta ação é permanente e irreversível.
            Todos os seus dados, histórico de pedidos e endereços serão removidos.
          </p>
        </div>
        <div className="flex justify-end gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 border-t dark:border-gray-700">
            <button type="button" onClick={onClose} disabled={isLoading} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
              Cancelar
            </button>
            <button type="button" onClick={onConfirm} disabled={isLoading} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center justify-center min-w-[120px]">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sim, Excluir Conta"}
            </button>
        </div>
      </div>
    </div>
  );
};
export default ModalConfirmarExclusao;