import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"


export function Contact() {
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // Handle form submission logic here
    try {
      const formData = new FormData(e.currentTarget)
      const data = Object.fromEntries(formData.entries())
      console.log(data)

      const result = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      console.log(result)
      alert("success")
    } catch (error) {
      console.error("Error sending email:", error)
      alert("Error sending email")
    }

  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-100 max-w-[500px]">
        <h1 className="text-xl font-bold my-4">Contact</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-start">
          <Label htmlFor="name">Name</Label>
          <Input name="name" type="text" placeholder="Name" />
          <Label htmlFor="email">Email</Label>
          <Input name="email" type="email" placeholder="Email" />
          <Label htmlFor="subject">Subject</Label>
          <Input name="subject" type="text" placeholder="Subject" />
          <Label htmlFor="message">Message</Label>
          <Textarea name="message" placeholder="Message" />
          <button className="bg-blue-500 text-white px-4 py-2 rounded">Send</button>
        </form>
      </div>
    </div>
  )
}