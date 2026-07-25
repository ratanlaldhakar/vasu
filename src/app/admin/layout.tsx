"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Users, 
  MessageSquare, 
  LogOut, 
  Menu, 
  X, 
  Palette,
  Home,
  ShieldAlert
} from "lucide-react";
import { WobblyCard } from "@/components/ui/WobblyCard";
import { WobblyButton } from "@/components/ui/WobblyButton";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, isAdmin, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center font-[family-name:var(--font-kalam-var)] text-2xl text-pencil">
        ✏️ Reading administrator keys...
      </div>
    );
  }

  // Access Denied Shield Page
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-paper bg-[radial-gradient(#e5e0d8_1.5px,transparent_1.5px)] bg-[size:24px_24px] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <WobblyCard
            variant="default"
            decoration="thumbtack"
            rotation={-0.5}
            hover={false}
            tilt={false}
            className="bg-white border-3 border-pencil shadow-hard-lg p-6 md:p-8 text-center"
          >
            <ShieldAlert className="w-16 h-16 text-marker mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-pencil mb-3 font-[family-name:var(--font-kalam-var)]">
              Access Denied 🚫
            </h2>
            <p className="text-pencil-light text-lg mb-6 font-[family-name:var(--font-patrick-var)] font-bold leading-relaxed">
              This space is restricted to portal administrators. If you are an active client, please go to your client portal dashboard.
            </p>
            <div className="flex flex-col gap-3">
              <WobblyButton href="/dashboard" className="w-full">
                Go to Client Portal →
              </WobblyButton>
              <button
                onClick={handleLogout}
                className="text-pencil-muted hover:text-marker font-bold font-[family-name:var(--font-kalam-var)]"
              >
                Sign In with another Account
              </button>
            </div>
          </WobblyCard>
        </div>
      </div>
    );
  }

  const menuItems = [
    { href: "/admin", label: "All Clients", icon: Users },
    { href: "/admin/messages", label: "Messages Thread", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-paper bg-[radial-gradient(#e5e0d8_1.5px,transparent_1.5px)] bg-[size:24px_24px] flex flex-col md:flex-row text-pencil">
      {/* Mobile Header */}
      <div className="md:hidden h-16 border-b-3 border-pencil bg-white flex items-center justify-between px-4 sticky top-0 z-40">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-marker border-2 border-pencil shadow-hard-sm flex items-center justify-center wobbly">
            <Palette className="w-4 h-4 text-white" strokeWidth={3} />
          </div>
          <span className="font-[family-name:var(--font-kalam-var)] font-bold text-xl text-pencil">
            Admin Console
          </span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="w-10 h-10 wobbly border-2 border-pencil bg-white flex items-center justify-center shadow-hard-sm active:translate-x-[1px] active:translate-y-[1px]"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r-3 border-pencil p-6 flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 md:static ${
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="space-y-8">
          {/* Logo */}
          <div className="hidden md:flex items-center gap-2.5">
            <Link href="/admin" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-marker border-3 border-pencil shadow-hard-sm flex items-center justify-center wobbly">
                <Palette className="w-5 h-5 text-white" strokeWidth={3} />
              </div>
              <span className="font-[family-name:var(--font-kalam-var)] font-bold text-2xl text-pencil">
                Admin Console
              </span>
            </Link>
          </div>

          {/* Admin badge */}
          <div className="wobbly-sm border-2 border-dashed border-marker/30 p-4 bg-marker/5">
            <div className="text-xs text-marker font-[family-name:var(--font-kalam-var)] font-bold">
              🛠️ SYSTEM ADMIN
            </div>
            <div className="font-bold text-base text-pencil mt-0.5 truncate">
              {user.email}
            </div>
          </div>

          {/* Nav List */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              // Exact matches or sub-matches for admin client detail pages
              const isActive = item.href === "/admin" 
                ? (pathname === "/admin" || pathname.startsWith("/admin/clients/"))
                : pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`wobbly-sm flex items-center gap-3 px-4 py-3 border-2 border-transparent font-[family-name:var(--font-patrick-var)] text-lg font-bold transition-all duration-100 min-h-[44px] ${
                    isActive
                      ? "bg-postit border-pencil text-pencil shadow-hard-sm translate-x-[2px] translate-y-[2px]"
                      : "hover:bg-erased/40 hover:border-pencil/20 text-pencil-muted hover:text-pencil"
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? "text-pencil" : "text-pencil-light"}`} />
                  {item.label}
                </Link>
              );
            })}

            <Link
              href="/"
              className="wobbly-sm flex items-center gap-3 px-4 py-3 border-2 border-transparent font-[family-name:var(--font-patrick-var)] text-lg font-bold text-pencil-muted hover:bg-erased/40 hover:border-pencil/20 hover:text-pencil min-h-[44px]"
            >
              <Home className="w-5 h-5 text-pencil-light" />
              Public Website
            </Link>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t-2 border-dashed border-pencil/20">
          <button
            onClick={handleLogout}
            className="w-full wobbly-sm flex items-center gap-3 px-4 py-3 border-2 border-transparent font-[family-name:var(--font-kalam-var)] text-base font-bold text-marker hover:bg-marker/5 hover:border-marker/30 transition-all duration-100 cursor-pointer min-h-[44px]"
          >
            <LogOut className="w-5 h-5 text-marker" />
            Logout Console
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-pencil/30 z-20 md:hidden"
        />
      )}

      {/* Main Workspace */}
      <main className="flex-1 p-6 md:p-10 md:max-w-[calc(100vw-256px)] overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
