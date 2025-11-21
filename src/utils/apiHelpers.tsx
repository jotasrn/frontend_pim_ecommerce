import axios, { AxiosError } from 'axios';

// --- Interfaces e Tipos ---

interface ApiErrorData {
  message?: string;
  error?: string;
}

// --- Funções Utilitárias ---

export const formatApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorData>;
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }
    // Tenta pegar uma mensagem de erro genérica do Spring
    if (axiosError.response?.data?.error) {
      return axiosError.response.data.error;
    }
  }
  // Se for um erro padrão do JavaScript
  if (error instanceof Error) {
    return error.message;
  }
  // Caso extremo
  return 'Ocorreu um erro inesperado. Tente novamente.';
};

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  return !!token;
};


export const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};


export const setAuthToken = (token: string): void => {
  localStorage.setItem('token', token);
};

/**
 * Remove o token e os dados do usuário do localStorage (efetua o logout).
 */
export const removeAuthToken = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * Constrói uma string de query a partir de um objeto de parâmetros, removendo nulos.
 * @param params O objeto de parâmetros.
 * @returns Uma string de query (ex: "nome=Maçã&status=ativo").
 */
export const buildQueryString = (params: Record<string, unknown>): string => {
  const searchParams = new URLSearchParams();
  Object.keys(params).forEach(key => {
    const value = params[key];
    if (value !== null && value !== undefined && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  return searchParams.toString();
};

/**
 * Função de Debounce: atrasa a execução de uma função.
 * Útil para campos de busca, para não fazer uma chamada de API a cada letra digitada.
 */
export const debounce = <T extends (...args: unknown[]) => void>(func: T, wait: number) => {
  let timeout: number; 

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = window.setTimeout(later, wait);
  };
};


export const validarCNPJ = (cnpj: string): boolean => {
  const cleanCnpj = cnpj.replace(/[^\d]+/g, '');
  
  if (cleanCnpj.length !== 14) return false;
  if (/^(\d)\1+$/.test(cleanCnpj)) return false;
  

  return true;
};


export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date(date));
};


export const formatDateTime = (date: string | Date): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};