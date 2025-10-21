// src/hooks/usePedidos.ts
import { useState, useEffect, useCallback } from 'react';
import { vendaService } from '../services/vendaService';
import { showToast } from '../utils/toastHelper';
import { Venda } from '../types';

interface UsePedidosReturn {
  pedidos: Venda[];
  loading: boolean;
  error: string | null;
}

export const usePedidos = (): UsePedidosReturn => {
  const [pedidos, setPedidos] = useState<Venda[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const carregarPedidos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const dados = await vendaService.listarMinhasVendas();
      setPedidos(dados);
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      showToast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarPedidos();
  }, [carregarPedidos]);

  return {
    pedidos,
    loading,
    error,
  };
};