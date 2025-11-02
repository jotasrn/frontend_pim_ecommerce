import { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { X, RefreshCw } from 'lucide-react';
import { showToast } from '../../utils/toastHelper';

function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(_r: ServiceWorkerRegistration | undefined) {
      if (_r) {
        console.log(`Service Worker registrado com sucesso.`);
      }
    },
    onRegisterError(error: unknown) {
      console.error('Erro no registro do Service Worker:', error);
    },
  });

  const close = (reloadPage: boolean = false) => {
    setOfflineReady(false);
    setNeedRefresh(false);
    if (reloadPage) {
      updateServiceWorker(true);
    }
  };

  useEffect(() => {
    if (offlineReady) {
       showToast.success('App pronto para funcionar offline!');
    }
  }, [offlineReady]);

  if (!needRefresh) {
    return null;
  }

  return (
    <div
      role="alert"
      className="fixed z-[100] right-4 bottom-4 w-full max-w-sm p-4 rounded-lg shadow-lg bg-white dark:bg-gray-800 border dark:border-gray-700 animate-fadeIn"
    >
      <div className="flex items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100">Nova Versão Disponível</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Uma nova versão do aplicativo foi baixada. Atualize para ver as novidades.
          </p>
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => close(true)}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors shadow-sm"
            >
              <RefreshCw className="w-4 h-4 inline mr-1.5" />
              Atualizar
            </button>
            <button
              onClick={() => close(false)}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Agora não
            </button>
          </div>
        </div>
        <button
            onClick={() => close(false)}
            className="ml-3 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Fechar"
        >
            <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default ReloadPrompt;