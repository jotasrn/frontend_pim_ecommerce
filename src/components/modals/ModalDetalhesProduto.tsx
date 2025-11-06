import React from 'react';
import { X, Check, Plus } from 'lucide-react'; 
import { Produto } from '../../types';
import { useCarrinho, ItemCarrinho } from '../../contexts/CartContext';
import { formatCurrency, formatDate } from '../../utils/apiHelpers';

interface ModalDetalhesProdutoProps { 
  produto: Produto;
  onClose: () => void;
}

const ModalDetalhesProduto: React.FC<ModalDetalhesProdutoProps> = ({ produto, onClose }) => { 

  const { adicionarAoCarrinho, itensDoCarrinho } = useCarrinho();
  const isInCart = itensDoCarrinho.some((item: ItemCarrinho) => item.id === produto.id);

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 px-6 py-4 border-b dark:border-gray-700 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{produto.nome}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 flex-grow">
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            <div>
              <img
                src={produto.imagemUrl || 'https://via.placeholder.com/400'}
                alt={produto.nome}
                className="w-full h-64 md:h-80 object-cover rounded-lg border dark:border-gray-700"
              />
            </div>

            <div className="space-y-4 flex flex-col"> 
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">Descrição</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{produto.descricao || 'Sem descrição disponível.'}</p>
              </div>

              <div className="space-y-2 border-t dark:border-gray-700 pt-4 flex-grow">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Preço:</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(produto.precoVenda)}<span className="text-xs font-normal text-gray-500 dark:text-gray-400">/{produto.tipoMedida}</span></span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Categoria:</span>
                  <span className="capitalize text-gray-900 dark:text-gray-100">{produto.categoria?.nome ?? 'N/A'}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Validade:</span>
                  <span className="text-gray-900 dark:text-gray-100">{produto.dataValidade ? formatDate(produto.dataValidade) : 'Não informado'}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Colheita/Produção:</span>
                  <span className="text-gray-900 dark:text-gray-100">{produto.dataColheita ? formatDate(produto.dataColheita) : 'Não informado'}</span>
                </div>
              </div>

              <div className="pt-4 border-t dark:border-gray-700 mt-auto">
                <button
                  onClick={() => {
                    adicionarAoCarrinho(produto);
                    onClose();
                  }}
                  className={`w-full py-3 px-4 rounded-md font-medium transition-colors flex items-center justify-center shadow-sm disabled:opacity-70 ${
                    isInCart
                      ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/60 border border-green-300 dark:border-green-700'
                      : 'bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white'
                  }`}
                >
                  {isInCart ? (
                      <><Check className="w-5 h-5 mr-2" /> Adicionado</>
                  ) : (
                      <><Plus className="w-5 h-5 mr-2" /> Adicionar ao Carrinho</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalDetalhesProduto;