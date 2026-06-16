import { useState } from "react";
import Icon from "@/components/ui/icon";

type Question =
  | { id: string; q: string; type: "options"; options: string[] }
  | { id: string; q: string; type: "slider"; min: number; max: number; unit: string };

const COMMON_TIMING: Question = {
  id: "timing",
  q: "Когда планируете заказ?",
  type: "options",
  options: ["Сейчас — делаю ремонт", "Через 1–3 месяца", "Через полгода", "Просто интересует цена"],
};

const KITCHEN_QUESTIONS: Question[] = [
  { id: "shape", q: "Какая форма кухни?", type: "options", options: ["Прямая", "Островная", "Угловая", "П-образная"] },
  { id: "length", q: "Общая длина кухни, погонных метров?", type: "slider", min: 1, max: 15, unit: "м" },
  { id: "material", q: "Какой материал предпочитаете?", type: "options", options: ["ЛДСП", "МДФ", "Глянец", "Эмаль", "Шпон"] },
  { id: "hardware", q: "Тип фурнитуры?", type: "options", options: ["Премиум", "Стандарт", "Эконом"] },
  { id: "appliances", q: "Бытовая техника?", type: "options", options: ["Встроенная", "Отдельностоящая"] },
  COMMON_TIMING,
];

const WARDROBE_QUESTIONS: Question[] = [
  { id: "shape", q: "Какая форма шкафа?", type: "options", options: ["Прямой", "Угловой"] },
  { id: "doors", q: "Какие двери для шкафа?", type: "options", options: ["Распашные", "Купе"] },
  { id: "area", q: "Примерная площадь помещения?", type: "options", options: ["До 8 м²", "8–15 м²", "15–25 м²", "Более 25 м²"] },
  { id: "material", q: "Какой материал предпочитаете?", type: "options", options: ["ЛДСП", "МДФ", "Глянец", "Эмаль", "Шпон"] },
  COMMON_TIMING,
];

interface QuizCalculatorProps {
  handleFormSubmit: (e: React.FormEvent) => void;
}

export default function QuizCalculator({ handleFormSubmit }: QuizCalculatorProps) {
  const [type, setType] = useState<"" | "kitchen" | "wardrobe">("");
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [sliderVal, setSliderVal] = useState(3);
  const [, setAnswers] = useState<Record<string, string>>({});

  const questions = type === "kitchen" ? KITCHEN_QUESTIONS : type === "wardrobe" ? WARDROBE_QUESTIONS : [];
  // Шаг 0 — выбор типа мебели, далее — вопросы выбранной ветки
  const totalSteps = 1 + questions.length;
  const currentIndex = type === "" ? -1 : step;

  const saveAnswer = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const goNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setDone(true);
    }
  };

  const handleType = (t: "kitchen" | "wardrobe") => {
    setType(t);
    setStep(0);
    saveAnswer("type", t === "kitchen" ? "Кухня" : "Шкаф");
  };

  const handleOption = (q: Question, opt: string) => {
    saveAnswer(q.id, opt);
    goNext();
  };

  const handleSlider = (q: Question) => {
    saveAnswer(q.id, `${sliderVal} ${(q as { unit: string }).unit}`);
    goNext();
  };

  const restart = () => {
    setType("");
    setStep(0);
    setDone(false);
    setSliderVal(3);
    setAnswers({});
  };

  // прогресс-полоски: первая — выбор типа, остальные — вопросы
  const progressCount = type === "" ? 6 : totalSteps;
  const progressActive = type === "" ? 0 : step + 1;

  return (
    <div className="glass-card rounded-3xl p-8 border border-orange-500/20">
      {!done ? (
        <>
          <div className="flex items-center gap-3 mb-8">
            {Array.from({ length: progressCount }).map((_, i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i < progressActive ? "bg-orange-500" : "bg-white/10"}`} />
            ))}
          </div>

          {type === "" ? (
            <>
              <div className="text-orange-400 text-sm font-semibold mb-3">Шаг 1</div>
              <h3 className="font-display text-2xl font-bold text-white uppercase tracking-wide mb-6">Какую мебель хотите заказать?</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <button
                  className="text-left px-5 py-4 rounded-xl border border-white/15 text-white/80 hover:border-orange-500 hover:bg-orange-500/10 hover:text-white transition-all duration-200 text-sm flex items-center gap-3"
                  onClick={() => handleType("kitchen")}
                >
                  <Icon name="UtensilsCrossed" size={18} className="text-orange-400" /> Кухню
                </button>
                <button
                  className="text-left px-5 py-4 rounded-xl border border-white/15 text-white/80 hover:border-orange-500 hover:bg-orange-500/10 hover:text-white transition-all duration-200 text-sm flex items-center gap-3"
                  onClick={() => handleType("wardrobe")}
                >
                  <Icon name="Shirt" size={18} className="text-orange-400" /> Шкаф
                </button>
              </div>
            </>
          ) : (
            (() => {
              const q = questions[currentIndex];
              return (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-orange-400 text-sm font-semibold">Вопрос {step + 1} из {questions.length}</span>
                    <button onClick={restart} className="text-white/40 hover:text-white text-xs flex items-center gap-1 transition-colors">
                      <Icon name="RotateCcw" size={13} /> Сначала
                    </button>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white uppercase tracking-wide mb-6">{q.q}</h3>

                  {q.type === "options" ? (
                    <div className="grid sm:grid-cols-2 gap-3">
                      {q.options.map((opt, i) => (
                        <button
                          key={i}
                          className="text-left px-5 py-4 rounded-xl border border-white/15 text-white/80 hover:border-orange-500 hover:bg-orange-500/10 hover:text-white transition-all duration-200 text-sm"
                          onClick={() => handleOption(q, opt)}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div>
                      <div className="text-center mb-6">
                        <span className="font-display text-5xl font-bold gradient-text">{sliderVal}</span>
                        <span className="text-white/60 text-xl ml-2">{q.unit}</span>
                      </div>
                      <input
                        type="range"
                        min={q.min}
                        max={q.max}
                        step={0.5}
                        value={sliderVal}
                        onChange={(e) => setSliderVal(Number(e.target.value))}
                        className="w-full accent-orange-500 cursor-pointer"
                      />
                      <div className="flex justify-between text-white/40 text-xs mt-2">
                        <span>{q.min} {q.unit}</span>
                        <span>{q.max} {q.unit}</span>
                      </div>
                      <button
                        className="btn-orange w-full mt-6 py-3.5 rounded-xl text-sm"
                        onClick={() => handleSlider(q)}
                      >
                        Далее
                      </button>
                    </div>
                  )}
                </>
              );
            })()
          )}
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
  );
}
