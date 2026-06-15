# Plan de Implementación: Carrusel de Guía de Bienvenida

Añadiremos un modal flotante e interactivo de guía de bienvenida (carrusel de pasos) para que los usuarios aprendan a usar las herramientas clave del portal. Al finalizar la guía, se animará al usuario a programar su primera tarea redireccionándolo automáticamente a la pestaña de "Agenda y Tareas".

## User Review Required

> [!NOTE]
> La guía se abrirá automáticamente la primera vez que un usuario complete el onboarding o inicie sesión. Para no saturar la base de datos, el estado de visualización se almacenará de manera local en el navegador del cliente (`localStorage` con la clave `cl_seen_guide`).

## Proposed Changes

---

### [NEW] [UserGuideModal.jsx](file:///c:/Users/Crispis/Documents/Cosmic%20Love/src/components/UserGuideModal.jsx)

Crearemos un nuevo componente que implementa el carrusel de pasos. Se renderizará en el nodo raíz `document.body` mediante un React Portal para evitar conflictos de scroll o posicionamiento en móviles.

#### Características clave:
- **Slide 1: ¡Bienvenida a Cosmic Love!** — Presentación del portal con iconos elegantes de destellos.
- **Slide 2: Presupuesto Inteligente** — Explicación de gastos reales, buscador y exportación a Excel.
- **Slide 3: Lista de Invitados & Seating** — Explicación de cómo gestionar invitados y ubicarlos en mesas.
- **Slide 4: Invitación Digital Premium** — Explicación del diseño personalizado y enlace RSVP público.
- **Slide 5: Comienza tu Agenda** — Mensaje de motivación: *"¡Vamos a programar tu primer hito en la agenda! Haz clic abajo y te llevaremos a la Guía de Tiempos para añadir tu primera tarea sugerida."*
- **Acción final**: Al pulsar el botón del último paso, se cierra el modal, se guarda el estado en `localStorage` y se cambia la pestaña activa a `"calendar"`.

---

### [MODIFY] [App.jsx](file:///c:/Users/Crispis/Documents/Cosmic%20Love/src/App.jsx)

Actualizaremos la estructura principal para integrar el modal de guía:
1. **Definición de Estados**:
   - `const [showGuideModal, setShowGuideModal] = useState(false);`
2. **Auto-apertura**:
   - Comprobación en un `useEffect` para mostrar la guía si el usuario ha completado el onboarding pero aún no ha visto la guía (`localStorage.getItem('cl_seen_guide') !== 'true'`).
3. **Acceso desde Sidebar**:
   - Añadido un pequeño enlace discreto en el pie de página de la barra lateral (`sidebar-footer`) con el icono de `HelpCircle` llamado **"Guía del Portal"** para que puedan repasar los pasos cuando lo deseen.
4. **Renderizado de Componente**:
   - Añadir `<UserGuideModal isOpen={showGuideModal} onClose={() => setShowGuideModal(false)} setActiveTab={setActiveTab} />`.

---

## Verification Plan

### Manual Verification
1. Borrar el `localStorage` en herramientas de desarrollo del navegador e iniciar sesión para verificar que la guía se abre automáticamente.
2. Navegar a través de los pasos 1 a 5 pulsando "Siguiente" y "Atrás".
3. En el paso 5, verificar que el botón final dice "¡Ir a la Agenda!" y que al pulsarlo:
   - El modal se cierra limpiamente.
   - El portal cambia automáticamente a la pestaña de "Agenda y Tareas".
   - `localStorage` se actualiza con `cl_seen_guide: true`.
4. Pulsar el botón "Guía del Portal" en la barra lateral para verificar que el modal se abre de nuevo correctamente.
