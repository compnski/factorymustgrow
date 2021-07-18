import { ReactComponent as TurretSVG } from "./svg/turret.opt.svg";
import { useRotation } from "./svg";
type TurretProps = {
  rotation: number;
  x: number;
  y: number;
};

const rotateHandle = "#rotateHandle";
const height = 64;
const width = 64;

export const Turret = ({ rotation, x, y }: TurretProps) => {
  const svgRef = useRotation(rotation, rotateHandle);

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
