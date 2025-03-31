import { useState } from "react";
import { NavLink } from "react-router";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogTrigger, AlertDialogDescription } from "./ui/alert-dialog";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="flex flex-row items-center justify-between p-4 z-100">
        <div className="flex flex-row items-center gap-1">
          <NavLink to="/"><h1 className="text-3xl font-bold cursor-default">AESOP</h1></NavLink>
          {/* <SignalVideo /> */}
        </div>
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogTrigger><Button variant="link">CONTACT</Button></AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Actually maybe don't...</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="flex flex-col gap-4 items-start">
                <p>Listen, we actually don't have much time to get this thing off the ground, and we are working really hard to do that. So if you wouldn't mind, just let us do our thing.</p>
                <Button onClick={() => setIsOpen(false)}>Close</Button>
              </div>
            </AlertDialogDescription>
          </AlertDialogContent>
        </AlertDialog>
      </header>
    </>
  )
}