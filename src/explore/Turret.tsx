import { ReactComponent as TurretSVG } from "./svg/turret.opt.svg";
import { useProperties, transformRotate } from "./svg";

import { EntityProps } from "./svg";

const rotateHandle = "#rotateHandle";
const height = 64;
const width = 64;

const hpRingLength = 189;

const hpColor = (n: number): string => {
  if (n === 1) return "none";
  if (n < 0.3) return "red";
  if (n < 0.7) return "yellow";
  return "green";
};

export const Turret = ({ rotation, x, y, hpPercent = 1 }: EntityProps) => {
  const svgRef = useProperties([
    {
      handle: rotateHandle,
      attr: "transform",
      value: transformRotate(rotation + 90),
    },
    {
      handle: "#hpRing",
      attr: "stroke-dashoffset",
      value: `${(1 - hpPercent) * hpRingLength}`,
    },
    {
      handle: "#hpRing",
      attr: "stroke",
      value: hpColor(hpPercent),
    },
  ]);

  return (
    <TurretSVG
      ref={svgRef}
      width={width}
      height={height}
      x={x - 32}
      y={y - 32}
    />
  );
};
