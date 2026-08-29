import type { TimelineEvent } from "./timelineTypes";

type TimelineEventDetailsProps = {
  event: TimelineEvent;
  onClose: () => void;
};

export default function TimelineEventDetails({
  event,
  onClose,
}: TimelineEventDetailsProps) {
  return (
    <div className="timeline-detail-backdrop" role="presentation">
      <article
        className={`timeline-detail timeline-detail--${event.type}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="timeline-detail-title"
      >
        <button
          className="timeline-detail-close"
          type="button"
          aria-label="Close timeline detail"
          onClick={onClose}
        >
          x
        </button>

        <span className="timeline-detail-type">{event.type}</span>
        <time className="timeline-detail-time" dateTime={String(event.startYear)}>
          {formatDateLabel(event)}
        </time>
        <h2 id="timeline-detail-title">{event.title}</h2>

        {event.location ? (
          <p className="timeline-detail-location">{event.location}</p>
        ) : null}

        <p className="timeline-detail-summary">{event.description}</p>

        <div className="timeline-detail-body">
          {event.details.map((detail) => (
            <p key={detail}>{detail}</p>
          ))}
        </div>

        {event.highlights?.length ? (
          <ul className="timeline-detail-highlights" aria-label="Highlights">
            {event.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        ) : null}
      </article>
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
