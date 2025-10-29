import React, { useState, useEffect } from 'react';
import Slider, { Settings } from 'react-slick';
import { promocaoService } from '../services/promocaoService';
import { Promocao } from '../types';
import LoadingSpinner from './shared/LoadingSpinner';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatApiError } from '../utils/apiHelpers';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface ArrowProps {
  className?: string;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const PrevArrow: React.FC<ArrowProps> = ({ className, style, onClick }) => {
  const defaultClasses = "slick-arrow absolute top-1/2 left-2 z-10 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2";
  const combinedClassName = className?.includes('slick-arrow') ? className : `${defaultClasses} ${className || ''}`;

  return (
    <button
      className={combinedClassName.trim()}
      style={style}
      onClick={onClick}
      aria-label="Anterior"
    >
      <ChevronLeft size={20} />
    </button>
  );
}

const NextArrow: React.FC<ArrowProps> = ({ className, style, onClick }) => {
  const defaultClasses = "slick-arrow absolute top-1/2 right-2 z-10 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2";
  const combinedClassName = className?.includes('slick-arrow') ? className : `${defaultClasses} ${className || ''}`;

  return (
    <button
      className={combinedClassName.trim()}
      style={style}
      onClick={onClick}
      aria-label="Próximo"
    >
      <ChevronRight size={20} />
    </button>
  );
}


const BannerDestaques: React.FC = () => {
  const [promocoesDestaque, setPromocoesDestaque] = useState<Promocao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPromocoes = async () => {
      setLoading(true);
      setError(null);
      try {
        const todasPromocoes = await promocaoService.listar();
        const promocoesFiltradas = todasPromocoes.filter(promo =>
          promo.ativa &&
          promo.produtos && promo.produtos.length > 0 &&
          promo.produtos.some(p => p.imagemUrl)
        );
        setPromocoesDestaque(promocoesFiltradas);
      } catch (err) {
        setError(formatApiError(err));
        console.error("Erro ao buscar promoções para destaques:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPromocoes();
  }, []);

  const settings: Settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    appendDots: (dots: React.ReactNode) => (
        <div style={{ bottom: "15px", position: 'absolute', width: '100%' }}>
          <ul style={{ margin: "0px", padding: '0px' }}> {dots} </ul>
        </div>
    ),
    customPaging: () => (
        <div className="w-2 h-2 bg-white/50 dark:bg-gray-400/50 rounded-full slick-dot-custom cursor-pointer"></div>
    )
  };

  if (loading) {
    return (
      <div className="h-48 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <LoadingSpinner size="md" text="Carregando destaques..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-48 flex items-center justify-center bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-4">
        <p>Erro ao carregar destaques: {error}</p>
      </div>
    );
  }

  if (promocoesDestaque.length === 0 && !loading) { return null; }

  return (
    <section className="py-8 bg-gray-100 dark:bg-gray-800 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="slick-wrapper">
            <Slider {...settings}>
              {promocoesDestaque.map((promo) => {
                const produtoComImagem = promo.produtos.find(p => p.imagemUrl);
                const imageUrl = produtoComImagem?.imagemUrl || 'https://via.placeholder.com/1200x400/cccccc/888888?text=Promoção';
                const altText = produtoComImagem?.nome || promo.descricao || 'Promoção';

                return (
                  <div key={promo.id} className="outline-none focus:outline-none px-1">
                        <div className="relative rounded-lg overflow-hidden shadow-lg aspect-w-16 aspect-h-6 md:aspect-h-5 lg:aspect-h-4 bg-gray-300 dark:bg-gray-700">
                            <img
                              src={imageUrl}
                              alt={`Promoção: ${altText}`}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent flex items-end p-4 md:p-6">
                              <div>
                                <h3 className="text-white text-lg md:text-xl lg:text-2xl font-semibold drop-shadow-md line-clamp-2">
                                  {promo.descricao}
                                </h3>
                                <p className="text-yellow-300 font-bold text-base md:text-lg drop-shadow-md mt-1">
                                    {promo.percentualDesconto}% OFF!
                                </p>
                              </div>
                            </div>
                        </div>
                  </div>
                );
              })}
            </Slider>
        </div>
      </div>
      <style>{`
        .slick-wrapper .slick-dots li.slick-active .slick-dot-custom { background-color: white !important; opacity: 1 !important; }
        .slick-wrapper .slick-dots li .slick-dot-custom { background-color: white; opacity: 0.5; transition: opacity 0.3s ease; }
        .dark .slick-wrapper .slick-dots li.slick-active .slick-dot-custom { background-color: #a0aec0 !important; }
        .dark .slick-wrapper .slick-dots li .slick-dot-custom { background-color: #718096; opacity: 0.4; }
        .slick-prev:before, .slick-next:before { content: '' !important; }
        .slick-wrapper .slick-prev { left: 10px; }
        .slick-wrapper .slick-next { right: 10px; }
        .dark .slick-wrapper .slick-arrow { background-color: rgba(55, 65, 81, 0.4); /* Exemplo: gray-700 com opacidade */ }
        .dark .slick-wrapper .slick-arrow:hover { background-color: rgba(55, 65, 81, 0.6); }
      `}</style>
    </section>
  );
};

export default BannerDestaques;