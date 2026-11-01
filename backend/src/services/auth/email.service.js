import nodemailer from "nodemailer";
import { conf } from "../../configs/env.js";
import logger from "../../utils/logger.js";

if (!conf.smtpHost || !conf.smtpUser || !conf.smtpPass) {
  logger.warn("SMTP credentials missing. Email sending disabled.");
}

const transporter = nodemailer.createTransport({
  host: conf.smtpHost,
  port: Number(conf.smtpPort),
  secure: false, // ✅ required for port 587
  auth: {
    user: conf.smtpUser,
    pass: conf.smtpPass,
  },
});

// Optional but HIGHLY recommended
transporter.verify((err) => {
  if (err) {
    logger.error("SMTP connection failed:", { error: err.message });
  } else {
    logger.info("SMTP server ready");
  }
});

export const sendVerificationOTP = async (
  email,
  otp,
  projectName,
  customization = {},
  metadata = {},
) => {
  const {
    logoUrl = "",
    primaryColor = "#4f46e5",
    subjectLine = `Verify your identity – ${projectName}`,
    footerText = "Secure Identity for Developers",
    companyAddress = "",
    supportUrl = "",
    privacyUrl = "",
    securityUrl = "",
    customBody = `We received a request to access your <strong>${projectName}</strong> account. To continue, please confirm your identity using the verification code below.`,
    showMetadata = true,
  } = customization;

  const {
    ip = "Unknown",
    userAgent = "Unknown Device",
    location = "Unknown Location",
    requestId = "N/A",
    _projectId = "N/A",
  } = metadata;

  const timestamp = new Date().toUTCString();

  const mailOptions = {
    from: `"${projectName}" <${conf.smtpUser}>`,
    to: email,
    subject: subjectLine,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${subjectLine}</title>

<style>
/* ----------------------------------------------------
   Base Reset & Typography
---------------------------------------------------- */
body { margin: 0; padding: 0; background-color: #f8fafc; font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #1e293b; }
img { max-width: 100%; display: block; }
a { color: ${primaryColor}; text-decoration: none; }

/* ----------------------------------------------------
   Wrapper & Container
---------------------------------------------------- */
.wrapper { width: 100%; padding: 48px 0; background-color: #f8fafc; }
.container { max-width: 600px; width: 100%; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }

/* ----------------------------------------------------
   Header
---------------------------------------------------- */
.header { padding: 32px 40px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #f1f5f9; }
.header-left { display: flex; align-items: center; gap: 14px; }
.logo { height: 32px; width: auto; }
.project-name { font-size: 18px; font-weight: 700; color: #0f172a; }
.security-badge { background-color: #ecfdf5; color: #059669; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 999px; letter-spacing: 0.05em; text-transform: uppercase; white-space: nowrap; }

/* ----------------------------------------------------
   Main Content
---------------------------------------------------- */
.main { padding: 40px 40px; }
.h1 { font-size: 24px; font-weight: 800; margin: 0 0 16px; color: #0f172a; }
.text { font-size: 16px; color: #64748b; line-height: 1.6; margin: 0; }

/* ----------------------------------------------------
   OTP Section
---------------------------------------------------- */
.otp-section { margin: 40px 0; padding: 32px; background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 12px; text-align: center; }
.otp { font-family: "JetBrains Mono", monospace; font-size: 42px; font-weight: 800; letter-spacing: 6px; color: ${primaryColor}; }
.otp-label { margin-top: 12px; font-size: 11px; font-weight: 600; letter-spacing: 0.04em; color: #94a3b8; text-transform: uppercase; }
.otp-info { margin-top: 16px; font-size: 13px; color: #64748b; line-height: 1.5; }

/* ----------------------------------------------------
   Info Grid / Details
---------------------------------------------------- */
.info-grid { margin-top: 40px; padding-top: 32px; border-top: 1px solid #f1f5f9; font-size: 13px; color: #64748b; }
.info-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
.info-label { font-weight: 500; color: #94a3b8; }
.info-val { font-family: "JetBrains Mono", monospace; color: #334155; }

/* ----------------------------------------------------
   Security Notice
---------------------------------------------------- */
.security-box { margin-top: 32px; padding: 20px; background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; font-size: 13px; color: #b45309; }
.security-title { font-weight: 700; color: #92400e; margin-bottom: 8px; display: block; }

/* ----------------------------------------------------
   Footer
---------------------------------------------------- */
.footer { padding: 32px 40px; background-color: #f9fafb; border-top: 1px solid #f1f5f9; text-align: center; }
.footer-links { margin-bottom: 16px; }
.footer-links a { margin: 0 8px; font-size: 13px; font-weight: 500; color: #64748b; }
.legal-text { font-size: 12px; color: #94a3b8; line-height: 1.5; margin-top: 12px; }
.powered { margin-top: 24px; font-size: 11px; color: #cbd5e1; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }

@media (max-width: 600px) {
    .container { border-radius: 0; border: none; }
    .header, .main, .footer { padding: 24px; }
    .header { flex-direction: column; gap: 16px; text-align: center; }
    .otp { font-size: 32px; }
}
</style>
</head>

<body>
<div class="wrapper">
<div class="container">

<!-- Header -->
<div class="header">
    <div class="header-left">
        ${logoUrl ? `<img src="${logoUrl}" class="logo" alt="${projectName}" />` : ``}
        <span class="project-name">${projectName}</span>
    </div>
    <div class="security-badge">Secure Auth</div>
</div>

<!-- Main -->
<div class="main">

<h1 class="h1">Verify your identity</h1>

<p class="text">
${customBody}
</p>

<!-- OTP -->
<div class="otp-section">
    <div class="otp">${otp}</div>
    <div class="otp-label">Verification Code</div>
    <div class="otp-info">
        Valid for 10 minutes.<br>
        Do not share this code with anyone.
    </div>
</div>

<!-- Request Details -->
${
  showMetadata
    ? `
<div class="info-grid">
    <div class="info-row"><span class="info-label">Time</span> <span class="info-val">${timestamp}</span></div>
    <div class="info-row"><span class="info-label">Device</span> <span class="info-val">${userAgent}</span></div>
    <div class="info-row"><span class="info-label">IP Address</span> <span class="info-val">${ip}</span></div>
    <div class="info-row"><span class="info-label">Location</span> <span class="info-val">${location}</span></div>
    <div class="info-row"><span class="info-label">Ref ID</span> <span class="info-val">${requestId}</span></div>
</div>
`
    : ``
}

<!-- Security Notice -->
<div class="security-box">
    <span class="security-title">Security Notice</span>
    If you did not request this verification, your password may be compromised. Please secure your account immediately or contact support.
</div>

</div>

<!-- Footer -->
<div class="footer">

<div class="footer-links">
    ${supportUrl ? `<a href="${supportUrl}">Support</a>` : ""}
    ${privacyUrl ? `<a href="${privacyUrl}">Privacy</a>` : ""}
    ${securityUrl ? `<a href="${securityUrl}">Security</a>` : ""}
</div>

<p class="legal-text">
© ${new Date().getFullYear()} ${projectName}. All rights reserved.<br />
${companyAddress}
</p>

<p class="legal-text">
${footerText}
</p>

<div class="powered">Powered by AuthSphere</div>

</div>

</div>
</div>

</body>
</html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Verification email sent:", info.messageId);

    const preview = nodemailer.getTestMessageUrl(info);
    if (preview) console.log("🔗 Preview URL:", preview);

    return info;
  } catch (error) {
    console.error("❌ Error sending verification email:", error.message);
    throw error;
  }
};
