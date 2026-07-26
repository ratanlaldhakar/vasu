"use client";

import { useState, useEffect } from "react";
import { Printer, X, CheckCircle2, ShieldCheck, CreditCard, Download, FileText } from "lucide-react";
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
        <div className="print:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-md px-4 sm:px-8 py-3 sm:py-4 border-b-2 border-dashed border-pencil flex items-center justify-between gap-2 rounded-t-2xl">
          <div className="flex items-center gap-2 min-w-0">
            <span className="bg-marker/10 text-marker px-2.5 py-1 rounded-full font-bold text-xs sm:text-sm border border-marker/20 flex items-center gap-1 font-[family-name:var(--font-kalam-var)] shrink-0">
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Invoice Preview
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
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-ballpoint text-white border-2 border-pencil font-[family-name:var(--font-kalam-var)] font-bold text-xs sm:text-sm rounded-lg hover:bg-pencil transition-colors flex items-center gap-1.5 shadow-hard-sm cursor-pointer"
              >
                <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {paying ? "Opening..." : `Pay ${invoice.amountText}`}
              </button>
            )}

            <button
              type="button"
              onClick={handlePrint}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-postit text-pencil border-2 border-pencil font-[family-name:var(--font-kalam-var)] font-bold text-xs sm:text-sm rounded-lg hover:bg-pencil hover:text-white transition-colors flex items-center gap-1.5 shadow-hard-sm cursor-pointer"
              title="Print or Save as PDF"
            >
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 group-hover:text-white" />
              <span className="hidden xs:inline">Save / Print PDF</span>
              <span className="xs:hidden">PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 sm:p-2 border-2 border-pencil rounded-lg bg-white hover:bg-marker hover:text-white transition-colors cursor-pointer"
              title="Close Preview"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Invoice Body */}
        <div className="overflow-y-auto flex-1 p-3 sm:p-6 md:p-8">
          
          {/* ================= Printable Invoice Sheet Start ================= */}
          <div id="printable-invoice" className="p-4 sm:p-8 bg-white font-sans text-slate-800 border sm:border-2 border-slate-200 rounded-xl shadow-sm">
            
            {/* Top Brand Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b-2 border-slate-900">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">
                  VASUU DESIGN STUDIO
                </h1>
                <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-0.5">
                  Web Development, UI/UX & Custom Software Engineering
                </p>
                <p className="text-[11px] sm:text-xs font-mono text-slate-500 mt-1">
                  Domain: <span className="font-bold text-slate-700">vasuu.bond</span> | Contact: <span className="font-bold text-slate-700">hello@vasuu.bond</span>
                </p>
              </div>

              <div className="text-left sm:text-right w-full sm:w-auto bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-lg border sm:border-none border-slate-200">
                <span className="inline-block bg-slate-900 text-white text-[11px] font-extrabold px-2.5 py-1 rounded uppercase tracking-wider mb-1">
                  INVOICE / RECEIPT
                </span>
                <div className="text-xs sm:text-sm font-mono font-bold text-slate-900">
                  {invoice.invoiceNumber}
                </div>
                <div className="text-xs text-slate-500 font-mono mt-0.5">
                  Date: {invoice.date}
                </div>
              </div>
            </div>

            {/* Client & Billing Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 my-6 p-3.5 sm:p-5 bg-slate-50 border border-slate-300 rounded-xl">
              <div>
                <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-1 font-mono">
                  Billed To:
                </h3>
                <p className="font-extrabold text-slate-900 text-base sm:text-lg leading-tight">
                  {invoice.clientName}
                </p>
                {invoice.clientBusiness && (
                  <p className="text-xs sm:text-sm font-bold text-slate-700 mt-0.5">
                    {invoice.clientBusiness}
                  </p>
                )}
                <p className="text-xs font-mono text-slate-600 mt-1 break-all">
                  {invoice.clientEmail}
                </p>
              </div>

              <div className="pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-1 font-mono">
                  Payment Details:
                </h3>
                <div className="text-xs font-mono space-y-1">
                  <p className="text-slate-800 flex items-center gap-1.5">
                    <span>Status:</span> 
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                      isPending ? "bg-amber-100 text-amber-800 border border-amber-300" : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    }`}>
                      {invoice.status}
                    </span>
                  </p>
                  <p className="text-slate-600 break-all">
                    Razorpay ID: <span className="font-bold text-slate-800">{invoice.paymentId}</span>
                  </p>
                  {invoice.orderId && (
                    <p className="text-slate-600 break-all">
                      Order Ref: <span className="font-bold text-slate-800">{invoice.orderId}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="my-6 overflow-x-auto rounded-lg border border-slate-300">
              <table className="w-full text-left border-collapse min-w-[480px]">
                <thead>
                  <tr className="bg-slate-900 text-white text-xs font-mono uppercase">
                    <th className="p-3 border-b border-slate-400">Service Description</th>
                    <th className="p-3 border-b border-slate-400 text-center w-16">Qty</th>
                    <th className="p-3 border-b border-slate-400 text-right w-28">Price</th>
                    <th className="p-3 border-b border-slate-400 text-right w-28">Total</th>
                  </tr>
                </thead>
                <tbody className="text-xs sm:text-sm font-sans">
                  <tr className="border-b border-slate-200 bg-white">
                    <td className="p-3.5">
                      <strong className="text-slate-900 block font-bold text-sm sm:text-base">
                        {invoice.planName}
                      </strong>
                      {invoice.itemDescription && (
                        <span className="text-xs text-slate-600 block mt-1 leading-relaxed">
                          {invoice.itemDescription}
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-center font-mono font-bold text-slate-800">1</td>
                    <td className="p-3.5 text-right font-mono font-bold text-slate-800">
                      {invoice.amountText}
                    </td>
                    <td className="p-3.5 text-right font-mono font-bold text-slate-900 text-sm sm:text-base">
                      {invoice.amountText}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Calculation Summary */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 my-6">
              <div className="text-xs text-slate-600 max-w-sm space-y-1.5 w-full sm:w-auto">
                {isPending ? (
                  <div className="p-3.5 bg-amber-50 border-2 border-amber-300 rounded-xl text-amber-900">
                    <div className="flex items-center gap-1 text-amber-800 font-bold text-sm">
                      ⚠️ Payment Pending: {invoice.amountText}
                    </div>
                    <p className="text-[11px] mt-1 text-amber-800 leading-normal">
                      This invoice is currently unpaid. You can complete the payment securely online via Razorpay:
                    </p>
                    <button
                      type="button"
                      onClick={handlePayOnline}
                      disabled={paying}
                      className="mt-2.5 w-full px-3 py-2 bg-blue-700 text-white text-xs font-bold rounded-lg shadow hover:bg-blue-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      {paying ? "Opening Razorpay..." : `💳 Pay ${invoice.amountText} Online Now`}
                    </button>
                  </div>
                ) : (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-extrabold text-xs sm:text-sm">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" /> Payment Verified & Cleared
                    </div>
                    <p className="text-[11px] sm:text-xs text-emerald-700 mt-1 leading-normal">
                      Thank you for choosing Vasuu Design Studio. This document serves as your official tax invoice and payment receipt.
                    </p>
                  </div>
                )}
              </div>

              <div className="w-full sm:w-64 space-y-2 border border-slate-300 p-4 rounded-xl bg-slate-50 font-mono text-xs shadow-inner">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-bold">{invoice.amountText}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GST / Tax:</span>
                  <span className="font-bold">₹0.00 (Incl.)</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-slate-900 border-t border-slate-300 pt-2">
                  <span>{isPending ? "Total Due:" : "Total Paid:"}</span>
                  <span className={isPending ? "text-rose-600 text-base font-black" : "text-emerald-700 text-base font-black"}>
                    {invoice.amountText}
                  </span>
                </div>
              </div>
            </div>

            {/* Signature & Footer */}
            <div className="pt-6 border-t-2 border-slate-900 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 text-xs text-slate-600">
              <div>
                <p className="font-extrabold text-slate-900 text-sm">Vasuu Design Studio</p>
                <p className="font-mono text-[11px] text-slate-500">https://vasuu.bond</p>
              </div>
              <div className="text-left sm:text-right w-full sm:w-auto pt-2 sm:pt-0">
                <div className="font-sans text-xl font-black text-rose-600 tracking-tight">
                  Vasu Dhakar
                </div>
                <div className="border-t border-slate-900 pt-1 mt-1 font-mono text-[10px] uppercase tracking-wider text-slate-800 font-bold">
                  Authorized Signature
                </div>
              </div>
            </div>

          </div>
          {/* ================= Printable Invoice Sheet End ================= */}

        </div>

        {/* Mobile Fixed Bottom Bar (Visible only on small mobile screens) */}
        <div className="print:hidden sm:hidden border-t-2 border-pencil p-3 bg-white flex items-center justify-between gap-2 rounded-b-2xl shadow-hard-lg">
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 py-2 px-3 bg-emerald-600 text-white font-[family-name:var(--font-kalam-var)] font-bold text-sm rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4" /> Download / Save PDF
          </button>

          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 border-2 border-pencil text-pencil font-bold text-sm rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>

      </div>

      {/* Global CSS for Clean Single-Page Print Mode */}
      <style jsx global>{`
        @media print {
          /* Hide all page layouts, headers, navbars, and sidebars completely */
          html, body {
            background: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;
            height: auto !important;
            overflow: visible !important;
          }

          /* Hide everything in the body by default */
          body > * {
            display: none !important;
          }

          /* Show only the printable invoice component */
          #printable-invoice {
            display: block !important;
            visibility: visible !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 20px !important;
            box-shadow: none !important;
            border: none !important;
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          #printable-invoice * {
            visibility: visible !important;
          }

          /* Force exact A4 Portrait Single Page */
          @page {
            size: A4 portrait;
            margin: 10mm;
          }

          .print\\:hidden {
            display: none !important;
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
