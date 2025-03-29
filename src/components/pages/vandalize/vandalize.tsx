import React, { useState } from 'react'
import { type ColorResult, TwitterPicker } from 'react-color'
import { Scene } from './scene'
import "./vandalize.css"


export const Vandalize = React.memo(() => {
  const [color, setColor] = useState<string>(globalThis.settings.color)

  function handleChangeColor(color: ColorResult) {
    const hexColor = color.hex
    setColor(hexColor)
    globalThis.settings.color = hexColor
  }

  return (
    <div>
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
      </div>
      <Scene />
    </div>
  )
})
