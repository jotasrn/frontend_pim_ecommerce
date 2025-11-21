import axios from 'axios';

// Lê a URL base da nossa API a partir das variáveis de ambiente (.env)
// Se não encontrar, usa 'http://localhost:8083' como padrão
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8083';


const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

/**
 * Interceptor de Requisição (Request Interceptor)
 * * Esta função é executada ANTES de CADA requisição sair da aplicação.
 * A sua principal função é verificar se temos um token JWT no localStorage
 * e, se tivermos, injetá-lo automaticamente no cabeçalho 'Authorization'.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor de Resposta
 * * Esta função é executada DEPOIS que recebemos uma resposta da API.
 * É o local perfeito para tratar erros globais, como um token expirado.
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;