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

// ===== СТРУКТУРА ПОРТФОЛИО: категории → проекты → фото =====
export type PortfolioProject = {
  slug: string;
  slot: string;
  title: string;
  material: string;
  price: string;
  defaultImg: string;
};

export type PortfolioCategory = {
  slug: string;
  title: string;
  tag: string;
  description: string;
  coverDefault: string;
  projects: PortfolioProject[];
};

export const PORTFOLIO_CATEGORIES: PortfolioCategory[] = [
  {
    slug: "kitchens",
    title: "Кухни",
    tag: "Кухня",
    description: "Кухни на заказ под ваши размеры и стиль",
    coverDefault: KITCHEN_IMG,
    projects: [
      { slug: "kitchen-1", slot: "pf_kitchens_1", title: "Кухня МДФ эмаль", material: "Фурнитура Blum, столешница Pfleiderer", price: "от 185 000 ₽", defaultImg: KITCHEN_IMG },
      { slug: "kitchen-2", slot: "pf_kitchens_2", title: "Угловая кухня loft", material: "МДФ плёнка, столешница из акрила", price: "от 210 000 ₽", defaultImg: KITCHEN_IMG },
      { slug: "kitchen-3", slot: "pf_kitchens_3", title: "Кухня в скандинавском стиле", material: "ЛДСП Egger, фасады матовые", price: "от 160 000 ₽", defaultImg: KITCHEN_IMG },
    ],
  },
  {
    slug: "wardrobes",
    title: "Шкафы-купе",
    tag: "Шкаф",
    description: "Вместительные шкафы-купе любой конфигурации",
    coverDefault: WARDROBE_IMG,
    projects: [
      { slug: "wardrobe-1", slot: "pf_wardrobes_1", title: "Шкаф-купе в спальню", material: "ЛДСП Egger, система Hettich", price: "от 64 000 ₽", defaultImg: WARDROBE_IMG },
      { slug: "wardrobe-2", slot: "pf_wardrobes_2", title: "Шкаф с зеркалом в прихожую", material: "ЛДСП + зеркало, профиль Aristo", price: "от 72 000 ₽", defaultImg: WARDROBE_IMG },
    ],
  },
  {
    slug: "living-rooms",
    title: "Гостиные",
    tag: "Гостиная",
    description: "Стенки, стеллажи и ТВ-зоны для гостиной",
    coverDefault: LIVING_IMG,
    projects: [
      { slug: "living-1", slot: "pf_living_1", title: "Гостиная со стеллажами", material: "МДФ + шпон дуба, фурнитура Grass", price: "от 120 000 ₽", defaultImg: LIVING_IMG },
      { slug: "living-2", slot: "pf_living_2", title: "ТВ-зона с подсветкой", material: "МДФ глянец, LED-подсветка", price: "от 98 000 ₽", defaultImg: LIVING_IMG },
    ],
  },
  {
    slug: "dressing-rooms",
    title: "Гардеробные",
    tag: "Гардеробная",
    description: "Системы хранения и гардеробные комнаты",
    coverDefault: WARDROBE_IMG,
    projects: [
      { slug: "dressing-1", slot: "pf_dressing_1", title: "Гардеробная система", material: "ЛДСП + алюминиевый профиль", price: "от 95 000 ₽", defaultImg: WARDROBE_IMG },
    ],
  },
  {
    slug: "business",
    title: "Мебель для бизнеса",
    tag: "Бизнес",
    description: "Мебель для офисов, кафе и магазинов",
    coverDefault: LIVING_IMG,
    projects: [
      { slug: "business-1", slot: "pf_business_1", title: "Ресепшн для офиса", material: "МДФ, искусственный камень", price: "от 130 000 ₽", defaultImg: LIVING_IMG },
      { slug: "business-2", slot: "pf_business_2", title: "Барная стойка для кафе", material: "ЛДСП, влагостойкая столешница", price: "от 110 000 ₽", defaultImg: KITCHEN_IMG },
    ],
  },
];

export function findCategory(slug: string): PortfolioCategory | undefined {
  return PORTFOLIO_CATEGORIES.find((c) => c.slug === slug);
}

export function findProject(categorySlug: string, projectSlug: string): { category: PortfolioCategory; project: PortfolioProject } | undefined {
  const category = findCategory(categorySlug);
  const project = category?.projects.find((p) => p.slug === projectSlug);
  if (category && project) return { category, project };
  return undefined;
}

// Сколько дополнительных фото-деталей на каждый проект
export const PORTFOLIO_DETAIL_COUNT = 14;

export function categoryCoverKey(slug: string): string {
  return `pf_cat_${slug}`;
}

function buildPortfolioSlots(): ImageSlot[] {
  const slots: ImageSlot[] = [];
  for (const category of PORTFOLIO_CATEGORIES) {
    slots.push({ key: categoryCoverKey(category.slug), label: `Папка «${category.title}» · Обложка`, group: "Портфолио", defaultUrl: category.coverDefault });
    for (const project of category.projects) {
      slots.push({ key: project.slot, label: `${category.title} · ${project.title} · Главное`, group: "Портфолио", defaultUrl: project.defaultImg });
      for (let d = 1; d <= PORTFOLIO_DETAIL_COUNT; d++) {
        slots.push({
          key: `${project.slot}_detail_${d}`,
          label: `${category.title} · ${project.title} · Деталь ${d}`,
          group: "Портфолио",
          defaultUrl: "",
        });
      }
    }
  }
  return slots;
}

export const IMAGE_SLOTS: ImageSlot[] = [
  { key: "hero", label: "Главное фото (Hero)", group: "Главный экран", defaultUrl: KITCHEN_IMG },
  { key: "cat_kitchen", label: "Каталог · Кухни", group: "Каталог", defaultUrl: KITCHEN_IMG },
  { key: "cat_wardrobe", label: "Каталог · Шкафы-купе", group: "Каталог", defaultUrl: WARDROBE_IMG },
  { key: "cat_kids", label: "Каталог · Детская", group: "Каталог", defaultUrl: KIDS_IMG },
  { key: "cat_living", label: "Каталог · Гостиные", group: "Каталог", defaultUrl: LIVING_IMG },
  ...buildPortfolioSlots(),
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

// Возвращает галерею проекта: главное фото + загруженные детали (пустые слоты пропускаются)
export function getProjectGallery(projectKey: string): string[] {
  const overrides = loadOverrides();
  const gallery: string[] = [getImageUrl(projectKey)];
  for (let d = 1; d <= PORTFOLIO_DETAIL_COUNT; d++) {
    const detailKey = `${projectKey}_detail_${d}`;
    const url = overrides[detailKey];
    if (url) gallery.push(url);
  }
  return gallery;
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