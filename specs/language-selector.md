# Language selector

## Goal

El usuario cambia el idioma de la interfaz entre español e inglés desde el Language selector del top bar, en la Home y en el editor. Detectar el idioma del navegador y añadir más idiomas quedan fuera.

- **Ubicación**
  - Extremo derecho del top bar, en la Home y en el editor.
  - En el editor está en el mismo sitio con y sin Cover editing.
  - Diseño en Penpot: `Worksheet / brand ejemplo logo` (página `Worksheet`) y `Worksheet / Cover / brand top bar` (página `Worksheet/cover`). Las medidas viven allí.
- **Control**
  - Un `NativeSelect` con las opciones ES y EN. Muestra el código del idioma actual.
  - Mismo estilo en la Home y en el editor: el del selector de producto (fondo Secondary).
  - `aria-label` «Idioma», de `i18n` en `es` y `en`.
- **Cambio de idioma**: todos los textos cambian al instante. El idioma elegido se recuerda entre visitas.
- **Cover**
  - Title y Date line se traducen al cambiar de idioma mientras el usuario no haya editado ese texto. Cada texto cuenta por separado.
  - Un texto editado conserva sus palabras.
  - La Date line se formatea con el idioma nuevo («noviembre 2026» pasa a «November 2026»).
- **Código**: un componente `LanguageSelector.vue`, que usan la Home y el editor.
