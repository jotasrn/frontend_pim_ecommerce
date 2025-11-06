import React, { useState } from 'react';
import { usePedidos } from '../hooks/usePedidos';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { formatCurrency, formatDateTime, formatApiError } from '../utils/apiHelpers';
import { Venda } from '../types';
import { ShoppingBag, AlertCircle, Download, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { vendaService } from '../services/vendaService'; 
import { showToast } from '../utils/toastHelper';

const PaginaPedidos: React.FC = () => {
  const { pedidos, loading, error } = usePedidos();
  // Estado para controlar qual PDF está sendo baixado
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const renderStatus = (status: string) => {
    switch (status.toUpperCase()) {
      case 'AGUARDANDO_PAGAMENTO':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border border-orange-300 dark:border-orange-700">Aguardando Pagamento</span>;
      case 'PAGAMENTO_APROVADO':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-700">Pagamento Aprovado</span>;
      case 'PROCESSANDO':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-700">Em Separação</span>;
      case 'EM_ENTREGA':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-700">Em Entrega</span>;
      case 'CONCLUIDO':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-300 dark:border-green-700">Concluído</span>;
      case 'CANCELADO':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-700">Cancelado</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-600">{status}</span>;
    }
  };

  const handleBaixarComprovante = async (pedidoId: number) => {
    if (downloadingId === pedidoId) return;

    setDownloadingId(pedidoId);
    try {
      const pdfBlob = await vendaService.baixarComprovante(pedidoId);
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `comprovante_pedido_${pedidoId}.pdf`);

      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);

      window.URL.revokeObjectURL(url);

    } catch (err) {
      showToast.error(formatApiError(err) || "Falha ao baixar o comprovante.");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8">Meus Pedidos</h1>

      {loading && (
        <div className="flex justify-center items-center h-[30vh]">
          <LoadingSpinner text="A carregar histórico..." />
        </div>
      )}

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 dark:border-red-600 text-red-700 dark:text-red-300 p-4" role="alert">
          <div className="flex">
            <div className="py-1"><AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 mr-3" /></div>
            <div>
              <p className="font-bold">Erro ao carregar</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {!loading && !error && pedidos.length === 0 && (
        <div className="text-center py-10 bg-white dark:bg-gray-800 shadow rounded-lg border dark:border-gray-700">
          <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">Nenhum pedido encontrado</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Parece que você ainda não fez nenhuma compra.</p>
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 transition-colors"
            >
              Começar a comprar
            </Link>
          </div>
        </div>
      )}

      {!loading && !error && pedidos.length > 0 && (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden border dark:border-gray-700">
          <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
            {pedidos.map((pedido: Venda) => (
              <li key={pedido.id} className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                      Pedido #{pedido.id}
                    </p>
                    <p className="mt-1 text-lg font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(pedido.valorTotal)}
                    </p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Realizado em: {formatDateTime(pedido.dataHora)}
                    </p>
                  </div>
                  <div className="mt-4 sm:mt-0 sm:ml-6 flex-shrink-0">
                    {renderStatus(pedido.statusPedido)}
                  </div>
                </div>
                <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300">Itens:</h4>
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        {pedido.itens?.map(item => (
                          <li key={item.id} className="text-sm text-gray-500 dark:text-gray-400">
                            {item.quantidade}x {item.produto?.nome || 'Produto Indisponível'}
                          </li>
                        )) || (
                            <li className="text-sm text-gray-400 italic">Não foi possível carregar os itens.</li>
                          )}
                      </ul>
                    </div>

                    {(pedido.comprovanteUrl || pedido.statusPedido.toUpperCase() === 'PAGAMENTO_APROVADO') && (
                      <button
                        onClick={() => handleBaixarComprovante(pedido.id)}
                        disabled={downloadingId === pedido.id}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-wait"
                      >
                        {downloadingId === pedido.id ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Download className="w-4 h-4 mr-2" />
                        )}
                        Baixar Comprovante
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PaginaPedidos;