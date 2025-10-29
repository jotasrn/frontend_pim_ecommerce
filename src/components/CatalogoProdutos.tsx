import React, { useState } from 'react';
import { useProdutos } from '../hooks/useProdutos';
import { useCategorias } from '../hooks/useCategorias';
import { Produto, Categoria } from '../types';
import ProductCard from './CartaoProduto';
import ProductDetailsModal from './modals/ModalProdutoDetalhes';
import LoadingSpinner from './shared/LoadingSpinner'; 

const CatalogoProduto: React.FC = () => {
  const { produtos, loading: loadingProdutos } = useProdutos();
  const { categorias, loading: loadingCategorias } = useCategorias();
  
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Produto | null>(null);

  const handleProductClick = (product: Produto) => {
    setSelectedProduct(product);
  };

  const filteredProducts = produtos.filter(product => {
    const categoryMatch = activeCategory === null || product.categoria?.id === activeCategory;
    const searchMatch = searchQuery === '' || 
      product.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.descricao && product.descricao.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return categoryMatch && searchMatch;
  });
  
  const onSaleProducts = filteredProducts.filter(p => p.promocoes && p.promocoes.length > 0);
  const regularProducts = filteredProducts.filter(p => !p.promocoes || p.promocoes.length === 0);

  return (
    <section id="produtos" className="py-16 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
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
          
          {loadingCategorias ? <p className="text-gray-500 dark:text-gray-400">Carregando...</p> : categorias.map((category: Categoria) => (
              <button key={category.id} onClick={() => setActiveCategory(category.id)}
                 className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                   activeCategory === category.id
                     ? 'bg-green-600 text-white shadow-sm'
                     : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                 }`}> {category.nome} 
                </button>
           ))}
        </div>

        {loadingProdutos && (
          <div className="py-10"><LoadingSpinner text="Buscando produtos frescos..." /></div>
        )}

        {!loadingProdutos && (
          <>
            {onSaleProducts.length > 0 && (
              <div className="mb-12">
                <h3 className="text-xl font-semibold mb-6 text-red-600 dark:text-red-400">Ofertas Especiais</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {onSaleProducts.map(product => (
                    <ProductCard key={product.id} product={product} onClick={() => handleProductClick(product)} />
                  ))}
                </div>
              </div>
            )}
            <div>
              <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
                 {activeCategory === null ? 'Todos os Produtos' : categorias.find(c=>c.id === activeCategory)?.nome || 'Produtos'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {regularProducts.map(product => (
                  <ProductCard key={product.id} product={product} onClick={() => handleProductClick(product)} />
                ))}
              </div>
            </div>
          </>
        )}
        {!loadingProdutos && filteredProducts.length === 0 && (
          <div className="text-center py-10"><p className="text-gray-500 dark:text-gray-400">Nenhum produto encontrado.</p></div>
        )}
        {selectedProduct && <ProductDetailsModal produto={selectedProduct} onClose={() => setSelectedProduct(null)} />}
      </div>
    </section>
  );
};

export default CatalogoProduto;