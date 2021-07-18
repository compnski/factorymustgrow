import { ReactComponent as BugSVG } from "./svg/bug.opt.svg";
import { useProperties, transformRotate } from "./svg";
type BugProps = {
  rotation: number;
  fill?: string;
  x: number;
  y: number;
};

const rotateHandle = "#rotateHandle";

const height = 32;
const width = 32;

export const Bug = ({ fill = "#2a00ef", rotation, x, y }: BugProps) => {
  const svgRef = useProperties([
    {
      handle: rotateHandle,
      attr: "transform",
      value: transformRotate(rotation),
    },
    {
      handle: "#mainBody",
      attr: "fill",
      value: fill,
    },
  ]);

  return (
    <BugSVG ref={svgRef} width={width} height={height} x={x - 16} y={y - 16} />
  );
};
