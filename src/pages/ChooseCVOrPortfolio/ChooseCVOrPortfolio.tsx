import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import "./ChooseCVOrPortfolio.css"

export default function ChooseCVOrPortfolio() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleMouseMove = async (e: React.MouseEvent<HTMLElement>) => {
    try {
      const mouse = e.currentTarget;

      mouse.style.background =`radial-gradient(circle at ${e.nativeEvent.x}px ${e.nativeEvent.y}px, rgba(255, 255, 255, 0.25) 0rem,rgba(255, 255, 255, 0.08) 10rem, #000000 25rem) center left / 100% 100%`;
    } catch (err) {
      console.error(err);
    }
  };

  const [cvPosition] = useState(() => ({
    x: Math.random() * 80 + 10,
    y: Math.random() * 80 + 10,
  }));

  const [portfolioPosition] = useState(() => ({
    x: Math.random() * 80 + 10,
    y: Math.random() * 80 + 10,
  }));
  
  return (
    <div className="choice-container" onMouseMove={e => handleMouseMove(e)}>
      <div className="random-button black-text"
        style={{
          left: `${cvPosition.x}%`,
          top: `${cvPosition.y}%`,
        }}
        onClick={() => navigate("/curriculum-vitae")}
      >
        {t("choice.cv")}
      </div>

      <div className="random-button black-text"
        style={{
          left: `${portfolioPosition.x}%`,
          top: `${portfolioPosition.y}%`,
        }}
        onClick={() => navigate("/portfolio")}
      >
        {t("choice.portfolio")}
      </div>
    </div>
  );
}
