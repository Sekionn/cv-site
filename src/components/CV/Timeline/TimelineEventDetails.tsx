import { useLanguage } from "../../../context/LanguageContext";
import type { TimelineEvent } from "./timelineTypes";

type TimelineEventDetailsProps = {
  event: TimelineEvent;
  onClose: () => void;
};

export default function TimelineEventDetails({
  event,
  onClose,
}: TimelineEventDetailsProps) {
  const { t } = useLanguage();
  const title = t(event.titleKey);

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
          aria-label={t("timeline.detail.closeLabel")}
          onClick={onClose}
        >
          x
        </button>

        <span className="timeline-detail-type">
          {t(event.type === "school" ? "timeline.type.school" : "timeline.type.work")}
        </span>
        <time className="timeline-detail-time" dateTime={String(event.startYear)}>
          {formatDateLabel(event)}
        </time>
        <h2 id="timeline-detail-title">{title}</h2>

        {event.locationKey ? (
          <p className="timeline-detail-location">
            {t(event.locationKey)}
          </p>
        ) : null}

        <p className="timeline-detail-summary">
          {t(event.descriptionKey)}
        </p>

        <div className="timeline-detail-body">
          {event.detailKeys.map((detailKey) => (
            <p key={detailKey}>{t(detailKey)}</p>
          ))}
        </div>

        {event.highlightKeys?.length ? (
          <ul
            className="timeline-detail-highlights"
            aria-label={t("timeline.detail.highlightsLabel")}
          >
            {event.highlightKeys.map((highlightKey) => (
              <li key={highlightKey}>{t(highlightKey)}</li>
            ))}
          </ul>
        ) : null}
      </article>
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
