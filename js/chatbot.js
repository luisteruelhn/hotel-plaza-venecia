/* ==========================================================================
   Chatbot Asistente – Hotel Venecia & Santa Bárbara
   Limitado exclusivamente a información del hotel y de la ciudad.
   ========================================================================== */
(() => {
  const toggleBtn = document.getElementById('chat-toggle');
  const closeBtn = document.getElementById('chat-close');
  const panel = document.getElementById('chat-panel');
  const messagesEl = document.getElementById('chat-messages');
  const form = document.getElementById('chat-form');
  const input = document.getElementById('chat-input');
  const chipsContainer = document.getElementById('chat-chips');

  if (!toggleBtn || !panel || !messagesEl || !form || !input) return;

  const getSaludoHonduras = () => {
    try {
      const hora = parseInt(
        new Intl.DateTimeFormat('en-US', {
          timeZone: 'America/Tegucigalpa',
          hour: 'numeric',
          hour12: false
        }).format(new Date()),
        10
      );
      if (hora >= 5 && hora < 12) return 'Buenos días';
      if (hora >= 12 && hora < 18) return 'Buenas tardes';
      return 'Buenas noches';
    } catch {
      return 'Hola';
    }
  };

  // Actualizar saludo inicial del chatbot según horario de Honduras
  const welcomeMsg = messagesEl.querySelector('.chat-msg--bot');
  if (welcomeMsg) {
    welcomeMsg.innerHTML = `¡${getSaludoHonduras()}! Pregúntame sobre nuestras <strong>habitaciones, salones para eventos, Bar Venetto, ubicación</strong> o sobre <strong>Santa Bárbara</strong>.`;
  }

  const normalize = (str) =>
    str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();

  const KNOWLEDGE = [
    {
      keywords: ['hola', 'buenas', 'buenos dias', 'buenas tardes', 'buenas noches', 'saludos', 'hey'],
      reply: () =>
        `¡${getSaludoHonduras()}! Soy el asistente virtual de <strong>Hotel Venecia</strong>. Puedo ayudarte con información sobre nuestras habitaciones, salones para eventos, tarifas corporativas, Bar Venetto, reservas o sobre <strong>Santa Bárbara</strong>. ¿Qué te gustaría saber?`
    },
    {
      keywords: ['corporativo', 'corporativos', 'convenio', 'convenios', 'empresa', 'empresas', 'institucion', 'instituciones', 'ong', 'proyecto', 'proyectos', 'trabajo'],
      reply:
        'Contamos con <strong>tarifas corporativas y convenios</strong> especiales para empresas, organizaciones, instituciones y equipos de trabajo o proyectos. Puedes enviar tu consulta en la sección <a href="#btn-corporate-wa">Consultar tarifas corporativas</a> o escribirnos directo por <a href="https://wa.me/50499377949" target="_blank" rel="noopener">WhatsApp al 9937-7949</a>.'
    },
    {
      keywords: ['habitacion', 'habitaciones', 'cuarto', 'cuartos', 'sencilla', 'doble', 'triple', 'suite', 'dormir', 'hospedaje', 'precio', 'tarifa', 'tarifas', 'costo', 'especial', 'especiales'],
      reply:
        'Contamos con 4 tipos de habitaciones cómodas y seguras: <strong>Sencilla</strong>, <strong>Doble</strong>, <strong>Triple</strong> y <strong>Suite</strong>. Además, ofrecemos <strong>tarifas especiales y corporativas</strong>. Para consultar disponibilidad y cotizaciones, escríbenos por <a href="https://wa.me/50499377949" target="_blank" rel="noopener">WhatsApp al 9937-7949</a>.'
    },
    {
      keywords: ['ubicacion', 'donde estan', 'direccion', 'llegar', 'mapa', 'colonia', 'alfonso', 'parque', 'centro', 'centrico'],
      reply:
        'Estamos ubicados en <strong>Colonia Alfonso XIII, Santa Bárbara, Honduras</strong>, a pocos pasos al sur del Parque Central. Es una zona céntrica, segura y tranquila. <a href="https://www.google.com/maps/search/?api=1&query=Hotel+Venecia+Santa+B%C3%A1rbara+Honduras" target="_blank" rel="noopener">Abrir ubicación en Google Maps →</a>'
    },
    {
      keywords: ['restaurante', 'comida', 'desayuno', 'almuerzo', 'cena', 'comer', 'menu'],
      reply:
        'Nuestro <strong>Restaurante</strong> ofrece un ambiente acogedor con platillos preparados al momento para que te sientas como en casa. Si deseas consultar horarios o menú del día, contáctanos al <a href="tel:+50499377949">9937-7949</a>.'
    },
    {
      keywords: ['bar', 'venetto', 'bebida', 'bebidas', 'coctel', 'cerveza', 'trago'],
      reply:
        '<strong>Bar Venetto</strong> es nuestro espacio ideal para relajarte y compartir un buen momento en un ambiente agradable y seguro dentro del hotel.'
    },
    {
      keywords: ['salon', 'salones', 'evento', 'eventos', 'boda', 'cumpleanos', 'reunion', 'conferencia', 'fiesta', 'capacitacion', 'capacitaciones', 'proyector', 'audiovisual', 'sonido', 'banquete', 'ejecutivo', 'graduacion', 'bautismo', 'taller'],
      reply:
        'Contamos con <strong>salones para eventos</strong> con capacidad máxima de hasta <strong>50 personas</strong>, ideales para eventos sociales, bodas, graduaciones, reuniones y capacitaciones empresariales. Incluyen opción de <strong>equipo audiovisual</strong> (proyector, pantalla y sonido) y <strong>servicio de comida y bebidas</strong>. Puedes cotizar tu evento en la sección <a href="#eventos">Eventos</a> o por <a href="https://wa.me/50499377949" target="_blank" rel="noopener">WhatsApp (9937-7949)</a>.'
    },
    {
      keywords: ['reservar', 'reserva', 'reservacion', 'disponibilidad', 'telefono', 'whatsapp', 'contacto', 'llamar'],
      reply:
        'Puedes reservar fácilmente enviándonos un mensaje por <a href="https://wa.me/50499377949" target="_blank" rel="noopener">WhatsApp al 9937-7949</a> o usando el formulario de reserva en la sección de Contacto.'
    },
    {
      keywords: ['redes', 'red social', 'redes sociales', 'facebook', 'instagram', 'tiktok', 'tik tok'],
      reply:
        '¡Claro! Puedes seguirnos en nuestras redes sociales oficiales: <a href="https://www.facebook.com/hotelveneciahn" target="_blank" rel="noopener">Facebook</a>, <a href="https://www.instagram.com/hotelveneciahn/" target="_blank" rel="noopener">Instagram</a> y <a href="https://www.tiktok.com/@hotel.venecia" target="_blank" rel="noopener">TikTok</a>.'
    },
    {
      keywords: ['seguro', 'seguridad', 'familia', 'familiar', 'estacionamiento', 'parqueo', 'recepcion', 'carro', 'vehiculo', 'auto'],
      reply:
        'En Hotel Venecia contamos con <strong>estacionamiento propio</strong> y priorizamos un ambiente <strong>seguro, céntrico y familiar</strong>, con atención cercana en recepción.'
    },
    {
      keywords: ['santa barbara', 'ciudad', 'pueblo', 'visitar', 'hacer', 'turismo', 'lugares', 'atractivos', 'catedral', 'iglesia', 'colonial', 'comercial', 'comerciales', 'relax'],
      reply:
        '<strong>Santa Bárbara</strong> es una ciudad que tiene su encanto. Puedes pasear por el <strong>Parque Central</strong>, comprar <strong>artesanías</strong> y ver su <strong>arquitectura colonial</strong>. Y si te hospedas con nosotros, puedes visitar nuestro <strong>Bar Venetto</strong> para pasar un momento tranquilo.'
    },
    {
      keywords: ['junco', 'sombrero', 'artesania', 'artesanias', 'cultura', 'tradicion'],
      reply:
        'Santa Bárbara es famosa en Honduras por sus <strong>artesanías de junco y palma</strong>, especialmente los tradicionales sombreros hechos a mano, además de su cálida hospitalidad.'
    },
    {
      keywords: ['cafe', 'rosquilla', 'gastronomia', 'tipica', 'tipico', 'clima', 'tiempo'],
      reply:
        'En Santa Bárbara puedes disfrutar de <strong>café de altura</strong> de la región, rosquillas tradicionales y gastronomía típica hondureña, en un clima generalmente cálido y agradable.'
    }
  ];

  const OUT_OF_SCOPE =
    'Lo siento, solo puedo responder preguntas sobre <strong>Hotel Venecia</strong> (habitaciones, restaurante, Bar Venetto, salones, ubicación y reservas) y sobre <strong>Santa Bárbara</strong>. Si necesitas otra consulta, escríbenos por <a href="https://wa.me/50499377949" target="_blank" rel="noopener">WhatsApp al 9937-7949</a>.';

  function findReply(text) {
    const clean = normalize(text);
    if (!clean) return OUT_OF_SCOPE;

    for (const item of KNOWLEDGE) {
      if (item.keywords.some((kw) => new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(clean))) {
        return typeof item.reply === 'function' ? item.reply() : item.reply;
      }
    }
    return OUT_OF_SCOPE;
  }

  function addMessage(html, sender) {
    const msg = document.createElement('div');
    msg.className = `chat-msg chat-msg--${sender}`;
    msg.innerHTML = html;
    messagesEl.appendChild(msg);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function handleUserQuery(text) {
    const trimmed = text.trim();
    if (!trimmed) return;
    addMessage(trimmed.replace(/</g, '&lt;').replace(/>/g, '&gt;'), 'user');
    setTimeout(() => {
      addMessage(findReply(trimmed), 'bot');
    }, 220);
  }

  function toggleChat(forceState) {
    const isOpen = typeof forceState === 'boolean' ? forceState : panel.hidden;
    panel.hidden = !isOpen;
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
    if (isOpen) {
      input.focus();
    }
  }

  toggleBtn.addEventListener('click', () => toggleChat());
  if (closeBtn) closeBtn.addEventListener('click', () => toggleChat(false));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = input.value;
    input.value = '';
    handleUserQuery(val);
  });

  if (chipsContainer) {
    chipsContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-q]');
      if (!btn) return;
      handleUserQuery(btn.getAttribute('data-q'));
    });
  }

  // Navegación inteligente desde enlaces internos del chatbot
  messagesEl.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (href === '#btn-corporate-wa') {
      e.preventDefault();
      toggleChat(false);
      const btnCorp = document.getElementById('btn-corporate-wa');
      const wrapCorp = document.getElementById('corporate-form-wrap');
      const inpEmp = document.getElementById('corp-empresa');
      const cardCorp = btnCorp ? btnCorp.closest('.contact__corporate-card') || btnCorp : null;
      if (cardCorp) cardCorp.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (btnCorp && wrapCorp && !wrapCorp.classList.contains('is-open')) {
        btnCorp.click();
      }
      if (inpEmp) {
        setTimeout(() => inpEmp.focus({ preventScroll: true }), 450);
      }
    } else if (href === '#eventos') {
      toggleChat(false);
    }
  });
})();
