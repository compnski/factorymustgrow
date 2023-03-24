import { useRef, useEffect, RefObject } from "react"

export type EntityProps = {
  rotation: number
  x: number
  y: number
  hpPercent?: number
}

export const useRotation = (rotation: number, rotateHandle: string): RefObject<SVGSVGElement> => {
  const svgRef = useRef<SVGSVGElement>(null)
  useEffect(() => {
    const svg = svgRef.current
    if (svg == null) {
      console.error("Failed to get an element from canvasRef")
      return
    }
    const group: SVGElement | null = svg.querySelector(rotateHandle)
    group?.setAttribute("transform", `rotate(${rotation} 0 ,0)`)
  })
  return svgRef
}

export const transformRotate = (rotation: number | string): string => `rotate(${rotation} 0 ,0)`

export const useProperties = (
  properties: { handle: string; attr: string; value: string }[]
): RefObject<SVGSVGElement> => {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = svgRef.current
    if (svg == null) {
      console.error("Failed to get an element from canvasRef")
      return
    }

    for (const { handle, attr, value } of properties) {
      const group: SVGElement | null = svg.querySelector(handle)
      group?.setAttribute(attr, value)
    }
  })
  return svgRef
}
