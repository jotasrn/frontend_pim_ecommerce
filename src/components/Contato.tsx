import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { showToast } from '../utils/toastHelper';

const Contato: React.FC = () => {
  const [dadosFormulario, setDadosFormulario] = useState({
    nome: '',
    email: '',
    mensagem: ''
  });
  const [formularioEnviado, setFormularioEnviado] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDadosFormulario(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Formulário enviado:', dadosFormulario);

    setFormularioEnviado(true);
    showToast.success("Mensagem enviada com sucesso!");

    setDadosFormulario({ nome: '', email: '', mensagem: '' });

    setTimeout(() => {
      setFormularioEnviado(false);
    }, 3000);
  };

  return (
    <section id="contato" className="py-16 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-gray-100">Entre em Contato</h2>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Card do Formulário */}
          <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md border dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100">Envie uma Mensagem</h3>

            {formularioEnviado ? (
              <div className="bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-300 px-4 py-3 rounded text-center">
                <p>Mensagem enviada com sucesso! Entraremos em contato em breve.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="nome"
                    value={dadosFormulario.nome}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={dadosFormulario.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Mensagem
                  </label>
                  <textarea
                    id="message"
                    name="mensagem"
                    value={dadosFormulario.mensagem}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-500 dark:bg-green-600 text-white py-2.5 px-4 rounded-md hover:bg-green-600 dark:hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-medium shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  Enviar Mensagem
                </button>
              </form>
            )}
          </div>

          {/* Card de Informações */}
          <div className="flex flex-col justify-between text-gray-700 dark:text-gray-300">
            <div>
              <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100">Informações de Contato</h3>
              <div className="space-y-5">
                {/* Telefone */}
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                    <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Telefone</p>
                    <p className="font-medium text-gray-800 dark:text-gray-100">(00) 1234-5678</p>
                  </div>
                </div>
                {/* Email */}
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                    <Mail className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <p className="font-medium text-gray-800 dark:text-gray-100">contato@hortifruti.com</p>
                  </div>
                </div>
                {/* Endereço */}
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                    <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Endereço</p>
                    <p className="font-medium text-gray-800 dark:text-gray-100">Rua das Frutas, 123</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">São Paulo, SP - 01234-567</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Horário */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">Horário de Funcionamento</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-100">Segunda - Sexta</p>
                  <p className="text-gray-500 dark:text-gray-400">07:00 - 20:00</p>
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-100">Sábado</p>
                  <p className="text-gray-500 dark:text-gray-400">08:00 - 18:00</p>
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-100">Domingo</p>
                  <p className="text-gray-500 dark:text-gray-400">08:00 - 14:00</p>
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-100">Feriados</p>
                  <p className="text-gray-500 dark:text-gray-400">09:00 - 14:00</p>
                </div>
              </div>
            </div>

            {/* Mapa */}
            <div className="mt-8 bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="bg-gray-200 dark:bg-gray-700 h-60 rounded flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">Mapa de Localização</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contato;