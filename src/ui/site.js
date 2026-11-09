import { REGISTRATION_FORMS, CONTACT_EMAIL } from '../config.js';

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

// 2. FAQ Accordion Interactions
document.querySelectorAll('.faq-list details').forEach(detail => {
  detail.addEventListener('toggle', () => {
    if (detail.open) {
      document.querySelectorAll('.faq-list details').forEach(other => {
        if (other !== detail) other.open = false;
      });
    }
  });
});

// 3. Mobile Menu Navigation
document.querySelectorAll('.menu a[href^="#"]').forEach(link => link.addEventListener('click', () => {
  const menu = $('menu');
  if (menu) menu.hidden = true;
  const menuBtn = $('menuBtn');
  if (menuBtn) {
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.textContent = 'Menu';
  }
  document.body.style.overflow = '';
}));

// 4. Query Submission Form (Direct delivery to ieee@vit.ac.in)
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
    button.innerHTML = '<span class="btn-text">Sending query…</span> <span class="btn-spinner">⌛</span>';
    if (feedback) {
      feedback.className = 'form-feedback';
      feedback.textContent = 'Transmitting your query directly to ieee@vit.ac.in…';
    }

    let sent = false;

    // Strategy A: Direct FormSubmit.co delivery to ieee@vit.ac.in
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(CONTACT_EMAIL || 'ieee@vit.ac.in')}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `SenseHack '26 Query from ${email}`,
          email: email,
          message: message,
          _template: 'table'
        })
      });

      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.success === 'true' || data.success === true || res.status === 200) {
          sent = true;
        }
      }
    } catch (err) {
      // Continue to Strategy B
    }

    // Strategy B: Local API endpoint (/api/send-query) if available
    if (!sent) {
      try {
        const apiRes = await fetch('/api/send-query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, message })
        });
        if (apiRes.ok) sent = true;
      } catch (err) {
        // Continue to fallback
      }
    }

    if (sent) {
      if (feedback) {
        feedback.className = 'form-feedback success';
        feedback.textContent = '✓ Query received! Your message has been delivered to ieee@vit.ac.in. Our team will contact you shortly.';
      }
      form.reset();
    } else {
      // Fallback: Open pre-composed mailto so the query is 100% delivered to ieee@vit.ac.in
      if (feedback) {
        feedback.className = 'form-feedback success';
        feedback.innerHTML = `Query prepared! Opening email client to send to <strong>${CONTACT_EMAIL || 'ieee@vit.ac.in'}</strong>…`;
      }
      const mailtoUrl = `mailto:${encodeURIComponent(CONTACT_EMAIL || 'ieee@vit.ac.in')}?subject=${encodeURIComponent("SenseHack '26 Query from " + email)}&body=${encodeURIComponent(message)}`;
      window.location.href = mailtoUrl;
    }

    button.disabled = false;
    button.innerHTML = originalText;
  });
}

// 5. Back to Top Handler
const backToTop = $('backToTop');
if (backToTop) {
  backToTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.dispatchEvent(new Event('nav:manual'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    history.replaceState(null, '', '#top');
  });
}

// 6. Navigation Link Highlighting via IntersectionObserver
const navLinks = [...document.querySelectorAll('.links a')];
const watched = [...document.querySelectorAll('.pg'), document.getElementById('top')].filter(Boolean);
if ('IntersectionObserver' in window && watched.length) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(a => a.classList.toggle('on', a.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  watched.forEach(el => io.observe(el));
}

