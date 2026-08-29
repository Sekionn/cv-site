import type { CSSProperties } from "react";
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
  const dateLabel = formatDateLabel(event);
  const cardPosition = event.type === "school" ? "above" : "below";
  const cardStyle = {
    "--card-rotation": `${event.yFactor * 1.8}deg`,
  } as CSSProperties & Record<"--card-rotation", string>;

  return (
    <div
      className={`timeline-event timeline-event--${event.type} timeline-event--${cardPosition}`}
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
        <h3>{event.title}</h3>
        <p>{event.description}</p>
      </button>

      <div
        ref={(element) => {
          registerNode(event.id, element);
        }}
        className="timeline-node"
      />
    </div>
  );
}

function formatDateLabel(event: TimelineEvent) {
  if (!event.endYear) {
    return `${event.startYear} - Present`;
  }

  if (event.startYear === event.endYear) {
    return String(event.startYear);
  }

  return `${event.startYear} - ${event.endYear}`;
}
