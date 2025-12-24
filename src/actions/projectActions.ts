

import { z } from 'zod';
import { createdOrUpdated, deleteWithAxios } from '@/lib/api';
import {
  PARTICIPATE_PROJECT_URL,
  PAY_PROJECT_PARTICIPATION_URL,
  ADD_PROJECT_URL,
  DECREASE_PARTICIPANT_PACKS_URL,
  INCREASE_PARTICIPANT_PACKS_URL,
  UPDATE_PROJECT_URL,
  DELETE_PROJECT_URL,
  DISTRIBUTE_PROJECT_DIVIDENDE_URL
} from '@/lib/endpoint';

// Schemas de validation
const ParticipateProjectSchema = z.object({
  projectId: z.string().min(1, { message: "L'ID du projet est requis" }),
});

const PayProjectParticipationSchema = z.object({
  projectIds: z.array(z.string()).min(1, { message: "Au moins un projet doit être sélectionné" }),
  amount: z.number().min(1, { message: "Le montant doit être supérieur à 0" }),
});


const UpdateProjectSchema = z.object({
  nameProject: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  packPrice: z.number().positive("Le prix du pack doit être positif"),
  duration: z.number().positive("La durée doit être positive"),
  monthlyPayment: z.number().optional(),
  description: z.string().optional(),
  gainProject: z.number().optional()
});
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

const ModifyPacksSchema = z.object({
  projectId: z.string().min(1, "ID projet requis"),
  userId: z.string().min(1, "ID utilisateur requis"),
  packs: z.number().min(1, "Le nombre de packs doit être positif"),
  reason: z.string().optional()
});

// Récupérer les participants d'un projet

// Diminuer le nombre de packs
export const decreaseParticipantPacks = async (formData: {
  projectId: string;
  userId: string;
  packs: number;
  reason?: string;
}) => {
  try {
    const validation = ModifyPacksSchema.safeParse(formData);

    if (!validation.success) {
      return { 
        type: "error", 
        errors: validation.error.flatten().fieldErrors,
        message: "Données invalides"
      };
    }

    const validatedData = validation.data;

    const url = DECREASE_PARTICIPANT_PACKS_URL
      .replace(':projectId', validatedData.projectId)
      .replace(':userId', validatedData.userId);

    const response = await createdOrUpdated({
      url: url,
      data: {
        packsToDecrease: validatedData.packs,
        reason: validatedData.reason || "Non spécifié"
      },
      updated: true
    });

    if (response.success) {
      return {
        type: "success",
        message: response.message,
        participant: response.participant
      };
    } else {
      return {
        type: "error",
        message: response.message || "Erreur lors de la diminution des packs"
      };
    }

  } catch (error: any) {
    console.error("Erreur decreaseParticipantPacks:", error);
    
    if (error.response?.data?.message) {
      return {
        type: "error",
        message: error.response.data.message
      };
    }
    
    return {
      type: "error",
      message: "Erreur lors de la diminution des packs"
    };
  }
};

// Augmenter le nombre de packs
export const increaseParticipantPacks = async (formData: {
  projectId: string;
  userId: string;
  packs: number;
  reason?: string;
}) => {
  try {
    const validation = ModifyPacksSchema.safeParse(formData);

    if (!validation.success) {
      return { 
        type: "error", 
        errors: validation.error.flatten().fieldErrors,
        message: "Données invalides"
      };
    }

    const validatedData = validation.data;

    const url = INCREASE_PARTICIPANT_PACKS_URL
      .replace(':projectId', validatedData.projectId)
      .replace(':userId', validatedData.userId);

    const response = await createdOrUpdated({
      url: url,
      data: {
        packsToAdd: validatedData.packs,
        reason: validatedData.reason || "Non spécifié"
      },
      updated: true
    });

    if (response.success) {
      return {
        type: "success",
        message: response.message,
        participant: response.participant
      };
    } else {
      return {
        type: "error",
        message: response.message || "Erreur lors de l'ajout des packs"
      };
    }

  } catch (error: any) {
    console.error("Erreur increaseParticipantPacks:", error);
    
    if (error.response?.data?.message) {
      return {
        type: "error",
        message: error.response.data.message
      };
    }
    
    return {
      type: "error",
      message: "Erreur lors de l'ajout des packs"
    };
  }
};

export const updateProject = async (projectId: string, formData: {
  nameProject: string;
  packPrice: number;
  duration: number;
  monthlyPayment?: number;
  description?: string;
  gainProject?: number;
}) => {
  try {
    const validation = UpdateProjectSchema.safeParse(formData);

    if (!validation.success) {
      return { 
        type: "error", 
        errors: validation.error.flatten().fieldErrors,
        message: "Données invalides"
      };
    }

    const validatedData = validation.data;

    const response = await createdOrUpdated({
      url: `${UPDATE_PROJECT_URL}/${projectId}`,
      data: validatedData,
      updated: true
    });

    if (response.message === "Update Succesful" || response.message?.includes("succès")) {
      return {
        type: "success",
        message: "Projet mis à jour avec succès",
        project: response.update || response.project
      };
    } else {
      return {
        type: "error",
        message: response.message || "Erreur lors de la mise à jour"
      };
    }

  } catch (error: any) {
    console.error("Erreur dans updateProject:", error);
    
    if (error.response?.data?.message) {
      return {
        type: "error",
        message: error.response.data.message
      };
    }
    
    return {
      type: "error",
      message: "Erreur lors de la mise à jour du projet"
    };
  }
};

export const deleteProject = async (projectId: string) => {
  try {
    const response = await deleteWithAxios({
      url: `${DELETE_PROJECT_URL}/${projectId}`
    });


    if (response.success === true) {
      return {
        type: "success",
        message: "Projet supprimé avec succès"
      };

    } else {
      return {
        type: "error",
        message: response.message || "Erreur lors de la suppression"
      };
    }

  } catch (error: any) {
    console.error("Erreur dans deleteProject:", error);

    if (error.response?.data?.message) {
      return {
        type: "error",
        message: error.response.data.message
      };
    }

    return {
      type: "error",
      message: "Erreur lors de la suppression du projet"
    };
  }
};

// Schema de validation pour la distribution des dividendes
const DistributeProjectDividendeSchema = z.object({
  projectId: z.string().min(1, "L'ID du projet est requis"),
  totalAmount: z.number().min(1, "Le montant total doit être supérieur à 0")
});

// Action : Distribuer les dividendes d'un projet
export const distributeProjectDividende = async (formData: {
  projectId: string;
  totalAmount: number;
}) => {
  try {
    // Validation des données
    const validation = DistributeProjectDividendeSchema.safeParse(formData);

    if (!validation.success) {
      return {
        type: "error",
        errors: validation.error.flatten().fieldErrors,
        message: "Données invalides"
      };
    }

    const validatedData = validation.data;

    // Appel à l'API de distribution
    const response = await createdOrUpdated({
      url: DISTRIBUTE_PROJECT_DIVIDENDE_URL,
      data: validatedData
    });

    if (response.message === "Distribution effectuée selon amountPaid" || response.success) {
      return {
        type: "success",
        message: response.message || "Distribution effectuée avec succès",
        totalDistribue: response.totalDistribue,
        participantsPayes: response.participantsPayes
      };
    } else {
      return {
        type: "error",
        message: response.message || "Erreur lors de la distribution"
      };
    }

  } catch (error: any) {
    console.error("Erreur dans distributeProjectDividende:", error);

    if (error.response?.data?.message) {
      return {
        type: "error",
        message: error.response.data.message
      };
    }

    return {
      type: "error",
      message: "Erreur lors de la distribution des dividendes"
    };
  }
};