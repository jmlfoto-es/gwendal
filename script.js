const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');
const sections = document.querySelectorAll('main section[id]');
const revealItems = document.querySelectorAll('.reveal');
const yearNode = document.getElementById('year');
const heroImage = document.querySelector('.hero-media img');

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    siteNav.classList.toggle('is-open');
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealItems.forEach((item) => revealObserver.observe(item));

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const id = entry.target.getAttribute('id');
    const link = document.querySelector(`.site-nav a[href="#${id}"]`);
    if (entry.isIntersecting && link) {
      navLinks.forEach((navLink) => navLink.classList.remove('is-active'));
      link.classList.add('is-active');
    }
  });
}, { threshold: 0.55 });

sections.forEach((section) => sectionObserver.observe(section));

window.addEventListener('scroll', () => {
  if (!heroImage || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const shift = Math.min(window.scrollY * 0.06, 28);
  heroImage.style.transform = `scale(1.04) translateY(${shift}px)`;
}, { passive: true });

function validateRequired(form) {
  let ok = true;
  const requiredFields = form.querySelectorAll('[required]');

  requiredFields.forEach((field) => {
    const valid = field.checkValidity();
    field.classList.toggle('is-invalid', !valid);
    if (!valid) ok = false;
  });

  return ok;
}

function openMailto({ to, subject, body }) {
  const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailto;
}

const launchForm = document.getElementById('launch-form');
const launchFeedback = document.getElementById('form-feedback');

if (launchForm) {
  launchForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!validateRequired(launchForm)) {
      launchFeedback.textContent = 'Revisa los campos obligatorios antes de continuar.';
      return;
    }

    const data = new FormData(launchForm);
    const body = [
      'Solicitud de aviso de lanzamiento del libro de Gwendal',
      '',
      `Nombre: ${data.get('nombre') || ''}`,
      `Email: ${data.get('email') || ''}`,
      `País: ${data.get('pais') || ''}`,
      `Interés: ${data.get('interes') || ''}`,
      '',
      'Enviado desde gwendal.org'
    ].join('\n');

    launchFeedback.textContent = 'Abriendo tu cliente de correo para enviar la solicitud.';
    openMailto({
      to: 'info@gwendal.org',
      subject: 'Aviso lanzamiento libro Gwendal',
      body
    });
  });
}

const contactForm = document.getElementById('contact-form');
const contactFeedback = document.getElementById('contact-feedback');

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!validateRequired(contactForm)) {
      contactFeedback.textContent = 'Faltan datos obligatorios para redactar el correo.';
      return;
    }

    const data = new FormData(contactForm);
    const body = [
      `Nombre: ${data.get('contact-name') || ''}`,
      `Correo: ${data.get('contact-email') || ''}`,
      '',
      'Mensaje:',
      `${data.get('contact-message') || ''}`,
      '',
      'Enviado desde el formulario estático de gwendal.org'
    ].join('\n');

    contactFeedback.textContent = 'Abriendo tu cliente de correo.';
    openMailto({
      to: 'info@gwendal.org',
      subject: 'Contacto desde gwendal.org',
      body
    });
  });
}
