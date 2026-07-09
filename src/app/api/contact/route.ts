import React from "react";
import { NextRequest, NextResponse } from "next/server";
import { createMessage } from "@/lib/db";
import { getEmailHtml } from "@/lib/emailTemplate";
import { render } from "@react-email/render";
import InquiryConfirmation from "@/emails/InquiryConfirmation";

export async function POST(req: NextRequest) {
  try {
    const { 
      name, 
      email, 
      phone, 
      message,
      packageName,
      price,
      brand,
      projectType,
      timeline,
      budget,
      details 
    } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 });
    }

    const savedMessage = await createMessage({ name, email, phone, message });

    console.log(`[Contact Form Submission]
Name: ${name}
Email: ${email}
Phone: ${phone || "Not provided"}
Message: ${message}`);

    // Send email alert to Vasu using Resend REST API
    if (process.env.RESEND_API_KEY) {
      try {
        const html = getEmailHtml({
          name,
          email,
          phone,
          packageName,
          price,
          brand,
          projectType,
          timeline,
          budget,
          details,
          message,
          time: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
        });

        // 1. Send admin notification email
        const emailRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "onboarding@resend.dev",
            to: "ratanlaldhakar0@gmail.com",
            subject: `New Project Inquiry: ${packageName || "Contact"} from ${name}`,
            html: html,
          }),
        });

        if (!emailRes.ok) {
          const errData = await emailRes.json();
          console.error("Resend Admin API error response:", errData);
        } else {
          console.log("Email sent successfully via Resend API!");
        }

        // 2. Render and send customer confirmation email
        const customerHtml = await render(
          React.createElement(InquiryConfirmation, {
            name,
            email,
            phone,
            packageName: packageName || "Contact Inquiry",
            price: price || "Custom Quote",
            date: new Date().toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" }),
            website: "https://vasu.design"
          })
        );

        const customerEmailRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "onboarding@resend.dev",
            to: email, // Sent directly to the customer's email address
            subject: "We've Received Your Inquiry! 🎉",
            html: customerHtml,
          }),
        });

        if (!customerEmailRes.ok) {
          const customerErrData = await customerEmailRes.json();
          console.error("Resend Customer API error response:", customerErrData);
        } else {
          console.log("Confirmation email sent successfully to customer!");
        }

      } catch (emailErr) {
        console.error("Error sending email via Resend:", emailErr);
      }
    }

    return NextResponse.json({ success: true, message: savedMessage });
  } catch (err: any) {
    console.error("API Contact error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
