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
  TrendingUp
} from 'lucide-react';

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
                          title="Télécharger le rapport"
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
              <div>
                <h3 className="font-semibold text-gray-900">{project.nameProject}</h3>
                {project.description && (
                  <p className="text-xs text-gray-500 mt-1">{project.description}</p>
                )}
              </div>
              <button
                onClick={() => handleViewDetails(project)}
                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
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

            {project.rapportUrl && (
              <div className="mt-3 pt-3 border-t">
                <a
                  href={project.rapportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                  <FileText className="w-4 h-4 mr-1" />
                  Télécharger le rapport
                </a>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal de détails */}
      {showDetailModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedProject.nameProject}
                </h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                {selectedProject.description && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Description</h4>
                    <p className="text-gray-600">{selectedProject.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Prix du Pack</div>
                    <div className="text-xl font-bold text-green-600">
                      {formatAmount(selectedProject.packPrice)}
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Durée</div>
                    <div className="text-xl font-bold text-blue-600">
                      {selectedProject.duration} mois
                    </div>
                  </div>
                  {selectedProject.monthlyPayment && (
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">Paiement Mensuel</div>
                      <div className="text-xl font-bold text-purple-600">
                        {formatAmount(selectedProject.monthlyPayment)}
                      </div>
                    </div>
                  )}
                  {selectedProject.gainProject && (
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">Gain Projet</div>
                      <div className="text-xl font-bold text-yellow-600">
                        {formatAmount(selectedProject.gainProject)}
                      </div>
                    </div>
                  )}
                </div>

                {selectedProject.rapportUrl && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <a
                      href={selectedProject.rapportUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger le rapport PDF
                    </a>
                  </div>
                )}

                <div className="bg-gray-50 rounded-lg p-4 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-gray-600">Créé le :</span>
                      <div className="font-medium">{formatDate(selectedProject.createdAt)}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Modifié le :</span>
                      <div className="font-medium">{formatDate(selectedProject.updatedAt)}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6 pt-6 border-t">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectsList;