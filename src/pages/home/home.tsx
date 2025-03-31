import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { NavLink } from "react-router"
import { SignalVideo } from "@/components/signalVideo"

const targetDate = new Date("2025-05-01T00:00:00Z")
let interval: NodeJS.Timeout | undefined
const timerString = getTimerString()

export function Home() {
  const [timer, setTimer] = useState(timerString)
  useEffect(() => {
    interval = setInterval(() => {
      const newTimer = getTimerString()
      setTimer(newTimer)
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [false])

  return (
    <div className="home">
      <div className="flex flex-col items-center justify-start p-2 h-screen bg-[url('/images/404.jpg')] bg-cover bg-center">
        <h1 className="text-[180px] font-technical leading-[220px] my-2 sm:my-4 sm:text-[250px] font-extrabold">404</h1>
        <p className="max-w-[500px] text-center">Outcomes, deal flow, valuation, exits, the videos. We still do all that.</p>
        <p className="my-2 font-bold">Returning in:</p>
        <div className="text-4xl font-technical my-4 sm:text-5xl ">
          {timer}
        </div>
        <p>till then... </p>
        <NavLink to="vandalize"><Button className="mt-4">vandalize this cyber*uck</Button></NavLink>
      </div>
      <SignalVideo />
    </div>
  )
}


function getTimerString() {
  const now = new Date()
  const diff = targetDate.getTime() - now.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  const daysStr = String(days).padStart(2, "0")
  const hoursStr = String(hours % 24).padStart(2, "0")
  const minutesStr = String(minutes % 60).padStart(2, "0")
  const secondsStr = String(seconds % 60).padStart(2, "0")
  const timerStr = `${daysStr}:${hoursStr}:${minutesStr}:${secondsStr}`
  return timerStr
}