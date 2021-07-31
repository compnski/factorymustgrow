import { ReactComponent as BoulderSVG } from "./svg/boulder.opt.svg";

import { EntityProps } from "../svg";
const height = 64;
const width = 64;

export const Boulder = ({ x, y }: EntityProps) => {
  return <BoulderSVG width={width} height={height} x={x - 32} y={y - 32} />;
};
