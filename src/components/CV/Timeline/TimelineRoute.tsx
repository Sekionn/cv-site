import type { TimelineConnection } from "./timelineTypes";
import { createConnectionPath } from "./timelineUtils";

type TimelineRouteProps = {
  connections: TimelineConnection[];
};

export default function TimelineRoute({ connections }: TimelineRouteProps) {
  return (
    <svg className="timeline-routes" aria-hidden="true">
      {connections.map((connection) => (
        <path
          key={connection.id}
          className={`timeline-route timeline-route--${connection.type}`}
          d={createConnectionPath(connection)}
        />
      ))}
    </svg>
  );
}
