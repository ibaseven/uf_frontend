"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RegisterFormView } from "./register-form-view";
import { initiateRegister } from "@/actions/Register";
// ANCIEN CODE OTP - COMMENTÉ
// import { resendRegisterOtp, verifyRegisterOtp } from "@/actions/Register";
// import { RegisterOtpFormView } from "./ register-otp-form-view";

const RegisterForm = () => {
  const router = useRouter();
  const [state, setState] = useState({
    message: "",
    type: "",
    errors: {},
  });

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nationalite, setNationalite] = useState("");
  const [ville, setVille] = useState("");
  const [pays, setPays] = useState("");
  const [cni, setCni] = useState("");
  const [dateNaissance, setDateNaissance] = useState("");
  const [adresse, setAdresse] = useState("");
  const [telephone, setTelephone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async (formData: FormData) => {
    try {
      const result = await initiateRegister(null, formData);

      // Si inscription réussie - rediriger vers login
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
      console.error("Erreur lors de l'inscription:", error);
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
      const result = await verifyRegisterOtp(null, formData);
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
      formData.append('tempUserId', state.tempUserId);
      await resendRegisterOtp(null, formData);
    } catch (error) {
      console.error("Erreur lors du renvoi OTP:", error);
    }
  };
  FIN ANCIEN CODE OTP */

  return (
    <div className="w-full md:w-1/2 p-8">
      <RegisterFormView
        firstName={firstName}
        setFirstName={setFirstName}
        lastName={lastName}
        setLastName={setLastName}
        nationalite={nationalite}
        setNationalite={setNationalite}
        ville={ville}
        setVille={setVille}
        pays={pays}
        setPays={setPays}
        cni={cni}
        setCni={setCni}
        dateNaissance={dateNaissance}
        setDateNaissance={setDateNaissance}
        adresse={adresse}
        setAdresse={setAdresse}
        telephone={telephone}
        setTelephone={setTelephone}
        password={password}
        setPassword={setPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        state={state}
        handleRegister={handleRegister}
      />
      {/* ANCIEN CODE OTP - COMMENTÉ
      {state.requiresOtp && (
        <RegisterOtpFormView
          otp={otp}
          setOtp={setOtp}
          telephone={state.telephone}
          tempUserId={state.tempUserId}
          otpState={otpState}
          handleVerifyOtp={handleVerifyOtp}
          handleResendOtp={handleResendOtp}
        />
      )}
      FIN ANCIEN CODE OTP */}
    </div>
  );
};

export default RegisterForm;