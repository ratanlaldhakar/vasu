"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { WobblyCard } from "@/components/ui/WobblyCard";
import { WobblyButton } from "@/components/ui/WobblyButton";
import { PaymentSuccessModal, PaymentSuccessData } from "@/components/ui/PaymentSuccessModal";
import { 
  Briefcase, 
  Bell, 
  ArrowRight, 
  AlertCircle, 
  CreditCard, 
  Receipt, 
  ShieldCheck, 
  Sparkles,
  MessageSquare,
  FileText,
  User,
  Clock,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";

interface Project {
  id: string;
  title: string;
  plan_name: string;
  status: string;
  progress_percent: number;
  timeline: string;
  created_at: string;
}

interface Booking {
  id: string;
  plan_name: string;
  booking_date: string;
  price: string;
  payment_status: string;
  project_status: string;
  estimated_delivery: string;
}

interface PaymentRecord {
  id: string;
  amount: number;
  payment_id: string;
  order_id: string;
  status: string;
  created_at: string;
  plan_name?: string;
}

interface Notification {
  id: string;
  title: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

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

export default function DashboardHome() {
  const { user, profile } = useAuth();
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<PaymentSuccessData | null>(null);

  const fetchDashboardData = async () => {
    if (!supabase || !user) return;
    try {
      // 1. Fetch Projects
      const { data: projData } = await supabase
        .from("projects")
        .select("*")
        .eq("client_id", user.id)
        .order("created_at", { ascending: false });
      
      if (projData) setProjects(projData);

      // 2. Fetch Bookings
      const { data: bookData } = await supabase
        .from("bookings")
        .select("*")
        .eq("client_id", user.id)
        .order("booking_date", { ascending: false });

      if (bookData) setBookings(bookData);

      // 3. Fetch Payments
      const { data: payData } = await supabase
        .from("payments")
        .select(`
          id,
          amount,
          payment_id,
          order_id,
          status,
          created_at,
          bookings ( plan_name )
        `)
        .eq("client_id", user.id)
        .order("created_at", { ascending: false });

      if (payData) {
        const formatted = (payData as any[]).map(pay => ({
          id: pay.id,
          amount: pay.amount,
          payment_id: pay.payment_id,
          order_id: pay.order_id,
          status: pay.status,
          created_at: pay.created_at,
          plan_name: pay.bookings?.plan_name || "Development Service"
        }));
        setPayments(formatted);
      }

      // 4. Fetch Notifications
      const { data: notifData } = await supabase
        .from("notifications")
        .select("*")
        .eq("client_id", user.id)
        .order("created_at", { ascending: false })
        .limit(4);

      if (notifData) setNotifications(notifData);
    } catch (err) {
      console.error("Error loading dashboard details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const handleDirectPay = async (pay: PaymentRecord) => {
    if (!supabase || !user) return;
    setPayingId(pay.id);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error("Failed to load Razorpay Gateway.");

      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: pay.amount,
          packageName: pay.plan_name || "Service Charge"
        })
      });

      if (!res.ok) throw new Error("Could not create Razorpay order.");
      const orderData = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || orderData.keyId || "rzp_live_TIDMY6pOJhzbWt",
        amount: orderData.amount,
        currency: "INR",
        name: "Vasuu Design Studio",
        description: `Payment for ${pay.plan_name}`,
        order_id: orderData.id,
        handler: async function (response: any) {
          try {
            if (supabase) {
              await supabase
                .from("payments")
                .update({
                  status: "success",
                  payment_id: response.razorpay_payment_id,
                  order_id: response.razorpay_order_id
                })
                .eq("id", pay.id);

              await supabase
                .from("bookings")
                .update({ payment_status: "Paid" })
                .eq("client_id", user.id);
            }
            setSuccessData({
              amount: pay.amount,
              planName: pay.plan_name,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              clientEmail: user.email
            });
            fetchDashboardData();
          } catch (err) {
            console.error("Payment update error:", err);
            setSuccessData({
              amount: pay.amount,
              planName: pay.plan_name,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              clientEmail: user.email
            });
          } finally {
            setPayingId(null);
          }
        },
        prefill: {
          name: user.user_metadata?.name || user.email,
          email: user.email
        },
        theme: { color: "#2d5da1" }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      alert("Payment Launch Error: " + err.message);
    } finally {
      setPayingId(null);
    }
  };

  const markNotificationRead = async (id: string) => {
    if (!supabase) return;
    try {
      await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", id);
      
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="font-[family-name:var(--font-kalam-var)] text-pencil text-xl text-center py-12">
        ✏️ Reading client portal status...
      </div>
    );
  }

  const activeProject = projects[0];
  const activeBooking = bookings[0];
  const clientName = profile?.name || user?.user_metadata?.name || user?.email?.split("@")[0] || "Client";

  return (
    <div className="space-y-6">
      
      {/* Premium Studio Client Hero Header */}
      <WobblyCard
        variant="default"
        hover={false}
        className="w-full border-3 border-pencil bg-white p-6 sm:p-8 shadow-hard-md relative overflow-hidden"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 bg-marker/10 text-marker text-xs font-bold font-mono px-3 py-1 rounded-full border border-marker/20 font-[family-name:var(--font-kalam-var)]">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> CLIENT PORTAL WORKSPACE
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-pencil tracking-tight font-[family-name:var(--font-kalam-var)]">
              Welcome back, {clientName} 👋
            </h1>
            <p className="text-pencil-light text-sm sm:text-base font-[family-name:var(--font-patrick-var)] font-bold">
              Track project milestones, download shared files, view receipts, and message your design engineer in real time.
            </p>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto pt-2 md:pt-0">
            <Link href="/dashboard/messages" className="flex-1 md:flex-none">
              <WobblyButton variant="marker" className="w-full !py-2 !px-4 text-xs sm:text-sm flex items-center justify-center gap-1.5">
                <MessageSquare className="w-4 h-4" /> Message Studio
              </WobblyButton>
            </Link>
            <Link href="/dashboard/files" className="flex-1 md:flex-none">
              <WobblyButton variant="secondary" className="w-full !py-2 !px-4 text-xs sm:text-sm flex items-center justify-center gap-1.5">
                <FileText className="w-4 h-4" /> File Cabinet
              </WobblyButton>
            </Link>
          </div>
        </div>

        {/* Live Status Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t-2 border-dashed border-pencil/20">
          <div className="p-3 bg-paper/30 border-2 border-pencil rounded-xl text-center">
            <span className="text-[11px] text-pencil-light font-bold block uppercase tracking-wider font-mono">Active Project</span>
            <span className="text-sm sm:text-base font-extrabold text-pencil font-[family-name:var(--font-kalam-var)] truncate block">
              {activeProject?.title || "Custom Project"}
            </span>
          </div>

          <div className="p-3 bg-paper/30 border-2 border-pencil rounded-xl text-center">
            <span className="text-[11px] text-pencil-light font-bold block uppercase tracking-wider font-mono">Current Phase</span>
            <span className="text-sm sm:text-base font-extrabold text-marker font-[family-name:var(--font-kalam-var)] block">
              {activeProject?.status || "Planning"} ({activeProject?.progress_percent || 20}%)
            </span>
          </div>

          <div className="p-3 bg-paper/30 border-2 border-pencil rounded-xl text-center col-span-2 sm:col-span-1">
            <span className="text-[11px] text-pencil-light font-bold block uppercase tracking-wider font-mono">Payment Ledger</span>
            <span className="text-sm sm:text-base font-extrabold text-ballpoint font-[family-name:var(--font-kalam-var)] block">
              {payments.length} Logged Transactions
            </span>
          </div>
        </div>
      </WobblyCard>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Project Tracker Card (2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-pencil font-[family-name:var(--font-kalam-var)] flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-marker" />
              Project Tracker
            </h2>
            <Link href="/dashboard/projects" className="text-xs font-bold font-[family-name:var(--font-kalam-var)] text-ballpoint hover:underline flex items-center gap-1">
              View Milestones <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {activeProject ? (
            <WobblyCard
              variant="default"
              hover={false}
              className="border-3 border-pencil shadow-hard-md bg-white p-6 relative overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                <div>
                  <span className="text-xs text-pencil-light font-bold font-mono uppercase">
                    DEVELOPMENT TRACKER
                  </span>
                  <h3 className="text-2xl font-bold text-pencil mt-0.5 font-[family-name:var(--font-kalam-var)]">
                    {activeProject.title}
                  </h3>
                </div>
                <span className="px-3 py-1 bg-marker/10 border-2 border-pencil text-pencil font-bold text-xs wobbly-sm font-[family-name:var(--font-kalam-var)]">
                  Plan: {activeProject.plan_name || "Custom"}
                </span>
              </div>

              {/* Progress percentage bar */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-pencil font-[family-name:var(--font-kalam-var)]">
                    Phase: <strong className="text-marker">{activeProject.status}</strong>
                  </span>
                  <span className="font-mono font-bold text-pencil">{activeProject.progress_percent}%</span>
                </div>

                <div className="w-full h-4 border-2 border-pencil rounded-full p-0.5 bg-paper">
                  <div 
                    className="h-full bg-marker rounded-full transition-all duration-500"
                    style={{ width: `${activeProject.progress_percent}%` }}
                  />
                </div>
              </div>

              {/* Grid Metadata */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-paper/20 border-2 border-pencil rounded-xl text-xs font-sans">
                <div>
                  <span className="text-pencil-light font-bold block mb-0.5">CURRENT PHASE:</span>
                  <span className="font-bold text-pencil text-sm font-[family-name:var(--font-kalam-var)]">{activeProject.status}</span>
                </div>
                <div>
                  <span className="text-pencil-light font-bold block mb-0.5">ESTIMATED TIMELINE:</span>
                  <span className="font-bold text-pencil text-sm font-[family-name:var(--font-kalam-var)]">{activeProject.timeline || "7-10 Days"}</span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t-2 border-dashed border-pencil/20 flex justify-end">
                <Link href="/dashboard/projects">
                  <WobblyButton className="text-xs !py-1.5 !px-4 flex items-center gap-1.5">
                    View Details & History <ArrowRight className="w-4 h-4" />
                  </WobblyButton>
                </Link>
              </div>
            </WobblyCard>
          ) : (
            <WobblyCard
              variant="default"
              hover={false}
              className="border-3 border-pencil shadow-hard-md bg-white p-8 text-center"
            >
              <Briefcase className="w-10 h-10 text-pencil-lightest mx-auto mb-3" />
              <h3 className="text-xl font-bold text-pencil font-[family-name:var(--font-kalam-var)]">
                No active project tracker initialized
              </h3>
              <p className="text-pencil-light text-sm font-[family-name:var(--font-patrick-var)] font-bold max-w-sm mx-auto mt-1 mb-4">
                Your project tracker will appear here once Vasuu Studio initializes your website build specifications.
              </p>
              <Link href="/dashboard/messages">
                <WobblyButton variant="marker" className="text-xs">
                  Message Design Studio
                </WobblyButton>
              </Link>
            </WobblyCard>
          )}

          {/* Pending Invoices Notice (If any unpaid items) */}
          {payments.filter(p => p.status?.toLowerCase() === "pending").map((pay) => (
            <div key={pay.id} className="p-4 bg-amber-50 border-3 border-pencil rounded-xl text-amber-900 shadow-hard-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-base font-[family-name:var(--font-kalam-var)]">
                    Pending Payment Due: ₹{pay.amount.toLocaleString("en-IN")}
                  </h4>
                  <p className="text-xs text-amber-800 font-[family-name:var(--font-patrick-var)] font-bold">
                    For package: {pay.plan_name}. You can complete this payment securely online.
                  </p>
                </div>
              </div>

              <WobblyButton
                onClick={() => handleDirectPay(pay)}
                disabled={payingId === pay.id}
                variant="ballpoint"
                className="!py-2 !px-4 text-xs shrink-0 cursor-pointer"
              >
                <CreditCard className="w-4 h-4 mr-1.5" />
                {payingId === pay.id ? "Opening..." : `Pay ₹${pay.amount} Online`}
              </WobblyButton>
            </div>
          ))}
        </div>

        {/* Notifications & Quick Info Bar (1 Column) */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-pencil font-[family-name:var(--font-kalam-var)] flex items-center gap-2">
              <Bell className="w-6 h-6 text-marker" />
              Notifications
            </h2>
          </div>

          <WobblyCard
            variant="default"
            hover={false}
            className="border-3 border-pencil bg-white p-4 shadow-hard-md relative"
          >
            {notifications.length > 0 ? (
              <div className="space-y-3">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => !notif.is_read && markNotificationRead(notif.id)}
                    className={`p-3 border-2 border-pencil wobbly-sm text-xs transition-all cursor-pointer ${
                      notif.is_read ? "bg-paper/10 text-pencil-light" : "bg-postit/60 text-pencil font-bold shadow-hard-sm"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold font-[family-name:var(--font-kalam-var)] text-pencil text-sm">
                        {notif.title}
                      </span>
                      {!notif.is_read && (
                        <span className="w-2 h-2 rounded-full bg-marker shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="font-[family-name:var(--font-patrick-var)] text-sm leading-relaxed text-pencil">
                      {notif.content}
                    </p>
                    <span className="text-[10px] text-pencil-lightest font-mono block mt-1.5 text-right">
                      {new Date(notif.created_at).toLocaleDateString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-pencil-lightest">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="font-[family-name:var(--font-patrick-var)] font-bold text-sm">
                  No notifications recorded yet.
                </p>
              </div>
            )}
          </WobblyCard>
        </div>

      </div>

      {/* Payment Success Modal */}
      <PaymentSuccessModal
        isOpen={!!successData}
        onClose={() => setSuccessData(null)}
        data={successData}
        redirectUrl="/dashboard/bookings"
        redirectText="View Booking & Receipt"
      />
    </div>
  );
}
