import { useEffect, useState } from "react";

import { useLanguage } from "../../../context/LanguageContext";
import type { TimelineEvent, TimelineEventDetailImage } from "./timelineTypes";

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
  const [selectedImage, setSelectedImage] =
    useState<TimelineEventDetailImage | null>(null);

  useEffect(() => {
    if (!selectedImage) {
      return undefined;
    }

    const handleKeyDown = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key === "Escape") {
        keyboardEvent.preventDefault();
        keyboardEvent.stopPropagation();
        setSelectedImage(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown, { capture: true });

    return () => {
      document.removeEventListener("keydown", handleKeyDown, { capture: true });
    };
  }, [selectedImage]);

  return (
    <div
      className="timeline-detail-backdrop"
      role="presentation"
      onClick={() => {
        if (!selectedImage) {
          onClose();
        }
      }}
    >
      <article
        className={`timeline-detail timeline-detail--${event.type}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="timeline-detail-title"
        onClick={(clickEvent) => {
          clickEvent.stopPropagation();
        }}
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

          {event.detailImages?.map((detailImage) => {
            const imageSrc = getDetailImageSrc(detailImage);

            if (!imageSrc) {
              return null;
            }

            const imageAlt = t(detailImage.imageAltKey);

            return (
              <figure key={imageSrc} className="timeline-detail-image">
                <button
                  className="timeline-detail-image-button"
                  type="button"
                  aria-label={`${t("timeline.detail.openImageLabel")} ${imageAlt}`}
                  onClick={() => {
                    setSelectedImage(detailImage);
                  }}
                >
                  <img src={imageSrc} alt={imageAlt} />
                </button>
                {detailImage.captionKey ? (
                  <figcaption>{t(detailImage.captionKey)}</figcaption>
                ) : null}
              </figure>
            );
          })}
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

      {selectedImage ? (
        <div
          className="timeline-image-viewer-backdrop"
          role="presentation"
          onClick={() => {
            setSelectedImage(null);
          }}
        >
          <figure
            className="timeline-image-viewer"
            role="dialog"
            aria-modal="true"
            aria-label={t(selectedImage.imageAltKey)}
            onClick={(clickEvent) => {
              clickEvent.stopPropagation();
            }}
          >
            <button
              className="timeline-image-viewer-close"
              type="button"
              aria-label={t("timeline.detail.closeLabel")}
              onClick={() => {
                setSelectedImage(null);
              }}
            >
              x
            </button>
            <img
              src={getDetailImageSrc(selectedImage)}
              alt={t(selectedImage.imageAltKey)}
            />
            {selectedImage.captionKey ? (
              <figcaption>{t(selectedImage.captionKey)}</figcaption>
            ) : null}
          </figure>
        </div>
      ) : null}
    </div>
  );

  function getDetailImageSrc(detailImage: TimelineEventDetailImage) {
    const imageSrc = detailImage.imageSrcKey
      ? t(detailImage.imageSrcKey)
      : detailImage.imageSrc;

    if (!imageSrc) {
      return undefined;
    }

    return normalizePublicImagePath(imageSrc);
  }

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

function normalizePublicImagePath(imageSrc: string) {
  if (
    imageSrc.startsWith("/") ||
    imageSrc.startsWith("http") ||
    imageSrc.startsWith("data:") ||
    imageSrc.startsWith("blob:")
  ) {
    return imageSrc;
  }

  if (imageSrc.startsWith("public/")) {
    return `/${imageSrc.slice("public/".length)}`;
  }

  if (imageSrc.startsWith("images/")) {
    return `/${imageSrc}`;
  }

  return `/images/${imageSrc}`;
}
