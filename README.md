# Free Player — sitio de promoción

Página web estática e independiente para promocionar la APK de **Free Player**.
No comparte archivos con el proyecto de la app: puedes moverla, publicarla o
borrarla sin tocar nada de `Free Player`.

## Estructura

```
Free Player Web/
├── index.html                     Página completa (una sola página)
├── css/
│   └── style.css                  Estilos, maquetas de móvil y responsive
├── js/
│   └── main.js                    Menú móvil, animaciones y aviso de descarga
└── assets/
    ├── icon-192.png               Icono de la app
    └── icon-512.png               Icono / imagen social
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
npx serve .
```

O con Python:

```powershell
python -m http.server 8080
```

Y abre <http://localhost:8080>.

## Publicarla gratis

Es un sitio 100 % estático, así que no necesita backend ni build:

- **Netlify Drop** — <https://app.netlify.com/drop>: arrastra la carpeta
  `Free Player Web` y te da una URL al instante.
- **Cloudflare Pages** — sube la carpeta o conéctala a un repositorio.
- **GitHub Pages** — sube el contenido a un repositorio y activa Pages.
- **Vercel** — importa la carpeta como proyecto estático.

> Al no incluir la APK, la web ocupa menos de 100 KB y se puede publicar en
> cualquier servicio estático. La descarga la sirve GitHub, así que no hay
> límite de tamaño que afecte al sitio.

## Cambiar la versión y el APK

1. Publica la nueva APK en el release del repositorio
   [`Free-Player`](https://github.com/SansGamerFnF/Free-Player/releases)
   (el nombre del archivo adjunto será `Free-Player-X.Y.apk`).
2. En `index.html`, busca y reemplaza la URL de descarga (hay 4 apariciones):

   ```
   https://github.com/SansGamerFnF/Free-Player/releases/download/v0.3-c/Free-Player-0.3-c.apk
   ```

   por la del nuevo release, y actualiza también esta misma URL en el README.
3. Actualiza los textos visibles de versión:
   - `Beta 0.3-c · Android` (hero)
   - `Descarga Free Player 0.3-c…`
   - `Versión beta 0.3-c · Android 7.0+`
4. Si cambia el peso, actualiza `15,2 MB` en el botón y en las cifras.

## Nota sobre la APK

La descarga apunta al release de GitHub y la APK actual es la **build de
depuración** (`app-debug.apk`). Funciona para probar e instalar, pero antes de
difundir la web conviene generar una **APK de release firmada** desde Android
Studio o con Gradle, subirla al release y apuntar ahí el enlace.

## Detalles técnicos

- Sin frameworks, sin build, sin cookies ni analítica.
- Una única fuente externa: **Manrope** desde Google Fonts. Si quieres que la
  página funcione 100 % sin internet, elimina los `<link>` de Google Fonts en
  `index.html`; el CSS ya usa la fuente del sistema como respaldo.
- Las maquetas de móvil están hechas con HTML y CSS (no son capturas). Si
  prefieres capturas reales, reemplaza cada `.phone` por una `<img>` y ajusta
  el ancho en `css/style.css`.
- Respeta `prefers-reduced-motion` y es navegable con teclado.
