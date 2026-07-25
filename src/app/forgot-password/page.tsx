"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { WobblyCard } from "@/components/ui/WobblyCard";
import { WobblyInput } from "@/components/ui/WobblyInput";
import { WobblyButton } from "@/components/ui/WobblyButton";
import { Palette } from "lucide-react";

export default function ForgotPasswordPage() {
  const { resetPasswordEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg("Please enter your email address.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const { error } = await resetPasswordEmail(email);
      if (error) {
        setErrorMsg(error.message || "Failed to send reset link.");
      } else {
        setSuccessMsg("Check your inbox! We've sent a password reset link to your email.");
      }
    } catch (err) {
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper bg-[radial-gradient(#e5e0d8_1.5px,transparent_1.5px)] bg-[size:24px_24px] flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2 group mb-2">
            <div className="w-10 h-10 bg-marker border-3 border-pencil shadow-hard-sm flex items-center justify-center wobbly transition-all duration-100 group-hover:shadow-none group-hover:translate-x-[2px] group-hover:translate-y-[2px]">
              <Palette className="w-5 h-5 text-white" strokeWidth={3} />
            </div>
            <span className="font-[family-name:var(--font-kalam-var)] font-bold text-2xl text-pencil">
              Vasu
            </span>
          </Link>
          <span className="text-pencil-light font-[family-name:var(--font-kalam-var)] font-bold text-lg">
            Client Portal Hub
          </span>
        </div>

        {/* Card Box */}
        <WobblyCard
          variant="default"
          decoration="tape"
          rotation={-0.5}
          hover={false}
          tilt={false}
          className="w-full relative bg-white border-3 border-pencil shadow-hard-lg p-6 md:p-8"
        >
          <h2 className="text-3xl font-bold text-pencil mb-4 font-[family-name:var(--font-kalam-var)] text-center">
            Recover Password 🔑
          </h2>
          <p className="text-pencil text-center text-base mb-6 font-[family-name:var(--font-patrick-var)] font-bold leading-relaxed">
            Enter your client portal email below, and we will send you a secure link to reset your password.
          </p>

          {errorMsg && (
            <div className="mb-5 p-3 border-2 border-dashed border-marker/40 bg-marker/5 wobbly-sm text-sm text-marker font-bold font-[family-name:var(--font-kalam-var)] text-center">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3 border-2 border-dashed border-ballpoint/40 bg-ballpoint/5 wobbly-sm text-sm text-ballpoint font-bold font-[family-name:var(--font-kalam-var)] text-center">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <WobblyInput
              id="forgot-email"
              type="email"
              label="Email Address"
              placeholder="client@yourwebsite.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <WobblyButton
              type="submit"
              disabled={loading}
              className="w-full mt-4"
            >
              {loading ? "Sending link..." : "Send Reset Link →"}
            </WobblyButton>
          </form>

          {/* Links */}
          <div className="mt-8 text-center flex flex-col gap-2">
            <div>
              <span className="text-pencil font-bold font-[family-name:var(--font-kalam-var)]">
                Remember your password?{" "}
              </span>
              <Link
                href="/login"
                className="text-marker font-bold font-[family-name:var(--font-kalam-var)] squiggly-underline"
              >
                Sign In
              </Link>
            </div>
            <div>
              <Link
                href="/"
                className="text-pencil-muted font-bold font-[family-name:var(--font-kalam-var)] hover:text-pencil text-sm"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </WobblyCard>
      </div>
    </div>
  );
}
