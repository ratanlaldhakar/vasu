"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Bell, X } from "lucide-react";

interface ToastNotif {
  id: string;
  title: string;
  content: string;
}

export function NotificationListener() {
  const { user } = useAuth();
  const [activeToast, setActiveToast] = useState<ToastNotif | null>(null);
  const lastSeenIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!supabase || !user) return;

    // Check for recent unread notifications periodically
    const checkNewNotifications = async () => {
      if (!supabase || !user) return;
      try {
        const { data, error } = await supabase
          .from("notifications")
          .select("id, title, content, created_at")
          .eq("client_id", user.id)
          .eq("is_read", false)
          .order("created_at", { ascending: false })
          .limit(1);

        if (!error && data && data.length > 0) {
          const latest = data[0];
          // If this is a new notification we haven't popped up yet
          if (latest.id !== lastSeenIdRef.current) {
            lastSeenIdRef.current = latest.id;
            setActiveToast({
              id: latest.id,
              title: latest.title,
              content: latest.content
            });

            // Trigger Browser Native OS Notification if permission granted
            if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
              new Notification(latest.title, {
                body: latest.content,
                icon: "/icon.png",
                tag: latest.id,
                requireInteraction: true,
              });
            }
          }
        }
      } catch (err) {
        // silent sync
      }
    };

    // Initial check
    checkNewNotifications();

    // Poll every 6 seconds for live updates
    const interval = setInterval(checkNewNotifications, 6000);
    return () => clearInterval(interval);
  }, [user]);

  if (!activeToast) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[9999] max-w-sm w-full bg-white border-3 border-pencil shadow-hard-lg rounded-xl p-4 animate-slide-up text-pencil font-[family-name:var(--font-patrick-var)]">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 text-marker font-[family-name:var(--font-kalam-var)] font-bold text-base">
          <Bell className="w-5 h-5" />
          {activeToast.title}
        </div>
        <button
          onClick={() => setActiveToast(null)}
          className="p-1 hover:bg-erased border border-pencil rounded-md transition-colors"
        >
          <X className="w-4 h-4 text-pencil-light" />
        </button>
      </div>

      <p className="text-pencil-light text-sm mt-1.5 leading-snug">
        {activeToast.content}
      </p>

      <div className="mt-3 flex justify-end">
        <button
          onClick={async () => {
            setActiveToast(null);
            if (supabase && activeToast) {
              await supabase
                .from("notifications")
                .update({ is_read: true })
                .eq("id", activeToast.id);
            }
          }}
          className="text-xs font-bold text-ballpoint underline hover:text-pencil font-[family-name:var(--font-kalam-var)]"
        >
          Dismiss & Mark as Read
        </button>
      </div>
    </div>
  );
}
