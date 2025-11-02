import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

// Interface para o evento (para TypeScript)
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// Detecção simples de iOS
const isIOS = () => {
  return [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ].includes(navigator.platform)
  // Além de 'MacIntel' para iPads mais novos no iOS 13+
  || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
}

// Verifica se está rodando como PWA (app instalado)
const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches;

const PwaInstallPrompt: React.FC = () => {
  // Estado para salvar o evento do prompt (para Android/Chrome)
  const [installPromptEvent, setInstallPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  
  // Estado para mostrar o pop-up de instruções (para iOS)
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  
  // Estado para fechar o pop-up
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 1. Ouve o evento 'beforeinstallprompt'
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault(); // Impede o mini-infobar automático do Chrome
      setInstallPromptEvent(e as BeforeInstallPromptEvent);
      // Mostra nosso pop-up (se não for iOS e não estiver instalado)
      if (!isIOS() && !isStandalone()) {
        setIsVisible(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 2. Se for iOS e não estiver instalado, mostra o pop-up de instruções
    if (isIOS() && !isStandalone()) {
      // Pequeno delay para não sobrecarregar o usuário imediatamente
      const timer = setTimeout(() => {
        setShowIOSInstructions(true);
        setIsVisible(true);
      }, 3000); // 3 segundos após carregar a página
      
      return () => clearTimeout(timer);
    }

    // 3. Limpa o listener
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPromptEvent) return;

    // Mostra o prompt de instalação nativo do navegador
    await installPromptEvent.prompt();
    
    // Aguarda a escolha do usuário
    const { outcome } = await installPromptEvent.userChoice;
    if (outcome === 'accepted') {
      console.log('Usuário aceitou a instalação do PWA');
    } else {
      console.log('Usuário recusou a instalação do PWA');
    }
    
    setInstallPromptEvent(null);
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
    setShowIOSInstructions(false);
    setInstallPromptEvent(null); // Descarta o prompt se o usuário fechar
  };

  // Se o pop-up não deve ser visível, não renderiza nada
  if (!isVisible) {
    return null;
  }

  // Renderiza o pop-up/toast
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pwa-install-title"
      className="fixed z-[100] right-4 bottom-4 w-full max-w-sm p-4 rounded-lg shadow-lg bg-white dark:bg-gray-800 border dark:border-gray-700 animate-fadeIn"
    >
      <div className="flex items-start">
        <div className="flex-1">
          <h3 id="pwa-install-title" className="font-semibold text-gray-800 dark:text-gray-100">Instale nosso App!</h3>
          
          {/* Mensagem específica para Android/Chrome */}
          {installPromptEvent && (
            <>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Adicione o Hortifruti à sua tela inicial para uma experiência mais rápida e offline.
              </p>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={handleInstallClick}
                  className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors shadow-sm"
                >
                  <Download className="w-4 h-4 inline mr-1.5" />
                  Instalar
                </button>
                <button
                  onClick={handleClose}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Agora não
                </button>
              </div>
            </>
          )}

          {/* Mensagem específica para iOS */}
          {showIOSInstructions && (
            <>
               <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Para instalar o app no seu iPhone/iPad, toque no ícone de 
                <strong className="font-medium text-gray-900 dark:text-gray-100"> Compartilhar </strong> 
                (quadrado com seta para cima) na barra do navegador e selecione
                <strong className="font-medium text-gray-900 dark:text-gray-100"> "Adicionar à Tela de Início"</strong>.
              </p>
               <div className="mt-4">
                 <button
                    onClick={handleClose}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Entendi
                  </button>
               </div>
            </>
          )}

        </div>
        <button
            onClick={handleClose}
            className="ml-3 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Fechar"
        >
            <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default PwaInstallPrompt;