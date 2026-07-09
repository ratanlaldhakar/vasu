import { Metadata } from "next";
import { Mail, MapPin, Clock, Github, Twitter, Linkedin, Instagram } from "lucide-react";
import { WobblyCard } from "@/components/ui/WobblyCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact Vasu — Hire Freelance Web Developer in Bhilwara",
  description: "Get in touch with Vasu (Vasudev Dhakar) for Next.js website design & custom frontend development inquiries. Professional web development services in Bhilwara, Rajasthan.",
  keywords: [
    "Contact Vasudev Dhakar",
    "Hire Web Developer Bhilwara",
    "Freelance Developer Contact Rajasthan",
    "Vasu Contact Details",
    "Website Development Quote Bhilwara"
  ],
  alternates: {
    canonical: "https://vasu.design/contact",
  },
  openGraph: {
    title: "Contact Vasu — Hire Freelance Web Developer in Bhilwara",
    description: "Get in touch with Vasu for freelance web design and development inquiries in Bhilwara, Rajasthan.",
    url: "https://vasu.design/contact",
    siteName: "Vasu Portfolio",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Vasu — Hire Freelance Web Developer in Bhilwara",
    description: "Get in touch with Vasu for freelance web design and development inquiries.",
    creator: "@VASUGAMER09",
  },
};

const socialLinks = [
  { href: "https://github.com/ratanlaldhakar", icon: Github, label: "GitHub" },
  { href: "https://x.com/VASUGAMER09", icon: Twitter, label: "Twitter" },
  { href: "https://linkedin.com", icon: Linkedin, label: "LinkedIn" },
  { href: "https://instagram.com/riskyvasu", icon: Instagram, label: "Instagram" },
];

export default function ContactPage() {
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://vasu.design'
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Contact',
        'item': 'https://vasu.design/contact'
      }
    ]
  };

  return (
    <div className="py-16 md:py-24 px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="max-w-4xl mx-auto">
        <SectionHeading subtitle="Got a project in mind? Let's chat!">
          Get in <span className="text-marker">Touch</span>
        </SectionHeading>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Contact Form */}
          <div className="lg:col-span-3">
            <ContactForm />
          </div>

          {/* Contact Info Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            <WobblyCard variant="postit" rotation={-1} hover={false} className="!p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 wobbly border-2 border-pencil bg-white flex-shrink-0 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-pencil" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-kalam-var)] font-bold text-pencil">Email</h3>
                  <a
                    href="mailto:vasu@amrityogacenter.in"
                    className="text-ballpoint hover:text-marker transition-colors duration-100"
                  >
                    vasu@amrityogacenter.in
                  </a>
                </div>
              </div>
            </WobblyCard>

            <WobblyCard variant="postit" rotation={1} hover={false} className="!p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 wobbly border-2 border-pencil bg-white flex-shrink-0 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-pencil" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-kalam-var)] font-bold text-pencil">Location</h3>
                  <p className="text-pencil-muted">Remote — Available Worldwide</p>
                </div>
              </div>
            </WobblyCard>

            <WobblyCard variant="postit" rotation={-0.5} hover={false} className="!p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 wobbly border-2 border-pencil bg-white flex-shrink-0 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-pencil" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-kalam-var)] font-bold text-pencil">Response Time</h3>
                  <p className="text-pencil-muted">Usually within 24 hours</p>
                </div>
              </div>
            </WobblyCard>

            {/* Social Links */}
            <div>
              <h3 className="font-[family-name:var(--font-kalam-var)] font-bold text-pencil mb-3 text-lg">Find me elsewhere</h3>
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
        </div>
      </div>
    </div>
  );
}
