import React from 'react';

import Navbar from '../components/shared/Navbar';
import BannerPrincipal from '../components/BannerPrincipal';
import BannerDestaques from '../components/BannerDestaques';
import Diferenciais from '../components/Diferenciais';
import CatalogoProdutos from '../components/CatalogoProdutos';
import Sobre from '../components/Sobre';
import Contato from '../components/Contato';
import BoletimInformativo from '../components/BoletimInformativo';
import Rodape from '../components/shared/Rodape';
import VoltarAoTopo from '../components/shared/VoltarAoTopo';

interface PaginaInicialProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onLoginClick: () => void;
  onCartClick: () => void;
  filtroPromocaoId: number | null;
  onLimparFiltroPromocao: () => void;
  onPromocaoClick: (id: number) => void;
}

const PaginaInicial: React.FC<PaginaInicialProps> = ({
  searchTerm,
  onSearchChange,
  onLoginClick,
  onCartClick,
  filtroPromocaoId,
  onLimparFiltroPromocao,
  onPromocaoClick
}) => {
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 relative transition-colors duration-300">
      <VoltarAoTopo />
      <Navbar
        onLoginClick={onLoginClick}
        onCartClick={onCartClick}
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
      />

      <BannerPrincipal />
      <BannerDestaques onPromocaoClick={onPromocaoClick} />
      <Diferenciais />
      <CatalogoProdutos 
        filtroPromocaoId={filtroPromocaoId}
        onLimparFiltroPromocao={onLimparFiltroPromocao} 
        searchTerm={searchTerm}
      />
      <Sobre />
      <Contato />
      <BoletimInformativo />

      <Rodape />
    </div>
  );
}

export default PaginaInicial;