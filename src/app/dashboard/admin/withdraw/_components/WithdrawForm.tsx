"use client";
import React, { useState } from 'react';
import { 
  Wallet, 
  Phone, 
  DollarSign, 
  CreditCard, 
  Lock,
  AlertCircle,
  CheckCircle,
  Loader2,
  ArrowRight,
  Briefcase,
  TrendingUp
} from 'lucide-react';
import { 
  initiateWithdrawActions, 
  initiateWithdrawProject,
  confirmWithdrawActions,
  confirmWithdrawProjects
} from '@/actions/withdrawActions';
import { useRouter } from 'next/navigation';

interface WithdrawFormProps {
  dividendeActions: number;
  dividendeProject: number;
  adminId: string;
}

type DividendeType = 'actions' | 'project';

const PAYMENT_METHODS = [
  { value: 'wave-senegal', label: 'Wave Sénégal' },
  { value: 'orange-money-senegal', label: 'Orange Money Sénégal' },
  { value: 'free-money-senegal', label: 'Free Money Sénégal' },
  { value: 'expresso-senegal', label: 'Expresso Sénégal' },
  { value: 'mtn-benin', label: 'MTN Bénin' },
  { value: 'moov-benin', label: 'Moov Bénin' },
  { value: 'mtn-ci', label: 'MTN Côte d\'Ivoire' },
  { value: 'orange-money-ci', label: 'Orange Money Côte d\'Ivoire' },
  { value: 'moov-ci', label: 'Moov Côte d\'Ivoire' },
  { value: 'wave-ci', label: 'Wave Côte d\'Ivoire' },
  { value: 't-money-togo', label: 'T-Money Togo' },
  { value: 'moov-togo', label: 'Moov Togo' },
  { value: 'orange-money-mali', label: 'Orange Money Mali' },
  { value: 'orange-money-burkina', label: 'Orange Money Burkina Faso' },
  { value: 'moov-burkina-faso', label: 'Moov Burkina Faso' },
  { value: 'paydunya', label: 'Paydunya' }
];

