import { useState } from 'react'
import { type ColorResult, TwitterPicker } from 'react-color'
import { Slider } from '@/components/ui/slider'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import { PanelLeftOpen, PanelRightOpen } from 'lucide-react'



export function Controls() {
  const [color, setColor] = useState<string>(globalThis.settings.color)
  const [isOpen, setIsOpen] = useState(false)

  function handleChangeColor(color: ColorResult) {
    const hexColor = color.hex
    setColor(hexColor)
    globalThis.settings.color = hexColor
  }

  function handleSizeChange(value: number[]) {
    const newSize = value[0]
    globalThis.settings.size = newSize
  }

  function handlePatternChange(newPattern: string) {
    globalThis.settings.pattern = newPattern
  }

  function handleOpenChange(open: boolean) {
    setIsOpen(!isOpen)
  }

  return (
    <div className="controls flex flex-col  justify-between p-4 absolute top-[50%] left-0 z-10 bg-">
      <Collapsible defaultOpen={true} onOpenChange={handleOpenChange}>
        <CollapsibleTrigger>{isOpen ? <PanelRightOpen /> : <PanelLeftOpen />}</CollapsibleTrigger>
        <CollapsibleContent>
          <p className="text-xs underline">decals:</p>
          <div className="flex gap-2">
            <span onClick={() => handlePatternChange("circle")}>circle</span>
            <span onClick={() => handlePatternChange("splatter")}>splatter</span>
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
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
