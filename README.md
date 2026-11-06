# HBD Saudi - Sistema Web Interactivo de Celebracion

Aplicacion web interactiva orientada a la celebracion de cumpleanos, desarrollada con React 19, Vite, Tailwind CSS, Three.js y Firebase. El sistema incorpora una galeria multimedia inmersiva compatible con Google Drive y Google Photos, un muro de dedicatorias en tiempo real con reacciones persistentes, un reproductor de musica continuo basado en vinilo virtual, un modulo de gestion integral (Studio) con clave de acceso protegida y un diseno visual basado en Claymorphism con objetos tridimensionales interactivos en WebGL.

---

## 1. Vision General del Proyecto

El proyecto constituye una plataforma digital personalizada orientada a conmemorar el cumpleanos de Saudith, integrando contenido multimedia historico (fotografias y videos), participacion comunitaria en tiempo real, administracion dinamica de recuerdos sin necesidad de redespliegue de codigo, gamificacion y renderizado 3D en tiempo real con Three.js.

---

## 2. Jerarquia de Roles y Control de Acceso

La aplicacion implementa un modelo de control de acceso jerarquico para separar las actividades de los invitados de las capacidades de administracion reservadas para la homenajeada:

### Rol 1: Invitado / Amigo (Guest)
- Acceso al catalogo completo de fotos y videos con filtrado dinamico (Todos, Fotos, Videos).
- Visor modal inmersivo (Lightbox) con soporte para navegacion por teclado, descarga de archivos y suspension automatica de la musica de fondo.
- Publicacion de dedicatorias en el Muro de Recuerdos con identificacion de los seis amigos organizadores (Ivan, Julio, Hasmith, Maurith, Carlos y Elisa).
- Registro de reacciones cuantitativas por mensaje (corazon, pastel, risa, lloro, corona) sincronizadas en Firestore con actualizacion optimista local.
- Modo jugador en la Trivia de Saudith: resolucion interactiva de preguntas, retroalimentacion inmediata con comentarios autorales y calificacion final basada en titulos honorificos.

### Rol 2: Creadora VIP / Administradora (Saudith)
- Acceso autenticado mediante credencial privada en el modulo "Saudi Studio" (`#studio`). La clave de acceso configurada es "saudiki123." y el campo oculta su contenido de forma estricta sin pistas en la interfaz.
- Panel administrativo con dos submodulos:
  1. Gestion de Trivia: Operaciones CRUD completas (Crear, Leer, Actualizar y Eliminar) sobre el banco de preguntas de la trivia, con asignacion de respuestas correctas y reacciones personalizadas.
  2. Gestion de Galeria Multimedia: Incorporacion de fotografias y videos mediante enlaces publicos de Google Drive o Google Photos, de forma individual o en bloque, liberando el almacenamiento fisico del repositorio.
- Sincronizacion en tiempo real con Firebase Firestore (colecciones `trivia_questions` y `gallery_items`) y respaldo automatico en LocalStorage para funcionamiento sin conexion.

---

## 3. Sistema de Diseno: Claymorphism, Dinamismo y Renderizado 3D con Three.js

La interfaz visual adopta los fundamentos del estilo Claymorphism combinados con computacion grafica en tiempo real y dinamismo interactivo:
- Geometrias de plastilina con volumen tridimensional: contenedores y tarjetas con radios pronunciados (`rounded-3xl`, `rounded-full`).
- Iluminacion interior dual: combinacion de sombras interiores claras en el vertice superior izquierdo y sombras interiores profundas en el vertice inferior derecho (`shadow-clay-card`, `shadow-clay-header`, `shadow-clay-pink`, `shadow-clay-yellow`).
- Barra de navegacion superior estatica y fija (`fixed` al viewport): permanece visible y accesible durante todo el desplazamiento de la pagina, incorporando desenfoque dinamico (`backdrop-blur-2xl`) y ajuste de sombra al hacer scroll.
- Barra de desplazamiento (scrollbar) estilizada: soporte para WebKit y Firefox con carril oscuro translucido y tirador de plastilina suave en degradado rosa-purpura-indigo con bisel interior.
- Visor modal inmersivo (Lightbox) optimizado: renderizado mediante React Portals (`createPortal`) fijado directamente al viewport (`100dvh`), garantizando que se abra en el centro exacto de la pantalla donde el usuario interactua sin requerir desplazamiento de pagina, con bloqueo automatico del scroll del fondo (`overflow: hidden`).
- Escena 3D WebGL con Three.js (`ClayScene3D.jsx`):
  - Pastel de cumpleanos multicapa con vela modelada en 3D y llama animada.
  - Globos, estrellas y donas flotantes con materiales mate de plastilina (`MeshStandardMaterial` con rugosidad elevada).
  - Iluminacion de estudio con luces direccionales, ambientales y focos perimetrales de color rosa y amarillo.
  - Efecto de paralaje interactivo vinculado a las coordenadas del puntero del raton, eventos tactiles y al desplazamiento vertical de la pagina (`scrollY`).
