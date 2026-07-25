"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { WobblyCard } from "@/components/ui/WobblyCard";
import { WobblyButton } from "@/components/ui/WobblyButton";
import { AlertCircle, Calendar, Clock, Sparkles } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  plan_name: string;
  status: string;
  progress_percent: number;
  timeline: string;
  created_at: string;
}

export default function MyProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!supabase || !user) return;
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("client_id", user.id)
          .order("created_at", { ascending: false });

        if (!error && data) {
          setProjects(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProjects();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="font-[family-name:var(--font-kalam-var)] text-pencil text-xl text-center py-12">
        ✏️ Retrieving client project ledger...
      </div>
    );
  }

  // Phase tracker timeline steps mapping
  const phases = [
    { name: "Planning", minProgress: 20 },
    { name: "Design", minProgress: 40 },
    { name: "Development", minProgress: 70 },
    { name: "Testing", minProgress: 90 },
    { name: "Completed", minProgress: 100 }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-pencil font-[family-name:var(--font-kalam-var)]">
            My Projects 💻
          </h1>
          <p className="text-pencil-light font-[family-name:var(--font-patrick-var)] font-bold text-lg">
            Track design milestones, timeline forecasts, and development phases.
          </p>
        </div>
        <WobblyButton size="sm" href="/dashboard/messages">
          Discuss Project 💬
        </WobblyButton>
      </div>

      {projects.length > 0 ? (
        <div className="space-y-8">
          {projects.map((project, idx) => {
            const currentPhaseIdx = phases.findIndex(p => p.name.toLowerCase() === project.status.toLowerCase());
            
            return (
              <WobblyCard
                key={project.id}
                variant="default"
                hover={false}
                rotation={idx % 2 === 0 ? -0.3 : 0.3}
                className="border-3 border-pencil shadow-hard-lg bg-white p-6 md:p-8"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-dashed border-pencil/20 pb-5 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-pencil">{project.title}</h2>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-pencil-lightest mt-2 font-sans">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-pencil-light" />
                        Created: {new Date(project.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric"
                        })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-pencil-light" />
                        Timeline: {project.timeline || "7-10 Days"}
                      </span>
                    </div>
                  </div>
                  <div className="px-4 py-1.5 bg-postit border-3 border-pencil shadow-hard-sm text-pencil font-bold text-sm wobbly-sm font-[family-name:var(--font-kalam-var)]">
                    📦 Plan: {project.plan_name}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-8">
                  <div className="flex justify-between items-center text-base font-[family-name:var(--font-kalam-var)] font-bold mb-2">
                    <span className="text-pencil">Development Progress</span>
                    <span className="text-marker">{project.progress_percent}%</span>
                  </div>
                  <div className="w-full h-8 border-3 border-pencil bg-paper wobbly-sm overflow-hidden p-0.5 relative">
                    <div 
                      className="h-full bg-marker border-r-3 border-pencil wobbly-sm transition-all duration-500 ease-out" 
                      style={{ width: `${project.progress_percent}%` }}
                    />
                    <div className="absolute inset-0 bg-[radial-gradient(#2d2d2d_1px,transparent_1px)] bg-[size:10px_10px] opacity-10 pointer-events-none" />
                  </div>
                </div>

                {/* Phase Steps Roadmap */}
                <div className="mb-8 p-6 bg-paper/30 border-2 border-dashed border-pencil/20 wobbly-sm">
                  <h4 className="text-lg font-bold text-pencil font-[family-name:var(--font-kalam-var)] mb-6 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-marker" /> Project Timeline Phase Roadmap
                  </h4>

                  {/* Horizontal Phase list */}
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 relative">
                    {phases.map((phase, pIdx) => {
                      const isCompleted = project.progress_percent >= phase.minProgress;
                      const isCurrent = project.status.toLowerCase() === phase.name.toLowerCase();

                      return (
                        <div 
                          key={phase.name} 
                          className="flex flex-row sm:flex-col items-center gap-3 relative z-10"
                        >
                          {/* Timestep bubble circle */}
                          <div className={`w-10 h-10 wobbly border-3 border-pencil flex items-center justify-center font-bold text-lg font-[family-name:var(--font-kalam-var)] ${
                            isCompleted 
                              ? "bg-marker text-white" 
                              : isCurrent 
                              ? "bg-postit text-pencil" 
                              : "bg-white text-pencil-lightest border-dashed"
                          }`}>
                            {pIdx + 1}
                          </div>
                          
                          {/* Step description */}
                          <div className="text-left sm:text-center">
                            <div className={`text-base font-bold font-[family-name:var(--font-kalam-var)] ${
                              isCurrent ? "text-marker" : "text-pencil"
                            }`}>
                              {phase.name}
                            </div>
                            <div className="text-xs text-pencil-lightest font-sans mt-0.5">
                              {phase.minProgress}% Completion
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Project Description details */}
                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-pencil font-[family-name:var(--font-kalam-var)]">
                    Project Scope & Specifications
                  </h4>
                  <p className="text-pencil-light text-lg font-[family-name:var(--font-patrick-var)] font-bold whitespace-pre-wrap border-l-4 border-dashed border-pencil/30 pl-4 py-1 italic leading-relaxed bg-paper/10">
                    {project.description}
                  </p>
                </div>
              </WobblyCard>
            );
          })}
        </div>
      ) : (
        <WobblyCard
          variant="default"
          hover={false}
          className="border-3 border-pencil shadow-hard-md bg-white p-8 text-center"
        >
          <AlertCircle className="w-12 h-12 text-pencil-lightest mx-auto mb-3" />
          <h3 className="text-xl font-bold text-pencil mb-2 font-[family-name:var(--font-kalam-var)]">
            No projects registered
          </h3>
          <p className="text-pencil-light text-base max-w-md mx-auto mb-6">
            You do not have any projects linked to this client portal yet. If you have already ordered a package, please reach out to me.
          </p>
          <WobblyButton href="/#pricing">
            Browse Plans & Book →
          </WobblyButton>
        </WobblyCard>
      )}
    </div>
  );
}
