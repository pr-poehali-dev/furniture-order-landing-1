import Icon from "@/components/ui/icon";

interface IndexHeaderProps {
  getImg: (key: string) => string;
  mobileMenu: boolean;
  setMobileMenu: (v: boolean) => void;
}

export default function IndexHeader({ getImg, mobileMenu, setMobileMenu }: IndexHeaderProps) {
  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-slate-950/40 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded gradient-orange flex items-center justify-center">
              <Icon name="Layers" size={16} className="text-white" />
            </div>
            <span className="font-display font-bold text-xl text-white tracking-wide">
              СВОЙ<span className="gradient-text"> СТИЛЬ</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/70">
            <a href="#catalog" className="hover:text-orange-400 transition-colors">Каталог</a>
            <a href="#portfolio" className="hover:text-orange-400 transition-colors">Портфолио</a>
            <a href="#steps" className="hover:text-orange-400 transition-colors">Как работаем</a>
            <a href="#reviews" className="hover:text-orange-400 transition-colors">Отзывы</a>
          </div>
          <div className="flex items-center gap-3">
            <a href="tel:+74951234567" className="hidden md:flex items-center gap-2 text-white font-display font-semibold text-sm tracking-wide hover:text-orange-400 transition-colors">+7 (913) 274-85-19</a>
            <button
              className="btn-orange px-4 py-2 rounded-lg text-sm"
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            >Записаться на замер</button>
            <button className="md:hidden text-white" onClick={() => setMobileMenu(!mobileMenu)}>
              <Icon name={mobileMenu ? "X" : "Menu"} size={24} />
            </button>
          </div>
        </div>
        {mobileMenu && (
          <div className="md:hidden backdrop-blur-xl bg-slate-950/80 border-t border-white/10 px-4 py-4 flex flex-col gap-4 text-white/80 text-sm">
            <a href="#catalog" onClick={() => setMobileMenu(false)}>Каталог</a>
            <a href="#portfolio" onClick={() => setMobileMenu(false)}>Портфолио</a>
            <a href="#steps" onClick={() => setMobileMenu(false)}>Как работаем</a>
            <a href="#reviews" onClick={() => setMobileMenu(false)}>Отзывы</a>
            <a href="tel:+74951234567" className="text-orange-400 font-semibold">+7 (913) 274-85-19</a>
          </div>
        )}
      </nav>

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={getImg("hero")} alt="Мебель на заказ" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-900/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/60" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-8 w-full py-32">
          <div className="max-w-2xl" style={{ animation: "fade-up 0.8s ease-out forwards" }}>
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-full px-4 py-2 text-orange-400 text-sm font-semibold mb-6">
              Гарантия 5 лет · Производство в Барнауле
            </div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-wide uppercase mb-6">
              Корпусная мебель <span className="gradient-text">на заказ</span>
            </h1>
            <p className="text-white/70 text-lg sm:text-xl leading-relaxed mb-3 max-w-xl">
              Проектируем, производим и монтируем под ключ. Точно по размерам вашей квартиры.
            </p>
            <div className="flex items-center gap-2 text-green-400 text-sm font-semibold mb-8">
              <Icon name="Gift" size={16} className="text-green-400" />
              Выезд замерщика и 3D-проект — <strong>бесплатно</strong>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                className="btn-orange px-8 py-4 rounded-xl text-base text-[#ffffff]"
                onClick={() => document.getElementById("quiz")?.scrollIntoView({ behavior: "smooth" })}
              >
                Рассчитать стоимость мебели
              </button>
              <button
                className="px-8 py-4 rounded-xl text-base font-semibold text-white border border-white/25 hover:bg-white/10 transition-colors"
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              >
                Вызвать замерщика
              </button>
            </div>
            <div className="flex items-center gap-8 mt-12">
              <div>
                <div className="font-display text-3xl font-bold gradient-text">850+</div>
                <div className="text-white/50 text-xs mt-1">проектов</div>
              </div>
              <div className="w-px h-10 bg-white/15" />
              <div>
                <div className="font-display text-3xl font-bold gradient-text">4.9</div>
                <div className="text-white/50 text-xs mt-1">рейтинг</div>
              </div>
              <div className="w-px h-10 bg-white/15" />
              <div>
                <div className="font-display text-3xl font-bold gradient-text">15</div>
                <div className="text-white/50 text-xs mt-1">лет на рынке</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
