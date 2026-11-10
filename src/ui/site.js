import { REGISTRATION_FORMS, CONTACT_EMAIL } from '../config.js';
import { startGlyph } from './glyph.js';

export function initSite() {
  startGlyph();

  const $ = (id) => document.getElementById(id);

  // 1. Registration Links Configuration
  document.querySelectorAll('.form-link').forEach(link => {
    const key = link.dataset.form;
    const url = REGISTRATION_FORMS[key];
    if (url) {
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    } else {
      link.addEventListener('click', event => {
        event.preventDefault();
        alert(`The ${key.replace(/([A-Z])/g,' $1').toLowerCase()} Google Form URL has not been configured in src/config.js.`);
      });
    }
  });

  // 2. Query Submission Form (delivered to ieee@vit.ac.in)
  const form = $('queryForm');
  if (form) {
    form.addEventListener('submit', async event => {
      event.preventDefault();
      const feedback = $('formFeedback');
      const button = $('querySubmit');
      const emailInput = $('queryEmail');
      const messageInput = $('queryMessage');

      const email = emailInput ? emailInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';
      const honeypot = form.querySelector('input[name="website"]')?.value;

      if (honeypot) return; // bot submission ignored

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (feedback) {
          feedback.className = 'form-feedback error';
          feedback.textContent = 'Please enter a valid email address.';
        }
        if (emailInput) emailInput.focus();
        return;
      }

      if (!message || message.length < 8) {
        if (feedback) {
          feedback.className = 'form-feedback error';
          feedback.textContent = 'Please write a query of at least 8 characters.';
        }
        if (messageInput) messageInput.focus();
        return;
      }

      button.disabled = true;
      const originalText = button.innerHTML;
      button.innerHTML = '<span class="btn-text">Sending query…</span> <span class="btn-spinner" aria-hidden="true"></span>';
      if (feedback) {
        feedback.className = 'form-feedback';
        feedback.textContent = 'Sending your query to ieee@vit.ac.in…';
      }

      let sent = false;
      const to = CONTACT_EMAIL;

      // 1) Our own endpoint (Resend) when it is configured on the server
      try {
        const apiRes = await fetch('/api/send-query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, message })
        });
        if (apiRes.ok) sent = true;
      } catch (err) { /* try the next route */ }

      // 2) FormSubmit.co, only counted when it explicitly confirms
      if (!sent) {
        try {
          const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ _subject: `SenseHack '26 query from ${email}`, email, message, _replyto: email, _template: 'table' })
          });
          const data = await res.json().catch(() => ({}));
          if (res.ok && (data.success === 'true' || data.success === true)) sent = true;
        } catch (err) { /* fall through to mailto */ }
      }

      if (sent) {
        if (feedback) {
          feedback.className = 'form-feedback success';
          feedback.textContent = `Query sent to ${to}. Our team will reply by email.`;
        }
        form.reset();
      } else {
        // 3) Always works: open the visitor's mail app with the query pre-filled
        if (feedback) {
          feedback.className = 'form-feedback success';
          feedback.innerHTML = `Opening your email app to send this to <strong>${to}</strong>…`;
        }
        window.location.href = `mailto:${to}?subject=${encodeURIComponent("SenseHack '26 query from " + email)}&body=${encodeURIComponent(message + '\n\nReply to: ' + email)}`;
      }

      button.disabled = false;
      button.innerHTML = originalText;
    });
  }

  // 3. Navigation Link Highlighting via IntersectionObserver
  const navLinks = [...document.querySelectorAll('.links a')];
  const watched = [...document.querySelectorAll('.pg'), document.getElementById('contact'), document.getElementById('top')].filter(Boolean);
  if ('IntersectionObserver' in window && watched.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(a => a.classList.toggle('on', a.getAttribute('href') === `#${entry.target.id}`));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    watched.forEach(el => io.observe(el));
  }
}
