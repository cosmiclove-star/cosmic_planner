import React, { useState, useEffect } from 'react';
import { Heart, LayoutDashboard, DollarSign, Users, Grid, CreditCard, Calendar, LogOut, Loader2, Sparkles, Compass, HelpCircle, MessageSquare } from 'lucide-react';
import { supabase } from './supabaseClient';
import Login from './components/Login';
import Onboarding from './components/Onboarding';
import UserGuideModal from './components/UserGuideModal';
import Dashboard from './components/Dashboard';
import BudgetManager from './components/BudgetManager';
import GuestListManager from './components/GuestListManager';
import SeatingPlan from './components/SeatingPlan';
import InvitationDesigner from './components/InvitationDesigner';
import CalendarPlanner from './components/CalendarPlanner';
import PublicInvitation from './components/PublicInvitation';
import FeedbackWidget from './components/FeedbackWidget';
import AdminFeedback from './components/AdminFeedback';

const formatName = (name) => {
  if (!name) return '';
  return name.trim().replace(/\b\w/g, c => c.toUpperCase());
};

// Datos por defecto para bodas vacías
const DEFAULT_BUDGET_ITEMS = (totalBudget) => [
  { id: '1', category: 'Espacio y catering', name: 'Alquiler de Finca & Catering', estimated: totalBudget * 0.45, actual: totalBudget * 0.46, paid: true },
  { id: '2', category: 'Fotografía y Video', name: 'Reportaje Fotográfico & Video Boutique', estimated: 2400, actual: 2400, paid: true },
  { id: '3', category: 'Decoración y Flores', name: 'Diseño Floral y Alquiler de Mobiliario', estimated: 3200, actual: 2900, paid: false },
  { id: '4', category: 'Música y entretenimiento', name: 'DJ Profesional & Iluminación de Pista', estimated: 1800, actual: 1800, paid: false },
  { id: '5', category: 'Vestuario y Belleza', name: 'Traje, Vestido a medida & Maquillaje', estimated: 2800, actual: 3100, paid: false },
  { id: '6', category: 'Wedding Planner / coordinación', name: 'Coordinación del Día B - Cosmic Love', estimated: 3500, actual: 3500, paid: true },
  { id: '7', category: 'Papelería e Invitaciones', name: 'Invitación Digital & Cartelería', estimated: 450, actual: 400, paid: true }
];

const DEFAULT_GUESTS = [
  { id: 'g1', name: 'Andrés García', side: 'Novio', diet: '', status: 'confirmed', tableId: 't1', isChild: false },
  { id: 'g2', name: 'Belén Martínez', side: 'Novio', diet: 'Vegana', status: 'confirmed', tableId: 't1', isChild: false },
  { id: 'g3', name: 'Carlos García', side: 'Novio', diet: '', status: 'confirmed', tableId: 't1', isChild: false },
  { id: 'g4', name: 'Diana Pérez', side: 'Novio', diet: '', status: 'pending', tableId: null, isChild: false },
  { id: 'g5', name: 'Elena Ruiz', side: 'Novia', diet: 'Celíaca', status: 'confirmed', tableId: 't2', isChild: false },
  { id: 'g6', name: 'Fernando Gómez', side: 'Novia', diet: '', status: 'confirmed', tableId: 't2', isChild: false },
  { id: 'g7', name: 'Gloria Ortiz', side: 'Novia', diet: '', status: 'confirmed', tableId: 't2', isChild: false },
  { id: 'g8', name: 'Hugo Vidal', side: 'Novia', diet: '', status: 'declined', tableId: null, isChild: false },
  { id: 'g9', name: 'Isabel Torres', side: 'Común', diet: '', status: 'confirmed', tableId: null, isChild: false },
  { id: 'g10', name: 'Jorge Mas', side: 'Común', diet: 'Sin lactosa', status: 'confirmed', tableId: null, isChild: false },
  { id: 'g11', name: 'Laura Vila', side: 'Común', diet: '', status: 'pending', tableId: null, isChild: false },
  { id: 'g12', name: 'Manuel Soler', side: 'Común', diet: '', status: 'confirmed', tableId: null, isChild: false }
];

const DEFAULT_TABLES = [
  { id: 't1', name: 'Mesa Presidencial', capacity: 6 },
  { id: 't2', name: 'Mesa Familia Novia', capacity: 8 },
  { id: 't3', name: 'Mesa Amigos', capacity: 10 }
];

