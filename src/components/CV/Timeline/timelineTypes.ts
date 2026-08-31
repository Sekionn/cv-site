import type { TranslationKey } from "../../../i18n/types";

export type TimelineEventType = "school" | "work";
export type TimelineNodePosition = "above" | "below";

export type TimelineEventDetailImage = {
  imageSrc?: string;
  imageSrcKey?: TranslationKey;
  imageAltKey: TranslationKey;
  captionKey?: TranslationKey;
};

export type TimelineEvent = {
  id: string;
  startYear: number;
  endYear?: number;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
  locationKey?: TranslationKey;
  detailKeys: TranslationKey[];
  detailImages?: TimelineEventDetailImage[];
  skillKeys?: TranslationKey[];
  type: TimelineEventType;
  connectToEventIds: string[] | null;
  nodePosition?: TimelineNodePosition;
  yFactor: number;
  placement?: {
    xFactor?: number;
    yPercent?: number;
  };
};

export type TimelineTravelerImage = {
  id: string;
  imageSrc?: string;
  imageAltKey?: TranslationKey;
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
