import sendgrid from '@sendgrid/mail'

sendgrid.setApiKey(process.env.SENDGRID_API_KEY)

export async function sendEmail(email: string, summaries: string[]): Promise<void> {
  const message = {
    to: email,
    from: 'noreply@example.com',
    subject: 'Weekly Podcast Summaries',
    text: summaries.join('\n\n'),
  }
  await sendgrid.send(message)
}