const DEFAULT_EVENTS = (weddingDate) => {
  const getOffsetDate = (daysBefore) => {
    if (!weddingDate) return '';
    const date = new Date(weddingDate);
    date.setDate(date.getDate() - daysBefore);
    return date.toISOString().split('T')[0];
  };

  return [
    { id: 'e1', title: 'Reservar el espacio y finca', date: getOffsetDate(240), time: '10:00', desc: 'Firma de contrato del espacio principal.', category: 'Banquete', completed: true },
    { id: 'e2', title: 'Degustación y prueba de menú', date: getOffsetDate(120), time: '14:00', desc: 'Prueba de los platos con la familia en la finca.', category: 'Banquete', completed: true },
    { id: 'e3', title: 'Prueba del vestido y traje', date: getOffsetDate(90), time: '17:30', desc: 'Primera sesión de arreglos en el atelier.', category: 'Novia y Complementos', completed: false },
    { id: 'e4', title: 'Reunión de coordinación de música', date: getOffsetDate(45), time: '19:00', desc: 'Definir lista de canciones prohibidas e imprescindibles con el DJ.', category: 'Música', completed: false },
    { id: 'e5', title: 'Enviar invitación digital interactiva', date: getOffsetDate(60), time: '12:00', desc: 'Enviar el link a los invitados por WhatsApp y correo.', category: 'Invitaciones', completed: true },
    { id: 'e6', title: 'Cierre del Seating Plan final', date: getOffsetDate(15), time: '18:00', desc: 'Confirmar número exacto de mesas al catering.', category: 'Banquete', completed: false }
  ];
};

