"use server";

import { VERIFYOTP_URL } from "@/lib/endpoint";
import { getRedirectUrlForRole } from "../../routes";
import axios from "axios";
import { cookies } from "next/headers";


export const verifyOtp = async (state: any, formData: FormData) => {
  try {
    const userId = formData.get("userId");
    const otpCode = formData.get("otp");

    // ✅ LOGS DE DÉBOGAGE
    console.log("=== DÉBUT VÉRIFICATION OTP ===");
    console.log("userId:", userId);
    console.log("otpCode:", otpCode);
    console.log("URL:", VERIFYOTP_URL);

    // Envoyer une requête pour vérifier l'OTP avec la structure attendue par votre backend
    const res = await axios.post(`${VERIFYOTP_URL}`, {
      userId,
      otpCode,
    });

    console.log("Réponse du serveur:", res.data);
    
    if (!res.data || !res.data.user) {
      return {
        type: "error",
        message: "Réponse invalide du serveur",
      };
    }

    const { token, user } = res.data;
    const role = user.role;

    // Si l'OTP est valide, connecter l'utilisateur
    if (token) {
      // Configurer le cookie
      const cookieStore = await cookies();
      cookieStore.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24,
        path: "/",
      });

      // Obtenir l'URL de redirection en fonction du rôle
      const urlToRedirect = getRedirectUrlForRole(role);

      return {
        type: "redirect",
        url: urlToRedirect || "/dashboard",
        message: "Connexion réussie",
      };
    } else {
      return {
        type: "error",
        message: "Token manquant dans la réponse",
      };
    }
  } catch (error: any) {
    console.error("=== ERREUR VÉRIFICATION OTP ===");
    console.error("Message d'erreur:", error?.response?.data?.message);
    console.error("Status:", error?.response?.status);
    console.error("Données reçues:", error?.response?.data);
    console.error("Erreur complète:", error);
    
    return {
      type: "error",
      message: error?.response?.data?.message || "Erreur lors de la vérification OTP",
    };
  }
};

