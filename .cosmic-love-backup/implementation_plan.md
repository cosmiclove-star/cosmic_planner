# Plan de Implementación: Registro de Regalos e Integración con Presupuesto

Este plan describe la solución para permitir a los novios registrar los regalos de cada invitado (descripción e importe monetario), ver las aportaciones reflejadas en el gestor de presupuesto, y exportar la lista completa de invitados con sus regalos a un archivo CSV.

## User Review Required

> [!IMPORTANT]
> **Cambios en la Base de Datos**: Este cambio requiere ejecutar una sentencia SQL en el panel de Supabase para añadir los campos `gift_desc` y `gift_amount` a la tabla `guests`. 
> He preparado las instrucciones detalladas abajo.

> [!TIP]
> **Integración de Aportaciones en el Presupuesto**: Proponemos añadir una quinta tarjeta en la sección de presupuestos llamada **Regalos Recibidos** que sume las aportaciones de los invitados. Además, el balance de la tarjeta "Coste Real Actual" mostrará el balance neto disponible sumando el presupuesto límite y las aportaciones recibidas menos los costes reales.

---

## Cambios Propuestos

### 1. Base de Datos (Supabase)

#### [MODIFY] [supabase_setup.sql](file:///c:/Users/Crispis/Documents/Cosmic%20Love/supabase_setup.sql)
Actualizar el script de inicialización del proyecto para incluir las columnas de regalos por defecto en la definición de la tabla `guests`:
```sql
ALTER TABLE public.guests ADD COLUMN IF NOT EXISTS gift_desc TEXT DEFAULT '';
ALTER TABLE public.guests ADD COLUMN IF NOT EXISTS gift_amount NUMERIC(12, 2) DEFAULT 0.00;
```

---

### 2. Lógica de Sincronización Principal

#### [MODIFY] [App.jsx](file:///c:/Users/Crispis/Documents/Cosmic%20Love/src/App.jsx)
* **Carga de Datos**: Modificar `fetchWeddingData` para mapear `gift_desc` y `gift_amount` desde la base de datos al estado de invitados de React.
* **Onboarding y Migración**: Asegurar que las funciones `handleMigrateLocalData` y `handleOnboardingComplete` inserten las columnas `gift_desc` y `gift_amount` correspondientes en Supabase.
* **Sincronización en Segundo Plano**: Actualizar el manejador `handleSetGuests` para incluir `gift_desc` y `gift_amount` tanto en el bloque de inserción (`insert`) como en el de modificación (`update`).
* **Prop a Presupuesto**: Pasar la lista de `guests` como propiedad al componente `<BudgetManager />`.

---

### 3. Componente de Invitados

#### [MODIFY] [GuestListManager.jsx](file:///c:/Users/Crispis/Documents/Cosmic%20Love/src/components/GuestListManager.jsx)
* **Campos en la Tabla**: Añadir inputs en línea en la tabla de invitados para ingresar la descripción del regalo (`giftDesc`) y el importe en euros (`giftAmount`).
* **Manejador de Cambios**: Crear la función `handleUpdateGift(id, giftDesc, giftAmount)` para actualizar el estado de invitados, que a su vez guardará los cambios automáticamente en Supabase.
* **Métrica de Regalos**: Añadir una sexta tarjeta de resumen llamada **Regalos Recibidos** en la cabecera que muestre la suma acumulada de aportaciones y el número de invitados que han regalado algo.
* **Redistribución Grid**: Cambiar el grid de métricas a `grid-template-columns: repeat(6, 1fr)` en desktop, y adaptar su responsividad móvil a filas de 3 tarjetas (`span 2` cada una).
* **Exportar a CSV**: Implementar el botón **Exportar Excel (CSV)** junto al título de invitados. Generará y descargará un archivo CSV codificado en UTF-8 con columnas: Nombre, Lado, Dieta, Menú Infantil, Mesa, Confirmación, Regalo y Aportación (€).

---

### 4. Componente de Presupuesto

#### [MODIFY] [BudgetManager.jsx](file:///c:/Users/Crispis/Documents/Cosmic%20Love/src/components/BudgetManager.jsx)
* **Cálculo de Aportaciones**: Recibir `guests` y calcular la suma total monetaria recibida de aportaciones.
* **Quinta Tarjeta**: Insertar una nueva tarjeta de resumen llamada **Aportaciones de Invitados** en la cabecera.
* **Balance Neto Disponible**: Actualizar el pie de página de la tarjeta "Coste Real Actual" para indicar el saldo neto disponible sumando las aportaciones al presupuesto límite (`Presupuesto + Regalos - Coste Real`).
* **Redistribución Grid**: Cambiar `.budget-summary-grid` para usar `grid-template-columns: repeat(5, 1fr)` en ordenadores, adaptando el layout para 5 tarjetas.

---

## Plan de Verificación

### Pruebas de Integración
* Ejecutar localmente `npm run build` para descartar cualquier error de sintaxis tras las modificaciones.

### Verificación Manual (Paso a Paso)
1. **Aplicar ALTER TABLE**: Ejecutar los comandos `ALTER TABLE` en el panel SQL de Supabase.
2. **Verificación de Invitados**:
   - Abrir el portal en local y entrar en "Lista de Invitados".
   - Modificar el regalo de "Andrés García" a "Ingreso" y escribir `200` €.
   - Recargar la página y verificar que el regalo y el importe se cargan correctamente desde Supabase.
   - Probar el botón de **Exportar Excel** y comprobar que el archivo descargado contiene los datos correctos del regalo de Andrés.
3. **Verificación de Presupuesto**:
   - Navegar a "Control del Presupuesto".
   - Confirmar que aparece la quinta tarjeta de "Regalos Recibidos" con la suma correcta.
   - Verificar que el badge de la tarjeta "Coste Real Actual" actualiza el cálculo del saldo disponible sumando los regalos de los invitados.
