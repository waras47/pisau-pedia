"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { HttpError } from "@/shared/api/http-error";

import {
  deleteSubscriber,
  listSubscribers,
  subscribeNewsletter,
  type SubscriberApiItem,
  type SubscriberSource,
  unsubscribeSubscriber,
} from "@/entities/newsletter/api/newsletter.api";

// --- Types ---

interface Subscriber {
  id: string;
  email: string;
  name: string;
  joinedDate: string;
  status: "active" | "unsubscribed";
  source: SubscriberSource;
}

interface Campaign {
  id: string;
  subject: string;
  status: "draft" | "scheduled" | "sent";
  sentDate: string;
  recipients: number;
  openRate: number;
  clickRate: number;
  content: string;
}

type Tab = "subscribers" | "campaigns";
type SubModal = "closed" | "add-subscriber" | "delete-subscriber" | "compose" | "view-campaign" | "delete-campaign";

interface SuccessInfo {
  type: "added" | "removed" | "subscribed" | "unsubscribed" | "campaign-saved" | "campaign-scheduled" | "campaign-deleted";
  name: string;
}

const emptySubscriber: Subscriber = {
  id: "", email: "", name: "", joinedDate: "", status: "active", source: "manual",
};

function toSubscriberVM(s: SubscriberApiItem): Subscriber {
  return {
    id: s.id,
    email: s.email,
    name: s.name ?? "",
    joinedDate: s.created_at ? s.created_at.slice(0, 10) : "",
    status: s.status,
    source: s.source,
  };
}

// --- Mock data (campaigns — email sending not yet implemented) ---

const initialCampaigns: Campaign[] = [
  {
    id: "cm-1",
    subject: "Summer Steel Sale — Up to 20% Off Japanese Knives",
    status: "sent",
    sentDate: "2026-06-15",
    recipients: 847,
    openRate: 42.3,
    clickRate: 12.8,
    content: "Our biggest summer sale is here! Get up to 20% off hand-forged Japanese knives from Tanaka Forge, Yu Kurosaki, and Sakai Takayuki. Use code KNIFE20 at checkout. Sale ends July 31st.",
  },
  {
    id: "cm-2",
    subject: "New Arrivals: Hatsukokoro Kumokage Series",
    status: "sent",
    sentDate: "2026-05-28",
    recipients: 823,
    openRate: 38.7,
    clickRate: 15.2,
    content: "Introducing the Hatsukokoro Kumokage series — stunning Damascus blades with octagonal rosewood handles. Available in Gyuto 210mm, Nakiri 165mm, and Petty 150mm. Limited stock.",
  },
  {
    id: "cm-3",
    subject: "Sharpening Guide: Master Your Whetstone in 5 Steps",
    status: "sent",
    sentDate: "2026-05-10",
    recipients: 856,
    openRate: 45.1,
    clickRate: 22.4,
    content: "Learn the art of Japanese knife sharpening with our step-by-step video guide. From choosing the right grit to achieving a mirror polish — everything you need to keep your blades razor-sharp.",
  },
  {
    id: "cm-4",
    subject: "Holiday Gift Guide: The Perfect Knife for Every Chef",
    status: "scheduled",
    sentDate: "2026-12-01",
    recipients: 0,
    openRate: 0,
    clickRate: 0,
    content: "Finding the perfect gift for the chef in your life? Our curated holiday guide features hand-picked recommendations from beginner-friendly Santoku to professional-grade Yanagiba. Plus, free engraving on all orders over €200.",
  },
  {
    id: "cm-5",
    subject: "Behind the Forge: Meet Blacksmith Yu Kurosaki",
    status: "draft",
    sentDate: "",
    recipients: 0,
    openRate: 0,
    clickRate: 0,
    content: "Go behind the scenes at Yu Kurosaki's workshop in Echizen. Discover the techniques behind the iconic Shizuku and Fujin series, and learn why Kurosaki-san's blades are among the most sought-after in the world.",
  },
];

// --- Helpers ---

function formatDate(d: string) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// --- Page ---

const SUBSCRIBERS_PER_PAGE = 20;

