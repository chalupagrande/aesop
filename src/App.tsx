import { useState, useRef, useEffect } from 'react'
import reactLogo from '/react.svg'
import viteLogo from '/vite.svg'
import { init, render } from './cybertruck'

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    init(canvas)
    render()

  }, [canvasRef.current])

  return (
    <>
      <div className="flex items-center justify-center gap-2">
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>

      <div>
        <canvas id="webgl" ref={canvasRef}></canvas>
      </div>
    </>
  )
}

export default App
