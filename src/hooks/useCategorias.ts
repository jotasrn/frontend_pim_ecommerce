// src/hooks/useCategorias.ts
import { useState, useEffect, useCallback } from 'react';
import { categoriaService } from '../services/categoriaService';
import { Categoria } from '../types';

interface UseCategoriasReturn {
  categorias: Categoria[];
  loading: boolean;
  error: string | null;
}

export const useCategorias = (): UseCategoriasReturn => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const carregarCategorias = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const dados = await categoriaService.listar();
      setCategorias(dados);
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      console.error("Falha ao carregar categorias:", errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarCategorias();
  }, [carregarCategorias]);

  return {
    categorias,
    loading,
    error,
  };
};