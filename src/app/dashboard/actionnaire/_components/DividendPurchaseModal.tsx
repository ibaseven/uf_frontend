"use client";
import React, { useState, useTransition } from 'react';
import {
  Wallet,
  AlertCircle,
  CheckCircle,
  Loader2,
  X,
  Plus,
  Minus,
  TrendingUp,
  FileText,
} from 'lucide-react';
import { purchaseActionsWithDividends } from '@/actions/actions';

interface ActionsPurchaseModalProps {
  currentActions?: number;
  currentDividends?: number;
  userInfo?: {
    firstName: string;
    lastName: string;
    telephone: string;
  };
  isOpen?: boolean;
  onClose?: () => void;
}

interface PurchaseResponse {
  type: "success" | "error";
  message: string;
  data?: {
    action?: any;
    transaction?: any;
    newDividendBalance?: number;
    newActionsNumber?: number;
    totalPaid?: number;
  };
  errors?: any;
}

const DividendPurchaseModal: React.FC<ActionsPurchaseModalProps> = ({
  currentActions = 0,
  currentDividends = 0,
  userInfo,
  isOpen = false,
  onClose
}) => {
  const [isModalOpen, setIsModalOpen] = useState(isOpen);
  const [nombreActions, setNombreActions] = useState<number>(5);
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<PurchaseResponse | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  React.useEffect(() => {
    setIsModalOpen(isOpen);
  }, [isOpen]);

  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
  };

  const PRIX_UNITAIRE = 2000;
  const MIN_ACTIONS = 5;
  const STEP = 5;

  // Calcul du maximum achetable (arrondi au multiple de 5 inférieur)
  const maxAchetable = Math.floor(currentDividends / PRIX_UNITAIRE / STEP) * STEP;

  // Coût total
  const totalAmount = nombreActions * PRIX_UNITAIRE;

  // Pourcentage des dividendes utilisés
  const pourcentageUtilise = currentDividends > 0 ? (totalAmount / currentDividends) * 100 : 0;

  // Validation
  const isValid = nombreActions >= MIN_ACTIONS && nombreActions % STEP === 0 && totalAmount <= currentDividends;

  const incrementActions = () => {
    if (nombreActions + STEP <= maxAchetable) {
      setNombreActions(prev => prev + STEP);
      setResult(null);
    }
  };

  const decrementActions = () => {
    if (nombreActions - STEP >= MIN_ACTIONS) {
      setNombreActions(prev => prev - STEP);
      setResult(null);
    }
  };

  const setQuickAmount = (amount: number) => {
    if (amount <= maxAchetable && amount >= MIN_ACTIONS) {
      setNombreActions(amount);
      setResult(null);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
    setNombreActions(Math.min(MIN_ACTIONS, maxAchetable) || MIN_ACTIONS);
    setResult(null);
    setShowConfirmation(false);
  };

  const closeModal = () => {
    if (onClose) {
      onClose();
    } else {
      setIsModalOpen(false);
    }
    setResult(null);
    setShowConfirmation(false);
  };

  const handlePurchase = () => {
    startTransition(async () => {
      try {
        const response = await purchaseActionsWithDividends({
          nombre_actions: nombreActions
        });

        setResult(response);
        setShowConfirmation(false);

        if (response.type === "success") {
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        }
      } catch (error) {
        setResult({
          type: "error",
          message: "Une erreur est survenue lors de l'achat"
        });
      }
    });
  };

  const confirmPurchase = () => {
    if (totalAmount > currentDividends) {
      setResult({
        type: "error",
        message: `Dividendes insuffisants`
      });
      return;
    }
    setShowConfirmation(true);
  };

  const PurchaseButton = () => (
    !isOpen ? (
      <button
        onClick={openModal}
        className="bg-[#165DFC] text-white font-medium py-2 px-4 rounded-lg hover:bg-[#1249cc] transition duration-300 flex items-center"
      >
        <Wallet className="w-4 h-4 mr-2" />
        Acheter avec dividendes
      </button>
    ) : null
  );

  // Boutons de sélection rapide
  const quickAmounts = [5, 10, 20, 50, 100].filter(amount => amount <= maxAchetable);

  // Écran de succès
  if (result?.type === "success") {
    return (
      <>
        <PurchaseButton />
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
              {/* Header succès */}
              <div className="bg-gradient-to-r from-[#165DFC] to-[#1e4fd6] p-6 text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-[#165DFC]" />
                </div>
                <h2 className="text-2xl font-bold text-white">Achat réussi !</h2>
              </div>

              <div className="p-6">
                {result.data && (
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                      <div className="flex items-center">
                        <TrendingUp className="w-5 h-5 text-[#165DFC] mr-3" />
                        <span className="text-gray-700">Nouvelles actions</span>
                      </div>
                      <span className="text-xl font-bold text-[#165DFC]">
                        +{result.data.newActionsNumber ? result.data.newActionsNumber - currentActions : nombreActions}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <span className="text-gray-600">Montant déduit</span>
                      <span className="font-semibold text-gray-900">{formatAmount(result.data.totalPaid || 0)}</span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <span className="text-gray-600">Dividendes restants</span>
                      <span className="font-semibold text-gray-900">{formatAmount(result.data.newDividendBalance || 0)}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center p-4 bg-blue-50 rounded-xl mb-6">
                  <FileText className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                  <p className="text-sm text-blue-700">
                    Votre contrat PDF sera envoyé sur WhatsApp
                  </p>
                </div>

                <button
                  onClick={closeModal}
                  className="w-full bg-[#165DFC] text-white font-semibold py-4 rounded-xl hover:bg-[#1249cc] transition"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <PurchaseButton />
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#165DFC] to-[#1e4fd6] p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    <Wallet className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Acheter avec dividendes</h2>
                    <p className="text-blue-100 text-sm">1 action = {formatAmount(PRIX_UNITAIRE)}</p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="text-white/80 hover:text-white transition p-2"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Solde disponible */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Vos dividendes disponibles</span>
                  <span className="text-xl font-bold text-gray-900">{formatAmount(currentDividends)}</span>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  Vous pouvez acheter jusqu'à <span className="font-semibold text-[#165DFC]">{maxAchetable} actions</span>
                </div>
              </div>

              {maxAchetable < MIN_ACTIONS ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-yellow-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Dividendes insuffisants</h3>
                  <p className="text-gray-600 mb-4">
                    Il vous faut au moins <span className="font-semibold">{formatAmount(MIN_ACTIONS * PRIX_UNITAIRE)}</span> pour acheter {MIN_ACTIONS} actions.
                  </p>
                  <button
                    onClick={closeModal}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  >
                    Fermer
                  </button>
                </div>
              ) : (
                <>
                  {/* Sélecteur de quantité */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Nombre d'actions à acheter
                    </label>

                    {/* Compteur principal */}
                    <div className="flex items-center justify-center space-x-4 mb-4">
                      <button
                        onClick={decrementActions}
                        disabled={nombreActions <= MIN_ACTIONS}
                        className="w-14 h-14 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition"
                      >
                        <Minus className="w-6 h-6 text-gray-700" />
                      </button>

                      <div className="text-center min-w-[120px]">
                        <div className="text-4xl font-bold text-gray-900">{nombreActions}</div>
                        <div className="text-sm text-gray-500">actions</div>
                      </div>

                      <button
                        onClick={incrementActions}
                        disabled={nombreActions + STEP > maxAchetable}
                        className="w-14 h-14 rounded-full bg-blue-100 hover:bg-blue-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition"
                      >
                        <Plus className="w-6 h-6 text-[#165DFC]" />
                      </button>
                    </div>

                    {/* Boutons de sélection rapide */}
                    {quickAmounts.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-2">
                        {quickAmounts.map(amount => (
                          <button
                            key={amount}
                            onClick={() => setQuickAmount(amount)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                              nombreActions === amount
                                ? 'bg-[#165DFC] text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {amount}
                          </button>
                        ))}
                        {maxAchetable > 100 && (
                          <button
                            onClick={() => setQuickAmount(maxAchetable)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                              nombreActions === maxAchetable
                                ? 'bg-[#165DFC] text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            Max ({maxAchetable})
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Récapitulatif */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-gray-600">Coût total</span>
                      <span className="text-2xl font-bold text-[#165DFC]">{formatAmount(totalAmount)}</span>
                    </div>

                    {/* Barre de progression */}
                    <div className="mb-2">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            pourcentageUtilise > 100 ? 'bg-red-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${Math.min(pourcentageUtilise, 100)}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">{Math.round(pourcentageUtilise)}% de vos dividendes</span>
                      <span className="text-gray-600">
                        Reste: <span className="font-semibold">{formatAmount(Math.max(0, currentDividends - totalAmount))}</span>
                      </span>
                    </div>
                  </div>

                  {/* Message d'erreur */}
                  {result?.type === "error" && (
                    <div className="flex items-center p-4 bg-red-50 rounded-xl mb-4">
                      <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                      <span className="text-red-700 text-sm">{result.message}</span>
                    </div>
                  )}

                  {/* Confirmation */}
                  {showConfirmation ? (
                    <div className="space-y-3">
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                        <p className="text-yellow-800 text-center">
                          Confirmer l'achat de <span className="font-bold">{nombreActions} actions</span> pour <span className="font-bold">{formatAmount(totalAmount)}</span> ?
                        </p>
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => setShowConfirmation(false)}
                          disabled={isPending}
                          className="flex-1 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition disabled:opacity-50"
                        >
                          Annuler
                        </button>
                        <button
                          onClick={handlePurchase}
                          disabled={isPending}
                          className="flex-1 py-3 bg-[#165DFC] text-white font-semibold rounded-xl hover:bg-[#1249cc] transition disabled:opacity-50 flex items-center justify-center"
                        >
                          {isPending ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              Traitement...
                            </>
                          ) : (
                            'Confirmer'
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex space-x-3">
                      <button
                        onClick={closeModal}
                        className="flex-1 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={confirmPurchase}
                        disabled={!isValid || isPending}
                        className="flex-1 py-3 bg-[#165DFC] text-white font-semibold rounded-xl hover:bg-[#1249cc] transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Acheter {nombreActions} actions
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DividendPurchaseModal;
