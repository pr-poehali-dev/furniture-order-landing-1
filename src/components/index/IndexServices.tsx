import Icon from "@/components/ui/icon";

interface IndexServicesProps {
  getImg: (key: string) => string;
}

export default function IndexServices({ getImg }: IndexServicesProps) {
  return (
    <section id="catalog" className="py-12 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="animate-on-scroll text-center mb-6 sm:mb-16">
          <div className="text-orange-500 font-display font-semibold text-sm tracking-widest uppercase mb-3">Наши возможности</div>
          <h2 className="section-title text-[1.75rem] sm:text-4xl lg:text-[2.75rem] text-gray-900">
            Что мы делаем
          </h2>
          <p className="text-gray-500 text-sm sm:text-lg mt-2 sm:mt-4 max-w-xl mx-auto">
            Любая мебель — от эскиза до монтажа — точно под размеры вашего пространства
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-6">
          {[
            { img: getImg("cat_kitchen"), title: "Кухни", desc: "Угловые, прямые, П-образные. МДФ, ЛДСП, массив. Любая планировка.", icon: "UtensilsCrossed", color: "#f97316" },
            { img: getImg("cat_wardrobe"), title: "Шкафы и гардеробные", desc: "Вместительные системы хранения под ваш интерьер — распашные и купе. Продуманное наполнение до последнего сантиметра.", icon: "Shirt", color: "#ea580c" },
            { img: getImg("cat_kids"), title: "Мебель для детской", desc: "Безопасные материалы и яркие цвета. Удобные системы хранения для игрушек и вещей.", icon: "Baby", color: "#fb923c" },
            { img: getImg("cat_living"), title: "Гостиные и прихожие", desc: "Стеллажи, тумбы под ТВ, обувницы, вешалки под ваш стиль.", icon: "Sofa", color: "#c2410c" },
            { img: getImg("cat_bathroom"), title: "Санузлы", desc: "Влагостойкая мебель для ванной: тумбы, пеналы, шкафчики под раковину.", icon: "Bath", color: "#f97316" },
            { img: getImg("cat_business"), title: "Мебель для бизнеса", desc: "Ресепшн, барные стойки, торговое оборудование для офисов, кафе и магазинов.", icon: "Briefcase", color: "#ea580c" },
          ].map((cat, i) => (
            <div key={i} className="group card-hover animate-on-scroll rounded-xl sm:rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white flex flex-col">
              <div className="relative h-16 sm:h-52 overflow-hidden flex-shrink-0">
                <img src={cat.img} alt={cat.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute top-1.5 left-1.5 sm:top-4 sm:left-4 w-5 h-5 sm:w-10 sm:h-10 rounded-md sm:rounded-xl flex items-center justify-center" style={{ background: cat.color }}>
                  <Icon name={cat.icon} size={11} className="text-white" fallback="Package" />
                </div>
              </div>
              <div className="p-1.5 sm:p-5 flex flex-col flex-1">
                <h3 className="font-display font-bold text-gray-900 text-[10px] leading-tight sm:text-xl uppercase sm:tracking-wide mb-1.5 sm:mb-2">{cat.title}</h3>
                <p className="hidden sm:block text-gray-500 text-sm leading-relaxed mb-4 flex-1">{cat.desc}</p>
                <button
                  className="btn-orange w-full py-1 sm:py-2.5 rounded-md sm:rounded-xl text-[9px] sm:text-sm mt-auto"
                  onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                >
                  <span className="sm:hidden">Хочу</span>
                  <span className="hidden sm:inline">Хочу такую же</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
