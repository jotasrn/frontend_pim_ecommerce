// src/pages/PaginaFaq.tsx
import React, { useState, useEffect } from 'react';
import { faqService } from '../services/faqService';
import { duvidaService } from '../services/duvidaService';
import { Faq, Duvida } from '../types';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { AlertCircle, HelpCircle } from 'lucide-react';
import { formatApiError } from '../utils/apiHelpers';

// Componente interno para o Accordion
const FaqItem: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <details className="border-b dark:border-gray-700 last:border-b-0 group">
    <summary className="py-5 px-4 font-medium text-gray-800 dark:text-gray-200 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 list-none flex justify-between items-center transition-colors">
      {title}
      {/* Ícone de Chevron que gira */}
      <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </summary>
    <div className="pb-5 px-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed bg-gray-50 dark:bg-gray-800/20">
      {children}
    </div>
  </details>
);

const PaginaFaq: React.FC = () => {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [duvidas, setDuvidas] = useState<Duvida[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      setError(null);
      try {
        const [faqsData, duvidasData] = await Promise.all([
          faqService.listarAtivos(),
          duvidaService.listarPublicasRespondidas()
        ]);
        setFaqs(faqsData);
        setDuvidas(duvidasData);
      } catch (err) {
        setError(formatApiError(err));
      } finally {
        setLoading(false);
      }
    };
    carregarDados();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8 text-center">
        Perguntas Frequentes (FAQ)
      </h1>

      {loading && <div className="h-40"><LoadingSpinner text="Carregando perguntas..." /></div>}

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 dark:border-red-600 text-red-700 dark:text-red-300 p-4 rounded text-center">
          <AlertCircle className="mx-auto h-8 w-8 mb-2" />
          <p className="font-bold">Erro ao carregar</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg border dark:border-gray-700 overflow-hidden">
          
          {faqs.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2 p-4">
                Respostas Rápidas
              </h2>
              <div className="border-t dark:border-gray-700">
                {faqs.map(faq => (
                  <FaqItem key={`faq-${faq.id}`} title={faq.pergunta}>
                    <p>{faq.resposta}</p>
                  </FaqItem>
                ))}
              </div>
            </div>
          )}

          {duvidas.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2 p-4">
                Dúvidas da Comunidade
              </h2>
              <div className="border-t dark:border-gray-700">
                {duvidas.map(duvida => (
                  <FaqItem key={`duvida-${duvida.id}`} title={duvida.duvida}>
                    <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 py-2 italic text-gray-500 dark:text-gray-400">
                      "{duvida.duvida}" - {duvida.nome}
                    </blockquote>
                    <p className="mt-3 text-green-700 dark:text-green-300 font-medium">
                      <strong>Resposta:</strong> {duvida.resposta?.resposta || 'Aguardando resposta...'}
                    </p>
                  </FaqItem>
                ))}
              </div>
            </div>
          )}
          
          {faqs.length === 0 && duvidas.length === 0 && (
             <div className="text-center py-16">
               <HelpCircle className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
               <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">Nenhuma pergunta encontrada</h3>
               <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Se tiver uma dúvida, entre em contato conosco.</p>
             </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PaginaFaq;