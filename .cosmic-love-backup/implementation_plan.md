# Plan de Implementación: Corrección de Sincronización e Inicialización de Invitados

Este plan describe la solución para resolver el fallo crítico en la sincronización de la base de datos de invitados cuando se completa el onboarding o se realiza una confirmación de asistencia (RSVP).

## Problema

Actualmente, al completar el Onboarding o migrar datos locales, las inserciones en la base de datos de Supabase para las tablas (`tables`) y los invitados (`guests`) se ejecutan en paralelo mediante `Promise.all`. 

Dado que los invitados por defecto contienen una relación de clave foránea con la tabla de mesas (`table_id REFERENCES tables(id)`), la inserción concurrente produce un error de violación de clave foránea (`foreign key violation`) en PostgreSQL si la inserción de invitados se ejecuta antes de que finalice la de mesas.

Esto causa los siguientes efectos:
1. La inserción de los invitados por defecto falla silenciosamente en Supabase (no se guardan en la base de datos).
2. Sin embargo, se guardan en el estado de React en memoria, haciendo que el panel parezca correcto temporalmente.
3. Cuando un invitado real confirma asistencia desde la invitación pública, este se guarda correctamente en la base de datos (con `table_id: null`).
4. Al recargar la página, cerrar sesión o iniciar sesión de nuevo, la aplicación descarga de Supabase únicamente los registros que sí se guardaron correctamente, eliminando los invitados por defecto (ya que nunca existieron en la base de datos) y mostrando únicamente el nuevo invitado que hizo RSVP.

## Cambios Propuestos

### [App.jsx](file:///c:/Users/Crispis/Documents/Cosmic%20Love/src/App.jsx)

#### 1. Modificar `handleOnboardingComplete`
- Cambiar la inicialización para insertar primero las mesas (`tables`) y esperar a que la inserción de Supabase se complete y verificar posibles errores.
- Una vez guardadas las mesas, ejecutar en paralelo las inserciones de `budget_items`, `guests` y `events` usando `Promise.all`.
- Verificar y lanzar explícitamente errores en cada llamada a Supabase para evitar fallos silenciosos.

#### 2. Modificar `handleMigrateLocalData`
- Aplicar la misma lógica de secuenciación: si existen mesas locales guardadas, insertarlas primero.
- Posteriormente, insertar de forma concurrente el presupuesto, los invitados y la agenda, comprobando que las claves foráneas de mesas apunten a filas ya existentes.
- Añadir el control de errores adecuado.

---

## Plan de Verificación

### Pruebas Automatizadas
- Ejecutaremos el script de prueba local `test_supabase.js` antes y después para comprobar el estado de las tablas de Supabase.
- Construiremos el proyecto localmente (`npm run build`) para descartar errores de sintaxis y tipos.

### Verificación Manual
1. **Restablecer cuenta**: Usar el botón de "Restablecer cuenta" en el portal para limpiar la base de datos y forzar el onboarding.
2. **Completar Onboarding**: Rellenar el formulario de bienvenida y verificar en Supabase mediante el script de base de datos que se han guardado las mesas y los 12 invitados por defecto correspondientes al nuevo ID de boda.
3. **Enviar Confirmación**: Abrir el enlace de invitación pública de la boda, confirmar asistencia para un invitado simulado (ej: "Invitado Confirmado Prueba") y verificar la recepción en la base de datos.
4. **Persistencia**: Recargar el panel principal y cerrar/abrir sesión para verificar que conviven correctamente tanto los invitados por defecto como el nuevo invitado de la confirmación RSVP.
