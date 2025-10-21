// src/services/categoriaService.ts
import api from './api';
import { Categoria } from '../types';

export const categoriaService = {
  /**
   * Busca todas as categorias da API.
   */
  listar: async (): Promise<Categoria[]> => {
    try {
      const response = await api.get<Categoria[]>('/api/categorias');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar categorias:', error);
      throw new Error('Não foi possível carregar as categorias.');
    }
  },
};