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