export default function App() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [weddingData, setWeddingData] = useState({});
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showGuideModal, setShowGuideModal] = useState(false);

  const isAdmin = session?.user?.email === 'test@example.com' || session?.user?.email === 'labodadecloe@gmail.com' || session?.user?.email?.endsWith('@cosmiclove.es');

  const [budgetItems, setBudgetItems] = useState([]);
  const [guests, setGuests] = useState([]);
  const [tables, setTables] = useState([]);
  const [events, setEvents] = useState([]);

  // Auto-apertura de la guía tras completar el onboarding
  useEffect(() => {
    if (onboarded) {
      const seen = localStorage.getItem('cl_seen_guide');
      if (seen !== 'true') {
        const timer = setTimeout(() => {
          setShowGuideModal(true);
        }, 800);
        return () => clearTimeout(timer);
      }
    }
  }, [onboarded]);

  // 1. Escuchar el estado de autenticación de Supabase
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. Cargar datos desde Supabase una vez iniciada la sesión
  useEffect(() => {
    if (!session) {
      setOnboarded(false);
      setWeddingData({});
      setBudgetItems([]);
      setGuests([]);
      setTables([]);
      setEvents([]);
      return;
    }

    const fetchWeddingData = async () => {
      setDataLoading(true);
      try {
        const { data: wedding, error: wError } = await supabase
          .from('weddings')
          .select('*')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (wError) throw wError;

        if (wedding) {
          const formattedWedding = {
            id: wedding.id,
            coupleName1: wedding.couple_name1,
            coupleName2: wedding.couple_name2,
            date: wedding.date,
            budget: Number(wedding.budget),
            city: wedding.city,
            location: wedding.city || '',
            style: wedding.style || 'classic'
          };
          setWeddingData(formattedWedding);

          // Cargar datos secundarios de las tablas relacionales
          const [budgetRes, guestsRes, tablesRes, eventsRes] = await Promise.all([
            supabase.from('budget_items').select('*').eq('wedding_id', wedding.id),
            supabase.from('guests').select('*').eq('wedding_id', wedding.id),
            supabase.from('tables').select('*').eq('wedding_id', wedding.id),
            supabase.from('events').select('*').eq('wedding_id', wedding.id),
          ]);

          if (budgetRes.error) throw budgetRes.error;
          if (guestsRes.error) throw guestsRes.error;
          if (tablesRes.error) throw tablesRes.error;
          if (eventsRes.error) throw eventsRes.error;

          setBudgetItems(budgetRes.data || []);
          setGuests((guestsRes.data || []).map(g => ({
            id: g.id,
            name: g.name,
            side: g.side,
            diet: g.diet,
            status: g.status,
            tableId: g.table_id,
            isChild: g.is_child
          })));
          setTables(tablesRes.data || []);
          setEvents((eventsRes.data || []).map(e => ({
            id: e.id,
            title: e.title,
            date: e.date,
            time: e.time,
            desc: e.desc,
            category: e.category,
            completed: e.completed
          })));

          setOnboarded(true);
        } else {
          // Si el usuario no tiene boda en Supabase pero tiene datos en localStorage, preguntar si quiere migrar
          const savedOnboarded = localStorage.getItem('cl_onboarded');
          const savedWeddingData = localStorage.getItem('cl_weddingData');
          if (savedOnboarded === 'true' && savedWeddingData) {
            const confirmMigrate = window.confirm(
              'Hemos detectado progresos guardados en este navegador. ¿Deseas subirlos a tu cuenta en la nube?'
            );
            if (confirmMigrate) {
              await handleMigrateLocalData(JSON.parse(savedWeddingData));
            } else {
              localStorage.clear();
              setOnboarded(false);
            }
          } else {
            setOnboarded(false);
          }
        }
      } catch (err) {
        console.error('Error al recuperar datos de la boda:', err);
      } finally {
        setDataLoading(false);
      }
    };

    fetchWeddingData();
  }, [session]);

  // Migrar datos locales del localStorage a Supabase
  const handleMigrateLocalData = async (localWedding) => {
    setDataLoading(true);
    try {
      const savedBudget = JSON.parse(localStorage.getItem('cl_budget') || '[]');
      const savedGuests = JSON.parse(localStorage.getItem('cl_guests') || '[]');
      const savedTables = JSON.parse(localStorage.getItem('cl_tables') || '[]');
      const savedEvents = JSON.parse(localStorage.getItem('cl_events') || '[]');

       // 1. Crear boda
      const { data: wedding, error: wError } = await supabase
        .from('weddings')
        .insert([{
          user_id: session.user.id,
          couple_name1: localWedding.coupleName1 || 'Novio 1',
          couple_name2: localWedding.coupleName2 || 'Novio 2',
          date: localWedding.date,
          budget: localWedding.budget || 30000,
          city: localWedding.city || '',
          style: localWedding.style || 'classic'
        }])
        .select()
        .single();

      if (wError) throw wError;

      const formattedWedding = {
        id: wedding.id,
        coupleName1: wedding.couple_name1,
        coupleName2: wedding.couple_name2,
        date: wedding.date,
        budget: Number(wedding.budget),
        city: wedding.city,
        location: wedding.city || '',
        style: wedding.style || 'classic'
      };

      // 2. Subir elementos secundarios si existen
      // Mapear IDs a nuevos IDs únicos para evitar colisiones
      const tableIdMap = {};
      const migratedTables = savedTables.map(t => {
        const uniqueId = 't_' + Math.random().toString(36).substring(2, 9) + Date.now().toString().slice(-4);
        tableIdMap[t.id] = uniqueId;
        return {
          ...t,
          id: uniqueId,
          wedding_id: wedding.id
        };
      });

      const migratedGuests = savedGuests.map(g => {
        const uniqueId = 'g_' + Math.random().toString(36).substring(2, 9) + Date.now().toString().slice(-4);
        const uniqueTableId = g.tableId ? (tableIdMap[g.tableId] || g.tableId) : null;
        return {
          ...g,
          id: uniqueId,
          wedding_id: wedding.id,
          tableId: uniqueTableId
        };
      });

      const migratedBudget = savedBudget.map(b => {
        const uniqueId = 'b_' + Math.random().toString(36).substring(2, 9) + Date.now().toString().slice(-4);
        return {
          ...b,
          id: uniqueId,
          wedding_id: wedding.id
        };
      });

      const migratedEvents = savedEvents.map(e => {
        const uniqueId = 'e_' + Math.random().toString(36).substring(2, 9) + Date.now().toString().slice(-4);
        return {
          ...e,
          id: uniqueId,
          wedding_id: wedding.id
        };
      });

      // Insertar primero las mesas si existen para evitar violaciones de clave ajena
      if (migratedTables.length > 0) {
        const { error: tError } = await supabase.from('tables').insert(migratedTables.map(t => ({
          id: t.id,
          wedding_id: t.wedding_id,
          name: t.name,
          capacity: t.capacity
        })));
        if (tError) throw tError;
      }

      const uploads = [];
      if (migratedBudget.length > 0) {
        uploads.push(supabase.from('budget_items').insert(migratedBudget.map(b => ({
          id: b.id,
          wedding_id: b.wedding_id,
          category: b.category,
          name: b.name,
          estimated: b.estimated,
          actual: b.actual,
          paid: b.paid
        }))));
      }
      if (migratedGuests.length > 0) {
        uploads.push(supabase.from('guests').insert(migratedGuests.map(g => ({
          id: g.id,
          wedding_id: g.wedding_id,
          name: g.name,
          side: g.side,
          diet: g.diet,
          status: g.status,
          table_id: g.tableId,
          is_child: g.isChild
        }))));
      }
      if (migratedEvents.length > 0) {
        uploads.push(supabase.from('events').insert(migratedEvents.map(e => ({
          id: e.id,
          wedding_id: e.wedding_id,
          title: e.title,
          date: e.date,
          time: e.time,
          desc: e.desc,
          category: e.category,
          completed: e.completed
        }))));
      }

      const uploadResults = await Promise.all(uploads);
      for (const res of uploadResults) {
        if (res.error) throw res.error;
      }

      setWeddingData(formattedWedding);
      setBudgetItems(migratedBudget);
      setTables(migratedTables);
      setGuests(migratedGuests);
      setEvents(migratedEvents);

      localStorage.clear();
      setOnboarded(true);
    } catch (err) {
      console.error('Error durante la migración de datos:', err);
      alert('Error al migrar los datos. Iniciando de cero.');
      setOnboarded(false);
    } finally {
      setDataLoading(false);
    }
  };

  // Completar Onboarding e inicializar datos por defecto en Supabase
  const handleOnboardingComplete = async (data) => {
    setDataLoading(true);
    try {
      const weddingDate = data.date || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const { data: newWedding, error: wError } = await supabase
        .from('weddings')
        .insert([{
          user_id: session.user.id,
          couple_name1: data.coupleName1,
          couple_name2: data.coupleName2,
          date: weddingDate,
          budget: data.budget,
          city: data.location || data.city || '',
          style: data.style || 'classic'
        }])
        .select()
        .single();

      if (wError) throw wError;

      const finalWeddingData = {
        id: newWedding.id,
        coupleName1: newWedding.couple_name1,
        coupleName2: newWedding.couple_name2,
        date: newWedding.date,
        budget: Number(newWedding.budget),
        city: newWedding.city,
        location: newWedding.city || '',
        style: newWedding.style || 'classic'
      };

      // Generar IDs únicos para evitar colisiones de clave primaria (id es TEXT PRIMARY KEY en Supabase)
      const tableIdMap = {};
      const defaultTablesList = DEFAULT_TABLES.map(t => {
        const uniqueId = 't_' + Math.random().toString(36).substring(2, 9) + Date.now().toString().slice(-4);
        tableIdMap[t.id] = uniqueId;
        return {
          id: uniqueId,
          wedding_id: newWedding.id,
          name: t.name,
          capacity: t.capacity
        };
      });

      const defaultGuestsList = DEFAULT_GUESTS.map(g => {
        const uniqueId = 'g_' + Math.random().toString(36).substring(2, 9) + Date.now().toString().slice(-4);
        const uniqueTableId = g.tableId ? (tableIdMap[g.tableId] || null) : null;
        return {
          id: uniqueId,
          wedding_id: newWedding.id,
          name: g.name,
          side: g.side,
          diet: g.diet,
          status: g.status,
          tableId: uniqueTableId,
          isChild: g.isChild
        };
      });

      const defaultBudget = DEFAULT_BUDGET_ITEMS(finalWeddingData.budget).map(b => {
        const uniqueId = 'b_' + Math.random().toString(36).substring(2, 9) + Date.now().toString().slice(-4);
        return {
          id: uniqueId,
          wedding_id: newWedding.id,
          category: b.category,
          name: b.name,
          estimated: b.estimated,
          actual: b.actual,
          paid: b.paid
        };
      });

      const defaultEventsList = DEFAULT_EVENTS(finalWeddingData.date).map(e => {
        const uniqueId = 'e_' + Math.random().toString(36).substring(2, 9) + Date.now().toString().slice(-4);
        return {
          id: uniqueId,
          wedding_id: newWedding.id,
          title: e.title,
          date: e.date,
          time: e.time,
          desc: e.desc,
          category: e.category,
          completed: e.completed
        };
      });

      // 1. Insertar primero las mesas y esperar la confirmación de la base de datos
      const { error: tError } = await supabase.from('tables').insert(defaultTablesList.map(t => ({
        id: t.id,
        wedding_id: t.wedding_id,
        name: t.name,
        capacity: t.capacity
      })));
      if (tError) throw tError;

      // 2. Insertar el resto de datos de forma paralela
      const [budgetRes, guestsRes, eventsRes] = await Promise.all([
        supabase.from('budget_items').insert(defaultBudget.map(b => ({
          id: b.id,
          wedding_id: b.wedding_id,
          category: b.category,
          name: b.name,
          estimated: b.estimated,
          actual: b.actual,
          paid: b.paid
        }))),
        supabase.from('guests').insert(defaultGuestsList.map(g => ({
          id: g.id,
          wedding_id: g.wedding_id,
          name: g.name,
          side: g.side,
          diet: g.diet,
          status: g.status,
          table_id: g.tableId,
          is_child: g.isChild
        }))),
        supabase.from('events').insert(defaultEventsList.map(e => ({
          id: e.id,
          wedding_id: e.wedding_id,
          title: e.title,
          date: e.date,
          time: e.time,
          desc: e.desc,
          category: e.category,
          completed: e.completed
        })))
      ]);

      if (budgetRes.error) throw budgetRes.error;
      if (guestsRes.error) throw guestsRes.error;
      if (eventsRes.error) throw eventsRes.error;

      setWeddingData(finalWeddingData);
      setBudgetItems(defaultBudget);
      setGuests(defaultGuestsList);
      setTables(defaultTablesList);
      setEvents(defaultEventsList);
      setOnboarded(true);
      setActiveTab('dashboard');
    } catch (err) {
      console.error('Error al inicializar la boda:', err);
      alert('Error al inicializar tu boda. Inténtalo de nuevo.');
    } finally {
      setDataLoading(false);
    }
  };

  const handleLogout = async () => {
    if (window.confirm('¿Deseas cerrar sesión en el portal?')) {
      await supabase.auth.signOut();
    }
  };

  const handleResetOnboarding = async () => {
    const confirmReset = window.confirm(
      '¿Estás seguro de que quieres restablecer tu cuenta? Esto eliminará todos tus datos actuales (partidas, invitados, mesas, etc.) y te llevará de nuevo al onboarding.'
    );
    if (confirmReset) {
      setDataLoading(true);
      try {
        if (weddingData.id) {
          const { error } = await supabase
            .from('weddings')
            .delete()
            .eq('id', weddingData.id);
          
          if (error) throw error;
        }
        
        // Limpiar estados y localStorage
        localStorage.clear();
        setWeddingData({});
        setBudgetItems([]);
        setGuests([]);
        setTables([]);
        setEvents([]);
        setOnboarded(false);
      } catch (err) {
        console.error('Error al restablecer la cuenta:', err);
        alert('Hubo un error al restablecer tu cuenta. Inténtalo de nuevo.');
      } finally {
        setDataLoading(false);
      }
    }
  };

  // 3. Manejadores de sincronización en segundo plano con Supabase
  const handleSetWeddingData = (valueOrFunc) => {
    setWeddingData((prev) => {
      const next = typeof valueOrFunc === 'function' ? valueOrFunc(prev) : valueOrFunc;
      supabase.from('weddings').update({
        couple_name1: next.coupleName1,
        couple_name2: next.coupleName2,
        date: next.date,
        budget: next.budget,
        city: next.city,
        style: next.style
      }).eq('id', next.id).then(({ error }) => {
        if (error) console.error('Error al actualizar boda:', error);
      });
      return next;
    });
  };

  const handleSetBudgetItems = (valueOrFunc) => {
    setBudgetItems((prev) => {
      const next = typeof valueOrFunc === 'function' ? valueOrFunc(prev) : valueOrFunc;
      
      // Borrados
      const deletedIds = prev.filter(p => !next.some(n => n.id === p.id)).map(p => p.id);
      if (deletedIds.length > 0) {
        supabase.from('budget_items').delete().in('id', deletedIds).then();
      }
      
      // Añadidos
      const added = next.filter(n => !prev.some(p => p.id === n.id));
      if (added.length > 0) {
        supabase.from('budget_items').insert(added.map(a => ({
          id: a.id,
          wedding_id: weddingData.id,
          category: a.category,
          name: a.name,
          estimated: a.estimated,
          actual: a.actual,
          paid: a.paid
        }))).then();
      }
      
      // Modificados
      const modified = next.filter(n => {
        const p = prev.find(item => item.id === n.id);
        return p && (p.name !== n.name || p.category !== n.category || p.estimated !== n.estimated || p.actual !== n.actual || p.paid !== n.paid);
      });
      if (modified.length > 0) {
        modified.forEach(m => {
          supabase.from('budget_items').update({
            category: m.category,
            name: m.name,
            estimated: m.estimated,
            actual: m.actual,
            paid: m.paid
          }).eq('id', m.id).then();
        });
      }
      
      return next;
    });
  };

  const handleSetGuests = (valueOrFunc) => {
    setGuests((prev) => {
      const next = typeof valueOrFunc === 'function' ? valueOrFunc(prev) : valueOrFunc;
      
      const deletedIds = prev.filter(p => !next.some(n => n.id === p.id)).map(p => p.id);
      if (deletedIds.length > 0) {
        supabase.from('guests').delete().in('id', deletedIds).then();
      }
      
      const added = next.filter(n => !prev.some(p => p.id === n.id));
      if (added.length > 0) {
        supabase.from('guests').insert(added.map(a => ({
          id: a.id,
          wedding_id: weddingData.id,
          name: a.name,
          side: a.side,
          diet: a.diet,
          status: a.status,
          table_id: a.tableId,
          is_child: a.isChild
        }))).then();
      }
      
      const modified = next.filter(n => {
        const p = prev.find(item => item.id === n.id);
        return p && (p.name !== n.name || p.side !== n.side || p.diet !== n.diet || p.status !== n.status || p.tableId !== n.tableId || p.isChild !== n.isChild);
      });
      if (modified.length > 0) {
        modified.forEach(m => {
          supabase.from('guests').update({
            name: m.name,
            side: m.side,
            diet: m.diet,
            status: m.status,
            table_id: m.tableId,
            is_child: m.isChild
          }).eq('id', m.id).then();
        });
      }
      
      return next;
    });
  };

  const handleSetTables = (valueOrFunc) => {
    setTables((prev) => {
      const next = typeof valueOrFunc === 'function' ? valueOrFunc(prev) : valueOrFunc;
      
      const deletedIds = prev.filter(p => !next.some(n => n.id === p.id)).map(p => p.id);
      if (deletedIds.length > 0) {
        supabase.from('tables').delete().in('id', deletedIds).then();
      }
      
      const added = next.filter(n => !prev.some(p => p.id === n.id));
      if (added.length > 0) {
        supabase.from('tables').insert(added.map(a => ({
          id: a.id,
          wedding_id: weddingData.id,
          name: a.name,
          capacity: a.capacity
        }))).then();
      }
      
      const modified = next.filter(n => {
        const p = prev.find(item => item.id === n.id);
        return p && (p.name !== n.name || p.capacity !== n.capacity);
      });
      if (modified.length > 0) {
        modified.forEach(m => {
          supabase.from('tables').update({
            name: m.name,
            capacity: m.capacity
          }).eq('id', m.id).then();
        });
      }
      
      return next;
    });
  };

  const handleSetEvents = (valueOrFunc) => {
    setEvents((prev) => {
      const next = typeof valueOrFunc === 'function' ? valueOrFunc(prev) : valueOrFunc;
      
      const deletedIds = prev.filter(p => !next.some(n => n.id === p.id)).map(p => p.id);
      if (deletedIds.length > 0) {
        supabase.from('events').delete().in('id', deletedIds).then();
      }
      
      const added = next.filter(n => !prev.some(p => p.id === n.id));
      if (added.length > 0) {
        supabase.from('events').insert(added.map(a => ({
          id: a.id,
          wedding_id: weddingData.id,
          title: a.title,
          date: a.date,
          time: a.time,
          desc: a.desc,
          category: a.category,
          completed: a.completed
        }))).then();
      }
      
      const modified = next.filter(n => {
        const p = prev.find(item => item.id === n.id);
        return p && (p.title !== n.title || p.date !== n.date || p.time !== n.time || p.desc !== n.desc || p.category !== n.category || p.completed !== n.completed);
      });
      if (modified.length > 0) {
        modified.forEach(m => {
          supabase.from('events').update({
            title: m.title,
            date: m.date,
            time: m.time,
            desc: m.desc,
            category: m.category,
            completed: m.completed
          }).eq('id', m.id).then();
        });
      }
      
      return next;
    });
  };

  // Detección de vista de invitación pública para invitados
  const urlParams = new URLSearchParams(window.location.search);
  const publicInvitationId = urlParams.get('invitacion');

  if (publicInvitationId) {
    return <PublicInvitation weddingId={publicInvitationId} />;
  }

  // Pantalla de carga mientras se recupera la sesión o los datos
  if (authLoading || dataLoading) {
    return (
      <div className="portal-loading">
        <Loader2 className="animate-spin text-gold" size={40} />
        <p>Cargando tu Portal Cosmic Love...</p>
        <style>{`
          .portal-loading {
            height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background-color: var(--cream);
            color: var(--ink);
            font-family: var(--font-serif);
            font-style: italic;
            gap: 16px;
          }
          .text-gold {
            color: var(--gold);
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-spin {
            animation: spin 1s linear infinite;
          }
        `}</style>
      </div>
    );
  }

  // 4. Si no hay sesión activa, forzar a iniciar sesión
  if (!session) {
    return <Login />;
  }

  // 5. Si está autenticado pero no ha hecho el onboarding, mostrar Onboarding
  if (!onboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="portal-app">
      {/* Barra de Navegación Lateral Premium */}
      <aside className="portal-sidebar">
        <div className="sidebar-brand" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <img src="/logo.png" alt="Cosmic Love" className="sidebar-brand-img" style={{ maxHeight: '80px', width: 'auto', marginBottom: '12px', display: 'block' }} />
          <span>TU UNIVERSO DE BODA, ORDENADO.</span>
        </div>

        <nav className="sidebar-nav">
          <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <LayoutDashboard size={16} /> Panel de Control
          </button>
          <button className={`nav-item ${activeTab === 'budget' ? 'active' : ''}`} onClick={() => setActiveTab('budget')}>
            <DollarSign size={16} /> Presupuestos
          </button>
          <button className={`nav-item ${activeTab === 'guests' ? 'active' : ''}`} onClick={() => setActiveTab('guests')}>
            <Users size={16} /> Lista de Invitados
          </button>
          <button className={`nav-item ${activeTab === 'seating' ? 'active' : ''}`} onClick={() => setActiveTab('seating')}>
            <Grid size={16} /> Seating Plan
          </button>
          <button className={`nav-item ${activeTab === 'invitation' ? 'active' : ''}`} onClick={() => setActiveTab('invitation')}>
            <CreditCard size={16} /> Invitación Digital
          </button>
          <button className={`nav-item ${activeTab === 'calendar' ? 'active' : ''}`} onClick={() => setActiveTab('calendar')}>
            <Calendar size={16} /> Agenda y Tareas
          </button>

          {isAdmin && (
            <button className={`nav-item ${activeTab === 'feedback' ? 'active' : ''}`} onClick={() => setActiveTab('feedback')} style={{ borderLeftColor: 'var(--gold)' }}>
              <MessageSquare size={16} /> Admin Feedback
            </button>
          )}

          <div className="sidebar-divider"></div>

          <a className="nav-item nav-item-special" href="https://cosmiclove.es/inspiracion/" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
            <Sparkles size={16} /> Inspiración
          </a>
          <a className="nav-item nav-item-special" href="https://cosmiclove.es/proveedores-boda-seleccionados/" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
            <Compass size={16} /> Cosmic Selection
          </a>
        </nav>

        <div className="sidebar-footer">
          <button type="button" className="btn-help-guide" onClick={() => setShowGuideModal(true)} title="Ver guía de bienvenida">
            <HelpCircle size={14} /> Guía del Portal
          </button>
          <button type="button" className="btn-logout-footer" onClick={handleLogout} title="Cerrar sesión">
            <LogOut size={14} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Contenido Principal de la Aplicación */}
      <main className="portal-content">
        {activeTab === 'dashboard' && (
          <Dashboard
            data={weddingData}
            guests={guests}
            budgetItems={budgetItems}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            events={events}
            setEvents={handleSetEvents}
          />
        )}
        {activeTab === 'budget' && (
          <BudgetManager
            budgetItems={budgetItems}
            setBudgetItems={handleSetBudgetItems}
            totalBudget={weddingData.budget}
            setTotalBudget={(newBudget) => {
              handleSetWeddingData({ ...weddingData, budget: newBudget });
            }}
          />
        )}
        {activeTab === 'guests' && (
          <GuestListManager
            guests={guests}
            setGuests={handleSetGuests}
            weddingData={weddingData}
          />
        )}
        {activeTab === 'seating' && (
          <SeatingPlan
            guests={guests}
            setGuests={handleSetGuests}
            tables={tables}
            setTables={handleSetTables}
          />
        )}
        {activeTab === 'invitation' && (
          <InvitationDesigner
            data={weddingData}
          />
        )}
        {activeTab === 'calendar' && (
          <CalendarPlanner
            events={events}
            setEvents={handleSetEvents}
            weddingDate={weddingData.date}
          />
        )}
        {activeTab === 'feedback' && isAdmin && (
          <AdminFeedback />
        )}
      </main>

      {/* Widget de Feedback para reportar fallos y mejoras */}
      <FeedbackWidget weddingId={weddingData?.id} userEmail={session?.user?.email} />

      <UserGuideModal isOpen={showGuideModal} onClose={() => setShowGuideModal(false)} setActiveTab={setActiveTab} />

      <style>{`
        .portal-app {
          display: flex;
          min-height: 100vh;
          background-color: var(--cream);
        }

        /* Sidebar lateral */
        .portal-sidebar {
          width: 260px;
          background-color: var(--white);
          border-right: 1px solid var(--line);
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
          height: 100vh;
        }
        @media (max-width: 900px) {
          .portal-app {
            flex-direction: column;
          }
          .portal-sidebar {
            width: 100%;
            height: auto;
            position: relative;
          }
        }
        .sidebar-brand {
          padding: 32px 24px;
          border-bottom: 1px solid var(--line);
        }
        .sidebar-brand-icon {
          color: var(--gold);
          margin-bottom: 8px;
        }
        .sidebar-brand h2 {
          font-family: var(--font-serif);
          font-size: 24px;
          letter-spacing: -0.3px;
        }
        .sidebar-brand span {
          font-family: var(--font-sans);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--accent);
          line-height: 1.4;
          text-align: center;
          margin-top: 4px;
        }
        
        .sidebar-divider {
          height: 1px;
          background-color: var(--line);
          margin: 12px 16px;
          display: block;
        }
        @media (max-width: 900px) {
          .sidebar-divider {
            display: none;
          }
        }

        .sidebar-nav {
          padding: 24px 16px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
        }
        @media (max-width: 900px) {
          .sidebar-nav {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
            padding: 16px;
          }
        }
        .nav-item {
          background: none;
          border: none;
          padding: 12px 16px;
          font-family: var(--font-sans);
          font-size: 12px;
          font-weight: 500;
          color: var(--muted);
          text-align: left;
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }
        @media (max-width: 900px) {
          .nav-item {
            padding: 10px 12px;
            font-size: 11.5px;
            background-color: var(--cream);
            border: 1px solid var(--line);
            justify-content: flex-start;
          }
        }
        .nav-item:hover {
          color: var(--ink);
          background-color: var(--cream);
        }
        .nav-item.active {
          color: var(--ink);
          background-color: var(--cream-dark);
          font-weight: 600;
        }
        @media (max-width: 900px) {
          .nav-item.active {
            background-color: var(--cream-dark);
            border-color: var(--ink);
          }
        }
        .nav-item-special {
          text-transform: uppercase;
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 0.05em;
          color: var(--gold-hover) !important;
        }
        @media (max-width: 900px) {
          .nav-item-special {
            font-size: 11px !important;
            border-color: var(--gold);
            background-color: rgba(197, 168, 128, 0.05);
          }
        }
        .nav-item-special:hover {
          color: var(--ink) !important;
        }
        
        .sidebar-footer {
          padding: 24px;
          border-top: 1px solid var(--line);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        @media (max-width: 900px) {
          .sidebar-footer {
            flex-direction: row;
            justify-content: center;
            gap: 24px;
            align-items: center;
            text-align: center;
            border-top: none;
            border-bottom: 1px solid var(--line);
            padding: 16px;
          }
        }
        .btn-logout-footer {
          background: none;
          border: none;
          color: var(--accent);
          font-family: var(--font-sans);
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          cursor: pointer;
          text-align: left;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: var(--transition);
        }
        .btn-logout-footer:hover {
          color: var(--red);
        }
        .btn-help-guide {
          background: none;
          border: none;
          color: var(--gold-hover);
          font-family: var(--font-sans);
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          cursor: pointer;
          text-align: left;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: var(--transition);
        }
        .btn-help-guide:hover {
          color: var(--ink);
        }

        /* Contenido */
        .portal-content {
          flex: 1;
          background-color: var(--cream);
          overflow-y: auto;
          min-height: 100vh;
          position: relative;
          z-index: 1;
        }
        .portal-content::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: url('/bg-stars.png');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          background-attachment: fixed;
          opacity: 0.15;
          z-index: -1;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
