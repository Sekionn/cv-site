import type { CSSProperties } from "react";
import { useLanguage } from "../../../context/LanguageContext";
import type {
  RegisterTimelineNode,
  TimelineEvent,
} from "./timelineTypes";

type TimelineEventCardProps = {
  event: TimelineEvent;
  left: number;
  top: number;
  isSelected: boolean;
  onSelect: (event: TimelineEvent) => void;
  registerNode: RegisterTimelineNode;
};

export default function TimelineEventCard({
  event,
  left,
  top,
  isSelected,
  onSelect,
  registerNode,
}: TimelineEventCardProps) {
  const { t } = useLanguage();
  const dateLabel = formatDateLabel(event);
  const nodePosition =
    event.nodePosition ?? (event.type === "school" ? "below" : "above");
  const cardStyle = {
    "--card-rotation": `${event.yFactor * 1.8}deg`,
  } as CSSProperties & Record<"--card-rotation", string>;

  return (
    <div
      className={`timeline-event timeline-event--${event.type} timeline-event--node-${nodePosition}`}
      style={{
        left: `${left}%`,
        top: `${top}%`,
      }}
    >
      <button
        className="timeline-card"
        type="button"
        aria-expanded={isSelected}
        style={cardStyle}
        onClick={() => {
          onSelect(event);
        }}
      >
        <time dateTime={String(event.startYear)}>{dateLabel}</time>
        <h3>{t(event.titleKey)}</h3>
        {event.locationKey ? (
          <span className="timeline-card-location">
            {t(event.locationKey)}
          </span>
        ) : null}
        <p>{t(event.descriptionKey)}</p>
      </button>

      <div
        ref={(element) => {
          registerNode(event.id, element);
        }}
        className="timeline-node"
      />
    </div>
  );

  function formatDateLabel(timelineEvent: TimelineEvent) {
    if (!timelineEvent.endYear) {
      return `${timelineEvent.startYear} - ${t("common.present")}`;
    }

    if (timelineEvent.startYear === timelineEvent.endYear) {
      return String(timelineEvent.startYear);
    }

    return `${timelineEvent.startYear} - ${timelineEvent.endYear}`;
  }
}
