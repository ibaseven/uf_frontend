"use client";
import React, { useState, useMemo } from 'react';
import {
  AlertCircle,
  CheckCircle,
  X,
  DollarSign,
  CreditCard,
  Package,
  Info,
  TrendingUp,
  Layers
} from 'lucide-react';
import { payProjectParticipation } from '@/actions/projectActions';

// Types
interface RawProject {
  projectId: string;
  projectName: string;
  packPrice: number;
  numberOfPacks: number;
  amountPaid: number;
  remainingToPay: number;
  totalInvestment: number;
  completed: boolean;
  progressPercentage: string;
  monthlyPayment?: number;
  [key: string]: any;
}

interface UserProject {
  _id: string;
  nameProject: string;
  packPrice: number;
  numberOfPacks: number;
  amountPaid: number;
  remainingToPay: number;
  totalInvestment: number;
  completed: boolean;
  progressPercentage: string;
  monthlyPayment?: number;
}

interface ProjectPaymentViewProps {
  projects: RawProject[];
}

const ProjectPaymentView: React.FC<ProjectPaymentViewProps> = ({ projects: rawProjects }) => {
  // 🔥 MAPPING DES PROJETS ICI
  const projects = useMemo(() => {
    return rawProjects.map((project) => ({
      _id: project.projectId,
      nameProject: project.projectName,
      packPrice: project.packPrice,
      numberOfPacks: project.numberOfPacks,
      amountPaid: project.amountPaid,
      remainingToPay: project.remainingToPay,
      totalInvestment: project.totalInvestment,
      completed: project.completed,
      progressPercentage: project.progressPercentage,
      monthlyPayment: project.monthlyPayment
    }));
  }, [rawProjects]);

  //console.log('Projets mappés dans ProjectPaymentView:', projects);

  // 🔥 UN SEUL PROJET SÉLECTIONNÉ (string au lieu de string[])
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Fonction pour formater les montants
  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // 🔥 Gérer la sélection d'UN SEUL projet (radio button behavior)
  const handleProjectSelect = (projectId: string) => {
    setSelectedProject(projectId);
  };

  // 🔥 Montant suggéré basé sur remainingToPay
  const calculateSuggestedAmount = () => {
    const project = projects.find(p => p._id === selectedProject);
    return project?.remainingToPay || 0;
  };

  // Ouvrir la modal de paiement
  const openPaymentModal = () => {
    if (!selectedProject) {
      setError('Veuillez sélectionner un projet');
      return;
    }
    setShowPaymentModal(true);
    setError(null);
    setAmount(calculateSuggestedAmount().toString());
  };

  // Gérer le paiement
  const handlePayment = async () => {
    if (!selectedProject) {
      setError('Veuillez sélectionner un projet');
      return;
    }

    const amountNum = parseFloat(amount);
    if (!amount || amountNum <= 0) {
      setError('Veuillez saisir un montant valide');
      return;
    }

    const project = projects.find(p => p._id === selectedProject);
    if (project && amountNum > project.remainingToPay) {
      setError(`Le montant ne peut pas dépasser le reste à payer: ${formatAmount(project.remainingToPay)}`);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await payProjectParticipation({
        projectIds: [selectedProject], // Tableau avec un seul ID
        amount: amountNum
      });

      if (result.type === 'success') {
        setSuccess('Paiement initié avec succès !');
        
        if (result.invoice?.response_text) {
          setTimeout(() => {
            window.location.href = result.invoice.response_text;
          }, 1500);
        } else {
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      } else {
        setError(result.message || 'Erreur lors du paiement');
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError('Une erreur est survenue lors du paiement');
    } finally {
      setLoading(false);
    }
  };

  // Fermer la modal
  const closeModal = () => {
    setShowPaymentModal(false);
    setAmount('');
    setError(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-blue-600">Payer mes participations</h1>
        <p className="text-gray-600 mt-1">Sélectionnez un projet et effectuez un paiement</p>
      </div>

      {/* Messages */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <p className="text-green-800">{success}</p>
          </div>
        </div>
      )}

      {error && !showPaymentModal && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Liste des projets */}
      {projects.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Aucun projet</h3>
          <p className="text-gray-500">Vous n'avez pas encore de participation à des projets.</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Mes projets</h2>
              <p className="text-sm text-gray-600 mt-1">
                Sélectionnez le projet pour lequel vous souhaitez effectuer un paiement
              </p>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {projects.map((project) => (
                  <div
                    key={project._id}
                    className={`border rounded-lg p-5 cursor-pointer transition-all ${
                      selectedProject === project._id
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                    onClick={() => handleProjectSelect(project._id)}
                  >
                    {/* Header du projet avec radio button */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start flex-1">
                        <input
                          type="radio"
                          checked={selectedProject === project._id}
                          onChange={() => handleProjectSelect(project._id)}
                          className="w-5 h-5 text-blue-600 mt-1"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-bold text-lg text-gray-900">{project.nameProject}</h3>
                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                              project.completed 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {project.completed ? '✓ Complété' : '⏳ En cours'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Barre de progression */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Progression</span>
                        <span className="text-sm font-bold text-blue-600">
                          {parseFloat(project.progressPercentage).toFixed(2)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(parseFloat(project.progressPercentage), 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Détails financiers en grille */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center text-gray-600 text-xs mb-1">
                          <Layers className="w-3 h-3 mr-1" />
                          <span>Nombre de packs</span>
                        </div>
                        <p className="font-semibold text-gray-900">{project.numberOfPacks}</p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center text-gray-600 text-xs mb-1">
                          <DollarSign className="w-3 h-3 mr-1" />
                          <span>Prix par pack</span>
                        </div>
                        <p className="font-semibold text-gray-900">{formatAmount(project.packPrice)}</p>
                      </div>

                      <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                        <div className="flex items-center text-blue-600 text-xs mb-1">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          <span>Total investissement</span>
                        </div>
                        <p className="font-bold text-blue-900">{formatAmount(project.totalInvestment)}</p>
                      </div>

                      <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                        <div className="flex items-center text-green-600 text-xs mb-1">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          <span>Montant payé</span>
                        </div>
                        <p className="font-bold text-green-700">{formatAmount(project.amountPaid)}</p>
                      </div>
                    </div>

                    {/* Reste à payer en évidence */}
                    <div className="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-orange-800">Reste à payer</span>
                        <span className="text-lg font-bold text-orange-600">
                          {formatAmount(project.remainingToPay)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bouton de paiement */}
              {selectedProject && (
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-900">
                        Projet sélectionné
                      </p>
                      <p className="text-xs text-blue-700 mt-1">
                        {projects.find(p => p._id === selectedProject)?.nameProject}
                      </p>
                    </div>
                    <button
                      onClick={openPaymentModal}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Procéder au paiement
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Modal de paiement */}
      {showPaymentModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md mx-auto shadow-2xl">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <CreditCard className="w-7 h-7 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold text-white ml-3">Paiement</h2>
                </div>
                <button onClick={closeModal} className="text-white hover:text-gray-200 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Projet sélectionné */}
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-2">Projet sélectionné</p>
                {(() => {
                  const project = projects.find(p => p._id === selectedProject);
                  return project ? (
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <p className="font-bold text-gray-900 mb-3">{project.nameProject}</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total investissement:</span>
                          <span className="font-semibold">{formatAmount(project.totalInvestment)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Montant payé:</span>
                          <span className="font-semibold text-green-600">{formatAmount(project.amountPaid)}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t">
                          <span className="text-gray-900 font-medium">Reste à payer:</span>
                          <span className="font-bold text-orange-600">{formatAmount(project.remainingToPay)}</span>
                        </div>
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>

              {/* Montant */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Montant à payer (FCFA)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Entrez le montant"
                  min="1"
                  max={calculateSuggestedAmount()}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Montant suggéré (reste à payer): {formatAmount(calculateSuggestedAmount())}
                </p>
              </div>

              {/* Message d'information */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <Info className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Information</p>
                    <p>Vous serez redirigé vers la page de paiement sécurisé pour finaliser la transaction.</p>
                  </div>
                </div>
              </div>

              {/* Erreur */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 p-6 bg-gray-50 rounded-b-lg">
              <div className="flex space-x-3">
                <button
                  onClick={closeModal}
                  disabled={loading}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handlePayment}
                  disabled={loading || !amount || parseFloat(amount) <= 0}
                  className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
                >
                  {loading ? 'Traitement...' : 'Payer maintenant'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectPaymentView;