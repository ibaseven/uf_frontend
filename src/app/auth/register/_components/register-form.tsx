"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RegisterFormView } from "./register-form-view";
import { initiateRegister, resendRegisterOtp, verifyRegisterOtp } from "@/actions/Register";
import { RegisterOtpFormView } from "./ register-otp-form-view";



const RegisterForm = () => {
  const router = useRouter();
  const [state, setState] = useState({
    requiresOtp: false,
    telephone: "",
    message: "",
    type: "",
    errors: {},
    tempUserId: "",
  });

  const [otpState, setOtpState] = useState({
    type: "",
    message: "",
    url: "",
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
 
  const [otp, setOtp] = useState("");

  const handleRegister = async (formData: FormData) => {
    try {
      const result = await initiateRegister(null, formData);
      
      // Mise à jour complète de l'état avec tous les champs
      setState({
        requiresOtp: result.requiresOtp || false,
        telephone: result.telephone || telephone,
        message: result.message || "",
        type: result.type || "",
        errors: result.errors || {},
        tempUserId: result.tempUserId || "",
      });

      // Afficher un message de succès si l'OTP est requis
      if (result.requiresOtp) {
        console.log("OTP requis, affichage du formulaire OTP");
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      setState({
        requiresOtp: false,
        telephone: "",
        message: "Une erreur s'est produite",
        type: "error",
        errors: {},
        tempUserId: "",
      });
    }
  };

  const handleVerifyOtp = async (formData: FormData) => {
    try {
      const result = await verifyRegisterOtp(null, formData);

      setOtpState({
        type: result.type || "",
        message: result.message || "",
        url: result.url || ""
      });

      if (result.type === "redirect" && result.url) {
        router.push(result.url);
      }
    } catch (error) {
      console.error("Erreur lors de la vérification OTP:", error);
      setOtpState({
        type: "error",
        message: "Erreur lors de la vérification",
        url: ""
      });
    }
  };

  const handleResendOtp = async () => {
    try {
      const formData = new FormData();
      formData.append('tempUserId', state.tempUserId);
      
      const result = await resendRegisterOtp(null, formData);
      
      setOtpState({
        type: result.type || "",
        message: result.message || "",
        url: ""
      });
    } catch (error) {
      console.error("Erreur lors du renvoi OTP:", error);
      setOtpState({
        type: "error",
        message: "Erreur lors du renvoi",
        url: ""
      });
    }
  };

  useEffect(() => {
    if (otpState.type === "redirect" && otpState.url) {
      router.push(otpState.url);
    }
  }, [otpState, router]);

  // Débogage : afficher l'état actuel
  useEffect(() => {
    console.log("État actuel:", state);
  }, [state]);

  return (
    <div className="w-full md:w-1/2 p-8">
      {!state.requiresOtp ? (
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
      ) : (
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
    </div>
  );
};

export default RegisterForm;