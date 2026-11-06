# Free Player — sitio de promoción

Página web estática e independiente para promocionar la APK de **Free Player**.
No comparte archivos con el proyecto de la app: puedes moverla, publicarla o
borrarla sin tocar nada de `Free Player`.

## Estructura

```
Free Player Web/
├── index.html                      Página completa (una sola página)
├── manifest.json                   Datos para instalarla como app (PWA)
├── css/
│   └── style.css                   Diseño, maquetas de móvil y responsive
├── js/
│   └── main.js                     Menú, apariciones, cifras y aviso de descarga
└── assets/
    ├── icon-192.png                Icono de la app
    ├── icon-512.png                Icono / imagen social
    └── fonts/
        ├── manrope-latin.woff2     Tipografía Manrope (subconjunto latino)
        └── OFL.txt                 Licencia SIL Open Font License
```

La APK **no se guarda en esta carpeta**: los botones de descarga apuntan
directamente al release de GitHub del proyecto
(`https://github.com/SansGamerFnF/Free-Player/releases/...`). Así la web sigue
siendo ligera y la APK se actualiza desde un solo sitio.

## Ver la página

**Opción 1 — doble clic:** abre `index.html` en el navegador. Funciona casi
todo, pero algunos navegadores bloquean la descarga directa de archivos locales.

**Opción 2 — servidor local (recomendado):**

```powershell
cd "D:\Nueva carpeta\Free Player Web"
python -m http.server 8080
```

Y abre <http://localhost:8080>. También vale cualquier servidor estático:
`npx serve .`, `php -S localhost:8080` o la extensión Live Server de VS Code.

## Publicarla gratis

Es un sitio 100 % estático, así que no necesita backend ni build:

- **GitHub Pages** — repositorio
  [`Free-Player-Web`](https://github.com/SansGamerFnF/Free-Player-Web) con Pages
  activado en la rama `main`.
- **Netlify Drop** — <https://app.netlify.com/drop>: arrastra la carpeta y te da
  una URL al instante.
- **Cloudflare Pages** — sube la carpeta o conéctala a un repositorio.
- **Vercel** — importa la carpeta como proyecto estático.

> Al no incluir la APK, la web ocupa unos 105 KB y se puede publicar en
> cualquier servicio estático. La descarga la sirve GitHub, así que no hay
> límite de tamaño que afecte al sitio.

## Cambiar la versión y el APK

1. Publica la nueva APK en el release del repositorio
   [`Free-Player`](https://github.com/SansGamerFnF/Free-Player/releases)
   (el nombre del archivo adjunto será `Free-Player-X.Y.apk`).
2. En `index.html`, busca y reemplaza la URL de descarga (hay **4 apariciones**:
   menú, portada, sección de descarga y pie):

   ```
   https://github.com/SansGamerFnF/Free-Player/releases/download/v0.3-c/Free-Player-0.3-c.apk
   ```

   por la del nuevo release, y actualiza también esta URL en el README.
3. Actualiza los textos visibles de versión y los datos estructurados:
   - `Beta 0.3-c · Android 7.0+` (portada)
   - `Descarga Free Player 0.3-c…`
   - `Versión beta 0.3-c · Android 7.0+`
   - `softwareVersion` del bloque `application/ld+json`
   - `downloadUrl` del mismo bloque
4. Si cambia el peso, actualiza `15,2 MB` en los botones y en las cifras.

## Nota sobre la APK

La descarga apunta al release de GitHub y la APK actual es la **build de
depuración** (`app-debug.apk`). Funciona para probar e instalar, pero antes de
difundir la web conviene generar una **APK de release firmada** desde Android
Studio o con Gradle, subirla al release y apuntar ahí el enlace.

## Detalles técnicos

- Sin frameworks, sin build, sin cookies ni analítica. Solo HTML, CSS y JS.
- **Manrope** se sirve desde `assets/fonts/`, con su licencia OFL incluida. No
  hay peticiones a Google Fonts ni a ningún servicio externo: la web carga
  entera desde el propio sitio.
- Las maquetas de móvil están hechas con HTML y CSS (no son capturas). Las
  animaciones (vinilo, ecualizador, marquesina, tarjetas flotantes, aparición
  al desplazar) son CSS, con el mínimo JS para activarlas al entrar en pantalla.
- `manifest.json` permite añadir la web a la pantalla de inicio de Android como
  app (PWA). No hay service worker, así que la web necesita conexión; la APK
  sí funciona sin conexión.
- Responsive probado a 390 px (móvil), 900 px (tableta) y 1440 px (escritorio).
  En móvil el menú se convierte en panel lateral y las capturas en un carrusel
  deslizable.
- Respeta `prefers-reduced-motion`, incluye enlace para saltar al contenido,
  foco visible y textos alternativos en las imágenes.
