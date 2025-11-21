import React, { useState, useEffect } from 'react';
import { faqService } from '../services/faqService';
import { duvidaService } from '../services/duvidaService';
import { Faq, Duvida } from '../types';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { AlertCircle, HelpCircle, MessageCircle, Clock, User, ChevronDown, ChevronUp, Send } from 'lucide-react';
import { formatApiError, formatDateTime } from '../utils/apiHelpers';
import { Link } from 'react-router-dom';

const FaqItem: React.FC<{ title: string; children: React.ReactNode; icon?: React.ReactNode }> = ({ title, children, icon }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg mb-3 overflow-hidden transition-all duration-200 hover:shadow-md bg-white dark:bg-gray-800">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 px-5 text-left flex justify-between items-center focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700/30"
      >
        <div className="flex items-center gap-3">
          {icon && <span className="text-green-600 dark:text-green-400">{icon}</span>}
          <span className="font-medium text-gray-800 dark:text-gray-200 text-lg">{title}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {isOpen && (
        <div className="px-5 pb-5 pt-2 text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 animate-fadeIn">
          {children}
        </div>
      )}
    </div>
  );
};

const PaginaFaq: React.FC = () => {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [duvidas, setDuvidas] = useState<Duvida[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'faq' | 'comunidade'>('faq');

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
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8 min-h-screen">

      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Central de Ajuda
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Tire suas dúvidas sobre nossos produtos, entregas e serviços.
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <Link
          to="/#contato"
          className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-full shadow-lg transition-all transform hover:-translate-y-1 hover:shadow-xl"
        >
          <Send className="w-5 h-5 mr-2" />
          Enviar uma nova dúvida
        </Link>
      </div>

      <div className="flex justify-center mb-8 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('faq')}
          className={`pb-4 px-6 text-lg font-medium transition-colors relative ${activeTab === 'faq'
              ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
        >
          Perguntas Frequentes
        </button>
        <button
          onClick={() => setActiveTab('comunidade')}
          className={`pb-4 px-6 text-lg font-medium transition-colors relative ${activeTab === 'comunidade'
              ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
        >
          Dúvidas da Comunidade
        </button>
      </div>

      {loading ? (
        <div className="py-20"><LoadingSpinner text="Carregando informações..." /></div>
      ) : error ? (
        <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-6 rounded-lg text-center shadow-sm">
          <AlertCircle className="mx-auto h-10 w-10 mb-3 opacity-80" />
          <p className="font-bold text-lg">Não foi possível carregar as informações</p>
          <p className="mt-1">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-white dark:bg-red-800 text-red-700 dark:text-white rounded border border-red-200 dark:border-red-700 hover:bg-red-50 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      ) : (
        <div className="space-y-4 min-h-[300px]">

          {activeTab === 'faq' && (
            <div className="animate-fadeIn">
              {faqs.length > 0 ? (
                faqs.map(faq => (
                  <FaqItem
                    key={`faq-${faq.id}`}
                    title={faq.pergunta}
                    icon={<HelpCircle className="w-5 h-5" />}
                  >
                    <div className="prose dark:prose-invert max-w-none">
                      <p>{faq.resposta}</p>
                    </div>
                  </FaqItem>
                ))
              ) : (
                <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                  <HelpCircle className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">Nenhuma pergunta frequente cadastrada ainda.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'comunidade' && (
            <div className="animate-fadeIn">
              {duvidas.length > 0 ? (
                duvidas.map(duvida => (
                  <FaqItem
                    key={`duvida-${duvida.id}`}
                    title={duvida.pergunta}
                    icon={<MessageCircle className="w-5 h-5" />}
                  >
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700 pb-3 mb-3 gap-2">
                        <div className="flex items-center mr-auto">
                          <User className="w-4 h-4 mr-2" />
                          <span>Enviada por: <strong>{duvida.titulo}</strong></span>
                        </div>

                        {/* Exibe a data de criação da pergunta (tenta createdAt ou dataCriacao) */}
                        {(duvida.createdAt || duvida.dataCriacao) && (
                          <div className="flex items-center text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatDateTime(duvida.createdAt || duvida.dataCriacao || '')}
                          </div>
                        )}
                      </div>

                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md border-l-4 border-green-500">
                        <h4 className="text-sm font-semibold text-green-800 dark:text-green-300 mb-2 flex items-center">
                          Resposta da Equipe:
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300">
                          {/* Verifica se existe resposta no objeto aninhado */}
                          {duvida.resposta?.resposta || (
                            <span className="italic text-gray-500">Aguardando resposta oficial...</span>
                          )}
                        </p>

                        {/* Exibe a data da resposta (tenta dataResposta ou createdAt dentro da resposta) */}
                        {(duvida.resposta?.dataResposta || duvida.resposta?.createdAt) && (
                          <div className="mt-2 text-xs text-green-700/70 dark:text-green-400/70 text-right flex justify-end items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            Respondido em: {formatDateTime(duvida.resposta.dataResposta || duvida.resposta.createdAt || '')}
                          </div>
                        )}
                      </div>
                    </div>
                  </FaqItem>
                ))
              ) : (
                <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                  <MessageCircle className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">Ainda não há dúvidas públicas respondidas.</p>
                  <p className="text-sm text-gray-400 mt-2">Seja o primeiro a enviar uma dúvida!</p>
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {!loading && !error && (
        <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Ainda precisa de ajuda? Entre em contato pelo nosso telefone ou chat.</p>
        </div>
      )}
    </div>
  );
};

export default PaginaFaq;