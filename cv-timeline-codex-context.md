# CV Timeline Implementation Context

## Project Context

This feature is for an existing **Vite + React + TypeScript** CV/portfolio website.

The goal is to build a visually dynamic timeline inspired by the cinematic travel-map sequences from the Indiana Jones movies.

The timeline represents two parallel histories:

- **Education / School**
- **Work / Employment**

These should not look like two rigid straight horizontal timelines. Instead, each timeline should feel like a loose route travelling across the page, with timeline nodes and cards placed at slightly different vertical positions. The two routes may visually cross one another.

The implementation should remain responsive and use correct modern React patterns.

---

# Primary Requirements

## 1. Two timeline categories

There are two event types:

```ts
type TimelineEventType = "school" | "work";
```

Each category forms its own chronological route.

Example:

```ts
type TimelineEvent = {
    id: string;
    startYear: number;
    endYear?: number;
    title: string;
    description: string;
    type: TimelineEventType;

    // Stable deterministic vertical variation.
    // Expected range: approximately -1 to 1.
    yFactor: number;
};
```

Example data:

```ts
const timelineEvents: TimelineEvent[] = [
    {
        id: "school-htx",
        startYear: 2019,
        endYear: 2022,
        title: "HTX",
        description: "Technical upper-secondary education",
        type: "school",
        yFactor: -0.5,
    },
    {
        id: "work-first-job",
        startYear: 2020,
        endYear: 2022,
        title: "First Job",
        description: "Example work experience",
        type: "work",
        yFactor: 0.5,
    },
    {
        id: "school-datamatiker",
        startYear: 2022,
        endYear: 2025,
        title: "Computer Science",
        description: "Software development education",
        type: "school",
        yFactor: 0.35,
    },
    {
        id: "work-developer",
        startYear: 2024,
        title: "Software Developer",
        description: "Professional software development",
        type: "work",
        yFactor: -0.75,
    },
];
```

Do **not** call `Math.random()` during render.

Random-looking placement must be stable between renders.

Prefer explicit `yFactor` values in the data. If generated automatically, generate them deterministically from the event ID.

---

# 2. Horizontal placement represents time

Events should be placed horizontally according to their actual year.

Determine the earliest and latest year in the data:

```ts
const minYear = Math.min(...events.map(event => event.startYear));
const maxYear = Math.max(...events.map(event => event.endYear ?? event.startYear));
```

Then convert a year into a percentage position:

```ts
function getYearPosition(year: number, minYear: number, maxYear: number) {
    if (minYear === maxYear) {
        return 50;
    }

    return ((year - minYear) / (maxYear - minYear)) * 100;
}
```

This means that larger gaps in time should create larger horizontal gaps.

Do not simply space events evenly by array index.

---

# 3. Responsive vertical placement

Each category has a general vertical region, but individual items should vary slightly.

Example conceptual lane centers:

```ts
const SCHOOL_CENTER = 0.32;
const WORK_CENTER = 0.68;
```

The `yFactor` should offset the event from its lane center.

Example:

```ts
function getEventY(event: TimelineEvent) {
    const laneCenter =
        event.type === "school"
            ? 0.32
            : 0.68;

    const variation = event.yFactor * 0.14;

    return (laneCenter + variation) * 100;
}
```

Use percentages where practical so resizing the container also adjusts the vertical layout.

The layout should intentionally allow school and work paths to approach or cross each other.

---

# 4. Separate timeline nodes from content cards

Each event should have a small route node.

The SVG path should connect these route nodes.

Do not make the SVG path connect directly to the center of the text card unless that is necessary.

Conceptually:

```text
             ┌──────────────────┐
             │ Software Dev     │
             │ 2024 - Present   │
             └────────┬─────────┘
                      │
                      ●
                   __/
               ___/
──────────────●
```

Suggested DOM structure:

```tsx
<div className="timeline-event">
    <div className="timeline-card">
        ...
    </div>

    <div
        ref={...}
        className="timeline-node"
    />
</div>
```

The card may be placed above or below its node depending on category and/or available space.

---

# 5. Use SVG for connecting routes

Create one absolutely positioned SVG covering the complete timeline container.

Example structure:

