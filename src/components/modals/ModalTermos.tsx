import React from 'react';
import { X, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ModalTermosProps {
  isOpen: boolean;
  onClose: () => void; 
  onConfirm: () => void; 
  isLoading: boolean; 
}

const ModalTermos: React.FC<ModalTermosProps> = ({ isOpen, onClose, onConfirm, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col border dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Termos de Uso e Política de Privacidade
          </h2>
          <button onClick={onClose} disabled={isLoading} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-4 text-sm text-gray-600 dark:text-gray-300">
          <p>
            Ao continuar, você confirma que leu e concorda com nossos
            {' '}
            <Link to="/politicas#termos" target="_blank" className="text-green-600 dark:text-green-400 underline hover:text-green-700">
              Termos de Serviço
            </Link>
            {' '}
            e nossa
            {' '}
            <Link to="/politicas#privacidade" target="_blank" className="text-green-600 dark:text-green-400 underline hover:text-green-700">
              Política de Privacidade
            </Link>.
          </p>
          <p className="font-semibold text-gray-700 dark:text-gray-200">Nossos termos cobrem:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Como usamos seus dados (Nome, Email, CPF, Endereço) para processar e entregar seus pedidos.</li>
            <li>O uso de cookies e tecnologias semelhantes para melhorar sua experiência.</li>
            <li>Seus direitos de acordo com a Lei Geral de Proteção de Dados (LGPD), como acessar ou excluir seus dados.</li>
          </ul>
          <p>
            Ao clicar em "Concordo e Continuar", você autoriza o uso dos seus dados conforme descrito em nossa política para a finalidade exclusiva de prestação de nossos serviços (venda, entrega e suporte).
          </p>
        </div>

        <div className="flex flex-col sm:flex-row-reverse gap-3 p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full sm:w-auto px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white rounded-md disabled:opacity-50 flex items-center justify-center transition-colors shadow-sm"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Concordo e Continuar'}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            Discordo
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalTermos;