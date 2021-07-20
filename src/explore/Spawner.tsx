import { ReactComponent as SpawnerSVG } from "./svg/spawner.opt.svg";

import { useProperties, EntityProps } from "./svg";
const height = 64;
const width = 64;

const hpRingLength = 532;

const hpColor = (n: number): string => {
  if (n < 0.3) return "red";
  if (n < 0.7) return "yellow";
  return "green";
};

export const Spawner = ({ rotation, x, y, hpPercent = 1 }: EntityProps) => {
  const svgRef = useProperties([
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
    <SpawnerSVG
      ref={svgRef}
      width={width}
      height={height}
      x={x - 32}
      y={y - 32}
    />
  );
};
