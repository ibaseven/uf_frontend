"use client";
import React, { useState, useTransition, useMemo, useEffect } from 'react';
import { 
  Share, 
  DollarSign, 
  Users, 
  UserCheck, 
  UserX,
  UserPlus,
  Calendar, 
  RefreshCw,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Download,
  FileText,
  Edit3,
  X,
  Save,
  User,
  Phone,
  Mail,
  Menu,
  ChevronDown,
  Trash2,
  UserMinus,
  MapPin,
  Globe,
  CreditCard,
  Cake,
  Shield,
  Settings
} from 'lucide-react';

import { useRouter } from 'next/navigation';
import ActionnairesList from './ActionnairesList';
import { updateUserInfo, deleteUser } from '@/actions/actionnaires';

// Types
interface Actionnaire {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  telephone: string;
  actionsNumber: number;
  dividende: number;
  isBlocked: boolean;
  role: string;
  createdAt: string;
  updatedAt?: string;
  adresse?: string;
  ville?: string;
  pays?: string;
  nationalite?: string;
  cni?: string;
  dateNaissance?: string;
}

interface Statistiques {
  nombre_total_actionnaires: number;
  actionnaires_actifs: number;
  actionnaires_bloques: number;
  total_actions: number;
  total_dividendes: number;
}

interface ActionnairesAdminViewProps {
  actionnaires: Actionnaire[];
  statistiques: Statistiques;
}

interface EditForm {
  firstName: string;
  lastName: string;
  telephone: string;
  dividende: number;
  actionsNumber:number;
  adresse: string;
  ville: string;
  pays: string;
  nationalite: string;
  cni: string;
  dateNaissance: string;
}

interface Message {
  type: 'success' | 'error';
  text: string;
}

const ActionnairesAdminView: React.FC<ActionnairesAdminViewProps> = ({ 
  actionnaires, 
  statistiques
}) => {
  const router = useRouter();
  
  // States
  const [filter, setFilter] = useState<'all' | 'active' | 'blocked'>('all');
  const [message, setMessage] = useState<Message | null>(null);
  const [isPending, startTransition] = useTransition();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<Actionnaire | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({
    firstName: '',
    lastName: '',
    telephone: '',
    dividende: 0,
    adresse: '',
    ville: '',
    pays: '',
    nationalite: '',
    cni: '',
    dateNaissance: '',
    actionsNumber:0,
  });
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'single' | 'multiple', userId?: string, userName?: string } | null>(null);

  // Fonction pour formater les montants
  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Fonction pour formater le nombre d'actions
  const formatActions = (actions: number): string => {
    return new Intl.NumberFormat('fr-FR').format(actions);
  };

  // Fonction pour formater les dates
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Fonctions pour la gestion de la sélection
  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAllUsers = () => {
    const allUserIds = filteredActionnaires.map(user => user.id);
    setSelectedUsers(allUserIds);
  };

  const clearSelection = () => {
    setSelectedUsers([]);
    setIsSelectionMode(false);
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    if (isSelectionMode) {
      setSelectedUsers([]);
    }
  };

  // Fonction pour demander confirmation de suppression
  const requestDeleteConfirmation = (type: 'single' | 'multiple', userId?: string, userName?: string) => {
    setDeleteTarget({ type, userId, userName });
    setShowDeleteConfirm(true);
  };

  // Fonction pour supprimer un utilisateur unique
  const handleDeleteUser = async (userId: string, userName: string) => {
    requestDeleteConfirmation('single', userId, userName);
  };

