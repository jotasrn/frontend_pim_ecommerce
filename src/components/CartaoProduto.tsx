// src/components/CartaoProduto.tsx
import React from 'react';
import { Plus, Check } from 'lucide-react';
import { Produto } from '../types';
import { useCarrinho, ItemCarrinho } from '../contexts/CartContext';
import { formatCurrency } from '../utils/apiHelpers';

interface CartaoProdutoProps {
  product: Produto;
  onClick: () => void;
}

const CartaoProduto: React.FC<CartaoProdutoProps> = ({ product, onClick }) => {
  const { adicionarAoCarrinho, itensDoCarrinho } = useCarrinho();
  const isInCart = itensDoCarrinho.some((item: ItemCarrinho) => item.id === product.id);
  const onSale = product.promocoes && product.promocoes.length > 0;

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 group cursor-pointer border border-gray-200 dark:border-gray-700 flex flex-col" // Added flex flex-col
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden">
        <img src={product.imagemUrl || 'https://via.placeholder.com/300'} alt={product.nome}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {onSale && ( 
          <div className="absolute top-2 right-2 bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300 text-xs font-medium px-2.5 py-0.5 rounded-full border border-red-300 dark:border-red-700">
            Oferta
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100 line-clamp-1">{product.nome}</h3>
          <div className="text-right flex-shrink-0 pl-2">
            <span className="text-green-600 dark:text-green-400 font-bold whitespace-nowrap">
              {formatCurrency(product.precoVenda)}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-normal ml-1">/{product.tipoMedida}</span>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">
          {product.descricao}
        </p>
        <button
          onClick={(e) => { e.stopPropagation(); adicionarAoCarrinho(product); }}
          className={`w-full mt-auto py-2 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors ${
            isInCart
              ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/60 border border-green-300 dark:border-green-700'
              : 'bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white shadow-sm'
          }`}
        >
          {isInCart ? (
            <><Check className="w-4 h-4" /> <span>Adicionado</span></>
          ) : (
            <><Plus className="w-4 h-4" /> <span>Adicionar</span></>
          )}
        </button>
      </div>
    </div>
  );
};

export default CartaoProduto;