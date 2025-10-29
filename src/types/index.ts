// --- Tipos de Autenticação e Usuário ---

/**
 * Define as permissões de usuário possíveis no sistema.
 * Alinhado com as permissões do back-end (GERENTE, ENTREGADOR, CLIENTE).
 */
export type TipoUsuario = 'gerente' | 'entregador' | 'cliente';

/**
 * Interface principal para um Usuário.
 * Usada tanto no AuthContext quanto para dados de Cliente e Entregador.
 */
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

/**
 * Dados para criar/atualizar um usuário do painel administrativo.
 */
export type UsuarioData = {
  nomeCompleto: string;
  email: string;
  senha?: string;
  permissao: TipoUsuario;
  ativo: boolean;
};

/**
 * Define os dados necessários para o registo de um novo cliente.
 * Alinhado com o ClienteCadastroDTO do back-end.
 */
export interface RegistroRequest {
  nomeCompleto: string;
  email: string;
  senha: string;
  cpf: string;
  telefone: string;
}

// --- Tipos de Cliente e Endereço ---

/**
 * Dados específicos de um Cliente (associado a um Usuário).
 */
export interface Cliente {
  id: number;
  nome: string;
  email: string;
  totalPedidos: number;
  ultimoPedido: string;
  // Adicione outros campos se necessário (ex: telefone, cpf)
}

/**
 * Endereço de um cliente.
 */
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

/**
 * Interface principal para um Produto.
 * Alinhada 100% com o back-end Java.
 */
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

/**
 * Dados para criar/atualizar um produto no painel de gestão.
 */
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

/**
 * Representa um item dentro do carrinho de compras (Produto + quantidade).
 */
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
  
  // --- CAMPOS ADICIONADOS ---
  paymentIntentId?: string; 
  pixQrCodeData?: string; 
  pixQrCodeUrl?: string; 
  boletoUrl?: string;    
  boletoLinhaDigitavel?: string; 
}

export interface ItemVenda {
  id: number;
  produto: Produto;
  quantidade: number;
  precoUnitario: number;
}

/**
 * DTO (Objeto de Transferência de Dados) para enviar uma nova venda para a API.
 */
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
  produtos: Produto[];
}

export type PromocaoData = {
  descricao: string;
  percentualDesconto: number;
  dataInicio: string;
  dataFim: string;
  ativa: boolean;
  produtoIds: number[];
};

export interface Faq {
  id: number;
  pergunta: string;
  resposta: string;
  ativa: boolean;
}

export interface DuvidaResposta {
  id: number;
  resposta: string;
  dataResposta: string;
  gerente: Usuario; 
}

export interface Duvida {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  duvida: string;
  isPublica: boolean;
  status: string; 
  dataCriacao: string; 
  resposta: DuvidaResposta | null;
}

export interface DuvidaRequestDTO {
  titulo: string;
  email: string;
  pergunta: string;}