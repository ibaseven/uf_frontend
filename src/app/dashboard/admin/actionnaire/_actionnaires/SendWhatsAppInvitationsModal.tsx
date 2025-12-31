"use client";
import React, { useState, useTransition } from 'react';
import { X, Send, CheckCircle, AlertCircle, MessageCircle } from 'lucide-react';
import { sendPasswordsToActionnaires } from '@/actions/actionnaires';
import { useRouter } from 'next/navigation';

interface SendWhatsAppInvitationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SendWhatsAppInvitationsModal: React.FC<SendWhatsAppInvitationsModalProps> = ({
  isOpen,
  onClose
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [result, setResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleSendInvitations = () => {
    setMessage(null);
    setResult(null);

    startTransition(async () => {
      try {
        const response = await sendPasswordsToActionnaires();

        if (response.type === 'success') {
          setMessage({
            type: 'success',
            text: response.message
          });
          setResult({
            totalActionnaires: response.totalActionnaires,
            totalSent: response.totalSent,
            totalErrors: response.totalErrors
          });
          router.refresh();
        } else {
          setMessage({
            type: 'error',
            text: response.message
          });
        }
      } catch (error) {
        setMessage({
          type: 'error',
          text: "Une erreur s'est produite lors de l'envoi des invitations"
        });
      }
    });
  };

  const handleClose = () => {
    setMessage(null);
    setResult(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <MessageCircle className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              Invitations WhatsApp
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isPending}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {!result && !message && (
            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                Vous êtes sur le point d'envoyer des invitations WhatsApp à tous les actionnaires avec leur mot de passe et les informations de connexion.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note :</strong> Les invitations seront envoyées uniquement aux actionnaires qui ont un numéro de téléphone valide.
                </p>
              </div>
            </div>
          )}

          {/* Message de résultat */}
          {message && (
            <div
              className={`mb-4 p-4 rounded-lg flex items-start space-x-3 ${
                message.type === 'success'
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <p
                className={`text-sm ${
                  message.type === 'success' ? 'text-green-800' : 'text-red-800'
                }`}
              >
                {message.text}
              </p>
            </div>
          )}

          {/* Statistiques d'envoi */}
          {result && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total actionnaires :</span>
                <span className="text-sm font-semibold text-gray-800">{result.totalActionnaires}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Envoyés avec succès :</span>
                <span className="text-sm font-semibold text-green-600">{result.totalSent}</span>
              </div>
              {result.totalErrors > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Erreurs :</span>
                  <span className="text-sm font-semibold text-red-600">{result.totalErrors}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={isPending}
          >
            {result ? 'Fermer' : 'Annuler'}
          </button>
          {!result && (
            <button
              onClick={handleSendInvitations}
              disabled={isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Envoi en cours...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Envoyer les invitations</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SendWhatsAppInvitationsModal;
