import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clientId, messageText } = body;

    if (!clientId || !messageText) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: "Database configuration error" },
        { status: 500 }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Fetch client profile details
    const { data: profile, error: profileErr } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", clientId)
      .single();

    if (profileErr || !profile) {
      return NextResponse.json(
        { error: "Client profile not found" },
        { status: 404 }
      );
    }

    // 2. Insert message into Supabase
    const { data: messageData, error: msgErr } = await supabaseAdmin
      .from("messages")
      .insert({
        client_id: clientId,
        sender_id: clientId,
        message: messageText,
        is_from_admin: false
      })
      .select()
      .single();

    if (msgErr) {
      console.error("Message insert error:", msgErr);
      return NextResponse.json(
        { error: "Failed to store message in database" },
        { status: 500 }
      );
    }

    // 3. Send email to Vasu (Admin) via Resend
    if (process.env.RESEND_API_KEY) {
      try {
        const timeZoneString = "Asia/Kolkata";
        const formattedTime = new Date().toLocaleString("en-IN", { timeZone: timeZoneString });

        const emailHtml = `
          <!DOCTYPE html>
          <html>
          <body style="font-family: sans-serif; background-color: #050505; color: #ededed; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #0b0b0c; border: 1px solid #1f1f23; border-radius: 16px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
              <h2 style="color: #ff4d4d; border-bottom: 2px solid #2d2d34; padding-bottom: 10px; margin-top: 0;">💬 New Client Portal Message</h2>
              <p>You received a new message from a client in the portal.</p>
              
              <div style="background-color: #121215; border-radius: 8px; padding: 15px; margin: 20px 0;">
                <strong>Client:</strong> ${profile.name}<br/>
                <strong>Email:</strong> <a href="mailto:${profile.email}" style="color: #2d5da1; text-decoration: none;">${profile.email}</a><br/>
                <strong>Phone:</strong> ${profile.phone || "Not provided"}<br/>
                <strong>Time:</strong> ${formattedTime}
              </div>

              <div style="background-color: #1a1a1e; border-left: 4px solid #ff4d4d; padding: 15px; border-radius: 0 8px 8px 0; font-style: italic; margin-bottom: 25px;">
                "${messageText.replace(/\n/g, "<br/>")}"
              </div>

              <a href="mailto:${profile.email}?subject=Re: Message from Vasu Client Portal" style="display: inline-block; background-color: #ff4d4d; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
                Reply Directly via Email
              </a>
            </div>
          </body>
          </html>
        `;

        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "onboarding@resend.dev",
            to: "ratanlaldhakar0@gmail.com",
            subject: `💬 Portal Message from ${profile.name}`,
            html: emailHtml,
          }),
        });

      } catch (err) {
        console.error("Resend messaging alert failure:", err);
      }
    }

    return NextResponse.json({
      success: true,
      message: messageData
    });
  } catch (err: any) {
    console.error("API Send Message error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
