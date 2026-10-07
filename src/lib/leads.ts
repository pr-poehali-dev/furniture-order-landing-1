const LEADS_URL = "https://functions.poehali.dev/7b9c0252-9c9e-4479-b94a-a25b78f23ab3";

export interface LeadPayload {
  source: "measure" | "quiz";
  phone: string;
  name?: string;
  answers?: Record<string, string>;
}

export async function sendLead(payload: LeadPayload): Promise<void> {
  const res = await fetch(LEADS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Не удалось отправить заявку. Позвоните нам: +7 (913) 274-85-19");
  }
}

export type LeadStatus = "new" | "in_work" | "done" | "rejected";

export const LEAD_STATUSES: { value: LeadStatus; label: string; className: string }[] = [
  { value: "new", label: "Новая", className: "bg-orange-100 text-orange-700 border-orange-200" },
  { value: "in_work", label: "В работе", className: "bg-blue-100 text-blue-700 border-blue-200" },
  { value: "done", label: "Договорились", className: "bg-green-100 text-green-700 border-green-200" },
  { value: "rejected", label: "Отказ", className: "bg-gray-100 text-gray-600 border-gray-200" },
];

export interface Lead {
  id: number;
  source: string;
  source_label: string;
  name: string | null;
  phone: string;
  details: string | null;
  status: LeadStatus;
  comment: string | null;
  email_sent: boolean;
  created_at: string;
}

async function adminRequest(password: string, method: "GET" | "PUT", body?: unknown) {
  const res = await fetch(LEADS_URL, {
    method,
    headers: { "Content-Type": "application/json", "X-Admin-Password": password },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Ошибка сервера");
  return data;
}

export async function fetchLeads(password: string): Promise<Lead[]> {
  const data = await adminRequest(password, "GET");
  return data.items || [];
}

export async function updateLead(
  password: string,
  id: number,
  patch: { status?: LeadStatus; comment?: string }
): Promise<void> {
  await adminRequest(password, "PUT", { id, ...patch });
}