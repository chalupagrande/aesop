import { useRef, useEffect } from 'react'
import { init, render } from './cybertruck'

export function Vandalize() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    init(canvas)
    render()
  }, [canvasRef.current])

  return (
    <canvas id="webgl" ref={canvasRef}></canvas>
  )
}
