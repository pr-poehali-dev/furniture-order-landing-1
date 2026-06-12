import { useEffect, useState } from "react";

const KITCHEN_IMG = "https://cdn.poehali.dev/projects/e84f41ff-e623-49a2-a773-de1e473421e0/files/94405f4e-89ff-4b7f-8ba9-6b9924ab5799.jpg";
const WARDROBE_IMG = "https://cdn.poehali.dev/projects/e84f41ff-e623-49a2-a773-de1e473421e0/files/6b2dc6af-8174-4fe7-a49e-42599a3ab7ca.jpg";
const LIVING_IMG = "https://cdn.poehali.dev/projects/e84f41ff-e623-49a2-a773-de1e473421e0/files/08db6c6f-ef20-470b-a815-3980253e5a63.jpg";
const KIDS_IMG = "https://cdn.poehali.dev/projects/e84f41ff-e623-49a2-a773-de1e473421e0/files/4087511f-b363-43f2-9729-f2065d01ffa9.jpg";

export const UPLOAD_URL = "https://functions.poehali.dev/fa11a964-44df-45b6-829f-991907d07efd";

const STORAGE_KEY = "site_images_v1";

export type ImageSlot = {
  key: string;
  label: string;
  group: "Главный экран" | "Каталог" | "Портфолио";
  defaultUrl: string;
};

export const IMAGE_SLOTS: ImageSlot[] = [
  { key: "hero", label: "Главное фото (Hero)", group: "Главный экран", defaultUrl: KITCHEN_IMG },
  { key: "cat_kitchen", label: "Каталог · Кухни", group: "Каталог", defaultUrl: KITCHEN_IMG },
  { key: "cat_wardrobe", label: "Каталог · Шкафы-купе", group: "Каталог", defaultUrl: WARDROBE_IMG },
  { key: "cat_kids", label: "Каталог · Детская", group: "Каталог", defaultUrl: KIDS_IMG },
  { key: "cat_living", label: "Каталог · Гостиные", group: "Каталог", defaultUrl: LIVING_IMG },
  { key: "portfolio_1", label: "Портфолио · Проект 1", group: "Портфолио", defaultUrl: KITCHEN_IMG },
  { key: "portfolio_2", label: "Портфолио · Проект 2", group: "Портфолио", defaultUrl: WARDROBE_IMG },
  { key: "portfolio_3", label: "Портфолио · Проект 3", group: "Портфолио", defaultUrl: LIVING_IMG },
  { key: "portfolio_4", label: "Портфолио · Проект 4", group: "Портфолио", defaultUrl: KIDS_IMG },
  { key: "portfolio_5", label: "Портфолио · Проект 5", group: "Портфолио", defaultUrl: KITCHEN_IMG },
  { key: "portfolio_6", label: "Портфолио · Проект 6", group: "Портфолио", defaultUrl: WARDROBE_IMG },
];

export function loadOverrides(): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveOverride(key: string, url: string) {
  const data = loadOverrides();
  data[key] = url;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event("site-images-updated"));
}

export function resetOverride(key: string) {
  const data = loadOverrides();
  delete data[key];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event("site-images-updated"));
}

export function getImageUrl(key: string): string {
  const slot = IMAGE_SLOTS.find((s) => s.key === key);
  const overrides = loadOverrides();
  return overrides[key] || slot?.defaultUrl || "";
}

export function useSiteImages() {
  const [version, setVersion] = useState(0);
  useEffect(() => {
    const handler = () => setVersion((v) => v + 1);
    window.addEventListener("site-images-updated", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("site-images-updated", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);
  return (key: string) => getImageUrl(key) + (version ? `` : ``);
}

export async function uploadImage(file: File): Promise<string> {
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const res = await fetch(UPLOAD_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ file: base64, contentType: file.type }),
  });

  if (!res.ok) {
    throw new Error("Не удалось загрузить фото");
  }

  const data = await res.json();
  return data.url as string;
}
