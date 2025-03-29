import { useState } from 'react'
import { type ColorResult, TwitterPicker } from 'react-color'
import { Slider } from '@/components/ui/slider'



export function Controls() {
  const [color, setColor] = useState<string>(globalThis.settings.color)
  const [size, setSize] = useState<number>(globalThis.settings.size)
  const [pattern, setPattern] = useState<string>(globalThis.settings.pattern)

  function handleChangeColor(color: ColorResult) {
    const hexColor = color.hex
    setColor(hexColor)
    globalThis.settings.color = hexColor
  }

  function handleSizeChange(value: number[]) {
    const newSize = value[0]
    setSize(newSize)
    globalThis.settings.size = newSize
  }

  return (
    <div className="controls flex flex-col  justify-between p-4 absolute top-[50%] left-0 z-10 bg-">
      <p className="text-xs underline">decals:</p>
      <div className="flex gap-2">
        <span>circle</span>
        <span>splatter</span>
      </div>
      <p className="text-xs underline">colors:</p>
      <TwitterPicker
        onChangeComplete={handleChangeColor}
        triangle="hide"
        colors={['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', "#FFFFFF", '#000000']}
        color={color}
      />
      <p className="text-xs underline">brush size:</p>
      <Slider className="my-4" defaultValue={[1]} min={0.1} max={5} step={0.1} onValueChange={handleSizeChange} />
    </div>
  )
}
