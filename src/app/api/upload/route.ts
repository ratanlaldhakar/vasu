import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const uploadedUrls: string[] = [];

    // Ensure public/uploads folder exists locally as fail-safe fallback
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const fileName = `${Date.now()}_${cleanFileName}`;

      let filePublicUrl = "";

      // 1. Try uploading to Supabase Storage
      try {
        const { data, error } = await supabaseAdmin.storage
          .from("deliverables")
          .upload(`portfolio/${fileName}`, buffer, {
            contentType: file.type || "image/png",
            upsert: true,
          });

        if (!error && data) {
          const { data: publicUrlData } = supabaseAdmin.storage
            .from("deliverables")
            .getPublicUrl(`portfolio/${fileName}`);
          filePublicUrl = publicUrlData.publicUrl;
        } else {
          console.warn("Supabase storage bucket error, falling back to local storage:", error?.message);
        }
      } catch (err) {
        console.warn("Supabase upload exception:", err);
      }

      // 2. Save locally in public/uploads if Supabase storage url is not returned
      if (!filePublicUrl) {
        const filePath = path.join(uploadsDir, fileName);
        fs.writeFileSync(filePath, buffer);
        filePublicUrl = `/uploads/${fileName}`;
      }

      uploadedUrls.push(filePublicUrl);
    }

    return NextResponse.json({ urls: uploadedUrls, success: true });
  } catch (error: any) {
    console.error("Upload API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to upload files" }, { status: 500 });
  }
}
