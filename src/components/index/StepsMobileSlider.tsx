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
      <div className="relative mx-6 mb-6">
        <div className="absolute top-1/2 left-0 right-0 h-px -translate-y-1/2 bg-gray-200 rounded-full" />
        <div
          className="absolute top-1/2 left-0 h-px -translate-y-1/2 gradient-orange rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
        <div className="relative flex justify-between">
          {steps.map((s, i) => (
            <button
              key={s.num}
              onClick={() => goTo(i)}
              aria-label={`Шаг ${i + 1}`}
              className={`w-7 h-7 rounded-full flex items-center justify-center font-display font-semibold text-[11px] transition-all duration-300 ${
                i < active
                  ? "gradient-orange text-white"
                  : i === active
                  ? "gradient-orange text-white ring-4 ring-orange-500/15"
                  : "bg-white border border-gray-200 text-gray-400"
              }`}
            >
              {i < active ? <Icon name="Check" size={12} className="text-white" /> : i + 1}
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
                className={`bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-6 text-center h-full transition-opacity duration-500 ${
                  isActive ? "opacity-100" : "opacity-50"
                }`}
              >
                <div className="relative inline-flex mb-4">
                  <div
                    className={`w-16 h-16 rounded-2xl gradient-orange flex items-center justify-center transition-transform duration-500 ${
                      isActive ? "scale-100" : "scale-90"
                    }`}
                    style={{ boxShadow: "0 6px 18px rgba(249,115,22,0.25)" }}
                  >
                    <Icon name={step.icon} size={26} className="text-white" fallback="CheckCircle" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-gray-900 rounded-full flex items-center justify-center">
                    <span className="text-orange-400 font-display font-bold text-[10px]">{step.num}</span>
                  </div>
                </div>
                <h3 className="font-display text-gray-900 uppercase tracking-wide mb-2 font-bold text-sm">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-4 mt-5">
        <button
          onClick={() => goTo(active - 1)}
          disabled={active === 0}
          aria-label="Предыдущий шаг"
          className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-700 disabled:opacity-30 active:bg-orange-500 active:text-white transition-colors"
        >
          <Icon name="ChevronLeft" size={16} />
        </button>
        <span className="font-display font-bold text-sm text-gray-900 w-12 text-center">
          {active + 1} <span className="text-gray-400">/ {steps.length}</span>
        </span>
        <button
          onClick={() => goTo(active + 1)}
          disabled={active === steps.length - 1}
          aria-label="Следующий шаг"
          className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-700 disabled:opacity-30 active:bg-orange-500 active:text-white transition-colors"
        >
          <Icon name="ChevronRight" size={16} />
        </button>
      </div>
    </div>
  );
}
