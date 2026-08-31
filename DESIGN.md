---
version: alpha
name: "Desafío Blockchain"
description: "Cuaderno de laboratorio digital para una secuencia escolar autoasistida sobre blockchain."
colors:
  canvas: "#E8EEF5"
  surface: "#FFFFFF"
  ink: "#0F172A"
  muted: "#64748B"
  border: "#CBD5E1"
  primary: "#4F46E5"
  primary-strong: "#3730A3"
  accent: "#0891B2"
  success: "#059669"
  warning: "#D97706"
  danger: "#DC2626"
  focus: "#6366F1"
typography:
  display:
    fontFamily: "Bahnschrift, Segoe UI Variable, Segoe UI, sans-serif"
    fontSize: "2rem"
    lineHeight: "1.05"
  body:
    fontFamily: "Segoe UI Variable, Segoe UI, system-ui, sans-serif"
    fontSize: "0.95rem"
    lineHeight: "1.55"
  technical:
    fontFamily: "Cascadia Mono, Consolas, monospace"
    fontSize: "0.82rem"
    lineHeight: "1.45"
rounded:
  sm: "0.5rem"
  md: "0.75rem"
  lg: "1rem"
  panel: "1.5rem"
spacing:
  compact: "0.75rem"
  control: "1rem"
  panel: "1.5rem"
  page: "2rem"
components:
  navigation-drawer:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface}"
    width: "22rem"
    rounded: "{rounded.panel}"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.md}"
---

# Desafío Blockchain Design System

## Overview

### Creative North Star

La interfaz se comporta como un **cuaderno de laboratorio técnico escolar**: una superficie cuadriculada tenue, fichas blancas legibles y anotaciones de proceso en grafito, índigo y monoespaciado. Debe sentirse preparada para observar, probar y registrar; no como una plataforma financiera ni como una landing de criptomonedas.

### Product context and register

- **Audiencia y tarea principal:** estudiantes de cuarto año de secundaria que recorren dos encuentros sobre blockchain con autonomía guiada.
- **Mercado y evidencia:** escuela secundaria argentina; surge del brief pedagógico mantenido en `C:\00\et12-blockchain\CONTEXTO_SECUENCIA_BLOCKCHAIN.md`.
- **Idioma:** español rioplatense consistente; instrucciones directas, breves y en segunda persona.
- **Escena de uso:** notebooks escolares de 11 pulgadas, normalmente 1366×768, uso compartido o en parejas y posible conectividad inestable.
- **Registro:** producto educativo. La claridad de la tarea, el progreso y la recuperación ganan sobre la expresión de marca.
- **Firma memorable:** la pestaña lateral `›` y la trama de hoja técnica conectan navegación, bloques y secuencia sin ocupar el viewport.
- **Presentación institucional:** la entrada declara en gran escala “Espacios de incubación para proyectos de Blockchain”; el resto de las pantallas conserva la densidad de trabajo escolar.
- **Contención:** tarjetas, formularios y glosario permanecen silenciosos; no reciben gradientes, sombras o animaciones decorativas adicionales.
- **Anti-referencias:** exchanges de criptomonedas, estética cyberpunk/neón, dashboards financieros y plantillas SaaS con gradientes decorativos. Desvían el foco hacia especulación o complejidad técnica.
- **Propiedad de tokens:** modelo B. `src/index.css` es la fuente runtime canónica; este archivo refleja valores aceptados. Tailwind aporta utilidades heredadas y la migración a variables es gradual mediante componentes compartidos.

## Colors

`canvas` representa el papel técnico y aloja una grilla índigo de muy bajo contraste. `surface` contiene lectura y producción. `ink`, `muted` y `border` establecen la jerarquía neutral. `primary` identifica avance y selección; `accent` queda reservado para información técnica. `success`, `warning` y `danger` son semánticos y nunca sustituyen texto o iconografía. `focus` debe ser visible sobre superficies claras y oscuras.

La aplicación mantiene un único tema claro. El drawer usa `ink` como superficie oscura funcional. En colores forzados se delegan foco y scroll al sistema operativo.

## Typography

Los títulos usan Bahnschrift cuando Windows la ofrece y caen a Segoe UI. Su construcción condensada recuerda rotulación técnica sin afectar la lectura. El cuerpo usa Segoe UI Variable/Segoe UI para evitar depender de fuentes web durante la clase. Valores, hashes y llamadas técnicas usan Cascadia Mono o Consolas.

