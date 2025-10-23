// src/services/newsletterService.ts
import api from './api';

interface NewsletterResponse {
  message: string;
}

export const newsletterService = {
  inscrever: async (email: string): Promise<NewsletterResponse> => {
    try {
      const response = await api.post<NewsletterResponse>('/api/newsletter/inscrever', { email });
      return response.data;
    } catch (error) {
      console.error('Erro ao inscrever na newsletter:', error);
      throw error;
    }
  },
};