# Walkthrough - Registro de Regalos e Integración con Presupuesto

Hemos implementado un sistema completo de registro de regalos para los invitados, integrado directamente las aportaciones monetarias en el gestor de presupuesto y añadido la exportación de la lista de invitados a un archivo CSV.

## Cambios Realizados

### 1. Base de Datos (Supabase)
* **Esquema de la Tabla `guests`**: Añadimos las columnas `gift_desc` (descripción del regalo) y `gift_amount` (importe monetario) al archivo de configuración [supabase_setup.sql](file:///c:/Users/Crispis/Documents/Cosmic%20Love/supabase_setup.sql).
* **Instrucciones de Migración**: Para aplicar este cambio en producción, se preparó la siguiente sentencia SQL:
  ```sql
  ALTER TABLE public.guests ADD COLUMN IF NOT EXISTS gift_desc TEXT DEFAULT '';
  ALTER TABLE public.guests ADD COLUMN IF NOT EXISTS gift_amount NUMERIC(12, 2) DEFAULT 0.00;
  ```

### 2. Sincronización de Datos ([App.jsx](file:///c:/Users/Crispis/Documents/Cosmic%20Love/src/App.jsx))
* **Carga de Datos**: Modificamos `fetchWeddingData` para cargar las nuevas columnas de regalos al estado de React.
* **Onboarding y Migración**: Actualizamos `handleMigrateLocalData` y `handleOnboardingComplete` para persistir estas columnas en la base de datos de Supabase.
* **Sincronización en Tiempo Real**: Ajustamos `handleSetGuests` para sincronizar los cambios de regalos mediante operaciones `insert` y `update`.
* **Prop a Presupuesto**: Ahora el estado de `guests` se pasa como prop a `<BudgetManager />`.

### 3. Registro de Regalos y Exportación CSV ([GuestListManager.jsx](file:///c:/Users/Crispis/Documents/Cosmic%20Love/src/components/GuestListManager.jsx))
* **Campos Editables en Línea**: Agregamos dos inputs (`text` y `number`) en la tabla de invitados para ingresar la descripción del regalo y el importe. Los cambios se guardan y sincronizan automáticamente.
* **Tarjeta de Resumen**: Añadimos la tarjeta **Regalos Recibidos** en la cabecera que muestra la suma total acumulada y el número de regalos registrados.
* **Rediseño del Grid**: Se amplió el grid de métricas a 6 columnas en desktop y se adaptó para una distribución responsiva en smartphones.
* **Exportar a CSV**: Implementamos el botón **Exportar Lista**. Genera y descarga un archivo CSV con formato UTF-8 BOM (delimitado por punto y coma `;`) para su correcta apertura en Microsoft Excel con decimales en español, conteniendo todas las columnas clave.

### 4. Integración en el Gestor de Presupuestos ([BudgetManager.jsx](file:///c:/Users/Crispis/Documents/Cosmic%20Love/src/components/BudgetManager.jsx))
* **Tarjeta de Aportaciones**: Agregamos una nueva tarjeta en el panel de presupuestos para mostrar el total acumulado de **Regalos Recibidos**.
* **Balance Neto Disponible**: Modificamos la tarjeta de **Coste Real Actual** para recalcular el Neto Disponible sumando los regalos al presupuesto límite: `Presupuesto Límite + Regalos - Coste Real Actual`.
* **Diseño Responsivo**: Rediseñamos el layout del grid de 5 tarjetas. En pantallas medianas y móviles, la tarjeta de "Presupuesto Límite" ahora ocupa todo el ancho (`grid-column: span 2`) para formar una cuadrícula perfectamente equilibrada y sin huecos.

---

## Verificación y Despliegue

1. **Compilación de Producción**: Ejecutamos localmente `npm.cmd run build` de manera exitosa, verificando que no existieran errores sintácticos o lógicos en Vite.
2. **Despliegue Exitoso en Vercel**: La aplicación fue desplegada en producción y se encuentra disponible en:
   * **URL de Producción**: [https://cosmic-love-portal.vercel.app](https://cosmic-love-portal.vercel.app)
3. **Repositorio Sincronizado**: Los cambios fueron enviados a la rama principal de GitHub:
   ```bash
   & "C:\Program Files\Git\bin\git.exe" add src/App.jsx src/components/BudgetManager.jsx src/components/GuestListManager.jsx supabase_setup.sql
   & "C:\Program Files\Git\bin\git.exe" commit -m "Add guest gift registry, sync with budget manager, implement guest CSV export, and refine mobile layout"
   & "C:\Program Files\Git\bin\git.exe" push origin main
   ```
