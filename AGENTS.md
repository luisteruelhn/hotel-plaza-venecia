# AGENTS.md – Hotel Venecia Web

Sitio estático (HTML/CSS/JS) para **Hotel Plaza Venecia**, Santa Bárbara, Honduras.
- Dominio: https://www.hotelveneciahn.com · Hosting: Hostinger (subir contenido a `public_html`).
- WhatsApp/Tel: 9937-7949 · Dirección: Colonia Alfonso XIII, cuadra y media al sur del Parque Central.
- Secciones: Hospedaje (Sencilla, Doble, Triple, Suite), Restaurante, Bar Venetto, Salones para eventos.

## Estructura
- `index.html` – página única con SEO y JSON-LD `Hotel`.
- `css/styles.css` – tokens de diseño (terracota, crema, verde, dorado; Fraunces + Inter).
- `js/main.js` – menú, animaciones, formulario de reserva → WhatsApp.
- `js/chatbot.js` – asistente virtual local de atención al cliente y preguntas frecuentes.
- `assets/img/` – imágenes del hotel (reemplazo progresivo por fotografías reales).
- `.htaccess`, `robots.txt`, `sitemap.xml` – despliegue, seguridad y SEO.
- `.agents/skills/` – copia local y portable de directivas y skills del proyecto.
- `SEEDS.md` – semillero de ideas y especificaciones técnicas para funcionalidades futuras (CMS ligero, módulo de administración).

## Bitácora
- 2026-11-18: Versión inicial del sitio, carrusel Holiday Inn, barra de reserva multicuartos, cotizador de eventos y asistente virtual.
- 2026-11-18: Creación de SEEDS.md con la arquitectura y especificación de seguridad del Panel de Configuración y CMS ligero.

## Pendientes
- Fotos reales (fachada, habitaciones, restaurante, salón).
- Comodidades exactas por habitación; ubicación exacta en el mapa (coordenadas).
