import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { X, Loader2, MapPin } from 'lucide-react';
import { Endereco } from '../../types';
import { showToast } from '../../utils/toastHelper';
import { formatApiError } from '../../utils/apiHelpers';

type EnderecoFormData = Omit<Endereco, 'id' | 'latitude' | 'longitude'>;

interface FormularioEnderecoProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EnderecoFormData) => Promise<void>;
  initialData?: Endereco | null;
}

interface NominatimAddress {
  road?: string;
  house_number?: string;
  suburb?: string;
  city?: string;
  town?: string;
  village?: string;
  state?: string;
  postcode?: string;
  country_code?: string;
}

const FormularioEndereco: React.FC<FormularioEnderecoProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<EnderecoFormData>({
    defaultValues: { rua: '', numero: '', bairro: '', cidade: '', estado: '', cep: '', complemento: '' }
  });

  const [buscandoLocalizacao, setBuscandoLocalizacao] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) { reset(initialData); }
      else { reset({ rua: '', numero: '', bairro: '', cidade: '', estado: '', cep: '', complemento: '' }); }
    }
  }, [initialData, reset, isOpen]);

  const onSubmit: SubmitHandler<EnderecoFormData> = async (data) => {
    try {
      await onSave(data);
      showToast.success(initialData ? "Endereço atualizado!" : "Endereço adicionado!");
      onClose();
    } catch (err) {
      showToast.error(formatApiError(err));
    }
  };

  const buscarEnderecoAtual = async () => {
    if (!navigator.geolocation) {
      showToast.error("Geolocalização não é suportada pelo seu navegador.");
      return;
    }

    setBuscandoLocalizacao(true);
    showToast.info("Obtendo sua localização...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        showToast.info("Localização obtida. Buscando endereço...");

        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=pt-BR&addressdetails=1`);

          if (!response.ok) {
            throw new Error(`Erro na API Nominatim: ${response.status} ${response.statusText}`);
          }

          const data = await response.json();

          if (data && data.address) {
            const address: NominatimAddress = data.address;

            setValue('rua', address.road || '', { shouldValidate: true });
            setValue('numero', address.house_number || '', { shouldValidate: true });
            setValue('bairro', address.suburb || '', { shouldValidate: true });
            setValue('cidade', address.city || address.town || address.village || '', { shouldValidate: true });
            const estadoCompleto = address.state || '';
            const uf = mapearEstadoParaUF(estadoCompleto);
            setValue('estado', uf, { shouldValidate: true });
            setValue('cep', (address.postcode || '').replace(/\D/g, ''), { shouldValidate: true });

            showToast.success("Endereço preenchido! Verifique os dados, especialmente o número e a UF.");
            if (!uf && estadoCompleto) {
              showToast.warning(`Não foi possível converter "${estadoCompleto}" para UF. Preencha manualmente.`);
            }
          } else {
            console.warn("Resposta Nominatim sem 'address':", data);
            showToast.error("Não foi possível obter detalhes do endereço para esta localização.");
          }
        } catch (error) {
          console.error("Erro ao buscar endereço via Nominatim:", error);
          showToast.error("Falha ao converter localização em endereço. Tente novamente.");
        } finally {
          setBuscandoLocalizacao(false);
        }
      },
      (error) => {
        console.error("Erro ao obter geolocalização:", error);
        let msg = "Não foi possível obter sua localização.";
        if (error.code === error.PERMISSION_DENIED) { msg = "Permissão de localização negada."; }
        else if (error.code === error.POSITION_UNAVAILABLE) { msg = "Localização indisponível."; }
        else if (error.code === error.TIMEOUT) { msg = "Tempo esgotado ao buscar localização."; }
        showToast.error(msg);
        setBuscandoLocalizacao(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const mapearEstadoParaUF = (nomeEstado: string): string => {
    const mapaEstados: { [key: string]: string } = {
      'distrito federal': 'DF', 'goiás': 'GO', 'são paulo': 'SP', 'rio de janeiro': 'RJ',
      'minas gerais': 'MG', 'bahia': 'BA', 'paraná': 'PR', 'rio grande do sul': 'RS',
      'pernambuco': 'PE', 'ceará': 'CE', 'amazonas': 'AM', 'pará': 'PA', 'santa catarina': 'SC',
      'maranhão': 'MA', 'paraíba': 'PB', 'espírito santo': 'ES', 'rio grande do norte': 'RN',
      'piauí': 'PI', 'alagoas': 'AL', 'mato grosso': 'MT', 'mato grosso do sul': 'MS',
      'sergipe': 'SE', 'tocantins': 'TO', 'rondônia': 'RO', 'acre': 'AC', 'roraima': 'RR', 'amapá': 'AP'
    };
    return mapaEstados[nomeEstado.toLowerCase()] || '';
  }


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col border dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {initialData ? 'Editar Endereço' : 'Adicionar Novo Endereço'}
          </h2>
          <button onClick={onClose} disabled={isSubmitting || buscandoLocalizacao} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto p-6 space-y-4">

          <div className="mb-5">
            <button
              type="button"
              onClick={buscarEnderecoAtual}
              disabled={buscandoLocalizacao || isSubmitting}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {buscandoLocalizacao ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Buscando...</>
              ) : (
                <><MapPin className="w-4 h-4 mr-2" /> Usar Localização Atual</>
              )}
            </button>
            <p className="mt-1 text-xs text-center text-gray-500 dark:text-gray-400">Requer permissão. Pode não ser 100% preciso.</p>
          </div>

          <div>
            <label htmlFor="cep" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CEP</label>
            <input {...register('cep', { required: 'O CEP é obrigatório' })} type="text" id="cep" disabled={isSubmitting || buscandoLocalizacao} className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-60 ${errors.cep ? 'border-red-500 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}`} />
            {errors.cep && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.cep.message}</p>}
          </div>
          <div>
            <label htmlFor="rua" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rua / Avenida</label>
            <input {...register('rua', { required: 'A rua é obrigatória' })} type="text" id="rua" disabled={isSubmitting || buscandoLocalizacao} className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-60 ${errors.rua ? 'border-red-500 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}`} />
            {errors.rua && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.rua.message}</p>}
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <label htmlFor="numero" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Número</label>
              <input {...register('numero', { required: 'O número é obrigatório' })} type="text" id="numero" disabled={isSubmitting || buscandoLocalizacao} className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-60 ${errors.numero ? 'border-red-500 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}`} />
              {errors.numero && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.numero.message}</p>}
            </div>
            <div className="col-span-2">
              <label htmlFor="complemento" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Complemento (Opcional)</label>
              <input {...register('complemento')} type="text" id="complemento" disabled={isSubmitting || buscandoLocalizacao} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-60" />
            </div>
          </div>
          <div>
            <label htmlFor="bairro" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bairro</label>
            <input {...register('bairro', { required: 'O bairro é obrigatório' })} type="text" id="bairro" disabled={isSubmitting || buscandoLocalizacao} className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-60 ${errors.bairro ? 'border-red-500 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}`} />
            {errors.bairro && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.bairro.message}</p>}
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label htmlFor="cidade" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cidade</label>
              <input {...register('cidade', { required: 'A cidade é obrigatória' })} type="text" id="cidade" disabled={isSubmitting || buscandoLocalizacao} className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-60 ${errors.cidade ? 'border-red-500 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}`} />
              {errors.cidade && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.cidade.message}</p>}
            </div>
            <div className="col-span-1">
              <label htmlFor="estado" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estado (UF)</label>
              <input {...register('estado', { required: 'O estado é obrigatório', maxLength: { value: 2, message: 'UF inválida' }, pattern: { value: /^[A-Z]{2}$/i, message: 'UF inválida' } })} type="text" id="estado" maxLength={2} disabled={isSubmitting || buscandoLocalizacao} className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 uppercase bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-60 ${errors.estado ? 'border-red-500 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}`} />
              {errors.estado && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.estado.message}</p>}
            </div>
          </div>


          <div className="flex justify-end space-x-4 pt-5 border-t dark:border-gray-700 mt-5">
            <button type="button" onClick={onClose} disabled={isSubmitting || buscandoLocalizacao} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"> Cancelar </button>
            <button type="submit" disabled={isSubmitting || buscandoLocalizacao} className="px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white rounded-md disabled:opacity-50 flex items-center justify-center min-w-[120px] transition-colors shadow-sm">
              {isSubmitting ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" /> A guardar...</>) : (initialData ? 'Atualizar' : 'Salvar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioEndereco;