# SEEDS.md – Semillero de Ideas y Funcionalidades a Futuro

Este documento recopila las ideas, propuestas arquitectónicas y funcionalidades planificadas para evolucionar el sitio web de **Hotel Plaza Venecia** (Santa Bárbara, Honduras).

---

## 1. Panel de Configuración y Edición de Contenido (CMS Ligero Seguro)

### Objetivo
Permitir al personal administrativo del hotel actualizar textos, descripciones, comodidades y fotografías de las distintas secciones del sitio web desde un teléfono móvil o computadora, **sin tocar código, sin alterar los estilos visuales y sin riesgo de desconfigurar los botones de reserva de WhatsApp**.

### Funcionalidad por Áreas (Plantillas Modulares)
El usuario accederá a un panel visual donde podrá elegir el área que desea modificar:
1. **Carrusel Principal (Hero):**
   - Cambiar o reordenar fotos de portada.
   - Modificar eslogan y textos de bienvenida.
2. **Módulo de Habitaciones (Sencilla, Doble, Triple, Suite):**
   - Actualizar fotografía principal y galería de cada habitación.
   - Modificar descripción y capacidad recomendada.
   - Activar o desactivar servicios (Wi-Fi, TV por cable, Aire Acondicionado, Escritorio, Agua caliente).
   - *Protección:* El botón "Consultar disponibilidad" y su integración con WhatsApp quedan blindados y no son editables por error.
3. **Restaurante & Bar Venetto:**
   - Cambiar fotos de platillos, bebidas e instalaciones.
   - Modificar horarios de atención y textos de menú/especialidades.
4. **Salones para Eventos:**
   - Actualizar fotos de montajes y salones.
   - Ajustar textos descriptivos y capacidad máxima de personas.
   - *Protección:* El formulario interactivo "Cotizar mi evento" mantiene su lógica y cálculo intactos.
5. **Avisos de Temporada y Tarifas Especiales:**
   - Habilitar una barra superior o aviso de ofertas para feriados (Semana Santa, Feriado Morazánico, eventos corporativos).

---

### Arquitectura Técnica Recomendada

```
hotel-plaza-venecia/
├── admin/                     # Módulo de administración
│   ├── index.php              # Login seguro y dashboard
│   ├── editor.php             # Editor modular por sección con previsualización
│   ├── api/
│   │   ├── auth.php           # Autenticación, control de sesiones y tokens CSRF
│   │   ├── guardar.php        # Actualización segura de datos
│   │   └── subir-imagen.php   # Procesamiento y compresión de fotos
│   └── .htaccess              # Restricción de acceso y cabeceras de seguridad
├── data/
│   ├── contenido.json         # Fuente única de verdad para textos y rutas de imágenes
│   └── .htaccess              # Protección para evitar descargas o accesos indebidos directos
└── assets/img/subidas/        # Directorio exclusivo para imágenes cargadas por el admin
```

* **Frontend desacoplado del contenido:** `index.html` lee los datos dinámicamente desde `data/contenido.json` o se inyecta en la carga, asegurando que la estructura HTML y CSS nunca se corrompa.
* **Hosting:** Implementación en PHP nativo aprovechando el entorno Hostinger (PHP 8.x) sin requerir bases de datos pesadas ni suscripciones mensuales a plataformas de terceros.

---

### Blindaje y Seguridad Mandatoria

1. **Autenticación y Sesiones:**
   - Contraseña protegida mediante `password_hash()` con algoritmo Bcrypt / Argon2id.
   - Sesiones PHP con flags `HttpOnly`, `Secure` y `SameSite=Strict`.
   - Cierre automático de sesión tras período de inactividad.
   - Tokens anti-CSRF en cada petición de guardado.
2. **Protección contra Fuerza Bruta:**
   - Límite de 5 intentos fallidos de inicio de sesión con bloqueo temporal de 15 minutos por dirección IP.
3. **Seguridad en la Carga de Archivos (Uploads):**
   - Validación binaria real de tipo MIME mediante `finfo_file()` (no solo por la extensión del archivo).
   - Solo se permiten formatos de imagen reales: `.webp`, `.jpg`, `.jpeg`, `.png`.
   - Prohibición absoluta y bloqueo por `.htaccess` de ejecución de scripts (`.php`, `.phtml`, `.js`, `.py`, `.sh`) dentro de la carpeta de subidas.
   - Redimensionamiento y compresión automática a formato WebP optimizado para no saturar el almacenamiento ni ralentizar la web.
4. **Sanitización de Datos:**
   - Limpieza automática contra ataques XSS mediante `htmlspecialchars()` y validación estricta de esquemas antes de escribir en `contenido.json`.
5. **Compatibilidad con Git & Despliegues de Hostinger:**
   - Excluir `data/contenido.json` y `assets/img/subidas/` del `.gitignore` o configurar respaldo automático para que un nuevo despliegue desde GitHub no sobreescriba los cambios hechos desde el panel administrativo.

---

## 2. Otras Ideas a Futuro Registradas

* **Calendario de Ocupación Visual (Solo Lectura):** Mostrar fechas disponibles para salones de eventos sin revelar información privada de clientes.
* **Galería 360° o Tour Virtual:** Recorrido interactivo por la fachada, recepción, habitaciones y restaurante.
* **Reseñas y Testimonios de Huéspedes:** Módulo para destacar comentarios verificados de Google Maps o Booking.
* **Integración de Pasarela de Pagos Local (Fase Avanzada):** Posibilidad de pago de anticipo de reservas mediante tarjeta o transferencia bancaria si el hotel lo requiere a futuro.

---

## 3. Configuración y Portabilidad del Proyecto
- El proyecto mantiene en `.agents/skills/` una copia portable de las directivas y habilidades del agente para garantizar consistencia operativa en cualquier entorno de trabajo.

