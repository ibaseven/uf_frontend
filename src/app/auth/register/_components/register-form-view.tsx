import { AlertFeedback } from "@/components/alert-feedback";
import CustomInputError from "@/components/custom-input-error";
import SubmitButton from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import logo from "../../../../../public/img/logoUni.png";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface RegisterFormViewProps {
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  nationalite: string;
  setNationalite: (value: string) => void;
  ville: string;
  setVille: (value: string) => void;
  pays: string;
  setPays: (value: string) => void;
  cni: string;
  setCni: (value: string) => void;
  dateNaissance: string;
  setDateNaissance: (value: string) => void;
  adresse: string;
  setAdresse: (value: string) => void;
  telephone: string;
  setTelephone: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  state: any;
  handleRegister: (formData: FormData) => Promise<void>;
}

export const RegisterFormView = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  nationalite,
  setNationalite,
  ville,
  setVille,
  pays,
  setPays,
  cni,
  setCni,
  dateNaissance,
  setDateNaissance,
  adresse,
  setAdresse,
  telephone,
  setTelephone,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  state,
  handleRegister,
}: RegisterFormViewProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <>
      <div className="py-8 flex items-center justify-center">
        <div className="w-36">
          <Link href="/">
            <Image
              src={logo}
              alt="Image d'authentification"
              className="object-contain"
            />
          </Link>
        </div>
      </div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Créer un compte</h2>
        <p className="text-gray-600">Inscrivez-vous sur Dioko</p>
      </div>
      <form action={handleRegister} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Prénom</Label>
            <Input
              id="firstName"
              name="firstName"
              placeholder="Prénom"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            {state?.errors?.firstName && (
              <CustomInputError>{state.errors.firstName}</CustomInputError>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName">Nom</Label>
            <Input
              id="lastName"
              name="lastName"
              placeholder="Nom"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            {state?.errors?.lastName && (
              <CustomInputError>{state.errors.lastName}</CustomInputError>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="nationalite">Nationalité</Label>
            <Input
              id="nationalite"
              name="nationalite"
              placeholder="Nationalité"
              value={nationalite}
              onChange={(e) => setNationalite(e.target.value)}
            />
            {state?.errors?.nationalite && (
              <CustomInputError>{state.errors.nationalite}</CustomInputError>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ville">Ville</Label>
            <Input
              id="ville"
              name="ville"
              placeholder="Ville"
              value={ville}
              onChange={(e) => setVille(e.target.value)}
            />
            {state?.errors?.ville && (
              <CustomInputError>{state.errors.ville}</CustomInputError>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="pays">Pays</Label>
            <Input
              id="pays"
              name="pays"
              placeholder="Pays"
              value={pays}
              onChange={(e) => setPays(e.target.value)}
            />
            {state?.errors?.pays && (
              <CustomInputError>{state.errors.pays}</CustomInputError>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cni">CNI</Label>
            <Input
              id="cni"
              name="cni"
              placeholder="Numéro CNI"
              value={cni}
              onChange={(e) => setCni(e.target.value)}
            />
            {state?.errors?.cni && (
              <CustomInputError>{state.errors.cni}</CustomInputError>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dateNaissance">Date de naissance</Label>
            <Input
              id="dateNaissance"
              name="dateNaissance"
              type="date"
              placeholder="Date de naissance"
              value={dateNaissance}
              onChange={(e) => setDateNaissance(e.target.value)}
            />
            {state?.errors?.dateNaissance && (
              <CustomInputError>{state.errors.dateNaissance}</CustomInputError>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="adresse">Adresse</Label>
            <Input
              id="adresse"
              name="adresse"
              placeholder="Adresse"
              value={adresse}
              onChange={(e) => setAdresse(e.target.value)}
            />
            {state?.errors?.adresse && (
              <CustomInputError>{state.errors.adresse}</CustomInputError>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="telephone">Téléphone (Renseigner l'indicatif de votre pays)</Label>
          <Input
            id="telephone"
            name="telephone"
            placeholder="+22100000000000"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
          />
          {state?.errors?.telephone && (
            <CustomInputError>{state.errors.telephone}</CustomInputError>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Mot de passe</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
          {state?.errors?.password && (
            <CustomInputError>{state.errors.password}</CustomInputError>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirmer le mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
          {state?.errors?.confirmPassword && (
            <CustomInputError>{state.errors.confirmPassword}</CustomInputError>
          )}
        </div>
        
        {state?.message && (
          <AlertFeedback type={state?.type} message={state?.message} />
        )}
        
        <SubmitButton title="S'inscrire" />
        
        <div className="text-center text-sm text-gray-600">
          Déjà un compte ?{" "}
          <Link href="/auth/login" className="text-blue-600 hover:underline">
            Se connecter
          </Link>
        </div>
      </form>
    </>
  );
};