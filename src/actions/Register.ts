import axios from "axios";



import { RequestData } from "@/lib/types";
import { cookies } from "next/headers";
import { RegisterSchema } from "@/app/Schema/registerShema";
import { CHANGE_PASSWORD_URL, REGISTER_INITIATE_URL, REGISTER_RESEND_OTP_URL, REGISTER_URL, REGISTER_VERIFY_OTP_URL } from "@/lib/endpoint";

export const register = async (state: any, formData: any) => {
    try {
       

        // Validation avec Zod
        const validationResult = RegisterSchema.safeParse(formData);

        if (!validationResult.success) {
            const errors = validationResult.error.flatten();
            return {
                type: "error",
                message: "Erreur de validation",
                errors: errors.fieldErrors
            };
        }

        const validatedData = validationResult.data;

        // Préparation des données
        const requestData: RequestData = {
            nom: validatedData.nom,
            prenom: validatedData.prenom,
            email: validatedData.email,
            password: validatedData.password,
            telephone: validatedData.telephone,
            nomEntreprise: validatedData.nomEntreprise,
            ninea: validatedData.ninea,
            dateCreation: validatedData.dateCreation,
            rccm: validatedData.rccm,
            representéPar: validatedData.representéPar
        };

       
        const res = await axios.post(REGISTER_URL, requestData);


   

        return {
            type: "success",
            message: "Inscription réussie",
        };

    } catch (error: any) {
        console.error("Erreur lors de l'inscription:", error);

        if (error.response) {
            return {
                type: "error",
                message: error.response.data?.message || `Erreur ${error.response.status}: ${error.response.statusText}`
            };
        } else if (error.request) {
            return {
                type: "error",
                message: "Impossible de joindre le serveur. Veuillez réessayer.",
            };
        } else {
            return {
                type: "error",
                message: "Une erreur inattendue s'est produite.",
            };
        }
    }
};



// Inscription directe SANS OTP
export const initiateRegister = async (state: any, formData: FormData) => {
    try {
        // Récupérer les données du FormData
        const firstName = formData.get("firstName") as string;
        const lastName = formData.get("lastName") as string;
        const nationalite = formData.get("nationalite") as string;
        const ville = formData.get("ville") as string;
        const pays = formData.get("pays") as string;
        const cni = formData.get("cni") as string;
        const dateNaissance = formData.get("dateNaissance") as string;
        const adresse = formData.get("adresse") as string;
        const telephone = formData.get("telephone") as string;
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        // Validation basique côté client
        if (!firstName || !lastName || !nationalite || !ville || !pays ||
            !cni || !dateNaissance || !adresse || !telephone ||
            !password || !confirmPassword) {
            return {
                type: "error",
                message: "Tous les champs sont requis.",
                errors: {}
            };
        }

        if (password !== confirmPassword) {
            return {
                type: "error",
                message: "Les mots de passe ne correspondent pas.",
                errors: {}
            };
        }

        if (password.length < 6) {
            return {
                type: "error",
                message: "Le mot de passe doit contenir au moins 6 caractères.",
                errors: {}
            };
        }

        // Préparation des données pour l'API
        const requestData = {
            firstName,
            lastName,
            nationalite,
            ville,
            pays,
            cni,
            dateNaissance,
            adresse,
            telephone,
            password,
            confirmPassword
        };

        // Appel à l'API backend pour créer le compte directement
        const res = await axios.post(REGISTER_INITIATE_URL, requestData);

        if (res.data.success) {
            // Compte créé directement - rediriger vers login
            return {
                type: "redirect",
                message: res.data.message || "Compte créé avec succès ! Vous pouvez maintenant vous connecter.",
                url: "/auth/login",
                errors: {}
            };
        } else {
            return {
                type: "error",
                message: res.data.message || "Erreur lors de l'inscription",
                errors: res.data.errors || {}
            };
        }

    } catch (error: any) {
        console.error("Erreur lors de l'inscription:", error);

        if (error.response) {
            return {
                type: "error",
                message: error.response.data?.message || `Erreur ${error.response.status}: ${error.response.statusText}`,
                errors: error.response.data?.errors || {}
            };
        } else if (error.request) {
            return {
                type: "error",
                message: "Impossible de joindre le serveur. Veuillez réessayer.",
                errors: {}
            };
        } else {
            return {
                type: "error",
                message: "Une erreur inattendue s'est produite.",
                errors: {}
            };
        }
    }
};

/* ANCIEN CODE OTP - COMMENTÉ - verifyRegisterOtp
export const verifyRegisterOtp = async (state: any, formData: FormData) => {
    try {
        const tempUserId = formData.get("tempUserId") as string;
        const otpCode = formData.get("otpCode") as string;

        if (!tempUserId || !otpCode) {
            return {
                type: "error",
                message: "Données manquantes pour la vérification.",
                url: ""
            };
        }

        if (otpCode.length !== 6) {
            return {
                type: "error",
                message: "Le code de vérification doit contenir 6 chiffres.",
                url: ""
            };
        }

        const requestData = {
            tempUserId,
            otpCode
        };

        const res = await axios.post(REGISTER_VERIFY_OTP_URL, requestData);

        if (res.data.success) {
            return {
                type: "redirect",
                message: "Compte créé avec succès ! Vous pouvez maintenant vous connecter.",
                url: "/auth/login"
            };
        } else {
            return {
                type: "error",
                message: res.data.message || "Code de vérification invalide",
                url: ""
            };
        }

    } catch (error: any) {
        console.error("Erreur lors de la vérification OTP:", error);
        return {
            type: "error",
            message: error?.response?.data?.message || "Une erreur inattendue s'est produite.",
            url: ""
        };
    }
};
FIN ANCIEN CODE OTP - verifyRegisterOtp */

/* ANCIEN CODE OTP - COMMENTÉ - resendRegisterOtp
export const resendRegisterOtp = async (state: any, formData: FormData) => {
    try {
        const tempUserId = formData.get("tempUserId") as string;

        if (!tempUserId) {
            return {
                type: "error",
                message: "Identifiant de session manquant."
            };
        }

        const requestData = {
            tempUserId
        };

        const res = await axios.post(REGISTER_RESEND_OTP_URL, requestData);

        if (res.data.success) {
            return {
                type: "success",
                message: res.data.message || "Nouveau code envoyé via Whatsapp"
            };
        } else {
            return {
                type: "error",
                message: res.data.message || "Erreur lors du renvoi du code"
            };
        }

    } catch (error: any) {
        console.error("Erreur lors du renvoi OTP:", error);
        return {
            type: "error",
            message: error?.response?.data?.message || "Une erreur inattendue s'est produite."
        };
    }
};
FIN ANCIEN CODE OTP - resendRegisterOtp */