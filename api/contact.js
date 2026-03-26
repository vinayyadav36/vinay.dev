// Vercel serverless function for contact form
// Integrates with EmailJS to send emails

const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID || 'service_fghmrqa';
const EMAILJS_ADMIN_TEMPLATE_ID = process.env.EMAILJS_ADMIN_TEMPLATE_ID || 'template_xoqcp7u';
const EMAILJS_REVIEW_TEMPLATE_ID = process.env.EMAILJS_REVIEW_TEMPLATE_ID || 'template_xoqcp7u';
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY || 'Lx0uSEcq4DOKnEEil';

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sanitize(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[<>&"']/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' }[c]));
}

async function sendEmail(templateId, templateParams) {
  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE_ID,
        template_id: templateId,
        user_id: EMAILJS_PUBLIC_KEY,
        template_params: templateParams
      })
    });
    return response.ok;
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { name, email, message } = req.body || {};

  // Validation
  const errors = [];
  if (!name || name.trim().length < 2) errors.push('Name must be at least 2 characters');
  if (!email || !validateEmail(email.trim())) errors.push('Valid email address is required');
  if (!message || message.trim().length < 10) errors.push('Message must be at least 10 characters');
  if (message && message.trim().length > 1000) errors.push('Message must not exceed 1000 characters');

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors.join('. '), errors });
  }

  const cleanName = sanitize(name.trim());
  const cleanEmail = email.trim().toLowerCase();
  const cleanMessage = sanitize(message.trim());

  // Send notification email to admin
  await sendEmail(EMAILJS_ADMIN_TEMPLATE_ID, {
    from_name: cleanName,
    from_email: cleanEmail,
    message: cleanMessage
  });

  // Send review request immediately (non-blocking in promise chain)
  sendEmail(EMAILJS_REVIEW_TEMPLATE_ID, {
    to_name: cleanName,
    to_email: cleanEmail
  }).catch(() => {/* non-critical */});

  return res.status(200).json({
    success: true,
    message: "Message received successfully! I'll get back to you soon."
  });
}
