import Icon from "@/components/ui/icon";

interface ChatMessage {
  from: string;
  text: string;
}

interface IndexFooterProps {
  formName: string;
  setFormName: (v: string) => void;
  formPhone: string;
  setFormPhone: (v: string) => void;
  formSent: boolean;
  handleFormSubmit: (e: React.FormEvent) => void;
  chatOpen: boolean;
  setChatOpen: (v: boolean) => void;
  chatMessages: ChatMessage[];
  chatInput: string;
  setChatInput: (v: string) => void;
  handleSendChat: () => void;
  chatEndRef: React.RefObject<HTMLDivElement>;
}

export default function IndexFooter({
  formName,
  setFormName,
  formPhone,
  setFormPhone,
  formSent,
  handleFormSubmit,
  chatOpen,
  setChatOpen,
  chatMessages,
  chatInput,
  setChatInput,
  handleSendChat,
  chatEndRef,
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
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white uppercase tracking-wide mb-4">
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
                  <input
                    type="tel"
                    placeholder="+7 (___) ___-__-__"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-orange-500 transition-colors text-sm"
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn-orange w-full py-4 rounded-xl text-base">
                Вызвать замерщика бесплатно
              </button>
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
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded gradient-orange flex items-center justify-center">
                  <Icon name="Layers" size={16} className="text-white" />
                </div>
                <span className="font-display font-bold text-xl text-white tracking-wide">
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
                <a href="#" className="w-10 h-10 glass-card rounded-xl flex items-center justify-center hover:border-orange-500/50 transition-colors group">
                  <span className="text-white/60 group-hover:text-orange-400 text-sm font-bold">ВК</span>
                </a>
                <a href="#" className="w-10 h-10 glass-card rounded-xl flex items-center justify-center hover:border-orange-500/50 transition-colors group">
                  <Icon name="Send" size={16} className="text-white/60 group-hover:text-orange-400" />
                </a>
              </div>
              <div className="text-white/30 text-xs space-y-1">
                <div>ИНН: 7701234567</div>
                <div>ОГРН: 1127700000000</div>
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

      {/* ===== ONLINE CHAT ===== */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        {chatOpen && (
          <div className="w-80 sm:w-96 bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100" style={{ animation: "scale-in 0.25s ease-out forwards" }}>
            <div className="gradient-orange px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                  <Icon name="MessageCircle" size={18} className="text-white" />
                </div>
                <div>
                  <div className="text-white font-display font-bold text-sm uppercase">Онлайн-консультант</div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    <span className="text-white/80 text-xs">Онлайн</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-white/80 hover:text-white">
                <Icon name="X" size={18} />
              </button>
            </div>

            <div className="h-64 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] px-4 py-2.5 text-sm leading-relaxed rounded-2xl ${
                      msg.from === "user"
                        ? "gradient-orange text-white"
                        : "bg-white text-gray-700 shadow-sm border border-gray-100"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
              <input
                type="text"
                placeholder="Задайте вопрос..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 placeholder-gray-400"
              />
              <button onClick={handleSendChat} className="btn-orange w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
                <Icon name="Send" size={16} className="text-white" />
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="w-14 h-14 gradient-orange rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200"
          style={{ boxShadow: "0 8px 24px rgba(249,115,22,0.45)" }}
        >
          <Icon name={chatOpen ? "X" : "MessageCircle"} size={24} className="text-white" />
        </button>
      </div>
    </>
  );
}