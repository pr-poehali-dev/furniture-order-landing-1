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