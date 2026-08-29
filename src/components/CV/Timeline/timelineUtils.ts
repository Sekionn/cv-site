import type {
  Point,
  TimelineConnection,
  TimelineEvent,
  TimelineEventType,
} from "./timelineTypes";

const SCHOOL_CENTER = 0.32;
const WORK_CENTER = 0.68;
const Y_VARIATION = 0.14;

export function getYearPosition(
  year: number,
  minYear: number,
  maxYear: number,
) {
  if (minYear === maxYear) {
    return 50;
  }

  return ((year - minYear) / (maxYear - minYear)) * 100;
}

export function getEventY(event: TimelineEvent) {
  const laneCenter = event.type === "school" ? SCHOOL_CENTER : WORK_CENTER;

  return (laneCenter + event.yFactor * Y_VARIATION) * 100;
}

export function createConnectionPath(connection: TimelineConnection) {
  const { from, to, bend } = connection;
  const dx = to.x - from.x;

  const control1X = from.x + dx * 0.3;
  const control2X = from.x + dx * 0.7;
  const control1Y = from.y + bend;
  const control2Y = to.y - bend;

  return [
    `M ${from.x} ${from.y}`,
    `C ${control1X} ${control1Y}, ${control2X} ${control2Y}, ${to.x} ${to.y}`,
  ].join(" ");
}

export function getConnectionBend(
  index: number,
  from: TimelineEvent,
  to: TimelineEvent,
) {
  const direction = index % 2 === 0 ? 1 : -1;
  const magnitude = 54 + (hashString(`${from.id}-${to.id}`) % 34);

  return direction * magnitude;
}

export function getNodeCenter(
  node: HTMLElement,
  containerRect: DOMRect,
): Point {
  const nodeRect = node.getBoundingClientRect();

  return {
    x: nodeRect.left + nodeRect.width / 2 - containerRect.left,
    y: nodeRect.top + nodeRect.height / 2 - containerRect.top,
  };
}

export function compareTimelineEvents(
  first: TimelineEvent,
  second: TimelineEvent,
) {
  if (first.startYear !== second.startYear) {
    return first.startYear - second.startYear;
  }

  return first.id.localeCompare(second.id);
}

export function getRouteTypes(): TimelineEventType[] {
  return ["school", "work"];
}

function hashString(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash;
}