- Microinteracciones dinamicas en la galeria: sistema de reacciones con contador persistente en local, animaciones de celebracion y transiciones fluidas.
- Favicon vectorial Claymorphic de alta definicion (`/public/favicon.svg`) con pastel, corona y destellos dorados.

---

## 4. Integracion con Google Drive y Optimizacion de Almacenamiento

Para evitar el sobrepeso de archivos binarios en el repositorio y reducir el consumo de ancho de banda en Vercel, el sistema incluye un adaptador de URLs (`driveUrlHelper.js`):
- Los enlaces compartidos de Google Drive (`https://drive.google.com/file/d/FILE_ID/view`) se transforman automaticamente en direcciones de alta velocidad servidas por la red de distribucion de contenido (CDN) de Google (`https://lh3.googleusercontent.com/d/FILE_ID`).
- Los videos de Google Drive se incrustan mediante reproductores seguros compatibles con reproduccion automatica.
- Permite la importacion en lote: se pueden pegar multiples enlaces en bloque para actualizar la galeria en segundos sin realizar commits de git.

---

## 5. Arquitectura del Sistema

### Estructura de Directorios

```text
hbd_sau/
|-- public/
|   |-- favicon.svg           # Favicon vectorial 3D Claymorphic
|   |-- fotos/                # Activos estaticos iniciales
|-- src/
|   |-- assets/               # Recursos auxiliares
|   |-- components/
|   |   |-- BackgroundTheme.jsx   # Capa de fondo con iconos y escena 3D
|   |   |-- ClayScene3D.jsx       # Escena 3D interactiva en WebGL con Three.js
|   |   |-- LightboxModal.jsx     # Visor modal de fotos y videos a pantalla completa
|   |   |-- MemoryWall.jsx        # Muro de mensajes en tiempo real con reacciones Clay
|   |   |-- MusicPlayer.jsx       # Reproductor flotante estilo vinilo con YouTube API
|   |   |-- PhotoGallery.jsx      # Grilla de galeria con filtros y masonry layout
|   |   |-- TriviaPlayer.jsx      # Interfaz de juego de trivia para invitados
|   |   |-- TriviaStudio.jsx      # Modulo de gestion de trivia y galeria para Saudith
|   |-- data/
|   |   |-- defaultTrivia.js  # Banco predeterminado de preguntas de trivia
|   |-- services/
|   |   |-- galleryService.js # Persistencia y gestion de recuerdos (Firestore / Local)
|   |   |-- triviaService.js  # Capa de persistencia de trivia (Firestore / Local)
|   |-- utils/
|   |   |-- audioBridge.js    # Bus de sincronizacion de estado para suspension de audio
|   |   |-- confetti.js       # Control de efectos visuales de particulas festivas
|   |   |-- driveUrlHelper.js # Normalizador de enlaces de Google Drive y Google Photos
|   |-- firebase.js           # Inicializacion resiliente y tolerante a fallos de Firebase
|   |-- App.jsx               # Enrutamiento basado en hash y header Claymorphic
|   |-- main.jsx              # Punto de entrada de la aplicacion React
|   |-- index.css             # Directivas globales y extensiones de estilos
|-- eslint.config.js          # Configuracion de linter ECMAScript
|-- index.html                # Plantilla base HTML5 con favicon Claymorphic
|-- package.json              # Dependencias del proyecto y scripts de ejecucion
|-- postcss.config.js         # Configuracion de procesamiento PostCSS
|-- tailwind.config.js        # Configuracion del sistema de diseno Claymorphism
`-- vite.config.js            # Configuracion de empaquetado y code-splitting en Vite
```

---

## 6. Variables de Entorno

Para habilitar la persistencia multiusuario en la nube con Firebase Firestore y Firebase Authentication, cree un archivo `.env` en la raiz del proyecto con las siguientes variables:

```bash
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto_id
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

---

## 7. Scripts Disponibles

En el directorio del proyecto se pueden ejecutar los siguientes comandos:

- `npm run dev`: Inicia el servidor de desarrollo local con recarga rapida (HMR) en el puerto predeterminado de Vite.
- `npm run build`: Compila y optimiza la aplicacion para produccion en la carpeta `dist`.
- `npm run preview`: Previsualiza localmente la compilacion de produccion generada.
- `npm run lint`: Ejecuta el analisis estatico de codigo mediante ESLint.

---

## 8. Despliegue en Produccion

La aplicacion esta configurada para desplegarse de manera continua en plataformas como Vercel o Netlify. El comando de construccion requerido es `npm run build` y el directorio de publicacion generado es `dist`.
