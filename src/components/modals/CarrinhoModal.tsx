import React from 'react';
import { X, Trash, Plus, Minus, ShoppingBag} from 'lucide-react';
import { useCarrinho } from '../../contexts/CartContext';
import { formatCurrency } from '../../utils/apiHelpers';

interface ModalCarrinhoProps { 
  onClose: () => void;
  onCheckout: () => void;
}

const ModalCarrinho: React.FC<ModalCarrinhoProps> = ({ onClose, onCheckout }) => { 
  const {
    itensDoCarrinho,
    removerDoCarrinho,
    atualizarQuantidade,
    getPrecoTotal,
    limparCarrinho
  } = useCarrinho();

  const precoTotal = getPrecoTotal();

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-sm flex items-end justify-end z-50 sm:items-center sm:justify-center animate-fadeIn">
      <div
        className="bg-white dark:bg-gray-800 w-full max-w-md h-full sm:h-auto sm:max-h-[80vh] sm:rounded-lg overflow-hidden shadow-xl animate-slideInRight sm:animate-none border dark:border-gray-700 flex flex-col" // Adicionado flex flex-col
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 px-4 py-3 border-b dark:border-gray-700 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
            <ShoppingBag className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
            Seu Carrinho
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-4 flex-grow">
          {itensDoCarrinho.length === 0 ? (
            <div className="text-center py-12 flex flex-col items-center">
                <ShoppingBag className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" strokeWidth={1} />
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Seu carrinho está vazio</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Adicione produtos para vê-los aqui.</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {itensDoCarrinho.map((item) => (
                  <div key={item.id} className="flex items-center justify-between bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-lg p-3 shadow-sm transition-shadow duration-150">
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <img
                        src={item.imagemUrl || 'https://via.placeholder.com/150'}
                        alt={item.nome}
                        className="w-14 h-14 object-cover rounded-md flex-shrink-0"
                      />
                      <div className="overflow-hidden">
                        <h4 className="font-medium text-gray-800 dark:text-gray-100 truncate">{item.nome}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{formatCurrency(item.precoVenda)}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 sm:space-x-4 flex-shrink-0">
                      <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded">
                        <button
                          onClick={() => atualizarQuantidade(item.id, item.quantidade - 1)}
                          className="px-2 py-1 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                          aria-label="Diminuir quantidade"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm text-gray-700 dark:text-gray-200 tabular-nums">{item.quantidade}</span>
                        <button
                          onClick={() => atualizarQuantidade(item.id, item.quantidade + 1)}
                          className="px-2 py-1 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                          aria-label="Aumentar quantidade"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removerDoCarrinho(item.id)}
                        className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                        aria-label="Remover item"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

         {itensDoCarrinho.length > 0 && (
             <div className="bg-gray-50 dark:bg-gray-900 p-4 border-t dark:border-gray-700 flex-shrink-0">
                 <div className="border-t border-gray-200 dark:border-gray-700 pt-4 pb-2">
                   <div className="flex justify-between text-sm mb-2">
                     <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                     <span className="font-medium text-gray-800 dark:text-gray-100">{formatCurrency(precoTotal)}</span>
                   </div>
                   <div className="flex justify-between text-sm mb-2">
                     <span className="text-gray-600 dark:text-gray-400">Frete</span>
                     <span className="font-medium text-green-600 dark:text-green-400">Grátis</span>
                   </div>
                   <div className="flex justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                     <span className="text-base font-semibold text-gray-900 dark:text-gray-50">Total</span>
                     <span className="text-base font-bold text-green-700 dark:text-green-400">{formatCurrency(precoTotal)}</span>
                   </div>
                 </div>

                 <div className="space-y-3 mt-6">
                   <button
                     onClick={onCheckout}
                     className="w-full py-2.5 px-4 bg-green-600 dark:bg-green-500 text-white font-medium rounded-md hover:bg-green-700 dark:hover:bg-green-600 transition-colors flex items-center justify-center shadow-sm"
                   >
                     Finalizar Pedido
                   </button>

                   <div className="flex items-center justify-between">
                     <button
                       onClick={onClose}
                       className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                     >
                       Continuar Comprando
                     </button>
                     <button
                       onClick={limparCarrinho}
                       className="text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                     >
                       Limpar Carrinho
                     </button>
                   </div>
                 </div>
             </div>
         )}
      </div>
    </div>
  );
};

export default ModalCarrinho;