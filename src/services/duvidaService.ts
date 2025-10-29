// src/services/duvidaService.ts
import api from './api';
import { Duvida, DuvidaRequestDTO } from '../types';

interface DuvidaSubmitResponse {
  id: number;
}

export const duvidaService = {
  submeterDuvida: async (dadosDuvida: DuvidaRequestDTO): Promise<DuvidaSubmitResponse> => {
    try {
      const response = await api.post<DuvidaSubmitResponse>('/api/duvidas', dadosDuvida);
      return response.data;
    } catch (error) {
      console.error('Erro ao submeter dúvida:', error);
      throw error;
    }
  },
  listarPublicasRespondidas: async (): Promise<Duvida[]> => {
    try {
      const response = await api.get<Duvida[]>('/api/duvidas/publicas');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar dúvidas públicas:', error);
      throw new Error('Não foi possível carregar as dúvidas da comunidade.');
    }
  },
};