"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Briefcase, MessageSquare, Folder, Receipt } from "lucide-react";

export function ClientMobileNav() {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/dashboard",
      label: "Home",
      icon: LayoutDashboard,
      isActive: pathname === "/dashboard"
    },
    {
      href: "/dashboard/projects",
      label: "Projects",
      icon: Briefcase,
      isActive: pathname === "/dashboard/projects"
    },
    {
      href: "/dashboard/messages",
      label: "Messages",
      icon: MessageSquare,
      isActive: pathname === "/dashboard/messages"
    },
    {
      href: "/dashboard/files",
      label: "Files",
      icon: Folder,
      isActive: pathname === "/dashboard/files"
    },
    {
      href: "/dashboard/bookings",
      label: "Invoices",
      icon: Receipt,
      isActive: pathname === "/dashboard/bookings"
    }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t-3 border-pencil shadow-[0_-4px_12px_rgba(0,0,0,0.08)] px-1 py-1.5 flex items-center justify-around font-[family-name:var(--font-kalam-var)]">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all duration-100 min-w-[56px] min-h-[48px] ${
            item.isActive
              ? "bg-marker text-white border-2 border-pencil shadow-hard-sm -translate-y-1 font-bold"
              : "text-pencil-light hover:text-pencil hover:bg-erased/40"
          }`}
        >
          <item.icon className="w-5 h-5 mb-0.5" strokeWidth={item.isActive ? 2.5 : 2} />
          <span className="text-[10px] leading-none font-bold">
            {item.label}
          </span>
        </Link>
      ))}
    </nav>
  );
}
