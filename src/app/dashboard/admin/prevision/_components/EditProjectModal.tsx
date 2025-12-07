"use client";
import React, { useState, useTransition } from 'react';
import { 
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  Edit
} from 'lucide-react';

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    _id: string;
    nameProject: string;
    packPrice: number;
    duration: number;
    monthlyPayment?: number;
    description?: string;
    gainProject?: number;
  };
  onSuccess: () => void;
  onUpdateProject: (projectId: string, formData: FormData) => Promise<any>;
  isPending?: boolean;
}

const EditProjectModal: React.FC<EditProjectModalProps> = ({
  isOpen,
  onClose,
  project,
  onSuccess,
  onUpdateProject,
  isPending: externalPending
}) => {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  
  const [formData, setFormData] = useState({
    nameProject: project.nameProject,
    packPrice: project.packPrice.toString(),
    duration: project.duration.toString(),
    monthlyPayment: project.monthlyPayment?.toString() || '',
    description: project.description || '',
    gainProject: project.gainProject?.toString() || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const data = new FormData();
    data.append('nameProject', formData.nameProject);
    data.append('packPrice', formData.packPrice);
    data.append('duration', formData.duration);
    if (formData.monthlyPayment) data.append('monthlyPayment', formData.monthlyPayment);
    if (formData.description) data.append('description', formData.description);
    if (formData.gainProject) data.append('gainProject', formData.gainProject);

    startTransition(async () => {
      const result = await onUpdateProject(project._id, data);
      
      if (result.type === 'success') {
        setMessage({ type: 'success', text: result.message });
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const loading = isPending || externalPending;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg mr-3">
                <Edit className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Modifier le projet</h2>
                <p className="text-sm text-gray-600">Modifiez les informations du projet</p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {message && (
            <div className={`p-4 rounded-lg ${
              message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom du projet *
            </label>
            <input
              type="text"
              name="nameProject"
              value={formData.nameProject}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
              placeholder="Ex: Élevage de poulets"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix du pack (FCFA) *
              </label>
              <input
                type="number"
                name="packPrice"
                value={formData.packPrice}
                onChange={handleChange}
                required
                min="0"
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
                placeholder="Ex: 500000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Durée (mois) *
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                min="1"
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
                placeholder="Ex: 12"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paiement mensuel (FCFA)
              </label>
              <input
                type="number"
                name="monthlyPayment"
                value={formData.monthlyPayment}
                onChange={handleChange}
                min="0"
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
                placeholder="Ex: 50000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gain du projet (FCFA)
              </label>
              <input
                type="number"
                name="gainProject"
                value={formData.gainProject}
                onChange={handleChange}
                min="0"
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
                placeholder="Ex: 100000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
              placeholder="Décrivez le projet..."
            />
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Mise à jour...
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4 mr-2" />
                  Mettre à jour
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProjectModal;