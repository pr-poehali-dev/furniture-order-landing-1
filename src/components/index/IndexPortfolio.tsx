import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { getProjectGallery } from "@/lib/siteImages";

export const PORTFOLIO = [
  { slot: "portfolio_1", title: "Кухня МДФ эмаль", material: "Фурнитура Blum, столешница Pfleiderer", price: "от 185 000 ₽", tag: "Кухня" },
  { slot: "portfolio_2", title: "Шкаф-купе в спальню", material: "ЛДСП Egger, система Hettich", price: "от 64 000 ₽", tag: "Шкаф" },
  { slot: "portfolio_3", title: "Гостиная со стеллажами", material: "МДФ + шпон дуба, фурнитура Grass", price: "от 120 000 ₽", tag: "Гостиная" },
  { slot: "portfolio_4", title: "Детская комната", material: "ЛДСП Egger, безопасные кромки", price: "от 78 000 ₽", tag: "Детская" },
  { slot: "portfolio_5", title: "Угловая кухня в стиле loft", material: "МДФ плёнка, столешница из акрила", price: "от 210 000 ₽", tag: "Кухня" },
  { slot: "portfolio_6", title: "Гардеробная система", material: "ЛДСП + алюминиевый профиль", price: "от 95 000 ₽", tag: "Гардеробная" },
];

export type PortfolioItem = typeof PORTFOLIO[0];

const REVIEWS = [
  { name: "Анна К.", city: "Москва", text: "Сделали кухню точно в срок, 3D-проект был идеален. Монтажники убрали за собой весь мусор — это особенно порадовало!", rating: 5, date: "Март 2024" },
  { name: "Дмитрий В.", city: "Подмосковье", text: "Заказывал гардеробную, очень доволен качеством. Фурнитура Blum — просто песня, всё ходит как часы. Рекомендую!", rating: 5, date: "Январь 2024" },
  { name: "Елена М.", city: "Москва", text: "Долго выбирала компанию, остановилась на МебельМастер. Детская получилась именно такой, как хотела. Дочка в восторге!", rating: 5, date: "Февраль 2024" },
  { name: "Сергей Н.", city: "Химки", text: "Ребята работают строго по договору, никаких скрытых доплат. Шкаф-купе сделали за 18 дней — даже раньше обещанного!", rating: 5, date: "Апрель 2024" },
];

function ProjectModal({ project, onClose }: { project: PortfolioItem; onClose: () => void }) {
  const gallery = getProjectGallery(project.slot);
  const [active, setActive] = useState(0);

  useEffect(() => {
    setActive(0);
  }, [project.slot]);

  const activeIndex = Math.min(active, gallery.length - 1);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl max-h-[92vh] overflow-y-auto"
        style={{ animation: "scale-in 0.3s ease-out forwards" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-80 bg-gray-100">
          <img src={gallery[activeIndex]} alt={project.title} className="w-full h-full object-cover" />
          <button
            className="absolute top-4 right-4 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            onClick={onClose}
          >
            <Icon name="X" size={18} />
          </button>
          <div className="absolute top-4 left-4">
            <span className="bg-orange-500 text-white text-xs font-display font-semibold px-3 py-1 rounded-full uppercase">{project.tag}</span>
          </div>

          {gallery.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                onClick={() => setActive((activeIndex - 1 + gallery.length) % gallery.length)}
              >
                <Icon name="ChevronLeft" size={20} />
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                onClick={() => setActive((activeIndex + 1) % gallery.length)}
              >
                <Icon name="ChevronRight" size={20} />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs font-semibold px-3 py-1 rounded-full">
                {activeIndex + 1} / {gallery.length}
              </div>
            </>
          )}
        </div>

        {gallery.length > 1 && (
          <div className="flex gap-2 px-6 pt-4 overflow-x-auto">
            {gallery.map((img, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`relative w-20 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-colors ${i === activeIndex ? "border-orange-500" : "border-transparent opacity-70 hover:opacity-100"}`}
              >
                <img src={img} alt={`${project.title} фото ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        <div className="p-6">
          <h3 className="font-display text-2xl font-bold text-gray-900 uppercase tracking-wide">{project.title}</h3>
          <p className="text-gray-500 mt-2">{project.material}</p>
          <div className="flex items-center justify-between mt-4">
            <div>
              <div className="text-gray-400 text-sm">Стоимость под ключ</div>
              <div className="font-display text-2xl font-bold text-orange-500">{project.price}</div>
            </div>
            <button
              className="btn-orange px-6 py-3 rounded-xl text-sm"
              onClick={() => { onClose(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }}
            >
              Хочу такую же
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface IndexPortfolioProps {
  getImg: (key: string) => string;
  selectedProject: PortfolioItem | null;
  setSelectedProject: (p: PortfolioItem | null) => void;
}

export default function IndexPortfolio({ getImg, selectedProject, setSelectedProject }: IndexPortfolioProps) {
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
                  <img src={getImg(proj.slot)} alt={proj.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-orange-500 text-white text-xs font-display font-semibold px-3 py-1 rounded-full uppercase tracking-wide">{proj.tag}</span>
                  </div>
                  {getProjectGallery(proj.slot).length > 1 && (
                    <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/55 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                      <Icon name="Images" size={13} className="text-white" />
                      {getProjectGallery(proj.slot).length}
                    </div>
                  )}
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
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
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
              <span className="text-gray-400"></span>
              <span className="text-gray-500"></span>
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