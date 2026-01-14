import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false,
  }
})

export const sendVerificationEmail = async (to, code) => {
  try {
    const mailOptions = {
      from: `"SuitLink" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Verify your SuitLink account',
      html: `
        <h2>Verify Your Email Address</h2>
        <p>Welcome to <strong>SuitLink!</strong>!</p>
        <p>To complete your registration, please enter the verification code below:</p>
        <h1 style="letter-spacing: 4px;">${code}</h1>
        <p>This code will expre in <strong>15 minutes</strong>.</p>
        <p>If you did not create a SuitLink account, you can safely ignore this email.</p>
        <br />
        <p>- The SuitLink Team</p>`,
    }

    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('Email send failed: ', err);
    throw new Error('Failed to send verification email!');
  }
}

export const sendForgotPasswordCode = async (to, code) => {
  try {
    const mailOptions = {
      from: `SuitLink <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Reset your SuitLink password',
      html: `
        <h2>Password Reset Request</h2>
        <p>We received a request to reset the password for your SuitLink account.</p>
        <p>Your password reset code is:</p>
        <h1 style="letter-spacing: 4px;">${code}</h1>
        <p>This code will expire in <strong>15 minutes</strong>.</p>
        <p>If you did not request a password reset, you can safely ignore this email.</p>
        <br />
        <p>- The SuitLink Team</p>`
    }

    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('Email send failed: ', err);
    throw new Error('Failed to send Password Reset code!');
  }
}

export default transporter;