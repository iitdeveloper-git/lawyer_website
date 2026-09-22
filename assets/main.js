(() => {
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  menu?.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    nav.classList.toggle('open', open);
  });
  nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menu?.setAttribute('aria-expanded', 'false');
  }));

  const acknowledgement = document.getElementById('ack');
  let acknowledged = false;
  try { acknowledged = localStorage.getItem('rkp_ack_v1') === 'yes'; } catch { /* Browsing can continue without storage. */ }
  if (acknowledgement && !acknowledged) {
    acknowledgement.hidden = false;
    document.body.style.overflow = 'hidden';
    document.getElementById('ack-accept')?.focus();
  }
  acknowledgement?.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    const focusable = [...acknowledgement.querySelectorAll('a, button')];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  document.getElementById('ack-accept')?.addEventListener('click', () => {
    try { localStorage.setItem('rkp_ack_v1', 'yes'); } catch { /* Session-only acknowledgement. */ }
    acknowledgement.hidden = true;
    document.body.style.overflow = '';
  });

  const form = document.getElementById('contact-form');
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const lines = [
      'Professional enquiry for Rakesh Puri & Associates',
      `Name: ${String(data.get('name') || '').trim()}`,
      `Phone: ${String(data.get('phone') || '').trim()}`,
      `Matter category: ${String(data.get('category') || '').trim()}`,
      `Message: ${String(data.get('message') || '').trim()}`,
    ];
    const email = String(data.get('email') || '').trim();
    if (email) lines.splice(3, 0, `Email: ${email}`);
    const url = `https://wa.me/919414432758?text=${encodeURIComponent(lines.join('\n'))}`;
    document.getElementById('form-status').textContent = 'Opening WhatsApp. Review your message there before sending.';
    window.location.assign(url);
  });
})();
