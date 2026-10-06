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
  adminLogin,
  adminLogout,
  getAdminPassword,
  loadSiteImages,
  migrateLocal,
  PORTFOLIO_CATEGORIES,
  categoryCoverKey,
} from "@/lib/siteImages";
import ProjectGalleryCard from "@/components/admin/ProjectGalleryCard";

function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setLoading(true);
    setError("");
    try {
      const ok = await adminLogin(password);
      if (ok) onSuccess();
      else setError("Неверный пароль");
    } catch {
      setError("Нет связи с сервером. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-xl">
        <div className="w-12 h-12 rounded-xl gradient-orange flex items-center justify-center mb-5">
          <Icon name="Lock" size={22} className="text-white" />
        </div>
        <h1 className="font-display font-bold text-2xl text-gray-900 uppercase tracking-wide">Вход в админку</h1>
        <p className="text-gray-500 text-sm mt-1 mb-6">Свой Стиль · управление фото</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
          autoFocus
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-orange-500"
        />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <button type="submit" disabled={loading || !password} className="btn-orange w-full py-3 rounded-xl text-sm mt-4 disabled:opacity-60">
          {loading ? "Проверяю..." : "Войти"}
        </button>
      </form>
    </div>
  );
}

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
      await saveOverride(slot.key, url);
    } catch {
      setError("Ошибка загрузки. Попробуйте ещё раз.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleReset = async () => {
    setError("");
    setUploading(true);
    try {
      await resetOverride(slot.key);
    } catch {
      setError("Не удалось вернуть стандартное фото.");
    } finally {
      setUploading(false);
    }
  };

  const isCustom = getImageUrl(slot.key) !== slot.defaultUrl;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="relative h-44 bg-gray-100">
        {currentUrl ? (
          <img src={currentUrl} alt={slot.label} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-1">
            <Icon name="ImageOff" size={28} />
            <span className="text-xs text-gray-400">Нет фото</span>
          </div>
        )}
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
              onClick={handleReset}
              disabled={uploading}
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
  const [authed, setAuthed] = useState(() => !!getAdminPassword());
  const [activeCat, setActiveCat] = useState(PORTFOLIO_CATEGORIES[0].slug);
  const category = PORTFOLIO_CATEGORIES.find((c) => c.slug === activeCat);

  const handleLogin = () => {
    setAuthed(true);
    loadSiteImages().then(() => migrateLocal()).catch(() => undefined);
  };

  const handleLogout = () => {
    adminLogout();
    setAuthed(false);
  };

  if (!authed) return <AdminLogin onSuccess={handleLogin} />;

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
          <div className="flex items-center gap-2">
            <a href="/" className="btn-outline-orange px-4 py-2 rounded-lg text-xs flex items-center gap-1.5">
              <Icon name="ExternalLink" size={14} />
              Открыть сайт
            </a>
            <button onClick={handleLogout} className="px-3 py-2 rounded-lg text-xs text-white/70 hover:text-white flex items-center gap-1.5">
              <Icon name="LogOut" size={14} />
              Выйти
            </button>
          </div>
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

        {GROUPS.filter((g) => g !== "Портфолио").map((group) => (
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

        <section className="mb-10">
          <h2 className="font-display font-bold text-gray-900 text-2xl uppercase tracking-wide mb-2 flex items-center gap-2">
            <span className="w-1.5 h-6 gradient-orange rounded-full" />
            Портфолио
          </h2>
          <p className="text-gray-500 text-sm mb-5">
            Выберите папку и нажмите «Добавить фото» у нужного проекта. Можно выделить сразу несколько фото (Ctrl или Shift).
            Первое фото — главное, его видно на обложке. Наведите на миниатюру, чтобы сделать фото главным или удалить его.
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {PORTFOLIO_CATEGORIES.map((c) => (
              <button
                key={c.slug}
                onClick={() => setActiveCat(c.slug)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${activeCat === c.slug ? "bg-orange-500 text-white" : "bg-white border border-gray-200 text-gray-700 hover:border-orange-400"}`}
              >
                {c.title} <span className="opacity-70">· {c.projects.length}</span>
              </button>
            ))}
          </div>

          {category && (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
                <SlotCard slot={IMAGE_SLOTS.find((s) => s.key === categoryCoverKey(category.slug))!} />
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {category.projects.map((p) => (
                  <ProjectGalleryCard key={p.slug} project={p} />
                ))}
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}