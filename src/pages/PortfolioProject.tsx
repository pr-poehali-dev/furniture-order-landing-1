import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { findProject, getProjectGallery, useSiteImages } from "@/lib/siteImages";

export default function PortfolioProject() {
  const { categorySlug, projectSlug } = useParams<{ categorySlug: string; projectSlug: string }>();
  useSiteImages();
  const navigate = useNavigate();
  const found = categorySlug && projectSlug ? findProject(categorySlug, projectSlug) : undefined;
  const [active, setActive] = useState(0);

  if (!found) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50 px-4 text-center">
        <Icon name="ImageOff" size={48} className="text-gray-300" />
        <h1 className="font-display text-2xl font-bold text-gray-900">Проект не найден</h1>
        <Link to="/#portfolio" className="btn-orange px-6 py-3 rounded-xl text-sm">На главную</Link>
      </div>
    );
  }

  const { category, project } = found;
  const gallery = getProjectGallery(project.slot);
  const activeIndex = Math.min(active, gallery.length - 1);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gray-950 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-6 flex items-center justify-between">
          <Link to={`/portfolio/${category.slug}`} className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm">
            <Icon name="ArrowLeft" size={18} />
            {category.title}
          </Link>
          <Link to="/" className="btn-outline-orange px-4 py-2 rounded-lg text-xs flex items-center gap-1.5">
            <Icon name="Home" size={14} />
            На главную
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-10">
        <div className="text-gray-400 text-sm flex items-center gap-1.5 mb-6">
          <Link to="/#portfolio" className="hover:text-orange-500">Портфолио</Link>
          <Icon name="ChevronRight" size={14} />
          <Link to={`/portfolio/${category.slug}`} className="hover:text-orange-500">{category.title}</Link>
          <Icon name="ChevronRight" size={14} />
          <span className="text-gray-600">{project.title}</span>
        </div>

        <div className="bg-white rounded-3xl overflow-hidden shadow-md">
          <div className="relative h-[420px] bg-gray-100">
            <img src={gallery[activeIndex]} alt={project.title} className="w-full h-full object-cover" />
            <div className="absolute top-4 left-4">
              <span className="bg-orange-500 text-white text-xs font-display font-semibold px-3 py-1 rounded-full uppercase">{category.tag}</span>
            </div>
            {gallery.length > 1 && (
              <>
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                  onClick={() => setActive((activeIndex - 1 + gallery.length) % gallery.length)}
                >
                  <Icon name="ChevronLeft" size={22} />
                </button>
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                  onClick={() => setActive((activeIndex + 1) % gallery.length)}
                >
                  <Icon name="ChevronRight" size={22} />
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
                  className={`relative w-24 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-colors ${i === activeIndex ? "border-orange-500" : "border-transparent opacity-70 hover:opacity-100"}`}
                >
                  <img src={img} alt={`${project.title} фото ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="p-6 sm:p-8">
            <h1 className="font-display text-3xl font-bold text-gray-900 uppercase tracking-wide">{project.title}</h1>
            <p className="text-gray-500 mt-2">{project.material}</p>
            <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
              <div>
                <div className="text-gray-400 text-sm">Стоимость под ключ</div>
                <div className="font-display text-3xl font-bold text-orange-500">{project.price}</div>
              </div>
              <button
                className="btn-orange px-7 py-3.5 rounded-xl text-sm"
                onClick={() => navigate("/#contact")}
              >
                Хочу такую же
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
