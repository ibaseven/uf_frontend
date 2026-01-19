"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { ResetPasswordFormView } from "./reset-password-form-view";
// ANCIEN CODE OTP - COMMENTÉ
// import { ResetOtpFormView } from "./reset-otp-form-view";
// import { resendResetOTP } from "@/actions/reset-password";
import { requestPasswordReset, verifyResetOTP } from "@/actions/reset-password";
import { AlertFeedback } from "@/components/alert-feedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import logoDioko from "../../../../.././public/img/logoUni.png";

const ResetPasswordForm = () => {
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "password">("phone");
  const [state, setState] = useState({
    message: "",
    type: "",
    errors: {},
    userId: "",
  });

  const [telephone, setTelephone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Étape 1: Vérifier le téléphone
  const handleRequestReset = async (formData: FormData) => {
    try {
      const result = await requestPasswordReset(null, formData);

      if (result.canResetPassword) {
        // Passer à l'étape de changement de mot de passe
        setState({
          message: result.message || "",
          type: "success",
          errors: {},
          userId: result.userId || "",
        });
        setStep("password");
      } else {
        setState({
          message: result.message || "Utilisateur non trouvé",
          type: result.type || "error",
          errors: result.errors || {},
          userId: "",
        });
      }
    } catch (error) {
      console.error("Reset request error:", error);
      setState({
        message: "Une erreur s'est produite",
        type: "error",
        errors: {},
        userId: "",
      });
    }
  };

  // Étape 2: Changer le mot de passe (sans OTP)
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('userId', state.userId);
      formData.append('newPassword', newPassword);
      formData.append('confirmPassword', confirmPassword);

      const result = await verifyResetOTP(null, formData);

      setState(prev => ({
        ...prev,
        message: result.message || "",
        type: result.type || "",
        errors: result.errors || {},
      }));

      if (result.type === "redirect" && result.url) {
        setTimeout(() => {
          router.push(result.url);
        }, 1500);
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setState(prev => ({
        ...prev,
        message: "Erreur lors de la réinitialisation",
        type: "error",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // Retour à l'étape téléphone
  const handleBackToPhone = () => {
    setStep("phone");
    setState({
      message: "",
      type: "",
      errors: {},
      userId: "",
    });
    setNewPassword("");
    setConfirmPassword("");
  };

  const isPasswordFormValid = newPassword.length >= 6 && confirmPassword.length >= 6;

  return (
    <div className="w-full md:w-1/2 p-8">
      {step === "phone" ? (
        <ResetPasswordFormView
          telephone={telephone}
          setTelephone={setTelephone}
          state={state}
          handleRequestReset={handleRequestReset}
        />
      ) : (
        // Formulaire de nouveau mot de passe (SANS OTP)
        <>
          <div className="py-8 flex items-center justify-center">
            <div className="w-36">
              <Link href="/">
                <Image
                  src={logoDioko}
                  alt="Logo"
                  className="object-contain"
                />
              </Link>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Créer un nouveau mot de passe</h2>
            <p className="text-gray-600">
              Choisissez votre nouveau mot de passe pour le numéro {telephone}
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleResetPassword}>
            {/* Nouveau mot de passe */}
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nouveau mot de passe</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  name="newPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimum 6 caractères"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirmer mot de passe */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Retapez votre mot de passe"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Message d'état */}
            {state.message && (
              <AlertFeedback type={state.type} message={state.message} />
            )}

            {/* Bouton de soumission */}
            <Button
              type="submit"
              className="w-full"
              disabled={!isPasswordFormValid || isLoading}
            >
              {isLoading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
            </Button>

            {/* Retour */}
            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={handleBackToPhone}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Changer de numéro
              </button>
            </div>

            {/* Conseils */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-900 mb-2">Conseils pour un mot de passe sécurisé</h3>
              <ul className="text-green-700 text-sm space-y-1">
                <li>• Au moins 6 caractères</li>
                <li>• Mélangez lettres, chiffres et symboles</li>
                <li>• Évitez les informations personnelles</li>
              </ul>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default ResetPasswordForm;