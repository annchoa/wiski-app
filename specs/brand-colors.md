# Brand colors

## Goal

La interfaz del editor usa los colores de marca de Wiski. Hoy la app usa la paleta gris por defecto de shadcn-vue. Marca cada punto con `[x]` cuando se cumpla.

## Colores de marca

Fuente de verdad: los cuatro tokens de `src/assets/main.css`, sin JSON compartido con `wiski-landing` (decidido el 2026-11-23). La landing no comparte archivos con la app: el usuario copia los valores a su `src/index.css` cuando quiera.

| Rol | Base | Foreground | Hover | Active |
| --- | --- | --- | --- | --- |
| Primary | `#4b8344` | `#fafafa` | `color-mix(in oklab, var(--primary) 80%, transparent)` | `color-mix(in oklab, var(--primary) 65%, transparent)` |
| Secondary | `#eee5de` | `#18181b` | `color-mix(in oklab, var(--secondary), var(--foreground) 5%)` | `color-mix(in oklab, var(--secondary), var(--foreground) 10%)` |

Contraste (WCAG):

- Foreground sobre Primary: unos 4.3:1. **Queda por debajo de AA (4.5:1).** Decisión conocida del usuario: se usa `#fafafa` como en la landing. Con blanco puro serían 4.54:1.
- Primary sobre Secondary: 3.65:1. No pasa AA para texto pequeño: no uses el verde como texto sobre Secondary.
- Foreground sobre Secondary: más de 15:1.

### Secondary sobre el verde y en links

- En la barra superior verde, Secondary va al 100 %, sin opacidad ni estados propios (2026-11-23).
- El logo `logo-secondary.png` (copia del de `wiski-landing`) va en la barra superior, a la izquierda del selector de producto (2026-11-23). Referencia: board `Worksheet / brand ejemplo logo`.
- Los links de texto (por ejemplo, «Política de privacidad» en un footer) usan el 80 %: reposo `text-secondary/80`, hover y active `text-secondary`. El footer aún no existe ni tiene diseño.
- Los botones Secondary sobre blanco usan el hover y el active de `color-mix` de la tabla.
- El 70 % se descartó: casi se funde con el verde. Hex sobre `#4b8344` (aproximación): 80 % = `#cdd1bf`, 70 % = `#bdc8b0`.

## Tokens en CSS

- `main.css` define `--primary`, `--primary-foreground`, `--secondary` y `--secondary-foreground` a mano, con los nombres de shadcn que ya usa la landing. No hay capa `--brand-*`.
- `--ring` y `--sidebar-primary` siguen a Primary.
- Primary y Secondary no entran en `GLOSSARY.md`: son tokens de diseño.

## Alcance

Primary va en el thumbnail seleccionado, el botón «full bleed», el template «Single», los `Button` de shadcn que ya usan `bg-primary` y el foco de teclado (`--ring`). En la Cover: la pestaña activa del Tool menu, el botón «Listo» y el botón flotante «Edit cover» activo. Los botones flotantes «Pay» y «Preview PDF» usan Secondary. La barra superior de la Cover es la de `brand` sin la quick preview.

No cambia:

- El modo oscuro (`.dark` en `main.css`).
- Los fondos del Tool panel y del Asset panel: blancos, como en Penpot. Solo sus controles usan Secondary donde el diseño ya lo muestra.
- Los grises: `neutral-*` y `bg-white`. El usuario dirá cuándo cambiarlos; entonces se añadirán a `main.css`.
- `--destructive` (rojo).
- El cuadro de edición del slot (`ring-neutral-900` en `SlotCell.vue`).
- El **Color scheme** de la Cover y las Illustrations: son contenido del usuario.
- `border-blue-500` (2 usos en `CoverPreview.vue`, la selección del texto de la Cover). El usuario lo cambiará si lo necesita.
- El aviso de baja resolución (`bg-amber-100`, `text-amber-800` en `SlotCell.vue`).

## Checklist

- [x] `main.css` define los cuatro tokens con los valores de la tabla.
- [x] La barra superior usa Secondary al 100 %.
- [x] La barra superior muestra el logo secondary a la izquierda del selector de producto.
- [ ] Los links de texto usan el 80 % y pasan a 100 % con hover (cuando exista el footer).
- [ ] Los botones primarios, el estado seleccionado y el foco usan Primary, con su hover y su active.
- [x] El proyecto `wiski` de Penpot tiene ocho estilos de color en la carpeta `brand` (2026-11-13): `primary`, `-hover`, `-active`, `-foreground` y los mismos de `secondary`. Penpot no calcula `color-mix`: hover y active son hex aproximados sobre blanco.
- [x] `Design ready` (2026-11-23): el usuario aprobó el diseño de `Worksheet / brand` y de la Cover (frame `Worksheet / Cover / brand top bar`).
- [ ] La interfaz en Chrome coincide con Penpot (ver «Visual check» en `CLAUDE.md`), incluidos el hover y el active reales.

## Estado del diseño (2026-11-23)

Hecho en Penpot:

- `Worksheet / brand` es el board de referencia; el usuario lo actualizó el 2026-11-23. El board `Worksheet / Empty` ya no existe en Penpot.
- `Worksheet/cover`: la pestaña activa y «Listo» en Primary, enlazados a `brand/primary`, en los seis boards (aprobado el 2026-11-23).
- Frame `Worksheet / Cover / brand top bar`: la Cover con la barra verde de `brand` (sin quick preview, que la Cover no muestra) y los botones flotantes con color (2026-11-23). Es la referencia de la Cover; los otros seis boards de la página aún tienen la barra blanca.

Fuera del `Design ready`: el resto de boards se migra a los colores de marca cuando el usuario los toque, no como requisito de este spec.

- Los otros nueve boards de la página `Worksheet`: Route Framed, Route Full bleed, Slot editing, Moment, Product menu open, Change product confirm, Dragging over slot, Dragging over trash, Quick preview / states.
- Los otros cinco boards de `Worksheet/cover` (barra blanca y botones flotantes negros).
- La página `purchase summary`.

Se comprueban en Chrome, no en Penpot: el hover y el active reales de ambos colores (los hex de Penpot son aproximaciones sobre blanco) y el contraste de `#fafafa` sobre Primary.

## Orden de trabajo

1. Cambiar `main.css` y los componentes que usan Primary.
2. Comparar en Chrome contra Penpot.
