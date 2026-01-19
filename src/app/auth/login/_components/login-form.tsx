"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { LoginFormView } from "./login-form-view";
// ANCIEN CODE OTP - COMMENTÉ
// import { OtpFormView } from "./otp-form-view";
// import { resendLoginOtp, verifyOtp } from "@/actions/verifyOtp";
import { login } from "@/actions/login";

const LoginForm = () => {
  const router = useRouter();
  const [state, setState] = useState({
    message: "",
    type: "",
    errors: {},
  });

  const [telephone, setTelephone] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (formData: FormData) => {
    try {
      const result = await login(null, formData);

      // Connexion réussie - rediriger immédiatement
      if (result.type === "redirect" && result.url) {
        router.push(result.url);
        return;
      }

      setState({
        message: result.message || "",
        type: result.type || "",
        errors: result.errors || {},
      });
    } catch (error) {
      setState({
        message: "Une erreur s'est produite",
        type: "error",
        errors: {},
      });
    }
  };

  /* ANCIEN CODE OTP - COMMENTÉ
  const handleVerifyOtp = async (formData: FormData) => {
    try {
      const result = await verifyOtp(null, formData);
      if (result.type === "redirect" && result.url) {
        router.push(result.url);
      }
    } catch (error) {
      console.error("Erreur lors de la vérification OTP:", error);
    }
  };

  const handleResendOtp = async () => {
    try {
      const formData = new FormData();
      formData.append('userId', state.userId);
      await resendLoginOtp(null, formData);
    } catch (error) {
      console.error("Erreur lors du renvoi OTP:", error);
    }
  };
  FIN ANCIEN CODE OTP */

  return (
    <div className="w-full md:w-1/2 p-8">
      <LoginFormView
        telephone={telephone}
        setTelephone={setTelephone}
        password={password}
        setPassword={setPassword}
        state={state}
        handleLogin={handleLogin}
      />
      {/* ANCIEN CODE OTP - COMMENTÉ
      {state.requiresOtp && (
        <OtpFormView
          otp={otp}
          setOtp={setOtp}
          telephone={state.telephone}
          userId={state.userId}
          otpState={otpState}
          handleVerifyOtp={handleVerifyOtp}
          handleResendOtp={handleResendOtp}
        />
      )}
      FIN ANCIEN CODE OTP */}
    </div>
  );
};

export default LoginForm;