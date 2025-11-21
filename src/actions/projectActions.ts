

import { z } from 'zod';
import { createdOrUpdated } from '@/lib/api';
import { 
  PARTICIPATE_PROJECT_URL, 
  PAY_PROJECT_PARTICIPATION_URL,
  ADD_PROJECT_URL 
} from '@/lib/endpoint';

// Schemas de validation
const ParticipateProjectSchema = z.object({
  projectId: z.string().min(1, { message: "L'ID du projet est requis" }),
});

const PayProjectParticipationSchema = z.object({
  projectIds: z.array(z.string()).min(1, { message: "Au moins un projet doit être sélectionné" }),
  amount: z.number().min(1, { message: "Le montant doit être supérieur à 0" }),
});


// 🔥 NOUVELLE ACTION : Ajouter un projet avec upload de fichier



// Action : Payer une participation à un projet
export const payProjectParticipation = async (formData: { projectIds: string[], amount: number }) => {
  try {
    // Validation des données
    const validation = PayProjectParticipationSchema.safeParse(formData);

    if (!validation.success) {
      return { 
        type: "error", 
        errors: validation.error.flatten().fieldErrors,
        message: "Données invalides"
      };
    }

    const validatedData = validation.data;

    // Appel à l'API de paiement
    const response = await createdOrUpdated({
      url: PAY_PROJECT_PARTICIPATION_URL,
      data: validatedData
    });

    if (response.success) {
      return {
        type: "success",
        message: response.message,
        invoice: response.invoice,
        transaction: response.TransactionRecord
      };
    } else {
      return {
        type: "error",
        message: response.message || "Erreur lors du paiement"
      };
    }

  } catch (error: any) {
    console.error("Erreur dans payProjectParticipation:", error);
    
    if (error.response?.data?.message) {
      return {
        type: "error",
        message: error.response.data.message
      };
    }
    
    return {
      type: "error",
      message: "Erreur lors du paiement de la participation"
    };
  }
};

// Action : Participer à un projet
export const participateToProject = async (formData: { projectId: string }) => {
  try {
    // Validation des données
    const validation = ParticipateProjectSchema.safeParse(formData);

    if (!validation.success) {
      return { 
        type: "error", 
        errors: validation.error.flatten().fieldErrors,
        message: "Données invalides"
      };
    }

    const validatedData = validation.data;

    // Appel à l'API de participation
    const response = await createdOrUpdated({
      url: PARTICIPATE_PROJECT_URL,
      data: validatedData
    });

    if (response.success) {
      return {
        type: "success",
        message: response.message,
        participation: response.participation
      };
    } else {
      return {
        type: "error",
        message: response.message || "Erreur lors de la participation au projet"
      };
    }

  } catch (error: any) {
    console.error("Erreur dans participateToProject:", error);
    
    if (error.response?.data?.message) {
      return {
        type: "error",
        message: error.response.data.message
      };
    }
    
    return {
      type: "error",
      message: "Erreur lors de la participation au projet"
    };
  }
};