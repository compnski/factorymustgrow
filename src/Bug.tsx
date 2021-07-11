import { ReactComponent as BugSVG } from "./svg/bug.opt.svg";
import { useRotation } from "./svg";
type BugProps = {
  rotation: number;
  x: number;
  y: number;
};

const rotateHandle = "#rotateHandle";
const height = 32;
const width = 32;

export const Bug = ({ rotation, x, y }: BugProps) => {
  const svgRef = useRotation(rotation, rotateHandle);

  return <BugSVG ref={svgRef} width={width} height={height} x={x} y={y} />;
};
