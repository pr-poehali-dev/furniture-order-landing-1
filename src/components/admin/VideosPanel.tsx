import { useEffect, useState } from "react";
import Icon from "@/components/ui/icon";
import { uploadImage } from "@/lib/siteImages";
import {
  Video,
  fetchVideos,
  uploadVideoFile,
  capturePoster,
  createVideo,
  updateVideoTitle,
  deleteVideo,
  reorderVideos,
  MAX_VIDEO_MB,
} from "@/lib/videos";

function VideoRow({
  video,
  index,
  total,
  onMove,
  onDelete,
}: {
  video: Video;
  index: number;
  total: number;
  onMove: (dir: -1 | 1) => void;
  onDelete: () => void;
}) {
  const [title, setTitle] = useState(video.title);
  const [saved, setSaved] = useState(video.title);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await updateVideoTitle(video.id, title);
      setSaved(title);
    } catch {
      alert("Не удалось сохранить название");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
      <div className="relative aspect-[9/16] max-h-80 bg-black">
        <video src={video.video_url} poster={video.poster_url || undefined} controls playsInline preload="metadata" className="w-full h-full object-contain" />
        <span className="absolute top-3 left-3 bg-gray-900/80 text-white text-xs font-semibold px-2.5 py-1 rounded-full">№ {index + 1}</span>
      </div>
      <div className="p-4 flex flex-col gap-3">
        <div className="flex gap-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Название, например: Кухня в ЖК Европейский"
            maxLength={200}
            className="flex-1 min-w-0 px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-orange-500"
          />
          {title !== saved && (
            <button onClick={save} disabled={saving} className="btn-orange px-3 py-2 rounded-xl text-xs disabled:opacity-60">
              {saving ? "..." : "Сохранить"}
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <button onClick={() => onMove(-1)} disabled={index === 0} title="Левее" className="px-3 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30">
            <Icon name="ArrowLeft" size={14} />
          </button>
          <button onClick={() => onMove(1)} disabled={index === total - 1} title="Правее" className="px-3 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30">
            <Icon name="ArrowRight" size={14} />
          </button>
          <button onClick={onDelete} className="ml-auto px-3 py-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 text-xs flex items-center gap-1.5">
            <Icon name="Trash2" size={14} />
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VideosPanel() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<number | null>(null);
  const [stage, setStage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchVideos()
      .then(setVideos)
      .catch(() => setError("Не удалось загрузить список видео"))
      .finally(() => setLoading(false));
  }, []);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      setError("Выберите видеофайл (MP4 или MOV)");
      return;
    }
    if (file.size > MAX_VIDEO_MB * 1024 * 1024) {
      setError(`Файл больше ${MAX_VIDEO_MB} МБ. Сожмите видео или обрежьте его.`);
      return;
    }
    setError("");
    setProgress(0);
    try {
      setStage("Готовлю обложку...");
      const posterBlob = await capturePoster(file);
      const poster_url = posterBlob ? await uploadImage(new File([posterBlob], "poster.jpg", { type: "image/jpeg" })).catch(() => null) : null;
      setStage("Загружаю видео...");
      const video_url = await uploadVideoFile(file, setProgress);
      setStage("Сохраняю...");
      const title = file.name.replace(/\.[^.]+$/, "").slice(0, 200);
      const { id } = await createVideo({ title, video_url, poster_url });
      setVideos((prev) => [...prev, { id, title, video_url, poster_url }]);
    } catch (err) {
      setError(
        err instanceof Error && err.message === "Неверный пароль"
          ? "Сессия устарела — выйдите из админки и войдите заново."
          : "Загрузка прервалась. Проверьте интернет и попробуйте ещё раз.",
      );
    } finally {
      setProgress(null);
      setStage("");
    }
  };

  const move = async (index: number, dir: -1 | 1) => {
    const next = [...videos];
    const [item] = next.splice(index, 1);
    next.splice(index + dir, 0, item);
    setVideos(next);
    await reorderVideos(next.map((v) => v.id)).catch(() => setError("Не удалось сохранить порядок"));
  };

  const remove = async (video: Video) => {
    if (!confirm("Удалить это видео с сайта?")) return;
    try {
      await deleteVideo(video.id);
      setVideos((prev) => prev.filter((v) => v.id !== video.id));
    } catch {
      setError("Не удалось удалить видео");
    }
  };

  const busy = progress !== null;

  return (
    <section>
      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
        <Icon name="Info" size={18} className="text-orange-500 mt-0.5 shrink-0" />
        <p className="text-gray-600 text-sm leading-relaxed">
          Загрузите ролик с телефона или компьютера (MP4 или MOV, до {MAX_VIDEO_MB} МБ). Лучше всего смотрятся вертикальные видео длиной до 1–2 минут.
          Обложка создаётся автоматически. Блок «Видеообзоры» появится на сайте, как только будет хотя бы одно видео.
        </p>
      </div>

      <label className={`block mb-6 ${busy ? "pointer-events-none" : "cursor-pointer"}`}>
        <div className="border-2 border-dashed border-orange-300 hover:border-orange-500 bg-white rounded-2xl p-8 text-center transition-colors">
          {busy ? (
            <div className="max-w-sm mx-auto">
              <div className="text-gray-700 text-sm font-semibold mb-3 flex items-center justify-center gap-2">
                <Icon name="Loader2" size={16} className="animate-spin text-orange-500" />
                {stage} {stage.startsWith("Загружаю") && `${progress}%`}
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full gradient-orange transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-gray-400 text-xs mt-3">Не закрывайте страницу до окончания загрузки</p>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-xl gradient-orange flex items-center justify-center mx-auto mb-3">
                <Icon name="Upload" size={22} className="text-white" />
              </div>
              <div className="font-display font-bold text-gray-900 uppercase tracking-wide text-sm">Добавить видео</div>
              <div className="text-gray-400 text-xs mt-1">Нажмите и выберите файл</div>
            </>
          )}
        </div>
        <input type="file" accept="video/mp4,video/quicktime,video/webm,video/*" className="hidden" onChange={handleFile} disabled={busy} />
      </label>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {loading ? (
        <div className="text-gray-400 text-sm flex items-center gap-2"><Icon name="Loader2" size={16} className="animate-spin" /> Загружаю...</div>
      ) : videos.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">
          <Icon name="Video" size={32} className="mx-auto mb-2" />
          Видео пока нет
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {videos.map((v, i) => (
            <VideoRow key={v.id} video={v} index={i} total={videos.length} onMove={(d) => move(i, d)} onDelete={() => remove(v)} />
          ))}
        </div>
      )}
    </section>
  );
}
