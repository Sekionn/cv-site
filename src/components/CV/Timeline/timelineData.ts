import type { TimelineEvent, TimelineTravelerImage } from "./timelineTypes";

// placement.xFactor moves the note inside its start-year band: 0 = exactly on its year line, 1 = exactly on the next year line.
// placement.yPercent moves the note vertically across the map.
// connectToEventIds controls route lines from this node. Use null when the route ends.
// nodePosition controls whether the route node is above or below the note.
export const schoolTimelineEvents: TimelineEvent[] = [
  {
    id: "school-htx",
    startYear: 2015,
    endYear: 2018,
    titleKey: "timeline.schoolHtx.title",
    descriptionKey: "timeline.schoolHtx.description",
    locationKey: "timeline.schoolHtx.location",
    detailKeys: [
      "timeline.schoolHtx.detail.period",
      "timeline.schoolHtx.detail.subjects",
    ],
    highlightKeys: [
      "timeline.schoolHtx.highlight.communicationIt",
      "timeline.schoolHtx.highlight.english",
      "timeline.schoolHtx.highlight.programming",
    ],
    type: "school",
    connectToEventIds: ["school-vallekilde"],
    nodePosition: "above",
    yFactor: -0.55,
    placement: {
      xFactor: 0.18,
      yPercent: 0,
    },
  },
  {
    id: "school-vallekilde",
    startYear: 2019,
    endYear: 2019,
    titleKey: "timeline.vallekilde.title",
    descriptionKey: "timeline.vallekilde.description",
    locationKey: "timeline.vallekilde.location",
    detailKeys: [
      "timeline.vallekilde.detail.period",
      "timeline.vallekilde.detail.course",
    ],
    highlightKeys: [
      "timeline.vallekilde.highlight.gameDevelopment",
      "timeline.vallekilde.highlight.csharp",
    ],
    type: "school",
    connectToEventIds: ["school-computer-science"],
    nodePosition: "above",
    yFactor: 0.45,
    placement: {
      xFactor: 0,
      yPercent: 45,
    },
  },
  {
    id: "school-computer-science",
    startYear: 2019,
    endYear: 2022,
    titleKey: "timeline.computerScience.title",
    descriptionKey: "timeline.computerScience.description",
    locationKey: "timeline.computerScience.location",
    detailKeys: [
      "timeline.computerScience.detail.period",
      "timeline.computerScience.detail.degree",
      "timeline.computerScience.detail.gameDevelopment",
    ],
    highlightKeys: [
      "timeline.computerScience.highlight.ap",
      "timeline.computerScience.highlight.unity",
      "timeline.computerScience.highlight.programming",
    ],
    type: "school",
    connectToEventIds: ["school-it-security"],
    nodePosition: "below",
    yFactor: -10  ,
    placement: {
      xFactor: 0.5,
      yPercent: 33,
    },
  },
  {
    id: "school-it-security",
    startYear: 2025,
    endYear: 2026,
    titleKey: "timeline.itSecurity.title",
    descriptionKey: "timeline.itSecurity.description",
    locationKey: "timeline.itSecurity.location",
    detailKeys: [
      "timeline.itSecurity.detail.period",
      "timeline.itSecurity.detail.security",
      "timeline.itSecurity.detail.crypto",
    ],
    highlightKeys: [
      "timeline.itSecurity.highlight.networkSecurity",
      "timeline.itSecurity.highlight.systemSecurity",
      "timeline.itSecurity.highlight.cryptography",
    ],
    type: "school",
    connectToEventIds: ["school-software-development"],
    nodePosition: "below",
    yFactor: 0.55,
    placement: {
      xFactor: 0.6,
      yPercent: 37,
    },
  },
  {
    id: "school-software-development",
    startYear: 2026,
    titleKey: "timeline.softwareDevelopment.title",
    descriptionKey: "timeline.softwareDevelopment.description",
    locationKey: "timeline.softwareDevelopment.location",
    detailKeys: [
      "timeline.softwareDevelopment.detail.period",
      "timeline.softwareDevelopment.detail.databases",
      "timeline.softwareDevelopment.detail.quality",
    ],
    highlightKeys: [
      "timeline.softwareDevelopment.highlight.databaseTypes",
      "timeline.softwareDevelopment.highlight.softwareQuality",
      "timeline.softwareDevelopment.highlight.testing",
    ],
    type: "school",
    connectToEventIds: null,
    nodePosition: "below",
    yFactor: -0.35,
    placement: {
      xFactor: 0.5,
      yPercent: 82,
    },
  },
];

