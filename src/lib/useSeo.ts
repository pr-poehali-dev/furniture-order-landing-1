import { useEffect } from "react";

const DEFAULT_TITLE = "Корпусная мебель на заказ в Барнауле — кухни, шкафы-купе | Свой Стиль";
const DEFAULT_DESCRIPTION =
  "Корпусная мебель на заказ по вашим размерам в Барнауле и Алтайском крае. Кухни, шкафы-купе, гардеробные, прихожие, детские. Производство с 2012 года. Замер и расчёт бесплатно.";

function setMeta(selector: string, attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

type SeoOptions = {
  title?: string;
  description?: string;
  canonicalPath?: string;
};

export function useSeo({ title, description, canonicalPath }: SeoOptions) {
  useEffect(() => {
    const finalTitle = title || DEFAULT_TITLE;
    const finalDescription = description || DEFAULT_DESCRIPTION;

    document.title = finalTitle;
    setMeta('meta[name="description"]', "name", "description", finalDescription);
    setMeta('meta[property="og:title"]', "property", "og:title", finalTitle);
    setMeta('meta[property="og:description"]', "property", "og:description", finalDescription);

    if (canonicalPath) {
      setCanonical(`https://svoistil22.ru${canonicalPath}`);
    }

    return () => {
      document.title = DEFAULT_TITLE;
      setMeta('meta[name="description"]', "name", "description", DEFAULT_DESCRIPTION);
      setMeta('meta[property="og:title"]', "property", "og:title", DEFAULT_TITLE);
      setMeta('meta[property="og:description"]', "property", "og:description", DEFAULT_DESCRIPTION);
      setCanonical("https://svoistil22.ru/");
    };
  }, [title, description, canonicalPath]);
}
