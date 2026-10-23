import { useEffect, useState } from 'react';
import Reveal from '../components/Reveal';
import Mask from '../components/Mask';
import SocialIcons from '../components/SocialIcons';
import CustomSelect from '../components/CustomSelect';
import SmoothInput from '../components/SmoothInput';
import profile from '../data/profile';
import ResumeButton from '../components/ResumeButton';
import { sendMessage } from '../lib/sendMessage';

const initialForm = { name: '', email: '', subject: '', budget: '', budgetCustom: '', message: '', botcheck: '' };

const SUBJECT_OPTIONS = ['Job Opportunity', 'Freelance / Contract Project', 'Collaboration', 'General Inquiry'];
const BUDGET_OPTIONS = ['Not applicable', 'Under $1,000', '$1,000 – $5,000', '$5,000 – $10,000', '$10,000+', 'Other (specify)'];

// Only this subject shows the Budget field.
const FREELANCE = 'Freelance / Contract Project';

// Live local time in the owner's timezone, so visitors can see when to expect a reply.
function LocalTime() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);
  const time = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: profile.timezone.iana,
  }).format(now);
  return <span className="contact-time">Local time now: {time}</span>;
}

// True only if the file exists and is really a PDF. Single-page-app servers answer
// "200 + index.html" for missing files, so the content type has to be checked too.
function useFileExists(url) {
  const [exists, setExists] = useState(false);
  useEffect(() => {
    if (!url) return undefined;
    let cancelled = false;
    fetch(url, { method: 'HEAD' })
      .then((res) => {
        const type = res.headers.get('content-type') || '';
        if (!cancelled) setExists(res.ok && type.includes('pdf'));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [url]);
  return exists;
}

const MIN_LOADING_MS = 2000; // how long the button shows its progress bar before turning into "Sent"

export default function Contact() {
  const hasResume = useFileExists(profile.resume);
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => {
      const next = { ...f, [name]: value };
      // Budget only applies to freelance work, so drop it if the subject changes.
      if (name === 'subject' && value !== FREELANCE) {
        next.budget = '';
        next.budgetCustom = '';
      }
      return next;
    });
    if (status !== 'sending') setStatus((s) => (s === 'success' ? 'idle' : s));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg('');

    // Subject is required, but it's a custom dropdown now (not a native
    // <select>), so the browser's built-in "required" enforcement doesn't
    // apply here — check it manually before sending.
    if (!form.subject) {
      setStatus('error');
      setErrorMsg('Please select a subject / project type.');
      return;
    }

    setStatus('sending');
    try {
      // Keep the loading state on screen for at least 2 seconds so the progress bar and the
      // "Sent" check always read as a deliberate sequence, even when the server answers instantly.
      const minWait = new Promise((resolve) => setTimeout(resolve, MIN_LOADING_MS));
      const payload = {
        ...form,
        budget: form.subject !== FREELANCE ? '' : form.budget === 'Other (specify)' ? form.budgetCustom : form.budget,
      };
      delete payload.budgetCustom;
      await Promise.all([sendMessage(payload), minWait]);
      setStatus('success');
      setForm(initialForm);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    }
  }

  const btnState = status === 'sending' ? 'loading' : status === 'success' ? 'success' : 'default';

  return (
    <>
      <section className="wrap" style={{ paddingBottom: 0 }}>
        <Reveal as="p" className="eyebrow-plain">
          Contact
        </Reveal>
        <Reveal
          as="h1"
          className="page-title"
          style={{ maxWidth: '16ch' }}
        >
          <Mask>Let's talk about the opportunity.</Mask>
        </Reveal>
        <Reveal as="p" style={{ color: 'var(--ink-soft)', fontSize: '16px', maxWidth: '56ch', margin: 0 }}>
          Fill out the form or reach out directly — I typically reply within a couple of days.
        </Reveal>
      </section>

      <section className="wrap contact-grid">
        <Reveal as="div" className="contact-info">
          <dl>
            <div>
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${profile.email}?subject=${encodeURIComponent('Portfolio enquiry')}`}>{profile.email}</a>
              </dd>
            </div>
            {profile.whatsapp && (
              <div>
                <dt>WhatsApp</dt>
                <dd>
                  <a
                    href={`${profile.whatsapp}?text=${encodeURIComponent(profile.whatsappMessage || '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Chat on WhatsApp →
                  </a>
                </dd>
              </div>
            )}
            <div>
              <dt>Location</dt>
              <dd>
                {profile.location}
                <span className="contact-tz">{profile.timezone.label}</span>
                <LocalTime />
              </dd>
            </div>
          </dl>
          <SocialIcons variant="text" />
          {hasResume && <ResumeButton />}
        </Reveal>

        <Reveal as="form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="name">Name</label>
            <SmoothInput id="name" name="name" type="text" autoComplete="name" placeholder="Your name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <SmoothInput id="email" name="email" type="text" inputMode="email" autoComplete="email" autoCapitalize="off" spellCheck={false} pattern="[^\s@]+@[^\s@]+\.[^\s@]+" title="Please enter a valid email address" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="field">
            <label htmlFor="subject">Subject / Project Type</label>
            <CustomSelect
              name="subject"
              value={form.subject}
              onChange={handleChange}
              options={SUBJECT_OPTIONS}
              placeholder="Select one"
            />
          </div>
          {form.subject === FREELANCE && (
            <div className="field-reveal">
              <div className="field">
                <label htmlFor="budget">Budget</label>
                <CustomSelect
                  name="budget"
                  value={form.budget}
                  onChange={handleChange}
                  options={BUDGET_OPTIONS}
                  placeholder="Select budget (optional)"
                />
              </div>
              {form.budget === 'Other (specify)' && (
                <div className="field">
                  <label htmlFor="budgetCustom">Your budget</label>
                  <SmoothInput
                    id="budgetCustom"
                    name="budgetCustom"
                    type="text"
                    placeholder="e.g. $2,500 or negotiable"
                    value={form.budgetCustom}
                    onChange={handleChange}
                  />
                </div>
              )}
            </div>
          )}
          <div className="field">
            <label htmlFor="message">Message</label>
            <SmoothInput as="textarea" id="message" name="message" rows="5" placeholder="Tell me about the role or project" value={form.message} onChange={handleChange} required />
          </div>
          {/* Honeypot for bots: hidden from people, and sendMessage() drops submissions that fill it. */}
          <input type="text" name="botcheck" value={form.botcheck} onChange={handleChange} tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />
          {/* Three stacked layers cross-fade (default / loading / success); the button keeps one fixed size. */}
          <button
            type="submit"
            className={`submit-btn is-${btnState}`}
            disabled={btnState !== 'default'}
            aria-busy={btnState === 'loading'}
          >
            <span className="btn-layer btn-layer--default" aria-hidden={btnState !== 'default'}>
              Send message →
            </span>
            <span className="btn-layer btn-layer--loading" aria-hidden={btnState !== 'loading'}>
              <span className="btn-progress" aria-hidden="true" />
              <span className="btn-sr">Sending</span>
            </span>
            <span className="btn-layer btn-layer--success" aria-hidden={btnState !== 'success'}>
              <svg className="btn-check" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12.5l4.5 4.5L19 7.5" pathLength="1" />
              </svg>
              Sent
            </span>
          </button>

          {status === 'success' && (
            <div className="form-success" role="status">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="m8 12.5 2.8 2.8L16 9.8" />
              </svg>
              <div>
                <strong>Message sent</strong>
                <p>Thanks for reaching out. I'll get back to you soon.</p>
              </div>
            </div>
          )}
          {status === 'error' && (
            <p className="form-status error" role="alert">
              {errorMsg}
            </p>
          )}
        </Reveal>
      </section>
    </>
  );
}
