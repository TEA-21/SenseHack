import { REGISTRATION_FORMS } from '../config.js';

// Registration links are configured in src/config.js, never guessed.
document.querySelectorAll('.form-link').forEach(link => {
  const key = link.dataset.form;
  const url = REGISTRATION_FORMS[key];
  if (url) { link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer'; }
  else link.addEventListener('click', event => {
    event.preventDefault();
    alert(`The ${key.replace(/([A-Z])/g,' $1').toLowerCase()} Google Form URL has not been added yet. Add it in src/config.js before publishing.`);
  });
});

// Only one FAQ is expanded at a time for a tidy accordion.
document.querySelectorAll('.faq-list details').forEach(detail => {
  detail.addEventListener('toggle', () => {
    if (detail.open) document.querySelectorAll('.faq-list details').forEach(other => { if (other !== detail) other.open = false; });
  });
});

// Close the mobile menu after a navigation choice.
document.querySelectorAll('.menu a[href^="#"]').forEach(link => link.addEventListener('click', () => {
  $('menu').hidden = true; $('menuBtn').setAttribute('aria-expanded','false'); $('menuBtn').textContent = 'Menu'; document.body.style.overflow = '';
}));

const form = $('queryForm');
form.addEventListener('submit', async event => {
  event.preventDefault();
  const feedback = $('formFeedback');
  const button = $('querySubmit');
  const payload = Object.fromEntries(new FormData(form).entries());
  if (!payload.email || !payload.message) return;
  button.disabled = true; button.textContent = 'Sending…'; feedback.className = 'form-feedback'; feedback.textContent = 'Sending your message securely…';
  try {
    const response = await fetch('/api/send-query', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || 'The message could not be sent.');
    feedback.className = 'form-feedback success'; feedback.textContent = 'Thanks — your query has been sent to ieee@vit.ac.in.'; form.reset();
  } catch (error) {
    feedback.className = 'form-feedback error';
    feedback.textContent = `${error.message} If this continues, email ieee@vit.ac.in directly.`;
  } finally { button.disabled = false; button.textContent = 'Send query ↗'; }
});
