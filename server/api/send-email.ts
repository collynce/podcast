import { defineEventHandler, readBody } from 'h3'
import sendgrid from '@sendgrid/mail'

sendgrid.setApiKey(process.env.SENDGRID_API_KEY)

export default defineEventHandler(async (event) => {
  const { email, summaries } = await readBody(event)
  
  const message = {
    to: email,
    from: 'noreply@example.com',
    subject: 'Weekly Podcast Summaries',
    text: summaries.join('\n\n'),
  }

  try {
    await sendgrid.send(message)
    return { success: true }
  } catch (error) {
    console.error('Error sending email:', error)
    return { error: 'Failed to send email' }
  }
})
