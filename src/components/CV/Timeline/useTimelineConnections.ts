import { useCallback, useLayoutEffect, useRef, useState } from "react";

import type {
  RegisterTimelineNode,
  TimelineConnection,
  TimelineEvent,
} from "./timelineTypes";
import { getConnectionBend, getNodeCenter } from "./timelineUtils";

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
    const nextConnections = createConnections(
      events,
      nodeRefs.current,
      containerRect,
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

function createConnections(
  events: TimelineEvent[],
  nodeRefs: Record<string, HTMLDivElement | null>,
  containerRect: DOMRect,
) {
  const eventsById = new Map(events.map((event) => [event.id, event]));
  const connections: TimelineConnection[] = [];

  events.forEach((fromEvent) => {
    const fromNode = nodeRefs[fromEvent.id];

    if (!fromNode || !fromEvent.connectToEventIds) {
      return;
    }

    fromEvent.connectToEventIds.forEach((toEventId, index) => {
      const toEvent = eventsById.get(toEventId);
      const toNode = nodeRefs[toEventId];

      if (!toEvent || !toNode) {
        return;
      }

      connections.push({
        id: `${fromEvent.id}-${toEvent.id}`,
        type: fromEvent.type,
        from: getNodeCenter(fromNode, containerRect),
        to: getNodeCenter(toNode, containerRect),
        bend: getConnectionBend(index, fromEvent, toEvent),
      });
    });
  });

  return connections;
}
