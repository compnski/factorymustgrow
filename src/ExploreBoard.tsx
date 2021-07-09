import React, { useRef, useEffect } from "react";

import { Canvas } from "./canvas";

export type ExploreBoardProps = {};

const draw = (ctx: CanvasRenderingContext2D, frameCount: number) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = "#000000";
  ctx.beginPath();
  ctx.arc(50, 100, 20 * Math.sin(frameCount * 0.05) ** 2, 0, 2 * Math.PI);
  ctx.fill();
};

export const ExploreBoard = (_: ExploreBoardProps) => {
  return (
    <div className="exploreBoard">
      <Canvas draw={draw} />
    </div>
  );
};
