"use client";
import React, { useState } from 'react';
import {
  Calendar,
  TrendingUp,
  AlertCircle,
  Package,
  DollarSign,
  CheckCircle,
  Clock,
  Users,
  X,
  Info
} from 'lucide-react';
import { participateToProject } from '@/actions/projectActions';

// Types
interface Project {
  _id: string;
  nameProject: string;
  packPrice: number;
  description?: string;
  status?: string;
  createdAt: string;
}

interface ProjectsViewProps {
  projects: Project[];
}

interface ParticipationDetails {
  projectName: string;
  numberOfPacks: number;
  totalInvestment: number;
  amountPaid: number;
  remainingToPay: number;
}

const ProjectsView: React.FC<ProjectsViewProps> = ({ projects }) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showParticipationModal, setShowParticipationModal] = useState(false);
  const [participationDetails, setParticipationDetails] = useState<ParticipationDetails | null>(null);

  // Fonction pour formater les montants
  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Fonction pour formater les dates
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Fonction pour participer à un projet
  const handleParticipate = async (projectId: string, projectName: string) => {
    setLoading(projectId);
    setError(null);
    setSuccess(null);

    try {
      const result = await participateToProject({ projectId });

      if (result.type === 'success') {
        setSuccess(`Participation au projet "${projectName}" enregistrée avec succès !`);
        
        // Afficher les détails de la participation dans une popup
        if (result.participation) {
          setParticipationDetails({
            projectName: projectName,
            numberOfPacks: result.participation.numberOfPacks,
            totalInvestment: result.participation.totalInvestment,
            amountPaid: result.participation.amountPaid,
            remainingToPay: result.participation.remainingToPay,
          });
          setShowParticipationModal(true);
        }
      } else {
        setError(result.message || 'Erreur lors de la participation');
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError('Une erreur est survenue');
    } finally {
      setLoading(null);
    }
  };

  // Fermer la modal et recharger
  const closeModalAndReload = () => {
    setShowParticipationModal(false);
    setParticipationDetails(null);
    setTimeout(() => {
      window.location.reload();
    }, 300);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-blue-600">Projets disponibles</h1>
        <p className="text-gray-600 mt-1">Participez aux projets de l'entreprise</p>
      </div>

      {/* Messages de succès/erreur globaux */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <p className="text-green-800">{success}</p>
          </div>
        </div>
      )}

      {error && (
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
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Aucun projet disponible</h3>
          <p className="text-gray-500">Il n'y a actuellement aucun projet auquel participer.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project._id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="p-6">
                {/* En-tête du projet */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {project.nameProject}
                    </h3>
                    {project.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {project.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Prix du pack */}
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <DollarSign className="w-5 h-5 text-blue-600 mr-2" />
                      <span className="text-sm text-gray-600">Prix du pack</span>
                    </div>
                    <span className="text-xl font-bold text-blue-600">
                      {formatAmount(project.packPrice)}
                    </span>
                  </div>
                </div>

                {/* Informations supplémentaires */}
                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Ajouté le {formatDate(project.createdAt)}</span>
                  </div>
                  {project.status && (
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="capitalize">{project.status}</span>
                    </div>
                  )}
                </div>

                {/* Bouton de participation */}
                <button
                  onClick={() => handleParticipate(project._id, project.nameProject)}
                  disabled={loading === project._id}
                  className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading === project._id ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Traitement...
                    </>
                  ) : (
                    <>
                      <Users className="w-4 h-4 mr-2" />
                      Participer au projet
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de confirmation de participation */}
      {showParticipationModal && participationDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md mx-auto shadow-2xl transform transition-all">
            {/* Header de la modal */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <CheckCircle className="w-7 h-7 text-green-600" />
                  </div>
                  <h2 className="text-xl font-bold text-white ml-3">Participation Confirmée</h2>
                </div>
                <button
                  onClick={closeModalAndReload}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Contenu de la modal */}
            <div className="p-6">
              {/* Nom du projet */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 mb-1">Projet</p>
                <p className="text-lg font-bold text-blue-900">{participationDetails.projectName}</p>
              </div>

              {/* Détails de la participation */}
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700 font-medium">Nombre de packs</span>
                  <span className="text-lg font-bold text-gray-900">{participationDetails.numberOfPacks}</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700 font-medium">Investissement total</span>
                  <span className="text-lg font-bold text-blue-600">
                    {formatAmount(participationDetails.totalInvestment)}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                  <span className="text-gray-700 font-medium">Montant payé</span>
                  <span className="text-lg font-bold text-green-600">
                    {formatAmount(participationDetails.amountPaid)}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <span className="text-gray-700 font-medium">Reste à payer</span>
                  <span className="text-lg font-bold text-orange-600">
                    {formatAmount(participationDetails.remainingToPay)}
                  </span>
                </div>
              </div>

              {/* Message d'information */}
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <Info className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Prochaine étape</p>
                    <p>Le paiement est attendu pour valider définitivement votre participation au projet.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer de la modal */}
            <div className="border-t border-gray-200 p-6 bg-gray-50 rounded-b-lg">
              <button
                onClick={closeModalAndReload}
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Compris, continuer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsView;