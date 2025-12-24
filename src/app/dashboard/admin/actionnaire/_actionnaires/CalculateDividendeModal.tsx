"use client";
import React, { useState, useTransition } from 'react';
import {
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Users,
  Calculator,
  TrendingUp
} from 'lucide-react';

interface CalculateDividendeModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalActionnaires: number;
  totalActions: number;
  onSuccess: () => void;
  onCalculate: (priceAction: number) => Promise<any>;
  isPending?: boolean;
}

const CalculateDividendeModal: React.FC<CalculateDividendeModalProps> = ({
  isOpen,
  onClose,
  totalActionnaires,
  totalActions,
  onSuccess,
  onCalculate,
  isPending: externalPending
}) => {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [priceAction, setPriceAction] = useState('');

  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculateEstimatedTotal = (): number => {
    const price = parseFloat(priceAction);
    if (!price || price <= 0) return 0;
    return totalActions * price;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const price = parseFloat(priceAction);

    if (!price || price <= 0) {
      setMessage({ type: 'error', text: 'Veuillez entrer un prix d\'action valide' });
      return;
    }

    startTransition(async () => {
      const result = await onCalculate(price);

      if (result.type === 'success') {
        setMessage({
          type: 'success',
          text: `${result.message}. ${result.totalActionnaires} actionnaire(s) payé(s)`
        });
        setTimeout(() => {
          onSuccess();
          onClose();
          setPriceAction('');
        }, 2000);
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    });
  };

  const loading = isPending || externalPending;
  const estimatedTotal = calculateEstimatedTotal();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <Calculator className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Calculer les dividendes</h2>
                <p className="text-sm text-gray-600">Distribution pour tous les actionnaires</p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Message de notification */}
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

          {/* Statistiques */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Users className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Total actionnaires</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {totalActionnaires}
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Total actions</span>
              </div>
              <p className="text-2xl font-bold text-green-600">
                {totalActions.toLocaleString('fr-FR')}
              </p>
            </div>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix de l'action (FCFA) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={priceAction}
                  onChange={(e) => setPriceAction(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 1000"
                  min="0.01"
                  step="0.01"
                  disabled={loading}
                  required
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Ce montant sera multiplié par le nombre d'actions de chaque actionnaire
              </p>
            </div>

            {/* Estimation du total */}
            {estimatedTotal > 0 && (
              <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-yellow-900 mb-2 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Montant total estimé à distribuer
                </h4>
                <p className="text-2xl font-bold text-yellow-700">
                  {formatAmount(estimatedTotal)}
                </p>
                <p className="text-xs text-yellow-600 mt-1">
                  ({totalActions.toLocaleString('fr-FR')} actions × {formatAmount(parseFloat(priceAction))})
                </p>
              </div>
            )}

            {/* Information importante */}
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">
                ℹ️ Comment fonctionne le calcul ?
              </h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Chaque actionnaire reçoit : <strong>nombre d'actions × prix de l'action</strong></li>
                <li>• Le dividende est <strong>ajouté au solde</strong> de chaque actionnaire</li>
                <li>• Tous les actionnaires actifs reçoivent leurs dividendes</li>
                <li>• Une entrée est créée dans l'historique des actions</li>
              </ul>
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading || !priceAction}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Calcul en cours...
                  </>
                ) : (
                  <>
                    <Calculator className="w-5 h-5 mr-2" />
                    Calculer et distribuer
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CalculateDividendeModal;
