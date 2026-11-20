# AGENTS.md – Hotel Venecia Web

Sitio estático (HTML/CSS/JS) para **Hotel Plaza Venecia**, Santa Bárbara, Honduras.
- Dominio: https://www.hotelveneciahn.com · Hosting: Hostinger (subir contenido a `public_html`).
- WhatsApp/Tel: 9937-7949 · Dirección: Colonia Alfonso XIII, cuadra y media al sur del Parque Central.
- Secciones: Hospedaje (Sencilla, Doble, Triple, Suite), Restaurante, Bar Venetto, Salones para eventos.

## Estructura
- `index.html` – página única con SEO y JSON-LD `Hotel`.
- `css/styles.css` – tokens de diseño cálidos sin azul (espresso/caoba `#381406`, caoba `#5A2A14`, bronce caramelo `#8E5B34`, dorado champán `#DFBA84`, crema `#FAF7F2`; Fraunces + Inter).
- `js/main.js` – menú, animaciones, formulario de reserva → WhatsApp.
- `js/chatbot.js` – asistente virtual local de atención al cliente y preguntas frecuentes.
- `assets/img/` – imágenes del hotel (reemplazo progresivo por fotografías reales).
- `.htaccess`, `robots.txt`, `sitemap.xml` – despliegue, seguridad y SEO.
- `.agents/skills/` – copia local y portable de directivas y skills del proyecto.
- `SEEDS.md` – semillero de ideas y especificaciones técnicas para funcionalidades futuras (CMS ligero, módulo de administración).

## Bitácora
- 2026-11-18: Versión inicial del sitio, carrusel Holiday Inn, barra de reserva multicuartos, cotizador de eventos y asistente virtual.
- 2026-11-18: Creación de SEEDS.md con la arquitectura y especificación de seguridad del Panel de Configuración y CMS ligero.
- 2026-11-19: Cambio completo de paleta de colores a tonos cálidos inspirados en la recepción (espresso/caoba, bronce caramelo, dorado champán y blanco crema); eliminado por completo el azul.
- 2026-11-19: Rediseño completo del inicio (header blanco fijo con logo y botón Reservar, hero editorial con foto de recepción, barra de consulta rápida flotante siempre visible y 3 pilares de hospitalidad); retirada temporalmente la sección Restaurante manteniendo Galería.

## Pendientes
- Fotos reales (fachada, habitaciones, restaurante, salón).
- Comodidades exactas por habitación; ubicación exacta en el mapa (coordenadas).
