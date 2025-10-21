import React, { useState } from 'react';
import { useEnderecos } from '../hooks/useEnderecos';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { Endereco } from '../types';
import { MapPin, Plus, Edit, Trash2, AlertCircle } from 'lucide-react';
import FormularioEndereco from '../components/modals/FormularioEndereco';
import { enderecoService } from '../services/enderecoService';
import { showToast } from '../utils/toastHelper';
import { formatApiError } from '../utils/apiHelpers';

const PaginaEnderecos: React.FC = () => {
  const { usuario } = useAuth();
  const { enderecos, loading, error, recarregarEnderecos } = useEnderecos();
  const [modalAberto, setModalAberto] = useState(false);
  const [enderecoEmEdicao, setEnderecoEmEdicao] = useState<Endereco | null>(null);

  const abrirModalParaCriar = () => {
    setEnderecoEmEdicao(null);
    setModalAberto(true);
  };

  const abrirModalParaEditar = (endereco: Endereco) => {
    setEnderecoEmEdicao(endereco);
    setModalAberto(true);
  };

  const handleRemover = async (enderecoId: number) => {
    if (window.confirm("Tem a certeza de que quer remover este endereço?")) {
      try {
        await enderecoService.remover(enderecoId);
        recarregarEnderecos();
        showToast.success("Endereço removido com sucesso.");
      } catch (err) {
        showToast.error(formatApiError(err));
      }
    }
  };

  const salvarEnderecoNoModal = async (data: Omit<Endereco, 'id' | 'latitude' | 'longitude'>) => {
    if (!usuario) return Promise.reject("Usuário não autenticado");

    try {
      if (enderecoEmEdicao) {
        await enderecoService.atualizar(enderecoEmEdicao.id, data);
      } else {
        await enderecoService.adicionar(usuario.id, data);
      }
      return Promise.resolve();
    } catch (error) {
      console.error("Erro ao salvar endereço:", error);
      return Promise.reject(error);
    }
  };


  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 dark:bg-gray-900 transition-colors duration-300">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Meus Endereços</h1>
        <button
          onClick={abrirModalParaCriar}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 shadow-sm transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Adicionar Endereço
        </button>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-[30vh]">
          <LoadingSpinner text="A carregar endereços..." />
        </div>
      )}

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 dark:border-red-600 text-red-700 dark:text-red-300 p-4" role="alert">
          <div className="flex">
            <div className="py-1"><AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 mr-3" /></div>
            <div>
              <p className="font-bold">Erro ao carregar</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {!loading && !error && enderecos.length === 0 && (
        <div className="text-center py-10 bg-white dark:bg-gray-800 shadow rounded-lg border dark:border-gray-700">
          <MapPin className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">Nenhum endereço cadastrado</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Adicione um novo endereço para as suas entregas.</p>
        </div>
      )}
      {!loading && !error && enderecos.length > 0 && (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden border dark:border-gray-700">
          <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
            {enderecos.map((endereco) => (
              <li key={endereco.id} className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="mt-1 text-md font-medium text-gray-900 dark:text-gray-100">
                      {endereco.rua}, {endereco.numero}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {endereco.bairro}, {endereco.cidade} - {endereco.estado}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">CEP: {endereco.cep}</p>
                    {endereco.complemento && (
                      <p className="text-xs text-gray-400 dark:text-gray-500">Comp: {endereco.complemento}</p>
                    )}
                  </div>
                  <div className="ml-4 flex-shrink-0 flex space-x-3">
                    <button
                      onClick={() => abrirModalParaEditar(endereco)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                      title="Editar"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleRemover(endereco.id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                      title="Remover"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <FormularioEndereco
        isOpen={modalAberto}
        onClose={() => {
          setModalAberto(false);
          recarregarEnderecos();
        }}
        onSave={salvarEnderecoNoModal}
        initialData={enderecoEmEdicao}
      />
    </div>
  );
};

export default PaginaEnderecos;