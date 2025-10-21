import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, MapPin, ListOrdered, LogOut, FileText, Phone } from 'lucide-react'; // Importar FileText e Phone
import { Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/shared/LoadingSpinner';

const PaginaMinhaConta: React.FC = () => {
  const { usuario, logout, carregando } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (carregando) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-5rem)] dark:bg-gray-900">
        <LoadingSpinner text="A carregar perfil..." />
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="text-center py-20 dark:bg-gray-900 dark:text-gray-300">
        <p>Utilizador não encontrado. Por favor, faça login.</p>
        <Link to="/" className="mt-4 inline-block text-green-600 dark:text-green-400 hover:underline">Voltar para a página inicial</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8">Minha Conta</h1>

      {/* Card de Perfil Atualizado */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8 border dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800 dark:text-gray-100">
          <User className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
          Informações Pessoais
        </h2>
        {/* Usar grid para alinhar melhor os labels e valores */}
        <div className="grid grid-cols-[auto,1fr] gap-x-3 gap-y-3 text-sm sm:text-base">
          {/* Nome */}
          <div className="font-medium text-gray-600 dark:text-gray-400 self-center">Nome:</div>
          <div className="text-gray-800 dark:text-gray-200">{usuario.nomeCompleto || usuario.nome}</div>

          {/* Email */}
          <div className="font-medium text-gray-600 dark:text-gray-400 self-center">Email:</div>
          <div className="text-gray-800 dark:text-gray-200">{usuario.email}</div>

          {/* CPF (condicional) */}
          {usuario.cpf && (
            <>
              <div className="font-medium text-gray-600 dark:text-gray-400 self-center flex items-center pt-3 border-t dark:border-gray-700 mt-3 col-span-2 sm:col-span-1 sm:border-none sm:pt-0 sm:mt-0">
                 <FileText className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-500 hidden sm:inline"/>CPF:
              </div>
              <div className="text-gray-800 dark:text-gray-200 pt-3 border-t dark:border-gray-700 mt-3 sm:border-none sm:pt-0 sm:mt-0">{usuario.cpf}</div>
            </>
          )}

          {/* Telefone (condicional) */}
          {usuario.telefone && (
            <>
              <div className="font-medium text-gray-600 dark:text-gray-400 self-center flex items-center">
                 <Phone className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-500 hidden sm:inline"/>Telefone:
              </div>
              <div className="text-gray-800 dark:text-gray-200">{usuario.telefone}</div>
            </>
          )}
        </div>
        {/* Botão Editar (Futuro) */}
        {/* <div className="mt-5 text-right">
             <button className="text-sm font-medium text-green-600 dark:text-green-400 hover:underline">Editar Perfil</button>
           </div> */}
      </div>

      {/* Links de Navegação */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/minha-conta/pedidos" className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 flex items-center hover:shadow-md dark:hover:bg-gray-700/60 border dark:border-gray-700 transition-all duration-200 group">
          <ListOrdered className="w-8 h-8 text-green-600 dark:text-green-400 mr-4 transition-transform group-hover:scale-110" />
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">Histórico de Pedidos</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Ver o seu histórico de compras.</p>
          </div>
        </Link>

        <Link to="/minha-conta/enderecos" className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 flex items-center hover:shadow-md dark:hover:bg-gray-700/60 border dark:border-gray-700 transition-all duration-200 group">
          <MapPin className="w-8 h-8 text-green-600 dark:text-green-400 mr-4 transition-transform group-hover:scale-110" />
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">Meus Endereços</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Gerir os seus endereços de entrega.</p>
          </div>
        </Link>
      </div>

      {/* Botão Logout */}
      <div className="mt-12 text-center">
        <button
          onClick={handleLogout}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Terminar Sessão
        </button>
      </div>
    </div>
  );
};

export default PaginaMinhaConta;