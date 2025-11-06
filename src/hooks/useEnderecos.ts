// src/hooks/useEnderecos.ts
import { useState, useEffect, useCallback } from 'react';
import { enderecoService } from '../services/enderecoService';
import { showToast } from '../utils/toastHelper';
import { Endereco } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface UseEnderecosReturn {
  enderecos: Endereco[];
  loading: boolean;
  error: string | null;
  recarregarEnderecos: () => void; // Função para recarregar a lista após adicionar/remover
}

export const useEnderecos = (): UseEnderecosReturn => {
  const [enderecos, setEnderecos] = useState<Endereco[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { usuario } = useAuth(); // Pega o usuário logado

  const carregarEnderecos = useCallback(async () => {
    if (!usuario) return; // Não faz nada se o usuário não estiver logado

    setLoading(true);
    setError(null);
    try {
      const dados = await enderecoService.listar(usuario.id);
      setEnderecos(dados);
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      showToast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [usuario]); // Depende do 'usuario' para saber qual ID buscar

  useEffect(() => {
    carregarEnderecos();
  }, [carregarEnderecos]);

  return {
    enderecos,
    loading,
    error,
    recarregarEnderecos: carregarEnderecos, // Expõe a função de recarregar
  };
};