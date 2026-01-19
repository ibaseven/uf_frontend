"use server";

import { ResetPasswordSchema, VerifyResetOTPSchema } from "@/app/auth/_models/reset-password-schema";
import { REQUEST_PASSWORD_RESET_URL, RESEND_RESET_OTP_URL, VERIFY_RESET_OTP_URL } from "@/lib/endpoint";
import axios from "axios";





// Vérification du téléphone pour réinitialisation SANS OTP
export const requestPasswordReset = async (state: any, formData: FormData) => {
  try {
    // Validation avec zod
    const validatedFields = ResetPasswordSchema.safeParse({
      telephone: formData.get("telephone"),
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        type: "error"
      };
    }

    const { telephone } = validatedFields.data;

    // Vérifier si l'utilisateur existe
    const res = await axios.post(REQUEST_PASSWORD_RESET_URL, {
      telephone,
    });

    if (res.data.success) {
      // Passer directement à l'étape de changement de mot de passe (sans OTP)
      return {
        canResetPassword: true,
        telephone: telephone,
        userId: res.data.userId,
        type: "success",
        message: "Utilisateur trouvé. Vous pouvez réinitialiser votre mot de passe."
      };
    } else {
      return {
        type: "error",
        message: res.data.message || "Utilisateur non trouvé",
      };
    }
  } catch (error: any) {
    console.error("Password reset request error:", error);
    return {
      type: "error",
      message: error?.response?.data?.message || "Une erreur s'est produite lors de la demande de réinitialisation",
    };
  }
};

// Réinitialisation du mot de passe SANS OTP
export const verifyResetOTP = async (state: any, formData: FormData) => {
  try {
    const userId = formData.get("userId") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Validation
    if (!userId || !newPassword || !confirmPassword) {
      return {
        type: "error",
        message: "Tous les champs sont requis",
        errors: {}
      };
    }

    if (newPassword.length < 6) {
      return {
        type: "error",
        message: "Le mot de passe doit contenir au moins 6 caractères",
        errors: {}
      };
    }

    // Vérifier que les mots de passe correspondent
    if (newPassword !== confirmPassword) {
      return {
        type: "error",
        message: "Les mots de passe ne correspondent pas",
        errors: {
          confirmPassword: ["Les mots de passe ne correspondent pas"]
        }
      };
    }

    // Envoyer une requête pour réinitialiser le mot de passe (sans OTP)
    const res = await axios.post(VERIFY_RESET_OTP_URL, {
      userId,
      newPassword,
    });

    if (res.data.success) {
      return {
        type: "redirect",
        url: "/auth/login",
        message: "Mot de passe réinitialisé avec succès ! Vous pouvez maintenant vous connecter.",
      };
    } else {
      return {
        type: "error",
        message: res.data.message || "Erreur lors de la réinitialisation du mot de passe",
      };
    }
  } catch (error: any) {
    console.error("Reset password error:", error);
    return {
      type: "error",
      message: error?.response?.data?.message || "Erreur lors de la réinitialisation du mot de passe",
    };
  }
};

/* ANCIEN CODE OTP - COMMENTÉ - resendResetOTP
export const resendResetOTP = async (userId: string) => {
  try {
    const res = await axios.post(RESEND_RESET_OTP_URL, {
      userId,
    });

    if (res.data.success) {
      return {
        type: "success",
        message: "Un nouveau code de réinitialisation a été envoyé",
      };
    } else {
      return {
        type: "error",
        message: res.data.message || "Erreur lors du renvoi du code",
      };
    }
  } catch (error: any) {
    console.error("Resend reset OTP error:", error);
    return {
      type: "error",
      message: error?.response?.data?.message || "Erreur lors du renvoi du code OTP",
    };
  }
};
FIN ANCIEN CODE OTP - resendResetOTP */