'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Palette, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

export function Header() {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const isDashboard = pathname?.startsWith('/dashboard') || pathname === '/login' || pathname === '/signup' || pathname === '/forgot-password' || pathname === '/reset-password';
  if (isDashboard) return null;

  const links = [
    { href: '/', label: 'Home' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/#pricing', label: 'Pricing' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    user 
      ? { href: '/dashboard', label: 'Dashboard' } 
      : { href: '/login', label: 'Login' }
  ];

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

  const handleHireClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === '/') {
      e.preventDefault();
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

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
        ? 'bg-paper/85 backdrop-blur-md shadow-hard-sm h-16 md:h-18'
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
              Vasu
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const isActive = !link.href.startsWith('/#') && pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleSectionClick(e, link.href)}
                  className="relative px-4 py-2 font-[family-name:var(--font-patrick-var)] text-lg text-pencil hover:text-marker transition-colors duration-100 group"
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
            <Link
              href="/contact"
              onClick={handleHireClick}
              className="ml-2 wobbly inline-flex items-center gap-2 px-5 py-2 bg-white border-3 border-pencil shadow-hard-sm font-[family-name:var(--font-kalam-var)] font-bold text-pencil hover:bg-marker hover:text-white hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-100"
            >
              <Mail className="w-4 h-4" strokeWidth={3} />
              Hire Me
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-12 h-12 flex items-center justify-center wobbly border-3 border-pencil bg-white shadow-hard-sm active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all duration-100"
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

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden border-t-3 border-pencil bg-paper overflow-hidden"
          >
            <div className="max-w-6xl mx-auto px-5 py-6 flex flex-col gap-3">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    setMobileOpen(false);
                    handleSectionClick(e, link.href);
                  }}
                  className="wobbly-sm px-4 py-3.5 font-[family-name:var(--font-patrick-var)] text-xl text-pencil hover:bg-postit border-2 border-transparent hover:border-pencil transition-all duration-100 flex items-center min-h-[48px]"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/contact"
                onClick={(e) => {
                  setMobileOpen(false);
                  handleHireClick(e);
                }}
                className="wobbly inline-flex items-center justify-center gap-2 px-5 py-4 mt-2 bg-marker text-white border-3 border-pencil shadow-hard-sm font-[family-name:var(--font-kalam-var)] font-bold text-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-100 min-h-[52px]"
              >
                <Mail className="w-5 h-5" strokeWidth={3} />
                Hire Me
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
