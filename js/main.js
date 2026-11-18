/* Hotel Venecia – interacciones del sitio */
(() => {
  'use strict';
  const WHATSAPP = '50499377949';

  // Navegación: fondo al hacer scroll
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Menú móvil
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  const setMenu = (open) => {
    links.classList.toggle('is-open', open);
    nav.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };
  toggle.addEventListener('click', () => setMenu(!links.classList.contains('is-open')));
  links.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });

  // Mostrar elementos sin repetir animaciones de entrada al hacer scroll
  document.querySelectorAll('.reveal').forEach((el) => {
    el.classList.add('is-visible');
  });

  // ===== Carrusel Hero estilo Hotel (IHG / Holiday Inn) =====
  const slides = document.querySelectorAll('.hero__slide');
  const dots = document.querySelectorAll('.hero__dot');
  const btnPrev = document.getElementById('hero-prev');
  const btnNext = document.getElementById('hero-next');
  let currentSlide = 0;
  let slideTimer = null;

  const showSlide = (idx) => {
    if (!slides.length) return;
    slides.forEach((s) => s.classList.remove('is-active'));
    dots.forEach((d) => d.classList.remove('is-active'));
    currentSlide = (idx + slides.length) % slides.length;
    slides[currentSlide].classList.add('is-active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('is-active');
  };

  const nextSlide = () => showSlide(currentSlide + 1);
  const prevSlide = () => showSlide(currentSlide - 1);

  const startAutoSlide = () => {
    stopAutoSlide();
    slideTimer = setInterval(nextSlide, 5500);
  };
  const stopAutoSlide = () => {
    if (slideTimer) clearInterval(slideTimer);
  };

  if (btnNext && btnPrev) {
    btnNext.addEventListener('click', () => { nextSlide(); startAutoSlide(); });
    btnPrev.addEventListener('click', () => { prevSlide(); startAutoSlide(); });
  }

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const target = Number(dot.dataset.slide);
      showSlide(target);
      startAutoSlide();
    });
  });

  const heroEl = document.getElementById('inicio');
  if (heroEl) {
    heroEl.addEventListener('mouseenter', stopAutoSlide);
    heroEl.addEventListener('mouseleave', startAutoSlide);
  }
  startAutoSlide();

  // ===== Booking Bar rápida =====
  const bbHabitacion = document.getElementById('bb-habitacion');
  const bbLlegada = document.getElementById('bb-llegada');
  const bbSalida = document.getElementById('bb-salida');
  const bbBtn = document.getElementById('bb-consultar');
  const hoyStr = new Date().toISOString().split('T')[0];

  if (bbLlegada && bbSalida && bbBtn) {
    bbLlegada.min = hoyStr;
    bbSalida.min = hoyStr;
    bbLlegada.addEventListener('change', () => {
      bbSalida.min = bbLlegada.value || hoyStr;
    });

    bbBtn.addEventListener('click', () => {
      const hab = bbHabitacion ? bbHabitacion.value : 'Sencilla';
      const fIn = bbLlegada.value || 'Por coordinar';
      const fOut = bbSalida.value || 'Por coordinar';
      const msg = `Hola Hotel Plaza Venecia, quisiera consultar disponibilidad y tarifa:\n• Habitación: ${hab}\n• Llegada: ${fIn}\n• Salida: ${fOut}`;
      window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
    });
  }

  // Formulario de reserva -> WhatsApp (sin servidor)
  const form = document.getElementById('form-reserva');
  const msg = document.getElementById('f-msg');
  const llegada = document.getElementById('f-llegada');
  const salida = document.getElementById('f-salida');
  const hoy = new Date().toISOString().split('T')[0];
  llegada.min = hoy; salida.min = hoy;
  llegada.addEventListener('change', () => { salida.min = llegada.value || hoy; });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = (id) => document.getElementById(id).value.trim();
    const nombre = val('f-nombre');
    if (!nombre || !llegada.value || !salida.value) { msg.textContent = 'Por favor completa nombre y fechas.'; return; }
    if (salida.value <= llegada.value) { msg.textContent = 'La fecha de salida debe ser posterior a la llegada.'; return; }
    msg.textContent = '';
    const texto = [
      'Hola Hotel Venecia, quisiera reservar:',
      `• Nombre: ${nombre}`,
      `• Llegada: ${llegada.value}`,
      `• Salida: ${salida.value}`,
      `• Habitación: ${val('f-habitacion')}`,
      `• Personas: ${val('f-personas')}`,
      val('f-comentarios') ? `• Comentarios: ${val('f-comentarios')}` : ''
    ].filter(Boolean).join('\n');
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`, '_blank', 'noopener');
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
