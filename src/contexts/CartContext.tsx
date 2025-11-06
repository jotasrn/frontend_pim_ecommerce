// src/contexts/CartContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Produto } from '../types';
import { showToast } from '../utils/toastHelper';

// Interface para um item dentro do carrinho (Produto + quantidade)
export interface ItemCarrinho extends Produto {
  quantidade: number;
}

// Interface para o que o nosso contexto irá fornecer (TUDO EM PORTUGUÊS)
interface TipoCarrinhoContext {
  itensDoCarrinho: ItemCarrinho[];
  adicionarAoCarrinho: (produto: Produto) => void;
  removerDoCarrinho: (produtoId: number) => void;
  atualizarQuantidade: (produtoId: number, quantidade: number) => void;
  limparCarrinho: () => void;
  getTotalItens: () => number;
  getPrecoTotal: () => number;
}

const CartContext = createContext<TipoCarrinhoContext | undefined>(undefined);

/**
 * Hook customizado para consumir o contexto do carrinho.
 */
export const useCarrinho = (): TipoCarrinhoContext => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCarrinho deve ser usado dentro de um CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  // Carrega o carrinho do localStorage ao iniciar
  const [itensDoCarrinho, setItensDoCarrinho] = useState<ItemCarrinho[]>(() => {
    try {
      const carrinhoSalvo = localStorage.getItem('carrinhoHortifruti');
      return carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];
    } catch {
      localStorage.removeItem('carrinhoHortifruti'); 
      return [];
    }
  });

  // Salva o carrinho no localStorage sempre que ele for alterado
  useEffect(() => {
    localStorage.setItem('carrinhoHortifruti', JSON.stringify(itensDoCarrinho));
  }, [itensDoCarrinho]);

  const adicionarAoCarrinho = (produto: Produto) => {
    setItensDoCarrinho(itensAnteriores => {
      const itemExistente = itensAnteriores.find(item => item.id === produto.id);
      
      if (itemExistente) {
        // Se o item já existe, apenas incrementa a quantidade
        return itensAnteriores.map(item =>
          item.id === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item
        );
      }
      // Se é um novo item, adiciona com quantidade 1
      return [...itensAnteriores, { ...produto, quantidade: 1 }];
    });
    showToast.success(`${produto.nome} adicionado ao carrinho!`);
  };

  const removerDoCarrinho = (produtoId: number) => {
    setItensDoCarrinho(itensAnteriores => itensAnteriores.filter(item => item.id !== produtoId));
    showToast.info("Item removido do carrinho.");
  };

  const atualizarQuantidade = (produtoId: number, quantidade: number) => {
    if (quantidade <= 0) {
      removerDoCarrinho(produtoId); // Remove o item se a quantidade for 0 ou menor
      return;
    }
    
    setItensDoCarrinho(itensAnteriores =>
      itensAnteriores.map(item =>
        item.id === produtoId ? { ...item, quantidade } : item
      )
    );
  };

  const limparCarrinho = () => {
    setItensDoCarrinho([]);
    showToast.info("Carrinho esvaziado.");
  };

  const getTotalItens = () => {
    return itensDoCarrinho.reduce((total, item) => total + item.quantidade, 0);
  };

  const getPrecoTotal = () => {
    return itensDoCarrinho.reduce((total, item) => {
      const preco = item.precoVenda; 
      return total + (preco * item.quantidade);
    }, 0);
  };

  const value = {
    itensDoCarrinho,
    adicionarAoCarrinho,
    removerDoCarrinho,
    atualizarQuantidade,
    limparCarrinho,
    getTotalItens,
    getPrecoTotal
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};