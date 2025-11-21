// src/services/produtoService.ts
import api from './api';
import { Produto, FiltrosProdutos } from '../types';

export const produtoService = {

  listar: async (filtros: FiltrosProdutos = {}): Promise<Produto[]> => {
    try {
      const params = new URLSearchParams(filtros as Record<string, string>).toString();
      const response = await api.get<Produto[]>(`/api/produtos/ativos?${params}`); 
      return response.data;
    } catch (error) {
      console.error('Erro ao listar produtos:', error);
      throw new Error('Não foi possível carregar os produtos.');
    }
  },

  buscarPorId: async (id: number): Promise<Produto> => {
    try {
      const response = await api.get<Produto>(`/api/produtos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar produto ${id}:`, error);
      throw new Error('Não foi possível encontrar o produto.');
    }
  },
};