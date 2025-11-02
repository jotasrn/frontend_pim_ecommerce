import React from 'react';

const BannerPrincipal: React.FC = () => {
  return (
    <section className="pt-28 pb-16 md:pt-32 md:pb-20 bg-gradient-to-r from-green-500 to-green-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center md:text-left md:flex md:items-center md:justify-between">
          <div className="md:max-w-xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              Frutas e Verduras Frescas
            </h1>
            <p className="mt-3 text-lg md:text-xl text-white/90">
              Diretamente do produtor para sua mesa, produtos frescos e de qualidade.
            </p>
            <div className="mt-6">
              <a 
                href="#produtos" 
                className="inline-block bg-white text-green-600 px-6 py-3 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Ver Produtos
              </a>
            </div>
          </div>
          <div className="hidden md:block w-1/3 animate-float">
            <div className="relative">
              <div className="absolute -top-16 -right-16 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerPrincipal;