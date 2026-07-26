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
  Plus,
  Calendar,
  Sparkles,
  Phone,
  Mail,
  Building,
  Printer
} from "lucide-react";
import Link from "next/link";
import { InvoiceModal, InvoiceData } from "@/components/ui/InvoiceModal";

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
  plan_name?: string;
  item_description?: string;
}

type TabType = "project" | "invoices" | "files" | "notifications";

export default function ClientManagementPage({ params }: PageProps) {
  // Resolve params promise
  const resolvedParams = use(params);
  const clientId = resolvedParams.id;

  const [client, setClient] = useState<ClientProfile | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("project");
  const [activeInvoice, setActiveInvoice] = useState<InvoiceData | null>(null);

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

  // Form States - Updated Invoice Creator (matching /admin/invoices)
  const [invPlanName, setInvPlanName] = useState("Professional Plan");
  const [invCustomTitle, setInvCustomTitle] = useState("");
  const [invCustomDescription, setInvCustomDescription] = useState("");
  const [invPriceText, setInvPriceText] = useState("₹5,999");
  const [invAmount, setInvAmount] = useState(5999);
  const [invStatus, setInvStatus] = useState("Paid");
  const [invPayId, setInvPayId] = useState("");
  const [invLoading, setInvLoading] = useState(false);
  const [invSuccess, setInvSuccess] = useState("");

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
        .select(`
          id,
          amount,
          payment_id,
          order_id,
          status,
          created_at,
          bookings (
            plan_name
          )
        `)
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });

      if (!paymentsErr && paymentsData) {
        const formatted = (paymentsData as any[]).map(pay => ({
          id: pay.id,
          amount: pay.amount,
          payment_id: pay.payment_id,
          order_id: pay.order_id,
          status: pay.status,
          created_at: pay.created_at,
          plan_name: pay.bookings?.plan_name || "Manual Package"
        }));
        setPayments(formatted);
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

  // Handle Preset Selection & Auto-fill
  const handlePresetChange = (preset: string) => {
    setInvPlanName(preset);
    if (preset === "Starter Plan") {
      setInvPriceText("₹2,999");
      setInvAmount(2999);
    } else if (preset === "Professional Plan") {
      setInvPriceText("₹5,999");
      setInvAmount(5999);
    } else if (preset === "Business Plan") {
      setInvPriceText("₹11,999");
      setInvAmount(11999);
    } else if (preset === "Custom Service Charge") {
      setInvPriceText("₹999");
      setInvAmount(999);
    } else if (preset === "Website Maintenance") {
      setInvPriceText("₹1,499");
      setInvAmount(1499);
    } else if (preset === "Feature Integration") {
      setInvPriceText("₹2,499");
      setInvAmount(2499);
    }
  };

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
        setProjSuccess("Project tracker details updated successfully!");
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
          if (error.message.includes("not found") || error.message.includes("Bucket")) {
            throw new Error(`The Supabase Storage bucket 'deliverables' is missing. Please create a Public bucket named 'deliverables' under Supabase Dashboard -> Storage -> New Bucket.`);
          }
          throw error;
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

      // Write row to files table
      const { data: newFile, error: fileInsertErr } = await supabase
        .from("files")
        .insert({
          client_id: client.id,
          name: finalName || "Resource File",
          url: finalUrl,
          type: fileType,
          size_bytes: finalSize
        })
        .select()
        .single();

      if (fileInsertErr) throw fileInsertErr;

      // Log notification entry for client
      await supabase
        .from("notifications")
        .insert({
          client_id: client.id,
          title: `📁 New File Shared: ${finalName || "Resource File"}`,
          content: `Admin shared a new document (${fileType}) in your File Cabinet.`,
          is_read: false
        });

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

  // Create Manual Booking & Invoice (Updated with custom title & description matching /admin/invoices)
  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !client) return;

    setInvLoading(true);
    setInvSuccess("");

    try {
      const finalItemTitle = invCustomTitle.trim() || invPlanName;
      const isPending = invStatus === "Pending";
      const paymentStatusValue = isPending ? "pending" : "success";
      const paymentId = invPayId || (isPending ? `INV-PENDING-${Date.now()}` : `MANUAL-${Date.now()}`);

      // 1. Create Booking
      const { data: booking, error: bookingErr } = await supabase
        .from("bookings")
        .insert({
          client_id: client.id,
          plan_name: finalItemTitle,
          price: invPriceText,
          payment_status: invStatus,
          project_status: "Planning",
          estimated_delivery: "7-10 Days"
        })
        .select()
        .single();

      if (bookingErr) throw bookingErr;

      // 2. Create Payment log
      const { data: payment, error: paymentErr } = await supabase
        .from("payments")
        .insert({
          booking_id: booking.id,
          client_id: client.id,
          amount: Number(invAmount),
          payment_id: paymentId,
          order_id: `ORDER-${Date.now()}`,
          status: paymentStatusValue
        })
        .select()
        .single();

      if (paymentErr) throw paymentErr;

      // If pending, alert client via notification
      if (isPending) {
        await supabase
          .from("notifications")
          .insert({
            client_id: client.id,
            title: `💳 Pending Invoice: ${finalItemTitle}`,
            content: `You have an unpaid invoice of ${invPriceText} for '${finalItemTitle}'. Open Bookings to pay online now.`,
            is_read: false
          });
      }

      setPayments(prev => [
        {
          id: payment.id,
          amount: payment.amount,
          payment_id: payment.payment_id,
          order_id: payment.order_id,
          status: payment.status,
          created_at: payment.created_at,
          plan_name: finalItemTitle,
          item_description: invCustomDescription
        },
        ...prev
      ]);

      // Dispatch automated email notification to client
      fetch("/api/notifications/send-invoice-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: client.name,
          clientEmail: client.email,
          planName: finalItemTitle,
          itemDescription: invCustomDescription,
          amountText: invPriceText,
          paymentStatus: invStatus,
          invoiceNumber: `INV-${payment.id.substring(0, 8).toUpperCase()}`,
          date: new Date().toLocaleDateString("en-IN"),
          paymentId: paymentId
        })
      }).catch(err => console.error("Email notification dispatch error:", err));

      setInvSuccess(`Invoice Record generated & email notice sent to ${client.email}!`);
      setInvPayId("");
      setInvCustomTitle("");
      setInvCustomDescription("");
      
      // Auto trigger project setup if client does not have a tracker yet
      if (!project) {
        setProjTitle(`${finalItemTitle} Website Project`);
        setProjPlan(finalItemTitle);
        setProjDesc(invCustomDescription || `Development of your ${finalItemTitle} package plan.`);
      }
    } catch (err: any) {
      alert("Invoice creation failed: " + err.message);
    } finally {
      setInvLoading(false);
    }
  };

  if (loading || !client) {
    return (
      <div className="font-[family-name:var(--font-kalam-var)] text-pencil text-xl text-center py-12">
        ✏️ Retrieving client workspace...
      </div>
    );
  }

  const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      
      {/* Back button & Title bar */}
      <div className="flex items-center gap-4">
        <Link 
          href="/admin" 
          className="w-10 h-10 wobbly border-2 border-pencil bg-white flex items-center justify-center shadow-hard-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
        >
          <ArrowLeft className="w-5 h-5 text-pencil" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-pencil font-[family-name:var(--font-kalam-var)]">
            Client Hub: {client.name}
          </h1>
          <p className="text-pencil-light font-[family-name:var(--font-patrick-var)] font-bold text-base sm:text-lg">
            Manage progress, invoices, files, and push alerts for this client.
          </p>
        </div>
      </div>

      {/* Top Client Profile Overview Card */}
      <WobblyCard
        variant="default"
        hover={false}
        className="border-3 border-pencil bg-white p-5 sm:p-6 relative"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-2 border-dashed border-pencil/20 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 wobbly border-2 border-pencil bg-marker/10 text-marker flex items-center justify-center font-bold text-xl">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-pencil font-[family-name:var(--font-kalam-var)]">
                {client.name}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-mono text-pencil-light mt-0.5">
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {client.email}</span>
                {client.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {client.phone}</span>}
                {client.business_name && <span className="flex items-center gap-1"><Building className="w-3.5 h-3.5" /> {client.business_name}</span>}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto">
            <span className="text-xs font-bold font-mono text-pencil-light bg-paper border border-pencil px-3 py-1 rounded-full">
              Joined: {new Date(client.created_at).toLocaleDateString("en-IN")}
            </span>
          </div>
        </div>

        {/* Quick Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-2.5 bg-paper/30 border-2 border-pencil rounded-xl font-[family-name:var(--font-kalam-var)]">
            <span className="text-xs text-pencil-light font-bold block">Current Phase</span>
            <span className="text-sm sm:text-base font-extrabold text-marker">{project?.status || "Not Started"}</span>
          </div>
          <div className="p-2.5 bg-paper/30 border-2 border-pencil rounded-xl font-[family-name:var(--font-kalam-var)]">
            <span className="text-xs text-pencil-light font-bold block">Completion</span>
            <span className="text-sm sm:text-base font-extrabold text-ballpoint">{project?.progress_percent || 0}%</span>
          </div>
          <div className="p-2.5 bg-paper/30 border-2 border-pencil rounded-xl font-[family-name:var(--font-kalam-var)]">
            <span className="text-xs text-pencil-light font-bold block">Total Payments</span>
            <span className="text-sm sm:text-base font-extrabold text-emerald-700">₹{totalRevenue.toLocaleString("en-IN")}</span>
          </div>
          <div className="p-2.5 bg-paper/30 border-2 border-pencil rounded-xl font-[family-name:var(--font-kalam-var)]">
            <span className="text-xs text-pencil-light font-bold block">Shared Files</span>
            <span className="text-sm sm:text-base font-extrabold text-pencil">{files.length} Docs</span>
          </div>
        </div>
      </WobblyCard>

      {/* Modern Segmented Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab("project")}
          className={`wobbly px-4 py-2.5 border-2 border-pencil font-[family-name:var(--font-kalam-var)] font-bold text-sm sm:text-base transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === "project" 
              ? "bg-marker text-white shadow-hard-sm" 
              : "bg-white text-pencil hover:bg-paper"
          }`}
        >
          <Briefcase className="w-4 h-4" /> Project Tracker
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("invoices")}
          className={`wobbly px-4 py-2.5 border-2 border-pencil font-[family-name:var(--font-kalam-var)] font-bold text-sm sm:text-base transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === "invoices" 
              ? "bg-ballpoint text-white shadow-hard-sm" 
              : "bg-white text-pencil hover:bg-paper"
          }`}
        >
          <CreditCard className="w-4 h-4" /> Invoices & Billing ({payments.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("files")}
          className={`wobbly px-4 py-2.5 border-2 border-pencil font-[family-name:var(--font-kalam-var)] font-bold text-sm sm:text-base transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === "files" 
              ? "bg-postit text-pencil shadow-hard-sm" 
              : "bg-white text-pencil hover:bg-paper"
          }`}
        >
          <FileText className="w-4 h-4" /> File Cabinet ({files.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("notifications")}
          className={`wobbly px-4 py-2.5 border-2 border-pencil font-[family-name:var(--font-kalam-var)] font-bold text-sm sm:text-base transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === "notifications" 
              ? "bg-pencil text-white shadow-hard-sm" 
              : "bg-white text-pencil hover:bg-paper"
          }`}
        >
          <Bell className="w-4 h-4" /> Push Alert Notification
        </button>
      </div>

      {/* Tab Panels */}
      
      {/* TAB 1: PROJECT TRACKER */}
      {activeTab === "project" && (
        <WobblyCard
          variant="default"
          hover={false}
          className="border-3 border-pencil bg-white p-6 relative animate-fade-in"
        >
          <div className="flex items-center justify-between border-b-2 border-dashed border-pencil/20 pb-4 mb-6">
            <h2 className="text-2xl font-bold text-pencil font-[family-name:var(--font-kalam-var)] flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-marker" /> Project Tracker Configuration
            </h2>
            <span className="text-xs font-mono font-bold text-pencil-light">
              ID: {project?.id || "New Project"}
            </span>
          </div>

          {projSuccess && (
            <div className="mb-4 p-3 border-2 border-pencil bg-emerald-50 text-emerald-900 text-sm font-bold font-[family-name:var(--font-kalam-var)] flex items-center gap-2 rounded-xl">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              {projSuccess}
            </div>
          )}

          <form onSubmit={handleSaveProject} className="space-y-4 max-w-3xl">
            <WobblyInput
              id="project-title"
              type="text"
              label="Project Title"
              placeholder="e.g. Custom Website Project"
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <label htmlFor="project-status" className="block font-[family-name:var(--font-kalam-var)] font-bold text-pencil text-lg">
                  Phase Status
                </label>
                <select
                  id="project-status"
                  className="w-full wobbly border-3 border-pencil bg-white px-4 py-2.5 min-h-[52px] font-[family-name:var(--font-patrick-var)] text-pencil text-lg focus:outline-none focus:ring-3 focus:ring-ballpoint cursor-pointer"
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
                  <span className="font-bold font-mono text-marker text-lg">{projProgress}%</span>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <input
                    id="project-progress"
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    className="flex-1 accent-pencil cursor-pointer h-2"
                    value={projProgress}
                    onChange={(e) => setProjProgress(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <WobblyButton type="submit" disabled={projLoading} className="w-full sm:w-auto px-8 mt-4">
              {projLoading ? "Saving Tracker..." : "Save Project Tracker Details"}
            </WobblyButton>
          </form>
        </WobblyCard>
      )}

      {/* TAB 2: INVOICES & BILLING (Updated to match /admin/invoices) */}
      {activeTab === "invoices" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
          {/* Create Invoice Form */}
          <WobblyCard
            variant="default"
            hover={false}
            className="border-3 border-pencil bg-white p-6 relative"
          >
            <h2 className="text-2xl font-bold text-pencil mb-5 font-[family-name:var(--font-kalam-var)] flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-ballpoint" /> Generate Invoice & Booking
            </h2>

            {invSuccess && (
              <div className="mb-4 p-3 border-2 border-pencil bg-emerald-50 text-emerald-900 text-sm font-bold font-[family-name:var(--font-kalam-var)] flex items-center gap-2 rounded-xl">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                {invSuccess}
              </div>
            )}

            <form onSubmit={handleCreateInvoice} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="inv-plan" className="block font-[family-name:var(--font-kalam-var)] font-bold text-pencil text-lg">
                    Package / Preset
                  </label>
                  <select
                    id="inv-plan"
                    className="w-full wobbly border-3 border-pencil bg-white px-4 py-2.5 min-h-[52px] font-[family-name:var(--font-patrick-var)] text-pencil text-lg focus:outline-none"
                    value={invPlanName}
                    onChange={(e) => handlePresetChange(e.target.value)}
                  >
                    <option value="Starter Plan">Starter Plan</option>
                    <option value="Professional Plan">Professional Plan</option>
                    <option value="Business Plan">Business Plan</option>
                    <option value="Custom Service Charge">Custom Service Charge</option>
                    <option value="Website Maintenance">Website Maintenance</option>
                    <option value="Feature Integration">Feature Integration</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label htmlFor="inv-status" className="block font-[family-name:var(--font-kalam-var)] font-bold text-pencil text-lg">
                    Payment Status
                  </label>
                  <select
                    id="inv-status"
                    className="w-full wobbly border-3 border-pencil bg-white px-4 py-2.5 min-h-[52px] font-[family-name:var(--font-patrick-var)] text-pencil text-lg focus:outline-none"
                    value={invStatus}
                    onChange={(e) => setInvStatus(e.target.value)}
                  >
                    <option value="Paid">Paid (Success)</option>
                    <option value="Pending">Pending (Unpaid)</option>
                  </select>
                </div>
              </div>

              {/* Custom Item Title / Name */}
              <WobblyInput
                id="inv-custom-title"
                type="text"
                label="Item Title / Item Name"
                placeholder="e.g. Redesign, Annual Maintenance"
                value={invCustomTitle}
                onChange={(e) => setInvCustomTitle(e.target.value)}
              />

              {/* Subtitle / Description */}
              <div className="space-y-1">
                <label htmlFor="inv-desc" className="block font-[family-name:var(--font-kalam-var)] font-bold text-pencil text-lg">
                  Subtitle / Description (Optional)
                </label>
                <textarea
                  id="inv-desc"
                  className="w-full wobbly border-3 border-pencil bg-white px-4 py-2.5 font-[family-name:var(--font-patrick-var)] text-pencil text-base focus:outline-none resize-none"
                  placeholder="e.g. Custom CRM design, database integration & admin portal setup"
                  rows={2}
                  value={invCustomDescription}
                  onChange={(e) => setInvCustomDescription(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <WobblyInput
                  id="inv-price"
                  type="text"
                  label="Price Text Label"
                  placeholder="e.g. ₹5,999"
                  value={invPriceText}
                  onChange={(e) => setInvPriceText(e.target.value)}
                  required
                />

                <WobblyInput
                  id="inv-amount"
                  type="number"
                  label="Amount Value"
                  placeholder="5999"
                  value={invAmount}
                  onChange={(e) => setInvAmount(Number(e.target.value))}
                  required
                />
              </div>

              <WobblyInput
                id="inv-payid"
                type="text"
                label="Razorpay ID (optional)"
                placeholder="e.g. pay_Lnk9eA2y..."
                value={invPayId}
                onChange={(e) => setInvPayId(e.target.value)}
              />

              <WobblyButton type="submit" disabled={invLoading} variant="ballpoint" className="w-full">
                <Plus className="w-4 h-4 mr-1.5" />
                {invLoading ? "Creating Record..." : "Create Invoice Record"}
              </WobblyButton>
            </form>
          </WobblyCard>

          {/* Payment History List with View & Print Invoice buttons */}
          <WobblyCard
            variant="default"
            hover={false}
            className="border-3 border-pencil bg-white p-6 relative flex flex-col"
          >
            <h3 className="text-xl font-bold text-pencil mb-4 font-[family-name:var(--font-kalam-var)]">
              Payments & Invoices History ({payments.length})
            </h3>

            {payments.length > 0 ? (
              <div className="space-y-3 overflow-y-auto max-h-[500px] pr-1 flex-1">
                {payments.map((pay) => (
                  <div key={pay.id} className="p-3.5 border-2 border-pencil wobbly-sm bg-paper/20 space-y-2 relative">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="font-extrabold text-pencil text-base font-[family-name:var(--font-kalam-var)] block">
                          ₹{pay.amount.toLocaleString("en-IN")} Received
                        </span>
                        <span className="text-xs text-pencil-light font-bold">
                          Plan / Item: <strong className="text-pencil">{pay.plan_name}</strong>
                        </span>
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                        pay.status === "success" || pay.status === "Paid" 
                          ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                          : "bg-amber-100 text-amber-900 border-amber-300"
                      }`}>
                        {pay.status}
                      </span>
                    </div>

                    <div className="text-[11px] text-pencil-light font-mono pt-1.5 border-t border-pencil/10 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                      <span>Pay ID: <strong className="text-pencil select-all bg-white border px-1">{pay.payment_id}</strong></span>
                      
                      <button
                        type="button"
                        onClick={() =>
                          setActiveInvoice({
                            invoiceNumber: `INV-${pay.id.substring(0, 8).toUpperCase()}`,
                            date: new Date(pay.created_at).toLocaleDateString("en-IN"),
                            clientName: client.name,
                            clientEmail: client.email,
                            clientBusiness: client.business_name || undefined,
                            planName: pay.plan_name || "Custom Package Plan",
                            itemDescription: pay.item_description,
                            amountText: `₹${pay.amount.toLocaleString("en-IN")}`,
                            amountNum: pay.amount,
                            paymentId: pay.payment_id,
                            status: pay.status || "SUCCESS"
                          })
                        }
                        className="px-2.5 py-1 border border-pencil bg-white text-pencil text-xs font-bold font-[family-name:var(--font-kalam-var)] rounded hover:bg-pencil hover:text-white transition-colors flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                      >
                        <Printer className="w-3.5 h-3.5 text-emerald-600" />
                        View & Print Invoice
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-pencil-lightest my-auto">
                <AlertCircle className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="font-[family-name:var(--font-patrick-var)] text-base font-bold">
                  No payment records logged for this client yet.
                </p>
              </div>
            )}
          </WobblyCard>
        </div>
      )}

      {/* TAB 3: FILE CABINET SHARING */}
      {activeTab === "files" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
          {/* File Upload Form */}
          <WobblyCard
            variant="default"
            hover={false}
            className="border-3 border-pencil bg-white p-6 relative"
          >
            <h2 className="text-2xl font-bold text-pencil mb-5 font-[family-name:var(--font-kalam-var)] flex items-center gap-2">
              <Upload className="w-6 h-6 text-marker" /> Share Deliverable or Document
            </h2>

            {fileShareSuccess && (
              <div className="mb-4 p-3 border-2 border-pencil bg-emerald-50 text-emerald-900 text-sm font-bold font-[family-name:var(--font-kalam-var)] flex items-center gap-2 rounded-xl">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                {fileShareSuccess}
              </div>
            )}

            <form onSubmit={handleFileShare} className="space-y-4">
              {/* File upload from local PC */}
              <div className="space-y-1">
                <label className="block font-[family-name:var(--font-kalam-var)] font-bold text-pencil text-lg">
                  Upload File from PC (Recommended)
                </label>
                <div className="border-2 border-dashed border-pencil/30 p-4 rounded-xl bg-paper/20 flex flex-col items-center justify-center text-center">
                  <Upload className="w-7 h-7 text-pencil-lightest mb-2" />
                  <input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setSelectedFile(file);
                        if (!fileName) setFileName(file.name);
                      }
                    }}
                    className="text-xs text-pencil-light file:mr-3 file:py-1.5 file:px-3 file:wobbly file:border-2 file:border-pencil file:font-bold file:bg-white file:text-pencil cursor-pointer"
                  />
                  {selectedFile && (
                    <p className="text-xs text-ballpoint font-bold mt-2">
                      Selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                    </p>
                  )}
                </div>
              </div>

              <div className="relative flex items-center justify-center py-1">
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
                  label="Size in Bytes (manual)"
                  value={fileSize}
                  onChange={(e) => setFileSize(Number(e.target.value))}
                  disabled={selectedFile !== null}
                />
              </div>

              <WobblyButton type="submit" disabled={fileUploadLoading} variant="secondary" className="w-full">
                {fileUploadLoading ? "Uploading & Sharing..." : "Share Document with Client"}
              </WobblyButton>
            </form>
          </WobblyCard>

          {/* Shared Files List */}
          <WobblyCard
            variant="default"
            hover={false}
            className="border-3 border-pencil bg-white p-6 relative flex flex-col"
          >
            <h3 className="text-xl font-bold text-pencil mb-4 font-[family-name:var(--font-kalam-var)]">
              File Cabinet Deliverables ({files.length})
            </h3>

            {files.length > 0 ? (
              <div className="space-y-2.5 overflow-y-auto max-h-[420px] pr-1 flex-1">
                {files.map((file) => (
                  <div key={file.id} className="flex justify-between items-center p-3 border-2 border-pencil wobbly-sm bg-paper/20 text-sm gap-2">
                    <div className="min-w-0">
                      <a 
                        href={file.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-bold text-pencil hover:text-marker truncate font-[family-name:var(--font-patrick-var)] text-base block hover:underline"
                      >
                        {file.name}
                      </a>
                      <div className="flex items-center gap-2 text-[10px] text-pencil-light font-mono mt-0.5">
                        <span className="uppercase bg-white border border-pencil px-1.5 py-0.2 rounded font-bold text-pencil">
                          {file.type}
                        </span>
                        <span>{Math.round(file.size_bytes / 1024)} KB</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteFile(file.id)}
                      className="p-2 border-2 border-pencil bg-white hover:bg-marker hover:text-white rounded-lg transition-colors cursor-pointer"
                      title="Retract document link"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-pencil-lightest my-auto">
                <FileText className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="font-[family-name:var(--font-patrick-var)] text-base font-bold">
                  No deliverables shared in client cabinet yet.
                </p>
              </div>
            )}
          </WobblyCard>
        </div>
      )}

      {/* TAB 4: PUSH NOTIFICATIONS */}
      {activeTab === "notifications" && (
        <WobblyCard
          variant="default"
          hover={false}
          className="border-3 border-pencil bg-white p-6 relative max-w-2xl mx-auto animate-fade-in"
        >
          <h2 className="text-2xl font-bold text-pencil mb-5 font-[family-name:var(--font-kalam-var)] flex items-center gap-2">
            <Bell className="w-6 h-6 text-marker" /> Issue Client Dashboard Notification
          </h2>

          {notifSuccess && (
            <div className="mb-4 p-3 border-2 border-pencil bg-emerald-50 text-emerald-900 text-sm font-bold font-[family-name:var(--font-kalam-var)] flex items-center gap-2 rounded-xl">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              {notifSuccess}
            </div>
          )}

          <form onSubmit={handleSendNotification} className="space-y-4">
            <WobblyInput
              id="notif-title"
              type="text"
              label="Notification Title"
              placeholder="e.g. UI Wireframes Ready for Review!"
              value={notifTitle}
              onChange={(e) => setNotifTitle(e.target.value)}
              required
            />

            <div className="space-y-1">
              <label htmlFor="notif-content" className="block font-[family-name:var(--font-kalam-var)] font-bold text-pencil text-lg">
                Alert Message Body
              </label>
              <textarea
                id="notif-content"
                className="w-full wobbly border-3 border-pencil bg-white px-4 py-2.5 font-[family-name:var(--font-patrick-var)] text-pencil text-base md:text-lg focus:outline-none focus:ring-3 focus:ring-ballpoint resize-none"
                placeholder="e.g. We have uploaded your homepage mockup to the File Cabinet. Please review and provide feedback."
                rows={4}
                value={notifContent}
                onChange={(e) => setNotifContent(e.target.value)}
                required
              />
            </div>

            <WobblyButton type="submit" disabled={notifLoading} variant="marker" className="w-full">
              {notifLoading ? "Broadcasting..." : "Broadcast Notification to Client Portal"}
            </WobblyButton>
          </form>
        </WobblyCard>
      )}

      {/* View & Print Invoice Modal */}
      <InvoiceModal
        invoice={activeInvoice}
        onClose={() => setActiveInvoice(null)}
      />

    </div>
  );
}
