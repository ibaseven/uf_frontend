"use server";
import { z } from "zod";
import { createdOrUpdated } from "@/lib/api";
import { ACTIONNAIRE_WITHDRAW_INITIATE_URL, ACTIONNAIRE_WITHDRAW_CONFIRM_URL } from "@/lib/endpoint";

// ========================================
// SCHÉMAS DE VALIDATION
// ========================================

const InitiateWithdrawSchema = z.object({
  phoneNumber: z.string()
    .min(9, { message: "Numéro de téléphone invalide" })
    .regex(/^[0-9+\s]+$/, { message: "Format de numéro invalide" }),
  amount: z.number()
    .min(100, { message: "Montant minimum: 100 FCFA" })
    .max(100000000, { message: "Montant maximum: 100,000,000 FCFA" }),
  paymentMethod: z.enum([
    'wave-senegal',
    'orange-money-senegal',
    'free-money-senegal',
    'expresso-senegal',
    'mtn-benin',
    'moov-benin',
    'mtn-ci',
    'orange-money-ci',
    'moov-ci',
    'wave-ci',
    't-money-togo',
    'moov-togo',
    'orange-money-mali',
    'orange-money-burkina',
    'moov-burkina-faso',
    'paydunya'
  ], { message: "Méthode de paiement invalide" })
});

const ConfirmWithdrawSchema = z.object({
  otpCode: z.string()
    .length(6, { message: "Le code OTP doit contenir 6 chiffres" })
    .regex(/^[0-9]+$/, { message: "Le code OTP doit contenir uniquement des chiffres" })
});

// ========================================
// INITIER LE RETRAIT ACTIONNAIRE
// ========================================

export const initiateActionnaireWithdraw = async (formData: {
  phoneNumber: string;
  amount: number;
  paymentMethod: string;
}) => {
  try {
    // Validation
    const validation = InitiateWithdrawSchema.safeParse(formData);

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
      url: ACTIONNAIRE_WITHDRAW_INITIATE_URL,
      data: {
        phoneNumber: validatedData.phoneNumber,
        amount: validatedData.amount,
        paymentMethod: validatedData.paymentMethod
      },
      updated: false
    });

    if (response.success) {
      return {
        type: "success",
        message: response.message,
        data: response.data
      };
    }

    return {
      type: "error",
      message: response.message || "Erreur lors de l'initiation du retrait"
    };

  } catch (error: any) {
    console.error("Erreur dans initiateActionnaireWithdraw:", error);

    return {
      type: "error",
      message: error.response?.data?.message || "Erreur lors de l'initiation du retrait"
    };
  }
};

// ========================================
// CONFIRMER LE RETRAIT ACTIONNAIRE
// ========================================

export const confirmActionnaireWithdraw = async (formData: {
  otpCode: string;
}) => {
  try {
    // Validation
    const validation = ConfirmWithdrawSchema.safeParse(formData);

    if (!validation.success) {
      return {
        type: "error",
        errors: validation.error.flatten().fieldErrors,
        message: "Code OTP invalide"
      };
    }

    const validatedData = validation.data;

    // Appel API
    const response = await createdOrUpdated({
      url: ACTIONNAIRE_WITHDRAW_CONFIRM_URL,
      data: {
        otpCode: validatedData.otpCode
      },
      updated: false
    });

    if (response.success) {
      return {
        type: "success",
        message: response.message,
        transaction: response.transaction,
        dividends: response.dividends
      };
    }

    return {
      type: "error",
      message: response.message || "Erreur lors de la confirmation du retrait"
    };

  } catch (error: any) {
    console.error("Erreur dans confirmActionnaireWithdraw:", error);

    return {
      type: "error",
      message: error.response?.data?.message || "Erreur lors de la confirmation du retrait"
    };
  }
};
