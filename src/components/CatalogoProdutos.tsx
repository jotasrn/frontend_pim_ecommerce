import React, { useState, useEffect, useMemo } from 'react';
import Slider, { Settings } from 'react-slick';
import { useProdutos } from '../hooks/useProdutos';
import { useCategorias } from '../hooks/useCategorias';
import { Produto, Categoria } from '../types';
import CartaoProduto from './CartaoProduto';
import ModalDetalhesProduto from './modals/ModalProdutoDetalhes';
import LoadingSpinner from './shared/LoadingSpinner'; 
import { ChevronLeft, ChevronRight } from 'lucide-react';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface ArrowProps {
  className?: string;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const PrevArrow: React.FC<ArrowProps> = ({ className, style, onClick }) => {
  const defaultClasses = "slick-arrow absolute top-1/2 left-0 z-10 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2";
  const combinedClassName = className?.includes('slick-arrow') ? className : `${defaultClasses} ${className || ''}`;
  return (
    <button className={combinedClassName.trim()} style={{...style, left: '-10px'}} onClick={onClick} aria-label="Anterior">
      <ChevronLeft size={20} />
    </button>
  );
}

const NextArrow: React.FC<ArrowProps> = ({ className, style, onClick }) => {
  const defaultClasses = "slick-arrow absolute top-1/2 right-0 z-10 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2";
  const combinedClassName = className?.includes('slick-arrow') ? className : `${defaultClasses} ${className || ''}`;
  return (
    <button className={combinedClassName.trim()} style={{...style, right: '-10px'}} onClick={onClick} aria-label="Próximo">
      <ChevronRight size={20} />
    </button>
  );
}

interface CatalogoProdutosProps {
  filtroPromocaoId: number | null;
}

const ITENS_POR_PAGINA = 12;

const CatalogoProdutos: React.FC<CatalogoProdutosProps> = ({ filtroPromocaoId }) => {
  const { produtos, loading: loadingProdutos, error: erroProdutos } = useProdutos(); 
  const { categorias, loading: loadingCategorias, error: erroCategorias } = useCategorias();
  
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Produto | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const handleProductClick = (product: Produto) => {
    setSelectedProduct(product);
  };

  const filteredProducts = useMemo(() => {
    return produtos.filter(product => {
      const categoryMatch = activeCategory === null || product.categoria?.id === activeCategory;
      const searchMatch = searchQuery === '' || 
        product.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.descricao && product.descricao.toLowerCase().includes(searchQuery.toLowerCase()));
      const promocaoMatch = filtroPromocaoId === null || 
        (product.promocoes && product.promocoes.some(promo => promo.id === filtroPromocaoId));
      return categoryMatch && searchMatch && promocaoMatch;
    });
  }, [produtos, activeCategory, searchQuery, filtroPromocaoId]);
  
  const onSaleProducts = useMemo(() => 
    filtroPromocaoId === null ? filteredProducts.filter(p => p.promocoes && p.promocoes.length > 0) : [],
  [filteredProducts, filtroPromocaoId]);

  const regularProducts = useMemo(() =>
    filtroPromocaoId === null ? filteredProducts.filter(p => !p.promocoes || p.promocoes.length === 0) : filteredProducts,
  [filteredProducts, filtroPromocaoId]);

  const totalPages = Math.ceil(regularProducts.length / ITENS_POR_PAGINA);
  const paginatedRegularProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITENS_POR_PAGINA;
    const endIndex = startIndex + ITENS_POR_PAGINA;
    return regularProducts.slice(startIndex, endIndex);
  }, [regularProducts, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery, filtroPromocaoId]);

  const getNomeCategoriaAtiva = () => {
    if (activeCategory === null) return 'Todos os Produtos';
    return categorias.find(c => c.id === activeCategory)?.nome || 'Produtos';
  };

  const offerSliderSettings: Settings = {
    dots: false,
    infinite: onSaleProducts.length > 4,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3, slidesToScroll: 3, infinite: onSaleProducts.length > 3 }
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2, slidesToScroll: 2, infinite: onSaleProducts.length > 2 }
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1, slidesToScroll: 1, centerMode: true, centerPadding: '40px' }
      }
    ],
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />
  };

  return (
    <section id="produtos" className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">
          Nossos Produtos
        </h2>

        <div className="mb-6 md:hidden">
          <input type="text" placeholder="Buscar produtos..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === null
                ? 'bg-green-600 text-white shadow-sm'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
            }`}> Todos 
          </button>
          
          {loadingCategorias ? (
              <div className="flex gap-2">
                 <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                 <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
              </div>
          ) : erroCategorias ? (
             <p className="px-4 py-2 text-xs text-red-600 dark:text-red-400">{erroCategorias}</p>
          ) : ( 
            categorias.map((category: Categoria) => (
              <button key={category.id} onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === category.id
                      ? 'bg-green-600 text-white shadow-sm'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                  }`}> {category.nome} 
              </button>
            ))
          )}
        </div>
        
        {filtroPromocaoId !== null && (
          <div className="text-center mb-8 p-3 bg-green-50 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-md">
            <p className="font-medium text-green-700 dark:text-green-300">
              Mostrando itens da promoção selecionada.
            </p>
          </div>
        )}

        {(loadingProdutos || erroProdutos) && (
          <div className="py-10">
            {loadingProdutos && <LoadingSpinner text="Buscando produtos frescos..." />}
            {erroProdutos && <p className="text-center text-red-600 dark:text-red-400">{erroProdutos}</p>}
          </div>
        )}

        {!loadingProdutos && !erroProdutos && (
          <>
            {filtroPromocaoId === null ? (
              <>
                {onSaleProducts.length > 0 && (
                  <div className="mb-12">
                    <h3 className="text-xl font-semibold mb-6 text-red-600 dark:text-red-400">Ofertas Especiais</h3>
                    <div className="relative -mx-2">
                       <Slider {...offerSliderSettings}>
                        {onSaleProducts.map(product => (
                          <div key={product.id} className="px-2">
                            <CartaoProduto product={product} onClick={() => handleProductClick(product)} />
                          </div>
                        ))}
                      </Slider>
                    </div>
                  </div>
                )}
                
                <div>
                  <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
                    {getNomeCategoriaAtiva()}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {paginatedRegularProducts.map(product => (
                      <CartaoProduto key={product.id} product={product} onClick={() => handleProductClick(product)} />
                    ))}
                  </div>
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`h-9 w-9 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${
                          currentPage === page 
                            ? 'bg-green-600 text-white shadow-sm' 
                            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div>
                <h3 className="text-xl font-semibold mb-6 text-green-600 dark:text-green-400">
                  Itens da Promoção Selecionada
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {filteredProducts.map(product => (
                    <CartaoProduto key={product.id} product={product} onClick={() => handleProductClick(product)} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
        
        {!loadingProdutos && filteredProducts.length === 0 && (
          <div className="text-center py-10"><p className="text-gray-500 dark:text-gray-400">Nenhum produto encontrado.</p></div>
        )}
        
        {selectedProduct && <ModalDetalhesProduto produto={selectedProduct} onClose={() => setSelectedProduct(null)} />}
      </div>
    </section>
  );
};

export default CatalogoProdutos;