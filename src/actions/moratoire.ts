'use server';

import { createdOrUpdated, fetchJSON } from '@/lib/api';
import {
  MORATOIRE_URL,
  MORATOIRE_USER_URL,
  MORATOIRE_VERSEMENT_INITIATE_URL,
} from '@/lib/endpoint';

// ─── ADMIN : Créer un engagement moratoire ────────────────────────────────────
export const createMoratoireEngagement = async (data: {
  userId: string;
  actionNumber: number;
  totalAmount: number;
  versementMontant: number;
  startDate: string;
  endDate: string;
}) => {
  try {
    const response = await createdOrUpdated({ url: MORATOIRE_URL, data });
    if (response.data) {
      return { type: 'success' as const, message: response.message, data: response.data };
    }
    return { type: 'error' as const, message: response.message || 'Erreur lors de la création' };
  } catch (error: any) {
    return {
      type: 'error' as const,
      message: error?.response?.data?.message || 'Erreur lors de la création de l\'engagement',
    };
  }
};

// ─── ADMIN : Lister tous les engagements moratoires ───────────────────────────
export const getAllMoratoireEngagements = async () => {
  try {
    const response = await fetchJSON(MORATOIRE_URL);
    return { type: 'success' as const, data: response.data || [] };
  } catch (error: any) {
    return {
      type: 'error' as const,
      message: error?.response?.data?.message || 'Erreur lors de la récupération',
      data: [],
    };
  }
};

// ─── ADMIN : Modifier le montant du versement ─────────────────────────────────
export const updateVersementMontant = async (id: string, versementMontant: number) => {
  try {
    const response = await createdOrUpdated({
      url: `${MORATOIRE_URL}/${id}/versement-montant`,
      data: { versementMontant },
      updated: true,
    });
    if (response.data) {
      return { type: 'success' as const, message: response.message, data: response.data };
    }
    return { type: 'error' as const, message: response.message || 'Erreur lors de la mise à jour' };
  } catch (error: any) {
    return {
      type: 'error' as const,
      message: error?.response?.data?.message || 'Erreur lors de la mise à jour',
    };
  }
};

// ─── ADMIN : Changer le statut d'un engagement ────────────────────────────────
export const updateMoratoireStatus = async (id: string, status: string) => {
  try {
    const response = await createdOrUpdated({
      url: `${MORATOIRE_URL}/${id}/status`,
      data: { status },
      updated: true,
    });
    return { type: 'success' as const, message: response.message };
  } catch (error: any) {
    return {
      type: 'error' as const,
      message: error?.response?.data?.message || 'Erreur lors du changement de statut',
    };
  }
};

// ─── ADMIN : Renvoyer le contrat par WhatsApp ─────────────────────────────────
export const resendMoratoireContract = async (id: string) => {
  try {
    const response = await createdOrUpdated({
      url: `${MORATOIRE_URL}/${id}/resend-contract`,
      data: {},
    });
    return { type: 'success' as const, message: response.message };
  } catch (error: any) {
    return {
      type: 'error' as const,
      message: error?.response?.data?.message || 'Erreur lors de l\'envoi',
    };
  }
};

// ─── ADMIN : Enregistrer un versement manuel (espèces) ────────────────────────
export const addVersementManuel = async (id: string, amount: number, note?: string) => {
  try {
    const response = await createdOrUpdated({
      url: `${MORATOIRE_URL}/${id}/versement-manuel`,
      data: { amount, note },
    });
    if (response.data) {
      return { type: 'success' as const, message: response.message, data: response.data, isFullyPaid: response.isFullyPaid };
    }
    return { type: 'error' as const, message: response.message || 'Erreur lors de l\'enregistrement' };
  } catch (error: any) {
    return {
      type: 'error' as const,
      message: error?.response?.data?.message || 'Erreur lors de l\'enregistrement du versement',
    };
  }
};

// ─── ACTIONNAIRE : Voir ses propres engagements moratoires ────────────────────
export const getMoratoireByUser = async () => {
  try {
    const response = await fetchJSON(MORATOIRE_USER_URL);
    return { type: 'success' as const, data: response.data || [] };
  } catch (error: any) {
    return {
      type: 'error' as const,
      message: error?.response?.data?.message || 'Erreur lors de la récupération',
      data: [],
    };
  }
};

// ─── ACTIONNAIRE : Initier un versement moratoire ─────────────────────────────
export const initiateMoratoireVersement = async (data: {
  moratoireId: string;
  amount: number;
}) => {
  try {
    const response = await createdOrUpdated({ url: MORATOIRE_VERSEMENT_INITIATE_URL, data });
    if (response.invoice) {
      return {
        type: 'success' as const,
        message: response.message,
        invoice: response.invoice,
        remaining: response.remaining,
      };
    }
    return { type: 'error' as const, message: response.message || 'Erreur lors du versement' };
  } catch (error: any) {
    return {
      type: 'error' as const,
      message: error?.response?.data?.message || 'Erreur lors du versement',
    };
  }
};
