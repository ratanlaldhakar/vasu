"use client";

import { useEffect, useState, useRef } from "react";
import { getProjects, adminSaveProject, adminDeleteProject } from "@/lib/db";
import { Project } from "@/lib/data";
import { WobblyCard } from "@/components/ui/WobblyCard";
import { WobblyButton } from "@/components/ui/WobblyButton";
import { WobblyInput } from "@/components/ui/WobblyInput";
import { 
  Palette, 
  Plus, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  CheckCircle, 
  Search, 
  X, 
  Upload, 
  Eye,
  ImageIcon,
  FolderPlus,
  Loader2,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AdminPortfolioManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Form Fields
  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCoverUrl, setFormCoverUrl] = useState("");
  const [formGallery, setFormGallery] = useState<string[]>([]);
  const [formTags, setFormTags] = useState("");
  const [formLiveUrl, setFormLiveUrl] = useState("");
  const [formProblem, setFormProblem] = useState("");
  const [formSolution, setFormSolution] = useState("");
  const [formTools, setFormTools] = useState("");
  const [formBadge, setFormBadge] = useState("");

  // File Uploading states
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  // Drag & Drop Highlight state
  const [isCoverDragging, setIsCoverDragging] = useState(false);
  const [isGalleryDragging, setIsGalleryDragging] = useState(false);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const loadPortfolio = async () => {
    setLoading(true);
    const data = await getProjects();
    setProjects(data);
    setLoading(false);
  };

  useEffect(() => {
    loadPortfolio();
  }, []);

  const handleOpenAddModal = () => {
    setEditingProject(null);
    setFormTitle("");
    setFormSlug("");
    setFormDescription("");
    setFormCoverUrl("");
    setFormGallery([]);
    setFormTags("");
    setFormLiveUrl("");
    setFormProblem("");
    setFormSolution("");
    setFormTools("");
    setFormBadge("⭐ Featured Project");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (proj: Project) => {
    setEditingProject(proj);
    setFormTitle(proj.title);
    setFormSlug(proj.slug);
    setFormDescription(proj.description);
    setFormCoverUrl(proj.coverImageUrl);
    setFormGallery(proj.gallery || []);
    setFormTags(proj.tags ? proj.tags.join(", ") : "");
    setFormLiveUrl(proj.liveUrl || "");
    setFormProblem(proj.problem || "");
    setFormSolution(proj.solution || "");
    setFormTools(proj.tools ? proj.tools.join(", ") : "");
    setFormBadge(proj.featuredBadge || "");
    setIsModalOpen(true);
  };

  // Upload File Helper using POST /api/upload
  const uploadFilesToBackend = async (files: FileList | File[]): Promise<string[]> => {
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Image upload failed");
    }
    return data.urls;
  };

  // Cover Image Upload Handler
  const handleCoverFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setUploadingCover(true);
    try {
      const urls = await uploadFilesToBackend(files);
      if (urls.length > 0) {
        setFormCoverUrl(urls[0]);
      }
    } catch (err: any) {
      alert("Cover image upload failed: " + err.message);
    } finally {
      setUploadingCover(false);
    }
  };

  // Gallery Images Upload Handler
  const handleGalleryFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setUploadingGallery(true);
    try {
      const urls = await uploadFilesToBackend(files);
      setFormGallery((prev) => [...prev, ...urls]);
    } catch (err: any) {
      alert("Gallery image upload failed: " + err.message);
    } finally {
      setUploadingGallery(false);
    }
  };

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    setFormGallery((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    setSaving(true);
    setSuccessMsg("");

    try {
      const slugVal = formSlug.trim() || formTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const galleryArr = formGallery.length > 0
        ? formGallery
        : [formCoverUrl || "/vasuu_cosmic_hero.png"];
      
      const tagsArr = formTags.trim() 
        ? formTags.split(",").map(s => s.trim()).filter(Boolean)
        : ["Web Development"];

      const toolsArr = formTools.trim()
        ? formTools.split(",").map(s => s.trim()).filter(Boolean)
        : ["Next.js", "Tailwind CSS"];

      const saved = await adminSaveProject({
        id: editingProject?.id,
        title: formTitle.trim(),
        slug: slugVal,
        description: formDescription.trim(),
        coverImageUrl: formCoverUrl.trim() || "/vasuu_cosmic_hero.png",
        gallery: galleryArr,
        tags: tagsArr,
        liveUrl: formLiveUrl.trim(),
        problem: formProblem.trim(),
        solution: formSolution.trim(),
        tools: toolsArr,
        isFeatured: true,
        featuredBadge: formBadge.trim() || "⭐ Featured Project"
      });

      setSuccessMsg(`Project "${saved.title}" saved to database successfully!`);
      await loadPortfolio();
      setIsModalOpen(false);
    } catch (err: any) {
      alert("Failed to save portfolio project: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (proj: Project) => {
    if (!confirm(`Are you sure you want to delete "${proj.title}" from your portfolio?`)) return;

    try {
      await adminDeleteProject(proj.id);
      setSuccessMsg(`Project "${proj.title}" deleted.`);
      await loadPortfolio();
    } catch (err: any) {
      alert("Failed to delete project: " + err.message);
    }
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="font-[family-name:var(--font-kalam-var)] text-pencil text-xl text-center py-12">
        ✏️ Retrieving portfolio projects...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      
      {/* Top Title Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-pencil font-[family-name:var(--font-kalam-var)] flex items-center gap-2">
            <Palette className="w-8 h-8 text-marker" />
            Portfolio Showcase Manager 🎨
          </h1>
          <p className="text-pencil-light font-[family-name:var(--font-patrick-var)] font-bold text-lg">
            Drag & drop images from your computer directly into Supabase & update your portfolio.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="px-5 py-2.5 bg-marker text-white border-3 border-pencil wobbly font-[family-name:var(--font-kalam-var)] font-bold text-base hover:bg-pencil transition-all shadow-hard-sm cursor-pointer flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Add New Showcase Project
        </button>
      </div>

      {/* Success Notification Alert */}
      {successMsg && (
        <div className="p-3 border-2 border-pencil bg-emerald-50 text-emerald-900 text-sm font-bold font-[family-name:var(--font-kalam-var)] flex items-center justify-between gap-2 rounded-xl">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg("")} className="text-emerald-800 hover:text-emerald-950 font-mono text-xs">
            ✕
          </button>
        </div>
      )}

      {/* Search Bar & Project Count */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <span className="text-sm font-mono font-bold text-pencil-light">
          Showing <strong className="text-pencil">{filteredProjects.length}</strong> showcase projects
        </span>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-pencil-light absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects by title or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full wobbly border-2 border-pencil pl-9 pr-3 py-1.5 font-[family-name:var(--font-patrick-var)] text-pencil text-sm focus:outline-none bg-white"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((proj) => (
          <WobblyCard
            key={proj.id}
            variant="default"
            hover={false}
            className="border-3 border-pencil bg-white p-5 shadow-hard-md flex flex-col justify-between relative overflow-hidden"
          >
            <div>
              {/* Badge & Cover Thumbnail */}
              <div className="relative mb-3 border-2 border-pencil rounded-xl overflow-hidden h-44 bg-paper/40">
                {proj.coverImageUrl ? (
                  <Image
                    src={proj.coverImageUrl}
                    alt={proj.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-pencil-light">
                    <ImageIcon className="w-8 h-8 opacity-40" />
                  </div>
                )}
                {proj.featuredBadge && (
                  <span className="absolute top-2 right-2 px-2.5 py-0.5 bg-postit text-pencil text-[10px] font-bold border-2 border-pencil font-[family-name:var(--font-kalam-var)] shadow-hard-sm">
                    {proj.featuredBadge}
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <h3 className="text-xl font-extrabold text-pencil font-[family-name:var(--font-kalam-var)] line-clamp-1">
                {proj.title}
              </h3>
              <p className="text-xs text-pencil-light font-[family-name:var(--font-patrick-var)] font-bold mt-1 line-clamp-2 leading-relaxed">
                {proj.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mt-3">
                {proj.tags.slice(0, 3).map((t, idx) => (
                  <span key={idx} className="text-[10px] font-mono bg-paper border border-pencil px-1.5 py-0.2 rounded text-pencil font-bold">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions Bar */}
            <div className="mt-5 pt-3 border-t-2 border-dashed border-pencil/20 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Link
                  href={`/portfolio/${proj.slug}`}
                  target="_blank"
                  className="p-1.5 border border-pencil rounded bg-paper hover:bg-pencil hover:text-white transition-colors text-pencil"
                  title="View live case study"
                >
                  <Eye className="w-4 h-4" />
                </Link>
                {proj.liveUrl && (
                  <a
                    href={proj.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 border border-pencil rounded bg-paper hover:bg-pencil hover:text-white transition-colors text-pencil"
                    title="Open live website link"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEditModal(proj)}
                  className="px-3 py-1 bg-ballpoint text-white text-xs font-bold font-[family-name:var(--font-kalam-var)] border border-pencil rounded hover:bg-pencil transition-colors flex items-center gap-1 cursor-pointer shadow-hard-sm"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(proj)}
                  className="p-1.5 bg-white text-marker border border-pencil rounded hover:bg-marker hover:text-white transition-colors cursor-pointer"
                  title="Delete project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </WobblyCard>
        ))}
      </div>

      {/* Add / Edit Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[99999] bg-pencil/80 backdrop-blur-sm flex items-center justify-center p-3 overflow-y-auto">
          <div className="bg-white border-3 border-pencil shadow-hard-lg rounded-2xl max-w-2xl w-full relative my-auto text-pencil flex flex-col max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="sticky top-0 bg-white px-6 py-4 border-b-2 border-dashed border-pencil flex items-center justify-between gap-2 rounded-t-2xl z-20">
              <h2 className="text-2xl font-bold font-[family-name:var(--font-kalam-var)] text-pencil flex items-center gap-2">
                <Palette className="w-5 h-5 text-marker" />
                {editingProject ? `Edit: ${editingProject.title}` : "Add New Showcase Project"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 border-2 border-pencil rounded-lg hover:bg-marker hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveForm} className="p-6 overflow-y-auto space-y-5 flex-1">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <WobblyInput
                  id="proj-title"
                  type="text"
                  label="Project Title *"
                  placeholder="e.g. Prisma Creative Studio"
                  value={formTitle}
                  onChange={(e) => {
                    setFormTitle(e.target.value);
                    if (!editingProject) {
                      setFormSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                    }
                  }}
                  required
                />

                <WobblyInput
                  id="proj-slug"
                  type="text"
                  label="URL Slug *"
                  placeholder="prisma-creative-studio"
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block font-[family-name:var(--font-kalam-var)] font-bold text-pencil text-lg">
                  Short Subtitle / Description *
                </label>
                <textarea
                  className="w-full wobbly border-3 border-pencil bg-white px-4 py-2.5 font-[family-name:var(--font-patrick-var)] text-pencil text-base focus:outline-none resize-none"
                  placeholder="A short summary of what this website accomplishes..."
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <WobblyInput
                  id="proj-liveurl"
                  type="text"
                  label="Live Website URL"
                  placeholder="https://prismavasu.lovable.app/"
                  value={formLiveUrl}
                  onChange={(e) => setFormLiveUrl(e.target.value)}
                />

                <WobblyInput
                  id="proj-badge"
                  type="text"
                  label="Featured Badge Label"
                  placeholder="e.g. ✨ AI & Vision Studio"
                  value={formBadge}
                  onChange={(e) => setFormBadge(e.target.value)}
                />
              </div>

              {/* ===== 1. COVER IMAGE DRAG & DROP UPLOADER ===== */}
              <div className="space-y-2">
                <label className="block font-[family-name:var(--font-kalam-var)] font-bold text-pencil text-lg">
                  Cover Image (Drag & Drop or Upload File)
                </label>
                
                {formCoverUrl ? (
                  <div className="relative border-3 border-pencil rounded-xl overflow-hidden bg-paper/30 p-2 flex items-center gap-4">
                    <div className="relative w-24 h-16 border-2 border-pencil rounded-lg overflow-hidden shrink-0">
                      <Image src={formCoverUrl} alt="Cover Preview" fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-mono font-bold text-pencil truncate">{formCoverUrl}</p>
                      <p className="text-[10px] text-emerald-700 font-bold font-[family-name:var(--font-kalam-var)]">
                        ✓ Image uploaded & ready
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormCoverUrl("")}
                      className="p-1.5 bg-marker text-white border-2 border-pencil rounded-lg hover:bg-pencil transition-colors shrink-0 cursor-pointer"
                      title="Remove cover image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsCoverDragging(true); }}
                    onDragLeave={() => setIsCoverDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsCoverDragging(false);
                      if (e.dataTransfer.files) handleCoverFiles(e.dataTransfer.files);
                    }}
                    onClick={() => coverInputRef.current?.click()}
                    className={`border-3 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-100 ${
                      isCoverDragging 
                        ? "border-marker bg-marker/10 scale-[1.01]" 
                        : "border-pencil/40 bg-paper/30 hover:border-pencil hover:bg-paper"
                    }`}
                  >
                    <input
                      ref={coverInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files && handleCoverFiles(e.target.files)}
                    />
                    {uploadingCover ? (
                      <div className="flex flex-col items-center gap-2 py-2">
                        <Loader2 className="w-8 h-8 text-marker animate-spin" />
                        <span className="font-bold text-pencil font-[family-name:var(--font-kalam-var)] text-base">
                          Uploading Cover Image to Supabase...
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="w-12 h-12 rounded-xl bg-white border-2 border-pencil flex items-center justify-center shadow-hard-sm">
                          <Upload className="w-6 h-6 text-marker" />
                        </div>
                        <span className="font-bold text-pencil font-[family-name:var(--font-kalam-var)] text-lg">
                          Click to Browse or Drag & Drop Cover Image
                        </span>
                        <span className="text-xs text-pencil-light font-mono font-bold">
                          PNG, JPG, WEBP or SVG up to 10MB
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ===== 2. GALLERY SCREENSHOTS MULTI-FILE DRAG & DROP UPLOADER ===== */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block font-[family-name:var(--font-kalam-var)] font-bold text-pencil text-lg">
                    Gallery Screenshots ({formGallery.length} Uploaded)
                  </label>
                  {formGallery.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setFormGallery([])}
                      className="text-xs text-marker font-bold hover:underline font-mono"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {/* Gallery Visual Grid Thumbnails */}
                {formGallery.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 p-3 bg-paper/40 border-2 border-pencil rounded-xl">
                    {formGallery.map((imgUrl, idx) => (
                      <div key={idx} className="relative group border-2 border-pencil rounded-lg overflow-hidden h-24 bg-white shadow-hard-sm">
                        <Image src={imgUrl} alt={`Screenshot ${idx + 1}`} fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(idx)}
                          className="absolute top-1 right-1 p-1 bg-marker text-white border border-pencil rounded shadow-hard-sm hover:bg-pencil transition-all cursor-pointer"
                          title="Remove screenshot"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <span className="absolute bottom-1 left-1 px-1 py-0.2 bg-pencil text-white font-mono text-[9px] font-bold rounded">
                          #{idx + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Drag & Drop Box for Multiple Gallery Screenshots */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsGalleryDragging(true); }}
                  onDragLeave={() => setIsGalleryDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsGalleryDragging(false);
                    if (e.dataTransfer.files) handleGalleryFiles(e.dataTransfer.files);
                  }}
                  onClick={() => galleryInputRef.current?.click()}
                  className={`border-3 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-100 ${
                    isGalleryDragging 
                      ? "border-marker bg-marker/10 scale-[1.01]" 
                      : "border-pencil/40 bg-paper/30 hover:border-pencil hover:bg-paper"
                  }`}
                >
                  <input
                    ref={galleryInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => e.target.files && handleGalleryFiles(e.target.files)}
                  />
                  {uploadingGallery ? (
                    <div className="flex flex-col items-center gap-2 py-2">
                      <Loader2 className="w-8 h-8 text-marker animate-spin" />
                      <span className="font-bold text-pencil font-[family-name:var(--font-kalam-var)] text-base">
                        Uploading Screenshots to Supabase Storage...
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-12 h-12 rounded-xl bg-white border-2 border-pencil flex items-center justify-center shadow-hard-sm">
                        <FolderPlus className="w-6 h-6 text-marker" />
                      </div>
                      <span className="font-bold text-pencil font-[family-name:var(--font-kalam-var)] text-lg">
                        Click or Drag & Drop Multiple Website Screenshots Here
                      </span>
                      <span className="text-xs text-pencil-light font-mono font-bold">
                        Select multiple image files at once to upload to your project gallery
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tags & Tech Stack */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <WobblyInput
                  id="proj-tags"
                  type="text"
                  label="Category Tags (comma separated)"
                  placeholder="Creative Studio, UI/UX Architecture, Dark Mode"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                />

                <WobblyInput
                  id="proj-tools"
                  type="text"
                  label="Tools & Tech Stack (comma separated)"
                  placeholder="Next.js, TypeScript, Tailwind CSS, Framer Motion"
                  value={formTools}
                  onChange={(e) => setFormTools(e.target.value)}
                />
              </div>

              {/* Problem & Solution */}
              <div className="space-y-1">
                <label className="block font-[family-name:var(--font-kalam-var)] font-bold text-pencil text-base">
                  Problem Statement
                </label>
                <textarea
                  className="w-full wobbly border-2 border-pencil bg-white px-3 py-2 font-[family-name:var(--font-patrick-var)] text-pencil text-sm focus:outline-none resize-none"
                  placeholder="What challenge did this client face?"
                  rows={2}
                  value={formProblem}
                  onChange={(e) => setFormProblem(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="block font-[family-name:var(--font-kalam-var)] font-bold text-pencil text-base">
                  Solution Overview
                </label>
                <textarea
                  className="w-full wobbly border-2 border-pencil bg-white px-3 py-2 font-[family-name:var(--font-patrick-var)] text-pencil text-sm focus:outline-none resize-none"
                  placeholder="How did your design and development solve it?"
                  rows={2}
                  value={formSolution}
                  onChange={(e) => setFormSolution(e.target.value)}
                />
              </div>

              <WobblyButton type="submit" disabled={saving} variant="marker" className="w-full mt-4">
                {saving ? "Saving Showcase Project..." : "Save Showcase Project"}
              </WobblyButton>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
