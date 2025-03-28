import reactLogo from '/react.svg'
import viteLogo from '/vite.svg'
import Vandalize from './components/vandalize'

function App() {

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
        <Vandalize />
      </div>
    </>
  )
}

export default App
