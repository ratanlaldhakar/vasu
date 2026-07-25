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
  CreditCard
} from "lucide-react";

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
    { href: "/dashboard/files", label: "Files", icon: FolderOpen },
    { href: "/dashboard/bookings", label: "Invoices & Bookings", icon: CreditCard },
    { href: "/dashboard/profile", label: "Profile Settings", icon: User },
  ];

  return (
    <div className="min-h-screen bg-paper bg-[radial-gradient(#e5e0d8_1.5px,transparent_1.5px)] bg-[size:24px_24px] flex flex-col md:flex-row text-pencil">
      {/* Mobile Top Header Bar */}
      <div className="md:hidden h-16 border-b-3 border-pencil bg-white flex items-center justify-between px-4 sticky top-0 z-40">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-marker border-2 border-pencil shadow-hard-sm flex items-center justify-center wobbly">
            <Palette className="w-4 h-4 text-white" strokeWidth={3} />
          </div>
          <span className="font-[family-name:var(--font-kalam-var)] font-bold text-xl text-pencil">
            Vasu Portal
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-10 h-10 wobbly border-2 border-pencil bg-white flex items-center justify-center shadow-hard-sm active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r-3 border-pencil p-6 flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 md:static ${
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="space-y-8">
          {/* Logo */}
          <div className="hidden md:flex items-center gap-2.5">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-marker border-3 border-pencil shadow-hard-sm flex items-center justify-center wobbly">
                <Palette className="w-5 h-5 text-white" strokeWidth={3} />
              </div>
              <span className="font-[family-name:var(--font-kalam-var)] font-bold text-2xl text-pencil">
                Vasu Portal
              </span>
            </Link>
          </div>

          {/* User Briefing */}
          <div className="wobbly-sm border-2 border-dashed border-pencil/30 p-4 bg-paper bg-[radial-gradient(#e5e0d8_1px,transparent_1px)] bg-[size:16px_16px]">
            <div className="text-xs text-pencil-lightest font-[family-name:var(--font-kalam-var)] font-bold">
              👤 ACTIVE CLIENT
            </div>
            <div className="font-bold text-base text-pencil mt-0.5 truncate">
              {profile?.name || "Client"}
            </div>
            <div className="text-xs text-pencil-light truncate mt-0.5">
              {profile?.email}
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
          </nav>
        </div>

        {/* Sidebar Footer (Logout) */}
        <div className="pt-4 border-t-2 border-dashed border-pencil/20">
          <button
            onClick={handleLogout}
            className="w-full wobbly-sm flex items-center gap-3 px-4 py-3 border-2 border-transparent font-[family-name:var(--font-kalam-var)] text-base font-bold text-marker hover:bg-marker/5 hover:border-marker/30 transition-all duration-100 cursor-pointer min-h-[44px]"
          >
            <LogOut className="w-5 h-5 text-marker" />
            Logout Account
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile drawer */}
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
