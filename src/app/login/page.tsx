"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { WobblyCard } from "@/components/ui/WobblyCard";
import { WobblyInput } from "@/components/ui/WobblyInput";
import { WobblyButton } from "@/components/ui/WobblyButton";
import { Palette, Github, Chrome } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const { signIn, user, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please fill in all fields.");
      return;
    }

    setAuthLoading(true);
    setErrorMsg("");

    try {
      const { error } = await signIn(email, password);
      if (error) {
        setErrorMsg(error.message || "Invalid credentials.");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: "google" | "github") => {
    if (!supabase) return;
    try {
      setAuthLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setErrorMsg(err.message || `Could not sign in with ${provider}.`);
      setAuthLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center font-[family-name:var(--font-kalam-var)] text-2xl text-pencil">
        Loading Session...
      </div>
    );
  }

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
          rotation={-0.5}
          hover={false}
          tilt={false}
          className="w-full relative bg-white border-3 border-pencil shadow-hard-lg p-6 md:p-8"
        >
          <h2 className="text-3xl font-bold text-pencil mb-6 font-[family-name:var(--font-kalam-var)] text-center">
            Sign In 🔑
          </h2>

          {errorMsg && (
            <div className="mb-5 p-3 border-2 border-dashed border-marker/40 bg-marker/5 wobbly-sm text-sm text-marker font-bold font-[family-name:var(--font-kalam-var)] text-center">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <WobblyInput
              id="login-email"
              type="email"
              label="Email Address"
              placeholder="client@yourwebsite.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="space-y-1">
              <div className="flex justify-between items-center px-1">
                <label
                  htmlFor="login-password"
                  className="block font-[family-name:var(--font-kalam-var)] font-bold text-pencil text-lg"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-ballpoint hover:text-marker font-[family-name:var(--font-kalam-var)] font-bold text-sm"
                >
                  Forgot Password?
                </Link>
              </div>
              <input
                id="login-password"
                type="password"
                className="w-full wobbly border-3 border-pencil bg-white px-4 py-2.5 md:py-3 min-h-[52px] font-[family-name:var(--font-patrick-var)] text-pencil text-base md:text-lg placeholder:text-pencil/40 focus:outline-none focus:ring-3 focus:ring-ballpoint focus:border-ballpoint transition-all duration-100"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2.5 px-1 pt-1">
              <input
                id="login-remember"
                type="checkbox"
                className="w-5 h-5 accent-pencil cursor-pointer border-2 border-pencil rounded-md"
              />
              <label
                htmlFor="login-remember"
                className="text-pencil font-bold select-none cursor-pointer font-[family-name:var(--font-kalam-var)] text-base mt-0.5"
              >
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <WobblyButton
              type="submit"
              disabled={authLoading}
              className="w-full mt-4"
            >
              {authLoading ? "Logging In..." : "Sign In →"}
            </WobblyButton>
          </form>

          {/* Social Sign Ins */}
          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t-2 border-dashed border-pencil/20"></div>
            <span className="flex-shrink mx-4 text-pencil font-bold font-[family-name:var(--font-kalam-var)] text-sm">
              or connect with
            </span>
            <div className="flex-grow border-t-2 border-dashed border-pencil/20"></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleOAuthLogin("google")}
              type="button"
              className="wobbly border-3 border-pencil py-2.5 flex items-center justify-center gap-2 hover:bg-marker hover:text-white font-[family-name:var(--font-kalam-var)] font-bold text-pencil text-sm cursor-pointer shadow-hard-sm active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-100"
            >
              <Chrome className="w-4 h-4" />
              Google
            </button>
            <button
              onClick={() => handleOAuthLogin("github")}
              type="button"
              className="wobbly border-3 border-pencil py-2.5 flex items-center justify-center gap-2 hover:bg-pencil hover:text-white font-[family-name:var(--font-kalam-var)] font-bold text-pencil text-sm cursor-pointer shadow-hard-sm active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-100"
            >
              <Github className="w-4 h-4" />
              GitHub
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <span className="text-pencil font-bold font-[family-name:var(--font-kalam-var)]">
              Don&apos;t have an account?{" "}
            </span>
            <Link
              href="/signup"
              className="text-marker font-bold font-[family-name:var(--font-kalam-var)] squiggly-underline"
            >
              Create Account
            </Link>
          </div>
        </WobblyCard>
      </div>
    </div>
  );
}
