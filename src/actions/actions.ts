// actions/actionActions.ts
'use server';

import { z } from 'zod';
import { createdOrUpdated, fetchJSON } from '@/lib/api';
import { 
  BUY_ACTIONS_URL,
  GET_MY_ACTIONS_PURCHASES_URL 
} from '@/lib/endpoint';

const BuyActionsSchema = z.object({
  actionNumber: z.number().min(1, { message: "Le nombre d'actions doit être au moins 1" }),
  parrainPhone: z.string().optional() // Numéro de téléphone du parrain (optionnel)
});

export const buyActions = async (formData: { 
  actionNumber: number; 
  parrainPhone?: string; 
}) => {
  try {
    // Validation des données
    const validation = BuyActionsSchema.safeParse(formData);

    if (!validation.success) {
      return { 
        type: "error", 
        errors: validation.error.flatten().fieldErrors,
        message: "Données invalides"
      };
    }

    const validatedData = validation.data;

    // Appel à l'API d'achat
    const response = await createdOrUpdated({
      url: BUY_ACTIONS_URL,
      data: validatedData
    });

    if (response.message === "Achat effectué avec succès !") {
      return {
        type: "success",
        message: response.message,
        invoice: response.invoice,
        action: response.data
      };
    } else {
      return {
        type: "error",
        message: response.message || "Erreur lors de l'achat"
      };
    }

  } catch (error: any) {
    console.error("Erreur dans buyActions:", error);
    
    if (error.response?.data?.message) {
      return {
        type: "error",
        message: error.response.data.message
      };
    }
    
    return {
      type: "error",
      message: "Erreur lors de l'achat d'actions"
    };
  }
};

export const getMyActionsPurchases = async () => {
  try {
    const response = await fetchJSON(GET_MY_ACTIONS_PURCHASES_URL);

    if (response.demandes || response.statistiques) {
      return {
        type: "success",
        demandes: response.demandes || [],
        statistiques: response.statistiques || {
          total_actions_vendues: 0,
          total_montant_recu: 0,
          demandes_approuvees: 0,
          demandes_en_attente: 0,
          demandes_rejetees: 0
        }
      };
    } else {
      return {
        type: "error",
        message: response.message || "Erreur lors de la récupération des achats"
      };
    }

  } catch (error: any) {
    console.error("Erreur dans getMyActionsPurchases:", error);
    return {
      type: "error",
      message: "Erreur lors de la récupération de vos achats"
    };
  }
};