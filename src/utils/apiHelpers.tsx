import axios, { AxiosError } from 'axios';

// --- Interfaces e Tipos ---

// Interface para a estrutura de dados de um erro da nossa API
interface ApiErrorData {
  message?: string;
  error?: string;
}

// --- Funções Utilitárias ---

/**
 * Extrai uma mensagem de erro legível de um objeto de erro da API.
 * @param error O objeto de erro, que pode ser de vários tipos.
 * @returns Uma string com a mensagem de erro formatada.
 */
export const formatApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorData>;
    // Tenta pegar a mensagem de erro específica do nosso RestExceptionHandler
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

/**
 * Verifica se existe um token de autenticação no localStorage.
 * @returns `true` se o token existir, `false` caso contrário.
 */
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  return !!token;
};

/**
 * Obtém o token de autenticação do localStorage.
 * @returns O token como string, ou `null` se não existir.
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

/**
 * Salva o token de autenticação no localStorage.
 * @param token O token JWT a ser salvo.
 */
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
  let timeout: number; // No ambiente do navegador, o tipo retornado por setTimeout é 'number'

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = window.setTimeout(later, wait);
  };
};

/**
 * Valida um número de CNPJ (lógica de exemplo).
 * @param cnpj A string do CNPJ.
 * @returns `true` se o CNPJ for válido.
 */
export const validarCNPJ = (cnpj: string): boolean => {
  const cleanCnpj = cnpj.replace(/[^\d]+/g, '');
  
  if (cleanCnpj.length !== 14) return false;
  if (/^(\d)\1+$/.test(cleanCnpj)) return false;
  
  // A lógica de validação completa do CNPJ (algoritmo) entraria aqui.
  // Por enquanto, apenas verificamos o formato básico.
  return true;
};

/**
 * Formata um valor numérico para a moeda brasileira (R$).
 * @param value O número a ser formatado.
 * @returns A string formatada (ex: "R$ 1.234,56").
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

/**
 * Formata uma data (string ou Date) para o padrão brasileiro (dd/MM/yyyy).
 * @param date A data.
 * @returns A data formatada.
 */
export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date(date));
};

/**
 * Formata uma data e hora para o padrão brasileiro.
 * @param date A data (string ou objeto Date).
 * @returns A data e hora formatadas (ex: "10/10/2025 14:30").
 */
export const formatDateTime = (date: string | Date): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};