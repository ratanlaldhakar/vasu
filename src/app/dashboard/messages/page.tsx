"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { WobblyCard } from "@/components/ui/WobblyCard";
import { WobblyButton } from "@/components/ui/WobblyButton";
import { WobblyTextarea } from "@/components/ui/WobblyTextarea";
import { Send, User, MessageSquare } from "lucide-react";

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMessages();
    }
  }, [user]);

  // Scroll to bottom whenever messages list updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    setSending(true);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientId: user.id,
          messageText: newMessage,
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

  if (loading) {
    return (
      <div className="font-[family-name:var(--font-kalam-var)] text-pencil text-xl text-center py-12">
        ✏️ Loading conversation logs...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-100px)]">
      {/* Header section */}
      <div className="flex-shrink-0">
        <h1 className="text-3xl md:text-4xl font-bold text-pencil font-[family-name:var(--font-kalam-var)] flex items-center gap-2">
          <MessageSquare className="w-8 h-8 text-marker" />
          Messages 💬
        </h1>
        <p className="text-pencil-light font-[family-name:var(--font-patrick-var)] font-bold text-lg">
          Direct thread with Vasu. Share project specs, details, and reviews.
        </p>
      </div>

      {/* Chat Area */}
      <div className="flex-1 min-h-0 border-3 border-pencil bg-paper wobbly-md p-4 overflow-y-auto space-y-4 shadow-hard-md bg-[radial-gradient(#e5e0d8_1.2px,transparent_1.2px)] bg-[size:16px_16px]">
        {messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((msg) => {
              const isAdmin = msg.is_from_admin;
              return (
                <div 
                  key={msg.id}
                  className={`flex ${isAdmin ? "justify-start" : "justify-end"}`}
                >
                  <div className={`max-w-[80%] ${isAdmin ? "rotate-[0.3deg]" : "-rotate-[0.3deg]"}`}>
                    {/* Bubble Card */}
                    <div className={`wobbly border-2 border-pencil p-4 shadow-hard-sm ${
                      isAdmin 
                        ? "bg-postit text-pencil" 
                        : "bg-white text-pencil"
                    }`}>
                      {/* Sender label */}
                      <div className="text-xs text-pencil-lightest font-[family-name:var(--font-kalam-var)] font-bold mb-1.5 flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {isAdmin ? "Vasu (Admin)" : "You"}
                      </div>
                      {/* Text */}
                      <p className="text-base md:text-lg font-[family-name:var(--font-patrick-var)] font-bold leading-relaxed whitespace-pre-wrap">
                        {msg.message}
                      </p>
                      {/* Timestamp */}
                      <div className="text-[10px] text-pencil-lightest mt-2 text-right font-sans">
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
            })}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <MessageSquare className="w-12 h-12 text-pencil-lightest mb-2" />
            <h3 className="text-xl font-bold font-[family-name:var(--font-kalam-var)] text-pencil">
              No messages yet
            </h3>
            <p className="text-pencil-light text-base max-w-sm font-[family-name:var(--font-patrick-var)] font-bold">
              Introduce yourself and share details about your website designs. Write your first message below!
            </p>
          </div>
        )}
      </div>

      {/* Input box form */}
      <form onSubmit={handleSendMessage} className="flex-shrink-0 flex items-end gap-3 bg-paper pt-2">
        <div className="flex-1">
          <WobblyTextarea
            id="chat-input"
            placeholder="Type your message here..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={sending}
            rows={2}
            className="!min-h-[50px] py-2 bg-white"
          />
        </div>
        <WobblyButton
          type="submit"
          disabled={sending || !newMessage.trim()}
          className="flex-shrink-0 !h-[50px] !w-[50px] flex items-center justify-center p-0 cursor-pointer"
        >
          <Send className="w-5 h-5 text-pencil active:scale-95" />
        </WobblyButton>
      </form>
    </div>
  );
}
