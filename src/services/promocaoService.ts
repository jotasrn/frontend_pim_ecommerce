// src/services/promocaoService.ts
import api from './api';
import { Promocao } from '../types'; // Certifique-se que Promocao em types.ts inclui a lista de produtos

export const promocaoService = {

  listar: async (): Promise<Promocao[]> => {
    try {
      // Ajuste o endpoint se necessário. Idealmente, ele já traz os produtos.
      const response = await api.get<Promocao[]>('/api/promocoes');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar promoções:', error);
      throw new Error('Não foi possível carregar as promoções.');
    }
  },

  // Adicione outras funções relacionadas a promoções aqui se necessário (criar, editar, etc.)
};