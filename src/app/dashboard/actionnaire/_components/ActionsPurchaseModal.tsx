"use client";
import React, { useState, useTransition, useEffect } from 'react';
import {
  Wallet,
  AlertCircle,
  Loader2,
  X,
  Plus,
  Minus,
  Users,
  Phone,
  UserCheck
} from 'lucide-react';
import { buyActions } from '@/actions/actions';

interface ActionsPurchaseModalProps {
  currentActions?: number;
  currentDividends?: number;
  userInfo?: {
    firstName?: string;
    lastName?: string;
    telephone?: string;
    telephonePartenaire?: string;
  };
  isOpen?: boolean;
  onClose?: () => void;
}

const ActionsPurchaseModal: React.FC<ActionsPurchaseModalProps> = ({
  userInfo,
  isOpen = false,
  onClose
}) => {
  const [isModalOpen, setIsModalOpen] = useState(isOpen);
  const [nombreActions, setNombreActions] = useState<number>(5);
  const [telephonePartenaire, setTelephonePartenaire] = useState("");
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ type: string; message: string } | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const PRIX_UNITAIRE = 2000;
  const MIN_ACTIONS = 5;
  const STEP = 5;
  const MAX_ACTIONS = 100;

  useEffect(() => {
    if (userInfo?.telephonePartenaire) {
      setTelephonePartenaire(userInfo.telephonePartenaire);
    }
  }, [userInfo]);

  useEffect(() => {
    setIsModalOpen(isOpen);
  }, [isOpen]);

  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
  };

  const totalAmount = nombreActions * PRIX_UNITAIRE;

  const incrementActions = () => {
    if (nombreActions + STEP <= MAX_ACTIONS) {
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
    if (amount >= MIN_ACTIONS && amount <= MAX_ACTIONS) {
      setNombreActions(amount);
      setResult(null);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
    setNombreActions(5);
    setTelephonePartenaire(userInfo?.telephonePartenaire || "");
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
        const response = await buyActions({
          actionNumber: nombreActions,
          parrainPhone: telephonePartenaire || undefined
        });

        if (response.type === 'success') {
          const paymentUrl = response.invoice?.response_text;

          // Rediriger directement vers PayDunya
          if (paymentUrl) {
            window.location.href = paymentUrl;
          } else {
            setResult({
              type: "error",
              message: "URL de paiement non disponible"
            });
          }
        } else {
          setResult({
            type: "error",
            message: response.message || "Erreur lors de l'achat"
          });
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
    setShowConfirmation(true);
  };

  const PurchaseButton = () => (
    !isOpen ? (
      <button
        onClick={openModal}
        className="bg-[#165DFC] text-white font-medium py-2 px-4 rounded-lg hover:bg-[#1249cc] transition duration-300 flex items-center"
      >
        <Plus className="w-4 h-4 mr-2" />
        Acheter des actions
      </button>
    ) : null
  );

  const isExistingPartner = userInfo?.telephonePartenaire && telephonePartenaire === userInfo.telephonePartenaire;
  const isValid = nombreActions >= MIN_ACTIONS && nombreActions <= MAX_ACTIONS && nombreActions % STEP === 0;

  const quickAmounts = [5, 10, 20, 50, 100].filter(amount => amount <= MAX_ACTIONS);

  return (
    <>
      <PurchaseButton />
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#165DFC] to-[#1e4fd6] p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    <Wallet className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Acheter des actions</h2>
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
              {/* Sélecteur de quantité */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Nombre d'actions à acheter
                </label>

                {/* Compteur principal */}
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <button
                    onClick={decrementActions}
                    disabled={nombreActions <= MIN_ACTIONS || isPending}
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
                    disabled={nombreActions + STEP > MAX_ACTIONS || isPending}
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
                        disabled={isPending}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition ${nombreActions === amount
                          ? 'bg-[#165DFC] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                      >
                        {amount}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Section Partenaire */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Users className="w-4 h-4 mr-1 text-[#165DFC]" />
                  Partenaire de parrainage (optionnel)
                </label>

                {/* Affichage du partenaire existant */}
                {isExistingPartner ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center">
                      <UserCheck className="w-5 h-5 text-green-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-green-800">Partenaire actuel</p>
                        <p className="text-sm text-green-600">{telephonePartenaire}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-amber-600 mb-2">
                      Renseignez le numéro donné par votre parrain
                    </p>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={telephonePartenaire}
                        onChange={(e) => setTelephonePartenaire(e.target.value)}
                        className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+221 XX XXX XX XX"
                        disabled={isPending}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Ex: +221700000000</p>
                  </div>
                )}
              </div>

              {/* Récapitulatif */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-600">Coût total</span>
                  <span className="text-2xl font-bold text-[#165DFC]">{formatAmount(totalAmount)}</span>
                </div>

                {telephonePartenaire && (
                  <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-200">
                    <span className="text-gray-500">Bonus partenaire (10%)</span>
                    <span className="font-semibold text-green-600">{formatAmount(totalAmount * 0.1)}</span>
                  </div>
                )}
              </div>

              {/* Message d'erreur */}
              {result?.type === "error" && (
                <div className="flex items-center p-4 rounded-xl mb-4 bg-red-50">
                  <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 text-red-500" />
                  <span className="text-sm text-red-700">{result.message}</span>
                </div>
              )}

              {/* Confirmation */}
              {showConfirmation ? (
                <div className="space-y-3">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <p className="text-yellow-800 text-center">
                      Confirmer l'achat de <span className="font-bold">{nombreActions} actions</span> pour <span className="font-bold">{formatAmount(totalAmount)}</span> ?
                      {telephonePartenaire && (
                        <>
                          <br />
                          <span className="text-sm">Parrain: {telephonePartenaire}</span>
                        </>
                      )}
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
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ActionsPurchaseModal;
