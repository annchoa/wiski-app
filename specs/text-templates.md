# Text templates de la Cover

## Estado

**Pendiente de que el usuario confirme.** Este texto recoge lo decidido en la sesión de preguntas del 2026-11-13. El usuario aún no lo ha revisado entero: hasta que lo confirme, no se implementa nada. Falta además rehacer el tablero de Penpot con las 7 tarjetas.

## Goal

El usuario arrastra un **Text template** desde la pestaña Plantillas del Tool panel hasta la Cover preview. El Title y la Date line toman la combinación de Typefaces y las cajas de texto del template, y quedan donde el usuario los suelta. Es lo único nuevo: el modelo y la edición de cada texto ya existen y no se especifican aquí, salvo lo que este spec cambia. Las Pages no tienen texto y quedan fuera. Marca cada punto con `[x]` cuando se cumpla.

## Nombres

- **Text template** es el término de código, de `GLOSSARY.md` y de los commits.
- «Plantillas» es la etiqueta que ve el usuario.
- No es el **Template** de una Page (conjunto de Slots). No lo reutiliza ni lo modifica.

## Checklist

- [ ] La pestaña **Plantillas** es el primer ítem del Tool menu, antes de Colores, y el Tool panel abre en ella.
- [ ] La lista muestra los mismos 7 Text templates en cualquier Product, como tarjetas de 180×110.
- [ ] El usuario arrastra una tarjeta hasta la Cover preview. Al soltarla, el centro del conjunto queda donde la soltó, aunque se salga de la hoja.
- [ ] Un clic o Enter en una tarjeta aplica el template en la posición actual del Title.
- [ ] Aplicar un Text template no toca las Illustrations, el Color scheme ni lo que el usuario escribió.
- [ ] Aplicar un Text template recrea el Title o la Date line si estaban borrados.
- [ ] Aplicar un Text template no deja ningún texto seleccionado y el panel sigue en Plantillas.
- [ ] Aplicar un Text template cambia la capitalización del Title y de la Date line.
- [ ] La lista marca el Text template aplicado y la marca desaparece en cuanto el usuario modifica un texto de la Cover.
- [ ] Los textos de la Cover parten una palabra sola donde acaba el ancho de su caja.
- [ ] Los textos salen de `i18n` en `es` y `en`.

## Qué es un Text template

Una combinación de Typefaces para el Title y la Date line, como las de Canva. Solo cuenta la **caja de los textos**, no la hoja. No depende del Product: hay una sola lista.

Fija, para el Title y para la Date line:

- Typeface.
- Letter size, y los demás valores de formato de [cover-text-editing](cover-text-editing.md): Line spacing, Letter spacing, Underline, Strikethrough y Alignment. El Letter size no pasa de 150 pt, el límite actual.
- **Case** (capitalización), nuevo.
- La caja de cada texto: su ancho, y la posición de la Date line respecto a la parte superior del Title. El desplazamiento es fijo.
- La posición en la hoja **no** se fija: la decide el usuario al soltar.

No cambia: el contenido de los textos, las Illustrations, el Color scheme.

Los datos viven en un módulo de `src/lib/` (propuesto: `textTemplates.ts`), junto a `typefaces.ts` y `colorSchemes.ts`. Las unidades son fracciones del ancho de la hoja, como el resto del modelo.

**La lista**: 7 templates, los 6 cuadrados del diseño anterior más `tall 1` (Dancing Script). Los otros 5 altos eran el mismo diseño que un cuadrado y se descartan.

## Aplicar un template

La caja del conjunto es el rectángulo que envuelve el Title y la Date line.

- **Arrastrando**: el centro de la caja del conjunto queda bajo el cursor al soltar. No hay ajuste al borde: el conjunto puede salirse de la hoja.
- **Con clic o Enter**: la esquina superior izquierda del conjunto toma la del Title actual. Si no hay Title, la de la Date line. Si no hay ninguno, el conjunto queda centrado en la hoja.
- **Date line**: su desplazamiento se mide desde la parte superior del Title. Si el usuario escribe un Title más alto, puede tapar la Date line, y el usuario la mueve a mano.
- **Textos borrados**: el template recrea el Title o la Date line que falte, con su contenido por defecto. Se quita la regla «no se crean textos nuevos». Solo un Text template crea textos: el usuario no puede añadir otros.
- **Capa**: un texto recreado queda encima de todo, también de las Illustrations. Los textos que ya existían conservan su capa.
- **Selección**: tras aplicar, ningún texto queda seleccionado y el panel sigue en Plantillas. Seleccionar un texto cambiaría el panel a Tipografías.

