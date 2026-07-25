"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { WobblyCard } from "@/components/ui/WobblyCard";
import { WobblyInput } from "@/components/ui/WobblyInput";
import { WobblyButton } from "@/components/ui/WobblyButton";
import { User, Lock, AlertCircle, CheckCircle } from "lucide-react";

export default function ProfilePage() {
  const { profile, updateProfile, updatePassword } = useAuth();

  // Profile States
  const [name, setName] = useState(profile?.name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [businessName, setBusinessName] = useState(profile?.business_name || "");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");

  // Password States
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdError, setPwdError] = useState("");
  const [pwdSuccess, setPwdSuccess] = useState("");

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileError("");
    setProfileSuccess("");

    if (!name.trim()) {
      setProfileError("Name cannot be empty.");
      setProfileLoading(false);
      return;
    }

    try {
      const { error } = await updateProfile({
        name,
        phone: phone || undefined,
        business_name: businessName || undefined,
      });

      if (error) {
        setProfileError(error.message || "Failed to update profile.");
      } else {
        setProfileSuccess("Profile successfully updated!");
      }
    } catch (err: any) {
      setProfileError("An unexpected error occurred.");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdLoading(true);
    setPwdError("");
    setPwdSuccess("");

    if (!password || !confirmPassword) {
      setPwdError("Please fill in all password fields.");
      setPwdLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setPwdError("Passwords do not match.");
      setPwdLoading(false);
      return;
    }

    if (password.length < 6) {
      setPwdError("Password must be at least 6 characters.");
      setPwdLoading(false);
      return;
    }

    try {
      const { error } = await updatePassword(password);
      if (error) {
        setPwdError(error.message || "Failed to update password.");
      } else {
        setPwdSuccess("Password successfully updated!");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (err: any) {
      setPwdError("An unexpected error occurred.");
    } finally {
      setPwdLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-pencil font-[family-name:var(--font-kalam-var)] flex items-center gap-2">
          <User className="w-8 h-8 text-marker" />
          Profile Settings 👤
        </h1>
        <p className="text-pencil-light font-[family-name:var(--font-patrick-var)] font-bold text-lg">
          Update your contact details, business brand, and login passwords.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Profile Card */}
        <WobblyCard
          variant="default"
          hover={false}
          rotation={-0.3}
          className="border-3 border-pencil bg-white p-6 relative"
        >
          <h2 className="text-2xl font-bold text-pencil mb-6 font-[family-name:var(--font-kalam-var)] flex items-center gap-2">
            <User className="w-5 h-5 text-marker" />
            Client Details
          </h2>

          {profileError && (
            <div className="mb-4 p-2.5 border border-dashed border-marker bg-marker/5 text-marker text-sm font-bold font-[family-name:var(--font-kalam-var)] flex items-center gap-1.5 wobbly-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {profileError}
            </div>
          )}

          {profileSuccess && (
            <div className="mb-4 p-2.5 border border-dashed border-ballpoint bg-ballpoint/5 text-ballpoint text-sm font-bold font-[family-name:var(--font-kalam-var)] flex items-center gap-1.5 wobbly-sm">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              {profileSuccess}
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <WobblyInput
              id="profile-name"
              type="text"
              label="Full Name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <div className="space-y-1">
              <span className="block font-[family-name:var(--font-kalam-var)] font-bold text-pencil-lightest text-lg">
                Email Address (read-only)
              </span>
              <div className="w-full wobbly border-2 border-dashed border-pencil/20 bg-paper/30 px-4 py-2.5 font-[family-name:var(--font-patrick-var)] text-pencil-light text-base md:text-lg min-h-[50px] flex items-center">
                {profile?.email}
              </div>
            </div>

            <WobblyInput
              id="profile-phone"
              type="tel"
              label="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <WobblyInput
              id="profile-business"
              type="text"
              label="Business / Brand Name"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />

            <WobblyButton
              type="submit"
              disabled={profileLoading}
              className="w-full mt-4"
            >
              {profileLoading ? "Saving Details..." : "Save Details"}
            </WobblyButton>
          </form>
        </WobblyCard>

        {/* Change Password Card */}
        <WobblyCard
          variant="default"
          hover={false}
          rotation={0.3}
          className="border-3 border-pencil bg-white p-6 relative"
        >
          <h2 className="text-2xl font-bold text-pencil mb-6 font-[family-name:var(--font-kalam-var)] flex items-center gap-2">
            <Lock className="w-5 h-5 text-marker" />
            Security Password
          </h2>

          {pwdError && (
            <div className="mb-4 p-2.5 border border-dashed border-marker bg-marker/5 text-marker text-sm font-bold font-[family-name:var(--font-kalam-var)] flex items-center gap-1.5 wobbly-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {pwdError}
            </div>
          )}

          {pwdSuccess && (
            <div className="mb-4 p-2.5 border border-dashed border-ballpoint bg-ballpoint/5 text-ballpoint text-sm font-bold font-[family-name:var(--font-kalam-var)] flex items-center gap-1.5 wobbly-sm">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              {pwdSuccess}
            </div>
          )}

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="space-y-1">
              <label
                htmlFor="profile-pwd"
                className="block font-[family-name:var(--font-kalam-var)] font-bold text-pencil text-lg"
              >
                New Password *
              </label>
              <input
                id="profile-pwd"
                type="password"
                className="w-full wobbly border-3 border-pencil bg-white px-4 py-2.5 min-h-[52px] font-[family-name:var(--font-patrick-var)] text-pencil text-base placeholder:text-erased focus:outline-none focus:ring-3 focus:ring-ballpoint focus:border-ballpoint transition-all duration-100"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="profile-pwd-confirm"
                className="block font-[family-name:var(--font-kalam-var)] font-bold text-pencil text-lg"
              >
                Confirm New Password *
              </label>
              <input
                id="profile-pwd-confirm"
                type="password"
                className="w-full wobbly border-3 border-pencil bg-white px-4 py-2.5 min-h-[52px] font-[family-name:var(--font-patrick-var)] text-pencil text-base placeholder:text-erased focus:outline-none focus:ring-3 focus:ring-ballpoint focus:border-ballpoint transition-all duration-100"
                placeholder="••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <WobblyButton
              type="submit"
              disabled={pwdLoading}
              className="w-full mt-8"
            >
              {pwdLoading ? "Updating..." : "Update Password"}
            </WobblyButton>
          </form>
        </WobblyCard>

      </div>
    </div>
  );
}
