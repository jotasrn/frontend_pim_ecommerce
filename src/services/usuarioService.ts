// src/services/usuarioService.ts
import api from './api';
import { Usuario } from '../types';

export interface PerfilUpdateDTO {
  nomeCompleto: string;
  telefone: string;
  cpf: string;
}

export const usuarioService = {
  atualizarMeuPerfil: async (dados: PerfilUpdateDTO): Promise<Usuario> => {
    try {
      const response = await api.put<Usuario>('/api/usuarios/me', dados);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      throw error;
    }
  },


  deletarMinhaConta: async (): Promise<void> => {
    try {
      await api.delete('/api/usuarios/me');
    } catch (error) {
      console.error("Erro ao deletar conta:", error);
      throw error;
    }
  }
};