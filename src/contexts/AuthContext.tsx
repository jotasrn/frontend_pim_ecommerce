// src/contexts/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { Usuario, RegistroRequest } from '../types';
import { authService } from '../services/authService';
import api from '../services/api';
import { useGoogleLogin, CodeResponse } from '@react-oauth/google';
import { showToast } from '../utils/toastHelper'; 
import { formatApiError } from '../utils/apiHelpers';

// --- Tipagem do Contexto ---
interface AuthContextType {
  usuario: Usuario | null;
  carregando: boolean;
  login: (email: string, senha: string) => Promise<Usuario | null>; 
  registrar: (dadosRegistro: RegistroRequest) => Promise<Usuario | null>; 
  logout: () => void;
  verificarPermissao: (permissao: string) => boolean;
  loginComGoogle: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  const logout = useCallback(() => {
    setUsuario(null);
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    showToast.info("Sessão encerrada."); // Mensagem de logout
  }, []);

  // Efeito para carregar usuário do localStorage ao iniciar
  useEffect(() => {
    const carregarUsuarioLogado = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const dadosUsuario = await authService.getMeuPerfil();
          // Normaliza o nome do usuário
          const nomeNormalizado = dadosUsuario.nomeCompleto || dadosUsuario.nome || 'Usuário';
          setUsuario({ ...dadosUsuario, nome: nomeNormalizado });
        } catch (error) {
          console.error("Token salvo inválido ou erro ao buscar perfil:", error);
          logout();
        }
      }
      setCarregando(false); 
    };
    carregarUsuarioLogado();
  }, [logout]); // logout é dependência estável

  const login = async (email: string, senha: string): Promise<Usuario | null> => {
    setCarregando(true);
    try {
      const { token } = await authService.login({ email, senha });
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const dadosUsuario = await authService.getMeuPerfil();
      const nomeNormalizado = dadosUsuario.nomeCompleto || dadosUsuario.nome || 'Usuário';
      const usuarioLogado = { ...dadosUsuario, nome: nomeNormalizado };
      setUsuario(usuarioLogado);
      showToast.success(`Bem-vindo(a) de volta, ${nomeNormalizado.split(' ')[0]}!`);
      return usuarioLogado;

    } catch (error) {
      console.error("Erro no login:", error);
      logout(); // Garante limpeza em caso de falha
      throw error;
    } finally {
      setCarregando(false);
    }
  };

  // Função de Registro
  const registrar = async (dadosRegistro: RegistroRequest): Promise<Usuario | null> => {
    setCarregando(true);
    try {
      await authService.registrar(dadosRegistro);
      return await login(dadosRegistro.email, dadosRegistro.senha);

    } catch (error) {
      console.error("Erro no registro:", error);
      setCarregando(false);
      throw error;
    }
  };


  const processarSucessoGoogle = async (codeResponse: Omit<CodeResponse, 'error' | 'error_description' | 'error_uri'>) => {
    if (carregando) return;
    setCarregando(true);
    try {
      const { token } = await authService.loginComGoogle(codeResponse.code);
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const dadosUsuario = await authService.getMeuPerfil();
      const nomeNormalizado = dadosUsuario.nomeCompleto || dadosUsuario.nome || 'Usuário Google';
      setUsuario({ ...dadosUsuario, nome: nomeNormalizado });
      showToast.success(`Bem-vindo(a), ${nomeNormalizado.split(' ')[0]}!`);

    } catch (error) {
      console.error("Falha no processamento do login com Google:", error);
      showToast.error(formatApiError(error));
      logout();
    } finally {
      setCarregando(false);
    }
  };

  const loginComGoogle = useGoogleLogin({
    onSuccess: processarSucessoGoogle,
    onError: (error) => {
        console.error('Erro no fluxo do Google Login:', error);
        showToast.error("Falha ao iniciar login com Google. Verifique pop-ups.");
    },
    flow: 'auth-code',
  });

  const verificarPermissao = (permissao: string): boolean => {
    return usuario?.permissao?.toLowerCase() === permissao.toLowerCase();
  };

  const value = {
    usuario,
    carregando,
    login,
    registrar,
    logout,
    verificarPermissao,
    loginComGoogle,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};