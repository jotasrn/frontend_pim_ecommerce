import React, { ReactNode, ErrorInfo } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

// Define os tipos das propriedades que o componente pode receber
interface Props {
  children: ReactNode;
}

// Define os tipos do estado interno do componente
interface State {
  hasError: boolean;
  error: Error | null;
}

class ApiErrorBoundary extends React.Component<Props, State> {
  // Define o estado inicial com os tipos corretos
  public state: State = {
    hasError: false,
    error: null,
  };

  // Esta função é chamada quando um erro é lançado por um componente filho
  public static getDerivedStateFromError(error: Error): State {
    // Atualiza o estado para que a próxima renderização mostre a UI de erro
    return { hasError: true, error };
  }

  // Esta função é chamada para registrar os detalhes do erro
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ApiErrorBoundary capturou um erro:', error, errorInfo);
    // Você pode enviar esses detalhes para um serviço de log (ex: Sentry)
  }

  public render() {
    // Se houver um erro, renderiza a tela de erro personalizada
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="mt-4 text-center">
              <h3 className="text-lg font-medium text-gray-900">
                Erro na Aplicação
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Ocorreu um erro inesperado. Por favor, tente recarregar a página.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Recarregar Página
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Se não houver erro, renderiza os componentes filhos normalmente
    return this.props.children;
  }
}

export default ApiErrorBoundary;