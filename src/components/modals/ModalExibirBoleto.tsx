// src/components/modals/ModalExibirBoleto.tsx
import React, { useState } from 'react';
import { X, Copy, Check, FileText } from 'lucide-react';
import { Venda } from '../../types';
import { showToast } from '../../utils/toastHelper';
import { formatCurrency } from '../../utils/apiHelpers';

interface ModalExibirBoletoProps {
  venda: Venda;
  onClose: () => void;
}

const ModalExibirBoleto: React.FC<ModalExibirBoletoProps> = ({ venda, onClose }) => {
  const [copiado, setCopiado] = useState(false);

  const handleCopy = () => {
    if (venda.boletoLinhaDigitavel) {
      navigator.clipboard.writeText(venda.boletoLinhaDigitavel);
      setCopiado(true);
      showToast.success("Linha digitável copiada!");
      setTimeout(() => setCopiado(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col border dark:border-gray-700">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Pagamento por Boleto
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-5">
            O boleto foi gerado. Você pode copiá-lo ou abrir o PDF para imprimir.
          </p>

          <a
            href={venda.boletoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-full py-3 px-5 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 transition-colors shadow-sm text-lg"
          >
            <FileText className="w-5 h-5 mr-2" />
            Abrir PDF do Boleto
          </a>

           <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">(Abre em nova aba)</p>

          <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-6">
            {formatCurrency(venda.valorTotal || 0)}
          </p>

          <div className="mt-6">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Linha Digitável:</p>
            <div className="relative">
              <input
                type="text"
                readOnly
                value={venda.boletoLinhaDigitavel || "Carregando..."}
                className="w-full text-xs text-center text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 p-3 rounded-md border dark:border-gray-600 pr-10"
              />
              <button
                onClick={handleCopy}
                disabled={!venda.boletoLinhaDigitavel}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 rounded-md bg-gray-200 dark:bg-gray-600"
              >
                {copiado ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mt-6">
            O pagamento pode levar até 2 dias úteis para ser compensado.
          </p>

           <button
             onClick={onClose}
             className="mt-6 w-full py-2 px-4 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 font-medium rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
           >
             OK, Pedido Realizado
           </button>
        </div>
      </div>
    </div>
  );
};

export default ModalExibirBoleto;