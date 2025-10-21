import api from './api';
import { Usuario, Cliente } from '../types';

// --- Interfaces para os dados da Requisição ---

/**
 * Define a estrutura dos dados que enviamos para a API de login.
 * Alinhado com o `LoginDTO` do back-end.
 */
interface LoginRequest {
  email: string;
  senha: string;
}

/**
 * Define a estrutura dos dados que esperamos da API de login.
 * Alinhado com o `TokenResponseDTO` do back-end.
 */
interface LoginResponse {
  token: string;
}

/**
 * Define a estrutura dos dados que enviamos para a API de registo.
 * Alinhado com o `ClienteCadastroDTO` do back-end.
 */
interface RegistroRequest {
  nomeCompleto: string;
  email: string;
  senha: string;
  cpf: string;
  telefone: string;
}

// --- Serviço de Autenticação ---

export const authService = {
  
  /**
   * Envia as credenciais de login para a API.
   * @param dadosLogin Objeto com email e senha.
   * @returns Uma Promise com o objeto contendo o token JWT.
   */
  login: async (dadosLogin: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await api.post<LoginResponse>('/api/auth/login', dadosLogin);
      return response.data;
    } catch (error) {
      console.error("Erro no serviço de login:", error);
      // Lança o erro para que o AuthContext ou o componente possam tratá-lo
      throw error; 
    }
  },

  /**
   * Envia os dados de registo de um novo cliente para a API.
   * @param dadosRegistro Objeto com os dados do novo cliente.
   * @returns Uma Promise com o objeto Cliente criado.
   */
  registrar: async (dadosRegistro: RegistroRequest): Promise<Cliente> => {
    try {
      const response = await api.post<Cliente>('/api/clientes/registrar', dadosRegistro);
      return response.data;
    } catch (error) {
      console.error("Erro no serviço de registo:", error);
      throw error;
    }
  },

  /**
   * Busca os dados do usuário autenticado.
   * @returns Uma Promise com os dados do Usuário.
   */
  getMeuPerfil: async (): Promise<Usuario> => { 
        try {
            const response = await api.get<Usuario>('/api/usuarios/me');
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar perfil:", error);
            throw error;
        }
    },

  /**
   * Envia o código de autorização do Google para o back-end.
   * @param code O código recebido do pop-up do Google.
   * @returns Uma Promise com o objeto contendo o token JWT.
   */
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
};