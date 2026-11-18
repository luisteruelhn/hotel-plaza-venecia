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

  // ===== Galería Deslizante estilo Holiday Inn ("La galería que pasa") =====
  const hiTrack = document.getElementById('hi-gallery-track');
  const hiCards = document.querySelectorAll('.hi-gallery__card');
  const hiTabs = document.querySelectorAll('.hi-gallery__tab');
  const hiPrev = document.getElementById('hi-prev');
  const hiNext = document.getElementById('hi-next');
  const hiCounter = document.getElementById('hi-counter');
  const hiProgress = document.getElementById('hi-progress');
  const hiViewport = document.getElementById('hi-gallery-viewport');
  let hiIndex = 0;
  let hiTimer = null;

  const updateHiGallery = (newIdx) => {
    if (!hiTrack || !hiCards.length) return;
    hiIndex = (newIdx + hiCards.length) % hiCards.length;
    hiCards.forEach((c, i) => c.classList.toggle('is-active', i === hiIndex));
    hiTabs.forEach((t, i) => t.classList.toggle('is-active', i === hiIndex));

    const activeCard = hiCards[hiIndex];
    const viewportWidth = hiViewport ? hiViewport.clientWidth : window.innerWidth;
    const cardLeft = activeCard.offsetLeft;
    const cardWidth = activeCard.offsetWidth;
    const offset = cardLeft - (viewportWidth - cardWidth) / 2;
    hiTrack.style.transform = `translate3d(${-offset}px, 0, 0)`;

    if (hiCounter) {
      hiCounter.textContent = `0${hiIndex + 1} / 0${hiCards.length}`;
    }
    if (hiProgress) {
      hiProgress.style.width = `${((hiIndex + 1) / hiCards.length) * 100}%`;
    }
  };

  const startHiAuto = () => {
    stopHiAuto();
    hiTimer = setInterval(() => updateHiGallery(hiIndex + 1), 4500);
  };
  const stopHiAuto = () => {
    if (hiTimer) clearInterval(hiTimer);
  };

  if (hiTrack && hiCards.length) {
    if (hiPrev) hiPrev.addEventListener('click', () => { updateHiGallery(hiIndex - 1); startHiAuto(); });
    if (hiNext) hiNext.addEventListener('click', () => { updateHiGallery(hiIndex + 1); startHiAuto(); });
    hiTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        updateHiGallery(Number(tab.dataset.idx));
        startHiAuto();
      });
    });
    hiCards.forEach((card) => {
      card.addEventListener('click', () => {
        const idx = Number(card.dataset.idx);
        if (idx !== hiIndex) {
          updateHiGallery(idx);
          startHiAuto();
        }
      });
    });
    if (hiViewport) {
      hiViewport.addEventListener('mouseenter', stopHiAuto);
      hiViewport.addEventListener('mouseleave', startHiAuto);
    }
    window.addEventListener('resize', () => updateHiGallery(hiIndex), { passive: true });
    requestAnimationFrame(() => updateHiGallery(0));
    startHiAuto();
  }

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

  // Toggle para mostrar/ocultar Booking Bar de la portada
  const toggleBookingBarBtn = document.getElementById('btn-toggle-booking-bar');
  const heroBookingBar = document.getElementById('hero-booking-bar');
  if (toggleBookingBarBtn && heroBookingBar) {
    toggleBookingBarBtn.addEventListener('click', () => {
      const isOpen = heroBookingBar.classList.toggle('is-open');
      toggleBookingBarBtn.setAttribute('aria-expanded', String(isOpen));
      const icon = toggleBookingBarBtn.querySelector('.booking-toggle-icon');
      if (icon) icon.textContent = isOpen ? '▲' : '▼';
    });
  }

  // Toggle desplegable del formulario de reserva
  const toggleReservaBtn = document.getElementById('btn-toggle-reserva');
  const formWrapper = document.getElementById('form-wrapper');
  if (toggleReservaBtn && formWrapper) {
    toggleReservaBtn.addEventListener('click', () => {
      const isOpen = formWrapper.classList.toggle('is-open');
      toggleReservaBtn.setAttribute('aria-expanded', String(isOpen));
      const textSpan = toggleReservaBtn.querySelector('.btn-toggle-text');
      if (textSpan) {
        textSpan.textContent = isOpen ? 'Ocultar formulario' : 'Llenar solicitud de reserva';
      }
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
