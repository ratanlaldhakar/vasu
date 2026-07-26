'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Palette, Mail, User, LayoutDashboard, ShieldCheck, Home, Briefcase, Tag, Info, PhoneCall, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

export function Header() {
  const { user, isAdmin } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isDashboard = pathname?.startsWith('/dashboard') || pathname === '/login' || pathname === '/signup' || pathname === '/forgot-password' || pathname === '/reset-password' || pathname?.startsWith('/admin');
  if (isDashboard) return null;

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/portfolio', label: 'Portfolio', icon: Briefcase },
    { href: '/#pricing', label: 'Pricing', icon: Tag },
    { href: '/about', label: 'About', icon: Info },
    { href: '/contact', label: 'Contact', icon: PhoneCall },
  ];

  const authTarget = user
    ? (isAdmin 
        ? { href: '/admin', label: 'Admin Panel', Icon: ShieldCheck, badgeClass: 'bg-marker text-white' }
        : { href: '/dashboard', label: 'Client Dashboard', Icon: LayoutDashboard, badgeClass: 'bg-marker text-white' })
    : { href: '/login', label: 'Client Portal Login', Icon: User, badgeClass: 'bg-marker text-white' };

  const handleSectionClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/#') && pathname === '/') {
      e.preventDefault();
      const id = href.slice(2);
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 border-b-3 border-pencil ${
      scrolled
        ? 'bg-paper/90 backdrop-blur-md shadow-hard-sm h-16 md:h-18'
        : 'bg-paper/95 h-16 md:h-20'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-full flex items-center">
        <div className="flex items-center justify-between w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-marker border-3 border-pencil shadow-hard-sm flex items-center justify-center wobbly transition-all duration-100 group-hover:shadow-none group-hover:translate-x-[2px] group-hover:translate-y-[2px]">
              <Palette className="w-5 h-5 text-white" strokeWidth={3} />
            </div>
            <span className="font-[family-name:var(--font-kalam-var)] font-bold text-2xl text-pencil">
              Vasu Studio
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-3">
            {navLinks.map((link) => {
              const isActive = !link.href.startsWith('/#') && pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleSectionClick(e, link.href)}
                  className="relative px-3.5 py-2 font-[family-name:var(--font-patrick-var)] text-lg text-pencil hover:text-marker transition-colors duration-100 group font-bold"
                >
                  {link.label}
                  {isActive ? (
                    <motion.span
                      layoutId="activeUnderline"
                      className="absolute bottom-0 left-3 right-3 h-[3px] bg-marker wobbly"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  ) : (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[3px] bg-marker transition-all duration-100 group-hover:w-3/4 wobbly" />
                  )}
                </Link>
              );
            })}

            {/* Main Highlighted Login / Dashboard CTA Button */}
            <Link
              href={authTarget.href}
              className={`wobbly inline-flex items-center gap-2 px-5 py-2.5 border-3 border-pencil shadow-hard-sm font-[family-name:var(--font-kalam-var)] font-bold text-lg hover:bg-pencil hover:text-white hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-100 ${authTarget.badgeClass}`}
            >
              <authTarget.Icon className="w-5 h-5" strokeWidth={3} />
              {authTarget.label}
            </Link>
          </nav>

          {/* Mobile Menu Toggle Button (Aligned Right) */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-11 h-11 flex items-center justify-center wobbly border-3 border-pencil bg-white shadow-hard-sm active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all duration-100 cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-6 h-6 text-pencil" strokeWidth={3} />
            ) : (
              <Menu className="w-6 h-6 text-pencil" strokeWidth={3} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-b-3 border-pencil bg-white shadow-hard-lg rounded-b-2xl overflow-hidden"
          >
            <div className="max-w-6xl mx-auto px-4 py-5 flex flex-col gap-2 bg-paper/50">
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      setMobileOpen(false);
                      handleSectionClick(e, link.href);
                    }}
                    className="wobbly-sm px-4 py-3 font-[family-name:var(--font-patrick-var)] font-bold text-xl text-pencil bg-white border-2 border-pencil hover:bg-postit transition-all duration-100 flex items-center justify-between min-h-[48px] shadow-hard-sm"
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className="w-5 h-5 text-marker" />
                      <span>{link.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-pencil-light" />
                  </Link>
                );
              })}

              <div className="h-[2px] bg-pencil/20 my-2 wobbly" />

              {/* Highlighted Login / Dashboard CTA Button */}
              <Link
                href={authTarget.href}
                onClick={() => setMobileOpen(false)}
                className={`wobbly inline-flex items-center justify-center gap-2 px-5 py-3.5 border-3 border-pencil shadow-hard-sm font-[family-name:var(--font-kalam-var)] font-bold text-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-100 min-h-[52px] rounded-xl ${authTarget.badgeClass}`}
              >
                <authTarget.Icon className="w-5 h-5" strokeWidth={3} />
                {authTarget.label}
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
