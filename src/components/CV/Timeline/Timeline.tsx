import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

import { timelineEvents, timelineTravelerImages } from "./timelineData";
import TimelineEventCard from "./TimelineEventCard";
import TimelineEventDetails from "./TimelineEventDetails";
import TimelineFilterMenu from "./TimelineFilterMenu";
import TimelineRoute from "./TimelineRoute";
import TimelineTravelerImage from "./TimelineTravelerImage";
import type { TimelineEvent, TimelineEventType } from "./timelineTypes";
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

type ScrollbarMetrics = {
  left: number;
  width: number;
  visible: boolean;
};

export default function Timeline() {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [activeTypes, setActiveTypes] = useState<Record<TimelineEventType, boolean>>({
    school: true,
    work: true,
  });
  const [scrollbarMetrics, setScrollbarMetrics] = useState<ScrollbarMetrics>({
    left: 0,
    width: 100,
    visible: false,
  });
  const [isDraggingScrollbar, setIsDraggingScrollbar] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollbarTrackRef = useRef<HTMLDivElement>(null);
  const events = useMemo(
    () => timelineEvents.toSorted(compareTimelineEvents),
    [],
  );
  const visibleEvents = useMemo(
    () => events.filter((event) => activeTypes[event.type]),
    [activeTypes, events],
  );
  const visibleTimelineEvents = useMemo(
    () => timelineEvents.filter((event) => activeTypes[event.type]),
    [activeTypes],
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
  const maxEventYear = useMemo(
    () =>
      Math.max(
        ...events.map((event) => event.endYear ?? event.startYear),
      ),
    [events],
  );
  const timelineEndYear = useMemo(
    () =>
      Math.max(
        maxEventYear,
        Math.max(...events.map((event) => event.startYear)) + 1,
      ),
    [events, maxEventYear],
  );
  const timelineYears = useMemo(
    () => getTimelineYears(minYear, timelineEndYear),
    [minYear, timelineEndYear],
  );
  const timelineWidth = useMemo(
    () => getTimelineWidth(timelineYears.length),
    [timelineYears],
  );
  const yearPlacements = useMemo(() => getYearPlacements(events), [events]);
  const { containerRef, registerNode, connections } =
    useTimelineConnections(visibleTimelineEvents);

  const updateScrollbarMetrics = useCallback(() => {
    const scrollContainer = scrollContainerRef.current;

    if (!scrollContainer) {
      setScrollbarMetrics({ left: 0, width: 100, visible: false });
      return;
    }

    const { clientWidth, scrollLeft, scrollWidth } = scrollContainer;
    const maxScrollLeft = scrollWidth - clientWidth;

    if (maxScrollLeft <= 0) {
      setScrollbarMetrics({ left: 0, width: 100, visible: false });
      return;
    }

    const width = Math.max((clientWidth / scrollWidth) * 100, 8);
    const maxThumbLeft = 100 - width;
    const left = (scrollLeft / maxScrollLeft) * maxThumbLeft;

    setScrollbarMetrics({ left, width, visible: true });
  }, []);

  useLayoutEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    if (!scrollContainer) {
      return undefined;
    }

    const observer = new ResizeObserver(updateScrollbarMetrics);
    observer.observe(scrollContainer);

    if (scrollContainer.firstElementChild) {
      observer.observe(scrollContainer.firstElementChild);
    }

    updateScrollbarMetrics();

    return () => {
      observer.disconnect();
    };
  }, [timelineWidth, updateScrollbarMetrics]);

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

  useEffect(() => {
    if (selectedEvent && !activeTypes[selectedEvent.type]) {
      setSelectedEvent(null);
    }
  }, [activeTypes, selectedEvent]);

  const handleToggleType = (type: TimelineEventType) => {
    setActiveTypes((currentTypes) => ({
      ...currentTypes,
      [type]: !currentTypes[type],
    }));
  };

  const handleScrollbarPointerDown = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    setIsDraggingScrollbar(true);
    event.currentTarget.setPointerCapture(event.pointerId);
    updateScrollFromPointer(event.clientX);
  };

  const handleScrollbarPointerMove = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    if (!isDraggingScrollbar) {
      return;
    }

    updateScrollFromPointer(event.clientX);
  };

  const handleScrollbarPointerUp = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    setIsDraggingScrollbar(false);
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return (
    <section className="timeline-section" aria-labelledby="timeline-heading">
      <TimelineFilterMenu
        activeTypes={activeTypes}
        onToggleType={handleToggleType}
      />

      <div
        ref={scrollContainerRef}
        className="timeline-scroll-container"
        onScroll={updateScrollbarMetrics}
      >
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
                style={{
                  left: `${getTimelineYearX(year, minYear, timelineEndYear)}%`,
                }}
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

          {visibleEvents.map((event) => (
            <TimelineEventCard
              key={event.id}
              event={event}
              left={getTimelineX(
                event,
                minYear,
                timelineEndYear,
                yearPlacements,
              )}
              top={getTimelineY(event)}
              isSelected={selectedEvent?.id === event.id}
              onSelect={setSelectedEvent}
              registerNode={registerNode}
            />
          ))}
        </div>
      </div>

      {scrollbarMetrics.visible ? (
        <div
          ref={scrollbarTrackRef}
          className="timeline-scrollbar"
          onPointerDown={handleScrollbarPointerDown}
          onPointerMove={handleScrollbarPointerMove}
          onPointerUp={handleScrollbarPointerUp}
          onPointerCancel={handleScrollbarPointerUp}
        >
          <div
            className="timeline-scrollbar-thumb"
            style={{
              left: `${scrollbarMetrics.left}%`,
              width: `${scrollbarMetrics.width}%`,
            }}
          />
        </div>
      ) : null}

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

  function updateScrollFromPointer(clientX: number) {
    const scrollContainer = scrollContainerRef.current;
    const scrollbarTrack = scrollbarTrackRef.current;

    if (!scrollContainer || !scrollbarTrack) {
      return;
    }

    const trackRect = scrollbarTrack.getBoundingClientRect();
    const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;
    const thumbWidth = (scrollbarMetrics.width / 100) * trackRect.width;
    const movableWidth = trackRect.width - thumbWidth;
    const pointerX = clientX - trackRect.left - thumbWidth / 2;
    const scrollRatio = movableWidth <= 0 ? 0 : clamp(pointerX / movableWidth, 0, 1);

    scrollContainer.scrollLeft = scrollRatio * maxScrollLeft;
  }
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
  const hasExplicitXFactor = typeof event.placement?.xFactor === "number";
  const sameYearOffset = !hasExplicitXFactor && placement
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
  const yearBandWidth =
    maxYear === minYear ? 0 : availableWidth / (maxYear - minYear);
  const placementOffset =
    typeof xFactor === "number" ? clamp(xFactor, 0, 1) * yearBandWidth : 0;

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
