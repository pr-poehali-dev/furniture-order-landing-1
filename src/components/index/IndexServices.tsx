import Icon from "@/components/ui/icon";

interface IndexServicesProps {
  getImg: (key: string) => string;
}

export default function IndexServices({ getImg }: IndexServicesProps) {
  return (
    <section id="catalog" className="py-24 lg:py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="animate-on-scroll text-center mb-16 lg:mb-8">
          <div className="text-orange-500 font-display font-semibold text-sm tracking-widest uppercase mb-3 lg:mb-2">Наши возможности</div>
          <h2 className="section-title text-[1.75rem] sm:text-4xl lg:text-[2.5rem] text-gray-900">
            Что мы делаем
          </h2>
          <p className="text-gray-500 text-lg lg:text-base mt-4 lg:mt-3 max-w-xl mx-auto">
            Любая мебель — от эскиза до монтажа — точно под размеры вашего пространства
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-4">
          {[
            { img: getImg("cat_kitchen"), title: "Кухни", desc: "Угловые, прямые, П-образные. МДФ, ЛДСП, массив. Любая планировка.", icon: "UtensilsCrossed", color: "#f97316" },
            { img: getImg("cat_wardrobe"), title: "Шкафы и гардеробные", desc: "Вместительные системы хранения под ваш интерьер — распашные и купе. Продуманное наполнение до последнего сантиметра.", icon: "Shirt", color: "#ea580c" },
            { img: getImg("cat_kids"), title: "Мебель для детской", desc: "Безопасные материалы и яркие цвета. Удобные системы хранения для игрушек и вещей.", icon: "Baby", color: "#fb923c" },
            { img: getImg("cat_living"), title: "Гостиные и прихожие", desc: "Стеллажи, тумбы под ТВ, обувницы, вешалки под ваш стиль.", icon: "Sofa", color: "#c2410c" },
            { img: getImg("cat_bathroom"), title: "Санузлы", desc: "Влагостойкая мебель для ванной: тумбы, пеналы, шкафчики под раковину.", icon: "Bath", color: "#f97316" },
            { img: getImg("cat_business"), title: "Мебель для бизнеса", desc: "Ресепшн, барные стойки, торговое оборудование для офисов, кафе и магазинов.", icon: "Briefcase", color: "#ea580c" },
          ].map((cat, i) => (
            <div key={i} className="group card-hover animate-on-scroll rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white flex flex-col">
              <div className="relative h-52 lg:h-36 overflow-hidden flex-shrink-0">
                <img src={cat.img} alt={cat.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute top-4 left-4 lg:top-3 lg:left-3 w-10 h-10 lg:w-8 lg:h-8 rounded-xl lg:rounded-lg flex items-center justify-center" style={{ background: cat.color }}>
                  <Icon name={cat.icon} size={18} className="text-white" fallback="Package" />
                </div>
              </div>
              <div className="p-5 lg:p-4 flex flex-col flex-1">
                <h3 className="font-display font-bold text-gray-900 text-xl lg:text-base uppercase tracking-wide mb-2 lg:mb-1">{cat.title}</h3>
                <p className="text-gray-500 text-sm lg:text-xs leading-relaxed mb-4 lg:mb-3 flex-1 lg:line-clamp-2">{cat.desc}</p>
                <button
                  className="btn-orange w-full py-2.5 lg:py-2 rounded-xl text-sm lg:text-xs mt-auto"
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
  );
}
