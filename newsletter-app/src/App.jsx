import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings as SettingsIcon, 
  BookOpen, 
  Send, 
  FileText, 
  Sparkles, 
  Plus, 
  Trash2, 
  Download, 
  Upload, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Copy, 
  ExternalLink, 
  Globe, 
  Mail, 
  Image as ImageIcon 
} from 'lucide-react';
import Settings from './components/Settings';

const HISTORICAL_NEWSLETTERS = [
  { id: 'h21', title: 'Muchas novias lo descubren justo antes de la boda.', theme: 'Planificación de última hora', date: '2026-05-27', openRate: 41.94, ctr: 1.11, clicks: 24 },
  { id: 'h20', title: 'Algo está cambiando en las bodas', theme: 'Tendencias de bodas', date: '2026-05-20', openRate: 43.35, ctr: 0.84, clicks: 18 },
  { id: 'h19', title: 'El regreso del velo', theme: 'Moda y accesorios', date: '2026-05-13', openRate: 45.80, ctr: 2.13, clicks: 46 },
  { id: 'h18', title: 'La novia de 2027 no se parece a lo que esperabas', theme: 'Expectativas y futuro', date: '2026-05-07', openRate: 38.74, ctr: 3.14, clicks: 68 },
  { id: 'h17', title: '7 cosas que una novia deja para el final…', theme: 'Organización final', date: '2026-04-23', openRate: 47.71, ctr: 2.06, clicks: 45 },
  { id: 'h16', title: 'Lo que puede hacer vuestra boda más especial', theme: 'Detalles premium', date: '2026-04-09', openRate: 50.75, ctr: 2.36, clicks: 52 },
  { id: 'h15', title: 'La boda perfecta NO existe.', theme: 'Mentalidad y calma', date: '2026-03-11', openRate: 53.10, ctr: 0.81, clicks: 18 },
  { id: 'h14', title: 'Casarse en 2026: lo que cuesta.', theme: 'Presupuesto y costes', date: '2026-02-24', openRate: 61.47, ctr: 2.82, clicks: 57 },
  { id: 'h13', title: '6 planes distintos para San Valentín', theme: 'San Valentín', date: '2026-02-10', openRate: 56.80, ctr: 2.90, clicks: 55 },
  { id: 'h12', title: 'Porque este año no empieza una boda.', theme: 'Inicio de preparativos', date: '2026-01-13', openRate: 57.09, ctr: 0.86, clicks: 17 },
  { id: 'h11', title: 'Si os casáis en 2026 este email es para vosotros.', theme: 'Planificación anual', date: '2025-12-29', openRate: 56.85, ctr: 1.37, clicks: 28 },
  { id: 'h10', title: 'Olvídate de disfrazarte de novia.', theme: 'Estilo de novia', date: '2025-12-11', openRate: 62.73, ctr: 2.25, clicks: 44 },
  { id: 'h9', title: 'Brindis rituales y el viaje de vuestros sueños', theme: 'Protocolo y luna de miel', date: '2025-11-19', openRate: 63.40, ctr: 0.57, clicks: 11 },
  { id: 'h8', title: 'Objetivo: planifica sin estrés.', theme: 'Psicología y estrés', date: '2025-10-07', openRate: 68.24, ctr: 1.71, clicks: 29 },
  { id: 'h7', title: 'Flores que cuentan historias de amor', theme: 'Decoración floral', date: '2025-09-19', openRate: 54.58, ctr: 1.40, clicks: 21 },
  { id: 'h6', title: 'Adiós sombrilla hola vestido de novia.', theme: 'Moda nupcial', date: '2025-09-04', openRate: 69.30, ctr: 3.03, clicks: 40 },
  { id: 'h5', title: 'Lo auténtico en las bodas', theme: 'Autenticidad', date: '2025-08-21', openRate: 63.72, ctr: 1.06, clicks: 12 },
  { id: 'h4', title: 'No todos los que hacen bodas... son para tu boda.', theme: 'Selección de proveedores', date: '2025-07-31', openRate: 49.90, ctr: 1.04, clicks: 10 },
  { id: 'h3', title: '¿Habéis hablado de esto? 10 decisiones clave para vuestra boda.', theme: 'Decisiones iniciales', date: '2025-07-24', openRate: 59.77, ctr: 1.84, clicks: 18 },
  { id: 'h2', title: 'Cuando el ARTE se cuela en tu boda.', theme: 'Estética y arte', date: '2025-07-15', openRate: 53.00, ctr: 1.50, clicks: 13 },
  { id: 'h1', title: '¿Organizas tu boda? No te vayas de vacaciones sin esto.', theme: 'Organización de verano', date: '2025-07-15', openRate: 40.96, ctr: 3.64, clicks: 32 }
];

const MONTHLY_THEMES = {
  'Enero': {
    focus: 'Inicio de planificación y presupuestos',
    recommendations: [
      'Cómo definir las prioridades de presupuesto y repartir los gastos iniciales.',
      'Calendario ideal de tareas de boda para el año entrante.',
      'Inspiración para bodas de invierno y paletas de colores fríos.'
    ],
    tips: 'Las novias están muy motivadas al inicio del año. Enfócate en el orden, la organización y la claridad de pasos.'
  },
  'Febrero': {
    focus: 'San Valentín y proveedores clave',
    recommendations: [
      'Ideas para pedidas de mano y anillos de compromiso.',
      'Cómo elegir al fotógrafo y videografo sin equivocarse.',
      'Planes originales y alternativos de San Valentín.'
    ],
    tips: 'Mes del amor. Aprovecha el romanticismo y las ganas de empezar a reservar los proveedores principales (foto/video).'
  },
  'Marzo': {
    focus: 'Primeras visitas a fincas y espacios',
    recommendations: [
      '5 preguntas imprescindibles que hacer antes de reservar una finca.',
      'Tendencias florales y banquetes de primavera.',
      'Diferencias entre wedding planner y coordinador de espacio.'
    ],
    tips: 'Comienza el buen tiempo. Las parejas visitan fincas. Es el momento de hablar de espacios, contratos y banquete.'
  },
  'Abril': {
    focus: 'El vestido de novia y la estética',
    recommendations: [
      'Tipos de escotes y siluetas según tu estilo personal.',
      'Cómo organizar la primera prueba del vestido.',
      'Ideas de papelería e invitaciones digitales con personalidad.'
    ],
    tips: 'Se intensifica la búsqueda de vestido. Habla del atelier, la costura a medida y complementos.'
  },
  'Mayo': {
    focus: 'Protocolo de invitados y seating plan',
    recommendations: [
      'Reglas de oro para estructurar las mesas de boda sin dramas.',
      'Cómo gestionar las confirmaciones de asistencia (RSVP) a tiempo.',
      'Detalles especiales para los testigos y padrinos.'
    ],
    tips: 'Comienza la temporada de bodas. Los novios están nerviosos con las listas de invitados. Da pautas prácticas sobre seating plan.'
  },
  'Junio': {
    focus: 'Bodas de verano y fiesta',
    recommendations: [
      'Cómo preparar un córner de hidratación y abanicos premium.',
      'Ideas para la barra libre: cócteles personalizados y recena.',
      'La playlist perfecta para el baile y la música en directo.'
    ],
    tips: 'Calor y fiesta. Enfócate en la música, la iluminación, el baile y cómo combatir las altas temperaturas de forma elegante.'
  },
  'Julio': {
    focus: 'Luna de miel y maletas',
    recommendations: [
      'Destinos tendencia para lunas de miel boutique.',
      'Consejos de belleza para que el maquillaje aguante el calor.',
      'Qué meter en el kit de emergencia para el día de la boda.'
    ],
    tips: 'Mes de viajes. Las parejas sueñan con las vacaciones y la luna de miel. Comparte guías de destinos premium.'
  },
  'Agosto': {
    focus: 'Planificación en vacaciones y calma',
    recommendations: [
      'Tareas sencillas de boda que puedes adelantar desde la tumbona.',
      'Cómo desconectar de la organización y recargar pilas en pareja.',
      'Ideas de regalos de boda ecológicos y detalles para invitados.'
    ],
    tips: 'Poco volumen de trabajo en proveedores. Es un buen momento para hablar de relajación, autocuidado y pequeños detalles.'
  },
  'Septiembre': {
    focus: 'Vuelta al orden y bodas de otoño',
    recommendations: [
      'Inspiración para bodas otoñales: decoración cálida y luces de hadas.',
      'El vestido de novia con mangas: elegancia y versatilidad.',
      'Cómo reajustar el presupuesto tras los meses de verano.'
    ],
    tips: 'Inicio del "nuevo curso". Muchos novios se comprometen en verano. Enfócate en bodas otoñales y en retomar la organización.'
  },
  'Octubre': {
    focus: 'Catering y delicias de temporada',
    recommendations: [
      'Menús de boda de otoño: productos de la tierra y platos reconfortantes.',
      'La importancia de la prueba de menú y el catering.',
      'Ideas de iluminación para bodas por la tarde.'
    ],
    tips: 'Momento clave de la degustación y el catering. Habla de vinos, quesos, corners y menús cálidos.'
  },
  'Noviembre': {
    focus: 'Compras inteligentes y Black Friday',
    recommendations: [
      'Cómo aprovechar el Black Friday en papelería, joyas y detalles.',
      'Colores tendencia de invierno (marsala, verde bosque, dorado).',
      'Bodas íntimas o elopements: el encanto de lo pequeño.'
    ],
    tips: 'Aprovechar ofertas. Guía a la novia sobre qué cosas vale la pena comprar con descuento para ahorrar en su presupuesto.'
  },
  'Diciembre': {
    focus: 'Bodas navideñas y magia',
    recommendations: [
      'Cómo decorar una boda de invierno con toques navideños y acogedores.',
      'Ideas para regalar a tu pareja en su primera Navidad prometidos.',
      'Propósitos de organización para la boda del próximo año.'
    ],
    tips: 'Espíritu festivo. Habla de la magia del invierno, decoración con terciopelo, luces y chimeneas.'
  }
};

const cleanString = (str) => {
  if (!str) return '';
  return str.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^\w\s]/g, "") // remove punctuation
    .trim();
};

export default function App() {
  // Navigation & UI
  const [step, setStep] = useState(1);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('wizard'); // 'wizard' or 'history'
  
  // Data State
  const [pastNewsletters, setPastNewsletters] = useState([]);
  const [referenceDocs, setReferenceDocs] = useState([]);
  const [sourceText, setSourceText] = useState('');
  const [selectedRefs, setSelectedRefs] = useState([]);
  
  // Generation State
  const [proposedThemes, setProposedThemes] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState(null);
  
  // Outputs
  const [generatedWPTitle, setGeneratedWPTitle] = useState('');
  const [generatedWPContent, setGeneratedWPContent] = useState('');
  const [generatedBrevoContent, setGeneratedBrevoContent] = useState('');
  const [imagePrompt, setImagePrompt] = useState('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState('');
  const [isImageGenerating, setIsImageGenerating] = useState(false);
  
  // Loading & Errors
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedType, setCopiedType] = useState(null); // 'wp_title', 'wp_content', 'brevo', 'image_prompt'
  
  // API Integration Actions Status
  const [wpStatus, setWpStatus] = useState({ state: 'idle', message: '', link: '' });
  const [brevoStatus, setBrevoStatus] = useState({ state: 'idle', message: '' });

  // Add past newsletter modal
  const [showAddHistoryModal, setShowAddHistoryModal] = useState(false);
  const [newHistoryTitle, setNewHistoryTitle] = useState('');
  const [newHistoryTheme, setNewHistoryTheme] = useState('');
  const [newHistoryDate, setNewHistoryDate] = useState(new Date().toISOString().split('T')[0]);

  // File Input Ref
  const fileInputRef = useRef(null);

  // States for strategic planning panel
  const [activePlanningTab, setActivePlanningTab] = useState('monthly');
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const monthsList = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return monthsList[new Date().getMonth()];
  });
  const [isSyncingMetrics, setIsSyncingMetrics] = useState(false);
  const [syncMetricsMessage, setSyncMetricsMessage] = useState(null);
  const [excludedThemes, setExcludedThemes] = useState([]);

  // Load configuration and data on mount
  useEffect(() => {
    // Check if Gemini API Key is configured
    const key = localStorage.getItem('nl_gemini_key');
    if (!key) {
      setIsSettingsOpen(true);
    }
    
    // Seed initial past newsletters if empty, or migrate old default 3 items to 21 real ones
    const savedHistory = localStorage.getItem('nl_history');
    let historyToSet = [];
    if (savedHistory) {
      const parsed = JSON.parse(savedHistory);
      // Migrate old default items if present
      if (parsed.length <= 3 && parsed.some(n => n.title.includes('Elegir la Finca Perfecta') || n.title.includes('Presupuesto sin Sorpresas'))) {
        historyToSet = HISTORICAL_NEWSLETTERS;
        localStorage.setItem('nl_history', JSON.stringify(HISTORICAL_NEWSLETTERS));
      } else {
        historyToSet = parsed;
      }
    } else {
      historyToSet = HISTORICAL_NEWSLETTERS;
      localStorage.setItem('nl_history', JSON.stringify(HISTORICAL_NEWSLETTERS));
    }
    setPastNewsletters(historyToSet);

    // Load reference style documents
    const savedRefs = localStorage.getItem('nl_references');
    if (savedRefs) {
      const parsedRefs = JSON.parse(savedRefs);
      setReferenceDocs(parsedRefs);
      // Select all by default
      setSelectedRefs(parsedRefs.map(r => r.id));
    }
  }, []);

  // Update localStorage when lists change
  const saveHistoryToLocalStorage = (updatedHistory) => {
    setPastNewsletters(updatedHistory);
    localStorage.setItem('nl_history', JSON.stringify(updatedHistory));
  };

  const saveRefsToLocalStorage = (updatedRefs) => {
    setReferenceDocs(updatedRefs);
    localStorage.setItem('nl_references', JSON.stringify(updatedRefs));
  };

  // Import / Export Data
  const exportAllData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(
      JSON.stringify({
        history: pastNewsletters,
        references: referenceDocs,
        settings: {
          gemini: localStorage.getItem('nl_gemini_key') || '',
          wp_url: localStorage.getItem('nl_wp_url') || '',
          wp_user: localStorage.getItem('nl_wp_user') || '',
          wp_password: localStorage.getItem('nl_wp_password') || '',
          brevo: localStorage.getItem('nl_brevo_key') || ''
        }
      }, null, 2)
    );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `newsletter_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importDataFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.history) saveHistoryToLocalStorage(parsed.history);
        if (parsed.references) saveRefsToLocalStorage(parsed.references);
        if (parsed.settings) {
          if (parsed.settings.gemini) localStorage.setItem('nl_gemini_key', parsed.settings.gemini);
          if (parsed.settings.wp_url) localStorage.setItem('nl_wp_url', parsed.settings.wp_url);
          if (parsed.settings.wp_user) localStorage.setItem('nl_wp_user', parsed.settings.wp_user);
          if (parsed.settings.wp_password) localStorage.setItem('nl_wp_password', parsed.settings.wp_password);
          if (parsed.settings.brevo) localStorage.setItem('nl_brevo_key', parsed.settings.brevo);
        }
        alert('Copia de seguridad importada con éxito.');
      } catch (err) {
        alert('Error al leer el archivo. Asegúrate de que sea un JSON válido.');
      }
    };
    reader.readAsText(file);
  };



  // Add custom past newsletter to history manually
  const handleAddHistoryItem = (e) => {
    e.preventDefault();
    if (!newHistoryTitle || !newHistoryTheme) return;
    
    const newItem = {
      id: 'man_' + Math.random().toString(36).substring(2, 9) + Date.now().toString().slice(-4),
      title: newHistoryTitle,
      theme: newHistoryTheme,
      date: newHistoryDate
    };
    
    const updated = [newItem, ...pastNewsletters];
    saveHistoryToLocalStorage(updated);
    
    setNewHistoryTitle('');
    setNewHistoryTheme('');
    setShowAddHistoryModal(false);
  };

  // Delete history item
  const handleDeleteHistoryItem = (id) => {
    if (window.confirm('¿Seguro que deseas eliminar esta newsletter del historial?')) {
      const updated = pastNewsletters.filter(item => item.id !== id);
      saveHistoryToLocalStorage(updated);
    }
  };

  // Upload style documents
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const textContent = event.target.result;
        const newRef = {
          id: 'ref_' + Math.random().toString(36).substring(2, 9) + Date.now().toString().slice(-4),
          filename: file.name,
          text: textContent,
          size: file.size,
          addedAt: new Date().toISOString().split('T')[0]
        };
        const updated = [...referenceDocs, newRef];
        saveRefsToLocalStorage(updated);
        setSelectedRefs(prev => [...prev, newRef.id]);
      };
      reader.readAsText(file);
    });
    
    // reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Delete reference document
  const handleDeleteRef = (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este documento de estilo?')) {
      const updated = referenceDocs.filter(doc => doc.id !== id);
      saveRefsToLocalStorage(updated);
      setSelectedRefs(prev => prev.filter(rId => rId !== id));
    }
  };

  // Toggle selected reference doc
  const handleToggleRefSelection = (id) => {
    if (selectedRefs.includes(id)) {
      setSelectedRefs(prev => prev.filter(rId => rId !== id));
    } else {
      setSelectedRefs(prev => [...prev, id]);
    }
  };

  // -------------------------------------------------------------
  // GEMINI CALLS
  // -------------------------------------------------------------
  const callGeminiAPI = async (promptText) => {
    const apiKey = localStorage.getItem('nl_gemini_key');
    if (!apiKey) {
      throw new Error('API Key de Gemini no configurada. Haz clic en el botón de Configuración en la esquina superior derecha.');
    }
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: promptText }]
        }]
      })
    });
    
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const message = errData.error?.message || `HTTP ${response.status}`;
      throw new Error(`Error en API de Gemini: ${message}`);
    }
    
    const data = await response.json();
    const textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textOutput) {
      throw new Error('No se recibió respuesta válida de la API de Gemini.');
    }
    
    return textOutput;
  };

  // STEP 1 -> STEP 2: Generate Themes
  const generateThemes = async () => {
    if (!sourceText.trim()) {
      setErrorMessage('Por favor, introduce las ideas o contenidos de partida para esta semana.');
      return;
    }
    
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      // Gather past newsletter themes to avoid repeats, including manually excluded themes
      const pastThemesList = [
        ...pastNewsletters.map(n => `- ${n.theme} (Título: ${n.title})`),
        ...excludedThemes.map(t => `- TEMA EXCLUIDO (Evitar): ${t}`)
      ].join('\n');
      
      // Sort past newsletters to find the highest performing ones
      const topPerformingList = [...pastNewsletters]
        .filter(n => n.openRate !== undefined)
        .sort((a, b) => b.openRate - a.openRate)
        .slice(0, 5)
        .map(n => `- Título: "${n.title}" (Tasa de Apertura: ${n.openRate}%, CTR: ${n.ctr}%)`)
        .join('\n');
      
      // Gather style references
      const styleExamples = referenceDocs
        .filter(r => selectedRefs.includes(r.id))
        .map(r => `Documento: ${r.filename}\nContenido:\n${r.text.substring(0, 1000)}...`)
        .join('\n\n');
        
      const prompt = `
