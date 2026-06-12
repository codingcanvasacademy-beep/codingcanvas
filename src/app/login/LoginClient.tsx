"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { GraduationCap, Users, ShieldCheck } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

type Role = "student" | "teacher" | "admin";

const ROLES: { id: Role; label: string; icon: React.ReactNode; hint: string }[] = [
  { id: "student", label: "Student", icon: <GraduationCap className="w-5 h-5" />, hint: "Jump into your coding lab and live classes." },
  { id: "teacher", label: "Teacher", icon: <Users className="w-5 h-5" />, hint: "Manage your classroom, students and assignments." },
  { id: "admin", label: "Admin", icon: <ShieldCheck className="w-5 h-5" />, hint: "Main account — manage the whole website." },
];

export default function LoginPage() {
  const [role, setRole] = useState<Role>("student");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<"EMAIL" | "OTP" | "PASSWORD_SETUP" | "PASSWORD_LOGIN">("EMAIL");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  // AI Password Judgement
  const [pwdStrength, setPwdStrength] = useState<"WEAK" | "MEDIUM" | "STRONG" | null>(null);
  const [pwdFeedback, setPwdFeedback] = useState("");
  const [isJudging, setIsJudging] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (password.length >= 4) {
        judgePassword(password);
      } else {
        setPwdStrength(null);
        setPwdFeedback("");
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [password]);

  const judgePassword = async (pwd: string) => {
    setIsJudging(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "password_judge", prompt: pwd }),
      });
      const data = await res.json();
      
      // Attempt to parse AI response as JSON
      try {
        const parsed = JSON.parse(data.response.replace(/```json/g, "").replace(/```/g, "").trim());
        setPwdStrength(parsed.strength);
        setPwdFeedback(parsed.feedback);
      } catch {
        // Fallback if parsing fails
        setPwdStrength("MEDIUM");
        setPwdFeedback("Looks okay, but the AI got confused.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsJudging(false);
    }
  };

  const redirectUserBasedOnRole = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = "/student";
      return;
    }
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    // The actual role on the profile always wins — the tab selection is
    // just a hint, so a student can't reach /admin by picking the Admin tab.
    if (profile?.role === 'admin') {
      window.location.href = "/admin";
    } else if (profile?.role === 'teacher') {
      window.location.href = "/teacher";
    } else {
      window.location.href = "/student";
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    setErrorMsg("");
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
    });

    setIsLoading(false);
    if (error) {
      setErrorMsg(error.message);
    } else {
      setStep("OTP");
    }
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsLoading(true);
    setErrorMsg("");
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);
    if (error) {
      setErrorMsg(error.message);
    } else {
      await redirectUserBasedOnRole();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) return;
    
    setIsLoading(true);
    setErrorMsg("");

    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });

    setIsLoading(false);
    if (error) {
      setErrorMsg(error.message);
    } else if (data.session) {
      setStep("PASSWORD_SETUP");
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwdStrength === "WEAK") {
      setErrorMsg("Password is too weak. Please improve it.");
      return;
    }
    setIsLoading(true);
    setErrorMsg("");

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setErrorMsg(error.message);
      setIsLoading(false);
    } else {
      await redirectUserBasedOnRole();
    }
  };

  const handleSkipPassword = async () => {
    setIsLoading(true);
    await redirectUserBasedOnRole();
  };

  const getStrengthColor = () => {
    if (pwdStrength === "STRONG") return "text-green-500";
    if (pwdStrength === "MEDIUM") return "text-orange-500";
    if (pwdStrength === "WEAK") return "text-red-500";
    return "text-gray-400";
  }

  return (
    <div className="min-h-screen bg-cc-surface-lowest flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-10 left-10 w-64 h-64 bg-cc-primary-container rounded-full opacity-30 blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cc-tertiary-container rounded-full opacity-20 blur-3xl"></div>
      
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8 relative z-10 flex flex-col items-center">
        <div className="flex items-center gap-3 mb-6">
          <Image src="/logo.png" alt="CodingCanvas Logo" width={48} height={48} className="rounded-xl" />
          <span className="font-black text-2xl tracking-tighter text-foreground">CodingCanvas</span>
        </div>

        <h1 className="text-3xl font-bold text-cc-secondary mb-2">
          {step === "PASSWORD_SETUP" ? "Set A Password" : "Welcome Back!"}
        </h1>
        <p className="text-gray-500 mb-6 text-center text-sm">
          {step === "EMAIL"
            ? "Enter your email address to receive a secure One-Time code."
            : step === "OTP"
            ? `We've sent a code to ${email}`
            : step === "PASSWORD_LOGIN"
            ? "Welcome back! Please enter your password to sign in."
            : "Lock it down! Optionally set a password to make logging in easier next time."}
        </p>

        {(step === "EMAIL" || step === "PASSWORD_LOGIN") && (
          <div className="w-full mb-6">
            <div className="grid grid-cols-3 gap-2 p-1.5 bg-gray-50 rounded-2xl border border-gray-100">
              {ROLES.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  className={`flex flex-col items-center gap-1 py-3 rounded-xl text-sm font-bold transition-all ${
                    role === r.id
                      ? "bg-white text-cc-primary shadow-sm border border-cc-primary/20"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {r.icon}
                  {r.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 text-center mt-2 font-medium">
              {ROLES.find((r) => r.id === role)?.hint}
            </p>
          </div>
        )}

        {errorMsg && (
          <div className="w-full p-3 mb-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm font-medium text-center">
            {errorMsg}
          </div>
        )}

        {step === "EMAIL" && (
          <form onSubmit={handleSendOtp} className="w-full flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-bold text-gray-700">Email Address</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={`${role}@codingcanvas.com`}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-cc-primary focus:outline-none transition-colors"
                disabled={isLoading}
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
                "Send Login Code"
              )}
            </button>
            <button 
              type="button" 
              onClick={() => setStep("PASSWORD_LOGIN")}
              className="mt-1 text-sm text-gray-500 font-medium hover:text-cc-primary transition-colors py-2"
              disabled={isLoading}
            >
              Already have a password? Sign in here
            </button>
          </form>
        )}

        {step === "PASSWORD_LOGIN" && (
          <form onSubmit={handlePasswordLogin} className="w-full flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-bold text-gray-700">Email Address</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={`${role}@codingcanvas.com`}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-cc-primary focus:outline-none transition-colors"
                disabled={isLoading}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-password" className="text-sm font-bold text-gray-700">Password</label>
              <input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password..."
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-cc-primary focus:outline-none transition-colors"
                disabled={isLoading}
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading || !email || !password}
              className="w-full py-4 mt-2 rounded-xl font-bold text-white bg-gradient-to-r from-cc-primary to-[#ff8c7a] hover:brightness-105 transition-all shadow-md flex justify-center items-center h-14"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Sign In"
              )}
            </button>
            <button 
              type="button" 
              onClick={() => setStep("EMAIL")}
              className="mt-1 text-sm text-gray-500 font-medium hover:text-cc-primary transition-colors py-2"
              disabled={isLoading}
            >
              Log in with a secure email code instead
            </button>
          </form>
        )}

        {step === "OTP" && (
          <form onSubmit={handleVerifyOtp} className="w-full flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="otp" className="text-sm font-bold text-gray-700">6-Digit Code</label>
              <input
                id="otp"
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-cc-primary focus:outline-none transition-colors text-center text-2xl tracking-[0.4em] font-mono"
                disabled={isLoading}
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading || otp.length < 6}
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
              onClick={() => { setStep("EMAIL"); setOtp(""); }}
              className="mt-2 text-sm text-gray-500 font-medium hover:text-cc-primary transition-colors"
              disabled={isLoading}
            >
              Change Email Address
            </button>
          </form>
        )}

        {step === "PASSWORD_SETUP" && (
          <form onSubmit={handleSavePassword} className="w-full flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-bold text-gray-700">New Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter a strong password..."
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-cc-primary focus:outline-none transition-colors"
                disabled={isLoading}
              />
              
              <div className="h-10 mt-1">
                {isJudging ? (
                  <p className="text-xs text-gray-500 flex items-center gap-2">
                    <span className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
                    AI judging password...
                  </p>
                ) : pwdStrength ? (
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-xs font-bold">
                       <span>Strength:</span>
                       <span className={getStrengthColor()}>{pwdStrength}</span>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2">{pwdFeedback}</p>
                  </div>
                ) : null}
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading || !password || pwdStrength === "WEAK"}
              className="w-full py-4 mt-2 rounded-xl font-bold text-white bg-gradient-to-r from-cc-primary to-[#ff8c7a] hover:brightness-105 transition-all shadow-md flex justify-center items-center h-14 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Save & Continue"
              )}
            </button>

            <button 
              type="button" 
              onClick={handleSkipPassword}
              className="mt-2 text-sm text-gray-500 font-medium hover:text-cc-primary transition-colors"
              disabled={isLoading}
            >
              Skip setup for now
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
