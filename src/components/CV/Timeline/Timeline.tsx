import { useEffect, useMemo, useState } from "react";

import { timelineEvents, timelineTravelerImages } from "./timelineData";
import TimelineEventCard from "./TimelineEventCard";
import TimelineEventDetails from "./TimelineEventDetails";
import TimelineRoute from "./TimelineRoute";
import TimelineTravelerImage from "./TimelineTravelerImage";
import type { TimelineEvent } from "./timelineTypes";
import {
  compareTimelineEvents,
  getEventY,
  getYearPosition,
} from "./timelineUtils";
import { useTimelineConnections } from "./useTimelineConnections";
import "./Timeline.css";

const HORIZONTAL_PADDING_PERCENT = 8;
const SAME_YEAR_SPACING_PERCENT = 2.4;
const YEAR_SPACING_PX = 260;
const TIMELINE_EDGE_SPACE_PX = 360;

type YearPlacement = {
  index: number;
  count: number;
};

export default function Timeline() {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const events = useMemo(
    () => timelineEvents.toSorted(compareTimelineEvents),
    [],
  );
  const travelerImages = useMemo(
    () =>
      timelineTravelerImages.toSorted(
        (first, second) => first.placement.xPercent - second.placement.xPercent,
      ),
    [],
  );
  const minYear = useMemo(
    () => Math.min(...events.map((event) => event.startYear)),
    [events],
  );
  const maxYear = useMemo(
    () =>
      Math.max(
        ...events.map((event) => event.endYear ?? event.startYear),
      ),
    [events],
  );
  const timelineYears = useMemo(
    () => getTimelineYears(minYear, maxYear),
    [minYear, maxYear],
  );
  const timelineWidth = useMemo(
    () => getTimelineWidth(timelineYears.length),
    [timelineYears],
  );
  const yearPlacements = useMemo(() => getYearPlacements(events), [events]);
  const { containerRef, registerNode, connections } =
    useTimelineConnections(events);

  useEffect(() => {
    if (!selectedEvent) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedEvent(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedEvent]);

  return (
    <section className="timeline-section" aria-labelledby="timeline-heading">
      <div className="timeline-scroll-container">
        <div
          ref={containerRef}
          className="timeline-container"
          style={{ minWidth: `${timelineWidth}px` }}
        >
          <div className="timeline-year-markers" aria-hidden="true">
            {timelineYears.map((year) => (
              <div
                key={year}
                className="timeline-year-marker"
                style={{ left: `${getTimelineYearX(year, minYear, maxYear)}%` }}
              >
                <span>{year}</span>
              </div>
            ))}
          </div>

          <TimelineRoute connections={connections} />

          {travelerImages.map((travelerImage) => (
            <TimelineTravelerImage
              key={travelerImage.id}
              travelerImage={travelerImage}
            />
          ))}

          {events.map((event) => (
            <TimelineEventCard
              key={event.id}
              event={event}
              left={getTimelineX(event, minYear, maxYear, yearPlacements)}
              top={getTimelineY(event)}
              isSelected={selectedEvent?.id === event.id}
              onSelect={setSelectedEvent}
              registerNode={registerNode}
            />
          ))}
        </div>
      </div>

      {selectedEvent ? (
        <TimelineEventDetails
          event={selectedEvent}
          onClose={() => {
            setSelectedEvent(null);
          }}
        />
      ) : null}
    </section>
  );
}

function getTimelineYearX(year: number, minYear: number, maxYear: number) {
  return getTimelinePositionX(year, 0, minYear, maxYear);
}

function getTimelineX(
  event: TimelineEvent,
  minYear: number,
  maxYear: number,
  placements: Map<string, YearPlacement>,
) {
  const placement = placements.get(event.id);
  const sameYearOffset = placement
    ? (placement.index - (placement.count - 1) / 2) * SAME_YEAR_SPACING_PERCENT
    : 0;

  return getTimelinePositionX(
    event.startYear,
    event.placement?.xFactor,
    minYear,
    maxYear,
    sameYearOffset,
  );
}

function getTimelinePositionX(
  year: number,
  xFactor: number | undefined,
  minYear: number,
  maxYear: number,
  extraOffset = 0,
) {
  const position = getYearPosition(year, minYear, maxYear);
  const availableWidth = 100 - HORIZONTAL_PADDING_PERCENT * 2;
  const yearSpan = maxYear === minYear ? 0 : availableWidth / (maxYear - minYear);
  const placementOffset =
    typeof xFactor === "number" ? clamp(xFactor, 0, 1) * yearSpan : 0;

  return (
    HORIZONTAL_PADDING_PERCENT +
    (position / 100) * availableWidth +
    placementOffset +
    extraOffset
  );
}

function getTimelineY(event: TimelineEvent) {
  if (typeof event.placement?.yPercent === "number") {
    return clamp(event.placement.yPercent, 8, 92);
  }

  return getEventY(event);
}

function getYearPlacements(events: TimelineEvent[]) {
  const years = new Map<number, TimelineEvent[]>();

  events.forEach((event) => {
    const yearEvents = years.get(event.startYear) ?? [];
    yearEvents.push(event);
    years.set(event.startYear, yearEvents);
  });

  const placements = new Map<string, YearPlacement>();

  years.forEach((yearEvents) => {
    yearEvents.toSorted(compareTimelineEvents).forEach((event, index) => {
      placements.set(event.id, {
        index,
        count: yearEvents.length,
      });
    });
  });

  return placements;
}

function getTimelineYears(minYear: number, maxYear: number) {
  const years: number[] = [];

  for (let year = minYear; year <= maxYear; year += 1) {
    years.push(year);
  }

  return years;
}

function getTimelineWidth(yearCount: number) {
  return Math.max(960, yearCount * YEAR_SPACING_PX + TIMELINE_EDGE_SPACE_PX);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
