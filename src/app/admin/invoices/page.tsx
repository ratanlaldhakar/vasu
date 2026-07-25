"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { WobblyCard } from "@/components/ui/WobblyCard";
import { WobblyButton } from "@/components/ui/WobblyButton";
import { WobblyInput } from "@/components/ui/WobblyInput";
import { 
  CreditCard, 
  User, 
  Briefcase, 
  FileText, 
  Plus, 
  CheckCircle,
  IndianRupee,
  Search,
  Calendar,
  Printer
} from "lucide-react";
import { InvoiceModal, InvoiceData } from "@/components/ui/InvoiceModal";

interface ClientProfile {
  id: string;
  name: string;
  email: string;
  business_name: string | null;
}

interface InvoiceRecord {
  id: string;
  amount: number;
  payment_id: string;
  status: string;
  created_at: string;
  client_name: string;
  client_email: string;
  plan_name: string;
}

export default function AdminInvoicesPage() {
  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeInvoice, setActiveInvoice] = useState<InvoiceData | null>(null);

  // Invoice Form States
  const [selectedClientId, setSelectedClientId] = useState("");
  const [invPlanName, setInvPlanName] = useState("Professional");
  const [invCustomTitle, setInvCustomTitle] = useState("");
  const [invCustomDescription, setInvCustomDescription] = useState("");
  const [invPriceText, setInvPriceText] = useState("₹5,999");
  const [invAmount, setInvAmount] = useState(5999);
  const [invStatus, setInvStatus] = useState("Paid");
  const [invPayId, setInvPayId] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState("");

  const loadData = async () => {
    if (!supabase) return;
    try {
      // 1. Load clients
      const { data: clientsData, error: clientsErr } = await supabase
        .from("profiles")
        .select("id, name, email, business_name")
        .order("name", { ascending: true });

      if (!clientsErr && clientsData) {
        setClients(clientsData);
        if (clientsData.length > 0) {
          setSelectedClientId(clientsData[0].id);
        }
      }

      // 2. Load payments with related profile/booking details
      const { data: paymentsData, error: paymentsErr } = await supabase
        .from("payments")
        .select(`
          id,
          amount,
          payment_id,
          status,
          created_at,
          profiles (
            name,
            email
          ),
          bookings (
            plan_name
          )
        `)
        .order("created_at", { ascending: false });

      if (!paymentsErr && paymentsData) {
        const formatted = (paymentsData as any[]).map((pay) => ({
          id: pay.id,
          amount: pay.amount,
          payment_id: pay.payment_id,
          status: pay.status,
          created_at: pay.created_at,
          client_name: pay.profiles?.name || "Unknown Client",
          client_email: pay.profiles?.email || "",
          plan_name: pay.bookings?.plan_name || "Manual Package"
        }));
        setInvoices(formatted);
      }
    } catch (err) {
      console.error("Error loading invoices data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !selectedClientId) return;

    setFormLoading(true);
    setFormSuccess("");

    try {
      const selectedClient = clients.find(c => c.id === selectedClientId);
      if (!selectedClient) throw new Error("Please select a valid client.");

      const finalItemTitle = invCustomTitle.trim() || invPlanName;
      const isPending = invStatus === "Pending";
      const paymentStatusValue = isPending ? "pending" : "success";
      const paymentId = invPayId || (isPending ? `INV-PENDING-${Date.now()}` : `MANUAL-${Date.now()}`);

      // 1. Insert Booking row
      const { data: booking, error: bookingErr } = await supabase
        .from("bookings")
        .insert({
          client_id: selectedClientId,
          plan_name: finalItemTitle,
          price: invPriceText,
          payment_status: invStatus,
          project_status: "Planning",
          estimated_delivery: "7-10 Days"
        })
        .select()
        .single();

      if (bookingErr) throw bookingErr;

      // 2. Insert Payment row
      const { data: payment, error: paymentErr } = await supabase
        .from("payments")
        .insert({
          booking_id: booking.id,
          client_id: selectedClientId,
          amount: Number(invAmount),
          payment_id: paymentId,
          order_id: `ORDER-${Date.now()}`,
          status: paymentStatusValue
        })
        .select()
        .single();

      if (paymentErr) throw paymentErr;

      // If pending, alert client via notification
      if (isPending) {
        await supabase
          .from("notifications")
          .insert({
            client_id: selectedClientId,
            title: `💳 Pending Invoice: ${finalItemTitle}`,
            content: `You have an unpaid invoice of ${invPriceText} for '${finalItemTitle}'. Open Bookings to pay online now.`,
            is_read: false
          });
      }

      // Check if project details exist, if not we can create one
      const { count } = await supabase
        .from("projects")
        .select("*", { count: "exact", head: true })
        .eq("client_id", selectedClientId);

      if (count === 0) {
        await supabase
          .from("projects")
          .insert({
            client_id: selectedClientId,
            title: `${invPlanName} Website Project`,
            plan_name: invPlanName,
            description: `Development of your ${invPlanName} package plan.`,
            status: "Planning",
            progress_percent: 20,
            timeline: "7-10 Days"
          });
      }

      // Prepend local state
      const newInv: InvoiceRecord = {
        id: payment.id,
        amount: payment.amount,
        payment_id: payment.payment_id,
        status: payment.status,
        created_at: payment.created_at,
        client_name: selectedClient.name,
        client_email: selectedClient.email,
        plan_name: finalItemTitle
      };

      setInvoices(prev => [newInv, ...prev]);
      setFormSuccess(`Invoice generated successfully for ${selectedClient.name}!`);
      setInvPayId("");
      setInvCustomTitle("");
      setInvCustomDescription("");
    } catch (err: any) {
      alert("Invoice creation failed: " + err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.client_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.plan_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.payment_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="font-[family-name:var(--font-kalam-var)] text-pencil text-xl text-center py-12">
        ✏️ Loading billing ledger...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-pencil font-[family-name:var(--font-kalam-var)] flex items-center gap-2">
          <CreditCard className="w-8 h-8 text-marker" />
          Invoice & Billing Center 💳
        </h1>
        <p className="text-pencil-light font-[family-name:var(--font-patrick-var)] font-bold text-lg">
          Select clients, generate custom billing receipts, and inspect historical payments.
        </p>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8">
        
        {/* Left Side: Invoice Ledger (2 Columns) */}
        <div className="order-2 lg:order-1 lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-pencil font-[family-name:var(--font-kalam-var)]">
              Historical Ledger
            </h2>
            {/* Search */}
            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 text-pencil-lightest absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search ledger..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full wobbly border-2 border-pencil pl-9 pr-3 py-1.5 font-[family-name:var(--font-patrick-var)] text-pencil text-sm placeholder:text-pencil-lightest/60 focus:outline-none"
              />
            </div>
          </div>

          {filteredInvoices.length > 0 ? (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {filteredInvoices.map((inv) => (
                <div 
                  key={inv.id} 
                  className="p-4 border-2 border-pencil wobbly-sm bg-white shadow-hard-sm text-sm flex flex-col sm:flex-row justify-between sm:items-center gap-3 relative hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold font-[family-name:var(--font-kalam-var)] text-pencil text-base">
                        {inv.client_name}
                      </span>
                      <span className="text-[10px] text-pencil-lightest font-mono">
                        ({inv.client_email})
                      </span>
                    </div>
                    <div className="text-xs font-[family-name:var(--font-patrick-var)] font-bold text-pencil-light">
                      📦 Plan: <strong className="text-pencil">{inv.plan_name}</strong>
                    </div>
                    <div className="text-[11px] font-mono text-pencil-lightest select-all">
                      Pay ID: <span className="bg-paper border px-1 text-pencil">{inv.payment_id}</span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-start sm:items-end justify-between gap-2">
                    <span className="text-lg font-bold text-ballpoint flex items-center font-[family-name:var(--font-kalam-var)]">
                      ₹{inv.amount.toLocaleString("en-IN")}
                    </span>
                    <button
                      onClick={() =>
                        setActiveInvoice({
                          invoiceNumber: `INV-${inv.id.substring(0, 8).toUpperCase()}`,
                          date: new Date(inv.created_at).toLocaleDateString("en-IN"),
                          clientName: inv.client_name,
                          clientEmail: inv.client_email,
                          planName: inv.plan_name,
                          amountText: `₹${inv.amount.toLocaleString("en-IN")}`,
                          amountNum: inv.amount,
                          paymentId: inv.payment_id,
                          status: inv.status || "SUCCESS"
                        })
                      }
                      className="px-2.5 py-1 border border-pencil bg-paper text-pencil text-xs font-bold font-[family-name:var(--font-kalam-var)] rounded hover:bg-pencil hover:text-white transition-colors flex items-center gap-1"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      View & Print Invoice
                    </button>
                    <span className="text-[10px] text-pencil-lightest flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(inv.created_at).toLocaleDateString("en-IN")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <WobblyCard
              variant="default"
              hover={false}
              className="border-3 border-pencil bg-white p-8 text-center"
            >
              <p className="text-pencil-light text-base font-[family-name:var(--font-patrick-var)]">
                No transaction records found matching &quot;{searchQuery}&quot;.
              </p>
            </WobblyCard>
          )}
        </div>

        {/* Right Side: Central Invoice Creator Form */}
        <div className="order-1 lg:order-2 lg:col-span-1">
          <WobblyCard
            variant="default"
            hover={false}
            className="border-3 border-pencil bg-white p-5 relative"
          >
            <h2 className="text-2xl font-bold text-pencil mb-4 font-[family-name:var(--font-kalam-var)] flex items-center gap-2">
              <Plus className="w-5 h-5 text-marker" />
              Generate Invoice
            </h2>

            {formSuccess && (
              <div className="mb-4 p-2.5 border border-dashed border-ballpoint bg-ballpoint/5 text-ballpoint text-sm font-bold font-[family-name:var(--font-kalam-var)] flex items-center gap-1.5 wobbly-sm">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                {formSuccess}
              </div>
            )}

            {clients.length > 0 ? (
              <form onSubmit={handleCreateInvoice} className="space-y-4">
                
                {/* Client Dropdown Selector */}
                <div className="space-y-1">
                  <label htmlFor="inv-client-select" className="block font-[family-name:var(--font-kalam-var)] font-bold text-pencil text-lg">
                    Select Client
                  </label>
                  <select
                    id="inv-client-select"
                    className="w-full wobbly border-3 border-pencil bg-white px-3 py-2 min-h-[50px] font-[family-name:var(--font-patrick-var)] text-pencil text-lg focus:outline-none"
                    value={selectedClientId}
                    onChange={(e) => setSelectedClientId(e.target.value)}
                    required
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.business_name || c.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="inv-plan-select" className="block font-[family-name:var(--font-kalam-var)] font-bold text-pencil text-lg">
                      Package / Preset
                    </label>
                    <select
                      id="inv-plan-select"
                      className="w-full wobbly border-3 border-pencil bg-white px-3 py-2 min-h-[50px] font-[family-name:var(--font-patrick-var)] text-pencil text-lg focus:outline-none"
                      value={invPlanName}
                      onChange={(e) => {
                        setInvPlanName(e.target.value);
                        if (!invCustomTitle) {
                          if (e.target.value === "Starter") { setInvPriceText("₹2,999"); setInvAmount(2999); }
                          else if (e.target.value === "Professional") { setInvPriceText("₹5,999"); setInvAmount(5999); }
                          else if (e.target.value === "Business") { setInvPriceText("₹9,999"); setInvAmount(9999); }
                        }
                      }}
                    >
                      <option value="Starter">Starter Plan</option>
                      <option value="Professional">Professional Plan</option>
                      <option value="Business">Business Plan</option>
                      <option value="Service Charge">Custom Service Charge</option>
                      <option value="Website Maintenance">Website Maintenance</option>
                      <option value="Feature Integration">Feature Integration</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="inv-status-select" className="block font-[family-name:var(--font-kalam-var)] font-bold text-pencil text-lg">
                      Payment Status
                    </label>
                    <select
                      id="inv-status-select"
                      className="w-full wobbly border-3 border-pencil bg-white px-3 py-2 min-h-[50px] font-[family-name:var(--font-patrick-var)] text-pencil text-lg focus:outline-none"
                      value={invStatus}
                      onChange={(e) => setInvStatus(e.target.value)}
                    >
                      <option value="Paid">Paid (Success)</option>
                      <option value="Pending">Pending (Unpaid)</option>
                    </select>
                  </div>
                </div>

                <WobblyInput
                  id="inv-custom-title"
                  type="text"
                  label="Service Title / Item Name"
                  placeholder="e.g. website crm, Custom Web Redesign, Annual Maintenance"
                  value={invCustomTitle}
                  onChange={(e) => setInvCustomTitle(e.target.value)}
                />

                <WobblyInput
                  id="inv-custom-desc"
                  type="text"
                  label="Service Subtitle / Description (Optional)"
                  placeholder="e.g. Custom CRM design, database integration & admin portal setup"
                  value={invCustomDescription}
                  onChange={(e) => setInvCustomDescription(e.target.value)}
                />

                <div className="grid grid-cols-2 gap-4">
                  <WobblyInput
                    id="inv-price-text"
                    type="text"
                    label="Price Text Label"
                    placeholder="e.g. ₹5,999"
                    value={invPriceText}
                    onChange={(e) => setInvPriceText(e.target.value)}
                    required
                  />

                  <WobblyInput
                    id="inv-amount-num"
                    type="number"
                    label="Amount Value"
                    placeholder="5999"
                    value={invAmount}
                    onChange={(e) => setInvAmount(Number(e.target.value))}
                    required
                  />
                </div>

                {invStatus === "Paid" && (
                  <WobblyInput
                    id="inv-pay-ref"
                    type="text"
                    label="Razorpay ID (optional)"
                    placeholder="e.g. pay_Lnk9eA2y..."
                    value={invPayId}
                    onChange={(e) => setInvPayId(e.target.value)}
                  />
                )}

                <WobblyButton type="submit" disabled={formLoading} className="w-full">
                  {formLoading ? "Generating Invoice..." : "Create Invoice Record"}
                </WobblyButton>
              </form>
            ) : (
              <p className="text-pencil-lightest text-xs font-[family-name:var(--font-patrick-var)] text-center py-6">
                Please register a client profile first before creating invoices.
              </p>
            )}
          </WobblyCard>
        </div>

      </div>

      {/* Invoice Printable Modal */}
      <InvoiceModal
        invoice={activeInvoice}
        onClose={() => setActiveInvoice(null)}
      />
    </div>
  );
}
