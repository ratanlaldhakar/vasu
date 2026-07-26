"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { WobblyCard } from "@/components/ui/WobblyCard";
import { WobblyButton } from "@/components/ui/WobblyButton";
import { PaymentSuccessModal, PaymentSuccessData } from "@/components/ui/PaymentSuccessModal";
import { Briefcase, Bell, ArrowRight, AlertCircle, CreditCard, Receipt, ShieldCheck } from "lucide-react";
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
      
      // Update local state
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
        ✏️ Reading project ledger...
      </div>
    );
  }

  const activeProject = projects[0];
  const activeBooking = bookings[0];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <WobblyCard
        variant="postit"
        decoration="thumbtack"
        rotation={0.5}
        hover={false}
        tilt={true}
        className="w-full !p-8 border-3 border-pencil shadow-hard-lg relative"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-pencil mb-2 font-[family-name:var(--font-kalam-var)]">
          Hello, {profile?.name || "Client"} 👋
        </h1>
        <p className="text-pencil-light text-lg md:text-xl font-[family-name:var(--font-patrick-var)] font-bold leading-relaxed max-w-2xl">
          Welcome to your private client portal. Here you can monitor project phases, check invoices, download ZIP deliverables, and send messages directly.
        </p>
      </WobblyCard>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Project Tracker Card (Takes 2 Columns on desktop) */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-pencil font-[family-name:var(--font-kalam-var)] flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-marker" />
            Project Tracker
          </h2>

          {activeProject ? (
            <WobblyCard
              variant="default"
              hover={false}
              className="border-3 border-pencil shadow-hard-md bg-white p-6 relative overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
                <div>
                  <span className="text-xs text-pencil-lightest font-[family-name:var(--font-kalam-var)] font-bold">
                    ACTIVE PROJECT
                  </span>
                  <h3 className="text-2xl font-bold text-pencil mt-0.5">
                    {activeProject.title}
                  </h3>
                </div>
                <div className="px-3 py-1 bg-marker/10 border-2 border-pencil text-pencil font-bold text-xs wobbly-sm font-[family-name:var(--font-kalam-var)]">
                  Package: {activeProject.plan_name}
                </div>
              </div>

              {/* Status Timesteps */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-pencil font-[family-name:var(--font-kalam-var)] font-bold mb-1.5 px-0.5">
                  <span>Current Phase: <span className="text-marker">{activeProject.status}</span></span>
                  <span>{activeProject.progress_percent}%</span>
                </div>

                {/* Pencil Wobbly Progress Bar */}
                <div className="w-full h-8 border-3 border-pencil bg-paper wobbly-sm overflow-hidden p-0.5 relative">
                  <div 
                    className="h-full bg-marker border-r-3 border-pencil wobbly-sm transition-all duration-500 ease-out" 
                    style={{ width: `${activeProject.progress_percent}%` }}
                  />
                  {/* Subtle Grid overlay for handdrawn style */}
                  <div className="absolute inset-0 bg-[radial-gradient(#2d2d2d_1px,transparent_1px)] bg-[size:10px_10px] opacity-10 pointer-events-none" />
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 border-2 border-dashed border-pencil/20 bg-paper/30 wobbly-sm text-base">
                <div>
                  <div className="text-xs text-pencil-lightest font-bold uppercase tracking-wider">Status</div>
                  <div className="font-bold text-pencil font-[family-name:var(--font-patrick-var)] text-lg">{activeProject.status}</div>
                </div>
                <div>
                  <div className="text-xs text-pencil-lightest font-bold uppercase tracking-wider">Estimated Timeline</div>
                  <div className="font-bold text-pencil font-[family-name:var(--font-patrick-var)] text-lg">{activeProject.timeline || "7-10 Days"}</div>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <div className="text-xs text-pencil-lightest font-bold uppercase tracking-wider">Payment Status</div>
                  <div className="font-bold text-ballpoint font-[family-name:var(--font-patrick-var)] text-lg">
                    {activeBooking?.payment_status === "Paid" ? "Success (Paid) ✓" : "Pending Invoice"}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <WobblyButton size="sm" href="/dashboard/projects">
                  View Details & History <ArrowRight className="w-4 h-4 ml-1.5" />
                </WobblyButton>
              </div>
            </WobblyCard>
          ) : (
            <WobblyCard
              variant="default"
              hover={false}
              className="border-3 border-pencil shadow-hard-md bg-white p-8 text-center"
            >
              <AlertCircle className="w-12 h-12 text-pencil-lightest mx-auto mb-3" />
              <h3 className="text-xl font-bold text-pencil mb-2 font-[family-name:var(--font-kalam-var)]">
                No active projects found!
              </h3>
              <p className="text-pencil-light text-base max-w-md mx-auto mb-6 leading-relaxed">
                You haven&apos;t ordered any pricing packages yet. Explore my pricing plans and request a development slot to get started.
              </p>
              <WobblyButton href="/#pricing">
                Browse Plans & Book →
              </WobblyButton>
            </WobblyCard>
          )}
        </div>

        {/* Sidebar Widgets (Notifications log, Account Info) */}
        <div className="space-y-8">
          
          {/* Notifications Centre */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-pencil font-[family-name:var(--font-kalam-var)] flex items-center gap-2">
              <Bell className="w-5 h-5 text-marker" />
              Recent Logs
            </h2>

            <WobblyCard
              variant="default"
              hover={false}
              className="border-3 border-pencil shadow-hard-md bg-white p-5 space-y-4"
            >
              {notifications.length > 0 ? (
                <div className="space-y-3.5 max-h-[280px] overflow-y-auto pr-1">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id}
                      onClick={() => markNotificationRead(notif.id)}
                      className={`p-3 border-2 wobbly-sm transition-all duration-150 cursor-pointer ${
                        notif.is_read 
                          ? "border-pencil/10 bg-transparent opacity-60" 
                          : "border-pencil/30 bg-postit hover:bg-postit/80"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-1">
                        <span className="font-bold text-pencil text-sm font-[family-name:var(--font-kalam-var)]">
                          {notif.title}
                        </span>
                        {!notif.is_read && (
                          <span className="w-2 h-2 rounded-full bg-marker flex-shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-pencil-muted text-xs font-[family-name:var(--font-patrick-var)] font-bold mt-1 leading-normal">
                        {notif.content}
                      </p>
                      <div className="text-[10px] text-pencil-lightest text-right mt-1.5 font-sans">
                        {new Date(notif.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short"
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-pencil-light text-center text-sm font-[family-name:var(--font-patrick-var)] py-6">
                  No notifications recorded yet.
                </p>
              )}
            </WobblyCard>
          </div>

          {/* Invoices & Billing Summary Widget */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-pencil font-[family-name:var(--font-kalam-var)] flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-marker" />
              Invoices & Billing Center
            </h2>

            <WobblyCard
              variant="default"
              hover={false}
              className="border-3 border-pencil shadow-hard-md bg-white p-5 space-y-4 text-sm"
            >
              {(() => {
                const pendingPay = payments.find(p => p.status?.toLowerCase() === "pending");
                if (pendingPay) {
                  return (
                    <div className="p-4 bg-amber-50 border-2 border-amber-300 wobbly-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-900 font-[family-name:var(--font-kalam-var)] text-base">
                          ⚠️ Pending Invoice
                        </span>
                        <span className="text-sm font-bold text-marker font-mono">
                          ₹{pendingPay.amount?.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <p className="text-xs text-amber-800 font-[family-name:var(--font-patrick-var)] font-bold">
                        Unpaid charge for <strong className="text-pencil">{pendingPay.plan_name}</strong>.
                      </p>
                      <WobblyButton
                        size="sm"
                        variant="marker"
                        onClick={() => handleDirectPay(pendingPay)}
                        disabled={payingId === pendingPay.id}
                        className="w-full"
                      >
                        <CreditCard className="w-4 h-4 mr-1.5" />
                        {payingId === pendingPay.id ? "Opening..." : `Pay ₹${pendingPay.amount?.toLocaleString("en-IN")} Online Now`}
                      </WobblyButton>
                    </div>
                  );
                }

                return (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-ballpoint font-bold font-[family-name:var(--font-kalam-var)] text-base">
                      <ShieldCheck className="w-5 h-5" />
                      All Invoices Paid (Cleared)
                    </div>
                    <p className="text-xs text-pencil-light font-[family-name:var(--font-patrick-var)] font-bold">
                      You have 0 pending invoices. You can inspect your transaction ledger and print tax receipts anytime.
                    </p>
                    <WobblyButton size="sm" variant="ghost" href="/dashboard/bookings" className="w-full">
                      <Receipt className="w-4 h-4 mr-1.5" />
                      View Invoices & Receipts →
                    </WobblyButton>
                  </div>
                );
              })()}
            </WobblyCard>
          </div>

        </div>
      </div>

      {/* Payment Success Modal */}
      <PaymentSuccessModal
        isOpen={!!successData}
        onClose={() => setSuccessData(null)}
        data={successData}
        redirectUrl="/dashboard/bookings"
        redirectText="View Invoices & Bookings"
      />
    </div>
  );
}
