-- =====================================================================
-- SCRIPT DE INICIALIZACIÓN DE BASE DE DATOS: COSMIC LOVE PORTAL
-- Ejecuta este script en el editor SQL de tu panel de Supabase
-- =====================================================================

-- 1. Crear Tabla: weddings (Bodas)
CREATE TABLE IF NOT EXISTS public.weddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    couple_name1 TEXT NOT NULL,
    couple_name2 TEXT NOT NULL,
    date DATE NOT NULL,
    budget NUMERIC(12, 2) NOT NULL DEFAULT 30000.00,
    city TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id)
);

-- 2. Crear Tabla: budget_items (Partidas de Presupuesto)
CREATE TABLE IF NOT EXISTS public.budget_items (
    id TEXT PRIMARY KEY, -- Usamos TEXT para mantener los IDs cliente del frontend
    wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    name TEXT NOT NULL,
    estimated NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    actual NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    paid BOOLEAN DEFAULT false NOT NULL
);

-- 3. Crear Tabla: tables (Mesas de Seating Plan)
CREATE TABLE IF NOT EXISTS public.tables (
    id TEXT PRIMARY KEY, -- Usamos TEXT para mantener los IDs cliente del frontend
    wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 8
);

-- 4. Crear Tabla: guests (Invitados)
CREATE TABLE IF NOT EXISTS public.guests (
    id TEXT PRIMARY KEY, -- Usamos TEXT para mantener los IDs cliente del frontend
    wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    side TEXT NOT NULL DEFAULT 'Ambos', -- Novio / Novia / Ambos
    diet TEXT DEFAULT '',
    status TEXT NOT NULL DEFAULT 'pending', -- confirmed / pending / declined
    table_id TEXT REFERENCES public.tables(id) ON DELETE SET NULL,
    is_child BOOLEAN DEFAULT false NOT NULL,
    gift_desc TEXT DEFAULT '',
    gift_amount NUMERIC(12, 2) DEFAULT 0.00
);

-- 5. Crear Tabla: events (Agenda y Tareas)
CREATE TABLE IF NOT EXISTS public.events (
    id TEXT PRIMARY KEY, -- Usamos TEXT para mantener los IDs cliente del frontend
    wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    date DATE NOT NULL,
    time TEXT DEFAULT '',
    "desc" TEXT DEFAULT '',
    category TEXT NOT NULL,
    completed BOOLEAN DEFAULT false NOT NULL
);

-- =====================================================================
-- SEGURIDAD: CONFIGURAR RLS (ROW LEVEL SECURITY)
-- =====================================================================

-- Habilitar RLS en cada tabla
ALTER TABLE public.weddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Políticas para la tabla: weddings
CREATE POLICY "Users can manage their own wedding"
    ON public.weddings
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Políticas para la tabla: budget_items
CREATE POLICY "Users can manage their wedding budget items"
    ON public.budget_items
    FOR ALL
    USING (wedding_id IN (SELECT id FROM public.weddings WHERE user_id = auth.uid()))
    WITH CHECK (wedding_id IN (SELECT id FROM public.weddings WHERE user_id = auth.uid()));

-- Políticas para la tabla: tables
CREATE POLICY "Users can manage their wedding tables"
    ON public.tables
    FOR ALL
    USING (wedding_id IN (SELECT id FROM public.weddings WHERE user_id = auth.uid()))
    WITH CHECK (wedding_id IN (SELECT id FROM public.weddings WHERE user_id = auth.uid()));

-- Políticas para la tabla: guests
CREATE POLICY "Users can manage their wedding guests"
    ON public.guests
    FOR ALL
    USING (wedding_id IN (SELECT id FROM public.weddings WHERE user_id = auth.uid()))
    WITH CHECK (wedding_id IN (SELECT id FROM public.weddings WHERE user_id = auth.uid()));

-- Políticas para la tabla: events
CREATE POLICY "Users can manage their wedding events"
    ON public.events
    FOR ALL
    USING (wedding_id IN (SELECT id FROM public.weddings WHERE user_id = auth.uid()))
    WITH CHECK (wedding_id IN (SELECT id FROM public.weddings WHERE user_id = auth.uid()));

-- =====================================================================
-- ACCESO PÚBLICO (ANÓNIMO) PARA INVITADOS (RSVP)
-- =====================================================================

-- 6. Permitir lectura pública de bodas (para renderizar la invitación)
CREATE POLICY "Public read weddings"
    ON public.weddings
    FOR SELECT
    USING (true);

-- 7. Permitir inserción pública de invitados (para confirmar asistencia)
CREATE POLICY "Public insert guests"
    ON public.guests
    FOR INSERT
    WITH CHECK (true);

-- =====================================================================
-- 8. Crear Tabla: feedback (Comentarios, Mejoras y Errores)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id UUID REFERENCES public.weddings(id) ON DELETE CASCADE,
    user_email TEXT,
    type TEXT NOT NULL, -- bug / improvement / question
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Permitir inserción a cualquier usuario autenticado
CREATE POLICY "Authenticated users can insert feedback"
    ON public.feedback
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- =====================================================================
-- 9. Añadir columna 'style' a la tabla 'weddings' si no existe
-- =====================================================================
ALTER TABLE public.weddings ADD COLUMN IF NOT EXISTS style TEXT DEFAULT 'classic';

