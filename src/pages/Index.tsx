import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const KITCHEN_IMG = "https://cdn.poehali.dev/projects/e84f41ff-e623-49a2-a773-de1e473421e0/files/94405f4e-89ff-4b7f-8ba9-6b9924ab5799.jpg";
const WARDROBE_IMG = "https://cdn.poehali.dev/projects/e84f41ff-e623-49a2-a773-de1e473421e0/files/6b2dc6af-8174-4fe7-a49e-42599a3ab7ca.jpg";
const LIVING_IMG = "https://cdn.poehali.dev/projects/e84f41ff-e623-49a2-a773-de1e473421e0/files/08db6c6f-ef20-470b-a815-3980253e5a63.jpg";
const KIDS_IMG = "https://cdn.poehali.dev/projects/e84f41ff-e623-49a2-a773-de1e473421e0/files/4087511f-b363-43f2-9729-f2065d01ffa9.jpg";

const PORTFOLIO = [
  { img: KITCHEN_IMG, title: "Кухня МДФ эмаль", material: "Фурнитура Blum, столешница Pfleiderer", price: "от 185 000 ₽", tag: "Кухня" },
  { img: WARDROBE_IMG, title: "Шкаф-купе в спальню", material: "ЛДСП Egger, система Hettich", price: "от 64 000 ₽", tag: "Шкаф" },
  { img: LIVING_IMG, title: "Гостиная со стеллажами", material: "МДФ + шпон дуба, фурнитура Grass", price: "от 120 000 ₽", tag: "Гостиная" },
  { img: KIDS_IMG, title: "Детская комната", material: "ЛДСП Egger, безопасные кромки", price: "от 78 000 ₽", tag: "Детская" },
  { img: KITCHEN_IMG, title: "Угловая кухня в стиле loft", material: "МДФ плёнка, столешница из акрила", price: "от 210 000 ₽", tag: "Кухня" },
  { img: WARDROBE_IMG, title: "Гардеробная система", material: "ЛДСП + алюминиевый профиль", price: "от 95 000 ₽", tag: "Гардеробная" },
];

const REVIEWS = [
  { name: "Анна К.", city: "Москва", text: "Сделали кухню точно в срок, 3D-проект был идеален. Монтажники убрали за собой весь мусор — это особенно порадовало!", rating: 5, date: "Март 2024" },
  { name: "Дмитрий В.", city: "Подмосковье", text: "Заказывал гардеробную, очень доволен качеством. Фурнитура Blum — просто песня, всё ходит как часы. Рекомендую!", rating: 5, date: "Январь 2024" },
  { name: "Елена М.", city: "Москва", text: "Долго выбирала компанию, остановилась на МебельМастер. Детская получилась именно такой, как хотела. Дочка в восторге!", rating: 5, date: "Февраль 2024" },
  { name: "Сергей Н.", city: "Химки", text: "Ребята работают строго по договору, никаких скрытых доплат. Шкаф-купе сделали за 18 дней — даже раньше обещанного!", rating: 5, date: "Апрель 2024" },
];

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

function useScrollAnimation() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );
    document.querySelectorAll(".animate-on-scroll").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

