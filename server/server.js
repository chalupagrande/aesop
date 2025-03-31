import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import sgMail from '@sendgrid/mail'
import { emailTemplate } from './email.js'
const app = express()
const PORT = process.env.PORT || 3000

if (!process.env.SENDGRID_API_KEY) {
  throw new Error('SENDGRID_API_KEY is not defined')
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY)
app.use(express.json())

const frontEndRoutes = [
  '/',
  '/contact',
  '/vandalize'
]
frontEndRoutes.forEach((r) => {
  app.use(r, express.static('dist'))
})




app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Server is running" })
})

// app.post("/api/send-email", async (req, res) => {
//   try {
//     const { name, subject, email, message } = req.body
//     if (!name || !subject || !email || !message) {
//       return res.status(400).json({ error: "All fields are required" })
//     }

//     let result = await sgMail.send({
//       from: process.env.SENDER_EMAIL,
//       to: process.env.TARGET_EMAIL,
//       subject: `NEW MESSAGE: ${name}`,
//       html: emailTemplate(name, subject, email, message)
//     })
//     res.status(200).send({ message: 'Message Sent', data: result })
//   } catch (error) {
//     console.error(error)
//     res.status(500).send({ message: 'Error sending message' })
//   }
// })

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

