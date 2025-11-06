// src/components/modals/ModalNotificacaoEntrega.tsx
import React from 'react';
import { X, MailCheck } from 'lucide-react';

interface ModalNotificacaoEntregaProps {
  onClose: () => void;
}

const ModalNotificacaoEntrega: React.FC<ModalNotificacaoEntregaProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md border dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
            <MailCheck className="w-5 h-5 mr-2 text-green-500" />
            Pedido a Caminho!
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Seu pedido foi confirmado e já estamos separando seus produtos.
            </p>
            <p className="font-semibold text-gray-800 dark:text-gray-200">
              Fique de olho no seu e-mail (Gmail, etc.)! 
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Todas as atualizações sobre a sua entrega, como "Em Rota" e "Entregue", serão enviadas para o e-mail cadastrado.
            </p>
        </div>

        <div className="flex justify-end gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 border-t dark:border-gray-700">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 transition-colors shadow-sm"
          >
            OK, Entendi
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalNotificacaoEntrega;