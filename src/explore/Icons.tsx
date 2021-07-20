import { ReactComponent as StarSVG } from "./svg/star.svg";
import { ReactComponent as CloudSVG } from "./svg/cloud.svg";
import { EntityProps } from "./svg";
const height = 16;
const width = 16;

export const Star = ({ rotation, x, y }: EntityProps) => {
  return (
    <StarSVG
      className="attackStar"
      width={width}
      height={height}
      x={x - 8}
      y={y - 8}
    />
  );
};

export const Cloud = ({ rotation, x, y }: EntityProps) => {
  return (
    <CloudSVG
      className="attackCloud"
      width={width}
      height={height}
      x={x - 8}
      y={y - 8}
    >
      <animate
        attributeName="x"
        from="0"
        to="200"
        dur="5s"
        repeatCount="indefinite"
      />
    </CloudSVG>
  );
};
