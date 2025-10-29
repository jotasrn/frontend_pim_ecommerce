import React, { useState, useEffect } from 'react';
import { X, CreditCard, Truck, Check, MapPin, Building, Loader2 } from 'lucide-react';
import { useCarrinho } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useEnderecos } from '../../hooks/useEnderecos';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { showToast } from '../../utils/toastHelper';
import { formatApiError, formatCurrency } from '../../utils/apiHelpers';
import { Endereco, VendaDTO, Venda } from '../../types';
import { enderecoService } from '../../services/enderecoService';
import { vendaService } from '../../services/vendaService';
import LoadingSpinner from '../shared/LoadingSpinner';

interface ModalPagamentoProps {
  aoFechar: () => void;
  aoSucessoCartao: () => void;
  aoSucessoPix: (venda: Venda) => void;
  aoSucessoBoleto: (venda: Venda) => void;
}

type Etapa = 'entrega' | 'pagamento' | 'confirmacao';
type OpcaoEntrega = 'entrega' | 'retirada';
type MetodoPagamento = 'cartao' | 'pix' | 'boleto';

type ValoresFormulario = {
  nome: string;
  enderecoSelecionadoId?: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  opcaoEntrega: OpcaoEntrega;
  metodoPagamento: MetodoPagamento;
};

interface NominatimAddress {
    road?: string;
    house_number?: string;
    suburb?: string;
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    postcode?: string;
}

const ModalPagamento: React.FC<ModalPagamentoProps> = ({ aoFechar, aoSucessoCartao, aoSucessoPix, aoSucessoBoleto }) => {
  const { getPrecoTotal, limparCarrinho, itensDoCarrinho } = useCarrinho();
  const { usuario } = useAuth();
  const { enderecos: enderecosCliente, loading: carregandoEnderecos, recarregarEnderecos } = useEnderecos();

  const [etapaAtual, setEtapaAtual] = useState<Etapa>('entrega');
  const [processando, setProcessando] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');
  const [mostrarFormNovoEndereco, setMostrarFormNovoEndereco] = useState(false);
  const [buscandoLocalizacao, setBuscandoLocalizacao] = useState(false);

  const { register, handleSubmit, trigger, getValues, watch, control, reset, setValue, formState: { errors, isSubmitting } } = useForm<ValoresFormulario>({
    defaultValues: {
      opcaoEntrega: 'retirada',
      metodoPagamento: 'cartao',
      enderecoSelecionadoId: undefined,
      nome: usuario?.nomeCompleto || usuario?.nome || '', // Preenchimento inicial do nome
      rua: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '', cep: ''
    }
  });

  const stripe = useStripe();
  const elements = useElements();

  const opcaoEntrega = watch('opcaoEntrega');
  const metodoPagamento = watch('metodoPagamento');
  const enderecoSelecionadoId = watch('enderecoSelecionadoId');

  // Efeito 1: Preenche o nome do usuário se ele carregar DEPOIS do modal
  useEffect(() => {
    if (usuario && !getValues('nome')) {
      setValue('nome', usuario.nomeCompleto || usuario.nome);
    }
  }, [usuario, setValue, getValues]);

  // Efeito 2: Define o endereço padrão QUANDO os endereços carregarem
  useEffect(() => {
    if (!carregandoEnderecos && getValues('enderecoSelecionadoId') === undefined) {
      const valorInicial = enderecosCliente.length > 0 ? String(enderecosCliente[0].id) : 'novo';
      setValue('enderecoSelecionadoId', valorInicial); // Usa setValue para não apagar outros defaults
    }
  }, [carregandoEnderecos, enderecosCliente, setValue, getValues]);
  
  // Efeito 3: Limpa o formulário INTEIRO ao fechar
  useEffect(() => {
    return () => {
      reset({
          opcaoEntrega: 'retirada',
          metodoPagamento: 'cartao', // Garante que 'cartao' é o padrão ao reabrir
          enderecoSelecionadoId: undefined,
          nome: usuario?.nomeCompleto || usuario?.nome || '', // Preenche o nome novamente
          rua: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '', cep: ''
      });
      setEtapaAtual('entrega');
      setProcessando(false);
      setMensagemErro('');
      setMostrarFormNovoEndereco(false);
    }
  }, [aoFechar, reset, usuario]); // Depende do usuário para preencher o nome corretamente

  // Efeito 4: Controla a visibilidade do formulário de novo endereço
  useEffect(() => {
    const deveMostrar = (opcaoEntrega === 'entrega' || metodoPagamento === 'boleto') && enderecoSelecionadoId === 'novo';
    setMostrarFormNovoEndereco(deveMostrar);
  }, [enderecoSelecionadoId, opcaoEntrega, metodoPagamento]);


  const getTaxaEntrega = () => 0.0;
  const precoTotalCarrinho = getPrecoTotal();
  const taxaEntrega = getTaxaEntrega();
  const valorTotalFinal = precoTotalCarrinho + taxaEntrega;

  const proximaEtapa = async () => {
    setMensagemErro('');
    if (etapaAtual === 'entrega') {
      let formValido = true;
      if (!(await trigger("nome"))) formValido = false;

      if (opcaoEntrega === 'entrega' || metodoPagamento === 'boleto') {
        if (enderecoSelecionadoId === 'novo') {
          if (!(await trigger(["rua", "numero", "bairro", "cidade", "estado", "cep"]))) formValido = false;
        } else if (!enderecoSelecionadoId) {
          await trigger("enderecoSelecionadoId");
          showToast.error(metodoPagamento === 'boleto' ? 'Endereço de cobrança é obrigatório para Boleto.' : 'Selecione um endereço de entrega.');
          formValido = false;
        }
      }
      
      if (!formValido) {
        showToast.error("Por favor, preencha os campos obrigatórios.");
        return;
      }
      setEtapaAtual('pagamento');

    } else if (etapaAtual === 'pagamento') {
      if (metodoPagamento === 'cartao') {
        if (!stripe || !elements) {
          setMensagemErro("O formulário de pagamento ainda não está pronto. Aguarde e tente novamente.");
          return;
        }
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          setMensagemErro("Erro ao carregar o campo do cartão. Tente recarregar.");
          return;
        }
      }
      setEtapaAtual('confirmacao');
    }
  };

  const etapaAnterior = () => {
    setMensagemErro('');
    if (etapaAtual === 'pagamento') setEtapaAtual('entrega');
    else if (etapaAtual === 'confirmacao') setEtapaAtual('pagamento');
  };

  const finalizarPedido: SubmitHandler<ValoresFormulario> = async (dadosFormulario) => {
    if (!usuario) { setMensagemErro("Erro de autenticação. Tente fazer login novamente."); return; }
    if (itensDoCarrinho.length === 0) { setMensagemErro("Seu carrinho está vazio."); return; }
    if (metodoPagamento === 'cartao' && (!stripe || !elements)) { setMensagemErro("Erro de configuração do pagamento. Tente recarregar ou aguarde."); return; }

    setProcessando(true);
    setMensagemErro('');

    let idEnderecoParaApi: number | undefined = undefined;
    
    try {
      if (opcaoEntrega === 'entrega' || metodoPagamento === 'boleto') {
        if (dadosFormulario.enderecoSelecionadoId === 'novo') {
          const dadosNovoEndereco = { rua: dadosFormulario.rua, numero: dadosFormulario.numero, complemento: dadosFormulario.complemento, bairro: dadosFormulario.bairro, cidade: dadosFormulario.cidade, estado: dadosFormulario.estado, cep: dadosFormulario.cep };
          const enderecoCriado = await enderecoService.adicionar(usuario.id, dadosNovoEndereco);
          idEnderecoParaApi = enderecoCriado.id;
          recarregarEnderecos();
        } else {
          idEnderecoParaApi = Number(dadosFormulario.enderecoSelecionadoId);
          if (isNaN(idEnderecoParaApi)) throw new Error("Endereço selecionado inválido.");
        }
      }

      let vendaDTO: VendaDTO;

      if (metodoPagamento === 'cartao') {
        const cardElement = elements!.getElement(CardElement);
        if (!cardElement) throw new Error("Elemento do cartão não encontrado.");
        const { error, paymentMethod: stripePaymentMethod } = await stripe!.createPaymentMethod({
          type: 'card', card: cardElement,
          billing_details: { name: dadosFormulario.nome, email: usuario.email },
        });
        if (error) throw new Error(error.message || "Erro no Stripe.");
        if (!stripePaymentMethod) throw new Error("Falha ao criar método de pagamento.");

        vendaDTO = {
          clienteId: usuario.id, formaPagamento: "Cartão de Crédito",
          paymentMethodId: stripePaymentMethod.id,
          enderecoEntregaId: idEnderecoParaApi,
          itens: itensDoCarrinho.map(item => ({ produtoId: item.id, quantidade: item.quantidade }))
        };

      } else {
        vendaDTO = {
          clienteId: usuario.id,
          formaPagamento: metodoPagamento === 'pix' ? 'PIX' : 'Boleto',
          enderecoEntregaId: idEnderecoParaApi,
          itens: itensDoCarrinho.map(item => ({ produtoId: item.id, quantidade: item.quantidade }))
        };
      }

      const respostaVenda = await vendaService.realizarVenda(vendaDTO);

      if (respostaVenda.statusPedido === "PAGAMENTO_APROVADO") {
        limparCarrinho();
        showToast.success("Pedido realizado com sucesso!");
        aoSucessoCartao();
      }
      else if (respostaVenda.statusPedido === "AGUARDANDO_PAGAMENTO") {
        limparCarrinho();
        if (respostaVenda.pixQrCodeData) {
            aoSucessoPix(respostaVenda);
        } else if (respostaVenda.boletoUrl) {
            aoSucessoBoleto(respostaVenda);
        } else {
             throw new Error("Pedido criado, mas dados de pagamento não retornados.");
        }
      } else {
          throw new Error(`Status de pedido inesperado: ${respostaVenda.statusPedido}`);
      }

    } catch (err) {
      console.error("Erro ao finalizar pedido:", err);
      setMensagemErro(formatApiError(err));
      setProcessando(false);
    }
  };

  const buscarEnderecoAtual = async () => {
    if (!navigator.geolocation) { showToast.error("Geolocalização não é suportada."); return; }
    setBuscandoLocalizacao(true);
    showToast.info("Obtendo sua localização...");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        showToast.info("Localização obtida. Buscando endereço...");
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=pt-BR&addressdetails=1`);
          if (!response.ok) throw new Error(`Erro Nominatim: ${response.statusText}`);
          const data = await response.json();
          if (data && data.address) {
            const address: NominatimAddress = data.address;
            setValue('rua', address.road || '', { shouldValidate: true });
            setValue('numero', address.house_number || '', { shouldValidate: true });
            setValue('bairro', address.suburb || '', { shouldValidate: true });
            setValue('cidade', address.city || address.town || address.village || '', { shouldValidate: true });
            const uf = mapearEstadoParaUF(address.state || '');
            setValue('estado', uf, { shouldValidate: true });
            setValue('cep', (address.postcode || '').replace(/\D/g,''), { shouldValidate: true });
            showToast.success("Endereço preenchido! Verifique os dados.");
            if (!uf && address.state) showToast.warning(`Estado "${address.state}" não mapeado para UF.`);
          } else { showToast.error("Não foi possível obter detalhes do endereço."); }
        } catch (err) {
            console.error("Erro ao buscar endereço via Nominatim:", err);
            showToast.error("Falha ao converter localização em endereço."); 
        }
        finally { setBuscandoLocalizacao(false); }
      },
      (error) => {
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
  };

  const renderEtapaEntrega = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">1. Método de Entrega</h3>
        <Controller name="opcaoEntrega" control={control} render={({ field }) => (
            <div className="space-y-3">
              <label className={`flex items-center p-4 border rounded-md cursor-pointer transition-all ${field.value === 'retirada' ? 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-sm' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'}`}>
                 <input type="radio" onChange={() => field.onChange('retirada')} checked={field.value === 'retirada'} className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 dark:border-gray-500 dark:bg-gray-600 dark:focus:ring-offset-gray-800" />
                 <div className="ml-3 flex-1 flex justify-between items-center">
                   <div><p className="font-medium text-gray-900 dark:text-gray-100">Retirada na Loja</p><p className="text-sm text-gray-600 dark:text-gray-400">Disponível em até 2 horas</p></div>
                   <span className="text-sm font-bold text-green-600 dark:text-green-400">Grátis</span>
                 </div> <Building className="w-5 h-5 ml-3 text-gray-400 dark:text-gray-500"/>
              </label>
              <label className={`flex items-center p-4 border rounded-md cursor-pointer transition-all ${field.value === 'entrega' ? 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-sm' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'}`}>
                 <input type="radio" onChange={() => field.onChange('entrega')} checked={field.value === 'entrega'} className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 dark:border-gray-500 dark:bg-gray-600 dark:focus:ring-offset-gray-800" />
                 <div className="ml-3 flex-1 flex justify-between items-center">
                   <div><p className="font-medium text-gray-900 dark:text-gray-100">Entrega</p><p className="text-sm text-gray-600 dark:text-gray-400">Receba em seu endereço</p></div>
                   <span className="text-sm font-bold text-green-600 dark:text-green-400">Grátis</span>
                 </div> <Truck className="w-5 h-5 ml-3 text-gray-400 dark:text-gray-500"/>
              </label>
            </div>
          )}
        />
      </div>

      <div>
        <label htmlFor="nome" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome Completo (para cobrança/cartão)</label>
        <input {...register('nome', { required: 'Nome é obrigatório' })} type="text" id="nome"
          disabled={isSubmitting || buscandoLocalizacao || processando}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-60 ${errors.nome ? 'border-red-500 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}`} />
        {errors.nome && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.nome.message}</p>}
      </div>

      {(opcaoEntrega === 'entrega' || metodoPagamento === 'boleto') && (
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">
            {metodoPagamento === 'boleto' && opcaoEntrega === 'retirada' ? '2. Endereço de Cobrança (Obrigatório para Boleto)' : '2. Endereço de Entrega'}
          </h3>
          {carregandoEnderecos ? (<LoadingSpinner size="sm" text="Carregando endereços..." />) : (
            <Controller name="enderecoSelecionadoId" control={control} rules={{ required: 'Selecione ou adicione um endereço' }} render={({ field }) => (
                <div className="space-y-3">
                  {enderecosCliente.map(end => (
                    <label key={end.id} className={`flex items-start p-4 border rounded-md cursor-pointer transition-all ${field.value === String(end.id) ? 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-sm' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'}`}>
                      <input type="radio" onChange={() => field.onChange(String(end.id))} checked={field.value === String(end.id)} className="h-4 w-4 mt-1 text-green-600 focus:ring-green-500 border-gray-300 dark:border-gray-500 dark:bg-gray-600 dark:focus:ring-offset-gray-800" />
                      <div className="ml-3 flex-1">
                        <p className="font-medium text-gray-900 dark:text-gray-100">{end.rua}, {end.numero}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{end.bairro}, {end.cidade} - {end.estado}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">CEP: {end.cep}</p>
                      </div>
                    </label>
                  ))}
                  <label className={`flex items-center p-4 border rounded-md cursor-pointer transition-all ${field.value === 'novo' ? 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-sm' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'}`}>
                    <input type="radio" onChange={() => field.onChange('novo')} checked={field.value === 'novo'} className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 dark:border-gray-500 dark:bg-gray-600 dark:focus:ring-offset-gray-800" />
                    <p className="ml-3 font-medium text-gray-900 dark:text-gray-100">Adicionar novo endereço</p>
                  </label>
                  {errors.enderecoSelecionadoId && field.value !== 'novo' && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.enderecoSelecionadoId.message}</p>}
                </div>
              )}
            />
          )}

          {mostrarFormNovoEndereco && (
            <div className="mt-4 space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-700/30 animate-fadeIn">
              <h4 className="font-medium text-gray-700 dark:text-gray-200">Detalhes do Novo Endereço</h4>
               <div className="mb-2">
                  <button type="button" onClick={buscarEnderecoAtual} disabled={buscandoLocalizacao || isSubmitting || processando}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors">
                    {buscandoLocalizacao ? ( <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Buscando...</> ) : ( <><MapPin className="w-4 h-4 mr-2" /> Usar Localização Atual</> )}
                  </button>
                  <p className="mt-1 text-xs text-center text-gray-500 dark:text-gray-400">Requer permissão. Pode não ser 100% preciso.</p>
               </div>
              <div>
                 <label htmlFor="cep-novo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CEP</label>
                 <input {...register('cep', { required: mostrarFormNovoEndereco ? 'CEP é obrigatório' : false })} type="text" id="cep-novo" disabled={isSubmitting || buscandoLocalizacao || processando} className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-60 ${errors.cep ? 'border-red-500 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}`} />
                 {errors.cep && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.cep.message}</p>}
              </div>
              <div>
                 <label htmlFor="rua-novo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rua / Avenida</label>
                 <input {...register('rua', { required: mostrarFormNovoEndereco ? 'Rua é obrigatória' : false })} type="text" id="rua-novo" disabled={isSubmitting || buscandoLocalizacao || processando} className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-60 ${errors.rua ? 'border-red-500 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}`} />
                 {errors.rua && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.rua.message}</p>}
              </div>
              <div className="grid grid-cols-3 gap-4">
                 <div className="col-span-1">
                   <label htmlFor="numero-novo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Número</label>
                   <input {...register('numero', { required: mostrarFormNovoEndereco ? 'Número é obrigatório' : false })} type="text" id="numero-novo" disabled={isSubmitting || buscandoLocalizacao || processando} className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-60 ${errors.numero ? 'border-red-500 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}`} />
                   {errors.numero && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.numero.message}</p>}
                 </div>
                 <div className="col-span-2">
                   <label htmlFor="complemento-novo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Complemento (Opcional)</label>
                   <input {...register('complemento')} type="text" id="complemento-novo" disabled={isSubmitting || buscandoLocalizacao || processando} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-60" />
                 </div>
              </div>
              <div>
                 <label htmlFor="bairro-novo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bairro</label>
                 <input {...register('bairro', { required: mostrarFormNovoEndereco ? 'Bairro é obrigatório' : false })} type="text" id="bairro-novo" disabled={isSubmitting || buscandoLocalizacao || processando} className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-60 ${errors.bairro ? 'border-red-500 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}`} />
                 {errors.bairro && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.bairro.message}</p>}
              </div>
              <div className="grid grid-cols-3 gap-4">
                 <div className="col-span-2">
                   <label htmlFor="cidade-novo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cidade</label>
                   <input {...register('cidade', { required: mostrarFormNovoEndereco ? 'Cidade é obrigatória' : false })} type="text" id="cidade-novo" disabled={isSubmitting || buscandoLocalizacao || processando} className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-60 ${errors.cidade ? 'border-red-500 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}`} />
                   {errors.cidade && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.cidade.message}</p>}
                 </div>
                 <div className="col-span-1">
                   <label htmlFor="estado-novo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estado (UF)</label>
                   <input {...register('estado', { required: mostrarFormNovoEndereco ? 'Estado é obrigatório' : false, maxLength: { value: 2, message: 'UF inválida' }, pattern: { value: /^[A-Z]{2}$/i, message: 'UF inválida'} })} type="text" id="estado-novo" maxLength={2} disabled={isSubmitting || buscandoLocalizacao || processando} className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 uppercase bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-60 ${errors.estado ? 'border-red-500 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}`} />
                   {errors.estado && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.estado.message || 'UF inválida'}</p>}
                 </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

   const renderEtapaPagamento = () => (
     <div className="space-y-6">
       <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">3. Forma de Pagamento</h3>
       <Controller name="metodoPagamento" control={control} render={({ field }) => (
           <div className="space-y-3">
             <label className={`flex items-center p-4 border rounded-md cursor-pointer transition-all ${field.value === 'cartao' ? 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-sm' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'}`}>
                <input type="radio" onChange={() => field.onChange('cartao')} checked={field.value === 'cartao'} className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 dark:border-gray-500 dark:bg-gray-600 dark:focus:ring-offset-gray-800" />
                <CreditCard className="w-5 h-5 ml-3 text-blue-500 dark:text-blue-400" /> <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">Cartão de Crédito/Débito</span>
             </label>
             <label className={`flex items-center p-4 border rounded-md cursor-pointer transition-all ${field.value === 'pix' ? 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-sm' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'}`}>
                <input type="radio" onChange={() => field.onChange('pix')} checked={field.value === 'pix'} className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 dark:border-gray-500 dark:bg-gray-600 dark:focus:ring-offset-gray-800" />
                <svg className="w-5 h-5 ml-3 text-green-700 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zM7.78 12.86a.5.5 0 01-.7.09L4.14 11a.5.5 0 11.7-.7l2.84 1.89a.5.5 0 01.1.61zm4.44-4.44a.5.5 0 01.7-.09l2.94 1.96a.5.5 0 11-.6.8l-2.94-1.96a.5.5 0 01-.1-.7zm-4.3 3.99l4.1-2.73a.5.5 0 11.6.8l-4.1 2.73a.5.5 0 11-.6-.8z"/></svg>
                <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">PIX</span>
             </label>
             <label className={`flex items-center p-4 border rounded-md cursor-pointer transition-all ${field.value === 'boleto' ? 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-sm' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'}`}>
                <input type="radio" onChange={() => field.onChange('boleto')} checked={field.value === 'boleto'} className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 dark:border-gray-500 dark:bg-gray-600 dark:focus:ring-offset-gray-800" />
                <svg className="w-5 h-5 ml-3 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 6h18M3 14h18M3 18h18" /></svg>
                <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">Boleto Bancário</span>
             </label>
           </div>
         )}
       />
       {metodoPagamento === 'cartao' && (
         <div className="mt-6 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-md border border-gray-200 dark:border-gray-700">
           <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-100 flex items-center"><CreditCard className="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400" /> Dados do Cartão</h4>
           <div className="p-3 border rounded-md bg-white dark:bg-gray-800 shadow-sm dark:border-gray-600">
             <CardElement options={{style: { base: { fontSize: '16px', color: '#333', '::placeholder': { color: '#aab7c4' },}, invalid: { color: '#ef4444', iconColor: '#ef4444' }, }, hidePostalCode: true }} />
           </div>
         </div>
       )}
       {metodoPagamento === 'pix' && (<div className="mt-6 bg-blue-50 dark:bg-blue-900/30 p-4 rounded-md border border-blue-200 dark:border-blue-700 text-center"><p className="text-sm text-blue-800 dark:text-blue-300">Ao finalizar, você receberá as instruções e o QR Code para pagamento via PIX.</p></div>)}
       {metodoPagamento === 'boleto' && (<div className="mt-6 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-md border border-gray-200 dark:border-gray-700 text-center"><p className="text-sm text-gray-700 dark:text-gray-300">O boleto será gerado. Um endereço de cobrança é obrigatório.</p></div>)}
     </div>
  );

   const getEnderecoConfirmacao = (): Endereco | null => {
        if (opcaoEntrega === 'retirada' && metodoPagamento !== 'boleto') return null;
        
        let enderecoEscolhido: Endereco | null = null;

        if (enderecoSelecionadoId === 'novo') {
            enderecoEscolhido = {
                id: 0, rua: getValues("rua"), numero: getValues("numero"), bairro: getValues("bairro"),
                cidade: getValues("cidade"), estado: getValues("estado"), cep: getValues("cep"),
                complemento: getValues("complemento") || undefined
            } as Endereco;
        } else {
             enderecoEscolhido = enderecosCliente.find(end => String(end.id) === enderecoSelecionadoId) || null;
        }
        
        if (!enderecoEscolhido && metodoPagamento === 'boleto') {
            enderecoEscolhido = enderecosCliente.length > 0 ? enderecosCliente[0] : null;
        }

        return enderecoEscolhido;
   }

   const renderEtapaConfirmacao = () => {
       const endereco = getEnderecoConfirmacao();
       const ehCobrancaApenas = (metodoPagamento === 'boleto' && opcaoEntrega === 'retirada');

       return (
         <div className="space-y-6">
           <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">4. Confirmar Pedido</h3>
           <div className="space-y-4">
             {endereco && (
               <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-md border dark:border-gray-700"><h4 className="font-semibold mb-2 flex items-center text-gray-700 dark:text-gray-200"><MapPin className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" /> {ehCobrancaApenas ? 'Endereço de Cobrança' : 'Endereço de Entrega'}</h4>
                 <p className="text-sm text-gray-800 dark:text-gray-100 font-medium">{getValues("nome")}</p>
                 <p className="text-sm text-gray-600 dark:text-gray-300">{`${endereco.rua}, ${endereco.numero}${endereco.complemento ? ' - '+endereco.complemento : ''}`}</p>
                 <p className="text-sm text-gray-600 dark:text-gray-300">{`${endereco.bairro}, ${endereco.cidade} - ${endereco.estado}`}</p>
                 <p className="text-sm text-gray-600 dark:text-gray-400">CEP: {endereco.cep}</p>
               </div>
             )}
             
             <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-md border dark:border-gray-700"><h4 className="font-semibold mb-2 flex items-center text-gray-700 dark:text-gray-200">{opcaoEntrega === 'retirada'? <Building className="w-5 h-5 mr-2 text-green-600 dark:text-green-400"/>: <Truck className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />} Método de Entrega</h4><p className="text-sm text-gray-800 dark:text-gray-100 capitalize">{opcaoEntrega}</p></div>
             
             <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-md border dark:border-gray-700"><h4 className="font-semibold mb-2 flex items-center text-gray-700 dark:text-gray-200"><CreditCard className="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400" /> Método de Pagamento</h4><p className="text-sm text-gray-800 dark:text-gray-100 capitalize">{metodoPagamento}</p>
                {metodoPagamento === 'cartao' && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Será cobrado no cartão informado.</p>}
                {metodoPagamento === 'pix' && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Instruções de pagamento serão exibidas após finalizar.</p>}
                {metodoPagamento === 'boleto' && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">O boleto será gerado com o endereço de cobrança informado.</p>}
             </div>
             
             <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                <div className="flex justify-between text-sm mb-1"><span className="text-gray-600 dark:text-gray-400">Subtotal Produtos</span><span className="font-medium text-gray-800 dark:text-gray-100">{formatCurrency(precoTotalCarrinho)}</span></div>
                <div className="flex justify-between text-sm mb-2"><span className="text-gray-600 dark:text-gray-400">Taxa de Entrega</span><span className="font-medium text-gray-800 dark:text-gray-100">{taxaEntrega > 0 ? formatCurrency(taxaEntrega) : 'Grátis'}</span></div>
                <div className="flex justify-between pt-2 border-t border-gray-100 dark:border-gray-600 mt-2"><span className="font-semibold text-lg text-gray-900 dark:text-gray-50">Valor Total</span><span className="font-bold text-lg text-green-700 dark:text-green-400">{formatCurrency(valorTotalFinal)}</span></div>
             </div>
             <div className="pt-4">
               <button type="submit" disabled={processando || valorTotalFinal <= 0} className={`w-full py-3 px-4 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-medium rounded-md transition-colors flex items-center justify-center shadow-sm disabled:opacity-50 disabled:cursor-not-allowed`}>
                 {processando ? (<LoadingSpinner size="sm" text="Processando..." />) : (<><Check className="w-5 h-5 mr-2" /> Finalizar Pedido</>)}
               </button>
             </div>
           </div>
         </div>
       );
    };

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col border dark:border-gray-700 transition-colors duration-300" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 px-6 py-4 border-b border-gray-200 dark:border-gray-700 rounded-t-lg flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Finalizar Pedido</h2>
          <button onClick={aoFechar} disabled={processando} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-50"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit(finalizarPedido)} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex items-center w-full mb-8">
             <div className="flex flex-col items-center"><div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold ${etapaAtual === 'entrega' || etapaAtual === 'pagamento' || etapaAtual === 'confirmacao' ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'}`}>1</div><div className="text-xs mt-1 text-center text-gray-600 dark:text-gray-400">Entrega</div></div>
             <div className={`flex-1 h-1 mx-2 rounded ${etapaAtual === 'pagamento' || etapaAtual === 'confirmacao' ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-600'}`}></div>
             <div className="flex flex-col items-center"><div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold ${etapaAtual === 'pagamento' || etapaAtual === 'confirmacao' ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'}`}>2</div><div className="text-xs mt-1 text-center text-gray-600 dark:text-gray-400">Pagamento</div></div>
             <div className={`flex-1 h-1 mx-2 rounded ${etapaAtual === 'confirmacao' ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-600'}`}></div>
             <div className="flex flex-col items-center"><div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold ${etapaAtual === 'confirmacao' ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'}`}>3</div><div className="text-xs mt-1 text-center text-gray-600 dark:text-gray-400">Confirmar</div></div>
          </div>
          {mensagemErro && (<div className="mb-4 bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 dark:border-red-600 text-red-800 dark:text-red-300 p-3 rounded text-sm shadow-sm">{mensagemErro}</div>)}
          <div style={{ display: etapaAtual === 'entrega' ? 'block' : 'none' }}>{renderEtapaEntrega()}</div>
          <div style={{ display: etapaAtual === 'pagamento' ? 'block' : 'none' }}>{renderEtapaPagamento()}</div>
          <div style={{ display: etapaAtual === 'confirmacao' ? 'block' : 'none' }}>{renderEtapaConfirmacao()}</div>
          {etapaAtual !== 'confirmacao' && (
             <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
               <button type="button" onClick={etapaAtual === 'pagamento' ? etapaAnterior : aoFechar} disabled={processando} className="px-4 py-2 text-gray-600 dark:text-gray-300 font-medium hover:text-gray-800 dark:hover:text-gray-100 transition-colors disabled:opacity-50">{etapaAtual === 'pagamento' ? 'Voltar (Entrega)' : 'Cancelar'}</button>
               <button type="button" onClick={proximaEtapa} disabled={processando} className="px-6 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-medium rounded-md transition-colors shadow-sm disabled:opacity-50">Continuar ({etapaAtual === 'entrega' ? 'Pagamento' : 'Confirmar'})</button>
             </div>
           )}
           {etapaAtual === 'confirmacao' && !processando && (
             <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-start">
               <button type="button" onClick={etapaAnterior} disabled={processando} className="px-4 py-2 text-gray-600 dark:text-gray-300 font-medium hover:text-gray-800 dark:hover:text-gray-100 transition-colors disabled:opacity-50">Voltar (Pagamento)</button>
             </div>
           )}
        </form>
      </div>
    </div>
  );
};

export default ModalPagamento;