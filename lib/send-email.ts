import { Resend } from 'resend';

export const sendEmail = (to: string, subject: string, html: string) => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  return resend.emails.send({
    from: 'onboarding@resend.dev',
    to,
    subject,
    html,
  });
};
