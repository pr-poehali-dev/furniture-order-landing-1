import { useRef, useState } from "react";
import Icon from "@/components/ui/icon";
import { useVideos, Video } from "@/lib/videos";

function VideoCard({ video }: { video: Video }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const play = () => {
    setPlaying(true);
    requestAnimationFrame(() => ref.current?.play().catch(() => undefined));
  };

  return (
    <div className="group rounded-2xl overflow-hidden bg-gray-900 shadow-xl shadow-black/40 ring-1 ring-white/10 h-full flex flex-col">
      <div className="relative aspect-[9/16] max-h-[70vh] sm:max-h-none bg-black">
        <video
          ref={ref}
          src={video.video_url}
          poster={video.poster_url || undefined}
          controls={playing}
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {!playing && (
          <button onClick={play} className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/70 via-black/10 to-transparent" aria-label="Смотреть видео">
            <span className="w-16 h-16 rounded-full gradient-orange flex items-center justify-center shadow-lg shadow-orange-500/40 transition-transform group-hover:scale-110">
              <Icon name="Play" size={26} className="text-white ml-1" />
            </span>
            {video.title && (
              <span className="absolute bottom-0 left-0 right-0 p-4 text-left text-white font-display font-bold text-sm uppercase tracking-wide">
                {video.title}
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default function IndexVideos() {
  const { videos } = useVideos();
  const trackRef = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);

  if (videos.length === 0) return null;

  const goTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const next = Math.max(0, Math.min(videos.length - 1, i));
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
  };

  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const next = Math.round(el.scrollLeft / el.clientWidth);
    if (next !== idx) {
      el.querySelectorAll("video").forEach((v) => v.pause());
      setIdx(next);
    }
  };

  return (
    <section id="videos" className="py-24 gradient-dark relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center mb-10 sm:mb-14">
          <div className="text-orange-500 font-display font-semibold text-sm tracking-widest uppercase mb-3">Смотрите вживую</div>
          <h2 className="section-title text-[1.75rem] sm:text-4xl lg:text-[2.75rem] text-white">Видеообзоры</h2>
          <p className="text-white/60 text-base sm:text-lg mt-3 sm:mt-4 max-w-xl mx-auto">Готовые проекты наших клиентов — как мебель выглядит и работает в жизни</p>
        </div>

        <div
          ref={trackRef}
          onScroll={onScroll}
          className="flex sm:grid sm:grid-cols-3 lg:grid-cols-4 sm:gap-5 overflow-x-auto sm:overflow-visible snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {videos.map((v) => (
            <div key={v.id} className="w-full shrink-0 snap-center px-6 sm:px-0 sm:w-auto">
              <VideoCard video={v} />
            </div>
          ))}
        </div>

        {videos.length > 1 && (
          <div className="flex sm:hidden items-center justify-center gap-4 mt-6">
            <button
              onClick={() => goTo(idx - 1)}
              disabled={idx === 0}
              aria-label="Предыдущее видео"
              className="w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white disabled:opacity-30 active:bg-orange-500 active:text-white transition-colors"
            >
              <Icon name="ChevronLeft" size={16} />
            </button>
            <div className="flex gap-1.5">
              {videos.map((v, i) => (
                <span key={v.id} className={`h-1.5 rounded-full transition-all ${i === idx ? "w-5 bg-orange-500" : "w-1.5 bg-white/25"}`} />
              ))}
            </div>
            <button
              onClick={() => goTo(idx + 1)}
              disabled={idx === videos.length - 1}
              aria-label="Следующее видео"
              className="w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white disabled:opacity-30 active:bg-orange-500 active:text-white transition-colors"
            >
              <Icon name="ChevronRight" size={16} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
