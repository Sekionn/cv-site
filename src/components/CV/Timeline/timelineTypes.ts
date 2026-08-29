export type TimelineEventType = "school" | "work";

export type TimelineEvent = {
  id: string;
  startYear: number;
  endYear?: number;
  title: string;
  description: string;
  location?: string;
  details: string[];
  highlights?: string[];
  type: TimelineEventType;
  yFactor: number;
  placement?: {
    xFactor?: number;
    yPercent?: number;
  };
};

export type TimelineTravelerImage = {
  id: string;
  imageSrc?: string;
  imageAlt?: string;
  placement: {
    xPercent: number;
    yPercent: number;
  };
  width?: number;
  rotation?: number;
  opacity?: number;
};

export type Point = {
  x: number;
  y: number;
};

export type TimelineConnection = {
  id: string;
  type: TimelineEventType;
  from: Point;
  to: Point;
  bend: number;
};

export type RegisterTimelineNode = (
  id: string,
  element: HTMLDivElement | null,
) => void;
