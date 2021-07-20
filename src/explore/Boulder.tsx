import { ReactComponent as BoulderSVG } from "./svg/boulder.opt.svg";

import { useProperties, EntityProps } from "./svg";
const height = 64;
const width = 64;

export const Boulder = ({ rotation, x, y, hpPercent = 1 }: EntityProps) => {
  return <BoulderSVG width={width} height={height} x={x - 32} y={y - 32} />;
};
