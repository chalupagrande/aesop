import React, { useRef, useEffect } from 'react'
import { init, render } from './cybertruck'


export const Scene = React.memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    init(canvas)
    render()
  }, [canvasRef.current, containerRef.current])


  console.log("RENDERING VANDALIZE")
  return (
    <div id="container" ref={containerRef}>
      <canvas id="webgl" ref={canvasRef} />
    </div>
  )
})
