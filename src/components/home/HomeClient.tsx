"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Pencil, Code, Star, Zap, Coffee, Mail } from 'lucide-react';
import { WobblyCard } from '@/components/ui/WobblyCard';
import { WobblyButton } from '@/components/ui/WobblyButton';
import { WobblyInput } from '@/components/ui/WobblyInput';
import { WobblyTextarea } from '@/components/ui/WobblyTextarea';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { mockProjects, pricingPlans } from '@/lib/data';
import { ContactForm } from '@/components/contact/ContactForm';

const loadRazorpayScript = () => {
  return new Promise<boolean>((resolve) => {
    if (typeof window !== "undefined" && (window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function HomeClient() {
  const featuredProjects = mockProjects.slice(0, 3);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const timelineRef = useRef<HTMLDivElement>(null);
  const [activePlan, setActivePlan] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittingStatus, setSubmittingStatus] = useState<string>("");
  const [showPaymentSuccessModal, setShowPaymentSuccessModal] = useState(false);
  const [paymentSuccessId, setPaymentSuccessId] = useState("");
  const [showPaymentFailedModal, setShowPaymentFailedModal] = useState(false);
  const [paymentErrorMsg, setPaymentErrorMsg] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [activePlanIdx, setActivePlanIdx] = useState(1);
  const [expandedPlans, setExpandedPlans] = useState<Record<string, boolean>>({});
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeProjectIdx, setActiveProjectIdx] = useState(0);
  const projectCarouselRef = useRef<HTMLDivElement>(null);

  const handleProjectCarouselScroll = () => {
    if (!projectCarouselRef.current) return;
    const scrollLeft = projectCarouselRef.current.scrollLeft;
    const width = projectCarouselRef.current.offsetWidth;
    const newIdx = Math.round(scrollLeft / width);
    if (newIdx >= 0 && newIdx < featuredProjects.length) {
      setActiveProjectIdx(newIdx);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCarouselScroll = () => {
    if (!carouselRef.current) return;
    const scrollLeft = carouselRef.current.scrollLeft;
    const width = carouselRef.current.offsetWidth;
    const cardWidth = width * 0.85; // match width layout card + gap
    const newIdx = Math.round(scrollLeft / (cardWidth + 16));
    if (newIdx >= 0 && newIdx < pricingPlans.length) {
      setActivePlanIdx(newIdx);
    }
  };

  const togglePlanFeatures = (planName: string) => {
    setExpandedPlans(prev => ({
      ...prev,
      [planName]: !prev[planName]
    }));
  };

  // Scroll to featured card on mount or when isMobile activates
  useEffect(() => {
    if (isMobile && carouselRef.current) {
      const timer = setTimeout(() => {
        if (carouselRef.current) {
          const width = carouselRef.current.offsetWidth;
          const cardWidth = width * 0.85;
          carouselRef.current.scrollLeft = (cardWidth + 16) * 1; // index 1: Professional
          setActivePlanIdx(1);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isMobile]);

  // Scroll Progress indicator hook for the Timeline progress line
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start end", "end end"]
  });
  const timelineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 15,
        y: (e.clientY / window.innerHeight - 0.5) * 15,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActivePlan(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const wordRevealContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.15
      }
    }
  } as const;

  const wordRevealItem = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      },
      transitionEnd: { transform: "none" }
    }
  } as const;

  const floatAnimation = (rotate: number) => ({
    y: [-4, 4, -4],
    rotate: [rotate - 1, rotate + 1, rotate - 1],
  });

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.05
      }
    }
  } as const;

  // Featured Work: Fade + 20px upward reveal
  const revealItem = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15
      },
      transitionEnd: { transform: "none" }
    }
  } as const;

  // Mobile Featured Work: Fade + Scale
  const mobileProjectReveal = {
    hidden: { opacity: 0, scale: 0.97, y: 15 },
    show: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 18
      },
      transitionEnd: { transform: "none" }
    }
  } as const;

  // Mobile Timeline: Slide in from left
  const mobileTimelineCardReveal = {
    hidden: { opacity: 0, x: -30 },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 90,
        damping: 16
      },
      transitionEnd: { transform: "none" }
    }
  } as const;

  // Pricing: Opacity Fade-in only
  const pricingRevealItem = {
    hidden: { opacity: 0 },
    show: { 
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  } as const;

  // Timeline: Alternating slide-in
  const timelineCardReveal = (index: number) => {
    const xOffset = index % 2 === 0 ? -50 : 50;
    return {
      hidden: { opacity: 0, x: xOffset },
      show: {
        opacity: 1,
        x: 0,
        transition: {
          type: "spring" as const,
          stiffness: 80,
          damping: 16,
          delay: 0.05
        },
        transitionEnd: { transform: "none" }
      }
    };
  };

  return (
    <div className="overflow-hidden">
      {/* ===== HERO ===== */}
      <section className="relative min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)] flex flex-col justify-between items-center px-5 py-8 md:py-12">
        <div /> {/* Spacer for flex-between balancing */}

        {/* Decorative elements - floating shape layers with mouse parallax */}
        <motion.div 
          animate={{
            rotate: floatAnimation(-6).rotate,
            x: mousePos.x * 0.4,
            y: [
              floatAnimation(-6).y[0] + mousePos.y * 0.4, 
              floatAnimation(-6).y[1] + mousePos.y * 0.4, 
              floatAnimation(-6).y[2] + mousePos.y * 0.4
            ]
          }}
          transition={{
            y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" },
            x: { type: "spring", damping: 30, stiffness: 100 }
          }}
          className="hidden md:block absolute top-20 left-10 w-16 h-16 border-3 border-pencil wobbly bg-postit shadow-hard-sm" 
        />
        <motion.div 
          animate={{
            rotate: floatAnimation(4).rotate,
            x: mousePos.x * -0.4,
            y: [
              floatAnimation(4).y[0] + mousePos.y * -0.4, 
              floatAnimation(4).y[1] + mousePos.y * -0.4, 
              floatAnimation(4).y[2] + mousePos.y * -0.4
            ]
          }}
          transition={{
            y: { duration: 7, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 7, repeat: Infinity, ease: "easeInOut" },
            x: { type: "spring", damping: 30, stiffness: 100 }
          }}
          className="hidden md:block absolute top-40 right-16 w-12 h-12 border-3 border-pencil wobbly-md bg-marker/20 shadow-hard-sm" 
        />
        <motion.div 
          animate={{
            rotate: floatAnimation(8).rotate,
            x: mousePos.x * 0.2,
            y: [
              floatAnimation(8).y[0] + mousePos.y * 0.2, 
              floatAnimation(8).y[1] + mousePos.y * 0.2, 
              floatAnimation(8).y[2] + mousePos.y * 0.2
            ]
          }}
          transition={{
            y: { duration: 8, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 8, repeat: Infinity, ease: "easeInOut" },
            x: { type: "spring", damping: 30, stiffness: 100 }
          }}
          className="hidden md:block absolute bottom-20 left-1/4 w-8 h-8 border-3 border-pencil bg-ballpoint/20 wobbly shadow-hard-sm" 
        />

        <div className="w-full max-w-4xl mx-auto text-center my-auto flex flex-col items-center">
          {/* Role Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-center mb-6 md:mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 wobbly border-2 border-dashed border-pencil/50 bg-white/50 text-pencil-muted">
              <Sparkles className="w-4 h-4 text-marker animate-pulse" strokeWidth={3} />
              <span className="font-[family-name:var(--font-patrick-var)] text-sm font-bold">Designer & Developer</span>
            </div>
          </motion.div>

          {/* Heading - Staggered on desktop, clean Fade Up on mobile */}
          <div className="md:hidden w-full">
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-4xl font-bold text-pencil mb-4 leading-[1.2]"
            >
              Hi, I&apos;m <span className="text-marker squiggly-underline inline-block">Vasu</span>
              <span className="sr-only"> — Vasudev Dhakar | Full Stack Web Developer &amp; UI/UX Designer in Bhilwara, Rajasthan</span>
            </motion.h1>
          </div>
          <div className="hidden md:block w-full">
            <motion.h1 
              variants={wordRevealContainer}
              initial="hidden"
              animate="show"
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-pencil mb-6 leading-[1.1]"
            >
              <motion.span variants={wordRevealItem} className="inline-block mr-3">Hi,</motion.span>
              <motion.span variants={wordRevealItem} className="inline-block mr-3">I&apos;m</motion.span>
              <motion.span 
                variants={wordRevealItem} 
                className="text-marker squiggly-underline inline-block"
              >
                Vasu
              </motion.span>
              <span className="sr-only"> — Vasudev Dhakar | Full Stack Web Developer &amp; UI/UX Designer in Bhilwara, Rajasthan</span>
            </motion.h1>
          </div>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
            className="text-lg md:text-2xl text-pencil-muted max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed px-2 md:px-0"
          >
            I design and build beautiful digital experiences.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-sm sm:max-w-none px-4 sm:px-0"
          >
            <WobblyButton 
              href="/portfolio" 
              size="lg"
              className="w-full sm:w-auto min-h-[52px] md:min-h-[56px] text-base md:text-lg"
            >
              <Pencil className="w-5 h-5 mr-2" strokeWidth={3} />
              View My Work
            </WobblyButton>
            <WobblyButton 
              href="#contact" 
              variant="secondary" 
              size="lg"
              className="w-full sm:w-auto min-h-[52px] md:min-h-[56px] text-base md:text-lg"
            >
              <Mail className="w-5 h-5 mr-2" strokeWidth={3} />
              Contact Me
            </WobblyButton>
          </motion.div>
        </div>

        {/* Bouncing scroll indicator */}
        <motion.div 
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex justify-center w-full mt-6 md:mt-0"
        >
          {/* Desktop Arrow */}
          <svg width="40" height="80" viewBox="0 0 40 80" fill="none" className="hidden md:block text-pencil-lightest">
            <path d="M20 0 C20 0, 18 20, 20 40 C22 60, 16 70, 20 80" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" strokeDasharray="6 4" />
            <path d="M12 68 L20 80 L28 68" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </svg>
          {/* Mobile compact scroll chevron */}
          <div className="md:hidden flex flex-col items-center">
            <span className="font-[family-name:var(--font-patrick-var)] text-xs text-pencil-lightest font-bold tracking-wider uppercase mb-1">Scroll</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-pencil-lightest">
              <path d="M7 10 L12 15 L17 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </motion.div>
      </section>

      {/* ===== FEATURED WORK ===== */}
      <motion.section 
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="py-16 md:py-32 px-0 md:px-4"
      >
        <div className="max-w-6xl mx-auto">
          <SectionHeading subtitle="A few pieces from my recent work" className="!mb-6 md:!mb-12">
            Featured Work
          </SectionHeading>

          {/* Mobile swipe snap carousel */}
          <div className="md:hidden">
            <div 
              ref={projectCarouselRef}
              onScroll={handleProjectCarouselScroll}
              className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth w-full mb-6"
            >
              {featuredProjects.map((project, i) => (
                <div key={project.id} className="w-full flex-shrink-0 snap-center px-5 flex justify-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98, y: 15 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="w-full"
                  >
                    <Link href={`/portfolio/${project.slug}`} className="block w-full">
                      <WobblyCard
                        decoration="none"
                        rotation={0}
                        hover={false}
                        tilt={false}
                        className="w-full !p-5 flex flex-col shadow-hard-md relative"
                      >
                        {project.featuredBadge && (
                          <div className="absolute top-3 right-3 z-20">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-postit text-pencil border-2 border-pencil shadow-hard-sm wobbly-sm text-[10px] font-[family-name:var(--font-kalam-var)] font-bold">
                              {project.featuredBadge}
                            </span>
                          </div>
                        )}
                        {/* Large Hero Image */}
                        <div className="wobbly-md overflow-hidden border-2 border-pencil mb-4 -mx-1 -mt-1 h-[250px] relative">
                          <Image
                            src={project.coverImageUrl}
                            alt={project.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 400px"
                            className="object-cover"
                            priority={i === 0}
                          />
                        </div>

                        {/* Project Tags */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1 text-sm font-[family-name:var(--font-patrick-var)] bg-erased/50 border border-pencil/30 wobbly-sm text-pencil-muted"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Title: 22px, Bold, maximum 2 lines */}
                        <h3 className="text-[22px] font-bold text-pencil mb-2 leading-tight line-clamp-2">
                          {project.title}
                        </h3>

                        {/* Description: 2-3 lines, opacity 85%, line-height 1.7 */}
                        <p className="text-pencil-light text-sm line-clamp-3 leading-[1.7] opacity-85 mb-4">
                          {project.description}
                        </p>

                        {/* CTA Button */}
                        <div className="w-full py-3 h-[50px] bg-white border-2 border-pencil wobbly-sm font-bold text-center text-pencil flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all duration-100 font-[family-name:var(--font-kalam-var)]">
                          View Case Study →
                        </div>
                      </WobblyCard>
                    </Link>
                  </motion.div>
                </div>
              ))}
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center items-center gap-2 mb-5">
              {featuredProjects.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (projectCarouselRef.current) {
                      const width = projectCarouselRef.current.offsetWidth;
                      projectCarouselRef.current.scrollLeft = width * idx;
                      setActiveProjectIdx(idx);
                    }
                  }}
                  className={`w-2 h-2 rounded-full border border-pencil transition-all duration-300 ${
                    activeProjectIdx === idx ? 'bg-marker scale-125' : 'bg-pencil/25'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Explore Portfolio button */}
            <div className="text-center">
              <Link 
                href="/portfolio" 
                className="inline-flex items-center gap-1.5 text-base font-bold text-pencil hover:text-marker font-[family-name:var(--font-kalam-var)] transition-colors duration-100 border-b-2 border-transparent hover:border-marker py-0.5 group"
              >
                Explore Full Portfolio
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>

          {/* Desktop View (completely untouched) */}
          <div className="hidden md:block">
            <motion.div 
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {featuredProjects.map((project, i) => {
                const rotations = [-2, 1, -1];
                return (
                  <motion.div key={project.id} variants={revealItem}>
                    <Link href={`/portfolio/${project.slug}`} className="group block">
                      <WobblyCard
                        decoration={i === 0 ? 'tape' : i === 1 ? 'thumbtack' : 'none'}
                        rotation={rotations[i]}
                        hover={true}
                        tilt={false}
                        className="h-full relative"
                      >
                        {project.featuredBadge && (
                          <div className="absolute top-3 right-3 z-20">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-postit text-pencil border-2 border-pencil shadow-hard-sm wobbly-sm text-xs font-[family-name:var(--font-kalam-var)] font-bold">
                              {project.featuredBadge}
                            </span>
                          </div>
                        )}
                        <div className="wobbly-md overflow-hidden border-2 border-pencil mb-4 -mx-2 -mt-2">
                          <Image
                            src={project.coverImageUrl}
                            alt={project.title}
                            width={400}
                            height={300}
                            className="w-full h-48 object-cover transition-transform duration-500 ease-out group-hover:scale-108"
                          />
                        </div>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {project.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 text-xs font-[family-name:var(--font-patrick-var)] bg-erased/50 border border-pencil/30 wobbly-sm text-pencil-muted"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <h3 className="text-xl font-bold text-pencil mb-1">{project.title}</h3>
                        <p className="text-pencil-light text-sm line-clamp-2">{project.description}</p>
                        <div className="mt-3 flex items-center gap-1 text-ballpoint text-sm font-[family-name:var(--font-kalam-var)] font-bold group-hover:text-marker transition-colors duration-100">
                          View Project <ArrowRight className="w-4 h-4" strokeWidth={3} />
                        </div>
                      </WobblyCard>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>

            <div className="text-center mt-10">
              <WobblyButton href="/portfolio" variant="ghost">
                See All Projects <ArrowRight className="w-4 h-4 ml-2" strokeWidth={3} />
              </WobblyButton>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ===== PRICING PLANS ===== */}
      <motion.section
        id="pricing"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="py-16 md:py-32 px-5 md:px-4"
      >
        <div className="max-w-6xl mx-auto">
          <SectionHeading subtitle="Simple, transparent pricing for businesses, startups and personal brands.">
            Pricing Plans
          </SectionHeading>

          {/* Mobile Pricing Swipe Carousel */}
          <div className="md:hidden">
            <div 
              ref={carouselRef}
              onScroll={handleCarouselScroll}
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-1 py-4 no-scrollbar scroll-smooth"
            >
              {pricingPlans.map((plan) => {
                const showAll = expandedPlans[plan.name];
                const visibleFeatures = showAll ? plan.features : plan.features.slice(0, 6);
                const hasMoreFeatures = plan.features.length > 6;
                return (
                  <div 
                    key={plan.name} 
                    className="w-[85vw] snap-center flex-shrink-0 flex flex-col"
                  >
                    <WobblyCard
                      variant={plan.featured ? "postit" : "paper"}
                      rotation={0}
                      hover={false}
                      tilt={false}
                      className="flex flex-col h-full !p-5 relative shadow-hard-md"
                    >
                      {/* Most Popular Badge */}
                      {plan.badge && (
                        <div className="flex justify-center -mt-2 mb-4">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-marker text-white border-2 border-pencil shadow-hard-sm wobbly-sm text-xs font-[family-name:var(--font-kalam-var)] font-bold">
                            <Star className="w-3 h-3 fill-white" strokeWidth={0} />
                            {plan.badge}
                          </span>
                        </div>
                      )}

                      {/* Plan Name */}
                      <h3 className="text-2xl font-bold text-pencil mb-1">{plan.name}</h3>

                      {/* Price */}
                      <div className="mb-2">
                        <div className="text-4xl font-bold text-marker font-[family-name:var(--font-kalam-var)]">
                          {plan.price}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-pencil-light text-sm mb-4 pb-4 border-b-2 border-dashed border-pencil/20">
                        {plan.description}
                      </p>

                      {/* Features */}
                      <ul className="space-y-2 flex-1 mb-3">
                        {visibleFeatures.map((feature) => (
                          <li key={feature} className="flex items-start gap-2 text-sm text-pencil-darkish">
                            <span className="text-marker font-bold flex-shrink-0 leading-5">✔</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Accordion toggle */}
                      {hasMoreFeatures && (
                        <button
                          type="button"
                          onClick={() => togglePlanFeatures(plan.name)}
                          className="text-left text-sm font-[family-name:var(--font-kalam-var)] font-bold text-ballpoint hover:text-marker transition-colors mb-4 flex items-center gap-1 active:scale-95 py-1"
                        >
                          {showAll ? "Show less features ▴" : `Show all ${plan.features.length} features ▾`}
                        </button>
                      )}

                      {/* Delivery Timeline */}
                      {plan.delivery && (
                        <div className="text-xs font-bold text-pencil-light mb-4 font-[family-name:var(--font-patrick-var)]">
                          Delivery: <span className="text-pencil font-bold">{plan.delivery}</span>
                        </div>
                      )}

                      {/* CTA Button */}
                      <WobblyButton 
                        onClick={() => setActivePlan(plan)}
                        size="sm" 
                        className="w-full justify-center min-h-[52px] text-base"
                      >
                        {plan.buttonLabel}
                      </WobblyButton>
                    </WobblyCard>
                  </div>
                );
              })}
            </div>
            
            {/* Dots */}
            <div className="flex justify-center items-center gap-2.5 mt-4">
              {pricingPlans.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (carouselRef.current) {
                      const width = carouselRef.current.offsetWidth;
                      const cardWidth = width * 0.85;
                      carouselRef.current.scrollLeft = (cardWidth + 16) * idx;
                      setActivePlanIdx(idx);
                    }
                  }}
                  className={`w-2.5 h-2.5 rounded-full border border-pencil transition-all duration-300 ${
                    activePlanIdx === idx ? 'bg-marker scale-110' : 'bg-pencil/20'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
            <div className="text-center mt-3 text-sm text-pencil-lightest font-[family-name:var(--font-patrick-var)] font-bold animate-pulse">
              ← Swipe to compare plans →
            </div>
          </div>

          {/* Desktop Pricing Grid */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {pricingPlans.map((plan) => (
              <div key={plan.name} className="flex flex-col">
                <WobblyCard
                  variant={plan.featured ? "postit" : "paper"}
                  rotation={0}
                  hover={false}
                  tilt={false}
                  className="flex flex-col h-full transition-all duration-300 hover:-translate-y-[6px] hover:shadow-hard-lg"
                >
                  {/* Most Popular Badge */}
                  {plan.badge && (
                    <div className="flex justify-center -mt-2 mb-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-marker text-white border-2 border-pencil shadow-hard-sm wobbly-sm text-xs font-[family-name:var(--font-kalam-var)] font-bold">
                        <Star className="w-3 h-3 fill-white" strokeWidth={0} />
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  {/* Plan Name */}
                  <h3 className="text-2xl font-bold text-pencil mb-1">{plan.name}</h3>

                  {/* Price */}
                  <div className="mb-1">
                    <div className="text-3xl font-bold text-marker font-[family-name:var(--font-kalam-var)]">
                      {plan.price}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-pencil-light text-sm mb-4 pb-4 border-b-2 border-dashed border-pencil/20">
                    {plan.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 flex-1 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-pencil-darkish">
                        <span className="text-marker font-bold flex-shrink-0 leading-5">✔</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Delivery Timeline */}
                  {plan.delivery && (
                    <div className="text-xs font-bold text-pencil-light mb-4 font-[family-name:var(--font-patrick-var)]">
                      Delivery: <span className="text-pencil font-bold">{plan.delivery}</span>
                    </div>
                  )}

                  {/* CTA Button */}
                  <WobblyButton 
                    onClick={() => setActivePlan(plan)}
                    size="sm" 
                    className="w-full justify-center"
                  >
                    {plan.buttonLabel}
                  </WobblyButton>
                </WobblyCard>
              </div>
            ))}
          </div>

          <div className="text-center mt-8 text-sm text-pencil-light font-[family-name:var(--font-patrick-var)] font-bold">
            Need something different? Let&apos;s discuss your project.
          </div>

          {/* CTA Below Cards */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-16 px-4 md:px-0"
          >
            <WobblyCard
              variant="paper"
              decoration="tape"
              hover={false}
              tilt={false}
              rotation={0}
              className="!p-8 md:!p-10 text-center max-w-2xl mx-auto"
            >
              <h3 className="text-2xl md:text-3xl font-bold text-pencil mb-3">
                Not sure which plan is right for you?
              </h3>
              <p className="text-pencil-light mb-6 max-w-lg mx-auto leading-relaxed">
                Let&apos;s discuss your project and I&apos;ll recommend the perfect solution for your budget.
              </p>
              <WobblyButton href="#contact" size="lg" className="w-full sm:w-auto min-h-[52px] md:min-h-0">
                Schedule a Free Call
              </WobblyButton>
            </WobblyCard>
          </motion.div>
        </div>
      </motion.section>

      {/* ===== HOW I WORK (Timeline) ===== */}
      <motion.section 
        ref={timelineRef}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="py-16 md:py-32 px-5 md:px-4 relative"
      >
        <div className="max-w-4xl mx-auto relative">
          <SectionHeading subtitle="From concept to pixel-perfect delivery">
            How I Work
          </SectionHeading>

          <div className="relative mt-12">
            {/* Desktop Scroll-Linked Timeline Progress Line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[4px] bg-pencil/10 -translate-x-1/2 rounded">
              <motion.div 
                style={{ scaleY: timelineHeight, originY: 0 }}
                className="w-full h-full bg-marker"
              />
            </div>

            {/* Mobile Timeline Dashed Connector Line */}
            <div className="md:hidden absolute left-1/2 top-0 bottom-0 w-[4px] -translate-x-1/2">
              <div className="w-full h-full border-l-3 border-dashed border-pencil/25" />
            </div>

            {/* Mobile Timeline View */}
            <div className="md:hidden space-y-10 relative">
              {[
                {
                  step: '01',
                  title: 'Discover',
                  description: 'We chat about your vision, goals, and audience. I ask the weird questions that uncover the real story behind your project.',
                  icon: Coffee,
                  color: 'bg-postit',
                },
                {
                  step: '02',
                  title: 'Design',
                  description: 'Sketches become wireframes. Wireframes become polished mockups. Every pixel is placed with purpose and personality.',
                  icon: Pencil,
                  color: 'bg-marker/10',
                },
                {
                  step: '03',
                  title: 'Develop',
                  description: 'Clean code brings the designs to life. Fast, accessible, and built to last — no shortcuts, no bloat.',
                  icon: Code,
                  color: 'bg-ballpoint/10',
                },
                {
                  step: '04',
                  title: 'Deliver',
                  description: 'Launch day! But I stick around to fine-tune, optimize, and make sure everything runs beautifully in the wild.',
                  icon: Zap,
                  color: 'bg-erased',
                },
              ].map((item) => (
                <div key={item.step} className="relative flex flex-col items-center gap-4">
                  {/* Step Node */}
                  <div className="flex flex-col items-center z-10">
                    <div className="w-12 h-12 wobbly border-3 border-pencil bg-white shadow-hard-sm flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-pencil" strokeWidth={2.5} />
                    </div>
                    <span className="text-xs text-pencil bg-white border-2 border-pencil px-3 py-0.5 wobbly-sm font-[family-name:var(--font-kalam-var)] font-bold mt-2 shadow-hard-sm">
                      Step {item.step}
                    </span>
                  </div>
                  {/* Card */}
                  <motion.div 
                    variants={mobileTimelineCardReveal} 
                    className="w-full"
                  >
                    <WobblyCard
                      variant="paper"
                      rotation={0}
                      hover={false}
                      tilt={false}
                      className={`${item.color} !p-5 text-center shadow-hard-md`}
                    >
                      <h3 className="text-xl font-bold text-pencil mb-1">{item.title}</h3>
                      <p className="text-pencil-light text-sm">{item.description}</p>
                    </WobblyCard>
                  </motion.div>
                </div>
              ))}
            </div>

            {/* Desktop Timeline View (Unchanged) */}
            <div className="hidden md:block space-y-24 relative">
              {[
                {
                  step: '01',
                  title: 'Discover',
                  description: 'We chat about your vision, goals, and audience. I ask the weird questions that uncover the real story behind your project.',
                  icon: Coffee,
                  color: 'bg-postit',
                  rotation: -1,
                },
                {
                  step: '02',
                  title: 'Design',
                  description: 'Sketches become wireframes. Wireframes become polished mockups. Every pixel is placed with purpose and personality.',
                  icon: Pencil,
                  color: 'bg-marker/10',
                  rotation: 1,
                },
                {
                  step: '03',
                  title: 'Develop',
                  description: 'Clean code brings the designs to life. Fast, accessible, and built to last — no shortcuts, no bloat.',
                  icon: Code,
                  color: 'bg-ballpoint/10',
                  rotation: -1,
                },
                {
                  step: '04',
                  title: 'Deliver',
                  description: 'Launch day! But I stick around to fine-tune, optimize, and make sure everything runs beautifully in the wild.',
                  icon: Zap,
                  color: 'bg-erased',
                  rotation: 1,
                },
              ].map((item, index) => (
                <div
                  key={item.step}
                  className={`relative grid grid-cols-2 gap-20`}
                >
                  <motion.div 
                    variants={timelineCardReveal(index)}
                    className={`${index % 2 === 0 ? 'text-right pr-10' : 'col-start-2 pl-10'}`}
                  >
                    <WobblyCard
                      variant="paper"
                      rotation={item.rotation}
                      hover={true}
                      tilt={false}
                      className={`${item.color} !p-6 flex flex-col h-full`}
                    >
                      <div className={`flex items-start gap-4 ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}>
                        <div className="w-12 h-12 wobbly border-3 border-pencil bg-white shadow-hard-sm flex-shrink-0 flex items-center justify-center">
                          <item.icon className="w-6 h-6 text-pencil" strokeWidth={2.5} />
                        </div>
                        <div>
                          <span className="text-xs text-pencil-lightest font-[family-name:var(--font-kalam-var)] font-bold">
                            Step {item.step}
                          </span>
                           <h3 className="text-2xl font-bold text-pencil">{item.title}</h3>
                          <p className="text-pencil-light mt-1">{item.description}</p>
                        </div>
                      </div>
                    </WobblyCard>
                  </motion.div>

                  {/* Desktop Center Indicator Node */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 wobbly border-3 border-pencil bg-white shadow-hard-sm flex items-center justify-center z-10">
                    <Star className="w-4 h-4 text-pencil" fill="none" strokeWidth={3} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* ===== CONTACT SECTION ===== */}
      <motion.section 
        id="contact" 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="py-20 md:py-32 px-4"
      >
        <div className="max-w-3xl mx-auto">
          <SectionHeading subtitle="Got a project in mind? Let's chat!">
            Get in Touch
          </SectionHeading>
          <ContactForm />
        </div>
      </motion.section>

      {/* ===== BOOKING MODAL ===== */}
      <AnimatePresence>
        {activePlan && (() => {
          const isCustom = activePlan.name.toLowerCase() === "custom";
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setActivePlan(null)}
                className="absolute inset-0 bg-pencil/40 cursor-zoom-out"
              />

              {/* Modal Box */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="relative w-full max-w-lg bg-paper bg-[radial-gradient(#e5e0d8_1.5px,transparent_1.5px)] bg-[size:24px_24px] border-3 border-pencil shadow-hard-lg p-6 md:p-8 wobbly-md z-10 overflow-y-auto max-h-[90vh] tape"
              >
                {/* Close Button */}
                <button 
                  type="button"
                  onClick={() => setActivePlan(null)}
                  className="absolute top-4 right-4 w-8 h-8 wobbly border-2 border-pencil hover:bg-marker hover:text-white flex items-center justify-center font-bold text-pencil transition-colors duration-100"
                >
                  ✕
                </button>

                <h2 className="text-2xl md:text-3xl font-bold text-pencil mb-6 font-[family-name:var(--font-kalam-var)]">
                  Let&apos;s Build Your Project 🚀
                </h2>

                <form onSubmit={async (e) => {
                  e.preventDefault();
                  
                  const name = (document.getElementById("popup-name") as HTMLInputElement)?.value || "";
                  const email = (document.getElementById("popup-email") as HTMLInputElement)?.value || "";
                  const phone = (document.getElementById("popup-phone") as HTMLInputElement)?.value || "";
                  const brand = (document.getElementById("popup-brand") as HTMLInputElement)?.value || "";
                  const details = (document.getElementById("popup-details") as HTMLTextAreaElement)?.value || "";

                  if (!name || !email || !phone) {
                    alert("Please fill in all required fields.");
                    return;
                  }

                  setSubmitting(true);

                  if (isCustom) {
                    setSubmittingStatus("Sending...");
                    const brandLine = brand ? `Business/Brand: ${brand}\n` : "";
                    const projectType = (document.getElementById("popup-type") as HTMLSelectElement)?.value || "";
                    const budget = (document.getElementById("popup-budget") as HTMLInputElement)?.value || "";
                    const timeline = (document.getElementById("popup-timeline") as HTMLSelectElement)?.value || "";
                    const budgetLine = budget ? `Estimated Budget: ${budget}\n` : "";
                    const detailsLine = details ? `Project Details:\n${details}` : "";

                    const message = `Hello Vasu,\n\nI want to build a custom project with you.\n\nPackage: ${activePlan.name}\nProject Type: ${projectType}\nTimeline: ${timeline}\n${brandLine}${budgetLine}${detailsLine}`;

                    try {
                      const res = await fetch("/api/contact", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          name,
                          email,
                          phone,
                          message,
                          packageName: activePlan.name,
                          price: activePlan.price,
                          brand,
                          details,
                          projectType,
                          timeline,
                          budget
                        }),
                      });
                      if (res.ok) {
                        setActivePlan(null);
                        setShowSuccessModal(true);
                      } else {
                        alert("Failed to send inquiry. Please try again.");
                      }
                    } catch (err) {
                      console.error(err);
                      alert("An error occurred. Please try again.");
                    } finally {
                      setSubmitting(false);
                      setSubmittingStatus("");
                    }
                  } else {
                    // Paid booking using Razorpay
                    try {
                      setSubmittingStatus("Creating Payment...");
                      
                      // 1. Create order on backend
                      const orderRes = await fetch("/api/payment/create-order", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          planName: activePlan.name,
                        }),
                      });

                      if (!orderRes.ok) {
                        const errBody = await orderRes.json();
                        throw new Error(errBody.error || "Failed to create order on server");
                      }

                      const orderData = await orderRes.json();
                      const { orderId, amount, currency, keyId } = orderData;

                      setSubmittingStatus("Opening Razorpay...");

                      // 2. Load script dynamically
                      const loaded = await loadRazorpayScript();
                      if (!loaded) {
                        throw new Error("Failed to load Razorpay Payment SDK. Check your internet connection.");
                      }

                      // 3. Launch Razorpay Checkout popup
                      const options = {
                        key: keyId,
                        amount: amount,
                        currency: currency,
                        name: "Vasu Design",
                        description: `Website Development - ${activePlan.name} Plan`,
                        image: "/icon.png",
                        order_id: orderId,
                        handler: async function (response: any) {
                          try {
                            setSubmittingStatus("Processing...");
                            
                            // 4. Verify payment on server
                            const verifyRes = await fetch("/api/payment/verify", {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                name,
                                email,
                                phone,
                                brand,
                                details,
                                packageName: activePlan.name,
                                price: activePlan.price,
                              }),
                            });

                            if (!verifyRes.ok) {
                              const verifyErr = await verifyRes.json();
                              throw new Error(verifyErr.error || "Payment verification failed");
                            }

                            const verifyData = await verifyRes.json();
                            
                            // Clear state and show Success modal
                            setActivePlan(null);
                            setPaymentSuccessId(verifyData.paymentId || response.razorpay_payment_id);
                            setShowPaymentSuccessModal(true);
                          } catch (err: any) {
                            console.error("Verification error:", err);
                            setPaymentErrorMsg(err.message || "Could not verify payment signature.");
                            setShowPaymentFailedModal(true);
                          } finally {
                            setSubmitting(false);
                            setSubmittingStatus("");
                          }
                        },
                        prefill: {
                          name: name,
                          email: email,
                          contact: phone,
                        },
                        theme: {
                          color: "#ff4d4d", // primary accent marker color
                        },
                        modal: {
                          ondismiss: function () {
                            setSubmitting(false);
                            setSubmittingStatus("");
                            console.log("Payment checkout popup closed by user");
                          },
                        },
                      };

                      const rzp = new (window as any).Razorpay(options);
                      
                      rzp.on("payment.failed", function (resp: any) {
                        console.error("Payment failed event:", resp.error);
                        setPaymentErrorMsg(resp.error?.description || "Payment failed. Try again.");
                        setShowPaymentFailedModal(true);
                        setSubmitting(false);
                        setSubmittingStatus("");
                      });

                      rzp.open();
                    } catch (err: any) {
                      console.error("Checkout process error:", err);
                      setPaymentErrorMsg(err.message || "An error occurred starting checkout.");
                      setShowPaymentFailedModal(true);
                      setSubmitting(false);
                      setSubmittingStatus("");
                    }
                  }
                }} className="space-y-4">
                  {/* Selected Package Details */}
                  <div className="p-4 border-2 border-dashed border-pencil/30 bg-white/60 wobbly-sm">
                    <span className="text-xs text-pencil-lightest font-[family-name:var(--font-kalam-var)] font-bold">
                      📦 Selected Package
                    </span>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-lg font-bold text-pencil">{activePlan.name}</span>
                      <span className="text-lg font-bold text-marker font-[family-name:var(--font-kalam-var)]">
                        {activePlan.price}
                      </span>
                    </div>
                  </div>

                  {/* Form Inputs */}
                  <WobblyInput
                    id="popup-name"
                    name="name"
                    label="Full Name *"
                    placeholder="Your Name"
                    required
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <WobblyInput
                      id="popup-email"
                      name="email"
                      label="Email *"
                      type="email"
                      placeholder="your@email.com"
                      required
                    />
                    <WobblyInput
                      id="popup-phone"
                      name="phone"
                      label="Phone Number *"
                      type="tel"
                      placeholder="Your Phone Number"
                      required
                    />
                  </div>

                  <WobblyInput
                    id="popup-brand"
                    name="brand"
                    label="Business / Brand Name (optional)"
                    placeholder="Your Company / Brand Name"
                  />

                  {isCustom && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="popup-type" className="block font-[family-name:var(--font-kalam-var)] font-bold text-pencil mb-1.5 text-lg">
                            Project Type *
                          </label>
                          <select
                            id="popup-type"
                            name="projectType"
                            required
                            className="w-full wobbly border-3 border-pencil bg-white px-4 py-2.5 font-[family-name:var(--font-patrick-var)] text-pencil text-lg placeholder:text-erased focus:outline-none focus:ring-3 focus:ring-ballpoint focus:border-ballpoint transition-all duration-100"
                          >
                            <option value="Business Website">Business Website</option>
                            <option value="Portfolio Website">Portfolio Website</option>
                            <option value="E-commerce Website">E-commerce Website</option>
                            <option value="Booking Website">Booking Website</option>
                            <option value="Dashboard">Dashboard</option>
                            <option value="Web Application">Web Application</option>
                            <option value="LMS">LMS</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div>
                          <label htmlFor="popup-timeline" className="block font-[family-name:var(--font-kalam-var)] font-bold text-pencil mb-1.5 text-lg">
                            Timeline *
                          </label>
                          <select
                            id="popup-timeline"
                            name="timeline"
                            required
                            className="w-full wobbly border-3 border-pencil bg-white px-4 py-2.5 font-[family-name:var(--font-patrick-var)] text-pencil text-lg placeholder:text-erased focus:outline-none focus:ring-3 focus:ring-ballpoint focus:border-ballpoint transition-all duration-100"
                          >
                            <option value="ASAP">ASAP</option>
                            <option value="Within 1 Week">Within 1 Week</option>
                            <option value="Within 2 Weeks">Within 2 Weeks</option>
                            <option value="Within 1 Month">Within 1 Month</option>
                            <option value="Flexible">Flexible</option>
                          </select>
                        </div>
                      </div>

                      <WobblyInput
                        id="popup-budget"
                        name="budget"
                        label="Estimated Budget (Optional)"
                        placeholder="e.g. ₹20,000"
                      />
                    </>
                  )}

                  <WobblyTextarea
                    id="popup-details"
                    name="details"
                    label="Project Details (Optional)"
                    placeholder="Tell me a little about your project (optional)..."
                  />

                  {/* Footer Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <WobblyButton 
                      type="button"
                      variant="ghost" 
                      onClick={() => setActivePlan(null)}
                      disabled={submitting}
                    >
                      Cancel
                    </WobblyButton>
                     <WobblyButton type="submit" disabled={submitting}>
                      {submitting ? (submittingStatus || "Sending...") : "Continue →"}
                    </WobblyButton>
                  </div>
                </form>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* ===== SUCCESS MODAL ===== */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setShowSuccessModal(false)}
              className="absolute inset-0 bg-pencil/40 cursor-zoom-out"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative w-full max-w-md bg-paper bg-[radial-gradient(#e5e0d8_1.5px,transparent_1.5px)] bg-[size:24px_24px] border-3 border-pencil shadow-hard-lg p-8 text-center wobbly z-10 tape"
            >
              {/* Close Button */}
              <button 
                type="button"
                onClick={() => setShowSuccessModal(false)}
                className="absolute top-4 right-4 w-8 h-8 wobbly border-2 border-pencil hover:bg-marker hover:text-white flex items-center justify-center font-bold text-pencil transition-colors duration-100"
              >
                ✕
              </button>

              <div className="w-16 h-16 mx-auto mb-4 wobbly border-3 border-pencil bg-marker/10 flex items-center justify-center">
                <span className="text-2xl">🎉</span>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-pencil mb-3 font-[family-name:var(--font-kalam-var)]">
                Inquiry Sent Successfully!
              </h2>

              <p className="text-pencil-light text-lg mb-6 leading-relaxed">
                Thanks for reaching out.<br />
                I&apos;ve received your project inquiry and will contact you within 24 hours.
              </p>

              <WobblyButton onClick={() => setShowSuccessModal(false)} className="w-full">
                Close
              </WobblyButton>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===== PAYMENT SUCCESS MODAL ===== */}
      <AnimatePresence>
        {showPaymentSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setShowPaymentSuccessModal(false)}
              className="absolute inset-0 bg-pencil/40 cursor-zoom-out"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative w-full max-w-md bg-paper bg-[radial-gradient(#e5e0d8_1.5px,transparent_1.5px)] bg-[size:24px_24px] border-3 border-pencil shadow-hard-lg p-8 text-center wobbly z-10 tape"
            >
              {/* Close Button */}
              <button 
                type="button"
                onClick={() => setShowPaymentSuccessModal(false)}
                className="absolute top-4 right-4 w-8 h-8 wobbly border-2 border-pencil hover:bg-marker hover:text-white flex items-center justify-center font-bold text-pencil transition-colors duration-100"
              >
                ✕
              </button>

              <div className="w-16 h-16 mx-auto mb-4 wobbly border-3 border-pencil bg-marker/10 flex items-center justify-center">
                <span className="text-2xl">🎉</span>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-pencil mb-3 font-[family-name:var(--font-kalam-var)]">
                Payment Successful!
              </h2>

              <p className="text-pencil-light text-lg mb-4 leading-relaxed">
                Thank you for your order.<br />
                I have received your booking and will contact you shortly.
              </p>

              <div className="p-3 border-2 border-dashed border-pencil/30 bg-white/60 wobbly-sm text-sm text-pencil mb-6 font-[family-name:var(--font-kalam-var)] font-bold">
                Reference ID: <span className="text-marker">{paymentSuccessId}</span>
              </div>

              <div className="flex flex-col gap-2">
                <WobblyButton onClick={() => setShowPaymentSuccessModal(false)} className="w-full">
                  Back Home
                </WobblyButton>
                <WobblyButton 
                  onClick={() => alert("Receipt download will be available soon in your email.")} 
                  variant="ghost" 
                  className="w-full"
                >
                  Download Receipt (Soon)
                </WobblyButton>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===== PAYMENT FAILED MODAL ===== */}
      <AnimatePresence>
        {showPaymentFailedModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setShowPaymentFailedModal(false)}
              className="absolute inset-0 bg-pencil/40 cursor-zoom-out"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative w-full max-w-md bg-paper bg-[radial-gradient(#e5e0d8_1.5px,transparent_1.5px)] bg-[size:24px_24px] border-3 border-pencil shadow-hard-lg p-8 text-center wobbly z-10 tape"
            >
              {/* Close Button */}
              <button 
                type="button"
                onClick={() => setShowPaymentFailedModal(false)}
                className="absolute top-4 right-4 w-8 h-8 wobbly border-2 border-pencil hover:bg-marker hover:text-white flex items-center justify-center font-bold text-pencil transition-colors duration-100"
              >
                ✕
              </button>

              <div className="w-16 h-16 mx-auto mb-4 wobbly border-3 border-pencil bg-marker/10 flex items-center justify-center">
                <span className="text-2xl text-marker">❌</span>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-pencil mb-3 font-[family-name:var(--font-kalam-var)]">
                Payment Failed
              </h2>

              <p className="text-pencil-light text-lg mb-6 leading-relaxed">
                No amount deducted.<br />
                Please try again.
                {paymentErrorMsg && <span className="block mt-2 text-sm text-marker font-sans font-normal">Reason: {paymentErrorMsg}</span>}
              </p>

              <div className="flex flex-col gap-2">
                <WobblyButton 
                  onClick={() => {
                    setShowPaymentFailedModal(false);
                  }} 
                  className="w-full"
                >
                  Retry Payment
                </WobblyButton>
                <WobblyButton onClick={() => setShowPaymentFailedModal(false)} variant="ghost" className="w-full">
                  Close
                </WobblyButton>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
