// src/services/faqService.ts
import api from './api';
import { Faq } from '../types';

export const faqService = {
  listarAtivos: async (): Promise<Faq[]> => {
    try {
      const response = await api.get<Faq[]>('/api/faq/ativos');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar FAQs ativos:', error);
      throw new Error('Não foi possível carregar as perguntas frequentes.');
    }
  },
};