Actúas como un redactor experto para una newsletter semanal de bodas premium (enviada los miércoles).
Tu objetivo actual es proponer 3 temas de cara a la newsletter de esta semana basándote en los contenidos y notas proporcionados.

Debes evitar repetir temas de las newsletters pasadas:
${pastThemesList || 'No hay temas registrados aún.'}

${topPerformingList ? `A modo de inspiración, aquí tienes nuestros 5 títulos históricos que mejor tasa de apertura y clics han tenido. Intenta proponer títulos sugerentes, intrigantes o cercanos similares a este estilo de éxito:
${topPerformingList}` : ''}

Notas/Ideas y fuentes para esta semana:
"${sourceText}"

${styleExamples ? `Ejemplos de nuestro estilo y tono habituales:\n${styleExamples}` : 'Escribe con un tono elegante, cercano, inspirador y premium.'}

Responde estrictamente con un objeto JSON formateado. No incluyas explicaciones adicionales antes o después del JSON.
El JSON debe ser un array con exactamente 3 objetos y tener la siguiente estructura:
[
  {
    "id": 1,
    "title": "Título sugerido para la newsletter",
    "theme": "Tema general (ej: Decoración, Protocolo, Presupuestos)",
    "hook": "Un gancho corto e irresistible para el asunto del email",
    "desc": "Breve explicación de qué tratará la newsletter (2-3 líneas) y por qué encaja con la temática semanal."
  },
  {
    "id": 2,
    "title": "...",
    "theme": "...",
    "hook": "...",
    "desc": "..."
  },
  {
    "id": 3,
    "title": "...",
    "theme": "...",
    "hook": "...",
    "desc": "..."
  }
]
`;

      const responseText = await callGeminiAPI(prompt);
      
      // Parse JSON from code blocks if necessary
      let cleanText = responseText.trim();
      if (cleanText.startsWith('```')) {
        const matches = cleanText.match(/```(?:json)?([\s\S]*?)```/);
        if (matches && matches[1]) {
          cleanText = matches[1].trim();
        }
      }
      
      const parsedThemes = JSON.parse(cleanText);
      setProposedThemes(parsedThemes);
      setSelectedTheme(parsedThemes[0]); // default select first
      setStep(2);
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'Error al proponer temas. Verifica tu API Key.');
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 2 -> STEP 3: Generate WordPress + Brevo Content
  const generateNewsletterContents = async () => {
    if (!selectedTheme) return;
    
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      const styleExamples = referenceDocs
        .filter(r => selectedRefs.includes(r.id))
        .map(r => `Ejemplo de Estilo:\n${r.text.substring(0, 1500)}`)
        .join('\n\n');

      const customToneGuidelines = localStorage.getItem('nl_tone_guidelines') || '';
        
      const prompt = `
Actúas como redactor jefe de Cosmic Love. Has seleccionado este tema para la newsletter de esta semana:
Tema: "${selectedTheme.theme}"
Título Propuesto: "${selectedTheme.title}"
Gancho / Asunto: "${selectedTheme.hook}"
Concepto: "${selectedTheme.desc}"

Directrices generales del usuario para esta semana:
"${sourceText}"

${customToneGuidelines ? `INSTRUCCIONES DE TONO Y ESTILO (SÍGUELAS ESTRICTAMENTE Y DE MANERA PRIORITARIA):\n"${customToneGuidelines}"\n` : ''}
${styleExamples ? `Debes imitar fielmente el tono, la longitud, la forma de estructurar los párrafos y las despedidas de estos ejemplos:\n${styleExamples}` : 'Usa un tono inspirador, cercano, sofisticado y sumamente práctico para parejas que organizan su boda.'}

Genera dos bloques principales de contenido y un prompt en inglés para la portada:
1. **Artículo de WordPress**:
   - Título SEO-optimizando y atractivo para la web.
   - Extracto corto (1-2 líneas).
   - Cuerpo del artículo formateado en HTML limpio (usa <h2> para subtítulos, <p> para párrafos, <strong> para énfasis, <ul> y <li> para listas). No uses <h1> ni estilos inline. Debe tener entre 500 y 800 palabras, estructurado como un artículo de blog valioso.
2. **Newsletter para Brevo**:
   - Una newsletter más personal y directa. Debe empezar con un saludo cercano, desarrollar el tema en varios párrafos amenos, contener llamadas a la acción que inviten a leer el post completo en la web, y una despedida cálida firmando como el equipo de Cosmic Love. No uses HTML en exceso en este bloque, estructúralo con párrafos de texto limpios.
3. **Prompt de Imagen**:
   - Un prompt detallado en inglés para generar la portada del artículo/newsletter (ej. estilo fotografía de bodas de lujo, colores suaves y elegantes, flat lay de elementos de boda, formato horizontal 16:9).

Responde estrictamente con un objeto JSON estructurado, sin bloques de código ni explicaciones previas. El JSON debe cumplir este esquema:
{
  "wordpress_title": "Título del artículo de la web",
  "wordpress_excerpt": "Extracto o entradilla corta para la web",
  "wordpress_content": "Cuerpo del artículo en HTML limpio...",
  "brevo_content": "Texto completo del email (Brevo) con saltos de línea...",
  "image_prompt": "Prompt en inglés para generación de imagen con IA"
}
`;

      const responseText = await callGeminiAPI(prompt);
      
      let cleanText = responseText.trim();
      if (cleanText.startsWith('```')) {
        const matches = cleanText.match(/```(?:json)?([\s\S]*?)```/);
        if (matches && matches[1]) {
          cleanText = matches[1].trim();
        }
      }
      
      const parsedOutput = JSON.parse(cleanText);
      setGeneratedWPTitle(parsedOutput.wordpress_title || selectedTheme.title);
      setGeneratedWPContent(parsedOutput.wordpress_content || '');
      setGeneratedBrevoContent(parsedOutput.brevo_content || '');
      setImagePrompt(parsedOutput.image_prompt || 'elegant wedding editorial header, luxury style, warm golden light, cinematic 8k');
      
      // Reset API status
      setWpStatus({ state: 'idle', message: '', link: '' });
      setBrevoStatus({ state: 'idle', message: '' });
      
      setStep(3);
      
      // Trigger image generation asynchronously using Pollinations.ai
      generateImage(parsedOutput.image_prompt);
      
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'Error al redactar los contenidos. Comprueba tu API Key.');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate Image from Prompt (Pollinations.ai)
  const generateImage = (prompt) => {
    setIsImageGenerating(true);
    // Pollinations.ai generates images instantly using a URL. We add a random seed to prevent caching
    const seed = Math.floor(Math.random() * 100000);
    const encodedPrompt = encodeURIComponent(prompt + ", premium wedding luxury aesthetic, editorial, soft shadows, 4k");
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=576&nologo=true&seed=${seed}`;
    
    // We pre-load the image to know when it finishes loading
    const img = new Image();
    img.onload = () => {
      setGeneratedImageUrl(imageUrl);
      setIsImageGenerating(false);
    };
    img.onerror = () => {
      // Fallback
      setGeneratedImageUrl(imageUrl);
      setIsImageGenerating(false);
    };
    img.src = imageUrl;
  };

  // -------------------------------------------------------------
  // API INTEGRATIONS (WORDPRESS & BREVO)
  // -------------------------------------------------------------
  const publishToWordPress = async () => {
    const wpUrl = localStorage.getItem('nl_wp_url');
    const wpUser = localStorage.getItem('nl_wp_user');
    const wpPassword = localStorage.getItem('nl_wp_password');

    if (!wpUrl || !wpUser || !wpPassword) {
      setWpStatus({ 
        state: 'error', 
        message: 'Credenciales de WordPress incompletas. Configúralas pulsando el botón de arriba.',
        link: ''
      });
      return;
    }

    setWpStatus({ state: 'loading', message: 'Creando borrador en WordPress...', link: '' });

    try {
      const endpoint = `${wpUrl}/wp-json/wp/v2/posts`;
      const authHeader = 'Basic ' + btoa(`${wpUser}:${wpPassword}`);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader
        },
        body: JSON.stringify({
          title: generatedWPTitle,
          content: generatedWPContent,
          status: 'draft',
          excerpt: selectedTheme.hook // use the hook as a meta description placeholder
        })
      });

      if (!response.ok) {
        throw new Error(`WordPress respondió con código ${response.status}. Verifica que la URL, usuario y Contraseña de Aplicación sean correctos, y que tu web admita peticiones API REST.`);
      }

      const data = await response.json();
      setWpStatus({ 
        state: 'success', 
        message: '¡Borrador creado en WordPress con éxito!', 
        link: data.link || `${wpUrl}/wp-admin/edit.php`
      });
    } catch (err) {
      console.error(err);
      setWpStatus({ 
        state: 'error', 
        message: err.message || 'Error al conectar con la API de WordPress. Puede deberse a restricciones de CORS en tu servidor.',
        link: ''
      });
    }
  };

  const publishToBrevo = async () => {
    const brevoKey = localStorage.getItem('nl_brevo_key');
    if (!brevoKey) {
      setBrevoStatus({ 
        state: 'error', 
        message: 'API Key de Brevo no configurada. Configúrala pulsando el botón de arriba.' 
      });
      return;
    }

    setBrevoStatus({ state: 'loading', message: 'Creando borrador de campaña en Brevo...' });

    try {
      const endpoint = 'https://api.brevo.com/v3/emailCampaigns';
      
      // Convert plain text to simple HTML with paragraphs and breaks
      const htmlBody = generatedBrevoContent
        .split('\n\n')
        .map(p => `<p style="margin-bottom:15px; font-size:16px; line-height:1.6; color:#333333;">${p.replace(/\n/g, '<br>')}</p>`)
        .join('');

      const template = `
        <div style="font-family: sans-serif; max-width:600px; margin:0 auto; padding:20px; background-color:#ffffff;">
          ${generatedImageUrl ? `<img src="${generatedImageUrl}" alt="Header" style="width:100%; max-width:600px; height:auto; margin-bottom:25px; border-radius:8px;" />` : ''}
          ${htmlBody}
          <hr style="border:none; border-top:1px solid #eeeeee; margin:30px 0;" />
          <p style="font-size:12px; color:#999999; text-align:center;">Recibes este correo porque formas parte de Cosmic Love.</p>
        </div>
      `;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': brevoKey
        },
        body: JSON.stringify({
          name: `Newsletter - ${generatedWPTitle} (${new Date().toISOString().split('T')[0]})`,
          subject: selectedTheme.hook || generatedWPTitle,
          sender: { name: "Cosmic Love", email: "hola@cosmiclove.es" }, // customize default sender
          htmlContent: template,
          status: 'draft',
          recipients: { listIds: [1] } // standard list placeholder
        })
      });

      if (!response.ok) {
        const errDetails = await response.json().catch(() => ({}));
        throw new Error(errDetails.message || `Brevo respondió con código ${response.status}`);
      }

      setBrevoStatus({ 
        state: 'success', 
        message: '¡Campaña en borrador creada en Brevo con éxito! Accede a tu panel de Brevo para enviarla.' 
      });
    } catch (err) {
      console.error(err);
      setBrevoStatus({ 
        state: 'error', 
        message: err.message || 'Error al conectar con la API de Brevo. Por motivos de CORS, la llamada directa desde navegador puede ser bloqueada. Por favor, usa la copia manual.' 
      });
    }
  };

  const syncMetricsWithBrevo = async () => {
    const brevoKey = localStorage.getItem('nl_brevo_key');
    if (!brevoKey) {
      setSyncMetricsMessage({ 
        type: 'error', 
        text: 'API Key de Brevo no configurada. Configúrala pulsando el botón de engranaje arriba.' 
      });
      return;
    }

    setIsSyncingMetrics(true);
    setSyncMetricsMessage(null);

    try {
      // Fetch sent campaigns from Brevo (status = sent, type = classic, limit = 50)
      const endpoint = 'https://api.brevo.com/v3/emailCampaigns?type=classic&status=sent&limit=50';
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'api-key': brevoKey
        }
      });

      if (!response.ok) {
        const errDetails = await response.json().catch(() => ({}));
        throw new Error(errDetails.message || `Brevo respondió con código ${response.status}`);
      }

      const data = await response.json();
      const campaigns = data.campaigns || [];

      if (campaigns.length === 0) {
        setSyncMetricsMessage({
          type: 'success',
          text: 'No se encontraron campañas enviadas en tu cuenta de Brevo.'
        });
        return;
      }

      // Map campaigns to our format
      const updatedNewsletters = campaigns.map(camp => {
        const stats = camp.statistics || {};
        const sent = stats.sent || 0;
        const viewed = stats.viewed || 0;
        const uniqueClicks = stats.uniqueClicks || stats.clickers || 0;
        const openRate = sent > 0 ? parseFloat((viewed / sent * 100).toFixed(2)) : 0;
        const ctr = sent > 0 ? parseFloat((uniqueClicks / sent * 100).toFixed(2)) : 0;

        return {
          id: 'brevo_' + camp.id,
          title: camp.subject || camp.name,
          theme: camp.tag || 'Newsletter',
          date: camp.sentDate ? camp.sentDate.split('T')[0] : new Date().toISOString().split('T')[0],
          openRate: openRate,
          ctr: ctr,
          clicks: uniqueClicks
        };
      });

      // Merge with existing local history
      const mergedHistory = [...pastNewsletters];
      let updatedCount = 0;
      let addedCount = 0;

      updatedNewsletters.forEach(newItem => {
        // Find by subject title (case-insensitive and trimmed) or date match
        const existingIndex = mergedHistory.findIndex(oldItem => 
          oldItem.title.toLowerCase().trim() === newItem.title.toLowerCase().trim() ||
          oldItem.date === newItem.date
        );

        if (existingIndex !== -1) {
          // If we found it, update metrics
          mergedHistory[existingIndex] = {
            ...mergedHistory[existingIndex],
            openRate: newItem.openRate,
            ctr: newItem.ctr,
            clicks: newItem.clicks
          };
          updatedCount++;
        } else {
          // If it's a new sent campaign from Brevo, add it
          mergedHistory.push(newItem);
          addedCount++;
        }
      });

      // Sort history by date descending
      mergedHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
      saveHistoryToLocalStorage(mergedHistory);

      setSyncMetricsMessage({
        type: 'success',
        text: `¡Sincronización completada! Actualizados ${updatedCount} temas y añadidos ${addedCount} nuevos envíos de Brevo.`
      });
    } catch (err) {
      console.error(err);
      setSyncMetricsMessage({
        type: 'error',
        text: err.message || 'Error al conectar con la API de Brevo. Asegúrate de tener activa la extensión CORS.'
      });
    } finally {
      setIsSyncingMetrics(false);
    }
  };

  // -------------------------------------------------------------
  // COMPLETION & FINAL SAVING
  // -------------------------------------------------------------
  const handleCompleteNewsletterFlow = () => {
    // Add current newsletter to history to avoid repeating the theme
    const isAlreadyInHistory = pastNewsletters.some(n => n.title === generatedWPTitle);
    
    if (!isAlreadyInHistory) {
      const newHistoryItem = {
        id: 'gen_' + Math.random().toString(36).substring(2, 9) + Date.now().toString().slice(-4),
        title: generatedWPTitle,
        theme: selectedTheme?.theme || 'General',
        date: new Date().toISOString().split('T')[0]
      };
      const updated = [newHistoryItem, ...pastNewsletters];
      saveHistoryToLocalStorage(updated);
    }
    
    // Reset wizard
    setSourceText('');
    setProposedThemes([]);
    setSelectedTheme(null);
    setGeneratedWPTitle('');
    setGeneratedWPContent('');
    setGeneratedBrevoContent('');
    setGeneratedImageUrl('');
    setStep(1);
    setActiveTab('history');
    
    alert('¡Newsletter guardada en el historial! Has completado el flujo con éxito.');
  };

  // Helper function to copy text
  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="app-container">
      {/* HEADER PRINCIPAL */}
      <header className="app-header">
        <div className="brand-section">
          <h1>Redacción de Newsletter</h1>
          <p>Editor autónomo inteligente para Cosmic Love</p>
        </div>
        
        <div className="actions-section">
          <button 
            className={`btn ${activeTab === 'wizard' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('wizard')}
          >
            Asistente de Redacción
          </button>
          
          <button 
            className={`btn ${activeTab === 'history' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('history')}
          >
            Historial de Temas
          </button>

          <button 
            className="btn btn-secondary"
            onClick={() => setIsSettingsOpen(true)}
            title="Configurar credenciales API"
          >
            <SettingsIcon size={18} />
          </button>
        </div>
      </header>

      {/* ERROR DISPLAY BANNER */}
      {errorMessage && (
        <div className="card" style={{ borderLeft: '4px solid var(--crimson)', background: 'rgba(239,68,68,0.05)', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <AlertCircle className="text-gold" size={24} style={{ color: 'var(--crimson)' }} />
          <div style={{ flex: 1 }}>
            <h4 style={{ color: '#fff', fontSize: '14px', fontWeight: '600' }}>Error</h4>
            <p className="text-secondary" style={{ fontSize: '13px', marginTop: '2px' }}>{errorMessage}</p>
          </div>
        </div>
      )}

      {/* VISTA DEL WIZARD / ASISTENTE */}
      {activeTab === 'wizard' && (
        <>
          {/* Barra de progreso de pasos */}
          <div className="steps-indicator">
            <div className={`step-pill ${step === 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
              <div className="step-num">{step > 1 ? '✓' : '1'}</div>
              <span>Planificación</span>
            </div>
            <div className={`step-pill ${step === 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
              <div className="step-num">{step > 2 ? '✓' : '2'}</div>
              <span>Selección de Tema</span>
            </div>
            <div className={`step-pill ${step === 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`}>
              <div className="step-num">{step > 3 ? '✓' : '3'}</div>
              <span>Redacción</span>
            </div>
            <div className={`step-pill ${step === 4 ? 'active' : ''} ${step > 4 ? 'completed' : ''}`}>
              <div className="step-num">{step > 4 ? '✓' : '4'}</div>
              <span>Aprobación Web</span>
            </div>
            <div className={`step-pill ${step === 5 ? 'active' : ''}`}>
              <div className="step-num">5</div>
              <span>Aprobación Email</span>
            </div>
          </div>

          {/* PASO 1: ENTRADA Y FUENTES */}
          {step === 1 && (
            <>
              <div className="step-split">
              <div className="card">
                <h3 className="card-title">
                  <Sparkles className="text-gold" size={24} /> 
                  Notas de Partida para la Semana
                </h3>
                
                <div className="form-group">
                  <label className="form-label">Escribe tus ideas, enlaces o directrices de hoy:</label>
                  <textarea 
                    className="input-field" 
                    placeholder="Ej: Esta semana quiero hablar de cómo organizar las mesas de boda sin discusiones familiares, basándonos en las reglas del seating plan. También podemos añadir un tip rápido sobre avisar al catering con las alergias..."
                    value={sourceText}
                    onChange={(e) => setSourceText(e.target.value)}
                    style={{ minHeight: '260px' }}
                  ></textarea>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                  <button 
                    className="btn btn-primary"
                    disabled={isLoading || !sourceText.trim()}
                    onClick={generateThemes}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="spin" size={16} /> Proponiendo temas...
                      </>
                    ) : (
                      <>
                        Proponer Temas <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* COLUMNA LATERAL: DOCUMENTOS DE ESTILO */}
              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h3 className="card-title" style={{ fontSize: '18px', marginBottom: '12px' }}>
                  <BookOpen className="text-gold" size={20} />
                  Biblioteca de Estilo
                </h3>
                <p className="text-secondary" style={{ fontSize: '13px' }}>
                  Sube newsletters anteriores en texto plano (.txt, .md) para entrenar la IA en tu tono de voz.
                </p>

                {/* Subir archivo */}
                <div 
                  style={{ 
                    border: '2px dashed var(--border-color)', 
                    borderRadius: '12px', 
                    padding: '24px', 
                    textAlign: 'center', 
                    cursor: 'pointer',
                    background: 'rgba(255,255,255,0.01)'
                  }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="text-gold" size={24} style={{ margin: '0 auto 8px auto' }} />
                  <span style={{ fontSize: '13px', fontWeight: '500', display: 'block', color: '#fff' }}>
                    Seleccionar Archivos de Texto
                  </span>
                  <span className="text-muted" style={{ fontSize: '11px', marginTop: '4px', display: 'block' }}>
                    Soporta .txt, .md o .json
                  </span>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                    multiple 
                    accept=".txt,.md,.json,.html"
                    style={{ display: 'none' }} 
                  />
                </div>

                {/* Lista de referencias */}
                {referenceDocs.length > 0 ? (
                  <div className="list-references">
                    {referenceDocs.map((doc) => (
                      <div className="ref-item" key={doc.id}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input 
                            type="checkbox" 
                            checked={selectedRefs.includes(doc.id)} 
                            onChange={() => handleToggleRefSelection(doc.id)}
                            style={{ cursor: 'pointer' }}
                          />
                          <div className="ref-info">
                            <span className="ref-title" title={doc.filename}>{doc.filename}</span>
                            <span className="ref-meta">{(doc.size / 1024).toFixed(1)} KB</span>
                          </div>
                        </div>
                        <button 
                          className="btn-text" 
                          onClick={() => handleDeleteRef(doc.id)}
                          style={{ padding: '4px', color: 'var(--crimson)' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '24px 0', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'rgba(0,0,0,0.1)' }}>
                    <p className="text-muted" style={{ fontSize: '13px' }}>No hay referencias cargadas.</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* GUÍA DE PLANIFICACIÓN Y RENDIMIENTO HISTÓRICO */}
            <div className="card" style={{ marginTop: '24px' }}>
              <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '20px', gap: '16px' }}>
                <button
                  type="button"
                  className={`btn-tab ${activePlanningTab === 'monthly' ? 'active' : ''}`}
                  onClick={() => setActivePlanningTab('monthly')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: activePlanningTab === 'monthly' ? 'var(--gold)' : 'var(--text-secondary)',
                    borderBottom: activePlanningTab === 'monthly' ? '2px solid var(--gold)' : 'none',
                    paddingBottom: '10px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Sparkles size={16} />
                  Guía de Contenidos por Meses
                </button>
                <button
                  type="button"
                  className={`btn-tab ${activePlanningTab === 'history' ? 'active' : ''}`}
                  onClick={() => setActivePlanningTab('history')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: activePlanningTab === 'history' ? 'var(--gold)' : 'var(--text-secondary)',
                    borderBottom: activePlanningTab === 'history' ? '2px solid var(--gold)' : 'none',
                    paddingBottom: '10px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <BookOpen size={16} />
                  Análisis de Rendimiento Histórico (Métricas)
                </button>
              </div>

              {activePlanningTab === 'monthly' && (
                <div>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
                    <label className="form-label" style={{ margin: 0, fontWeight: '600' }}>Seleccionar Mes de Planificación:</label>
                    <select
                      className="input-field"
                      style={{ maxWidth: '200px', padding: '8px 12px', background: 'var(--card-bg)' }}
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                    >
                      {Object.keys(MONTHLY_THEMES).map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    <span className="text-secondary" style={{ fontSize: '13px' }}>
                      Enfoque del mes: <strong style={{ color: 'var(--gold)' }}>{MONTHLY_THEMES[selectedMonth].focus}</strong>
                    </span>
                  </div>

                  <div className="step-split" style={{ gap: '24px', alignItems: 'start' }}>
                    <div style={{ flex: 1.3 }}>
                      <h4 style={{ fontSize: '14px', color: '#fff', marginBottom: '12px', fontWeight: '600' }}>Temas Sugeridos para {selectedMonth}:</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {MONTHLY_THEMES[selectedMonth].recommendations.map((rec, i) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.02)', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                            <span style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.4' }}>{rec}</span>
                            <button
                              type="button"
                              className="btn btn-secondary"
                              style={{ padding: '6px 12px', fontSize: '11px', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '4px' }}
                              onClick={() => {
                                const addText = sourceText ? (sourceText.trim() + "\n- " + rec) : "- " + rec;
                                setSourceText(addText);
                              }}
                            >
                              <Plus size={12} /> Usar como Idea
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ flex: 0.7, background: 'rgba(212,175,55,0.03)', border: '1px dashed var(--gold)', padding: '20px', borderRadius: '12px' }}>
                      <h4 style={{ fontSize: '14px', color: 'var(--gold)', marginBottom: '10px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Sparkles size={16} /> Consejo Editorial ({selectedMonth})
                      </h4>
                      <p className="text-secondary" style={{ fontSize: '13px', lineHeight: '1.6' }}>
                        {MONTHLY_THEMES[selectedMonth].tips}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activePlanningTab === 'history' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                    <p className="text-secondary" style={{ fontSize: '13px', margin: 0, flex: 1 }}>
                      A continuación se muestran tus campañas anteriores y su rendimiento. Los temas marcados en verde son excelentes puntos de partida para inspirar el estilo de redacción.
                    </p>
                    <button
                      type="button"
                      className="btn"
                      disabled={isSyncingMetrics}
                      onClick={syncMetricsWithBrevo}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 16px',
                        fontSize: '12px',
                        background: 'linear-gradient(135deg, rgba(212,175,55,0.1) 0%, rgba(212,175,55,0.05) 100%)',
                        border: '1px solid var(--gold)',
                        color: 'var(--gold)',
                        fontWeight: '600',
                        cursor: 'pointer',
                        borderRadius: '8px'
                      }}
                    >
                      {isSyncingMetrics ? (
                        <>
                          <Loader2 className="spin" size={14} /> Sincronizando...
                        </>
                      ) : (
                        <>
                          <Send size={14} /> Sincronizar con Brevo
                        </>
                      )}
                    </button>
                  </div>

                  {syncMetricsMessage && (
                    <div style={{
                      padding: '10px 14px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      marginBottom: '12px',
                      background: syncMetricsMessage.type === 'success' ? 'var(--emerald-glow)' : 'rgba(239, 68, 68, 0.05)',
                      color: syncMetricsMessage.type === 'success' ? 'var(--emerald)' : '#ef4444',
                      border: '1px solid ' + (syncMetricsMessage.type === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(239, 68, 68, 0.2)'),
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      {syncMetricsMessage.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                      <span>{syncMetricsMessage.text}</span>
                    </div>
                  )}
                  <div style={{ maxHeight: '350px', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid var(--border-color)', color: '#fff', background: 'rgba(255,255,255,0.02)' }}>
                          <th style={{ padding: '12px 16px' }}>Fecha</th>
                          <th style={{ padding: '12px 16px' }}>Asunto</th>
                          <th style={{ padding: '12px 16px', textAlign: 'center' }}>Apertura (Open Rate)</th>
                          <th style={{ padding: '12px 16px', textAlign: 'center' }}>CTR</th>
                          <th style={{ padding: '12px 16px', textAlign: 'center' }}>Exclusión</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pastNewsletters.map((n) => {
                          const hasMetrics = n.openRate !== undefined;
                          const isOpenRateHigh = n.openRate >= 60;
                          const isOpenRateMed = n.openRate >= 48 && n.openRate < 60;
                          
                          return (
                            <tr key={n.id} style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.01)' }} className="ref-item-row">
                              <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{n.date}</td>
                              <td style={{ padding: '12px 16px', fontWeight: '500' }}>{n.title}</td>
                              <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                {hasMetrics ? (
                                  <span style={{
                                    padding: '3px 8px',
                                    borderRadius: '6px',
                                    fontSize: '11px',
                                    fontWeight: '600',
                                    background: isOpenRateHigh ? 'rgba(16,185,129,0.1)' : (isOpenRateMed ? 'rgba(245,158,11,0.1)' : 'rgba(255,255,255,0.05)'),
                                    color: isOpenRateHigh ? '#10b981' : (isOpenRateMed ? '#f59e0b' : 'var(--text-secondary)')
                                  }}>
                                    {n.openRate}%
                                  </span>
                                ) : '-'}
                              </td>
                              <td style={{ padding: '12px 16px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                {hasMetrics ? `${n.ctr}%` : '-'}
                              </td>
                              <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                <button
                                  type="button"
                                  className="btn"
                                  style={{ 
                                    padding: '4px 10px', 
                                    fontSize: '11px', 
                                    backgroundColor: excludedThemes.includes(n.theme || n.title) ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                                    color: excludedThemes.includes(n.theme || n.title) ? '#ef4444' : 'var(--text-secondary)',
                                    borderColor: excludedThemes.includes(n.theme || n.title) ? '#ef4444' : 'var(--border-color)',
                                    fontWeight: excludedThemes.includes(n.theme || n.title) ? '600' : 'normal'
                                  }}
                                  onClick={() => {
                                    const themeName = n.theme || n.title;
                                    if (excludedThemes.includes(themeName)) {
                                      setExcludedThemes(prev => prev.filter(t => t !== themeName));
                                    } else {
                                      setExcludedThemes(prev => [...prev, themeName]);
                                    }
                                  }}
                                >
                                  {excludedThemes.includes(n.theme || n.title) ? 'Evitando' : 'Evitar'}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

          {/* PASO 2: PROPUESTA Y SELECCIÓN DE TEMA */}
          {step === 2 && (
            <div className="card">
              <h3 className="card-title">
                <Sparkles className="text-gold" size={24} /> 
                Sugerencias de Temas Generadas por IA
              </h3>
              <p className="text-secondary" style={{ marginBottom: '24px' }}>
                Hemos analizado tus notas y tu historial. Elige el tema que deseas desarrollar para el post web y el email de esta semana:
              </p>

              <div className="theme-options-grid">
                {proposedThemes.map((theme) => (
                  <div 
                    key={theme.id} 
                    className={`theme-card ${selectedTheme?.id === theme.id ? 'selected' : ''}`}
                    onClick={() => setSelectedTheme(theme)}
                  >
                    <div className="theme-card-header">
                      <h4 className="theme-title">{theme.title}</h4>
                      <span className="theme-badge">{theme.theme}</span>
                    </div>
                    <p className="theme-desc"><strong>Asunto sugerido:</strong> "{theme.hook}"</p>
                    <p className="theme-desc">{theme.desc}</p>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
                <button className="btn btn-secondary" onClick={() => setStep(1)}>
                  <ArrowLeft size={16} /> Volver a Notas
                </button>
                
                <button 
                  className="btn btn-primary"
                  onClick={generateNewsletterContents}
                  disabled={isLoading || !selectedTheme}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="spin" size={16} /> Redactando...
                    </>
                  ) : (
                    <>
                      Redactar Contenidos <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* PASO 3: REDACCIÓN COMPLETA E IMAGEN */}
          {step === 3 && (
            <div className="card">
              <h3 className="card-title">
                <FileText className="text-gold" size={24} /> 
                Contenidos Generados & Imagen de Portada
              </h3>
              
              <div className="step-split" style={{ alignItems: 'start' }}>
                <div>
                  <h4 style={{ color: '#fff', fontSize: '16px', marginBottom: '12px' }}>Vista Rápida</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                      <span className="text-muted" style={{ fontSize: '11px', textTransform: 'uppercase' }}>Título WordPress:</span>
                      <p style={{ color: '#fff', fontWeight: '600', fontSize: '15px', marginTop: '4px' }}>{generatedWPTitle}</p>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                      <span className="text-muted" style={{ fontSize: '11px', textTransform: 'uppercase' }}>Asunto Brevo:</span>
                      <p style={{ color: '#fff', fontWeight: '600', fontSize: '15px', marginTop: '4px' }}>{selectedTheme?.hook}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 style={{ color: '#fff', fontSize: '16px', marginBottom: '12px' }}>Portada de la Newsletter</h4>
                  
                  {isImageGenerating ? (
                    <div className="generated-image-box">
                      <div className="image-loader">
                        <Loader2 className="spin text-gold" size={32} />
                        <span style={{ fontSize: '13px' }}>Dibujando portada con IA...</span>
                      </div>
                    </div>
                  ) : generatedImageUrl ? (
                    <div className="generated-image-box">
                      <img src={generatedImageUrl} alt="Cover" />
                    </div>
                  ) : (
                    <div className="generated-image-box">
                      <span className="text-muted">No se pudo cargar la imagen</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                    <input 
                      type="text" 
                      className="input-field" 
                      style={{ flex: 1, fontSize: '12px' }}
                      value={imagePrompt}
                      onChange={(e) => setImagePrompt(e.target.value)}
                    />
                    <button 
                      className="btn btn-secondary" 
                      onClick={() => generateImage(imagePrompt)}
                      disabled={isImageGenerating}
                      style={{ padding: '8px 16px', fontSize: '12px' }}
                    >
                      Regenerar Imagen
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
                <button className="btn btn-secondary" onClick={() => setStep(2)}>
                  <ArrowLeft size={16} /> Volver a Temas
                </button>
                
                <button className="btn btn-primary" onClick={() => setStep(4)}>
                  Aprobar Artículo Web (WP) <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* PASO 4: APROBACIÓN DE WORDPRESS */}
          {step === 4 && (
            <div className="card">
              <h3 className="card-title">
                <Globe className="text-gold" size={24} /> 
                Aprobación del Artículo para la Web (WordPress)
              </h3>
              
              <div className="form-group">
                <label className="form-label">Título del Artículo</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={generatedWPTitle}
                  onChange={(e) => setGeneratedWPTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label className="form-label">Previsualización del Artículo (HTML)</label>
                  <button 
                    className="btn-text" 
                    style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                    onClick={() => copyToClipboard(generatedWPContent, 'wp_content')}
                  >
                    <Copy size={14} /> {copiedType === 'wp_content' ? '¡Copiado!' : 'Copiar HTML'}
                  </button>
                </div>
                
                {/* Editable WordPress HTML Area */}
                <textarea 
                  className="input-field" 
                  style={{ minHeight: '300px', fontFamily: 'monospace', fontSize: '13px' }}
                  value={generatedWPContent}
                  onChange={(e) => setGeneratedWPContent(e.target.value)}
                ></textarea>
              </div>

              {/* Status and Action Buttons */}
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', margin: '24px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <h4 style={{ color: '#fff', fontSize: '14px', fontWeight: '600' }}>Subida automática a WordPress</h4>
                    <p className="text-secondary" style={{ fontSize: '12px', marginTop: '2px' }}>
                      Crea un borrador directamente en tu web. Si falla por CORS, copia el HTML arriba y pégalo en tu editor.
                    </p>
                  </div>
                  <button 
                    className="btn btn-success"
                    onClick={publishToWordPress}
                    disabled={wpStatus.state === 'loading'}
                  >
                    {wpStatus.state === 'loading' ? (
                      <>
                        <Loader2 className="spin" size={16} /> Conectando...
                      </>
                    ) : (
                      'Subir Borrador a WordPress'
                    )}
                  </button>
                </div>

                {/* Sub-status feedback */}
                {wpStatus.state === 'success' && (
                  <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--emerald)', fontSize: '13px' }}>
                    <CheckCircle2 size={16} /> 
                    <span>{wpStatus.message}</span>
                    {wpStatus.link && (
                      <a href={wpStatus.link} target="_blank" rel="noreferrer" style={{ color: 'var(--gold)', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '2px', marginLeft: '8px' }}>
                        Ver Post <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                )}
                {wpStatus.state === 'error' && (
                  <div style={{ marginTop: '16px', display: 'flex', alignItems: 'start', gap: '8px', color: 'var(--crimson)', fontSize: '13px' }}>
                    <AlertCircle size={16} style={{ marginTop: '2px' }} /> 
                    <span>{wpStatus.message}</span>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
                <button className="btn btn-secondary" onClick={() => setStep(3)}>
                  <ArrowLeft size={16} /> Volver a Redacción
                </button>
                
                <button className="btn btn-primary" onClick={() => setStep(5)}>
                  Aprobar Email (Brevo) <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* PASO 5: APROBACIÓN DE EMAIL (BREVO) */}
          {step === 5 && (
            <div className="card">
              <h3 className="card-title">
                <Mail className="text-gold" size={24} /> 
                Aprobación de la Newsletter (Brevo)
              </h3>
              
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label className="form-label">Asunto del Email</label>
                  <button 
                    className="btn-text" 
                    style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                    onClick={() => copyToClipboard(selectedTheme?.hook, 'wp_title')}
                  >
                    <Copy size={14} /> {copiedType === 'wp_title' ? '¡Copiado!' : 'Copiar Asunto'}
                  </button>
                </div>
                <input 
                  type="text" 
                  className="input-field" 
                  value={selectedTheme?.hook || ''}
                  onChange={(e) => setSelectedTheme({ ...selectedTheme, hook: e.target.value })}
                />
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label className="form-label">Cuerpo del Email (Texto)</label>
                  <button 
                    className="btn-text" 
                    style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                    onClick={() => copyToClipboard(generatedBrevoContent, 'brevo')}
                  >
                    <Copy size={14} /> {copiedType === 'brevo' ? '¡Copiado!' : 'Copiar Texto del Email'}
                  </button>
                </div>
                
                {/* Editable Brevo Text Area */}
                <textarea 
                  className="input-field" 
                  style={{ minHeight: '320px', lineHeight: '1.6' }}
                  value={generatedBrevoContent}
                  onChange={(e) => setGeneratedBrevoContent(e.target.value)}
                ></textarea>
              </div>

              {/* Status and Action Buttons */}
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', margin: '24px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <h4 style={{ color: '#fff', fontSize: '14px', fontWeight: '600' }}>Cargar en Brevo (Campañas)</h4>
                    <p className="text-secondary" style={{ fontSize: '12px', marginTop: '2px' }}>
                      Crea un borrador de campaña con esta cabecera y el texto del email estructurado.
                    </p>
                  </div>
                  <button 
                    className="btn btn-success"
                    onClick={publishToBrevo}
                    disabled={brevoStatus.state === 'loading'}
                  >
                    {brevoStatus.state === 'loading' ? (
                      <>
                        <Loader2 className="spin" size={16} /> Conectando...
                      </>
                    ) : (
                      'Subir Campaña a Brevo'
                    )}
                  </button>
                </div>

                {/* Sub-status feedback */}
                {brevoStatus.state === 'success' && (
                  <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--emerald)', fontSize: '13px' }}>
                    <CheckCircle2 size={16} /> 
                    <span>{brevoStatus.message}</span>
                  </div>
                )}
                {brevoStatus.state === 'error' && (
                  <div style={{ marginTop: '16px', display: 'flex', alignItems: 'start', gap: '8px', color: 'var(--crimson)', fontSize: '13px' }}>
                    <AlertCircle size={16} style={{ marginTop: '2px' }} /> 
                    <span>{brevoStatus.message}</span>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
                <button className="btn btn-secondary" onClick={() => setStep(4)}>
                  <ArrowLeft size={16} /> Volver a WordPress
                </button>
                
                <button className="btn btn-primary" onClick={handleCompleteNewsletterFlow} style={{ background: 'linear-gradient(135deg, var(--emerald) 0%, #059669 100%)', color: '#000', boxShadow: 'none' }}>
                  Finalizar & Guardar Historial
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* VISTA DEL HISTORIAL DE TEMAS */}
      {activeTab === 'history' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 className="card-title" style={{ margin: 0 }}>
              <BookOpen className="text-gold" size={24} />
              Historial de Temas Enviados
            </h3>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className="btn btn-secondary" 
                disabled={isSyncingMetrics}
                onClick={syncMetricsWithBrevo}
                title="Sincronizar campañas enviadas y sus métricas directamente de Brevo"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {isSyncingMetrics ? <Loader2 className="spin" size={16} /> : <Download size={16} />} 
                Sincronizar Brevo
              </button>

              <button className="btn btn-secondary" onClick={() => setShowAddHistoryModal(true)}>
                <Plus size={16} /> Añadir Manualmente
              </button>
              
              <button className="btn btn-secondary" onClick={exportAllData} title="Exportar copia de seguridad">
                <Download size={16} /> Respaldar
              </button>
              
              <label className="btn btn-secondary" style={{ cursor: 'pointer' }} title="Importar copia de seguridad">
                <Upload size={16} /> Restaurar
                <input type="file" onChange={importDataFile} accept=".json" style={{ display: 'none' }} />
              </label>
            </div>
          </div>

          {syncMetricsMessage && (
            <div style={{
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              marginBottom: '16px',
              background: syncMetricsMessage.type === 'success' ? 'var(--emerald-glow)' : 'rgba(239, 68, 68, 0.05)',
              color: syncMetricsMessage.type === 'success' ? 'var(--emerald)' : '#ef4444',
              border: '1px solid ' + (syncMetricsMessage.type === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(239, 68, 68, 0.2)'),
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              {syncMetricsMessage.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
              <span>{syncMetricsMessage.text}</span>
            </div>
          )}

          <p className="text-secondary" style={{ marginBottom: '24px', fontSize: '14px' }}>
            Esta biblioteca guarda los temas que ya se han redactado en el último año. La IA consulta esta lista antes de proponer temas nuevos para garantizar que nunca te repitas.
          </p>

          {/* Tabla de Historial */}
          {pastNewsletters.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '12px 16px', fontWeight: '600' }}>Fecha de Envío</th>
                    <th style={{ padding: '12px 16px', fontWeight: '600' }}>Título</th>
                    <th style={{ padding: '12px 16px', fontWeight: '600' }}>Temática / Tema</th>
                    <th style={{ padding: '12px 16px', fontWeight: '600', textAlign: 'center' }}>Tasa Apertura</th>
                    <th style={{ padding: '12px 16px', fontWeight: '600', textAlign: 'center' }}>CTR</th>
                    <th style={{ padding: '12px 16px', fontWeight: '600', textAlign: 'right' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pastNewsletters.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background var(--transition-fast)' }} className="ref-item-row">
                      <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{item.date}</td>
                      <td style={{ padding: '16px', color: '#fff', fontWeight: '500' }}>{item.title}</td>
                      <td style={{ padding: '16px' }}><span className="theme-badge">{item.theme}</span></td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        {item.openRate !== undefined ? (
                          <span style={{
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: '600',
                            background: item.openRate >= 60 ? 'rgba(16,185,129,0.1)' : (item.openRate >= 48 ? 'rgba(245,158,11,0.1)' : 'rgba(255,255,255,0.05)'),
                            color: item.openRate >= 60 ? '#10b981' : (item.openRate >= 48 ? '#f59e0b' : 'var(--text-secondary)')
                          }}>
                            {item.openRate}%
                          </span>
                        ) : '-'}
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        {item.ctr !== undefined ? `${item.ctr}%` : '-'}
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <button 
                          className="btn-text" 
                          onClick={() => handleDeleteHistoryItem(item.id)}
                          style={{ color: 'var(--crimson)' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '48px 0', border: '1px dashed var(--border-color)', borderRadius: '16px', background: 'rgba(0,0,0,0.1)' }}>
              <p className="text-muted">El historial de temas está vacío. Añade las newsletters del último año para alimentar la IA.</p>
            </div>
          )}
        </div>
      )}

      {/* MODAL CONFIGURACIÓN API */}
      <Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      {/* MODAL AGREGAR ENTRADA MANUAL AL HISTORIAL */}
      {showAddHistoryModal && (
        <div className="modal-overlay" onClick={() => setShowAddHistoryModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Añadir al Historial de Temas</h3>
              <button className="btn-text" onClick={() => setShowAddHistoryModal(false)}>×</button>
            </div>
            <form onSubmit={handleAddHistoryItem}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Título de la Newsletter Antigua</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Ej: Consejos de Protocolo para Sentar a tus Invitados"
                    value={newHistoryTitle}
                    onChange={(e) => setNewHistoryTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Temática General</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Ej: Organización / Invitados"
                    value={newHistoryTheme}
                    onChange={(e) => setNewHistoryTheme(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Fecha de Envío</label>
                  <input 
                    type="date" 
                    className="input-field" 
                    value={newHistoryDate}
                    onChange={(e) => setNewHistoryDate(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddHistoryModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Agregar Tema
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
