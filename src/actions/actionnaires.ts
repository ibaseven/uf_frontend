"use server";
import { z } from "zod";
import { createdOrUpdated, deleteWithAxios } from "@/lib/api";
import { UPDATE_USER_URL, DELETE_USER_URL } from "@/lib/endpoint";

const UpdateUserSchema = z.object({
  userId: z.string().min(1, { message: "ID de l'utilisateur requis" }),
  firstName: z.string().min(1, { message: "Le prénom est requis" }),
  lastName: z.string().min(1, { message: "Le nom est requis" }),
  telephone: z.string().min(1, { message: "Le téléphone est requis" }),
  adresse: z.string().optional(),
  ville: z.string().optional(),
  pays: z.string().optional(),
  nationalite: z.string().optional(),
  cni: z.string().optional(),
  dateNaissance: z.string().optional(),
  dividende: z.number().min(0).optional(),
  actionsNumber: z.number().min(0).optional(),
});

export const updateUserInfo = async (formData) => {
  try {
    const validation = UpdateUserSchema.safeParse(formData);

    if (!validation.success) {
      return { 
        type: "error", 
        errors: validation.error.flatten().fieldErrors,
        message: "Données invalides"
      };
    }

    const validatedData = validation.data;

    const payload = {
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      telephone: validatedData.telephone,
      adresse: validatedData.adresse,
      ville: validatedData.ville,
      pays: validatedData.pays,
      nationalite: validatedData.nationalite,
      cni: validatedData.cni,
      dateNaissance: validatedData.dateNaissance,
      dividende: validatedData.dividende,
      actionsNumber:validatedData.actionsNumber
    };

    const response = await createdOrUpdated({
      url: `${UPDATE_USER_URL}/${validatedData.userId}`,
      data: payload,
      updated: true
    });

    if (response.success) {
      return {
        type: "success",
        message: response.message,
        user: response.user
      };
    }

    return {
      type: "error",
      message: response.message || "Erreur lors de la mise à jour de l'utilisateur"
    };

  } catch (error) {
    console.error("Erreur dans updateUserInfo:", error);

    if (error.response?.data?.message) {
      return {
        type: "error",
        message: error.response.data.message
      };
    }

    return {
      type: "error",
      message: "Erreur lors de la mise à jour de l'utilisateur"
    };
  }
};

// Nouvelle action pour supprimer un utilisateur
export const deleteUser = async (formData: { userId: string }) => {
  try {
    if (!formData.userId) {
      return {
        type: "error",
        message: "ID de l'utilisateur requis"
      };
    }

    const response = await deleteWithAxios({
      url: `${DELETE_USER_URL}/${formData.userId}`
    });

    if (response.success || response.message?.includes("succès") || response.message?.includes("Succesful")) {
      return {
        type: "success",
        message: "Utilisateur supprimé avec succès"
      };
    }

    return {
      type: "error",
      message: response.message || "Erreur lors de la suppression"
    };

  } catch (error: any) {
    console.error("Erreur dans deleteUser:", error);

    if (error.response?.data?.message) {
      return {
        type: "error",
        message: error.response.data.message
      };
    }

    return {
      type: "error",
      message: "Erreur lors de la suppression de l'utilisateur"
    };
  }
};