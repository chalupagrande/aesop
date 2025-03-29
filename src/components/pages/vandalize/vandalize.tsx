import { useRef, useEffect } from 'react'
import { init, render } from './cybertruck'

export function Vandalize() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    init(canvas, container)
    render()
  }, [canvasRef.current, containerRef.current])

  return (
    <div id="container" ref={containerRef}>
      <canvas id="webgl" ref={canvasRef}></canvas>
    </div>
  )
}
