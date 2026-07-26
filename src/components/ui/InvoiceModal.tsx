"use client";

import { useState, useEffect } from "react";
import { Printer, X, ShieldCheck, CreditCard, Download, FileText, CheckCircle2, Building2, User, Check } from "lucide-react";
import { WobblyButton } from "./WobblyButton";
import { supabase } from "@/lib/supabase";
import { PaymentSuccessModal, PaymentSuccessData } from "./PaymentSuccessModal";

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
  const [successData, setSuccessData] = useState<PaymentSuccessData | null>(null);

  useEffect(() => {
    if (invoice) {
      setCurrentStatus(invoice.status);
    }
  }, [invoice]);

  if (!invoice) return null;

  const isPending = currentStatus?.toLowerCase() === "pending";

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
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
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || orderData.keyId || "rzp_live_TIDMY6pOJhzbWt",
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
            setSuccessData({
              amount: invoice.amountText,
              planName: invoice.planName,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              clientEmail: invoice.clientEmail
            });
          } catch (err: any) {
            console.error("Payment update error:", err);
            setSuccessData({
              amount: invoice.amountText,
              planName: invoice.planName,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              clientEmail: invoice.clientEmail
            });
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
    <div className="fixed inset-0 z-[99999] bg-pencil/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* Modal Container */}
      <div className="bg-white border-3 border-pencil shadow-hard-lg rounded-2xl max-w-3xl w-full relative my-auto text-pencil flex flex-col max-h-[94vh]">
        
        {/* Sticky Action Header - Hidden during Print */}
        <div className="print:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-md px-4 sm:px-8 py-3 border-b-2 border-dashed border-pencil flex items-center justify-between gap-2 rounded-t-2xl">
          <div className="flex items-center gap-2 min-w-0">
            <span className="bg-marker/10 text-marker px-2.5 py-1 rounded-full font-bold text-xs sm:text-sm border border-marker/20 flex items-center gap-1 font-[family-name:var(--font-kalam-var)] shrink-0">
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Official Invoice Preview
            </span>
            <span className="hidden md:inline-block text-xs font-mono font-bold text-pencil-light truncate">
              {invoice.invoiceNumber}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {isPending && (
              <button
                type="button"
                onClick={handlePayOnline}
                disabled={paying}
                className="px-3 sm:px-4 py-1.5 bg-ballpoint text-white border-2 border-pencil font-[family-name:var(--font-kalam-var)] font-bold text-xs sm:text-sm rounded-lg hover:bg-pencil transition-colors flex items-center gap-1.5 shadow-hard-sm cursor-pointer"
              >
                <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {paying ? "Opening..." : `Pay ${invoice.amountText}`}
              </button>
            )}

            {/* PC Options: Both Print and Download */}
            <div className="hidden md:flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="px-3 py-1.5 bg-postit text-pencil border-2 border-pencil font-[family-name:var(--font-kalam-var)] font-bold text-xs sm:text-sm rounded-lg hover:bg-pencil hover:text-white transition-colors flex items-center gap-1.5 shadow-hard-sm cursor-pointer"
                title="Print Invoice directly"
              >
                <Printer className="w-4 h-4 text-pencil" />
                <span>Print Invoice</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="px-3 py-1.5 bg-emerald-600 text-white border-2 border-pencil font-[family-name:var(--font-kalam-var)] font-bold text-xs sm:text-sm rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-hard-sm cursor-pointer"
                title="Save/Download as PDF"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 border-2 border-pencil rounded-lg bg-white hover:bg-marker hover:text-white transition-colors cursor-pointer"
              title="Close Preview"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Invoice Body */}
        <div className="overflow-y-auto flex-1 p-3 sm:p-6 bg-slate-100">
          
          {/* ================= Printable Real Invoice Sheet Start ================= */}
          <div id="printable-invoice" className="p-6 sm:p-10 bg-white font-sans text-slate-800 border border-slate-300 rounded-xl shadow-lg max-w-2xl mx-auto my-2">
            
            {/* Top Invoice Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b-2 border-slate-900 gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">
                  VASUU DESIGN STUDIO
                </h1>
                <p className="text-xs font-bold text-slate-700 mt-0.5">
                  Web Development, UI/UX Architecture & Software Engineering
                </p>
                <p className="text-xs font-mono text-slate-500 mt-1">
                  Bhilwara, Rajasthan, India • https://vasuu.bond
                </p>
              </div>

              <div className="text-left sm:text-right bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-lg w-full sm:w-auto border sm:border-none border-slate-200">
                <span className="inline-block bg-slate-900 text-white text-xs font-black px-3.5 py-1 rounded uppercase tracking-wider mb-1">
                  INVOICE & RECEIPT
                </span>
                <div className="text-sm font-mono font-bold text-slate-900">
                  Ref: <span className="text-blue-700">{invoice.invoiceNumber}</span>
                </div>
                <div className="text-xs text-slate-600 font-mono mt-0.5">
                  Date: {invoice.date}
                </div>
              </div>
            </div>

            {/* FROM & TO Side-by-Side Professional Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
              
              {/* INVOICE FROM (ISSUER) */}
              <div className="p-4 bg-slate-50 border border-slate-300 rounded-lg">
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5 font-mono flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-700" /> INVOICE FROM:
                </div>
                <p className="font-black text-slate-900 text-base">
                  Vasuu Design Studio
                </p>
                <p className="text-xs font-semibold text-slate-700">
                  Vasudev Dhakar (Lead Developer)
                </p>
                <p className="text-xs font-mono text-slate-600 mt-1">
                  Bhilwara, Rajasthan, India
                </p>
                <p className="text-xs font-mono text-slate-600">
                  hello@vasuu.bond | https://vasuu.bond
                </p>
              </div>

              {/* INVOICE TO (CLIENT) */}
              <div className="p-4 bg-slate-50 border border-slate-300 rounded-lg">
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5 font-mono flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-700" /> INVOICE TO (CLIENT):
                </div>
                <p className="font-black text-slate-900 text-base">
                  {invoice.clientName}
                </p>
                {invoice.clientBusiness && (
                  <p className="text-xs font-bold text-slate-700">
                    {invoice.clientBusiness}
                  </p>
                )}
                <p className="text-xs font-mono text-slate-600 mt-1 break-all">
                  {invoice.clientEmail}
                </p>
              </div>

            </div>

            {/* PAYMENT TRANSACTION DETAILS META BAR */}
            <div className="my-4 p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-xs font-mono flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-slate-600 font-bold">Payment Status:</span>
                <span className={`px-2.5 py-0.5 rounded text-[11px] font-black uppercase border ${
                  isPending ? "bg-amber-100 text-amber-900 border-amber-400" : "bg-emerald-100 text-emerald-900 border-emerald-400"
                }`}>
                  ✓ {invoice.status}
                </span>
              </div>

              <div className="text-slate-700 space-x-3 text-[11px]">
                {invoice.paymentId && (
                  <span>Payment ID: <strong className="text-slate-900">{invoice.paymentId}</strong></span>
                )}
                {invoice.orderId && (
                  <span>Order Ref: <strong className="text-slate-900">{invoice.orderId}</strong></span>
                )}
              </div>
            </div>

            {/* ITEMIZED SERVICE TABLE */}
            <div className="my-6 border border-slate-300 rounded-lg overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white text-xs font-mono uppercase">
                    <th className="p-3 border-b border-slate-400 w-12 text-center">#</th>
                    <th className="p-3 border-b border-slate-400">Service & Deliverable Description</th>
                    <th className="p-3 border-b border-slate-400 text-center w-16">Qty</th>
                    <th className="p-3 border-b border-slate-400 text-right w-28">Amount</th>
                  </tr>
                </thead>
                <tbody className="text-xs sm:text-sm font-sans">
                  <tr className="bg-white">
                    <td className="p-3.5 text-center font-mono font-bold text-slate-500">1</td>
                    <td className="p-3.5">
                      <strong className="text-slate-900 block font-black text-sm sm:text-base">
                        {invoice.planName}
                      </strong>
                      {invoice.itemDescription && (
                        <span className="text-xs text-slate-600 block mt-1 leading-relaxed">
                          {invoice.itemDescription}
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-center font-mono font-bold text-slate-800">1</td>
                    <td className="p-3.5 text-right font-mono font-black text-slate-900 text-base">
                      {invoice.amountText}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* SUMMARY & TOTAL */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 my-6 p-4 bg-slate-50 border border-slate-300 rounded-lg">
              <div className="text-xs text-slate-600">
                {isPending ? (
                  <div className="text-amber-800 font-bold flex items-center gap-1">
                    ⚠️ Payment Outstanding: {invoice.amountText}
                  </div>
                ) : (
                  <div className="text-emerald-800 font-extrabold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> Payment Received & Confirmed
                  </div>
                )}
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Thank you for working with Vasuu Design Studio.
                </p>
              </div>

              <div className="text-right w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
                <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider block">
                  Total Amount Paid
                </span>
                <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                  {invoice.amountText}
                </span>
              </div>
            </div>

            {/* FOOTER & AUTHORIZED SIGNATURE */}
            <div className="pt-6 border-t-2 border-slate-900 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 text-xs text-slate-600">
              <div>
                <p className="font-black text-slate-900 text-sm uppercase tracking-tight">Vasuu Design Studio</p>
                <p className="font-mono text-[11px] text-slate-500">Bhilwara, Rajasthan, India • https://vasuu.bond</p>
              </div>

              <div className="text-left sm:text-right w-full sm:w-auto">
                <div className="font-sans text-xl font-black text-slate-900 tracking-tight">
                  Vasu Dhakar
                </div>
                <div className="border-t border-slate-900 pt-1 mt-1 font-mono text-[10px] uppercase tracking-wider text-slate-700 font-bold">
                  AUTHORIZED SIGNATURE
                </div>
              </div>
            </div>

          </div>
          {/* ================= Printable Real Invoice Sheet End ================= */}

        </div>

        {/* Mobile Action Bar: ONLY Download Option on Mobile */}
        <div className="print:hidden md:hidden border-t-2 border-pencil p-3 bg-white flex items-center justify-between gap-2 rounded-b-2xl shadow-hard-lg">
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 py-2.5 px-4 bg-emerald-600 text-white font-[family-name:var(--font-kalam-var)] font-bold text-sm rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4" /> Download Invoice (PDF)
          </button>

          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 border-2 border-pencil text-pencil font-bold text-sm rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>

      </div>

      {/* Global CSS for Single-Page A4 Print Mode with ZERO bleed-through */}
      <style jsx global>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }

          /* Force body background white and strict height */
          html, body {
            background: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;
            height: 100vh !important;
            max-height: 100vh !important;
            overflow: hidden !important;
            width: 100% !important;
          }

          /* Hide all UI action bars, buttons, headers, and footers */
          .print\\:hidden,
          button,
          header,
          footer,
          nav {
            display: none !important;
          }

          /* Strip all parent div borders, shadows, backgrounds, and pseudo-elements */
          div {
            box-shadow: none !important;
            border: none !important;
            background: transparent !important;
          }

          /* Make ONLY #printable-invoice 100% visible, absolute top 0 left 0 */
          #printable-invoice {
            display: block !important;
            visibility: visible !important;
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            width: 100% !important;
            height: 100% !important;
            z-index: 99999999 !important;
            background: #ffffff !important;
            margin: 0 !important;
            padding: 20px !important;
            box-shadow: none !important;
            border: none !important;
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
          }

          #printable-invoice * {
            visibility: visible !important;
          }

          @page {
            size: A4 portrait;
            margin: 6mm 10mm;
          }
        }
      `}</style>

      {/* Payment Success Modal */}
      <PaymentSuccessModal
        isOpen={!!successData}
        onClose={() => {
          setSuccessData(null);
          onClose();
        }}
        data={successData}
        redirectUrl="/dashboard"
        redirectText="View Client Dashboard"
      />
    </div>
  );
}
