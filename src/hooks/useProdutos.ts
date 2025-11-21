import { useState, useEffect, useCallback } from 'react';
import { produtoService } from '../services/produtoService';
import { showToast } from '../utils/toastHelper';
import { Produto, FiltrosProdutos } from '../types';

interface UseProdutosReturn {
  produtos: Produto[];
  loading: boolean;
  error: string | null;
}

export const useProdutos = (filtrosIniciais: FiltrosProdutos = {}): UseProdutosReturn => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const filtrosEstaveis = JSON.stringify(filtrosIniciais);

  const carregarProdutos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const filtros = JSON.parse(filtrosEstaveis);
      const dados = await produtoService.listar(filtros);
      setProdutos(dados);
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      showToast.error("Não foi possível carregar os produtos.");
      console.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [filtrosEstaveis]); 


  useEffect(() => {
    carregarProdutos();
  }, [carregarProdutos]);

  return {
    produtos,
    loading,
    error,
  };
};