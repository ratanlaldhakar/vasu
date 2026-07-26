"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { WobblyCard } from "@/components/ui/WobblyCard";
import { WobblyButton } from "@/components/ui/WobblyButton";
import { Send, User, MessageSquare, ShieldCheck, Sparkles } from "lucide-react";

interface Message {
  id: string;
  client_id: string;
  sender_id: string;
  message: string;
  is_from_admin: boolean;
  created_at: string;
}

export default function ClientMessagesPage() {
  const { user } = useAuth();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    if (!supabase || !user) return;
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("client_id", user.id)
        .order("created_at", { ascending: true });

      if (!error && data) {
        setMessages(data);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMessages();
    }
  }, [user]);

  // Scroll inner chat container to bottom whenever messages update
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || sending) return;

    setSending(true);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientId: user.id,
          messageText: newMessage.trim(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.message) {
          setMessages(prev => [...prev, data.message]);
          setNewMessage("");
        }
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch (err) {
      console.error("Messaging send error:", err);
      alert("An error occurred sending your message.");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  if (loading) {
    return (
      <div className="font-[family-name:var(--font-kalam-var)] text-pencil text-xl text-center py-12">
        ✏️ Loading conversation logs...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-175px)] sm:h-[calc(100vh-140px)]">
      
      {/* Full-Height Professional Chat Card */}
      <div className="bg-white border-3 border-pencil shadow-hard-lg rounded-2xl flex flex-col h-full overflow-hidden relative">
        
        {/* Chat Header Bar */}
        <div className="px-4 py-3 bg-paper border-b-2 border-pencil flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-9 h-9 wobbly border-2 border-pencil bg-marker text-white flex items-center justify-center font-bold text-sm">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="w-3 h-3 bg-emerald-500 border-2 border-white rounded-full absolute -bottom-0.5 -right-0.5" />
            </div>

            <div>
              <h2 className="text-base sm:text-lg font-bold text-pencil font-[family-name:var(--font-kalam-var)] leading-tight flex items-center gap-1.5">
                Vasuu Studio Support <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </h2>
              <p className="text-xs font-bold text-pencil-light font-[family-name:var(--font-patrick-var)]">
                Vasudev Dhakar • Direct Design Thread
              </p>
            </div>
          </div>

          <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-300 px-2.5 py-0.5 rounded-full hidden sm:inline-block">
            ● Active
          </span>
        </div>

        {/* Inner Scrollable Chat Messages Window */}
        <div 
          ref={chatScrollRef}
          className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-3 bg-[radial-gradient(#e5e0d8_1.2px,transparent_1.2px)] bg-[size:18px_18px] bg-slate-50/50"
        >
          {messages.length > 0 ? (
            messages.map((msg) => {
              const isAdmin = msg.is_from_admin;
              return (
                <div 
                  key={msg.id}
                  className={`flex ${isAdmin ? "justify-start" : "justify-end"}`}
                >
                  <div className={`max-w-[85%] sm:max-w-[75%]`}>
                    <div 
                      className={`p-3 sm:p-3.5 border-2 border-pencil rounded-xl shadow-hard-sm ${
                        isAdmin 
                          ? "bg-postit text-pencil rounded-tl-none" 
                          : "bg-ballpoint text-white rounded-tr-none"
                      }`}
                    >
                      <div className={`text-[11px] font-bold font-mono mb-1 flex items-center gap-1 ${
                        isAdmin ? "text-pencil-light" : "text-white/80"
                      }`}>
                        <User className="w-3 h-3" />
                        {isAdmin ? "Vasu (Admin)" : "You"}
                      </div>
                      
                      <p className="text-sm sm:text-base font-[family-name:var(--font-patrick-var)] font-bold leading-relaxed whitespace-pre-wrap">
                        {msg.message}
                      </p>

                      <div className={`text-[9px] sm:text-[10px] font-mono mt-1.5 text-right ${
                        isAdmin ? "text-pencil-lightest" : "text-white/70"
                      }`}>
                        {new Date(msg.created_at).toLocaleString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          day: "numeric",
                          month: "short"
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 my-auto">
              <MessageSquare className="w-10 h-10 text-pencil-lightest mb-2" />
              <h3 className="text-lg font-bold font-[family-name:var(--font-kalam-var)] text-pencil">
                No messages in this thread yet
              </h3>
              <p className="text-pencil-light text-xs sm:text-sm font-[family-name:var(--font-patrick-var)] font-bold max-w-xs mt-1">
                Type your questions, project details, or design requests below to chat directly with Vasuu Studio!
              </p>
            </div>
          )}
        </div>

        {/* STICKY FIXED-BOTTOM CHAT INPUT BAR (No Scrolling Needed) */}
        <div className="p-2.5 sm:p-3 bg-white border-t-2 border-pencil shrink-0">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Type your message here..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={sending}
              className="flex-1 wobbly border-2 border-pencil bg-paper/20 px-3.5 py-2.5 font-[family-name:var(--font-patrick-var)] text-pencil text-base focus:outline-none focus:bg-white"
            />

            <button
              type="submit"
              disabled={sending || !newMessage.trim()}
              className="h-[46px] px-4 bg-ballpoint text-white font-[family-name:var(--font-kalam-var)] font-bold text-sm rounded-lg border-2 border-pencil hover:bg-pencil transition-colors flex items-center justify-center gap-1.5 shadow-hard-sm disabled:opacity-50 cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">{sending ? "Sending..." : "Send"}</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
