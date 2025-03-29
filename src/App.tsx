import { useEffect, useState } from "react"
import { Button } from "./components/ui/button"
import { clear } from "console"
const targetDate = new Date("2025-05-01T00:00:00Z")
let interval: NodeJS.Timeout | undefined

function App() {
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
    <div className="bg-background text-foreground max-h-screen overflow-hidden">
      <header className="flex flex-row items-center justify-between p-4">
        <h1 className="text-3xl font-bold">AESOP</h1>
        <Button variant="link">contact</Button>
      </header>
      <main className="flex flex-col items-center justify-center h-screen">
        <div className="text-[250px] font-technical my-4">404</div>
        <p className="max-w-[350px] text-center">Outcomes, deal flow, valuation, exits, the videos. We still do all that.</p>

        <p className="my-4">Returning in:</p>
        <div className="text-5xl font-technical my-4">
          {timer}
        </div>
        <p>till then... </p>
        <Button className="my-4">trash a cybertr*ck</Button>
      </main>
    </div>
  )
}

export default App