## Arrastrar y soltar

- La tarjeta es el elemento que se arrastra; la Cover preview es el destino.
- Mientras el cursor está fuera de la Cover preview, la tarjeta sigue al cursor a su tamaño de 180×110. Al entrar en ella, se amplía al tamaño real del conjunto (×3) y se centra en el cursor, para ver dónde y con qué tamaño caerá. Es el mismo recurso que usan las fotos sobre la papelera (`overOverlay`).
- Se usa la misma librería de arrastre que las fotos (`@vue-dnd-kit/core`). Los gestos de arrastre no se simulan en happy-dom: se revisan en Chrome.

## Case

`Case` es una propiedad de render por texto, no un cambio de los caracteres. El modelo guarda lo que el usuario escribió y la vista lo muestra con el Case.

- `none`: sin cambio.
- `upper`: todo en mayúsculas.
- `first`: solo la primera letra en mayúscula. «septiembre 2026» se ve «Septiembre 2026».

Cambiar a otro Text template cambia el Case y no pierde el texto original. El Case no es el `capitalize` de CSS, que pondría en mayúscula cada palabra del Title.

## Saltos de línea

- No hay aviso: el diseño anterior (icono con tooltip) se descarta.
- Los textos de la Cover pasan a llevar `overflow-wrap: anywhere`, además del `whitespace-pre-wrap` actual. Una palabra sola se parte en cualquier letra donde acaba el ancho de su caja: `Chimborazo` sale `CHIMBO / RAZO`, no por sílabas.
- Las tarjetas de Penpot con `CHIM / BO / RA / ZO` llevan saltos manuales. En la app el corte lo hace el ancho de la caja y puede no coincidir exactamente.
- Los saltos que el usuario ya escribió se conservan al cambiar de Text template.

## Tarjetas

- Cada tarjeta muestra el Title y la Date line apilados y centrados, con «Chimborazo» y «septiembre 2026», en su Typeface y su Case, sin importar lo que el usuario escribió.
- Tamaño: 180×110, el de `Template / square 1 example` en Penpot. La tarjeta es la hoja entera a escala 1/3: 180 px = el ancho de la hoja.
- Colores fijos: fondo blanco y texto `#3b2a1a`, como en el diseño. No usa el Color scheme activo.

## Marca de selección

- Tras aplicar un Text template, la lista lo marca con el borde negro de 2 px de los Typefaces.
- En cuanto el usuario modifica un texto de la Cover (mover, escalar, cambiar el ancho, editar el contenido, Typeface o formato), la lista no marca ninguno.
- Aplicar el mismo u otro Text template vuelve a marcarlo.
- Cambiar de Product crea una Cover nueva: la lista no marca ninguno. La lista no cambia de contenido.

## Diseño

- 2026-11-13: el usuario cambió de decisión dos veces. Los Text templates no siguen el tamaño del Product y se arrastran a la Cover.
- `template example` (180×112, radio 12, borde de 1 px `#e5e5e5`) y `Template / square 1 example` (180×110, sin borde) son los ejemplos del usuario. En el segundo, «Chimborazo» (Molle 30) y «Septiembre 2026» (Montserrat 15 bold) están en la parte de arriba de la tarjeta.
- Hay que convertir 7 templates a tarjetas y rehacer el tablero `Worksheet / Cover / Templates (tooltip open)`, que es del diseño anterior (thumbnails cuadrados y tooltip). Las tarjetas van en dos columnas, sin tooltip.
- Al convertir, el Title del antiguo template 5 (150 px de una hoja de 540, unos 157 pt) baja a 150 pt.
- Sigue válido: el Tool menu con cuatro ítems y Plantillas primero, y la pestaña sin barra de formato.

## Para implementar (TDD, skill `tdd`)

Seams propuestos, a confirmar:

- `applyTextTemplate(cover, template, at)` en el modelo `createCover`: pura. Tests por cada valor que cambia, por cada valor que se conserva (texto, saltos de línea, Illustrations, Color scheme), por la posición dada y por recrear un texto borrado.
- `Case` en el modelo y su aplicación en `CoverPreview`.
- Componente de la lista de Plantillas, como `ToolPanel`.
- El cableado de arrastre y de clic en `WorksheetView` / `CoverPreview`.

No se testea el comportamiento de `text-transform` ni de `overflow-wrap` del navegador, ni el de la librería de arrastre: se testea que la vista pida el Case correcto y que la función pura reciba la posición.

## Open questions

- Ninguna sobre el comportamiento. Falta que el usuario confirme este texto.