export const workTimelineEvents: TimelineEvent[] = [
  {
    id: "work-netto",
    startYear: 2020,
    endYear: 2021,
    titleKey: "timeline.netto.title",
    descriptionKey: "timeline.netto.description",
    locationKey: "timeline.netto.location",
    detailKeys: [
      "timeline.netto.detail.period",
      "timeline.netto.detail.responsibility",
      "timeline.netto.detail.operations",
    ],
    highlightKeys: [
      "timeline.netto.highlight.storeResponsibility",
      "timeline.netto.highlight.teamCoordination",
      "timeline.netto.highlight.customerService",
    ],
    type: "work",
    connectToEventIds: ["work-ajour-student"],
    nodePosition: "below",
    yFactor: 0.5,
    placement: {
      xFactor: 0.2,
      yPercent: 88,
    },
  },
  {
    id: "work-ajour-student",
    startYear: 2021,
    endYear: 2022,
    titleKey: "timeline.ajourStudent.title",
    descriptionKey: "timeline.ajourStudent.description",
    locationKey: "timeline.ajourStudent.location",
    detailKeys: [
      "timeline.ajourStudent.detail.period",
      "timeline.ajourStudent.detail.internship",
      "timeline.ajourStudent.detail.cypress",
    ],
    highlightKeys: [
      "timeline.ajourStudent.highlight.cypress",
      "timeline.ajourStudent.highlight.frontendTesting",
      "timeline.ajourStudent.highlight.studentDeveloper",
    ],
    type: "work",
    connectToEventIds: ["work-eg-ajour"],
    nodePosition: "above",
    yFactor: -0.6,
    placement: {
      xFactor: 0.4,
      yPercent: 15,
    },
  },
  {
    id: "work-eg-ajour",
    startYear: 2022,
    endYear: 2024,
    titleKey: "timeline.egAjour.title",
    descriptionKey: "timeline.egAjour.description",
    locationKey: "timeline.egAjour.location",
    detailKeys: [
      "timeline.egAjour.detail.period",
      "timeline.egAjour.detail.frontend",
      "timeline.egAjour.detail.migration",
      "timeline.egAjour.detail.playwright",
      "timeline.egAjour.detail.app",
    ],
    highlightKeys: [
      "timeline.egAjour.highlight.aurelia",
      "timeline.egAjour.highlight.typescript",
      "timeline.egAjour.highlight.playwright",
      "timeline.egAjour.highlight.crossPlatformApp",
    ],
    type: "work",
    connectToEventIds: ["work-clever"],
    nodePosition: "above",
    yFactor: 0.1,
    placement: {
      xFactor: 0.6,
      yPercent: 32,
    },
  },
  {
    id: "work-clever",
    startYear: 2024,
    endYear: 2025,
    titleKey: "timeline.clever.title",
    descriptionKey: "timeline.clever.description",
    locationKey: "timeline.clever.location",
    detailKeys: [
      "timeline.clever.detail.period",
      "timeline.clever.detail.portal",
      "timeline.clever.detail.firstSelfHelp",
      "timeline.clever.detail.stack",
    ],
    highlightKeys: [
      "timeline.clever.highlight.csharp",
      "timeline.clever.highlight.sql",
      "timeline.clever.highlight.backend",
      "timeline.clever.highlight.selfHelp",
    ],
    type: "work",
    connectToEventIds: ["work-danish-judicial-system-waiting"],
    nodePosition: "above",
    yFactor: 7,
    placement: {
      xFactor: 0.46,
      yPercent: 40,
    },
  },
  {
    id: "work-danish-judicial-system-waiting",
    startYear: 2025,
    endYear: 2026,
    titleKey: "timeline.domstolsstyrelsen.title",
    descriptionKey: "timeline.domstolsstyrelsen.description",
    locationKey: "timeline.domstolsstyrelsen.location",
    detailKeys: [
      "timeline.domstolsstyrelsen.detail.period",
      "timeline.domstolsstyrelsen.detail.vente",
      "timeline.domstolsstyrelsen.detail.stillingsstop",
      "timeline.domstolsstyrelsen.detail.proof",
      "timeline.domstolsstyrelsen.detail.springboot",
    ],
    detailImages: [
      {
        imageSrcKey: "timeline.domstolsstyrelsen.detail.proofpath",
        imageAltKey: "timeline.domstolsstyrelsen.detail.proofAlt",
      },
    ],
    highlightKeys: [
      "timeline.domstolsstyrelsen.highlight.java",
      "timeline.domstolsstyrelsen.highlight.springboot",
      "timeline.domstolsstyrelsen.highlight.backend",
    ],
    type: "work",
    connectToEventIds: ["work-boulders"],
    nodePosition: "below",
    yFactor: -0.35,
    placement: {
      xFactor: 0.5,
      yPercent: 90,
    },
  },
  {
    id: "work-boulders",
    startYear: 2026,
    titleKey: "timeline.boulders.title",
    descriptionKey: "timeline.boulders.description",
    locationKey: "timeline.boulders.location",
    detailKeys: [
      "timeline.boulders.detail.period",
      "timeline.boulders.detail.opgaver",
      "timeline.boulders.detail.proof",
      "timeline.boulders.detail.kaffejoke",
    ],
    highlightKeys: [
      "timeline.boulders.highlight.Latteart",
      "timeline.boulders.highlight.Klatring",
      "timeline.boulders.highlight.selvstændighed",
    ],
    type: "work",
    connectToEventIds: null,
    nodePosition: "above",
    yFactor: -0.35,
    placement: {
      xFactor: 0.5,
      yPercent: 5,
    },
  },
];

export const timelineEvents: TimelineEvent[] = [
  ...schoolTimelineEvents,
  ...workTimelineEvents,
];

// Add imageSrc when transparent cutouts are ready, for example: "/images/timeline/me-2018.png".
// placement.xPercent and placement.yPercent place the image freely on the full timeline canvas.
export const timelineTravelerImages: TimelineTravelerImage[] = [
  {
    id: "traveler-2015",
    imageAltKey: "timeline.traveler.defaultAlt",
    placement: {
      xPercent: 14,
      yPercent: 72,
    },
    width: 86,
    rotation: -6,
    imageSrc: "/images/Welcome.png",
  },
  {
    id: "traveler-2020",
    imageAltKey: "timeline.traveler.defaultAlt",
    placement: {
      xPercent: 46,
      yPercent: 28,
    },
    width: 62,
    rotation: 7,
  },
  {
    id: "traveler-2022",
    imageAltKey: "timeline.traveler.defaultAlt",
    placement: {
      xPercent: 68,
      yPercent: 68,
    },
    width: 112,
    rotation: -3,
  },
  {
    id: "traveler-2025",
    imageAltKey: "timeline.traveler.defaultAlt",
    placement: {
      xPercent: 90,
      yPercent: 30,
    },
    width: 86,
    rotation: 5,
  },
];
