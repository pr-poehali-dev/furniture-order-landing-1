import { useCallback, useEffect, useMemo, useState } from "react";
import Icon from "@/components/ui/icon";
import { getAdminPassword } from "@/lib/siteImages";
import { fetchLeads, updateLead, Lead, LeadStatus, LEAD_STATUSES } from "@/lib/leads";

const statusMeta = (s: LeadStatus) => LEAD_STATUSES.find((x) => x.value === s) ?? LEAD_STATUSES[0];

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function LeadCard({ lead, onChange }: { lead: Lead; onChange: (patch: Partial<Lead>) => Promise<void> }) {
  const [comment, setComment] = useState(lead.comment || "");
  const [saving, setSaving] = useState(false);
  const meta = statusMeta(lead.status);
  const commentChanged = comment !== (lead.comment || "");

  const save = async (patch: Partial<Lead>) => {
    setSaving(true);
    try {
      await onChange(patch);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`bg-white rounded-2xl border shadow-sm p-5 ${lead.status === "new" ? "border-orange-300" : "border-gray-100"}`}>
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <a href={`tel:${lead.phone.replace(/[^\d+]/g, "")}`} className="font-display font-bold text-lg text-gray-900 hover:text-orange-500">
              {lead.phone}
            </a>
            {lead.name && <span className="text-gray-700 text-sm">· {lead.name}</span>}
          </div>
          <div className="text-gray-400 text-xs mt-1 flex items-center gap-2 flex-wrap">
            <span>{formatDate(lead.created_at)}</span>
            <span>·</span>
            <span>{lead.source_label}</span>
            {!lead.email_sent && (
              <span className="text-red-400 flex items-center gap-1">
                <Icon name="MailX" size={12} /> письмо не ушло
              </span>
            )}
          </div>
        </div>
        <select
          value={lead.status}
          disabled={saving}
          onChange={(e) => save({ status: e.target.value as LeadStatus })}
          className={`text-xs font-semibold px-3 py-1.5 rounded-full border cursor-pointer focus:outline-none ${meta.className}`}
        >
          {LEAD_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {lead.details && (
        <div className="bg-gray-50 rounded-xl p-3 mb-3 text-sm text-gray-600 space-y-0.5">
          {lead.details.split("\n").map((line, i) => {
            const idx = line.indexOf(": ");
            return idx > 0 ? (
              <div key={i}><span className="text-gray-400">{line.slice(0, idx)}:</span> {line.slice(idx + 2)}</div>
            ) : (
              <div key={i}>{line}</div>
            );
          })}
        </div>
      )}

      <div className="flex gap-2">
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Заметка: договорились о замере в пятницу..."
          className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-orange-500"
        />
        {commentChanged && (
          <button onClick={() => save({ comment })} disabled={saving} className="btn-orange px-4 py-2 rounded-xl text-xs disabled:opacity-60">
            Сохранить
          </button>
        )}
      </div>
    </div>
  );
}

export default function LeadsPanel() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<LeadStatus | "all">("all");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setLeads(await fetchLeads(getAdminPassword() || ""));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось загрузить заявки");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleChange = async (id: number, patch: Partial<Lead>) => {
    try {
      await updateLead(getAdminPassword() || "", id, { status: patch.status, comment: patch.comment ?? undefined });
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Не удалось сохранить");
    }
  };

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: leads.length };
    leads.forEach((l) => (c[l.status] = (c[l.status] || 0) + 1));
    return c;
  }, [leads]);

  const visible = filter === "all" ? leads : leads.filter((l) => l.status === filter);

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex flex-wrap gap-2">
          {[{ value: "all" as const, label: "Все" }, ...LEAD_STATUSES].map((s) => (
            <button
              key={s.value}
              onClick={() => setFilter(s.value)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${filter === s.value ? "bg-orange-500 text-white" : "bg-white border border-gray-200 text-gray-700 hover:border-orange-400"}`}
            >
              {s.label} <span className="opacity-70">· {counts[s.value] || 0}</span>
            </button>
          ))}
        </div>
        <button onClick={load} disabled={loading} className="px-4 py-2 rounded-xl text-sm bg-white border border-gray-200 text-gray-700 hover:border-orange-400 flex items-center gap-1.5">
          <Icon name="RefreshCw" size={14} className={loading ? "animate-spin" : ""} />
          Обновить
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {loading && leads.length === 0 ? (
        <div className="text-gray-400 text-sm flex items-center gap-2"><Icon name="Loader2" size={16} className="animate-spin" /> Загружаю заявки...</div>
      ) : visible.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">
          <Icon name="Inbox" size={32} className="mx-auto mb-2" />
          Заявок пока нет
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          {visible.map((lead) => (
            <LeadCard key={lead.id} lead={lead} onChange={(patch) => handleChange(lead.id, patch)} />
          ))}
        </div>
      )}
    </section>
  );
}
