import React from 'react';
import { Leaf, Facebook, Instagram, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Rodape: React.FC = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 pt-12 pb-6 text-gray-600 dark:text-gray-400 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-gray-200 dark:border-gray-700">
          
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Leaf className="h-6 w-6 text-green-500" />
              <span className="font-semibold text-lg text-gray-800 dark:text-gray-100">Hortifruti</span>
            </div>
            <p className="mb-4 text-sm">
              Frescor e qualidade dos melhores produtores diretamente para sua mesa.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors" aria-label="Facebook"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors" aria-label="Instagram"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors" aria-label="Twitter"><Twitter className="h-5 w-5" /></a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-4 text-sm uppercase tracking-wider">Links Rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-green-500 dark:hover:text-green-400 transition-colors">Home</Link></li>
              <li><a href="/#produtos" className="hover:text-green-500 dark:hover:text-green-400 transition-colors">Produtos</a></li>
              <li><a href="/#sobre" className="hover:text-green-500 dark:hover:text-green-400 transition-colors">Sobre Nós</a></li>
              <li><a href="/#contato" className="hover:text-green-500 dark:hover:text-green-400 transition-colors">Contato</a></li>
              <li><Link to="/faq" className="hover:text-green-500 dark:hover:text-green-400 transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-4 text-sm uppercase tracking-wider">Contato</h4>
            <ul className="space-y-2 text-sm">
              <li>Tel: (61) 1234-5678</li>
              <li>Email: contato@hortifruti.com</li>
              <li>Sgas Quadra 913, Conjunto B - Asa Sul</li>
              <li>Brasília - DF, 70390-130</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-4 text-sm uppercase tracking-wider">Horário</h4>
            <ul className="space-y-2 text-sm">
              <li>Segunda - Sexta: 7h - 20h</li>
              <li>Sábado: 8h - 18h</li>
              <li>Domingo: 8h - 14h</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col md:flex-row justify-between items-center text-sm">
          <p className="text-gray-500 dark:text-gray-500 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Hortifruti - Todos os direitos reservados
          </p>
          <div className="flex space-x-6">
            <Link to="/politicas#privacidade" className="text-gray-500 hover:text-green-500 dark:hover:text-green-400 transition-colors">Política de Privacidade</Link>
            <Link to="/politicas#termos" className="text-gray-500 hover:text-green-500 dark:hover:text-green-400 transition-colors">Termos de Serviço</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Rodape;