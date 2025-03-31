import { Route, Routes } from "react-router"
import { Contact } from "@/pages/contact"
import { Home } from "@/pages/home"
import { Vandalize } from "@/pages/vandalize"
import { Navigation } from "@/components/navigation"

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
    <div className="layout max-h-screen overflow-hidden">
      <Navigation />
      <main className="z-100">
        {children}
      </main>
    </div>
  )
}

