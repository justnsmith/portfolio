import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message are required." });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
      to: process.env.PERSONAL_EMAIL,
      replyTo: email,
      subject: `New message from ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">
          <div style="background: #0d1117; padding: 24px 32px; border-radius: 12px 12px 0 0;">
            <p style="color: #22d3ee; font-size: 12px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; margin: 0 0 4px;">justnsmith.com</p>
            <h1 style="color: #f0f4f8; font-size: 22px; margin: 0;">New Contact Form Submission</h1>
          </div>
          <div style="background: #f9f8f7; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #e5e0d8; border-top: none;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #ede9e3; width: 100px;">
                  <span style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #9ca3af;">Name</span>
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid #ede9e3;">
                  <span style="font-size: 15px; color: #1a1a1a;">${name}</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #ede9e3;">
                  <span style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #9ca3af;">Email</span>
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid #ede9e3;">
                  <a href="mailto:${email}" style="font-size: 15px; color: #0ea5e9; text-decoration: none;">${email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 14px 0 0; vertical-align: top;">
                  <span style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #9ca3af;">Message</span>
                </td>
                <td style="padding: 14px 0 0;">
                  <p style="font-size: 15px; color: #1a1a1a; margin: 0; line-height: 1.6;">${message.replace(/\n/g, "<br>")}</p>
                </td>
              </tr>
            </table>
            <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #ede9e3;">
              <a href="mailto:${email}" style="display: inline-block; background: #22d3ee; color: #0d1117; font-size: 13px; font-weight: 600; padding: 10px 20px; border-radius: 8px; text-decoration: none;">
                Reply to ${name} →
              </a>
            </div>
          </div>
        </div>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Mail error:", err);
    return res.status(500).json({ error: "Failed to send email. Please try again." });
  }
}
