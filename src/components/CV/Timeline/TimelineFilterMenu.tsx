import { useEffect, useRef, useState } from "react";

import { useLanguage } from "../../../context/LanguageContext";
import type { TimelineEventType } from "./timelineTypes";

const filterTypes: TimelineEventType[] = ["school", "work"];

type TimelineFilterMenuProps = {
  activeTypes: Record<TimelineEventType, boolean>;
  onToggleType: (type: TimelineEventType) => void;
};

export default function TimelineFilterMenu({
  activeTypes,
  onToggleType,
}: TimelineFilterMenuProps) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={menuRef} className="timeline-filter">
      <button
        className="timeline-filter-button"
        type="button"
        aria-label={t("timeline.filter.toggleLabel")}
        aria-expanded={isOpen}
        onClick={() => {
          setIsOpen((currentValue) => !currentValue);
        }}
      >
        <span />
        <span />
        <span />
      </button>

      {isOpen ? (
        <div className="timeline-filter-panel">
          <h2>{t("timeline.filter.title")}</h2>
          <div className="timeline-filter-options">
            {filterTypes.map((type) => (
              <label key={type} className="timeline-filter-option">
                <input
                  type="checkbox"
                  checked={activeTypes[type]}
                  onChange={() => {
                    onToggleType(type);
                  }}
                />
                <span className={`timeline-filter-swatch timeline-filter-swatch--${type}`} />
                <span>{t(`timeline.type.${type}`)}</span>
              </label>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
