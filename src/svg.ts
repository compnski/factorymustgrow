import { useRef, useEffect, RefObject } from "react";

export const useRotation = (
  rotation: number,
  rotateHandle: string
): RefObject<SVGSVGElement> => {
  const svgRef = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = svgRef.current;
    if (svg == null) {
      console.error("Failed to get an element from canvasRef");
      return;
    }
    const group: SVGElement | null = svg.querySelector(rotateHandle);
    group?.setAttribute("transform", `rotate(${rotation} 0 ,0)`);
  });
  return svgRef;
};
