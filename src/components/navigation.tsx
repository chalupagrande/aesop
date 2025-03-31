import { NavLink } from "react-router";
import { Button } from "@/components/ui/button";

export function Navigation() {
  return (
    <>
      <header className="flex flex-row items-center justify-between p-4 z-100">
        <div className="flex flex-row items-center gap-1">
          <NavLink to="/"><h1 className="text-3xl font-bold cursor-default">AESOP</h1></NavLink>
          {/* <SignalVideo /> */}
        </div>
        <a href="mailto:ryanorenstein@gmail.com"><Button variant="link">CONTACT</Button></a>
      </header>
    </>
  )
}