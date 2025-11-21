// app/dashboard/projects/_components/ProjectsAdminView.tsx
"use client";
import React, { useState, useTransition } from 'react';
import { 
  Plus,
  AlertCircle,
  CheckCircle,
  Briefcase,
  Filter,
  DollarSign,
  Edit
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import AddProjectModal from './AddProjectModal';
import ProjectsList from './ProjectsList';

import { addProject } from '@/actions/projection';
import { updateActionPrice } from '@/actions/actions';
import UpdateActionPriceModal from './UpdatePriceModal';

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

interface ProjectsAdminViewProps {
  projects: Project[];
  actionPrice: number; // Ajout du prix des actions
}

const ProjectsAdminView: React.FC<ProjectsAdminViewProps> = ({ 
  projects = [],
  actionPrice = 20
}) => {
  const router = useRouter();
  
  const [filter, setFilter] = useState<'all' | 'recent' | 'old'>('all');
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [isPending, startTransition] = useTransition();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdatePriceModal, setShowUpdatePriceModal] = useState(false);

  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Ajouter un nouveau projet
  const handleAddProject = async (formData: FormData) => {
    return new Promise((resolve) => {
      startTransition(async () => {
        try {
          const result = await addProject(formData);

          if (result.type === 'success') {
            setMessage({ 
              type: 'success', 
              text: result.message || 'Projet créé avec succès !' 
            });
            setTimeout(() => {
              router.refresh();
            }, 1000);
          } else {
            setMessage({ 
              type: 'error', 
              text: result.message || 'Erreur lors de la création du projet' 
            });
          }
          
          resolve(result);
        } catch (error) {
          console.error("Erreur dans handleAddProject:", error);
          const errorResult = {
            type: "error",
            message: "Erreur lors de la création du projet"
          };
          setMessage({ type: 'error', text: errorResult.message });
          resolve(errorResult);
        }
      });
    });
  };

  // Mettre à jour le prix des actions
  const handleUpdateActionPrice = async (formData: FormData) => {
    return new Promise((resolve) => {
      startTransition(async () => {
        try {
          const newPrice = Number(formData.get('newPrice'));
          const result = await updateActionPrice({ newPrice });

          if (result.type === 'success') {
            setMessage({ 
              type: 'success', 
              text: result.message || 'Prix mis à jour avec succès !' 
            });
            setTimeout(() => {
              router.refresh();
            }, 1000);
          } else {
            setMessage({ 
              type: 'error', 
              text: result.message || 'Erreur lors de la mise à jour du prix' 
            });
          }
          
          resolve(result);
        } catch (error) {
          console.error("Erreur dans handleUpdateActionPrice:", error);
          const errorResult = {
            type: "error",
            message: "Erreur lors de la mise à jour du prix"
          };
          setMessage({ type: 'error', text: errorResult.message });
          resolve(errorResult);
        }
      });
    });
  };

  // Filtrer les projets
  const filteredProjects = React.useMemo(() => {
    if (filter === 'all') return projects;
    
    const sortedProjects = [...projects].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    if (filter === 'recent') {
      return sortedProjects.slice(0, Math.ceil(projects.length / 2));
    } else {
      return sortedProjects.slice(Math.ceil(projects.length / 2));
    }
  }, [projects, filter]);

  // Auto-hide message
  React.useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="p-1 bg-gray-50 min-h-screen">
      {/* Message de notification */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
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

      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-blue-600">Gestion des Projets</h1>
            <p className="text-gray-600 mt-1">Créer et gérer vos projets</p>
          </div>
          
          <button
            onClick={() => setShowAddModal(true)}
            disabled={isPending}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouveau projet
          </button>
        </div>
      </div>

      {/* Section Prix des Actions */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-blue-100 text-sm font-medium">Prix d'une action</p>
              <p className="text-3xl font-bold text-white mt-1">
                {formatAmount(actionPrice)}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowUpdatePriceModal(true)}
            disabled={isPending}
            className="flex items-center px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50"
          >
            <Edit className="w-4 h-4 mr-2" />
            Modifier le prix
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Projets</p>
              <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
            </div>
          </div>
        </div>

        {/* Autres stats... */}
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tous ({projects.length})
          </button>
          <button
            onClick={() => setFilter('recent')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'recent' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Récents
          </button>
          <button
            onClick={() => setFilter('old')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'old' 
                ? 'bg-gray-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Anciens
          </button>
        </div>
      </div>

      {/* Liste des projets */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun projet</h3>
          <p className="text-gray-600 mb-4">Commencez par créer votre premier projet.</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Créer mon premier projet
          </button>
        </div>
      ) : (
        <ProjectsList projects={filteredProjects} />
      )}

      {/* Modal d'ajout de projet */}
      <AddProjectModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          setMessage({ type: 'success', text: 'Projet créé avec succès !' });
          router.refresh();
        }}
        isPending={isPending}
        onAddProject={handleAddProject}
      />

      {/* Modal de modification du prix des actions */}
      <UpdateActionPriceModal
        isOpen={showUpdatePriceModal}
        onClose={() => setShowUpdatePriceModal(false)}
        currentPrice={actionPrice}
        onSuccess={() => {
          setMessage({ type: 'success', text: 'Prix mis à jour avec succès !' });
          router.refresh();
        }}
        isPending={isPending}
        onUpdatePrice={handleUpdateActionPrice}
      />
    </div>
  );
};

export default ProjectsAdminView;