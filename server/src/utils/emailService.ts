import nodemailer from 'nodemailer';

// ─── Transporter ─────────────────────────────────────────────────────────────
// In development we use Ethereal (fake SMTP — emails are captured, not sent)
// In production, swap this for a real SMTP provider (e.g. SendGrid, Resend)
const createTransporter = async () => {
  const useRealSMTP = process.env.NODE_ENV === 'production' || !!process.env.SMTP_USER;

  if (useRealSMTP) {
    const port = Number(process.env.SMTP_PORT) || 587;
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Development: auto-generate an Ethereal test account
  const testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  return transporter;
};

// ─── Send Verification Email ──────────────────────────────────────────────────
export const sendVerificationEmail = async (
  to: string,
  fullName: string,
  token: string
): Promise<void> => {
  const transporter = await createTransporter();
  const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  const info = await transporter.sendMail({
    from: `"Tiko" <${process.env.SMTP_FROM || 'noreply@tiko.com'}>`,
    to,
    subject: 'Verify your Tiko account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Tiko, ${fullName}!</h2>
        <p style="color: #555;">
          To complete your registration, please verify your email address by clicking the button below.
          This link will expire in <strong>24 hours</strong>.
        </p>
        <a
          href="${verifyUrl}"
          style="
            display: inline-block;
            padding: 12px 24px;
            background-color: #7C3AED;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            margin: 16px 0;
          "
        >
          Verify Email Address
        </a>
        <p style="color: #888; font-size: 13px;">
          If you didn't create a Tiko account, you can safely ignore this email.
        </p>
        <p style="color: #aaa; font-size: 12px;">
          Or copy this link: ${verifyUrl}
        </p>
      </div>
    `,
  });

  // In development, log the preview URL to the console
  if (process.env.NODE_ENV !== 'production') {
    console.log('📧 Verification email preview:', nodemailer.getTestMessageUrl(info));
  }
};

// ─── Send Password Reset Email ────────────────────────────────────────────────
export const sendPasswordResetEmail = async (
  to: string,
  fullName: string,
  token: string
): Promise<void> => {
  const transporter = await createTransporter();
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

  const info = await transporter.sendMail({
    from: `"Tiko" <${process.env.SMTP_FROM || 'noreply@tiko.com'}>`,
    to,
    subject: 'Reset your Tiko password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p style="color: #555;">
          Hi ${fullName}, we received a request to reset your password.
          Click the button below to choose a new password.
          This link will expire in <strong>1 hour</strong>.
        </p>
        <a
          href="${resetUrl}"
          style="
            display: inline-block;
            padding: 12px 24px;
            background-color: #7C3AED;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            margin: 16px 0;
          "
        >
          Reset Password
        </a>
        <p style="color: #888; font-size: 13px;">
          If you didn't request a password reset, you can safely ignore this email.
          Your password will not be changed.
        </p>
        <p style="color: #aaa; font-size: 12px;">
          Or copy this link: ${resetUrl}
        </p>
      </div>
    `,
  });

  if (process.env.NODE_ENV !== 'production') {
    console.log('📧 Password reset email preview:', nodemailer.getTestMessageUrl(info));
  }
};

// ─── Send Contact Form Email ──────────────────────────────────────────────────
export const sendContactFormEmail = async (
  fromName: string,
  fromEmail: string,
  message: string
): Promise<void> => {
  const transporter = await createTransporter();

  await transporter.sendMail({
    from: `"Tiko Contact Form" <${process.env.SMTP_USER || 'noreply@tiko.com'}>`,
    to: 'tiko94307@gmail.com',
    replyTo: fromEmail,
    subject: `New Message from ${fromName} via Tiko Contact Form`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 24px;">
        <h2 style="color: #7C3AED; border-bottom: 2px solid #7C3AED; padding-bottom: 10px; margin-top: 0;">New Contact Form Submission</h2>
        <p style="margin: 10px 0;"><strong>Name:</strong> ${fromName}</p>
        <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${fromEmail}" style="color: #7C3AED; text-decoration: none;">${fromEmail}</a></p>
        <p style="margin: 20px 0 10px 0;"><strong>Message:</strong></p>
        <div style="background-color: #f9f9f9; border-left: 4px solid #7C3AED; padding: 16px; margin: 10px 0; border-radius: 4px; white-space: pre-wrap; font-size: 14px; line-height: 1.5; color: #333;">${message}</div>
        <p style="color: #888; font-size: 12px; border-top: 1px solid #e0e0e0; padding-top: 12px; margin-top: 24px; mb-0;">
          This message was sent via the contact form on Tiko.
        </p>
      </div>
    `,
  });
};

