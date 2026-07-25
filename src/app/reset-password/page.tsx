"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { WobblyCard } from "@/components/ui/WobblyCard";
import { WobblyInput } from "@/components/ui/WobblyInput";
import { WobblyButton } from "@/components/ui/WobblyButton";
import { Palette } from "lucide-react";

export default function ResetPasswordPage() {
  const { updatePassword } = useAuth();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!password || !confirmPassword) {
      setErrorMsg("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await updatePassword(password);
      if (error) {
        setErrorMsg(error.message || "Failed to update password.");
      } else {
        setSuccessMsg("Password successfully updated! Redirecting to dashboard...");
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
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
          <span className="text-pencil font-[family-name:var(--font-kalam-var)] font-bold text-lg">
            Client Portal Hub
          </span>
        </div>

        {/* Card Box */}
        <WobblyCard
          variant="default"
          decoration="tape"
          rotation={0.5}
          hover={false}
          tilt={false}
          className="w-full relative bg-white border-3 border-pencil shadow-hard-lg p-6 md:p-8"
        >
          <h2 className="text-3xl font-bold text-pencil mb-4 font-[family-name:var(--font-kalam-var)] text-center">
            Set New Password 🔑
          </h2>
          <p className="text-pencil text-center text-base mb-6 font-[family-name:var(--font-patrick-var)] font-bold leading-relaxed">
            Please enter your new portal password below. Make sure it is secure.
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label
                htmlFor="reset-password"
                className="block font-[family-name:var(--font-kalam-var)] font-bold text-pencil text-lg"
              >
                New Password *
              </label>
              <input
                id="reset-password"
                type="password"
                className="w-full wobbly border-3 border-pencil bg-white px-4 py-2.5 min-h-[52px] font-[family-name:var(--font-patrick-var)] text-pencil text-base placeholder:text-pencil/40 focus:outline-none focus:ring-3 focus:ring-ballpoint focus:border-ballpoint transition-all duration-100"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="reset-confirm"
                className="block font-[family-name:var(--font-kalam-var)] font-bold text-pencil text-lg"
              >
                Confirm New Password *
              </label>
              <input
                id="reset-confirm"
                type="password"
                className="w-full wobbly border-3 border-pencil bg-white px-4 py-2.5 min-h-[52px] font-[family-name:var(--font-patrick-var)] text-pencil text-base placeholder:text-pencil/40 focus:outline-none focus:ring-3 focus:ring-ballpoint focus:border-ballpoint transition-all duration-100"
                placeholder="••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <WobblyButton
              type="submit"
              disabled={loading}
              className="w-full mt-6"
            >
              {loading ? "Updating..." : "Update Password →"}
            </WobblyButton>
          </form>
        </WobblyCard>
      </div>
    </div>
  );
}
