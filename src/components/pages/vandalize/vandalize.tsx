import { useRef, useEffect, useState } from 'react'
import { type ColorResult, TwitterPicker } from 'react-color'
import { init, render } from './cybertruck'


export function Vandalize() {
  const [color, setColor] = useState<string>(globalThis.settings.color)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    init(canvas, container)
    render()
  }, [canvasRef.current, containerRef.current])

  function handleChangeColor(color: ColorResult) {
    const hexColor = color.hex
    setColor(hexColor)
    globalThis.settings.color = hexColor
  }

  return (
    <div id="container" ref={containerRef}>
      <div className="controls flex flex-col items-center justify-between p-4 absolute top-[50%] left-0 z-10 bg-">
        <TwitterPicker
          onChangeComplete={handleChangeColor}
          triangle="hide"
          colors={['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', "#FFFFFF", '#000000']}
          color={color}
        />
      </div>
      <canvas id="webgl" ref={canvasRef} />
    </div>
  )
}