```tsx
<div className="timeline-container">
    <svg className="timeline-routes">
        ...
    </svg>

    {events.map(...)}
</div>
```

The SVG should:

```css
.timeline-routes {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: visible;
}
```

The routes should be rendered behind the cards/nodes using z-index.

Use SVG `<path>` elements instead of `<line>`.

---

# 6. Curved cinematic routes

Connections between adjacent events of the same category should use cubic Bézier curves.

Example helper:

```ts
type Point = {
    x: number;
    y: number;
};

type TimelineConnection = {
    id: string;
    type: TimelineEventType;
    from: Point;
    to: Point;
    bend: number;
};
```

Example path generator:

```ts
function createConnectionPath(connection: TimelineConnection) {
    const { from, to, bend } = connection;

    const dx = to.x - from.x;

    const control1X = from.x + dx * 0.3;
    const control2X = from.x + dx * 0.7;

    const control1Y = from.y + bend;
    const control2Y = to.y - bend;

    return `
        M ${from.x} ${from.y}
        C ${control1X} ${control1Y},
          ${control2X} ${control2Y},
          ${to.x} ${to.y}
    `;
}
```

The bend direction should vary between connections.

Do not use random bend values during render.

The bend can be based on:

- connection index
- event IDs
- a deterministic hash
- explicit data

Example:

```ts
const bend = index % 2 === 0 ? 70 : -70;
```

Optionally vary magnitude slightly.

The goal is a flowing travel-route appearance rather than simple S-curves that all look identical.

---

# 7. Routes must remain connected during resize

The connecting paths must be calculated from the actual rendered position of the route nodes.

Use refs to measure the nodes.

Recommended pattern:

```ts
const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});
```

Example ref callback:

```tsx
ref={element => {
    nodeRefs.current[event.id] = element;
}}
```

The timeline container should also have a ref:

```ts
const containerRef = useRef<HTMLDivElement>(null);
```

Use:

```ts
element.getBoundingClientRect()
```

to find the current center of each node.

Convert viewport coordinates into coordinates relative to the timeline container.

Example:

```ts
const containerRect = container.getBoundingClientRect();
const nodeRect = node.getBoundingClientRect();

const point = {
    x: nodeRect.left + nodeRect.width / 2 - containerRect.left,
    y: nodeRect.top + nodeRect.height / 2 - containerRect.top,
};
```

This ensures the SVG path stays connected even if:

- the window width changes
- cards resize
- fonts change size
- responsive CSS changes
- content wraps differently

---

# 8. Use ResizeObserver

Use `ResizeObserver` rather than relying only on `window.resize`.

Observe:

- the timeline container
- timeline nodes
- optionally timeline cards if their dimensions influence layout

When observed sizes change, recalculate the route geometry.

It is acceptable to also listen to `window.resize`, but `ResizeObserver` should be the main mechanism.

Clean up the observer when the component unmounts.

---

# 9. Prefer useLayoutEffect for DOM measurements

Because route positions depend directly on rendered DOM geometry, prefer:

```ts
useLayoutEffect(...)
```

instead of `useEffect(...)` for the measurement setup.

This avoids showing one frame with incorrectly positioned SVG routes.

Do not use `useLayoutEffect` for unrelated logic.

---

# 10. Avoid unnecessary React state

Do not store values in React state unless changing them must trigger a render.

Good use of state:

```ts
const [connections, setConnections] =
    useState<TimelineConnection[]>([]);
```

Refs should be used for DOM element references.

Derived values such as sorted timeline events should preferably use `useMemo`.

Example:

```ts
const schoolEvents = useMemo(
    () =>
        events
            .filter(event => event.type === "school")
            .sort((a, b) => a.startYear - b.startYear),
    [events]
);
```

Do not mutate arrays passed via props.

---

# 11. Recommended component architecture

Avoid putting the entire feature into one huge component.

Suggested structure:

```text
Timeline/
├── Timeline.tsx
├── TimelineEventCard.tsx
├── TimelineRoute.tsx
├── useTimelineConnections.ts
├── timelineUtils.ts
├── timelineTypes.ts
└── Timeline.css
```

A smaller implementation may combine some files if appropriate.

Suggested responsibilities:

## Timeline.tsx

Responsible for:

- timeline container
- rendering events
- rendering route SVG
- supplying node refs
- calculating global year range

## TimelineEventCard.tsx

Responsible for:

- rendering one event
- showing year/date/title/description
- rendering node
- card placement around node
- forwarding or registering the node ref

## TimelineRoute.tsx

Responsible for:

- SVG path rendering
- route styling
- optional route animation

## useTimelineConnections.ts

Responsible for:

- measuring DOM nodes
- ResizeObserver setup
- calculating connections
- returning connection data

## timelineUtils.ts

Pure helper functions:

```ts
getYearPosition(...)
getEventY(...)
createConnectionPath(...)
getConnectionBend(...)
```

No React hooks inside utility functions.

---

# 12. React patterns to follow

This is important.

Use normal declarative React patterns.

## DO

- Use components and props.
- Use stable `key={event.id}`.
- Use `useRef` for DOM references.
- Use `useLayoutEffect` for geometry measurement.
- Use `ResizeObserver`.
- Use `useMemo` for expensive/structural derived data.
- Use `useCallback` if a function is passed into effects/hooks and stability is useful.
- Keep route calculations pure where possible.
- Keep data separate from JSX.
- Clean up observers and event listeners.
- Keep TypeScript types explicit.
- Use CSS classes rather than assigning many styles imperatively.
- Use inline styles only for genuinely dynamic positional values such as `left` and `top`.

## DO NOT

Avoid code like:

```ts
document.querySelector(...)
document.getElementById(...)
```

when React refs can provide the element.

Avoid direct imperative styling such as:

```ts
element.style.top = ...
element.style.left = ...
```

for normal component rendering.

Avoid:

```ts
Math.random()
```

during rendering.

Avoid storing refs in state.

Avoid updating React state repeatedly inside tight measurement loops.

Instead build all new connection objects first and call:

```ts
setConnections(newConnections);
```

once.

Avoid recreating event listeners without cleanup.

Avoid deriving route geometry from guessed CSS pixel values when DOM measurement can provide the actual result.

---

# 13. Route animation

The visual style should resemble a route being drawn across a map.

SVG paths can use stroke dash animation.

Example:

```css
.timeline-route {
    fill: none;
    stroke-width: 3px;
    stroke-linecap: round;
    stroke-linejoin: round;

    stroke-dasharray: 2000;
    stroke-dashoffset: 2000;

    animation: draw-timeline-route 2.5s ease forwards;
}

@keyframes draw-timeline-route {
    to {
        stroke-dashoffset: 0;
    }
}
```

A better version may calculate the actual path length using SVG APIs, but this is optional.

Do not restart the route animation on every resize.

Resize should update geometry without making the entire route replay unless intentionally designed that way.

Prefer animation on:

- initial mount
- first viewport entry
- explicit user interaction

---

# 14. Optional scroll-triggered animation

If adding scroll animation, use:

```ts
IntersectionObserver
```

to determine when the timeline first enters the viewport.

Do not continuously attach a heavy scroll event handler.

Animation should respect:

```css
@media (prefers-reduced-motion: reduce)
```

Example:

```css
@media (prefers-reduced-motion: reduce) {
    .timeline-route {
        animation: none;
        stroke-dashoffset: 0;
    }
}
```

---

# 15. Visual stacking

Suggested stacking:

```text
Cards / text        z-index: 3
Timeline nodes      z-index: 2
SVG routes          z-index: 1
Background          z-index: 0
```

Paths may cross each other.

The two route categories should be visually distinguishable using CSS classes:

```tsx
className={`timeline-route timeline-route--${connection.type}`}
```

Example:

```css
.timeline-route--school {
    /* school route visual styling */
}

.timeline-route--work {
    /* work route visual styling */
}
```

Use the existing site's color palette instead of hard-coding unrelated colors.

---

# 16. Responsive behavior

Desktop behavior:

- Timeline primarily travels left-to-right.
- Events are placed according to year.
- Cards have varied Y positions.
- Routes may cross.
- Cards should not overflow the container unnecessarily.

Tablet behavior:

- Reduce route bend magnitude.
- Reduce card widths.
- Reduce Y variation if required.
- Keep connections intact.

Mobile behavior may use either:

### Option A — compressed horizontal timeline

Keep the horizontal route and make the timeline horizontally scrollable.

This preserves the chronological map aesthetic best.

Example:

```css
.timeline-scroll-container {
    overflow-x: auto;
}
```

The internal timeline may have:

```css
min-width: 900px;
```

### Option B — adapted vertical layout

Convert the timeline into a more vertical layout on very narrow screens.

If choosing this approach, SVG measurement should still be based on actual node positions so the route remains connected.

Prefer Option A unless the existing website design makes horizontal scrolling undesirable.

---

# 17. Prevent clipping

The timeline may have large Bézier curves.

Ensure the timeline and SVG are not accidentally clipped.

Check parent elements for:

```css
overflow: hidden;
```

Only use overflow clipping intentionally.

The SVG can use:

```css
overflow: visible;
```

if needed.

---

# 18. Handle same-year events

Multiple events may share the same year.

They must not appear exactly on top of each other.

If several events have the same horizontal position:

- offset them slightly horizontally, or
- use different vertical offsets, or
- introduce a small deterministic placement offset

Do not distort the chronological ordering significantly.

---

# 19. Route construction

Build each route independently.

Example conceptual algorithm:

```ts
function createConnections(
    events: TimelineEvent[],
    nodeRefs: Record<string, HTMLElement | null>,
    containerRect: DOMRect,
    type: TimelineEventType
): TimelineConnection[] {
    const relevantEvents = events
        .filter(event => event.type === type)
        .sort((a, b) => a.startYear - b.startYear);

    const connections: TimelineConnection[] = [];

    for (let i = 0; i < relevantEvents.length - 1; i++) {
        const current = relevantEvents[i];
        const next = relevantEvents[i + 1];

        const fromElement = nodeRefs[current.id];
        const toElement = nodeRefs[next.id];

        if (!fromElement || !toElement) {
            continue;
        }

        // Measure both nodes.
        // Convert to container-relative coordinates.
        // Create deterministic bend.
        // Push connection.
    }

    return connections;
}
```

Then combine:

```ts
const connections = [
    ...createConnections(..., "school"),
    ...createConnections(..., "work"),
];
```

Do not connect a school event to a work event.

The school and work routes are independent paths that happen to share the same visual area.

---

# 20. Timeline start and end

Optionally allow the route to begin slightly before the first event and extend slightly past the last event.

Example:

```text
──────●──────────────●──────────────●──────
```

rather than:

```text
●──────────────●──────────────●
```

This may help achieve the cinematic map aesthetic.

If implemented, represent these as calculated SVG start/end points rather than fake timeline events.

---

# 21. Visual nodes

Nodes should be clearly visible where events connect to the route.

Example:

```css
.timeline-node {
    width: 12px;
    height: 12px;
    border-radius: 50%;
}
```

The node should be centered on the route coordinate.

Useful enhancement:

```css
.timeline-node::after
```

may create an outer ring.

Avoid making nodes so large that they dominate the cards.

---

# 22. Card-to-node connector

A small secondary connector may run between the timeline node and its card.

This can be CSS or SVG.

Example:

```text
       card
    ┌────────┐
    │        │
    └───┬────┘
        │
        ●
       route
```

The main cinematic route should connect node-to-node.

The card connector should remain visually secondary.

---

# 23. Accessibility

Timeline content must remain readable without the SVG.

The SVG is decorative and should use:

```tsx
aria-hidden="true"
```

The events should still appear in chronological/document order in the DOM.

Do not make important information available only through route color.

Each timeline card should use semantic markup where practical.

Example:

```tsx
<article className="timeline-card">
    <time>2022 – 2025</time>
    <h3>Computer Science</h3>
    <p>...</p>
</article>
```

---

# 24. Performance

Do not recalculate connections continuously on every animation frame.

Recalculate only when required:

- initial layout
- ResizeObserver callback
- timeline data changes
- responsive layout changes

If ResizeObserver fires many times during resizing, optionally schedule the geometry calculation with:

```ts
requestAnimationFrame(...)
```

to avoid excessive React state updates.

Example conceptual approach:

```ts
let frameId: number | null = null;

const scheduleUpdate = () => {
    if (frameId !== null) {
        cancelAnimationFrame(frameId);
    }

    frameId = requestAnimationFrame(() => {
        updateConnections();
        frameId = null;
    });
};
```

