import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, Loader2, LogIn } from 'lucide-react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { showToast } from '../utils/toastHelper';
import { useAuth } from '../contexts/AuthContext';
import { duvidaService } from '../services/duvidaService';
import { DuvidaRequestDTO } from '../types';
import { formatApiError } from '../utils/apiHelpers';

type DuvidaFormData = {
  nome: string;
  email: string;
  telefone: string;
  duvida: string;
  isPublica: boolean;
};

const Contato: React.FC = () => {
  const { usuario } = useAuth();
  const [formularioEnviado, setFormularioEnviado] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<DuvidaFormData>({
    defaultValues: {
      nome: '', email: '', telefone: '', duvida: '', isPublica: false 
    }
  });

  useEffect(() => {
    if (usuario) {
      setValue('nome', usuario.nomeCompleto || '');
      setValue('email', usuario.email);
    } else {
      reset({ nome: '', email: '', telefone: '', duvida: '', isPublica: false });
    }
  }, [usuario, setValue, reset]);

  const onSubmit: SubmitHandler<DuvidaFormData> = async (data) => {
    try {
      const dtoParaEnviar: DuvidaRequestDTO = {
        titulo: data.nome,
        email: data.email,
        pergunta: data.duvida,
        isPublica: data.isPublica 
      };

      await duvidaService.submeterDuvida(dtoParaEnviar);
      
      setFormularioEnviado(true);
      showToast.success("Dúvida enviada com sucesso! Responderemos em breve.");

      reset({
        nome: usuario?.nomeCompleto || '',
        email: usuario?.email || '',
        telefone: '',
        duvida: '',
        isPublica: false
      });

      setTimeout(() => {
        setFormularioEnviado(false);
      }, 5000);

    } catch (err) {
      showToast.error(formatApiError(err));
    }
  };

  return (
    <section id="contato" className="py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-gray-100">Entre em Contato</h2>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Coluna da Esquerda: Formulário */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md border dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
              {usuario ? "Envie sua Dúvida" : "Faça Login para Enviar Dúvidas"}
            </h3>

            {usuario ? (
              formularioEnviado ? (
                <div className="bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-300 px-4 py-3 rounded text-center animate-fadeIn">
                  <p className="font-medium">Dúvida enviada!</p>
                  <p className="text-sm mt-1">Nossa equipe analisará sua pergunta. Se houver uma resposta imediata, você receberá por e-mail, caso contrário, nossa equipe responderá em breve.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label htmlFor="name-contato" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome Completo</label>
                    <input
                      type="text"
                      id="name-contato"
                      {...register('nome', { required: 'Nome é obrigatório' })}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 read-only:opacity-70 ${errors.nome ? 'border-red-500 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}`}
                      readOnly
                    />
                    {errors.nome && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.nome.message}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="email-contato" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                    <input
                      type="email"
                      id="email-contato"
                      {...register('email', { required: 'Email é obrigatório' })}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 read-only:opacity-70 ${errors.email ? 'border-red-500 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}`}
                      readOnly
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="telefone-contato" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Telefone (Opcional)</label>
                    <input
                      type="tel"
                      id="telefone-contato"
                      {...register('telefone')}
                      disabled={isSubmitting}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-60"
                      placeholder="(61) 99999-9999"
                    />
                  </div>

                  <div>
                    <label htmlFor="duvida-contato" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dúvida / Mensagem</label>
                    <textarea
                      id="duvida-contato"
                      {...register('duvida', { required: 'Sua dúvida é obrigatória' })}
                      rows={4}
                      disabled={isSubmitting}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-60 ${errors.duvida ? 'border-red-500 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}`}
                      placeholder="Como podemos ajudar?"
                    ></textarea>
                    {errors.duvida && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.duvida.message}</p>}
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="isPublica"
                        type="checkbox"
                        {...register('isPublica')}
                        disabled={isSubmitting}
                        className="w-4 h-4 text-green-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-green-500 focus:ring-offset-0"
                      />
                    </div>
                    <div className="ml-2 text-sm">
                      <label htmlFor="isPublica" className="text-gray-700 dark:text-gray-300 cursor-pointer select-none">
                        Autorizo tornar esta dúvida pública na área de "Comunidade" (será exibida de forma anônima).
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-green-600 dark:bg-green-600 text-white py-2.5 px-4 rounded-md hover:bg-green-700 dark:hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-medium shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4" />}
                    {isSubmitting ? 'Enviando...' : 'Enviar Dúvida'}
                  </button>
                </form>
              )
            ) : (
              <div className="text-center py-10 flex flex-col items-center justify-center h-full space-y-4">
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full">
                  <LogIn className="h-8 w-8 text-gray-500 dark:text-gray-300" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Faça login para enviar sua dúvida</h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                    Para garantirmos um atendimento personalizado e seguro, é necessário estar autenticado.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between text-gray-700 dark:text-gray-300 space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100">Informações de Contato</h3>
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                    <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">Telefone</p>
                    <p className="font-medium text-gray-800 dark:text-gray-100">(61) 1234-5678</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                    <Mail className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">Email</p>
                    <p className="font-medium text-gray-800 dark:text-gray-100">contato@hortifruti.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full mt-1">
                    <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">Endereço (UNIP)</p>
                    <p className="font-medium text-gray-800 dark:text-gray-100">Sgas Quadra 913, Conjunto B - Asa Sul</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Brasília - DF, 70390-130</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Horário de Funcionamento</h3>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="grid grid-cols-2 gap-y-3 text-sm">
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
            </div>

            <div className="relative rounded-lg overflow-hidden cursor-pointer group shadow-md h-64 border border-gray-200 dark:border-gray-700">
              <a
                href="https://www.google.com/maps/search/?api=1&query=UNIP+Asa+Sul+Brasilia"
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full w-full"
                aria-label="Abrir localização da UNIP Asa Sul no Google Maps"
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3839.265708368304!2d-47.9172!3d-15.814!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x935a2f5844755555%3A0x1e1e1e1e1e1e1e1e!2sUNIP%20-%20Universidade%20Paulista%20-%20Campus%20Bras%C3%ADlia!5e0!3m2!1spt-BR!2sbr!4v1620000000000!5m2!1spt-BR!2sbr"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localização da UNIP Asa Sul"
                  className="pointer-events-none grayscale-[50%] group-hover:grayscale-0 transition-all duration-500"
                ></iframe>

                <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-colors duration-300">
                  <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white font-semibold px-4 py-2 rounded-full shadow-lg transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-500" />
                    Abrir no Maps
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contato;