import React from 'react';

const PaginaPoliticas: React.FC = () => {
  return (
    // Container principal similar a outras páginas internas
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Card que envolve o conteúdo */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg border dark:border-gray-700 p-6 md:p-8 lg:p-10">

        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8 text-center">
          Políticas e Termos
        </h1>

        {/* Seção Política de Privacidade */}
        <section id="privacidade" className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4 border-b dark:border-gray-600 pb-2">
            Política de Privacidade
          </h2>
          <div className="space-y-4 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            <p><strong>Última atualização:</strong> 19 de Outubro de 2025</p>
            <p>
              Bem-vindo(a) à Hortifruti Slim. Sua privacidade é importante para nós. Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações quando você visita nosso site e utiliza nossos serviços.
            </p>

            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 pt-2">1. Informações que Coletamos</h3>
            <p>Podemos coletar informações pessoalmente identificáveis, como:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Nome completo, CPF, endereço de e-mail, número de telefone.</li>
              <li>Endereço(s) de entrega e cobrança.</li>
              <li>Histórico de pedidos e preferências de compra.</li>
              <li>Informações de pagamento (processadas de forma segura por nosso gateway, ex: Stripe; não armazenamos dados completos do cartão).</li>
              <li>Dados de login (e-mail, senha criptografada).</li>
              <li>Informações técnicas como endereço IP, tipo de navegador, sistema operacional, coletadas automaticamente.</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 pt-2">2. Como Usamos Suas Informações</h3>
            <p>Utilizamos as informações coletadas para:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Processar e entregar seus pedidos.</li>
              <li>Gerenciar sua conta e fornecer suporte ao cliente.</li>
              <li>Comunicar sobre pedidos, promoções e novidades (com seu consentimento).</li>
              <li>Melhorar nosso site, produtos e serviços.</li>
              <li>Prevenir fraudes e garantir a segurança.</li>
              <li>Cumprir obrigações legais.</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 pt-2">3. Compartilhamento de Informações</h3>
            <p>
              Não vendemos suas informações pessoais. Podemos compartilhar suas informações com terceiros apenas nas seguintes circunstâncias:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Com provedores de serviços essenciais (gateway de pagamento, empresa de entrega).</li>
              <li>Para cumprir exigências legais ou proteger nossos direitos.</li>
              <li>Com seu consentimento explícito.</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 pt-2">4. Segurança dos Dados</h3>
            <p>
              Implementamos medidas de segurança técnicas e administrativas para proteger suas informações contra acesso não autorizado, alteração, divulgação ou destruição. No entanto, nenhum método de transmissão pela Internet ou armazenamento eletrônico é 100% seguro.
            </p>

            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 pt-2">5. Seus Direitos (LGPD)</h3>
            <p>
              Você tem o direito de acessar, corrigir, atualizar ou solicitar a exclusão de suas informações pessoais. Para exercer esses direitos, entre em contato conosco através dos canais informados neste site.
            </p>

             <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 pt-2">6. Cookies</h3>
             <p>
                Utilizamos cookies e tecnologias similares para melhorar a sua experiência de navegação, analisar o tráfego do site e personalizar o conteúdo. Você pode gerenciar suas preferências de cookies através das configurações do seu navegador.
             </p>

            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 pt-2">7. Alterações nesta Política</h3>
            <p>
              Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos sobre quaisquer alterações publicando a nova política nesta página e atualizando a data da "Última atualização".
            </p>

            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 pt-2">8. Contato</h3>
            <p>
              Se tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco pelo e-mail: <a href="mailto:privacidade@hortifruti.com" className="text-green-600 dark:text-green-400 hover:underline">privacidade@hortifruti.com</a>.
            </p>
          </div>
        </section>

        {/* Separador */}
        <hr className="my-10 border-gray-200 dark:border-gray-700" />

        {/* Seção Termos de Serviço */}
        <section id="termos">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4 border-b dark:border-gray-600 pb-2">
            Termos de Serviço
          </h2>
          <div className="space-y-4 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            <p><strong>Última atualização:</strong> 19 de Outubro de 2025</p>
            <p>
              Ao acessar e usar o site da Hortifruti Slim ("Serviço"), você concorda em cumprir estes Termos de Serviço ("Termos"). Se você não concordar com algum destes termos, não utilize nosso Serviço.
            </p>

            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 pt-2">1. Uso do Serviço</h3>
            <p>
              Você deve ter pelo menos 18 anos para usar este Serviço. Você é responsável por manter a confidencialidade de sua conta e senha e por restringir o acesso ao seu computador. Você concorda em aceitar a responsabilidade por todas as atividades que ocorram sob sua conta ou senha.
            </p>

            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 pt-2">2. Pedidos e Pagamentos</h3>
            <p>
              Todos os pedidos estão sujeitos à disponibilidade de estoque e à confirmação do preço do pedido. Reservamo-nos o direito de recusar qualquer pedido que você fizer. Os preços dos produtos estão sujeitos a alterações sem aviso prévio. O pagamento deve ser recebido integralmente antes da aceitação de um pedido.
            </p>

             <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 pt-2">3. Entregas</h3>
             <p>
                Faremos o possível para entregar os produtos dentro do prazo estimado, mas não nos responsabilizamos por atrasos fora do nosso controle razoável. O risco de perda ou dano aos produtos passa para você no momento da entrega. Por favor, verifique a área de entrega atendida antes de finalizar o pedido.
             </p>

            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 pt-2">4. Devoluções e Reembolsos</h3>
            <p>
              Devido à natureza perecível de nossos produtos, aceitamos devoluções ou trocas apenas em casos de produtos entregues danificados ou incorretos, mediante notificação dentro de [Número] horas após o recebimento. Entre em contato com nosso atendimento ao cliente para mais detalhes.
            </p>

            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 pt-2">5. Propriedade Intelectual</h3>
            <p>
              O Serviço e seu conteúdo original, recursos e funcionalidades são e permanecerão propriedade exclusiva da Hortifruti Slim e de seus licenciadores.
            </p>

            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 pt-2">6. Limitação de Responsabilidade</h3>
            <p>
              Em nenhuma circunstância a Hortifruti Slim, nem seus diretores, funcionários, parceiros ou agentes, serão responsáveis por quaisquer danos indiretos, incidentais, especiais, consequenciais ou punitivos resultantes do seu acesso ou uso do Serviço.
            </p>

             <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 pt-2">7. Alterações nos Termos</h3>
             <p>
                Reservamo-nos o direito de modificar ou substituir estes Termos a qualquer momento. Notificaremos sobre alterações significativas publicando os novos termos no site.
             </p>

            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 pt-2">8. Contato</h3>
            <p>
              Se tiver dúvidas sobre estes Termos, entre em contato conosco pelo e-mail: <a href="mailto:termos@hortifruti.com" className="text-green-600 dark:text-green-400 hover:underline">termos@hortifruti.com</a>.
            </p>
          </div>
        </section>

         {/* Disclaimer Legal */}
         <div className="mt-12 pt-6 border-t dark:border-gray-700 text-center">
             <p className="text-xs text-gray-500 dark:text-gray-500 italic">
                 Atenção: Os textos acima são exemplos genéricos e não constituem aconselhamento jurídico.
                 Recomendamos fortemente que você consulte um profissional jurídico para redigir ou revisar
                 suas políticas de privacidade e termos de serviço, garantindo conformidade com a LGPD e
                 outras legislações aplicáveis ao seu negócio específico.
             </p>
         </div>

      </div>
    </div>
  );
};

export default PaginaPoliticas;