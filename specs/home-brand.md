# Home brand

## Goal

La Home («Crea tu fotolibro») usa los colores de marca y la barra superior verde del editor. Los tokens y las reglas de contraste viven en [brand-colors](brand-colors.md); aquí solo se dice qué cambia en la Home. Marca cada punto con `[x]` cuando se cumpla.

- **Diseño en Penpot** (página `Page 1`; las medidas viven allí)
  - Escritorio: `Home / Desktop / brand top bar`.
  - Móvil: `Home / Mobile / brand top bar` (390 px de ancho).
  - `Home / Desktop` es el diseño anterior: no es la referencia.
- **Barra superior**
  - Alta de 88 px (`h-22`), fondo Primary, sin borde inferior. Antes: 56 px con borde.
  - El contenedor no cambia (`max-w-[1248px] px-6`): a 1440 px el logo y el Language selector quedan en x=120 y x=1320.
  - El texto `wiski` pasa a ser el logo `logo-secondary.png` de 94×28 px, el mismo que usa `WorksheetView.vue`.
  - El logo enlaza a `https://annchoa.github.io/wiski-landing/`, en la misma pestaña. `alt` «Wiski», clave `home.logo` de `i18n` en `es` y `en`.
  - El Language selector no cambia: ya sigue [language-selector](language-selector.md).
- **Título**: el `h1` «Crea tu fotolibro» usa `text-primary`. El subtítulo y el resto del texto conservan sus grises y negros.
- **Tarjetas**: sin borde ni sombra. Se quitan `ring-1 ring-foreground/10` y `shadow-xs` del componente `Card`, que solo usa la Home. Radio y padding no cambian.
- **Footer**
  - Fondo Secondary, texto `text-secondary-foreground` (`#18181b`), sin borde superior.
  - El texto no usa el verde: Primary sobre Secondary da 3.65:1 y no pasa AA (ver brand-colors).
- **Botones y badge de descuento**: ya son Primary (`bg-primary` por defecto en `Button` y `Badge`). No hay cambio de código.
- **Móvil**
  - Mismos cambios que en escritorio. Las tarjetas van en una columna con 48 px entre ellas.
  - El título y el subtítulo van centrados. La fila de título y precio salta de línea cuando no cabe.
  - El layout responsive ya existe (`md:grid-cols-2`); solo cambia la altura de la barra.
- **Fuera de alcance**: modo oscuro, los grises (`text-muted-foreground`, `bg-muted`, `bg-neutral-300`), la imagen real de cada Product y la landing.

## Pruebas

Sin tests nuevos (decidido el 2026-11-23). Los tests existentes deben seguir en verde; el resto es visual: se compara en Chrome contra Penpot a 1440 y 390 px.

## Checklist

- [x] Barra superior de 88 px, Primary, con el logo enlazado a la landing y sin borde inferior.
- [x] `h1` en `text-primary`.
- [x] `Card` sin ring ni sombra.
- [x] Footer en Secondary, texto `#18181b`, sin borde superior.
- [x] Texto alternativo del logo traducido en `es` y `en`.
- [ ] Comparada en Chrome con Penpot a 1440 y 390 px.
