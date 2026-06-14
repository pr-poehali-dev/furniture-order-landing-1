import { Link, useParams } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { findCategory, getProjectGallery, useSiteImages } from "@/lib/siteImages";

export default function PortfolioCategory() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const getImg = useSiteImages();
  const category = categorySlug ? findCategory(categorySlug) : undefined;

  if (!category) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50 px-4 text-center">
        <Icon name="FolderX" size={48} className="text-gray-300" />
        <h1 className="font-display text-2xl font-bold text-gray-900">Категория не найдена</h1>
        <Link to="/#portfolio" className="btn-orange px-6 py-3 rounded-xl text-sm">На главную</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gray-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 flex items-center justify-between">
          <Link to="/#portfolio" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm">
            <Icon name="ArrowLeft" size={18} />
            Все категории
          </Link>
          <Link to="/" className="btn-outline-orange px-4 py-2 rounded-lg text-xs flex items-center gap-1.5">
            <Icon name="Home" size={14} />
            На главную
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <div className="mb-10">
          <span className="bg-orange-500 text-white text-xs font-display font-semibold px-3 py-1 rounded-full uppercase tracking-wide">{category.tag}</span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-gray-900 uppercase tracking-wide mt-4">{category.title}</h1>
          <p className="text-gray-500 text-lg mt-3">{category.description}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {category.projects.map((proj) => {
            const count = getProjectGallery(proj.slot).length;
            return (
              <Link
                key={proj.slug}
                to={`/portfolio/${category.slug}/${proj.slug}`}
                className="group cursor-pointer card-hover rounded-2xl overflow-hidden shadow-md block bg-white"
              >
                <div className="relative h-64 overflow-hidden">
                  <img src={getImg(proj.slot)} alt={proj.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  {count > 1 && (
                    <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/55 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                      <Icon name="Images" size={13} className="text-white" />
                      {count}
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
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
