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
  ShieldAlert,
  CreditCard,
  ChevronRight
} from "lucide-react";
import { WobblyCard } from "@/components/ui/WobblyCard";
import { WobblyButton } from "@/components/ui/WobblyButton";

import { AdminMobileNav } from "@/components/admin/AdminMobileNav";

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
    { href: "/admin/portfolio", label: "Portfolio Showcase", icon: Palette },
    { href: "/admin/invoices", label: "Invoices & Billing", icon: CreditCard },
    { href: "/admin/messages", label: "Messages Thread", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-paper bg-[radial-gradient(#e5e0d8_1.5px,transparent_1.5px)] bg-[size:24px_24px] flex flex-col md:flex-row text-pencil pb-20 md:pb-0">
      
      {/* Mobile Header */}
      <div className="md:hidden h-16 border-b-3 border-pencil bg-white/95 backdrop-blur-md flex items-center justify-between px-4 sticky top-0 z-40 shadow-hard-sm">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-marker border-2 border-pencil shadow-hard-sm flex items-center justify-center wobbly">
            <Palette className="w-4 h-4 text-white" strokeWidth={3} />
          </div>
          <span className="font-[family-name:var(--font-kalam-var)] font-bold text-xl text-pencil">
            Admin Console
          </span>
        </Link>

        {/* 3-Line Menu Button on Right Side */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="w-10 h-10 wobbly border-2 border-pencil bg-white flex items-center justify-center shadow-hard-sm active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5 text-pencil" /> : <Menu className="w-5 h-5 text-pencil" />}
        </button>
      </div>

      {/* Sidebar Navigation: Toggling from RIGHT side on Mobile */}
      <aside className={`fixed inset-y-0 right-0 md:left-0 z-50 w-72 md:w-64 bg-white border-l-3 md:border-l-0 md:border-r-3 border-pencil p-6 flex flex-col justify-between transition-transform duration-300 ease-in-out shadow-hard-lg md:shadow-none md:translate-x-0 md:static ${
        mobileMenuOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
      }`}>
        <div className="space-y-6">
          {/* Logo & Close Button */}
          <div className="flex items-center justify-between border-b-2 border-dashed border-pencil/20 pb-4">
            <Link href="/admin" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-marker border-3 border-pencil shadow-hard-sm flex items-center justify-center wobbly">
                <Palette className="w-5 h-5 text-white" strokeWidth={3} />
              </div>
              <span className="font-[family-name:var(--font-kalam-var)] font-bold text-2xl text-pencil">
                Admin Console
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden p-1.5 border-2 border-pencil rounded-lg hover:bg-marker hover:text-white transition-colors cursor-pointer"
              title="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Admin Badge */}
          <div className="wobbly-sm border-2 border-dashed border-marker/30 p-3.5 bg-marker/5 rounded-xl">
            <div className="text-[10px] text-marker font-[family-name:var(--font-kalam-var)] font-extrabold uppercase tracking-wider">
              🛠️ SYSTEM ADMIN
            </div>
            <div className="font-bold text-base text-pencil mt-0.5 truncate font-[family-name:var(--font-kalam-var)]">
              {user.email}
            </div>
          </div>

          {/* Nav List */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const isActive = item.href === "/admin" 
                ? (pathname === "/admin" || pathname.startsWith("/admin/clients/"))
                : pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`wobbly-sm flex items-center justify-between px-4 py-3 border-2 border-pencil font-[family-name:var(--font-patrick-var)] text-lg font-bold transition-all duration-100 min-h-[48px] rounded-xl ${
                    isActive
                      ? "bg-postit border-pencil text-pencil shadow-hard-sm translate-x-[2px] translate-y-[2px]"
                      : "bg-white hover:bg-paper border-pencil/30 text-pencil"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-5 h-5 ${isActive ? "text-pencil" : "text-pencil-light"}`} />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </Link>
              );
            })}

            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="wobbly-sm flex items-center justify-between px-4 py-3 border-2 border-pencil bg-white hover:bg-paper font-[family-name:var(--font-patrick-var)] text-lg font-bold text-pencil min-h-[48px] rounded-xl"
            >
              <div className="flex items-center gap-3">
                <Home className="w-5 h-5 text-pencil-light" />
                <span>Public Website</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </Link>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t-2 border-dashed border-pencil/20">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full wobbly-sm flex items-center justify-center gap-2 px-4 py-3 border-2 border-pencil bg-marker/10 font-[family-name:var(--font-kalam-var)] text-base font-bold text-marker hover:bg-marker hover:text-white transition-all duration-100 cursor-pointer min-h-[48px] rounded-xl shadow-hard-sm"
          >
            <LogOut className="w-5 h-5" />
            Logout Console
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-pencil/50 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      {/* Main Workspace */}
      <main className="flex-1 p-4 sm:p-6 md:p-10 md:max-w-[calc(100vw-256px)] overflow-x-hidden">
        {children}
      </main>

      {/* Mobile Bottom Quick Navigation Bar */}
      <AdminMobileNav />
    </div>
  );
}
