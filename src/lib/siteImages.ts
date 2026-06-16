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
    description: "Угловые, прямые, П-образные — любая планировка",
    coverDefault: KITCHEN_IMG,
    projects: [
      { slug: "kitchen-1", slot: "pf_kitchens_1", title: "Кухня МДФ эмаль", material: "Фурнитура Blum, столешница Pfleiderer", price: "от 185 000 ₽", defaultImg: KITCHEN_IMG },
      { slug: "kitchen-2", slot: "pf_kitchens_2", title: "Угловая кухня loft", material: "МДФ плёнка, столешница из акрила", price: "от 210 000 ₽", defaultImg: KITCHEN_IMG },
      { slug: "kitchen-3", slot: "pf_kitchens_3", title: "Кухня в скандинавском стиле", material: "ЛДСП Egger, фасады матовые", price: "от 160 000 ₽", defaultImg: KITCHEN_IMG },
      { slug: "kitchen-4", slot: "pf_kitchens_4", title: "П-образная кухня", material: "МДФ эмаль, кварцевая столешница", price: "от 240 000 ₽", defaultImg: KITCHEN_IMG },
      { slug: "kitchen-5", slot: "pf_kitchens_5", title: "Кухня с островом", material: "Шпон дуба, фурнитура Blum", price: "от 320 000 ₽", defaultImg: KITCHEN_IMG },
      { slug: "kitchen-6", slot: "pf_kitchens_6", title: "Прямая кухня минимализм", material: "ЛДСП Egger, без ручек push-to-open", price: "от 145 000 ₽", defaultImg: KITCHEN_IMG },
      { slug: "kitchen-7", slot: "pf_kitchens_7", title: "Кухня в классическом стиле", material: "МДФ с патиной, массив", price: "от 280 000 ₽", defaultImg: KITCHEN_IMG },
      { slug: "kitchen-8", slot: "pf_kitchens_8", title: "Глянцевая кухня", material: "МДФ глянец, столешница из акрила", price: "от 220 000 ₽", defaultImg: KITCHEN_IMG },
      { slug: "kitchen-9", slot: "pf_kitchens_9", title: "Кухня-гостиная", material: "МДФ плёнка, барная стойка", price: "от 260 000 ₽", defaultImg: KITCHEN_IMG },
      { slug: "kitchen-10", slot: "pf_kitchens_10", title: "Компактная кухня для студии", material: "ЛДСП, встроенная техника", price: "от 130 000 ₽", defaultImg: KITCHEN_IMG },
    ],
  },
  {
    slug: "wardrobes",
    title: "Шкафы и гардеробные",
    tag: "Шкафы",
    description: "Вместительные системы хранения — распашные и купе",
    coverDefault: WARDROBE_IMG,
    projects: [
      { slug: "wardrobe-1", slot: "pf_wardrobes_1", title: "Шкаф-купе в спальню", material: "ЛДСП Egger, система Hettich", price: "от 64 000 ₽", defaultImg: WARDROBE_IMG },
      { slug: "wardrobe-2", slot: "pf_wardrobes_2", title: "Шкаф с зеркалом в прихожую", material: "ЛДСП + зеркало, профиль Aristo", price: "от 72 000 ₽", defaultImg: WARDROBE_IMG },
      { slug: "wardrobe-3", slot: "pf_wardrobes_3", title: "Гардеробная система", material: "ЛДСП + алюминиевый профиль", price: "от 95 000 ₽", defaultImg: WARDROBE_IMG },
      { slug: "wardrobe-4", slot: "pf_wardrobes_4", title: "Распашной шкаф до потолка", material: "МДФ эмаль, доводчики Blum", price: "от 88 000 ₽", defaultImg: WARDROBE_IMG },
      { slug: "wardrobe-5", slot: "pf_wardrobes_5", title: "Угловой шкаф-купе", material: "ЛДСП Egger, зеркальные двери", price: "от 99 000 ₽", defaultImg: WARDROBE_IMG },
      { slug: "wardrobe-6", slot: "pf_wardrobes_6", title: "Гардеробная комната", material: "ЛДСП + сетчатые корзины", price: "от 140 000 ₽", defaultImg: WARDROBE_IMG },
      { slug: "wardrobe-7", slot: "pf_wardrobes_7", title: "Шкаф с фотопечатью", material: "Купе, профиль Aristo, фотопечать", price: "от 105 000 ₽", defaultImg: WARDROBE_IMG },
      { slug: "wardrobe-8", slot: "pf_wardrobes_8", title: "Встроенный шкаф в нишу", material: "ЛДСП Egger, подсветка LED", price: "от 78 000 ₽", defaultImg: WARDROBE_IMG },
      { slug: "wardrobe-9", slot: "pf_wardrobes_9", title: "Гардеробная П-образная", material: "ЛДСП + штанги и полки на заказ", price: "от 165 000 ₽", defaultImg: WARDROBE_IMG },
      { slug: "wardrobe-10", slot: "pf_wardrobes_10", title: "Шкаф в детскую", material: "ЛДСП, безопасные кромки", price: "от 62 000 ₽", defaultImg: WARDROBE_IMG },
    ],
  },
  {
    slug: "living-rooms",
    title: "Гостиные и прихожие",
    tag: "Гостиная",
    description: "Стенки, стеллажи, ТВ-зоны, прихожие под ваш стиль",
    coverDefault: LIVING_IMG,
    projects: [
      { slug: "living-1", slot: "pf_living_1", title: "Гостиная со стеллажами", material: "МДФ + шпон дуба, фурнитура Grass", price: "от 120 000 ₽", defaultImg: LIVING_IMG },
      { slug: "living-2", slot: "pf_living_2", title: "ТВ-зона с подсветкой", material: "МДФ глянец, LED-подсветка", price: "от 98 000 ₽", defaultImg: LIVING_IMG },
      { slug: "living-3", slot: "pf_living_3", title: "Прихожая со шкафом", material: "ЛДСП Egger, банкетка", price: "от 85 000 ₽", defaultImg: LIVING_IMG },
      { slug: "living-4", slot: "pf_living_4", title: "Модульная гостиная", material: "МДФ плёнка, открытые полки", price: "от 130 000 ₽", defaultImg: LIVING_IMG },
      { slug: "living-5", slot: "pf_living_5", title: "Стенка-горка", material: "ЛДСП + стекло, подсветка", price: "от 110 000 ₽", defaultImg: LIVING_IMG },
      { slug: "living-6", slot: "pf_living_6", title: "Прихожая с обувницей", material: "МДФ эмаль, зеркало", price: "от 76 000 ₽", defaultImg: LIVING_IMG },
      { slug: "living-7", slot: "pf_living_7", title: "Библиотека-стеллаж", material: "Шпон дуба, фурнитура Blum", price: "от 155 000 ₽", defaultImg: LIVING_IMG },
      { slug: "living-8", slot: "pf_living_8", title: "ТВ-стенка в стиле лофт", material: "ЛДСП под бетон, металл", price: "от 125 000 ₽", defaultImg: LIVING_IMG },
      { slug: "living-9", slot: "pf_living_9", title: "Узкая прихожая", material: "МДФ глянец, крючки и полки", price: "от 58 000 ₽", defaultImg: LIVING_IMG },
      { slug: "living-10", slot: "pf_living_10", title: "Гостиная-кабинет", material: "Шпон + стол на заказ", price: "от 175 000 ₽", defaultImg: LIVING_IMG },
    ],
  },
  {
    slug: "bathrooms",
    title: "Санузлы",
    tag: "Санузел",
    description: "Влагостойкая мебель: тумбы, пеналы, шкафчики",
    coverDefault: WARDROBE_IMG,
    projects: [
      { slug: "bathroom-1", slot: "pf_bathrooms_1", title: "Тумба под раковину", material: "Влагостойкий ЛДСП, фасады МДФ", price: "от 38 000 ₽", defaultImg: WARDROBE_IMG },
      { slug: "bathroom-2", slot: "pf_bathrooms_2", title: "Пенал для ванной", material: "МДФ эмаль, доводчики Blum", price: "от 42 000 ₽", defaultImg: WARDROBE_IMG },
      { slug: "bathroom-3", slot: "pf_bathrooms_3", title: "Зеркальный шкафчик", material: "Влагостойкий МДФ, подсветка", price: "от 28 000 ₽", defaultImg: WARDROBE_IMG },
      { slug: "bathroom-4", slot: "pf_bathrooms_4", title: "Комплект мебели для ванной", material: "МДФ глянец, столешница из камня", price: "от 95 000 ₽", defaultImg: WARDROBE_IMG },
      { slug: "bathroom-5", slot: "pf_bathrooms_5", title: "Подвесная тумба", material: "ЛДСП влагостойкий, push-to-open", price: "от 45 000 ₽", defaultImg: WARDROBE_IMG },
      { slug: "bathroom-6", slot: "pf_bathrooms_6", title: "Шкаф над стиральной машиной", material: "Влагостойкий ЛДСП Egger", price: "от 34 000 ₽", defaultImg: WARDROBE_IMG },
      { slug: "bathroom-7", slot: "pf_bathrooms_7", title: "Угловая тумба", material: "МДФ эмаль, фурнитура Hettich", price: "от 40 000 ₽", defaultImg: WARDROBE_IMG },
      { slug: "bathroom-8", slot: "pf_bathrooms_8", title: "Пенал с корзиной для белья", material: "Влагостойкий МДФ", price: "от 52 000 ₽", defaultImg: WARDROBE_IMG },
      { slug: "bathroom-9", slot: "pf_bathrooms_9", title: "Мебель для гостевого санузла", material: "ЛДСП влагостойкий, зеркало", price: "от 31 000 ₽", defaultImg: WARDROBE_IMG },
      { slug: "bathroom-10", slot: "pf_bathrooms_10", title: "Тумба с двойной раковиной", material: "МДФ глянец, столешница из акрила", price: "от 110 000 ₽", defaultImg: WARDROBE_IMG },
    ],
  },
  {
    slug: "kids",
    title: "Детские",
    tag: "Детская",
    description: "Безопасные материалы и удобные системы хранения",
    coverDefault: KIDS_IMG,
    projects: [
      { slug: "kids-1", slot: "pf_kids_1", title: "Детская для школьника", material: "ЛДСП Egger, безопасные кромки", price: "от 95 000 ₽", defaultImg: KIDS_IMG },
      { slug: "kids-2", slot: "pf_kids_2", title: "Кровать-чердак со столом", material: "Массив берёзы, ЛДСП", price: "от 78 000 ₽", defaultImg: KIDS_IMG },
      { slug: "kids-3", slot: "pf_kids_3", title: "Детская для двоих", material: "ЛДСП, две кровати и шкаф", price: "от 140 000 ₽", defaultImg: KIDS_IMG },
      { slug: "kids-4", slot: "pf_kids_4", title: "Игровая зона с хранением", material: "ЛДСП, мягкие фасады", price: "от 65 000 ₽", defaultImg: KIDS_IMG },
      { slug: "kids-5", slot: "pf_kids_5", title: "Комната для подростка", material: "МДФ плёнка, рабочий стол", price: "от 120 000 ₽", defaultImg: KIDS_IMG },
      { slug: "kids-6", slot: "pf_kids_6", title: "Детская в скандинавском стиле", material: "ЛДСП белый, массив", price: "от 105 000 ₽", defaultImg: KIDS_IMG },
      { slug: "kids-7", slot: "pf_kids_7", title: "Шкаф и стеллаж для игрушек", material: "ЛДСП Egger, открытые полки", price: "от 58 000 ₽", defaultImg: KIDS_IMG },
      { slug: "kids-8", slot: "pf_kids_8", title: "Кровать с ящиками", material: "ЛДСП, выдвижные ящики", price: "от 52 000 ₽", defaultImg: KIDS_IMG },
      { slug: "kids-9", slot: "pf_kids_9", title: "Детская для девочки", material: "МДФ эмаль, нежные цвета", price: "от 115 000 ₽", defaultImg: KIDS_IMG },
      { slug: "kids-10", slot: "pf_kids_10", title: "Комната с двухъярусной кроватью", material: "Массив + ЛДСП, лестница с хранением", price: "от 130 000 ₽", defaultImg: KIDS_IMG },
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
      { slug: "business-3", slot: "pf_business_3", title: "Торговые стеллажи", material: "ЛДСП Egger, металлокаркас", price: "от 85 000 ₽", defaultImg: LIVING_IMG },
      { slug: "business-4", slot: "pf_business_4", title: "Витрина для магазина", material: "ЛДСП + стекло, подсветка LED", price: "от 95 000 ₽", defaultImg: LIVING_IMG },
      { slug: "business-5", slot: "pf_business_5", title: "Офисные рабочие места", material: "ЛДСП, металлические опоры", price: "от 120 000 ₽", defaultImg: LIVING_IMG },
      { slug: "business-6", slot: "pf_business_6", title: "Кухня для кафе", material: "Влагостойкий ЛДСП, нержавейка", price: "от 180 000 ₽", defaultImg: KITCHEN_IMG },
      { slug: "business-7", slot: "pf_business_7", title: "Стойка администратора", material: "МДФ глянец, искусственный камень", price: "от 105 000 ₽", defaultImg: LIVING_IMG },
      { slug: "business-8", slot: "pf_business_8", title: "Шкафы для документов", material: "ЛДСП Egger, замки", price: "от 70 000 ₽", defaultImg: LIVING_IMG },
      { slug: "business-9", slot: "pf_business_9", title: "Зона ожидания", material: "ЛДСП + мягкие модули", price: "от 90 000 ₽", defaultImg: LIVING_IMG },
      { slug: "business-10", slot: "pf_business_10", title: "Барная зона для бара", material: "ЛДСП под дерево, подсветка", price: "от 140 000 ₽", defaultImg: KITCHEN_IMG },
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
  { key: "cat_bathroom", label: "Каталог · Санузлы", group: "Каталог", defaultUrl: WARDROBE_IMG },
  { key: "cat_business", label: "Каталог · Мебель для бизнеса", group: "Каталог", defaultUrl: LIVING_IMG },
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