"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"EMAIL" | "OTP">("EMAIL");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    // Simulate sending OTP via API
    setTimeout(() => {
      setIsLoading(false);
      setStep("OTP");
    }, 1500);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) return;
    
    setIsLoading(true);
    // Simulate verifying OTP and logging in
    setTimeout(() => {
      setIsLoading(false);
      // Redirect to the student portal on successful login
      router.push("/student");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-cc-surface-lowest flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-cc-primary-container rounded-full opacity-30 blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cc-tertiary-container rounded-full opacity-20 blur-3xl"></div>
      
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8 relative z-10 flex flex-col items-center">
        {/* Replace with actual imported next/image if you save the logo as public/logo.png */}
        <div className="w-24 h-24 mb-6 relative flex items-center justify-center">
             {/* If you save the image as public/logo.png, uncomment the Image below: */}
             {/* <Image src="/logo.png" alt="CodingCanvas Logo" layout="fill" objectFit="contain" /> */}
             <div className="w-full h-full rounded-full border-4 border-cc-primary flex items-center justify-center text-4xl font-extrabold text-cc-primary bg-cc-primary-container">
               C
             </div>
        </div>

        <h1 className="text-3xl font-bold text-cc-secondary mb-2">Welcome Back!</h1>
        <p className="text-gray-500 mb-8 text-center text-sm">
          {step === "EMAIL" 
            ? "Enter your email address to receive a secure One-Time Password." 
            : `We've sent a 4-digit code to ${email}`}
        </p>

        {step === "EMAIL" ? (
          <form onSubmit={handleSendOtp} className="w-full flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-bold text-gray-700">Email Address</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@codingcanvas.com"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-cc-primary focus:outline-none transition-colors"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading || !email}
              className="w-full py-4 mt-2 rounded-xl font-bold text-white bg-gradient-to-r from-cc-primary to-[#ff8c7a] hover:brightness-105 transition-all shadow-md flex justify-center items-center h-14"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Send OTP"
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="w-full flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="otp" className="text-sm font-bold text-gray-700">One-Time Password (OTP)</label>
              <input
                id="otp"
                type="text"
                required
                maxLength={4}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="1234"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-cc-primary focus:outline-none transition-colors text-center text-2xl tracking-[0.5em] font-mono"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading || otp.length < 4}
              className="w-full py-4 mt-2 rounded-xl font-bold text-white bg-[#006492] hover:bg-[#004a6d] transition-all shadow-md flex justify-center items-center h-14"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Verify & Login"
              )}
            </button>
            
            <button 
              type="button" 
              onClick={() => setStep("EMAIL")}
              className="mt-2 text-sm text-gray-500 font-medium hover:text-cc-primary transition-colors"
            >
              Change Email Address
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
