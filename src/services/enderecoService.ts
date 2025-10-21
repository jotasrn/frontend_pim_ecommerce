// src/services/enderecoService.ts
import api from './api';
import { Endereco } from '../types';

// O DTO para criar/atualizar um endereço (sem o ID e o cliente)
// Também omitimos latitude/longitude, pois o back-end calcula isso
type EnderecoData = Omit<Endereco, 'id' | 'latitude' | 'longitude'>;

export const enderecoService = {
  /**
   * Adiciona um novo endereço para um cliente.
   */
  adicionar: async (clienteId: number, dadosEndereco: EnderecoData): Promise<Endereco> => {
    try {
      const response = await api.post<Endereco>(`/api/enderecos/cliente/${clienteId}`, dadosEndereco);
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar endereço:', error);
      throw error;
    }
  },
  
  /**
   * Lista os endereços de um cliente.
   */
  listar: async (clienteId: number): Promise<Endereco[]> => {
    try {
      const response = await api.get<Endereco[]>(`/api/enderecos/cliente/${clienteId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar endereços:', error);
      throw new Error('Não foi possível carregar os seus endereços.');
    }
  },

  /**
   * Atualiza um endereço existente.
   */
  atualizar: async (enderecoId: number, dadosEndereco: EnderecoData): Promise<Endereco> => {
    try {
      const response = await api.put<Endereco>(`/api/enderecos/${enderecoId}`, dadosEndereco);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar endereço:', error);
      throw error;
    }
  },

  /**
   * Remove um endereço.
   */
  remover: async (enderecoId: number): Promise<void> => {
    try {
      await api.delete(`/api/enderecos/${enderecoId}`);
    } catch (error) {
      console.error('Erro ao remover endereço:', error);
      throw error;
    }
  }
};