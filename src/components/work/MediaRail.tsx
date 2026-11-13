import type { ProjectMedia } from "@/data/projects";
import { blurFor } from "@/lib/blur";
import type { Device } from "@/lib/work";
import Carousel from "./Carousel";
import ShowcaseItem from "./ShowcaseItem";

type Props = { media: ProjectMedia[]; device: Device; label: string; className?: string };

/** A chapter's media inline, for layouts without the sticky stage. */
export default function MediaRail({ media, device, label, className = "" }: Props) {
  const row = (copy: boolean) =>
    media.map((m, i) => <ShowcaseItem key={i} media={{ ...m, blur: blurFor(m) }} device={device} label={label} warm={!copy} />);
  return (
    <div className={`h-[min(32rem,70svh)] [container-type:size] ${className}`}>
      <Carousel repeat={row(true)}>{row(false)}</Carousel>
    </div>
  );
}
