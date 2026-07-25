"use client";

import { useState, useEffect } from "react";
import { Printer, X, CheckCircle2, ShieldCheck, CreditCard } from "lucide-react";
import { WobblyButton } from "./WobblyButton";
import { supabase } from "@/lib/supabase";

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  clientName: string;
  clientEmail: string;
  clientBusiness?: string;
  planName: string;
  itemDescription?: string;
  amountText: string;
  amountNum: number;
  paymentId: string;
  orderId?: string;
  status: string;
}

interface InvoiceModalProps {
  invoice: InvoiceData | null;
  onClose: () => void;
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

export function InvoiceModal({ invoice, onClose }: InvoiceModalProps) {
  const [paying, setPaying] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<string>("");

  useEffect(() => {
    if (invoice) {
      setCurrentStatus(invoice.status);
    }
  }, [invoice]);

  if (!invoice) return null;

  const isPending = currentStatus?.toLowerCase() === "pending";

  const handlePrint = () => {
    window.print();
  };

  const handlePayOnline = async () => {
    if (!supabase) return;
    setPaying(true);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        throw new Error("Failed to load Razorpay Payment Gateway.");
      }

      // Create Order
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: invoice.amountNum,
          packageName: invoice.planName
        })
      });

      if (!res.ok) throw new Error("Could not initialize Razorpay order.");
      const orderData = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_SyoANIIxpmdHxD",
        amount: orderData.amount,
        currency: "INR",
        name: "Vasuu Design Studio",
        description: `Payment for ${invoice.planName}`,
        order_id: orderData.id,
        handler: async function (response: any) {
          try {
            // Update payment row in database
            if (supabase) {
              await supabase
                .from("payments")
                .update({
                  status: "success",
                  payment_id: response.razorpay_payment_id,
                  order_id: response.razorpay_order_id
                })
                .eq("id", invoice.paymentId);

              // Update booking row
              await supabase
                .from("bookings")
                .update({ payment_status: "Paid" })
                .eq("client_id", invoice.clientEmail);
            }

            setCurrentStatus("SUCCESS");
            alert(`🎉 Payment of ${invoice.amountText} completed successfully!`);
          } catch (err: any) {
            console.error("Payment update error:", err);
            alert("Payment completed! Refresh page to update ledger status.");
          } finally {
            setPaying(false);
          }
        },
        prefill: {
          name: invoice.clientName,
          email: invoice.clientEmail
        },
        theme: {
          color: "#2d5da1"
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      alert("Payment Launch Error: " + err.message);
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="fixed inset-[0] z-[9999] bg-pencil/80 flex items-center justify-center p-4 overflow-y-auto">
      {/* Modal Container */}
      <div className="bg-white border-3 border-pencil shadow-hard-lg rounded-xl max-w-3xl w-full p-6 sm:p-10 relative my-8 text-pencil">
        
        {/* Action Header - Hidden during Print */}
        <div className="print:hidden flex items-center justify-between pb-6 mb-6 border-b-2 border-dashed border-pencil">
          <div className="flex items-center gap-2">
            <span className="bg-marker/10 text-marker px-3 py-1 rounded-full font-bold text-sm border border-marker/20 flex items-center gap-1 font-[family-name:var(--font-kalam-var)]">
              <CheckCircle2 className="w-4 h-4" /> Professional Invoice Preview
            </span>
          </div>
          <div className="flex items-center gap-3">
            {isPending && (
              <button
                onClick={handlePayOnline}
                disabled={paying}
                className="px-4 py-2 bg-ballpoint text-white border-2 border-pencil font-[family-name:var(--font-kalam-var)] font-bold text-sm rounded-lg hover:bg-pencil transition-colors flex items-center gap-1.5 shadow-hard-sm"
              >
                <CreditCard className="w-4 h-4" />
                {paying ? "Opening Razorpay..." : `Pay ${invoice.amountText} Online Now`}
              </button>
            )}
            <WobblyButton onClick={handlePrint} size="sm">
              <Printer className="w-4 h-4 mr-1.5" /> Print / Save PDF
            </WobblyButton>
            <button
              onClick={onClose}
              className="p-2 border-2 border-pencil rounded-lg hover:bg-erased transition-colors"
              title="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ================= Printable Invoice Sheet Start ================= */}
        <div id="printable-invoice" className="p-4 sm:p-6 bg-white font-sans text-slate-800">
          
          {/* Top Brand Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b-2 border-slate-900">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                VASUU DESIGN STUDIO
              </h1>
              <p className="text-sm font-semibold text-slate-600">
                Web Development, UI/UX & Custom Software Engineering
              </p>
              <p className="text-xs font-mono text-slate-500">
                Domain: vasuu.bond | Contact: hello@vasuu.bond
              </p>
            </div>
            <div className="text-left sm:text-right">
              <span className="inline-block bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-wider mb-1">
                INVOICE / RECEIPT
              </span>
              <div className="text-xs font-mono font-bold text-slate-800">
                {invoice.invoiceNumber}
              </div>
              <div className="text-xs text-slate-500 font-mono">
                Date: {invoice.date}
              </div>
            </div>
          </div>

          {/* Client & Billing Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6 p-4 bg-slate-50 border border-slate-300 rounded-lg">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 font-mono">
                Billed To:
              </h3>
              <p className="font-bold text-slate-900 text-base">
                {invoice.clientName}
              </p>
              {invoice.clientBusiness && (
                <p className="text-sm font-semibold text-slate-700">
                  {invoice.clientBusiness}
                </p>
              )}
              <p className="text-xs font-mono text-slate-600">
                {invoice.clientEmail}
              </p>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 font-mono">
                Payment Details:
              </h3>
              <p className="text-xs font-mono text-slate-800">
                Status: <strong className="uppercase text-blue-700 font-bold">{invoice.status}</strong>
              </p>
              <p className="text-xs font-mono text-slate-600">
                Razorpay ID: {invoice.paymentId}
              </p>
              {invoice.orderId && (
                <p className="text-xs font-mono text-slate-600">
                  Order Ref: {invoice.orderId}
                </p>
              )}
            </div>
          </div>

          {/* Line Items Table */}
          <div className="my-6 overflow-x-auto">
            <table className="w-full text-left border-collapse border border-slate-300">
              <thead>
                <tr className="bg-slate-900 text-white text-xs font-mono uppercase">
                  <th className="p-3 border border-slate-400">Service Description</th>
                  <th className="p-3 border border-slate-400 text-center">Qty</th>
                  <th className="p-3 border border-slate-400 text-right">Price</th>
                  <th className="p-3 border border-slate-400 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="text-sm font-sans">
                <tr className="border-b border-slate-300">
                  <td className="p-3 border border-slate-300">
                    <strong className="text-slate-900 block font-bold text-base">
                      {invoice.planName}
                    </strong>
                    {invoice.itemDescription && (
                      <span className="text-xs text-slate-600 block mt-0.5">
                        {invoice.itemDescription}
                      </span>
                    )}
                  </td>
                  <td className="p-3 border border-slate-300 text-center font-mono font-bold">1</td>
                  <td className="p-3 border border-slate-300 text-right font-mono font-bold">
                    {invoice.amountText}
                  </td>
                  <td className="p-3 border border-slate-300 text-right font-mono font-bold text-slate-900">
                    {invoice.amountText}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Calculation Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 my-6">
            <div className="text-xs text-slate-600 max-w-sm space-y-1">
              {isPending ? (
                <div className="p-3 bg-amber-50 border-2 border-amber-300 rounded-lg text-amber-900">
                  <div className="flex items-center gap-1 text-amber-800 font-bold text-sm">
                    ⚠️ Payment Due: {invoice.amountText}
                  </div>
                  <p className="text-[11px] mt-1 text-amber-800">
                    This invoice is unpaid. Click below to pay online securely via Razorpay:
                  </p>
                  <a
                    href="https://vasuu.bond/dashboard/bookings"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      // On web preview, launch Razorpay overlay directly
                      if (typeof window !== "undefined") {
                        e.preventDefault();
                        handlePayOnline();
                      }
                    }}
                    className="mt-2 w-full px-3 py-2 bg-blue-700 text-white text-xs font-bold rounded shadow hover:bg-blue-800 transition-colors flex items-center justify-center gap-1.5 no-underline text-center"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    {paying ? "Opening Razorpay..." : `💳 Click to Pay ${invoice.amountText} Online`}
                  </a>
                  <p className="text-[10px] text-blue-800 font-mono mt-1 text-center font-bold">
                    https://vasuu.bond/dashboard/bookings
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-1 text-blue-700 font-bold">
                    <ShieldCheck className="w-4 h-4" /> Payment Verified & Cleared
                  </div>
                  <p>
                    Thank you for choosing Vasuu Design Studio. This document serves as your official tax invoice and payment receipt.
                  </p>
                </>
              )}
            </div>

            <div className="w-full sm:w-64 space-y-2 border border-slate-300 p-4 rounded-lg bg-slate-50 font-mono text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span>{invoice.amountText}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>GST / Tax:</span>
                <span>₹0.00 (Incl.)</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-slate-900 border-t border-slate-300 pt-2">
                <span>{isPending ? "Total Due:" : "Total Paid:"}</span>
                <span className={isPending ? "text-rose-600 text-base font-black" : "text-blue-700 text-base font-black"}>
                  {invoice.amountText}
                </span>
              </div>
            </div>
          </div>

          {/* Signature & Footer */}
          <div className="pt-8 border-t-2 border-slate-900 flex flex-col sm:flex-row justify-between items-end gap-6 text-xs text-slate-600">
            <div>
              <p className="font-bold text-slate-900">Vasuu Design Studio</p>
              <p className="font-mono text-[11px] text-slate-500">https://vasuu.bond</p>
            </div>
            <div className="text-right">
              <div className="font-sans text-lg font-black text-rose-600 tracking-tight">
                Vasu Dhakar
              </div>
              <div className="border-t border-slate-900 pt-1 mt-1 font-mono text-[10px] uppercase tracking-wider text-slate-700 font-bold">
                Authorized Signature
              </div>
            </div>
          </div>

        </div>
        {/* ================= Printable Invoice Sheet End ================= */}

      </div>

      {/* Global CSS for Print Mode */}
      <style jsx global>{`
        @media print {
          /* Force exact background colors in Chrome/Edge PDF export */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }

          body * {
            visibility: hidden !important;
          }

          #printable-invoice, #printable-invoice * {
            visibility: visible !important;
          }

          #printable-invoice {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            padding: 30px !important;
            margin: 0 !important;
            background: white !important;
            box-shadow: none !important;
            border: none !important;
          }

          @page {
            size: A4 portrait;
            margin: 10mm;
          }
        }
      `}</style>
    </div>
  );
}

