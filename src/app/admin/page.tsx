"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { WobblyCard } from "@/components/ui/WobblyCard";
import { WobblyButton } from "@/components/ui/WobblyButton";
import { Users, Briefcase, IndianRupee, ArrowRight, Search, Calendar, Phone } from "lucide-react";

interface ClientProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  business_name: string | null;
  created_at: string;
}

export default function AdminDashboardHome() {
  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Stats
  const [totalClients, setTotalClients] = useState(0);
  const [activeProjectsCount, setActiveProjectsCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const fetchDashboardStats = async () => {
    if (!supabase) return;
    try {
      // 1. Fetch Clients
      const { data: clientData, error: clientErr } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (!clientErr && clientData) {
        setClients(clientData);
        setTotalClients(clientData.length);
      }

      // 2. Fetch Projects count
      const { count: projCount, error: projErr } = await supabase
        .from("projects")
        .select("*", { count: "exact", head: true });
      
      if (!projErr && projCount !== null) {
        setActiveProjectsCount(projCount);
      }

      // 3. Fetch Payments Total
      const { data: payData, error: payErr } = await supabase
        .from("payments")
        .select("amount");
      
      if (!payErr && payData) {
        const sum = payData.reduce((acc, pay) => acc + Number(pay.amount || 0), 0);
        setTotalRevenue(sum);
      }
    } catch (err) {
      console.error("Error loading admin home stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.business_name && c.business_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="font-[family-name:var(--font-kalam-var)] text-pencil text-xl text-center py-12">
        ✏️ Retrieving client records from ledger...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-pencil font-[family-name:var(--font-kalam-var)]">
          System Overview 📊
        </h1>
        <p className="text-pencil-light font-[family-name:var(--font-patrick-var)] font-bold text-lg">
          Monitor revenue statistics, list active clients, and access management panels.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Total Clients */}
        <WobblyCard
          variant="default"
          hover={false}
          className="border-3 border-pencil shadow-hard-md bg-white p-5 flex items-center justify-between"
        >
          <div>
            <div className="text-xs text-pencil-lightest font-[family-name:var(--font-kalam-var)] font-bold">
              TOTAL REGISTERED CLIENTS
            </div>
            <div className="text-3xl font-bold text-pencil font-[family-name:var(--font-kalam-var)] mt-1">
              {totalClients}
            </div>
          </div>
          <div className="w-12 h-12 wobbly border-3 border-pencil bg-marker/10 flex items-center justify-center">
            <Users className="w-6 h-6 text-marker" />
          </div>
        </WobblyCard>

        {/* Active Projects */}
        <WobblyCard
          variant="default"
          hover={false}
          className="border-3 border-pencil shadow-hard-md bg-white p-5 flex items-center justify-between"
        >
          <div>
            <div className="text-xs text-pencil-lightest font-[family-name:var(--font-kalam-var)] font-bold">
              ACTIVE PROJECT TRACKERS
            </div>
            <div className="text-3xl font-bold text-pencil font-[family-name:var(--font-kalam-var)] mt-1">
              {activeProjectsCount}
            </div>
          </div>
          <div className="w-12 h-12 wobbly border-3 border-pencil bg-postit flex items-center justify-center">
            <Briefcase className="w-6 h-6 text-pencil" />
          </div>
        </WobblyCard>

        {/* Total Earnings */}
        <WobblyCard
          variant="default"
          hover={false}
          className="border-3 border-pencil shadow-hard-md bg-white p-5 flex items-center justify-between"
        >
          <div>
            <div className="text-xs text-pencil-lightest font-[family-name:var(--font-kalam-var)] font-bold">
              ACCUMULATED REVENUE
            </div>
            <div className="text-3xl font-bold text-ballpoint font-[family-name:var(--font-kalam-var)] mt-1">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </div>
          </div>
          <div className="w-12 h-12 wobbly border-3 border-pencil bg-ballpoint/10 flex items-center justify-center">
            <IndianRupee className="w-6 h-6 text-ballpoint" />
          </div>
        </WobblyCard>

      </div>

      {/* Client List Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-pencil font-[family-name:var(--font-kalam-var)]">
            Client Registry 👥
          </h2>
          {/* Search bar */}
          <div className="relative max-w-sm w-full">
            <Search className="w-5 h-5 text-pencil-lightest absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search clients or business..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full wobbly border-2 border-pencil pl-10 pr-4 py-2 font-[family-name:var(--font-patrick-var)] text-pencil text-base placeholder:text-pencil-lightest/60 focus:outline-none focus:ring-2 focus:ring-ballpoint"
            />
          </div>
        </div>

        {filteredClients.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredClients.map((client, idx) => (
              <WobblyCard
                key={client.id}
                variant="default"
                hover={true}
                rotation={idx % 2 === 0 ? -0.3 : 0.3}
                className="border-3 border-pencil bg-white p-5 flex flex-col justify-between min-h-44 h-auto relative"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-pencil truncate max-w-[80%] font-[family-name:var(--font-kalam-var)]">
                      {client.name}
                    </h3>
                    <span className="text-[10px] text-pencil-lightest font-sans flex items-center gap-1 mt-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Joined: {new Date(client.created_at).toLocaleDateString("en-IN")}
                    </span>
                  </div>
                  <p className="text-sm text-pencil-muted truncate font-[family-name:var(--font-patrick-var)] font-bold">
                    ✉️ {client.email}
                  </p>
                  {client.phone && (
                    <p className="text-xs text-pencil-light font-sans flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" />
                      {client.phone}
                    </p>
                  )}
                  {client.business_name && (
                    <div className="inline-block px-2.5 py-0.5 bg-postit border-2 border-pencil text-pencil font-bold text-xs wobbly-sm font-[family-name:var(--font-kalam-var)]">
                      💼 {client.business_name}
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-3 border-t border-dashed border-pencil/10">
                  <WobblyButton size="sm" href={`/admin/clients/${client.id}`}>
                    Manage Client <ArrowRight className="w-4 h-4 ml-1.5" />
                  </WobblyButton>
                </div>
              </WobblyCard>
            ))}
          </div>
        ) : (
          <WobblyCard
            variant="default"
            hover={false}
            className="border-3 border-pencil bg-white p-8 text-center"
          >
            <p className="text-pencil-light text-base font-[family-name:var(--font-patrick-var)]">
              No clients found matching &quot;{searchQuery}&quot;.
            </p>
          </WobblyCard>
        )}
      </div>
    </div>
  );
}
