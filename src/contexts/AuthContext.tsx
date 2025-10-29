import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { Usuario, RegistroRequest } from '../types';
import { authService } from '../services/authService';
import api from '../services/api';
import { useGoogleLogin, CodeResponse } from '@react-oauth/google';
import { showToast } from '../utils/toastHelper';
import { formatApiError } from '../utils/apiHelpers';

interface AuthContextType {
  usuario: Usuario | null;
  carregando: boolean;
  googleCodePendente: string | null;
  login: (email: string, senha: string) => Promise<Usuario | null>;
  registrar: (dadosRegistro: RegistroRequest) => Promise<Usuario | null>;
  logout: () => void;
  verificarPermissao: (permissao: string) => boolean;
  loginComGoogle: () => void;
  finalizarLoginGoogle: () => Promise<Usuario | null>;
  cancelarLoginGoogle: () => void;
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
  const [googleCodePendente, setGoogleCodePendente] = useState<string | null>(null);

  const logout = useCallback(() => {
    setUsuario(null);
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    showToast.info("Sessão encerrada.");
  }, []);

  useEffect(() => {
    const carregarUsuarioLogado = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const dadosUsuario = await authService.getMeuPerfil();
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
  }, [logout]);

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
      logout();
      throw error;
    } finally {
      setCarregando(false);
    }
  };

  const registrar = async (dadosRegistro: RegistroRequest): Promise<Usuario | null> => {
    setCarregando(true);
    try {
      await authService.registrar(dadosRegistro);
      return await login(dadosRegistro.email, dadosRegistro.senha);
    } catch (error) {
      setCarregando(false);
      throw error;
    }
  };

  const processarSucessoGoogle = (codeResponse: Omit<CodeResponse, 'error' | 'error_description' | 'error_uri'>) => {
    setGoogleCodePendente(codeResponse.code);
    setCarregando(false);
  };

  // --- CORREÇÃO AQUI (Erro 1 e 2) ---
  const processarErroGoogle = (error?: unknown) => {
    console.error('Erro no fluxo do Google Login:', error);
    // Usando formatApiError e mudando 'any' para 'unknown'
    showToast.error(formatApiError(error) || "Falha ao iniciar login com Google. Verifique pop-ups.");
    setCarregando(false);
  }
  // --- FIM DA CORREÇÃO ---

  const loginComGoogle = useGoogleLogin({
    onSuccess: processarSucessoGoogle,
    onError: processarErroGoogle,
    onNonOAuthError: () => setCarregando(false),
    flow: 'auth-code',
  });

  const finalizarLoginGoogle = async (): Promise<Usuario | null> => {
    if (!googleCodePendente) {
      throw new Error("Nenhum código de autenticação do Google pendente.");
    }
    
    setCarregando(true);
    
    try {
      const { token } = await authService.loginComGoogle(googleCodePendente);
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const dadosUsuario = await authService.getMeuPerfil();
      const nomeNormalizado = dadosUsuario.nomeCompleto || dadosUsuario.nome || 'Usuário Google';
      const usuarioLogado = { ...dadosUsuario, nome: nomeNormalizado };
      
      setUsuario(usuarioLogado);
      showToast.success(`Bem-vindo(a), ${nomeNormalizado.split(' ')[0]}!`);
      setGoogleCodePendente(null);
      return usuarioLogado;

    } catch (error) {
      logout();
      setGoogleCodePendente(null);
      throw error; // Deixa o PaginaInicial.tsx mostrar o erro formatado
    } finally {
      setCarregando(false);
    }
  };
  
  const cancelarLoginGoogle = () => {
      setGoogleCodePendente(null);
  }

  const verificarPermissao = (permissao: string): boolean => {
    return usuario?.permissao?.toLowerCase() === permissao.toLowerCase();
  };

  const value = {
    usuario,
    carregando,
    googleCodePendente,
    login,
    registrar,
    logout,
    verificarPermissao,
    loginComGoogle,
    finalizarLoginGoogle,
    cancelarLoginGoogle
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};