const confirmDelete = async () => {
  if (!deleteTarget || deleteTarget.type !== 'single' || !deleteTarget.userId) return;

  startTransition(async () => {
    try {
      const result = await deleteUser({ userId: deleteTarget.userId });

      if (result.type === 'success') {
        setMessage({ 
          type: 'success', 
          text: `${deleteTarget.userName} a été supprimé avec succès` 
        });
        setTimeout(() => {
          router.refresh();
        }, 1000);
      } else {
        setMessage({ 
          type: 'error', 
          text: result.message || 'Erreur lors de la suppression' 
        });
      }
    } catch (error) {
      console.error('Erreur suppression:', error);
      setMessage({ 
        type: 'error', 
        text: 'Une erreur est survenue lors de la suppression' 
      });
    } finally {
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
    }
  });
};
  // Annuler la suppression
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteTarget(null);
  };

  

  // Ouvrir le modal d'édition
  const handleEditUser = (actionnaire: Actionnaire) => {
    setEditingUser(actionnaire);
    setEditForm({
      firstName: actionnaire.firstName || '',
      lastName: actionnaire.lastName || '',
      telephone: actionnaire.telephone || '',
      dividende: actionnaire.dividende || 0,
      adresse: actionnaire.adresse || '',
      ville: actionnaire.ville || '',
      pays: actionnaire.pays || '',
      nationalite: actionnaire.nationalite || '',
      cni: actionnaire.cni || '',
      dateNaissance: actionnaire.dateNaissance || '',
      actionsNumber:actionnaire.actionsNumber
    });
    setEditErrors({});
    setShowEditModal(true);
  };

  // Fermer le modal d'édition
  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingUser(null);
    setEditForm({
      firstName: '',
      lastName: '',
      telephone: '',
      dividende: 0,
      adresse: '',
      ville: '',
      pays: '',
      nationalite: '',
      cni: '',
      dateNaissance: '',
      actionsNumber:0
    });
    setEditErrors({});
  };

  // Gérer les changements dans le formulaire d'édition
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    setEditForm(prev => ({
      ...prev,
      [name]: type === 'number' 
        ? (value === '' ? 0 : parseFloat(value))
        : value || ''
    }));
    
    // Supprimer l'erreur pour ce champ
    if (editErrors[name]) {
      setEditErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Valider le formulaire d'édition
  const validateEditForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!editForm.firstName || !editForm.firstName.trim()) {
      errors.firstName = 'Le prénom est requis';
    }
    if (!editForm.lastName || !editForm.lastName.trim()) {
      errors.lastName = 'Le nom est requis';
    }
    if (!editForm.telephone || !editForm.telephone.trim()) {
      errors.telephone = 'Le téléphone est requis';
    } else if (!/^[+]?[\d\s-()]+$/.test(editForm.telephone.trim())) {
      errors.telephone = 'Format de téléphone invalide';
    }
    if (editForm.dividende < 0) {
      errors.dividende = 'Le dividende ne peut pas être négatif';
    }

    setEditErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Sauvegarder les modifications
  const handleSaveUser = async () => {
    if (!editingUser) return;

    // Validation côté client
    if (!validateEditForm()) {
      return;
    }

    startTransition(async () => {
      try {
        // Construire les données à envoyer avec TOUS les champs
        const dataToSend: any = {
          userId: editingUser._id,
          firstName: editForm.firstName.trim(),
          lastName: editForm.lastName.trim(),
          telephone: editForm.telephone.trim(),
          adresse: editForm.adresse.trim() || undefined,
          ville: editForm.ville.trim() || undefined,
          pays: editForm.pays.trim() || undefined,
          nationalite: editForm.nationalite.trim() || undefined,
          cni: editForm.cni.trim() || undefined,
          dateNaissance: editForm.dateNaissance || undefined,
          actionsNumber:editForm.actionsNumber,
        };

        // Vérifier si dividende a changé
        const dividendeChanged = editForm.dividende !== editingUser.dividende;

        // Si dividende a changé, l'inclure dans l'envoi
        if (dividendeChanged) {
          dataToSend.dividende = editForm.dividende;
        }

        const result = await updateUserInfo(dataToSend);
//console.log(result);

        if (result.type === 'success') {
          setMessage({ type: 'success', text: result.message || 'Mise à jour réussie' });
          closeEditModal();
          router.refresh();
        } else {
          if (result.errors) {
            setEditErrors(result.errors);
          } else {
            setMessage({ type: 'error', text: result.message || 'Erreur lors de la mise à jour' });
          }
        }
      } catch (error) {
        console.error('Erreur mise à jour:', error);
        setMessage({ type: 'error', text: 'Erreur lors de la mise à jour' });
      }
    });
  };

  // Filtrer les actionnaires selon le filtre sélectionné
  const filteredActionnaires = useMemo(() => {
    return actionnaires.filter(actionnaire => {
      if (filter === 'active') return !actionnaire.isBlocked;
      if (filter === 'blocked') return actionnaire.isBlocked;
      return true;
    });
  }, [actionnaires, filter]);

  // Calculer les statistiques filtrées
  const filteredStats = useMemo(() => {
    const totalActions = filteredActionnaires.reduce((sum, a) => sum + (a.actionsNumber || 0), 0);
    const totalDividendes = filteredActionnaires.reduce((sum, a) => sum + (a.dividende || 0), 0);
    const moyenneDividende = filteredActionnaires.length > 0 ? totalDividendes / filteredActionnaires.length : 0;

    return {
      totalActions,
      totalDividendes,
      moyenneDividende
    };
  }, [filteredActionnaires]);

  // Auto-hide message après 5 secondes
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Exporter en CSV
  const handleExportCSV = () => {
    try {
      const dataToExport = filter === 'all' ? actionnaires : filteredActionnaires;
      
      const headers = ['Prénom', 'Nom', 'Téléphone', 'Email', 'Actions', 'Dividende', 'Statut', 'Date création'];
      const csvContent = [
        headers.join(','),
        ...dataToExport.map(a => [
          a.firstName,
          a.lastName,
          a.telephone,
          a.email || '',
          a.actionsNumber,
          a.dividende,
          a.isBlocked ? 'Bloqué' : 'Actif',
          formatDate(a.createdAt)
        ].join(','))
      ].join('\n');

      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `actionnaires_${filter}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setMessage({ type: 'success', text: 'Export CSV réussi' });
    } catch (error) {
      console.error('Erreur export CSV:', error);
      setMessage({ type: 'error', text: 'Erreur lors de l\'export CSV' });
    }
  };

  return (
    <div className="p-3 sm:p-4 lg:p-6 bg-gray-50 min-h-screen">
      {/* Message de notification */}
      {message && (
        <div className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-100 border border-green-400 text-green-700' 
            : 'bg-red-100 border border-red-400 text-red-700'
        }`}>
          <div className="flex items-center">
            {message.type === 'success' ? (
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
            )}
            <span className="text-sm sm:text-base">{message.text}</span>
            <button 
              onClick={() => setMessage(null)}
              className="ml-auto text-current hover:opacity-70"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-600">Gestion des Actionnaires</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Administration et suivi des actions</p>
          </div>
          
          {/* Mobile menu button */}
          <div className="sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              <Menu className="w-4 h-4 mr-2" />
              Actions
              <ChevronDown className={`w-4 h-4 ml-1 transform transition-transform ${isMobileMenuOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Desktop buttons */}
          {/* <div className="hidden sm:flex space-x-3">
            <button
              onClick={toggleSelectionMode}
              disabled={isPending}
              className={`flex items-center px-3 lg:px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm ${
                isSelectionMode 
                  ? 'bg-gray-600 text-white hover:bg-gray-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <UserMinus className="w-4 h-4 mr-2" />
              <span className="hidden lg:inline">
                {isSelectionMode ? 'Annuler sélection' : 'Sélection multiple'}
              </span>
              <span className="lg:hidden">
                {isSelectionMode ? 'Annuler' : 'Sélection'}
              </span>
            </button>
          </div> */}
        </div>

        {/* Mobile action buttons */}
        {isMobileMenuOpen && (
          <div className="mt-4 sm:hidden space-y-2">
            <button
              onClick={() => {
                toggleSelectionMode();
                setIsMobileMenuOpen(false);
              }}
              disabled={isPending}
              className={`w-full flex items-center px-4 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                isSelectionMode 
                  ? 'bg-gray-600 text-white hover:bg-gray-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <UserMinus className="w-4 h-4 mr-3" />
              {isSelectionMode ? 'Annuler sélection' : 'Sélection multiple'}
            </button>
          </div>
        )}
      </div>

      {/* Barre de sélection multiple */}
      {isSelectionMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-blue-800">
                Mode sélection activé - {selectedUsers.length} utilisateur(s) sélectionné(s)
              </span>
              {filteredActionnaires.length > 0 && (
                <button
                  onClick={selectAllUsers}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  Tout sélectionner ({filteredActionnaires.length})
                </button>
              )}
            </div>
            
           {/*  <div className="flex space-x-2">
              {selectedUsers.length > 0 && (
                <button
                  onClick={handleDeleteMultipleUsers}
                  disabled={isPending}
                  className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer ({selectedUsers.length})
                </button>
              )}
              <button
                onClick={clearSelection}
                disabled={isPending}
                className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                <X className="w-4 h-4 mr-2" />
                Annuler
              </button>
            </div> */}
          </div>
        </div>
      )}

      {/* Statistiques */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
        <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 rounded-full bg-blue-100">
              <Users className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <div className="ml-2 sm:ml-4 min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{statistiques.nombre_total_actionnaires}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 rounded-full bg-green-100">
              <UserCheck className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
            </div>
            <div className="ml-2 sm:ml-4 min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Actifs</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{statistiques.actionnaires_actifs}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 rounded-full bg-red-100">
              <UserX className="w-4 h-4 sm:w-6 sm:h-6 text-red-600" />
            </div>
            <div className="ml-2 sm:ml-4 min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Bloqués</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{statistiques.actionnaires_bloques}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6 col-span-2 lg:col-span-1">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 rounded-full bg-yellow-100">
              <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-600" />
            </div>
            <div className="ml-2 sm:ml-4 min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Dividendes</p>
              <p className="text-sm sm:text-2xl font-bold text-gray-900 truncate">{formatAmount(statistiques.total_dividendes)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow p-3 sm:p-4 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm ${
                filter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tous ({statistiques.nombre_total_actionnaires})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm ${
                filter === 'active' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Actifs ({statistiques.actionnaires_actifs})
            </button>
            <button
              onClick={() => setFilter('blocked')}
              className={`px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm ${
                filter === 'blocked' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Bloqués ({statistiques.actionnaires_bloques})
            </button>
          </div>

          {filter !== 'all' && (
            <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-lg">
              <AlertCircle className="w-4 h-4 mr-2" />
              <span>
                Affichage de {filteredActionnaires.length} 
                {filter === 'active' ? ' actionnaire(s) actif(s)' : ' actionnaire(s) bloqué(s)'}
              </span>
              <button
                onClick={() => setFilter('all')}
                className="ml-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                Voir tous
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Liste des actionnaires */}
      <ActionnairesList
        actionnaires={filteredActionnaires}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
        isPending={isPending}
        formatAmount={formatAmount}
        formatActions={formatActions}
        formatDate={formatDate}
        currentFilter={filter}
        isSelectionMode={isSelectionMode}
        selectedUsers={selectedUsers}
        onToggleUserSelection={toggleUserSelection}
      />
{/* Modal de confirmation de suppression */}
{showDeleteConfirm && deleteTarget && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg w-full max-w-md">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="p-3 rounded-full bg-red-100">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="ml-3 text-lg font-bold text-gray-900">
            Confirmer la suppression
          </h3>
        </div>
        
        <p className="text-gray-600 mb-6">
          Êtes-vous sûr de vouloir supprimer <span className="font-semibold">{deleteTarget.userName || 'cet utilisateur'}</span> ? Cette action est irréversible.
        </p>

        <div className="flex space-x-3">
          <button
            onClick={cancelDelete}
            disabled={isPending}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={confirmDelete}
            disabled={isPending}
            className="flex-1 flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isPending ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Suppression...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  </div>
)}

      {/* Modal d'édition - VERSION COMPLÈTE */}
   {showEditModal && editingUser && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
      <div className="p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            Modifier l'actionnaire
          </h2>
          <button 
            onClick={closeEditModal}
            disabled={isPending}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Section: Informations Personnelles */}
          <div>
            <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              Informations Personnelles
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Prénom */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prénom <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    name="firstName"
                    value={editForm.firstName}
                    onChange={handleEditInputChange}
                    disabled={isPending}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
                      editErrors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Entrez le prénom"
                  />
                </div>
                {editErrors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{editErrors.firstName}</p>
                )}
              </div>

              {/* Nom */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    name="lastName"
                    value={editForm.lastName}
                    onChange={handleEditInputChange}
                    disabled={isPending}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
                      editErrors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Entrez le nom"
                  />
                </div>
                {editErrors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{editErrors.lastName}</p>
                )}
              </div>

              {/* Téléphone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="tel"
                    name="telephone"
                    value={editForm.telephone}
                    onChange={handleEditInputChange}
                    disabled={isPending}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
                      editErrors.telephone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+221 77 123 45 67"
                  />
                </div>
                {editErrors.telephone && (
                  <p className="text-red-500 text-xs mt-1">{editErrors.telephone}</p>
                )}
              </div>

              {/* Date de naissance */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de naissance
                </label>
                <div className="relative">
                  <Cake className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="date"
                    name="dateNaissance"
                    value={editForm.dateNaissance}
                    onChange={handleEditInputChange}
                    disabled={isPending}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Identité */}
          <div>
            <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
              Identité
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* CNI */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CNI / Passeport
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    name="cni"
                    value={editForm.cni}
                    onChange={handleEditInputChange}
                    disabled={isPending}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Numéro CNI/Passeport"
                  />
                </div>
              </div>

              {/* Nationalité */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nationalité
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    name="nationalite"
                    value={editForm.nationalite}
                    onChange={handleEditInputChange}
                    disabled={isPending}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Ex: Sénégalaise"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Localisation */}
          <div>
            <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-blue-600" />
              Localisation
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {/* Adresse */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    name="adresse"
                    value={editForm.adresse}
                    onChange={handleEditInputChange}
                    disabled={isPending}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Ex: Rue 10, Quartier Médina"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Ville */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ville
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      name="ville"
                      value={editForm.ville}
                      onChange={handleEditInputChange}
                      disabled={isPending}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="Ex: Dakar"
                    />
                  </div>
                </div>

                {/* Pays */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pays
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      name="pays"
                      value={editForm.pays}
                      onChange={handleEditInputChange}
                      disabled={isPending}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="Ex: Sénégal"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Finances */}
          <div>
            <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
              Finances
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Dividende */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dividende (XOF)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="number"
                    name="dividende"
                    value={editForm.dividende}
                    onChange={handleEditInputChange}
                    disabled={isPending}
                    min="0"
                    step="0.01"
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
                      editErrors.dividende ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0"
                  />
                </div>
                {editErrors.dividende && (
                  <p className="text-red-500 text-xs mt-1">{editErrors.dividende}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section: Informations du compte - MAINTENANT MODIFIABLE */}
          <div>
            <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-blue-600" />
              Informations du compte
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Email */}
            

              {/* Nombre d'actions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre d'actions <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="number"
                    name="actionsNumber"
                    value={editForm.actionsNumber}
                    onChange={handleEditInputChange}
                    disabled={isPending}
                    min="0"
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
                      editErrors.actionsNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0"
                  />
                </div>
                {editErrors.actionsNumber && (
                  <p className="text-red-500 text-xs mt-1">{editErrors.actionsNumber}</p>
                )}
              </div>

          

              {/* Date de création - Lecture seule mais visible */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de création
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={formatDate(editingUser.createdAt)}
                    disabled
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Ce champ ne peut pas être modifié</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={closeEditModal}
            disabled={isPending}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSaveUser}
            disabled={isPending}
            className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="w-4 h-4 mr-2" />
            {isPending ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      </div>
    </div>
  </div>
)}

      {/* Résumé en bas */}
      <div className="mt-4 sm:mt-6 bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">
                {filter === 'all' ? 'Résumé Global' : 
                 filter === 'active' ? 'Résumé Actionnaires Actifs' : 
                 'Résumé Actionnaires Bloqués'}
              </h3>
              {filter !== 'all' && (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  filter === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {filteredActionnaires.length} élément(s)
                </span>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm sm:text-base">
                  {filter === 'all' ? 'Total Actions:' : 'Actions filtrées:'}
                </span>
                <span className="font-semibold text-sm sm:text-base">
                  {filter === 'all' 
                    ? formatActions(statistiques.total_actions)
                    : formatActions(filteredStats.totalActions)
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm sm:text-base">
                  {filter === 'all' ? 'Total Dividendes:' : 'Dividendes filtrés:'}
                </span>
                <span className="font-semibold text-sm sm:text-base">
                  {filter === 'all' 
                    ? formatAmount(statistiques.total_dividendes)
                    : formatAmount(filteredStats.totalDividendes)
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm sm:text-base">Moyenne par actionnaire:</span>
                <span className="font-semibold text-sm sm:text-base">
                  {filter === 'all' 
                    ? (statistiques.nombre_total_actionnaires > 0 
                        ? formatAmount(statistiques.total_dividendes / statistiques.nombre_total_actionnaires)
                        : formatAmount(0))
                    : formatAmount(filteredStats.moyenneDividende)
                  }
                </span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Actions Rapides</h3>
            <div className="space-y-2">
              <button 
                onClick={handleExportCSV}
                disabled={isPending || filteredActionnaires.length === 0}
                className="w-full flex items-center justify-start px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4 mr-2" />
                Exporter {filter !== 'all' ? 'la sélection' : 'tout'} en CSV
              </button>
              <button 
                disabled
                className="w-full flex items-center justify-start px-3 py-2 text-sm text-gray-400 cursor-not-allowed rounded"
              >
                <FileText className="w-4 h-4 mr-2" />
                Générer rapport PDF (bientôt)
              </button>
              {isSelectionMode && selectedUsers.length > 0 && (
                <button 
                  className="w-full flex items-center justify-start px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                  onClick={handleDeleteMultipleUsers}
                  disabled={isPending}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer la sélection ({selectedUsers.length})
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionnairesAdminView;