"use client";

import React from "react";
import { WobblyButton } from "./WobblyButton";
import { CheckCircle2, ShieldCheck, Download, ExternalLink, Sparkles, Receipt, X } from "lucide-react";

export interface PaymentSuccessData {
  amount: string | number;
  planName?: string;
  paymentId?: string;
  orderId?: string;
  clientEmail?: string;
  date?: string;
}

interface PaymentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PaymentSuccessData | null;
  redirectUrl?: string;
  redirectText?: string;
}

export function PaymentSuccessModal({
  isOpen,
  onClose,
  data,
  redirectUrl = "/dashboard",
  redirectText = "Go to Client Portal"
}: PaymentSuccessModalProps) {
  if (!isOpen || !data) return null;

  const formattedAmount =
    typeof data.amount === "number"
      ? `₹${data.amount.toLocaleString("en-IN")}`
      : data.amount.startsWith("₹")
      ? data.amount
      : `₹${data.amount}`;

  const transactionDate = data.date || new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 overflow-y-auto animate-fade-in bg-pencil/80 backdrop-blur-sm">
      {/* Background celebration glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <div className="w-[500px] h-[500px] bg-emerald-400/20 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Main Modal Box */}
      <div className="relative w-full max-w-lg bg-paper bg-[radial-gradient(#e5e0d8_1.5px,transparent_1.5px)] bg-[size:24px_24px] border-3 border-pencil shadow-hard-lg p-6 sm:p-8 text-pencil wobbly tape my-8">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 wobbly border-2 border-pencil bg-white hover:bg-marker hover:text-white flex items-center justify-center font-bold transition-all duration-150 shadow-hard-sm cursor-pointer z-10"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon with Confetti Animation */}
        <div className="relative text-center mb-6 pt-2">
          <div className="relative inline-flex items-center justify-center">
            {/* Pulsing ring */}
            <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-75" />
            
            {/* Main Badge */}
            <div className="relative w-20 h-20 wobbly border-3 border-pencil bg-emerald-500 text-white flex items-center justify-center shadow-hard-md transform hover:rotate-3 transition-transform">
              <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
            </div>

            {/* Sparkle decorative icons */}
            <Sparkles className="absolute -top-2 -right-3 w-7 h-7 text-amber-500 animate-bounce" />
            <Sparkles className="absolute -bottom-1 -left-3 w-6 h-6 text-emerald-600 animate-pulse" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-pencil mt-4 font-[family-name:var(--font-kalam-var)] tracking-wide">
            🎉 Payment Successful!
          </h2>
          <p className="text-pencil-light text-sm sm:text-base mt-1 font-[family-name:var(--font-kalam-var)]">
            Your transaction has been verified and confirmed.
          </p>
        </div>

        {/* Receipt Container */}
        <div className="wobbly bg-white border-2 border-pencil p-4 sm:p-5 shadow-hard-sm mb-6 relative overflow-hidden">
          {/* Top Tape decoration */}
          <div className="flex items-center justify-between border-b-2 border-dashed border-pencil/30 pb-3 mb-3">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-pencil-light font-[family-name:var(--font-kalam-var)]">
              <Receipt className="w-4 h-4 text-emerald-600" /> Payment Summary
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-400 px-2.5 py-0.5 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified
            </span>
          </div>

          {/* Large Amount Display */}
          <div className="text-center py-2 bg-postit/40 border border-pencil/20 rounded-lg mb-4">
            <span className="text-xs uppercase tracking-wider font-bold text-pencil-light block font-[family-name:var(--font-kalam-var)]">
              Total Amount Paid
            </span>
            <span className="text-3xl sm:text-4xl font-extrabold text-pencil tracking-tight font-[family-name:var(--font-kalam-var)]">
              {formattedAmount}
            </span>
          </div>

          {/* Details Table */}
          <div className="space-y-2 text-xs sm:text-sm font-[family-name:var(--font-kalam-var)]">
            {data.planName && (
              <div className="flex justify-between items-center border-b border-pencil/10 pb-1.5">
                <span className="text-pencil-light font-bold">Package / Item:</span>
                <span className="font-extrabold text-pencil">{data.planName}</span>
              </div>
            )}
            
            {data.paymentId && (
              <div className="flex justify-between items-center border-b border-pencil/10 pb-1.5">
                <span className="text-pencil-light font-bold">Razorpay ID:</span>
                <span className="font-mono text-xs font-bold text-pencil bg-gray-100 px-1.5 py-0.5 rounded border border-gray-300 select-all">
                  {data.paymentId}
                </span>
              </div>
            )}

            {data.orderId && (
              <div className="flex justify-between items-center border-b border-pencil/10 pb-1.5">
                <span className="text-pencil-light font-bold">Order ID:</span>
                <span className="font-mono text-xs font-bold text-pencil-light select-all">
                  {data.orderId}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center pt-0.5">
              <span className="text-pencil-light font-bold">Date & Time:</span>
              <span className="text-pencil text-xs font-medium">{transactionDate}</span>
            </div>
          </div>
        </div>

        {/* Email Notification Note */}
        <div className="p-3 bg-amber-50 border-2 border-amber-300 text-amber-900 rounded-xl text-xs sm:text-sm font-[family-name:var(--font-kalam-var)] mb-6 flex items-start gap-2.5">
          <span className="text-base leading-none">📬</span>
          <div>
            <strong className="block font-bold">Confirmation Email Sent!</strong>
            A receipt with your payment details has been dispatched to your email address.
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {redirectUrl && (
            <WobblyButton
              href={redirectUrl}
              onClick={onClose}
              variant="marker"
              className="flex-1 w-full justify-center text-base"
            >
              {redirectText} <ExternalLink className="w-4 h-4 ml-1.5 inline" />
            </WobblyButton>
          )}

          <WobblyButton
            onClick={handlePrint}
            variant="secondary"
            className="w-full sm:w-auto justify-center text-sm"
          >
            <Download className="w-4 h-4 mr-1.5 inline" /> Print Receipt
          </WobblyButton>
        </div>

        <div className="mt-3 text-center">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold text-pencil-light hover:text-pencil underline cursor-pointer font-[family-name:var(--font-kalam-var)]"
          >
            Close Dialog
          </button>
        </div>
      </div>
    </div>
  );
}
