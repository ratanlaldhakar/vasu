"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { WobblyCard } from "@/components/ui/WobblyCard";
import { WobblyButton } from "@/components/ui/WobblyButton";
import { 
  FolderOpen, 
  FileText, 
  Download, 
  Archive, 
  FileImage, 
  FileCheck,
  AlertCircle 
} from "lucide-react";

interface ProjectFile {
  id: string;
  name: string;
  url: string;
  type: string; // Invoice, Receipt, Contract, Design, ZIP
  size_bytes: number;
  created_at: string;
}

export default function ClientFilesPage() {
  const { user } = useAuth();
  
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      if (!supabase || !user) return;
      try {
        const { data, error } = await supabase
          .from("files")
          .select("*")
          .eq("client_id", user.id)
          .order("created_at", { ascending: false });

        if (!error && data) {
          setFiles(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchFiles();
    }
  }, [user]);

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "invoice":
      case "receipt":
        return <FileText className="w-8 h-8 text-marker" />;
      case "contract":
        return <FileCheck className="w-8 h-8 text-ballpoint" />;
      case "design":
        return <FileImage className="w-8 h-8 text-postit" />;
      case "zip":
      case "archive":
        return <Archive className="w-8 h-8 text-pencil" />;
      default:
        return <FileText className="w-8 h-8 text-pencil-light" />;
    }
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  if (loading) {
    return (
      <div className="font-[family-name:var(--font-kalam-var)] text-pencil text-xl text-center py-12">
        ✏️ Reading document catalog...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-pencil font-[family-name:var(--font-kalam-var)] flex items-center gap-2">
          <FolderOpen className="w-8 h-8 text-marker" />
          Files Cabinet 📁
        </h1>
        <p className="text-pencil-light font-[family-name:var(--font-patrick-var)] font-bold text-lg">
          Download invoices, design specs, wireframes, and project ZIP folders.
        </p>
      </div>

      {files.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {files.map((file, idx) => (
            <WobblyCard
              key={file.id}
              variant="default"
              hover={true}
              rotation={idx % 2 === 0 ? 0.3 : -0.3}
              className="border-3 border-pencil shadow-hard-md bg-white p-5 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-14 h-14 wobbly border-3 border-pencil bg-paper flex items-center justify-center flex-shrink-0">
                  {getFileIcon(file.type)}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-pencil truncate text-lg leading-snug">
                    {file.name}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-pencil-lightest font-sans mt-1">
                    <span className="bg-paper border border-pencil/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                      {file.type}
                    </span>
                    <span>{formatBytes(file.size_bytes)}</span>
                  </div>
                </div>
              </div>

              <WobblyButton
                href={file.url}
                download
                target="_blank"
                rel="noopener noreferrer"
                size="sm"
                className="!min-h-[40px] !w-[40px] p-0"
              >
                <Download className="w-4 h-4 text-pencil" />
              </WobblyButton>
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
            No files shared yet
          </h3>
          <p className="text-pencil-light text-base max-w-md mx-auto">
            Design contracts, project assets, and invoice PDFs will appear here for download once they are ready.
          </p>
        </WobblyCard>
      )}
    </div>
  );
}
