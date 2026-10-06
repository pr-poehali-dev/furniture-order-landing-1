import { useState } from "react";
import Icon from "@/components/ui/icon";
import {
  PortfolioProject,
  PORTFOLIO_DETAIL_COUNT,
  loadOverrides,
  projectDetailKeys,
  saveOverrides,
  uploadImage,
  useSiteImages,
  getProjectTitle,
  getProjectMaterial,
  titleKey,
  materialKey,
} from "@/lib/siteImages";
import ProjectDescriptionEditor from "@/components/admin/ProjectDescriptionEditor";

const MAX_PHOTOS = PORTFOLIO_DETAIL_COUNT + 1;
const PARALLEL = 3;

export default function ProjectGalleryCard({ project }: { project: PortfolioProject }) {
  useSiteImages();
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [message, setMessage] = useState<{ type: "error" | "info"; text: string } | null>(null);
  const [dragFrom, setDragFrom] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);

  const overrides = loadOverrides();
  const mainKey = project.slot;
  const detailKeys = projectDetailKeys(mainKey);
  const mainCustom = overrides[mainKey] || "";
  const details = detailKeys.map((k) => overrides[k]).filter(Boolean) as string[];
  const photos = [...(mainCustom ? [mainCustom] : []), ...details];
  const freeSlots = MAX_PHOTOS - photos.length;

  const writeGallery = async (list: string[]) => {
    const items: Record<string, string> = { [mainKey]: list[0] || "" };
    detailKeys.forEach((k, i) => {
      items[k] = list[i + 1] || "";
    });
    await saveOverrides(items);
  };

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter((f) => f.type.startsWith("image/"));
    e.target.value = "";
    if (!files.length) return;
    setMessage(null);

    const toUpload = files.slice(0, freeSlots);
    const skipped = files.length - toUpload.length;
    if (!toUpload.length) {
      setMessage({ type: "error", text: `В проекте уже ${MAX_PHOTOS} фото — это максимум. Удалите лишние, чтобы добавить новые.` });
      return;
    }

    setBusy(true);
    setProgress({ done: 0, total: toUpload.length });
    const results: (string | null)[] = new Array(toUpload.length).fill(null);
    let next = 0;
    let done = 0;

    const worker = async () => {
      while (next < toUpload.length) {
        const i = next++;
        try {
          results[i] = await uploadImage(toUpload[i]);
        } catch {
          results[i] = null;
        }
        done++;
        setProgress({ done, total: toUpload.length });
      }
    };

    try {
      await Promise.all(Array.from({ length: Math.min(PARALLEL, toUpload.length) }, worker));
      const uploaded = results.filter(Boolean) as string[];
      const failed = toUpload.length - uploaded.length;
      if (uploaded.length) await writeGallery([...photos, ...uploaded]);

      const notes: string[] = [];
      if (uploaded.length) notes.push(`Добавлено фото: ${uploaded.length}`);
      if (failed) notes.push(`не загрузилось: ${failed}`);
      if (skipped) notes.push(`не поместилось: ${skipped} (максимум ${MAX_PHOTOS} на проект)`);
      setMessage({ type: failed || !uploaded.length ? "error" : "info", text: notes.join(", ") });
    } catch {
      setMessage({ type: "error", text: "Не удалось сохранить фото. Попробуйте ещё раз." });
    } finally {
      setBusy(false);
      setProgress(null);
    }
  };

  const runChange = async (list: string[]) => {
    setMessage(null);
    setBusy(true);
    try {
      await writeGallery(list);
    } catch {
      setMessage({ type: "error", text: "Не удалось сохранить изменения." });
    } finally {
      setBusy(false);
    }
  };

  const moveTo = (from: number, to: number) => {
    if (from === to || from < 0 || to < 0) return;
    const list = [...photos];
    const [item] = list.splice(from, 1);
    list.splice(to, 0, item);
    runChange(list);
  };

  const removeAt = (i: number) => runChange(photos.filter((_, idx) => idx !== i));
  const makeMain = (i: number) => runChange([photos[i], ...photos.filter((_, idx) => idx !== i)]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
      <div className="relative h-44 bg-gray-100">
        <img src={photos[0] || project.defaultImg} alt={project.title} className="w-full h-full object-cover" />
        {!photos.length && (
          <span className="absolute top-3 left-3 bg-gray-900/70 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            Стандартное фото
          </span>
        )}
        {photos.length > 0 && (
          <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            Ваших фото: {photos.length}
          </span>
        )}
        {busy && (
          <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center gap-2 text-white text-sm">
            <Icon name="Loader2" size={22} className="animate-spin" />
            {progress ? `Загружаю ${progress.done} из ${progress.total}` : "Сохраняю..."}
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="font-display font-bold text-gray-900 text-sm uppercase tracking-wide">{getProjectTitle(project)}</div>
        <div className="text-gray-400 text-xs mt-0.5 mb-3">{getProjectMaterial(project)}</div>

        <ProjectDescriptionEditor
          projectKey={titleKey(project.slot)}
          label="Название"
          defaultValue={project.title}
          multiline={false}
          max={80}
          placeholder="Например: Угловая кухня в стиле лофт"
        />
        <ProjectDescriptionEditor
          projectKey={materialKey(project.slot)}
          label="Материалы"
          defaultValue={project.material}
          multiline={false}
          max={150}
          placeholder="Например: МДФ эмаль, фурнитура Blum"
        />
        <ProjectDescriptionEditor projectKey={project.slot} />

        {photos.length > 0 && (
          <div className="grid grid-cols-5 gap-1.5 mb-3">
            {photos.map((url, i) => (
              <div
                key={url + i}
                draggable={!busy}
                onDragStart={(e) => {
                  setDragFrom(i);
                  e.dataTransfer.effectAllowed = "move";
                }}
                onDragOver={(e) => {
                  if (dragFrom === null) return;
                  e.preventDefault();
                  if (dragOver !== i) setDragOver(i);
                }}
                onDragLeave={() => setDragOver((v) => (v === i ? null : v))}
                onDrop={(e) => {
                  e.preventDefault();
                  if (dragFrom !== null) moveTo(dragFrom, i);
                  setDragFrom(null);
                  setDragOver(null);
                }}
                onDragEnd={() => {
                  setDragFrom(null);
                  setDragOver(null);
                }}
                className={`group relative aspect-square rounded-lg overflow-hidden border-2 cursor-grab active:cursor-grabbing transition-all ${
                  dragOver === i && dragFrom !== i ? "border-orange-400 scale-105 ring-2 ring-orange-300" : i === 0 ? "border-orange-500" : "border-transparent"
                } ${dragFrom === i ? "opacity-40" : ""}`}
              >
                <img src={url} alt="" draggable={false} className="w-full h-full object-cover pointer-events-none" />
                {i === 0 && (
                  <span className="absolute bottom-0 inset-x-0 bg-orange-500 text-white text-[9px] font-semibold text-center leading-4">ГЛАВНОЕ</span>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-wrap items-center justify-center content-center gap-1">
                  {i > 0 && (
                    <button onClick={() => moveTo(i, i - 1)} disabled={busy} title="Сдвинуть влево" className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center text-gray-700">
                      <Icon name="ChevronLeft" size={12} />
                    </button>
                  )}
                  {i < photos.length - 1 && (
                    <button onClick={() => moveTo(i, i + 1)} disabled={busy} title="Сдвинуть вправо" className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center text-gray-700">
                      <Icon name="ChevronRight" size={12} />
                    </button>
                  )}
                  {i !== 0 && (
                    <button onClick={() => makeMain(i)} disabled={busy} title="Сделать главным" className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center text-orange-500">
                      <Icon name="Star" size={12} />
                    </button>
                  )}
                  <button onClick={() => removeAt(i)} disabled={busy} title="Удалить" className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center text-red-500">
                    <Icon name="X" size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <label className={`mt-auto ${busy || freeSlots <= 0 ? "pointer-events-none opacity-60" : "cursor-pointer"}`}>
          <div className="btn-orange w-full py-2.5 rounded-xl text-xs text-center flex items-center justify-center gap-1.5">
            <Icon name="ImagePlus" size={14} className="text-white" />
            {freeSlots > 0 ? "Добавить фото (можно несколько)" : `Максимум ${MAX_PHOTOS} фото`}
          </div>
          <input type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} disabled={busy || freeSlots <= 0} />
        </label>

        {message && (
          <p className={`text-xs mt-2 ${message.type === "error" ? "text-red-500" : "text-green-600"}`}>{message.text}</p>
        )}
      </div>
    </div>
  );
}