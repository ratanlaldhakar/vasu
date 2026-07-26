"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Home, 
  Briefcase, 
  MessageSquare, 
  FolderOpen, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  Palette,
  CreditCard,
  ChevronRight
} from "lucide-react";

import { ClientMobileNav } from "@/components/dashboard/ClientMobileNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, signOut, profile } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center font-[family-name:var(--font-kalam-var)] text-2xl text-pencil">
        Loading Client Portal...
      </div>
    );
  }

  const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/dashboard/projects", label: "My Projects", icon: Briefcase },
    { href: "/dashboard/messages", label: "Messages", icon: MessageSquare },
    { href: "/dashboard/files", label: "Files Cabinet", icon: FolderOpen },
    { href: "/dashboard/bookings", label: "Invoices & Bookings", icon: CreditCard },
    { href: "/dashboard/profile", label: "Profile Settings", icon: User },
  ];

  return (
    <div className="min-h-screen bg-paper bg-[radial-gradient(#e5e0d8_1.5px,transparent_1.5px)] bg-[size:24px_24px] flex flex-col md:flex-row text-pencil pb-20 md:pb-0">
      
      {/* Mobile Top Header Bar */}
      <div className="md:hidden h-16 border-b-3 border-pencil bg-white/95 backdrop-blur-md flex items-center justify-between px-4 sticky top-0 z-40 shadow-hard-sm">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-marker border-2 border-pencil shadow-hard-sm flex items-center justify-center wobbly">
            <Palette className="w-4 h-4 text-white" strokeWidth={3} />
          </div>
          <span className="font-[family-name:var(--font-kalam-var)] font-bold text-xl text-pencil">
            Vasu Portal
          </span>
        </Link>

        {/* 3-Line Menu Button on Right Side */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="w-10 h-10 wobbly border-2 border-pencil bg-white flex items-center justify-center shadow-hard-sm active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer"
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
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-marker border-3 border-pencil shadow-hard-sm flex items-center justify-center wobbly">
                <Palette className="w-5 h-5 text-white" strokeWidth={3} />
              </div>
              <span className="font-[family-name:var(--font-kalam-var)] font-bold text-2xl text-pencil">
                Vasu Portal
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

          {/* User Profile Brief */}
          <div className="wobbly-sm border-2 border-pencil p-3.5 bg-paper rounded-xl shadow-hard-sm">
            <div className="text-[10px] text-marker font-[family-name:var(--font-kalam-var)] font-extrabold uppercase tracking-wider">
              👤 ACTIVE CLIENT PORTAL
            </div>
            <div className="font-bold text-base text-pencil mt-0.5 truncate font-[family-name:var(--font-kalam-var)]">
              {profile?.name || user.email?.split("@")[0] || "Client"}
            </div>
            <div className="text-xs font-mono text-pencil-light truncate mt-0.5">
              {user.email}
            </div>
          </div>

          {/* Nav List */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
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
          </nav>
        </div>

        {/* Sidebar Footer (Logout) */}
        <div className="pt-4 border-t-2 border-dashed border-pencil/20">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full wobbly-sm flex items-center justify-center gap-2 px-4 py-3 border-2 border-pencil bg-marker/10 font-[family-name:var(--font-kalam-var)] text-base font-bold text-marker hover:bg-marker hover:text-white transition-all duration-100 cursor-pointer min-h-[48px] rounded-xl shadow-hard-sm"
          >
            <LogOut className="w-5 h-5" />
            Logout Account
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile drawer */}
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
      <ClientMobileNav />
    </div>
  );
}
