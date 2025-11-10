// actions/projectActions.ts
'use server';

import { z } from 'zod';
import { createdOrUpdated } from '@/lib/api';
import { PARTICIPATE_PROJECT_URL } from '@/lib/endpoint';

const ParticipateProjectSchema = z.object({
  projectId: z.string().min(1, { message: "L'ID du projet est requis" }),
});

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