export default function NewsletterPage() {
  const [tab, setTab] = useState<Tab>("subscribers");
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [modal, setModal] = useState<SubModal>("closed");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [successInfo, setSuccessInfo] = useState<SuccessInfo | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [subStats, setSubStats] = useState({ total: 0, active: 0, unsubscribed: 0 });

  // Shared edit state
  const [editSubscriber, setEditSubscriber] = useState<Subscriber>(emptySubscriber);
  const [editCampaign, setEditCampaign] = useState<Campaign>({
    id: "", subject: "", status: "draft", sentDate: "", recipients: 0, openRate: 0, clickRate: 0, content: "",
  });

  // Debounce free-text search so we don't hit the API on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  // Reset to page 1 whenever the active filter changes.
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filterStatus]);

  async function loadSubscribers() {
    setLoading(true);
    try {
      const { items, meta } = await listSubscribers({
        page,
        perPage: SUBSCRIBERS_PER_PAGE,
        status: filterStatus || undefined,
        search: debouncedSearch || undefined,
      });
      setSubscribers(items.map(toSubscriberVM));
      setTotalPages(Math.max(1, meta.total_pages));
    } catch (err) {
      alert(err instanceof HttpError ? err.message : "Gagal memuat subscriber");
    } finally {
      setLoading(false);
    }
  }

  // Independent of the current search/filter/page — these three counts
  // always describe the full subscriber base, not just what's on screen.
  async function loadStats() {
    try {
      const [total, active, unsubscribed] = await Promise.all([
        listSubscribers({ perPage: 1 }),
        listSubscribers({ perPage: 1, status: "active" }),
        listSubscribers({ perPage: 1, status: "unsubscribed" }),
      ]);
      setSubStats({ total: total.meta.total, active: active.meta.total, unsubscribed: unsubscribed.meta.total });
    } catch {
      // Stats are supplementary — a failure here shouldn't block the table.
    }
  }

  useEffect(() => {
    if (tab !== "subscribers") return;
    loadSubscribers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, page, filterStatus, debouncedSearch]);

  useEffect(() => {
    loadStats();
  }, []);

  const showSuccess = useCallback((type: SuccessInfo["type"], name: string) => {
    setSuccessInfo({ type, name });
    setTimeout(() => setSuccessInfo(null), 2500);
  }, []);

  // Campaign stats
  const campStats = useMemo(() => {
    const sent = campaigns.filter((c) => c.status === "sent");
    const avgOpen = sent.length > 0 ? sent.reduce((s, c) => s + c.openRate, 0) / sent.length : 0;
    const avgClick = sent.length > 0 ? sent.reduce((s, c) => s + c.clickRate, 0) / sent.length : 0;
    return { total: campaigns.length, sent: sent.length, drafts: campaigns.filter((c) => c.status === "draft").length, avgOpen, avgClick };
  }, [campaigns]);

  // Filtered campaigns
  const filteredCamps = useMemo(() => {
    let result = campaigns;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((c) => c.subject.toLowerCase().includes(q));
    }
    if (filterStatus) result = result.filter((c) => c.status === filterStatus);
    return result;
  }, [campaigns, search, filterStatus]);

  // Subscriber handlers
  const handleAddSubscriber = () => {
    setEditSubscriber({ ...emptySubscriber, joinedDate: new Date().toISOString().slice(0, 10) });
    setModal("add-subscriber");
  };

  async function handleSaveSubscriber() {
    if (!editSubscriber.email.trim()) return;
    setSaving(true);
    try {
      await subscribeNewsletter(editSubscriber.email.trim(), "manual", editSubscriber.name || undefined);
      showSuccess("added", editSubscriber.email);
      await Promise.all([loadSubscribers(), loadStats()]);
      setModal("closed");
    } catch (err) {
      alert(err instanceof HttpError ? err.message : "Gagal menambah subscriber");
    } finally {
      setSaving(false);
    }
  }

  const handleDeleteSubscriber = (s: Subscriber) => {
    setEditSubscriber(s);
    setModal("delete-subscriber");
  };

  async function confirmDeleteSubscriber() {
    setSaving(true);
    try {
      await deleteSubscriber(editSubscriber.id);
      showSuccess("removed", editSubscriber.email);
      await Promise.all([loadSubscribers(), loadStats()]);
    } catch (err) {
      alert(err instanceof HttpError ? err.message : "Gagal menghapus subscriber");
    } finally {
      setSaving(false);
      setModal("closed");
    }
  }

  async function toggleSubscriberStatus(sub: Subscriber) {
    setSaving(true);
    try {
      if (sub.status === "active") {
        await unsubscribeSubscriber(sub.id);
        showSuccess("unsubscribed", sub.email);
      } else {
        await subscribeNewsletter(sub.email, sub.source);
        showSuccess("subscribed", sub.email);
      }
      await Promise.all([loadSubscribers(), loadStats()]);
    } catch (err) {
      alert(err instanceof HttpError ? err.message : "Gagal mengubah status subscriber");
    } finally {
      setSaving(false);
    }
  }

  // Campaign handlers (mock only — email sending isn't wired up yet)
  const handleViewCampaign = (c: Campaign) => {
    setEditCampaign(c);
    setModal("view-campaign");
  };

  const handleDeleteCampaign = (c: Campaign) => {
    setEditCampaign(c);
    setModal("delete-campaign");
  };

  const confirmDeleteCampaign = () => {
    setCampaigns((prev) => prev.filter((c) => c.id !== editCampaign.id));
    showSuccess("campaign-deleted", editCampaign.subject);
    setModal("closed");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Success Modal */}
      {successInfo && (
        <NewsletterSuccessModal info={successInfo} onClose={() => setSuccessInfo(null)} />
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Newsletter</h1>
          <p className="text-sm text-gray-400">Manage subscribers and email campaigns</p>
        </div>
        <div className="flex gap-2">
          {tab === "subscribers" ? (
            <button type="button" onClick={handleAddSubscriber} disabled={saving} className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-600 disabled:opacity-50">
              <PlusIcon /> Add Subscriber
            </button>
          ) : (
            <button type="button" disabled title="Belum tersedia — perlu integrasi SMTP/email provider" className="flex cursor-not-allowed items-center gap-2 rounded-lg bg-gray-200 px-4 py-2.5 text-sm font-medium text-gray-400 shadow-sm">
              <PlusIcon /> Compose Campaign
            </button>
          )}
        </div>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
        {(["subscribers", "campaigns"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => { setTab(t); setSearch(""); setFilterStatus(""); setPage(1); }}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium capitalize transition-colors ${
              tab === t ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ===== SUBSCRIBERS TAB ===== */}
      {tab === "subscribers" && (
        <>
          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Total Subscribers", value: String(subStats.total), gradient: "from-slate-400 to-slate-600" },
              { label: "Active", value: String(subStats.active), gradient: "from-emerald-400 to-emerald-600" },
              { label: "Unsubscribed", value: String(subStats.unsubscribed), gradient: "from-red-400 to-red-600" },
            ].map((s) => (
              <div key={s.label} className={`flex items-center gap-4 rounded-xl bg-gradient-to-br p-4 shadow-sm ${s.gradient}`}>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 text-sm font-bold text-white">{s.value}</div>
                <span className="text-sm text-white/90">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="flex flex-wrap items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
            <div className="flex flex-1 items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
              <SearchIcon />
              <input type="text" placeholder="Search subscribers..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400" />
            </div>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600">
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="unsubscribed">Unsubscribed</option>
            </select>
          </div>

          {/* Subscribers table */}
          <div className="rounded-xl bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-xs text-gray-400">
                    <th className="px-4 py-4 font-medium">Email</th>
                    <th className="px-4 py-4 font-medium">Name</th>
                    <th className="px-4 py-4 font-medium">Joined</th>
                    <th className="px-4 py-4 font-medium">Source</th>
                    <th className="px-4 py-4 font-medium">Status</th>
                    <th className="px-4 py-4 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400">Loading...</td></tr>
                  ) : subscribers.length === 0 ? (
                    <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400">No subscribers found.</td></tr>
                  ) : (
                    subscribers.map((s) => (
                      <tr key={s.id} className="border-b border-gray-50 transition-colors hover:bg-gray-50/50">
                        <td className="px-4 py-3 font-medium text-gray-700">{s.email}</td>
                        <td className="px-4 py-3 text-gray-500">{s.name || "—"}</td>
                        <td className="px-4 py-3 text-xs text-gray-500">{formatDate(s.joinedDate)}</td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] capitalize text-gray-600">{s.source}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                            s.status === "active" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
                          }`}>
                            {s.status === "active" ? "Active" : "Unsubscribed"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button type="button" onClick={() => toggleSubscriberStatus(s)} disabled={saving} className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-amber-500 disabled:opacity-50" title={s.status === "active" ? "Unsubscribe" : "Resubscribe"}>
                              {s.status === "active" ? <PauseIcon /> : <PlayIcon />}
                            </button>
                            <button type="button" onClick={() => handleDeleteSubscriber(s)} disabled={saving} className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-500 disabled:opacity-50" title="Remove">
                              <TrashIcon />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || loading}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages || loading}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* ===== CAMPAIGNS TAB ===== */}
      {tab === "campaigns" && (
        <>
          <div className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700">
            Pengiriman email kampanye belum tersedia — perlu integrasi SMTP/email provider. Data di bawah ini hanya contoh.
          </div>

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-4">
            {[
              { label: "Total Campaigns", value: String(campStats.total), gradient: "from-slate-400 to-slate-600" },
              { label: "Sent", value: String(campStats.sent), gradient: "from-emerald-400 to-emerald-600" },
              { label: "Avg. Open Rate", value: `${campStats.avgOpen.toFixed(1)}%`, gradient: "from-blue-400 to-blue-600" },
              { label: "Avg. Click Rate", value: `${campStats.avgClick.toFixed(1)}%`, gradient: "from-amber-400 to-orange-500" },
            ].map((s) => (
              <div key={s.label} className={`flex items-center gap-4 rounded-xl bg-gradient-to-br p-4 shadow-sm ${s.gradient}`}>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 text-xs font-bold text-white">{s.value}</div>
                <span className="text-sm text-white/90">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="flex flex-wrap items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
            <div className="flex flex-1 items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
              <SearchIcon />
              <input type="text" placeholder="Search campaigns..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400" />
            </div>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600">
              <option value="">All</option>
              <option value="sent">Sent</option>
              <option value="scheduled">Scheduled</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {/* Campaigns list */}
          <div className="flex flex-col gap-3">
            {filteredCamps.length === 0 ? (
              <div className="rounded-xl bg-white p-12 text-center text-gray-400 shadow-sm">No campaigns found.</div>
            ) : (
              filteredCamps.map((c) => (
                <div key={c.id} className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm transition-colors hover:bg-gray-50/50">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                    <MailIcon />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-gray-700">{c.subject}</p>
                    <p className="text-xs text-gray-400">
                      {c.status === "sent" && `Sent ${formatDate(c.sentDate)} · ${c.recipients} recipients`}
                      {c.status === "scheduled" && `Scheduled for ${formatDate(c.sentDate)}`}
                      {c.status === "draft" && "Draft — not sent yet"}
                    </p>
                  </div>
                  {c.status === "sent" && (
                    <div className="hidden gap-6 text-center sm:flex">
                      <div>
                        <p className="text-sm font-semibold text-gray-700">{c.openRate}%</p>
                        <p className="text-[10px] text-gray-400">Open Rate</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700">{c.clickRate}%</p>
                        <p className="text-[10px] text-gray-400">Click Rate</p>
                      </div>
                    </div>
                  )}
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium capitalize ${
                    c.status === "sent" ? "bg-emerald-50 text-emerald-600" :
                    c.status === "scheduled" ? "bg-blue-50 text-blue-500" :
                    "bg-gray-100 text-gray-500"
                  }`}>
                    {c.status}
                  </span>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => handleViewCampaign(c)} className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-blue-500" title="View">
                      <EyeIcon />
                    </button>
                    <button type="button" onClick={() => handleDeleteCampaign(c)} className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-500" title="Delete">
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* ===== MODALS ===== */}

      {/* Add Subscriber */}
      {modal === "add-subscriber" && (
        <ModalOverlay onClose={() => setModal("closed")}>
          <div className="w-full max-w-md rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="text-lg font-bold text-gray-800">Add Subscriber</h2>
              <button type="button" onClick={() => setModal("closed")} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-6">
              <div className="grid gap-5">
                <Field label="Email *">
                  <input type="email" value={editSubscriber.email} onChange={(e) => setEditSubscriber((p) => ({ ...p, email: e.target.value }))} className="admin-input" placeholder="customer@example.com" />
                </Field>
                <Field label="Name">
                  <input type="text" value={editSubscriber.name} onChange={(e) => setEditSubscriber((p) => ({ ...p, name: e.target.value }))} className="admin-input" placeholder="Full name" />
                </Field>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
              <button type="button" onClick={() => setModal("closed")} className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button type="button" onClick={handleSaveSubscriber} disabled={!editSubscriber.email.trim() || saving} className="rounded-lg bg-emerald-500 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-40">
                Add Subscriber
              </button>
            </div>
          </div>
        </ModalOverlay>
      )}

      {/* Delete Subscriber */}
      {modal === "delete-subscriber" && (
        <ModalOverlay onClose={() => setModal("closed")}>
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50"><TrashIcon className="text-red-500" /></div>
            <h2 className="text-lg font-bold text-gray-800">Remove Subscriber</h2>
            <p className="mt-2 text-sm text-gray-500">Remove <strong>{editSubscriber.email}</strong> from the newsletter list?</p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button type="button" onClick={() => setModal("closed")} className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button type="button" onClick={confirmDeleteSubscriber} disabled={saving} className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50">Remove</button>
            </div>
          </div>
        </ModalOverlay>
      )}

      {/* View Campaign */}
      {modal === "view-campaign" && (
        <ModalOverlay onClose={() => setModal("closed")}>
          <div className="w-full max-w-xl rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="text-lg font-bold text-gray-800">Campaign Details</h2>
              <button type="button" onClick={() => setModal("closed")} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800">{editCampaign.subject}</h3>
              <div className="mt-3 flex flex-wrap gap-4 text-sm">
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium capitalize ${
                  editCampaign.status === "sent" ? "bg-emerald-50 text-emerald-600" :
                  editCampaign.status === "scheduled" ? "bg-blue-50 text-blue-500" :
                  "bg-gray-100 text-gray-500"
                }`}>{editCampaign.status}</span>
                {editCampaign.sentDate && <span className="text-gray-400">{formatDate(editCampaign.sentDate)}</span>}
              </div>
              {editCampaign.status === "sent" && (
                <div className="mt-4 grid grid-cols-3 gap-4 rounded-lg bg-gray-50 p-4 text-center">
                  <div><p className="text-lg font-bold text-gray-700">{editCampaign.recipients}</p><p className="text-[11px] text-gray-400">Recipients</p></div>
                  <div><p className="text-lg font-bold text-blue-600">{editCampaign.openRate}%</p><p className="text-[11px] text-gray-400">Open Rate</p></div>
                  <div><p className="text-lg font-bold text-amber-600">{editCampaign.clickRate}%</p><p className="text-[11px] text-gray-400">Click Rate</p></div>
                </div>
              )}
              <div className="mt-4 border-t border-gray-100 pt-4">
                <p className="mb-2 text-xs font-semibold uppercase text-gray-400">Content</p>
                <p className="text-sm leading-relaxed text-gray-600">{editCampaign.content || "No content yet."}</p>
              </div>
            </div>
            <div className="flex items-center justify-end border-t border-gray-100 px-6 py-4">
              <button type="button" onClick={() => setModal("closed")} className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Close</button>
            </div>
          </div>
        </ModalOverlay>
      )}

      {/* Delete Campaign */}
      {modal === "delete-campaign" && (
        <ModalOverlay onClose={() => setModal("closed")}>
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50"><TrashIcon className="text-red-500" /></div>
            <h2 className="text-lg font-bold text-gray-800">Delete Campaign</h2>
            <p className="mt-2 text-sm text-gray-500">Delete &ldquo;{editCampaign.subject}&rdquo;? This cannot be undone.</p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button type="button" onClick={() => setModal("closed")} className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button type="button" onClick={confirmDeleteCampaign} className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600">Delete</button>
            </div>
          </div>
        </ModalOverlay>
      )}

      <style jsx global>{`
        .admin-input {
          width: 100%;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          color: #374151;
          outline: none;
          transition: border-color 0.15s;
        }
        .admin-input:focus {
          border-color: #10b981;
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.1);
        }
        .admin-input::placeholder { color: #9ca3af; }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
      `}</style>
    </div>
  );
}

// --- Sub-components ---

function ModalOverlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="animate-fade-in">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</label>
      {children}
    </div>
  );
}

function NewsletterSuccessModal({ info, onClose }: { info: SuccessInfo; onClose: () => void }) {
  const configs: Record<SuccessInfo["type"], { title: string; msg: string; bg: string; color: string; btnBg: string; icon: "check" | "trash" | "mail" | "user" }> = {
    added: { title: "Subscriber Added!", msg: `${info.name} has been added to your newsletter list.`, bg: "bg-emerald-100", color: "text-emerald-600", btnBg: "bg-emerald-500 hover:bg-emerald-600", icon: "user" },
    removed: { title: "Subscriber Removed!", msg: `${info.name} has been removed from the list.`, bg: "bg-red-100", color: "text-red-500", btnBg: "bg-red-500 hover:bg-red-600", icon: "trash" },
    subscribed: { title: "Resubscribed!", msg: `${info.name} has been reactivated.`, bg: "bg-emerald-100", color: "text-emerald-600", btnBg: "bg-emerald-500 hover:bg-emerald-600", icon: "check" },
    unsubscribed: { title: "Unsubscribed", msg: `${info.name} has been unsubscribed.`, bg: "bg-amber-100", color: "text-amber-600", btnBg: "bg-amber-500 hover:bg-amber-600", icon: "user" },
    "campaign-saved": { title: "Draft Saved!", msg: `Your campaign has been saved as a draft.`, bg: "bg-blue-100", color: "text-blue-600", btnBg: "bg-blue-500 hover:bg-blue-600", icon: "mail" },
    "campaign-scheduled": { title: "Campaign Scheduled!", msg: `Your campaign will be sent to all active subscribers.`, bg: "bg-emerald-100", color: "text-emerald-600", btnBg: "bg-emerald-500 hover:bg-emerald-600", icon: "mail" },
    "campaign-deleted": { title: "Campaign Deleted!", msg: `The campaign has been removed.`, bg: "bg-red-100", color: "text-red-500", btnBg: "bg-red-500 hover:bg-red-600", icon: "trash" },
  };
  const c = configs[info.type];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="animate-fade-in w-full max-w-sm rounded-xl bg-white p-8 text-center shadow-2xl">
        <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${c.bg}`}>
          {c.icon === "check" && <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={c.color}><path d="M20 6 9 17l-5-5" /></svg>}
          {c.icon === "trash" && <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={c.color}><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>}
          {c.icon === "mail" && <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={c.color}><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>}
          {c.icon === "user" && <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={c.color}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>}
        </div>
        <h3 className="text-lg font-bold text-gray-800">{c.title}</h3>
        <p className="mt-1.5 text-sm text-gray-500">{c.msg}</p>
        <button type="button" onClick={onClose} className={`mt-5 rounded-lg px-6 py-2 text-sm font-medium text-white ${c.btnBg}`}>OK</button>
      </div>
    </div>
  );
}

// --- Icons ---

function PlusIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>;
}
function SearchIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>;
}
function EyeIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>;
}
function TrashIcon({ className }: { className?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>;
}
function PauseIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="14" y="4" width="4" height="16" rx="1" /><rect x="6" y="4" width="4" height="16" rx="1" /></svg>;
}
function PlayIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="6 3 20 12 6 21 6 3" /></svg>;
}
function MailIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>;
}
