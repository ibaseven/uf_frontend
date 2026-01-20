// _components/ByActions.tsx
"use client";
import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  CheckCircle,
  X,
  DollarSign,
  TrendingUp,
  Info,
  ShoppingCart,
  Plus,
  Minus,
  Users
} from 'lucide-react';
import { buyActions } from '@/actions/actions';

interface BuyActionsViewProps {
  pricePerAction: number;
}

const BuyActionsView: React.FC<BuyActionsViewProps> = ({ pricePerAction }) => {
  const [actionNumber, setActionNumber] = useState<number>(5);
  const [parrainPhone, setParrainPhone] = useState<string>('');
  const [hasParrain, setHasParrain] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showBuyModal, setShowBuyModal] = useState(false);

  const PRICE_PER_ACTION = pricePerAction; // Utiliser le prix reçu en props
  const MIN_ACTIONS = 5;
  const STEP = 5;

  // Vérifier si l'utilisateur a déjà un parrain
  useEffect(() => {
    checkIfHasParrain();
  }, []);

  const checkIfHasParrain = async () => {
    setHasParrain(false);
  };

  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculateTotalPrice = () => {
    return actionNumber * PRICE_PER_ACTION;
  };

  const handleActionNumberChange = (value: string) => {
    const num = parseInt(value) || 0;
    const roundedNum = Math.round(num / STEP) * STEP;
    const finalNum = Math.max(MIN_ACTIONS, roundedNum);
    setActionNumber(finalNum);
  };

  const incrementActions = () => {
    setActionNumber(prev => prev + STEP);
  };

  const decrementActions = () => {
    setActionNumber(prev => Math.max(MIN_ACTIONS, prev - STEP));
  };

  const quickSelectActions = (num: number) => {
    setActionNumber(num);
  };

  const openBuyModal = () => {
    if (actionNumber < MIN_ACTIONS || actionNumber % STEP !== 0) {
      setError(`Le nombre d'actions doit être un multiple de ${STEP} (minimum ${MIN_ACTIONS})`);
      return;
    }
    setShowBuyModal(true);
    setError(null);
  };

  const handleBuyActions = async () => {
    if (actionNumber < MIN_ACTIONS || actionNumber % STEP !== 0) {
      setError(`Le nombre d'actions doit être un multiple de ${STEP} (minimum ${MIN_ACTIONS})`);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await buyActions({
        actionNumber,
        parrainPhone: parrainPhone.trim() || undefined
      });

      if (result.type === 'success') {
        setSuccess('Achat initié avec succès !');
        
        if (result.invoice?.response_text) {
          // Rediriger vers la page de paiement dans le même onglet
          window.location.href = result.invoice.response_text;
        }
      } else {
        setError(result.message || "Erreur lors de l'achat");
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError("Une erreur est survenue lors de l'achat");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowBuyModal(false);
    setError(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-blue-600">Acheter des Actions</h1>
        <p className="text-gray-600 mt-1">Investissez dans l'entreprise en achetant des actions</p>
      </div>

      {/* Messages */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <p className="text-green-800">{success}</p>
          </div>
        </div>
      )}

      {error && !showBuyModal && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Section principale */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Détails de l'achat</h2>
          <p className="text-sm text-gray-600 mt-1">
            Prix unitaire par action : <span className="font-bold text-blue-600">{formatAmount(PRICE_PER_ACTION)}</span>
          </p>
          <p className="text-xs text-orange-600 mt-1 font-medium">
            ⚠️ Achat par multiples de {STEP} actions uniquement
          </p>
        </div>

        <div className="p-6">
          <div className="max-w-md mx-auto">
            
            {/* Section Parrainage */}
            {!hasParrain && (
              <div className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <Users className="w-5 h-5 text-purple-600 mr-2" />
                  <h3 className="font-semibold text-purple-900">Code Parrainage (Optionnel)</h3>
                </div>
                <p className="text-sm text-purple-700 mb-3">
                  Entrez le numéro de téléphone de votre parrain pour lui faire bénéficier de 10% de vos achats
                </p>
                <input
                  type="tel"
                  value={parrainPhone}
                  onChange={(e) => setParrainPhone(e.target.value)}
                  placeholder="+221 XX XXX XX XX"
                  className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="text-xs text-purple-600 mt-2">
                  💡 Votre parrain recevra 10% du montant de tous vos achats futurs
                </p>
              </div>
            )}

            {/* Sélection rapide */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Sélection rapide
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 15, 20, 25, 50, 75, 100].map((num) => (
                  <button
                    key={num}
                    onClick={() => quickSelectActions(num)}
                    className={`py-2 px-3 rounded-lg border-2 transition-all ${
                      actionNumber === num
                        ? 'border-blue-600 bg-blue-50 text-blue-600 font-semibold'
                        : 'border-gray-300 hover:border-blue-400 text-gray-700'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Contrôle du nombre d'actions */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre d'actions à acheter
              </label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={decrementActions}
                  disabled={actionNumber <= MIN_ACTIONS}
                  className="p-3 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus className="w-5 h-5" />
                </button>
                
                <div className="flex-1">
                  <input
                    type="number"
                    value={actionNumber}
                    onChange={(e) => handleActionNumberChange(e.target.value)}
                    step={STEP}
                    min={MIN_ACTIONS}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg text-center font-bold"
                  />
                  <p className="text-xs text-gray-500 text-center mt-1">
                    Multiples de {STEP} uniquement
                  </p>
                </div>
                
                <button
                  onClick={incrementActions}
                  className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Affichage du prix total */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-900">Prix total</p>
                  <p className="text-xs text-blue-700 mt-1">
                    {actionNumber} action{actionNumber > 1 ? 's' : ''} × {formatAmount(PRICE_PER_ACTION)}
                  </p>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatAmount(calculateTotalPrice())}
                </div>
              </div>
            </div>

            {/* Bouton d'achat */}
            <button
              onClick={openBuyModal}
              disabled={actionNumber < MIN_ACTIONS}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-medium"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Procéder à l'achat
            </button>
          </div>
        </div>
      </div>

      {/* Informations */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-full bg-blue-100 flex-shrink-0">
            <Info className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-1">Comment ça marche ?</h3>
            <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
              <li>Achat minimum : {MIN_ACTIONS} actions</li>
              <li>Vous devez acheter par multiples de {STEP} actions (5, 10, 15, 20...)</li>
              <li>Le prix par action est de {formatAmount(PRICE_PER_ACTION)}</li>
              <li>Si vous avez un parrain, il recevra 10% de vos achats</li>
              <li>Vous serez redirigé vers une page de paiement sécurisé</li>
              <li>Une fois le paiement confirmé, les actions seront ajoutées à votre compte</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modal de confirmation */}
      {showBuyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md mx-auto shadow-2xl">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <TrendingUp className="w-7 h-7 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold text-white ml-3">Confirmer l'achat</h2>
                </div>
                <button
                  onClick={closeModal}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Nombre d'actions</span>
                    <span className="text-lg font-bold text-gray-900">{actionNumber}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Prix unitaire</span>
                    <span className="text-lg font-semibold text-gray-900">{formatAmount(PRICE_PER_ACTION)}</span>
                  </div>
                  {parrainPhone && !hasParrain && (
                    <div className="flex justify-between items-center border-t border-gray-200 pt-2">
                      <span className="text-gray-600">Parrain</span>
                      <span className="text-sm font-medium text-purple-600">{parrainPhone}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-300 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-900 font-medium">Prix total</span>
                      <span className="text-2xl font-bold text-blue-600">
                        {formatAmount(calculateTotalPrice())}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 p-6 bg-gray-50 rounded-b-lg">
              <div className="flex space-x-3">
                <button
                  onClick={closeModal}
                  disabled={loading}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleBuyActions}
                  disabled={loading}
                  className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
                >
                  {loading ? 'Traitement...' : 'Confirmer et payer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyActionsView;