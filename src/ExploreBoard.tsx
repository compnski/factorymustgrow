import React, { useRef, useEffect, SyntheticEvent } from "react";

import { Canvas } from "./canvas";

export type ExploreBoardProps = {};

export const ExploreBoard = (_: ExploreBoardProps) => {
  var [lastX, lastY] = [0, 0];

  const draw = (ctx: CanvasRenderingContext2D, frameCount: number) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // drawTerrain
    // drawTurrets
    // drawSpawners
    // drawBiters
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.arc(
      lastX,
      lastY - 20,
      20 * Math.sin(frameCount * 0.05) ** 2,
      0,
      2 * Math.PI
    );
    ctx.fill();
  };

  const canvasMouseOver = (evt: any) => {
    lastX = evt.clientX;
    lastY = evt.clientY;
  };

  const canvasMouseUp = (evt: any) => {
    console.log(evt);
  };

  return (
    <div className="exploreBoard">
      <Canvas
        draw={draw}
        onMouseMove={canvasMouseOver}
        onMouseUp={canvasMouseUp}
      />
    </div>
  );
};