export default function Index() {
  useScrollAnimation();

  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const [quizDone, setQuizDone] = useState(false);
  const [selectedProject, setSelectedProject] = useState<null | typeof PORTFOLIO[0]>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { from: "bot", text: "Привет! Я онлайн-консультант МебельМастер. Задайте любой вопрос о нашей мебели или стоимости." },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formSent, setFormSent] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleQuizAnswer = (answer: string) => {
    const newAnswers = [...quizAnswers, answer];
    setQuizAnswers(newAnswers);
    if (quizStep < QUIZ_QUESTIONS.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      setQuizDone(true);
    }
  };

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const userMsg = { from: "user", text: chatInput };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "Спасибо за вопрос! Наш менеджер ответит в течение нескольких минут. Или оставьте телефон — перезвоним немедленно!",
        },
      ]);
    }, 1000);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
  };

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Golos Text', sans-serif", background: "#0a0f1a" }}>

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded gradient-orange flex items-center justify-center">
              <Icon name="Layers" size={16} className="text-white" />
            </div>
            <span className="font-display font-bold text-xl text-white tracking-wide">
              МЕБЕЛЬ<span className="gradient-text">МАСТЕР</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/70">
            <a href="#catalog" className="hover:text-orange-400 transition-colors">Каталог</a>
            <a href="#portfolio" className="hover:text-orange-400 transition-colors">Портфолио</a>
            <a href="#steps" className="hover:text-orange-400 transition-colors">Как работаем</a>
            <a href="#reviews" className="hover:text-orange-400 transition-colors">Отзывы</a>
          </div>
          <div className="flex items-center gap-3">
            <a href="tel:+74951234567" className="hidden md:flex items-center gap-2 text-white font-display font-semibold text-sm tracking-wide hover:text-orange-400 transition-colors">
              <Icon name="Phone" size={14} className="text-orange-500" />
              +7 (495) 123-45-67
            </a>
            <button
              className="btn-orange px-4 py-2 rounded-lg text-sm"
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            >
              Вызвать замерщика
            </button>
            <button className="md:hidden text-white" onClick={() => setMobileMenu(!mobileMenu)}>
              <Icon name={mobileMenu ? "X" : "Menu"} size={24} />
            </button>
          </div>
        </div>
        {mobileMenu && (
          <div className="md:hidden glass-card border-t border-white/10 px-4 py-4 flex flex-col gap-4 text-white/80 text-sm">
            <a href="#catalog" onClick={() => setMobileMenu(false)}>Каталог</a>
            <a href="#portfolio" onClick={() => setMobileMenu(false)}>Портфолио</a>
            <a href="#steps" onClick={() => setMobileMenu(false)}>Как работаем</a>
            <a href="#reviews" onClick={() => setMobileMenu(false)}>Отзывы</a>
            <a href="tel:+74951234567" className="text-orange-400 font-semibold">+7 (495) 123-45-67</a>
          </div>
        )}
      </nav>

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16 noise-bg gradient-hero">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 right-10 w-96 h-96 rounded-full opacity-10 animate-float" style={{ background: "radial-gradient(circle, #f97316, transparent)" }} />
          <div className="absolute bottom-20 left-10 w-64 h-64 rounded-full opacity-8" style={{ background: "radial-gradient(circle, #ea580c, transparent)" }} />
          <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] rounded-full opacity-5 -translate-x-1/2 -translate-y-1/2" style={{ background: "radial-gradient(circle, #f97316, transparent)" }} />
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(249,115,22,0.3) 60px, rgba(249,115,22,0.3) 61px), repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(249,115,22,0.3) 60px, rgba(249,115,22,0.3) 61px)" }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-8 w-full grid lg:grid-cols-2 gap-12 items-center py-20">
          <div style={{ animation: "fade-up 0.8s ease-out forwards" }}>
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-full px-4 py-2 text-orange-400 text-sm font-semibold mb-6">
              <Icon name="Star" size={14} className="text-orange-400" />
              Гарантия 5 лет · Производство в Москве
            </div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-wide uppercase mb-4">
              Корпусная<br />
              мебель<br />
              <span className="gradient-text">на заказ</span>
            </h1>
            <p className="text-white/60 text-lg sm:text-xl leading-relaxed mb-3">
              Проектируем, производим и монтируем под ключ за <strong className="text-orange-400">21 день</strong>. Точно по размерам вашей квартиры.
            </p>
            <div className="flex items-center gap-2 text-green-400 text-sm font-semibold mb-8">
              <Icon name="Gift" size={16} className="text-green-400" />
              Выезд замерщика и 3D-проект — <strong>бесплатно</strong>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                className="btn-orange px-8 py-4 rounded-xl text-base"
                onClick={() => document.getElementById("quiz")?.scrollIntoView({ behavior: "smooth" })}
              >
                Рассчитать стоимость мебели
              </button>
              <button
                className="btn-outline-orange px-8 py-4 rounded-xl text-base"
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              >
                Вызвать замерщика
              </button>
            </div>
            <div className="flex items-center gap-8 mt-10">
              <div className="text-center">
                <div className="font-display text-3xl font-bold gradient-text">850+</div>
                <div className="text-white/50 text-xs mt-1">проектов</div>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="text-center">
                <div className="font-display text-3xl font-bold gradient-text">4.9</div>
                <div className="text-white/50 text-xs mt-1">рейтинг</div>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="text-center">
                <div className="font-display text-3xl font-bold gradient-text">12</div>
                <div className="text-white/50 text-xs mt-1">лет на рынке</div>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl" style={{ boxShadow: "0 32px 80px rgba(249,115,22,0.25)" }}>
              <img src={KITCHEN_IMG} alt="Кухня на заказ" className="w-full h-[500px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 glass-card rounded-2xl px-5 py-4">
                <div className="text-white font-display font-bold text-lg">Кухня «Loft White»</div>
                <div className="text-white/60 text-sm">МДФ эмаль · Blum · 14 м²</div>
                <div className="text-orange-400 font-display font-bold text-xl mt-1">195 000 ₽ под ключ</div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 glass-card rounded-2xl px-4 py-3 border border-orange-500/30 animate-float">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full gradient-orange flex items-center justify-center">
                  <Icon name="Clock" size={14} className="text-white" />
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">Срок: 21 день</div>
                  <div className="text-white/50 text-xs">от замера до монтажа</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
              { img: KITCHEN_IMG, title: "Кухни", desc: "Угловые, прямые, П-образные. МДФ, ЛДСП, массив. Любая планировка.", icon: "UtensilsCrossed", color: "#f97316" },
              { img: WARDROBE_IMG, title: "Шкафы-купе и гардеробные", desc: "Встроенные системы хранения под потолок с раздвижными дверями.", icon: "Shirt", color: "#ea580c" },
              { img: KIDS_IMG, title: "Мебель для детской", desc: "Безопасные материалы, яркие цвета, трансформируемые системы.", icon: "Baby", color: "#fb923c" },
              { img: LIVING_IMG, title: "Гостиные и прихожие", desc: "Стеллажи, тумбы под ТВ, обувницы, вешалки под ваш стиль.", icon: "Sofa", color: "#c2410c" },
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

      {/* ===== PORTFOLIO ===== */}
      <section id="portfolio" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="animate-on-scroll text-center mb-16">
            <div className="text-orange-500 font-display font-semibold text-sm tracking-widest uppercase mb-3">Готовые работы</div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-gray-900 uppercase tracking-wide">
              Портфолио
            </h2>
            <p className="text-gray-500 text-lg mt-4">Нажмите на проект, чтобы узнать детали</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PORTFOLIO.map((proj, i) => (
              <div
                key={i}
                className="animate-on-scroll group cursor-pointer card-hover rounded-2xl overflow-hidden shadow-md"
                onClick={() => setSelectedProject(proj)}
              >
                <div className="relative h-64 overflow-hidden">
                  <img src={proj.img} alt={proj.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-orange-500 text-white text-xs font-display font-semibold px-3 py-1 rounded-full uppercase tracking-wide">{proj.tag}</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="font-display font-bold text-white text-xl uppercase">{proj.title}</h3>
                    <p className="text-white/70 text-xs mt-1">{proj.material}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-orange-400 font-display font-bold text-lg">{proj.price}</span>
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-orange-500 transition-colors duration-300">
                        <Icon name="ArrowRight" size={14} className="text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.85)" }}
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl"
            style={{ animation: "scale-in 0.3s ease-out forwards" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-80">
              <img src={selectedProject.img} alt={selectedProject.title} className="w-full h-full object-cover" />
              <button
                className="absolute top-4 right-4 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                onClick={() => setSelectedProject(null)}
              >
                <Icon name="X" size={18} />
              </button>
              <div className="absolute top-4 left-4">
                <span className="bg-orange-500 text-white text-xs font-display font-semibold px-3 py-1 rounded-full uppercase">{selectedProject.tag}</span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-display text-2xl font-bold text-gray-900 uppercase tracking-wide">{selectedProject.title}</h3>
              <p className="text-gray-500 mt-2">{selectedProject.material}</p>
              <div className="flex items-center justify-between mt-4">
                <div>
                  <div className="text-gray-400 text-sm">Стоимость под ключ</div>
                  <div className="font-display text-2xl font-bold text-orange-500">{selectedProject.price}</div>
                </div>
                <button
                  className="btn-orange px-6 py-3 rounded-xl text-sm"
                  onClick={() => { setSelectedProject(null); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }}
                >
                  Хочу такую же
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== REVIEWS ===== */}
      <section id="reviews" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="animate-on-scroll text-center mb-16">
            <div className="text-orange-500 font-display font-semibold text-sm tracking-widest uppercase mb-3">Что говорят клиенты</div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-gray-900 uppercase tracking-wide mb-4">
              Отзывы
            </h2>
            <div className="flex items-center justify-center gap-3">
              <div className="flex">
                {[1,2,3,4,5].map(s => <Icon key={s} name="Star" size={20} className="star-filled" />)}
              </div>
              <span className="font-display font-bold text-gray-900 text-2xl">4.9</span>
              <span className="text-gray-400">/</span>
              <span className="text-gray-500">850+ отзывов на Яндекс.Картах</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {REVIEWS.map((rev, i) => (
              <div key={i} className="animate-on-scroll glass-card-light rounded-2xl p-6 card-hover">
                <div className="flex mb-3">
                  {[1,2,3,4,5].map(s => <Icon key={s} name="Star" size={14} className="star-filled" />)}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">«{rev.text}»</p>
                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <div>
                    <div className="font-display font-semibold text-gray-900 text-sm">{rev.name}</div>
                    <div className="text-gray-400 text-xs">{rev.city}</div>
                  </div>
                  <div className="text-gray-300 text-xs">{rev.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CONTACT FORM ===== */}
      <section id="contact" className="py-24 gradient-hero relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 50% 50%, #f97316 0%, transparent 60%)" }} />

        <div className="max-w-2xl mx-auto px-4 sm:px-8 relative z-10 text-center">
          <div className="animate-on-scroll">
            <div className="text-orange-500 font-display font-semibold text-sm tracking-widest uppercase mb-3">Бесплатно</div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white uppercase tracking-wide mb-4">
              Закажите бесплатный<br />
              <span className="gradient-text">выезд замерщика</span>
            </h2>
            <p className="text-white/60 text-lg mb-10">
              Приедем с каталогом материалов, образцами фурнитуры и сделаем точные замеры. Никаких обязательств!
            </p>
          </div>

          {!formSent ? (
            <form className="animate-on-scroll glass-card rounded-3xl p-8 border border-orange-500/20" onSubmit={handleFormSubmit}>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-white/60 text-sm mb-2 block text-left">Ваше имя</label>
                  <input
                    type="text"
                    placeholder="Как вас зовут?"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-orange-500 transition-colors text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="text-white/60 text-sm mb-2 block text-left">Телефон</label>
                  <input
                    type="tel"
                    placeholder="+7 (___) ___-__-__"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-orange-500 transition-colors text-sm"
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn-orange w-full py-4 rounded-xl text-base">
                Вызвать замерщика бесплатно
              </button>
              <p className="text-white/30 text-xs mt-4">
                Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности. Не передаём данные третьим лицам.
              </p>
            </form>
          ) : (
            <div className="animate-on-scroll glass-card rounded-3xl p-10 border border-green-500/30 text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="CheckCircle" size={32} className="text-green-400" />
              </div>
              <h3 className="font-display text-2xl font-bold text-white uppercase mb-2">Заявка принята!</h3>
              <p className="text-white/60">Менеджер позвонит вам в течение 15 минут и согласует время визита.</p>
            </div>
          )}
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-gray-950 border-t border-white/10 pt-14 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded gradient-orange flex items-center justify-center">
                  <Icon name="Layers" size={16} className="text-white" />
                </div>
                <span className="font-display font-bold text-xl text-white tracking-wide">
                  МЕБЕЛЬ<span className="gradient-text">МАСТЕР</span>
                </span>
              </div>
              <p className="text-white/50 text-sm leading-relaxed">
                Корпусная мебель на заказ в Москве и Подмосковье. Собственное производство с 2012 года.
              </p>
            </div>

            <div>
              <h4 className="font-display font-semibold text-white uppercase tracking-wide text-sm mb-4">Контакты</h4>
              <div className="space-y-3">
                <a href="tel:+74951234567" className="flex items-center gap-2 text-white/60 hover:text-orange-400 transition-colors text-sm">
                  <Icon name="Phone" size={14} className="text-orange-500" />
                  +7 (495) 123-45-67
                </a>
                <a href="mailto:info@mebel-master.ru" className="flex items-center gap-2 text-white/60 hover:text-orange-400 transition-colors text-sm">
                  <Icon name="Mail" size={14} className="text-orange-500" />
                  info@mebel-master.ru
                </a>
                <div className="flex items-start gap-2 text-white/60 text-sm">
                  <Icon name="MapPin" size={14} className="text-orange-500 mt-0.5 shrink-0" />
                  <span>г. Москва, ул. Примерная, д. 1, шоурум (пн–сб 10:00–19:00)</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-display font-semibold text-white uppercase tracking-wide text-sm mb-4">Каталог</h4>
              <div className="space-y-2 text-sm">
                {["Кухни", "Шкафы-купе", "Гардеробные", "Детская", "Гостиные", "Прихожие"].map((item) => (
                  <div key={item}>
                    <a href="#catalog" className="text-white/50 hover:text-orange-400 transition-colors">{item}</a>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-display font-semibold text-white uppercase tracking-wide text-sm mb-4">Мы в соцсетях</h4>
              <div className="flex gap-3 mb-6">
                <a href="#" className="w-10 h-10 glass-card rounded-xl flex items-center justify-center hover:border-orange-500/50 transition-colors group">
                  <span className="text-white/60 group-hover:text-orange-400 text-sm font-bold">ВК</span>
                </a>
                <a href="#" className="w-10 h-10 glass-card rounded-xl flex items-center justify-center hover:border-orange-500/50 transition-colors group">
                  <Icon name="Send" size={16} className="text-white/60 group-hover:text-orange-400" />
                </a>
              </div>
              <div className="text-white/30 text-xs space-y-1">
                <div>ИНН: 7701234567</div>
                <div>ОГРН: 1127700000000</div>
                <div>ООО «МебельМастер»</div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-white/30 text-xs">© 2024 МебельМастер. Все права защищены.</p>
            <div className="flex gap-4 text-xs">
              <a href="#" className="text-white/30 hover:text-orange-400 transition-colors">Политика конфиденциальности</a>
              <a href="#" className="text-white/30 hover:text-orange-400 transition-colors">Договор оферты</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ===== ONLINE CHAT ===== */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        {chatOpen && (
          <div className="w-80 sm:w-96 bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100" style={{ animation: "scale-in 0.25s ease-out forwards" }}>
            <div className="gradient-orange px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                  <Icon name="MessageCircle" size={18} className="text-white" />
                </div>
                <div>
                  <div className="text-white font-display font-bold text-sm uppercase">Онлайн-консультант</div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    <span className="text-white/80 text-xs">Онлайн</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-white/80 hover:text-white">
                <Icon name="X" size={18} />
              </button>
            </div>

            <div className="h-64 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] px-4 py-2.5 text-sm leading-relaxed rounded-2xl ${
                      msg.from === "user"
                        ? "gradient-orange text-white"
                        : "bg-white text-gray-700 shadow-sm border border-gray-100"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
              <input
                type="text"
                placeholder="Задайте вопрос..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 placeholder-gray-400"
              />
              <button onClick={handleSendChat} className="btn-orange w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
                <Icon name="Send" size={16} className="text-white" />
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="w-14 h-14 gradient-orange rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200"
          style={{ boxShadow: "0 8px 24px rgba(249,115,22,0.45)" }}
        >
          <Icon name={chatOpen ? "X" : "MessageCircle"} size={24} className="text-white" />
        </button>
      </div>
    </div>
  );
}
