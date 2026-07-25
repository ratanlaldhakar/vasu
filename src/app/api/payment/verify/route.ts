import React from "react";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createMessage } from "@/lib/db";
import { getEmailHtml } from "@/lib/emailTemplate";
import { render } from "@react-email/render";
import InquiryConfirmation from "@/emails/InquiryConfirmation";
import WelcomePortal from "@/emails/WelcomePortal";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      name,
      email,
      phone,
      brand,
      details,
      packageName,
      price,
    } = body;

    // Validate inputs
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !name ||
      !email
    ) {
      return NextResponse.json(
        { error: "Missing required verification data" },
        { status: 400 }
      );
    }

    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_secret) {
      console.error("Razorpay Key Secret is missing from environment variables.");
      return NextResponse.json(
        { error: "Razorpay server configuration error" },
        { status: 500 }
      );
    }

    // Verify signature
    const hmac = crypto.createHmac("sha256", key_secret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generated_signature = hmac.digest("hex");

    if (generated_signature !== razorpay_signature) {
      console.error("Razorpay payment signature mismatch!");
      return NextResponse.json(
        { error: "Invalid payment signature. Verification failed." },
        { status: 400 }
      );
    }

    // Initialize Supabase Admin client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Supabase Admin configuration is missing in environment variables.");
      return NextResponse.json(
        { error: "Database configuration error on server" },
        { status: 500 }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Check if user already exists in profiles
    const { data: existingProfile } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    let clientId = existingProfile?.id;
    let isNewUser = false;
    let generatedPassword = "";

    if (!clientId) {
      // Generate secure 12 character password
      const generatePassword = () => {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        let pass = "";
        for (let i = 0; i < 12; i++) {
          pass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return pass;
      };
      generatedPassword = generatePassword();
      isNewUser = true;

      // Create new user in Supabase Auth via Admin Panel (confirms email automatically)
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password: generatedPassword,
        email_confirm: true,
        user_metadata: { name, phone }
      });

      if (authError) {
        console.warn("Admin user creation error. Checking if already registered:", authError.message);
        if (authError.message.includes("already registered") || authError.message.includes("already exists")) {
          // Sync issue: User exists in auth but not in profiles. Retrieve the user.
          const { data: userList } = await supabaseAdmin.auth.admin.listUsers();
          const foundUser = userList?.users.find(u => u.email === email);
          if (foundUser) {
            clientId = foundUser.id;
            isNewUser = false;
          } else {
            throw new Error(`Authentication signup conflict: ${authError.message}`);
          }
        } else {
          throw new Error(`Authentication signup failed: ${authError.message}`);
        }
      } else if (authData?.user) {
        clientId = authData.user.id;
      }
    }

    if (!clientId) {
      throw new Error("Could not assign or locate client ID for database logging.");
    }

    // Force sync profile record
    const { error: profileSyncError } = await supabaseAdmin.from("profiles").upsert({
      id: clientId,
      name,
      email,
      phone: phone || null,
      business_name: brand || null,
      updated_at: new Date().toISOString()
    });

    if (profileSyncError) {
      console.error("Public Profile sync error:", profileSyncError);
    }

    // Save fallback contact message into local/supabase messages (Admin compatibility)
    const brandLine = brand ? `Business/Brand: ${brand}\n` : "";
    const detailsLine = details ? `Project Details:\n${details}` : "";
    const message = `Hello Vasu,\n\nI want to build a project with you.\n\nPackage: ${packageName}\nPrice: ${price}\nPayment Status: Paid (Successful)\nPayment ID: ${razorpay_payment_id}\nOrder ID: ${razorpay_order_id}\n${brandLine}${detailsLine}`;

    const savedMessage = await createMessage({
      name,
      email,
      phone,
      message,
    });

    // 2. Create booking record
    const deliveryDays = packageName.toLowerCase() === "starter" ? "7 Days" : packageName.toLowerCase() === "professional" ? "10 Days" : "14 Days";
    const { data: booking, error: bookingErr } = await supabaseAdmin
      .from("bookings")
      .insert({
        client_id: clientId,
        plan_name: packageName,
        price: price,
        payment_status: "Paid",
        project_status: "Planning",
        estimated_delivery: deliveryDays
      })
      .select()
      .single();

    if (bookingErr) {
      console.error("Booking database insert error:", bookingErr);
    }

    // 3. Create projects record
    const { error: projectErr } = await supabaseAdmin
      .from("projects")
      .insert({
        client_id: clientId,
        title: `${packageName} Website Development`,
        description: details || `Website development for ${name}`,
        plan_name: packageName,
        status: "Planning",
        progress_percent: 20,
        timeline: packageName.toLowerCase() === "starter" ? "5-7 Days" : packageName.toLowerCase() === "professional" ? "7-10 Days" : "10-14 Days"
      });

    if (projectErr) {
      console.error("Project database insert error:", projectErr);
    }

    // 4. Create payments record
    const cleanAmount = parseFloat(price.replace(/[^\d.]/g, "")) || 0;
    const { error: paymentErr } = await supabaseAdmin
      .from("payments")
      .insert({
        booking_id: booking?.id || null,
        client_id: clientId,
        amount: cleanAmount,
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id,
        status: "success"
      });

    if (paymentErr) {
      console.error("Payment database insert error:", paymentErr);
    }

    // 5. Create default notification record
    const { error: notifErr } = await supabaseAdmin
      .from("notifications")
      .insert({
        client_id: clientId,
        title: "Payment Received & Booking Confirmed! 🎉",
        content: `Your project is now in the Planning phase. Reference ID: ${razorpay_payment_id}.`
      });

    if (notifErr) {
      console.error("Notification database insert error:", notifErr);
    }

    // 6. Create activity log entry
    await supabaseAdmin
      .from("activity_logs")
      .insert({
        client_id: clientId,
        action: `Booked package ${packageName}`
      });

    console.log(`[Successful Payment & Portal Sync]
Name: ${name}
Email: ${email}
Client ID: ${clientId}
New Account: ${isNewUser}
Payment ID: ${razorpay_payment_id}
Order ID: ${razorpay_order_id}`);

    // Send emails using Resend REST API
    if (process.env.RESEND_API_KEY) {
      try {
        const timeZoneString = "Asia/Kolkata";
        const formattedTime = new Date().toLocaleString("en-IN", { timeZone: timeZoneString });
        const formattedDate = new Date().toLocaleDateString("en-IN", { timeZone: timeZoneString });

        // A. Send Admin Alert Email
        const adminHtml = getEmailHtml({
          name,
          email,
          phone,
          packageName,
          price,
          brand,
          details,
          message,
          time: formattedTime,
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
        });

        const adminEmailRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "onboarding@resend.dev",
            to: "ratanlaldhakar0@gmail.com",
            subject: `🎉 Paid Booking: ${packageName} from ${name}`,
            html: adminHtml,
          }),
        });

        if (!adminEmailRes.ok) {
          const errData = await adminEmailRes.json();
          console.error("Resend Admin Verification Email API error:", errData);
        }

        // B. Send Client Email
        let customerHtml = "";
        let subject = "";

        if (isNewUser) {
          // Send Welcome Portal email containing temporary credentials
          subject = "Welcome to Vasu Client Portal 🚀";
          customerHtml = await render(
            React.createElement(WelcomePortal, {
              name,
              email,
              tempPassword: generatedPassword,
              packageName,
              price,
              website: "https://vasuu.bond" // fallback production domain
            })
          );
        } else {
          // Send standard receipt confirmation email
          subject = "Booking & Payment Confirmed! 🎉";
          customerHtml = await render(
            React.createElement(InquiryConfirmation, {
              name,
              email,
              phone,
              packageName: packageName,
              price: price,
              date: formattedDate,
              website: "https://vasuu.bond",
              paymentId: razorpay_payment_id,
            })
          );
        }

        const customerEmailRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "onboarding@resend.dev",
            to: email,
            subject,
            html: customerHtml,
          }),
        });

        if (!customerEmailRes.ok) {
          const customerErrData = await customerEmailRes.json();
          console.error("Resend Customer Email API error response:", customerErrData);
        } else {
          console.log(`Confirmation email (${isNewUser ? "Welcome" : "Receipt"}) sent successfully to client.`);
        }
      } catch (emailErr) {
        console.error("Error sending notification emails for payment:", emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified, user account prepared, and booking sync completed",
      savedMessageId: savedMessage.id,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      isNewUser,
    });
  } catch (err: any) {
    console.error("API Payment Verify error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error during verification" },
      { status: 500 }
    );
  }
}

