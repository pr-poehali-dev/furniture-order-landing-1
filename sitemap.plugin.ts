import { readFileSync } from "fs";
import path from "path";
import type { Plugin } from "vite";

const SITE = "https://svoistil22.ru";
const IMAGES_API_URL = "https://functions.poehali.dev/c6c5c0ef-d08a-4655-9189-268225f67749";
const CATEGORIES: [string, string, string][] = [
  ["kitchens", "kitchens", "kitchen"],
  ["wardrobes", "wardrobes", "wardrobe"],
  ["living", "living-rooms", "living"],
  ["bathrooms", "bathrooms", "bathroom"],
  ["kids", "kids", "kids"],
  ["business", "business", "business"],
];

const day = (sec?: number) => new Date(sec ? sec * 1000 : Date.now()).toISOString().slice(0, 10);

const urlTag = (loc: string, lastmod: string, priority: string, changefreq = "weekly") =>
  `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>\n`;

export default function sitemapPlugin(): Plugin {
  return {
    name: "auto-sitemap",
    apply: "build",
    async generateBundle() {
      let images: Record<string, string>;
      let added: Record<string, number>;
      try {
        const res = await fetch(IMAGES_API_URL, { signal: AbortSignal.timeout(15000) });
        if (!res.ok) throw new Error(String(res.status));
        const data = await res.json();
        images = data.images || {};
        added = data.added || {};
      } catch (e) {
        this.warn(`sitemap: не удалось получить проекты, использую запасной файл (${e})`);
        const fallback = readFileSync(path.resolve(__dirname, "sitemap.fallback.xml"), "utf-8");
        this.emitFile({ type: "asset", fileName: "sitemap.xml", source: fallback });
        return;
      }

      const projects: Record<string, Record<number, number>> = {};
      for (const key of Object.keys(images)) {
        const m = key.match(/^pf_([a-z]+)_(\d+)$/);
        if (m) (projects[m[1]] ??= {})[Number(m[2])] = added[key] || 0;
      }

      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
      xml += urlTag(`${SITE}/`, day(), "1.0");
      for (const [code, catSlug, prefix] of CATEGORIES) {
        const items = projects[code];
        if (!items) continue;
        const nums = Object.keys(items).map(Number).sort((a, b) => a - b);
        xml += urlTag(`${SITE}/portfolio/${catSlug}`, day(Math.max(...nums.map((n) => items[n]))), "0.8");
        for (const n of nums) xml += urlTag(`${SITE}/portfolio/${catSlug}/${prefix}-${n}`, day(items[n]), "0.6", "monthly");
      }
      xml += "</urlset>\n";

      this.emitFile({ type: "asset", fileName: "sitemap.xml", source: xml });
    },
  };
}
