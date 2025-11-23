"use client";
import React, { useState, useMemo } from 'react';
import { 
  FileText,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  User,
  Calendar,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Package,
  Hash,
  Search,
  X
} from 'lucide-react';

interface Project {
  _id: string;
  nameProject: string;
  packPrice: number;
}

interface Action {
  _id: string;
  actionNumber: number;
  price: number;
  status: string;
}

interface UserInfo {
  _id: string;
  firstName: string;
  lastName: string;
  telephone: string;
}

interface Transaction {
  _id: string;
  userId: UserInfo;
  projectIds: Project[];
  actions?: Action;
  amount: number;
  description: string;
  status?: 'confirmed' | 'pending' | 'failed';
  invoiceToken: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface TransactionResponse {
  message: string;
  total: number;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    telephone: string;
  };
  transactions: Transaction[];
}

interface TransactionsViewProps {
  transactions: TransactionResponse;
}

const TransactionsAdaptedViewBYAdmin: React.FC<TransactionsViewProps> = ({ 
  transactions: transactionData
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'actions' | 'dividendes'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchType, setSearchType] = useState<'numero' | 'nom' | 'utilisateur' | 'telephone'>('numero');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const transactions = transactionData?.transactions || [];
  const user_info = transactionData?.user;

  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'failed':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'confirmed':
        return 'Complétée';
      case 'pending':
        return 'En attente';
      case 'failed':
        return 'Échouée';
      default:
        return 'En attente';
    }
  };

  const getTransactionType = (transaction: Transaction): 'actions' | 'dividendes' => {
    return transaction.actions ? 'actions' : 'dividendes';
  };

  const matchesSearch = (transaction: Transaction): boolean => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase().trim();

    if (searchType === 'numero') {
      // Recherche par numéro d'action
      if (transaction.actions) {
        return transaction.actions.actionNumber.toString().includes(query);
      }
      return false;
    } else if (searchType === 'nom') {
      // Recherche par nom de projet
      if (transaction.projectIds && transaction.projectIds.length > 0) {
        return transaction.projectIds.some(project => 
          project.nameProject.toLowerCase().includes(query)
        );
      }
      return false;
    } else if (searchType === 'utilisateur') {
      // Recherche par nom d'utilisateur (prénom ou nom)
      const fullName = `${transaction.userId.firstName} ${transaction.userId.lastName}`.toLowerCase();
      return fullName.includes(query);
    } else if (searchType === 'telephone') {
      // Recherche par numéro de téléphone
      return transaction.userId.telephone.toLowerCase().includes(query);
    }
    
    return false;
  };

  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = transactions.filter(transaction => {
      if (statusFilter !== 'all' && (transaction.status || 'pending') !== statusFilter) {
        return false;
      }

      if (typeFilter !== 'all') {
        const transactionType = getTransactionType(transaction);
        if (transactionType !== typeFilter) {
          return false;
        }
      }

      if (!matchesSearch(transaction)) {
        return false;
      }

      return true;
    });

    return filtered.sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'date') {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === 'amount') {
        comparison = a.amount - b.amount;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });
  }, [transactions, statusFilter, typeFilter, sortBy, sortOrder, searchQuery, searchType]);

  const paginationData = useMemo(() => {
    const totalItems = filteredAndSortedTransactions.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredAndSortedTransactions.slice(startIndex, endIndex);

    return {
      totalItems,
      totalPages,
      startIndex,
      endIndex,
      currentItems,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1
    };
  }, [filteredAndSortedTransactions, currentPage, itemsPerPage]);

  const stats = useMemo(() => {
    const actionsTransactions = transactions.filter(t => getTransactionType(t) === 'actions');
    const dividendesTransactions = transactions.filter(t => getTransactionType(t) === 'dividendes');

    return {
      total: transactions.length,
      completed: transactions.filter(t => t.status === 'confirmed').length,
      pending: transactions.filter(t => !t.status || t.status === 'pending').length,
      failed: transactions.filter(t => t.status === 'failed').length,
      totalAmount: transactions
        .filter(t => t.status === 'confirmed')
        .reduce((sum, t) => sum + t.amount, 0),
      actionsCount: actionsTransactions.length,
      dividendesCount: dividendesTransactions.length,
      actionsAmount: actionsTransactions
        .filter(t => t.status === 'confirmed')
        .reduce((sum, t) => sum + t.amount, 0),
      dividendesAmount: dividendesTransactions
        .filter(t => t.status === 'confirmed')
        .reduce((sum, t) => sum + t.amount, 0)
    };
  }, [transactions]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  const handleFilterChange = (filter: string) => {
    setStatusFilter(filter);
    setCurrentPage(1);
  };

  const handleTypeFilterChange = (type: 'all' | 'actions' | 'dividendes') => {
    setTypeFilter(type);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Date', 'Type', 'ID Transaction', 'Utilisateur', 'Téléphone', 'Projets', 'Actions', 'Montant', 'Statut', 'Token'].join(','),
      ...filteredAndSortedTransactions.map(t => [
        new Date(t.createdAt).toLocaleDateString('fr-FR'),
        getTransactionType(t) === 'actions' ? 'Actions' : 'Dividendes',
        t._id,
        `"${t.userId.firstName} ${t.userId.lastName}"`,
        t.userId.telephone,
        `"${t.projectIds.map(p => p.nameProject).join(', ')}"`,
        t.actions ? `${t.actions.actionNumber}` : 'N/A',
        t.amount,
        getStatusLabel(t.status),
        t.invoiceToken
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const getPageNumbers = () => {
    const { totalPages } = paginationData;
    const delta = 2;
    const pages: (number | string)[] = [];

    pages.push(1);

    const start = Math.max(2, currentPage - delta);
    const end = Math.min(totalPages - 1, currentPage + delta);

    if (start > 2) {
      pages.push('...');
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) {
      pages.push('...');
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-blue-600 flex items-center">
          <Package className="w-8 h-8 mr-3" />
          Mes Transactions
        </h1>
        <p className="text-gray-600 mt-1">
          {user_info ? (
            `Bonjour ${user_info.firstName} ${user_info.lastName}, voici l'historique de vos transactions`
          ) : (
            'Voici l\'historique de vos transactions'
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-blue-100">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-green-100">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Complétées</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-purple-100">
              <Hash className="w-5 h-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Actions</p>
              <p className="text-xl font-bold text-purple-600">{stats.actionsCount}</p>
              <p className="text-xs text-gray-500">{formatAmount(stats.actionsAmount)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-indigo-100">
              <Package className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Dividendes</p>
              <p className="text-xl font-bold text-indigo-600">{stats.dividendesCount}</p>
              <p className="text-xs text-gray-500">{formatAmount(stats.dividendesAmount)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-green-100">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Montant Total</p>
              <p className="text-lg font-bold text-green-600">{formatAmount(stats.totalAmount)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center">
                <Filter className="w-4 h-4 text-gray-500 mr-2" />
                <label className="text-sm font-medium text-gray-700 mr-2">Statut:</label>
                <select
                  value={statusFilter}
                  onChange={(e) => handleFilterChange(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Tous</option>
                  <option value="confirmed">Complétées</option>
                  <option value="pending">En attente</option>
                  <option value="failed">Échouées</option>
                </select>
              </div>

              <div className="flex items-center">
                <label className="text-sm font-medium text-gray-700 mr-2">Type:</label>
                <select
                  value={typeFilter}
                  onChange={(e) => handleTypeFilterChange(e.target.value as 'all' | 'actions' | 'dividendes')}
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Tous types</option>
                  <option value="actions">Actions</option>
                  <option value="dividendes">Dividendes</option>
                </select>
              </div>

              <div className="flex items-center">
                <label className="text-sm font-medium text-gray-700 mr-2">Trier par:</label>
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [newSortBy, newSortOrder] = e.target.value.split('-');
                    setSortBy(newSortBy as 'date' | 'amount');
                    setSortOrder(newSortOrder as 'asc' | 'desc');
                    setCurrentPage(1);
                  }}
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="date-desc">Date (récent)</option>
                  <option value="date-asc">Date (ancien)</option>
                  <option value="amount-desc">Montant (élevé)</option>
                  <option value="amount-asc">Montant (faible)</option>
                </select>
              </div>

              <div className="flex items-center">
                <label className="text-sm font-medium text-gray-700 mr-2">Par page:</label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            <button
              onClick={exportToCSV}
              disabled={filteredAndSortedTransactions.length === 0}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4 mr-2" />
              Exporter CSV
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="flex items-center">
              <Search className="w-4 h-4 text-gray-500 mr-2" />
              <label className="text-sm font-medium text-gray-700 mr-2">Rechercher par:</label>
              <select
                value={searchType}
                onChange={(e) => {
                  setSearchType(e.target.value as 'numero' | 'nom' | 'utilisateur' | 'telephone');
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="numero">Numéro d'action</option>
                <option value="nom">Nom de projet</option>
                <option value="utilisateur">Nom d'utilisateur</option>
                <option value="telephone">Numéro de téléphone</option>
              </select>
            </div>

            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={
                  searchType === 'numero' ? "Ex: 100, 250..." : 
                  searchType === 'nom' ? "Ex: Projet Alpha..." :
                  searchType === 'utilisateur' ? "Ex: Jean Dupont..." :
                  "Ex: +221 77 123 45 67..."
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {(statusFilter !== 'all' || typeFilter !== 'all' || searchQuery) && (
            <div className="mt-3 flex items-center gap-2 text-sm flex-wrap">
              <span className="text-gray-600">Filtres actifs:</span>
              {statusFilter !== 'all' && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                  Statut: {getStatusLabel(statusFilter)}
                </span>
              )}
              {typeFilter !== 'all' && (
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                  Type: {typeFilter === 'actions' ? 'Actions' : 'Dividendes'}
                </span>
              )}
              {searchQuery && (
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">
                  Recherche: {searchQuery}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="p-4">
          {paginationData.currentItems.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Aucune transaction trouvée
              </h3>
              <p className="text-gray-500">
                {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
                  ? 'Essayez de modifier vos filtres de recherche.'
                  : 'Vous n\'avez encore effectué aucune transaction.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {paginationData.currentItems.map((transaction) => {
                const transactionType = getTransactionType(transaction);
                return (
                  <div key={transaction._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        {getStatusIcon(transaction.status)}
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(transaction.status)}`}>
                          {getStatusLabel(transaction.status)}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                          transactionType === 'actions' 
                            ? 'bg-purple-50 text-purple-700 border-purple-200' 
                            : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        }`}>
                          {transactionType === 'actions' ? '📊 Actions' : '💰 Dividendes'}
                        </span>
                      </div>
                      <span className="text-2xl font-bold text-gray-900">
                        {formatAmount(transaction.amount)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{transaction.description}</p>
                    
                    {transaction.projectIds && transaction.projectIds.length > 0 && (
                      <div className="bg-white rounded-lg p-3 mb-3 border border-blue-100">
                        <h5 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                          <Package className="w-4 h-4 mr-2 text-blue-600" />
                          Projet(s) associé(s):
                        </h5>
                        <div className="space-y-2">
                          {transaction.projectIds.map((project) => (
                            <div key={project._id} className="flex items-center justify-between text-sm bg-blue-50 p-2 rounded">
                              <span className="font-medium text-blue-900">{project.nameProject}</span>
                              <span className="text-blue-700 font-semibold">{formatAmount(project.packPrice)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {transaction.actions && (
                      <div className="bg-white rounded-lg p-3 mb-3 border border-green-100">
                        <h5 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                          <Hash className="w-4 h-4 mr-2 text-green-600" />
                          Action associée:
                        </h5>
                        <div className="flex items-center justify-between bg-green-50 p-2 rounded">
                          <div className="flex items-center space-x-3">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                              #{transaction.actions.actionNumber} {transaction.actions.actionNumber > 1 ? 'actions' : 'action'}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(transaction.actions.status)}`}>
                              {getStatusLabel(transaction.actions.status)}
                            </span>
                          </div>
                          <span className="text-green-700 font-semibold">{formatAmount(transaction.actions.price)}</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="font-medium mr-2">Utilisateur:</span>
                        <span>{transaction.userId?.firstName} {transaction.userId?.lastName}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium mr-2">Téléphone:</span>
                        <span>{transaction.userId?.telephone}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="font-medium mr-2">Date:</span>
                        <span>{formatDate(transaction.createdAt)}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium mr-2">Token:</span>
                        <span className="font-mono text-xs bg-gray-200 px-2 py-1 rounded">{transaction.invoiceToken}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {paginationData.totalPages > 1 && (
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-600">
                Affichage de {paginationData.startIndex + 1} à {Math.min(paginationData.endIndex, paginationData.totalItems)} sur {paginationData.totalItems} transaction(s)
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={!paginationData.hasPrevPage}
                  className="p-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!paginationData.hasPrevPage}
                  className="p-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center space-x-1">
                  {getPageNumbers().map((page, index) => (
                    page === '...' ? (
                      <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-400">...</span>
                    ) : (
                      <button
                        key={`page-${page}`}
                        onClick={() => handlePageChange(page as number)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!paginationData.hasNextPage}
                  className="p-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handlePageChange(paginationData.totalPages)}
                  disabled={!paginationData.hasNextPage}
                  className="p-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {paginationData.totalPages <= 1 && paginationData.currentItems.length > 0 && (
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <div>
                Affichage de {paginationData.totalItems} transaction(s)
              </div>
              <div className="font-medium">
                Total montant complété: {formatAmount(
                  filteredAndSortedTransactions
                    .filter(t => t.status === 'confirmed')
                    .reduce((sum, t) => sum + t.amount, 0)
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsAdaptedViewBYAdmin;