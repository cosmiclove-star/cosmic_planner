# Walkthrough - Adaptación Móvil del Calendario

Hemos completado la adaptación del calendario en la sección de **Agenda y Tareas** para que la versión móvil se visualice de manera más fluida, limpia y con celdas circulares en lugar de bloques rectangulares rígidos.

## Cambios Realizados

### [CalendarPlanner.jsx](file:///c:/Users/Crispis/Documents/Cosmic%20Love/src/components/CalendarPlanner.jsx)

1. **Reestructuración de Estilos en Línea a Clases CSS**:
   - Eliminados todos los estilos en línea (`style={{...}}`) de la cuadrícula del calendario (`.calendar-grid`), cabeceras (`.calendar-grid-header`), celdas de días (`.calendar-day-cell`) y elementos del día.
   - Centralizado todo el sistema de presentación en la sección `<style>` al final del componente, facilitando la responsividad por CSS puro.

2.- **Diseño Móvil Mejorado**:
   - **Forma Circular/Cuadrada**: Modificamos las celdas en dispositivos móviles (pantallas de ancho <= 768px) para que adopten una relación de aspecto 1:1 (`aspect-ratio: 1`) y un radio de borde redondeado al 50% (`border-radius: 50%`), eliminando las líneas cuadradas rígidas.
   - **Indicadores de Estado Elegantes**: Sustituimos las etiquetas de texto de las tareas por pequeños puntos de color dorado y verde (tareas completadas) centrados debajo del número de día.
   - **Visualización en Desktop**: Incrementamos a 3 las tareas visibles en desktop antes de mostrar el indicador "+ más", optimizando el espacio vertical del calendario.
   - **Limpieza de Ruidos Visuales**: En pantallas móviles, se ocultan la etiqueta de boda de las celdas y los textos adicionales del calendario para centrar la visualización en la fecha, confiando en el modal de día (que se despliega con un toque) para detallar las tareas.
   - **Ajuste de la Guía de Tiempos (Mobile-First / Explicit Override)**: Configuramos `.guide-tasks-list` para tener por defecto la altura restringida en escritorio, pero forzamos de manera explícita y prioritaria en pantallas <= 900px (`@media (max-width: 900px)`) las propiedades `height: auto !important`, `max-height: none !important` y `overflow-y: visible !important`. Esto asegura que el listado de tareas se expanda a su tamaño natural en cualquier dispositivo móvil o tablet de manera infalible.
   - **Depuración de Tareas Recomendadas**: Eliminamos del listado `PLANNING_GUIDE` los siguientes hitos a petición del usuario:
     - *Después del día de la boda*: "Descargar el álbum de Wedshoots" (eliminado).
     - *Última semana*: "Compartir las instrucciones de Wedshoots con vuestros invitados" (eliminado).
     - *Último mes*: "Crear vuestro álbum de boda con Wedshoots" (eliminado).
     - *De 4 a 6 meses antes*: "Comprar las arras" (eliminado).
   - **Alineación de Modales en Móvil (Margen de Altura 18vh)**: Ajustamos el margen superior de la alineación en `.modal-overlay` de `12vh` a `18vh` para desplazar el modal un poco más hacia abajo sobre la pantalla móvil, dejándolo más cómodo y alineado de forma de manera natural con la sección de la Guía de Tiempos sin estar tan arriba. El backdrop mantiene `overflow-y: auto !important` para pantallas pequeñas.
   - **Filtro de Tareas ya Programadas en la Guía**: Modificamos la lista de la guía de tiempos de Cosmic Love para excluir dinámicamente cualquier tarea recomendada que ya se encuentre programada en la agenda del usuario (realizando una comprobación por título insensible a mayúsculas/minúsculas y espacios). Si todas las tareas recomendadas para el periodo seleccionado ya han sido programadas, se muestra un mensaje informativo especial: *"✨ ¡Todas las tareas de este plazo ya están en tu agenda!"*.

### [BudgetManager.jsx](file:///c:/Users/Crispis/Documents/Cosmic%20Love/src/components/BudgetManager.jsx)
- **Exportación a Excel (CSV)**:
  - Añadido el botón "Exportar Excel" al encabezado de la sección de detalle de gastos.
  - Implementada la función `handleExportCSV` que genera y descarga dinámicamente un archivo `.csv` compatible con Excel en español (utiliza el BOM UTF-8 `\uFEFF` para reconocer caracteres especiales como `€` y tildes, delimitadores de punto y coma `;` y conversión de decimales a coma `,`).
- **Reposicionamiento de la Papelera en Móvil**:
  - Ajustada la celda de eliminación (`td:nth-child(5)`) para posicionarse de forma absoluta en la esquina superior derecha (`position: absolute; top: 16px; right: 16px;`) en pantallas móviles (ancho ≤ 768px).
  - Removido el borde superior, fondo, y altura de la papelera en móvil (`.btn-delete`), quedando como un icono pequeño y limpio de 24x24px sin líneas.
  - Incrementado el espaciado derecho en el concepto del gasto (`td:nth-child(1)`) a `36px` para evitar cualquier solapamiento.
  - Se configuró el botón de estado de pago (`td:nth-child(4)`) para ocupar el 100% del ancho del elemento.

### [Onboarding.jsx](file:///c:/Users/Crispis/Documents/Cosmic%20Love/src/components/Onboarding.jsx)
- **Ajuste de Espaciados en Paso 3 (Presupuesto y Prioridades)**:
  - Reducido el margen inferior del título principal a `4px` y el del subtítulo a `18px` para evitar excesivo espacio vacío.
  - Reducido el margen inferior del bloque del slider de presupuesto a `16px` para acercar ambos paneles.
- **Granularidad en Selección de Presupuesto**:
  - Modificado el salto (`step`) del selector de presupuesto estimado a `5000` (anteriormente `25000`), ofreciendo ahora múltiples cifras intermedias (como 35.000 €, 40.000 €, 45.000 €, 50.000 €) en lugar de saltar directamente de 30.000 € a 55.000 €.
- **Adición de Prioridad "Otras"**:
  - Incluida la opción `"Otras"` dentro del listado de prioridades/foco del paso 3 del onboarding (`['Catering y Banquete', 'Fotografía y Video', ..., 'Otras']`).
- **Mejora del Interlineado y Tamaño de Títulos en Móvil**:
  - Definido un interlineado ajustado de `line-height: 1.2` de forma global para los títulos principales de los pasos (`.step-title`) y `line-height: 1.4` para las descripciones (`.step-desc`), eliminando el espacio excesivamente alto heredado.
  - Añadidas reglas en la consulta de medios móviles (`@media (max-width: 600px)`) para reducir la tipografía de los títulos a `21px` (anteriormente `28px`) y las descripciones a `12.5px`, logrando que quepan más fácilmente en una sola línea en pantallas angostas.



### Ajustes de Nombres de Pareja (Mayúsculas y Tipografía de Marca)
- Modificados [Dashboard.jsx](file:///C:/Users/Crispis/Documents/Cosmic%20Love/src/components/Dashboard.jsx), [InvitationDesigner.jsx](file:///C:/Users/Crispis/Documents/Cosmic%20Love/src/components/InvitationDesigner.jsx) y [PublicInvitation.jsx](file:///C:/Users/Crispis/Documents/Cosmic%20Love/src/components/PublicInvitation.jsx) para sustituir el separador `&` por la letra `y` entre los nombres de la pareja.
- Convertido el formato de los nombres a mayúsculas sostenidas (`.toUpperCase()`) en el panel principal y las invitaciones.
- Aplicada la tipografía serif de marca `Fraunces` (`var(--font-serif)`) para los nombres de la pareja (estilo de tipografía editorial "Boutique").
- Unificada la tipografía del nexo `y` para que herede la misma tipografía de los nombres (`fontFamily: 'inherit'`), manteniendo un estilo editorial fluido y cohesivo.

### Visualización de Fecha Sugerida en Modales de Tareas
- Creada una función auxiliar `formatSuggestedDate` en [CalendarPlanner.jsx](file:///c:/Users/Crispis/Documents/Cosmic%20Love/src/components/CalendarPlanner.jsx) para parsear y dar formato local de fecha en español de manera consistente, evitando desplazamientos por zonas horarias.
- Actualizada la lógica de creación de tareas sugeridas para rastrear si el usuario mantiene la fecha de planificación por defecto (`isDefaultDate`).
- Aplicados estilos específicos en el input de fecha y mensajes informativos en el modal: la fecha sugerida por defecto se destaca en color dorado (`var(--gold-hover)`) con un aviso explicativo y cambia a colores estándar si el usuario introduce una fecha diferente de forma manual.

### Nueva Métrica de Progreso de Agenda en el Panel de Control
- Modificado [Dashboard.jsx](file:///C:/Users/Crispis/Documents/Cosmic%20Love/src/components/Dashboard.jsx) para calcular las estadísticas de tareas en la agenda (`totalEvents`, `completedEvents` y `eventsPercentage`).
- Reemplazada la tarjeta de estilo "Boutique" por una tarjeta métrica uniforme con barra de progreso que indica las tareas realizadas frente a las planificadas.
- Añadido un botón interactivo "Todas las Tareas" a la tarjeta de progreso para facilitar la navegación rápida a la vista de la agenda.

### Adaptación Responsiva de Métricas en el Panel
- Modificado [Dashboard.jsx](file:///C:/Users/Crispis/Documents/Cosmic%20Love/src/components/Dashboard.jsx) para reestructurar la cuadrícula de métricas en pantallas móviles: las tarjetas de Presupuesto e Invitados ahora se visualizan en una misma fila, lado a lado, mientras que la tarjeta de Progreso de la Agenda se sitúa debajo ocupando todo el ancho.
- Reducidos paddings y tamaños de fuente para `.metric-card` en resoluciones inferiores a 600px para garantizar un ajuste cómodo sin desbordamientos de texto.

### Reubicación del Calendario en el Panel de Control
- Desplazada la sección del **Calendario de Agenda y Tareas** en [Dashboard.jsx](file:///C:/Users/Crispis/Documents/Cosmic%20Love/src/components/Dashboard.jsx) para situarse inmediatamente debajo de la cuadrícula de métricas y por encima del grid inferior de prioridades y eventos de feria.

### Eliminación de Prioridades y Rediseño de Eventos Cosmic Love
- Removida por completo la sección **Tus Prioridades en Cosmic Love** de [Dashboard.jsx](file:///C:/Users/Crispis/Documents/Cosmic%20Love/src/components/Dashboard.jsx).
- Convertido el bloque de eventos en una sección a ancho completo (`100%`) posicionada al final de la página.
- Modificado el título de la sección a **Eventos Cosmic Love** con un subtítulo separado e italicizado **(solicita tu invitación gratuita)** ubicado debajo y en un tamaño de fuente menor (13px), logrando un diseño mucho más limpio y profesional.
- Añadida la información para la nueva feria de **Zaragoza** (4 de Octubre de 2026 en Espacio Ebro).
- Modificado el estilo CSS de `.fair-events-list` en [Dashboard.jsx](file:///C:/Users/Crispis/Documents/Cosmic%20Love/src/components/Dashboard.jsx) para desplegar las 4 tarjetas de ferias en una cuadrícula responsiva de **4 columnas** en ordenadores, **2 columnas** en tablets, y **1 columna** en móviles.
### [CalendarPlanner.jsx](file:///c:/Users/Crispis/Documents/Cosmic%20Love/src/components/CalendarPlanner.jsx)
- **Visualización Completa de Tareas en Guía**: Removida la restricción de línea única (`whiteSpace: 'nowrap'`, `overflow: 'hidden'`, y `textOverflow: 'ellipsis'`) en la lista de la Guía de Tiempos. Los títulos de las tareas ahora usan un flujo en bloque (`display: 'block'`) y una altura de línea holgada (`line-height: 1.4`), permitiendo que títulos largos en plazos como "4 a 6 meses" o "Después de la boda" se envuelvan y se lean completos en pantallas móviles. El icono del tooltip de ayuda se posiciona en línea (`display: 'inline-flex'`) siguiendo el texto de forma natural.
- **Prevención de Ocultamiento de Botones (flexShrink & Padding)**: Añadida la propiedad `flexShrink: 0` al botón de añadir tarea (`+`) para evitar que se comprima fuera de la pantalla en dispositivos móviles. Asimismo, se redujo el padding de la vista del calendario y las tarjetas en dispositivos móviles para ganar espacio horizontal y evitar recortes visuales.
- **Modales con React Portals (Evitar Scroll)**: Implementado `createPortal` para renderizar los modales en el nodo raíz `document.body`. Esto soluciona el problema de desalineación en móviles causado por la animación `.fade-in` (que alteraba el contexto de posicionamiento fijo). Ahora, al hacer clic en `+` desde el final de la pantalla, los modales se abren perfectamente centrados y visibles en el centro del viewport del usuario sin requerir scroll.
- **Fondo sin Desenfoque Difuminado (No-Blur)**: Eliminada la propiedad `backdrop-filter: blur(4px)` en la clase `.modal-overlay` para que el fondo de la pantalla detrás del modal no se difumine.
### [App.jsx](file:///c:/Users/Crispis/Documents/Cosmic%20Love/src/App.jsx)
- **Eliminación del Botón "Probar Onboarding"**: Removida la sección de pie de página lateral (`sidebar-footer`) que contenía el botón interactivo "Probar Onboarding" para limpiar la pantalla principal y evitar reajustes de cuenta accidentales.
- **Integración de la Guía de Ayuda**: Añadido un botón **"Guía del Portal"** en la barra lateral e implementado el disparador de auto-apertura para novias que inician sesión o completan su onboarding por primera vez.

### [UserGuideModal.jsx](file:///c:/Users/Crispis/Documents/Cosmic%20Love/src/components/UserGuideModal.jsx) [NEW]
- **Carrusel de Ayuda para Parejas**: Desarrollado un carrusel interactivo en 5 pasos que repasa visualmente las secciones del presupuesto, los invitados, la distribución de mesas, la invitación digital y la agenda.
- **Personalización de Copywriting (Paso 1, Paso 3 y Paso 5)**:
  - Paso 1: Título actualizado a `¡Bienvenid@ a tu Cosmic Planner!` (antes `"Tu Portal Cosmic Love"`) y descripción finalizada con `"cómo aprovechar al máximo esta herramienta"` (antes `"cómo aprovechar al máximo tu portal de bodas boutique"`).
  - Paso 3: Texto de descripción de Invitación Digital Premium actualizado a: `"Diseña tu invitación interactiva: personaliza el texto, elige música de fondo y copio el enlace para enviarlo por WhatsApp. Tus invitados podrán confirmar asistencia y dietas al instante."` (antes hacía referencia a tipografías serif de marca y a copiar enlace público).
  - Paso 5 (¡Vamos a tu Primera Tarea!): Se quitó la primera frase ("En Agenda y Tareas...") y se actualizó la descripción a: `"Pulsa el botón inferior para ir a la agenda y empieza creando tu primera cita según los plazos recomendados."`
- **Ajuste y Aumento de Tipografía**:
  - Incrementado el tamaño de fuente en la descripción de las diapositivas (`.guide-slide-desc`) a `15.5px` para pantallas de escritorio (antes `13.5px`) y a `14.5px` para pantallas móviles de menos de 600px de ancho (antes `12.5px`).
- **Fomento de la Primera Acción**: El botón del último paso incita a realizar la primera acción (*"¡Ir a la Agenda!"*). Al pulsarlo, se marca la guía como leída en `localStorage`, se cierra el modal y se redirige automáticamente al usuario a la vista de **Agenda y Tareas** para que añada su primera tarea recomendada.
- **Posicionamiento Seguro (React Portals)**: El modal se renderiza en el nodo principal de la página (`document.body`) para evitar fallos de visualización o scroll en dispositivos móviles.

### [BudgetManager.jsx](file:///c:/Users/Crispis/Documents/Cosmic%20Love/src/components/BudgetManager.jsx)
- **Formato de Moneda en Móvil (No-Wrapping)**: Implementada la regla `white-space: nowrap` y envoltorios inline en los valores de resumen de presupuesto ("Presupuesto Límite", "Gastos Estimados", "Coste Real Actual" y "Total Pagado") para garantizar que el símbolo de euros (`€`) se mantenga siempre en la misma línea que las cifras numéricas en pantallas estrechas.
- **Buscador y Filtro de Estado de Pagos**: Añadido un buscador de texto (`Buscar por concepto o categoría...`) y pestañas de filtrado ("Todos", "Pagados", "Pendientes") con contadores dinámicos encima del listado de gastos, facilitando identificar lo pagado y lo pendiente al instante.
- **Botón Exportar Excel Responsivo**: Ajustado el botón de exportación para que en pantallas móviles se visualice con un tamaño de letra de `8px`, relleno optimizado e icono reducido, adaptándose con elegancia a espacios pequeños.

## Resultados de la Verificación

- **Compilación e Integración**: Ejecutamos la tarea de producción (`npm run build`) completándose exitosamente.
- **Párrafo de Feria**: De acuerdo con las instrucciones, mantuvimos la segunda frase del párrafo original de la feria boutique en el componente [Dashboard.jsx](file:///C:/Users/Crispis/Documents/Cosmic%20Love/src/components/Dashboard.jsx) (`Ven a inspirarte y conocer a los mejores proveedores cara a cara:`).
- **Despliegue a Producción**: El proyecto ha sido desplegado exitosamente a Vercel en la URL oficial: [https://cosmic-love-portal.vercel.app](https://cosmic-love-portal.vercel.app).

