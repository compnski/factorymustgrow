import { useRef, useEffect, RefObject, SyntheticEvent } from "react"

export type CanvasProps = {
  draw: (context: CanvasRenderingContext2D, frameCount: number) => void
  onMouseMove: (evt: SyntheticEvent) => void
  onMouseDown?: (evt: SyntheticEvent) => void
  onMouseUp?: (evt: SyntheticEvent) => void
}

export const Canvas = ({ draw, ...rest }: CanvasProps) => {
  const canvasRef = useCanvas(draw)
  return <canvas ref={canvasRef} {...rest} />
}

const useCanvas = (
  draw: (context: CanvasRenderingContext2D, frameCount: number) => void
): RefObject<HTMLCanvasElement> => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas == null) {
      console.error("Failed to get a canvas from canvasRef")
      return
    }
    const context = canvas.getContext("2d")
    if (context == null) {
      console.error("Failed to get context from canvas")
      return
    }

    let frameCount = 0
    let animationFrameId: number

    const render = () => {
      resizeCanvasToDisplaySize(canvas)
      frameCount++
      draw(context, frameCount)
      animationFrameId = window.requestAnimationFrame(render)
    }
    render()

    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [draw])

  return canvasRef
}

function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement) {
  const { width, height } = canvas.getBoundingClientRect()

  if (canvas.width !== width || canvas.height !== height) {
    const { devicePixelRatio: ratio = 1 } = window
    canvas.width = width
    canvas.height = height
    return true // here you can return some usefull information like delta width and delta height instead of just true
    // this information can be used in the next redraw...
  }

  return false
}
