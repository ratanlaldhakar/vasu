import Link from 'next/link';
import { Github, Twitter, Linkedin, Instagram, Heart, Mail } from 'lucide-react';

const footerLinks = [
  { href: '/', label: 'Home' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

const socialLinks = [
  { href: 'https://github.com/ratanlaldhakar', icon: Github, label: 'GitHub' },
  { href: 'https://x.com/VASUGAMER09', icon: Twitter, label: 'Twitter' },
  { href: 'https://linkedin.com', icon: Linkedin, label: 'LinkedIn' },
  { href: 'https://instagram.com/riskyvasu', icon: Instagram, label: 'Instagram' },
];

export function Footer() {
  return (
    <footer className="border-t-3 border-pencil bg-paper mt-auto">
      {/* Mobile Footer (under 768px) */}
      <div className="md:hidden px-5 py-10 flex flex-col gap-6">
        {/* Brand Card */}
        <div className="wobbly border-3 border-pencil bg-white shadow-hard-md p-5 flex flex-col items-center text-center">
          {/* Logo */}
          <Link href="/" className="font-[family-name:var(--font-kalam-var)] font-bold text-3xl text-pencil mb-2">
            Vasu
          </Link>
          {/* Short Bio */}
          <p className="text-pencil-muted text-base mb-4 leading-relaxed font-[family-name:var(--font-patrick-var)] font-bold">
            Designer & developer crafting beautiful digital experiences and design resources.
          </p>
          <a
            href="mailto:vasu@amrityogacenter.in"
            className="inline-flex items-center gap-2 text-ballpoint hover:text-marker font-bold transition-colors duration-100 squiggly-underline text-base font-[family-name:var(--font-patrick-var)]"
          >
            <Mail className="w-4 h-4" strokeWidth={3} />
            vasu@amrityogacenter.in
          </a>
        </div>

        {/* Quick Links Card */}
        <div className="wobbly border-3 border-pencil bg-white shadow-hard-md p-5 flex flex-col items-center">
          <h4 className="text-lg font-bold text-pencil mb-3 font-[family-name:var(--font-kalam-var)]">
            Pages
          </h4>
          {/* Row of links */}
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-pencil-muted hover:text-marker transition-colors duration-100 font-[family-name:var(--font-patrick-var)] text-base font-bold"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Social Links Card */}
        <div className="wobbly border-3 border-pencil bg-white shadow-hard-md p-5 flex flex-col items-center">
          <h4 className="text-lg font-bold text-pencil mb-3 font-[family-name:var(--font-kalam-var)]">
            Connect
          </h4>
          <div className="flex justify-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="w-12 h-12 wobbly border-3 border-pencil bg-white shadow-hard-sm flex items-center justify-center hover:bg-marker hover:text-white hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-100 text-pencil active:scale-95"
              >
                <social.icon className="w-5 h-5" strokeWidth={2.5} />
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t-2 border-dashed border-pencil/20 text-center flex flex-col items-center gap-2">
          <p className="text-pencil-light text-sm flex items-center gap-1">
            © {new Date().getFullYear()} Vasu. Made with
            <Heart className="w-3.5 h-3.5 text-marker fill-marker" strokeWidth={3} />
            and lots of coffee.
          </p>
          <p className="text-pencil-light text-xs">
            All designs are hand-crafted with care.
          </p>
        </div>
      </div>

      {/* Desktop Footer (md and above - completely untouched) */}
      <div className="hidden md:block max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold text-pencil mb-3 font-[family-name:var(--font-kalam-var)]">
              Vasu
            </h3>
            <p className="text-pencil-muted mb-4">
              Designer & developer crafting beautiful digital experiences and design resources.
            </p>
            <a
              href="mailto:vasu@amrityogacenter.in"
              className="inline-flex items-center gap-2 text-ballpoint hover:text-marker transition-colors duration-100 squiggly-underline"
            >
              <Mail className="w-4 h-4" strokeWidth={3} />
              vasu@amrityogacenter.in
            </a>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-lg font-bold text-pencil mb-3 font-[family-name:var(--font-kalam-var)]">
              Pages
            </h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-pencil-muted hover:text-marker transition-colors duration-100 squiggly-underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-lg font-bold text-pencil mb-3 font-[family-name:var(--font-kalam-var)]">
              Connect
            </h4>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-11 h-11 wobbly border-3 border-pencil bg-white shadow-hard-sm flex items-center justify-center hover:bg-marker hover:text-white hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-100 text-pencil"
                >
                  <social.icon className="w-5 h-5" strokeWidth={2.5} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t-2 border-dashed border-pencil/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-pencil-light text-sm flex items-center gap-1">
            © {new Date().getFullYear()} Vasu. Made with
            <Heart className="w-4 h-4 text-marker fill-marker" strokeWidth={3} />
            and lots of coffee.
          </p>
          <p className="text-pencil-light text-sm">
            All designs are hand-crafted with care.
          </p>
        </div>
      </div>
    </footer>
  );
}
