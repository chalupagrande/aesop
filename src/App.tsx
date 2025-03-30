import { Button } from "./components/ui/button"
import { Route, Routes, NavLink } from "react-router"
import { Contact } from "./components/pages/contact"
import { Home } from "./components/pages/home"
import { Vandalize } from "./components/pages/vandalize"

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/vandalize" element={<Vandalize />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Layout>
  )
}


export default App


function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="bg-background text-foreground max-h-screen overflow-hidden text-gray">
      <Navigation />
      <div className="background" />
      <main>
        {children}
      </main>
    </div>
  )
}

function Navigation() {
  return (
    <header className="header flex flex-row items-center justify-between p-4">
      <NavLink to="/"><h1 className="text-3xl font-bold cursor-default">AESOP</h1></NavLink>
      <NavLink to="/contact"><Button variant="link">CONTACT</Button></NavLink>
    </header>
  )
}