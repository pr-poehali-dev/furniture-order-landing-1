import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { PORTFOLIO_CATEGORIES, categoryCoverKey } from "@/lib/siteImages";

const REVIEWS = [
  { name: "Анна К.", city: "Москва", text: "Сделали кухню точно в срок, 3D-проект был идеален. Монтажники убрали за собой весь мусор — это особенно порадовало!", rating: 5, date: "Март 2024" },
  { name: "Дмитрий В.", city: "Подмосковье", text: "Заказывал гардеробную, очень доволен качеством. Фурнитура Blum — просто песня, всё ходит как часы. Рекомендую!", rating: 5, date: "Январь 2024" },
  { name: "Елена М.", city: "Москва", text: "Долго выбирала компанию, остановилась на МебельМастер. Детская получилась именно такой, как хотела. Дочка в восторге!", rating: 5, date: "Февраль 2024" },
  { name: "Сергей Н.", city: "Химки", text: "Ребята работают строго по договору, никаких скрытых доплат. Шкаф-купе сделали за 18 дней — даже раньше обещанного!", rating: 5, date: "Апрель 2024" },
];

interface IndexPortfolioProps {
  getImg: (key: string) => string;
}

export default function IndexPortfolio({ getImg }: IndexPortfolioProps) {
  return (
    <>
      {/* ===== PORTFOLIO ===== */}
      <section id="portfolio" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="animate-on-scroll text-center mb-16">
            <div className="text-orange-500 font-display font-semibold text-sm tracking-widest uppercase mb-3">Готовые работы</div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-gray-900 uppercase tracking-wide">
              Портфолио
            </h2>
            <p className="text-gray-500 text-lg mt-4">Выберите категорию, чтобы посмотреть проекты</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PORTFOLIO_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                to={`/portfolio/${cat.slug}`}
                className="animate-on-scroll group cursor-pointer card-hover rounded-2xl overflow-hidden shadow-md block"
              >
                <div className="relative h-64 overflow-hidden">
                  <img src={getImg(categoryCoverKey(cat.slug))} alt={cat.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-orange-500 text-white text-xs font-display font-semibold px-3 py-1 rounded-full uppercase tracking-wide">{cat.tag}</span>
                  </div>
                  <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/55 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                    <Icon name="FolderOpen" size={13} className="text-white" />
                    {cat.projects.length}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="font-display font-bold text-white text-xl uppercase">{cat.title}</h3>
                    <p className="text-white/70 text-xs mt-1">{cat.description}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-orange-400 font-display font-bold text-sm uppercase">Смотреть проекты</span>
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-orange-500 transition-colors duration-300">
                        <Icon name="ArrowRight" size={14} className="text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

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
    </>
  );
}
