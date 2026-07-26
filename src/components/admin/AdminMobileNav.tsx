"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, CreditCard, MessageSquare, Home, Palette } from "lucide-react";

export function AdminMobileNav() {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/admin",
      label: "Clients",
      icon: Users,
      isActive: pathname === "/admin" || pathname.startsWith("/admin/clients/")
    },
    {
      href: "/admin/portfolio",
      label: "Portfolio",
      icon: Palette,
      isActive: pathname === "/admin/portfolio"
    },
    {
      href: "/admin/invoices",
      label: "Invoices",
      icon: CreditCard,
      isActive: pathname === "/admin/invoices"
    },
    {
      href: "/admin/messages",
      label: "Messages",
      icon: MessageSquare,
      isActive: pathname === "/admin/messages"
    },
    {
      href: "/",
      label: "Website",
      icon: Home,
      isActive: false
    }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t-3 border-pencil shadow-[0_-4px_12px_rgba(0,0,0,0.08)] px-2 py-1.5 flex items-center justify-around font-[family-name:var(--font-kalam-var)]">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all duration-100 min-w-[64px] min-h-[48px] ${
            item.isActive
              ? "bg-marker text-white border-2 border-pencil shadow-hard-sm -translate-y-1 font-bold"
              : "text-pencil-light hover:text-pencil hover:bg-erased/40"
          }`}
        >
          <item.icon className="w-5 h-5 mb-0.5" strokeWidth={item.isActive ? 2.5 : 2} />
          <span className="text-[11px] leading-none font-bold">
            {item.label}
          </span>
        </Link>
      ))}
    </nav>
  );
}
