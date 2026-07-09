"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Filter } from "lucide-react";
import { WobblyCard } from "@/components/ui/WobblyCard";
import { Project } from "@/lib/data";

interface PortfolioFilterListProps {
  projects: Project[];
}

export function PortfolioFilterList({ projects }: PortfolioFilterListProps) {
  const allTags = ["All", ...Array.from(new Set(projects.flatMap((p) => p.tags)))];
  const [activeTag, setActiveTag] = useState("All");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filtered =
    activeTag === "All"
      ? projects
      : projects.filter((p) => p.tags.includes(activeTag));

  const rotations = [-2, 1.5, -1, 2, -1.5, 1];
  const decorations: Array<"tape" | "thumbtack" | "none"> = [
    "tape",
    "thumbtack",
    "none",
    "tape",
    "none",
    "thumbtack",
  ];

  return (
    <div>
      {/* Filter Tags - scrollable on mobile, wrapped on desktop */}
      <div className="flex overflow-x-auto no-scrollbar items-center justify-start md:justify-center gap-2 mb-8 md:mb-12 -mx-5 px-5 md:mx-0 md:px-0 py-1.5 flex-nowrap md:flex-wrap">
        <Filter className="w-5 h-5 text-pencil-light mr-1 flex-shrink-0" strokeWidth={2.5} />
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`wobbly-sm px-4 py-1.5 text-sm font-[family-name:var(--font-patrick-var)] border-2 transition-all duration-100 cursor-pointer flex-shrink-0 ${
              activeTag === tag
                ? "bg-marker text-white border-pencil shadow-hard-sm"
                : "bg-white text-pencil border-pencil/30 hover:border-pencil hover:shadow-hard-sm"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-8">
        {filtered.map((project, i) => (
          <Link
            key={project.id}
            href={`/portfolio/${project.slug}`}
            className="group block"
          >
            <WobblyCard
              decoration={isMobile ? "none" : decorations[i % decorations.length]}
              rotation={isMobile ? 0 : rotations[i % rotations.length]}
              hover={!isMobile}
              className="h-full transition-all duration-300 ease-out hover:!rotate-0 hover:shadow-hard-lg hover:-translate-y-2 hover:scale-[1.02] cursor-pointer !p-5 md:!p-6 relative"
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
                  className="w-full h-56 md:h-52 object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                />
              </div>
              
              {/* Scrollable tag pills on mobile, normal wrapped row on desktop */}
              <div className="flex md:flex-wrap overflow-x-auto md:overflow-x-visible no-scrollbar gap-1.5 mb-3 md:mb-2 -mx-1 px-1 md:mx-0 md:px-0">
                {(isMobile ? project.tags : project.tags.slice(0, 2)).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-xs font-[family-name:var(--font-patrick-var)] bg-erased/50 border border-pencil/30 wobbly-sm text-pencil-muted whitespace-nowrap flex-shrink-0 md:flex-shrink"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <h3 className="text-2xl md:text-xl font-bold text-pencil mb-1">
                {project.title}
              </h3>
              <p className="text-pencil-light text-sm line-clamp-3 md:line-clamp-2">
                {project.description}
              </p>
              
              {/* CTA link: Text link on desktop, full-width button styled link on mobile */}
              <div className="hidden md:flex mt-3 items-center gap-1 text-ballpoint text-sm font-[family-name:var(--font-kalam-var)] font-bold group-hover:text-marker transition-colors duration-100">
                View Case Study <ArrowRight className="w-4 h-4" strokeWidth={3} />
              </div>
              <div className="md:hidden mt-4 w-full py-3 bg-white border-2 border-pencil wobbly-sm font-bold text-center text-pencil flex items-center justify-center gap-1.5 active:translate-x-[2px] active:translate-y-[2px] transition-all min-h-[48px] font-[family-name:var(--font-kalam-var)]">
                View Case Study <ArrowRight className="w-4 h-4" strokeWidth={3} />
              </div>
            </WobblyCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
