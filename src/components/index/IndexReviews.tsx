import { useRef, useState } from "react";
import Icon from "@/components/ui/icon";

const REVIEWS = [
  { name: "Отзыв с 2ГИС", city: "Барнаул", text: "Заказали шкаф в «Свой Стиль» по совету наших знакомых. Они им устанавливали всю мебель в квартиру. Слышали только положительные отзывы. Установили всё качественно и в срок. Спасибо 🤝 Будем вас рекомендовать.", rating: 5, date: "28 апреля 2026" },
  { name: "Отзыв с 2ГИС", city: "Барнаул", text: "Спасибо большое за кухню) нам всё очень понравилось. Отдельное спасибо технологу Алексею, всегда был на связи, отвечал на множество наших вопросов 🙈 нарисовал нам план кафеля и розеток и всё это бесплатно. Ребята-монтажники установили всё за один день. Мы остались очень довольны 😊", rating: 5, date: "13 апреля 2026" },
  { name: "Отзыв с 2ГИС", city: "Барнаул", text: "Обратились в компанию за шкафом-купе. Менеджеры помогли подобрать оптимальный вариант, учли все наши пожелания. Результат превзошёл ожидания, смотрится очень стильно и функционально.", rating: 5, date: "19 октября 2025" },
  { name: "Отзыв с 2ГИС", city: "Барнаул", text: "Детская кровать просто чудесная! Ребёнок в восторге, а мы спокойны за её безопасность и качество.", rating: 5, date: "2 декабря 2025" },
];

export default function IndexReviews() {
  const reviewsRef = useRef<HTMLDivElement>(null);
  const [reviewIdx, setReviewIdx] = useState(0);

  const goToReview = (idx: number) => {
    const el = reviewsRef.current;
    if (!el) return;
    const next = Math.max(0, Math.min(REVIEWS.length - 1, idx));
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
  };

  const handleReviewsScroll = () => {
    const el = reviewsRef.current;
    if (el) setReviewIdx(Math.round(el.scrollLeft / el.clientWidth));
  };

  return (
    <section id="reviews" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="animate-on-scroll text-center mb-16">
          <div className="text-orange-500 font-display font-semibold text-sm tracking-widest uppercase mb-3">Что говорят клиенты</div>
          <h2 className="section-title text-[1.75rem] sm:text-4xl lg:text-[2.75rem] text-gray-900 mb-4">
            Отзывы
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="flex">
              {[1,2,3,4,5].map(s => <Icon key={s} name="Star" size={20} className="star-filled" />)}
            </div>
            <span className="font-display font-bold text-gray-900 text-2xl">4.9</span>
          </div>
        </div>

        <div
          ref={reviewsRef}
          onScroll={handleReviewsScroll}
          className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 overflow-x-auto sm:overflow-visible snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {REVIEWS.map((rev, i) => (
            <div key={i} className="w-full shrink-0 snap-center px-1 sm:px-0 sm:w-auto">
            <div className="glass-card-light rounded-2xl p-6 card-hover h-full">
              <div className="flex mb-3">
                {[1,2,3,4,5].map(s => <Icon key={s} name="Star" size={14} className={s <= rev.rating ? "star-filled" : "text-gray-300"} />)}
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
            </div>
          ))}
        </div>

        <div className="flex sm:hidden items-center justify-center gap-4 mt-6">
          <button
            onClick={() => goToReview(reviewIdx - 1)}
            disabled={reviewIdx === 0}
            aria-label="Предыдущий отзыв"
            className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-700 disabled:opacity-30 active:bg-orange-500 active:text-white transition-colors"
          >
            <Icon name="ChevronLeft" size={18} />
          </button>
          <div className="flex gap-1.5">
            {REVIEWS.map((_, i) => (
              <span key={i} className={`h-1.5 rounded-full transition-all ${i === reviewIdx ? "w-5 bg-orange-500" : "w-1.5 bg-gray-300"}`} />
            ))}
          </div>
          <button
            onClick={() => goToReview(reviewIdx + 1)}
            disabled={reviewIdx === REVIEWS.length - 1}
            aria-label="Следующий отзыв"
            className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-700 disabled:opacity-30 active:bg-orange-500 active:text-white transition-colors"
          >
            <Icon name="ChevronRight" size={18} />
          </button>
        </div>

        <div className="text-center mt-8 sm:mt-12">
          <a
            href="https://2gis.ru/barnaul/firm/70000001089375194/tab/reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-orange inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm"
          >
            <Icon name="MapPin" size={18} className="text-white" />
            Все отзывы в 2ГИС
          </a>
        </div>
      </div>
    </section>
  );
}