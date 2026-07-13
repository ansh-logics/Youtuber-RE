import { CirclePlayDoticon } from "doticons/16";

interface DotPlayLogoProps {
  className?: string;
  iconClassName?: string;
}

export function DotPlayLogo({ className = "", iconClassName = "" }: DotPlayLogoProps) {
  return (
    <div className={`inline-flex items-center font-ndot57 select-none leading-none ${className}`}>
      <span>D</span>
      <CirclePlayDoticon 
        className={`mx-[0.03em] h-[0.9em] w-[0.9em] inline-block relative -top-[0.04em] text-current fill-current ${iconClassName}`} 
        style={{ imageRendering: "pixelated" }} 
      />
      <span>TPLAY</span>
    </div>
  );
}

export default DotPlayLogo;
