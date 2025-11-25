"use server";
import { z } from "zod";
import { createdOrUpdated } from "@/lib/api";
import { CHANGE_PASSWORD_URL } from "@/lib/endpoint";

// Schéma de validation
const ChangePasswordSchema = z.object({
  userId: z.string().min(1, { message: "ID utilisateur requis" }),
  password: z.string().min(1, { message: "Mot de passe actuel requis" }),
  newPassword: z.string()
    .min(6, { message: "Le nouveau mot de passe doit contenir au moins 6 caractères" })
});

export const changePassword = async (formData: FormData) => {
  try {
    const data = {
      userId: formData.get("userId") as string,
      password: formData.get("password") as string,
      newPassword: formData.get("newPassword") as string
    };

    // Validation
    const validation = ChangePasswordSchema.safeParse(data);

    if (!validation.success) {
      return {
        type: "error",
        errors: validation.error.flatten().fieldErrors,
        message: "Données invalides"
      };
    }

    const validatedData = validation.data;

    // Appel API
    const response = await createdOrUpdated({
      url: CHANGE_PASSWORD_URL,
      data: {
        userId: validatedData.userId,
        password: validatedData.password,
        newPassword: validatedData.newPassword
      },
      updated: false
    });

    if (response.success) {
      return {
        type: "success",
        message: response.message || "Mot de passe mis à jour avec succès"
      };
    }

    return {
      type: "error",
      message: response.message || "Erreur lors de la mise à jour"
    };

  } catch (error: any) {
    console.error("Erreur dans changePassword:", error);

    return {
      type: "error",
      message: error.response?.data?.message || "Erreur lors de la mise à jour du mot de passe"
    };
  }
};