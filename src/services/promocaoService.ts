// src/services/promocaoService.ts
import api from './api';
import { Promocao } from '../types'; 
export const promocaoService = {

  listar: async (): Promise<Promocao[]> => {
    try {
      const response = await api.get<Promocao[]>('/api/promocoes');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar promoções:', error);
      throw new Error('Não foi possível carregar as promoções.');
    }
  },
};