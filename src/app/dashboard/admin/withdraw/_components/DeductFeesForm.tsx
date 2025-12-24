"use client";

import React, { useState } from 'react';
import { 
  DollarSign, 
  FileText,
  AlertCircle,
  CheckCircle,
  Loader2,
  MinusCircle,
  Briefcase,
  TrendingUp
} from 'lucide-react';

import { useRouter } from 'next/navigation';
import { deductFees } from '@/actions/actions';

interface DeductFeesFormProps {
  ownerBalanceActions: number;
  ownerBalanceProject: number;
}

type DividendeType = 'actions' | 'project';

const DeductFeesForm: React.FC<DeductFeesFormProps> = ({ 
  ownerBalanceActions,
  ownerBalanceProject
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [dividendeType, setDividendeType] = useState<DividendeType>('actions');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Obtenir le solde Owner actuel en fonction du type sélectionné
  const getCurrentBalance = () => {
    return dividendeType === 'actions' ? ownerBalanceActions : ownerBalanceProject;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const parsedAmount = parseFloat(amount);
      const currentBalance = getCurrentBalance();

      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        setError('Montant invalide');
        setLoading(false);
        return;
      }

      if (parsedAmount > currentBalance) {
        setError(`Solde insuffisant. Disponible: ${currentBalance.toLocaleString()} FCFA`);
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
        description: description.trim(),
        dividendeType // Envoyer le type de dividende
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
      {/* Soldes Owner Disponibles - 2 Cartes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className={`rounded-lg p-6 shadow-lg text-white transition-all cursor-pointer ${
          dividendeType === 'actions' 
            ? 'bg-gradient-to-br from-purple-600 to-purple-700 ring-4 ring-purple-300' 
            : 'bg-gradient-to-br from-purple-500 to-purple-600 opacity-60'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm opacity-90">Owner - Actions</p>
            <Briefcase className="w-5 h-5 opacity-80" />
          </div>
          <p className="text-3xl font-bold">{ownerBalanceActions.toLocaleString()} FCFA</p>
          {dividendeType === 'actions' && (
            <p className="text-xs mt-2 opacity-80">✓ Sélectionné</p>
          )}
        </div>
        
        <div className={`rounded-lg p-6 shadow-lg text-white transition-all cursor-pointer ${
          dividendeType === 'project' 
            ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 ring-4 ring-indigo-300' 
            : 'bg-gradient-to-br from-indigo-500 to-indigo-600 opacity-60'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm opacity-90">Owner - Projets</p>
            <TrendingUp className="w-5 h-5 opacity-80" />
          </div>
          <p className="text-3xl font-bold">{ownerBalanceProject.toLocaleString()} FCFA</p>
          {dividendeType === 'project' && (
            <p className="text-xs mt-2 opacity-80">✓ Sélectionné</p>
          )}
        </div>
      </div>

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
      <div className="bg-white rounded-lg shadow-lg p-6">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center mb-6">
            <MinusCircle className="w-8 h-8 text-purple-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Déduire des Frais Owner</h2>
          </div>

          {/* Sélection du type de dividende */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Type de dividende Owner à déduire
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setDividendeType('actions')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  dividendeType === 'actions'
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-center mb-2">
                  <Briefcase className="w-5 h-5 mr-2" />
                  <span className="font-semibold">Owner - Actions</span>
                </div>
                <div className="text-sm">{ownerBalanceActions.toLocaleString()} FCFA</div>
              </button>

             
            </div>
          </div>

          {/* Montant */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="w-4 h-4 inline mr-2" />
              Montant à déduire (FCFA)
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Ex: 5000"
                min="1"
                max={getCurrentBalance()}
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={() => setAmount(getCurrentBalance().toString())}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                MAX
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Maximum: {getCurrentBalance().toLocaleString()} FCFA
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
                <p>Type : <span className="font-bold">
                  {dividendeType === 'actions' ? 'Owner - Actions' : 'Owner - Projets'}
                </span></p>
                <p>Montant à déduire : <span className="font-bold">{parseFloat(amount).toLocaleString()} FCFA</span></p>
                <p>Nouveau solde Owner : <span className="font-bold">
                  {(getCurrentBalance() - parseFloat(amount)).toLocaleString()} FCFA
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
      </div>

      {/* Avertissement */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-800">
            <p className="font-medium mb-1">⚠️ Attention</p>
            <p>Cette action déduira des fonds du compte Owner ({dividendeType === 'actions' ? 'Actions' : 'Projets'}). L'owner recevra une notification WhatsApp.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeductFeesForm;