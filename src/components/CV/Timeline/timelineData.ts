import type { TimelineEvent, TimelineTravelerImage } from "./timelineTypes";

// placement.xFactor moves the note inside its start-year band: 0 = year line, 1 = toward the next year.
// placement.yPercent moves the note vertically across the map.
export const timelineEvents: TimelineEvent[] = [
  {
    id: "school-htx",
    startYear: 2015,
    endYear: 2018,
    title: "HTX",
    description: "Technical upper-secondary education with a focus on technology and product development.",
    location: "Technical upper-secondary school",
    details: [
      "Built a broad technical foundation across science, technology, and project-based problem solving.",
      "Worked with product development, structured documentation, and practical technical communication.",
    ],
    highlights: ["Technology", "Product development", "Project work"],
    type: "school",
    yFactor: 0.5,
    placement: {
      xFactor: 0.16,
      yPercent: 36,
    },
  },
  {
    id: "work-first-role",
    startYear: 2020,
    endYear: 2022,
    title: "First Job",
    description: "Early professional experience building reliability, collaboration, and customer-facing habits.",
    location: "Part-time work",
    details: [
      "Developed professional habits around responsibility, punctuality, and clear day-to-day communication.",
      "Worked in a practical environment where reliability and service mattered every shift.",
    ],
    highlights: ["Customer focus", "Teamwork", "Reliability"],
    type: "work",
    yFactor: 0.44,
    placement: {
      xFactor: 0.72,
      yPercent: 74,
    },
  },
  {
    id: "school-computer-science",
    startYear: 2022,
    endYear: 2025,
    title: "Computer Science",
    description: "Software development education covering full-stack systems, databases, and application architecture.",
    location: "Computer science programme",
    details: [
      "Studied software construction through full-stack applications, databases, APIs, and system design.",
      "Practiced turning requirements into maintainable code with attention to testing and readable structure.",
      "Built projects that connected frontend interfaces with backend services and persistent data.",
    ],
    highlights: ["React", "TypeScript", "Databases", "Backend APIs"],
    type: "school",
    yFactor: 0.38,
    placement: {
      xFactor: 0.32,
      yPercent: 42,
    },
  },
  {
    id: "work-developer-intern",
    startYear: 2024,
    endYear: 2025,
    title: "Developer Internship",
    description: "Practical software engineering work on maintainable features in an active codebase.",
    location: "Software team",
    details: [
      "Contributed to real product work inside an existing codebase, balancing implementation with maintainability.",
      "Collaborated with others through feedback, iteration, and practical debugging.",
    ],
    highlights: ["Feature work", "Debugging", "Code review"],
    type: "work",
    yFactor: -0.72,
    placement: {
      xFactor: 0.62,
      yPercent: 58,
    },
  },
  {
    id: "work-software-developer",
    startYear: 2025,
    title: "Software Developer",
    description: "Professional software development focused on clean implementation and useful product experiences.",
    location: "Professional development",
    details: [
      "Builds user-facing features with care for behavior, structure, and long-term readability.",
      "Works across frontend and supporting application layers to ship practical improvements.",
      "Focuses on making software feel understandable for both users and future maintainers.",
    ],
    highlights: ["Frontend", "Product quality", "Maintainable code"],
    type: "work",
    yFactor: 0.12,
    placement: {
      xFactor: 0.28,
      yPercent: 72,
    },
  },
];

// Add imageSrc when transparent cutouts are ready, for example: "/images/timeline/me-2018.png".
// placement.xPercent and placement.yPercent place the image freely on the full timeline canvas.
export const timelineTravelerImages: TimelineTravelerImage[] = [
  {
    id: "traveler-2015",
    placement: {
      xPercent: 14,
      yPercent: 72,
    },
    width: 86,
    rotation: -6,
    imageSrc: "/images/Welcome.png"
  },
  {
    id: "traveler-2020",
    placement: {
      xPercent: 46,
      yPercent: 28,
    },
    width: 62,
    rotation: 7,
  },
  {
    id: "traveler-2022",
    placement: {
      xPercent: 68,
      yPercent: 68,
    },
    width: 112,
    rotation: -3,
  },
  {
    id: "traveler-2025",
    placement: {
      xPercent: 90,
      yPercent: 30,
    },
    width: 86,
    rotation: 5,
  },
];
