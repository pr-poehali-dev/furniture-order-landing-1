import { useState } from "react";
import Icon from "@/components/ui/icon";
import {
  IMAGE_SLOTS,
  ImageSlot,
  getImageUrl,
  saveOverride,
  resetOverride,
  uploadImage,
  useSiteImages,
} from "@/lib/siteImages";

const GROUPS = ["Главный экран", "Каталог", "Портфолио"] as const;

function SlotCard({ slot }: { slot: ImageSlot }) {
  const getUrl = useSiteImages();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const currentUrl = getUrl(slot.key);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const url = await uploadImage(file);
      saveOverride(slot.key, url);
    } catch {
      setError("Ошибка загрузки. Попробуйте ещё раз.");
    } finally {
      setUploading(false);
    }
  };

  const isCustom = getImageUrl(slot.key) !== slot.defaultUrl;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="relative h-44 bg-gray-100">
        <img src={currentUrl} alt={slot.label} className="w-full h-full object-cover" />
        {uploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="flex items-center gap-2 text-white text-sm">
              <Icon name="Loader2" size={18} className="animate-spin" />
              Загрузка...
            </div>
          </div>
        )}
        {isCustom && (
          <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            Ваше фото
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="font-display font-bold text-gray-900 text-sm uppercase tracking-wide mb-3">{slot.label}</div>
        <div className="flex gap-2">
          <label className="flex-1 cursor-pointer">
            <div className="btn-orange w-full py-2.5 rounded-xl text-xs text-center flex items-center justify-center gap-1.5">
              <Icon name="Upload" size={14} className="text-white" />
              Загрузить
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
          </label>
          {isCustom && (
            <button
              onClick={() => resetOverride(slot.key)}
              className="px-3 py-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
              title="Вернуть стандартное"
            >
              <Icon name="RotateCcw" size={14} />
            </button>
          )}
        </div>
        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
      </div>
    </div>
  );
}

export default function Admin() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gray-950 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded gradient-orange flex items-center justify-center">
              <Icon name="ImagePlus" size={18} className="text-white" />
            </div>
            <div>
              <div className="font-display font-bold text-lg tracking-wide uppercase">Управление фото</div>
              <div className="text-white/50 text-xs">Свой Стиль · загрузка изображений сайта</div>
            </div>
          </div>
          <a href="/" className="btn-outline-orange px-4 py-2 rounded-lg text-xs flex items-center gap-1.5">
            <Icon name="ExternalLink" size={14} />
            Открыть сайт
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8">
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-8 flex items-start gap-3">
          <Icon name="Info" size={18} className="text-orange-500 mt-0.5 shrink-0" />
          <p className="text-gray-600 text-sm leading-relaxed">
            Нажмите «Загрузить» на нужном блоке и выберите фото с устройства. Изменения сразу появятся на сайте.
            Кнопка со стрелкой возвращает стандартное изображение.
          </p>
        </div>

        {GROUPS.map((group) => (
          <section key={group} className="mb-10">
            <h2 className="font-display font-bold text-gray-900 text-2xl uppercase tracking-wide mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 gradient-orange rounded-full" />
              {group}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {IMAGE_SLOTS.filter((s) => s.group === group).map((slot) => (
                <SlotCard key={slot.key} slot={slot} />
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
