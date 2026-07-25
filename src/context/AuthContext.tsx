"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { ADMIN_EMAILS } from "@/lib/plansConfig";

interface Profile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  business_name?: string;
  avatar_url?: string;
  is_admin?: boolean;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, name: string, phone?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPasswordEmail: (email: string) => Promise<{ error: any }>;
  updatePassword: (password: string) => Promise<{ error: any }>;
  updateProfile: (updates: Partial<Omit<Profile, "id" | "email" | "created_at">>) => Promise<{ error: any }>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (!error && data) {
        setProfile(data);
      } else {
        // Fallback profile if row doesn't exist yet (db sync delay)
        setProfile({
          id: userId,
          name: user?.user_metadata?.name || "",
          email: user?.email || "",
          phone: user?.user_metadata?.phone || "",
          is_admin: user?.user_metadata?.is_admin || false,
          created_at: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  const refreshSession = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);
      await fetchProfile(session.user.id);
    } else {
      setUser(null);
      setProfile(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    refreshSession();

    if (!supabase) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!supabase) return { error: { message: "Supabase client not initialized" } };
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string, name: string, phone?: string) => {
    if (!supabase) return { error: { message: "Supabase client not initialized" } };
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          phone: phone || "",
        },
      },
    });

    if (!error && data.user) {
      // Create manual profile row to guarantee prompt synchronization
      await supabase.from("profiles").upsert({
        id: data.user.id,
        name,
        email,
        phone: phone || null,
        updated_at: new Date().toISOString()
      });
    }

    return { error };
  };

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const resetPasswordEmail = async (email: string) => {
    if (!supabase) return { error: { message: "Supabase client not initialized" } };
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error };
  };

  const updatePassword = async (password: string) => {
    if (!supabase) return { error: { message: "Supabase client not initialized" } };
    const { error } = await supabase.auth.updateUser({ password });
    return { error };
  };

  const updateProfile = async (updates: Partial<Omit<Profile, "id" | "email" | "created_at">>) => {
    if (!supabase) return { error: { message: "Supabase client not initialized" } };
    if (!user) return { error: { message: "User not authenticated" } };

    const { error } = await supabase
      .from("profiles")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (!error) {
      await fetchProfile(user.id);
    }
    return { error };
  };

  const isAdmin = profile?.is_admin === true;

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAdmin,
        signIn,
        signUp,
        signOut,
        resetPasswordEmail,
        updatePassword,
        updateProfile,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
