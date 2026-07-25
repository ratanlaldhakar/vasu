"use client";

import { useState, useEffect } from "react";
import { Bell, CheckCircle2, X } from "lucide-react";
import { WobblyButton } from "./WobblyButton";

export function NotificationPrompt() {
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("default");
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      const currentPerm = Notification.permission;
      setPermission(currentPerm);

      // Auto-trigger browser permission prompt if still default
      if (currentPerm === "default") {
        Notification.requestPermission().then((res) => {
          setPermission(res);
          if (res === "granted") {
            new Notification("🔔 Vasuu Studio Push Notifications Active!", {
              body: "Real-time alerts enabled for messages, invoices, and files.",
              icon: "/icon.png",
              requireInteraction: true
            });
          }
        });

        // Fallback trigger on first user click if browser required user gesture
        const handleUserGesture = () => {
          if (Notification.permission === "default") {
            Notification.requestPermission().then((res) => {
              setPermission(res);
              if (res === "granted") {
                new Notification("🔔 Vasuu Studio Push Notifications Active!", {
                  body: "Real-time alerts enabled for messages, invoices, and files.",
                  icon: "/icon.png",
                  requireInteraction: true
                });
              }
            });
          }
          window.removeEventListener("click", handleUserGesture);
        };
        window.addEventListener("click", handleUserGesture);
      }
    } else {
      setPermission("unsupported");
    }
  }, []);

  const requestPermission = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) return;

    try {
      const res = await Notification.requestPermission();
      setPermission(res);
      if (res === "granted") {
        new Notification("🔔 Vasuu Studio Push Notifications Active!", {
          body: "Real-time alerts enabled for messages, invoices, and files.",
          icon: "/icon.png",
          requireInteraction: true
        });
      }
    } catch (err) {
      console.error("Error requesting notification permission:", err);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem("vasu_notif_prompt_dismissed", "true");
  };

  if (permission === "granted" || permission === "unsupported" || permission === "denied" || dismissed) {
    return null;
  }

  return (
    <div className="bg-paper border-b-3 border-pencil px-4 py-3 shadow-hard-sm relative z-40 animate-fade-in text-pencil">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm font-[family-name:var(--font-patrick-var)]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-marker text-white flex items-center justify-center border border-pencil shadow-hard-sm flex-shrink-0">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <strong className="font-[family-name:var(--font-kalam-var)] text-base font-bold text-pencil block">
              Enable Desktop Push Notifications 🔔
            </strong>
            <span className="text-pencil-light text-xs">
              Get instant browser alerts whenever Vasuu Studio replies to messages or shares deliverables.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <WobblyButton size="sm" onClick={requestPermission}>
            <CheckCircle2 className="w-4 h-4 mr-1" /> Enable Alerts
          </WobblyButton>
          <button
            onClick={handleDismiss}
            className="p-1.5 hover:bg-erased border border-pencil rounded-md transition-colors text-pencil-light"
            title="Remind me later"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
