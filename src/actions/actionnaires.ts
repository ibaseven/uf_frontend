"use server";
import { z } from "zod";
import { createdOrUpdated, deleteWithAxios } from "@/lib/api";
import { UPDATE_USER_URL, DELETE_USER_URL, CALCULATE_DIVIDENDE_URL, BULK_CREATE_USERS_URL, CREATE_USER_WITH_PASSWORD_URL } from "@/lib/endpoint";

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

// Schema de validation pour le calcul des dividendes
const CalculateDividendeSchema = z.object({
  PriceAction: z.number().min(0.01, "Le prix de l'action doit être supérieur à 0")
});

// Action : Calculer les dividendes pour tous les actionnaires
export const calculateDividende = async (formData: { PriceAction: number }) => {
  try {
    // Validation des données
    const validation = CalculateDividendeSchema.safeParse(formData);

    if (!validation.success) {
      return {
        type: "error",
        errors: validation.error.flatten().fieldErrors,
        message: "Données invalides"
      };
    }

    const validatedData = validation.data;

    // Appel à l'API de calcul de dividendes
    const response = await createdOrUpdated({
      url: CALCULATE_DIVIDENDE_URL,
      data: validatedData
    });

    if (response.message === "Dividendes calculés avec succès pour les actionnaires" || response.success) {
      return {
        type: "success",
        message: response.message || "Dividendes calculés avec succès",
        priceAction: response.priceAction,
        totalActionnaires: response.totalActionnaires
      };
    } else {
      return {
        type: "error",
        message: response.message || "Erreur lors du calcul des dividendes"
      };
    }

  } catch (error: any) {
    console.error("Erreur dans calculateDividende:", error);

    if (error.response?.data?.message) {
      return {
        type: "error",
        message: error.response.data.message
      };
    }

    return {
      type: "error",
      message: "Erreur lors du calcul des dividendes"
    };
  }
};

// Schema pour création d'un utilisateur unique
const CreateSingleUserSchema = z.object({
  telephone: z.string().min(9, "Le numéro de téléphone est requis"),
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  role: z.string().optional(),
  actionsNumber: z.number().min(0, "Le nombre d'actions doit être positif").optional()
});

// Schema pour création en masse
const BulkCreateUsersSchema = z.object({
  users: z.array(z.object({
    telephone: z.string().min(9, "Le numéro de téléphone est requis"),
    firstName: z.string().min(1, "Le prénom est requis"),
    lastName: z.string().min(1, "Le nom est requis"),
    email: z.string().optional(),
    role: z.string().optional(),
    actionsNumber: z.number().optional()
  })).min(1, "Au moins un utilisateur est requis")
});

// Action : Créer un utilisateur avec mot de passe aléatoire
export const createUserWithRandomPassword = async (formData: {
  telephone: string;
  firstName: string;
  lastName: string;
  email?: string;
  role?: string;
  actionsNumber?: number;
}) => {
  try {
    const validation = CreateSingleUserSchema.safeParse(formData);

    if (!validation.success) {
      return {
        type: "error",
        errors: validation.error.flatten().fieldErrors,
        message: "Données invalides"
      };
    }

    const validatedData = validation.data;

    const response = await createdOrUpdated({
      url: CREATE_USER_WITH_PASSWORD_URL,
      data: validatedData
    });

    if (response.success) {
      return {
        type: "success",
        message: response.message || "Utilisateur créé avec succès",
        user: response.user,
        siteUrl: response.siteUrl,
        whatsappGroupUrl: response.whatsappGroupUrl
      };
    } else {
      return {
        type: "error",
        message: response.message || "Erreur lors de la création"
      };
    }

  } catch (error: any) {
    console.error("Erreur dans createUserWithRandomPassword:", error);

    if (error.response?.data?.message) {
      return {
        type: "error",
        message: error.response.data.message
      };
    }

    return {
      type: "error",
      message: "Erreur lors de la création de l'utilisateur"
    };
  }
};

// Action : Créer plusieurs utilisateurs avec mots de passe aléatoires
export const bulkCreateUsersWithRandomPasswords = async (formData: {
  users: Array<{
    telephone: string;
    firstName: string;
    lastName: string;
    email?: string;
    role?: string;
    actionsNumber?: number;
  }>;
}) => {
  try {
    const validation = BulkCreateUsersSchema.safeParse(formData);

    if (!validation.success) {
      return {
        type: "error",
        errors: validation.error.flatten().fieldErrors,
        message: "Données invalides"
      };
    }

    const validatedData = validation.data;

    const response = await createdOrUpdated({
      url: BULK_CREATE_USERS_URL,
      data: validatedData
    });

    if (response.success) {
      return {
        type: "success",
        message: response.message || "Utilisateurs créés avec succès",
        created: response.created,
        errors: response.errors,
        totalRequested: response.totalRequested,
        totalCreated: response.totalCreated,
        totalErrors: response.totalErrors,
        siteUrl: response.siteUrl,
        whatsappGroupUrl: response.whatsappGroupUrl
      };
    } else {
      return {
        type: "error",
        message: response.message || "Erreur lors de la création"
      };
    }

  } catch (error: any) {
    console.error("Erreur dans bulkCreateUsersWithRandomPasswords:", error);

    if (error.response?.data?.message) {
      return {
        type: "error",
        message: error.response.data.message
      };
    }

    return {
      type: "error",
      message: "Erreur lors de la création des utilisateurs"
    };
  }
};