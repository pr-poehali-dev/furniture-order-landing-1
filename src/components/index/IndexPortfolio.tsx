import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import IndexVideos from "@/components/index/IndexVideos";
import { PORTFOLIO_CATEGORIES, categoryCoverKey } from "@/lib/siteImages";

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
            <h2 className="section-title text-[1.75rem] sm:text-4xl lg:text-[2.75rem] text-gray-900">
              Портфолио
            </h2>
            <p className="text-gray-500 text-sm sm:text-lg mt-3 sm:mt-4">Выберите категорию, чтобы посмотреть проекты</p>
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
                    <div className="flex items-center justify-end gap-2 mt-3">
                      <span className="text-orange-400 font-display font-bold text-[11px] uppercase tracking-wide">Смотреть проекты</span>
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

      <IndexVideos />
    </>
  );
}