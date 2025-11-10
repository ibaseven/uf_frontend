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
  Users
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

const ProjectsView: React.FC<ProjectsViewProps> = ({ projects }) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
        
        // Afficher les détails de la participation
        if (result.participation) {
          const { numberOfPacks, totalInvestment, amountPaid, remainingToPay } = result.participation;
          setTimeout(() => {
            alert(
              `Participation enregistrée !\n\n` +
              `Projet: ${projectName}\n` +
              `Nombre de packs: ${numberOfPacks}\n` +
              `Investissement total: ${formatAmount(totalInvestment)}\n` +
              `Montant payé: ${formatAmount(amountPaid)}\n` +
              `Reste à payer: ${formatAmount(remainingToPay)}\n\n` +
              `Le paiement est attendu pour valider votre participation.`
            );
          }, 500);
        }

        // Recharger la page après 2 secondes
        setTimeout(() => {
          window.location.reload();
        }, 2000);
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
    </div>
  );
};

export default ProjectsView;