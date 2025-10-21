import { useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const VoltarAoTopo = () => {
  useEffect(() => {
    const handleScroll = () => {
      const scrollButton = document.getElementById('scroll-to-top');

      if (window.scrollY > 300) {
        scrollButton?.classList.remove('hidden');
        scrollButton?.classList.add('flex');
      } else {
        scrollButton?.classList.add('hidden');
        scrollButton?.classList.remove('flex');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      id="scroll-to-top"
      className="hidden fixed bottom-6 right-6 h-10 w-10 items-center justify-center bg-green-600 text-white rounded-full shadow-md hover:bg-green-700 transition-all duration-300 z-30"
      onClick={scrollToTop}
      aria-label="Voltar ao topo"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
};

export default VoltarAoTopo;