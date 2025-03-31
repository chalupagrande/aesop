export function emailTemplate(name, subject, email, message) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <body>

    <h1>Name: ${name}</h1>


    <h1>Email: ${email}</h1>

    <h1>Subject: ${subject}</h1>

    <h1>Message</h1>
    <p>${message}</p>

    </body>
    </html>
    `
}