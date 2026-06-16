import { useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

interface IndexHeaderProps {
  getImg: (key: string) => string;
  mobileMenu: boolean;
  setMobileMenu: (v: boolean) => void;
}

export default function IndexHeader({ getImg, mobileMenu, setMobileMenu }: IndexHeaderProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mobileMenu) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [mobileMenu, setMobileMenu]);

  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-slate-950/40 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between h-16">
          <a href="#" className="flex items-center">
            <img
              src="https://cdn.poehali.dev/projects/e84f41ff-e623-49a2-a773-de1e473421e0/bucket/logo/svoy-stil-transparent.png"
              alt="Логотип Свой Стиль"
              className="h-14 w-14 object-contain"
            />
            <span className="font-display font-bold text-xl text-white tracking-wide -ml-1">
              СВОЙ<span className="gradient-text"> СТИЛЬ</span>
            </span>
          </a>
          <div className="relative" ref={menuRef}>
            <button
              className="flex items-center gap-2.5 text-white backdrop-blur-md bg-white/5 border border-white/15 hover:bg-white/10 hover:border-white/30 transition-all rounded-xl px-4 py-2.5"
              onClick={() => setMobileMenu(!mobileMenu)}
              aria-label="Разделы"
            >
              <Icon name={mobileMenu ? "X" : "Menu"} size={20} className="text-white" />
              <span className="font-display font-semibold text-sm tracking-wide">Разделы</span>
            </button>
            {mobileMenu && (
              <div className="absolute right-0 mt-2 w-56 backdrop-blur-xl bg-slate-950/90 border border-white/10 rounded-2xl shadow-2xl shadow-black/40 p-2 flex flex-col gap-1 text-white/80 text-sm">
                {[
                  { href: "#catalog", label: "Каталог", icon: "LayoutGrid" },
                  { href: "#portfolio", label: "Портфолио", icon: "Images" },
                  { href: "#steps", label: "Как работаем", icon: "ListChecks" },
                  { href: "#reviews", label: "Отзывы", icon: "Star" },
                ].map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenu(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 hover:text-orange-400 transition-colors"
                  >
                    <Icon name={item.icon} size={18} className="text-orange-400" />
                    {item.label}
                  </a>
                ))}
                <div className="h-px bg-white/10 my-1" />
                <a
                  href="https://vk.com/svoystyle22"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenu(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 hover:text-orange-400 transition-colors"
                >
                  <Icon name="Share2" size={18} className="text-orange-400" />
                  Мы ВКонтакте
                </a>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={getImg("hero")} alt="Мебель на заказ" className="w-full h-full object-cover scale-105" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/70" />
        </div>

        {/* glow accents */}
        <div className="absolute -top-32 -left-32 w-[40rem] h-[40rem] rounded-full bg-orange-500/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[32rem] h-[32rem] rounded-full bg-orange-600/10 blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)", backgroundSize: "64px 64px" }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-8 w-full py-32 grid lg:grid-cols-12 gap-10 items-center">
          {/* left content */}
          <div className="lg:col-span-7" style={{ animation: "fade-up 0.8s ease-out forwards" }}>
            <div className="inline-flex items-center gap-2 backdrop-blur-md bg-white/5 border border-orange-500/30 rounded-full pl-2 pr-4 py-1.5 mb-7">
              <span className="flex items-center gap-1.5 bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                <Icon name="Sparkles" size={12} className="text-white" /> ТОП
              </span>
              <span className="text-white/80 text-sm font-medium">Производство в Барнауле · 15 лет на рынке</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.75rem] font-medium text-white leading-[1.08] tracking-tight mb-6">Корпусная мебель на заказ</h1>
            <p className="text-white/65 sm:text-xl leading-relaxed mb-8 max-w-xl text-lg">Проектируем, производим и монтируем  точно по размерам вашей квартиры — без переплат и посредников.</p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button
                className="group btn-orange px-8 py-4 rounded-2xl text-base text-white inline-flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30"
                onClick={() => document.getElementById("quiz")?.scrollIntoView({ behavior: "smooth" })}
              >
                Рассчитать стоимость
                <Icon name="ArrowRight" size={18} className="text-white transition-transform group-hover:translate-x-1" />
              </button>
              <button
                className="px-8 py-4 rounded-2xl text-base font-semibold text-white backdrop-blur-md bg-white/5 border border-white/20 hover:bg-white/10 hover:border-white/40 transition-all inline-flex items-center justify-center gap-2"
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              >
                <Icon name="Ruler" size={18} className="text-white" />
                Записаться на замер
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              {[
                { icon: "Gift", text: "Замер и 3D-проект бесплатно" },
                { icon: "CreditCard", text: "Рассрочка от компании без %" },
                { icon: "Award", text: "Фурнитура Blum и Makmart" },
                { icon: "Factory", text: "Своё производство в Барнауле" },
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-2 text-white/75 text-sm font-medium">
                  <div className="w-7 h-7 rounded-lg bg-green-500/15 flex items-center justify-center">
                    <Icon name={b.icon} size={15} className="text-green-400" />
                  </div>
                  {b.text}
                </div>
              ))}
            </div>
          </div>

          {/* right animated composition */}
          <div className="hidden lg:flex lg:col-span-5 items-center justify-center" style={{ animation: "fade-up 1s ease-out forwards" }}>
            <div className="relative w-[26rem] h-[26rem]">
              {/* rotating orbit ring */}
              <div className="absolute inset-0 anim-spin-slow">
                <div className="absolute inset-0 rounded-full border border-orange-500/20" />
                <div className="absolute inset-8 rounded-full border border-dashed border-white/10" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-orange-500 shadow-lg shadow-orange-500/50" />
                <div className="absolute bottom-6 right-10 w-2 h-2 rounded-full bg-amber-400" />
              </div>

              {/* central glowing core */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-3xl anim-pulse-ring border border-orange-500/40" />
                  <div className="relative w-32 h-32 rounded-3xl gradient-orange flex items-center justify-center shadow-2xl shadow-orange-500/40">
                    <Icon name="Sofa" size={56} className="text-white" />
                  </div>
                </div>
              </div>

              {/* floating cards */}
              <div className="absolute top-2 left-0 anim-float-slow" style={{ ["--rot" as string]: "-6deg" }}>
                <div className="backdrop-blur-xl bg-white/10 border border-white/15 rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-green-500/20 flex items-center justify-center">
                    <Icon name="Gift" size={18} className="text-green-400" />
                  </div>
                  <div>
                    <div className="text-white font-display font-bold text-sm">Замер бесплатно</div>
                    <div className="text-white/50 text-[11px]">И 3D-проект в подарок</div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-6 right-0 anim-float-mid" style={{ ["--rot" as string]: "5deg" }}>
                <div className="backdrop-blur-xl bg-white/10 border border-white/15 rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-500/20 flex items-center justify-center">
                    <Icon name="Award" size={18} className="text-orange-400" />
                  </div>
                  <div>
                    <div className="text-white font-display font-bold text-sm">Фурнитура Blum</div>
                    <div className="text-white/50 text-[11px]">И Makmart</div>
                  </div>
                </div>
              </div>

              <div className="absolute top-1/2 -right-4 -translate-y-1/2 anim-float-slow" style={{ animationDelay: "1.5s", ["--rot" as string]: "0deg" }}>
                <div className="backdrop-blur-xl bg-white/10 border border-white/15 rounded-2xl px-4 py-3 shadow-xl text-center">
                  <div className="font-display text-2xl font-bold gradient-text">850+</div>
                  <div className="text-white/50 text-[11px]">проектов</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/40 animate-bounce pointer-events-none">
          <span className="text-[10px] uppercase tracking-widest">Листайте</span>
          <Icon name="ChevronDown" size={18} className="text-white/40" />
        </div>
      </section>
    </>
  );
}