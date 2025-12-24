// _components/ProjectsList.tsx
"use client";
import React, { useState, useTransition } from 'react';
import {
  Calendar,
  DollarSign,
  Clock,
  Eye,
  Edit,
  Trash2,
  Download,
  FileText,
  TrendingUp,
  Users,
  CheckCircle,
  AlertCircle,
  Coins
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import ProjectDetailsModal from './ProjectDetailsModal';
import EditProjectModal from './EditProjectModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import DistributeDividendeModal from './DistributeDividendeModal';
import { updateProject, deleteProject, distributeProjectDividende } from '@/actions/projectActions';

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

interface ProjectsListProps {
  projects: Project[];
}

const ProjectsList: React.FC<ProjectsListProps> = ({ projects }) => {
  const router = useRouter();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDistributeModal, setShowDistributeModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);
  const [distributingProject, setDistributingProject] = useState<Project | null>(null);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

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

  const handleViewDetails = (project: Project) => {
    setSelectedProject(project);
    setShowDetailModal(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setShowEditModal(true);
  };

  const handleDelete = (project: Project) => {
    setDeletingProject(project);
    setShowDeleteModal(true);
  };

  const handleDistribute = (project: Project) => {
    setDistributingProject(project);
    setShowDistributeModal(true);
  };

  const handleUpdateProject = async (projectId: string, formData: FormData) => {
    return new Promise((resolve) => {
      startTransition(async () => {
        try {
          const data = {
            nameProject: formData.get('nameProject') as string,
            packPrice: Number(formData.get('packPrice')),
            duration: Number(formData.get('duration')),
            monthlyPayment: formData.get('monthlyPayment') ? Number(formData.get('monthlyPayment')) : undefined,
            description: formData.get('description') as string || undefined,
            gainProject: formData.get('gainProject') ? Number(formData.get('gainProject')) : undefined
          };

          const result = await updateProject(projectId, data);
          
          if (result.type === 'success') {
            setMessage({ type: 'success', text: result.message });
            setTimeout(() => {
              setMessage(null);
              router.refresh();
            }, 2000);
          } else {
            setMessage({ type: 'error', text: result.message });
          }
          
          resolve(result);
        } catch (error) {
          const errorResult = { type: "error", message: "Erreur lors de la mise à jour" };
          setMessage({ type: 'error', text: errorResult.message });
          resolve(errorResult);
        }
      });
    });
  };

  const handleConfirmDelete = async () => {
    if (!deletingProject) return;

    startTransition(async () => {
      try {
        const result = await deleteProject(deletingProject._id);



        if (result.type === 'success') {
          setMessage({ type: 'success', text: result.message });
          setShowDeleteModal(false);
          setTimeout(() => {
            setMessage(null);
            router.refresh();
          }, 2000);
        } else {
          setMessage({ type: 'error', text: result.message });
        }
      } catch (error) {
        setMessage({ type: 'error', text: "Erreur lors de la suppression" });
      }
    });
  };

  const handleDistributeDividende = async (projectId: string, totalAmount: number) => {
    return new Promise((resolve) => {
      startTransition(async () => {
        try {
          const result = await distributeProjectDividende({
            projectId,
            totalAmount
          });

          if (result.type === 'success') {
            setMessage({ type: 'success', text: result.message });
            setTimeout(() => {
              setMessage(null);
              router.refresh();
            }, 2000);
          } else {
            setMessage({ type: 'error', text: result.message });
          }

          resolve(result);
        } catch (error) {
          const errorResult = { type: "error", message: "Erreur lors de la distribution" };
          setMessage({ type: 'error', text: errorResult.message });
          resolve(errorResult);
        }
      });
    });
  };

  const getParticipantsDisplay = (participants?: Participant[]) => {
    if (!participants || participants.length === 0) {
      return (
        <span className="text-sm text-gray-400 italic">Aucun participant</span>
      );
    }

    if (participants.length <= 3) {
      return (
        <div className="space-y-1">
          {participants.map((p, idx) => {
            const user = typeof p.userId === 'object' ? p.userId : null;
            const fullName = user 
              ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Participant'
              : 'Participant';
            
            return (
              <div key={idx} className="text-xs text-gray-700 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                {fullName}
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <div className="space-y-1">
        {participants.slice(0, 2).map((p, idx) => {
          const user = typeof p.userId === 'object' ? p.userId : null;
          const fullName = user 
            ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Participant'
            : 'Participant';
          
          return (
            <div key={idx} className="text-xs text-gray-700 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              {fullName}
            </div>
          );
        })}
        <div className="text-xs text-blue-600 font-medium">
          +{participants.length - 2} autre{participants.length - 2 > 1 ? 's' : ''}
        </div>
      </div>
    );
  };

  // Auto-hide message
  React.useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <>
      {/* Message de notification global */}
      {message && (
        <div className={`mb-4 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-100 border border-green-400 text-green-700' 
            : 'bg-red-100 border border-red-400 text-red-700'
        }`}>
          <div className="flex items-center">
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 mr-2" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-2" />
            )}
            {message.text}
          </div>
        </div>
      )}

      {/* Liste Desktop */}
      <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Projet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix du Pack
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durée
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paiement Mensuel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gain
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Participants
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {projects.map((project) => (
                <tr key={project._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {project.nameProject}
                        </div>
                        {project.description && (
                          <div className="text-xs text-gray-500 truncate max-w-xs">
                            {project.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 text-green-400 mr-2" />
                      <span className="text-sm font-medium text-green-600">
                        {formatAmount(project.packPrice)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-blue-400 mr-2" />
                      <span className="text-sm text-gray-900">
                        {project.duration} mois
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {project.monthlyPayment ? (
                      <span className="text-sm font-medium text-blue-600">
                        {formatAmount(project.monthlyPayment)}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {project.gainProject ? (
                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 text-yellow-400 mr-2" />
                        <span className="text-sm font-medium text-yellow-600">
                          {formatAmount(project.gainProject)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start">
                      <Users className="w-4 h-4 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-gray-900 mb-1">
                          {project.stats?.totalParticipants || 0} participant{(project.stats?.totalParticipants || 0) > 1 ? 's' : ''}
                        </div>
                        {getParticipantsDisplay(project.participants)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">
                        {formatDate(project.createdAt)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewDetails(project)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="Voir les détails"
                        disabled={isPending}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {project.rapportUrl && (
                        <a
                          href={project.rapportUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-900 transition-colors"
                          title="Télécharger le programme"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        onClick={() => handleDistribute(project)}
                        className="text-purple-600 hover:text-purple-900 transition-colors disabled:opacity-50"
                        title="Distribuer les dividendes"
                        disabled={isPending}
                      >
                        <Coins className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(project)}
                        className="text-orange-600 hover:text-orange-900 transition-colors disabled:opacity-50"
                        title="Modifier"
                        disabled={isPending}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(project)}
                        className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50"
                        title="Supprimer"
                        disabled={isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Liste Mobile */}
      <div className="lg:hidden space-y-4">
        {projects.map((project) => (
          <div key={project._id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{project.nameProject}</h3>
                {project.description && (
                  <p className="text-xs text-gray-500 mt-1">{project.description}</p>
                )}
              </div>
              <button
                onClick={() => handleViewDetails(project)}
                className="p-1 text-blue-600 hover:bg-blue-50 rounded flex-shrink-0 ml-2"
                disabled={isPending}
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm mb-3">
              <div>
                <span className="text-gray-600">Prix du pack</span>
                <div className="font-medium text-green-600">
                  {formatAmount(project.packPrice)}
                </div>
              </div>
              <div>
                <span className="text-gray-600">Durée</span>
                <div className="font-medium">{project.duration} mois</div>
              </div>
              {project.gainProject && (
                <div>
                  <span className="text-gray-600">Gain</span>
                  <div className="font-medium text-yellow-600">
                    {formatAmount(project.gainProject)}
                  </div>
                </div>
              )}
              <div>
                <span className="text-gray-600">Créé le</span>
                <div className="font-medium">{formatDate(project.createdAt)}</div>
              </div>
            </div>

            {/* Section Participants Mobile */}
            <div className="bg-blue-50 rounded-lg p-3 mb-3">
              <div className="flex items-center mb-2">
                <Users className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-gray-900">
                  {project.stats?.totalParticipants || 0} participant{(project.stats?.totalParticipants || 0) > 1 ? 's' : ''}
                </span>
              </div>
              {getParticipantsDisplay(project.participants)}
            </div>

            {/* Actions Mobile */}
            <div className="flex gap-2 pt-3 border-t flex-wrap">
              {project.rapportUrl && (
                <a
                  href={project.rapportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                >
                  <Download className="w-4 h-4 mr-1" />
                  PDF
                </a>
              )}
              <button
                onClick={() => handleDistribute(project)}
                disabled={isPending}
                className="flex-1 flex items-center justify-center px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm disabled:opacity-50"
              >
                <Coins className="w-4 h-4 mr-1" />
                Distribuer
              </button>
              <button
                onClick={() => handleEdit(project)}
                disabled={isPending}
                className="flex-1 flex items-center justify-center px-3 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm disabled:opacity-50"
              >
                <Edit className="w-4 h-4 mr-1" />
                Modifier
              </button>
              <button
                onClick={() => handleDelete(project)}
                disabled={isPending}
                className="flex-1 flex items-center justify-center px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de détails avec participants */}
      {showDetailModal && selectedProject && (
        <ProjectDetailsModal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          project={selectedProject}
        />
      )}

      {/* Modal de modification */}
      {showEditModal && editingProject && (
        <EditProjectModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          project={editingProject}
          onSuccess={() => {
            setShowEditModal(false);
            setMessage({ type: 'success', text: 'Projet modifié avec succès' });
          }}
          onUpdateProject={handleUpdateProject}
          isPending={isPending}
        />
      )}

      {/* Modal de confirmation de suppression */}
      {showDeleteModal && deletingProject && (
        <DeleteConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
          projectName={deletingProject.nameProject}
          isPending={isPending}
        />
      )}

      {/* Modal de distribution de dividendes */}
      {showDistributeModal && distributingProject && (
        <DistributeDividendeModal
          isOpen={showDistributeModal}
          onClose={() => setShowDistributeModal(false)}
          project={distributingProject}
          onSuccess={() => {
            setShowDistributeModal(false);
            setMessage({ type: 'success', text: 'Dividendes distribués avec succès' });
          }}
          onDistribute={handleDistributeDividende}
          isPending={isPending}
        />
      )}
    </>
  );
};

export default ProjectsList;