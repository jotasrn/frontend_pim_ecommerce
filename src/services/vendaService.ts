import api from './api';
import { Venda, VendaDTO } from '../types';

export const vendaService = {
  realizarVenda: async (vendaDTO: VendaDTO): Promise<Venda> => {
    try {
      const response = await api.post<Venda>('/api/vendas', vendaDTO);
      return response.data;
    } catch (error) {
      console.error('Erro ao realizar venda:', error);
      throw error;
    }
  },

  listarMinhasVendas: async (): Promise<Venda[]> => {
    try {
      const response = await api.get<Venda[]>('/api/vendas/minhas-vendas');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar minhas vendas:', error);
      throw error;
    }
  },

  baixarComprovante: async (pedidoId: number): Promise<Blob> => {
     try {
       const response = await api.get(`/api/vendas/${pedidoId}/comprovante`, {
         responseType: 'blob',
       });
       return new Blob([response.data], { type: 'application/pdf' });
     } catch (error) {
       console.error('Erro ao baixar comprovante:', error);
       throw error;
     }
  },
};