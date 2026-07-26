import React from "react";
import { NextRequest, NextResponse } from "next/server";
import { render } from "@react-email/render";
import InvoiceNoticeEmail from "@/emails/InvoiceNoticeEmail";

export async function POST(req: NextRequest) {
  try {
    const {
      clientName,
      clientEmail,
      planName,
      itemDescription,
      amountText,
      paymentStatus,
      invoiceNumber,
      date,
      paymentId
    } = await req.json();

    if (!clientEmail || !planName) {
      return NextResponse.json(
        { error: "Client email and plan name are required." },
        { status: 400 }
      );
    }

    const isPending = paymentStatus?.toLowerCase() === "pending";

    // 1. Render React Email component to HTML string
    const emailHtml = await render(
      React.createElement(InvoiceNoticeEmail, {
        clientName: clientName || "Valued Client",
        clientEmail: clientEmail,
        planName: planName,
        itemDescription: itemDescription,
        amountText: amountText || "₹5,999",
        paymentStatus: paymentStatus || "Pending",
        invoiceNumber: invoiceNumber || `INV-${Date.now().toString().slice(-6)}`,
        date: date || new Date().toLocaleDateString("en-IN"),
        paymentId: paymentId,
        actionUrl: "https://vasuu.bond/dashboard/bookings"
      })
    );

    console.log(`[Invoice Email Dispatch] Sending to: ${clientEmail} (${paymentStatus}) - ${planName} (${amountText})`);

    // 2. Dispatch via Resend REST API if key is available
    let resendSuccess = false;
    let resendMessage = "";

    if (process.env.RESEND_API_KEY) {
      try {
        const resendRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.RESEND_API_KEY}`
          },
          body: JSON.stringify({
            from: "onboarding@vasuu.bond",
            to: clientEmail,
            subject: isPending 
              ? `💳 Action Required: New Invoice of ${amountText} for ${planName}`
              : `✓ Payment Confirmation & Receipt: ${planName} (${amountText})`,
            html: emailHtml
          })
        });

        if (resendRes.ok) {
          resendSuccess = true;
          resendMessage = "Email sent via Resend API successfully.";
          console.log(`[Resend Success] Email delivered to ${clientEmail}`);
        } else {
          const errBody = await resendRes.json();
          console.error("[Resend API Error]", errBody);
          resendMessage = `Resend API Error: ${JSON.stringify(errBody)}`;
        }
      } catch (err: any) {
        console.error("Resend fetch error:", err);
        resendMessage = err.message;
      }
    } else {
      resendMessage = "RESEND_API_KEY not configured in .env, simulated email dispatch logged to console.";
    }

    return NextResponse.json({
      success: true,
      emailSent: resendSuccess,
      message: resendMessage,
      details: {
        to: clientEmail,
        planName,
        amountText,
        paymentStatus
      }
    });
  } catch (err: any) {
    console.error("Invoice Notification API Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to process invoice email notification." },
      { status: 500 }
    );
  }
}
