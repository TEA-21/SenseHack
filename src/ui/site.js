import { REGISTRATION_FORMS, CONTACT_EMAIL } from '../config.js';
import { startGlyph } from './glyph.js';

export function initSite() {
  startGlyph();
  initScheduleTabs();

  const $ = (id) => document.getElementById(id);

  const announcement = $('announcementDialog');
  const announcementClose = $('announcementClose');
  if (announcement) {
    if (typeof announcement.showModal === 'function') announcement.showModal();
    else announcement.setAttribute('open', '');
    announcementClose?.addEventListener('click', () => {
      if (typeof announcement.close === 'function') announcement.close();
      else announcement.removeAttribute('open');
    });
  }

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
        if (apiRes.ok) {
          sent = true;
        } else if (apiRes.status === 400 || apiRes.status === 429) {
          const errData = await apiRes.json().catch(() => ({}));
          if (feedback) {
            feedback.className = 'form-feedback error';
            feedback.textContent = errData.error || 'Please check your query.';
          }
          button.disabled = false;
          button.innerHTML = originalText;
          return;
        }
      } catch (err) { /* fall through to mailto */ }

      if (sent) {
        if (feedback) {
          feedback.className = 'form-feedback success';
          feedback.textContent = `Query sent to ${to}. Our team will reply by email.`;
        }
        form.reset();
      } else {
        // 2) Always works: open the visitor's mail app with the query pre-filled
        if (feedback) {
          feedback.className = 'form-feedback success';
          feedback.textContent = `Opening your email app to send this to ${to}…`;
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

function initScheduleTabs() {
  const tabs = Array.from(document.querySelectorAll('.sched-tab'));
  if (!tabs.length) return;

  function selectTab(tabToSelect) {
    tabs.forEach(tab => {
      const isSelected = tab === tabToSelect;
      tab.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      tab.setAttribute('tabindex', isSelected ? '0' : '-1');

      const panelId = tab.getAttribute('aria-controls');
      const panel = panelId ? document.getElementById(panelId) : null;
      if (panel) {
        if (isSelected) {
          panel.removeAttribute('hidden');
        } else {
          panel.setAttribute('hidden', '');
        }
      }
    });
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      selectTab(tab);
    });

    tab.addEventListener('keydown', (event) => {
      let targetIndex = null;
      if (event.key === 'ArrowRight') {
        targetIndex = (index + 1) % tabs.length;
      } else if (event.key === 'ArrowLeft') {
        targetIndex = (index - 1 + tabs.length) % tabs.length;
      } else if (event.key === 'Home') {
        targetIndex = 0;
      } else if (event.key === 'End') {
        targetIndex = tabs.length - 1;
      }

      if (targetIndex !== null) {
        event.preventDefault();
        const nextTab = tabs[targetIndex];
        selectTab(nextTab);
        nextTab.focus();
      }
    });
  });
}
