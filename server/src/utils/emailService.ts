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