const WithdrawForm: React.FC<WithdrawFormProps> = ({ 
  dividendeActions,
  dividendeProject,
  adminId
}) => {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  
  // Étape 1
  const [dividendeType, setDividendeType] = useState<DividendeType>('actions');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('wave-senegal');
  
  // Étape 2
  const [otpCode, setOtpCode] = useState('');
  const [reference, setReference] = useState('');
  
  // Messages
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Obtenir le solde actuel en fonction du type sélectionné
  const getCurrentBalance = () => {
    return dividendeType === 'actions' ? dividendeActions : dividendeProject;
  };

  // ========================================
  // ÉTAPE 1: INITIER LE RETRAIT
  // ========================================
  
  const handleInitiate = async (e: React.FormEvent) => {
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

      // Appeler la fonction appropriée selon le type
      let result;
      if (dividendeType === 'actions') {
        result = await initiateWithdrawActions({
          phoneNumber,
          amount: parsedAmount,
          paymentMethod
        });
      } else {
        result = await initiateWithdrawProject({
          phoneNumber,
          amount: parsedAmount,
          paymentMethod
        });
      }

      if (result.type === 'success') {
        setSuccess(result.message || 'Code OTP envoyé par WhatsApp');
        setReference(result.data?.reference || '');
        setStep(2);
      } else {
        setError(result.message || 'Erreur lors de l\'initiation');
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // ÉTAPE 2: CONFIRMER AVEC OTP
  // ========================================
  
  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (otpCode.length !== 6) {
        setError('Le code OTP doit contenir 6 chiffres');
        setLoading(false);
        return;
      }

      // Appeler la fonction de confirmation appropriée selon le type
      let result;
      if (dividendeType === 'actions') {
        result = await confirmWithdrawActions({
          otpCode
        });
      } else {
        result = await confirmWithdrawProjects({
          otpCode
        });
      }

      if (result.type === 'success') {
        setSuccess(result.message || 'Retrait effectué avec succès !');
        
        // Rediriger vers la page de l'admin après 2 secondes
        setTimeout(() => {
          router.push(`/admin/withdraw`);
          router.refresh(); // Rafraîchir pour obtenir le nouveau solde
        }, 2000);
      } else {
        setError(result.message || 'Code OTP incorrect');
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // RENDU
  // ========================================

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

      {/* Indicateur d'étapes */}
      <div className="flex items-center justify-center mb-8">
        <div className={`flex items-center ${step === 1 ? 'text-blue-600' : 'text-green-600'}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
            step === 1 ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
          }`}>
            {step === 1 ? '1' : '✓'}
          </div>
          <span className="ml-2 font-medium">Montant</span>
        </div>
        
        <div className="w-16 h-1 mx-4 bg-gray-300"></div>
        
        <div className={`flex items-center ${step === 2 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
            step === 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
          }`}>
            2
          </div>
          <span className="ml-2 font-medium">Confirmation</span>
        </div>
      </div>

      {/* Formulaires */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        {step === 1 ? (
          /* ÉTAPE 1: INITIER */
          <form onSubmit={handleInitiate}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Retirer de l'argent</h2>

            {/* Sélection du type de dividende */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Type de dividende à retirer
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setDividendeType('actions')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    dividendeType === 'actions'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-center mb-2">
                    <Briefcase className="w-5 h-5 mr-2" />
                    <span className="font-semibold">Actions</span>
                  </div>
                  <div className="text-sm">{dividendeActions.toLocaleString()} FCFA</div>
                </button>

                <button
                  type="button"
                  onClick={() => setDividendeType('project')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    dividendeType === 'project'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    <span className="font-semibold">Projets</span>
                  </div>
                  <div className="text-sm">{dividendeProject.toLocaleString()} FCFA</div>
                </button>
              </div>
            </div>

            {/* Numéro de téléphone */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Numéro de téléphone
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+221 77 123 45 67"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Le numéro qui recevra l'argent</p>
            </div>

            {/* Montant */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-2" />
                Montant (FCFA)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Ex: 10000"
                  min="100"
                  max={getCurrentBalance()}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setAmount(getCurrentBalance().toString())}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  MAX
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Minimum: 200 FCFA | Maximum: {getCurrentBalance().toLocaleString()} FCFA
              </p>
            </div>

            {/* Méthode de paiement */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <CreditCard className="w-4 h-4 inline mr-2" />
                Méthode de paiement
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                required
              >
                {PAYMENT_METHODS.map((method) => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Bouton */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  Continuer
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* ÉTAPE 2: CONFIRMER */
          <form onSubmit={handleConfirm}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Confirmer le retrait</h2>

            {/* Récapitulatif */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-2">Récapitulatif</p>
              <div className="space-y-1">
                <p className="text-lg font-semibold">{parseFloat(amount).toLocaleString()} FCFA</p>
                <p className="text-sm text-gray-600">Type: {dividendeType === 'actions' ? 'Dividendes Actions' : 'Dividendes Projets'}</p>
                <p className="text-sm text-gray-600">Vers: {phoneNumber}</p>
                <p className="text-xs text-gray-500">Référence: {reference}</p>
              </div>
            </div>

            {/* Code OTP */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Lock className="w-4 h-4 inline mr-2" />
                Code de confirmation (6 chiffres)
              </label>
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl font-mono tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <p className="text-xs text-gray-500 mt-1 text-center">
                Code envoyé par SMS (valide 5 minutes)
              </p>
            </div>

            {/* Boutons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setOtpCode('');
                  setError('');
                  setSuccess('');
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Retour
              </button>
              <button
                type="submit"
                disabled={loading || otpCode.length !== 6}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Confirmation...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Confirmer
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default WithdrawForm;