import { z } from 'zod';
import { 
  ADD_PROJECT_URL 
} from '@/lib/endpoint';



const AddProjectSchema = z.object({
  nameProject: z.string().min(1, { message: "Le nom du projet est requis" }),
  packPrice: z.number().min(1, { message: "Le prix du pack doit être supérieur à 0" }),
  duration: z.number().min(1, { message: "La durée doit être supérieure à 0" }),
  monthlyPayment: z.number().optional(),
  description: z.string().optional(),
  gainProject: z.number().optional(),
  isVisible: z.boolean().optional(),
});

// 🔥 NOUVELLE ACTION : Ajouter un projet avec upload de fichier
export const addProject = async (formData: FormData) => {
  try {
    const projectData = {
      nameProject: formData.get("nameProject"),
      packPrice: Number(formData.get("packPrice")),
      duration: Number(formData.get("duration")),
      description: formData.get("description"),
      gainProject: Number(formData.get("gainProject")),
    };

    const validation = AddProjectSchema.safeParse(projectData);

    if (!validation.success) {
      return { 
        type: "error", 
        errors: validation.error.flatten().fieldErrors,
        message: "Données invalides"
      };
    }

    const response = await fetch(`${ADD_PROJECT_URL}`, {
      method: 'POST',
      body: formData,
      credentials: 'include', // ✅ Juste ça
    });

    const result = await response.json();
    //console.log(result);

    if (result.success && result.newProject) {
      return {
        type: "success",
        message: result.message || "Projet créé avec succès",
        data: result.newProject
      };
    } else {
      return {
        type: "error",
        message: result.message || "Erreur lors de la création du projet"
      };
    }

  } catch (error: any) {
    console.error("Erreur dans addProject:", error);
    
    return {
      type: "error",
      message: error.message || "Erreur lors de la création du projet"
    };
  }
};

