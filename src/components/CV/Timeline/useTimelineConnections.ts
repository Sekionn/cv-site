import { useCallback, useLayoutEffect, useRef, useState } from "react";

import type {
  RegisterTimelineNode,
  TimelineConnection,
  TimelineEvent,
  TimelineEventType,
} from "./timelineTypes";
import {
  compareTimelineEvents,
  getConnectionBend,
  getNodeCenter,
  getRouteTypes,
} from "./timelineUtils";

type UseTimelineConnectionsResult = {
  containerRef: React.RefObject<HTMLDivElement | null>;
  registerNode: RegisterTimelineNode;
  connections: TimelineConnection[];
};

export function useTimelineConnections(
  events: TimelineEvent[],
): UseTimelineConnectionsResult {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const frameRef = useRef<number | null>(null);
  const [connections, setConnections] = useState<TimelineConnection[]>([]);

  const registerNode = useCallback<RegisterTimelineNode>((id, element) => {
    nodeRefs.current[id] = element;
  }, []);

  const updateConnections = useCallback(() => {
    const container = containerRef.current;

    if (!container) {
      setConnections([]);
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const nextConnections = getRouteTypes().flatMap((type) =>
      createConnectionsForType(events, nodeRefs.current, containerRect, type),
    );

    setConnections(nextConnections);
  }, [events]);

  const scheduleUpdate = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
    }

    frameRef.current = requestAnimationFrame(() => {
      updateConnections();
      frameRef.current = null;
    });
  }, [updateConnections]);

  useLayoutEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return undefined;
    }

    const observer = new ResizeObserver(scheduleUpdate);
    observer.observe(container);

    Object.values(nodeRefs.current).forEach((node) => {
      if (node) {
        observer.observe(node);
      }
    });

    scheduleUpdate();
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", scheduleUpdate);

      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [events, scheduleUpdate]);

  return {
    containerRef,
    registerNode,
    connections,
  };
}

function createConnectionsForType(
  events: TimelineEvent[],
  nodeRefs: Record<string, HTMLDivElement | null>,
  containerRect: DOMRect,
  type: TimelineEventType,
) {
  const orderedEvents = events
    .filter((event) => event.type === type)
    .toSorted(compareTimelineEvents);
  const connections: TimelineConnection[] = [];

  for (let index = 0; index < orderedEvents.length - 1; index += 1) {
    const fromEvent = orderedEvents[index];
    const toEvent = orderedEvents[index + 1];
    const fromNode = nodeRefs[fromEvent.id];
    const toNode = nodeRefs[toEvent.id];

    if (!fromNode || !toNode) {
      continue;
    }

    connections.push({
      id: `${fromEvent.id}-${toEvent.id}`,
      type,
      from: getNodeCenter(fromNode, containerRect),
      to: getNodeCenter(toNode, containerRect),
      bend: getConnectionBend(index, fromEvent, toEvent),
    });
  }

  return connections;
}
