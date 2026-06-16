# Walkthrough - Corrección de Sincronización e Inicialización de Invitados

Hemos corregido con éxito el fallo de sincronización en la base de datos de invitados (`guests`) y mesas (`tables`) al completar el onboarding o confirmar asistencia (RSVP).

## Cambios Realizados

### [App.jsx](file:///c:/Users/Crispis/Documents/Cosmic%20Love/src/App.jsx)

1. **Evitar Colisiones de Clave Primaria (`id TEXT PRIMARY KEY`)**:
   - Anteriormente, las listas por defecto de mesas, invitados, presupuesto y eventos utilizaban IDs estáticos como `'t1'`, `'g1'`, `'1'`, etc. Debido a que el diseño de base de datos define `id` como `TEXT PRIMARY KEY` (que debe ser único en toda la tabla y no solo en la boda), cuando un segundo usuario se registraba y completaba el onboarding, se producía un error de clave duplicada (`23505 duplicate key value violates unique constraint`).
   - Hemos implementado la generación dinámica de IDs únicos usando un prefijo según la entidad, un valor aleatorio y una marca de tiempo (`t_`, `g_`, `b_`, `e_`) al inicializar los datos por defecto y al realizar la migración del almacenamiento local.
   - Actualizamos las referencias de relaciones (como `table_id` en los invitados) para que apunten a los nuevos identificadores generados.

2. **Resolución de Condición de Carrera en la Base de Datos**:
   - Modificamos `handleOnboardingComplete` y `handleMigrateLocalData` para realizar la inserción de datos de manera estrictamente secuencial:
     - **Paso A**: Insertar primero las mesas (`tables`) y esperar a que finalice la llamada de base de datos para garantizar que existan sus IDs.
     - **Paso B**: Ejecutar de forma concurrente mediante `Promise.all` las inserciones del presupuesto (`budget_items`), los invitados (`guests`) y la agenda (`events`). Dado que las mesas ya han sido insertadas previamente, PostgreSQL resuelve las claves foráneas de invitados (`table_id`) sin conflictos.

3. **Gestión y Control de Errores Activo**:
   - Se añadieron validaciones y excepciones explícitas al recibir las respuestas del cliente de Supabase (`if (res.error) throw res.error`), de manera que cualquier fallo impida estados inconsistentes y se alerte al usuario si el servidor experimenta algún error de red.

---

## Pruebas y Verificación

1. **Simulación de Onboarding Completo**:
   - Creamos un script de prueba automatizado `test_onboarding_flow.js` que simula el flujo de registro de un usuario, la inicialización del onboarding de su boda, la generación de IDs únicos y las inserciones ordenadas en Supabase.
   - El script se ejecutó de forma local y **completó con éxito todas las operaciones de inserción y validaciones de claves foráneas**, confirmando la eliminación total de colisiones.

2. **Compilación y Despliegue**:
   - Compilamos el proyecto de manera local (`npm run build`) para verificar que no hay errores de sintaxis y que el bundle de producción está completo.
   - Desplegamos la actualización en producción en Vercel. La dirección oficial del portal [https://cosmic-love-portal.vercel.app](https://cosmic-love-portal.vercel.app) ya incluye estas correcciones.

---

## Acciones Requeridas del Usuario (GitHub)

Dado que la herramienta de consola `git` no está disponible en la terminal interna actual, por favor ejecuta los siguientes comandos en tu terminal de Windows (`cmd` o `PowerShell`) para guardar tus progresos en el repositorio de GitHub:

```bash
git add .
git commit -m "Fix: db guest sync race conditions and primary key collisions"
git push
```
