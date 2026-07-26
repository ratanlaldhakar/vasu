"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { WobblyCard } from "@/components/ui/WobblyCard";
import { WobblyButton } from "@/components/ui/WobblyButton";
import { CreditCard, Calendar, FileText, AlertCircle, Download } from "lucide-react";
import { InvoiceModal, InvoiceData } from "@/components/ui/InvoiceModal";
import { PaymentSuccessModal, PaymentSuccessData } from "@/components/ui/PaymentSuccessModal";

interface PaymentRecord {
  id: string;
  amount: number;
  payment_id: string;
  order_id: string;
  status: string;
  created_at: string;
  booking_id: {
    plan_name: string;
  } | null;
  plan_name?: string;
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

export default function BookingsAndInvoicesPage() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeInvoice, setActiveInvoice] = useState<InvoiceData | null>(null);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<PaymentSuccessData | null>(null);

  const fetchBillingData = async () => {
    if (!supabase || !user) return;
    try {
      const { data, error } = await supabase
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
        .eq("client_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        // Format records to extract plan name from the joined bookings
        const formatted = (data as any[]).map(pay => ({
          id: pay.id,
          amount: pay.amount,
          payment_id: pay.payment_id,
          order_id: pay.order_id,
          status: pay.status,
          created_at: pay.created_at,
          plan_name: pay.bookings?.plan_name || "Development Service",
          booking_id: null
        }));
        setPayments(formatted);
      }
    } catch (err) {
      console.error("Error fetching payments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBillingData();
  }, [user]);

  const handleDirectPay = async (pay: PaymentRecord) => {
    if (!supabase || !user) return;
    setPayingId(pay.id);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error("Failed to load Razorpay Payment Gateway.");

      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: pay.amount,
          packageName: pay.plan_name || "Service Charge"
        })
      });

      if (!res.ok) throw new Error("Could not initialize Razorpay order.");
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
            fetchBillingData();
          } catch (err: any) {
            console.error("Payment error:", err);
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

  if (loading) {
    return (
      <div className="font-[family-name:var(--font-kalam-var)] text-pencil text-xl text-center py-12">
        ✏️ Reading transaction logs...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-pencil font-[family-name:var(--font-kalam-var)] flex items-center gap-2">
          <CreditCard className="w-8 h-8 text-marker" />
          Bookings & Invoices 🧾
        </h1>
        <p className="text-pencil-light font-[family-name:var(--font-patrick-var)] font-bold text-lg">
          View transaction details, Razorpay billing reference IDs, and print mock receipts.
        </p>
      </div>

      {payments.length > 0 ? (
        <div className="space-y-6">
          {payments.map((pay, idx) => (
            <WobblyCard
              key={pay.id}
              variant="default"
              hover={false}
              rotation={idx % 2 === 0 ? -0.3 : 0.3}
              className="border-3 border-pencil shadow-hard-md bg-white p-6 relative"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-dashed border-pencil/20 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 wobbly border-3 border-pencil bg-marker/10 flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-5 h-5 text-pencil" />
                  </div>
                  <div>
                    <h3 className="font-bold text-pencil text-lg leading-tight">
                      Booking for {pay.plan_name}
                    </h3>
                    <span className="text-xs text-pencil-lightest flex items-center gap-1 mt-1 font-sans">
                      <Calendar className="w-3.5 h-3.5" />
                      Paid: {new Date(pay.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                      })}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-marker font-[family-name:var(--font-kalam-var)]">
                    ₹{pay.amount.toLocaleString("en-IN")}
                  </div>
                  <span className={`text-[11px] uppercase tracking-wider font-bold ${
                    pay.status?.toLowerCase() === "pending" ? "text-marker" : "text-ballpoint"
                  }`}>
                    Payment Status: {pay.status?.toLowerCase() === "pending" ? "PENDING (UNPAID) ⚠️" : "Success ✓"}
                  </span>
                </div>
              </div>

              {/* Transaction details list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-sans pt-2 mb-4 text-pencil-muted bg-paper/20 p-3.5 wobbly-sm border border-pencil/20">
                <div>
                  <strong>Razorpay Payment ID:</strong>{" "}
                  <code className="text-pencil text-xs font-mono select-all bg-white border px-1.5 py-0.5 rounded">
                    {pay.payment_id}
                  </code>
                </div>
                <div>
                  <strong>Razorpay Order ID:</strong>{" "}
                  <code className="text-pencil text-xs font-mono select-all bg-white border px-1.5 py-0.5 rounded">
                    {pay.order_id || "N/A"}
                  </code>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-end gap-3 pt-2">
                {pay.status?.toLowerCase() === "pending" ? (
                  <>
                    <WobblyButton
                      size="sm"
                      variant="marker"
                      onClick={() => handleDirectPay(pay)}
                      disabled={payingId === pay.id}
                    >
                      <CreditCard className="w-4 h-4 mr-1.5" />
                      {payingId === pay.id ? "Opening..." : `Pay ₹${pay.amount?.toLocaleString("en-IN")} Online Now`}
                    </WobblyButton>
                    <WobblyButton
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        setActiveInvoice({
                          invoiceNumber: `INV-${pay.id.substring(0, 8).toUpperCase()}`,
                          date: new Date(pay.created_at).toLocaleDateString("en-IN"),
                          clientName: user?.user_metadata?.name || user?.email || "Valued Client",
                          clientEmail: user?.email || "",
                          clientBusiness: user?.user_metadata?.business_name,
                          planName: pay.plan_name || "Development Service",
                          amountText: `₹${pay.amount?.toLocaleString("en-IN") || "5,999"}`,
                          amountNum: pay.amount || 5999,
                          paymentId: pay.payment_id,
                          orderId: pay.order_id,
                          status: "PENDING"
                        })
                      }
                    >
                      <FileText className="w-4 h-4 mr-1.5" />
                      View Unpaid Invoice
                    </WobblyButton>
                  </>
                ) : (
                  <>
                    <WobblyButton
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        setActiveInvoice({
                          invoiceNumber: `INV-${pay.id.substring(0, 8).toUpperCase()}`,
                          date: new Date(pay.created_at).toLocaleDateString("en-IN"),
                          clientName: user?.user_metadata?.name || user?.email || "Valued Client",
                          clientEmail: user?.email || "",
                          clientBusiness: user?.user_metadata?.business_name,
                          planName: pay.plan_name || "Development Service",
                          amountText: `₹${pay.amount?.toLocaleString("en-IN") || "5,999"}`,
                          amountNum: pay.amount || 5999,
                          paymentId: pay.payment_id,
                          orderId: pay.order_id,
                          status: "SUCCESS"
                        })
                      }
                    >
                      <FileText className="w-4 h-4 mr-1.5" />
                      View Invoice
                    </WobblyButton>
                    <WobblyButton
                      size="sm"
                      onClick={() =>
                        setActiveInvoice({
                          invoiceNumber: `REC-${pay.id.substring(0, 8).toUpperCase()}`,
                          date: new Date(pay.created_at).toLocaleDateString("en-IN"),
                          clientName: user?.user_metadata?.name || user?.email || "Valued Client",
                          clientEmail: user?.email || "",
                          clientBusiness: user?.user_metadata?.business_name,
                          planName: pay.plan_name || "Development Service",
                          amountText: `₹${pay.amount?.toLocaleString("en-IN") || "5,999"}`,
                          amountNum: pay.amount || 5999,
                          paymentId: pay.payment_id,
                          orderId: pay.order_id,
                          status: "SUCCESS"
                        })
                      }
                    >
                      <Download className="w-4 h-4 mr-1.5" />
                      Download Receipt
                    </WobblyButton>
                  </>
                )}
              </div>
            </WobblyCard>
          ))}

          {/* Professional Invoice Modal */}
          <InvoiceModal
            invoice={activeInvoice}
            onClose={() => setActiveInvoice(null)}
          />
        </div>
      ) : (
        <WobblyCard
          variant="default"
          hover={false}
          className="border-3 border-pencil shadow-hard-md bg-white p-8 text-center"
        >
          <AlertCircle className="w-12 h-12 text-pencil-lightest mx-auto mb-3" />
          <h3 className="text-xl font-bold text-pencil mb-2 font-[family-name:var(--font-kalam-var)]">
            No transaction records found
          </h3>
          <p className="text-pencil-light text-base max-w-md mx-auto mb-6">
            You do not have any paid bookings or invoice logs. Purchase a pricing package on the home page to start.
          </p>
          <WobblyButton href="/#pricing">
            Browse Plans & Book →
          </WobblyButton>
        </WobblyCard>
      )}

      {/* Payment Success Modal */}
      <PaymentSuccessModal
        isOpen={!!successData}
        onClose={() => setSuccessData(null)}
        data={successData}
        redirectUrl="/dashboard"
        redirectText="Return to Dashboard"
      />
    </div>
  );
}
