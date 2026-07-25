"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { WobblyCard } from "@/components/ui/WobblyCard";
import { WobblyButton } from "@/components/ui/WobblyButton";
import { WobblyTextarea } from "@/components/ui/WobblyTextarea";
import { Send, User, MessageSquare, Briefcase } from "lucide-react";

interface ClientProfile {
  id: string;
  name: string;
  email: string;
  business_name: string | null;
}

interface Message {
  id: string;
  client_id: string;
  sender_id: string;
  message: string;
  is_from_admin: boolean;
  created_at: string;
}

export default function AdminMessagesPage() {
  const { user } = useAuth();
  
  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [activeClientId, setActiveClientId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [clientsLoading, setClientsLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // 1. Fetch all client profiles
  const fetchClients = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, email, business_name")
        .order("name", { ascending: true });

      if (!error && data) {
        setClients(data);
        if (data.length > 0) {
          setActiveClientId(data[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setClientsLoading(false);
    }
  };

  // 2. Fetch messages for active client
  const fetchMessages = async (cid: string) => {
    if (!supabase) return;
    setMessagesLoading(true);
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("client_id", cid)
        .order("created_at", { ascending: true });

      if (!error && data) {
        setMessages(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setMessagesLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    if (activeClientId) {
      fetchMessages(activeClientId);
    }
  }, [activeClientId]);

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !activeClientId || !supabase) return;

    setSending(true);

    try {
      const { data: sentMsg, error } = await supabase
        .from("messages")
        .insert({
          client_id: activeClientId,
          sender_id: user.id,
          message: newMessage,
          is_from_admin: true
        })
        .select()
        .single();

      if (error) throw error;

      // Log notification entry for client
      await supabase
        .from("notifications")
        .insert({
          client_id: activeClientId,
          title: "💬 New Message from Vasuu Studio",
          content: newMessage.trim().substring(0, 120),
          is_read: false
        });

      setMessages(prev => [...prev, sentMsg]);
      setNewMessage("");
    } catch (err: any) {
      alert("Failed to send message: " + err.message);
    } finally {
      setSending(false);
    }
  };

  if (clientsLoading) {
    return (
      <div className="font-[family-name:var(--font-kalam-var)] text-pencil text-xl text-center py-12">
        ✏️ Retrieving active client registry threads...
      </div>
    );
  }

  const activeClient = clients.find(c => c.id === activeClientId);

  return (
    <div className="space-y-6 max-w-6xl mx-auto h-[calc(100vh-140px)] md:h-[calc(100vh-100px)] flex flex-col">
      {/* Title */}
      <div className="flex-shrink-0">
        <h1 className="text-3xl md:text-4xl font-bold text-pencil font-[family-name:var(--font-kalam-var)] flex items-center gap-2">
          <MessageSquare className="w-8 h-8 text-marker" />
          Messages Center 💬
        </h1>
        <p className="text-pencil-light font-[family-name:var(--font-patrick-var)] font-bold text-lg">
          Discuss projects, reply to client queries, and log statements in real-time.
        </p>
      </div>

      {/* Main Split Grid */}
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Side: Client List */}
        <div className="md:col-span-1 border-3 border-pencil bg-white wobbly-sm p-4 overflow-y-auto shadow-hard-sm flex flex-col gap-2">
          <h3 className="text-lg font-bold font-[family-name:var(--font-kalam-var)] mb-2 border-b-2 border-dashed border-pencil/20 pb-2">
            Active Client Threads ({clients.length})
          </h3>
          {clients.length > 0 ? (
            <div className="space-y-2">
              {clients.map((client) => {
                const isSelected = client.id === activeClientId;
                return (
                  <div
                    key={client.id}
                    onClick={() => setActiveClientId(client.id)}
                    className={`wobbly-sm p-3 border-2 transition-all duration-100 cursor-pointer text-left min-h-[48px] ${
                      isSelected
                        ? "bg-postit border-pencil shadow-hard-sm translate-x-[1px] translate-y-[1px]"
                        : "border-transparent hover:bg-paper/50 hover:border-pencil/20"
                    }`}
                  >
                    <div className="font-bold text-pencil truncate font-[family-name:var(--font-kalam-var)]">
                      {client.name}
                    </div>
                    {client.business_name && (
                      <div className="text-[10px] text-pencil-lightest font-sans truncate">
                        💼 {client.business_name}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-pencil-lightest text-center py-8">
              No clients registered.
            </p>
          )}
        </div>

        {/* Right Side: Chat Message Thread */}
        <div className="md:col-span-2 flex flex-col min-h-0 border-3 border-pencil bg-paper wobbly-md p-4 shadow-hard-md bg-[radial-gradient(#e5e0d8_1.2px,transparent_1.2px)] bg-[size:16px_16px]">
          {activeClientId ? (
            <>
              {/* Active client brief */}
              <div className="flex-shrink-0 border-b-2 border-dashed border-pencil/20 pb-3 mb-4 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-pencil text-lg font-[family-name:var(--font-kalam-var)]">
                    Chatting with: {activeClient?.name}
                  </h3>
                  <span className="text-xs text-pencil-lightest font-sans truncate block">
                    ✉️ {activeClient?.email}
                  </span>
                </div>
                <WobblyButton size="sm" href={`/admin/clients/${activeClientId}`}>
                  Manage Workspace <Briefcase className="w-3.5 h-3.5 ml-1" />
                </WobblyButton>
              </div>

              {/* Message List */}
              <div className="flex-1 min-h-0 overflow-y-auto space-y-4 pr-1">
                {messagesLoading ? (
                  <p className="text-center py-10 font-[family-name:var(--font-kalam-var)] text-pencil-light text-sm">
                    ✏️ Loading messages...
                  </p>
                ) : messages.length > 0 ? (
                  <div className="space-y-4">
                    {messages.map((msg) => {
                      const isAdmin = msg.is_from_admin;
                      return (
                        <div 
                          key={msg.id}
                          className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}
                        >
                          <div className={`max-w-[80%] ${isAdmin ? "-rotate-[0.3deg]" : "rotate-[0.3deg]"}`}>
                            <div className={`wobbly border-2 border-pencil p-4 shadow-hard-sm ${
                              isAdmin 
                                ? "bg-white text-pencil" 
                                : "bg-postit text-pencil"
                            }`}>
                              <div className="text-xs text-pencil-lightest font-[family-name:var(--font-kalam-var)] font-bold mb-1.5 flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {isAdmin ? "You (Admin)" : activeClient?.name}
                              </div>
                              <p className="text-base md:text-lg font-[family-name:var(--font-patrick-var)] font-bold leading-relaxed whitespace-pre-wrap">
                                {msg.message}
                              </p>
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
                    <div ref={chatEndRef} />
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8">
                    <MessageSquare className="w-12 h-12 text-pencil-lightest mb-2" />
                    <h3 className="text-lg font-bold font-[family-name:var(--font-kalam-var)] text-pencil">
                      No message history
                    </h3>
                    <p className="text-pencil-light text-sm font-[family-name:var(--font-patrick-var)]">
                      Start the conversation by sending a welcoming message to {activeClient?.name} below.
                    </p>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="flex-shrink-0 flex items-end gap-3 pt-4 border-t-2 border-dashed border-pencil/20 mt-4">
                <div className="flex-1">
                  <WobblyTextarea
                    id="admin-chat-input"
                    placeholder={`Reply to ${activeClient?.name}...`}
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
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <MessageSquare className="w-16 h-16 text-pencil-lightest mb-3" />
              <h3 className="text-xl font-bold font-[family-name:var(--font-kalam-var)] text-pencil">
                No active thread selected
              </h3>
              <p className="text-pencil-light text-base max-w-sm font-[family-name:var(--font-patrick-var)] font-bold">
                Select a client from the registry list on the left to review chat threads and send messages.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
