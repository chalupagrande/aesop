import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { NavLink } from "react-router"


const targetDate = new Date("2025-05-01T00:00:00Z")
let interval: NodeJS.Timeout | undefined

export function Home() {
  const [timer, setTimer] = useState("00:00:00:00")

  useEffect(() => {
    interval = setInterval(() => {
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
      setTimer(`${daysStr}:${hoursStr}:${minutesStr}:${secondsStr}`)
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [false])

  return (
    <div className="flex flex-col items-center justify-start h-screen p-2">
      <h1 className="text-[250px] font-technical leading-[220px] my-4">404</h1>
      <p className="max-w-[500px] text-center">Outcomes, deal flow, valuation, exits, the videos. We still do all that.</p>

      <p className="my-4">Returning in:</p>
      <div className="text-5xl font-technical my-4">
        {timer}
      </div>
      <p>till then... </p>
      <NavLink to="vandalize"><Button className="my-8">trash a cyber*uck</Button></NavLink>
      <img src="/not-found.png" alt="not found" className="object-cover " width="100" />
    </div>
  )
}


