// src/services/authService.ts
import api from './api';
import { Usuario, Cliente, RegistroRequest } from '../types';

interface LoginRequest {
  email: string;
  senha: string;
}

interface LoginResponse {
  token: string;
}

interface ResetSenhaResponse {
  message: string;
}
interface MudarSenhaResponse {
  message: string; 
}

export const authService = {
  
  login: async (dadosLogin: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await api.post<LoginResponse>('/api/auth/login', dadosLogin);
      return response.data;
    } catch (error) {
      console.error("Erro no serviço de login:", error);
      throw error;
    }
  },

  registrar: async (dadosRegistro: RegistroRequest): Promise<Cliente> => {
    try {
      const response = await api.post<Cliente>('/api/clientes/registrar', dadosRegistro);
      return response.data;
    } catch (error) {
      console.error("Erro no serviço de registo:", error);
      throw error;
    }
  },

  getMeuPerfil: async (): Promise<Usuario> => {
    try {
      const response = await api.get<Usuario>('/api/usuarios/me');
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar perfil:", error);
      throw error;
    }
  },

  loginComGoogle: async (code: string): Promise<LoginResponse> => {
    try {
      const response = await api.post<LoginResponse>('/api/auth/google-login', {
        code: code,
        redirectUri: window.location.origin
      });
      return response.data;
    } catch (error) {
      console.error("Erro no serviço de login com Google:", error);
      throw error;
    }
  },

  solicitarResetSenha: async (email: string): Promise<ResetSenhaResponse> => {
    try {
      const response = await api.post<ResetSenhaResponse>('/api/auth/solicitar-reset-senha', { email });
      return response.data;
    } catch (error) {
      console.error("Erro ao solicitar reset de senha:", error);
      throw error;
    }
  },

  resetarSenha: async (token: string, novaSenha: string): Promise<ResetSenhaResponse> => {
    try {
      const response = await api.post<ResetSenhaResponse>(
        `/api/auth/resetar-senha?token=${token}`, 
        { novaSenha }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao resetar senha:", error);
      throw error;
    }
  },

  mudarSenha: async (senhaAtual: string, novaSenha: string): Promise<MudarSenhaResponse> => {
    try {
      const payload = {
        senhaAtual: senhaAtual,
        novaSenha: novaSenha
      };
      const response = await api.post<MudarSenhaResponse>('/api/usuarios/mudar-senha', payload);
      return response.data;
    } catch (error) {
      console.error("Erro ao mudar senha:", error);
      throw error;
    }
  },
};