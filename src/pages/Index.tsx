import { useState, useEffect } from "react";
import { useSiteImages } from "@/lib/siteImages";
import IndexHeader from "@/components/index/IndexHeader";
import IndexCatalog from "@/components/index/IndexCatalog";
import IndexPortfolio from "@/components/index/IndexPortfolio";
import IndexServices from "@/components/index/IndexServices";
import IndexSeoText from "@/components/index/IndexSeoText";
import IndexFooter from "@/components/index/IndexFooter";
import { sendLead } from "@/lib/leads";

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

  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formSent, setFormSent] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const [formSending, setFormSending] = useState(false);
  const [formError, setFormError] = useState("");

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSending(true);
    setFormError("");
    try {
      await sendLead({ source: "measure", name: formName, phone: formPhone });
      setFormSent(true);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Не удалось отправить заявку");
    } finally {
      setFormSending(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', sans-serif", background: "#0a0f1a" }}>
      <IndexHeader
        getImg={getImg}
        mobileMenu={mobileMenu}
        setMobileMenu={setMobileMenu}
      />

      <IndexPortfolio getImg={getImg} />

      <IndexCatalog getImg={getImg} />

      <IndexServices getImg={getImg} />

      <IndexSeoText />

      <IndexFooter
        formName={formName}
        setFormName={setFormName}
        formPhone={formPhone}
        setFormPhone={setFormPhone}
        formSent={formSent}
        formSending={formSending}
        formError={formError}
        handleFormSubmit={handleFormSubmit}
      />
    </div>
  );
}