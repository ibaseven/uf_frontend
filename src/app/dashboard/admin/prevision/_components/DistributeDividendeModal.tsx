"use client";
import React, { useState, useTransition } from 'react';
import {
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Users,
  TrendingUp
} from 'lucide-react';

interface DistributeDividendeModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    _id: string;
    nameProject: string;
    participants?: any[];
    stats?: {
      totalParticipants: number;
      totalPaid: number;
    };
  };
  onSuccess: () => void;
  onDistribute: (projectId: string, totalAmount: number) => Promise<any>;
  isPending?: boolean;
}

const DistributeDividendeModal: React.FC<DistributeDividendeModalProps> = ({
  isOpen,
  onClose,
  project,
  onSuccess,
  onDistribute,
  isPending: externalPending
}) => {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [totalAmount, setTotalAmount] = useState('');

  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const amount = parseFloat(totalAmount);

    if (!amount || amount <= 0) {
      setMessage({ type: 'error', text: 'Veuillez entrer un montant valide' });
      return;
    }

    startTransition(async () => {
      const result = await onDistribute(project._id, amount);

      if (result.type === 'success') {
        setMessage({
          type: 'success',
          text: `${result.message}. ${result.participantsPayes} participant(s) payé(s)`
        });
        setTimeout(() => {
          onSuccess();
          onClose();
          setTotalAmount('');
        }, 2000);
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    });
  };

  const loading = isPending || externalPending;
  const eligibleParticipants = project.participants?.filter(p =>
    p.amountPaid > 0 &&
    p.amountPaid * 10 > (p.dividendeReceived || 0)
  ) || [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Distribuer les dividendes</h2>
                <p className="text-sm text-gray-600">{project.nameProject}</p>
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

          {/* Informations du projet */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Users className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Participants éligibles</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {eligibleParticipants.length}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Sur {project.stats?.totalParticipants || 0} total
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Total investi</span>
              </div>
              <p className="text-2xl font-bold text-green-600">
                {formatAmount(project.stats?.totalPaid || 0)}
              </p>
            </div>
          </div>

          {/* Alerte si aucun participant éligible */}
          {eligibleParticipants.length === 0 && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-400 rounded-lg">
              <div className="flex items-center text-yellow-700">
                <AlertCircle className="w-5 h-5 mr-2" />
                <span className="text-sm">
                  Aucun participant éligible pour ce projet. Tous les participants ont atteint leur plafond (montant investi × 10).
                </span>
              </div>
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Montant total à distribuer (FCFA) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ex: 100000"
                  min="1"
                  step="1"
                  disabled={loading || eligibleParticipants.length === 0}
                  required
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Le montant sera distribué proportionnellement selon les investissements de chaque participant.
              </p>
            </div>

            {/* Information importante */}
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">
                ℹ️ Comment fonctionne la distribution ?
              </h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Chaque participant peut recevoir jusqu'à <strong>10× son montant investi</strong></li>
                <li>• La distribution est <strong>proportionnelle</strong> au montant investi par chaque participant</li>
                <li>• Les participants ayant atteint leur plafond ne recevront rien</li>
                <li>• Le dividende est ajouté au solde total du participant</li>
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
                disabled={loading || !totalAmount || eligibleParticipants.length === 0}
                className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Distribution en cours...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Distribuer les dividendes
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

export default DistributeDividendeModal;
