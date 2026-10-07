import Icon from "@/components/ui/icon";
import PhoneInput from "@/components/ui/phone-input";

interface IndexFooterProps {
  formName: string;
  setFormName: (v: string) => void;
  formPhone: string;
  setFormPhone: (v: string) => void;
  formSent: boolean;
  formSending: boolean;
  formError: string;
  handleFormSubmit: (e: React.FormEvent) => void;
}

export default function IndexFooter({
  formName,
  setFormName,
  formPhone,
  setFormPhone,
  formSent,
  formSending,
  formError,
  handleFormSubmit,
}: IndexFooterProps) {
  return (
    <>
      {/* ===== CONTACT FORM ===== */}
      <section id="contact" className="py-24 gradient-hero relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 50% 50%, #f97316 0%, transparent 60%)" }} />

        <div className="max-w-2xl mx-auto px-4 sm:px-8 relative z-10 text-center">
          <div className="animate-on-scroll">
            <div className="text-orange-500 font-display font-semibold text-sm tracking-widest uppercase mb-3">Бесплатно</div>
            <h2 className="section-title text-[1.75rem] sm:text-4xl lg:text-[2.75rem] text-white mb-4">
              Закажите бесплатный<br />
              <span className="gradient-text">выезд замерщика</span>
            </h2>
            <p className="text-white/60 text-lg mb-10">Приедем и сделаем точные замеры.</p>
          </div>

          {!formSent ? (
            <form className="animate-on-scroll glass-card rounded-3xl p-8 border border-orange-500/20" onSubmit={handleFormSubmit}>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-white/60 text-sm mb-2 block text-left">Ваше имя</label>
                  <input
                    type="text"
                    placeholder="Как вас зовут?"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-orange-500 transition-colors text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="text-white/60 text-sm mb-2 block text-left">Телефон</label>
                  <PhoneInput
                    value={formPhone}
                    onChange={setFormPhone}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-orange-500 transition-colors text-sm"
                    required
                  />
                </div>
              </div>
              <button type="submit" disabled={formSending} className="btn-orange w-full py-4 rounded-xl text-base disabled:opacity-60">
                {formSending ? "Отправляем..." : "Вызвать замерщика бесплатно"}
              </button>
              {formError && <p className="text-red-400 text-sm mt-3">{formError}</p>}
              <p className="text-white/30 text-xs mt-4">
                Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности. Не передаём данные третьим лицам.
              </p>
            </form>
          ) : (
            <div className="animate-on-scroll glass-card rounded-3xl p-10 border border-green-500/30 text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="CheckCircle" size={32} className="text-green-400" />
              </div>
              <h3 className="font-display text-2xl font-bold text-white uppercase mb-2">Заявка принята!</h3>
              <p className="text-white/60">Менеджер позвонит вам в течение 15 минут и согласует время визита.</p>
            </div>
          )}
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-gray-950 border-t border-white/10 pt-14 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="flex items-center mb-4">
                <img
                  src="https://cdn.poehali.dev/projects/e84f41ff-e623-49a2-a773-de1e473421e0/bucket/logo/svoy-stil-transparent.png"
                  alt="Логотип Свой Стиль"
                  className="h-14 w-14 object-contain"
                />
                <span className="font-display font-bold text-xl text-white tracking-wide -ml-1">
                  СВОЙ<span className="gradient-text"> СТИЛЬ</span>
                </span>
              </div>
              <p className="text-white/50 text-sm leading-relaxed">Корпусная мебель на заказ в Барнауле и Алтайском крае. Свой Стиль — производство с 2012 года.</p>
            </div>

            <div>
              <h4 className="font-display font-semibold text-white uppercase tracking-wide text-sm mb-4">Контакты</h4>
              <div className="space-y-3">
                <a href="tel:+74951234567" className="flex items-center gap-2 text-white/60 hover:text-orange-400 transition-colors text-sm">+7 (913) 274-85-19</a>
                <a href="mailto:info@mebel-master.ru" className="flex items-center gap-2 text-white/60 hover:text-orange-400 transition-colors text-sm">mebel.ma@mail.ru</a>
                <div className="flex items-start gap-2 text-white/60 text-sm">
                  <Icon name="MapPin" size={14} className="text-orange-500 mt-0.5 shrink-0" />
                  <span>г. Барнаул, ул. Сергея Ускова, 23</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-display font-semibold text-white uppercase tracking-wide text-sm mb-4">Каталог</h4>
              <div className="space-y-2 text-sm">
                {["Кухни", "Шкафы-купе", "Гардеробные", "Детская", "Гостиные", "Прихожие"].map((item) => (
                  <div key={item}>
                    <a href="#catalog" className="text-white/50 hover:text-orange-400 transition-colors">{item}</a>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-display font-semibold text-white uppercase tracking-wide text-sm mb-4">Мы в соцсетях</h4>
              <div className="flex gap-3 mb-6">
                <a href="https://vk.com/barnaul_mebel22" target="_blank" rel="noopener noreferrer" className="w-10 h-10 glass-card rounded-xl flex items-center justify-center hover:border-orange-500/50 transition-colors group">
                  <span className="text-white/60 group-hover:text-orange-400 text-sm font-bold">ВК</span>
                </a>
              </div>
              <div className="text-white/30 text-xs space-y-1">
                <div>ИНН: 222510796208</div>
                <div>ОГРН: 324220200022301</div>
                <div>ИП Нагайцев А.В.</div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-white/30 text-xs">© 2024 Свой Стиль. Все права защищены.</p>
            <div className="flex gap-4 text-xs">
              <a href="#" className="text-white/30 hover:text-orange-400 transition-colors">Политика конфиденциальности</a>
              <a href="#" className="text-white/30 hover:text-orange-400 transition-colors">Договор оферты</a>
              <a href="/admin" className="text-white/30 hover:text-orange-400 transition-colors">Управление фото</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}