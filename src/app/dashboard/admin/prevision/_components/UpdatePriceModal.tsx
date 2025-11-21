// app/dashboard/projects/_components/UpdateActionPriceModal.tsx
"use client";
import React, { useState } from 'react';
import { 
  X, 
  Save, 
  AlertCircle,
  CheckCircle,
  DollarSign,
  Loader2
} from 'lucide-react';

interface UpdateActionPriceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPrice: number;
  onSuccess: () => void;
  isPending: boolean;
  onUpdatePrice: (formData: FormData) => Promise<any>;
}

const UpdateActionPriceModal: React.FC<UpdateActionPriceModalProps> = ({
  isOpen,
  onClose,
  currentPrice,
  onSuccess,
  isPending,
  onUpdatePrice
}) => {
  const [formData, setFormData] = useState({
    newPrice: currentPrice.toString()
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    const price = Number(formData.newPrice);
    if (!formData.newPrice || isNaN(price) || price <= 0) {
      newErrors.newPrice = 'Le prix doit être un nombre positif';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const submitData = new FormData();
      submitData.append('newPrice', formData.newPrice);

      const result = await onUpdatePrice(submitData);
      
      if (result && result.type === 'success') {
        setMessage({ type: 'success', text: 'Prix mis à jour avec succès !' });
        setTimeout(() => {
          onSuccess();
          onClose();
          resetForm();
        }, 2000);
      } else {
        setMessage({ 
          type: 'error', 
          text: result?.message || 'Erreur lors de la mise à jour du prix' 
        });
        setIsSubmitting(false);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour du prix' });
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      newPrice: currentPrice.toString()
    });
    setErrors({});
    setMessage(null);
    setIsSubmitting(false);
  };

  const handleClose = () => {
    if (!isPending && !isSubmitting) {
      resetForm();
      onClose();
    }
  };

  if (!isOpen) return null;

  const isLoading = isPending || isSubmitting;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Modifier le Prix d'une Action</h2>
            </div>
            <button onClick={handleClose} disabled={isLoading} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Message */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              <div className="flex items-center">
                {message.type === 'success' ? <CheckCircle className="w-5 h-5 mr-2" /> : <AlertCircle className="w-5 h-5 mr-2" />}
                {message.text}
              </div>
            </div>
          )}

          <div className="space-y-4">
            {/* Prix actuel */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Prix actuel</div>
              <div className="text-2xl font-bold text-gray-900">
                {formatAmount(currentPrice)}
              </div>
            </div>

            {/* Nouveau prix */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nouveau prix (FCFA) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="newPrice"
                value={formData.newPrice}
                onChange={handleInputChange}
                disabled={isLoading}
                min="1"
                step="1"
                className={`w-full px-3 py-2 border rounded-lg ${errors.newPrice ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.newPrice && <p className="text-red-500 text-xs mt-1">{errors.newPrice}</p>}
            </div>

            {/* Aperçu du nouveau prix */}
            {!errors.newPrice && formData.newPrice && Number(formData.newPrice) > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-sm text-blue-700 mb-1">Nouveau prix</div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatAmount(Number(formData.newPrice))}
                </div>
              </div>
            )}

            {/* Avertissement */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-orange-600 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-orange-800">
                  <strong>Attention :</strong> Cette modification affectera tous les futurs achats d'actions.
                </p>
              </div>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isLoading ? 'Mise à jour...' : 'Mettre à jour'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateActionPriceModal;