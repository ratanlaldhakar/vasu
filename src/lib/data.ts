export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImageUrl: string;
  gallery: string[];
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  problem?: string;
  solution?: string;
  tools?: string[];
  createdAt: string;
  isFeatured?: boolean;
  featuredBadge?: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  priceCents: number;
  previewImages: string[];
  fileUrl: string;
  tags: string[];
  features?: string[];
  createdAt: string;
}

export interface Order {
  id: string;
  productId: string;
  buyerEmail: string;
  stripeSessionId?: string;
  status: "pending" | "completed" | "failed";
  downloadUrl?: string;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: string;
}

/* ===== MOCK PROJECTS ===== */
export const mockProjects: Project[] = [
  {
    id: "p0",
    title: "Amrit Yoga Center",
    slug: "amrit-yoga-center",
    description:
      "A premium modern website built for Amrit Yoga Center featuring course information, online registration, digital certificate verification, local SEO optimization, responsive design, premium UI/UX, contact forms, and high-performance architecture.",
    coverImageUrl: "/yogamrit_hero.png",
    gallery: [
      "/yogamrit_hero.png",
      "/yogamrit_benefits.png",
      "/yogamrit_coach.png"
    ],
    tags: ["Brand Identity", "Web Development", "UI/UX Design", "SEO", "Education", "Responsive"],
    liveUrl: "https://amrityogacenter.in",
    problem:
      "Designed and developed a complete digital platform for Amrit Yoga Center.",
    solution:
      "The project includes a premium handcrafted UI, fully responsive layouts, SEO optimization, digital certificate verification system, inquiry management, contact forms, course pages, Google Maps integration, and performance optimization. The website was built with a strong focus on user experience, fast loading, accessibility, and local search visibility.",
    tools: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "Resend", "Cloudinary", "Vercel", "Responsive Design", "SEO Optimization"],
    createdAt: "2026-07-09",
    isFeatured: true,
    featuredBadge: "⭐ Featured Project",
  },
  {
    id: "p0_berry",
    title: "Berry N' Crumbs",
    slug: "berry-n-crumbs",
    description:
      "A luxury bakery and gifting website designed for Berry N' Crumbs featuring premium product showcases, custom cake ordering, floral gift collections, elegant UI/UX, responsive layouts, and a seamless shopping experience.",
    coverImageUrl: "/berry_hero.png",
    gallery: [
      "/berry_hero.png",
      "/berry_best_selling.png",
      "/berry_artisan.png",
      "/berry_catalog.png"
    ],
    tags: ["E-Commerce", "UI/UX Design", "Web Development", "Brand Identity", "Responsive", "Performance"],
    liveUrl: "https://berryncrumbss.vercel.app/",
    problem:
      "Designed and developed a complete luxury e-commerce website for Berry N' Crumbs. My role involved UI/UX design, frontend development, responsive design, product experience, performance optimization, brand identity design, and deployment.",
    solution:
      "Berry N' Crumbs is a premium bakery and gifting platform built with a luxury-first design approach. The website combines handcrafted UI, elegant typography, responsive layouts, and modern web technologies to create an immersive shopping experience. The project includes product collections, custom cake ordering, bouquet showcases, responsive product pages, inquiry forms, optimized performance, and a premium visual identity inspired by high-end bakery brands. Special attention was given to typography, spacing, image presentation, user experience, and conversion-focused design.",
    tools: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "Cloudinary", "Resend", "Vercel", "Responsive Design", "SEO Optimization"],
    createdAt: "2026-07-09",
    isFeatured: true,
    featuredBadge: "✨ Premium E-Commerce",
  },
  {
    id: "p1",
    title: "Bloom Botanicals",
    slug: "bloom-botanicals",
    description:
      "A complete brand identity and e-commerce website for a sustainable plant shop. From logo design to a fully responsive storefront with custom illustrations.",
    coverImageUrl: "https://images.unsplash.com/photo-1545241047-6083a3684587?w=800&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1545241047-6083a3684587?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=1200&h=800&fit=crop",
    ],
    tags: ["Branding", "Web Design", "E-commerce"],
    liveUrl: "https://example.com",
    problem:
      "Bloom Botanicals needed a distinctive brand that conveyed their commitment to sustainability while appealing to modern plant enthusiasts. Their existing website was outdated and couldn't handle online orders.",
    solution:
      "I designed a warm, organic visual identity featuring hand-drawn botanical illustrations and earthy tones. The e-commerce platform was built with a seamless checkout flow and integrated inventory management.",
    tools: ["Figma", "Next.js", "Stripe", "Illustrator"],
    createdAt: "2025-12-01",
  },
  {
    id: "p2",
    title: "Rhythm Records",
    slug: "rhythm-records",
    description:
      "Brand identity and vinyl record store website for an independent music label. Features a dynamic catalog with audio previews and artist spotlights.",
    coverImageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=1200&h=800&fit=crop",
    ],
    tags: ["Branding", "Web Design", "UI/UX"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    problem:
      "Rhythm Records wanted to stand out in the crowded independent music scene. They needed a website that felt as authentic as their vinyl-first approach to music.",
    solution:
      "I created a retro-modern brand with gritty textures and bold typography. The website features an interactive catalog where visitors can preview tracks, explore artist stories, and purchase records directly.",
    tools: ["Figma", "React", "Tailwind CSS", "Howler.js"],
    createdAt: "2025-10-15",
  },
  {
    id: "p3",
    title: "Wanderlust Travel App",
    slug: "wanderlust-travel",
    description:
      "UI/UX design for a travel planning app that helps users discover hidden gems and create collaborative trip itineraries with friends.",
    coverImageUrl: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&h=800&fit=crop",
    ],
    tags: ["UI/UX", "Mobile", "App Design"],
    problem:
      "Existing travel apps were cluttered with ads and affiliate links. Users wanted a clean, social-first planning tool they could trust.",
    solution:
      "I designed a minimal, map-centric interface with drag-and-drop itinerary building, real-time collaboration features, and curated local recommendations from verified travelers.",
    tools: ["Figma", "Protopie", "Miro"],
    createdAt: "2025-08-20",
  },
  {
    id: "p4",
    title: "Noodle Studio",
    slug: "noodle-studio",
    description:
      "Complete website redesign for an award-winning animation studio. Showcases their reel, team, and process with scroll-driven animations.",
    coverImageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1536104968055-4d61aa56f46a?w=1200&h=800&fit=crop",
    ],
    tags: ["Web Design", "Development", "Animation"],
    liveUrl: "https://example.com",
    problem:
      "Noodle Studio's website didn't reflect the quality of their animation work. It was static, slow, and felt like a corporate brochure rather than a creative studio.",
    solution:
      "I rebuilt their site with smooth scroll-driven animations, an immersive fullscreen showreel, and a playful interactive team page — all while maintaining fast load times and accessibility.",
    tools: ["Next.js", "GSAP", "Three.js", "Figma"],
    createdAt: "2025-06-10",
  },
  {
    id: "p5",
    title: "BrewCraft Dashboard",
    slug: "brewcraft-dashboard",
    description:
      "Admin dashboard design for a craft brewery management platform. Tracks inventory, orders, taproom analytics, and distribution logistics.",
    coverImageUrl: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop",
    ],
    tags: ["UI/UX", "Dashboard", "Web Design"],
    problem:
      "Craft breweries were using spreadsheets and whiteboards to manage everything from grain orders to taproom sales. They needed a unified, intuitive platform.",
    solution:
      "I designed a clean, data-rich dashboard with customizable widgets, real-time inventory alerts, and beautiful data visualizations that make brewery operations feel effortless.",
    tools: ["Figma", "D3.js", "React", "Tailwind CSS"],
    createdAt: "2025-04-05",
  },
  {
    id: "p6",
    title: "Kindred Community App",
    slug: "kindred-community",
    description:
      "Social platform design for neighborhood communities. Enables local event planning, skill sharing, and mutual aid — all within a warm, inviting interface.",
    coverImageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1200&h=800&fit=crop",
    ],
    tags: ["UI/UX", "Mobile", "Branding"],
    problem:
      "Social media apps are designed to maximize engagement, not build real community connections. Neighborhoods needed something more local, trusted, and practical.",
    solution:
      "I designed Kindred with a neighborhood-first approach: hyperlocal feeds, event creation with RSVP tracking, a skill-exchange board, and a mutual aid request system — all wrapped in warm, inclusive visuals.",
    tools: ["Figma", "React Native", "Supabase"],
    createdAt: "2025-02-18",
  },
];

/* ===== MOCK PRODUCTS ===== */
export const mockProducts: Product[] = [
  {
    id: "d1",
    title: "Sketchbook UI Kit",
    slug: "sketchbook-ui-kit",
    description:
      "A comprehensive hand-drawn UI component library with over 120 components. Perfect for wireframing, prototyping, and adding a unique sketch aesthetic to your designs. Every component is meticulously crafted with wobbly borders, pencil textures, and playful details that make your prototypes stand out from the usual polished mockups.",
    priceCents: 2900,
    previewImages: [
      "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&h=600&fit=crop",
    ],
    fileUrl: "/downloads/sketchbook-ui-kit.zip",
    tags: ["UI Kit", "Figma"],
    features: [
      "120+ hand-drawn components",
      "Figma & Sketch files included",
      "Light & dark variants",
      "Auto-layout compatible",
      "Free updates for life",
    ],
    createdAt: "2025-11-01",
  },
  {
    id: "d2",
    title: "Social Media Starter Pack",
    slug: "social-media-starter-pack",
    description:
      "30 beautifully designed social media templates for Instagram, Twitter/X, and LinkedIn. Each template features the hand-drawn sketch aesthetic with customizable text, colors, and image placeholders. Stop spending hours on individual posts — just drop in your content and publish.",
    priceCents: 1900,
    previewImages: [
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&h=600&fit=crop",
    ],
    fileUrl: "/downloads/social-media-pack.zip",
    tags: ["Social Pack", "Templates"],
    features: [
      "30 unique templates",
      "Instagram, Twitter/X, LinkedIn sizes",
      "Canva & Figma formats",
      "Brand color customization",
      "Commercial license included",
    ],
    createdAt: "2025-09-15",
  },
  {
    id: "d3",
    title: "Vintage Poster Collection",
    slug: "vintage-poster-collection",
    description:
      "A curated set of 12 vintage-style poster templates with retro typography, distressed textures, and classic color palettes. Ideal for event promotions, wall art prints, or adding a nostalgic touch to any design project. Each poster is fully editable and print-ready at 300 DPI.",
    priceCents: 2400,
    previewImages: [
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=600&fit=crop",
    ],
    fileUrl: "/downloads/vintage-posters.zip",
    tags: ["Poster Template", "Print"],
    features: [
      "12 unique poster designs",
      "300 DPI print-ready",
      "AI & PSD files included",
      "Editable text & colors",
      "A3 and A4 sizes",
    ],
    createdAt: "2025-07-20",
  },
  {
    id: "d4",
    title: "Hand-Drawn Icon Set",
    slug: "hand-drawn-icon-set",
    description:
      "200+ hand-drawn vector icons across 15 categories including business, social, tech, food, travel, and more. Each icon is crafted with a sketchy, organic feel that pairs perfectly with hand-drawn design projects. Available in SVG, PNG, and icon font formats.",
    priceCents: 1500,
    previewImages: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1545235617-7a424c1a60cc?w=800&h=600&fit=crop",
    ],
    fileUrl: "/downloads/hand-drawn-icons.zip",
    tags: ["Icons", "Graphics"],
    features: [
      "200+ unique icons",
      "15 categories",
      "SVG, PNG & icon font",
      "Consistent 24px grid",
      "Royalty-free license",
    ],
    createdAt: "2025-05-10",
  },
  {
    id: "d5",
    title: "Notebook Landing Page Template",
    slug: "notebook-landing-page",
    description:
      "A complete, production-ready landing page template built with the hand-drawn notebook aesthetic. Includes hero section, features grid, testimonials, pricing table, FAQ accordion, and footer — all with wobbly borders, hard shadows, and sketch typography. Just add your content and deploy.",
    priceCents: 3900,
    previewImages: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    ],
    fileUrl: "/downloads/notebook-landing.zip",
    tags: ["Template", "Web"],
    features: [
      "Fully responsive design",
      "Next.js + Tailwind CSS",
      "6 pre-built sections",
      "SEO optimized",
      "One-click Vercel deploy",
    ],
    createdAt: "2025-03-01",
  },
  {
    id: "d6",
    title: "Brand Identity Toolkit",
    slug: "brand-identity-toolkit",
    description:
      "Everything you need to build a cohesive brand from scratch. Includes logo templates, business card layouts, letterhead designs, social media banners, and a brand guidelines document template. All in the signature hand-drawn style with fully customizable elements.",
    priceCents: 4500,
    previewImages: [
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop",
    ],
    fileUrl: "/downloads/brand-toolkit.zip",
    tags: ["Branding", "Templates"],
    features: [
      "5 logo template styles",
      "Business card & letterhead",
      "Social media banner kit",
      "Brand guidelines template",
      "Figma & Illustrator files",
    ],
    createdAt: "2025-01-12",
  },
];

export interface PricingPlan {
  name: string;
  price: string;
  description: string;
  features: string[];
  buttonLabel: string;
  featured: boolean;
  badge?: string;
  rotation?: number;
  delivery?: string;
}

import { PLAN_PRICES } from "./plansConfig";

export const pricingPlans: PricingPlan[] = [
  {
    name: "Starter",
    price: `₹${PLAN_PRICES.starter.toLocaleString("en-IN")}`,
    description: "Perfect for students, freelancers and personal brands who need a professional online presence.",
    features: [
      "Single Landing Page",
      "Fully Responsive Design",
      "Modern Premium UI",
      "Contact Form",
      "WhatsApp Button",
      "Social Media Links",
      "Basic On-Page SEO",
      "Fast Loading",
      "Free SSL Guidance",
      "7 Days Bug Support"
    ],
    buttonLabel: "Get Started",
    featured: false,
    rotation: -1,
    delivery: "5–7 Days"
  },
  {
    name: "Professional",
    price: `₹${PLAN_PRICES.professional.toLocaleString("en-IN")}`,
    description: "Perfect for local businesses and startups.",
    features: [
      "Up to 5 Pages",
      "Premium Custom Design",
      "Mobile Responsive",
      "Contact Form",
      "WhatsApp Integration",
      "Google Maps",
      "Image Optimization",
      "SEO Setup",
      "Smooth Animations",
      "Performance Optimization",
      "Social Media Integration",
      "Basic Security Setup",
      "30 Days Support"
    ],
    buttonLabel: "Start Project",
    featured: true,
    badge: "Most Popular",
    rotation: 1.5,
    delivery: "7–10 Days"
  },
  {
    name: "Business",
    price: `₹${PLAN_PRICES.business.toLocaleString("en-IN")}`,
    description: "Perfect for businesses that want a stronger online presence.",
    features: [
      "Up to 10 Pages",
      "Fully Custom UI Design",
      "Admin page",
      "Gallery / Portfolio",
      "Testimonials",
      "FAQ Section",
      "Contact Forms",
      "Advanced Performance Optimization",
      "Advanced SEO Setup",
      "Google Analytics Integration",
      "Social Media Integration",
      "Premium Animations",
      "Priority Support",
      "60 Days Support"
    ],
    buttonLabel: "Hire Me",
    featured: false,
    rotation: -1.5,
    delivery: "10–14 Days"
  },
  {
    name: "Custom",
    price: "Custom Quote",
    description: "For projects that require unique functionality.",
    features: [
      "E-commerce Store",
      "Booking Website",
      "Dashboard",
      "Custom Web Application",
      "Multi-vendor Platform",
      "LMS",
      "AI Features",
      "Membership Website",
      "Automation",
      "Custom Integrations"
    ],
    buttonLabel: "Request a Quote",
    featured: false,
    rotation: 1
  }
];
