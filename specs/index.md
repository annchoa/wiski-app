# Specs

Índice de specs. Las ideas sin spec están en [ideas.md](ideas.md).

| Spec | Estado | Design ready | Aprobado | Resumen |
| --- | --- | --- | --- | --- |
| [brand-colors](brand-colors.md) | done | ✅ | ✅ | `Design ready` el 2026-11-23 (`Worksheet / brand` y la Cover). Sin JSON compartido: tokens a mano en `main.css`; barra superior con Secondary al 100 %, el 80 % solo en links de texto. Hecho el 2026-11-23: tokens, barra superior con logo, botones flotantes, pestaña activa y «Listo». El usuario dio el spec por aprobado y terminado el 2026-11-23, con tres puntos sin marcar (links de texto, Primary en botones y foco, comparación en Chrome). |
| [cover-text-editing](cover-text-editing.md) | done | ✅ | ✅ | Implementado el 2026-11-13 con 224 tests en verde. El usuario revisó la barra y el popover en Chrome contra Penpot. |
| [illustrations](illustrations.md) | pending | ❌️ | ❌️ | Hechos: skill `add-illustration`, créditos en JSON y tamaño máximo de impresión de las PNG. Faltan revisar la flor y la de Arl en el navegador, y el footer de créditos (sin diseño). |
| [text-templates](text-templates.md) | pending | ❌️ | ❌️ | Comportamiento decidido el 2026-11-13 y escrito en el spec, a la espera de que el usuario lo confirme. Falta convertir 7 templates a tarjetas y rehacer el tablero de Penpot. |
| [home-brand](home-brand.md) | pending | ✅ | ❌️ | Escrito el 2026-11-23 con diseño en `Home / Desktop / brand top bar` y `Home / Mobile / brand top bar`: barra verde con logo enlazado a la landing, título en Primary, tarjetas sin borde y footer en Secondary. Implementado el 2026-11-23 con 231 tests en verde; falta la comparación en Chrome con el usuario y su aprobación. |
| [database](database.md) | pending | — | ✅ | Aprobado el 2026-11-24 tras la sesión de grilling: esquema SQLite con una Session por URL, `version` para editar desde dos dispositivos y `orders` para el pedido. Sin diseño de UI. Falta implementarlo. |
| [language-selector](language-selector.md) | done | ✅ | ✅ | Implementado el 2026-11-23 con 231 tests en verde. El usuario lo revisó en Chrome contra Penpot (`Worksheet / brand ejemplo logo` y `Worksheet / Cover / brand top bar`) y lo aprobó. |
