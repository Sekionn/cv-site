import { useLanguage } from "../context/LanguageContext";

export default function LanguageToggle() {
  const { toggleLanguage, t } = useLanguage();

  return (
    <button
      className="language-toggle"
      type="button"
      aria-label={t("language.toggleLabel")}
      onClick={toggleLanguage}
    >
      <span>{t("language.currentAbbr")}</span>
    </button>
  );
}
