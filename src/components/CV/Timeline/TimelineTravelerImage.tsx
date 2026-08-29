import type { CSSProperties } from "react";

import type { TimelineTravelerImage as TimelineTravelerImageType } from "./timelineTypes";

type TimelineTravelerImageProps = {
  travelerImage: TimelineTravelerImageType;
};

export default function TimelineTravelerImage({
  travelerImage,
}: TimelineTravelerImageProps) {
  const imageStyle = {
    left: `${travelerImage.placement.xPercent}%`,
    top: `${travelerImage.placement.yPercent}%`,
    width: `${travelerImage.width ?? 86}px`,
    opacity: travelerImage.opacity ?? 0.88,
    "--traveler-rotation": `${travelerImage.rotation ?? 0}deg`,
  } as CSSProperties & Record<"--traveler-rotation", string>;
  const imageAlt = travelerImage.imageAlt ?? "Timeline traveler";

  return (
    <div
      className="timeline-traveler"
      style={imageStyle}
    >
      {travelerImage.imageSrc ? (
        <img src={travelerImage.imageSrc} alt={imageAlt} />
      ) : null}
    </div>
  );
}
