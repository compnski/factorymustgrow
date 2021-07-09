import React, { useRef, useEffect, SyntheticEvent } from "react";

import { ReactComponent as Turret } from "./svg/turret.opt.svg";

export type ExploreBoardProps = {};

export const ExploreBoard = (_: ExploreBoardProps) => {
  var [lastX, lastY] = [0, 0];

  const canvasMouseOver = (evt: any) => {
    lastX = evt.clientX;
    lastY = evt.clientY;
    console.log(evt);
  };

  const canvasMouseUp = (evt: any) => {
    console.log(evt);
  };

  const turrets = [
    {
      x: 0,
      y: 0,
      rotation: 10,
    },
    {
      x: 100,
      y: 0,
      rotation: 350,
    },
  ];
  var idx = 0;
  return (
    <div
      onMouseOver={canvasMouseOver}
      onMouseUp={canvasMouseUp}
      className="exploreBoard"
    >
      <svg id="exploreCanvas" preserveAspectRatio="xMaxYMax none">
        {turrets.map((t) => (
          <g key={idx++} transform={`rotate(${t.rotation},0,0)`}>
            <Turret width={100} height={100} x={t.x} y={t.y} />
          </g>
        ))}
      </svg>
    </div>
  );
};
