/* Hotel Venecia – interacciones del sitio */
(() => {
  'use strict';
  const WHATSAPP = '50499377949';

  // Saludo dinámico según la hora oficial de Honduras (America/Tegucigalpa)
  const getSaludoHonduras = () => {
    try {
      const horaStr = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Tegucigalpa',
        hour: 'numeric',
        hour12: false
      }).format(new Date());
      const hora = parseInt(horaStr, 10);
      if (hora >= 5 && hora < 12) return 'Buenos días';
      if (hora >= 12 && hora < 18) return 'Buenas tardes';
      return 'Buenas noches';
    } catch {
      return 'Hola';
    }
  };

  // Botón flotante de WhatsApp y tarjetas de habitaciones con saludo según horario de Honduras
  const waFloat = document.getElementById('wa-float');
  if (waFloat) {
    waFloat.addEventListener('click', (e) => {
      e.preventDefault();
      const msg = `${getSaludoHonduras()}, les escribo desde la página web del Hotel Plaza Venecia para hacer una consulta.`;
      window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
    });
  }

  // Enlaces directos a WhatsApp de los teléfonos de contacto (9937-7949 y 9615-2657)
  document.querySelectorAll('a[href="https://wa.me/50499377949"]:not(#wa-float):not(#lightbox-wa), a[href="https://wa.me/50496152657"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const msg = `${getSaludoHonduras()}, les escribo desde la página web del Hotel Plaza Venecia para solicitar información sobre habitaciones, disponibilidad y servicios.`;
      window.open(`${link.href}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
    });
  });

  // Ampliar fotografía al hacer clic en las tarjetas de habitaciones (Lightbox)
  const lightbox = document.getElementById('room-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxWa = document.getElementById('lightbox-wa');
  const lightboxClose = document.getElementById('lightbox-close');

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.hidden = true;
    document.body.style.overflow = '';
  };

  if (lightbox) {
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !lightbox.hidden) closeLightbox();
    });
  }

  document.querySelectorAll('#habitaciones a.room').forEach((card) => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const roomName = card.querySelector('h3')?.textContent?.trim() || 'Habitación';
      const bg = card.querySelector('.room__img')?.style.backgroundImage || '';
      const urlMatch = bg.match(/url\(['"]?([^'"]+)['"]?\)/i);
      const imgUrl = urlMatch ? urlMatch[1] : '';
      const msg = `${getSaludoHonduras()}, les escribo desde la página web del Hotel Venecia para consultar disponibilidad de habitación ${roomName}.`;

      if (lightbox && lightboxImg && imgUrl) {
        lightboxImg.src = imgUrl;
        lightboxImg.alt = `Habitación ${roomName} - Hotel Venecia`;
        if (lightboxTitle) lightboxTitle.textContent = `Habitación ${roomName}`;
        if (lightboxWa) lightboxWa.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
        lightbox.hidden = false;
        document.body.style.overflow = 'hidden';
      } else {
        window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
      }
    });
  });

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
  links.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    setMenu(false);
    if (!a.classList.contains('btn')) {
      links.querySelectorAll('a:not(.btn)').forEach((el) => el.classList.remove('is-active'));
      a.classList.add('is-active');
    }
  });

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

  const stopAutoSlide = () => {
    if (slideTimer) {
      clearTimeout(slideTimer);
      slideTimer = null;
    }
  };
  const startAutoSlide = () => {
    stopAutoSlide();
    const delay = currentSlide === 0 ? 60000 : 5000;
    slideTimer = setTimeout(() => {
      nextSlide();
      startAutoSlide();
    }, delay);
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
      let touchStartX = 0;
      hiViewport.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopHiAuto();
      }, { passive: true });
      hiViewport.addEventListener('touchend', (e) => {
        const diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 40) {
          updateHiGallery(diff > 0 ? hiIndex + 1 : hiIndex - 1);
        }
        startHiAuto();
      }, { passive: true });
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
    const syncDatePlaceholder = (inp) => inp.classList.toggle('date-empty', !inp.value);
    syncDatePlaceholder(bbLlegada);
    syncDatePlaceholder(bbSalida);
    bbLlegada.addEventListener('change', () => {
      bbSalida.min = bbLlegada.value || hoyStr;
      syncDatePlaceholder(bbLlegada);
    });
    bbSalida.addEventListener('change', () => syncDatePlaceholder(bbSalida));

    bbBtn.addEventListener('click', () => {
      const hab = (bbHabitacion && bbHabitacion.value) ? bbHabitacion.value : 'Por definir';
      const fIn = bbLlegada.value || 'Por coordinar';
      const fOut = bbSalida.value || 'Por coordinar';
      const msg = `${getSaludoHonduras()}, les escribo desde la página web del Hotel Plaza Venecia para consultar disponibilidad y tarifa:\n• Habitación: ${hab}\n• Llegada: ${fIn}\n• Salida: ${fOut}`;
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

  // ===== Enfoque automático en "Nombre completo" al pulsar Consultar disponibilidad / Reservar =====
  const focusNombreReserva = (e) => {
    const targetSection = document.getElementById('contacto');
    const formWrap = document.getElementById('form-wrapper');
    const toggleReserva = document.getElementById('btn-toggle-reserva');
    const inputNombre = document.getElementById('f-nombre');
    if (!targetSection || !inputNombre) return;
    e.preventDefault();

    if (formWrap && !formWrap.classList.contains('is-open')) {
      formWrap.classList.add('is-open');
      if (toggleReserva) toggleReserva.setAttribute('aria-expanded', 'true');
    }

    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => {
      inputNombre.focus({ preventScroll: true });
    }, 520);
  };

  document.querySelectorAll('#btn-rooms-consultar, .btn--nav-cta').forEach((el) => {
    el.addEventListener('click', focusNombreReserva);
  });

  // ===== Subformulario de Tarifas Corporativas =====
  const btnCorporate = document.getElementById('btn-corporate-wa');
  const corporateWrap = document.getElementById('corporate-form-wrap');
  const formCorporate = document.getElementById('form-corporate');
  const corpMsg = document.getElementById('corp-msg');

  if (btnCorporate && corporateWrap) {
    btnCorporate.addEventListener('click', () => {
      const isOpen = corporateWrap.classList.toggle('is-open');
      btnCorporate.setAttribute('aria-expanded', String(isOpen));
      const icon = document.getElementById('btn-corporate-icon');
      const txt = document.getElementById('btn-corporate-text');
      if (icon) icon.textContent = isOpen ? '▲' : '▼';
      if (txt) txt.textContent = isOpen ? 'Ocultar consulta corporativa' : 'Consultar tarifas corporativas';
      if (isOpen) {
        const empresaInput = document.getElementById('corp-empresa');
        if (empresaInput) setTimeout(() => empresaInput.focus(), 180);
      }
    });
  }

  if (formCorporate) {
    formCorporate.addEventListener('submit', (e) => {
      e.preventDefault();
      const empresa = (document.getElementById('corp-empresa')?.value || '').trim();
      const persona = (document.getElementById('corp-persona')?.value || '').trim();
      if (!empresa || !persona) {
        if (corpMsg) corpMsg.textContent = 'Por favor indica la empresa/institución y la persona que contacta.';
        return;
      }
      if (corpMsg) corpMsg.textContent = '';

      const texto = [
        `${getSaludoHonduras()}, les escribo desde la página web del Hotel Plaza Venecia para consultar tarifas corporativas y convenios:`,
        `• Empresa / Organización / Institución: ${empresa}`,
        `• Persona que contacta: ${persona}`
      ].join('\n');

      window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`, '_blank', 'noopener');
    });
  }

  // Toggle desplegable y envío del mini formulario de Eventos
  const btnEventos = document.getElementById('btn-eventos');
  const eventoWrap = document.getElementById('evento-form-wrap');
  const formEvento = document.getElementById('form-evento');
  const evTipo = document.getElementById('ev-tipo');
  const evOtroWrap = document.getElementById('ev-otro-wrap');
  const evOtro = document.getElementById('ev-otro');
  const evFecha = document.getElementById('ev-fecha');
  const evMsg = document.getElementById('ev-msg');

  if (evFecha) evFecha.min = hoyStr;

  if (btnEventos && eventoWrap) {
    btnEventos.addEventListener('click', () => {
      const isOpen = eventoWrap.classList.toggle('is-open');
      btnEventos.setAttribute('aria-expanded', String(isOpen));
      const icon = document.getElementById('btn-eventos-icon');
      const txt = document.getElementById('btn-eventos-text');
      if (icon) icon.textContent = isOpen ? '▲' : '→';
      if (txt) txt.textContent = isOpen ? 'Ocultar cotizador' : 'Cotizar mi evento';
    });
  }

  // ===== Galería Interactiva de Salones (Eventos) =====
  const evGalImg = document.getElementById('ev-gallery-img');
  const evGalThumbs = document.querySelectorAll('.events-gallery__thumb');
  const evGalDots = document.querySelectorAll('.events-gallery__dot');
  const evGalPrev = document.getElementById('ev-gal-prev');
  const evGalNext = document.getElementById('ev-gal-next');
  const evSlides = [
    { src: 'assets/img/salon.jpg?v=20261120c', alt: 'Salón para capacitaciones y eventos con proyector en Hotel Plaza Venecia' },
    { src: 'assets/img/salon-banquete.jpg?v=20261120c', alt: 'Salón montaje banquete con alfombra roja en Hotel Plaza Venecia' },
    { src: 'assets/img/salon-ejecutivo.jpg?v=20261120c', alt: 'Salón ejecutivo con mesa de directorio en Hotel Plaza Venecia' }
  ];
  let evIndex = 0;

  const setEventsSlide = (newIdx) => {
    if (!evGalImg) return;
    evIndex = (newIdx + evSlides.length) % evSlides.length;
    evGalImg.src = evSlides[evIndex].src;
    evGalImg.alt = evSlides[evIndex].alt;

    const otherIndices = [0, 1, 2].filter((i) => i !== evIndex);
    evGalThumbs.forEach((btn, pos) => {
      const targetIdx = otherIndices[pos];
      if (targetIdx === undefined) return;
      btn.dataset.idx = String(targetIdx);
      const imgEl = btn.querySelector('img');
      if (imgEl) {
        imgEl.src = evSlides[targetIdx].src;
        imgEl.alt = evSlides[targetIdx].alt;
      }
    });

    evGalDots.forEach((dot, i) => dot.classList.toggle('is-active', i === evIndex));
  };

  if (evGalImg) {
    if (evGalPrev) evGalPrev.addEventListener('click', () => setEventsSlide(evIndex - 1));
    if (evGalNext) evGalNext.addEventListener('click', () => setEventsSlide(evIndex + 1));
    evGalThumbs.forEach((btn) => {
      btn.addEventListener('click', () => setEventsSlide(Number(btn.dataset.idx)));
    });
    evGalDots.forEach((dot) => {
      dot.addEventListener('click', () => setEventsSlide(Number(dot.dataset.idx)));
    });
  }

  if (evTipo && evOtroWrap && evOtro) {
    evTipo.addEventListener('change', () => {
      const isOtro = evTipo.value === 'Otro';
      evOtroWrap.hidden = !isOtro;
      evOtro.required = isOtro;
      if (isOtro) evOtro.focus();
    });
  }

  if (formEvento) {
    formEvento.addEventListener('submit', (e) => {
      e.preventDefault();
      const nombre = document.getElementById('ev-nombre')?.value.trim();
      const tipo = evTipo ? evTipo.value : 'Evento';
      const detalleOtro = evOtro ? evOtro.value.trim() : '';
      const personas = document.getElementById('ev-personas')?.value.trim();
      const fecha = evFecha ? evFecha.value : '';
      const hora = document.getElementById('ev-hora')?.value;
      const proyector = document.getElementById('ev-proyector')?.value;

      if (!nombre) {
        if (evMsg) evMsg.textContent = 'Por favor ingresa tu nombre, empresa o institución.';
        return;
      }
      if (tipo === 'Otro' && !detalleOtro) {
        if (evMsg) evMsg.textContent = 'Por favor especifica el tipo o motivo del evento.';
        return;
      }
      if (!personas || !fecha || !hora) {
        if (evMsg) evMsg.textContent = 'Por favor completa la cantidad de personas, fecha y hora.';
        return;
      }
      if (evMsg) evMsg.textContent = '';

      const tipoFinal = tipo === 'Otro' ? `Otro (${detalleOtro})` : tipo;
      const textoEvento = [
        `${getSaludoHonduras()}, les escribo desde la página web del Hotel Plaza Venecia para cotizar un salón para evento:`,
        `• Nombre / Empresa / Institución: ${nombre}`,
        `• Tipo de evento: ${tipoFinal}`,
        `• Cantidad de personas: ${personas}`,
        `• Fecha: ${fecha}`,
        `• Hora: ${hora}`,
        `• Proyector multimedia: ${proyector}`,
        'Quedo atento(a) para coordinar los demás detalles.'
      ].join('\n');

      window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(textoEvento)}`, '_blank', 'noopener');
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

  // Formulario de reserva -> WhatsApp (con soporte para múltiples habitaciones)
  const form = document.getElementById('form-reserva');
  const msg = document.getElementById('f-msg');
  const llegada = document.getElementById('f-llegada');
  const salida = document.getElementById('f-salida');
  const btnAddRoom = document.getElementById('btn-add-room');
  const roomsListEl = document.getElementById('f-rooms-list');
  const selHab = document.getElementById('f-habitacion');
  const inpCantHab = document.getElementById('f-cant-hab');
  const inpPersonas = document.getElementById('f-personas');
  const hintPersonas = document.getElementById('f-personas-hint');
  const selectedRooms = new Map();
  let personasEditedManually = false;

  const ROOM_CAP = { Sencilla: 1, Doble: 2, Triple: 3, Suite: 2, 'Tarifa Corporativa': 1 };

  const getRoomsSummary = () => {
    let totalRooms = 0;
    let suggestedGuests = 0;
    selectedRooms.forEach((qty, type) => {
      totalRooms += qty;
      suggestedGuests += qty * (ROOM_CAP[type] || 1);
    });
    return { totalRooms, suggestedGuests };
  };

  if (inpPersonas) {
    inpPersonas.addEventListener('input', () => { personasEditedManually = true; });
  }

  const renderRoomsChips = () => {
    if (!roomsListEl) return;
    roomsListEl.innerHTML = '';
    selectedRooms.forEach((qty, type) => {
      const chip = document.createElement('span');
      chip.className = 'room-chip';
      chip.innerHTML = `<strong>${qty}×</strong> ${type} <button type="button" data-remove="${type}" aria-label="Quitar ${type}">&times;</button>`;
      roomsListEl.appendChild(chip);
    });

    const { totalRooms, suggestedGuests } = getRoomsSummary();
    if (totalRooms > 0) {
      if (inpPersonas && !personasEditedManually) {
        inpPersonas.value = String(suggestedGuests);
      }
      if (hintPersonas) {
        hintPersonas.style.display = 'block';
        hintPersonas.textContent = `Sugerencia: ${suggestedGuests} ${suggestedGuests === 1 ? 'persona' : 'personas'} para ${totalRooms} ${totalRooms === 1 ? 'habitación' : 'habitaciones'}.`;
      }
    } else if (hintPersonas) {
      hintPersonas.style.display = 'none';
      hintPersonas.textContent = '';
    }
  };

  if (btnAddRoom && selHab && inpCantHab) {
    btnAddRoom.addEventListener('click', () => {
      const type = selHab.value;
      const qty = Math.max(1, parseInt(inpCantHab.value, 10) || 1);
      selectedRooms.set(type, (selectedRooms.get(type) || 0) + qty);
      inpCantHab.value = '1';
      renderRoomsChips();
    });
  }

  if (roomsListEl) {
    roomsListEl.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-remove]');
      if (!btn) return;
      selectedRooms.delete(btn.getAttribute('data-remove'));
      renderRoomsChips();
    });
  }

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

    let detalleHabitaciones = '';
    let totalRooms = 0;
    if (selectedRooms.size > 0) {
      const items = [];
      selectedRooms.forEach((qty, type) => {
        items.push(`${qty} ${type}`);
        totalRooms += qty;
      });
      detalleHabitaciones = items.join(', ');
    } else {
      const qtyActual = Math.max(1, parseInt(inpCantHab ? inpCantHab.value : '1', 10) || 1);
      totalRooms = qtyActual;
      detalleHabitaciones = `${qtyActual} ${val('f-habitacion')}`;
    }

    const totalPersonas = Math.max(1, parseInt(val('f-personas'), 10) || 1);
    if (totalPersonas < totalRooms) {
      const seguro = window.confirm(
        `Seleccionaste ${totalRooms} habitaciones (${detalleHabitaciones}) pero indicaste ${totalPersonas} ${totalPersonas === 1 ? 'persona' : 'personas'}.\n\n¿Estás seguro de que el total de personas es correcto antes de enviar la solicitud?`
      );
      if (!seguro) {
        if (inpPersonas) inpPersonas.focus();
        return;
      }
    }

    const texto = [
      `${getSaludoHonduras()}, les escribo desde la página web del Hotel Plaza Venecia para solicitar reserva:`,
      `• Nombre: ${nombre}`,
      `• Llegada: ${llegada.value}`,
      `• Salida: ${salida.value}`,
      `• Habitaciones: ${detalleHabitaciones}`,
      `• Total de personas: ${val('f-personas')}`,
      val('f-comentarios') ? `• Comentarios: ${val('f-comentarios')}` : ''
    ].filter(Boolean).join('\n');
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`, '_blank', 'noopener');
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
