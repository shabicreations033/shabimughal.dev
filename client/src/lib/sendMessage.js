// Contact form delivery without a backend: the form posts straight from the browser to Web3Forms
// (https://web3forms.com), which emails the message to the address the access key was created for.
//
// Setup (2 minutes): enter your email at https://web3forms.com, copy the access key they send you,
// and put it in client/.env as VITE_WEB3FORMS_KEY=... (see .env.example). The key is meant to be public
// (it only lets people send mail *to you*), so it is fine that it ends up in the built site.

const ENDPOINT = 'https://api.web3forms.com/submit';
const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

export async function sendMessage({ name, email, subject, budget, message, botcheck }) {
  // Honeypot: real visitors never fill this hidden field, bots usually do. Pretend it worked.
  if (botcheck) return { success: true };

  if (!ACCESS_KEY) {
    throw new Error('The contact form is not configured yet. Please email me directly instead.');
  }

  let res;
  try {
    res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: ACCESS_KEY,
        subject: `Portfolio: ${subject} (from ${name})`,
        from_name: 'Portfolio contact form',
        name,
        email, // Web3Forms uses this as the reply-to address
        project_type: subject,
        ...(budget ? { budget } : {}),
        message,
      }),
    });
  } catch {
    throw new Error('Could not reach the mail service. Check your connection and try again.');
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Something went wrong. Please try again.');
  }
  return data;
}
