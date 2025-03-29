import { Button } from "./components/ui/button"

function App() {

  return (
    <div className="bg-background text-foreground">
      <header className="flex flex-row items-center justify-between p-4">
        <h1 className="text-3xl font-bold">AESOP</h1>
        <Button variant="link">contact</Button>
      </header>
      <main>
        <h1> something</h1>
      </main>
    </div>
  )
}

export default App
