import { useRef, useState } from "react";
import Icon from "@/components/ui/icon";

interface Step {
  icon: string;
  num: string;
  title: string;
  desc: string;
}

export default function StepsMobileSlider({ steps }: { steps: Step[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const goTo = (idx: number) => {
    const el = trackRef.current;
    if (!el) return;
    const next = Math.max(0, Math.min(steps.length - 1, idx));
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
  };

  const handleScroll = () => {
    const el = trackRef.current;
    if (el) setActive(Math.round(el.scrollLeft / el.clientWidth));
  };

  const progress = steps.length > 1 ? (active / (steps.length - 1)) * 100 : 0;

  return (
    <div className="sm:hidden">
      <div className="relative mx-4 mb-8">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2 bg-gray-200 rounded-full" />
        <div
          className="absolute top-1/2 left-0 h-0.5 -translate-y-1/2 gradient-orange rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
        <div className="relative flex justify-between">
          {steps.map((s, i) => (
            <button
              key={s.num}
              onClick={() => goTo(i)}
              aria-label={`Шаг ${i + 1}`}
              className={`w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-xs transition-all duration-300 ${
                i < active
                  ? "gradient-orange text-white"
                  : i === active
                  ? "gradient-orange text-white scale-125 shadow-lg shadow-orange-500/40"
                  : "bg-white border-2 border-gray-200 text-gray-400"
              }`}
            >
              {i < active ? <Icon name="Check" size={14} className="text-white" /> : i + 1}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {steps.map((step, i) => {
          const isActive = i === active;
          return (
            <div key={step.num} className="w-full shrink-0 snap-center px-1">
              <div
                className={`bg-white rounded-3xl border border-gray-100 p-6 text-center h-full transition-all duration-500 ${
                  isActive ? "opacity-100 scale-100 shadow-xl shadow-orange-500/10" : "opacity-40 scale-95"
                }`}
              >
                <div className="relative inline-flex mb-4">
                  <div
                    className={`w-20 h-20 rounded-2xl gradient-orange flex items-center justify-center transition-transform duration-700 ${
                      isActive ? "rotate-0 scale-100" : "-rotate-12 scale-75"
                    }`}
                    style={{ boxShadow: "0 8px 24px rgba(249,115,22,0.35)" }}
                  >
                    <Icon name={step.icon} size={30} className="text-white" fallback="CheckCircle" />
                  </div>
                  {isActive && <span className="absolute inset-0 rounded-2xl gradient-orange opacity-30 animate-ping" style={{ animationIterationCount: 2 }} />}
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-gray-900 rounded-full flex items-center justify-center">
                    <span className="text-orange-400 font-display font-bold text-[10px]">{step.num}</span>
                  </div>
                </div>
                <h3 className="font-display text-gray-900 uppercase tracking-wide mb-2 font-bold text-base">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          onClick={() => goTo(active - 1)}
          disabled={active === 0}
          aria-label="Предыдущий шаг"
          className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-700 disabled:opacity-30 active:bg-orange-500 active:text-white transition-colors"
        >
          <Icon name="ChevronLeft" size={18} />
        </button>
        <span className="font-display font-bold text-sm text-gray-900 w-12 text-center">
          {active + 1} <span className="text-gray-400">/ {steps.length}</span>
        </span>
        <button
          onClick={() => goTo(active + 1)}
          disabled={active === steps.length - 1}
          aria-label="Следующий шаг"
          className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-700 disabled:opacity-30 active:bg-orange-500 active:text-white transition-colors"
        >
          <Icon name="ChevronRight" size={18} />
        </button>
      </div>
    </div>
  );
}
