import Icon from "@/components/ui/icon";

const STEPS = [
  { icon: "Phone", num: "01", title: "Оставьте заявку", desc: "Позвоните или оставьте номер на сайте — перезвоним в течение 15 минут и ответим на все вопросы." },
  { icon: "Ruler", num: "02", title: "Бесплатный выезд замерщика", desc: "Приедем с образцами материалов и каталогами фурнитуры. Сделаем точные замеры вашего помещения." },
  { icon: "Monitor", num: "03", title: "3D-проект и расчёт", desc: "Создадим детальный 3D-проект и полный расчёт стоимости. Вносим правки до полного согласования." },
  { icon: "Factory", num: "04", title: "Производство на фабрике", desc: "Изготавливаем мебель на собственном производстве с контролем качества на каждом этапе." },
  { icon: "Truck", num: "05", title: "Доставка и монтаж", desc: "Привезём и профессионально установим мебель. Уберём весь строительный мусор — заходите и живите!" },
];

const ADVANTAGES = [
  { icon: "Factory", title: "Своё производство", desc: "Работаем без посредников. Полный цикл от дерева до монтажа — экономия до 30%" },
  { icon: "FileText", title: "Договор на всё", desc: "Чёткие сроки и стоимость в договоре. Никаких «сюрпризов» на финише" },
  { icon: "Shield", title: "Гарантия 5 лет", desc: "Европейская фурнитура Blum, Hettich, Grass. Ремонт бесплатно в течение 5 лет" },
  { icon: "CheckCircle", title: "Контроль качества", desc: "Проверяем каждый элемент на производстве и при монтаже. QR-паспорт изделия" },
  { icon: "Trash2", title: "Уборка после монтажа", desc: "Наша бригада убирает весь мусор и упаковку. Сдаём квартиру в идеальном порядке" },
  { icon: "Zap", title: "21 день под ключ", desc: "От замера до установки — три недели. Соблюдаем сроки или возвращаем 10% от суммы" },
];

const QUIZ_QUESTIONS = [
  {
    q: "Какую мебель хотите заказать?",
    options: ["Кухню", "Шкаф-купе / гардеробную", "Мебель для детской", "Гостиную / прихожую"],
  },
  {
    q: "Примерная площадь помещения?",
    options: ["До 8 м²", "8–15 м²", "15–25 м²", "Более 25 м²"],
  },
  {
    q: "Какой материал предпочитаете?",
    options: ["МДФ эмаль (эстетично)", "ЛДСП (надёжно, экономно)", "Шпон / массив (премиум)", "Не знаю, нужна консультация"],
  },
  {
    q: "Когда планируете заказ?",
    options: ["Сейчас — делаю ремонт", "Через 1–3 месяца", "Через полгода", "Просто интересует цена"],
  },
];

interface IndexCatalogProps {
  getImg: (key: string) => string;
  quizStep: number;
  quizDone: boolean;
  handleQuizAnswer: (answer: string) => void;
  handleFormSubmit: (e: React.FormEvent) => void;
}

