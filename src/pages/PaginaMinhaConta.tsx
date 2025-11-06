import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, MapPin, ListOrdered, LogOut, AlertCircle, Edit, Save, X, KeyRound, Trash2, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import ModalAlterarSenha from '../components/modals/ModalAlterarSenha';
import ModalConfirmarExclusao from '../components/modals/ModalConfirmarExclusao';
import { usuarioService, PerfilUpdateDTO } from '../services/usuarioService'; 
import { showToast } from '../utils/toastHelper';
import { formatApiError } from '../utils/apiHelpers';

type PerfilFormData = {
  nomeCompleto: string;
  telefone: string;
  cpf: string;
};

const PaginaMinhaConta: React.FC = () => {
  const { usuario, logout, carregando } = useAuth(); 
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [isSenhaModalAberto, setIsSenhaModalAberto] = useState(false);
  const [isExcluirModalAberto, setIsExcluirModalAberto] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<PerfilFormData>();

  const perfilIncompleto = !usuario?.cpf || !usuario?.telefone;
  const isGoogleUser = !!usuario?.googleId;
  const cpfJaPreenchido = !!usuario?.cpf; // Verifica se o CPF já existe

  useEffect(() => {
    if (usuario) {
      reset({
        nomeCompleto: usuario.nomeCompleto || usuario.nome,
        cpf: usuario.cpf || '',
        telefone: usuario.telefone || '',
      });
    }
  }, [usuario, isEditing, reset]); // Recarrega o form se o modo de edição mudar

  const onSavePerfil: SubmitHandler<PerfilFormData> = async (data) => {
    try {
      // O DTO enviado para o backend
      const dadosParaEnviar: PerfilUpdateDTO = {
        nomeCompleto: data.nomeCompleto,
        telefone: data.telefone,
        // Envia o CPF apenas se ele ainda não estiver preenchido
        cpf: cpfJaPreenchido ? usuario.cpf! : data.cpf
      };

      await usuarioService.atualizarMeuPerfil(dadosParaEnviar);
      showToast.success("Perfil atualizado com sucesso!");
      setIsEditing(false);
      window.location.reload();

    } catch (err) {
      showToast.error(formatApiError(err));
    }
  };

  const handleDeleteConta = async () => {
    setIsDeleting(true);
    try {
      await usuarioService.deletarMinhaConta();
      showToast.success("Conta excluída com sucesso.");
      setIsExcluirModalAberto(false);
      logout();
      navigate('/');
    } catch (err) {
      showToast.error(formatApiError(err));
      setIsDeleting(false);
    }
  };

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

  const AlertaPerfilIncompleto: React.FC = () => (
    <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-lg flex items-center gap-3">
      <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
      <div>
        <p className="font-semibold text-yellow-800 dark:text-yellow-200">Perfil Incompleto</p>
        <p className="text-sm text-yellow-700 dark:text-yellow-300">
          Para uma melhor experiência e futuras compras, por favor, preencha seu CPF e Telefone.
        </p>
      </div>
      {!isEditing && (
        <button
          onClick={() => setIsEditing(true)}
          className="ml-auto flex-shrink-0 text-sm font-medium text-yellow-800 dark:text-yellow-200 hover:underline"
        >
          Completar agora
        </button>
      )}
    </div>
  );

  return (
    <>
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Minha Conta</h1>

        {perfilIncompleto && !isEditing && <AlertaPerfilIncompleto />}

        <form onSubmit={handleSubmit(onSavePerfil)}>
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg border dark:border-gray-700 overflow-hidden">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b dark:border-gray-700">
              <h2 className="text-xl font-semibold flex items-center text-gray-800 dark:text-gray-100">
                <User className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                Informações Pessoais
              </h2>
              {isEditing ? (
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-1.5" />}
                    {isSubmitting ? "" : "Salvar"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsEditing(false); reset(); }} // Reseta ao cancelar
                    className="inline-flex items-center px-3 py-1.5 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 text-xs font-medium rounded-md hover:bg-gray-200 dark:hover:bg-gray-500"
                  >
                    <X className="w-4 h-4 mr-1.5" /> Cancelar
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-md hover:bg-blue-200 dark:hover:bg-blue-900/50"
                >
                  <Edit className="w-4 h-4 mr-1.5" /> Editar Perfil
                </button>
              )}
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <label htmlFor="nomeCompleto" className="text-sm font-medium text-gray-600 dark:text-gray-400">Nome Completo</label>
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    id="nomeCompleto"
                    {...register("nomeCompleto", { required: "Nome é obrigatório" })}
                    readOnly={!isEditing}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm dark:bg-gray-700 dark:text-gray-100 ${isEditing ? 'border-gray-300 dark:border-gray-600 focus:ring-green-500 focus:border-green-500' : 'bg-gray-100 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700 read-only:opacity-80'}`}
                  />
                  {errors.nomeCompleto && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.nomeCompleto.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Email</label>
                <div className="sm:col-span-2">
                  <input
                    type="email"
                    value={usuario.email}
                    readOnly
                    disabled
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm sm:text-sm bg-gray-100 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 opacity-80"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <label htmlFor="cpf" className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center">
                  CPF
                  {!usuario.cpf &&
                    <span title="Campo obrigatório">
                      <AlertCircle className="w-4 h-4 ml-1.5 text-yellow-500" />
                    </span>
                  }
                </label>
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    id="cpf"
                    {...register("cpf", { required: "CPF é obrigatório" })}
                    readOnly={!isEditing || cpfJaPreenchido} // Bloqueia se não estiver editando OU se já estiver preenchido
                    className={`w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm dark:bg-gray-700 dark:text-gray-100 ${isEditing && !cpfJaPreenchido ? 'border-gray-300 dark:border-gray-600 focus:ring-green-500 focus:border-green-500' : 'bg-gray-100 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700 read-only:opacity-80'}`}
                    placeholder={isEditing && !cpfJaPreenchido ? "000.000.000-00" : (usuario.cpf || "Não informado")}
                  />
                  {errors.cpf && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.cpf.message}</p>}
                  {cpfJaPreenchido && !isEditing && <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">O CPF não pode ser alterado.</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <label htmlFor="telefone" className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center">
                  Telefone
                  {!usuario.telefone &&
                    <span title="Campo obrigatório">
                      <AlertCircle className="w-4 h-4 ml-1.5 text-yellow-500" />
                    </span>
                  }
                </label>
                <div className="sm:col-span-2">
                  <input
                    type="tel"
                    id="telefone"
                    {...register("telefone", { required: "Telefone é obrigatório" })}
                    readOnly={!isEditing}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm dark:bg-gray-700 dark:text-gray-100 ${isEditing ? 'border-gray-300 dark:border-gray-600 focus:ring-green-500 focus:border-green-500' : 'bg-gray-100 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700 read-only:opacity-80'}`}
                    placeholder={isEditing ? "(61) 99999-9999" : "Não informado"}
                  />
                  {errors.telefone && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.telefone.message}</p>}
                </div>
              </div>
            </div>
          </div>
        </form>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
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

        <div className="mt-8 bg-white dark:bg-gray-800 shadow rounded-lg p-6 border dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800 dark:text-gray-100">
            Segurança da Conta
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-700 dark:text-gray-200">Alterar Senha</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Recomendamos atualizar sua senha periodicamente.</p>
                {isGoogleUser && (
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                    Você está logado com o Google. A senha é gerenciada pelo Google.
                  </p>
                )}
              </div>
              <button
                onClick={() => setIsSenhaModalAberto(true)}
                disabled={isGoogleUser}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <KeyRound className="w-4 h-4 mr-2" />
                Alterar
              </button>
            </div>

            <div className="flex items-center justify-between pt-4 border-t dark:border-gray-700">
              <div>
                <h3 className="font-medium text-red-700 dark:text-red-400">Excluir Conta</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Esta ação é permanente e não pode ser desfeita.</p>
              </div>
              <button
                onClick={() => setIsExcluirModalAberto(true)}
                className="inline-flex items-center px-3 py-1.5 border border-red-300 dark:border-red-700 text-sm font-medium rounded-md text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir
              </button>
            </div>
          </div>
        </div>

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

      <ModalAlterarSenha
        isOpen={isSenhaModalAberto}
        onClose={() => setIsSenhaModalAberto(false)}
      />
      <ModalConfirmarExclusao
        isOpen={isExcluirModalAberto}
        onClose={() => setIsExcluirModalAberto(false)}
        onConfirm={handleDeleteConta}
        isLoading={isDeleting}
      />
    </>
  );
};

export default PaginaMinhaConta;