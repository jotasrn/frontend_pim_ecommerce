import React, { useState } from 'react';

const PaginaPoliticas: React.FC = () => {
  const [activeSection, setActiveSection] = useState('privacidade');

  const sections = [
    { id: 'privacidade', title: 'Política de Privacidade' },
    { id: 'dados', title: 'Coleta e Uso de Dados' },
    { id: 'cookies', title: 'Política de Cookies' },
    { id: 'seguranca', title: 'Segurança da Informação' },
    { id: 'lgpd', title: 'Direitos do Usuário (LGPD)' },
    { id: 'termos', title: 'Termos de Serviço' },
    { id: 'responsabilidades', title: 'Responsabilidades do Usuário' },
    { id: 'comunicacoes', title: 'Comunicações e Notificações' },
    { id: 'juridico', title: 'Cláusulas Legais e Jurisdição' },
    { id: 'faq', title: 'FAQ Legal' },
    { id: 'contato', title: 'Contato e Suporte' },
  ];

  return (
    <div className="flex flex-col lg:flex-row max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 gap-8">
      <aside className="lg:w-1/4 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-sm border dark:border-gray-700 h-fit sticky top-24 p-4">
        <h2 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-3">Navegação Rápida</h2>
        <ul className="space-y-2 text-sm">
          {sections.map((section) => (
            <li key={section.id}>
              <button
                onClick={() => {
                  setActiveSection(section.id);
                  document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`w-full text-left py-2 px-3 rounded-md transition ${
                  activeSection === section.id
                    ? 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 font-semibold'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300'
                }`}
              >
                {section.title}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <div className="lg:w-3/4 bg-white dark:bg-gray-800 shadow rounded-lg border dark:border-gray-700 p-6 md:p-8 lg:p-10 space-y-10">
        <header>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 text-center mb-2">
            Termos e Políticas da Hortifruti Slim
          </h1>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Última atualização: 19 de Outubro de 2025
          </p>
        </header>

        <section id="privacidade" className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 border-b pb-2">
            Política de Privacidade
          </h2>
          <p>
            A Hortifruti Slim valoriza a sua privacidade. Esta política descreve como coletamos, usamos, armazenamos
            e protegemos seus dados pessoais de acordo com a LGPD (Lei nº 13.709/2018).
          </p>
          <p>
            Todas as informações são coletadas com consentimento e utilizadas apenas para fins legítimos de operação,
            comunicação e melhoria dos serviços.
          </p>
        </section>

        <section id="dados" className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 border-b pb-2">
            Coleta e Uso de Dados
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Dados pessoais: nome, CPF, e-mail, endereço, telefone, e dados de compra.</li>
            <li>Dados técnicos: IP, navegador, cookies e informações de dispositivo.</li>
            <li>Usamos os dados para processar pedidos, autenticar usuários e oferecer promoções personalizadas.</li>
          </ul>
        </section>

        <section id="cookies" className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 border-b pb-2">
            Política de Cookies
          </h2>
          <p>
            Utilizamos cookies para melhorar sua experiência, personalizar conteúdo, medir desempenho e oferecer
            publicidade relevante.
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Essenciais:</strong> necessários para o funcionamento básico do site.</li>
            <li><strong>Analíticos:</strong> usados para entender como os visitantes interagem com o site.</li>
            <li><strong>Marketing:</strong> ajudam a oferecer anúncios relevantes.</li>
          </ul>
          <p>Você pode desativar cookies nas configurações do seu navegador a qualquer momento.</p>
        </section>

        <section id="seguranca" className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 border-b pb-2">Segurança da Informação</h2>
          <p>
            Adotamos medidas técnicas e organizacionais avançadas, como criptografia SSL, autenticação de dois fatores
            e monitoramento contínuo de acessos, para proteger seus dados.
          </p>
          <p>
            Apesar dos nossos esforços, nenhum sistema é 100% seguro. Recomendamos que o usuário mantenha senhas
            fortes e evite compartilhá-las.
          </p>
        </section>

        <section id="lgpd" className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 border-b pb-2">
            Direitos do Usuário (LGPD)
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Acesso aos dados pessoais armazenados.</li>
            <li>Correção de informações imprecisas.</li>
            <li>Anonimização, bloqueio ou exclusão de dados desnecessários.</li>
            <li>Revogação de consentimento a qualquer momento.</li>
            <li>Portabilidade dos dados para outro provedor.</li>
          </ul>
          <p>
            Para exercer seus direitos, envie uma solicitação para{' '}
            <a href="mailto:privacidade@hortifruti.com" className="text-green-600 dark:text-green-400 hover:underline">
              privacidade@hortifruti.com
            </a>.
          </p>
        </section>

        <section id="termos" className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 border-b pb-2">Termos de Serviço</h2>
          <p>
            Ao usar nosso site, você concorda com os termos aqui descritos. Reservamo-nos o direito de modificar as
            condições sem aviso prévio.
          </p>
          <p>
            O uso do serviço implica responsabilidade sobre as informações fornecidas e respeito às regras de conduta
            da plataforma.
          </p>
        </section>

        <section id="responsabilidades" className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 border-b pb-2">Responsabilidades</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>O usuário é responsável por manter seus dados de acesso seguros.</li>
            <li>A Hortifruti Slim não se responsabiliza por mau uso de informações compartilhadas externamente.</li>
            <li>Fraudes ou uso indevido resultarão em bloqueio imediato da conta.</li>
          </ul>
        </section>

        <section id="comunicacoes" className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 border-b pb-2">Comunicações e Notificações</h2>
          <p>
            Podemos entrar em contato por e-mail, SMS ou notificações push sobre promoções, pedidos e atualizações.
            Você pode gerenciar suas preferências de comunicação na sua conta.
          </p>
        </section>

        <section id="juridico" className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 border-b pb-2">Cláusulas Legais e Jurisdição</h2>
          <p>
            Este contrato é regido pelas leis brasileiras. Em caso de controvérsias, o foro da comarca de Brasília/DF
            será o competente.
          </p>
        </section>

        <section id="faq" className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 border-b pb-2">FAQ Legal</h2>
          <details className="border rounded-md p-3">
            <summary className="font-medium cursor-pointer text-green-600 dark:text-green-400">Posso solicitar exclusão da minha conta?</summary>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Sim, envie uma solicitação para o e-mail de privacidade e seus dados serão removidos conforme a LGPD.</p>
          </details>
          <details className="border rounded-md p-3">
            <summary className="font-medium cursor-pointer text-green-600 dark:text-green-400">Como são tratadas minhas informações de pagamento?</summary>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Os pagamentos são processados por provedores certificados (ex: Stripe, PayPal). Não armazenamos dados de cartão.</p>
          </details>
          <details className="border rounded-md p-3">
            <summary className="font-medium cursor-pointer text-green-600 dark:text-green-400">Meus dados são compartilhados?</summary>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Somente com parceiros operacionais essenciais (ex: transportadoras, gateways de pagamento).</p>
          </details>
        </section>

        <section id="contato" className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 border-b pb-2">Contato e Suporte</h2>
          <p>
            Caso tenha dúvidas sobre esta política, entre em contato conosco através do e-mail:{' '}
            <a href="mailto:contato@hortifruti.com" className="text-green-600 dark:text-green-400 hover:underline">
              contato@hortifruti.com
            </a>.
          </p>
        </section>

        <footer className="mt-12 pt-6 border-t dark:border-gray-700 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-500 italic">
            Este documento é informativo e não substitui aconselhamento jurídico. Recomendamos a revisão por
            especialistas em direito digital e LGPD.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default PaginaPoliticas;
