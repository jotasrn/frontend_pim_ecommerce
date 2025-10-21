// src/services/vendaService.ts
import api from './api';
import { Venda, VendaDTO } from '../types';

export const vendaService = {
  /**
   * Envia o pedido completo para o back-end para processamento.
   */
  realizarVenda: async (dadosVenda: VendaDTO): Promise<Venda> => {
    try {
      const response = await api.post<Venda>('/api/vendas', dadosVenda);
      return response.data;
    } catch (error) {
      console.error('Erro ao realizar venda:', error);
      throw error;
    }
  },

  /**
   * Busca o histórico de vendas do cliente logado.
   */
  listarMinhasVendas: async (): Promise<Venda[]> => {
    try {
      // O token JWT já é adicionado automaticamente pelo interceptor do api.ts
      const response = await api.get<Venda[]>('/api/vendas/minhas-vendas');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar minhas vendas:', error);
      throw new Error('Não foi possível carregar o seu histórico de pedidos.');
    }
  },
};