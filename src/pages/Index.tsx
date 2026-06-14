import { useState, useEffect, useRef } from "react";
import { useSiteImages } from "@/lib/siteImages";
import IndexHeader from "@/components/index/IndexHeader";
import IndexCatalog from "@/components/index/IndexCatalog";
import IndexPortfolio from "@/components/index/IndexPortfolio";
import IndexFooter from "@/components/index/IndexFooter";

const QUIZ_QUESTIONS_COUNT = 4;

function useScrollAnimation() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );
    document.querySelectorAll(".animate-on-scroll").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

export default function Index() {
  useScrollAnimation();
  const getImg = useSiteImages();

  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const [quizDone, setQuizDone] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { from: "bot", text: "Привет! Я онлайн-консультант «Свой Стиль». Задайте любой вопрос о нашей мебели или стоимости." },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formSent, setFormSent] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleQuizAnswer = (answer: string) => {
    const newAnswers = [...quizAnswers, answer];
    setQuizAnswers(newAnswers);
    if (quizStep < QUIZ_QUESTIONS_COUNT - 1) {
      setQuizStep(quizStep + 1);
    } else {
      setQuizDone(true);
    }
  };

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const userMsg = { from: "user", text: chatInput };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "Спасибо за вопрос! Наш менеджер ответит в течение нескольких минут. Или оставьте телефон — перезвоним немедленно!",
        },
      ]);
    }, 1000);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
  };

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Golos Text', sans-serif", background: "#0a0f1a" }}>
      <IndexHeader
        getImg={getImg}
        mobileMenu={mobileMenu}
        setMobileMenu={setMobileMenu}
      />

      <IndexCatalog
        getImg={getImg}
        quizStep={quizStep}
        quizDone={quizDone}
        handleQuizAnswer={handleQuizAnswer}
        handleFormSubmit={handleFormSubmit}
      />

      <IndexPortfolio getImg={getImg} />

      <IndexFooter
        formName={formName}
        setFormName={setFormName}
        formPhone={formPhone}
        setFormPhone={setFormPhone}
        formSent={formSent}
        handleFormSubmit={handleFormSubmit}
        chatOpen={chatOpen}
        setChatOpen={setChatOpen}
        chatMessages={chatMessages}
        chatInput={chatInput}
        setChatInput={setChatInput}
        handleSendChat={handleSendChat}
        chatEndRef={chatEndRef}
      />
    </div>
  );
}