Clean up pending animation frames when unmounting.

---

# 25. Suggested custom hook API

A good hook could look like:

```ts
const {
    containerRef,
    registerNode,
    connections,
} = useTimelineConnections(events);
```

Usage:

```tsx
<div ref={containerRef} className="timeline">
    <TimelineRoute connections={connections} />

    {events.map(event => (
        <TimelineEventCard
            key={event.id}
            event={event}
            registerNode={registerNode}
        />
    ))}
</div>
```

Possible `registerNode` API:

```ts
type RegisterNode = (
    id: string,
    element: HTMLDivElement | null
) => void;
```

This is preferable to exposing a mutable refs object across many components.

---

# 26. Keep geometry logic independent from styling

The TypeScript should care about:

- event order
- node coordinates
- route curves
- responsive measurement

CSS should care about:

- colors
- fonts
- shadows
- card design
- route thickness
- node appearance
- spacing

Do not mix visual styling deeply into the geometry code.

---

# 27. Overall desired appearance

The final result should feel approximately like this:

```text
 Education

                 ┌───────────────┐
                 │ Education B   │
                 └───────┬───────┘
                         ●
                      __/ \
                   __/     \________
       ●──────────/                  \──────●
       │                                    │
 ┌─────┴──────┐                      ┌──────┴─────┐
 │ School A   │                      │ School C   │
 └────────────┘                      └────────────┘


                          ┌───────────────┐
                          │ Work B        │
                          └──────┬────────┘
                                 │
       _____________●____________●
     _/              \
   ●                   \______________________●
   │                                          │
┌──┴───────┐                              ┌───┴──────┐
│ Work A   │                              │ Work C   │
└──────────┘                              └──────────┘

 Work
```

This diagram is only conceptual.

Actual paths should be smooth SVG curves.

School and work paths are allowed to cross.

Cards should feel deliberately staggered rather than randomly chaotic.

---

# 28. Implementation quality expectations

When implementing this feature:

1. Inspect the existing project structure before adding files.
2. Reuse the site's existing styling conventions.
3. Reuse existing CSS variables, typography, colors, and breakpoints where available.
4. Do not install a large dependency just to draw SVG curves.
5. Prefer native React + browser APIs.
6. Maintain TypeScript strictness.
7. Do not use `any` unless there is a genuinely unavoidable reason.
8. Keep components reasonably small.
9. Keep hooks compliant with React's Rules of Hooks.
10. Do not manipulate React-rendered DOM outside refs.
11. Ensure cleanup for observers and listeners.
12. Avoid infinite render/effect loops.
13. Verify resizing works.
14. Verify repeated resizing does not detach route paths from nodes.
15. Verify events retain stable placement between renders.
16. Verify timeline still works when event text wraps to multiple lines.
17. Verify school and work routes remain independently ordered.
18. Verify the implementation works under Vite development Strict Mode.
19. Do not depend on effects running exactly once.
20. Ensure observer setup/cleanup behaves correctly when React Strict Mode mounts, unmounts, and remounts components in development.

---

# 29. React Strict Mode considerations

Vite React projects commonly use:

```tsx
<React.StrictMode>
    <App />
</React.StrictMode>
```

Therefore the implementation must not rely on a side effect running exactly once.

Effects must be idempotent.

Always clean up:

- ResizeObserver
- IntersectionObserver
- event listeners
- requestAnimationFrame callbacks

Do not remove Strict Mode as a workaround.

---

# 30. Deliverable

Implement the timeline as production-quality React + TypeScript code in the existing Vite project.

The final feature should:

- show school and work histories
- use actual chronological horizontal placement
- have intentionally varied vertical positions
- have smooth curved SVG travel routes
- allow school/work paths to cross
- connect paths to route nodes
- keep connections correct when resizing
- use ResizeObserver
- use React refs rather than DOM selectors
- behave correctly under Strict Mode
- support responsive layouts
- avoid render-time randomness
- be accessible
- visually resemble a cinematic travel-map timeline

Before modifying the project, inspect the existing components and CSS so the implementation fits naturally into the current codebase rather than creating an isolated style system.
