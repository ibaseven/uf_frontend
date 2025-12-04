// _components/ProjectsList.tsx
"use client";
import React, { useState } from 'react';
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
  Users
} from 'lucide-react';
import ProjectDetailsModal from './ProjectDetailsModal';

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
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

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

  return (
    <>
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
                        className="text-blue-600 hover:text-blue-900"
                        title="Voir les détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {project.rapportUrl && (
                        <a
                          href={project.rapportUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-900"
                          title="Télécharger le programme"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        className="text-orange-600 hover:text-orange-900"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        title="Supprimer"
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

            {project.rapportUrl && (
              <div className="pt-3 border-t">
                <a
                  href={project.rapportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                  <FileText className="w-4 h-4 mr-1" />
                  Télécharger le programme
                </a>
              </div>
            )}
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
    </>
  );
};

export default ProjectsList;