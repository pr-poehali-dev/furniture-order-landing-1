import Icon from "@/components/ui/icon";
import QuizCalculator from "@/components/index/QuizCalculator";
import StepsMobileSlider from "@/components/index/StepsMobileSlider";

const STEPS = [
  { icon: "Phone", num: "01", title: "Оставьте заявку", desc: "Позвоните или оставьте номер на сайте — мы свяжемся с вами и ответим на все вопросы." },
  { icon: "Ruler", num: "02", title: "Бесплатный выезд замерщика", desc: "Опытный мебельщик сделает точные замеры, проконсультирует на месте по всем вопросам и при необходимости предложит свои варианты." },
  { icon: "Monitor", num: "03", title: "3D-проект и расчёт", desc: "Создадим детальный 3D-проект и полный расчёт стоимости. Вносим правки до полного согласования." },
  { icon: "Factory", num: "04", title: "Производство на фабрике", desc: "Изготавливаем мебель на собственном производстве с контролем качества на каждом этапе." },
  { icon: "Truck", num: "05", title: "Доставка и монтаж", desc: "Привезём и профессионально установим мебель. Уберём весь строительный мусор — заходите и живите!" },
];

const ADVANTAGES = [
  { icon: "Factory", title: "Своё производство", desc: "Работаем без посредников. Полный цикл производства от распила до монтажа." },
  { icon: "FileText", title: "Договор и сроки", desc: "Чёткие сроки и стоимость прописаны в договоре. Соблюдаем их и сдаём проект вовремя." },
  { icon: "CheckCircle", title: "Контроль качества", desc: "Проверяем каждый элемент на производстве и при монтаже. Качественная упаковка и бережная доставка." },
  { icon: "Award", title: "Австрийская фурнитура", desc: "Используем надёжную фурнитуру Blum и Makmart — плавный ход и долгий срок службы" },
  { icon: "Trash2", title: "Уборка после монтажа", desc: "Наша бригада убирает весь мусор и упаковку. Сдаём квартиру в идеальном порядке" },
  { icon: "CreditCard", title: "Рассрочка без %", desc: "Рассрочка напрямую от нашей компании, без банков и переплат. Платежи по графику в договоре." },
];

interface IndexCatalogProps {
  getImg: (key: string) => string;
}

export default function IndexCatalog({ getImg }: IndexCatalogProps) {
  return (
    <>
      {/* ===== QUIZ ===== */}
      <section id="quiz" className="py-24 gradient-dark relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #f97316 0%, transparent 50%)" }} />

        <div className="max-w-3xl mx-auto px-4 sm:px-8 relative z-10">
          <div className="animate-on-scroll text-center mb-12">
            <div className="text-orange-500 font-display font-semibold text-sm tracking-widest uppercase mb-3">Быстрый расчёт</div>
            <h2 className="section-title text-[1.75rem] sm:text-4xl lg:text-[2.75rem] text-white mb-4">
              Узнайте цену за<br /><span className="gradient-text">2 минуты</span>
            </h2>
            <p className="text-white/60 text-lg">
              Ответьте на несколько вопросов — получите предварительный расчёт и скидку <strong className="text-orange-400">5%</strong> на первый заказ
            </p>
          </div>

          <QuizCalculator />
        </div>
      </section>

      {/* ===== STEPS ===== */}
      <section id="steps" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="animate-on-scroll text-center mb-10 sm:mb-16">
            <div className="text-orange-500 font-display font-semibold text-sm tracking-widest uppercase mb-3">Процесс работы</div>
            <h2 className="section-title text-[1.75rem] sm:text-4xl lg:text-[2.75rem] text-gray-900">
              5 шагов к новой мебели
            </h2>
          </div>

          <StepsMobileSlider steps={STEPS} />

          <div className="relative hidden sm:block">
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
                  <h3 className="font-display text-gray-900 uppercase tracking-wide mb-2 font-bold text-lg">{step.title}</h3>
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
            <h2 className="section-title text-[1.75rem] sm:text-4xl lg:text-[2.75rem] text-white">
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