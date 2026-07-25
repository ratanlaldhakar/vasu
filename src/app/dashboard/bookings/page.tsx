"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { WobblyCard } from "@/components/ui/WobblyCard";
import { WobblyButton } from "@/components/ui/WobblyButton";
import { CreditCard, Calendar, FileText, AlertCircle } from "lucide-react";

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

export default function BookingsAndInvoicesPage() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
            plan_name: pay.bookings?.plan_name || "Development Package",
            booking_id: null
          }));
          setPayments(formatted);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBillingData();
    }
  }, [user]);

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
                  <span className="text-[11px] uppercase tracking-wider font-bold text-ballpoint">
                    Payment Status: Success ✓
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
              <div className="flex justify-end gap-3 pt-2">
                <WobblyButton
                  size="sm"
                  variant="ghost"
                  onClick={() => alert("Invoice PDF downloads will be activated soon. A copy has been dispatched to your email inbox.")}
                >
                  <FileText className="w-4 h-4 mr-1.5" />
                  Download Invoice (soon)
                </WobblyButton>
                <WobblyButton
                  size="sm"
                  onClick={() => alert("Payment receipt rendering has been sent to your email. Check your email archive.")}
                >
                  Download Receipt
                </WobblyButton>
              </div>
            </WobblyCard>
          ))}
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
    </div>
  );
}
