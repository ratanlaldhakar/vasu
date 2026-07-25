"use client";

import { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabase";
import { WobblyCard } from "@/components/ui/WobblyCard";
import { WobblyButton } from "@/components/ui/WobblyButton";
import { WobblyInput } from "@/components/ui/WobblyInput";
import { 
  User, 
  Briefcase, 
  FileText, 
  Bell, 
  CreditCard, 
  Upload, 
  Trash2, 
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  FileCheck
} from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

interface ClientProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  business_name: string | null;
  created_at: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  plan_name: string;
  status: string;
  progress_percent: number;
  timeline: string;
}

interface ProjectFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size_bytes: number;
  created_at: string;
}

interface PaymentRecord {
  id: string;
  amount: number;
  payment_id: string;
  order_id: string;
  status: string;
  created_at: string;
}

export default function ClientManagementPage({ params }: PageProps) {
  // Resolve params promise
  const resolvedParams = use(params);
  const clientId = resolvedParams.id;

  const [client, setClient] = useState<ClientProfile | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  
  const [loading, setLoading] = useState(true);

  // Form States - Project
  const [projTitle, setProjTitle] = useState("");
  const [projDesc, setProjDesc] = useState("");
  const [projPlan, setProjPlan] = useState("");
  const [projStatus, setProjStatus] = useState("Planning");
  const [projProgress, setProjProgress] = useState(20);
  const [projTimeline, setProjTimeline] = useState("");
  const [projLoading, setProjLoading] = useState(false);
  const [projSuccess, setProjSuccess] = useState("");

  // Form States - Notification
  const [notifTitle, setNotifTitle] = useState("");
  const [notifContent, setNotifContent] = useState("");
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifSuccess, setNotifSuccess] = useState("");

  // Form States - File Share
  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fileType, setFileType] = useState("Invoice");
  const [fileSize, setFileSize] = useState(102400); // default 100KB
  const [fileUploadLoading, setFileUploadLoading] = useState(false);
  const [fileShareSuccess, setFileShareSuccess] = useState("");
  
  // Storage upload select
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchClientData = async () => {
    if (!supabase || !clientId) return;
    try {
      // 1. Fetch Client Profile
      const { data: profileData, error: profileErr } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", clientId)
        .single();

      if (!profileErr && profileData) {
        setClient(profileData);
      }

      // 2. Fetch Projects
      const { data: projData, error: projErr } = await supabase
        .from("projects")
        .select("*")
        .eq("client_id", clientId)
        .maybeSingle();

      if (!projErr && projData) {
        setProject(projData);
        setProjTitle(projData.title || "");
        setProjDesc(projData.description || "");
        setProjPlan(projData.plan_name || "");
        setProjStatus(projData.status || "Planning");
        setProjProgress(projData.progress_percent || 20);
        setProjTimeline(projData.timeline || "");
      }

      // 3. Fetch Files
      const { data: filesData, error: filesErr } = await supabase
        .from("files")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });

      if (!filesErr && filesData) {
        setFiles(filesData);
      }

      // 4. Fetch Payments
      const { data: paymentsData, error: paymentsErr } = await supabase
        .from("payments")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });

      if (!paymentsErr && paymentsData) {
        setPayments(paymentsData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (clientId) {
      fetchClientData();
    }
  }, [clientId]);

  // Project Editor Save
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !client) return;

    setProjLoading(true);
    setProjSuccess("");

    try {
      const projectData = {
        title: projTitle,
        description: projDesc,
        plan_name: projPlan,
        status: projStatus,
        progress_percent: Number(projProgress),
        timeline: projTimeline,
        updated_at: new Date().toISOString()
      };

      if (project) {
        // Update
        const { error } = await supabase
          .from("projects")
          .update(projectData)
          .eq("id", project.id);

        if (error) throw error;
        setProjSuccess("Project details updated successfully!");
      } else {
        // Create new
        const { data, error } = await supabase
          .from("projects")
          .insert({
            ...projectData,
            client_id: client.id
          })
          .select()
          .single();

        if (error) throw error;
        setProject(data);
        setProjSuccess("Project tracker initialized successfully!");
      }
    } catch (err: any) {
      alert("Error saving project: " + err.message);
    } finally {
      setProjLoading(false);
    }
  };

  // Upload deliverable to Storage and save in files table
  const handleFileShare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !client) return;

    setFileUploadLoading(true);
    setFileShareSuccess("");

    try {
      let finalUrl = fileUrl;
      let finalName = fileName;
      let finalSize = Number(fileSize);

      if (selectedFile) {
        // Upload to Supabase Storage bucket 'deliverables'
        const cleanName = selectedFile.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        const filePath = `${client.id}/${Date.now()}_${cleanName}`;
        
        const { data, error } = await supabase.storage
          .from("deliverables")
          .upload(filePath, selectedFile, {
            cacheControl: "3600",
            upsert: true
          });

        if (error) {
          throw new Error(`Storage upload failed: ${error.message}. Make sure the 'deliverables' bucket exists in your Supabase storage.`);
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from("deliverables")
          .getPublicUrl(filePath);

        finalUrl = publicUrl;
        if (!finalName) finalName = selectedFile.name;
        finalSize = selectedFile.size;
      }

      if (!finalUrl) {
        throw new Error("Please select a file to upload or paste a direct URL link.");
      }

      if (!finalName) {
        finalName = "Design Resource Document";
      }

      // Write row to files table
      const { data: newFile, error: fileInsertErr } = await supabase
        .from("files")
        .insert({
          client_id: client.id,
          name: finalName,
          url: finalUrl,
          type: fileType,
          size_bytes: finalSize
        })
        .select()
        .single();

      if (fileInsertErr) throw fileInsertErr;

      setFiles(prev => [newFile, ...prev]);
      setFileShareSuccess("File shared successfully with client portal!");
      
      // Clear states
      setFileName("");
      setFileUrl("");
      setSelectedFile(null);
    } catch (err: any) {
      alert("File Sharing Failed: " + err.message);
    } finally {
      setFileUploadLoading(false);
    }
  };

  // Delete Shared File
  const handleDeleteFile = async (id: string) => {
    if (!supabase || !confirm("Are you sure you want to remove this file link?")) return;

    try {
      const { error } = await supabase
        .from("files")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setFiles(prev => prev.filter(f => f.id !== id));
    } catch (err: any) {
      alert("Error deleting file: " + err.message);
    }
  };

  // Send Notification Log
  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !client || !notifTitle || !notifContent) return;

    setNotifLoading(true);
    setNotifSuccess("");

    try {
      const { error } = await supabase
        .from("notifications")
        .insert({
          client_id: client.id,
          title: notifTitle,
          content: notifContent,
          is_read: false
        });

      if (error) throw error;
      
      setNotifSuccess("Notification successfully sent and logged!");
      setNotifTitle("");
      setNotifContent("");
    } catch (err: any) {
      alert("Error sending notification: " + err.message);
    } finally {
      setNotifLoading(false);
    }
  };

  if (loading || !client) {
    return (
      <div className="font-[family-name:var(--font-kalam-var)] text-pencil text-xl text-center py-12">
        ✏️ Retrieving client workspace...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header back link */}
      <div className="flex items-center gap-4">
        <Link 
          href="/admin" 
          className="w-10 h-10 wobbly border-2 border-pencil bg-white flex items-center justify-center shadow-hard-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
        >
          <ArrowLeft className="w-5 h-5 text-pencil" />
        </Link>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-pencil font-[family-name:var(--font-kalam-var)]">
            Manage: {client.name}
          </h1>
          <p className="text-pencil-light font-[family-name:var(--font-patrick-var)] font-bold text-lg">
            Client email: {client.email} | Brand: {client.business_name || "None"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* 1. Project Management Card */}
        <WobblyCard
          variant="default"
          hover={false}
          className="border-3 border-pencil bg-white p-6 relative"
        >
          <h2 className="text-2xl font-bold text-pencil mb-5 font-[family-name:var(--font-kalam-var)] flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-marker" />
            Project Tracker Config
          </h2>

          {projSuccess && (
            <div className="mb-4 p-2.5 border border-dashed border-ballpoint bg-ballpoint/5 text-ballpoint text-sm font-bold font-[family-name:var(--font-kalam-var)] flex items-center gap-1.5 wobbly-sm">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              {projSuccess}
            </div>
          )}

          <form onSubmit={handleSaveProject} className="space-y-4">
            <WobblyInput
              id="project-title"
              type="text"
              label="Project Title"
              placeholder="e.g. Professional Portfolio Development"
              value={projTitle}
              onChange={(e) => setProjTitle(e.target.value)}
              required
            />

            <div className="space-y-1">
              <label htmlFor="project-desc" className="block font-[family-name:var(--font-kalam-var)] font-bold text-pencil text-lg">
                Scope Description
              </label>
              <textarea
                id="project-desc"
                className="w-full wobbly border-3 border-pencil bg-white px-4 py-2.5 font-[family-name:var(--font-patrick-var)] text-pencil text-base md:text-lg focus:outline-none focus:ring-3 focus:ring-ballpoint resize-none"
                placeholder="List features, pages, wireframes..."
                rows={3}
                value={projDesc}
                onChange={(e) => setProjDesc(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <WobblyInput
                id="project-plan"
                type="text"
                label="Selected Plan"
                placeholder="Starter / Professional / Business"
                value={projPlan}
                onChange={(e) => setProjPlan(e.target.value)}
              />

              <WobblyInput
                id="project-timeline"
                type="text"
                label="Estimated Timeline"
                placeholder="e.g. 7-10 Days"
                value={projTimeline}
                onChange={(e) => setProjTimeline(e.target.value)}
              />
            </div>

            {/* Slider and Dropdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="project-status" className="block font-[family-name:var(--font-kalam-var)] font-bold text-pencil text-lg">
                  Phase Status
                </label>
                <select
                  id="project-status"
                  className="w-full wobbly border-3 border-pencil bg-white px-4 py-2.5 min-h-[52px] font-[family-name:var(--font-patrick-var)] text-pencil text-lg focus:outline-none focus:ring-3 focus:ring-ballpoint"
                  value={projStatus}
                  onChange={(e) => setProjStatus(e.target.value)}
                >
                  <option value="Planning">Planning</option>
                  <option value="Design">Design</option>
                  <option value="Development">Development</option>
                  <option value="Testing">Testing</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label htmlFor="project-progress" className="block font-[family-name:var(--font-kalam-var)] font-bold text-pencil text-lg">
                    Progress Percentage
                  </label>
                  <span className="font-bold font-mono text-marker">{projProgress}%</span>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <input
                    id="project-progress"
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    className="flex-1 accent-pencil cursor-pointer"
                    value={projProgress}
                    onChange={(e) => setProjProgress(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <WobblyButton type="submit" disabled={projLoading} className="w-full mt-4">
              {projLoading ? "Saving Tracker..." : "Save Project Tracker Details"}
            </WobblyButton>
          </form>
        </WobblyCard>

        {/* 2. File Sharing Cabinet Card */}
        <WobblyCard
          variant="default"
          hover={false}
          className="border-3 border-pencil bg-white p-6 relative"
        >
          <h2 className="text-2xl font-bold text-pencil mb-5 font-[family-name:var(--font-kalam-var)] flex items-center gap-2">
            <FileText className="w-5 h-5 text-marker" />
            File Cabinet sharing
          </h2>

          {fileShareSuccess && (
            <div className="mb-4 p-2.5 border border-dashed border-ballpoint bg-ballpoint/5 text-ballpoint text-sm font-bold font-[family-name:var(--font-kalam-var)] flex items-center gap-1.5 wobbly-sm">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              {fileShareSuccess}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleFileShare} className="space-y-4 mb-6 border-b-2 border-dashed border-pencil/20 pb-6">
            {/* File upload from local system */}
            <div className="space-y-1">
              <label className="block font-[family-name:var(--font-kalam-var)] font-bold text-pencil text-lg">
                Upload File from PC (Recommended)
              </label>
              <div className="border-2 border-dashed border-pencil/30 p-4 rounded bg-paper/20 flex flex-col items-center justify-center text-center">
                <Upload className="w-8 h-8 text-pencil-lightest mb-2" />
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setSelectedFile(file);
                      if (!fileName) setFileName(file.name);
                    }
                  }}
                  className="text-sm text-pencil-light file:mr-4 file:py-1.5 file:px-4 file:wobbly file:border-2 file:border-pencil file:font-bold file:bg-white file:text-pencil cursor-pointer"
                />
                {selectedFile && (
                  <p className="text-xs text-ballpoint font-bold mt-2">
                    Selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                  </p>
                )}
              </div>
            </div>

            <div className="relative flex items-center justify-center py-2">
              <span className="text-xs text-pencil-lightest bg-white px-3 font-bold font-[family-name:var(--font-kalam-var)]">
                OR PASTE DIRECT URL LINK
              </span>
            </div>

            <WobblyInput
              id="file-url"
              type="text"
              label="Direct Download URL link"
              placeholder="https://drive.google.com/..."
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              disabled={selectedFile !== null}
            />

            <WobblyInput
              id="file-name"
              type="text"
              label="Display Name / Label"
              placeholder="e.g. Design Proposal Agreement"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="file-type" className="block font-[family-name:var(--font-kalam-var)] font-bold text-pencil text-lg">
                  Document Type
                </label>
                <select
                  id="file-type"
                  className="w-full wobbly border-3 border-pencil bg-white px-4 py-2.5 min-h-[52px] font-[family-name:var(--font-patrick-var)] text-pencil text-lg focus:outline-none"
                  value={fileType}
                  onChange={(e) => setFileType(e.target.value)}
                >
                  <option value="Invoice">Invoice</option>
                  <option value="Receipt">Receipt</option>
                  <option value="Contract">Contract</option>
                  <option value="Design">Design Mockup</option>
                  <option value="ZIP">ZIP Archive</option>
                </select>
              </div>

              <WobblyInput
                id="file-size"
                type="number"
                label="Size in Bytes (manual URL only)"
                value={fileSize}
                onChange={(e) => setFileSize(Number(e.target.value))}
                disabled={selectedFile !== null}
              />
            </div>

            <WobblyButton type="submit" disabled={fileUploadLoading} className="w-full">
              {fileUploadLoading ? "Uploading & Sharing..." : "Share Document Link"}
            </WobblyButton>
          </form>

          {/* Shared Files List */}
          <div className="space-y-3">
            <h4 className="text-base font-bold text-pencil font-[family-name:var(--font-kalam-var)]">
              Shared Documents Log
            </h4>
            {files.length > 0 ? (
              <div className="max-h-[220px] overflow-y-auto space-y-2 pr-1">
                {files.map((file) => (
                  <div key={file.id} className="flex justify-between items-center p-3 border-2 border-pencil wobbly-sm bg-paper/10 text-sm">
                    <div className="min-w-0">
                      <div className="font-bold text-pencil truncate font-[family-name:var(--font-patrick-var)] text-base">
                        {file.name}
                      </div>
                      <span className="text-[10px] text-pencil-lightest font-mono uppercase bg-white border px-1">
                        {file.type}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteFile(file.id)}
                      className="p-2 border-2 border-transparent hover:border-marker hover:bg-marker/5 rounded text-marker transition-colors"
                      title="Retract document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-pencil-lightest text-xs font-[family-name:var(--font-patrick-var)]">
                No deliverables shared with this client yet.
              </p>
            )}
          </div>
        </WobblyCard>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 3. Send Notification Alert Panel */}
        <WobblyCard
          variant="default"
          hover={false}
          className="border-3 border-pencil bg-white p-6 relative"
        >
          <h2 className="text-2xl font-bold text-pencil mb-5 font-[family-name:var(--font-kalam-var)] flex items-center gap-2">
            <Bell className="w-5 h-5 text-marker" />
            Issue Alert Notification
          </h2>

          {notifSuccess && (
            <div className="mb-4 p-2.5 border border-dashed border-ballpoint bg-ballpoint/5 text-ballpoint text-sm font-bold font-[family-name:var(--font-kalam-var)] flex items-center gap-1.5 wobbly-sm">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              {notifSuccess}
            </div>
          )}

          <form onSubmit={handleSendNotification} className="space-y-4">
            <WobblyInput
              id="notif-title"
              type="text"
              label="Notification Title"
              placeholder="e.g. UI Wireframes Completed!"
              value={notifTitle}
              onChange={(e) => setNotifTitle(e.target.value)}
              required
            />

            <div className="space-y-1">
              <label htmlFor="notif-content" className="block font-[family-name:var(--font-kalam-var)] font-bold text-pencil text-lg">
                Alert Content Text
              </label>
              <textarea
                id="notif-content"
                className="w-full wobbly border-3 border-pencil bg-white px-4 py-2.5 font-[family-name:var(--font-patrick-var)] text-pencil text-base md:text-lg focus:outline-none focus:ring-3 focus:ring-ballpoint resize-none"
                placeholder="e.g. Please check the files cabinet to download and review the layout wireframes."
                rows={3}
                value={notifContent}
                onChange={(e) => setNotifContent(e.target.value)}
                required
              />
            </div>

            <WobblyButton type="submit" disabled={notifLoading} className="w-full">
              {notifLoading ? "Broadcasting..." : "Broadcast Alert Notification"}
            </WobblyButton>
          </form>
        </WobblyCard>

        {/* 4. Client Bookings & Razorpay Log */}
        <WobblyCard
          variant="default"
          hover={false}
          className="border-3 border-pencil bg-white p-6 relative"
        >
          <h2 className="text-2xl font-bold text-pencil mb-5 font-[family-name:var(--font-kalam-var)] flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-marker" />
            Billing & Razorpay logs
          </h2>

          <div className="space-y-3">
            {payments.length > 0 ? (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {payments.map((pay) => (
                  <div key={pay.id} className="p-3 border-2 border-pencil wobbly-sm bg-paper/10 text-xs font-sans space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-pencil text-sm">
                        ₹{pay.amount.toLocaleString("en-IN")} Received
                      </span>
                      <span className="text-[10px] text-ballpoint font-bold uppercase tracking-wider">
                        {pay.status}
                      </span>
                    </div>
                    <div className="text-pencil-light font-mono">
                      Pay ID: <span className="text-pencil select-all bg-white border px-1">{pay.payment_id}</span>
                    </div>
                    <div className="text-pencil-light font-mono">
                      Order ID: <span className="text-pencil select-all bg-white border px-1">{pay.order_id || "N/A"}</span>
                    </div>
                    <div className="text-[10px] text-pencil-lightest text-right">
                      Date: {new Date(pay.created_at).toLocaleString("en-IN")}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-pencil-lightest">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 text-pencil-lightest" />
                <p className="font-[family-name:var(--font-patrick-var)] text-base">
                  No bookings or transactions recorded for this client.
                </p>
              </div>
            )}
          </div>
        </WobblyCard>

      </div>
    </div>
  );
}
