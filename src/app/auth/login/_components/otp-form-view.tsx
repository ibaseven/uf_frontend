import { AlertFeedback } from "@/components/alert-feedback";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import logo from "../../../../../public/img/logoUni.png";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useRef, useState, useEffect } from "react";

interface OtpFormViewProps {
  otp: string;
  setOtp: (value: string) => void;
  telephone: string;
  userId: string;
  otpState: any;
  handleVerifyOtp: (formData: FormData) => Promise<void>;
  handleResendOtp: () => Promise<void>;
}

export const OtpFormView = ({
  otp,
  setOtp,
  telephone,
  userId,
  otpState,
  handleVerifyOtp,
  handleResendOtp,
}: OtpFormViewProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [countdown, setCountdown] = useState(120); // 2 minutes
  const [canResend, setCanResend] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 6) {
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('otp', otp);
      handleVerifyOtp(formData);
    }
  };

  const handleResend = async () => {
    await handleResendOtp();
    setCountdown(120); // Reset countdown à 2 minutes
    setCanResend(false);
    setOtp(""); // Clear OTP input
  };

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
        <h2 className="text-2xl font-bold mb-2">Vérification Whatsapp</h2>
        <p className="text-gray-600">
          Un code de vérification a été envoyé via Whatsapp au numéro : {telephone}
        </p>
      </div>
      <form ref={formRef} className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="otp">Code de vérification (6 chiffres)</Label>
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <input type="hidden" name="userId" value={userId} />
          <input type="hidden" name="otp" value={otp} />
        </div>

        <div className="text-center text-sm text-gray-600">
          {countdown > 0 ? (
            <span>Code expire dans: <span className="font-medium text-red-600">{formatTime(countdown)}</span></span>
          ) : (
            <span className="text-red-600 font-medium">Code expiré</span>
          )}
        </div>

        {otpState?.message && (
          <AlertFeedback type={otpState?.type} message={otpState?.message} />
        )}
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={otp.length !== 6}
        >
          Vérifier le code
        </Button>
        
        <div className="text-center space-y-2">
          {canResend && (
            <button
              type="button"
              onClick={handleResend}
              className="text-sm text-blue-600 hover:underline font-medium"
            >
              Renvoyer le code
            </button>
          )}
          <div>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="text-gray-600 text-sm hover:underline"
            >
              Retour à la connexion
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default OtpFormView;