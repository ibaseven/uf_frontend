// app/dashboard/projects/_components/ProjectDetailsModal.tsx
"use client";
import React, { useState, useTransition } from 'react';
import { 
  X,
  Users, 
  TrendingDown, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Loader2,
  DollarSign,
  Package,
  User,
  Phone,
  Mail,
  Calendar,
  Clock,
  Download
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { 
  decreaseParticipantPacks, 
  increaseParticipantPacks 
} from '@/actions/projectActions';

interface Participant {
  userId: {
    _id: string;
    firstName?: string;
    lastName?: string;
    telephone?: string;
    email?: string;
  } | string;
  numberOfPacks: number;
  totalInvestment: number;
  amountPaid: number;
  remainingToPay: number;
  completed: boolean;
  participationDate: string;
  _id?: string;
}

interface ProjectStats {
  totalParticipants: number;
  totalPacks: number;
  totalInvestment: number;
  totalPaid: number;
  totalRemaining: number;
  completedParticipants: number;
}

interface Project {
  _id: string;
  nameProject: string;
  packPrice: number;
  duration: number;
  monthlyPayment?: number;
  description?: string;
  gainProject?: number;
  rapport?: string;
  rapportUrl?: string;
  createdAt: string;
  updatedAt: string;
  participants?: Participant[];
  stats?: ProjectStats;
}

interface ProjectDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({
  isOpen,
  onClose,
  project
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [showPackModal, setShowPackModal] = useState(false);
  const [modalType, setModalType] = useState<'decrease' | 'increase'>('decrease');
  const [packsInput, setPacksInput] = useState('');
  const [reason, setReason] = useState('');

  const participants = project.participants || [];
  const stats = project.stats || {
    totalParticipants: 0,
    totalPacks: 0,
    totalInvestment: 0,
    totalPaid: 0,
    totalRemaining: 0,
    completedParticipants: 0
  };

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
      day: 'numeric'
    });
  };

  const handleOpenPackModal = (participant: Participant, type: 'decrease' | 'increase') => {
    setSelectedParticipant(participant);
    setModalType(type);
    setPacksInput('');
    setReason('');
    setShowPackModal(true);
    setMessage(null);
  };

  const handleSubmitPackChange = async () => {
    if (!selectedParticipant || !packsInput) return;

    const packs = parseInt(packsInput);
    if (isNaN(packs) || packs <= 0) {
      setMessage({ type: 'error', text: 'Nombre de packs invalide' });
      return;
    }

    if (modalType === 'decrease' && packs > selectedParticipant.numberOfPacks) {
      setMessage({ 
        type: 'error', 
        text: `Maximum ${selectedParticipant.numberOfPacks} pack(s) disponible(s)` 
      });
      return;
    }

    startTransition(async () => {
      try {
        const userId = typeof selectedParticipant.userId === 'object' 
          ? selectedParticipant.userId._id 
          : selectedParticipant.userId;

        const result = modalType === 'decrease'
          ? await decreaseParticipantPacks({
              projectId: project._id,
              userId: userId,
              packs: packs,
              reason: reason || undefined
            })
          : await increaseParticipantPacks({
              projectId: project._id,
              userId: userId,
              packs: packs,
              reason: reason || undefined
            });

        if (result.type === 'success') {
          setMessage({ type: 'success', text: result.message || 'Modification réussie' });
          
          setTimeout(() => {
            setShowPackModal(false);
            setMessage(null);
            router.refresh();
          }, 2000);
        } else {
          setMessage({ type: 'error', text: result.message || 'Erreur lors de la modification' });
        }
      } catch (error) {
        setMessage({ type: 'error', text: 'Erreur lors de la modification' });
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[95vh] overflow-y-auto my-4">
        <div className="sticky top-0 bg-white border-b z-10 p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{project.nameProject}</h2>
              <p className="text-gray-600 text-sm mt-1">Détails du projet et participants</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Message global */}
          {message && !showPackModal && (
            <div className={`p-4 rounded-lg ${
              message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              <div className="flex items-center">
                {message.type === 'success' ? <CheckCircle className="w-5 h-5 mr-2" /> : <AlertCircle className="w-5 h-5 mr-2" />}
                {message.text}
              </div>
            </div>
          )}

          {/* Informations du projet */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">Informations du projet</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-black bg-opacity-20 rounded-lg p-4">
                <div className="flex items-center text-blue-100 mb-1">
                  <DollarSign className="w-4 h-4 mr-1" />
                  <span className="text-xs">Prix du Pack</span>
                </div>
                <p className="text-xl font-bold">{formatAmount(project.packPrice)}</p>
              </div>
              
              <div className="bg-black bg-opacity-20 rounded-lg p-4">
                <div className="flex items-center text-blue-100 mb-1">
                  <Clock className="w-4 h-4 mr-1" />
                  <span className="text-xs">Durée</span>
                </div>
                <p className="text-xl font-bold">{project.duration} mois</p>
              </div>

              {project.monthlyPayment && (
                <div className="bg-black bg-opacity-20 rounded-lg p-4">
                  <div className="flex items-center text-blue-100 mb-1">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span className="text-xs">Paiement Mensuel</span>
                  </div>
                  <p className="text-xl font-bold">{formatAmount(project.monthlyPayment)}</p>
                </div>
              )}

              {project.gainProject && (
                <div className="bg-black bg-opacity-20 rounded-lg p-4">
                  <div className="flex items-center text-blue-100 mb-1">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span className="text-xs">Gain</span>
                  </div>
                  <p className="text-xl font-bold">{formatAmount(project.gainProject)}</p>
                </div>
              )}
            </div>

            {project.description && (
              <div className="mt-4 pt-4 border-t border-blue-400">
                <p className="text-blue-100 text-sm mb-1">Description</p>
                <p className="text-white">{project.description}</p>
              </div>
            )}

            {project.rapportUrl && (
              <div className="mt-4">
                <a
                  href={project.rapportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger le programme PDF
                </a>
              </div>
            )}
          </div>

          {/* Statistiques des participants */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Users className="w-6 h-6 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Statistiques des participants</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-xs text-gray-600 mb-1">Participants</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalParticipants}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-xs text-gray-600 mb-1">Total Packs</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalPacks}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-xs text-gray-600 mb-1">Investissement</p>
                <p className="text-lg font-bold text-green-600">{formatAmount(stats.totalInvestment)}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-xs text-gray-600 mb-1">Payé</p>
                <p className="text-lg font-bold text-teal-600">{formatAmount(stats.totalPaid)}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-xs text-gray-600 mb-1">Restant</p>
                <p className="text-lg font-bold text-orange-600">{formatAmount(stats.totalRemaining)}</p>
              </div>
            </div>
          </div>

          {/* Liste des participants */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Liste des participants</h3>
            
            {participants.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">Aucun participant</h4>
                <p className="text-gray-600">Ce projet n'a pas encore de participants.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {participants.map((participant, index) => {
                  const user = typeof participant.userId === 'object' ? participant.userId : null;
                  const userId = typeof participant.userId === 'object' 
                    ? participant.userId._id 
                    : participant.userId;
                  
                  const firstName = user?.firstName || 'Prénom';
                  const lastName = user?.lastName || 'inconnu';
                  const fullName = `${firstName} ${lastName}`.trim();
                  const email = user?.email || 'Email non disponible';
                  const phone = user?.telephone || '';
                  
                  return (
                    <div key={participant._id || userId || index} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center flex-1">
                          <div className="p-2 bg-blue-100 rounded-full mr-3">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 truncate">{fullName}</h4>
                            <div className="flex items-center text-xs text-gray-600 mt-1">
                              <Mail className="w-3 h-3 mr-1 flex-shrink-0" />
                              <span className="truncate">{email}</span>
                            </div>
                            {phone && (
                              <div className="flex items-center text-xs text-gray-600">
                                <Phone className="w-3 h-3 mr-1 flex-shrink-0" />
                                {phone}
                              </div>
                            )}
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2 ${
                          participant.completed 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {participant.completed ? 'Complet' : 'En cours'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="bg-blue-50 rounded p-2">
                          <div className="flex items-center text-blue-600 mb-1">
                            <Package className="w-3 h-3 mr-1" />
                            <span className="text-xs">Packs</span>
                          </div>
                          <p className="text-lg font-bold text-gray-900">{participant.numberOfPacks}</p>
                        </div>

                        <div className="bg-green-50 rounded p-2">
                          <div className="flex items-center text-green-600 mb-1">
                            <DollarSign className="w-3 h-3 mr-1" />
                            <span className="text-xs">Total</span>
                          </div>
                          <p className="text-sm font-bold text-gray-900">
                            {formatAmount(participant.totalInvestment)}
                          </p>
                        </div>

                        <div className="bg-purple-50 rounded p-2">
                          <div className="text-xs text-purple-600 mb-1">Payé</div>
                          <p className="text-sm font-semibold text-gray-900">
                            {formatAmount(participant.amountPaid)}
                          </p>
                        </div>

                        <div className="bg-orange-50 rounded p-2">
                          <div className="text-xs text-orange-600 mb-1">Restant</div>
                          <p className="text-sm font-semibold text-gray-900">
                            {formatAmount(participant.remainingToPay)}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-3 border-t">
                        <button
                          onClick={() => handleOpenPackModal(participant, 'decrease')}
                          disabled={isPending}
                          className="flex-1 flex items-center justify-center px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm disabled:opacity-50"
                        >
                          <TrendingDown className="w-4 h-4 mr-1" />
                          Retirer
                        </button>
                        <button
                          onClick={() => handleOpenPackModal(participant, 'increase')}
                          disabled={isPending}
                          className="flex-1 flex items-center justify-center px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors text-sm disabled:opacity-50"
                        >
                          <TrendingUp className="w-4 h-4 mr-1" />
                          Ajouter
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t p-4">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>

      {/* Modal de modification des packs */}
      {showPackModal && selectedParticipant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center mb-6">
                {modalType === 'decrease' ? (
                  <div className="p-2 bg-red-100 rounded-lg mr-3">
                    <TrendingDown className="w-6 h-6 text-red-600" />
                  </div>
                ) : (
                  <div className="p-2 bg-green-100 rounded-lg mr-3">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {modalType === 'decrease' ? 'Retirer des packs' : 'Ajouter des packs'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {typeof selectedParticipant.userId === 'object' 
                      ? `${selectedParticipant.userId.firstName || ''} ${selectedParticipant.userId.lastName || ''}`.trim() || 'Participant'
                      : 'Participant'}
                  </p>
                </div>
              </div>

              {message && (
                <div className={`mb-4 p-3 rounded-lg ${
                  message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  <div className="flex items-center text-sm">
                    {message.type === 'success' ? <CheckCircle className="w-4 h-4 mr-2" /> : <AlertCircle className="w-4 h-4 mr-2" />}
                    {message.text}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600">Packs actuels</p>
                  <p className="text-2xl font-bold text-gray-900">{selectedParticipant.numberOfPacks}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de packs à {modalType === 'decrease' ? 'retirer' : 'ajouter'}
                  </label>
                  <input
                    type="number"
                    value={packsInput}
                    onChange={(e) => setPacksInput(e.target.value)}
                    min="1"
                    max={modalType === 'decrease' ? selectedParticipant.numberOfPacks : undefined}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: 1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Raison (optionnel)
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Expliquez la raison..."
                  />
                </div>

                {packsInput && parseInt(packsInput) > 0 && (
                  <div className={`rounded-lg p-3 ${
                    modalType === 'decrease' ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'
                  }`}>
                    <p className="text-xs text-gray-600 mb-1">Nouveau total</p>
                    <p className="text-xl font-bold text-gray-900">
                      {modalType === 'decrease' 
                        ? selectedParticipant.numberOfPacks - parseInt(packsInput)
                        : selectedParticipant.numberOfPacks + parseInt(packsInput)
                      } pack(s)
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {formatAmount(
                        (modalType === 'decrease' 
                          ? selectedParticipant.numberOfPacks - parseInt(packsInput)
                          : selectedParticipant.numberOfPacks + parseInt(packsInput)
                        ) * project.packPrice
                      )}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6 pt-6 border-t">
                <button
                  onClick={() => setShowPackModal(false)}
                  disabled={isPending}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmitPackChange}
                  disabled={isPending || !packsInput || parseInt(packsInput) <= 0}
                  className={`flex-1 flex items-center justify-center px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 ${
                    modalType === 'decrease' 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      En cours...
                    </>
                  ) : (
                    <>
                      {modalType === 'decrease' ? (
                        <>
                          <TrendingDown className="w-4 h-4 mr-2" />
                          Retirer
                        </>
                      ) : (
                        <>
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Ajouter
                        </>
                      )}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailsModal;