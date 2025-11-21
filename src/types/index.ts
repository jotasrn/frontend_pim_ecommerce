// --- Tipos de Autenticação e Usuário ---

export type TipoUsuario = 'gerente' | 'entregador' | 'cliente';

export interface Usuario {
  id: number;
  nome: string;
  nomeCompleto?: string;
  email: string;
  permissao: TipoUsuario;
  ativo?: boolean;
  cpf?: string;
  telefone?: string;
  googleId?: string;
}

export type UsuarioData = {
  nomeCompleto: string;
  email: string;
  senha?: string;
  permissao: TipoUsuario;
  ativo: boolean;
};

export interface RegistroRequest {
  nomeCompleto: string;
  email: string;
  senha: string;
  cpf: string;
  telefone: string;
}

// --- Tipos de Cliente e Endereço ---

export interface Cliente {
  id: number;
  nome: string;
  email: string;
  totalPedidos: number;
  ultimoPedido: string;
}


export interface Endereco {
  id: number;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  complemento?: string;
}

// --- Tipos de Produto e Categoria ---

export interface Categoria {
  id: number;
  nome: string;
  descricao?: string;
}

export interface Produto {
  id: number;
  nome: string;
  descricao?: string;
  precoCusto: number;
  precoVenda: number;
  dataValidade?: string;
  dataColheita?: string;
  tipoMedida: string;
  codigoBarras?: string;
  imagemUrl?: string;
  ativo: boolean;
  categoria?: Categoria;
  promocoes?: Promocao[];
}

export type ProdutoData = Omit<Produto, 'id' | 'precoVenda' | 'categoria' | 'promocoes'> & {
  categoria: {
    id: number;
  };
};

export interface FiltrosProdutos {
  nome?: string;
  categoriaId?: number;
}

// --- Tipos de Venda e Carrinho ---

export interface ItemCarrinho extends Produto {
  quantidade: number;
}

export interface Venda {
  id: number;
  dataHora: string;
  valorTotal: number;
  statusPedido: string;
  formaPagamento: string;
  enderecoEntrega: Endereco;
  itens: ItemVenda[];

  paymentIntentId?: string;
  pixQrCodeData?: string;
  pixQrCodeUrl?: string;
  boletoUrl?: string;
  boletoLinhaDigitavel?: string;
  comprovanteUrl?: string;
}

export interface ItemVenda {
  id: number;
  produto: Produto;
  quantidade: number;
  precoUnitario: number;
}

export interface VendaDTO {
  clienteId: number;
  formaPagamento: string;
  paymentMethodId?: string
  enderecoEntregaId?: number;
  itens: Array<{
    produtoId: number;
    quantidade: number;
  }>;
}

// --- Tipos de Promoção ---

export interface Promocao {
  id: number;
  descricao: string;
  percentualDesconto: number;
  dataInicio: string;
  dataFim: string;
  ativa: boolean;
  imagemUrl?: string;
  produtos: Produto[];
}

export type PromocaoData = {
  descricao: string;
  percentualDesconto: number;
  dataInicio: string;
  dataFim: string;
  ativa: boolean;
};

export interface FiltrosPromocoes {
  ativa?: boolean;
  data?: string;
}

export interface Faq {
  id: number;
  pergunta: string;
  resposta: string;
  categoria: string;
  ativa: boolean;
}

export interface DuvidaResposta {
  id: number;
  resposta: string;
  dataResposta: string;
  gerente: Usuario;
  createdAt?: string;
}

export interface Duvida {
  id: number;
  titulo: string;
  email: string;
  telefone: string;
  pergunta: string;
  isPublica: boolean;
  status: string;
  dataCriacao: string;
  createdAt?: string;
  resposta: DuvidaResposta | null;
}

export interface DuvidaRequestDTO {
  titulo: string;
  email: string;
  pergunta: string;
  isPublica: boolean;
}