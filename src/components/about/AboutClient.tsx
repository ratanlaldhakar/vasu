"use client";

import { Palette, Code, Figma, Layers, Lightbulb, Monitor, Smartphone, Globe, Cpu, PenTool } from 'lucide-react';
import { motion } from 'framer-motion';
import { WobblyCard } from '@/components/ui/WobblyCard';
import { SectionHeading } from '@/components/ui/SectionHeading';

const skills = [
  { name: 'UI/UX Design', icon: Palette },
  { name: 'Web Development', icon: Code },
  { name: 'Figma', icon: Figma },
  { name: 'Prototyping', icon: Layers },
  { name: 'Branding', icon: PenTool },
  { name: 'Responsive Design', icon: Monitor },
  { name: 'Mobile Design', icon: Smartphone },
  { name: 'Frontend Dev', icon: Globe },
];

const milestones = [
  {
    title: 'Started Learning',
    description: 'Learning HTML, CSS, JavaScript and modern web development.',
  },
  {
    title: 'Built My First Projects',
    description: 'Created responsive websites and explored UI/UX design.',
  },
  {
    title: 'Started Freelancing',
    description: 'Helping individuals and small businesses build modern websites with clean design and smooth user experience.',
  },
  {
    title: 'Growing Every Day',
    description: 'Currently learning new technologies, improving my skills, and working on real-world projects.',
  },
];

const revealVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
    transitionEnd: { transform: "none" }
  }
} as const;

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    }
  }
} as const;

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { type: "spring", stiffness: 80, damping: 15 },
    transitionEnd: { transform: "none" }
  }
} as const;

export default function AboutClient() {
  return (
    <div className="py-16 md:py-24 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={revealVariants}
          className="text-center mb-16"
        >
          <SectionHeading subtitle="The story behind the sketches" as="h1">
            About <span className="text-marker">Me</span>
            <span className="sr-only"> — Vasudev Dhakar | Web Developer &amp; UI Designer in Bhilwara, Rajasthan</span>
          </SectionHeading>
        </motion.div>

        {/* Story */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={revealVariants}
        >
          <WobblyCard variant="paper" decoration="tape" hover={false} tilt={false} className="mb-16 !p-8 md:!p-12">
            <div className="drop-cap text-pencil-darkish text-lg leading-relaxed space-y-4">
              <p>
                Hey there! I&apos;m Vasu — a designer and developer who believes that the best digital experiences feel human, not corporate. I&apos;ve spent the last 6+ years crafting interfaces, brands, and websites that people actually enjoy using.
              </p>
              <p>
                My approach is simple: understand the story, then tell it beautifully. Whether it&apos;s a startup finding its visual voice or a SaaS product that needs to feel less like software and more like a conversation — I&apos;m here for it.
              </p>
              <p>
                When I&apos;m not pushing pixels or writing code, you&apos;ll find me doodling in my sketchbook, exploring coffee shops, or tinkering with side projects that probably won&apos;t ship but teach me something new.
              </p>
            </div>
          </WobblyCard>
        </motion.div>

        {/* Skills Grid */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={revealVariants}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-pencil mb-8 text-center">Skills & Tools</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {skills.map((skill, i) => {
              const rotations = [-1, 1.5, -0.5, 1, -1.5, 0.5, -1, 1.5];
              return (
                <WobblyCard
                  key={skill.name}
                  variant="paper"
                  rotation={rotations[i]}
                  hover={false}
                  tilt={false}
                  className="!p-4 text-center"
                >
                  <div className="w-12 h-12 mx-auto mb-2 wobbly border-3 border-pencil bg-postit shadow-hard-sm flex items-center justify-center">
                    <skill.icon className="w-6 h-6 text-pencil" strokeWidth={2.5} />
                  </div>
                  <span className="font-[family-name:var(--font-patrick-var)] text-pencil text-sm">
                    {skill.name}
                  </span>
                </WobblyCard>
              );
            })}
          </div>
        </motion.div>

        {/* Workspace Sketch */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={revealVariants}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-pencil mb-8 text-center">My Workspace</h2>
          <WobblyCard variant="postit" decoration="thumbtack" hover={false} tilt={false} className="!p-8">
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4 text-center">
              {[
                { icon: Monitor, label: 'MacBook Pro' },
                { icon: Figma, label: 'Figma' },
                { icon: Cpu, label: 'VS Code' },
                { icon: Lightbulb, label: 'Ideas Board' },
                { icon: PenTool, label: 'Wacom Tablet' },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 wobbly border-2 border-pencil bg-white flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-pencil" strokeWidth={2.5} />
                  </div>
                  <span className="text-xs text-pencil-light font-[family-name:var(--font-patrick-var)]">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </WobblyCard>
        </motion.div>

        {/* My Journey Timeline */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={revealVariants}
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-pencil mb-2">My Journey</h2>
            <p className="text-pencil-light font-[family-name:var(--font-patrick-var)] text-lg">
              Building modern websites, one project at a time.
            </p>
          </div>

          <div className="relative">
            {/* Dashed line connector */}
            <div className="absolute left-4 md:left-8 top-0 bottom-0 w-0 border-l-3 border-dashed border-pencil/30" />

            <motion.div 
              variants={listVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="space-y-8"
            >
              {milestones.map((item, i) => (
                <motion.div 
                  key={item.title} 
                  variants={itemVariants}
                  className="relative pl-12 md:pl-20"
                >
                  {/* Dot */}
                  <div className="absolute left-1.5 md:left-5.5 top-2 w-6 h-6 wobbly border-3 border-pencil bg-marker shadow-hard-sm" />

                  <WobblyCard
                    variant="paper"
                    rotation={i % 2 === 0 ? -0.5 : 0.5}
                    hover={false}
                    tilt={false}
                    className="!p-5"
                  >
                    <span className="text-xs text-ballpoint font-[family-name:var(--font-kalam-var)] font-bold">
                      Milestone 0{i + 1}
                    </span>
                    <h3 className="text-xl font-bold text-pencil mt-1">{item.title}</h3>
                    <p className="text-pencil-light mt-1">{item.description}</p>
                  </WobblyCard>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
