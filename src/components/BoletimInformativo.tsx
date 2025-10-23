import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react'; // 1. Importar Loader2
import { showToast } from '../utils/toastHelper';
import { useAuth } from '../contexts/AuthContext';
import { newsletterService } from '../services/newsletterService'; // 2. Importar o serviço
import { formatApiError } from '../utils/apiHelpers'; // 3. Importar o formatador de erro

const BoletimInformativo: React.FC = () => {
  const { usuario } = useAuth();
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [processando, setProcessando] = useState(false); // 4. Adicionar estado de loading

  const handleSubmit = async (e: React.FormEvent) => { // 5. Transformar em async
    e.preventDefault();
    if (!email || processando) return; // Evita cliques duplos

    setProcessando(true); // 6. Ativar loading

    try {
      // 7. Chamar a API real
      const resposta = await newsletterService.inscrever(email);
      
      // 8. Sucesso
      setEnviado(true);
      setEmail('');
      // Usa a mensagem real do backend, se disponível, ou uma padrão
      showToast.success(resposta.message || "Inscrição enviada! Verifique seu e-mail.");

      // O backend agora envia um e-mail de confirmação, então a mensagem de "enviado" pode refletir isso
      setTimeout(() => {
        setEnviado(false); // Reseta o formulário após 3 segundos
      }, 3000);

    } catch (err) {
      // 9. Tratar erro
      console.error("Erro ao inscrever newsletter:", err);
      showToast.error(formatApiError(err)); // Mostra o erro vindo da API
    } finally {
      // 10. Desativar loading
      setProcessando(false);
    }
  };

  // Não renderiza nada se o usuário estiver logado
  if (usuario) {
    return null;
  }

  return (
    <section className="bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 text-white py-16 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h3 className="text-2xl font-semibold">Receba Ofertas Exclusivas</h3>
        <p className="mt-2 mb-6 text-white/90">Inscreva-se para receber promoções e novidades diretamente no seu email.</p>

        <div className="max-w-md mx-auto">
          {enviado ? (
            <div className="bg-white/20 dark:bg-white/10 backdrop-blur-sm rounded-lg p-4 animate-fadeIn">
              <p className="text-white font-medium">
                Sucesso! Por favor, verifique seu e-mail para confirmar a inscrição.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="O seu melhor email"
                className="flex-grow px-4 py-3 rounded-lg text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-white/50 dark:focus:ring-white/70 shadow-md placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-70"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={processando} // 11. Desabilitar input
              />
              <button
                type="submit"
                className="bg-white dark:bg-gray-100 text-green-600 dark:text-green-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-200 transition-colors duration-200 shadow-md flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={processando} // 12. Desabilitar botão
              >
                {processando ? (
                  <Loader2 className="w-5 h-5 animate-spin" /> // 13. Mostrar spinner
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Inscrever-me</span>
                  </>
                )}
              </button>
            </form>
          )}

          <p className="mt-4 text-sm text-white/80">
            Ao inscrever-se, você concorda com a nossa <a href="/politicas#privacidade" className="underline hover:text-white">política de privacidade</a>.
          </p>
        </div>
      </div>
    </section>
  );
};

export default BoletimInformativo;