En 1366×768 el cuerpo base es 15,2 px y los textos auxiliares no bajan de 11,5 px. Los párrafos importantes envuelven; solo los previews del glosario pueden truncarse.

## Layout

El contenido reserva 48 px a la izquierda para la pestaña de navegación. El drawer es modal, mide como máximo 22 rem y nunca empuja el contenido. La superficie utiliza una trama de 24 px que funciona como ritmo visual, no como decoración protagonista.

Teoría, conceptos y laboratorio caben en el alto visible a partir de 720 px de altura. El laboratorio usa una barra lateral de cuatro etapas y reemplaza el contenido dentro de un único panel, sin scroll del documento. Recorrido y glosario mantienen scroll natural. En pantallas angostas se permite reflujo y no se fuerza el contrato de viewport de la presentación.

## Elevation & Depth

La jerarquía normal usa contraste tonal y bordes. Las sombras suaves se reservan para tarjetas elevadas y estados seleccionados. El drawer y su backdrop son la única capa de alto énfasis. Tooltips y paneles flotantes deben seguir la escala `--z-*` definida en `src/index.css`.

## Shapes

Controles: 12 px. Tarjetas: 16 px. Paneles principales: hasta 24 px. Las formas circulares se reservan para estados, pasos o iconos pequeños. Evitar mezclar radios grandes sin una diferencia real de jerarquía.

## Components

### Foundational visual states

Todo control habilitado tiene cursor, hover, estado activo y foco visible de 3 px. Los estados deshabilitados reducen contraste y no aceptan interacción. Los estados correctos o erróneos combinan color con texto o símbolo. El indicador de carga conserva el tamaño del control.

### Buttons and actions

Cada área de decisión tiene una acción primaria índigo. Las acciones secundarias usan borde o apariencia neutra. Avanzar, guardar, leer, firmar y cerrar conservan sus verbos en todo el flujo. Los botones importantes apuntan a 44 px de alto mínimo.

### Navigation and data display

La navegación global es un drawer modal izquierdo. Al abrirse vuelve inerte el contenido, atrapa el foco, responde a Escape y restaura el foco en `›`. La ruta actual se indica con fondo y borde, no solo con color. Los gráficos priorizan relaciones completas en 1366×768 y evitan scroll horizontal oculto.

El laboratorio tiene navegación local persistente: seis etapas numeradas, bloqueo solo hacia adelante y retorno libre a todo paso ya habilitado. Cada etapa combina una explicación, un esquema visual y una única decisión principal. Las comprobaciones breves habilitan acciones; nunca reemplazan la explicación del resultado.

El crédito de facilitación y el enlace al repositorio público forman un pie global fijo, compacto y de alto contraste. Debe permanecer legible sin competir con la tarea ni ocultar controles.

### Forms and overlays

Los campos tienen etiqueta visible envolvente, foco índigo y valores preservados. Las áreas de texto no pueden redimensionarse y ofrecen cuatro filas como base. El drawer y el narrador deben mantener acciones alcanzables en 768 px de alto. No se usan diálogos nativos del navegador.

### Iconography

Los emoji funcionan como apoyo pedagógico, nunca como única etiqueta de una acción. Los controles con un único símbolo incluyen nombre accesible. No mezclar iconos de criptomonedas para conceptos que no sean financieros.

### Motion

Las transiciones de 200–300 ms explican apertura, cierre o cambio de etapa. No se agregan animaciones ambientales. `prefers-reduced-motion` reduce todo movimiento a cambios prácticamente instantáneos.

La prueba de resiliencia es la excepción pedagógica: muestra tráfico continuo en la red sana y una secuencia temporal explícita de alarma, validación, reparación y recuperación. El sonido sintético se inicia únicamente por acción del estudiante, es breve y complementa —nunca reemplaza— texto y color.

### Content and data visualization

La voz es directa y conversacional. Cada pantalla dice qué hacer, qué observar y cuándo termina. Los diagramas usan índigo para estructura, verde para confirmación y ámbar para atención. Toda relación esencial también aparece en texto.

## Do's and Don'ts

- **Do:** conservar el cuaderno técnico como soporte silencioso de la actividad.
- **Do:** verificar las rutas principales en 1366×768 antes de publicar.
- **Do:** mantener teoría, laboratorio, glosario y recorrido dentro de una misma navegación.
- **Don't:** introducir estética de trading, neón o especulación financiera.
- **Don't:** ocultar instrucciones, respuestas o controles detrás de hover o truncamiento irreversible.
- **Don't:** agregar nuevas fuentes, APIs o dependencias críticas para la clase sin modo de falla.
