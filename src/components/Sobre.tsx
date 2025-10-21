import React from 'react';

const Sobre: React.FC = () => {
  return (
    <section id="sobre" className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:flex lg:items-center lg:gap-12">
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Sobre a Hortifruti Slim</h2>

            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                Desde 2010, a Hortifruti Slim vem revolucionando a forma como as pessoas compram frutas, verduras e legumes.
                Nossa missão é conectar produtores locais diretamente aos consumidores, garantindo produtos sempre frescos,
                de alta qualidade e a preços justos.
              </p>

              <p>
                Trabalhamos com mais de 200 produtores familiares da região, ajudando a fortalecer a economia local e promovendo
                práticas agrícolas sustentáveis. Grande parte dos nossos produtos são orgânicos, cultivados sem o uso de agrotóxicos
                ou fertilizantes químicos.
              </p>

              <p>
                Nossa equipe seleciona cuidadosamente cada item que chega à sua mesa, garantindo o mais alto padrão de qualidade.
                Entregamos em toda a cidade, com agilidade e cuidado, para que você receba seus produtos sempre frescos, como se
                tivesse colhido diretamente da horta.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-8 text-center">
              <div>
                <p className="text-3xl font-bold text-green-500 dark:text-green-400">200+</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Produtores Parceiros</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-green-500 dark:text-green-400">15k+</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Clientes Satisfeitos</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-green-500 dark:text-green-400">60%</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Produtos Orgânicos</p>
              </div>
            </div>
          </div>

          <div className="mt-10 lg:mt-0 lg:w-1/2">
            <div className="relative">
              <img
                src="/imagem/Grupodev.jpg"
                alt="Equipe da Hortifruti Slim selecionando produtos frescos"
                className="rounded-lg shadow-xl w-full object-cover h-80 lg:h-96"
              />
              <div className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-xs hidden md:block border dark:border-gray-700">
                <p className="font-semibold text-green-600 dark:text-green-400">
                  "Nossa filosofia é simples: alimentos frescos, saudáveis e sustentáveis para todos."
                </p>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">- Maria Silva, Fundadora</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Sobre;