export default function IndexCatalog({ getImg, quizStep, quizDone, handleQuizAnswer, handleFormSubmit }: IndexCatalogProps) {
  return (
    <>
      {/* ===== CATALOG ===== */}
      <section id="catalog" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="animate-on-scroll text-center mb-16">
            <div className="text-orange-500 font-display font-semibold text-sm tracking-widest uppercase mb-3">Наши возможности</div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-gray-900 uppercase tracking-wide">
              Что мы делаем
            </h2>
            <p className="text-gray-500 text-lg mt-4 max-w-xl mx-auto">
              Любая мебель — от эскиза до монтажа — точно под размеры вашего пространства
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { img: getImg("cat_kitchen"), title: "Кухни", desc: "Угловые, прямые, П-образные. МДФ, ЛДСП, массив. Любая планировка.", icon: "UtensilsCrossed", color: "#f97316" },
              { img: getImg("cat_wardrobe"), title: "Шкафы-купе и гардеробные", desc: "Встроенные системы хранения под потолок с раздвижными дверями.", icon: "Shirt", color: "#ea580c" },
              { img: getImg("cat_kids"), title: "Мебель для детской", desc: "Безопасные материалы, яркие цвета, трансформируемые системы.", icon: "Baby", color: "#fb923c" },
              { img: getImg("cat_living"), title: "Гостиные и прихожие", desc: "Стеллажи, тумбы под ТВ, обувницы, вешалки под ваш стиль.", icon: "Sofa", color: "#c2410c" },
            ].map((cat, i) => (
              <div key={i} className="group card-hover animate-on-scroll rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">
                <div className="relative h-52 overflow-hidden">
                  <img src={cat.img} alt={cat.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute top-4 left-4 w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: cat.color }}>
                    <Icon name={cat.icon} size={18} className="text-white" fallback="Package" />
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-display font-bold text-gray-900 text-xl uppercase tracking-wide mb-2">{cat.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{cat.desc}</p>
                  <button
                    className="btn-orange w-full py-2.5 rounded-xl text-sm"
                    onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                  >
                    Хочу такую же
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== QUIZ ===== */}
      <section id="quiz" className="py-24 gradient-dark relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #f97316 0%, transparent 50%)" }} />

        <div className="max-w-3xl mx-auto px-4 sm:px-8 relative z-10">
          <div className="animate-on-scroll text-center mb-12">
            <div className="text-orange-500 font-display font-semibold text-sm tracking-widest uppercase mb-3">Быстрый расчёт</div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white uppercase tracking-wide mb-4">
              Узнайте цену за<br /><span className="gradient-text">2 минуты</span>
            </h2>
            <p className="text-white/60 text-lg">
              Ответьте на 4 вопроса — получите предварительный расчёт и скидку <strong className="text-orange-400">10%</strong> на первый заказ
            </p>
          </div>

          <div className="glass-card rounded-3xl p-8 border border-orange-500/20">
            {!quizDone ? (
              <>
                <div className="flex items-center gap-3 mb-8">
                  {QUIZ_QUESTIONS.map((_, i) => (
                    <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= quizStep ? "bg-orange-500" : "bg-white/10"}`} />
                  ))}
                </div>
                <div className="text-orange-400 text-sm font-semibold mb-3">Вопрос {quizStep + 1} из {QUIZ_QUESTIONS.length}</div>
                <h3 className="font-display text-2xl font-bold text-white uppercase tracking-wide mb-6">
                  {QUIZ_QUESTIONS[quizStep].q}
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {QUIZ_QUESTIONS[quizStep].options.map((opt, i) => (
                    <button
                      key={i}
                      className="text-left px-5 py-4 rounded-xl border border-white/15 text-white/80 hover:border-orange-500 hover:bg-orange-500/10 hover:text-white transition-all duration-200 text-sm"
                      onClick={() => handleQuizAnswer(opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="w-16 h-16 gradient-orange rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icon name="CheckCircle" size={32} className="text-white" />
                </div>
                <h3 className="font-display text-3xl font-bold text-white uppercase mb-3">Отлично!</h3>
                <p className="text-white/70 mb-2">Ваш предварительный расчёт готов.</p>
                <p className="text-orange-400 font-bold text-xl mb-6">Скидка 10% уже зарезервирована за вами!</p>
                <p className="text-white/50 text-sm mb-8">Оставьте номер телефона — менеджер перезвонит и назовёт точную цену</p>
                <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={handleFormSubmit}>
                  <input
                    type="tel"
                    placeholder="+7 (___) ___-__-__"
                    className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-orange-500 text-sm"
                  />
                  <button type="submit" className="btn-orange px-6 py-3 rounded-xl text-sm whitespace-nowrap">
                    Получить расчёт
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== STEPS ===== */}
      <section id="steps" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="animate-on-scroll text-center mb-16">
            <div className="text-orange-500 font-display font-semibold text-sm tracking-widest uppercase mb-3">Процесс работы</div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-gray-900 uppercase tracking-wide">
              5 шагов к новой мебели
            </h2>
          </div>

          <div className="relative">
            <div className="hidden lg:block absolute top-14 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {STEPS.map((step, i) => (
                <div key={i} className="animate-on-scroll relative text-center">
                  <div className="relative inline-flex">
                    <div className="w-28 h-28 rounded-3xl gradient-orange flex items-center justify-center mx-auto mb-4 shadow-lg" style={{ boxShadow: "0 8px 24px rgba(249,115,22,0.35)" }}>
                      <Icon name={step.icon} size={36} className="text-white" fallback="CheckCircle" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                      <span className="text-orange-400 font-display font-bold text-xs">{step.num}</span>
                    </div>
                  </div>
                  <h3 className="font-display font-bold text-gray-900 text-lg uppercase tracking-wide mb-2">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== ADVANTAGES ===== */}
      <section className="py-24 gradient-hero relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 70% 50%, #f97316 0%, transparent 50%)" }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
          <div className="animate-on-scroll text-center mb-16">
            <div className="text-orange-500 font-display font-semibold text-sm tracking-widest uppercase mb-3">Почему мы</div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white uppercase tracking-wide">
              Наши <span className="gradient-text">преимущества</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ADVANTAGES.map((adv, i) => (
              <div key={i} className="animate-on-scroll glass-card rounded-2xl p-6 card-hover group">
                <div className="w-12 h-12 gradient-orange rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon name={adv.icon} size={22} className="text-white" fallback="CheckCircle" />
                </div>
                <h3 className="font-display font-bold text-white text-xl uppercase tracking-wide mb-2">{adv.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{adv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
