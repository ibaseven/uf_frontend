"use client";

import React, { useState } from 'react';
import { 
  DollarSign, 
  FileText,
  AlertCircle,
  CheckCircle,
  Loader2,
  MinusCircle
} from 'lucide-react';

import { useRouter } from 'next/navigation';
import { deductFees } from '@/actions/actions';

interface DeductFeesFormProps {
  ownerBalance: number;
}

const DeductFeesForm: React.FC<DeductFeesFormProps> = ({ ownerBalance }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const parsedAmount = parseFloat(amount);

      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        setError('Montant invalide');
        setLoading(false);
        return;
      }

      if (parsedAmount > ownerBalance) {
        setError(`Solde insuffisant. Disponible: ${ownerBalance.toLocaleString()} FCFA`);
        setLoading(false);
        return;
      }

      if (!description.trim()) {
        setError('Description requise');
        setLoading(false);
        return;
      }

      const result = await deductFees({
        montant: parsedAmount,
        description: description.trim()
      });

      if (result.type === 'success') {
        setSuccess(result.message || 'Frais déduits avec succès !');
        setAmount('');
        setDescription('');
        
        // Rafraîchir la page après 2 secondes
        setTimeout(() => {
          router.refresh();
        }, 2000);
      } else {
        setError(result.message || 'Erreur lors de la déduction');
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start">
          <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-start">
          <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
          <p className="text-green-800 text-sm">{success}</p>
        </div>
      )}

      {/* Formulaire */}
      <form onSubmit={handleSubmit}>
        <div className="flex items-center mb-6">
          <MinusCircle className="w-8 h-8 text-purple-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">Déduire des Frais Owner</h2>
        </div>

        {/* Info Solde */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-purple-700 mb-1">Solde Owner disponible</p>
          <p className="text-2xl font-bold text-purple-900">{ownerBalance.toLocaleString()} FCFA</p>
        </div>

        {/* Montant */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <DollarSign className="w-4 h-4 inline mr-2" />
            Montant à déduire (FCFA)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Ex: 5000"
            min="1"
            max={ownerBalance}
            step="0.01"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Maximum: {ownerBalance.toLocaleString()} FCFA
          </p>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FileText className="w-4 h-4 inline mr-2" />
            Description / Motif
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: Frais de maintenance serveur, Frais administratifs..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Expliquez la raison de cette déduction
          </p>
        </div>

        {/* Aperçu */}
        {amount && parseFloat(amount) > 0 && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
            <p className="text-sm font-medium text-purple-900 mb-2">Aperçu de l'opération :</p>
            <div className="space-y-1 text-sm text-purple-700">
              <p>Montant à déduire : <span className="font-bold">{parseFloat(amount).toLocaleString()} FCFA</span></p>
              <p>Nouveau solde Owner : <span className="font-bold">
                {(ownerBalance - parseFloat(amount)).toLocaleString()} FCFA
              </span></p>
            </div>
          </div>
        )}

        {/* Bouton */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Déduction en cours...
            </>
          ) : (
            <>
              <MinusCircle className="w-5 h-5 mr-2" />
              Déduire les frais
            </>
          )}
        </button>
      </form>

      {/* Avertissement */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-800">
            <p className="font-medium mb-1">⚠️ Attention</p>
            <p>Cette action déduira des fonds du compte Owner. L'owner recevra une notification WhatsApp.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeductFeesForm;
