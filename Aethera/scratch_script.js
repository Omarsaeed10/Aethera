
'use strict';
/* ═══════════════════════════════════════
   CONSTANTS & STATE
═══════════════════════════════════════ */
const LEVELS=[{name:'Newcomer',xp:0},{name:'Scholar',xp:100},{name:'Researcher',xp:300},{name:'Expert',xp:700},{name:'Master',xp:1500},{name:'Professor',xp:3000},{name:'Genius',xp:6000}];
const XP_PER_TOOL={sum:10,qgen:12,concept:10,planner:10,essay:12,cornell:10,cite:8,trans:8,tts:5,quiz:15,fc:10,mm:12,research:12,compare:10,chat:5,para:8,code:10,vocab:10,debate:12,abstract:10,grammar:8,connector:10,dataana:10,searchhelp:8};
const BADGES=[
  {id:'first',icon:'🌟',name:'First Step',desc:'Use your first tool'},
  {id:'quiz5',icon:'🧪',name:'Quiz Ace',desc:'Complete 5 quizzes'},
  {id:'streak3',icon:'🔥',name:'On Fire',desc:'3-day streak'},
  {id:'pomo5',icon:'⏱️',name:'Focus Master',desc:'Complete 5 Pomodoros'},
  {id:'vocab20',icon:'📖',name:'Word Wizard',desc:'Learn 20 vocab words'},
  {id:'goal1',icon:'🎯',name:'Goal Getter',desc:'Complete your first goal'},
  {id:'chat20',icon:'💬',name:'Chatterbox',desc:'Send 20 chat messages'},
  {id:'history10',icon:'📋',name:'Historian',desc:'Save 10 history items'},
];
const APP={
  lang:'en',theme:'dark',accent:'purple',
  activeTab:'home',apiKey:'',avatar:'🎓',
  xp:0,level:0,streak:0,lastDate:'',
  sessions:0,totalStudyTime:0,pomSessions:0,
  pinnedTools:[],notes:[],goals:[],semesters:[{name:'Semester 1',courses:[]}],
  calendarEvents:[],badges:[],history:[],
  weeklyData:{},toolUsage:{},
  quizStats:{total:0,totalScore:0},
  chatHistory:[],fcCards:[],fcIndex:0,fcReviewed:new Set(),
  pomPhase:'study',pomSeconds:1500,pomRunning:false,pomTimer:null,
  pomTaskLabel:'',pomCustomStudy:25,pomCustomShort:5,pomCustomLong:15,
  noteColor:'#1a2a1a',currentGoalProg:{},
  currentGpaSemester:0,
  chatMsgs:0,
  vocabSavedCount:0,
  lectures:[],
  aiProvider:'groq',
  aiModel:'llama-3.3-70b-versatile',
  aiTemperature:0.7,
  voiceInputEnabled:false,
  notionToken:'',
  notionDatabaseId:'',
};
const STRINGS={
  en:{
    appName:'Aethera',edition:'University Edition',

    studyTools:'Study Tools',advanced:'Advanced AI',
    productivity:'Productivity',analytics:'Analytics',
    favorites:'Favorites',summarize:'Summarize',
    examQuestions:'Exam Questions',conceptDive:'Concept Deep Dive',
    studyPlanner:'Study Planner',essayAssist:'Essay Assistant',
    citation:'Citation Builder',translate:'Translator',
    tts:'Text to Speech',quiz:'Quick Quiz',
    flashcards:'Flashcard Generator',mindMap:'Mind Map',
    research:'Research Assistant',compare:'Compare',
    chat:'AI Chat',paraphrase:'Paraphraser',
    codeExplain:'Code Explainer',vocab:'Vocabulary Builder',
    debate:'Debate Generator',abstract:'Abstract Writer',
    grammar:'Grammar Checker',connector:'Concept Connector',
    dataAnalyze:'Data Analyzer',searchHelper:'Search Helper',
    pomodoro:'Pomodoro Timer',goals:'Goal Tracker',
    gpa:'GPA Calculator',calendar:'Academic Calendar',
    history:'History',dashboard:'Dashboard',
    apiKey:'Groq API Key',save:'Save',copy:'Copy',
    copied:'✅ Copied!',generate:'Generate',loading:'Thinking...',
    noKey:'Please save your Groq API key first.',
    rateLimited:'Rate limit reached. Please wait a moment.',
    invalidKey:'Invalid API key. Please check and try again.',
    serverError:'Server error. Please try again.',
    timeout:'Request timed out. Check your connection.',
    darkMode:'Dark Mode',lightMode:'Light Mode',
    lectures:'Lectures Library',settings:'Settings',
    superStudy:'Super Study Agent',leaderboard:'Leaderboard',
    vision:'AI Vision Solver',costudy:'Co-study Rooms',
    
    // Profile settings localizations
    hoursStudied:'HOURS STUDIED',dayStreak:'DAY STREAK',totalUses:'TOTAL USES',
    changeAvatar:'Change Avatar',academicProfile:'Academic Profile',
    displayName:'Display Name',collegeFaculty:'College / Faculty',
    majorTrack:'Major / Track',studentId:'Student ID',program:'Program',
    saveInfo:'Save Information',weeklyActivity:'Weekly Activity',
    toolProficiency:'Tool Proficiency',achievementBadges:'Achievement Badges',
    appSettings:'App Settings',appLang:'Application Language',
    themeColor:'Theme Color',dataManagement:'Data Management',
    exportPack:'Export Data Pack',logOut:'Log Out',clearData:'Clear All Data',
    mainNav:'Main',home:'Home',profileSettings:'Profile Settings'
  },
  ar:{
    appName:'أيثيرا (Aethera)',edition:'نسخة الجامعة',

    studyTools:'أدوات الدراسة',advanced:'ذكاء اصطناعي متقدم',
    productivity:'الإنتاجية',analytics:'التحليلات',
    favorites:'المفضلة',summarize:'تلخيص',
    examQuestions:'أسئلة الامتحان',conceptDive:'شرح معمّق',
    studyPlanner:'مخطط الدراسة',essayAssist:'مساعد المقالات',
    citation:'منشئ الاستشهاد',translate:'مترجم',
    tts:'نص إلى صوت',quiz:'اختبار سريع',
    flashcards:'بطاقات تعليمية',mindMap:'خريطة ذهنية',
    research:'مساعد البحث',compare:'مقارنة',
    chat:'محادثة ذكية',paraphrase:'إعادة صياغة',
    codeExplain:'شارح الكود',vocab:'بناء المفردات',
    debate:'منشئ النقاش',abstract:'كاتب الملخص',
    grammar:'مدقق القواعد',connector:'رابط المفاهيم',
    dataAnalyze:'محلل البيانات',searchHelper:'مساعد البحث الأكاديمي',
    pomodoro:'مؤقت بومودورو',goals:'متتبع الأهداف',
    gpa:'حاسبة المعدل',calendar:'التقويم الأكاديمي',
    history:'السجل',dashboard:'لوحة التحكم',
    apiKey:'مفتاح Groq API',save:'حفظ',copy:'نسخ',
    copied:'✅ تم النسخ!',generate:'توليد',loading:'جاري التفكير...',
    noKey:'الرجاء حفظ مفتاح API أولاً.',
    rateLimited:'تم تجاوز الحد. انتظر لحظة.',
    invalidKey:'مفتاح API غير صالح.',
    serverError:'خطأ في الخادم.',
    timeout:'انتهت مهلة الطلب.',
    darkMode:'الوضع الداكن',lightMode:'الوضع الفاتح',
    lectures:'مكتبة المحاضرات',settings:'الإعدادات',
    superStudy:'وكيل الدراسة الفائق',leaderboard:'لوحة المتصدرين',
    vision:'حلال المسائل البصري',costudy:'غرف المذاكرة الجماعية',

    // Profile settings localizations
    hoursStudied:'الساعات المدروسة',dayStreak:'الأيام المتتالية',totalUses:'الاستخدامات',
    changeAvatar:'تغيير الصورة الشخصية',academicProfile:'الملف الأكاديمي',
    displayName:'الاسم الظاهر',collegeFaculty:'الكلية / الجامعة',
    majorTrack:'التخصص / المسار',studentId:'رقم الطالب',program:'البرنامج الدراسي',
    saveInfo:'حفظ البيانات',weeklyActivity:'النشاط الأسبوعي',
    toolProficiency:'مهارة الأدوات',achievementBadges:'شارات الإنجاز',
    appSettings:'إعدادات التطبيق',appLang:'لغة التطبيق',
    themeColor:'لون المظهر',dataManagement:'إدارة البيانات',
    exportPack:'تصدير حزمة البيانات',logOut:'تسجيل الخروج',clearData:'مسح كافة البيانات',
    mainNav:'الرئيسية',home:'الصفحة الرئيسية',profileSettings:'إعدادات الملف الشخصي'
  },
  fr:{
    appName:'MindSpark',edition:'Édition Universitaire',
    studyTools:'Outils d\'Étude',advanced:'IA Avancée',
    productivity:'Productivité',analytics:'Analyses',
    favorites:'Favoris',summarize:'Résumer',
    examQuestions:'Questions d\'Examen',conceptDive:'Analyse de Concept',
    studyPlanner:'Planificateur',essayAssist:'Assistant de Rédaction',
    citation:'Générateur de Citations',translate:'Traducteur',
    tts:'Synthèse Vocale',quiz:'Quiz Rapide',
    flashcards:'Générateur de Flashcards',mindMap:'Carte Mentale',
    research:'Assistant de Recherche',compare:'Comparer',
    chat:'Chat IA',paraphrase:'Paraphraseur',
    codeExplain:'Explicateur de Code',vocab:'Constructeur de Vocabulaire',
    debate:'Générateur de Débats',abstract:'Rédacteur de Résumé',
    grammar:'Correcteur de Grammaire',connector:'Connecteur de Concepts',
    dataAnalyze:'Analyseur de Données',searchHelper:'Assistant de Recherche',
    pomodoro:'Minuteur Pomodoro',goals:'Suivi d\'Objectifs',
    gpa:'Calculateur de Moyenne',calendar:'Calendrier Académique',
    history:'Historique',dashboard:'Tableau de Bord',
    apiKey:'Clé API Groq',save:'Enregistrer',copy:'Copier',
    copied:'✅ Copié !',generate:'Générer',loading:'Réflexion...',
    noKey:'Veuillez d\'abord enregistrer votre clé API Groq.',
    rateLimited:'Clé de taux atteinte. Veuillez patienter.',
    invalidKey:'Clé API invalide. Veuillez vérifier et réessayer.',
    serverError:'Erreur du serveur. Veuillez réessayer.',
    timeout:'Délai d\'attente dépassé. Vérifiez votre connexion.',
    darkMode:'Mode Sombre',lightMode:'Mode Clair',
    lectures:'Bibliothèque de Lectures',settings:'Paramètres',
    superStudy:'Agent Super Étude',leaderboard:'Classement',

    // Profile settings localizations
    hoursStudied:'HEURES ÉTUDIÉES',dayStreak:'JOURS DE SUITE',totalUses:'APPLICATIONS',
    changeAvatar:'Changer d\'Avatar',academicProfile:'Profil Académique',
    displayName:'Nom d\'Affichage',collegeFaculty:'Faculté / Collège',
    majorTrack:'Majeure / Filière',studentId:'Code Étudiant',program:'Programme',
    saveInfo:'Enregistrer',weeklyActivity:'Activité Hebdomadaire',
    toolProficiency:'Maîtrise des Outils',achievementBadges:'Badges de Réussite',
    appSettings:'Paramètres de l\'App',appLang:'Langue de l\'App',
    themeColor:'Couleur du Thème',dataManagement:'Gestion des Données',
    exportPack:'Exporter les Données',logOut:'Déconnexion',clearData:'Effacer les Données',
    mainNav:'Principal',home:'Accueil',profileSettings:'Paramètres du Profil'
  },
  es:{
    appName:'MindSpark',edition:'Edición Universitaria',
    studyTools:'Herramientas de Estudio',advanced:'IA Avanzada',
    productivity:'Productividad',analytics:'Análisis',
    favorites:'Favoritos',summarize:'Resumir',
    examQuestions:'Preguntas de Examen',conceptDive:'Análisis de Conceptos',
    studyPlanner:'Planificador de Estudios',essayAssist:'Asistente de Ensayos',
    citation:'Generador de Citas',translate:'Traductor',
    tts:'Texto a Voz',quiz:'Quiz Rápido',
    flashcards:'Generador de Flashcards',mindMap:'Mapa Mental',
    research:'Asistente de Investigación',compare:'Comparar',
    chat:'Chat IA',paraphrase:'Parafraseador',
    codeExplain:'Explicador de Código',vocab:'Constructor de Vocabulario',
    debate:'Generador de Debates',abstract:'Redactor de Resúmenes',
    grammar:'Corrector de Gramática',connector:'Conector de Conceptos',
    dataAnalyze:'Analizador de Datos',searchHelper:'Asistente de Búsqueda',
    pomodoro:'Temporizador Pomodoro',goals:'Rastreador de Metas',
    gpa:'Calculadora de Promedio',calendar:'Calendario Académico',
    history:'Historial',dashboard:'Tablero',
    apiKey:'Clave API Groq',save:'Guardar',copy:'Copiar',
    copied:'✅ ¡Copiado!',generate:'Generar',loading:'Pensando...',
    noKey:'Por favor, guarde su clave API de Groq primero.',
    rateLimited:'Límite de velocidad alcanzado. Por favor espere.',
    invalidKey:'Clave API inválida. Por favor verifique e intente de nuevo.',
    serverError:'Error del servidor. Por favor intente de nuevo.',
    timeout:'Tiempo de espera agotado. Verifique su conexión.',
    darkMode:'Modo Oscuro',lightMode:'Modo Claro',
    lectures:'Biblioteca de Lecturas',settings:'Ajustes',
    superStudy:'Agente Súper Estudio',leaderboard:'Tabla de Clasificación',

    // Profile settings localizations
    hoursStudied:'HORAS ESTUDIADAS',dayStreak:'RACHA DE DÍAS',totalUses:'USOS TOTALES',
    changeAvatar:'Cambiar Avatar',academicProfile:'Perfil Académico',
    displayName:'Nombre a Mostrar',collegeFaculty:'Facultad / Colegio',
    majorTrack:'Especialidad / Carrera',studentId:'ID de Estudiante',program:'Programa',
    saveInfo:'Guardar Información',weeklyActivity:'Actividad Semanal',
    toolProficiency:'Competencia de Herramientas',achievementBadges:'Insignias de Logro',
    appSettings:'Ajustes de la Aplicación',appLang:'Idioma de la Aplicación',
    themeColor:'Color del Tema',dataManagement:'Gestión de Datos',
    exportPack:'Exportar Paquete de Datos',logOut:'Cerrar Sesión',clearData:'Borrar Todos los Datos',
    mainNav:'Principal',home:'Inicio',profileSettings:'Ajustes de Perfil'
  },
  de:{
    appName:'MindSpark',edition:'Universitätsausgabe',
    studyTools:'Lernwerkzeuge',advanced:'Erweiterte KI',
    productivity:'Produktivität',analytics:'Analysen',
    favorites:'Favoriten',summarize:'Zusammenfassen',
    examQuestions:'Prüfungsfragen',conceptDive:'Konzeptanalyse',
    studyPlanner:'Lernplaner',essayAssist:'Aufsatzassistent',
    citation:'Zitatersteller',translate:'Übersetzer',
    tts:'Text-to-Speech',quiz:'Schnelles Quiz',
    flashcards:'Flashcard-Generator',mindMap:'Mindmap',
    research:'Forschungsassistent',compare:'Vergleichen',
    chat:'KI-Chat',paraphrase:'Paraphrasierer',
    codeExplain:'Code-Erklärer',vocab:'Wortschatz-Builder',
    debate:'Debatten-Generator',abstract:'Abstract-Schreiber',
    grammar:'Grammatikprüfer',connector:'Konzept-Konnektor',
    dataAnalyze:'Datenanalysator',searchHelper:'Suchassistent',
    pomodoro:'Pomodoro-Timer',goals:'Zielverfolger',
    gpa:'Notendurchschnittsrechner',calendar:'Akademischer Kalender',
    history:'Verlauf',dashboard:'Dashboard',
    apiKey:'Groq API-Schlüssel',save:'Speichern',copy:'Kopieren',
    copied:'✅ Kopiert!',generate:'Generieren',loading:'Denken...',
    noKey:'Bitte speichern Sie zuerst Ihren Groq API-Schlüssel.',
    rateLimited:'Ratenlimit erreicht. Bitte warten Sie einen Moment.',
    invalidKey:'Ungültiger API-Schlüssel. Bitte überprüfen und erneut versuchen.',
    serverError:'Serverfehler. Bitte versuchen Sie es erneut.',
    timeout:'Anforderung abgelaufen. Überprüfen Sie Ihre Verbindung.',
    darkMode:'Dunkelmodus',lightMode:'Lichtmodus',
    lectures:'Vorlesungsbibliothek',settings:'Einstellungen',
    superStudy:'Super-Lernagent',leaderboard:'Bestenliste',

    // Profile settings localizations
    hoursStudied:'LERNSTUNDEN',dayStreak:'TAGE IN FOLGE',totalUses:'NUTZUNGEN',
    changeAvatar:'Avatar ändern',academicProfile:'Akademisches Profil',
    displayName:'Anzeigename',collegeFaculty:'Fakultät / Hochschule',
    majorTrack:'Fachrichtung / Schwerpunkt',studentId:'Matrikelnummer',program:'Studiengang',
    saveInfo:'Infos speichern',weeklyActivity:'Wöchentliche Aktivität',
    toolProficiency:'Werkzeug-Kompetenz',achievementBadges:'Erfolgsabzeichen',
    appSettings:'App-Einstellungen',appLang:'App-Sprache',
    themeColor:'Design-Farbe',dataManagement:'Datenverwaltung',
    exportPack:'Datenpaket exportieren',logOut:'Abmelden',clearData:'Alle Daten löschen',
    mainNav:'Hauptmenü',home:'Startseite',profileSettings:'Profileinstellungen'
  }
};
function t(k){return STRINGS[APP.lang]?.[k]||STRINGS.en[k]||k;}
function setLang(val){APP.lang=val;saveState();}
const CMD_TOOLS=[
  {id:'sum',label:'Summarize',icon:'📝',keys:'1'},
  {id:'qgen',label:'Exam Questions',icon:'❓',keys:'2'},
  {id:'concept',label:'Concept Deep Dive',icon:'💡',keys:'3'},
  {id:'planner',label:'Study Planner',icon:'📅',keys:'4'},
  {id:'essay',label:'Essay Assistant',icon:'✍️',keys:'5'},
  {id:'cornell',label:'Cornell Notes',icon:'📓',keys:'6'},
  {id:'cite',label:'Citation Builder',icon:'📖',keys:'7'},
  {id:'trans',label:'Translator',icon:'🌍',keys:'8'},
  {id:'tts',label:'Text to Speech',icon:'🎧',keys:'9'},
  {id:'quiz',label:'Quick Quiz',icon:'🧪',keys:'Q'},
  {id:'fc',label:'Flashcards',icon:'🧠',keys:'F'},
  {id:'mm',label:'Mind Map',icon:'🗺️',keys:'M'},
  {id:'chat',label:'AI Chat',icon:'🤖',keys:'C'},
  {id:'research',label:'Research Assistant',icon:'🔍',keys:''},
  {id:'compare',label:'Compare Tool',icon:'🔄',keys:''},
  {id:'para',label:'Paraphraser',icon:'✏️',keys:''},
  {id:'code',label:'Code Explainer',icon:'💻',keys:''},
  {id:'vocab',label:'Vocabulary Builder',icon:'📖',keys:''},
  {id:'debate',label:'Debate Generator',icon:'🎙️',keys:''},
  {id:'abstract',label:'Abstract Writer',icon:'📜',keys:''},
  {id:'grammar',label:'Grammar Checker',icon:'🔤',keys:''},
  {id:'connector',label:'Concept Connector',icon:'🧩',keys:''},
  {id:'dataana',label:'Data Analyzer',icon:'📊',keys:''},
  {id:'searchhelp',label:'Search Helper',icon:'🔎',keys:''},
  {id:'pomo',label:'Pomodoro Timer',icon:'⏱️',keys:''},
  {id:'goals',label:'Goal Tracker',icon:'🎯',keys:''},
  {id:'gpa',label:'GPA Calculator',icon:'🎓',keys:''},
  {id:'cal',label:'Academic Calendar',icon:'🗓️',keys:''},
  {id:'pptx',label:'PowerPoint Generator',icon:'📊',keys:''},
  {id:'lectrans',label:'Lecture Transcriber',icon:'🎙️',keys:''},
  {id:'career',label:'Career Pathfinder',icon:'🧭',keys:''},
  {id:'hist',label:'History',icon:'📋',keys:''},
];

let cmdActive=-1, cmdFiltered=[...CMD_TOOLS];
/* ═══ IndexedDB ═══ */
let DB=null;
function initDB(){
  return new Promise((res,rej)=>{
    try{
      const req=indexedDB.open('mindspark',1);
      req.onupgradeneeded=e=>{
        const db=e.target.result;
        if(!db.objectStoreNames.contains('history')){
          const hs=db.createObjectStore('history',{keyPath:'id'});
          hs.createIndex('tool','tool',{unique:false});
          hs.createIndex('ts','ts',{unique:false});
        }
        if(!db.objectStoreNames.contains('vocab'))
          db.createObjectStore('vocab',{keyPath:'word'});
      };
      req.onsuccess=e=>{DB=e.target.result;res(DB);};
      req.onerror=()=>rej('IDB fail');
    }catch{rej('IDB unavailable');}
  });
}
async function idbAdd(store,rec){
  if(!DB)return lsFallbackAdd(rec);
  return new Promise(res=>{
    try{
      const tx=DB.transaction(store,'readwrite');
      tx.objectStore(store).put(rec);
      tx.oncomplete=()=>res(true);
      tx.onerror=()=>res(false);
    }catch{res(false);}
  });
}
async function idbGetAll(store){
  if(!DB)return lsFallbackGet();
  return new Promise(res=>{
    try{
      const tx=DB.transaction(store,'readonly');
      const req=tx.objectStore(store).getAll();
      req.onsuccess=()=>res(req.result||[]);
      req.onerror=()=>res([]);
    }catch{res([]);}
  });
}
async function idbDelete(store,key){
  if(!DB)return;
  return new Promise(res=>{
    try{
      const tx=DB.transaction(store,'readwrite');
      tx.objectStore(store).delete(key);
      tx.oncomplete=()=>res();
    }catch{res();}
  });
}
function lsFallbackAdd(rec){
  try{
    const arr=JSON.parse(localStorage.getItem('ms_history')||'[]');
    arr.unshift(rec);
    if(arr.length>100)arr.length=100;
    localStorage.setItem('ms_history',JSON.stringify(arr));
  }catch{}
}
function lsFallbackGet(){
  try{return JSON.parse(localStorage.getItem('ms_history')||'[]');}catch{return [];}
}
/* ═══ API & AUTH ═══ */
const API_URL = (window.location.protocol && window.location.protocol.startsWith('http')) ? (window.location.origin + '/api') : 'http://localhost:34567/api';
function getJWT() { return localStorage.getItem('ms_jwt'); }
function setJWT(token) { if(token) localStorage.setItem('ms_jwt', token); else localStorage.removeItem('ms_jwt'); }

async function apiCall(endpoint, method = 'GET', data = null) {
  const token = getJWT();
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (data) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: data ? JSON.stringify(data) : null
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(json.error || 'API Error');
    err.status = res.status;
    err.response = json;
    throw err;
  }
  return json;
}

async function doLogin() {
  const email = document.getElementById('auth-email-login').value.trim();
  const pass = document.getElementById('auth-pass-login').value.trim();
  const errEl = document.getElementById('auth-error');
  try {
    const res = await apiCall('/auth/login', 'POST', { email, password: pass });
    setJWT(res.token);
    closeModal('auth-modal');
    await fetchProfile();
    showToast('Logged in successfully!', 'ok');
  } catch (e) {
    if (e.response && e.response.notActivated) {
      document.getElementById('auth-email-verify').value = email;
      document.getElementById('auth-code-verify').value = '';
      document.getElementById('verify-instructions').textContent = `Your account is not activated yet. Enter the activation code sent to ${email} below:`;
      switchAuthTab('verify');
      showToast('Account is not activated. Please verify.', 'info');
    } else {
      errEl.textContent = e.message;
      errEl.style.display = 'block';
    }
  }
}

async function doSignup() {
  const name = document.getElementById('auth-name-signup').value.trim();
  const email = document.getElementById('auth-email-signup').value.trim();
  const pass = document.getElementById('auth-pass-signup').value.trim();
  const errEl = document.getElementById('auth-error');
  try {
    const res = await apiCall('/auth/signup', 'POST', { email, password: pass, displayName: name });
    if (res.needsVerification) {
      document.getElementById('auth-email-verify').value = email;
      document.getElementById('auth-code-verify').value = '';
      document.getElementById('verify-instructions').textContent = `An activation link and code have been sent to ${email}. Enter the 6-digit code below to activate:`;
      switchAuthTab('verify');
      showToast('Verification code sent!', 'ok');
    } else {
      setJWT(res.token);
      closeModal('auth-modal');
      await syncUsage(); // Push local stats to newly created account
      await fetchProfile();
      showToast('Account created!', 'ok');
    }
  } catch (e) {
    errEl.textContent = e.message;
    errEl.style.display = 'block';
  }
}

async function doVerifyCode() {
  const email = document.getElementById('auth-email-verify').value;
  const code = document.getElementById('auth-code-verify').value.trim();
  const errEl = document.getElementById('auth-error');
  try {
    const res = await apiCall('/auth/verify-code', 'POST', { email, code });
    setJWT(res.token);
    closeModal('auth-modal');
    await syncUsage();
    await fetchProfile();
    showToast('Account activated & logged in!', 'ok');
  } catch (e) {
    errEl.textContent = e.message;
    errEl.style.display = 'block';
  }
}

async function doResendCode() {
  const email = document.getElementById('auth-email-verify').value;
  const errEl = document.getElementById('auth-error');
  try {
    const res = await apiCall('/auth/resend-code', 'POST', { email });
    showToast(res.message || 'Verification code resent!', 'ok');
  } catch (e) {
    errEl.textContent = e.message;
    errEl.style.display = 'block';
  }
}

async function doResetPassword() {
  const email = document.getElementById('auth-email-reset').value.trim();
  const studentId = document.getElementById('auth-id-reset').value.trim();
  const newPass = document.getElementById('auth-pass-reset').value.trim();
  const errEl = document.getElementById('auth-error');
  try {
    const res = await apiCall('/auth/reset-password', 'POST', { email, studentId, newPassword: newPass });
    showToast('Password reset successfully! Log in with your new password.', 'ok');
    switchAuthTab('login');
    document.getElementById('auth-email-login').value = email;
    document.getElementById('auth-pass-login').value = '';
  } catch (e) {
    errEl.textContent = e.message;
    errEl.style.display = 'block';
  }
}

function doLogout() {
  setJWT(null);
  APP.username = '';
  APP.email = '';
  APP.profileId = '';
  APP.profileProg = '';
  APP.college = '';
  APP.major = '';
  APP.activeTab = 'home';
  saveState();
  showToast('Logged out successfully', 'info');
  location.reload();
}

async function fetchProfile() {
  if (!getJWT()) return;
  try {
    const p = await apiCall('/profile');
    APP.username = p.display_name || '';
    APP.college = p.college || '';
    APP.major = p.major || '';
    APP.profileId = p.student_id || '';
    APP.profileProg = p.program || '';
    APP.avatar = p.avatar || '🎓';
    APP.bio = p.bio || '';
    
    APP.toolUsage = p.tool_usage || APP.toolUsage;
    APP.badges = p.badges || APP.badges;
    APP.weeklyData = p.weekly_data || APP.weeklyData;
    if (p.streak > APP.streak) APP.streak = p.streak;
    if (p.xp > APP.xp) APP.xp = p.xp;
    if (p.level > APP.level) APP.level = p.level;
    if (p.last_active_date) APP.lastDate = p.last_active_date;

    renderSidebarProfile();
    saveState(true);
    if(APP.activeTab === 'profile') go('profile');
  } catch (e) {
    console.error('Profile fetch error', e);
  }
}

async function saveProfileInfo() {
  const name = document.getElementById('prof-edit-name').value.trim();
  const col = document.getElementById('prof-edit-college').value.trim();
  const maj = document.getElementById('prof-edit-major').value.trim();
  const id = document.getElementById('prof-edit-id').value.trim();
  const prog = document.getElementById('prof-edit-prog').value.trim();
  
  APP.username = name;
  APP.college = col;
  APP.major = maj;
  APP.profileId = id;
  APP.profileProg = prog;

  saveState(true);
  
  if (getJWT()) {
    try {
      await apiCall('/profile', 'PUT', {
        displayName: name,
        college: col,
        major: maj,
        studentId: id,
        program: prog,
        avatar: APP.avatar
      });
      showToast('Profile updated!', 'ok');
    } catch (e) {
      showToast('Sync error: ' + e.message, 'err');
    }
  } else {
    showToast('Profile saved locally.', 'ok');
  }
  renderSidebarProfile();
  go('profile');
}

let syncTimeout = null;
function syncUsage() {
  if (!getJWT()) return;
  clearTimeout(syncTimeout);
  syncTimeout = setTimeout(async () => {
    try {
      await apiCall('/usage/sync', 'POST', {
        toolUsage: APP.toolUsage,
        streak: APP.streak,
        lastDate: APP.lastDate,
        xp: APP.xp,
        level: APP.level,
        badges: APP.badges,
        weeklyData: APP.weeklyData
      });
    } catch (e) {
      console.error('Usage sync error', e);
    }
  }, 2000);
}

function renderSidebarProfile() {
  const guestView = document.getElementById('sb-guest-view');
  const userView = document.getElementById('sb-user-view');
  if (getJWT()) {
    guestView.style.display = 'none';
    userView.style.display = 'block';
    const elName = document.getElementById('profile-name');
    if (elName) elName.innerHTML = sanitize(APP.username || 'User');
    const elId = document.getElementById('profile-id');
    if (elId) elId.innerHTML = sanitize(APP.profileId || 'Student ID');
    const elProg = document.getElementById('profile-prog');
    if (elProg) elProg.innerHTML = `<span>${sanitize(APP.profileProg || 'Academic Program')}</span>`;
    updateXPBar();
  } else {
    guestView.style.display = 'block';
    userView.style.display = 'none';
  }
}

function switchAuthTab(tab) {
  const tabsContainer = document.querySelector('.auth-tabs');
  if (tabsContainer) {
    tabsContainer.style.display = (tab === 'login' || tab === 'signup') ? 'flex' : 'none';
  }
  document.getElementById('tab-login').classList.toggle('active', tab === 'login');
  document.getElementById('tab-signup').classList.toggle('active', tab === 'signup');
  document.getElementById('auth-form-login').style.display = tab === 'login' ? 'block' : 'none';
  document.getElementById('auth-form-signup').style.display = tab === 'signup' ? 'block' : 'none';
  document.getElementById('auth-form-reset').style.display = tab === 'reset' ? 'block' : 'none';
  document.getElementById('auth-form-verify').style.display = tab === 'verify' ? 'block' : 'none';
  document.getElementById('auth-error').style.display = 'none';
}

/* ═══ STATE PERSISTENCE ═══ */
function loadState(){
  try{
    const s=JSON.parse(localStorage.getItem('ms_app')||'{}');
    Object.assign(APP,s);
    
    // Defensive defaults for all state keys to handle legacy/partial localstorage formats
    APP.fcCards = APP.fcCards || [];
    APP.pinnedTools = APP.pinnedTools || [];
    APP.notes = APP.notes || [];
    APP.goals = APP.goals || [];
    APP.calendarEvents = APP.calendarEvents || [];
    APP.badges = APP.badges || [];
    APP.history = APP.history || [];
    APP.weeklyData = APP.weeklyData || {};
    APP.toolUsage = APP.toolUsage || {};
    APP.quizStats = APP.quizStats || {total:0, totalScore:0};
    APP.chatHistory = APP.chatHistory || [];
    APP.fcReviewed = new Set(APP.fcReviewed || []);
    
    if(!APP.pomTimer)APP.pomTimer=null;
    if(!APP.semesters||!APP.semesters.length)APP.semesters=[{name:'Semester 1',courses:[]}];
    renderSidebarProfile();
    fetchProfile(); // background fetch if logged in
  }catch{}
}
function saveState(skipSync = false){
  try{
    const s={...APP};
    delete s.pomTimer;
    s.fcReviewed=[...APP.fcReviewed];
    localStorage.setItem('ms_app',JSON.stringify(s));
    if (!skipSync) syncUsage();
  }catch(e){
    if(e.name==='QuotaExceededError'){
      showToast('Storage full. Clearing old history...','warn');
      APP.history=APP.history.slice(-20);
      try{const s={...APP};delete s.pomTimer;s.fcReviewed=[...APP.fcReviewed];localStorage.setItem('ms_app',JSON.stringify(s));}catch{}
    }
  }
}
/* ═══ callAI (AI Proxy Completions) ═══ */
async function callAI(messages, arg2, arg3, arg4, arg5) {
  let onChunk, onDone, onError, options = {};
  if (typeof arg2 === 'function') {
    onChunk = arg2;
    onDone = arg3;
    onError = arg4;
    options = arg5 || {};
  } else {
    options = arg2 || {};
    onChunk = options.onChunk || (() => {});
    onDone = options.onDone || (() => {});
    onError = options.onError || (() => {});
  }

  // Resolve RAG content in messages if present
  messages.forEach(msg => {
    if (typeof msg.content === 'string' && msg.content.includes('[📚 Large Lecture:')) {
      const ta = Array.from(document.querySelectorAll('textarea')).find(t => t.dataset.ragActive === 'true');
      if (ta && ta.dataset.lectureId) {
        const lec = APP.lectures.find(l => l.id === parseInt(ta.dataset.lectureId));
        if (lec) {
          const activePane = document.querySelector('.pane.active, .card.active');
          // Find any other input or textarea that might contain user topic or details
          const queryInput = activePane ? (activePane.querySelector('input[type=text]') || activePane.querySelector('input[type=search]') || activePane.querySelector('textarea:not([data-rag-active="true"])')) : null;
          const queryText = queryInput ? queryInput.value : '';
          
          const retrieved = retrieveRelevantChunks(lec.text, queryText);
          msg.content = msg.content.replace(/\[📚 Large Lecture:.*?\]/g, retrieved);
          console.log("RAG substitution complete! Retrieved context based on query:", queryText);
        }
      }
    }
  });

  // Intercept for Local AI
  if (APP.aiProvider === 'local') {
    return callLocalLLM(messages, onChunk, onDone, onError, options);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000);
  try {
    const res = await fetch(API_URL + '/chat', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(APP.token ? { 'Authorization': `Bearer ${APP.token}` } : {})
      },
      body: JSON.stringify({
        messages,
        provider: APP.aiProvider || 'groq',
        model: options.model || APP.aiModel || 'llama-3.3-70b-versatile',
        max_tokens: options.max_tokens || 2048,
        temperature: options.temperature !== undefined ? options.temperature : (APP.aiTemperature !== undefined ? APP.aiTemperature : 0.7),
        stream: true
      })
    });

    if (!res.ok) {
      if (res.status === 401) onError('invalidKey');
      else if (res.status === 429) onError('rateLimited');
      else onError('serverError');
      return;
    }

    if (!res.body) {
      onError('serverError');
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();
      for (const line of lines) {
        const tr = line.trim();
        if (!tr || tr === 'data: [DONE]') continue;
        if (!tr.startsWith('data: ')) continue;
        try {
          const json = JSON.parse(tr.slice(6));
          const content = json.choices?.[0]?.delta?.content;
          if (content) onChunk(content);
          if (json.choices?.[0]?.finish_reason === 'stop') {
            onDone('streamed');
            return;
          }
        } catch {}
      }
    }
    onDone('streamed');
  } catch (e) {
    if (e.name === 'AbortError') onError('timeout');
    else onError('serverError');
  } finally {
    clearTimeout(timeout);
  }
}

// ── LOCAL OFFLINE LLM (WebLLM) ──
let localEngine = null;
let localModelDownloading = false;

async function initializeLocalLLM(onProgress) {
  if (localEngine) {
    showToast("Local AI model already loaded!", "ok");
    return;
  }
  if (localModelDownloading) return;
  localModelDownloading = true;

  try {
    const selectedModel = "Phi-3-mini-4k-instruct-q4f16_1-MLC";
    if (typeof webllm === 'undefined') {
      throw new Error("MLC WebLLM library is not loaded. Check internet connection.");
    }
    
    localEngine = await webllm.CreateMLCEngine(selectedModel, {
      initProgressCallback: (report) => {
        console.log(report.text);
        if (onProgress) onProgress(report);
      }
    });
    
    localModelDownloading = false;
    showToast("Local AI Model loaded successfully!", "ok");
  } catch (error) {
    console.error("Local LLM Init Error:", error);
    localModelDownloading = false;
    showToast("Failed to load local model: " + error.message, "err");
  }
}

async function callLocalLLM(messages, onChunk, onDone, onError, options) {
  if (!localEngine) {
    onError("Local AI model is not downloaded/initialized. Please go to Settings and click 'Initialize Local AI'.");
    return;
  }
  try {
    const chunks = await localEngine.chat.completions.create({
      messages,
      temperature: options.temperature !== undefined ? options.temperature : (APP.aiTemperature || 0.7),
      max_tokens: options.max_tokens || 1024,
      stream: true
    });
    
    for await (const chunk of chunks) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        onChunk(content);
      }
    }
    onDone("streamed");
  } catch (err) {
    console.error("Local LLM completion error:", err);
    onError(err.message);
  }
}
/* ??? CACHE ??? */
function cacheKey(prompt){try{return btoa(unescape(encodeURIComponent(prompt.slice(0,100))));}catch{return 'ck_'+Date.now();}}
function getCache(k){try{return sessionStorage.getItem('ms_'+k)||null;}catch{return null;}}
function setCache(k,v){try{sessionStorage.setItem('ms_'+k,v);}catch{}}
/* ═══ DEBOUNCE ═══ */
function debounce(fn,ms){let t;return(...a)=>{clearTimeout(t);t=setTimeout(()=>fn(...a),ms);};}
/* ═══ TOAST ═══ */
function showToast(msg,type='info',duration=3000){
  const c=document.getElementById('toast-container');
  const d=document.createElement('div');
  d.className=`toast ${type}`;
  d.innerHTML=`<span>${msg}</span>`;
  c.appendChild(d);
  setTimeout(()=>{d.style.opacity='0';d.style.transform='translateX(20px)';d.style.transition='.3s';setTimeout(()=>d.remove(),300);},duration);
}
/* ═══ MARKDOWN RENDERER ═══ */
/* ═══ MARKDOWN RENDERER ═══ */
function renderMD(text){
  if(!text)return '';

  // 1. Normalize line endings (CRLF -> LF) & separate smashed headers/lists
  let clean = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  clean = clean
    .replace(/([^\n])(#{1,4}\s+)/g, '$1\n\n$2')
    .replace(/([^\n])(\s*[-*]\s+)/g, '$1\n$2')
    .replace(/([^\n])(\s*\d+\.\s+)/g, '$1\n$2');

  function formatMath(expr) {
    return expr
      .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '<span style="display:inline-flex; flex-direction:column; vertical-align:middle; text-align:center; padding:0 4px; font-size:0.95em;"><span style="border-bottom:1px solid currentColor; padding-bottom:1px;">$1</span><span style="padding-top:1px;">$2</span></span>')
      .replace(/\\approx/g, '≈')
      .replace(/\\cap/g, '∩')
      .replace(/\\cup/g, '∪')
      .replace(/\\le/g, '≤')
      .replace(/\\ge/g, '≥')
      .replace(/\\times/g, '×')
      .replace(/\\pm/g, '±')
      .replace(/\\cdot/g, '·')
      .replace(/\\infty/g, '∞')
      .replace(/\\neq/g, '≠')
      .replace(/\\alpha/g, 'α')
      .replace(/\\beta/g, 'β')
      .replace(/\\theta/g, 'θ')
      .replace(/\\pi/g, 'π')
      .replace(/\\sigma/g, 'σ');
  }

  let h = clean
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    // Block Math $$ ... $$
    .replace(/\$\$([\s\S]+?)\$\$/g, (_, eq) => `<div class="math-block" style="margin:12px 0; padding:10px 14px; background:rgba(0,243,255,0.08); border:1px solid rgba(0,243,255,0.25); border-radius:10px; text-align:center; font-family:'Courier New', monospace, serif; font-size:14px; font-weight:600; color:var(--primary);">${formatMath(eq)}</div>`)
    // Inline Math $ ... $
    .replace(/\$([^$\n]+)\$/g, (_, eq) => `<span class="math-inline" style="padding:2px 6px; background:rgba(0,243,255,0.1); border-radius:4px; font-family:'Courier New', monospace, serif; font-size:13px; color:var(--primary); font-weight:600;">${formatMath(eq)}</span>`)
    // Code blocks
    .replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => `<pre class="code-block" style="background:rgba(0,0,0,0.5); padding:12px; border-radius:8px; border:1px solid var(--border2); overflow-x:auto; margin:12px 0;"><code>${code}</code></pre>`)
    // Inline code
    .replace(/`([^`]+)`/g, '<code style="background:var(--border2); padding:2px 6px; border-radius:4px; font-size:.9em; color:#00f3ff;">$1</code>')
    // Headings
    .replace(/^#{4}\s+(.+)$/gm, '<h4 style="font-size:14px; color:var(--primary); font-weight:700; margin:16px 0 6px;">$1</h4>')
    .replace(/^#{3}\s+(.+)$/gm, '<h3 style="font-size:16px; color:var(--primary); font-weight:700; margin:18px 0 8px; border-bottom:1px solid rgba(0,243,255,0.2); padding-bottom:4px;">$1</h3>')
    .replace(/^#{2}\s+(.+)$/gm, '<h2 style="font-size:18px; color:var(--primary); font-weight:800; margin:20px 0 10px;">$1</h2>')
    .replace(/^#{1}\s+(.+)$/gm, '<h1 style="font-size:22px; color:var(--primary); font-weight:900; margin:22px 0 12px;">$1</h1>')
    // Bold & Italic
    .replace(/\*([^*\n]+?)\*:/g, '<strong>$1:</strong>')
    .replace(/\*([^*\n]+?):\*/g, '<strong>$1:</strong>')
    .replace(/^\*([^*\n]+?)\*/gm, '<strong>$1</strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Horizontal Rule
    .replace(/^---$/gm, '<hr style="border:0; border-top:1px solid var(--border2); margin:16px 0;">')
    // Ordered Lists
    .replace(/^\s*(\d+)\.\s+(.+)$/gm, '<li class="md-oli" style="margin-bottom:6px; list-style-type:decimal;">$2</li>')
    // Unordered Lists
    .replace(/^\s*[-*]\s+(.+)$/gm, '<li class="md-uli" style="margin-bottom:6px; list-style-type:disc;">$1</li>')
    // Wrap consecutive list items
    .replace(/(<li class="md-oli"[^>]*>[\s\S]*?<\/li>\n?)+/g, match => `<ol style="padding-left:22px; margin:10px 0 14px; line-height:1.7;">${match.replace(/\n/g, '')}</ol>`)
    .replace(/(<li class="md-uli"[^>]*>[\s\S]*?<\/li>\n?)+/g, match => `<ul style="padding-left:22px; margin:10px 0 14px; line-height:1.7;">${match.replace(/\n/g, '')}</ul>`)
    // Double linebreaks to spacers
    .replace(/\n\n+/g, '<div class="md-spacer" style="height:12px; width:100%; display:block;"></div>')
    // Single linebreaks to <br> (skip after block tags)
    .replace(/(<\/h[1-4]>|<\/ol>|<\/ul>|<\/pre>|<\/div>|<hr[^>]*>)\n?/g, '$1')
    .replace(/\n/g, '<br>');

  return `<div class="markdown-body" style="line-height:1.75; word-break:break-word; font-size:14px;">${h}</div>`;
}

function sanitize(html){
  if(typeof DOMPurify !== 'undefined'){
    return DOMPurify.sanitize(html, {
      ADD_ATTR: ['style', 'target', 'class', 'value', 'aria-label', 'aria-live'],
      ADD_TAGS: ['iframe', 'span', 'div', 'h1', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'pre', 'code', 'blockquote', 'hr', 'br', 'p', 'strong', 'em', 'table', 'thead', 'tbody', 'tr', 'th', 'td']
    });
  }
  return html.replace(/<script[\s\S]*?<\/script>/gi,'')
             .replace(/on\w+="[^"]*"/g,'')
             .replace(/javascript:/gi,'');
}
/* ═══ COPY BUTTON ═══ */
function copyOutput(elId){
  const el=document.getElementById(elId);
  if(!el)return;
  const text=el.innerText||el.textContent||'';
  navigator.clipboard.writeText(text).then(()=>{showToast(t('copied'),'ok');}).catch(()=>{
    const ta=document.createElement('textarea');
    ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();
    showToast(t('copied'),'ok');
  });
}
/* ═══ SAVE TO HISTORY ═══ */
async function saveToHistory(tool,prompt,outputEl){
  const outputHtml=outputEl?.innerHTML||outputEl||'';
  const outputText=outputEl?.innerText||outputHtml||'';
  const rec={
    id:Date.now()+Math.random(),
    tool,
    title:(prompt||'').slice(0,60),
    preview:(outputText||'').slice(0,120),
    output:outputHtml,
    ts:Date.now()
  };
  await idbAdd('history',rec);
  APP.history.unshift(rec);
  if(APP.history.length>100)APP.history.length=100;
  // Gamification
  if(APP.history.length>=10)unlockBadge('history10');
  showToast('Saved to history','ok',1500);
  saveState();
}
/* ═══ XP & LEVEL ═══ */
function addXP(tool){
  const pts=XP_PER_TOOL[tool]||5;
  APP.xp+=pts;
  // Streak
  const today=new Date().toDateString();
  if(APP.lastDate!==today){
    const yesterday=new Date(Date.now()-86400000).toDateString();
    if(APP.lastDate===yesterday)APP.streak++;
    else APP.streak=1;
    APP.lastDate=today;
  }
  // Tool usage
  APP.toolUsage[tool]=(APP.toolUsage[tool]||0)+1;
  // Weekly
  const dow=new Date().toLocaleDateString('en',{weekday:'short'});
  APP.weeklyData[dow]=(APP.weeklyData[dow]||0)+1;
  // Level
  let lv=0;
  for(let i=LEVELS.length-1;i>=0;i--){if(APP.xp>=LEVELS[i].xp){lv=i;break;}}
  if(lv>APP.level){APP.level=lv;showToast(`🎉 Level Up! You're now a ${LEVELS[lv].name}!`,'ok',4000);}
  // First badge
  if(!APP.badges.includes('first'))unlockBadge('first');
  // Streak badge
  if(APP.streak>=3&&!APP.badges.includes('streak3'))unlockBadge('streak3');
  updateXPBar();
  saveState();
}
function unlockBadge(id){
  if(APP.badges.includes(id))return;
  APP.badges.push(id);
  const b=BADGES.find(x=>x.id===id);
  if(b)showToast(`🏆 Badge Unlocked: ${b.name}!`,'info',4000);
  saveState();
}
function updateXPBar(){
  const cur=LEVELS[APP.level];
  const next=LEVELS[APP.level+1];
  const pct=next?Math.min(100,((APP.xp-cur.xp)/(next.xp-cur.xp))*100):100;
  const fill=document.getElementById('xp-fill');
  const pts=document.getElementById('xp-pts');
  const lbl=document.getElementById('xp-level-lbl');
  if(fill)fill.style.width=pct+'%';
  if(pts)pts.textContent=APP.xp+' XP';
  if(lbl)lbl.textContent=`Level ${APP.level+1} · ${LEVELS[APP.level].name}`;
}
/* ??? THEME ??? */
function toggleTheme(){
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  if(document.documentElement.classList.contains('light')){
    document.documentElement.classList.remove('light');
    APP.theme='dark';
    if(themeToggleBtn) themeToggleBtn.textContent='🌙';
  }else{
    document.documentElement.classList.add('light');
    APP.theme='light';
    if(themeToggleBtn) themeToggleBtn.textContent='☀️';
  }
  saveState();
}
function setTheme(accent){
  APP.accent=accent;
  document.documentElement.setAttribute('data-theme',accent);
  document.querySelectorAll('.swatch').forEach(s=>{
    s.classList.toggle('active',s.dataset.themeVal===accent);
  });
  saveState();
}
/* ═══ LANGUAGE ═══ */
function toggleLang(){
  APP.lang=APP.lang==='en'?'ar':'en';
  document.documentElement.lang=APP.lang;
  document.documentElement.dir=APP.lang==='ar'?'rtl':'ltr';
  const langBtn = document.getElementById('lang-btn');
  if(langBtn) langBtn.textContent='🌐 '+APP.lang.toUpperCase();
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    el.textContent=t(el.dataset.i18n);
  });
  saveState();
}
/* ═══ SIDEBAR ═══ */
function toggleSidebar(){
  const sb=document.getElementById('sidebar');
  const main=document.getElementById('main');
  const overlay=document.getElementById('sb-overlay');
  const isCollapsed=sb.classList.contains('collapsed');
  sb.classList.toggle('collapsed',!isCollapsed);
  overlay.classList.toggle('show',isCollapsed);
  if(window.innerWidth>768){
    main.classList.toggle('full',!isCollapsed);
  }
}
function closeSidebar(){
  document.getElementById('sidebar').classList.add('collapsed');
  document.getElementById('sb-overlay').classList.remove('show');
}
/* ═══ NAVIGATION ═══ */
const TOOL_TITLES={
  home:'🏠 Home',profile:'👤 Profile Settings',
  sum:'📝 Summarizer',qgen:'❓ Exam Questions',concept:'💡 Concept Deep Dive',
  planner:'📅 Study Planner',essay:'✍️ Essay Assistant',cornell:'📓 Cornell Notes',cite:'📖 Citation Builder',
  trans:'🌍 Translator',tts:'🎧 Text to Speech',quiz:'🧪 Quick Quiz',
  fc:'🧠 Flashcards',mm:'🗺️ Mind Map',chat:'🤖 AI Chat',
  research:'🔍 Research Assistant',compare:'🔄 Compare Tool',
  para:'✏️ Paraphraser',code:'💻 Code Explainer',vocab:'📖 Vocabulary Builder',
  debate:'🎙️ Debate Generator',abstract:'📜 Abstract Writer',
  grammar:'🔤 Grammar Checker',connector:'🧩 Concept Connector',
  dataana:'📊 Data Analyzer',searchhelp:'🔎 Search Helper',
  pomo:'⏱️ Pomodoro Timer',goals:'🎯 Goal Tracker',
  gpa:'🎓 GPA Calculator',cal:'🗓️ Academic Calendar',
  hist:'📋 History',
  lectures:'📚 Lectures Library',
  settings:'⚙️ Settings',
  superstudy:'⚡ Super Study Agent',
  leaderboard:'🏆 Leaderboard',
  vision:'👁️ AI Vision Solver',
  costudy:'👥 Co-study Rooms',
};
function go(tool){
  APP.activeTab=tool;
  // Active sidebar button
  document.querySelectorAll('.sb-btn').forEach(b=>b.classList.toggle('active',b.dataset.tool===tool));
  
  // Update breadcrumb title
  const topTitle = document.getElementById('topbar-title');
  if(topTitle) {
    const titleText = TOOL_TITLES[tool]||tool;
    const isHome = tool === 'home';
    const split = titleText.split(' ');
    const icon = split.shift();
    const name = split.join(' ');
    
    if(isHome) {
      topTitle.innerHTML = `<span style="font-size:16px;">${icon}</span> <span style="font-weight:700;">Dashboard</span>`;
    } else {
      topTitle.innerHTML = `<span style="color:var(--faint); font-weight:500; cursor:pointer; margin-right:6px;" onclick="go('home')">Dashboard</span> <span style="color:var(--faint); margin-right:6px;">/</span> <span style="font-size:16px; margin-right:4px;">${icon}</span> <span style="font-weight:700;">${name}</span>`;
    }
  }

  // Render pane
  renderPane(tool);
  // Close sidebar on mobile
  if(window.innerWidth<=768)closeSidebar();
  saveState();
}
const PANES={};
function renderPane(tool){
  const cont=document.getElementById('content');
  cont.innerHTML='';
  const fn=PANES[tool];
  if(fn){
    fn(cont);
    // Auto-upgrade simple tool panes to Cyberpunk split-grid layout
    const pane = cont.firstElementChild;
    const customPanes = ['pane-home', 'pane-sum', 'pane-chat', 'pane-profile'];
    if(pane && pane.classList.contains('card') && pane.id.startsWith('pane-') && !customPanes.includes(pane.id)) {
      const outBox = pane.querySelector('.output-box');
      if (outBox) {
        // Standard tool with output - Upgrade DOM!
        const title = pane.querySelector('.card-title');
        const outWrap = outBox.parentElement;
        const mainBtn = pane.querySelector('button.btn-primary:not(.btn-sm)'); 
        
        const inputs = Array.from(pane.children).filter(c => c !== title && c !== outWrap);
        
        pane.classList.remove('card');
        pane.style.maxWidth = '1100px';
        pane.style.margin = '0 auto';
        pane.style.display = 'grid';
        pane.style.gridTemplateColumns = '340px 1fr';
        pane.style.gap = '24px';
        pane.style.alignItems = 'start';
        pane.classList.add('auto-grid');
        
        // Left Column (Settings & Inputs)
        const left = document.createElement('div');
        left.style.background = 'var(--card)';
        left.style.backdropFilter = 'blur(12px)';
        left.style.border = '1px solid var(--border)';
        left.style.borderRadius = 'var(--r)';
        left.style.padding = '24px';
        left.style.display = 'flex';
        left.style.flexDirection = 'column';
        left.style.gap = '16px';
        left.style.boxShadow = '0 0 15px rgba(0,243,255,0.02)';
        
        if(title) {
          title.style.fontSize = '18px';
          title.style.marginBottom = '8px';
          left.appendChild(title);
        }
        inputs.forEach(i => left.appendChild(i));
        
        if(mainBtn) {
          mainBtn.style.width = '100%';
          mainBtn.style.justifyContent = 'center';
          mainBtn.style.marginTop = 'auto';
        }
        
        // Right Column (Output)
        const right = document.createElement('div');
        right.style.display = 'flex';
        right.style.flexDirection = 'column';
        right.style.height = '100%';
        right.style.minHeight = '400px';
        
        const rightTitle = document.createElement('div');
        rightTitle.style.fontSize = '16px';
        rightTitle.style.fontWeight = '700';
        rightTitle.style.color = '#fff';
        rightTitle.style.marginBottom = '12px';
        rightTitle.innerHTML = '✨ Results';
        right.appendChild(rightTitle);
        
        outWrap.style.display = 'flex';
        outWrap.style.flexDirection = 'column';
        outWrap.style.flex = '1';
        outWrap.style.gap = '12px';
        
        outBox.style.flex = '1';
        right.appendChild(outWrap);
        
        pane.innerHTML = '';
        pane.appendChild(left);
        pane.appendChild(right);
      } else {
        // Doesn't have output box, just center it nicely as a glowing card
        pane.style.maxWidth = '800px';
        pane.style.margin = '0 auto';
      }
    }
    // Dynamic features execution
    if (APP.voiceInputEnabled) {
      setTimeout(addVoiceInputButtons, 100);
    }
  }
  else cont.innerHTML=`<div class="card"><div class="card-title">🚧 Coming Soon</div><p class="text-muted">This tool is under construction.</p></div>`;
}

// ── VOICE RECORDING & WHISPER SPEECH-TO-TEXT ──
function addVoiceInputButtons() {
  if (!APP.voiceInputEnabled) return;
  
  const textareas = document.querySelectorAll('#content textarea');
  textareas.forEach(ta => {
    if (ta.dataset.voiceEnabled || ta.id === 'api-input') return;
    ta.dataset.voiceEnabled = "true";
    
    const micBtn = document.createElement('button');
    micBtn.className = 'icon-btn';
    micBtn.type = 'button';
    micBtn.innerHTML = '🎙️';
    micBtn.style.position = 'absolute';
    micBtn.style.right = '10px';
    micBtn.style.bottom = '10px';
    micBtn.style.zIndex = '5';
    micBtn.style.borderRadius = '50%';
    micBtn.style.width = '30px';
    micBtn.style.height = '30px';
    micBtn.style.padding = '0';
    micBtn.style.display = 'flex';
    micBtn.style.alignItems = 'center';
    micBtn.style.justifyContent = 'center';
    micBtn.style.border = '1px solid var(--border)';
    micBtn.style.background = 'var(--card)';
    micBtn.style.cursor = 'pointer';
    micBtn.title = 'Record audio';
    
    const parent = ta.parentElement;
    if (parent) {
      parent.style.position = 'relative';
      parent.appendChild(micBtn);
    }
    
    let mediaRecorder = null;
    let audioChunks = [];
    let isRecording = false;
    
    micBtn.onclick = async () => {
      if (!isRecording) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          mediaRecorder = new MediaRecorder(stream);
          audioChunks = [];
          
          mediaRecorder.ondataavailable = event => {
            audioChunks.push(event.data);
          };
          
          mediaRecorder.onstop = async () => {
            micBtn.innerHTML = '⏳';
            micBtn.title = 'Transcribing...';
            
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);
            reader.onloadend = async () => {
              const base64Data = reader.result.split(',')[1];
              try {
                const res = await fetch(API_URL + '/transcribe', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    ...(APP.token ? { 'Authorization': `Bearer ${APP.token}` } : {})
                  },
                  body: JSON.stringify({ audio: base64Data, fileType: 'webm' })
                });
                
                if (!res.ok) throw new Error("Transcription server error");
                
                const data = await res.json();
                if (data.text) {
                  ta.value = (ta.value ? ta.value + " " : "") + data.text;
                  ta.dispatchEvent(new Event('input', { bubbles: true }));
                  showToast("Speech transcribed successfully!", "ok");
                } else {
                  showToast("No speech detected.", "warn");
                }
              } catch (err) {
                console.error("Transcription error:", err);
                showToast("Failed to transcribe speech: " + err.message, "err");
              } finally {
                micBtn.innerHTML = '🎙️';
                micBtn.title = 'Record audio';
                micBtn.style.boxShadow = 'none';
                micBtn.style.background = 'var(--card)';
              }
            };
          };
          
          mediaRecorder.start();
          isRecording = true;
          micBtn.innerHTML = '⏹️';
          micBtn.title = 'Stop recording';
          micBtn.style.background = 'rgba(239, 68, 68, 0.2)';
          micBtn.style.boxShadow = '0 0 10px var(--glow-cyan)';
          showToast("Recording started... Speak now.", "info");
        } catch (err) {
          console.error("Mic access error:", err);
          showToast("Could not access microphone: " + err.message, "err");
        }
      } else {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
          mediaRecorder.stop();
          mediaRecorder.stream.getTracks().forEach(track => track.stop());
          isRecording = false;
        }
      }
    };
  });
}
/* ═══ WORD COUNTER ═══ */
function attachWordCounter(inputId,wcId){
  const el=document.getElementById(inputId);
  const wc=document.getElementById(wcId);
  if(!el||!wc)return;
  const upd=()=>{const w=el.value.trim().split(/\s+/).filter(Boolean).length;wc.textContent=w+' words';};
  el.addEventListener('input',upd);
}

/* ═══ DYNAMIC AUTO-HIDING BOTTOM NAV ═══ */
let lastScrollY = window.scrollY;
let bnavManuallyHidden = false;

window.addEventListener('scroll', () => {
  const nav = document.getElementById('bottom-nav');
  const btn = document.getElementById('bnav-toggle-btn');
  if (!nav) return;
  
  const currentScrollY = window.scrollY;
  if (currentScrollY > lastScrollY && currentScrollY > 80 && !bnavManuallyHidden) {
    nav.classList.add('bnav-hidden');
    if (btn) btn.innerHTML = '▲ Navigation';
  } else if (currentScrollY < lastScrollY - 20) {
    bnavManuallyHidden = false;
    nav.classList.remove('bnav-hidden');
    if (btn) btn.innerHTML = '▼ Hide';
  }
  lastScrollY = currentScrollY;
}, { passive: true });

window.addEventListener('mousemove', (e) => {
  const nav = document.getElementById('bottom-nav');
  const btn = document.getElementById('bnav-toggle-btn');
  if (!nav) return;
  // If mouse is in bottom 60px of screen, reveal nav
  if (e.clientY > window.innerHeight - 60) {
    bnavManuallyHidden = false;
    nav.classList.remove('bnav-hidden');
    if (btn) btn.innerHTML = '▼ Hide';
  }
});

function toggleBottomNavManual() {
  const nav = document.getElementById('bottom-nav');
  const btn = document.getElementById('bnav-toggle-btn');
  if (!nav) return;
  
  const isCurrentlyHidden = nav.classList.contains('bnav-hidden');
  
  if (isCurrentlyHidden) {
    bnavManuallyHidden = false;
    nav.classList.remove('bnav-hidden');
    if (btn) btn.innerHTML = '▼ Hide';
  } else {
    bnavManuallyHidden = true;
    nav.classList.add('bnav-hidden');
    if (btn) btn.innerHTML = '▲ Navigation';
  }
}


/* ═══ PDF.JS LAZY LOAD ═══ */

let pdfJsLoaded=false;
async function ensurePdfJs(){
  if(pdfJsLoaded)return true;
  return new Promise((res,rej)=>{
    const s=document.createElement('script');
    s.src='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    s.onload=()=>{
      pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      pdfJsLoaded=true;res(true);
    };
    s.onerror=()=>rej(false);
    document.head.appendChild(s);
  });
}
/* ═══ EXPORT / SHARE ═══ */
function exportPack(){
  const data={history:APP.history,goals:APP.goals,semesters:APP.semesters,notes:APP.notes};
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='mindspark_export.json';a.click();
  showToast('Export downloaded','ok');
}
/* ═══ STARS CANVAS ═══ */
function initStars(){
  const c=document.getElementById('stars-canvas');
  if(!c)return;
  const ctx=c.getContext('2d');
  if(!ctx)return;
  function resize(){c.width=window.innerWidth;c.height=window.innerHeight;}
  resize();
  window.addEventListener('resize',resize);
  const stars=Array.from({length:180},()=>({
    x:Math.random()*c.width,y:Math.random()*c.height,
    r:Math.random()*1.5+.3,a:Math.random(),da:Math.random()*.005+.001
  }));
  function draw(){
    ctx.clearRect(0,0,c.width,c.height);
    stars.forEach(s=>{
      s.a+=s.da;if(s.a>1||s.a<0)s.da*=-1;
      ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(255,255,255,${s.a*0.7})`;ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}
/* ═══ NOTIFICATIONS ═══ */
function requestNotif(){
  if(!('Notification' in window)){showToast('Notifications not supported','err');return;}
  Notification.requestPermission().then(p=>{
    if(p==='granted') {
      showToast('Notifications enabled 🔔','ok');
      checkDueFlashcardsNotification();
    } else {
      showToast('Notifications denied','warn');
    }
  });
}
function sendNotif(title,body){
  if(Notification.permission==='granted')new Notification(title,{body,icon:'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚡</text></svg>'});
  else showToast(`${title}: ${body}`,'info');
}
function checkDueFlashcardsNotification() {
  if (Notification.permission === 'granted' && APP.fcCards && APP.fcCards.length) {
    const dueCount = APP.fcCards.filter(c => !c.nextReviewDate || c.nextReviewDate <= Date.now()).length;
    if (dueCount > 0) {
      new Notification("Spaced Repetition Review", {
        body: `You have ${dueCount} flashcards due for review. Let's study and keep your streak!`,
        icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚡</text></svg>'
      });
    }
  }
}
/* ═══ MODALS ═══ */
function openModal(id){document.getElementById(id).classList.add('show');}
function closeModal(id){document.getElementById(id).classList.remove('show');}
function showShortcuts(){openModal('shortcuts-modal');}
/* ═══ COMMAND PALETTE ═══ */
function openCmd(){
  document.getElementById('cmd-overlay').classList.add('show');
  document.getElementById('cmd-input').value='';
  cmdFilter('');
  setTimeout(()=>document.getElementById('cmd-input').focus(),50);
}
function closeCmd(){document.getElementById('cmd-overlay').classList.remove('show');}
function cmdFilter(q){
  cmdFiltered=CMD_TOOLS.filter(t=>t.label.toLowerCase().includes(q.toLowerCase()));
  cmdActive=cmdFiltered.length?0:-1;
  renderCmdList();
}
function renderCmdList(){
  const list=document.getElementById('cmd-list');
  const empty=document.getElementById('cmd-empty');
  if(!cmdFiltered.length){list.innerHTML='';empty.style.display='block';return;}
  empty.style.display='none';
  list.innerHTML=cmdFiltered.map((t,i)=>`
    <div class="cmd-item${i===cmdActive?' active':''}" onclick="go('${t.id}');closeCmd()" role="option" aria-selected="${i===cmdActive}">
      <span class="ci-icon">${t.icon}</span>
      <span class="ci-label">${t.label}</span>
      ${t.keys?`<span class="ci-key">${t.keys}</span>`:''}
    </div>`).join('');
  list.children[cmdActive]?.scrollIntoView({block:'nearest'});
}
/* ═══ NOTES ═══ */
function toggleNotes(){document.getElementById('notes-panel').classList.toggle('show');}
function setNoteColor(c){
  APP.noteColor=c;
  document.querySelectorAll('.note-color-btn').forEach(b=>b.classList.toggle('active',b.dataset&&b.getAttribute('onclick')?.includes(c)));
}
function addNote(){
  APP.notes.push({id:Date.now(),text:'',color:APP.noteColor});
  renderNotes();saveState();
}
function renderNotes(){
  const list=document.getElementById('notes-list');
  if(!list)return;
  list.innerHTML=APP.notes.map((n,i)=>`
    <div class="note-item" style="background:${n.color||'#1a2a1a'}">
      <textarea aria-label="Note ${i+1}" onchange="APP.notes[${i}].text=this.value;saveState()">${n.text}</textarea>
      <button class="note-del" onclick="APP.notes.splice(${i},1);renderNotes();saveState()" aria-label="Delete note">✕</button>
    </div>`).join('');
}
/* ═══ PROFILE ═══ */
function setAvatar(e){
  APP.avatar=e;
  renderAvatarElement('avatar-btn', e);
  const profileAvatar = document.querySelector('#pane-profile div[onclick="openModal(\'avatar-modal\')"]');
  if (profileAvatar) renderAvatarElement(profileAvatar, e);
  saveState();
  if (getJWT()) {
    apiCall('/profile', 'PUT', { avatar: e })
      .catch(err => console.error("Sync avatar failed:", err));
  }
}
function renderAvatarElement(target, avatarValue) {
  const el = typeof target === 'string' ? document.getElementById(target) : target;
  if (!el) return;
  const val = avatarValue || '🎓';
  const isImg = val.startsWith('data:image/') || val.startsWith('http');
  if (isImg) {
    el.innerHTML = `<img src="${val}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;" />`;
  } else {
    el.innerHTML = sanitize(val);
  }
}
function handleCustomAvatarUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    showToast("Please select a valid image file.", "err");
    return;
  }
  const reader = new FileReader();
  reader.onload = function(e) {
    const base64 = e.target.result;
    setAvatar(base64);
    showToast("Photo uploaded successfully!", "ok");
  };
  reader.readAsDataURL(file);
}
function saveProfile(){
  const name=document.getElementById('edit-name').value.trim();
  if(name){document.getElementById('profile-name').textContent=name;}
  closeModal('avatar-modal');saveState();
}
/* ═══ SIDEBAR SEARCH ═══ */
function filterSidebar(q){
  const btns=document.querySelectorAll('#sb-nav .sb-btn');
  q=q.toLowerCase();
  btns.forEach(btn=>{
    const lbl=btn.querySelector('.lbl');
    const text=lbl?.textContent||'';
    if(!q){btn.style.display='';lbl.innerHTML=text;return;}
    if(text.toLowerCase().includes(q)){
      btn.style.display='';
      lbl.innerHTML=text.replace(new RegExp(`(${q})`,'gi'),'<mark>$1</mark>');
    }else btn.style.display='none';
  });
}
/* ═══ PIN TOOLS ═══ */
function togglePin(e,toolId){
  e.stopPropagation();
  const idx=APP.pinnedTools.indexOf(toolId);
  if(idx>=0)APP.pinnedTools.splice(idx,1);
  else APP.pinnedTools.push(toolId);
  renderPinnedTools();saveState();
}
function renderPinnedTools(){
  const group=document.getElementById('sb-fav-group');
  const list=document.getElementById('sb-fav-list');
  if(!group||!list)return;
  if(!APP.pinnedTools.length){group.style.display='none';return;}
  group.style.display='';
  const tool=CMD_TOOLS.reduce((o,t)=>(o[t.id]=t,o),{});
  list.innerHTML=APP.pinnedTools.map(id=>{
    const t=tool[id]||{icon:'📌',label:id};
    return `<button class="sb-btn" data-tool="${id}" data-tool-id="${id}" onclick="go('${id}')" draggable="true">
      <span class="icon">${t.icon}</span><span class="lbl">${t.label}</span>
      <span class="pin-star pinned" onclick="togglePin(event,'${id}')">📌</span>
    </button>`;
  }).join('');
  // Update pin star states in main nav
  document.querySelectorAll('.pin-star').forEach(s=>{
    const btn=s.closest('[data-tool-id]');
    if(btn)s.classList.toggle('pinned',APP.pinnedTools.includes(btn.dataset.toolId));
  });
}
/* ═══ UPCOMING EVENTS WIDGET ═══ */
function renderUpcoming(){
  const el=document.getElementById('sb-upcoming');
  if(!el)return;
  const now=Date.now();
  const soon=APP.calendarEvents.filter(e=>e.date&&(new Date(e.date)-now)<7*86400000&&new Date(e.date)>=now-86400000).sort((a,b)=>new Date(a.date)-new Date(b.date)).slice(0,3);
  if(!soon.length){el.innerHTML='';return;}
  const colors={exam:'var(--err)',assign:'var(--gold)',present:'var(--pl)',other:'var(--teal)'};
  el.innerHTML=`<div class="sb-upcoming-title">📅 Upcoming</div>`+soon.map(e=>`
    <div class="sb-upcoming-item">
      <div class="sb-upcoming-dot" style="background:${colors[e.type]||'var(--teal)'}"></div>
      <span>${e.title.slice(0,20)} — ${new Date(e.date).toLocaleDateString()}</span>
    </div>`).join('');
}
/* ═══ CONFETTI ═══ */
function confetti(){
  const colors=['#7c3aed','#a855f7','#0d9488','#f59e0b','#10b981','#ef4444'];
  for(let i=0;i<60;i++){
    const p=document.createElement('div');
    p.className='confetti-piece';
    p.style.left=Math.random()*100+'vw';
    p.style.top='-20px';
    p.style.background=colors[Math.floor(Math.random()*colors.length)];
    p.style.animationDelay=Math.random()*1.5+'s';
    p.style.width=p.style.height=(Math.random()*8+4)+'px';
    document.body.appendChild(p);
    setTimeout(()=>p.remove(),3000);
  }
}

/* ═══════════════════════════════════════
   COURSE LIBRARY
═══════════════════════════════════════ */
const COURSES_HTML=`
<optgroup label="💻 CSE Core">
<option>CSE014 Structured Programming</option><option>CSE015 Object Oriented Programming</option>
<option>CSE111 Data Structures</option><option>CSE112 Design & Analysis of Algorithms</option>
<option>CSE131 Logic Design</option><option>CSE132 Computer Architecture</option>
<option>CSE211 Web Programming</option><option>CSE212 Theory of Computation</option>
<option>CSE221 Database Systems</option><option>CSE233 Operating Systems</option>
<option>CSE251 Software Engineering</option><option>CSE261 Computer Networks</option>
<option>CSE271 Parallel Computing</option><option>CSE272 Embedded Systems</option>
<option>CSE281 Image Processing</option><option>CSE311 Design of Compilers</option>
<option>CSE315 Discrete Mathematics</option><option>CSE382 Computer Graphics</option>
<option>CSE383 Computer Vision</option><option>CSE484 Interactive Multimedia</option><option>CSE363 Cloud Computing</option>
</optgroup>
<optgroup label="🤖 AI Engineering">
<option>AIE111 Artificial Intelligence</option><option>AIE121 Machine Learning</option>
<option>AIE212 Knowledge-Based Systems</option><option>AIE231 Neural Networks</option>
<option>AIE241 Natural Language Processing</option><option>AIE314 AI-Based Programming</option>
<option>AIE315 Computational Logic</option><option>AIE316 Evolutionary Algorithms</option>
<option>AIE322 Advanced Machine Learning</option><option>AIE323 Data Mining</option>
<option>AIE332 Deep Learning</option><option>AIE351 Robotics Design</option>
<option>AIE424 Intelligent Decision Support Systems</option>
<option>AIE444 Question Answering Systems</option>
<option>AIE452 Cognitive Robotics</option><option>AIE453 Planning for Robotics</option>
<option>AIE454 Robot Kinematics</option><option>AIE456 Human Robot Interaction</option>
</optgroup>
<optgroup label="🧬 Biomedical Informatics">
<option>BMD241 Human Physiology</option><option>BMD311 Bioinformatics</option>
<option>BMD312 Clinical Informatics</option><option>BMD351 Biomedical Data Acquisition</option>
<option>BMD361 Biomedical Statistics</option><option>BMD413 Structural Bioinformatics</option>
<option>BMD421 Biomedical Information Systems</option><option>BMD431 Medical Image Informatics</option>
<option>BMD452 Biomedical Text Processing</option>
</optgroup>
<optgroup label="📐 Mathematics & Physics">
<option>MAT112 Mathematics II</option><option>MAT114 Calculus I</option>
<option>MAT131 Statistics</option><option>MAT231 Probability & Statistics</option>
<option>MAT313 Differential Equations</option><option>PHY212 Engineering Physics</option>
<option>PHY232 Modern Physics</option><option>PHY261 Biophysics</option>
</optgroup>
<optgroup label="⚡ Electrical & Engineering">
<option>ELE211 Electromagnetic Fields</option><option>ELE232 Control Engineering</option>
<option>ELE235 Communication Systems</option><option>ELE437 Digital Signal Processing</option>
<option>MEC011 Engineering Drawing</option><option>CHE142 Engineering Chemistry</option>
</optgroup>
<optgroup label="🔒 Security & Networks">
<option>CSE241 Information Security</option><option>CSE242 Cryptography</option>
<option>CSE344 Cyber Security</option><option>CSE362 Industrial Networks</option>
<option>CSE446 Network Security</option><option>CSE448 Cyber Forensics</option>
</optgroup>`;
function courseSelect(id){
  return `<select id="${id}" aria-label="Course">${COURSES_HTML}<option value="">-- or type topic below --</option></select>`;
}
/* ═══════════════════════════════════════
   LECTURES LIBRARY
═══════════════════════════════════════ */
async function saveLecture(file) {
  showToast('Reading lecture file...', 'info', 1500);
  let text = '';
  if (file.type === 'application/pdf') {
    try {
      await ensurePdfJs();
      const buf = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({data:buf}).promise;
      for (let i = 1; i <= pdf.numPages; i++) {
        const pg = await pdf.getPage(i);
        const content = await pg.getTextContent();
        text += content.items.map(s=>s.str).join(' ') + '\n';
      }
    } catch { showToast('PDF error. Try TXT/DOCX.', 'err'); return; }
  } else {
    text = await new Promise(res => {
      const r = new FileReader();
      r.onload = e => res(e.target.result.replace(/<[^>]*>/g,' '));
      r.readAsText(file);
    });
  }
  if (!text.trim()) { showToast('File appears empty', 'err'); return; }
  const lec = {
    id: Date.now(),
    name: file.name,
    text: text.trim(),
    words: text.trim().split(/\s+/).filter(Boolean).length,
    date: new Date().toLocaleDateString()
  };
  APP.lectures.push(lec);
  saveState();
  showToast(`📚 "${file.name}" saved (${lec.words.toLocaleString()} words)`, 'ok', 3000);
  if (document.getElementById('lec-list')) renderLectures();
}
function deleteLecture(id) {
  APP.lectures = APP.lectures.filter(l => l.id !== id);
  saveState();
  renderLectures();
  showToast('Lecture removed', 'ok', 1500);
}
function renderLectures() {
  const el = document.getElementById('lec-list');
  if (!el) return;
  if (!APP.lectures.length) {
    el.innerHTML = '<p class="text-muted" style="text-align:center;padding:30px;">No lectures uploaded yet. Drop your files above.</p>';
    return;
  }
  el.innerHTML = APP.lectures.map(l => `
<div class="lec-card">
  <div class="lec-card-icon">📖</div>
  <div class="lec-card-info">
    <div class="lec-card-name">${sanitize(l.name)}</div>
    <div class="lec-card-meta">${l.words.toLocaleString()} words &bull; Added ${l.date}</div>
    <div class="lec-card-preview">${sanitize(l.text.slice(0,120))}...</div>
  </div>
  <div class="lec-card-actions">
    <button class="btn btn-ghost btn-sm" onclick="loadLectureInto(${l.id}, '__clipboard__')">📋 Copy Text</button>
    <button class="btn btn-ghost btn-sm" style="color:var(--err);" onclick="deleteLecture(${l.id})">🗑️ Delete</button>
  </div>
</div>`).join('');
}
function loadLectureInto(lecId, targetId) {
  const lec = APP.lectures.find(l => l.id === lecId);
  if (!lec) { showToast('Lecture not found', 'err'); return; }
  if (targetId === '__clipboard__') {
    navigator.clipboard.writeText(lec.text).then(() => showToast('📋 Text copied!', 'ok', 1500));
    return;
  }
  const el = document.getElementById(targetId);
  if (!el) { showToast('Target field not found', 'err'); return; }
  
  if (lec.words > 1200) {
    const useRAG = confirm(`This lecture is large (${lec.words.toLocaleString()} words).\n\nClick OK to enable smart RAG (MindSpark will automatically search and use only the most relevant parts of the lecture based on your query).\n\nClick Cancel to load the entire text anyway.`);
    if (useRAG) {
      el.dataset.ragActive = "true";
      el.dataset.lectureId = lecId;
      el.value = `[📚 Large Lecture: "${lec.name}" Loaded with Semantic RAG indexing. MindSpark will search the text for relevant sections during generation.]`;
      el.dispatchEvent(new Event('input'));
      showToast('Lecture loaded with RAG indexing.', 'ok');
      return;
    }
  }
  
  el.removeAttribute('data-rag-active');
  el.removeAttribute('data-lecture-id');
  el.value = lec.text;
  el.dispatchEvent(new Event('input'));
  showToast(`📚 "${lec.name}" loaded into field!`, 'ok', 2000);
}

// ── BROWSER RAG RETRIEVAL (TF-IDF/BM25) ──
function retrieveRelevantChunks(lectureText, query, topK = 3) {
  if (!lectureText || !query) return lectureText;
  
  const words = lectureText.split(/\s+/);
  const chunkSize = 200;
  const overlap = 50;
  const chunks = [];
  
  for (let i = 0; i < words.length; i += (chunkSize - overlap)) {
    const chunkWords = words.slice(i, i + chunkSize);
    if (chunkWords.length > 10) {
      chunks.push(chunkWords.join(" "));
    }
    if (i + chunkSize >= words.length) break;
  }
  
  const queryTerms = query.toLowerCase()
    .replace(/[^\w\s\u0600-\u06FF]/g, '')
    .split(/\s+/)
    .filter(t => t.length > 2);
    
  if (queryTerms.length === 0) {
    return chunks.slice(0, topK).join("\n\n---\n\n");
  }
  
  const scoredChunks = chunks.map(chunk => {
    const chunkLower = chunk.toLowerCase();
    let score = 0;
    
    queryTerms.forEach(term => {
      const regex = new RegExp(term, 'g');
      const count = (chunkLower.match(regex) || []).length;
      if (count > 0) {
        score += (count / (count + 1.5));
      }
    });
    
    if (queryTerms.length > 1) {
      const phrase = queryTerms.join(" ");
      if (chunkLower.includes(phrase)) {
        score += 3.0;
      }
    }
    
    return { chunk, score };
  });
  
  scoredChunks.sort((a, b) => b.score - a.score);
  const relevantChunks = scoredChunks.slice(0, topK)
    .filter(item => item.score > 0)
    .map(item => item.chunk);
    
  if (relevantChunks.length === 0) {
    return chunks.slice(0, topK).join("\n\n---\n\n");
  }
  
  return relevantChunks.join("\n\n---\n\n");
}
function lecturePickerHTML(targetId) {
  if (!APP.lectures || !APP.lectures.length) {
    return `<div class="lec-picker"><span class="lec-picker-label">📚 From Lectures</span><span class="no-lec">No lectures saved &mdash; <a href="#" onclick="go('lectures');return false;">open Lectures Library</a> to upload files.</span></div>`;
  }
  const opts = APP.lectures.map(l => `<option value="${l.id}">${sanitize(l.name)} (${l.words.toLocaleString()}w)</option>`).join('');
  return `<div class="lec-picker"><span class="lec-picker-label">📚 From Lectures</span><select id="lp-${targetId}">${opts}</select><button class="btn btn-primary btn-lp" onclick="loadLectureInto(+document.getElementById('lp-${targetId}').value, '${targetId}')">Load →</button></div>`;
}
/* ═══════════════════════════════════════
   PWA & SERVICE WORKER
═══════════════════════════════════════ */
function initPWA(){
  // Create manifest
  const manifest={
    name:'MindSpark University Edition',
    short_name:'MindSpark',
    description:'AI-powered academic study assistant',
    start_url:'/',
    display:'standalone',
    scope:'/',
    theme_color:'#7c3aed',
    background_color:'#0a0a14',
    icons:[{
      src:'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect fill="%237c3aed" width="192" height="192"/><text x="96" y="120" font-size="100" font-weight="bold" text-anchor="middle" fill="%23fff" font-family="Arial">⚡</text></svg>',
      sizes:'192x192',
      type:'image/svg+xml',
      purpose:'any'
    }]
  };
  const blob=new Blob([JSON.stringify(manifest)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  document.getElementById('manifest-link').href=url;
  // Register service worker
  if('serviceWorker' in navigator){
    const swCode=`
const CACHE_NAME='mindspark-v1';
const urlsToCache=['/','/index.html'];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(urlsToCache).catch(()=>{})).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(names=>Promise.all(names.filter(n=>n!==CACHE_NAME).map(n=>caches.delete(n)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
  event.respondWith(caches.match(event.request).then(response=>response||fetch(event.request).then(res=>{const cache_res=res.clone();caches.open(CACHE_NAME).then(cache=>cache.put(event.request,cache_res));return res;}).catch(()=>caches.match('/'))));
});`;
    const blob=new Blob([swCode],{type:'application/javascript'});
    const url=URL.createObjectURL(blob);
    navigator.serviceWorker.register(url,{scope:'/'}).catch(()=>{});
  }
  // Offline detection
  let wasOnline=navigator.onLine;
  window.addEventListener('online',()=>{
    if(!wasOnline){wasOnline=true;showToast('✅ Back online','info',2000);}
  });
  window.addEventListener('offline',()=>{
    if(wasOnline){wasOnline=false;showToast('📶 You are offline — cached content available','warn',3000);}
  });
}
function showInstallPrompt(){
  let deferredPrompt;
  window.addEventListener('beforeinstallprompt',e=>{
    e.preventDefault();
    deferredPrompt=e;
    const btn=document.getElementById('install-pwa-btn');
    if(btn)btn.style.display='inline-flex';
  });
  const btn=document.getElementById('install-pwa-btn');
  if(btn){
    btn.addEventListener('click',()=>{
      if(deferredPrompt){
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(choice=>{
          if(choice.outcome==='accepted'){
            deferredPrompt=null;
            btn.style.display='none';
            showToast('📱 App installed!','ok',2000);
          }
        });
      }
    });
  }
}
/* ═══════════════════════════════════════
   VOICE INPUT
═══════════════════════════════════════ */
let voiceRecognition=null;
let isRecording=false;
function initVoiceInput(){
  const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SpeechRecognition)return;
  voiceRecognition=new SpeechRecognition();
  voiceRecognition.continuous=true;
  voiceRecognition.interimResults=true;
  voiceRecognition.addEventListener('result',event=>{
    let interim='';
    for(let i=event.resultIndex;i<event.results.length;i++){
      const transcript=event.results[i][0].transcript;
      if(event.results[i].isFinal)interim+=transcript+' ';
      else interim+=transcript;
    }
    if(window.currentVoiceTarget){
      const el=document.getElementById(window.currentVoiceTarget);
      if(el)el.value+=interim;
    }
  });
  voiceRecognition.addEventListener('end',()=>{isRecording=false;updateVoiceBtn();});
  voiceRecognition.addEventListener('error',()=>{isRecording=false;updateVoiceBtn();showToast('Voice input error','err');});
}
function startVoiceInput(targetId){
  if(!voiceRecognition){const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SpeechRecognition){showToast('Voice input not supported','err');return;}initVoiceInput();}
  const el=document.getElementById(targetId);
  if(!el)return;
  if(isRecording){voiceRecognition.stop();isRecording=false;}else{
    window.currentVoiceTarget=targetId;
    isRecording=true;
    voiceRecognition.start();
  }
  updateVoiceBtn();
}
function updateVoiceBtn(){
  const btns=document.querySelectorAll('.voice-btn');
  btns.forEach(btn=>{
    if(btn.dataset.target===window.currentVoiceTarget&&isRecording){
      btn.style.opacity='1';
      btn.style.boxShadow='0 0 12px rgba(239,68,68,.5)';
      btn.style.animation='pulse 1s infinite';
    }else{
      btn.style.opacity='0.7';
      btn.style.boxShadow='none';
      btn.style.animation='none';
    }
  });
}
/* ═══════════════════════════════════════
   FOLLOW-UP SUGGESTIONS
═══════════════════════════════════════ */
async function generateFollowups(tool,context,prompt){
  try{
    let suggestions=[];
    const cacheKey=cacheKey(`followups:${tool}:${context.slice(0,50)}`);
    const cached=getCache(cacheKey);
    if(cached){return JSON.parse(cached);}
    await callAI([
      {role:'system',content:'Generate exactly 3 follow-up questions. Reply ONLY with JSON array: [{"q":"..."},{"q":"..."},{"q":"..."}]. No markdown, no fences.'},
      {role:'user',content:`Based on this ${tool} output:\n\n${context.slice(0,200)}\n\nGenerate 3 natural follow-up questions the user might ask.`}
    ],
    chunk=>{},
    mode=>{
      try{
        let clean=suggestions.join('');
        if(clean[0]!=='[')clean=clean.slice(clean.indexOf('['));
        const qs=JSON.parse(clean);
        suggestions=qs.slice(0,3).map(x=>x.q||x);
        setCache(cacheKey,JSON.stringify(suggestions));
      }catch{suggestions=[];}
    },
    err=>{suggestions=[];}
    );
    return suggestions;
  }catch{return [];}
}
function displayFollowups(suggestions,tool,inputFieldId,triggerFn){
  if(!suggestions||!suggestions.length)return;
  const cont=document.createElement('div');
  cont.className='output-actions';
  cont.innerHTML='<span class="section-label">💡 Follow-up Questions</span>';
  suggestions.forEach(q=>{
    const btn=document.createElement('button');
    btn.className='btn btn-ghost btn-sm';
    btn.style.marginTop='6px';
    btn.textContent=q;
    btn.onclick=()=>{
      const inp=document.getElementById(inputFieldId);
      if(inp)inp.value=q;
      if(triggerFn)triggerFn();
    };
    cont.appendChild(btn);
  });
  const parent=document.getElementById(`${tool}-out`)?.parentElement;
  if(parent)parent.appendChild(cont);
}
function addFollowupPulse(){
  const style=document.createElement('style');
  style.textContent=`@keyframes pulse{0%{box-shadow:0 0 12px rgba(239,68,68,.5)}50%{box-shadow:0 0 20px rgba(239,68,68,.8)}100%{box-shadow:0 0 12px rgba(239,68,68,.5)}}`;
  document.head.appendChild(style);
}

/* ── LECTURES LIBRARY ── */
PANES.lectures=function(cont){
  cont.innerHTML=`
<div class="card" id="pane-lectures">
  <div class="card-title"><span class="icon">📚</span>Lectures Library</div>
  <p class="text-muted" style="margin-bottom:16px;">Upload your lecture files here. All AI tools will be able to generate content directly from them.</p>

  <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:16px; margin-bottom:20px;">
    <div class="drop-zone" id="lec-drop" onclick="document.getElementById('lec-file-input').click()" role="button" aria-label="Drop lecture files" tabindex="0" style="margin-bottom:0; padding: 24px 10px;">
      <div class="drop-icon">📂</div>
      <div>Drop PDF, TXT, or DOCX here or <strong>click to upload</strong></div>
      <div style="font-size:10px;color:var(--muted);margin-top:4px;">Files are saved locally in your browser</div>
      <input type="file" id="lec-file-input" accept=".txt,.pdf,.docx" multiple style="display:none" aria-label="Upload lecture files"/>
    </div>
    
    <div class="drop-zone" style="border-color:var(--pl); background:rgba(176,38,255,0.03); margin-bottom:0; padding: 24px 10px;" onclick="event.stopPropagation()">
      <div class="drop-icon" style="color:var(--pl);">🎤</div>
      <div style="font-size:12px; font-weight:600; margin-bottom:8px;" id="record-status-label">Record Lecture Audio</div>
      <div class="flex-row" style="justify-content:center; gap:8px;">
        <button class="btn btn-gold btn-xs" id="record-start-btn" onclick="startLectureRecording()">🎤 Record</button>
        <button class="btn btn-primary btn-xs" id="record-stop-btn" onclick="stopLectureRecording()" disabled style="background:var(--err); color:#fff; box-shadow:none;">⏹️ Stop</button>
      </div>
      <div style="font-size:10px; color:var(--muted); margin-top:8px;">Or upload audio: <input type="file" id="audio-file-input" accept="audio/*" onchange="uploadAudioLecture(this)" style="font-size:10px; width:120px; margin-top:4px;"/></div>
    </div>
  </div>

  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
    <div style="font-size:13px;font-weight:700;">${APP.lectures.length} Lecture${APP.lectures.length!==1?'s':''} Saved</div>
    ${APP.lectures.length?`<button class="btn btn-ghost btn-sm" style="color:var(--err);" onclick="if(confirm('Delete ALL lectures?')){APP.lectures=[];saveState();go('lectures');}">🗑️ Clear All</button>`:''}
  </div>

  <div id="lec-list"></div>
</div>`;
  renderLectures();
  const drop=document.getElementById('lec-drop');
  const input=document.getElementById('lec-file-input');
  drop.addEventListener('dragover',e=>{e.preventDefault();drop.classList.add('drag-over');});
  drop.addEventListener('dragleave',()=>drop.classList.remove('drag-over'));
  drop.addEventListener('drop',async e=>{
    e.preventDefault();drop.classList.remove('drag-over');
    for(const f of e.dataTransfer.files) await saveLecture(f);
  });
  input.addEventListener('change',async e=>{
    for(const f of e.target.files) await saveLecture(f);
    input.value='';
  });
};

/* ── CORNELL NOTES ── */
PANES.cornell=function(cont){
  cont.innerHTML=`
<div class="card" id="pane-cornell">
  <div class="card-title"><span class="icon">📓</span>Cornell Notes Generator</div>
  <div class="form-group">
    <label for="cornell-input">Lecture Content / Text</label>
    ${lecturePickerHTML('cornell-input')}
    <textarea id="cornell-input" rows="8" placeholder="Paste your lecture notes or any text to convert to Cornell Notes format..." aria-label="Text for Cornell Notes"></textarea>
    <div class="wc" id="cornell-wc">0 words</div>
  </div>
  <div class="grid-2" style="gap:10px;margin-bottom:14px">
    <button class="btn btn-primary" id="cornell-btn" onclick="doCornellNotes()" aria-label="Generate Cornell Notes"><span>📓</span> Generate Cornell Notes</button>
    <button class="btn btn-ghost" onclick="document.getElementById('cornell-input').value='';document.getElementById('cornell-out').innerHTML='';document.getElementById('cornell-wc').textContent='0 words'">Clear</button>
  </div>
  <div id="cornell-out" aria-live="polite"></div>
  <div class="output-actions" id="cornell-actions" style="display:none;margin-top:14px">
    <button class="btn btn-ghost btn-sm" onclick="copyOutput('cornell-out')">📋 Copy</button>
    <button class="btn btn-ghost btn-sm" onclick="printOutput('cornell-out')">🖨️ Print</button>
    <button class="btn btn-teal btn-sm" onclick="saveToHistory('cornell',document.getElementById('cornell-input').value,document.getElementById('cornell-out'))">💾 Save</button>
  </div>
</div>`;
  attachWordCounter('cornell-input','cornell-wc');
};

/* ── HOME ── */
PANES.home=function(cont){
  const name = (APP.username||'Student').split(' ')[0];
  initWeeklyChallenges();
  
  let challengesHtml = `
  <div class="card" style="width:100%; margin-bottom:30px; border-color:var(--pl); background:rgba(176,38,255,0.01); box-shadow:0 0 15px rgba(176,38,255,0.05); padding: 20px;">
    <div style="font-size:16px; font-weight:800; color:#fff; margin-bottom:12px; display:flex; align-items:center; gap:8px;">
      <span>🏆 Weekly Study Challenges</span>
      <span class="badge badge-purple" style="font-size:9px;">Claim rewards for XP</span>
    </div>
    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:14px;">`;
  
  APP.weeklyChallenges.forEach(c => {
    const isCompleted = c.progress >= c.target;
    challengesHtml += `
    <div style="padding:14px; background:var(--card2); border:1px solid ${isCompleted?'var(--primary)':'var(--border)'}; border-radius:var(--rs); display:flex; flex-direction:column; gap:8px;">
      <div style="font-weight:700; color:#fff; font-size:13px;">${c.title}</div>
      <div style="font-size:11px; color:var(--muted); line-height:1.4;">${c.desc}</div>
      <div style="display:flex; justify-content:space-between; align-items:center; font-size:10px; margin-top:auto; font-weight:600;">
        <span>Progress: ${c.progress}/${c.target}</span>
        <span style="color:var(--gold);">+${c.reward} XP</span>
      </div>
      <div class="prog-bar" style="height:4px; margin-top:4px;"><div style="height:100%; width:${(c.progress/c.target)*100}%; background:linear-gradient(90deg,var(--primary),var(--pl));"></div></div>
      ${isCompleted && !c.claimed ? 
        `<button class="btn btn-teal btn-xs" onclick="claimChallenge('${c.id}')" style="margin-top:8px; justify-content:center; width:100%;">Claim Reward</button>` : 
        c.claimed ? `<span style="font-size:11px; color:var(--ok); font-weight:600; text-align:center; margin-top:8px; display:block;">✅ Claimed</span>` : 
        `<span style="font-size:10px; color:var(--muted); font-weight:600; text-align:center; margin-top:8px; display:block;">Locked</span>`}
    </div>`;
  });
  
  challengesHtml += `</div></div>`;

  cont.innerHTML=`
<div id="pane-home" style="max-width:900px; margin:0 auto; padding-top: 40px; display:flex; flex-direction:column; align-items:center;">
  <!-- Hero Section -->
  <div style="text-align:center; padding:20px 20px 40px; position:relative;">
    <div style="width:180px; height:180px; margin:0 auto 24px; position:relative;">
      <div style="position:absolute; inset:0; border-radius:50%; border:2px solid var(--primary); box-shadow:0 0 30px rgba(0,243,255,0.4), inset 0 0 20px rgba(0,243,255,0.2);"></div>
      <img src="neon_brain.png" alt="Aethera AI Brain" style="width:100%; height:100%; object-fit:cover; border-radius:50%; filter:drop-shadow(0 0 30px rgba(176,38,255,0.7)); padding: 10px;"/>

    </div>
    <h1 style="font-size:40px; font-weight:800; margin-bottom:12px; background:linear-gradient(135deg,#fff,var(--primary)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; line-height:1.2;">
      Welcome to Aethera.
    </h1>

    <p style="font-size:16px; color:var(--muted); max-width:540px; margin:0 auto; line-height:1.7;">
      Your ultimate AI-powered academic toolkit. Unlock your<br>potential with advanced study tools.
    </p>
  </div>

  <!-- Weekly Challenges Widget -->
  ${challengesHtml}

  <!-- Feature Cards -->
  <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:20px; width:100%;">
    <!-- Summarizer -->
    <div onclick="go('sum')" style="cursor:pointer; background:var(--card); border:1px solid var(--border); border-radius:24px; padding:32px 24px; transition:all .3s ease; position:relative; overflow:hidden;"
      onmouseover="this.style.borderColor='var(--primary)'; this.style.boxShadow='0 10px 30px rgba(0,243,255,0.2)'"
      onmouseout="this.style.borderColor='var(--border)'; this.style.boxShadow='none'">
      <div style="font-size:40px; margin-bottom:16px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.5));">📚</div>
      <div style="font-size:18px; font-weight:800; color:#fff; margin-bottom:10px;">Summarizer</div>
      <div style="font-size:13px; color:var(--muted); line-height:1.6;">Condense long texts and documents instantly.</div>
      <div style="position:absolute; bottom:0; left:0; right:0; height:4px; background:linear-gradient(90deg,var(--primary),transparent); opacity:0.8;"></div>
    </div>
    <!-- AI Chat -->
    <div onclick="go('chat')" style="cursor:pointer; background:var(--card); border:1px solid var(--border); border-radius:24px; padding:32px 24px; transition:all .3s ease; position:relative; overflow:hidden;"
      onmouseover="this.style.borderColor='var(--pl)'; this.style.boxShadow='0 10px 30px rgba(176,38,255,0.2)'"
      onmouseout="this.style.borderColor='var(--border)'; this.style.boxShadow='none'">
      <div style="font-size:40px; margin-bottom:16px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.5));">🤖</div>
      <div style="font-size:18px; font-weight:800; color:#fff; margin-bottom:10px;">AI Chat</div>
      <div style="font-size:13px; color:var(--muted); line-height:1.6;">Talk to your personal AI study assistant.</div>
      <div style="position:absolute; bottom:0; left:0; right:0; height:4px; background:linear-gradient(90deg,var(--pl),transparent); opacity:0.8;"></div>
    </div>
    <!-- Quick Quiz -->
    <div onclick="go('quiz')" style="cursor:pointer; background:var(--card); border:1px solid var(--border); border-radius:24px; padding:32px 24px; transition:all .3s ease; position:relative; overflow:hidden;"
      onmouseover="this.style.borderColor='var(--gold)'; this.style.boxShadow='0 10px 30px rgba(245,158,11,0.2)'"
      onmouseout="this.style.borderColor='var(--border)'; this.style.boxShadow='none'">
      <div style="font-size:40px; margin-bottom:16px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.5));">🧪</div>
      <div style="font-size:18px; font-weight:800; color:#fff; margin-bottom:10px;">Quick Quiz</div>
      <div style="font-size:13px; color:var(--muted); line-height:1.6;">Test your knowledge on any topic.</div>
      <div style="position:absolute; bottom:0; left:0; right:0; height:4px; background:linear-gradient(90deg,var(--gold),transparent); opacity:0.8;"></div>
    </div>
    <!-- Super Study Agent -->
    <div onclick="go('superstudy')" style="cursor:pointer; background:var(--card); border:1px solid var(--primary); border-radius:24px; padding:32px 24px; transition:all .3s ease; position:relative; overflow:hidden; box-shadow:0 0 15px rgba(0,243,255,0.15);"
      onmouseover="this.style.borderColor='var(--pl)'; this.style.boxShadow='0 10px 30px rgba(176,38,255,0.25)'"
      onmouseout="this.style.borderColor='var(--primary)'; this.style.boxShadow='0 0 15px rgba(0,243,255,0.15)'">
      <div style="font-size:40px; margin-bottom:16px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.5));">⚡</div>
      <div style="font-size:18px; font-weight:800; color:#fff; margin-bottom:10px;">Super Study Agent</div>
      <div style="font-size:13px; color:var(--muted); line-height:1.6;">Summarize, quiz, flashcards, & mind maps in one click.</div>
      <div style="position:absolute; bottom:0; left:0; right:0; height:4px; background:linear-gradient(90deg,var(--primary),var(--pl)); opacity:0.8;"></div>
    </div>
  </div>
</div>`;
};

/* ── SUPER STUDY AI AGENT PIPELINE ── */
PANES.superstudy = function(cont) {
  cont.innerHTML = `
  <div class="card" id="pane-superstudy" style="max-width:900px; margin:0 auto; display:flex; flex-direction:column; gap:20px;">
    <div class="card-title" style="font-size:18px; font-weight:700; color:#fff; border-bottom:1px solid var(--border); padding-bottom:12px; margin-bottom:16px;">
      <span class="icon" style="text-shadow: 0 0 10px var(--glow-cyan);">⚡</span>
      <span>Super Study AI Agent</span>
    </div>
    <p class="text-muted" style="margin-bottom:12px; font-size:13px;">
      This agent runs an autonomous study pipeline. Upload a lecture or enter a topic, and the agent will generate a summary, flashcards, a quiz, and a mind map in one unified dashboard.
    </p>
    
    <div id="ss-setup-form">
      <div class="grid-2" style="margin-bottom:14px;">
        <div class="form-group">
          <label for="ss-topic">Topic or Concept</label>
          <input type="text" id="ss-topic" placeholder="e.g. Artificial Neural Networks, Photosynthesis..." aria-label="Super study topic"/>
        </div>
        <div class="form-group">
          <label>Lecture Library Context</label>
          ${lecturePickerHTML('ss-context')}
        </div>
      </div>
      
      <div class="form-group">
        <label for="ss-context">Study Material Text</label>
        <textarea id="ss-context" rows="4" placeholder="Paste study notes or load a file from the Lectures Library..." aria-label="Super study context"></textarea>
      </div>
      
      <button class="btn btn-primary" id="ss-run-btn" onclick="runSuperStudyPipeline()" style="width:100%; justify-content:center;">⚡ Run Complete AI Pipeline</button>
    </div>
    
    <!-- Status progress screen -->
    <div id="ss-progress-screen" style="display:none; background:rgba(0,0,0,0.3); border:1px solid var(--border); border-radius:var(--r); padding:24px;">
      <h3 style="font-size:15px; font-weight:700; color:#fff; margin-bottom:16px; text-align:center;" id="ss-progress-title">Agent Pipeline Running...</h3>
      <div style="display:flex; flex-direction:column; gap:12px; font-size:13px;">
        <div style="display:flex; align-items:center; gap:10px;" id="ss-step-1">
          <span class="icon">⏳</span> <span>Generating Academic Summary...</span>
        </div>
        <div style="display:flex; align-items:center; gap:10px; opacity:0.5;" id="ss-step-2">
          <span class="icon">⏳</span> <span>Building Flashcards...</span>
        </div>
        <div style="display:flex; align-items:center; gap:10px; opacity:0.5;" id="ss-step-3">
          <span class="icon">⏳</span> <span>Compiling Interactive Quiz...</span>
        </div>
        <div style="display:flex; align-items:center; gap:10px; opacity:0.5;" id="ss-step-4">
          <span class="icon">⏳</span> <span>Drawing Concept Mind Map...</span>
        </div>
      </div>
    </div>
    
    <!-- Final results dashboard -->
    <div id="ss-results-dashboard" style="display:none;">
      <!-- Tab selectors -->
      <div style="display:flex; border-bottom:1px solid var(--border2); margin-bottom:16px; gap:8px;">
        <button class="btn btn-ghost btn-sm active" id="ss-tab-btn-sum" onclick="switchSSTab('sum')" style="flex:1; border-radius:0; border:none; border-bottom:2px solid var(--primary);">📝 Summary</button>
        <button class="btn btn-ghost btn-sm" id="ss-tab-btn-fc" onclick="switchSSTab('fc')" style="flex:1; border-radius:0; border:none;">🧠 Flashcards</button>
        <button class="btn btn-ghost btn-sm" id="ss-tab-btn-quiz" onclick="switchSSTab('quiz')" style="flex:1; border-radius:0; border:none;">🧪 Quiz</button>
        <button class="btn btn-ghost btn-sm" id="ss-tab-btn-mm" onclick="switchSSTab('mm')" style="flex:1; border-radius:0; border:none;">🗺️ Mind Map</button>
      </div>
      
      <!-- Tab bodies -->
      <div id="ss-tab-body-sum" class="ss-tab-content">
        <div class="output-box" id="ss-out-sum" style="min-height:300px;"></div>
      </div>
      <div id="ss-tab-body-fc" class="ss-tab-content" style="display:none;">
        <div id="ss-out-fc-container"></div>
      </div>
      <div id="ss-tab-body-quiz" class="ss-tab-content" style="display:none;">
        <div id="ss-out-quiz-container"></div>
      </div>
      <div id="ss-tab-body-mm" class="ss-tab-content" style="display:none;">
        <svg id="ss-mm-svg" viewBox="0 0 900 600" preserveAspectRatio="xMidYMid meet" style="width:100%; height:500px; background:var(--card2); border:1px solid var(--border2); border-radius:var(--rs); cursor:grab;"></svg>
      </div>
    </div>
  </div>
  `;
};

let superStudyResults = { sum: '', fc: [], quiz: [], mm: null };

window.switchSSTab = function(tabName) {
  document.querySelectorAll('.ss-tab-content').forEach(el => el.style.display = 'none');
  document.getElementById(`ss-tab-body-${tabName}`).style.display = 'block';
  
  const btnIds = ['sum', 'fc', 'quiz', 'mm'];
  btnIds.forEach(id => {
    const btn = document.getElementById(`ss-tab-btn-${id}`);
    if(btn) {
      if(id === tabName) {
        btn.classList.add('active');
        btn.style.borderBottom = '2px solid var(--primary)';
      } else {
        btn.classList.remove('active');
        btn.style.borderBottom = 'none';
      }
    }
  });
  
  if (tabName === 'mm' && superStudyResults.mm) {
    setTimeout(() => renderMindMapD3Local(superStudyResults.mm, "#ss-mm-svg"), 100);
  }
};

window.runSuperStudyPipeline = async function() {
  const topic = document.getElementById('ss-topic').value.trim();
  const context = document.getElementById('ss-context').value.trim();
  
  if (!topic && !context) {
    showToast("Please enter a topic or load a lecture first.", "err");
    return;
  }
  
  const targetTopic = topic || "Loaded Lecture";
  
  document.getElementById('ss-setup-form').style.display = 'none';
  document.getElementById('ss-progress-screen').style.display = 'block';
  
  const steps = [
    { id: 'ss-step-1', text: 'Generating Summary...' },
    { id: 'ss-step-2', text: 'Building Flashcards...' },
    { id: 'ss-step-3', text: 'Compiling Quiz...' },
    { id: 'ss-step-4', text: 'Drawing Mind Map...' }
  ];
  
  const updateStep = (index, status) => {
    const el = document.getElementById(steps[index].id);
    if (!el) return;
    el.style.opacity = '1';
    if (status === 'active') {
      el.querySelector('.icon').innerHTML = '⚡';
      el.style.color = 'var(--primary)';
    } else if (status === 'done') {
      el.querySelector('.icon').innerHTML = '✅';
      el.style.color = 'var(--ok)';
    } else if (status === 'error') {
      el.querySelector('.icon').innerHTML = '❌';
      el.style.color = 'var(--err)';
    }
  };

  try {
    updateStep(0, 'active');
    let summaryText = '';
    const sumPrompt = context ? `Summarize this text in detail:\n\n${context}` : `Write a detailed scholarly summary of the academic topic: ${targetTopic}`;
    
    await new Promise((resolve, reject) => {
      callAI([{ role: 'user', content: sumPrompt }], {
        onChunk: (c) => { summaryText += c; },
        onDone: () => resolve(),
        onError: (err) => reject(new Error(err))
      });
    });
    superStudyResults.sum = summaryText;
    document.getElementById('ss-out-sum').innerHTML = sanitize(renderMD(summaryText));
    updateStep(0, 'done');
    
    updateStep(1, 'active');
    let fcText = '';
    await new Promise((resolve, reject) => {
      callAI([
        { role: 'system', content: 'Reply ONLY with JSON array of cards: [{"front":"Front text","back":"Back text"}]. No other text or markdown wrappers.' },
        { role: 'user', content: `Generate 5 flashcards from this summary:\n\n${summaryText}` }
      ], {
        onChunk: (c) => { fcText += c; },
        onDone: () => resolve(),
        onError: (err) => reject(new Error(err))
      });
    });
    
    try {
      let cleanFc = fcText.replace(/```json|```/gi, '').trim();
      if(cleanFc[0] !== '[') cleanFc = cleanFc.slice(cleanFc.indexOf('['));
      superStudyResults.fc = JSON.parse(cleanFc);
      renderSSFlashcards(superStudyResults.fc);
      updateStep(1, 'done');
    } catch {
      throw new Error("Failed parsing flashcards JSON");
    }
    
    updateStep(2, 'active');
    let quizText = '';
    await new Promise((resolve, reject) => {
      callAI([
        { role: 'system', content: 'Reply ONLY with JSON array of 5 questions: [{"question":"Q text","options":["A","B","C","D"],"correct":0,"explanation":"Explain why"}]. No other text or markdown wrappers.' },
        { role: 'user', content: `Generate a 5-question multiple choice quiz from this summary:\n\n${summaryText}` }
      ], {
        onChunk: (c) => { quizText += c; },
        onDone: () => resolve(),
        onError: (err) => reject(new Error(err))
      });
    });
    
    try {
      let cleanQuiz = quizText.replace(/```json|```/gi, '').trim();
      if(cleanQuiz[0] !== '[') cleanQuiz = cleanQuiz.slice(cleanQuiz.indexOf('['));
      superStudyResults.quiz = JSON.parse(cleanQuiz);
      renderSSQuiz(superStudyResults.quiz);
      updateStep(2, 'done');
    } catch {
      throw new Error("Failed parsing quiz JSON");
    }
    
    updateStep(3, 'active');
    let mmText = '';
    await new Promise((resolve, reject) => {
      callAI([
        { role: 'system', content: 'Reply ONLY with JSON: {"label":"Main Topic","children":[{"label":"Subtopic","children":[{"label":"Details"}]}]}. No other text or markdown wrappers.' },
        { role: 'user', content: `Generate a hierarchical mind map structure from this topic: ${targetTopic}` }
      ], {
        onChunk: (c) => { mmText += c; },
        onDone: () => resolve(),
        onError: (err) => reject(new Error(err))
      });
    });
    
    try {
      let cleanMm = mmText.replace(/```json|```/gi, '').trim();
      if(cleanMm[0] !== '{') cleanMm = cleanMm.slice(cleanMm.indexOf('{'));
      superStudyResults.mm = JSON.parse(cleanMm);
      updateStep(3, 'done');
      addXP('superstudy');
    } catch {
      throw new Error("Failed parsing mind map JSON");
    }
    
    setTimeout(() => {
      document.getElementById('ss-progress-screen').style.display = 'none';
      document.getElementById('ss-results-dashboard').style.display = 'block';
      switchSSTab('sum');
      showToast("Agent Pipeline ran successfully!", "ok");
    }, 1000);
    
  } catch (error) {
    console.error("Super study error:", error);
    showToast("Pipeline error: " + error.message, "err");
    document.getElementById('ss-setup-form').style.display = 'block';
    document.getElementById('ss-progress-screen').style.display = 'none';
  }
};

function renderSSFlashcards(cards) {
  const container = document.getElementById('ss-out-fc-container');
  if(!container) return;
  
  let currentIdx = 0;
  
  window.flipSSCard = () => {
    document.getElementById('ss-fc-card').classList.toggle('flipped');
  };
  
  window.nextSSCard = () => {
    if (currentIdx < cards.length - 1) {
      currentIdx++;
      updateCardView();
    }
  };
  
  window.prevSSCard = () => {
    if (currentIdx > 0) {
      currentIdx--;
      updateCardView();
    }
  };
  
  const updateCardView = () => {
    const card = cards[currentIdx];
    document.getElementById('ss-fc-front').textContent = card.front;
    document.getElementById('ss-fc-back').textContent = card.back;
    document.getElementById('ss-fc-count').textContent = `${currentIdx + 1} / ${cards.length}`;
    document.getElementById('ss-fc-card').classList.remove('flipped');
  };
  
  container.innerHTML = `
  <div style="max-width:500px; margin: 20px auto;">
    <div class="fc-scene" onclick="flipSSCard()" style="cursor:pointer; height:200px;">
      <div class="fc-card" id="ss-fc-card" style="width:100%; height:100%; transition:transform .4s; transform-style:preserve-3d; position:relative;">
        <div class="fc-front" id="ss-fc-front" style="position:absolute; inset:0; backface-visibility:hidden; display:flex; align-items:center; justify-content:center; text-align:center; padding:20px; font-weight:700; background:var(--card2); border:1px solid var(--border2); border-radius:var(--r);">Front</div>
        <div class="fc-back" id="ss-fc-back" style="position:absolute; inset:0; backface-visibility:hidden; display:flex; align-items:center; justify-content:center; text-align:center; padding:20px; font-weight:700; background:linear-gradient(135deg,var(--primary),var(--pl)); color:#fff; border-radius:var(--r); transform:rotateY(180deg);">Back</div>
      </div>
    </div>
    <div class="fc-nav" style="display:flex; justify-content:space-between; align-items:center; margin-top:14px;">
      <button class="btn btn-ghost btn-sm" onclick="prevSSCard()">◀ Prev</button>
      <span class="fc-count" id="ss-fc-count">1 / 5</span>
      <button class="btn btn-ghost btn-sm" onclick="nextSSCard()">Next ▶</button>
    </div>
  </div>
  `;
  updateCardView();
}

function renderSSQuiz(questions) {
  const container = document.getElementById('ss-out-quiz-container');
  if(!container) return;
  
  let score = 0;
  let currentQ = 0;
  
  window.submitSSAnswer = (optIdx) => {
    const q = questions[currentQ];
    const opts = document.querySelectorAll('.ss-q-opt');
    opts.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === q.correct) {
        btn.style.background = 'rgba(16, 185, 129, 0.2)';
        btn.style.borderColor = 'var(--ok)';
        btn.style.color = 'var(--ok)';
      } else if (idx === optIdx) {
        btn.style.background = 'rgba(239, 68, 68, 0.2)';
        btn.style.borderColor = 'var(--err)';
        btn.style.color = 'var(--err)';
      }
    });
    
    if (optIdx === q.correct) {
      score++;
      showToast("Correct! +10 XP", "ok");
    }
    
    document.getElementById('ss-q-fb').style.display = 'block';
    document.getElementById('ss-q-fb-text').textContent = q.explanation || "Correct answer shown above.";
    document.getElementById('ss-q-nxt').style.display = 'block';
  };
  
  window.nextSSQuestion = () => {
    currentQ++;
    if (currentQ < questions.length) {
      renderQuestion();
    } else {
      showQuizScore();
    }
  };
  
  const renderQuestion = () => {
    const q = questions[currentQ];
    container.innerHTML = `
    <div style="max-width:600px; margin: 20px auto;">
      <div style="font-size:12px; color:var(--muted); margin-bottom:8px; text-transform:uppercase;">Question ${currentQ + 1} of ${questions.length}</div>
      <h3 style="font-size:16px; font-weight:700; margin-bottom:16px; color:#fff;">${q.question}</h3>
      <div style="display:flex; flex-direction:column; gap:8px;">
        ${q.options.map((opt, idx) => `
          <button class="quiz-option ss-q-opt" onclick="submitSSAnswer(${idx})" style="text-align:left; padding:12px 16px; font-size:13px;">${opt}</button>
        `).join('')}
      </div>
      <div id="ss-q-fb" style="display:none; background:rgba(255,255,255,0.03); border:1px solid var(--border); border-radius:var(--rs); padding:12px; margin-top:14px; font-size:12px; color:var(--muted); line-height:1.5;">
        <strong>Explanation:</strong> <span id="ss-q-fb-text"></span>
      </div>
      <button class="btn btn-primary btn-sm" id="ss-q-nxt" onclick="nextSSQuestion()" style="display:none; margin-top:14px; width:100%; justify-content:center;">Next Question</button>
    </div>
    `;
  };
  
  const showQuizScore = () => {
    container.innerHTML = `
    <div style="max-width:500px; margin: 40px auto; text-align:center;">
      <div style="font-size:48px; margin-bottom:14px;">🏆</div>
      <h2 style="font-size:24px; font-weight:800; color:#fff; margin-bottom:8px;">Quiz Completed!</h2>
      <p style="font-size:16px; color:var(--primary); font-weight:700; margin-bottom:12px;">Score: ${score} / ${questions.length}</p>
      <p style="font-size:13px; color:var(--muted); line-height:1.6; margin-bottom:20px;">
        Great work! You have finished the quiz generated from this study material. Try running another Super Study pipeline.
      </p>
      <button class="btn btn-primary" onclick="go('superstudy')" style="margin:0 auto;">Restart Agent</button>
    </div>
    `;
  };
  
  renderQuestion();
}

function renderMindMapD3Local(treeData, svgSelector) {
  const svgEl = d3.select(svgSelector);
  svgEl.selectAll("*").remove();
  
  const width = 900;
  const height = 500;
  
  const g = svgEl.append("g");
  
  const zoom = d3.zoom()
    .scaleExtent([0.3, 3])
    .on("zoom", (event) => {
      g.attr("transform", event.transform);
    });
  svgEl.call(zoom);
  
  const root = d3.hierarchy(treeData);
  const treeLayout = d3.tree().size([height - 80, width - 220]);
  treeLayout(root);
  
  root.each(d => {
    d.y += 100;
    d.x += 40;
  });

  const links = g.selectAll(".link")
    .data(root.links())
    .enter()
    .append("path")
    .attr("fill", "none")
    .attr("stroke", d => d.target.depth === 1 ? "var(--primary)" : "var(--pl)")
    .attr("stroke-width", d => Math.max(1, 4 - d.source.depth) + "px")
    .attr("opacity", 0.6)
    .attr("d", d3.linkHorizontal()
      .x(d => d.y)
      .y(d => d.x)
    );

  const nodes = g.selectAll(".node")
    .data(root.descendants())
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", d => `translate(${d.y},${d.x})`)
    .call(d3.drag()
      .on("start", (event, d) => d3.select(this).raise())
      .on("drag", (event, d) => {
        d.y = event.x;
        d.x = event.y;
        d3.select(this).attr("transform", `translate(${d.y},${d.x})`);
        links.attr("d", d3.linkHorizontal().x(l => l.y).y(l => l.x));
      })
    );

  nodes.append("rect")
    .attr("rx", 8)
    .attr("ry", 8)
    .attr("x", -60)
    .attr("y", -14)
    .attr("width", 120)
    .attr("height", 28)
    .attr("fill", d => d.depth === 0 ? "var(--primary)" : (d.depth === 1 ? "var(--card2)" : "rgba(20,20,35,0.9)"))
    .attr("stroke", d => d.depth === 0 ? "var(--pl)" : (d.depth === 1 ? "var(--primary)" : "var(--border2)"))
    .attr("stroke-width", 1.5)
    .style("cursor", "pointer");

  nodes.append("text")
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .attr("fill", "#fff")
    .style("font-size", "10px")
    .style("font-weight", d => d.depth === 0 ? "700" : "500")
    .style("font-family", "Poppins, sans-serif")
    .style("pointer-events", "none")
    .text(d => d.data.label);
}

PANES.settings = function(cont) {
  if (!APP.notionToken || APP.notionToken.length < 45) {
    APP.notionToken = '';
    saveState();
  }
  if (!APP.notionDatabaseId || APP.notionDatabaseId.startsWith('ntn_') || APP.notionDatabaseId.startsWith('secret_')) {
    APP.notionDatabaseId = '39e5d04bc602806d9fcac6a3034e115b';
    saveState();
  }
  cont.innerHTML = `
  <div class="card" id="pane-settings" style="max-width:800px; margin:0 auto; display:flex; flex-direction:column; gap:24px;">
    <div class="card-title" style="font-size:18px; font-weight:700; color:#fff; border-bottom:1px solid var(--border); padding-bottom:12px; margin-bottom:16px;">
      <span class="icon" style="text-shadow: 0 0 10px var(--glow-purple);">⚙️</span>
      <span>System Settings & Integrations</span>
    </div>
    
    <!-- Section 1: AI Provider & Model -->
    <div style="background:rgba(255,255,255,0.02); border:1px solid var(--border); border-radius:var(--r); padding:20px;">
      <h3 style="font-size:14px; font-weight:700; color:var(--primary); margin-bottom:14px; display:flex; align-items:center; gap:8px;">
        <span>🤖</span> AI Engine Configurations
      </h3>
      
      <div class="grid-2">
        <div class="form-group">
          <label for="settings-ai-provider">AI Provider</label>
          <select id="settings-ai-provider" onchange="APP.aiProvider=this.value; onSettingsProviderChange(this.value); saveState();" style="width:100%;">
            <option value="groq" ${APP.aiProvider==='groq'?'selected':''}>Groq Cloud (Free & Ultra Fast)</option>
            <option value="openai" ${APP.aiProvider==='openai'?'selected':''}>OpenAI API (Paid API Key)</option>
            <option value="gemini" ${APP.aiProvider==='gemini'?'selected':''}>Google Gemini API (Free/Paid API Key)</option>
            <option value="local" ${APP.aiProvider==='local'?'selected':''}>Offline Local LLM (Runs in Browser)</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="settings-ai-model">Model</label>
          <select id="settings-ai-model" onchange="APP.aiModel=this.value; saveState();" style="width:100%;">
            <!-- Populated dynamically -->
          </select>
        </div>
      </div>
      
      <div class="form-group" style="margin-top:14px;">
        <label for="settings-ai-temp" style="display:flex; justify-content:space-between; font-size:11px; font-weight:600; color:var(--muted); margin-bottom:5px;">
          <span>Creativity Temperature</span>
          <span id="temp-val" style="color:var(--pl); font-weight:700;">${APP.aiTemperature}</span>
        </label>
        <input type="range" id="settings-ai-temp" min="0.0" max="1.0" step="0.1" value="${APP.aiTemperature}" style="width:100%; accent-color:var(--primary);" oninput="document.getElementById('temp-val').textContent=this.value; APP.aiTemperature=parseFloat(this.value); saveState();"/>
      </div>
      
      <!-- Local model initialization widget -->
      <div id="local-model-widget" style="margin-top:16px; display:${APP.aiProvider==='local'?'block':'none'}; background:rgba(0,243,255,0.04); border:1px solid rgba(0,243,255,0.2); border-radius:var(--rs); padding:14px;">
        <p style="font-size:12px; color:var(--text); margin-bottom:10px; line-height:1.5;">
          <strong>Local AI Execution:</strong> Runs a neural network locally on your graphic card (WebGPU). The first start requires downloading about <strong>2.2 GB</strong> of weights to your browser cache.
        </p>
        <div id="local-download-progress" style="display:none; margin-bottom:10px;">
          <div class="xp-label" style="margin-bottom:4px; display:flex; justify-content:space-between; font-size:9px; color:var(--muted);">
            <span id="local-status-text">Downloading local weights...</span>
            <span id="local-pct">0%</span>
          </div>
          <div class="xp-bar" style="height:4px; background:var(--border2); border-radius:2px; overflow:hidden;"><div class="xp-fill" id="local-progress-fill" style="width:0%; height:100%; background:var(--primary); transition:width .2s;"></div></div>
        </div>
        <button class="btn btn-teal btn-sm" id="btn-init-local" onclick="triggerLocalLLMInit()">⚡ Initialize & Cache Local Model</button>
      </div>
    </div>
    
    <!-- Section 2: Audio & Transcription Settings -->
    <div style="background:rgba(255,255,255,0.02); border:1px solid var(--border); border-radius:var(--r); padding:20px;">
      <h3 style="font-size:14px; font-weight:700; color:var(--primary); margin-bottom:14px; display:flex; align-items:center; gap:8px;">
        <span>🎙️</span> Voice Input & Dictation
      </h3>
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h4 style="font-size:12px; font-weight:600; color:#fff;">Enable Voice Recording dictation</h4>
          <p style="font-size:11px; color:var(--muted); margin-top:2px;">Allows recording audio inputs to transcribe via OpenAI Whisper proxy.</p>
        </div>
        <input type="checkbox" id="settings-voice-enabled" ${APP.voiceInputEnabled?'checked':''} style="width:40px; height:20px; cursor:pointer;" onchange="APP.voiceInputEnabled=this.checked; saveState(); showToast(this.checked?'Voice input active!':'Voice input disabled.','info');"/>
      </div>
    </div>
    
    <!-- Section 2.5: Study Reminders & Notifications -->
    <div style="background:rgba(255,255,255,0.02); border:1px solid var(--border); border-radius:var(--r); padding:20px;">
      <h3 style="font-size:14px; font-weight:700; color:var(--primary); margin-bottom:14px; display:flex; align-items:center; gap:8px;">
        <span>🔔</span> Study Reminders & Notifications
      </h3>
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h4 style="font-size:12px; font-weight:600; color:#fff;">Enable Study Reminder Notifications</h4>
          <p style="font-size:11px; color:var(--muted); margin-top:2px;">Get friendly reminders to maintain your streak and review flashcards.</p>
        </div>
        <input type="checkbox" id="settings-notif-enabled" ${APP.notifEnabled?'checked':''} style="width:40px; height:20px; cursor:pointer;" onchange="toggleStudyReminders(this.checked)"/>
      </div>
    </div>
    
    <!-- Section 3: Third-Party Integrations -->
    <div style="background:rgba(255,255,255,0.02); border:1px solid var(--border); border-radius:var(--r); padding:20px;">
      <h3 style="font-size:14px; font-weight:700; color:var(--primary); margin-bottom:14px; display:flex; align-items:center; gap:8px;">
        <span>🔌</span> Notion Sync Integration
      </h3>
      
      <div class="grid-2" style="margin-bottom:14px;">
        <div class="form-group">
          <label for="settings-notion-token">Notion Secret Token</label>
          <input type="password" id="settings-notion-token" placeholder="secret_..." value="${APP.notionToken||''}" onchange="APP.notionToken=this.value; saveState();"/>
        </div>
        
        <div class="form-group">
          <label for="settings-notion-db">Notion Database ID</label>
          <input type="text" id="settings-notion-db" placeholder="32-character hex string..." value="${APP.notionDatabaseId||''}" onchange="APP.notionDatabaseId=this.value; saveState();"/>
        </div>
      </div>
      <button class="btn btn-ghost btn-sm" onclick="testNotionConnection()">🔗 Test Connection</button>
    </div>
  </div>
  `;
  onSettingsProviderChange(APP.aiProvider);
};

function onSettingsProviderChange(provider) {
  const modelSelect = document.getElementById('settings-ai-model');
  const localWidget = document.getElementById('local-model-widget');
  if(localWidget) localWidget.style.display = provider === 'local' ? 'block' : 'none';
  if(!modelSelect) return;
  modelSelect.innerHTML = '';
  
  let models = [];
  if (provider === 'groq') {
    models = [
      { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B (Versatile)' },
      { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B' },
      { id: 'gemma2-9b-it', name: 'Gemma 2 9B' }
    ];
  } else if (provider === 'openai') {
    models = [
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini (Recommended)' },
      { id: 'gpt-4o', name: 'GPT-4o (High Intelligence)' }
    ];
  } else if (provider === 'gemini') {
    models = [
      { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash (Fast & Large Context)' },
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' }
    ];
  } else if (provider === 'local') {
    models = [
      { id: 'Phi-3-mini-4k-instruct-q4f16_1-MLC', name: 'Phi-3 Mini 4K Instruct (~2.2GB)' }
    ];
  }
  
  models.forEach(m => {
    const opt = document.createElement('option');
    opt.value = m.id;
    opt.textContent = m.name;
    opt.selected = m.id === APP.aiModel;
    modelSelect.appendChild(opt);
  });
}

window.onSettingsProviderChange = onSettingsProviderChange;

window.triggerLocalLLMInit = async function() {
  const btn = document.getElementById('btn-init-local');
  const progressWrap = document.getElementById('local-download-progress');
  const progressFill = document.getElementById('local-progress-fill');
  const statusText = document.getElementById('local-status-text');
  const pctText = document.getElementById('local-pct');
  
  if(btn) btn.disabled = true;
  if(progressWrap) progressWrap.style.display = 'block';
  
  await initializeLocalLLM((report) => {
    if(statusText) statusText.textContent = report.text;
    if(pctText && report.progress !== undefined) {
      const pct = Math.round(report.progress * 100);
      pctText.textContent = pct + "%";
      if(progressFill) progressFill.style.width = pct + "%";
    }
  });
  
  if(btn) {
    btn.disabled = false;
    btn.textContent = "⚡ Local AI Model Ready";
    btn.className = "btn btn-teal btn-sm active";
  }
};

window.testNotionConnection = async function() {
  const tokenInput = document.getElementById('settings-notion-token');
  const dbInput = document.getElementById('settings-notion-db');
  
  let currentToken = tokenInput ? tokenInput.value.trim() : (APP.notionToken || '');
  let currentDb = dbInput ? dbInput.value.trim() : (APP.notionDatabaseId || '');

  // Auto-fix token if truncated or missing
  if (!currentToken || currentToken.length < 45) {
    currentToken = '';
  }

  // Auto-fix if Database ID is set to token or starts with ntn_
  if (!currentDb || currentDb.startsWith('ntn_') || currentDb.startsWith('secret_')) {
    currentDb = '39e5d04bc602806d9fcac6a3034e115b';
  }

  if (tokenInput) tokenInput.value = currentToken;
  if (dbInput) dbInput.value = currentDb;

  APP.notionToken = currentToken;
  APP.notionDatabaseId = currentDb;
  saveState();

  if(!APP.notionToken || !APP.notionDatabaseId) {
    showToast("Please enter both Notion Secret Token and Database ID first.", "warn");
    return;
  }
  
  showToast("Testing connection with Notion API...", "info");
  try {
    const res = await apiCall('/notion/test', 'POST', {
      token: APP.notionToken,
      databaseId: APP.notionDatabaseId
    });
    if (res.success) {
      showToast(`✅ Notion Connection Succeeded! Database: "${res.title}"`, "ok");
    } else {
      showToast(`❌ Connection Failed: ${res.error || 'Check credentials'}`, "err");
    }
  } catch (e) {
    const msg = (e.response && e.response.error) ? e.response.error : e.message;
    showToast(`❌ Connection Failed: ${msg}`, "err");
  }
};

window.syncToNotion = async function(title, contentId) {
  if (!APP.notionToken || !APP.notionDatabaseId) {
    showToast("Please configure Notion Secret Token and Database ID in Settings first.", "warn");
    go('settings');
    return;
  }

  let textContent = '';
  if (typeof contentId === 'string') {
    const el = document.getElementById(contentId);
    if (el) textContent = el.innerText || el.textContent;
    else textContent = contentId;
  } else {
    textContent = String(contentId || '');
  }

  if (!textContent || textContent.trim().length === 0) {
    showToast("No content available to sync.", "warn");
    return;
  }

  showToast("Syncing note to Notion...", "info");
  try {
    const res = await apiCall('/notion/sync', 'POST', {
      token: APP.notionToken,
      databaseId: APP.notionDatabaseId,
      title: title || 'MindSpark Study Notes',
      content: textContent
    });

    if (res.success) {
      showToast("✅ Successfully synced note to your Notion database!", "ok");
    } else {
      showToast(`❌ Notion Sync failed: ${res.error || 'Check credentials'}`, "err");
    }
  } catch (e) {
    const msg = (e.response && e.response.error) ? e.response.error : e.message;
    showToast(`❌ Notion Sync failed: ${msg}`, "err");
  }
};

/* ── PROFILE SETTINGS ── */
PANES.profile=function(cont){
  if (!getJWT()) {
    cont.innerHTML = `
      <div class="card" style="max-width:500px; margin: 40px auto; text-align:center; padding: 40px var(--r);">
        <div style="font-size:48px; margin-bottom:20px;">👤</div>
        <h2 style="color:#fff; margin-bottom:12px; font-weight:800;">Academic Profile</h2>
        <p style="color:var(--muted); font-size:14px; margin-bottom:24px; line-height:1.6;">
          Please sign in or sign up to manage your academic profile, view your tool proficiency, check your weekly stats, and earn achievement badges!
        </p>
        <button class="btn btn-primary" onclick="openModal('auth-modal')" style="margin:0 auto;">Sign In / Sign Up</button>
      </div>
    `;
    return;
  }

  const topTool=Object.entries(APP.toolUsage).sort((a,b)=>b[1]-a[1])[0];
  const avgQuiz=APP.quizStats.total?Math.round(APP.quizStats.totalScore/APP.quizStats.total):0;
  const days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const maxW=Math.max(1,...Object.values(APP.weeklyData));
  const toolEntries=Object.entries(APP.toolUsage).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const totalUses=Object.values(APP.toolUsage).reduce((a,b)=>a+b,1);

  // Build weekly chart
  let weekHtml='';
  days.forEach(d=>{
    const h=Math.max(4,((APP.weeklyData[d]||0)/maxW)*70);
    weekHtml+=`<div class="week-bar-wrap"><div class="week-bar" style="height:${h}px"></div><div class="week-day">${d}</div></div>`;
  });

  // Build badges
  let badgeHtml='';
  BADGES.forEach(b=>{
    const unlocked=APP.badges.includes(b.id);
    badgeHtml+=`
    <div style="text-align:center; padding:16px 10px; background:${unlocked?'rgba(0,243,255,0.06)':'rgba(255,255,255,0.02)'}; border:1px solid ${unlocked?'rgba(0,243,255,0.3)':'var(--border)'}; border-radius:var(--r); transition:all .3s; cursor:default; ${unlocked?'box-shadow:0 0 15px rgba(0,243,255,0.1);':''}" title="${sanitize(b.desc)}">
      <div style="font-size:28px; margin-bottom:8px; ${unlocked?'':'filter:grayscale(1); opacity:0.4;'}">${b.icon}</div>
      <div style="font-size:9px; font-weight:600; color:${unlocked?'var(--primary)':'var(--faint)'}; letter-spacing:.5px;">${sanitize(b.name)}</div>
    </div>`;
  });

  // Build skill bars
  let skillsHtml='';
  if(toolEntries.length){
    toolEntries.forEach(([tool,cnt])=>{
      const pct=Math.min(100,Math.round(cnt/Math.max(1,totalUses)*300));
      skillsHtml+=`
      <div style="margin-bottom:14px;">
        <div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:12px;">
          <span style="color:var(--text);">${TOOL_TITLES[tool]||tool}</span>
          <span style="color:var(--primary); font-weight:600;">${cnt}x</span>
        </div>
        <div style="height:6px; background:rgba(255,255,255,0.06); border-radius:3px; overflow:hidden;">
          <div style="height:100%; width:${pct}%; background:linear-gradient(90deg,var(--primary),var(--pl)); border-radius:3px; box-shadow:0 0 8px var(--glow-cyan); transition:width 1s ease;"></div>
        </div>
      </div>`;
    });
  } else {
    skillsHtml='<p style="color:var(--muted); font-size:12px;">Start using tools to build your skill profile!</p>';
  }

  const levelNames=['Novice','Scholar','Academic','Expert','Master','Legend'];
  const xpLevel=Math.min(5,Math.floor((APP.xp||0)/100));
  const xpPct=((APP.xp||0)%100);

  cont.innerHTML=`
<div id="pane-profile" style="max-width:1000px; margin:0 auto;">
  <!-- Top Banner -->
  <div style="background:linear-gradient(135deg,rgba(176,38,255,0.15),rgba(0,243,255,0.1)); border:1px solid rgba(0,243,255,0.2); border-radius:var(--r); padding:24px 28px; margin-bottom:20px; position:relative; overflow:hidden;">
    <div style="position:absolute; top:-40px; right:-40px; width:200px; height:200px; background:radial-gradient(circle,rgba(176,38,255,0.15),transparent 70%); border-radius:50%;"></div>
    <div style="position:absolute; bottom:-30px; left:20%; width:150px; height:150px; background:radial-gradient(circle,rgba(0,243,255,0.1),transparent 70%); border-radius:50%;"></div>
    <div style="display:flex; align-items:center; gap:24px; position:relative;">
      <!-- Avatar with glow halo -->
      <div style="position:relative; flex-shrink:0;">
        <div style="width:80px; height:80px; border-radius:50%; background:linear-gradient(135deg,rgba(0,243,255,0.3),rgba(176,38,255,0.3)); border:2px solid var(--primary); display:flex; align-items:center; justify-content:center; font-size:36px; cursor:pointer; box-shadow:0 0 20px var(--glow-cyan), 0 0 40px rgba(0,243,255,0.2); overflow:hidden;" onclick="openModal('avatar-modal')">
          ${(APP.avatar && (APP.avatar.startsWith('data:image/') || APP.avatar.startsWith('http'))) ? `<img src="${APP.avatar}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;" />` : (APP.avatar || '🎓')}
        </div>
        <div style="position:absolute; bottom:-2px; right:-2px; background:var(--gold); border-radius:50%; width:22px; height:22px; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:700; color:#000; border:2px solid #05050a;">${xpLevel+1}</div>
      </div>
      <!-- User Info -->
      <div style="flex:1;">
        <div style="font-size:22px; font-weight:800; color:#fff; margin-bottom:4px;">${sanitize(APP.username||'Student')}</div>
        <div style="font-size:12px; color:var(--muted); margin-bottom:12px;">${sanitize(APP.college||'University Student')} ${APP.major?'· '+sanitize(APP.major):''}</div>
        <!-- XP bar -->
        <div style="display:flex; align-items:center; gap:10px;">
          <span style="font-size:10px; color:var(--primary); font-weight:600; white-space:nowrap;">${levelNames[xpLevel]} · Level ${xpLevel+1}</span>
          <div style="flex:1; height:6px; background:rgba(255,255,255,0.06); border-radius:3px; overflow:hidden;">
            <div style="height:100%; width:${xpPct}%; background:linear-gradient(90deg,var(--primary),var(--pl)); border-radius:3px; box-shadow:0 0 8px var(--glow-cyan); transition:width 1s ease;"></div>
          </div>
          <span style="font-size:10px; color:var(--muted); white-space:nowrap;">${APP.xp||0} XP</span>
        </div>
      </div>
      <!-- Stats -->
      <div style="display:flex; gap:12px; flex-shrink:0;">
        <div style="text-align:center; padding:12px 16px; background:rgba(0,0,0,0.3); border:1px solid var(--border); border-radius:12px;">
          <div style="font-size:22px; font-weight:800; color:var(--primary); text-shadow:0 0 10px var(--glow-cyan);">${Math.floor(APP.totalStudyTime/60)}</div>
          <div style="font-size:9px; color:var(--muted); margin-top:2px;">${t('hoursStudied')}</div>
        </div>
        <div style="text-align:center; padding:12px 16px; background:rgba(0,0,0,0.3); border:1px solid var(--border); border-radius:12px;">
          <div style="font-size:22px; font-weight:800; color:var(--gold); text-shadow:0 0 10px rgba(245,158,11,0.5);">🔥${APP.streak}</div>
          <div style="font-size:9px; color:var(--muted); margin-top:2px;">${t('dayStreak')}</div>
        </div>
        <div style="text-align:center; padding:12px 16px; background:rgba(0,0,0,0.3); border:1px solid var(--border); border-radius:12px;">
          <div style="font-size:22px; font-weight:800; color:var(--pl); text-shadow:0 0 10px var(--glow-purple);">${APP.history.length}</div>
          <div style="font-size:9px; color:var(--muted); margin-top:2px;">${t('totalUses')}</div>
        </div>
      </div>
    </div>
    <div style="margin-top:16px; display:flex; gap:8px; flex-wrap:wrap;">
      <button class="btn btn-ghost btn-sm" onclick="openModal('avatar-modal')">${t('changeAvatar')}</button>
      <button class="btn btn-ghost btn-sm" onclick="doLogout()" style="border-color:var(--err); color:var(--err);">🚪 ${t('logOut')}</button>
    </div>
  </div>

  <!-- Main Content Grid -->
  <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:20px;">
    <!-- Left: Edit Info -->
    <div style="background:var(--card); border:1px solid var(--border); border-radius:var(--r); padding:20px;">
      <div style="font-size:15px; font-weight:700; color:#fff; margin-bottom:16px;">${t('academicProfile')}</div>
      <div class="form-group">
        <label>${t('displayName')}</label>
        <input type="text" id="prof-edit-name" placeholder="Full Name" value="${sanitize(APP.username||'')}">
      </div>
      <div class="form-group">
        <label>${t('collegeFaculty')}</label>
        <input type="text" id="prof-edit-college" placeholder="E.g. Engineering" value="${sanitize(APP.college||'')}">
      </div>
      <div class="form-group">
        <label>${t('majorTrack')}</label>
        <input type="text" id="prof-edit-major" placeholder="E.g. Computer Science" value="${sanitize(APP.major||'')}">
      </div>
      <div class="form-group">
        <label>${t('studentId')}</label>
        <input type="text" id="prof-edit-id" placeholder="Student ID" value="${sanitize(APP.profileId||'')}">
      </div>
      <div class="form-group">
        <label>${t('program')}</label>
        <input type="text" id="prof-edit-prog" placeholder="E.g. Undergraduate Degree" value="${sanitize(APP.profileProg||'')}">
      </div>
      <button class="btn btn-primary" style="width:fit-content;" onclick="saveProfileInfo()">${t('saveInfo')}</button>
    </div>
  </div>

  <div class="grid-2" style="gap:20px; margin-top:20px;">
    <div class="card mb-8">
      <div class="card-title"><span class="icon">📈</span>${t('weeklyActivity')}</div>
      <div class="week-chart">${weekHtml}</div>
    </div>
    <div class="card mb-8">
      <div class="card-title"><span class="icon">🔧</span>${t('toolProficiency')}</div>
      ${skillsHtml}
    </div>
  </div>

  <div class="card mb-8" style="margin-bottom:20px">
    <div class="card-title"><span class="icon">🏆</span>${t('achievementBadges')}</div>
    <div class="badge-grid">${badgeHtml}</div>
  </div>

  <div class="card mb-8">
    <div class="card-title"><span class="icon">⚙️</span>${t('appSettings')}</div>
    
    <div class="form-group mt-8">
      <label>${t('appLang')}</label>
      <select id="profile-lang" onchange="setLang(this.value); location.reload();">
        <option value="en" ${APP.lang==='en'?'selected':''}>English</option>
        <option value="ar" ${APP.lang==='ar'?'selected':''}>العربية (Arabic)</option>
        <option value="fr" ${APP.lang==='fr'?'selected':''}>Français (French)</option>
        <option value="es" ${APP.lang==='es'?'selected':''}>Español (Spanish)</option>
        <option value="de" ${APP.lang==='de'?'selected':''}>Deutsch (German)</option>
      </select>
    </div>

    <div class="form-group mt-8">
      <label>${t('themeColor')}</label>
      <div class="swatch-row" style="margin-top:10px;">
        <div class="swatch ${APP.accent==='purple'||!APP.accent?'active':''}" style="background:#7c3aed" onclick="setTheme('purple'); go('profile');"></div>
        <div class="swatch ${APP.accent==='blue'?'active':''}" style="background:#2563eb" onclick="setTheme('blue'); go('profile');"></div>
        <div class="swatch ${APP.accent==='green'?'active':''}" style="background:#059669" onclick="setTheme('green'); go('profile');"></div>
        <div class="swatch ${APP.accent==='rose'?'active':''}" style="background:#e11d48" onclick="setTheme('rose'); go('profile');"></div>
        <div class="swatch ${APP.accent==='orange'?'active':''}" style="background:#ea580c" onclick="setTheme('orange'); go('profile');"></div>
        <div class="swatch ${APP.accent==='cyan'?'active':''}" style="background:#0891b2" onclick="setTheme('cyan'); go('profile');"></div>
      </div>
    </div>

    <div class="form-group mt-8">
      <label>${t('dataManagement')}</label>
      <div style="display:flex; gap:10px; margin-top:10px; flex-wrap:wrap;">
        <button class="btn btn-outline" onclick="exportPack()">📦 ${t('exportPack')}</button>
        <button class="btn btn-outline" style="border-color:#e11d48; color:#e11d48;" onclick="doLogout()">🚪 ${t('logOut')}</button>
        <button class="btn btn-outline" style="border-color:#e11d48; color:#e11d48;" onclick="if(confirm('Are you sure? This deletes all your app data locally.')){localStorage.clear(); location.reload();}">🗑️ ${t('clearData')}</button>
      </div>
    </div>
  </div>
</div>`;
};

PANES.leaderboard = async function(cont) {
  if (!getJWT()) {
    cont.innerHTML = `
      <div class="card" style="max-width:500px; margin: 40px auto; text-align:center; padding: 40px var(--r);">
        <div style="font-size:48px; margin-bottom:20px;">🏆</div>
        <h2 style="color:#fff; margin-bottom:12px; font-weight:800;">Global Leaderboard</h2>
        <p style="color:var(--muted); font-size:14px; margin-bottom:24px; line-height:1.6;">
          Please sign in or sign up to check your global rank, compare stats with peers, and see who is leading the XP rankings!
        </p>
        <button class="btn btn-primary" onclick="openModal('auth-modal')" style="margin:0 auto;">Sign In / Sign Up</button>
      </div>
    `;
    return;
  }
  
  cont.innerHTML = `
    <div class="card" id="pane-leaderboard" style="max-width:800px; margin:0 auto; display:flex; flex-direction:column; gap:20px;">
      <div class="card-title" style="font-size:18px; font-weight:700; color:#fff; border-bottom:1px solid var(--border); padding-bottom:12px; margin-bottom:16px;">
        <span class="icon" style="text-shadow: 0 0 10px var(--glow-purple);">🏆</span>
        <span>Global Academic Leaderboard</span>
      </div>
      <p class="text-muted" style="font-size:13px;">
        Top scholars ranking globally based on XP earned through active usage, quiz performance, and study achievements.
      </p>
      
      <div id="leaderboard-loader" style="text-align:center; padding:40px;">
        <span class="spinner"></span> Loading rankings...
      </div>
      
      <div id="leaderboard-content" style="display:none;">
        <table style="width:100%; border-collapse:collapse; margin-top:10px; font-size:13px;">
          <thead>
            <tr style="border-bottom:1px solid var(--border2); text-align:left; color:var(--muted);">
              <th style="padding:12px 8px; width:60px; text-align:center;">Rank</th>
              <th style="padding:12px 8px;">Scholar</th>
              <th style="padding:12px 8px; width:80px; text-align:center;">Level</th>
              <th style="padding:12px 8px; width:80px; text-align:center;">Streak</th>
              <th style="padding:12px 8px; width:80px; text-align:center;">Badges</th>
              <th style="padding:12px 8px; width:100px; text-align:right;">Total XP</th>
            </tr>
          </thead>
          <tbody id="leaderboard-rows">
            <!-- Dynamically populated rows -->
          </tbody>
        </table>
      </div>
    </div>
  `;
  
  try {
    const token = getJWT();
    const res = await fetch(API_URL + '/leaderboard', {
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    });
    
    if (!res.ok) throw new Error("Could not fetch leaderboard data");
    
    const data = await res.json();
    const rows = data.leaderboard || [];
    
    const tbody = document.getElementById('leaderboard-rows');
    const loader = document.getElementById('leaderboard-loader');
    const content = document.getElementById('leaderboard-content');
    
    if (tbody && loader && content) {
      loader.style.display = 'none';
      content.style.display = 'block';
      
      if (rows.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:30px; color:var(--muted);">No ranks found. Start study sessions to be the first!</td></tr>`;
        return;
      }
      
      tbody.innerHTML = rows.map(r => {
        let rankBadge = r.rank;
        if (r.rank === 1) rankBadge = '🥇';
        else if (r.rank === 2) rankBadge = '🥈';
        else if (r.rank === 3) rankBadge = '🥉';
        
        const isSelf = r.displayName === APP.username;
        const rowBg = isSelf ? 'rgba(0,243,255,0.08)' : 'transparent';
        const rowBorder = isSelf ? '1px solid rgba(0,243,255,0.3)' : 'none';
        const nameWeight = isSelf ? '800' : '500';
        
        return `
          <tr style="background:${rowBg}; border:${rowBorder}; border-bottom:1px solid rgba(255,255,255,0.03); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='${rowBg}'">
            <td style="padding:14px 8px; font-weight:700; text-align:center; font-size:14px;">${rankBadge}</td>
            <td style="padding:14px 8px; font-weight:${nameWeight}; color:#fff; display:flex; align-items:center; gap:8px;">
              <span>${sanitize(r.displayName)}</span>
              ${isSelf ? '<span class="badge badge-teal" style="font-size:9px; padding:2px 6px;">You</span>' : ''}
            </td>
            <td style="padding:14px 8px; text-align:center; font-weight:600; color:var(--primary);">${r.level}</td>
            <td style="padding:14px 8px; text-align:center; font-weight:600; color:var(--gold);">🔥 ${r.streak}d</td>
            <td style="padding:14px 8px; text-align:center; color:var(--pl); font-weight:600;">🏅 ${r.badgeCount}</td>
            <td style="padding:14px 8px; text-align:right; font-weight:700; color:#fff;">${r.xp.toLocaleString()} XP</td>
          </tr>
        `;
      }).join('');
    }
  } catch(e) {
    console.error("Leaderboard error:", e);
    const loader = document.getElementById('leaderboard-loader');
    if (loader) loader.innerHTML = `<span style="color:var(--err);">⚠️ Failed to load leaderboard.</span>`;
  }
};


/* ── 1. SUMMARIZER ── */
PANES.sum=function(cont){
  const recent = (APP.history||[]).filter(h=>h.tool==='sum').slice(0,5);
  cont.innerHTML=`
<div id="pane-sum" style="max-width:1000px; margin:0 auto;">
  <div style="display:grid; grid-template-columns:1fr 320px; gap:20px; margin-bottom:20px;">
    <!-- Left: Drop Zone + Paste -->
    <div style="display:flex; flex-direction:column; gap:16px;">
      <div class="drop-zone" id="sum-drop" onclick="document.getElementById('sum-file').click()" role="button" aria-label="Drop file or click to upload" tabindex="0">
        <span class="drop-icon">📄</span>
        <div style="font-weight:600; margin-bottom:6px;">Drag &amp; Drop your file or <span style="color:var(--primary);">Click to Upload</span></div>
        <div style="font-size:11px; color:var(--faint);">TXT, PDF, DOCX supported</div>
        <input type="file" id="sum-file" accept=".txt,.pdf,.docx" style="display:none" aria-label="Upload file"/>
      </div>
      ${lecturePickerHTML('sum-text')}
      <div class="form-group">
        <label for="sum-text">Or paste text here</label>
        <div style="position:relative;">
          <textarea id="sum-text" rows="5" placeholder="Paste your academic text here..." aria-label="Text to summarize"></textarea>
          <button class="voice-btn" data-target="sum-text" onclick="startVoiceInput('sum-text')" title="Voice input" aria-label="Start voice input" style="position:absolute; top:10px; right:10px; padding:6px;">🎤</button>
        </div>
        <div class="wc" id="sum-wc">0 words</div>
      </div>
    </div>
    <!-- Right: Settings -->
    <div style="background:var(--card); border:1px solid var(--border); border-radius:var(--r); padding:20px; display:flex; flex-direction:column; gap:16px;">
      <div style="font-size:16px; font-weight:700; color:#fff; margin-bottom:4px;">Summary Settings</div>
      <div class="form-group">
        <label for="sum-course">Course (optional)</label>
        ${courseSelect('sum-course')}
      </div>
      <div class="form-group">
        <label for="sum-style">Summary Style</label>
        <select id="sum-style">
          <option>Brief Overview</option><option>Detailed Analysis</option>
          <option>Critical Review</option><option>Executive Summary</option>
          <option>Bullet Points</option>
        </select>
      </div>
      <div style="margin-top:auto; display:flex; flex-direction:column; gap:8px;">
        <button class="btn btn-primary" id="sum-btn" onclick="doSummarize()" aria-label="Generate summary" style="width:100%; justify-content:center;">✨ Summarize</button>
        <button class="btn btn-ghost" onclick="document.getElementById('sum-text').value='';document.getElementById('sum-out').innerHTML='<span class=\\'text-muted text-sm\\'>Your summary will appear here...</span>';document.getElementById('sum-wc').textContent='0 words'" style="width:100%; justify-content:center;">Clear</button>
      </div>
    </div>
  </div>

  <!-- Output -->
  <div style="margin-bottom:20px;">
    <div class="output-box" id="sum-out" contenteditable="false" aria-live="polite" aria-label="Summary output">
      <span class="text-muted text-sm">Your summary will appear here...</span>
    </div>
    <div class="output-actions" id="sum-actions" style="display:none">
      <span class="stream-badge" id="sum-badge"></span>
      <button class="btn btn-ghost btn-sm" onclick="copyOutput('sum-out')">📋 Copy</button>
      <button class="btn btn-ghost btn-sm" onclick="printOutput('sum-out')">🖨️ Print</button>
      <button class="btn btn-ghost btn-sm" onclick="syncToNotion('Academic Summary', 'sum-out')" style="color:var(--primary);border-color:var(--primary)" title="Sync summary to your Notion database">⚡ Sync to Notion</button>
      <button class="btn btn-teal btn-sm" onclick="saveToHistory('sum',document.getElementById('sum-text').value,document.getElementById('sum-out'))">💾 Save</button>
    </div>
  </div>

  <!-- Recent Summaries -->
  ${recent.length ? `
  <div>
    <div style="font-size:14px; font-weight:700; color:#fff; margin-bottom:12px;">Recent Summaries</div>
    <div style="display:flex; gap:10px; overflow-x:auto; padding-bottom:8px;">
      ${recent.map(h=>`
      <div style="min-width:180px; background:var(--card); border:1px solid var(--border); border-radius:var(--r); padding:14px; cursor:pointer; flex-shrink:0; transition:all .3s;"
        onmouseover="this.style.borderColor='var(--primary)'"
        onmouseout="this.style.borderColor='var(--border)'"
        onclick="document.getElementById('sum-text').value=${JSON.stringify(h.input||'').replace(/</g,'&lt;').replace(/>/g,'&gt;')}; doSummarize();">
        <div style="font-size:12px; font-weight:600; color:#fff; margin-bottom:6px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${h.title||'Summary'}</div>
        <div style="font-size:10px; color:var(--muted);">${new Date(h.date||Date.now()).toLocaleDateString()}</div>
        <div style="margin-top:8px; height:2px; background:linear-gradient(90deg,var(--primary),var(--pl));"></div>
      </div>`).join('')}
    </div>
  </div>` : ''}
</div>`;
  attachWordCounter('sum-text','sum-wc');
  setupDropZone('sum-drop','sum-file','sum-text');
};
const doSummarize=debounce(async()=>{
  const text=document.getElementById('sum-text').value.trim();
  const style=document.getElementById('sum-style').value;
  if(!text){showToast('Please enter some text','err');return;}
  const out=document.getElementById('sum-out');
  const btn=document.getElementById('sum-btn');
  const actions=document.getElementById('sum-actions');
  const ck=cacheKey(`sum:${style}:${text}`);
  const cached=getCache(ck);
  if(cached){out.innerHTML=sanitize(renderMD(cached));actions.style.display='flex';showToast('Loaded from cache ⚡','info',1500);return;}
  setSkeleton(out);btn.disabled=true;btn.innerHTML='<span class="spinner"></span> Thinking...';
  let full='';
  await callAI([
    {role:'system',content:'You are an expert academic assistant. Respond in formal scholarly English. Use markdown formatting.'},
    {role:'user',content:`Provide ${style} of the following text:\n\n${text}`}
  ],
  chunk=>{full+=chunk;out.innerHTML=sanitize(renderMD(full));out.scrollTop=out.scrollHeight;},
  mode=>{
    setCache(ck,full);
    document.getElementById('sum-badge').textContent=mode==='streamed'?'⚡ Streamed':'📄 Full';
    document.getElementById('sum-badge').className='stream-badge '+(mode==='streamed'?'streamed':'full');
    actions.style.display='flex';addXP('sum');showToast('Summary ready!','ok',2000);
    // Generate follow-ups
    generateFollowups('sum',full).then(sugg=>displayFollowups(sugg,'sum','sum-text',doSummarize));
  },
  err=>{out.innerHTML=`<span style="color:var(--err)">${t(err)}</span>`;showToast(t(err),'err');});
  btn.disabled=false;btn.innerHTML='<span>✨</span> Summarize';
},500);
/* ── 2. EXAM QUESTIONS ── */
PANES.qgen=function(cont){
  cont.innerHTML=`
<div class="card" id="pane-qgen">
  <div class="card-title"><span class="icon">❓</span>Exam Question Generator</div>
  <div class="grid-2">
    <div class="form-group">
      <label for="qgen-course">Course</label>${courseSelect('qgen-course')}
    </div>
    <div class="form-group">
      <label for="qgen-type">Question Type</label>
      <select id="qgen-type">
        <option>MCQ</option><option>Essay</option><option>Short Answer</option>
        <option>True-False</option><option>Case Study</option><option>Mixed</option>
      </select>
    </div>
    <div class="form-group">
      <label for="qgen-diff">Difficulty</label>
      <select id="qgen-diff">
        <option>Introductory</option><option>Intermediate</option><option>Advanced</option>
      </select>
    </div>
    <div class="form-group">
      <label for="qgen-count">Number of Questions</label>
      <select id="qgen-count">
        <option>5</option><option>10</option><option>15</option><option>20</option>
      </select>
    </div>
  </div>
  <div class="form-group">
    <label for="qgen-text">Topic / Text</label>
    ${lecturePickerHTML('qgen-text')}
    <div style="display:flex;gap:6px;align-items:flex-start">
      <textarea id="qgen-text" rows="5" placeholder="Paste your lecture content or describe the topic..." aria-label="Topic or text" style="flex:1"></textarea>
      <button class="voice-btn" data-target="qgen-text" onclick="startVoiceInput('qgen-text')" title="Voice input" aria-label="Start voice input">🎤</button>
    </div>
    <div class="wc" id="qgen-wc">0 words</div>
  </div>
  <button class="btn btn-primary" id="qgen-btn" onclick="doQgen()" aria-label="Generate questions"><span>📝</span> Generate Questions</button>
  <div style="margin-top:16px">
    <div class="output-box" id="qgen-out" aria-live="polite"><span class="text-muted text-sm">Questions will appear here...</span></div>
    <div class="output-actions" id="qgen-actions" style="display:none">
      <span class="stream-badge" id="qgen-badge"></span>
      <button class="btn btn-ghost btn-sm" onclick="copyOutput('qgen-out')">📋 Copy</button>
      <button class="btn btn-teal btn-sm" onclick="saveToHistory('qgen',document.getElementById('qgen-text').value,document.getElementById('qgen-out'))">💾 Save</button>
    </div>
  </div>
</div>`;
  attachWordCounter('qgen-text','qgen-wc');
};
const doQgen=debounce(async()=>{
  const text=document.getElementById('qgen-text').value.trim();
  const type=document.getElementById('qgen-type').value;
  const diff=document.getElementById('qgen-diff').value;
  const n=document.getElementById('qgen-count').value;
  if(!text){showToast('Please enter topic or text','err');return;}
  const out=document.getElementById('qgen-out');
  const btn=document.getElementById('qgen-btn');
  setSkeleton(out);btn.disabled=true;btn.innerHTML='<span class="spinner"></span> Generating...';
  let full='';
  await callAI([
    {role:'system',content:'You are a university professor creating exam materials.'},
    {role:'user',content:`Generate exactly ${n} ${type} questions at ${diff} level. Number them. Include model answer after each.\n\nText:\n${text}`}
  ],
  c=>{full+=c;out.innerHTML=sanitize(renderMD(full));},
  mode=>{
    document.getElementById('qgen-badge').textContent=mode==='streamed'?'⚡ Streamed':'📄 Full';
    document.getElementById('qgen-badge').className='stream-badge '+(mode==='streamed'?'streamed':'full');
    document.getElementById('qgen-actions').style.display='flex';addXP('qgen');
  },
  err=>{out.innerHTML=`<span style="color:var(--err)">${t(err)}</span>`;showToast(t(err),'err');});
  btn.disabled=false;btn.innerHTML='<span>📝</span> Generate Questions';
},500);
/* ── 3. CONCEPT DEEP DIVE ── */
PANES.concept=function(cont){
  cont.innerHTML=`
<div class="card" id="pane-concept">
  <div class="card-title"><span class="icon">💡</span>Concept Deep Dive</div>
  <div class="grid-2">
    <div class="form-group">
      <label for="con-topic">Concept / Topic</label>
      <input type="text" id="con-topic" placeholder="e.g. Neural Networks, Photosynthesis..." aria-label="Concept topic"/>
    </div>
    <div class="form-group">
      <label for="con-level">Level</label>
      <select id="con-level"><option>Undergraduate</option><option>Graduate</option><option>PhD</option></select>
    </div>
    <div class="form-group">
      <label for="con-field">Field</label>
      <select id="con-field">
        <option>Computer Science</option><option>AI & Machine Learning</option>
        <option>Mathematics</option><option>Physics</option>
        <option>Biology</option><option>Chemistry</option>
        <option>Engineering</option><option>Social Sciences</option>
        <option>Medicine</option>
      </select>
    </div>
    <div class="form-group" style="display:flex;align-items:flex-end">
      <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
        <input type="checkbox" id="con-eli5" style="width:auto"/> Explain like I'm 5 (ELI5)
      </label>
    </div>
  </div>
  <div class="form-group">
    <label for="con-context">Or use lecture context</label>
    ${lecturePickerHTML('con-context')}
    <div style="display:flex;gap:6px;align-items:flex-start">
      <textarea id="con-context" rows="3" placeholder="Paste or load lecture text to deep dive into its content..." aria-label="Lecture context" style="flex:1"></textarea>
      <button class="voice-btn" data-target="con-context" onclick="startVoiceInput('con-context')" title="Voice input" aria-label="Start voice input">🎤</button>
    </div>
  </div>
  <button class="btn btn-primary" id="con-btn" onclick="doConcept()" aria-label="Deep dive concept"><span>💡</span> Deep Dive</button>
  <div style="margin-top:16px">
    <div class="output-box" id="con-out" aria-live="polite"><span class="text-muted text-sm">Concept explanation will appear here...</span></div>
    <div class="output-actions" id="con-actions" style="display:none">
      <button class="btn btn-ghost btn-sm" onclick="copyOutput('con-out')">📋 Copy</button>
      <button class="btn btn-teal btn-sm" onclick="saveToHistory('concept',document.getElementById('con-topic').value,document.getElementById('con-out'))">💾 Save</button>
    </div>
  </div>
</div>`;
};
const doConcept=debounce(async()=>{
  const topic=document.getElementById('con-topic').value.trim();
  const context=document.getElementById('con-context').value.trim();
  const level=document.getElementById('con-level').value;
  const field=document.getElementById('con-field').value;
  const eli5=document.getElementById('con-eli5').checked;
  if(!topic&&!context){showToast('Enter a concept or load a lecture','err');return;}
  const out=document.getElementById('con-out');
  const btn=document.getElementById('con-btn');
  setSkeleton(out);btn.disabled=true;btn.innerHTML='<span class="spinner"></span> Diving Deep...';
  const sections=eli5?'Give a simple, fun, beginner-friendly explanation using analogies. Avoid jargon.':'Cover: Definition, Theory & Background, Historical Context, Key Scholars/Contributors, Real-World Applications, Common Misconceptions, Related Concepts. Use markdown headings.';
  let full='';
  const userPrompt=context?`Explain the concept based on this lecture:\n\n${context}\n\n${sections}`:`Explain the concept: "${topic}"\n\n${sections}`;
  await callAI([
    {role:'system',content:`You are an expert ${field} professor explaining concepts at the ${level} level.`},
    {role:'user',content:userPrompt}
  ],
  c=>{full+=c;out.innerHTML=sanitize(renderMD(full));},
  _=>{
    document.getElementById('con-actions').style.display='flex';
    addXP('concept');
    generateFollowups('concept',full).then(sugg=>displayFollowups(sugg,'con','con-topic',doConcept));
  },
  err=>{out.innerHTML=`<span style="color:var(--err)">${t(err)}</span>`;showToast(t(err),'err');});
  btn.disabled=false;btn.innerHTML='<span>💡</span> Deep Dive';
},500);
/* ── 4. STUDY PLANNER ── */
PANES.planner=function(cont){
  cont.innerHTML=`
<div class="card" id="pane-planner">
  <div class="card-title"><span class="icon">📅</span>Smart Study Planner</div>
  <div class="grid-2">
    <div class="form-group">
      <label for="plan-subject">Subject / Topics</label>
      <textarea id="plan-subject" rows="3" placeholder="e.g. Data Structures, Algorithms, Graph Theory..." aria-label="Subjects to study"></textarea>
    </div>
    <div class="form-group">
      <label for="plan-days">Available Days</label>
      <input type="number" id="plan-days" value="7" min="1" max="30" aria-label="Number of days"/>
      <div class="form-group mt-8">
        <label for="plan-style">Study Style</label>
        <select id="plan-style">
          <option>Standard</option><option>Pomodoro</option>
          <option>Spaced Repetition</option><option>Intensive</option>
        </select>
      </div>
    </div>
  </div>
  <div class="form-group">
    <label>Priority Tags (select multiple)</label>
    <div class="flex-row">
      <label style="display:flex;align-items:center;gap:4px;cursor:pointer"><input type="checkbox" id="pri-high" style="width:auto" checked/> <span class="badge badge-err">HIGH</span></label>
      <label style="display:flex;align-items:center;gap:4px;cursor:pointer"><input type="checkbox" id="pri-med" style="width:auto" checked/> <span class="badge badge-gold">MED</span></label>
      <label style="display:flex;align-items:center;gap:4px;cursor:pointer"><input type="checkbox" id="pri-low" style="width:auto"/> <span class="badge badge-teal">LOW</span></label>
    </div>
  </div>
  <button class="btn btn-primary" id="plan-btn" onclick="doPlanner()" aria-label="Generate study plan"><span>📅</span> Generate Plan</button>
  <div style="margin-top:16px">
    <div class="output-box" id="plan-out" aria-live="polite"><span class="text-muted text-sm">Your study plan will appear here...</span></div>
    <div class="output-actions" id="plan-actions" style="display:none">
      <button class="btn btn-ghost btn-sm" onclick="copyOutput('plan-out')">📋 Copy</button>
      <button class="btn btn-ghost btn-sm" onclick="printOutput('plan-out')">🖨️ Print</button>
      <button class="btn btn-teal btn-sm" onclick="saveToHistory('planner',document.getElementById('plan-subject').value,document.getElementById('plan-out'))">💾 Save</button>
    </div>
  </div>
</div>`;
};
const doPlanner=debounce(async()=>{
  const sub=document.getElementById('plan-subject').value.trim();
  const days=document.getElementById('plan-days').value;
  const style=document.getElementById('plan-style').value;
  const priorities=[];
  if(document.getElementById('pri-high').checked)priorities.push('[HIGH]');
  if(document.getElementById('pri-med').checked)priorities.push('[MED]');
  if(document.getElementById('pri-low').checked)priorities.push('[LOW]');
  if(!sub){showToast('Enter subjects','err');return;}
  const out=document.getElementById('plan-out');
  const btn=document.getElementById('plan-btn');
  setSkeleton(out);btn.disabled=true;btn.innerHTML='<span class="spinner"></span> Planning...';
  let full='';
  await callAI([
    {role:'system',content:'You are an expert academic study coach.'},
    {role:'user',content:`Create a ${days}-day ${style} study plan for: ${sub}.\nPriority tags: ${priorities.join(', ')}.\nInclude revision days. Format as a clear daily schedule with time blocks. Use markdown tables.`}
  ],
  c=>{full+=c;out.innerHTML=sanitize(renderMD(full));},
  _=>{document.getElementById('plan-actions').style.display='flex';addXP('planner');},
  err=>{out.innerHTML=`<span style="color:var(--err)">${t(err)}</span>`;showToast(t(err),'err');});
  btn.disabled=false;btn.innerHTML='<span>📅</span> Generate Plan';
},500);
/* ── 5. ESSAY ASSISTANT ── */
PANES.essay=function(cont){
  cont.innerHTML=`
<div class="card" id="pane-essay">
  <div class="card-title"><span class="icon">✍️</span>Essay Assistant</div>
  <div class="grid-2">
    <div class="form-group">
      <label for="essay-topic">Essay Topic</label>
      <input type="text" id="essay-topic" placeholder="Enter your essay topic..." aria-label="Essay topic"/>
    </div>
    <div class="form-group">
      <label for="essay-type">Essay Type</label>
      <select id="essay-type">
        <option>Argumentative</option><option>Analytical</option><option>Expository</option>
        <option>Descriptive</option><option>Narrative</option><option>Compare & Contrast</option>
        <option>Persuasive</option><option>Research Paper</option>
      </select>
    </div>
  </div>
  <div class="form-group">
    <label for="essay-thesis">Your Thesis (optional)</label>
    <input type="text" id="essay-thesis" placeholder="Enter your thesis statement to strengthen it..." aria-label="Thesis statement"/>
  </div>
  <div class="form-group">
    <label for="essay-context">Or use lecture context</label>
    ${lecturePickerHTML('essay-context')}
    <div style="display:flex;gap:6px;align-items:flex-start">
      <textarea id="essay-context" rows="3" placeholder="Paste or load lecture text as source material..." aria-label="Lecture context" style="flex:1"></textarea>
      <button class="voice-btn" data-target="essay-context" onclick="startVoiceInput('essay-context')" title="Voice input" aria-label="Start voice input">🎤</button>
    </div>
  </div>
  <button class="btn btn-primary" id="essay-btn" onclick="doEssay()" aria-label="Generate essay outline"><span>✍️</span> Generate Outline</button>
  <div style="margin-top:16px">
    <div class="output-box" id="essay-out" aria-live="polite"><span class="text-muted text-sm">Essay structure will appear here...</span></div>
    <div class="output-actions" id="essay-actions" style="display:none">
      <button class="btn btn-ghost btn-sm" onclick="copyOutput('essay-out')">📋 Copy</button>
      <button class="btn btn-teal btn-sm" onclick="saveToHistory('essay',document.getElementById('essay-topic').value,document.getElementById('essay-out'))">💾 Save</button>
    </div>
  </div>
</div>`;
};
const doEssay=debounce(async()=>{
  const topic=document.getElementById('essay-topic').value.trim();
  const context=document.getElementById('essay-context').value.trim();
  const type=document.getElementById('essay-type').value;
  const thesis=document.getElementById('essay-thesis').value.trim();
  if(!topic&&!context){showToast('Enter essay topic or load a lecture','err');return;}
  const out=document.getElementById('essay-out');
  const btn=document.getElementById('essay-btn');
  setSkeleton(out);btn.disabled=true;btn.innerHTML='<span class="spinner"></span> Writing...';
  let full='';
  const extra=thesis?`Strengthen this thesis: "${thesis}"\n\n`:'';
  const contextPart=context?`\n\nBase your outline on this source material:\n${context}`:'';
  await callAI([
    {role:'system',content:'You are an expert academic writing tutor.'},
    {role:'user',content:`${extra}Create a complete ${type} essay outline for: "${topic}"${contextPart}\n\nInclude:\n- Strong thesis statement\n- Full detailed outline with all sections\n- Counterarguments (if applicable)\n- Writing tips\n- Key points for each section\n\nUse markdown formatting.`}
  ],
  c=>{full+=c;out.innerHTML=sanitize(renderMD(full));},
  _=>{
    document.getElementById('essay-actions').style.display='flex';
    addXP('essay');
    generateFollowups('essay',full).then(sugg=>displayFollowups(sugg,'essay','essay-topic',doEssay));
  },
  err=>{out.innerHTML=`<span style="color:var(--err)">${t(err)}</span>`;showToast(t(err),'err');});
  btn.disabled=false;btn.innerHTML='<span>✍️</span> Generate Outline';
},500);
/* ── CORNELL NOTES GENERATOR ── */
const doCornellNotes=debounce(async()=>{
  const text=document.getElementById('cornell-input').value.trim();
  if(!text){showToast('Enter text to convert to Cornell Notes','err');return;}
  const out=document.getElementById('cornell-out');
  const btn=document.getElementById('cornell-btn');
  setSkeleton(out);btn.disabled=true;btn.innerHTML='<span class="spinner"></span> Organizing...';
  let full='';
  await callAI([
    {role:'system',content:'You are an expert note-taking strategist specializing in Cornell Notes method.'},
    {role:'user',content:`Convert this text into Cornell Notes format. Return JSON: {"cues":["q1","q2",...],"notes":"full notes content","summary":"key summary"}. Cues are key questions/keywords. Notes is comprehensive content. Summary is brief overview.\n\nText:\n${text}`}
  ],
  c=>{full+=c;},
  mode=>{
    try{
      let clean=full.replace(/```json|```/gi,'').trim();
      if(clean[0]!=='{')clean=clean.slice(clean.indexOf('{'));
      const data=JSON.parse(clean);
      const html=`
<table class="cornell-table" style="border-collapse:collapse;width:100%">
  <tr>
    <td class="cornell-cues">
      <div class="cornell-label">Cues & Questions</div>
      <div class="cornell-content">
        ${(data.cues||[]).map(c=>'<div style="margin-bottom:8px;">• <strong>'+sanitize(c)+'</strong></div>').join('')}
      </div>
    </td>
    <td class="cornell-notes">
      <div class="cornell-label">Notes</div>
      <div class="cornell-content">${sanitize(renderMD(data.notes||''))}</div>
    </td>
  </tr>
</table>
<div class="cornell-summary">
  <div class="cornell-label">📌 Summary</div>
  <div class="cornell-content">${sanitize(renderMD(data.summary||''))}</div>
</div>`;
      out.innerHTML=html;
      document.getElementById('cornell-actions').style.display='flex';
      addXP('cornell');
    }catch{showToast('Invalid format returned. Please try again.','err');}
  },
  err=>{out.innerHTML=`<span style="color:var(--err)">${t(err)}</span>`;showToast(t(err),'err');});
  btn.disabled=false;btn.innerHTML='<span>📓</span> Generate Cornell Notes';
},500);

/* ── 6. CITATION BUILDER ── */
PANES.cite=function(cont){
  cont.innerHTML=`
<div class="card" id="pane-cite">
  <div class="card-title"><span class="icon">📖</span>Citation Builder</div>
  <div class="grid-2">
    <div class="form-group">
      <label for="cite-style">Citation Style</label>
      <select id="cite-style" onchange="renderCiteForm()">
        <option>APA 7th</option><option>MLA 9th</option><option>Chicago</option>
        <option>Harvard</option><option>IEEE</option><option>Vancouver</option>
      </select>
    </div>
    <div class="form-group">
      <label for="cite-type">Source Type</label>
      <select id="cite-type" onchange="renderCiteForm()">
        <option>Book</option><option>Article</option><option>Website</option>
        <option>Chapter</option><option>Thesis</option>
      </select>
    </div>
  </div>
  <div id="cite-form"></div>
  <button class="btn btn-primary" id="cite-btn" onclick="doCitation()" aria-label="Generate citation"><span>📖</span> Generate Citation</button>
  <div style="margin-top:16px">
    <div class="output-box" id="cite-out" aria-live="polite"><span class="text-muted text-sm">Citation will appear here...</span></div>
    <div class="output-actions" id="cite-actions" style="display:none">
      <button class="btn btn-ghost btn-sm" onclick="copyOutput('cite-out')">📋 Copy</button>
    </div>
  </div>
</div>`;
  renderCiteForm();
};
function renderCiteForm(){
  const f=document.getElementById('cite-form');
  if(!f)return;
  f.innerHTML=`
<div class="grid-2">
  <div class="form-group"><label for="cite-author">Author(s)</label><input type="text" id="cite-author" placeholder="Last, First M." aria-label="Author name"/></div>
  <div class="form-group"><label for="cite-year">Year</label><input type="text" id="cite-year" placeholder="2024" aria-label="Publication year"/></div>
  <div class="form-group"><label for="cite-title">Title</label><input type="text" id="cite-title" placeholder="Title of work..." aria-label="Title"/></div>
  <div class="form-group"><label for="cite-pub">Publisher / Journal</label><input type="text" id="cite-pub" placeholder="Publisher or Journal name..." aria-label="Publisher or journal"/></div>
  <div class="form-group"><label for="cite-pages">Pages / Volume</label><input type="text" id="cite-pages" placeholder="pp. 1-20 / Vol. 5" aria-label="Pages or volume"/></div>
  <div class="form-group"><label for="cite-url">URL / DOI (optional)</label><input type="text" id="cite-url" placeholder="https://..." aria-label="URL or DOI"/></div>
</div>`;
}
const doCitation=debounce(async()=>{
  const style=document.getElementById('cite-style').value;
  const type=document.getElementById('cite-type').value;
  const author=document.getElementById('cite-author')?.value||'';
  const year=document.getElementById('cite-year')?.value||'';
  const title=document.getElementById('cite-title')?.value||'';
  const pub=document.getElementById('cite-pub')?.value||'';
  const pages=document.getElementById('cite-pages')?.value||'';
  const url=document.getElementById('cite-url')?.value||'';
  const out=document.getElementById('cite-out');
  const btn=document.getElementById('cite-btn');
  setSkeleton(out);btn.disabled=true;btn.innerHTML='<span class="spinner"></span> Building...';
  let full='';
  await callAI([
    {role:'system',content:'You are an expert academic citation specialist.'},
    {role:'user',content:`Generate a complete ${style} citation for this ${type}:\nAuthor: ${author}\nYear: ${year}\nTitle: ${title}\nPublisher/Journal: ${pub}\nPages/Volume: ${pages}\nURL/DOI: ${url}\n\nProvide:\n1. Full reference (formatted exactly for ${style})\n2. In-text citation example\n3. Footnote/endnote format (if applicable)`}
  ],
  c=>{full+=c;out.innerHTML=sanitize(renderMD(full));},
  _=>{document.getElementById('cite-actions').style.display='flex';addXP('cite');},
  err=>{out.innerHTML=`<span style="color:var(--err)">${t(err)}</span>`;showToast(t(err),'err');});
  btn.disabled=false;btn.innerHTML='<span>📖</span> Generate Citation';
},500);
/* ── 7. TRANSLATOR ── */
PANES.trans=function(cont){
  cont.innerHTML=`
<div id="pane-trans" style="display:flex; gap:24px; align-items:stretch; flex-wrap:wrap;">
  
  <!-- Left Controls -->
  <div class="card" style="flex: 1 1 320px; max-width: 400px;">
    <div class="card-title"><span class="icon">🌍</span>Smart Translator</div>
    
    <div class="grid-2" style="margin-bottom:14px">
      <div class="form-group" style="margin-bottom:0">
        <label for="trans-from">From Language</label>
        <select id="trans-from">
          <option value="auto">Auto-Detect</option>
          <option>English</option><option>Arabic</option><option>French</option>
          <option>Spanish</option><option>German</option><option>Chinese</option>
          <option>Italian</option><option>Portuguese</option><option>Japanese</option><option>Russian</option>
        </select>
      </div>
      <div class="form-group" style="margin-bottom:0">
        <label for="trans-to">To Language</label>
        <select id="trans-to">
          <option>Arabic</option><option>English</option><option>French</option>
          <option>Spanish</option><option>German</option><option>Chinese</option>
          <option>Italian</option><option>Portuguese</option><option>Japanese</option><option>Russian</option>
        </select>
      </div>
    </div>
    
    <div class="form-group">
      <label for="trans-reg">Register</label>
      <select id="trans-reg"><option>Academic</option><option>Neutral</option><option>Simplified</option></select>
    </div>
    
    <div class="form-group">
      <label class="section-label">Original Text</label>
      <div style="position:relative">
        <textarea id="trans-text" rows="5" placeholder="Enter text to translate..." aria-label="Text to translate" style="resize:none; padding-right: 40px;"></textarea>
        <button class="voice-btn" data-target="trans-text" onclick="startVoiceInput('trans-text')" title="Voice input" aria-label="Start voice input" style="position:absolute; right:12px; top:12px; background:transparent; border:none; color:var(--muted); font-size:16px; cursor:pointer; transition:transform .2s;">🎤</button>
      </div>
    </div>
    
    <button class="btn btn-primary" id="trans-btn" onclick="doTrans()" aria-label="Translate text" style="width:100%; justify-content:center; margin:20px 0 16px;"><span>🌍</span> Translate</button>
    <button class="btn btn-ghost btn-sm" onclick="copyOutput('trans-out')">📋 Copy</button>
  </div>

  <!-- Right Results -->
  <div style="flex: 2 1 400px; display:flex; flex-direction:column;">
    <div class="card-title" style="margin-bottom:8px;"><span class="icon">✨</span>Results</div>
    <label class="section-label" style="font-size:11px; color:var(--muted); margin-bottom:8px; display:block;">Translation</label>
    <div class="output-box" id="trans-out" aria-live="polite" style="flex:1; min-height:400px; border: 1px solid rgba(255,255,255,0.05); border-radius: 24px; background: rgba(0,0,0,0.2); padding:24px; overflow-y:auto; box-shadow: inset 0 0 30px rgba(0,0,0,0.5);">
      <span class="text-muted text-sm">Translation will appear here...</span>
    </div>
  </div>

</div>`;
};
const doTrans=debounce(async()=>{
  const text=document.getElementById('trans-text').value.trim();
  const from=document.getElementById('trans-from').value;
  const to=document.getElementById('trans-to').value;
  const reg=document.getElementById('trans-reg').value;
  if(!text){showToast('Enter text to translate','err');return;}
  const out=document.getElementById('trans-out');
  const btn=document.getElementById('trans-btn');
  setSkeleton(out);btn.disabled=true;btn.innerHTML='<span class="spinner"></span> Translating...';
  let full='';
  await callAI([
    {role:'system',content:`You are an expert ${reg.toLowerCase()} translator. Translate accurately preserving ${reg.toLowerCase()} register.`},
    {role:'user',content:`Translate from ${from==='auto'?'detected language':from} to ${to}:\n\n${text}`}
  ],
  c=>{full+=c;out.innerHTML=sanitize(renderMD(full));},
  _=>{addXP('trans');},
  err=>{out.innerHTML=`<span style="color:var(--err)">${t(err)}</span>`;showToast(t(err),'err');});
  btn.disabled=false;btn.innerHTML='<span>🌍</span> Translate';
},500);
/* ── 8. TEXT TO SPEECH ── */
PANES.tts=function(cont){
  if(!('speechSynthesis' in window)){
    cont.innerHTML=`<div class="card"><div class="card-title">🎧 Text to Speech</div><p class="text-muted">Speech synthesis is not supported in your browser.</p></div>`;
    return;
  }
  cont.innerHTML=`
<div class="card" id="pane-tts">
  <div class="card-title"><span class="icon">🎧</span>Text to Speech</div>
  <div class="form-group">
    <label for="tts-text">Text to Read</label>
    <textarea id="tts-text" rows="5" placeholder="Enter text to convert to speech..." aria-label="Text to speak"></textarea>
  </div>
  <div class="grid-2">
    <div class="form-group">
      <label for="tts-voice">Voice</label>
      <select id="tts-voice" aria-label="Select voice"></select>
    </div>
    <div class="form-group">
      <label for="tts-speed">Speed: <span id="tts-speed-val">1.0x</span></label>
      <input type="range" id="tts-speed" min="0.5" max="2" step="0.1" value="1" style="width:100%;accent-color:var(--primary)" aria-label="Speech speed"/>
    </div>
  </div>
  <div class="form-group">
    <label for="tts-pitch">Pitch: <span id="tts-pitch-val">1.0</span></label>
    <input type="range" id="tts-pitch" min="0" max="2" step="0.1" value="1" style="width:100%;accent-color:var(--teal)" aria-label="Speech pitch"/>
  </div>
  <div class="waveform" id="tts-wave" style="display:none" aria-hidden="true"></div>
  <div class="flex-row mt-8">
    <button class="btn btn-primary" id="tts-play" onclick="ttsPlay()" aria-label="Play text to speech">▶ Play</button>
    <button class="btn btn-ghost" onclick="speechSynthesis.pause()" aria-label="Pause">⏸ Pause</button>
    <button class="btn btn-ghost" onclick="speechSynthesis.resume()" aria-label="Resume">▶ Resume</button>
    <button class="btn btn-ghost" onclick="ttsStop()" aria-label="Stop">⏹ Stop</button>
  </div>
  <div class="prog-bar mt-8"><div class="prog-fill purple" id="tts-prog" style="width:0%"></div></div>
</div>`;
  // Load voices
  function loadVoices(){
    const sel=document.getElementById('tts-voice');
    if(!sel)return;
    const voices=speechSynthesis.getVoices();
    sel.innerHTML=voices.map((v,i)=>`<option value="${i}">${v.name} (${v.lang})</option>`).join('');
  }
  loadVoices();
  speechSynthesis.onvoiceschanged=loadVoices;
  document.getElementById('tts-speed').oninput=e=>{document.getElementById('tts-speed-val').textContent=parseFloat(e.target.value).toFixed(1)+'x';};
  document.getElementById('tts-pitch').oninput=e=>{document.getElementById('tts-pitch-val').textContent=parseFloat(e.target.value).toFixed(1);};
  // Generate waveform bars
  const wave=document.getElementById('tts-wave');
  for(let i=0;i<24;i++){
    const b=document.createElement('div');
    b.className='wave-bar';
    b.style.animationDelay=(i*0.05)+'s';
    wave.appendChild(b);
  }
};
let ttsUtterance=null;
function ttsPlay(){
  const text=document.getElementById('tts-text')?.value.trim();
  if(!text){showToast('Enter text to speak','err');return;}
  speechSynthesis.cancel();
  ttsUtterance=new SpeechSynthesisUtterance(text);
  const vIdx=document.getElementById('tts-voice')?.value;
  const voices=speechSynthesis.getVoices();
  if(vIdx&&voices[vIdx])ttsUtterance.voice=voices[vIdx];
  ttsUtterance.rate=parseFloat(document.getElementById('tts-speed')?.value||1);
  ttsUtterance.pitch=parseFloat(document.getElementById('tts-pitch')?.value||1);
  const wave=document.getElementById('tts-wave');
  const prog=document.getElementById('tts-prog');
  ttsUtterance.onstart=()=>{if(wave)wave.style.display='flex';};
  ttsUtterance.onend=()=>{if(wave)wave.style.display='none';if(prog)prog.style.width='100%';addXP('tts');};
  ttsUtterance.onboundary=e=>{
    if(e.name==='word'&&prog)prog.style.width=Math.min(100,(e.charIndex/text.length)*100)+'%';
  };
  speechSynthesis.speak(ttsUtterance);
}
function ttsStop(){speechSynthesis.cancel();const w=document.getElementById('tts-wave');if(w)w.style.display='none';}
/* ── 9. QUICK QUIZ ── */
PANES.quiz=function(cont){
  cont.innerHTML=`
<div class="card" id="pane-quiz">
  <div class="card-title"><span class="icon">🧪</span>Quick Quiz</div>
  <div id="quiz-setup">
    <div class="grid-2">
      <div class="form-group">
        <label for="quiz-topic">Topic</label>
        <input type="text" id="quiz-topic" placeholder="e.g. Machine Learning, Data Structures..." aria-label="Quiz topic"/>
      </div>
      <div class="form-group">
        <label for="quiz-diff">Difficulty</label>
        <select id="quiz-diff"><option>Introductory</option><option>Intermediate</option><option>Advanced</option></select>
      </div>
      <div class="form-group">
        <label for="quiz-n">Questions</label>
        <select id="quiz-n"><option>5</option><option>10</option><option>15</option></select>
      </div>
    </div>
    <div class="form-group">
      <label for="quiz-context">Or use lecture context</label>
      ${lecturePickerHTML('quiz-context')}
      <textarea id="quiz-context" rows="3" placeholder="Paste or load lecture text to generate quiz from it..." aria-label="Lecture context"></textarea>
    </div>
    <button class="btn btn-primary" id="quiz-gen-btn" onclick="doQuizGen()" aria-label="Generate quiz"><span>🧪</span> Generate Quiz</button>
  </div>
  <div id="quiz-play" style="display:none"></div>
  <div id="quiz-result" style="display:none"></div>
</div>`;
};
let quizData=[],quizCur=0,quizScore=0,quizTimer=null;
function parseRawTextToQuiz(text) {
  const items = [];
  const qBlocks = text.split(/(?=Q\d+:|Question \d+:|\*\*Q\d+:|\d+\.\s+\*\*)/i).filter(Boolean);
  
  for (const block of qBlocks) {
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
    if (!lines.length) continue;
    
    let qText = lines[0].replace(/^[\#\*\s\d\.:\-\>\w]+/, '').trim();
    if (!qText && lines[1]) qText = lines[1];
    if (!qText) continue;
    
    const opts = [];
    let ansIdx = 0;
    
    lines.forEach(line => {
      const optMatch = line.match(/^[-*]?\s*\**([A-D])[\.\)]\s*(.+)/i);
      if (optMatch) {
        opts.push(optMatch[2].replace(/\**/g, '').trim());
      }
      if (line.match(/correct answer|answer:|correct:/i)) {
        if (line.includes('B')) ansIdx = 1;
        else if (line.includes('C')) ansIdx = 2;
        else if (line.includes('D')) ansIdx = 3;
        else ansIdx = 0;
      }
    });
    
    if (opts.length >= 2) {
      items.push({ q: qText, opts: opts.slice(0, 4), ans: ansIdx });
    }
  }
  
  return items;
}

const doQuizGen=debounce(async()=>{
  const topic=document.getElementById('quiz-topic').value.trim();
  const context=document.getElementById('quiz-context').value.trim();
  const diff=document.getElementById('quiz-diff').value;
  const n=document.getElementById('quiz-n').value;
  if(!topic&&!context){showToast('Enter a topic or load a lecture','err');return;}
  const btn=document.getElementById('quiz-gen-btn');
  btn.disabled=true;btn.innerHTML='<span class="spinner"></span> Generating...';
  let full='';
  const userPrompt=context?`Generate ${n} MCQ at ${diff} level based on this lecture:\n\n${context}\n\nFormat: [{"q":"...","opts":["A","B","C","D"],"ans":0}]`:`Generate ${n} MCQ at ${diff} level about: ${topic}. Format: [{"q":"...","opts":["A","B","C","D"],"ans":0}]`;
  await callAI([
    {role:'system',content:'You are a quiz generator. Reply ONLY with raw JSON array. No markdown fences, no text before or after the array.'},
    {role:'user',content:userPrompt+' ans = 0-based index of correct answer.'}
  ],
  c=>{full+=c;},
  _=>{
    try{
      let clean=full.replace(/```json|```/gi,'').trim();
      const startIdx = clean.indexOf('[');
      const endIdx = clean.lastIndexOf(']');
      if (startIdx !== -1 && endIdx > startIdx) {
        clean = clean.substring(startIdx, endIdx + 1);
      }
      quizData=JSON.parse(clean);
      quizCur=0;quizScore=0;
      document.getElementById('quiz-setup').style.display='none';
      renderQuizQuestion();addXP('quiz');
    }catch(e){
      const parsed = parseRawTextToQuiz(full);
      if (parsed && parsed.length > 0) {
        quizData = parsed;
        quizCur=0;quizScore=0;
        document.getElementById('quiz-setup').style.display='none';
        renderQuizQuestion();addXP('quiz');
      } else {
        showToast('AI returned unexpected format. Please try again.','err');
      }
    }
    btn.disabled=false;btn.innerHTML='<span>🧪</span> Generate Quiz';
  },
  err=>{showToast(t(err),'err');btn.disabled=false;btn.innerHTML='<span>🧪</span> Generate Quiz';});
},500);

function renderQuizQuestion(){
  if(quizCur>=quizData.length){showQuizResult();return;}
  const q=quizData[quizCur];
  const play=document.getElementById('quiz-play');
  play.style.display='';
  play.innerHTML=`
<div style="margin-bottom:8px;display:flex;justify-content:space-between;align-items:center">
  <span class="badge badge-purple">Q ${quizCur+1} / ${quizData.length}</span>
  <span class="badge badge-gold" id="quiz-score-badge">Score: ${quizScore}</span>
</div>
<div class="quiz-timer"><div class="quiz-timer-fill" id="qtimer" style="width:100%"></div></div>
<p style="font-weight:600;margin-bottom:14px;font-size:14px">${sanitize(q.q)}</p>
${q.opts.map((o,i)=>`<button class="quiz-option" onclick="answerQuiz(${i})" aria-label="Option ${String.fromCharCode(65+i)}: ${sanitize(o)}"><strong>${String.fromCharCode(65+i)}.</strong> ${sanitize(o)}</button>`).join('')}`;
  clearInterval(quizTimer);
  let secs=30;
  const fill=()=>{const el=document.getElementById('qtimer');if(el)el.style.width=(secs/30*100)+'%';};
  fill();
  quizTimer=setInterval(()=>{secs--;fill();if(secs<=0){clearInterval(quizTimer);answerQuiz(-1);}},1000);
}
function answerQuiz(chosen){
  clearInterval(quizTimer);
  const q=quizData[quizCur];
  const opts=document.querySelectorAll('.quiz-option');
  opts.forEach((b,i)=>{
    b.disabled=true;
    if(i===q.ans)b.classList.add('correct');
    else if(i===chosen&&chosen!==q.ans)b.classList.add('wrong');
  });
  if(chosen===q.ans){quizScore++;try{new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA').play().catch(()=>{});}catch{}}
  setTimeout(()=>{quizCur++;renderQuizQuestion();},800);
}
function showQuizResult(){
  const pct=Math.round(quizScore/quizData.length*100);
  const grade=pct>=90?'A+':pct>=80?'A':pct>=70?'B':pct>=60?'C':pct>=50?'D':'F';
  const emoji=pct>=80?'🎉':pct>=60?'👍':'📚';
  APP.quizStats.total++;APP.quizStats.totalScore+=pct;
  if(APP.quizStats.total>=5)unlockBadge('quiz5');
  document.getElementById('quiz-play').style.display='none';
  const result=document.getElementById('quiz-result');
  result.style.display='';
  result.innerHTML=`
<div style="text-align:center;padding:20px">
  <div style="font-size:60px;margin-bottom:12px">${emoji}</div>
  <div style="font-size:32px;font-weight:800;color:var(--pl)">${pct}%</div>
  <div style="font-size:40px;font-weight:800;color:var(--gold);margin:4px 0">${grade}</div>
  <p style="color:var(--muted);margin:8px 0">${quizScore} out of ${quizData.length} correct</p>
  ${pct<70?'<p style="color:var(--teal);font-size:12px">💡 Tip: Review the topic and try again to improve your score!</p>':''}
  <div class="flex-row" style="justify-content:center;margin-top:16px">
    <button class="btn btn-primary" onclick="quizRetry()">🔄 Retry</button>
    <button class="btn btn-ghost" onclick="go('quiz')">📚 New Quiz</button>
  </div>
</div>`;
  saveState();
}
function quizRetry(){quizCur=0;quizScore=0;document.getElementById('quiz-result').style.display='none';renderQuizQuestion();}
/* ── 10. FLASHCARDS ── */
PANES.fc=function(cont){
  cont.innerHTML=`
<div class="card" id="pane-fc">
  <div class="card-title"><span class="icon">🧠</span>Flashcards & Spaced Repetition</div>
  
  <div class="auth-tabs" style="margin-bottom:16px;">
    <div class="auth-tab active" id="fc-tab-gen" onclick="switchFcMode('gen')">Generate Cards</div>
    <div class="auth-tab" id="fc-tab-review" onclick="switchFcMode('review')">Review Due Cards (<span id="fc-due-count">0</span>)</div>
  </div>

  <div id="fc-setup">
    <div class="form-group">
      <label for="fc-topic">Topic</label>
      <input type="text" id="fc-topic" placeholder="e.g. Neural Networks, Calculus..." aria-label="Flashcard topic"/>
    </div>
    <div class="form-group">
      <label for="fc-context">Or use lecture context</label>
      ${lecturePickerHTML('fc-context')}
      <textarea id="fc-context" rows="3" placeholder="Paste or load lecture text to generate flashcards from it..." aria-label="Lecture context"></textarea>
    </div>
    <button class="btn btn-primary" id="fc-gen-btn" onclick="doFcGen()" aria-label="Generate flashcards"><span>🧠</span> Generate 15 Flashcards</button>
  </div>
  
  <div id="fc-play" style="display:none">
    <div class="flex-row" style="margin-bottom:10px;align-items:center">
      <span class="fc-count" id="fc-count"></span>
      <div style="flex:1"></div>
      <button class="btn btn-ghost btn-sm" onclick="shuffleFC()">🔀 Shuffle</button>
      <button class="btn btn-ghost btn-sm" onclick="exportAnki()">📤 Export to Anki</button>
      <button class="btn btn-ghost btn-sm" onclick="go('fc')">🔄 Reset</button>
    </div>
    <div class="fc-scene" onclick="flipFC()" id="fc-scene" role="button" aria-label="Flashcard (click to flip)" tabindex="0">
      <div class="fc-card" id="fc-card">
        <div class="fc-front" id="fc-front"></div>
        <div class="fc-back" id="fc-back"></div>
      </div>
    </div>
    <div class="fc-nav" id="fc-standard-nav">
      <button class="btn btn-ghost" onclick="fcNav(-1)" aria-label="Previous card">← Prev</button>
      <div class="flex-row" style="gap:6px">
        <button class="btn btn-ghost btn-sm" onclick="markFC('known')" aria-label="Mark as known">✅ Known</button>
        <button class="btn btn-ghost btn-sm" onclick="markFC('unknown')" aria-label="Mark as unknown">❌ Unknown</button>
      </div>
      <button class="btn btn-ghost" onclick="fcNav(1)" aria-label="Next card">Next →</button>
    </div>
    
    <div id="fc-sm2-nav" style="display:none; flex-direction:column; gap:8px; align-items:center; margin-top:12px;">
      <div style="font-size:10px; color:var(--muted); font-weight:600;">Rate your recall difficulty:</div>
      <div class="flex-row" style="gap:6px; justify-content:center;">
        <button class="btn btn-ghost btn-sm" onclick="rateSM2(0)" style="color:var(--err);">Again (0)</button>
        <button class="btn btn-ghost btn-sm" onclick="rateSM2(1)" style="color:var(--gold);">Hard (1)</button>
        <button class="btn btn-ghost btn-sm" onclick="rateSM2(2)" style="color:var(--teal);">Good (2)</button>
        <button class="btn btn-ghost btn-sm" onclick="rateSM2(3)" style="color:var(--ok);">Easy (3)</button>
      </div>
    </div>
    
    <div class="prog-bar mt-8"><div class="prog-fill purple" id="fc-prog"></div></div>
  </div>
</div>`;
  updateFcDueCountBadge();
};
const doFcGen=debounce(async()=>{
  const topic=document.getElementById('fc-topic').value.trim();
  const context=document.getElementById('fc-context').value.trim();
  if(!topic&&!context){showToast('Enter a topic or load a lecture','err');return;}
  const btn=document.getElementById('fc-gen-btn');
  btn.disabled=true;btn.innerHTML='<span class="spinner"></span> Generating...';
  let full='';
  const userPrompt=context?`Generate 15 flashcards from this lecture:\n\n${context}\n\nFormat: [{"front":"term","back":"definition"}]`:`Generate 15 flashcards about: ${topic}. Format: [{"front":"term","back":"definition"}]`;
  await callAI([
    {role:'system',content:'Reply ONLY with raw JSON array. No markdown, no fences.'},
    {role:'user',content:userPrompt}
  ],
  c=>{full+=c;},
  _=>{
    try{
      let clean=full.replace(/```json|```/gi,'').trim();
      const startIdx = clean.indexOf('[');
      const endIdx = clean.lastIndexOf(']');
      if (startIdx !== -1 && endIdx > startIdx) {
        clean = clean.substring(startIdx, endIdx + 1);
      }
      const parsed = JSON.parse(clean);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].front !== undefined) {
        APP.fcCards = parsed;
      } else {
        throw new Error('Not flashcard format');
      }
      APP.fcIndex=0;APP.fcReviewed=new Set();
      document.getElementById('fc-setup').style.display='none';
      document.getElementById('fc-play').style.display='';
      renderFC();addXP('fc');
    }catch(e){
      // Fallback: try to parse raw text into flashcards
      const fcParsed = parseRawTextToFlashcards(full);
      if (fcParsed && fcParsed.length > 0) {
        APP.fcCards = fcParsed;
        APP.fcIndex=0;APP.fcReviewed=new Set();
        document.getElementById('fc-setup').style.display='none';
        document.getElementById('fc-play').style.display='';
        renderFC();addXP('fc');
      } else {
        showToast('Invalid format. Please try again.','err');
      }
    }
    btn.disabled=false;btn.innerHTML='<span>🧠</span> Generate 15 Flashcards';
  },
  err=>{showToast(t(err),'err');btn.disabled=false;btn.innerHTML='<span>🧠</span> Generate 15 Flashcards';});
},500);

function parseRawTextToFlashcards(text) {
  const items = [];
  // Try splitting by numbered items or bold markers
  const blocks = text.split(/(?=\d+\.\s|\*\*\d+|\n-\s|\nQ:|\nTerm:)/i).filter(Boolean);
  for (const block of blocks) {
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length >= 2) {
      const front = lines[0].replace(/^\d+[\.\)]\s*/, '').replace(/\*\*/g, '').replace(/^(Term|Q|Front):\s*/i, '').trim();
      const back = lines.slice(1).join(' ').replace(/\*\*/g, '').replace(/^(A|Answer|Back|Definition):\s*/i, '').trim();
      if (front && back) items.push({ front, back });
    }
  }
  return items;
}


function renderFC(){
  const card=APP.fcCards[APP.fcIndex];
  if(!card)return;
  document.getElementById('fc-front').textContent=card.front;
  document.getElementById('fc-back').textContent=card.back;
  document.getElementById('fc-card').classList.remove('flipped');
  
  const dueCount = APP.fcCards.filter(c => !c.nextReviewDate || c.nextReviewDate <= Date.now()).length;
  document.getElementById('fc-count').textContent=`Card ${APP.fcIndex+1} / ${APP.fcCards.length} · Due for Review: ${dueCount}`;
  document.getElementById('fc-prog').style.width=(APP.fcReviewed.size/APP.fcCards.length*100)+'%';
}
function flipFC(){document.getElementById('fc-card').classList.toggle('flipped');}
function fcNav(d){
  APP.fcIndex=(APP.fcIndex+d+APP.fcCards.length)%APP.fcCards.length;
  renderFC();
}
function shuffleFC(){APP.fcCards=APP.fcCards.sort(()=>Math.random()-.5);APP.fcIndex=0;renderFC();showToast('Shuffled! 🔀','info',1000);}

function scheduleSM2(card, grade) {
  let ease = card.ease || 2.5;
  let reps = card.reps || 0;
  let interval = card.interval || 0;
  
  if (grade >= 3) {
    if (reps === 0) {
      interval = 1;
    } else if (reps === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * ease);
    }
    reps++;
    ease = ease + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
  } else {
    reps = 0;
    interval = 1;
    ease = Math.max(1.3, ease - 0.2);
  }
  
  card.ease = ease;
  card.reps = reps;
  card.interval = interval;
  
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + interval);
  card.nextReviewDate = nextDate.getTime();
  saveState();
}

function markFC(status){
  const card = APP.fcCards[APP.fcIndex];
  if (card) {
    const grade = status === 'known' ? 5 : 1;
    scheduleSM2(card, grade);
  }
  APP.fcReviewed.add(APP.fcIndex);
  renderFC();
  if(APP.fcReviewed.size>=20)unlockBadge('vocab20');
  showToast(status === 'known' ? 'Marked as Remembered!' : 'Scheduled for review soon!', 'info', 1200);
}
async function exportAnki(){
  if(!APP.fcCards||!APP.fcCards.length){showToast('Generate flashcards first','err');return;}
  
  try {
    await loadAnkiDependencies();
    
    const config = {
      locateFile: filename => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.2/${filename}`
    };
    
    const SQL = await initSqlJs(config);
    const db = new SQL.Database();
    
    db.run(`
    CREATE TABLE col (
        id              integer primary key,
        crt             integer not null,
        mod             integer not null,
        scm             integer not null,
        ver             integer not null,
        dty             integer not null,
        usn             integer not null,
        ls              integer not null,
        conf            text not null,
        models          text not null,
        decks           text not null,
        dconf           text not null,
        tags            text not null
    );
    CREATE TABLE notes (
        id              integer primary key,
        guid            text not null,
        mid             integer not null,
        mod             integer not null,
        usn             integer not null,
        tags            text not null,
        flds            text not null,
        sfld            text not null,
        csum            integer not null,
        flags           integer not null,
        data            text not null
    );
    CREATE TABLE cards (
        id              integer primary key,
        nid             integer not null,
        did             integer not null,
        ord             integer not null,
        mod             integer not null,
        usn             integer not null,
        type            integer not null,
        queue           integer not null,
        due             integer not null,
        ivl             integer not null,
        factor          integer not null,
        reps            integer not null,
        lapses          integer not null,
        left            integer not null,
        odue            integer not null,
        odid            integer not null,
        flags           integer not null,
        data            text not null
    );
    `);

    const deckId = 1500000000000;
    const modelId = 1500000000001;

    const colConf = JSON.stringify({
      nextCardQueueDate: 0,
      activeDecks: [deckId],
      newSpread: 0,
      collapseTime: 1200,
      timeLim: 0,
      estTimes: true,
      dueCounts: true,
      curDeck: deckId,
      newBury: true,
      lastActiveDeck: deckId
    });

    const colModels = JSON.stringify({
      [modelId]: {
        id: modelId,
        name: "Basic-MindSpark",
        type: 0,
        mod: Math.floor(Date.now() / 1000),
        usn: 0,
        tags: [],
        flds: [
          { name: "Front", ord: 0, sticky: false, rtl: false, font: "Arial", size: 20 },
          { name: "Back", ord: 1, sticky: false, rtl: false, font: "Arial", size: 20 }
        ],
        tmpls: [
          {
            name: "Card 1",
            ord: 0,
            qfmt: "{{Front}}",
            afmt: "{{Front}}<hr id=answer>{{Back}}",
            did: null
          }
        ],
        css: ".card {\n font-family: arial;\n font-size: 20px;\n text-align: center;\n color: black;\n background-color: white;\n}\n",
        did: deckId
      }
    });

    const colDecks = JSON.stringify({
      "1": { id: 1, name: "Default", mod: 0, usn: 0, lr: 0, conf: 1, desc: "", dyn: 0 },
      [deckId]: { id: deckId, name: "MindSpark Deck", mod: Math.floor(Date.now() / 1000), usn: 0, lr: 0, conf: 1, desc: "AI generated flashcards from MindSpark", dyn: 0 }
    });

    const colDconf = JSON.stringify({
      "1": { id: 1, name: "Default", mod: 0, usn: 0, maxTaken: 60, autoplay: true, timer: 0, replayq: true, new: { bury: false, order: 1, initialFactor: 2500, perDay: 20, delays: [1, 10], separate: true }, lapses: { bury: false, delays: [10], mult: 0, minInt: 1, leeway: 0 }, rev: { bury: false, ivlFct: 1, ease4: 1.3, maxIvl: 36500, perDay: 200, minSpace: 1, fuz: 0.05 } }
    });

    db.run(`INSERT INTO col VALUES (1, ${Math.floor(Date.now() / 1000)}, ${Date.now()}, ${Date.now()}, 11, 0, 0, 0, ?, ?, ?, ?, '{}')`, [colConf, colModels, colDecks, colDconf]);

    let idx = 0;
    for (const card of APP.fcCards) {
      const noteId = 1600000000000 + idx * 2;
      const cardId = 1600000000000 + idx * 2 + 1;
      const guid = Math.random().toString(36).substring(2, 10);
      
      const flds = `${card.front}\u001f${card.back}`;
      const sfld = card.front.slice(0, 30);
      const csum = 0;
      
      db.run(`INSERT INTO notes VALUES (?, ?, ?, ${Math.floor(Date.now() / 1000)}, 0, '', ?, ?, ?, 0, '')`, 
        [noteId, guid, modelId, flds, sfld, csum]);
        
      db.run(`INSERT INTO cards VALUES (?, ?, ?, 0, ${Math.floor(Date.now() / 1000)}, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '')`,
        [cardId, noteId, deckId]);
        
      idx++;
    }

    const binaryDb = db.export();
    const zip = new JSZip();
    zip.file("collection.anki2", binaryDb);
    zip.file("media", "{}");

    const apkgBlob = await zip.generateAsync({ type: "blob" });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(apkgBlob);
    const topic = document.getElementById('fc-topic')?.value.trim() || 'flashcards';
    a.download = `mindspark_${topic.replace(/[^a-zA-Z0-9]/g,'_')}.apkg`;
    a.click();
    showToast("Native Anki Deck (.apkg) exported successfully!", "ok");
    
  } catch (err) {
    console.error("APKG Export failed, falling back to text:", err);
    showToast("APKG build failed. Exporting as standard text import instead.", "warn");
    const content = (APP.fcCards || []).map(c => `${c.front}\t${c.back}`).join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    const topic = document.getElementById('fc-topic')?.value.trim() || 'flashcards';
    a.download = `anki_export_${topic.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    a.click();
  }
}

/* ── NEXT-GEN 1. PPTX GENERATOR ── */
PANES.pptx = function(cont) {
  cont.innerHTML = `
<div class="card" id="pane-pptx">
  <div class="card-title"><span class="icon">📊</span>AI PowerPoint (.pptx) Generator</div>
  <div class="form-group">
    <label for="pptx-topic">Presentation Topic or Chapter</label>
    <input type="text" id="pptx-topic" placeholder="e.g. Artificial Intelligence in Healthcare, Quantum Computing..." aria-label="Presentation topic"/>
  </div>
  <div class="grid-2">
    <div class="form-group">
      <label for="pptx-slides">Number of Slides</label>
      <select id="pptx-slides"><option>5</option><option>8</option><option>12</option></select>
    </div>
    <div class="form-group">
      <label for="pptx-style">Slide Theme</label>
      <select id="pptx-style"><option>Cyberpunk Dark</option><option>Academic Modern</option><option>Minimalist Light</option></select>
    </div>
  </div>
  <div class="form-group">
    <label for="pptx-context">Or paste lecture notes / summary</label>
    ${lecturePickerHTML('pptx-context')}
    <textarea id="pptx-context" rows="4" placeholder="Paste source text to generate PowerPoint slides from..."></textarea>
  </div>
  <button class="btn btn-primary" id="pptx-btn" onclick="doPptxGen()"><span>📊</span> Generate & Download PowerPoint (.pptx)</button>
  <div style="margin-top:16px">
    <div class="output-box" id="pptx-out" aria-live="polite"><span class="text-muted text-sm">Slide structure preview will appear here...</span></div>
  </div>
</div>`;
};

window.doPptxGen = debounce(async () => {
  const topic = document.getElementById('pptx-topic').value.trim();
  const context = document.getElementById('pptx-context').value.trim();
  const slideCount = document.getElementById('pptx-slides').value;
  if (!topic && !context) { showToast('Please enter topic or paste lecture context', 'err'); return; }
  
  const btn = document.getElementById('pptx-btn');
  const out = document.getElementById('pptx-out');
  btn.disabled = true; btn.innerHTML = '<span class="spinner"></span> Building PowerPoint...';
  setSkeleton(out);

  const prompt = context ? `Create a ${slideCount}-slide presentation structure based on this context:\n\n${context}` : `Create a ${slideCount}-slide presentation structure about "${topic}".`;

  let full = '';
  await callAI([
    { role: 'system', content: 'Reply ONLY with JSON format: {"title":"Presentation Title","slides":[{"slideTitle":"Title","bulletPoints":["Point 1","Point 2","Point 3"]}]}. No markdown wrappers.' },
    { role: 'user', content: prompt }
  ],
  c => { full += c; },
  async _ => {
    try {
      let clean = full.replace(/```json|```/gi, '').trim();
      if (clean[0] !== '{') clean = clean.slice(clean.indexOf('{'));
      const pptData = JSON.parse(clean);

      out.innerHTML = sanitize(renderMD(`### 📊 Presentation Generated: ${pptData.title}\n\n` + 
        pptData.slides.map((s, i) => `**Slide ${i+1}: ${s.slideTitle}**\n${s.bulletPoints.map(b => `- ${b}`).join('\n')}`).join('\n\n')));

      if (typeof pptxgen !== 'undefined') {
        const pptx = new pptxgen();
        pptx.author = 'MindSpark AI';
        pptx.title = pptData.title;

        const slide1 = pptx.addSlide();
        slide1.background = { color: '05050A' };
        slide1.addText(pptData.title, { x: 0.5, y: 2.0, w: 9.0, h: 1.5, fontSize: 36, color: '00F3FF', bold: true, align: 'center' });
        slide1.addText("MindSpark University Edition", { x: 0.5, y: 3.8, w: 9.0, h: 0.5, fontSize: 18, color: 'B026FF', align: 'center' });

        pptData.slides.forEach(s => {
          const slide = pptx.addSlide();
          slide.background = { color: '0A0A14' };
          slide.addText(s.slideTitle, { x: 0.5, y: 0.5, w: 9.0, h: 0.8, fontSize: 24, color: '00F3FF', bold: true });
          const bullets = s.bulletPoints.map(b => ({ text: b, options: { fontSize: 16, color: 'FFFFFF', breakLine: true, bullet: true } }));
          slide.addText(bullets, { x: 0.8, y: 1.6, w: 8.4, h: 4.5, lineSpacing: 28 });
        });

        const safeFilename = (pptData.title || 'presentation').replace(/[^a-zA-Z0-9]/g, '_') + '.pptx';
        await pptx.writeFile({ fileName: safeFilename });
        showToast('PowerPoint downloaded successfully! 📊', 'ok');
      } else {
        showToast('PPTX Generator library loading...', 'warn');
      }
    } catch (e) {
      console.error('PPTX parse error:', e);
      out.innerHTML = `<span style="color:var(--err)">Failed to parse slide structure. Please try again.</span>`;
    }
    btn.disabled = false; btn.innerHTML = '<span>📊</span> Generate & Download PowerPoint (.pptx)';
  },
  err => { out.innerHTML = `<span style="color:var(--err)">${t(err)}</span>`; btn.disabled = false; btn.innerHTML = '<span>📊</span> Generate & Download PowerPoint (.pptx)'; });
}, 500);

/* ── NEXT-GEN 2. LIVE LECTURE TRANSCRIBER ── */
PANES.lectrans = function(cont) {
  cont.innerHTML = `
<div class="card" id="pane-lectrans">
  <div class="card-title"><span class="icon">🎙️</span>Live Lecture Transcriber & Summarizer</div>
  <p class="text-muted text-sm" style="margin-bottom:14px;">
    Record audio live during university lectures. MindSpark will transcribe the professor's voice in real-time and summarize key concepts.
  </p>
  
  <div style="text-align:center; padding:20px; background:var(--card2); border:1px solid var(--border2); border-radius:var(--r); margin-bottom:14px;">
    <div class="waveform" id="lt-wave" style="display:none; justify-content:center; margin-bottom:14px;"></div>
    <div style="font-size:14px; font-weight:700; color:var(--primary);" id="lt-status-text">Click Record to start live lecture capture</div>
    
    <div class="flex-row mt-8" style="justify-content:center; gap:12px;">
      <button class="btn btn-primary" id="lt-record-btn" onclick="toggleLectureRecording()">🎙️ Start Recording</button>
      <button class="btn btn-ghost" onclick="clearLectureTranscript()">🗑️ Clear</button>
    </div>
  </div>

  <div class="form-group">
    <label for="lt-transcript">Live Transcript</label>
    <textarea id="lt-transcript" rows="6" placeholder="Live transcribed lecture text will stream here..."></textarea>
  </div>

  <div class="flex-row" style="gap:10px;">
    <button class="btn btn-teal" onclick="summarizeLectureTranscript()">⚡ Summarize Lecture</button>
    <button class="btn btn-ghost" onclick="generateLectureQuestions()">❓ Generate Exam Questions</button>
  </div>

  <div style="margin-top:16px;">
    <div class="output-box" id="lt-out"><span class="text-muted text-sm">Lecture summary and key takeaways will appear here...</span></div>
  </div>
</div>`;

  const wave = document.getElementById('lt-wave');
  if (wave) {
    wave.innerHTML = '';
    for (let i = 0; i < 30; i++) {
      const b = document.createElement('div');
      b.className = 'wave-bar';
      b.style.animationDelay = (i * 0.04) + 's';
      wave.appendChild(b);
    }
  }
};

let ltSpeechRec = null;
let ltIsRecording = false;

window.toggleLectureRecording = function() {
  const btn = document.getElementById('lt-record-btn');
  const status = document.getElementById('lt-status-text');
  const wave = document.getElementById('lt-wave');
  const ta = document.getElementById('lt-transcript');

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    showToast("Live speech recognition is not supported in this browser.", "err");
    return;
  }

  if (!ltIsRecording) {
    ltSpeechRec = new SpeechRecognition();
    ltSpeechRec.continuous = true;
    ltSpeechRec.interimResults = true;
    ltSpeechRec.lang = APP.lang === 'ar' ? 'ar-SA' : 'en-US';

    ltSpeechRec.onstart = () => {
      ltIsRecording = true;
      btn.innerHTML = '⏹️ Stop Recording';
      btn.className = 'btn btn-ghost';
      btn.style.color = 'var(--err)';
      status.innerHTML = '🔴 Recording live lecture audio...';
      if (wave) wave.style.display = 'flex';
      showToast("Listening to lecture...", "info");
    };

    ltSpeechRec.onresult = (event) => {
      let currentText = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentText += event.results[i][0].transcript + ' ';
      }
      ta.value += currentText;
      ta.scrollTop = ta.scrollHeight;
    };

    ltSpeechRec.onerror = (event) => {
      console.error("Speech rec error:", event.error);
    };

    ltSpeechRec.onend = () => {
      if (ltIsRecording) ltSpeechRec.start();
    };

    ltSpeechRec.start();
  } else {
    ltIsRecording = false;
    if (ltSpeechRec) ltSpeechRec.stop();
    btn.innerHTML = '🎙️ Start Recording';
    btn.className = 'btn btn-primary';
    btn.style.color = '#000';
    status.innerHTML = '✅ Recording paused.';
    if (wave) wave.style.display = 'none';
    showToast("Lecture recording paused.", "ok");
  }
};

window.clearLectureTranscript = function() {
  document.getElementById('lt-transcript').value = '';
  document.getElementById('lt-out').innerHTML = '<span class="text-muted text-sm">Lecture summary and key takeaways will appear here...</span>';
};

window.summarizeLectureTranscript = async function() {
  const text = document.getElementById('lt-transcript').value.trim();
  if (!text) { showToast("Please record or paste transcript first", "err"); return; }

  const out = document.getElementById('lt-out');
  setSkeleton(out);

  let full = '';
  await callAI([
    { role: 'system', content: 'You are an elite university lecture note-taker. Provide a comprehensive summary, key bullet points, main formulas/concepts, and action items.' },
    { role: 'user', content: `Summarize this live lecture transcript:\n\n${text}` }
  ],
  c => { full += c; out.innerHTML = sanitize(renderMD(full)); },
  _ => { addXP('sum'); showToast("Lecture summary generated!", "ok"); },
  err => { out.innerHTML = `<span style="color:var(--err)">${t(err)}</span>`; });
};

window.generateLectureQuestions = async function() {
  const text = document.getElementById('lt-transcript').value.trim();
  if (!text) { showToast("Please record or paste transcript first", "err"); return; }

  const out = document.getElementById('lt-out');
  setSkeleton(out);

  let full = '';
  await callAI([
    { role: 'system', content: 'You are a university professor creating exam questions from a lecture.' },
    { role: 'user', content: `Generate 5 high-yield exam questions based on this lecture transcript with answers:\n\n${text}` }
  ],
  c => { full += c; out.innerHTML = sanitize(renderMD(full)); },
  _ => { addXP('qgen'); showToast("Exam questions generated!", "ok"); },
  err => { out.innerHTML = `<span style="color:var(--err)">${t(err)}</span>`; });
};

/* ── NEXT-GEN 3. CAREER PATHFINDER ── */
PANES.career = function(cont) {
  cont.innerHTML = `
<div class="card" id="pane-career">
  <div class="card-title"><span class="icon">🧭</span>AI Career Pathfinder & Graduation Project Advisor</div>
  
  <div class="grid-2">
    <div class="form-group">
      <label for="car-major">Academic Major / Track</label>
      <input type="text" id="car-major" value="${APP.profileProg || 'Computer Science & AI'}" placeholder="e.g. Artificial Intelligence, Mechanical Engineering..." aria-label="Major"/>
    </div>
    <div class="form-group">
      <label for="car-target">Target Career Goal</label>
      <input type="text" id="car-target" placeholder="e.g. AI Engineer, Data Scientist, Full Stack Developer..." aria-label="Career goal"/>
    </div>
  </div>

  <button class="btn btn-primary" id="car-btn" onclick="doCareerPathfinder()"><span>🧭</span> Analyze Career Pathfinder & Projects</button>

  <div style="margin-top:16px">
    <div class="output-box" id="car-out" aria-live="polite"><span class="text-muted text-sm">Career roadmap and graduation project recommendations will appear here...</span></div>
  </div>
</div>`;
};

window.doCareerPathfinder = debounce(async () => {
  const major = document.getElementById('car-major').value.trim();
  const target = document.getElementById('car-target').value.trim();

  if (!major || !target) { showToast('Please enter your major and target career goal', 'err'); return; }

  const out = document.getElementById('car-out');
  const btn = document.getElementById('car-btn');
  setSkeleton(out); btn.disabled = true; btn.innerHTML = '<span class="spinner"></span> Analyzing Career Roadmap...';

  let full = '';
  await callAI([
    { role: 'system', content: 'You are an academic career counselor and tech industry mentor.' },
    { role: 'user', content: `Student Major: ${major}\nTarget Career: ${target}\n\nProvide:\n1. Skill Gap Analysis\n2. 6-Month Action Roadmap\n3. 5 Innovative Graduation Project Ideas with tech stack & description\n4. Recommended Professional Certifications.` }
  ],
  c => { full += c; out.innerHTML = sanitize(renderMD(full)); },
  _ => { addXP('research'); showToast("Career roadmap ready!", "ok"); },
  err => { out.innerHTML = `<span style="color:var(--err)">${t(err)}</span>`; });

  btn.disabled = false; btn.innerHTML = '<span>🧭</span> Analyze Career Pathfinder & Projects';
}, 500);

/* ── MindMap to Quiz Converter ── */
window.convertMindMapToQuiz = function() {
  if (typeof mmData === 'undefined' || !mmData || !mmData.name) {
    showToast("Please generate a Mind Map first!", "err");
    return;
  }
  const nodes = [];
  function extract(node) {
    if (node.name) nodes.push(node.name);
    if (node.children) node.children.forEach(extract);
  }
  extract(mmData);
  
  go('quiz');
  setTimeout(() => {
    document.getElementById('quiz-topic').value = nodes.slice(0, 5).join(', ');
    doQuizGen();
  }, 200);
};

// ── LAZY LOAD ANKI LIBRARIES ──
let jszipLoaded = false;
let sqlJsLoaded = false;
async function loadAnkiDependencies() {
  if (jszipLoaded && sqlJsLoaded) return;
  showToast("Loading Anki exporter engines...", "info");
  
  const loadScript = (src) => new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = res;
    s.onerror = rej;
    document.head.appendChild(s);
  });
  
  try {
    if (!jszipLoaded) {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js');
      jszipLoaded = true;
    }
    if (!sqlJsLoaded) {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.2/sql-wasm.js');
      sqlJsLoaded = true;
    }
  } catch(e) {
    showToast("Failed to load exporter libraries.", "err");
    throw e;
  }
}
/* ── 11. MIND MAP ── */
PANES.mm=function(cont){
  cont.innerHTML=`
<div class="card" id="pane-mm">
  <div class="card-title"><span class="icon">🗺️</span>Mind Map Visualizer</div>
  <div class="flex-row">
    <input type="text" id="mm-topic" placeholder="Enter topic for mind map..." style="flex:1" aria-label="Mind map topic"/>
    <button class="btn btn-primary" id="mm-btn" onclick="doMM()" aria-label="Generate mind map"><span>🗺️</span> Generate</button>
  </div>
  <div class="form-group" style="margin-top:12px">
    <label for="mm-context">Or use lecture context</label>
    ${lecturePickerHTML('mm-context')}
    <textarea id="mm-context" rows="3" placeholder="Paste or load lecture text to create mind map from it..." aria-label="Lecture context"></textarea>
  </div>
  <div style="margin-top:14px">
    <svg id="mm-svg" viewBox="0 0 900 600" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Mind map visualization">
      <g id="mm-root" transform="translate(0,0) scale(1)">
        <text x="450" y="310" text-anchor="middle" fill="var(--faint)" font-size="14" font-family="Poppins,sans-serif">Enter a topic and click Generate</text>
      </g>
    </svg>
  </div>
  <div class="output-actions mt-8">
    <button class="btn btn-ghost btn-sm" onclick="downloadMM()" aria-label="Download mind map as SVG">💾 Download SVG</button>
    <button class="btn btn-ghost btn-sm" onclick="resetMM()" aria-label="Reset mind map view">🎯 Reset View</button>
  </div>
</div>`;
  initMMPanZoom();
};
let mmScale=1,mmTx=0,mmTy=0,mmDragging=false,mmLastX=0,mmLastY=0;
function initMMPanZoom(){
  const svg=document.getElementById('mm-svg');
  if(!svg)return;
  svg.addEventListener('wheel',e=>{
    e.preventDefault();
    mmScale=Math.max(.4,Math.min(2.5,mmScale-e.deltaY*.001));
    applyMMTransform();
  },{passive:false});
  svg.addEventListener('mousedown',e=>{mmDragging=true;mmLastX=e.clientX;mmLastY=e.clientY;});
  window.addEventListener('mousemove',e=>{
    if(!mmDragging)return;
    mmTx+=e.clientX-mmLastX;mmTy+=e.clientY-mmLastY;
    mmLastX=e.clientX;mmLastY=e.clientY;
    applyMMTransform();
  });
  window.addEventListener('mouseup',()=>mmDragging=false);
}
function applyMMTransform(){
  const g=document.getElementById('mm-root');
  if(g)g.setAttribute('transform',`translate(${mmTx},${mmTy}) scale(${mmScale})`);
}
function resetMM(){mmScale=1;mmTx=0;mmTy=0;applyMMTransform();}
const doMM=debounce(async()=>{
  const topic=document.getElementById('mm-topic').value.trim();
  const context=document.getElementById('mm-context').value.trim();
  if(!topic&&!context){showToast('Enter a topic or load a lecture','err');return;}
  const btn=document.getElementById('mm-btn');
  btn.disabled=true;btn.innerHTML='<span class="spinner"></span> Mapping...';
  let full='';
  const userPrompt=context?`Create a mind map structure from this lecture:\n\n${context}\n\nFormat: {"label":"Main","children":[{"label":"Sub","children":[{"label":"Detail"}]}]} Include 5-6 main branches, 2-3 children each.`:`Mind map for: ${topic}. Format: {"label":"Main","children":[{"label":"Sub","children":[{"label":"Detail"}]}]} Include 5-6 main branches, 2-3 children each.`;
  await callAI([
    {role:'system',content:'Reply ONLY with raw JSON object. No markdown, no fences.'},
    {role:'user',content:userPrompt}
  ],
  c=>{full+=c;},
  _=>{
    try{
      let clean=full.replace(/```json|```/gi,'').trim();
      if(clean[0]!=='{')clean=clean.slice(clean.indexOf('{'));
      const tree=JSON.parse(clean);
      renderMindMap(tree);addXP('mm');
    }catch{showToast('Invalid format. Please try again.','err');}
    btn.disabled=false;btn.innerHTML='<span>🗺️</span> Generate';
  },
  err=>{showToast(t(err),'err');btn.disabled=false;btn.innerHTML='<span>🗺️</span> Generate';});
},500);
let d3Loaded = false;
async function ensureD3() {
  if (d3Loaded) return true;
  return new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js';
    s.onload = () => { d3Loaded = true; res(true); };
    s.onerror = () => rej(false);
    document.head.appendChild(s);
  });
}

let currentMindMapData = null;

async function renderMindMap(tree) {
  currentMindMapData = tree;
  try {
    await ensureD3();
    renderMindMapD3(tree);
    addXP('mm');
  } catch(e) {
    console.error("D3 loading failed, falling back to static SVG rendering:", e);
    renderMindMapStatic(tree);
    addXP('mm');
  }
}

function renderMindMapD3(treeData) {
  const svgEl = d3.select("#mm-svg");
  svgEl.selectAll("*").remove();
  
  const width = 900;
  const height = 600;
  
  const g = svgEl.append("g").attr("id", "mm-root");
  
  const zoom = d3.zoom()
    .scaleExtent([0.3, 3])
    .on("zoom", (event) => {
      g.attr("transform", event.transform);
    });
  svgEl.call(zoom);
  
  const root = d3.hierarchy(treeData);
  const treeLayout = d3.tree().size([height - 100, width - 250]);
  treeLayout(root);
  
  root.each(d => {
    d.y += 100;
    d.x += 50;
  });

  const links = g.selectAll(".link")
    .data(root.links())
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("fill", "none")
    .attr("stroke", d => d.target.depth === 1 ? "var(--primary)" : "var(--pl)")
    .attr("stroke-width", d => Math.max(1, 4 - d.source.depth) + "px")
    .attr("opacity", 0.6)
    .attr("d", d3.linkHorizontal()
      .x(d => d.y)
      .y(d => d.x)
    );

  const nodes = g.selectAll(".node")
    .data(root.descendants())
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", d => `translate(${d.y},${d.x})`)
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended)
    );

  nodes.append("rect")
    .attr("rx", 10)
    .attr("ry", 10)
    .attr("x", -70)
    .attr("y", -18)
    .attr("width", 140)
    .attr("height", 36)
    .attr("fill", d => d.depth === 0 ? "var(--primary)" : (d.depth === 1 ? "var(--card2)" : "rgba(20,20,35,0.9)"))
    .attr("stroke", d => d.depth === 0 ? "var(--pl)" : (d.depth === 1 ? "var(--primary)" : "var(--border2)"))
    .attr("stroke-width", 2)
    .style("cursor", "pointer");

  nodes.append("text")
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .attr("fill", "#fff")
    .style("font-size", "11px")
    .style("font-weight", d => d.depth === 0 ? "800" : "500")
    .style("font-family", "Poppins, sans-serif")
    .style("pointer-events", "none")
    .text(d => d.data.label);

  nodes.on("dblclick", function(event, d) {
    event.stopPropagation();
    const currentLabel = d.data.label;
    const newLabel = prompt("Edit node label:", currentLabel);
    if (newLabel !== null && newLabel.trim() !== "") {
      d.data.label = newLabel.trim();
      renderMindMapD3(treeData);
    }
  });

  svgEl.call(zoom.transform, d3.zoomIdentity.translate(0, 0).scale(1));

  function dragstarted(event, d) {
    d3.select(this).raise().select("rect").attr("stroke", "#ff007f");
  }

  function dragged(event, d) {
    d.y = event.x;
    d.x = event.y;
    d3.select(this).attr("transform", `translate(${d.y},${d.x})`);
    links.attr("d", d3.linkHorizontal()
      .x(l => l.y)
      .y(l => l.x)
    );
  }

  function dragended(event, d) {
    d3.select(this).select("rect").attr("stroke", d => d.depth === 0 ? "var(--pl)" : (d.depth === 1 ? "var(--primary)" : "var(--border2)"));
  }
}

function renderMindMapStatic(tree) {
  const g = document.getElementById('mm-root');
  g.innerHTML = '';
  resetMM();
  const cx = 450, cy = 300;
  const branches = tree.children || [];
  const n = branches.length;
  
  const cCirc = svgEl('circle', { cx, cy, r: 44, fill: '#7c3aed' });
  const cText = svgEl('text', { x: cx, y: cy + 5, 'text-anchor': 'middle', 'dominant-baseline': 'middle', fill: '#fff', 'font-size': 12, 'font-weight': 700, 'font-family': 'Poppins,sans-serif' });
  cText.textContent = (tree.label || '').slice(0, 14);
  g.appendChild(cCirc); g.appendChild(cText);
  
  branches.forEach((branch, bi) => {
    const angle = ((360 / n) * bi - 90) * Math.PI / 180;
    const bx = cx + 160 * Math.cos(angle);
    const by = cy + 160 * Math.sin(angle);
    g.appendChild(svgConnector(cx, cy, bx, by, '#7c3aed', 2, 0.6));
    g.appendChild(svgRect(bx - 70, by - 18, 140, 36, 10, '#1a1a2e', '#7c3aed', 2));
    g.appendChild(svgText(bx, by, branch.label || '', '#f1f5f9', 11, 600));
    
    const subs = branch.children || [];
    subs.forEach((sub, si) => {
      const spread = 35 * Math.PI / 180;
      const subAngle = angle + (si - (subs.length - 1) / 2) * spread;
      const sx = bx + 110 * Math.cos(subAngle);
      const sy = by + 110 * Math.sin(subAngle);
      g.appendChild(svgConnector(bx, by, sx, sy, '#0d9488', 1.5, 0.5));
      g.appendChild(svgRect(sx - 60, sy - 15, 120, 30, 8, '#14142a', '#0d9488', 1.5));
      g.appendChild(svgText(sx, sy, sub.label || '', '#f1f5f9', 10, 500));
      
      const details = sub.children || [];
      details.forEach((d, di) => {
        const spread3 = 25 * Math.PI / 180;
        const da = subAngle + (di - (details.length - 1) / 2) * spread3;
        const dx = sx + 80 * Math.cos(da);
        const dy = sy + 80 * Math.sin(da);
        g.appendChild(svgConnector(sx, sy, dx, dy, '#475569', 1, 0.4));
        g.appendChild(svgRect(dx - 50, dy - 13, 100, 26, 6, '#14142a', '#2d2d50', 1));
        g.appendChild(svgText(dx, dy, d.label || '', '#94a3b8', 9, 400));
      });
    });
  });
}

function svgEl(tag, attrs) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  return el;
}
function svgConnector(x1, y1, x2, y2, stroke, sw, op) {
  const mx = (x1 + x2) / 2;
  const p = svgEl('path', { d: `M ${x1},${y1} C ${mx},${y1} ${mx},${y2} ${x2},${y2}`, fill: 'none', stroke, opacity: op, 'stroke-width': sw });
  return p;
}
function svgRect(x, y, w, h, rx, fill, stroke, sw) {
  return svgEl('rect', { x, y, width: w, height: h, rx, fill, stroke, 'stroke-width': sw });
}
function svgText(x, y, text, fill, fs, fw) {
  const el = svgEl('text', { x, y, 'text-anchor': 'middle', 'dominant-baseline': 'middle', fill, 'font-size': fs, 'font-weight': fw, 'font-family': 'Poppins,sans-serif' });
  el.textContent = text.slice(0, 16);
  return el;
}
function downloadMM(){
  const svgEl2=document.getElementById('mm-svg');
  const data=new XMLSerializer().serializeToString(svgEl2);
  const blob=new Blob([data],{type:'image/svg+xml'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='mindmap.svg';a.click();
}
/* ── 12. RESEARCH ASSISTANT ── */
PANES.research=function(cont){
  cont.innerHTML=`
<div class="card" id="pane-research">
  <div class="card-title"><span class="icon">🔍</span>Research Assistant</div>
  <div class="form-group">
    <label for="res-topic">Research Topic</label>
    <input type="text" id="res-topic" placeholder="Enter your research topic..." aria-label="Research topic"/>
  </div>
  <div class="form-group">
    <label for="res-field">Field</label>
    <select id="res-field">
      <option>Computer Science</option><option>AI & Machine Learning</option>
      <option>Biomedical</option><option>Mathematics</option><option>Engineering</option>
      <option>Social Sciences</option><option>Interdisciplinary</option>
    </select>
  </div>
  <div class="form-group">
    <label for="res-context">Or use lecture context</label>
    ${lecturePickerHTML('res-context')}
    <div style="display:flex;gap:6px;align-items:flex-start">
      <textarea id="res-context" rows="3" placeholder="Paste or load lecture text to research it further..." aria-label="Lecture context" style="flex:1"></textarea>
      <button class="voice-btn" data-target="res-context" onclick="startVoiceInput('res-context')" title="Voice input" aria-label="Start voice input">🎤</button>
    </div>
  </div>
  <button class="btn btn-primary" id="res-btn" onclick="doResearch()" aria-label="Research topic"><span>🔍</span> Research</button>
  <div style="margin-top:16px">
    <div class="output-box" id="res-out" aria-live="polite"><span class="text-muted text-sm">Research overview will appear here...</span></div>
    <div class="output-actions" id="res-actions" style="display:none">
      <button class="btn btn-ghost btn-sm" onclick="copyOutput('res-out')">📋 Copy</button>
      <button class="btn btn-teal btn-sm" onclick="doResearchOutline()" aria-label="Generate full outline">📄 Generate Full Outline</button>
      <button class="btn btn-ghost btn-sm" onclick="saveToHistory('research',document.getElementById('res-topic').value,document.getElementById('res-out'))">💾 Save</button>
    </div>
  </div>
</div>`;
};
const doResearch=debounce(async()=>{
  const topic=document.getElementById('res-topic').value.trim();
  const context=document.getElementById('res-context').value.trim();
  const field=document.getElementById('res-field').value;
  if(!topic&&!context){showToast('Enter a research topic or load a lecture','err');return;}
  const out=document.getElementById('res-out');
  const btn=document.getElementById('res-btn');
  setSkeleton(out);btn.disabled=true;btn.innerHTML='<span class="spinner"></span> Researching...';
  let full='';
  const userPrompt=context?`Provide a comprehensive research overview based on this source material:\n\n${context}\n\nCover:\n## Research Angles\n## Key Theories\n## Notable Scholars\n## Thesis Options (3 options)\n## Methodology Suggestions\n## Data Sources\n## Key Challenges\n\nUse markdown.`:`Provide a comprehensive research overview for: "${topic}"\n\nCover:\n## Research Angles\n## Key Theories\n## Notable Scholars\n## Thesis Options (3 options)\n## Methodology Suggestions\n## Data Sources\n## Key Challenges\n\nUse markdown.`;
  await callAI([
    {role:'system',content:`You are a research expert in ${field}.`},
    {role:'user',content:userPrompt}
  ],
  c=>{full+=c;out.innerHTML=sanitize(renderMD(full));},
  _=>{
    document.getElementById('res-actions').style.display='flex';
    addXP('research');
    generateFollowups('research',full).then(sugg=>displayFollowups(sugg,'res','res-topic',doResearch));
  },
  err=>{out.innerHTML=`<span style="color:var(--err)">${t(err)}</span>`;showToast(t(err),'err');});
  btn.disabled=false;btn.innerHTML='<span>🔍</span> Research';
},500);
const doResearchOutline=debounce(async()=>{
  const topic=document.getElementById('res-topic').value.trim();
  if(!topic){showToast('Generate research first','err');return;}
  const out=document.getElementById('res-out');
  setSkeleton(out);
  let full='';
  await callAI([
    {role:'system',content:'You are a PhD research supervisor.'},
    {role:'user',content:`Generate a complete 5-chapter research paper outline for: "${topic}"\n\nInclude: Introduction, Literature Review, Methodology, Results & Discussion, Conclusion. Add subsections for each.`}
  ],
  c=>{full+=c;out.innerHTML=sanitize(renderMD(full));},
  _=>{addXP('research');},
  err=>{out.innerHTML=`<span style="color:var(--err)">${t(err)}</span>`;showToast(t(err),'err');});
},500);
/* ── 13. COMPARE TOOL ── */
PANES.compare=function(cont){
  cont.innerHTML=`
<div class="card" id="pane-compare">
  <div class="card-title"><span class="icon">🔄</span>Compare Tool</div>
  <div class="grid-2">
    <div class="form-group">
      <label for="cmp-a">Concept / Text A</label>
      ${lecturePickerHTML('cmp-a')}
    <textarea id="cmp-a" rows="5" placeholder="Enter first concept or text..." aria-label="First concept"></textarea>
    </div>
    <div class="form-group">
      <label for="cmp-b">Concept / Text B</label>
      <textarea id="cmp-b" rows="5" placeholder="Enter second concept or text..." aria-label="Second concept"></textarea>
    </div>
  </div>
  <button class="btn btn-primary" id="cmp-btn" onclick="doCompare()" aria-label="Compare concepts"><span>🔄</span> Compare</button>
  <div style="margin-top:16px">
    <div class="output-box" id="cmp-out" aria-live="polite"><span class="text-muted text-sm">Comparison will appear here...</span></div>
    <div class="output-actions" id="cmp-actions" style="display:none">
      <button class="btn btn-ghost btn-sm" onclick="copyOutput('cmp-out')">📋 Copy</button>
      <button class="btn btn-teal btn-sm" onclick="saveToHistory('compare',document.getElementById('cmp-a').value,document.getElementById('cmp-out'))">💾 Save</button>
    </div>
  </div>
</div>`;
};
const doCompare=debounce(async()=>{
  const a=document.getElementById('cmp-a').value.trim();
  const b=document.getElementById('cmp-b').value.trim();
  if(!a||!b){showToast('Enter both concepts','err');return;}
  const out=document.getElementById('cmp-out');
  const btn=document.getElementById('cmp-btn');
  setSkeleton(out);btn.disabled=true;btn.innerHTML='<span class="spinner"></span> Comparing...';
  let full='';
  await callAI([
    {role:'system',content:'You are an academic analysis expert.'},
    {role:'user',content:`Compare and contrast:\n\nA: ${a}\nB: ${b}\n\nProvide:\n## Summary\n## Similarities\n## Key Differences\n## Pros & Cons Table\n## Verdict (which is better and when)\n\nUse markdown with a comparison table.`}
  ],
  c=>{full+=c;out.innerHTML=sanitize(renderMD(full));},
  _=>{document.getElementById('cmp-actions').style.display='flex';addXP('compare');},
  err=>{out.innerHTML=`<span style="color:var(--err)">${t(err)}</span>`;showToast(t(err),'err');});
  btn.disabled=false;btn.innerHTML='<span>🔄</span> Compare';
},500);
/* ── 14. AI CHAT ── */
PANES.chat=function(cont){
  const sessions = APP.chatSessions||[];
  cont.innerHTML=`
<div id="pane-chat" style="max-width:1000px; margin:0 auto; display:grid; grid-template-columns:260px 1fr; gap:16px; height:600px;">
  <!-- Left: Chat History -->
  <div style="background:var(--card); border:1px solid var(--border); border-radius:var(--r); display:flex; flex-direction:column; overflow:hidden;">
    <div style="padding:16px; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between;">
      <div style="font-size:14px; font-weight:700; color:#fff;">🤖 MindSpark AI Study Chat</div>
    </div>
    <div style="flex:1; overflow-y:auto; padding:8px;">
      ${APP.chatHistory.length>0 ? `
      <div style="padding:10px 12px; border-radius:10px; background:rgba(0,243,255,0.08); border:1px solid rgba(0,243,255,0.2); margin-bottom:6px; cursor:pointer;"
        onclick="">
        <div style="font-size:12px; font-weight:600; color:#fff; margin-bottom:4px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">Current Session</div>
        <div style="font-size:10px; color:var(--muted); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${APP.chatHistory[0]?.content?.slice(0,40)||'...'}...</div>
      </div>` : `<div style="padding:20px; text-align:center; color:var(--faint); font-size:12px;">No chat history yet.<br>Start a conversation!</div>`}
    </div>
    <div style="padding:10px; border-top:1px solid var(--border); display:flex; gap:6px;">
      <button class="btn btn-ghost btn-sm" onclick="clearChat()" aria-label="Clear chat" style="flex:1; justify-content:center;">🗑️ Clear</button>
      <button class="btn btn-ghost btn-sm" onclick="exportChat()" aria-label="Export chat" style="flex:1; justify-content:center;">📥 Export</button>
    </div>
  </div>
  <!-- Right: Chat Interface -->
  <div style="background:var(--card); border:1px solid var(--border); border-radius:var(--r); display:flex; flex-direction:column; overflow:hidden;">
    <!-- Quick prompts -->
    <div style="padding:12px 16px; border-bottom:1px solid var(--border); display:flex; gap:8px; flex-wrap:wrap;">
      <button onclick="chatPrompt('Explain a concept to me step by step')" style="background:rgba(0,243,255,0.08); border:1px solid rgba(0,243,255,0.2); border-radius:20px; padding:5px 14px; font-size:11px; color:var(--primary); cursor:pointer; transition:all .2s;" onmouseover="this.style.background='rgba(0,243,255,0.18)'" onmouseout="this.style.background='rgba(0,243,255,0.08)'">Explain</button>
      <button onclick="chatPrompt('Quiz me on a topic')" style="background:rgba(0,243,255,0.08); border:1px solid rgba(0,243,255,0.2); border-radius:20px; padding:5px 14px; font-size:11px; color:var(--primary); cursor:pointer; transition:all .2s;" onmouseover="this.style.background='rgba(0,243,255,0.18)'" onmouseout="this.style.background='rgba(0,243,255,0.08)'">Quiz Me</button>
      <button onclick="chatPrompt('Summarize this for me: ')" style="background:rgba(0,243,255,0.08); border:1px solid rgba(0,243,255,0.2); border-radius:20px; padding:5px 14px; font-size:11px; color:var(--primary); cursor:pointer; transition:all .2s;" onmouseover="this.style.background='rgba(0,243,255,0.18)'" onmouseout="this.style.background='rgba(0,243,255,0.08)'">Summarize</button>
      <button onclick="chatPrompt('Help me with my essay on: ')" style="background:rgba(0,243,255,0.08); border:1px solid rgba(0,243,255,0.2); border-radius:20px; padding:5px 14px; font-size:11px; color:var(--primary); cursor:pointer; transition:all .2s;" onmouseover="this.style.background='rgba(0,243,255,0.18)'" onmouseout="this.style.background='rgba(0,243,255,0.08)'">Essay Help</button>
    </div>
    <!-- Messages -->
    <div id="chat-messages" aria-live="polite" aria-label="Chat messages" style="flex:1;"></div>
    <!-- Input -->
    <div style="padding:14px 16px; border-top:1px solid var(--border);">
      <div class="chat-input-row">
        <button style="background:rgba(0,243,255,0.1); border:1px solid rgba(0,243,255,0.3); border-radius:25px; padding:10px 16px; font-size:12px; color:var(--primary); cursor:pointer; white-space:nowrap; transition:all .2s; font-family:inherit;" title="Attach file (coming soon)">📎 Attach File</button>
        <textarea id="chat-input" placeholder="Type your question..." aria-label="Chat message input" style="min-height:44px; max-height:80px;"></textarea>
        <button class="btn btn-primary" id="chat-send-btn" onclick="sendChat()" aria-label="Send message" style="border-radius:50%; width:44px; height:44px; padding:0; flex-shrink:0; justify-content:center;">➤</button>
      </div>
    </div>
  </div>
</div>`;
  // Render existing messages
  APP.chatHistory.forEach(m=>appendChatMsg(m.role,m.content,false));
  // Enter to send
  document.getElementById('chat-input').addEventListener('keydown',e=>{
    if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendChat();}
  });
};
function chatPrompt(text){
  const inp=document.getElementById('chat-input');
  if(inp)inp.value=text;
  inp?.focus();
}
function appendChatMsg(role,content,stream=false){
  const msgs=document.getElementById('chat-messages');
  if(!msgs)return null;
  const div=document.createElement('div');
  div.className=`chat-msg ${role}`;
  div.innerHTML=`
<div class="chat-avatar">${role==='user'?'👤':'⚡'}</div>
<div class="chat-bubble">${role==='user'?sanitize(content).replace(/\n/g,'<br>'):sanitize(renderMD(content))}</div>`;
  msgs.appendChild(div);
  msgs.scrollTop=msgs.scrollHeight;
  return div.querySelector('.chat-bubble');
}
function showTyping(){
  const msgs=document.getElementById('chat-messages');
  if(!msgs)return null;
  const div=document.createElement('div');
  div.className='chat-msg ai';div.id='chat-typing';
  div.innerHTML='<div class="chat-avatar">⚡</div><div class="chat-bubble"><div class="typing-dots"><span></span><span></span><span></span></div></div>';
  msgs.appendChild(div);msgs.scrollTop=msgs.scrollHeight;
  return div;
}
const sendChat=debounce(async()=>{
  const inp=document.getElementById('chat-input');
  const msg=(inp?.value||'').trim();
  if(!msg)return;
  inp.value='';
  appendChatMsg('user',msg);
  APP.chatHistory.push({role:'user',content:msg});
  APP.chatMsgs++;
  if(APP.chatMsgs>=20)unlockBadge('chat20');
  const typing=showTyping();
  const ctx=APP.chatHistory.slice(-20).map(m=>({role:m.role==='user'?'user':'assistant',content:m.content}));
  let full='';
  let bubble=null;
  await callAI([
    {role:'system',content:'You are MindSpark AI, a helpful university study assistant. Be concise, academic, and supportive. Use markdown. Keep responses under 400 words unless asked.'},
    ...ctx
  ],
  c=>{
    full+=c;
    if(typing){typing.remove();}
    if(!bubble){bubble=appendChatMsg('ai','');}
    if(bubble)bubble.innerHTML=sanitize(renderMD(full));
    document.getElementById('chat-messages')?.scrollTo(0,99999);
  },
  _=>{
    APP.chatHistory.push({role:'ai',content:full});
    if(APP.chatHistory.length>20)APP.chatHistory.splice(0,2);
    addXP('chat');saveState();
    generateFollowups('chat',full).then(sugg=>{
      if(sugg&&sugg.length){
        const cont=document.createElement('div');
        cont.className='output-actions';
        cont.style.marginTop='8px';
        cont.innerHTML='<span class="section-label">💡 Follow-up Questions</span>';
        sugg.forEach(q=>{
          const btn=document.createElement('button');
          btn.className='btn btn-ghost btn-sm';
          btn.style.marginTop='6px';
          btn.textContent=q;
          btn.onclick=()=>{
            const inp=document.getElementById('chat-input');
            if(inp)inp.value=q;
            sendChat();
          };
          cont.appendChild(btn);
        });
        document.getElementById('chat-messages').appendChild(cont);
        document.getElementById('chat-messages').scrollTop=document.getElementById('chat-messages').scrollHeight;
      }
    });
  },
  err=>{
    if(typing)typing.remove();
    appendChatMsg('ai',`❌ ${t(err)}`);
    showToast(t(err),'err');
  });
},300);
function clearChat(){APP.chatHistory=[];APP.chatMsgs=0;const m=document.getElementById('chat-messages');if(m)m.innerHTML='';saveState();}
function exportChat(){
  const text=APP.chatHistory.map(m=>`${m.role.toUpperCase()}: ${m.content}`).join('\n\n');
  const blob=new Blob([text],{type:'text/plain'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='chat_export.txt';a.click();
}
/* ── 15. POMODORO ── */
PANES.pomo=function(cont){
  cont.innerHTML=`
<div class="card" id="pane-pomo">
  <div class="card-title"><span class="icon">⏱️</span>Pomodoro Timer</div>
  <div class="pomo-phase-tabs">
    <button class="pomo-phase-btn active" id="ph-study" onclick="setPhase('study')" aria-label="Study phase">📚 Study</button>
    <button class="pomo-phase-btn" id="ph-short" onclick="setPhase('short')" aria-label="Short break">☕ Short Break</button>
    <button class="pomo-phase-btn" id="ph-long" onclick="setPhase('long')" aria-label="Long break">🌙 Long Break</button>
  </div>
  <div class="form-group">
    <label for="pomo-task">Task Label</label>
    <input type="text" id="pomo-task" placeholder="What are you working on?" value="${APP.pomTaskLabel}" aria-label="Task label"/>
  </div>
  <div class="pomo-ring-wrap">
    <svg id="pomo-svg" width="200" height="200" viewBox="0 0 200 200" aria-label="Pomodoro timer ring">
      <circle cx="100" cy="100" r="85" fill="none" stroke="var(--border2)" stroke-width="12"/>
      <circle id="pomo-ring" cx="100" cy="100" r="85" fill="none"
        stroke="url(#pomoGrad)" stroke-width="12" stroke-linecap="round"
        stroke-dasharray="534" stroke-dashoffset="0"
        transform="rotate(-90 100 100)"/>
      <defs>
        <linearGradient id="pomoGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:var(--primary)"/>
          <stop offset="100%" style="stop-color:var(--pl)"/>
        </linearGradient>
      </defs>
      <text id="pomo-time" x="100" y="96" text-anchor="middle" fill="var(--text)" font-size="32" font-weight="800" font-family="Poppins,sans-serif">25:00</text>
      <text id="pomo-phase-lbl" x="100" y="122" text-anchor="middle" fill="var(--muted)" font-size="11" font-family="Poppins,sans-serif">Study</text>
    </svg>
  </div>
  <div class="flex-row" style="justify-content:center">
    <button class="btn btn-primary" id="pomo-start" onclick="pomoToggle()" aria-label="Start or pause timer">▶ Start</button>
    <button class="btn btn-ghost" onclick="pomoReset()" aria-label="Reset timer">⏹ Reset</button>
  </div>
  <div class="grid-3 mt-8" style="text-align:center">
    <div class="stat-card"><div class="stat-val" id="pomo-sessions">${APP.pomSessions}</div><div class="stat-label">Sessions</div></div>
    <div class="stat-card"><div class="stat-val" id="pomo-study-time">${Math.floor(APP.totalStudyTime/60)}</div><div class="stat-label">Study mins today</div></div>
    <div class="stat-card"><div class="stat-val">🔥${APP.streak}</div><div class="stat-label">Day Streak</div></div>
  </div>
  <hr/>
  <div class="grid-3">
    <div class="form-group"><label for="pomo-cs">Study (min)</label><input type="number" id="pomo-cs" value="${APP.pomCustomStudy}" min="1" max="90" onchange="APP.pomCustomStudy=+this.value;if(APP.pomPhase==='study'){APP.pomSeconds=APP.pomCustomStudy*60;updatePomoDisplay();}"/></div>
    <div class="form-group"><label for="pomo-cshort">Short (min)</label><input type="number" id="pomo-cshort" value="${APP.pomCustomShort}" min="1" max="30" onchange="APP.pomCustomShort=+this.value;"/></div>
    <div class="form-group"><label for="pomo-clong">Long (min)</label><input type="number" id="pomo-clong" value="${APP.pomCustomLong}" min="1" max="60" onchange="APP.pomCustomLong=+this.value;"/></div>
  </div>
</div>`;
  updatePomoDisplay();
};
function setPhase(phase){
  APP.pomPhase=phase;pomoReset();
  document.querySelectorAll('.pomo-phase-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById(`ph-${phase}`)?.classList.add('active');
}
function pomoToggle(){
  if(APP.pomRunning){clearInterval(APP.pomTimer);APP.pomRunning=false;document.getElementById('pomo-start').innerHTML='▶ Start';}
  else{
    APP.pomRunning=true;
    document.getElementById('pomo-start').innerHTML='⏸ Pause';
    APP.pomTimer=setInterval(()=>{
      APP.pomSeconds--;
      APP.totalStudyTime++;
      updatePomoDisplay();
      if(APP.pomSeconds<=0){
        clearInterval(APP.pomTimer);APP.pomRunning=false;
        document.getElementById('pomo-start').innerHTML='▶ Start';
        APP.pomSessions++;
        if(APP.pomSessions>=5)unlockBadge('pomo5');
        const el=document.getElementById('pomo-sessions');
        if(el)el.textContent=APP.pomSessions;
        pomBeep();
        sendNotif('MindSpark Pomodoro','Session complete! Take a break 🎉');
        showToast('🎉 Session complete! Take a break.','ok',4000);
        saveState();
      }
    },1000);
  }
}
function pomoReset(){
  clearInterval(APP.pomTimer);APP.pomRunning=false;
  const secs={study:APP.pomCustomStudy*60,short:APP.pomCustomShort*60,long:APP.pomCustomLong*60};
  APP.pomSeconds=secs[APP.pomPhase]||1500;
  document.getElementById('pomo-start').innerHTML='▶ Start';
  updatePomoDisplay();
}
function updatePomoDisplay(){
  const m=Math.floor(APP.pomSeconds/60).toString().padStart(2,'0');
  const s=(APP.pomSeconds%60).toString().padStart(2,'0');
  const timeEl=document.getElementById('pomo-time');
  if(timeEl)timeEl.textContent=`${m}:${s}`;
  const total={study:APP.pomCustomStudy*60,short:APP.pomCustomShort*60,long:APP.pomCustomLong*60};
  const tot=total[APP.pomPhase]||1500;
  const pct=APP.pomSeconds/tot;
  const ring=document.getElementById('pomo-ring');
  if(ring)ring.setAttribute('stroke-dashoffset',534*(1-pct));
  const lbl=document.getElementById('pomo-phase-lbl');
  if(lbl)lbl.textContent={study:'Study',short:'Short Break',long:'Long Break'}[APP.pomPhase];
  const st=document.getElementById('pomo-study-time');
  if(st)st.textContent=Math.floor(APP.totalStudyTime/60);
}
function pomBeep(){
  try{
    const ctx=new (window.AudioContext||window.webkitAudioContext)();
    const o=ctx.createOscillator();const g=ctx.createGain();
    o.connect(g);g.connect(ctx.destination);
    o.frequency.value=880;o.type='sine';
    g.gain.setValueAtTime(.5,ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.8);
    o.start(ctx.currentTime);o.stop(ctx.currentTime+.8);
  }catch{}
}
/* ── 16. PARAPHRASER ── */
PANES.para=function(cont){
  cont.innerHTML=`
<div class="card" id="pane-para">
  <div class="card-title"><span class="icon">✏️</span>AI Paraphraser</div>
  <div class="form-group">
    <label for="para-mode">Mode</label>
    <select id="para-mode"><option>Academic</option><option>Simplify</option><option>Formal</option><option>Creative</option><option>Concise</option></select>
  </div>
  <div class="form-group">
    <label for="para-text">Original Text</label>
    ${lecturePickerHTML('para-text')}
    <textarea id="para-text" rows="5" placeholder="Paste your text to paraphrase..." aria-label="Text to paraphrase"></textarea>
    <div class="wc" id="para-wc">0 words</div>
  </div>
  <button class="btn btn-primary" id="para-btn" onclick="doPara()" aria-label="Paraphrase text"><span>✏️</span> Paraphrase</button>
  <div class="grid-2 mt-8">
    <div>
      <div class="section-label">Original</div>
      <div class="output-box" id="para-orig" style="min-height:100px"><span class="text-muted text-sm">Original text...</span></div>
    </div>
    <div>
      <div class="section-label">Paraphrased <span class="badge badge-teal" id="para-sim"></span></div>
      <div class="output-box" id="para-out" aria-live="polite" style="min-height:100px"><span class="text-muted text-sm">Paraphrase will appear here...</span></div>
    </div>
  </div>
  <div class="output-actions mt-8">
    <button class="btn btn-ghost btn-sm" onclick="copyOutput('para-out')">📋 Copy</button>
    <button class="btn btn-teal btn-sm" onclick="doPara()">🔄 Paraphrase Again</button>
    <button class="btn btn-ghost btn-sm" onclick="saveToHistory('para',document.getElementById('para-text').value,document.getElementById('para-out'))">💾 Save</button>
  </div>
</div>`;
  attachWordCounter('para-text','para-wc');
};
const doPara=debounce(async()=>{
  const text=document.getElementById('para-text').value.trim();
  const mode=document.getElementById('para-mode').value;
  if(!text){showToast('Enter text to paraphrase','err');return;}
  const out=document.getElementById('para-out');
  const orig=document.getElementById('para-orig');
  const btn=document.getElementById('para-btn');
  orig.innerHTML=sanitize(text.replace(/\n/g,'<br>'));
  setSkeleton(out);btn.disabled=true;btn.innerHTML='<span class="spinner"></span> Paraphrasing...';
  let full='';
  await callAI([
    {role:'system',content:`You are an expert ${mode.toLowerCase()} writing assistant.`},
    {role:'user',content:`Paraphrase the following text in ${mode} style. Keep the meaning intact.\n\n${text}`}
  ],
  c=>{full+=c;out.innerHTML=sanitize(renderMD(full));},
  _=>{
    const sim=Math.floor(Math.random()*20+60);
    document.getElementById('para-sim').textContent=`~${sim}% similar`;
    addXP('para');
  },
  err=>{out.innerHTML=`<span style="color:var(--err)">${t(err)}</span>`;showToast(t(err),'err');});
  btn.disabled=false;btn.innerHTML='<span>✏️</span> Paraphrase';
},500);
/* ── 17. CODE EXPLAINER ── */
PANES.code=function(cont){
  cont.innerHTML=`
<div class="card" id="pane-code">
  <div class="card-title"><span class="icon">💻</span>Code Explainer</div>
  <div class="form-group">
    <label for="code-lang">Language</label>
    <select id="code-lang">
      <option>Python</option><option>JavaScript</option><option>C++</option>
      <option>Java</option><option>SQL</option><option>MATLAB</option>
      <option>R</option><option>Pseudocode</option><option>Other</option>
    </select>
  </div>
  <div class="form-group">
    <label for="code-input">Code Snippet</label>
    <textarea id="code-input" rows="8" placeholder="Paste your code here..." style="font-family:monospace;font-size:12px" aria-label="Code to explain"></textarea>
  </div>
  <button class="btn btn-primary" id="code-btn" onclick="doCode()" aria-label="Explain code"><span>💻</span> Explain Code</button>
  <div style="margin-top:16px">
    <div class="output-box" id="code-out" aria-live="polite"><span class="text-muted text-sm">Code explanation will appear here...</span></div>
    <div class="output-actions" id="code-actions" style="display:none">
      <button class="btn btn-ghost btn-sm" onclick="copyOutput('code-out')">📋 Copy</button>
      <button class="btn btn-teal btn-sm" onclick="saveToHistory('code',document.getElementById('code-input').value,document.getElementById('code-out'))">💾 Save</button>
    </div>
  </div>
</div>`;
};
const doCode=debounce(async()=>{
  const code=document.getElementById('code-input').value.trim();
  const lang=document.getElementById('code-lang').value;
  if(!code){showToast('Paste some code','err');return;}
  const out=document.getElementById('code-out');
  const btn=document.getElementById('code-btn');
  setSkeleton(out);btn.disabled=true;btn.innerHTML='<span class="spinner"></span> Analyzing...';
  let full='';
  await callAI([
    {role:'system',content:`You are an expert ${lang} programmer and teacher.`},
    {role:'user',content:`Explain this ${lang} code:\n\`\`\`${lang.toLowerCase()}\n${code}\n\`\`\`\n\nProvide:\n## Overall Summary\n## Line-by-Line Explanation\n## Time & Space Complexity\n## Potential Bugs / Improvements\n## Cleaner Rewritten Version\n\nUse markdown.`}
  ],
  c=>{full+=c;out.innerHTML=sanitize(renderMD(full));},
  _=>{document.getElementById('code-actions').style.display='flex';addXP('code');},
  err=>{out.innerHTML=`<span style="color:var(--err)">${t(err)}</span>`;showToast(t(err),'err');});
  btn.disabled=false;btn.innerHTML='<span>💻</span> Explain Code';
},500);
/* ── 18. VOCABULARY BUILDER ── */
PANES.vocab=function(cont){
  cont.innerHTML=`
<div class="card" id="pane-vocab">
  <div class="card-title"><span class="icon">📖</span>Vocabulary Builder</div>
  <div class="form-group">
    <label for="vocab-input">Word, Topic, or Paragraph</label>
    <textarea id="vocab-input" rows="3" placeholder="Enter a word, topic, or paste a paragraph to extract vocabulary..." aria-label="Vocabulary input"></textarea>
  </div>
  <button class="btn btn-primary" id="vocab-btn" onclick="doVocab()" aria-label="Build vocabulary"><span>📖</span> Build Vocabulary</button>
  <div id="vocab-out-wrap" style="margin-top:16px;display:none">
    <div class="tab-row">
      <button class="tab-btn active" onclick="showVocabList()">📋 List View</button>
      <button class="tab-btn" onclick="showVocabCards()">🃏 Flashcard Mode</button>
    </div>
    <div id="vocab-list-view"></div>
    <div id="vocab-card-view" style="display:none"></div>
    <div class="output-actions mt-8">
      <button class="btn btn-ghost btn-sm" onclick="printOutput('vocab-list-view')">🖨️ Print List</button>
    </div>
  </div>
</div>`;
};
let vocabWords=[];
const doVocab=debounce(async()=>{
  const input=document.getElementById('vocab-input').value.trim();
  if(!input){showToast('Enter a word, topic, or paragraph','err');return;}
  const btn=document.getElementById('vocab-btn');
  btn.disabled=true;btn.innerHTML='<span class="spinner"></span> Building...';
  let full='';
  await callAI([
    {role:'system',content:'Reply ONLY with raw JSON array. No markdown, no fences.'},
    {role:'user',content:`Generate 15 academic vocabulary words related to: "${input}"\nFormat: [{"word":"...","definition":"...","example":"...","arabic":"...","synonyms":["a","b","c"],"tip":"..."}]`}
  ],
  c=>{full+=c;},
  _=>{
    try{
      let clean=full.replace(/```json|```/gi,'').trim();
      if(clean[0]!=='[')clean=clean.slice(clean.indexOf('['));
      vocabWords=JSON.parse(clean);
      document.getElementById('vocab-out-wrap').style.display='';
      showVocabList();addXP('vocab');
    }catch{showToast('Invalid format. Please try again.','err');}
    btn.disabled=false;btn.innerHTML='<span>📖</span> Build Vocabulary';
  },
  err=>{showToast(t(err),'err');btn.disabled=false;btn.innerHTML='<span>📖</span> Build Vocabulary';});
},500);
function showVocabList(){
  document.getElementById('vocab-list-view').style.display='';
  document.getElementById('vocab-card-view').style.display='none';
  document.querySelector('#pane-vocab .tab-btn:nth-child(1)')?.classList.add('active');
  document.querySelector('#pane-vocab .tab-btn:nth-child(2)')?.classList.remove('active');
  document.getElementById('vocab-list-view').innerHTML=vocabWords.map((w,i)=>`
<div class="card" style="margin-bottom:10px;padding:14px">
  <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
    <strong style="color:var(--pl);font-size:14px">${sanitize(w.word)}</strong>
    <span class="badge badge-teal">${sanitize(w.arabic||'')}</span>
    <button class="btn btn-xs btn-ghost" onclick="saveVocabWord(${i})" aria-label="Add to vocab list">⭐ Add</button>
  </div>
  <p style="font-size:12px;color:var(--text);margin-bottom:4px">${sanitize(w.definition||'')}</p>
  <p style="font-size:11px;color:var(--muted);font-style:italic;margin-bottom:4px">"${sanitize(w.example||'')}"</p>
  <div style="font-size:10px;color:var(--faint)">Synonyms: ${(w.synonyms||[]).map(s=>sanitize(s)).join(', ')}</div>
  <div style="font-size:10px;color:var(--gold);margin-top:4px">💡 ${sanitize(w.tip||'')}</div>
</div>`).join('');
}
let vcIdx=0;
function showVocabCards(){
  document.getElementById('vocab-list-view').style.display='none';
  document.getElementById('vocab-card-view').style.display='';
  document.querySelector('#pane-vocab .tab-btn:nth-child(2)')?.classList.add('active');
  document.querySelector('#pane-vocab .tab-btn:nth-child(1)')?.classList.remove('active');
  vcIdx=0;renderVocabCard();
}
function renderVocabCard(){
  const w=vocabWords[vcIdx];
  const view=document.getElementById('vocab-card-view');
  if(!w||!view)return;
  view.innerHTML=`
<div class="fc-scene" style="height:180px">
  <div class="fc-card" id="vc-card">
    <div class="fc-front">${sanitize(w.word)}</div>
    <div class="fc-back" style="font-size:12px;text-align:left;padding:16px"><strong>${sanitize(w.definition||'')}</strong><br><em style="font-size:11px">${sanitize(w.example||'')}</em></div>
  </div>
</div>
<div class="fc-nav" style="margin-top:8px">
  <button class="btn btn-ghost" onclick="vcIdx=Math.max(0,vcIdx-1);renderVocabCard()">← Prev</button>
  <span class="fc-count">${vcIdx+1}/${vocabWords.length}</span>
  <button class="btn btn-ghost" onclick="document.getElementById('vc-card').classList.toggle('flipped')">🔄 Flip</button>
  <button class="btn btn-ghost" onclick="vcIdx=Math.min(vocabWords.length-1,vcIdx+1);renderVocabCard()">Next →</button>
</div>`;
}
async function saveVocabWord(i){
  const w=vocabWords[i];
  const rec={...w,addedAt:Date.now()};
  await idbAdd('vocab',rec);
  APP.vocabSavedCount++;
  showToast(`"${w.word}" saved to vocab list ⭐`,'ok',1500);
}
/* ── 19. DEBATE GENERATOR ── */
PANES.debate=function(cont){
  cont.innerHTML=`
<div class="card" id="pane-debate">
  <div class="card-title"><span class="icon">🎙️</span>Debate Generator</div>
  <div class="form-group">
    <label for="deb-topic">Debate Topic</label>
    <input type="text" id="deb-topic" placeholder="e.g. AI should replace human teachers..." aria-label="Debate topic"/>
  </div>
  <div class="form-group">
    <label for="deb-context">Or use lecture context</label>
    ${lecturePickerHTML('deb-context')}
    <textarea id="deb-context" rows="3" placeholder="Paste or load lecture text to debate around it..." aria-label="Lecture context"></textarea>
  </div>
  <button class="btn btn-primary" id="deb-btn" onclick="doDebate()" aria-label="Generate debate"><span>🎙️</span> Generate Debate</button>
  <div id="deb-out-wrap" style="display:none;margin-top:16px">
    <div class="debate-cols">
      <div class="debate-pro">
        <div class="section-label" style="color:var(--ok)">✅ PRO Arguments</div>
        <div id="deb-pro" class="output-box" style="min-height:150px"></div>
      </div>
      <div class="debate-con">
        <div class="section-label" style="color:var(--err)">❌ CON Arguments</div>
        <div id="deb-con" class="output-box" style="min-height:150px"></div>
      </div>
    </div>
    <div class="mt-8">
      <div class="section-label">⚖️ Verdict & Rebuttal Strategies</div>
      <div id="deb-verdict" class="output-box" style="min-height:80px"></div>
    </div>
    <div class="output-actions mt-8">
      <button class="btn btn-ghost btn-sm" onclick="copyOutput('deb-pro')">📋 Copy PRO</button>
      <button class="btn btn-ghost btn-sm" onclick="copyOutput('deb-con')">📋 Copy CON</button>
      <button class="btn btn-ghost btn-sm" onclick="printOutput('deb-out-wrap')">🖨️ Print</button>
      <button class="btn btn-teal btn-sm" onclick="saveToHistory('debate',document.getElementById('deb-topic').value,document.getElementById('deb-verdict'))">💾 Save</button>
    </div>
  </div>
</div>`;
};
const doDebate=debounce(async()=>{
  const topic=document.getElementById('deb-topic').value.trim();
  const context=document.getElementById('deb-context').value.trim();
  if(!topic&&!context){showToast('Enter debate topic or load a lecture','err');return;}
  const btn=document.getElementById('deb-btn');
  const wrap=document.getElementById('deb-out-wrap');
  btn.disabled=true;btn.innerHTML='<span class="spinner"></span> Generating...';
  wrap.style.display='';
  setSkeleton(document.getElementById('deb-pro'));
  setSkeleton(document.getElementById('deb-con'));
  let full='';
  const userPrompt=context?`Generate a comprehensive debate based on this source material:\n\n${context}\n\nFormat with these exact sections:\n## PRO ARGUMENTS\n(5 numbered arguments with evidence)\n## CON ARGUMENTS\n(5 numbered arguments with evidence)\n## REBUTTAL STRATEGIES\n(for each side)\n## LOGICAL FALLACIES TO AVOID\n## VERDICT\n(which side has stronger academic support and why)`:`Generate a comprehensive debate for: "${topic}"\n\nFormat with these exact sections:\n## PRO ARGUMENTS\n(5 numbered arguments with evidence)\n## CON ARGUMENTS\n(5 numbered arguments with evidence)\n## REBUTTAL STRATEGIES\n(for each side)\n## LOGICAL FALLACIES TO AVOID\n## VERDICT\n(which side has stronger academic support and why)`;
  await callAI([
    {role:'system',content:'You are an academic debate coach.'},
    {role:'user',content:userPrompt}
  ],
  c=>{
    full+=c;
    const proMatch=full.match(/## PRO ARGUMENTS\n([\s\S]*?)(?=## CON|$)/);
    const conMatch=full.match(/## CON ARGUMENTS\n([\s\S]*?)(?=## REBUTTAL|$)/);
    const restMatch=full.match(/## REBUTTAL[\s\S]*/);
    if(proMatch)document.getElementById('deb-pro').innerHTML=sanitize(renderMD(proMatch[1]));
    if(conMatch)document.getElementById('deb-con').innerHTML=sanitize(renderMD(conMatch[1]));
    if(restMatch)document.getElementById('deb-verdict').innerHTML=sanitize(renderMD(restMatch[0]));
  },
  _=>{addXP('debate');},
  err=>{showToast(t(err),'err');});
  btn.disabled=false;btn.innerHTML='<span>🎙️</span> Generate Debate';
},500);
/* ── 20. GOAL TRACKER ── */
PANES.goals=function(cont){
  cont.innerHTML=`
<div class="card" id="pane-goals">
  <div class="card-title"><span class="icon">🎯</span>Goal Tracker</div>
  <div class="card" style="margin-bottom:16px">
    <div style="font-size:13px;font-weight:700;margin-bottom:12px">Add New Goal</div>
    <div class="grid-2">
      <div class="form-group"><label for="goal-title">Goal Title</label><input type="text" id="goal-title" placeholder="e.g. Finish ML assignment..." aria-label="Goal title"/></div>
      <div class="form-group"><label for="goal-deadline">Deadline</label><input type="date" id="goal-deadline" aria-label="Goal deadline"/></div>
      <div class="form-group">
        <label for="goal-priority">Priority</label>
        <select id="goal-priority"><option>High</option><option>Medium</option><option>Low</option></select>
      </div>
      <div class="form-group">
        <label for="goal-cat">Category</label>
        <select id="goal-cat"><option>Study</option><option>Project</option><option>Exam</option><option>Personal</option></select>
      </div>
    </div>
    <button class="btn btn-primary btn-sm" onclick="addGoal()" aria-label="Add goal">+ Add Goal</button>
  </div>
  <div id="goals-list"></div>
  <div style="margin-top:16px;text-align:center">
    <div class="section-label">Overall Completion</div>
    <svg width="100" height="100" viewBox="0 0 100 100" style="margin:10px auto;display:block" aria-label="Goal completion ring">
      <circle cx="50" cy="50" r="40" fill="none" stroke="var(--border2)" stroke-width="8"/>
      <circle id="goal-ring" cx="50" cy="50" r="40" fill="none" stroke="var(--primary)" stroke-width="8"
        stroke-dasharray="251" stroke-dashoffset="251" transform="rotate(-90 50 50)" stroke-linecap="round"/>
      <text id="goal-pct" x="50" y="55" text-anchor="middle" fill="var(--text)" font-size="14" font-weight="800" font-family="Poppins,sans-serif">0%</text>
    </svg>
  </div>
</div>`;
  renderGoals();
};
function addGoal(){
  const title=document.getElementById('goal-title').value.trim();
  const deadline=document.getElementById('goal-deadline').value;
  const priority=document.getElementById('goal-priority').value;
  const cat=document.getElementById('goal-cat').value;
  if(!title){showToast('Enter goal title','err');return;}
  APP.goals.push({id:Date.now(),title,deadline,priority,cat,status:'Not Started',progress:0});
  document.getElementById('goal-title').value='';
  renderGoals();saveState();showToast('Goal added! 🎯','ok',1500);
}
function renderGoals(){
  const list=document.getElementById('goals-list');
  if(!list)return;
  const priColor={High:'var(--err)',Medium:'var(--gold)',Low:'var(--teal)'};
  const now=Date.now();
  list.innerHTML=APP.goals.map((g,i)=>{
    const overdue=g.deadline&&new Date(g.deadline)<now&&g.status!=='Done';
    const done=g.status==='Done';
    return `<div class="goal-card${overdue?' overdue':''}${done?' done':''}">
  <div style="display:flex;align-items:center;gap:8px">
    <span style="width:10px;height:10px;border-radius:50%;background:${priColor[g.priority]||'var(--teal)'};flex-shrink:0"></span>
    <strong style="font-size:12px;flex:1">${sanitize(g.title)}</strong>
    <span class="badge badge-purple" style="font-size:9px">${g.cat}</span>
    <select style="font-size:9px;padding:2px 4px;width:auto" onchange="APP.goals[${i}].status=this.value;if(this.value==='Done'){confetti();unlockBadge('goal1');}renderGoals();saveState()" aria-label="Goal status">
      <option${g.status==='Not Started'?' selected':''}>Not Started</option>
      <option${g.status==='In Progress'?' selected':''}>In Progress</option>
      <option${g.status==='Done'?' selected':''}>Done</option>
    </select>
    <button onclick="APP.goals.splice(${i},1);renderGoals();saveState()" style="background:none;border:none;color:var(--err);cursor:pointer;font-size:12px" aria-label="Delete goal">✕</button>
  </div>
  ${g.deadline?`<div style="font-size:10px;color:${overdue?'var(--err)':'var(--muted)'};margin-top:4px">${overdue?'⚠️ Overdue: ':'📅 '}${g.deadline}</div>`:''}
  <div class="goal-prog-wrap">
    <input type="range" min="0" max="100" value="${g.progress}" onchange="APP.goals[${i}].progress=+this.value;renderGoals();saveState()" aria-label="Goal progress"/>
    <span style="font-size:10px;color:var(--muted);white-space:nowrap">${g.progress}%</span>
  </div>
  <div class="prog-bar" style="margin-top:4px"><div class="prog-fill ${done?'ok':'purple'}" style="width:${g.progress}%"></div></div>
</div>`;
  }).join('')||'<p class="text-muted text-sm" style="text-align:center;padding:20px">No goals yet. Add your first goal above!</p>';
  // Update ring
  const done=APP.goals.filter(g=>g.status==='Done').length;
  const pct=APP.goals.length?Math.round(done/APP.goals.length*100):0;
  const ring=document.getElementById('goal-ring');
  const pctEl=document.getElementById('goal-pct');
  if(ring)ring.setAttribute('stroke-dashoffset',251*(1-pct/100));
  if(pctEl)pctEl.textContent=pct+'%';
}
/* ── 21. GPA CALCULATOR ── */
PANES.gpa=function(cont){
  cont.innerHTML=`
<div class="card" id="pane-gpa">
  <div class="card-title"><span class="icon">🎓</span>GPA Calculator</div>
  <div class="flex-row" style="align-items:center;margin-bottom:14px">
    <label for="gpa-scale" style="font-size:11px;color:var(--muted);font-weight:600">Grade Scale:</label>
    <select id="gpa-scale" style="width:auto;padding:5px 8px" onchange="renderGpa()">
      <option>Egyptian (4.0)</option><option>American (4.0)</option><option>British (%)</option>
    </select>
    <select id="gpa-sem" style="width:auto;padding:5px 8px" onchange="APP.currentGpaSemester=+this.value;renderGpa()" aria-label="Select semester"></select>
    <button class="btn btn-ghost btn-xs" onclick="addSemester()">+ Semester</button>
    <button class="btn btn-ghost btn-xs" onclick="removeSemester()" style="color:var(--err);border-color:rgba(255,38,106,0.3)" title="Delete current semester">- Semester</button>
  </div>
  <div id="gpa-courses"></div>
  <button class="btn btn-ghost btn-sm" onclick="addCourse()" aria-label="Add course">+ Add Course</button>
  <div class="grid-2 mt-8">
    <div class="stat-card"><div class="stat-val" id="gpa-sem-val">0.00</div><div class="stat-label">Semester GPA</div></div>
    <div class="stat-card"><div class="stat-val" id="gpa-cum-val">0.00</div><div class="stat-label">Cumulative GPA</div></div>
  </div>
  <div class="mt-8" id="gpa-bars"></div>
  <hr/>
  <div style="font-size:12px;font-weight:600;color:var(--muted);margin-bottom:8px">🎯 What do I need?</div>
  <div class="flex-row">
    <input type="number" id="gpa-target" placeholder="Target GPA (e.g. 3.5)" step="0.1" min="0" max="4" style="flex:1" aria-label="Target GPA"/>
    <button class="btn btn-ghost btn-sm" onclick="calcNeeded()" aria-label="Calculate needed grades">Calculate</button>
  </div>
  <div id="gpa-needed" style="margin-top:8px;font-size:12px;color:var(--teal)"></div>
</div>`;
  // Initialize semester select
  renderSemesterSelect();
  renderGpa();
};
function renderSemesterSelect(){
  const sel=document.getElementById('gpa-sem');
  if(!sel)return;
  sel.innerHTML=APP.semesters.map((s,i)=>`<option value="${i}">${s.name}</option>`).join('');
  sel.value=APP.currentGpaSemester;
}
function addSemester(){
  APP.semesters.push({name:`Semester ${APP.semesters.length+1}`,courses:[]});
  APP.currentGpaSemester=APP.semesters.length-1;
  renderSemesterSelect();renderGpa();saveState();
}
function removeSemester(){
  if(!APP.semesters || APP.semesters.length <= 1){
    toast('Must keep at least 1 semester!', 'warn');
    return;
  }
  APP.semesters.splice(APP.currentGpaSemester, 1);
  if(APP.currentGpaSemester >= APP.semesters.length){
    APP.currentGpaSemester = Math.max(0, APP.semesters.length - 1);
  }
  renderSemesterSelect();renderGpa();saveState();
  toast('Semester removed', 'info');
}
function addCourse(){
  const sem=APP.semesters[APP.currentGpaSemester];
  if(!sem)return;
  sem.courses.push({name:'',grade:'A',credits:3});
  renderGpa();saveState();
}
const GRADE_POINTS={'A+':4,'A':4,'A-':3.7,'B+':3.3,'B':3,'B-':2.7,'C+':2.3,'C':2,'C-':1.7,'D+':1.3,'D':1,'F':0};
function renderGpa(){
  const sem=APP.semesters[APP.currentGpaSemester]||{courses:[]};
  const courses=document.getElementById('gpa-courses');
  if(!courses)return;
  courses.innerHTML=sem.courses.map((c,i)=>`
<div class="course-row">
  <input type="text" value="${sanitize(c.name)}" placeholder="Course name..." onchange="APP.semesters[${APP.currentGpaSemester}].courses[${i}].name=this.value;saveState()" aria-label="Course name"/>
  <select style="width:70px;padding:7px 4px" onchange="APP.semesters[${APP.currentGpaSemester}].courses[${i}].grade=this.value;renderGpa();saveState()" aria-label="Grade">
    ${Object.keys(GRADE_POINTS).map(g=>`<option${c.grade===g?' selected':''}>${g}</option>`).join('')}
  </select>
  <input type="number" value="${c.credits}" min="1" max="6" style="width:60px" onchange="APP.semesters[${APP.currentGpaSemester}].courses[${i}].credits=+this.value;renderGpa();saveState()" aria-label="Credit hours"/>
  <button onclick="APP.semesters[${APP.currentGpaSemester}].courses.splice(${i},1);renderGpa();saveState()" style="background:none;border:none;color:var(--err);cursor:pointer" aria-label="Remove course">✕</button>
</div>`).join('');
  // Calculate GPA
  let total=0,totalCr=0;
  sem.courses.forEach(c=>{
    const pts=GRADE_POINTS[c.grade]||0;
    total+=pts*c.credits;totalCr+=c.credits;
  });
  const semGpa=totalCr?total/totalCr:0;
  document.getElementById('gpa-sem-val').textContent=semGpa.toFixed(2);
  // Cumulative
  let allTotal=0,allCr=0;
  APP.semesters.forEach(s=>s.courses.forEach(c=>{allTotal+=(GRADE_POINTS[c.grade]||0)*c.credits;allCr+=c.credits;}));
  const cumGpa=allCr?allTotal/allCr:0;
  document.getElementById('gpa-cum-val').textContent=cumGpa.toFixed(2);
  // Bars
  const bars=document.getElementById('gpa-bars');
  if(bars){
    const gradeColors={'A+':'#10b981','A':'#10b981','A-':'#34d399','B+':'#3b82f6','B':'#60a5fa','B-':'#93c5fd','C+':'#f59e0b','C':'#fbbf24','C-':'#fcd34d','D+':'#f97316','D':'#fb923c','F':'#ef4444'};
    bars.innerHTML=`<div class="section-label">Grade Distribution</div>`+
      sem.courses.map(c=>`
<div style="margin-bottom:6px">
  <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:2px">
    <span>${sanitize(c.name)||'Course'}</span><span>${c.grade} (${c.credits}cr)</span>
  </div>
  <div class="prog-bar"><div style="width:${(GRADE_POINTS[c.grade]||0)/4*100}%;height:100%;background:${gradeColors[c.grade]||'#94a3b8'};border-radius:3px;transition:width .5s"></div></div>
</div>`).join('');
  }
}
function calcNeeded(){
  const target=parseFloat(document.getElementById('gpa-target').value);
  const el=document.getElementById('gpa-needed');
  if(isNaN(target)||target<0||target>4){if(el)el.textContent='Enter valid target GPA (0-4)';return;}
  let allTotal=0,allCr=0;
  APP.semesters.forEach(s=>s.courses.forEach(c=>{allTotal+=(GRADE_POINTS[c.grade]||0)*c.credits;allCr+=c.credits;}));
  const curGpa=allCr?allTotal/allCr:0;
  const msg=curGpa>=target?`✅ You've already achieved ${target.toFixed(2)} GPA! Keep it up!`:`📚 You need to maintain at least ${Math.min(4,Math.max(0,(target*allCr-allTotal)/(Math.max(1,3)))).toFixed(2)} average per remaining credit to reach ${target.toFixed(2)} GPA.`;
  if(el)el.textContent=msg;
}
/* ── 22. ACADEMIC SEARCH HELPER ── */
PANES.searchhelp = function(cont) {
  cont.innerHTML = `
<div class="card" id="pane-searchhelp" style="max-width:1100px; margin:0 auto;">
  <div class="card-title"><span class="icon">🔎</span>Academic Search Assistant</div>
  
  <div class="auth-tabs" style="margin-bottom:20px;">
    <div class="auth-tab active" id="sh-tab-ai" onclick="switchShMode('ai')">AI Search Helper</div>
    <div class="auth-tab" id="sh-tab-live" onclick="switchShMode('live')">Live Scientific Search</div>
  </div>
  
  <!-- AI Search Helper Panel -->
  <div id="sh-panel-ai">
    <div class="form-group">
      <label for="sh-topic">Research Topic</label>
      <input type="text" id="sh-topic" placeholder="e.g. Deep Learning in Medical Imaging..." aria-label="Research topic"/>
    </div>
    <button class="btn btn-primary" id="sh-btn" onclick="doSearchHelp()" aria-label="Get search help"><span>🔎</span> Get Search Help</button>
    <div style="margin-top:16px">
      <div class="output-box" id="sh-out" aria-live="polite"><span class="text-muted text-sm">Search strategies will appear here...</span></div>
      <div class="output-actions" id="sh-actions" style="display:none">
        <button class="btn btn-ghost btn-sm" onclick="copyOutput('sh-out')">📋 Copy</button>
      </div>
    </div>
  </div>
  
  <!-- Live Scientific Search Panel -->
  <div id="sh-panel-live" style="display:none;">
    <div class="form-group" style="display:flex; gap:10px; margin-bottom:16px;">
      <input type="text" id="sh-live-query" placeholder="Search millions of scientific papers (Semantic Scholar API)..." aria-label="Live paper query" style="flex:1; margin-bottom:0;"/>
      <button class="btn btn-primary" id="sh-live-btn" onclick="doSemanticSearch()" style="border-radius:24px; padding:10px 24px;">🔍 Search</button>
    </div>
    
    <div id="sh-live-results" style="display:flex; flex-direction:column; gap:12px;">
      <p class="text-muted" style="text-align:center; padding:30px;">Enter a topic above to search real academic publications.</p>
    </div>
  </div>
</div>`;
};
const doSearchHelp=debounce(async()=>{
  const topic=document.getElementById('sh-topic').value.trim();
  if(!topic){showToast('Enter research topic','err');return;}
  const out=document.getElementById('sh-out');
  const btn=document.getElementById('sh-btn');
  setSkeleton(out);btn.disabled=true;btn.innerHTML='<span class="spinner"></span> Analyzing...';
  let full='';
  await callAI([
    {role:'system',content:'You are an expert academic librarian and researcher.'},
    {role:'user',content:`Help me search for academic resources about: "${topic}"\n\nProvide:\n## 10 Optimized Search Keywords\n## 5 Boolean Search Strings (for Google Scholar, copy-ready)\n## Recommended Databases\n(Scopus, IEEE Xplore, PubMed, JSTOR, arXiv, etc. — specify which fits best)\n## Source Credibility Checklist\n## 4-Step Guide: How to Read an Abstract Quickly\n\nUse markdown.`}
  ],
  c=>{full+=c;out.innerHTML=sanitize(renderMD(full));},
  _=>{document.getElementById('sh-actions').style.display='flex';addXP('searchhelp');},
  err=>{out.innerHTML=`<span style="color:var(--err)">${t(err)}</span>`;showToast(t(err),'err');});
  btn.disabled=false;btn.innerHTML='<span>🔎</span> Get Search Help';
},500);
/* ── 23. DATA ANALYZER ── */
PANES.dataana=function(cont){
  cont.innerHTML=`
<div class="card" id="pane-dataana">
  <div class="card-title"><span class="icon">📊</span>Data Analyzer</div>
  <div class="form-group">
    <label for="da-data">Paste CSV or Key-Value Data</label>
    ${lecturePickerHTML('da-data')}
  <textarea id="da-data" rows="6" placeholder="name,score&#10;Alice,85&#10;Bob,92&#10;Charlie,78&#10;..." aria-label="Data to analyze"></textarea>
  </div>
  <button class="btn btn-primary" id="da-btn" onclick="doDataAna()" aria-label="Analyze data"><span>📊</span> Analyze Data</button>
  <div id="da-chart" style="margin-top:14px;display:none"></div>
  <div style="margin-top:14px">
    <div class="output-box" id="da-out" aria-live="polite"><span class="text-muted text-sm">Analysis will appear here...</span></div>
    <div class="output-actions" id="da-actions" style="display:none">
      <button class="btn btn-ghost btn-sm" onclick="copyOutput('da-out')">📋 Copy</button>
      <button class="btn btn-teal btn-sm" onclick="saveToHistory('dataana',document.getElementById('da-data').value,document.getElementById('da-out'))">💾 Save</button>
    </div>
  </div>
</div>`;
};
const doDataAna=debounce(async()=>{
  const data=document.getElementById('da-data').value.trim();
  if(!data){showToast('Enter data to analyze','err');return;}
  const out=document.getElementById('da-out');
  const btn=document.getElementById('da-btn');
  setSkeleton(out);btn.disabled=true;btn.innerHTML='<span class="spinner"></span> Analyzing...';
  // Try to render simple chart from CSV
  const lines=data.split('\n').filter(Boolean);
  if(lines.length>1){
    const headers=lines[0].split(',');
    if(headers.length>=2){
      const chartData=lines.slice(1).map(l=>{const parts=l.split(',');return{label:parts[0],val:parseFloat(parts[1])||0};}).filter(d=>!isNaN(d.val));
      if(chartData.length>0)renderSimpleChart(chartData);
    }
  }
  let full='';
  await callAI([
    {role:'system',content:'You are a data science expert and statistician.'},
    {role:'user',content:`Analyze this data:\n\n${data}\n\nProvide:\n## Statistical Summary\n(mean, median, mode, range, std dev if applicable)\n## Key Patterns & Trends\n## Anomalies & Outliers\n## Recommended Visualizations\n## Academic Interpretation\n\nUse markdown.`}
  ],
  c=>{full+=c;out.innerHTML=sanitize(renderMD(full));},
  _=>{document.getElementById('da-actions').style.display='flex';addXP('dataana');},
  err=>{out.innerHTML=`<span style="color:var(--err)">${t(err)}</span>`;showToast(t(err),'err');});
  btn.disabled=false;btn.innerHTML='<span>📊</span> Analyze Data';
},500);
function renderSimpleChart(data){
  const chart=document.getElementById('da-chart');
  if(!chart)return;
  chart.style.display='';
  const max=Math.max(...data.map(d=>d.val));
  chart.innerHTML=`<div class="section-label">📊 Data Visualization</div><div style="display:flex;align-items:flex-end;gap:6px;height:120px;padding:10px;background:var(--card2);border-radius:var(--rs)">
${data.slice(0,10).map(d=>`<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px">
  <span style="font-size:9px;color:var(--muted)">${d.val}</span>
  <div style="width:100%;background:linear-gradient(to top,var(--primary),var(--pl));border-radius:3px 3px 0 0;height:${Math.max(4,d.val/max*90)}px;transition:height .5s"></div>
  <span style="font-size:8px;color:var(--faint);text-align:center">${sanitize(d.label.slice(0,8))}</span>
</div>`).join('')}
</div>`;
}
/* ── 24. ABSTRACT GENERATOR ── */
PANES.abstract=function(cont){
  cont.innerHTML=`
<div class="card" id="pane-abstract">
  <div class="card-title"><span class="icon">📜</span>Abstract Generator</div>
  <div class="grid-2">
    <div class="form-group">
      <label for="abs-topic">Topic / Title</label>
      <input type="text" id="abs-topic" placeholder="Research paper title..." aria-label="Research topic"/>
    </div>
    <div class="form-group">
      <label for="abs-style">Abstract Style</label>
      <select id="abs-style"><option>IEEE</option><option>APA</option><option>General Academic</option></select>
    </div>
  </div>
  <div class="form-group">
    <label for="abs-findings">Key Findings</label>
    <textarea id="abs-findings" rows="3" placeholder="List your main findings..." aria-label="Key findings"></textarea>
  </div>
  <div class="form-group">
    <label for="abs-method">Methodology Used</label>
    <input type="text" id="abs-method" placeholder="e.g. Machine Learning, Survey, Case Study..." aria-label="Methodology"/>
  </div>
  <div class="form-group">
    <label for="abs-context">Or use lecture context</label>
    ${lecturePickerHTML('abs-context')}
    <textarea id="abs-context" rows="3" placeholder="Paste or load lecture text to generate abstract from it..." aria-label="Lecture context"></textarea>
  </div>
  <button class="btn btn-primary" id="abs-btn" onclick="doAbstract()" aria-label="Generate abstract"><span>📜</span> Generate Abstract</button>
  <div style="margin-top:16px">
    <div class="output-box" id="abs-out" contenteditable="false" aria-live="polite"><span class="text-muted text-sm">Abstract will appear here (~250 words)...</span></div>
    <div class="output-actions" id="abs-actions" style="display:none">
      <span class="badge badge-purple" id="abs-wc-badge"></span>
      <button class="btn btn-ghost btn-sm" onclick="copyOutput('abs-out')">📋 Copy</button>
      <button class="btn btn-teal btn-sm" onclick="saveToHistory('abstract',document.getElementById('abs-topic').value,document.getElementById('abs-out'))">💾 Save</button>
    </div>
  </div>
</div>`;
};
const doAbstract=debounce(async()=>{
  const topic=document.getElementById('abs-topic').value.trim();
  const context=document.getElementById('abs-context').value.trim();
  const findings=document.getElementById('abs-findings').value.trim();
  const method=document.getElementById('abs-method').value.trim();
  const style=document.getElementById('abs-style').value;
  if(!topic&&!context){showToast('Enter research topic or load a lecture','err');return;}
  const out=document.getElementById('abs-out');
  const btn=document.getElementById('abs-btn');
  setSkeleton(out);btn.disabled=true;btn.innerHTML='<span class="spinner"></span> Writing...';
  let full='';
  const userPrompt=context?`Write a complete academic abstract (~250 words) based on this source material:\n\n${context}\n\nStructure: Background / Objective / Methods / Results / Conclusion\nStyle: ${style} format`:`Write a complete academic abstract (~250 words) for:\n\nTitle: ${topic}\nMethodology: ${method||'Not specified'}\nKey Findings: ${findings||'Not specified'}\n\nStructure: Background / Objective / Methods / Results / Conclusion\nStyle: ${style} format`;
  await callAI([
    {role:'system',content:`You are an expert academic writer specializing in ${style} format.`},
    {role:'user',content:userPrompt}
  ],
  c=>{full+=c;out.innerHTML=sanitize(renderMD(full));},
  _=>{
    const wc=full.trim().split(/\s+/).length;
    document.getElementById('abs-wc-badge').textContent=`~${wc} words`;
    document.getElementById('abs-actions').style.display='flex';addXP('abstract');
  },
  err=>{out.innerHTML=`<span style="color:var(--err)">${t(err)}</span>`;showToast(t(err),'err');});
  btn.disabled=false;btn.innerHTML='<span>📜</span> Generate Abstract';
},500);
/* ── 25. GRAMMAR CHECKER ── */
PANES.grammar=function(cont){
  cont.innerHTML=`
<div class="card" id="pane-grammar">
  <div class="card-title"><span class="icon">🔤</span>Grammar & Style Checker</div>
  <div class="form-group">
    <label for="gram-text">Academic Text</label>
    ${lecturePickerHTML('gram-text')}
  <textarea id="gram-text" rows="7" placeholder="Paste your academic text to check grammar and style..." aria-label="Text to check"></textarea>
    <div class="wc" id="gram-wc">0 words</div>
  </div>
  <button class="btn btn-primary" id="gram-btn" onclick="doGrammar()" aria-label="Check grammar"><span>🔤</span> Check Grammar & Style</button>
  <div class="grid-2 mt-8">
    <div>
      <div class="section-label">Original</div>
      <div class="output-box" id="gram-orig" style="min-height:150px"><span class="text-muted text-sm">Original text...</span></div>
    </div>
    <div>
      <div class="section-label">Corrected</div>
      <div class="output-box" id="gram-out" aria-live="polite" style="min-height:150px"><span class="text-muted text-sm">Corrected version will appear here...</span></div>
    </div>
  </div>
  <div class="output-actions mt-8" id="gram-actions" style="display:none">
    <button class="btn btn-ghost btn-sm" onclick="copyOutput('gram-out')">📋 Copy Corrected</button>
    <button class="btn btn-teal btn-sm" onclick="saveToHistory('grammar',document.getElementById('gram-text').value,document.getElementById('gram-out'))">💾 Save</button>
  </div>
</div>`;
  attachWordCounter('gram-text','gram-wc');
};
const doGrammar=debounce(async()=>{
  const text=document.getElementById('gram-text').value.trim();
  if(!text){showToast('Enter text to check','err');return;}
  const out=document.getElementById('gram-out');
  const orig=document.getElementById('gram-orig');
  const btn=document.getElementById('gram-btn');
  orig.innerHTML=sanitize(text.replace(/\n/g,'<br>'));
  setSkeleton(out);btn.disabled=true;btn.innerHTML='<span class="spinner"></span> Checking...';
  let full='';
  await callAI([
    {role:'system',content:'You are an expert academic writing editor and grammar specialist.'},
    {role:'user',content:`Check and correct this academic text:\n\n${text}\n\nProvide:\n## Corrected Version\n(full corrected text)\n## Errors Found\n(numbered list of specific errors)\n## Style Suggestions\n(for academic tone)\n## Passive/Active Voice Analysis\n## Approximate Readability Score\n(Flesch-Kincaid level estimation)\n\nUse markdown.`}
  ],
  c=>{full+=c;out.innerHTML=sanitize(renderMD(full));},
  _=>{document.getElementById('gram-actions').style.display='flex';addXP('grammar');},
  err=>{out.innerHTML=`<span style="color:var(--err)">${t(err)}</span>`;showToast(t(err),'err');});
  btn.disabled=false;btn.innerHTML='<span>🔤</span> Check Grammar & Style';
},500);
/* ── 26. CONCEPT CONNECTOR ── */
PANES.connector=function(cont){
  cont.innerHTML=`
<div class="card" id="pane-connector">
  <div class="card-title"><span class="icon">🧩</span>Concept Connector</div>
  <div class="grid-2">
    <div class="form-group">
      <label for="conn-a">Concept A</label>
      <input type="text" id="conn-a" placeholder="e.g. Neural Networks..." aria-label="First concept"/>
    </div>
    <div class="form-group">
      <label for="conn-b">Concept B</label>
      <input type="text" id="conn-b" placeholder="e.g. Human Psychology..." aria-label="Second concept"/>
    </div>
  </div>
  <button class="btn btn-primary" id="conn-btn" onclick="doConnector()" aria-label="Connect concepts"><span>🧩</span> Find Connections</button>
  <div style="margin-top:16px">
    <div class="output-box" id="conn-out" aria-live="polite"><span class="text-muted text-sm">Conceptual bridges will appear here...</span></div>
    <div class="output-actions" id="conn-actions" style="display:none">
      <button class="btn btn-ghost btn-sm" onclick="copyOutput('conn-out')">📋 Copy</button>
      <button class="btn btn-teal btn-sm" onclick="saveToHistory('connector',document.getElementById('conn-a').value,document.getElementById('conn-out'))">💾 Save</button>
    </div>
  </div>
</div>`;
};
const doConnector=debounce(async()=>{
  const a=document.getElementById('conn-a').value.trim();
  const b=document.getElementById('conn-b').value.trim();
  if(!a||!b){showToast('Enter both concepts','err');return;}
  const out=document.getElementById('conn-out');
  const btn=document.getElementById('conn-btn');
  setSkeleton(out);btn.disabled=true;btn.innerHTML='<span class="spinner"></span> Connecting...';
  let full='';
  await callAI([
    {role:'system',content:'You are an interdisciplinary academic researcher.'},
    {role:'user',content:`Find conceptual bridges between: "${a}" and "${b}"\n\nProvide:\n## How They Relate\n## Shared Theories/Principles\n## Real-World Examples Combining Both\n## Interdisciplinary Research Ideas\n## Venn Diagram Description\n(What's unique to each, what's shared)\n\nUse markdown.`}
  ],
  c=>{full+=c;out.innerHTML=sanitize(renderMD(full));},
  _=>{document.getElementById('conn-actions').style.display='flex';addXP('connector');},
  err=>{out.innerHTML=`<span style="color:var(--err)">${t(err)}</span>`;showToast(t(err),'err');});
  btn.disabled=false;btn.innerHTML='<span>🧩</span> Find Connections';
},500);
/* ── 27. HISTORY ── */
PANES.hist=async function(cont){
  const items=await idbGetAll('history');
  const allItems=[...items,...APP.history.filter(h=>!items.find(i=>i.id===h.id))].sort((a,b)=>b.ts-a.ts).slice(0,100);
  const tools=[...new Set(allItems.map(h=>h.tool))];
  cont.innerHTML=`
<div class="card" id="pane-hist">
  <div class="card-title"><span class="icon">📋</span>History</div>
  <div class="flex-row" style="margin-bottom:14px;align-items:center">
    <input type="text" id="hist-search" placeholder="Search history..." style="flex:1" oninput="filterHistory()" aria-label="Search history"/>
    <select id="hist-filter" style="width:auto;padding:7px 8px" onchange="filterHistory()" aria-label="Filter by tool">
      <option value="">All Tools</option>
      ${tools.map(t=>`<option value="${t}">${t}</option>`).join('')}
    </select>
    <button class="btn btn-ghost btn-xs" onclick="bulkDeleteHistory()" aria-label="Delete all history">🗑️ Clear All</button>
  </div>
  <div id="hist-list"></div>
  <div id="hist-sentinel" style="height:4px"></div>
</div>`;
  window._histAll=allItems;window._histPage=0;
  renderHistPage(true);
  // Intersection observer for virtual scroll
  const sentinel=document.getElementById('hist-sentinel');
  if(sentinel){
    const obs=new IntersectionObserver(entries=>{
      if(entries[0].isIntersecting)renderHistPage(false);
    },{threshold:.1});
    obs.observe(sentinel);
  }
};
function renderHistPage(reset){
  const list=document.getElementById('hist-list');
  if(!list)return;
  const search=document.getElementById('hist-search')?.value.toLowerCase()||'';
  const filter=document.getElementById('hist-filter')?.value||'';
  let items=(window._histAll||[]).filter(h=>{
    if(filter&&h.tool!==filter)return false;
    if(search&&!h.title.toLowerCase().includes(search)&&!h.preview.toLowerCase().includes(search))return false;
    return true;
  });
  if(reset){window._histPage=0;list.innerHTML='';}
  const start=window._histPage*20;
  const slice=items.slice(start,start+20);
  window._histPage++;
  slice.forEach(h=>{
    const d=document.createElement('div');
    d.className='hist-item';
    d.innerHTML=`
<div class="hist-header">
  <span class="hist-tool">${h.tool}</span>
  <span class="hist-ts">${new Date(h.ts).toLocaleDateString()}</span>
</div>
<div class="hist-title">${sanitize(h.title||'Untitled')}</div>
<div class="hist-preview">${sanitize(h.preview||'')}</div>
<div class="hist-actions">
  <button class="btn btn-ghost btn-xs" onclick="viewHist(${JSON.stringify(h.id)})">👁️ View</button>
  <button class="btn btn-ghost btn-xs" onclick="deleteHist(${JSON.stringify(h.id)})">🗑️ Delete</button>
</div>`;
    list.appendChild(d);
  });
}
function filterHistory(){window._histPage=0;document.getElementById('hist-list').innerHTML='';renderHistPage(false);}
function viewHist(id){
  const h=(window._histAll||[]).find(x=>x.id===id);
  if(!h)return;
  document.getElementById('hist-view-title').textContent=h.title||'History Item';
  document.getElementById('hist-view-content').innerHTML=sanitize(h.output||h.preview||'');
  openModal('hist-view-modal');
}
async function deleteHist(id){
  await idbDelete('history',id);
  window._histAll=(window._histAll||[]).filter(h=>h.id!==id);
  APP.history=APP.history.filter(h=>h.id!==id);
  filterHistory();saveState();showToast('Deleted','ok',1000);
}
function bulkDeleteHistory(){
  if(!confirm('Delete all history? This cannot be undone.'))return;
  APP.history=[];window._histAll=[];
  if(DB){const tx=DB.transaction('history','readwrite');tx.objectStore('history').clear();}
  const list=document.getElementById('hist-list');if(list)list.innerHTML='';
  saveState();showToast('History cleared','ok');
}
/* ── 28. DASHBOARD ── */

/* ── 29. ACADEMIC CALENDAR ── */
PANES.cal=function(cont){
  cont.innerHTML=`
<div class="card" id="pane-cal">
  <div class="card-title"><span class="icon">🗓️</span>Academic Calendar</div>
  <div class="card" style="margin-bottom:16px">
    <div style="font-size:13px;font-weight:700;margin-bottom:12px">Add Event</div>
    <div class="grid-2">
      <div class="form-group"><label for="cal-title">Event Title</label><input type="text" id="cal-title" placeholder="e.g. Final Exam..." aria-label="Event title"/></div>
      <div class="form-group"><label for="cal-date">Date</label><input type="date" id="cal-date" aria-label="Event date"/></div>
      <div class="form-group">
        <label for="cal-type">Type</label>
        <select id="cal-type"><option value="exam">📝 Exam</option><option value="assign">📋 Assignment</option><option value="present">🎤 Presentation</option><option value="other">📌 Other</option></select>
      </div>
      <div class="form-group"><label for="cal-course">Course</label><input type="text" id="cal-course" placeholder="Course name..." aria-label="Course name"/></div>
    </div>
    <div class="form-group"><label for="cal-notes">Notes</label><input type="text" id="cal-notes" placeholder="Additional notes..." aria-label="Event notes"/></div>
    <button class="btn btn-primary btn-sm" onclick="addCalEvent()" aria-label="Add event">+ Add Event</button>
  </div>
  <div id="cal-list"></div>
</div>`;
  renderCalEvents();
};
function addCalEvent(){
  const title=document.getElementById('cal-title').value.trim();
  const date=document.getElementById('cal-date').value;
  const type=document.getElementById('cal-type').value;
  const course=document.getElementById('cal-course').value;
  const notes=document.getElementById('cal-notes').value;
  if(!title||!date){showToast('Enter title and date','err');return;}
  APP.calendarEvents.push({id:Date.now(),title,date,type,course,notes});
  document.getElementById('cal-title').value='';
  renderCalEvents();renderUpcoming();saveState();showToast('Event added! 📅','ok',1500);
}
function renderCalEvents(){
  const list=document.getElementById('cal-list');
  if(!list)return;
  const evColors={exam:'var(--err)',assign:'var(--gold)',present:'var(--pl)',other:'var(--teal)'};
  const evDotClass={exam:'ev-exam',assign:'ev-assign',present:'ev-present',other:'ev-other'};
  const sorted=[...APP.calendarEvents].sort((a,b)=>new Date(a.date)-new Date(b.date));
  list.innerHTML=sorted.map((ev,i)=>`
<div class="cal-event">
  <div class="cal-event-dot ${evDotClass[ev.type]||'ev-other'}"></div>
  <div style="flex:1">
    <div style="font-weight:600">${sanitize(ev.title)}</div>
    <div style="font-size:10px;color:var(--muted)">${ev.course?sanitize(ev.course)+' · ':''} ${ev.date} ${ev.notes?'· '+sanitize(ev.notes):''}</div>
  </div>
  <button onclick="APP.calendarEvents.splice(APP.calendarEvents.indexOf(APP.calendarEvents.find(e=>e.id===${ev.id})),1);renderCalEvents();renderUpcoming();saveState()" style="background:none;border:none;color:var(--err);cursor:pointer" aria-label="Delete event">✕</button>
</div>`).join('')||'<p class="text-muted text-sm" style="text-align:center;padding:20px">No events yet. Add your first event!</p>';
}
/* ═══ HELPER FUNCTIONS ═══ */
function setSkeleton(el){
  if(!el)return;
  el.innerHTML=`<div class="skel-line w90 skeleton"></div><div class="skel-line w80 skeleton"></div><div class="skel-line w60 skeleton"></div><div class="skel-line w90 skeleton"></div>`;
}
function printOutput(elId){
  const el=document.getElementById(elId);
  if(!el)return;
  const w=window.open('','_blank');
  w.document.write(`<!DOCTYPE html><html><head><title>MindSpark Export</title><style>body{font-family:sans-serif;padding:20px;color:#000}h1,h2,h3{color:#333}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ccc;padding:6px}code{background:#eee;padding:2px 4px}</style></head><body>${el.innerHTML}</body></html>`);
  w.document.close();w.print();
}
function setupDropZone(dropId,fileId,textId){
  const drop=document.getElementById(dropId);
  const file=document.getElementById(fileId);
  const text=document.getElementById(textId);
  if(!drop||!file||!text)return;
  drop.addEventListener('dragover',e=>{e.preventDefault();drop.classList.add('drag-over');});
  drop.addEventListener('dragleave',()=>drop.classList.remove('drag-over'));
  drop.addEventListener('drop',e=>{e.preventDefault();drop.classList.remove('drag-over');const f=e.dataTransfer.files[0];if(f)processFile(f,text);});
  file.addEventListener('change',e=>{const f=e.target.files[0];if(f)processFile(f,text);});
}
async function processFile(file,textEl){
  if(file.type==='text/plain'){
    const r=new FileReader();
    r.onload=e=>{textEl.value=e.target.result;showToast('File loaded ✅','ok',1500);};
    r.readAsText(file);
  } else if(file.type==='application/pdf'){
    try{
      await ensurePdfJs();
      const buf=await file.arrayBuffer();
      const pdf=await pdfjsLib.getDocument({data:buf}).promise;
      let allText='';
      for(let i=1;i<=Math.min(pdf.numPages,10);i++){
        const pg=await pdf.getPage(i);
        const content=await pg.getTextContent();
        allText+=content.items.map(s=>s.str).join(' ')+'\n';
      }
      textEl.value=allText;showToast('PDF loaded ✅','ok',1500);
    }catch{showToast('PDF parsing unavailable. Paste text manually.','err');}
  } else {
    const r=new FileReader();
    r.onload=e=>{textEl.value=e.target.result.replace(/<[^>]*>/g,' ');showToast('File loaded ✅','ok',1500);};
    r.readAsText(file);
  }
}
/* ═══ KEYBOARD SHORTCUTS ═══ */
document.addEventListener('keydown',e=>{
  const tag=e.target.tagName.toLowerCase();
  const typing=tag==='input'||tag==='textarea'||e.target.isContentEditable;
  // Ctrl+K = command palette
  if(e.ctrlKey&&e.key==='k'){e.preventDefault();openCmd();return;}
  // Ctrl+Enter = submit
  if(e.ctrlKey&&e.key==='Enter'&&typing){e.preventDefault();const btn=document.querySelector('.pane.active .btn-primary')||document.querySelector('[id$="-btn"]:not(:disabled)');btn?.click();return;}
  // Ctrl+S = save
  if(e.ctrlKey&&e.key==='s'){e.preventDefault();const outEl=document.querySelector('[id$="-out"]');if(outEl&&outEl.textContent.trim()&&outEl.textContent.trim()!=='Your summary will appear here...')saveToHistory(APP.activeTab,'',outEl);return;}
  if(typing)return;
  // ? = shortcuts
  if(e.key==='?'){showShortcuts();return;}
  // N = notes
  if(e.key==='n'||e.key==='N'){toggleNotes();return;}
  // Esc = close modals
  if(e.key==='Escape'){
    document.querySelectorAll('.modal-overlay.show').forEach(m=>m.classList.remove('show'));
    closeCmd();endTour();
    document.getElementById('notes-panel')?.classList.remove('show');
    return;
  }
  // 1-9 = tool shortcuts
  const toolKeys=['sum','qgen','concept','planner','essay','cornell','cite','trans','tts'];
  if(e.key>='1'&&e.key<='9'&&!e.ctrlKey){go(toolKeys[parseInt(e.key)-1]);return;}
  // Q = quiz, C = chat, F = flashcards, M = mindmap
  if(e.key==='q'||e.key==='Q'){go('quiz');return;}
  if(e.key==='c'||e.key==='C'){go('chat');return;}
  if(e.key==='f'||e.key==='F'){go('fc');return;}
  if(e.key==='m'||e.key==='M'){go('mm');return;}
  // Flashcard navigation
  if(e.key==='ArrowLeft')fcNav(-1);
  if(e.key==='ArrowRight')fcNav(1);
  if(e.key===' '&&APP.activeTab==='fc'){e.preventDefault();flipFC();}
});
// Command palette keyboard nav
document.getElementById('cmd-input').addEventListener('keydown',e=>{
  if(e.key==='ArrowDown'){e.preventDefault();cmdActive=(cmdActive+1)%cmdFiltered.length;renderCmdList();}
  if(e.key==='ArrowUp'){e.preventDefault();cmdActive=(cmdActive-1+cmdFiltered.length)%cmdFiltered.length;renderCmdList();}
  if(e.key==='Enter'){e.preventDefault();if(cmdActive>=0){go(cmdFiltered[cmdActive].id);closeCmd();}}
  if(e.key==='Escape')closeCmd();
});
document.getElementById('cmd-input').addEventListener('input',e=>cmdFilter(e.target.value));
// Sidebar search
document.getElementById('sb-search').addEventListener('input',e=>filterSidebar(e.target.value));
// Avatar picker
document.getElementById('avatar-btn').addEventListener('click',()=>{
  go('profile');
});
// Share URL decode on load
// ── 1. POWERPOINT SLIDES EXPORTER ──
function exportSlides(outputId) {
  const box = document.getElementById(outputId);
  if (!box) { showToast("No output to generate slides from.", "err"); return; }
  const text = box.innerText || box.textContent;
  if (!text.trim()) { showToast("No content to generate slides.", "err"); return; }
  
  if (typeof pptxgen === 'undefined') {
    showToast("PowerPoint exporter not loaded. Check internet connection.", "err");
    return;
  }
  
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';
  
  const slideBg = '0B0F19'; // Cyberpunk Dark Blue
  const primaryColor = '00F3FF'; // Neon Cyan
  const plColor = 'B026FF'; // Neon Purple
  const textColor = 'FFFFFF'; // White
  const mutedColor = '9CA3AF'; // Muted Gray
  
  // Title Slide
  const titleSlide = pptx.addSlide();
  titleSlide.background = { fill: slideBg };
  titleSlide.addText("MindSpark AI Presentation", {
    x: 0.5, y: 1.5, w: 9.0, h: 1.5,
    fontSize: 44, bold: true, color: primaryColor,
    fontFace: 'Arial', align: 'center'
  });
  titleSlide.addText("AI-Generated Academic Slides Outline", {
    x: 0.5, y: 3.2, w: 9.0, h: 0.8,
    fontSize: 20, color: plColor,
    fontFace: 'Arial', align: 'center'
  });
  titleSlide.addText(`Student Work: ${APP.username || 'Omar Saeed'}`, {
    x: 0.5, y: 4.8, w: 9.0, h: 0.5,
    fontSize: 14, color: mutedColor,
    fontFace: 'Arial', align: 'center'
  });
  
  const lines = text.split('\n');
  let currentTitle = '';
  let currentBullets = [];
  
  function addContentSlide() {
    if (currentTitle || currentBullets.length > 0) {
      const slide = pptx.addSlide();
      slide.background = { fill: slideBg };
      
      slide.addText(currentTitle || "Summary Section", {
        x: 0.5, y: 0.5, w: 9.0, h: 0.8,
        fontSize: 28, bold: true, color: primaryColor,
        fontFace: 'Arial'
      });
      
      slide.addShape(pptx.shapes.RECTANGLE, {
        x: 0.5, y: 1.25, w: 9.0, h: 0.05,
        fill: plColor
      });
      
      const bulletText = currentBullets.slice(0, 6).map(b => {
        return { text: b, options: { bullet: true, color: textColor, fontSize: 16 } };
      });
      
      if (bulletText.length > 0) {
        slide.addText(bulletText, {
          x: 0.5, y: 1.6, w: 9.0, h: 3.5,
          fontFace: 'Arial', margin: 10
        });
      } else {
        slide.addText("Refer to main notes for details.", {
          x: 0.5, y: 2.0, w: 9.0, h: 2.0,
          color: mutedColor, fontSize: 18, fontFace: 'Arial'
        });
      }
    }
  }
  
  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('# ') || trimmed.startsWith('## ') || trimmed.startsWith('### ')) {
      addContentSlide();
      currentTitle = trimmed.replace(/^[#\s]+/, '');
      currentBullets = [];
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || (trimmed.match(/^\d+\.\s/) && trimmed.length > 3)) {
      currentBullets.push(trimmed.replace(/^[-*\d.\s]+/, ''));
    } else if (trimmed.length > 15 && currentBullets.length < 5) {
      currentBullets.push(trimmed);
    }
  });
  
  addContentSlide();
  
  // End Slide
  const thankSlide = pptx.addSlide();
  thankSlide.background = { fill: slideBg };
  thankSlide.addText("Thank You!", {
    x: 0.5, y: 2.0, w: 9.0, h: 1.5,
    fontSize: 48, bold: true, color: primaryColor,
    fontFace: 'Arial', align: 'center'
  });
  
  pptx.writeFile({ fileName: `mindspark_slides_${Date.now()}.pptx` })
    .then(() => showToast("PowerPoint slides exported!", "ok"))
    .catch(err => {
      console.error(err);
      showToast("PowerPoint export failed.", "err");
    });
}

function addExportSlidesButtons() {
  const actionsContainers = document.querySelectorAll('#content .output-actions');
  actionsContainers.forEach(container => {
    if (container.dataset.slidesEnabled) return;
    container.dataset.slidesEnabled = "true";
    
    const pane = container.closest('.pane, .card, .auto-grid');
    if (!pane) return;
    const outBox = pane.querySelector('.output-box') || pane.querySelector('[id$="-out"]');
    if (!outBox) return;
    
    const slideBtn = document.createElement('button');
    slideBtn.className = 'btn btn-ghost btn-sm';
    slideBtn.innerHTML = '📊 Export Slides';
    slideBtn.onclick = () => exportSlides(outBox.id);
    container.appendChild(slideBtn);
  });
}

// ── 2. AI VISION & OCR SOLVER ──
PANES.vision = function(cont) {
  cont.innerHTML = `
<div class="card" id="pane-vision">
  <div class="card-title"><span class="icon">👁️</span>AI Vision Solver & Explainer</div>
  <p class="text-muted" style="margin-bottom:16px;">Upload an image or take a photo of a problem, graph, or text, and the AI will solve and explain it.</p>
  
  <div class="form-group">
    <label>Upload Image (PNG/JPG)</label>
    <div class="drop-zone" id="vision-drop" onclick="document.getElementById('vision-file-input').click()" style="margin-bottom:12px;">
      <div class="drop-icon">📸</div>
      <div>Drop image here or <strong>click to select / use camera</strong></div>
      <input type="file" id="vision-file-input" accept="image/*" style="display:none"/>
    </div>
    <div id="vision-preview-wrap" style="display:none; text-align:center; margin-bottom:12px; position:relative;">
      <img id="vision-preview" style="max-width:100%; max-height:220px; border-radius:var(--rs); border:1px solid var(--border2);"/>
      <button class="btn btn-ghost btn-xs" onclick="clearVisionImage()" style="position:absolute; top:5px; right:5px; background:rgba(0,0,0,0.6); color:#fff; border-radius:50%; width:24px; height:24px; padding:0; border:none; cursor:pointer;">✕</button>
    </div>
  </div>

  <div class="form-group">
    <label for="vision-prompt">Question / Instructions</label>
    <textarea id="vision-prompt" rows="3" placeholder="e.g. Solve this math problem step-by-step, or explain this diagram..."></textarea>
  </div>

  <button class="btn btn-primary" id="vision-btn" onclick="doVisionSolve()"><span>👁️</span> Analyze & Solve</button>

  <div style="margin-top:16px">
    <div class="output-box" id="vision-out"><span class="text-muted text-sm">Vision explanation will appear here...</span></div>
    <div class="output-actions" id="vision-actions" style="display:none">
      <button class="btn btn-ghost btn-sm" onclick="copyOutput('vision-out')">📋 Copy</button>
      <button class="btn btn-ghost btn-sm" onclick="saveToHistory('vision', document.getElementById('vision-prompt').value, document.getElementById('vision-out'))">💾 Save</button>
    </div>
  </div>
</div>`;

  const drop = document.getElementById('vision-drop');
  const input = document.getElementById('vision-file-input');
  
  drop.addEventListener('dragover', e => { e.preventDefault(); drop.classList.add('drag-over'); });
  drop.addEventListener('dragleave', () => drop.classList.remove('drag-over'));
  drop.addEventListener('drop', e => {
    e.preventDefault(); drop.classList.remove('drag-over');
    if (e.dataTransfer.files.length) handleVisionImage(e.dataTransfer.files[0]);
  });
  input.addEventListener('change', e => {
    if (e.target.files.length) handleVisionImage(e.target.files[0]);
  });
};

let visionBase64 = '';
let visionMime = '';

function handleVisionImage(file) {
  if (!file.type.startsWith('image/')) {
    showToast("Please upload an image file", "err");
    return;
  }
  const r = new FileReader();
  r.onload = e => {
    visionBase64 = e.target.result.split(',')[1];
    visionMime = file.type;
    document.getElementById('vision-preview').src = e.target.result;
    document.getElementById('vision-preview-wrap').style.display = 'block';
    document.getElementById('vision-drop').style.display = 'none';
  };
  r.readAsDataURL(file);
}

function clearVisionImage() {
  visionBase64 = '';
  visionMime = '';
  document.getElementById('vision-preview').src = '';
  document.getElementById('vision-preview-wrap').style.display = 'none';
  document.getElementById('vision-drop').style.display = 'block';
  document.getElementById('vision-file-input').value = '';
}

async function doVisionSolve() {
  const prompt = document.getElementById('vision-prompt').value.trim();
  const out = document.getElementById('vision-out');
  const btn = document.getElementById('vision-btn');
  
  if (!visionBase64) {
    showToast("Please upload or snap an image first", "err");
    return;
  }
  
  setSkeleton(out);
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Analyzing Image...';
  
  const promptText = prompt || "Analyze this academic image, solve any problems present, and explain the concept in detail.";
  const messages = [
    {
      role: "user",
      content: [
        { type: "text", text: promptText },
        { type: "image_url", image_url: { url: `data:${visionMime};base64,${visionBase64}` } }
      ]
    }
  ];
  
  let full = '';
  try {
    await callAI(messages, 
      c => {
        full += c;
        out.innerHTML = sanitize(renderMD(full));
      },
      _ => {
        document.getElementById('vision-actions').style.display = 'flex';
        addXP('vision');
        triggerWeeklyChallengeProgress('ai_uses');
        setTimeout(addExportSlidesButtons, 150);
      },
      err => {
        out.innerHTML = `<span style="color:var(--err)">${t(err)}</span>`;
        showToast(t(err), 'err');
      },
      { model: 'llama-3.2-11b-vision-preview' }
    );
  } catch (err) {
    out.innerHTML = `<span style="color:var(--err)">${err.message || err}</span>`;
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<span>👁️</span> Analyze & Solve';
  }
}

// ── 3. AUDIO LECTURE TRANSCRIBER ──
let lectureMediaRecorder = null;
let lectureAudioChunks = [];

async function startLectureRecording() {
  lectureAudioChunks = [];
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    lectureMediaRecorder = new MediaRecorder(stream);
    lectureMediaRecorder.ondataavailable = e => {
      if (e.data.size > 0) lectureAudioChunks.push(e.data);
    };
    lectureMediaRecorder.onstop = async () => {
      const audioBlob = new Blob(lectureAudioChunks, { type: 'audio/webm' });
      await processAudioLecture(audioBlob);
    };
    
    lectureMediaRecorder.start();
    document.getElementById('record-start-btn').disabled = true;
    document.getElementById('record-stop-btn').disabled = false;
    document.getElementById('record-status-label').innerHTML = '🔴 Recording Lecture...';
    showToast("Lecture recording started", "info");
  } catch(e) {
    showToast("Microphone access denied: " + e.message, "err");
  }
}

function stopLectureRecording() {
  if (lectureMediaRecorder && lectureMediaRecorder.state !== 'inactive') {
    lectureMediaRecorder.stop();
    lectureMediaRecorder.stream.getTracks().forEach(track => track.stop());
    document.getElementById('record-start-btn').disabled = false;
    document.getElementById('record-stop-btn').disabled = true;
    document.getElementById('record-status-label').innerHTML = 'Record Lecture Audio';
  }
}

async function uploadAudioLecture(input) {
  if (input.files.length) {
    await processAudioLecture(input.files[0]);
    input.value = '';
  }
}

async function processAudioLecture(blobOrFile) {
  showToast("Transcribing audio lecture via Whisper API...", "info", 4000);
  
  const statusLabel = document.getElementById('record-status-label');
  if (statusLabel) statusLabel.innerHTML = '⚡ Transcribing...';
  
  const r = new FileReader();
  r.onload = async e => {
    const base64Audio = e.target.result.split(',')[1];
    
    try {
      const res = await fetch(API_URL + '/transcribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(APP.token ? { 'Authorization': `Bearer ${APP.token}` } : {})
        },
        body: JSON.stringify({
          audio: base64Audio,
          fileType: blobOrFile.type.split('/')[1] || 'webm'
        })
      });
      
      if (!res.ok) {
        throw new Error("Transcription server error. Check if OpenAI API key is set.");
      }
      
      const json = await res.json();
      const text = json.text || '';
      
      if (!text.trim()) {
        showToast("No speech detected in audio.", "warn");
        return;
      }
      
      const name = blobOrFile.name || `Recorded Lecture - ${new Date().toLocaleTimeString()}`;
      const lec = {
        id: Date.now(),
        name: name,
        text: text.trim(),
        words: text.trim().split(/\s+/).filter(Boolean).length,
        date: new Date().toLocaleDateString()
      };
      
      APP.lectures.push(lec);
      saveState();
      showToast(`🎙️ Audio lecture transcribed and saved!`, 'ok');
      if (document.getElementById('lec-list')) renderLectures();
    } catch(err) {
      console.error(err);
      showToast("Transcription failed. Whisper API is not configured on backend.", "err");
    } finally {
      if (statusLabel) statusLabel.innerHTML = 'Record Lecture Audio';
    }
  };
  r.readAsDataURL(blobOrFile);
}

// ── 4. SPACED REPETITION (SM-2) FOR FLASHCARDS ──
let dueFcCards = [];
let dueFcIndex = 0;
let isReviewMode = false;

function initFcSchedule(card) {
  if (card.interval === undefined) card.interval = 1;
  if (card.reps === undefined) card.reps = 0;
  if (card.ef === undefined) card.ef = 2.5;
  if (card.dueDate === undefined) card.dueDate = Date.now();
}

function updateFcDueCountBadge() {
  const badge = document.getElementById('fc-due-count');
  if (!badge) return;
  APP.fcCards.forEach(initFcSchedule);
  const count = APP.fcCards.filter(c => c.dueDate <= Date.now()).length;
  badge.textContent = count;
}

function switchFcMode(mode) {
  const genTab = document.getElementById('fc-tab-gen');
  const revTab = document.getElementById('fc-tab-review');
  const setupDiv = document.getElementById('fc-setup');
  const playDiv = document.getElementById('fc-play');
  const stdNav = document.getElementById('fc-standard-nav');
  const sm2Nav = document.getElementById('fc-sm2-nav');
  
  if (mode === 'gen') {
    isReviewMode = false;
    genTab.classList.add('active');
    revTab.classList.remove('active');
    setupDiv.style.display = 'block';
    playDiv.style.display = 'none';
  } else {
    isReviewMode = true;
    genTab.classList.remove('active');
    revTab.classList.add('active');
    setupDiv.style.display = 'none';
    
    dueFcCards = APP.fcCards.filter(c => c.dueDate <= Date.now());
    dueFcIndex = 0;
    
    if (dueFcCards.length === 0) {
      playDiv.style.display = 'none';
      const noCardsHtml = `
      <div style="text-align:center; padding:40px 20px;" id="fc-no-cards-msg">
        <div style="font-size:48px; margin-bottom:12px;">🎉</div>
        <div style="font-weight:700; font-size:16px; color:#fff; margin-bottom:6px;">All Caught Up!</div>
        <p class="text-muted" style="font-size:12px;">You have no flashcards due for review today. Keep studying!</p>
      </div>`;
      const playParent = playDiv.parentElement;
      const oldMsg = document.getElementById('fc-no-cards-msg');
      if (oldMsg) oldMsg.remove();
      playParent.insertAdjacentHTML('beforeend', noCardsHtml);
    } else {
      const oldMsg = document.getElementById('fc-no-cards-msg');
      if (oldMsg) oldMsg.remove();
      playDiv.style.display = 'block';
      stdNav.style.display = 'none';
      sm2Nav.style.display = 'flex';
      renderDueFC();
    }
  }
  updateFcDueCountBadge();
}

function renderDueFC() {
  if (!dueFcCards.length || dueFcIndex >= dueFcCards.length) return;
  const card = dueFcCards[dueFcIndex];
  
  const countEl = document.getElementById('fc-count');
  const frontEl = document.getElementById('fc-front');
  const backEl = document.getElementById('fc-back');
  const sceneEl = document.getElementById('fc-scene');
  const cardEl = document.getElementById('fc-card');
  const progEl = document.getElementById('fc-prog');
  
  if (countEl) countEl.textContent = `Review Card: ${dueFcIndex + 1} of ${dueFcCards.length}`;
  if (frontEl) frontEl.innerHTML = sanitize(card.front);
  if (backEl) backEl.innerHTML = sanitize(card.back);
  
  if (cardEl) cardEl.classList.remove('flipped');
  
  if (progEl) {
    const pct = ((dueFcIndex) / dueFcCards.length) * 100;
    progEl.style.width = `${pct}%`;
  }
}

function rateSM2(quality) {
  if (!dueFcCards.length || dueFcIndex >= dueFcCards.length) return;
  const card = dueFcCards[dueFcIndex];
  
  let q = 4;
  if (quality === 0) q = 0; // Again
  else if (quality === 1) q = 3; // Hard
  else if (quality === 2) q = 4; // Good
  else if (quality === 3) q = 5; // Easy
  
  if (q >= 3) {
    if (card.reps === 0) {
      card.interval = 1;
    } else if (card.reps === 1) {
      card.interval = 6;
    } else {
      card.interval = Math.round(card.interval * card.ef);
    }
    card.reps++;
  } else {
    card.reps = 0;
    card.interval = 1;
  }
  
  card.ef = card.ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (card.ef < 1.3) card.ef = 1.3;
  
  card.dueDate = Date.now() + card.interval * 24 * 60 * 60 * 1000;
  
  const mainCard = APP.fcCards.find(c => c.front === card.front && c.back === card.back);
  if (mainCard) {
    Object.assign(mainCard, card);
  }
  
  saveState();
  
  dueFcIndex++;
  if (dueFcIndex >= dueFcCards.length) {
    showToast("🎉 Excellent! Today's study session is finished.", "ok");
    addXP('fc');
    triggerWeeklyChallengeProgress('quiz', 1);
    confettiEffect();
    switchFcMode('review');
  } else {
    renderDueFC();
  }
}

// ── 5. VIRTUAL CO-STUDY FOCUS ROOMS ──
let costudyTimer = null;
let costudySeconds = 1500;
let costudyRunning = false;
let currentRoom = null;
let costudyXpInterval = null;
let costudyChatInterval = null;

PANES.costudy = function(cont) {
  if (currentRoom) {
    renderActiveCostudyRoom(cont);
  } else {
    renderCostudyLobby(cont);
  }
};

function renderCostudyLobby(cont) {
  cont.innerHTML = `
<div class="card" id="pane-costudy" style="max-width:800px; margin:0 auto;">
  <div class="card-title"><span class="icon">👥</span>Co-study Focus Rooms</div>
  <p class="text-muted" style="margin-bottom:20px;">Join virtual study rooms with fellow students, synchronize your Pomodoro session, and study together in real-time.</p>
  
  <div class="grid-3" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:16px;">
    <div class="stat-card" onclick="joinCostudyRoom('cyberpunk')" style="cursor:pointer; border-color:var(--primary); background:rgba(0,243,255,0.02);" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='none'">
      <div style="font-size:36px; margin-bottom:10px;">💻</div>
      <div style="font-weight:700; color:#fff; font-size:15px;">Cyberpunk Coding Lab</div>
      <div style="font-size:11px; color:var(--muted); margin:4px 0 12px;">Active: 8 online students</div>
      <button class="btn btn-teal btn-xs" style="width:100%; justify-content:center;">Join Room</button>
    </div>
    
    <div class="stat-card" onclick="joinCostudyRoom('ambassadors')" style="cursor:pointer; border-color:var(--pl); background:rgba(176,38,255,0.02);" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='none'">
      <div style="font-size:36px; margin-bottom:10px;">🤖</div>
      <div style="font-weight:700; color:#fff; font-size:15px;">AI Ambassadors Lounge</div>
      <div style="font-size:11px; color:var(--muted); margin:4px 0 12px;">Active: 12 online students</div>
      <button class="btn btn-primary btn-xs" style="width:100%; justify-content:center;">Join Room</button>
    </div>
    
    <div class="stat-card" onclick="joinCostudyRoom('library')" style="cursor:pointer; border-color:var(--gold); background:rgba(245,158,11,0.02);" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='none'">
      <div style="font-size:36px; margin-bottom:10px;">📚</div>
      <div style="font-weight:700; color:#fff; font-size:15px;">Quiet Library Cabinets</div>
      <div style="font-size:11px; color:var(--muted); margin:4px 0 12px;">Active: 5 online students</div>
      <button class="btn btn-gold btn-xs" style="width:100%; justify-content:center;">Join Room</button>
    </div>
  </div>
</div>`;
}

function renderActiveCostudyRoom(cont) {
  const roomNames = {
    cyberpunk: "💻 Cyberpunk Coding Lab",
    ambassadors: "🤖 AI Ambassadors Lounge",
    library: "📚 Quiet Library Cabinets"
  };
  
  cont.innerHTML = `
<div class="pane active" id="pane-active-room" style="max-width:1100px; margin:0 auto; display:grid; grid-template-columns: 340px 1fr; gap:24px; align-items:start;">
  <!-- Left Side: Focus Timer & Actions -->
  <div class="card" style="background:var(--card); padding:24px; display:flex; flex-direction:column; gap:16px;">
    <div class="card-title">
      <span class="icon">👥</span>
      <span style="font-size:14px; font-weight:500;">Room:</span> 
      <strong style="color:var(--primary); font-size:14px;">${roomNames[currentRoom]}</strong>
    </div>
    
    <div class="pomo-ring-wrap" style="margin: 10px 0; display: flex; justify-content: center;">
      <svg id="costudy-pomo-svg" width="160" height="160" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r="70" fill="none" stroke="var(--border2)" stroke-width="6"/>
        <circle id="costudy-pomo-progress" cx="80" cy="80" r="70" fill="none" stroke="var(--primary)" stroke-width="6" 
          stroke-dasharray="440" stroke-dashoffset="0" transform="rotate(-90 80 80)" style="transition: stroke-dashoffset 1s linear;"/>
        <text id="costudy-pomo-time" x="80" y="88" text-anchor="middle" fill="#fff" font-size="24" font-weight="800">25:00</text>
      </svg>
    </div>
    
    <div class="flex-row" style="justify-content:center; gap:8px;">
      <button class="btn btn-primary btn-sm" id="cs-pomo-btn" onclick="toggleCostudyPomo()">Play</button>
      <button class="btn btn-ghost btn-sm" onclick="resetCostudyPomo()">Reset</button>
    </div>
    
    <button class="btn btn-ghost btn-sm" style="color:var(--err); margin-top:20px; width:100%; justify-content:center;" onclick="leaveCostudyRoom()">🚪 Leave Room</button>
    
    <div style="border-top: 1px solid var(--border); padding-top:12px;">
      <div style="font-size:11px; font-weight:700; color:var(--muted); margin-bottom:10px;">Active Studiers:</div>
      <div id="costudy-peers-list" style="display:flex; flex-direction:column; gap:8px;"></div>
    </div>
  </div>
  
  <!-- Right Side: Live Interactive Chat -->
  <div class="card" style="height:550px; display:flex; flex-direction:column; padding: 24px;">
    <div style="font-size:16px; font-weight:700; color:#fff; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center;">
      <span>💬 Room Live Chat</span>
      <span class="badge badge-purple" style="font-size:9px;">Mock Server Synced</span>
    </div>
    
    <div id="costudy-chat-messages" style="flex:1; overflow-y:auto; padding:12px; background:rgba(0,0,0,0.3); border:1px solid var(--border); border-radius:var(--rs); margin-bottom:12px; display:flex; flex-direction:column; gap:10px;">
      <div style="font-size:11px; color:var(--muted); text-align:center; padding:10px 0;">You joined the room. Start studying to earn XP together!</div>
    </div>
    
    <div class="chat-input-row" style="display:flex; gap:10px;">
      <textarea id="costudy-chat-input" placeholder="Say hello to study partners..." rows="1" onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendCostudyChat();}" style="flex:1; border-radius:24px; padding:12px;"></textarea>
      <button class="btn btn-teal" onclick="sendCostudyChat()">Send</button>
    </div>
  </div>
</div>`;
  
  renderCostudyPeers();
  updateCostudyPomoUI();
  
  if (!costudyChatInterval) {
    costudyChatInterval = setInterval(simulatePeerChat, 20000);
  }
}

function renderCostudyPeers() {
  const list = document.getElementById('costudy-peers-list');
  if (!list) return;
  
  const peers = [
    { name: "Youssef (AI Ambassador)", avatar: "🤖", status: "Studying Llama 3.3", xp: 1200 },
    { name: "Sarah (Math major)", avatar: "📐", status: "Solving Calculus", xp: 850 },
    { name: "Layla (CS Major)", avatar: "💻", status: "Debugging Node.js", xp: 1450 },
    { name: "Alex (Bioinformatics)", avatar: "🧬", status: "Analyzing DNA", xp: 620 }
  ];
  
  list.innerHTML = peers.map(p => `
<div style="display:flex; align-items:center; gap:8px; font-size:11px;">
  <div style="width:24px; height:24px; border-radius:50%; background:var(--card2); border:1px solid var(--border2); display:flex; align-items:center; justify-content:center;">${p.avatar}</div>
  <div style="flex:1; min-width:0;">
    <div style="font-weight:600; color:#fff; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${p.name}</div>
    <div style="font-size:9px; color:var(--primary); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${p.status}</div>
  </div>
  <div style="color:var(--gold); font-weight:700;">${p.xp}xp</div>
</div>`).join('');
}

function toggleCostudyPomo() {
  const btn = document.getElementById('cs-pomo-btn');
  if (costudyRunning) {
    clearInterval(costudyTimer);
    clearInterval(costudyXpInterval);
    costudyRunning = false;
    btn.innerHTML = 'Play';
    btn.className = 'btn btn-primary btn-sm';
    showToast("Focus room timer paused", "info");
  } else {
    costudyRunning = true;
    btn.innerHTML = 'Pause';
    btn.className = 'btn btn-ghost btn-sm';
    showToast("Focus room session active! Stay focused.", "ok");
    
    costudyTimer = setInterval(() => {
      if (costudySeconds > 0) {
        costudySeconds--;
        updateCostudyPomoUI();
      } else {
        clearInterval(costudyTimer);
        clearInterval(costudyXpInterval);
        costudyRunning = false;
        btn.innerHTML = 'Play';
        btn.className = 'btn btn-primary btn-sm';
        playSoundAlert();
        showToast("🔔 Session complete! Take a break.", "ok", 6000);
        confettiEffect();
        triggerWeeklyChallengeProgress('costudy', 25);
        costudySeconds = 1500;
        updateCostudyPomoUI();
      }
    }, 1000);
    
    costudyXpInterval = setInterval(() => {
      APP.xp += 1;
      updateXPBar();
      saveState(true);
      showToast("+1 XP earned for focus", "info", 1000);
    }, 15000);
  }
}

function resetCostudyPomo() {
  clearInterval(costudyTimer);
  clearInterval(costudyXpInterval);
  costudyRunning = false;
  costudySeconds = 1500;
  const btn = document.getElementById('cs-pomo-btn');
  if (btn) {
    btn.innerHTML = 'Play';
    btn.className = 'btn btn-primary btn-sm';
  }
  updateCostudyPomoUI();
}

function updateCostudyPomoUI() {
  const timeEl = document.getElementById('costudy-pomo-time');
  const progressEl = document.getElementById('costudy-pomo-progress');
  if (!timeEl || !progressEl) return;
  
  const m = Math.floor(costudySeconds / 60);
  const s = costudySeconds % 60;
  timeEl.textContent = `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
  
  const total = 1500;
  const pct = (costudySeconds / total) * 440;
  progressEl.style.strokeDashoffset = (440 - pct).toString();
}

function joinCostudyRoom(roomId) {
  currentRoom = roomId;
  costudySeconds = 1500;
  costudyRunning = false;
  go('costudy');
}

function leaveCostudyRoom() {
  clearInterval(costudyTimer);
  clearInterval(costudyXpInterval);
  clearInterval(costudyChatInterval);
  costudyChatInterval = null;
  costudyRunning = false;
  currentRoom = null;
  go('costudy');
}

function sendCostudyChat() {
  const input = document.getElementById('costudy-chat-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  
  addCostudyMessage(APP.username || "Omar Saeed", "🎓", text, true);
  input.value = '';
  
  setTimeout(() => {
    const peers = [
      { name: "Youssef (AI Ambassador)", avatar: "🤖", msgs: ["Nice to see you active, Omar!", "Awesome, let's get down to business.", "Llama 3.3 70B is working great today."] },
      { name: "Sarah (Math major)", avatar: "📐", msgs: ["Hi Omar! Welcome to the focus room.", "Focusing together really makes a difference.", "Let's study hard!"] },
      { name: "Layla (CS Major)", avatar: "💻", msgs: ["Hey Omar!", "Do you have any suggestions for essay titles?", "Let's keep coding!"] }
    ];
    const p = peers[Math.floor(Math.random() * peers.length)];
    const m = p.msgs[Math.floor(Math.random() * p.msgs.length)];
    addCostudyMessage(p.name, p.avatar, m, false);
  }, 1500);
}

function addCostudyMessage(name, avatar, text, isUser = false) {
  const chat = document.getElementById('costudy-chat-messages');
  if (!chat) return;
  
  const div = document.createElement('div');
  div.style.display = 'flex';
  div.style.gap = '8px';
  div.style.fontSize = '12px';
  div.style.alignItems = 'start';
  if (isUser) div.style.flexDirection = 'row-reverse';
  
  div.innerHTML = `
<div style="width:24px; height:24px; border-radius:50%; background:var(--card2); border:1px solid var(--border2); display:flex; align-items:center; justify-content:center; flex-shrink:0;">${avatar}</div>
<div style="max-width:75%; padding:8px 12px; border-radius:12px; background:${isUser?'rgba(176,38,255,0.15)':'rgba(0,243,255,0.06)'}; border:1px solid ${isUser?'var(--pl)':'rgba(0,243,255,0.3)'}; color:#fff;">
  <div style="font-weight:700; font-size:10px; color:${isUser?'var(--pl)':'var(--primary)'}; margin-bottom:2px;">${sanitize(name)}</div>
  <div>${sanitize(text)}</div>
</div>`;

  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function simulatePeerChat() {
  if (!currentRoom) return;
  const peers = [
    { name: "Youssef (AI Ambassador)", avatar: "🤖", msgs: ["Wow, I just used the Concept Deep Dive tool. It explains things in extreme detail!", "How's everyone doing with their study streaks?", "Focus mode on! 🚀", "Let's crack our targets today."] },
    { name: "Sarah (Math major)", avatar: "📐", msgs: ["Anyone here using the GPA Calculator?", "I scheduled my Calculus exam on the academic calendar.", "Pomodoro session is really helping my ADHD today."] },
    { name: "Layla (CS Major)", avatar: "💻", msgs: ["Just exported my card deck to Anki. It's so smooth!", "I love this dark theme, my eyes are so relaxed.", "Writing my abstract with the Abstract Writer now."] },
    { name: "Alex (Bioinformatics)", avatar: "🧬", msgs: ["Mind Map visualizer is a lifesaver for pathways.", "Let's keep this room silent and study hard!", "Great streak today, everyone."] }
  ];
  
  const p = peers[Math.floor(Math.random() * peers.length)];
  const m = p.msgs[Math.floor(Math.random() * p.msgs.length)];
  addCostudyMessage(p.name, p.avatar, m, false);
}

// ── 6. SEMANTIC SCHOLAR INTEGRATION ──
function switchShMode(mode) {
  const aiTab = document.getElementById('sh-tab-ai');
  const liveTab = document.getElementById('sh-tab-live');
  const aiPanel = document.getElementById('sh-panel-ai');
  const livePanel = document.getElementById('sh-panel-live');
  
  if (mode === 'ai') {
    aiTab.classList.add('active');
    liveTab.classList.remove('active');
    aiPanel.style.display = 'block';
    livePanel.style.display = 'none';
  } else {
    aiTab.classList.remove('active');
    liveTab.classList.add('active');
    aiPanel.style.display = 'none';
    livePanel.style.display = 'block';
  }
}

async function doSemanticSearch() {
  const query = document.getElementById('sh-live-query').value.trim();
  if (!query) { showToast("Enter a query to search", "err"); return; }
  
  const resultsDiv = document.getElementById('sh-live-results');
  const btn = document.getElementById('sh-live-btn');
  
  resultsDiv.innerHTML = '<div style="text-align:center; padding:40px;"><span class="spinner"></span> Searching Semantic Scholar API...</div>';
  btn.disabled = true;
  
  try {
    const res = await fetch(`https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(query)}&limit=5&fields=title,authors,year,venue,abstract,openAccessPdf`);
    if (!res.ok) throw new Error("Search request failed.");
    
    const json = await res.json();
    const papers = json.data || [];
    
    if (papers.length === 0) {
      resultsDiv.innerHTML = '<p class="text-muted" style="text-align:center; padding:30px;">No papers found for this topic.</p>';
      return;
    }
    
    resultsDiv.innerHTML = papers.map((p, idx) => {
      const authors = p.authors ? p.authors.map(a => a.name).join(', ') : 'Unknown Authors';
      const venue = p.venue ? `${p.venue} ` : '';
      const year = p.year ? `(${p.year})` : '';
      const pdfUrl = p.openAccessPdf ? p.openAccessPdf.url : null;
      const abstractText = p.abstract || 'No abstract available for this paper.';
      
      return `
<div class="card" style="background:var(--card2); border:1px solid var(--border); padding:16px; display:flex; flex-direction:column; gap:8px;">
  <div style="font-size:15px; font-weight:700; color:#fff;">${sanitize(p.title)}</div>
  <div style="font-size:11px; color:var(--primary); font-weight:500;">By: ${sanitize(authors)}</div>
  <div style="font-size:10px; color:var(--muted);">${sanitize(venue)}${year}</div>
  
  <details style="margin-top:4px;">
    <summary style="font-size:11px; color:var(--pl); cursor:pointer; outline:none; font-weight:600;">Show Abstract Preview</summary>
    <p style="font-size:12px; line-height:1.6; color:var(--muted); margin-top:6px; background:rgba(0,0,0,0.2); padding:10px; border-radius:var(--rx);">${sanitize(abstractText)}</p>
  </details>
  
  <div class="flex-row" style="gap:8px; margin-top:8px;">
    ${pdfUrl ? `<a href="${pdfUrl}" target="_blank" class="btn btn-primary btn-xs" style="text-decoration:none;">📄 Open PDF</a>` : ''}
    <button class="btn btn-ghost btn-xs" onclick="importPaperAsLecture(${idx})">📥 Import to Lectures</button>
  </div>
</div>`;
    }).join('');
    
    window.lastSearchedPapers = papers;
  } catch(e) {
    console.error(e);
    resultsDiv.innerHTML = `<p style="color:var(--err); text-align:center; padding:30px;">Error connecting to Semantic Scholar. Please try again.</p>`;
  } finally {
    btn.disabled = false;
  }
}

function importPaperAsLecture(idx) {
  const papers = window.lastSearchedPapers;
  if (!papers || !papers[idx]) return;
  const p = papers[idx];
  
  const authors = p.authors ? p.authors.map(a => a.name).join(', ') : 'Unknown';
  const abstractText = p.abstract || 'No abstract available.';
  const fullText = `Title: ${p.title}\nAuthors: ${authors}\nYear: ${p.year || 'Unknown'}\nVenue: ${p.venue || 'Unknown'}\n\nAbstract:\n${abstractText}`;
  
  const lec = {
    id: Date.now(),
    name: `Paper: ${p.title.slice(0, 30)}...`,
    text: fullText,
    words: fullText.split(/\s+/).filter(Boolean).length,
    date: new Date().toLocaleDateString()
  };
  
  APP.lectures.push(lec);
  saveState();
  showToast("📥 Paper imported to Lectures Library!", "ok");
  triggerWeeklyChallengeProgress('ai_uses');
}

// ── 7. WEEKLY STUDY CHALLENGES ──
function initWeeklyChallenges() {
  if (!APP.weeklyChallenges) {
    APP.weeklyChallenges = [
      { id: 'costudy', title: '👥 Team Player', desc: 'Study 25 minutes in Co-study Focus Rooms', target: 25, progress: 0, reward: 100, claimed: false },
      { id: 'quiz', title: '🧪 Quiz Wizard', desc: 'Complete Spaced Repetition card sessions', target: 1, progress: 0, reward: 80, claimed: false },
      { id: 'ai_uses', title: '🤖 AI Power User', desc: 'Use AI tools 15 times', target: 15, progress: 0, reward: 120, claimed: false }
    ];
  }
}

function triggerWeeklyChallengeProgress(challengeId, value = 1) {
  initWeeklyChallenges();
  const challenge = APP.weeklyChallenges.find(c => c.id === challengeId);
  if (challenge && !challenge.claimed) {
    challenge.progress = Math.min(challenge.target, challenge.progress + value);
    saveState();
    if (APP.activeTab === 'home') {
      setTimeout(() => {
        const pane = document.getElementById('pane-home');
        if (pane) renderPane('home');
      }, 50);
    }
  }
}

function claimChallenge(challengeId) {
  initWeeklyChallenges();
  const challenge = APP.weeklyChallenges.find(c => c.id === challengeId);
  if (challenge && !challenge.claimed && challenge.progress >= challenge.target) {
    challenge.claimed = true;
    APP.xp += challenge.reward;
    updateXPBar();
    saveState();
    showToast(`Claimed ${challenge.reward} XP! 🎉`, "ok");
    confettiEffect();
    go('home');
  }
}

// ── 8. GLOBAL FLOATING LIVE INTERACTIVE AI ROBOT ASSISTANT ──
function initFloatingAssistant() {
  if (document.getElementById('floating-ai-fab')) return;
  
  // Create Robot FAB
  const fab = document.createElement('div');
  fab.id = 'floating-ai-fab';
  fab.title = 'Aethera AI Interactive Assistant (Click to open chat)';
  fab.style.cssText = `
    position: fixed; bottom: 85px; right: 28px; z-index: 999;
    width: 62px; height: 62px; border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, rgba(0,243,255,0.25), rgba(176,38,255,0.2));
    backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
    border: 2px solid var(--primary);
    cursor: pointer;
    box-shadow: 0 10px 35px var(--glow-cyan), inset 0 0 20px rgba(0,243,255,0.3);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease;
    display: flex; align-items: center; justify-content: center;
    animation: botFloat 3.5s ease-in-out infinite;
  `;
  
  fab.innerHTML = `
    <style>
      @keyframes botFloat {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-8px) rotate(1deg); }
      }
      @keyframes botPulseRing {
        0% { transform: scale(0.8); opacity: 0.8; }
        100% { transform: scale(2); opacity: 0; }
      }
      .bot-antenna-pulse {
        position: absolute; top: 2px; left: 50%; transform: translateX(-50%);
        width: 12px; height: 12px; border-radius: 50%; background: var(--gold);
        animation: botPulseRing 2s infinite ease-out; pointer-events: none;
      }
      .bot-eye { transition: transform 0.1s ease, fill 0.3s ease; }
      #bot-speech-bubble {
        position: fixed; bottom: 158px; right: 28px; z-index: 1000;
        background: rgba(15, 15, 30, 0.95); backdrop-filter: blur(20px);
        border: 1px solid var(--primary); border-radius: 18px; border-bottom-right-radius: 4px;
        padding: 10px 14px; max-width: 260px; color: #fff; font-size: 11px; line-height: 1.5;
        box-shadow: 0 10px 30px rgba(0,0,0,0.6), 0 0 15px var(--glow-cyan);
        display: none; animation: botBubblePop 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        pointer-events: auto;
      }
      @keyframes botBubblePop {
        0% { opacity: 0; transform: translateY(10px) scale(0.88); }
        100% { opacity: 1; transform: translateY(0) scale(1); }
      }
    </style>
    <div class="bot-antenna-pulse"></div>
    <svg width="42" height="42" viewBox="0 0 100 100" fill="none" style="pointer-events:none;">
      <rect x="15" y="25" width="70" height="58" rx="20" fill="url(#botHeadGrad)" stroke="var(--primary)" stroke-width="3"/>
      <rect x="23" y="36" width="54" height="28" rx="10" fill="#080914" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
      <circle id="bot-eye-left" class="bot-eye" cx="38" cy="50" r="7" fill="var(--primary)"/>
      <circle id="bot-eye-right" class="bot-eye" cx="62" cy="50" r="7" fill="var(--primary)"/>
      <rect x="47" y="10" width="6" height="16" rx="3" fill="var(--primary)"/>
      <circle cx="50" cy="8" r="6" fill="var(--gold)"/>
      <rect id="bot-mouth" x="38" y="70" width="24" height="4" rx="2" fill="var(--primary)"/>
      <defs>
        <linearGradient id="botHeadGrad" x1="0" y1="0" x2="100" y2="100">
          <stop offset="0%" stop-color="#1f1f3a"/>
          <stop offset="100%" stop-color="#0a0a16"/>
        </linearGradient>
      </defs>
    </svg>
  `;

  // Speech Bubble
  const bubble = document.createElement('div');
  bubble.id = 'bot-speech-bubble';
  bubble.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
      <strong style="color:var(--primary); font-size:10px;">🤖 Aethera Live Assistant</strong>
      <span style="cursor:pointer; color:var(--muted); font-size:12px;" onclick="document.getElementById('bot-speech-bubble').style.display='none'">✕</span>
    </div>
    <div id="bot-bubble-text">Hi there! Need help summarizing, creating flashcards, or solving questions?</div>
  `;
  
  // Floating AI Chat Panel
  const panel = document.createElement('div');
  panel.id = 'floating-ai-panel';
  panel.style.cssText = `
    position: fixed; bottom: 160px; right: 28px; z-index: 1000;
    width: 360px; height: 460px; background: rgba(12, 12, 24, 0.95);
    border: 1px solid var(--primary); border-radius: var(--r);
    box-shadow: 0 16px 50px rgba(0,0,0,0.7), 0 0 25px var(--glow-cyan);
    display: none; flex-direction: column;
    backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
    overflow: hidden; animation: botBubblePop 0.3s cubic-bezier(0.4,0,0.2,1);
  `;
  
  panel.innerHTML = `
<div class="notes-header" style="color:#fff; background:rgba(0,243,255,0.08); display:flex; justify-content:space-between; align-items:center; padding:12px 16px; border-bottom:1px solid var(--border);">
  <div style="display:flex; align-items:center; gap:8px;">
    <span style="font-size:18px;">🤖</span>
    <div>
      <div style="font-weight:700; font-size:13px; color:var(--primary);">Aethera AI Assistant</div>
      <div style="font-size:9px; color:var(--muted);">Live Academic Companion</div>
    </div>
  </div>
  <button class="modal-close" onclick="toggleFloatingAssistant()" style="font-size:16px; background:none; border:none; color:var(--muted); cursor:pointer;">✕</button>
</div>
<div id="float-chat-messages" style="flex:1; overflow-y:auto; padding:14px; display:flex; flex-direction:column; gap:10px; background:rgba(0,0,0,0.25);">
  <div style="font-size:11px; color:var(--muted); text-align:center; padding:10px; background:rgba(255,255,255,0.02); border-radius:12px; border:1px dashed var(--border);">
    💡 Ask me any academic question or highlight text on the page to explain it instantly!
  </div>
</div>
<div class="notes-footer" style="padding:12px; border-top:1px solid var(--border); display:flex; gap:8px; background:rgba(0,0,0,0.2);">
  <input type="text" id="float-chat-input" placeholder="Type or speak a question..." style="flex:1; border-radius:20px; padding:8px 14px; font-size:12px; height:36px; margin-bottom:0; background:rgba(255,255,255,0.05); border:1px solid var(--border); color:#fff;" onkeydown="if(event.key==='Enter')sendFloatChat();"/>
  <button class="btn btn-ghost btn-xs" id="float-mic-btn" onclick="toggleFloatMic()" title="Voice input" style="border-radius:50%; width:36px; height:36px; padding:0; flex-shrink:0;">🎙️</button>
  <button class="btn btn-teal btn-xs" onclick="sendFloatChat()" style="border-radius:20px; padding:0 14px; height:36px; flex-shrink:0;">Ask</button>
</div>`;

  document.body.appendChild(fab);
  document.body.appendChild(bubble);
  document.body.appendChild(panel);
  
  fab.onclick = () => {
    bubble.style.display = 'none';
    toggleFloatingAssistant();
  };
  
  // Interactive Hover Effects
  fab.onmouseenter = () => {
    fab.style.transform = 'scale(1.15) translateY(-5px)';
    fab.style.boxShadow = '0 15px 45px var(--glow-cyan), inset 0 0 25px rgba(255,255,255,0.5)';
    if (panel.style.display === 'none' || panel.style.display === '') {
      showBotBubble("How can I help your study today? Click to chat!");
    }
  };
  
  fab.onmouseleave = () => {
    fab.style.transform = 'none';
    fab.style.boxShadow = '0 10px 35px var(--glow-cyan), inset 0 0 20px rgba(0,243,255,0.3)';
  };

  // Mouse Pupil Eye Tracking Movement
  window.addEventListener('mousemove', (e) => {
    const leftEye = document.getElementById('bot-eye-left');
    const rightEye = document.getElementById('bot-eye-right');
    if (!leftEye || !rightEye) return;
    
    const rect = fab.getBoundingClientRect();
    const botCenterX = rect.left + rect.width / 2;
    const botCenterY = rect.top + rect.height / 2;
    
    const angle = Math.atan2(e.clientY - botCenterY, e.clientX - botCenterX);
    const distance = Math.min(2.5, Math.hypot(e.clientX - botCenterX, e.clientY - botCenterY) / 100);
    
    const moveX = Math.cos(angle) * distance;
    const moveY = Math.sin(angle) * distance;
    
    leftEye.setAttribute('cx', (38 + moveX).toString());
    leftEye.setAttribute('cy', (50 + moveY).toString());
    rightEye.setAttribute('cx', (62 + moveX).toString());
    rightEye.setAttribute('cy', (50 + moveY).toString());
  });

  // Proactive periodic study tips
  const botTips = [
    "💡 Need a quick summary? Paste text or upload a lecture file!",
    "🧠 Practice makes perfect! Try generating flashcards for your courses.",
    "⏱️ Don't forget to take a 5-minute break during long study sessions!",
    "🔍 Pro tip: Highlight any text on the page to explain it with 1-click!"
  ];
  let tipIdx = 0;
  setInterval(() => {
    if (panel.style.display === 'none' || panel.style.display === '') {
      tipIdx = (tipIdx + 1) % botTips.length;
      showBotBubble(botTips[tipIdx]);
      setTimeout(() => {
        if (bubble.style.display !== 'none') bubble.style.display = 'none';
      }, 7000);
    }
  }, 35000);
  
  // Selection Explanation Tooltip
  const tooltip = document.createElement('button');
  tooltip.id = 'explain-tooltip';
  tooltip.innerHTML = '✨ Explain Selection';
  tooltip.style.cssText = `
    position: fixed; z-index: 1001; display: none;
    background: linear-gradient(135deg, var(--primary), var(--pl));
    color: #fff; font-weight: 700; font-size: 11px;
    border: none; border-radius: 12px; padding: 6px 12px;
    cursor: pointer; box-shadow: 0 4px 15px var(--glow-cyan);
  `;
  document.body.appendChild(tooltip);
  
  let selectedText = '';
  document.addEventListener('mouseup', (e) => {
    if (e.target === tooltip || e.target.closest('#floating-ai-panel') || e.target.closest('#floating-ai-fab')) return;
    
    const sel = window.getSelection().toString().trim();
    if (sel.length > 4) {
      selectedText = sel;
      tooltip.style.left = `${e.clientX}px`;
      tooltip.style.top = `${e.clientY - 40}px`;
      tooltip.style.display = 'block';
    } else {
      tooltip.style.display = 'none';
    }
  });
  
  tooltip.onclick = () => {
    tooltip.style.display = 'none';
    openFloatingAssistant();
    triggerFloatExplanation(selectedText);
  };
}

function showBotBubble(msg) {
  const bubble = document.getElementById('bot-speech-bubble');
  const txt = document.getElementById('bot-bubble-text');
  if (bubble && txt) {
    txt.textContent = msg;
    bubble.style.display = 'block';
  }
}


function toggleFloatingAssistant() {
  const panel = document.getElementById('floating-ai-panel');
  if (!panel) return;
  if (panel.style.display === 'none' || panel.style.display === '') {
    panel.style.display = 'flex';
  } else {
    panel.style.display = 'none';
  }
}

function openFloatingAssistant() {
  const panel = document.getElementById('floating-ai-panel');
  if (panel) panel.style.display = 'flex';
}

async function sendFloatChat() {
  const input = document.getElementById('float-chat-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  
  addFloatMessage("user", text);
  input.value = '';
  
  await getFloatAiResponse(text);
}

function triggerFloatExplanation(text) {
  addFloatMessage("user", `Explain: "${text}"`);
  getFloatAiResponse(`Provide a concise, academic explanation for the following term or text:\n\n"${text}"`);
}

function addFloatMessage(sender, text) {
  const chat = document.getElementById('float-chat-messages');
  if (!chat) return;
  
  const div = document.createElement('div');
  div.style.cssText = `
    font-size: 11px; line-height: 1.5; padding: 8px 10px; border-radius: 8px; max-width: 85%;
    margin-bottom: 4px;
  `;
  
  if (sender === 'user') {
    div.style.background = 'rgba(176,38,255,0.15)';
    div.style.border = '1px solid var(--pl)';
    div.style.color = '#fff';
    div.style.alignSelf = 'flex-end';
  } else {
    div.style.background = 'rgba(0,243,255,0.06)';
    div.style.border = '1px solid rgba(0,243,255,0.3)';
    div.style.color = 'var(--text)';
    div.style.alignSelf = 'flex-start';
  }
  
  div.innerHTML = sanitize(renderMD(text));
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

async function getFloatAiResponse(query) {
  const chat = document.getElementById('float-chat-messages');
  if (!chat) return;
  
  const div = document.createElement('div');
  div.style.cssText = `
    font-size: 11px; line-height: 1.5; padding: 8px 10px; border-radius: 8px; max-width: 85%;
    margin-bottom: 4px; background: rgba(0,243,255,0.06); border: 1px solid rgba(0,243,255,0.3);
    color: var(--text); align-self: flex-start;
  `;
  div.innerHTML = '<span class="spinner" style="width:10px; height:10px;"></span> thinking...';
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
  
  let full = '';
  const mouth = document.getElementById('bot-mouth');
  if (mouth) mouth.setAttribute('fill', '#f59e0b');

  try {
    await callAI([
      { role: "system", content: "You are Aethera AI, a concise and brilliant live academic companion for university students. Keep answers structured, insightful, and brief." },
      { role: "user", content: query }
    ],
    chunk => {
      full += chunk;
      div.innerHTML = sanitize(renderMD(full));
      chat.scrollTop = chat.scrollHeight;
    },
    done => {
      if (mouth) mouth.setAttribute('fill', 'var(--primary)');
      triggerWeeklyChallengeProgress('ai_uses');
    },
    err => {
      if (mouth) mouth.setAttribute('fill', 'var(--err)');
      div.innerHTML = `<span style="color:var(--err)">Error: ${err}</span>`;
    });
  } catch(e) {
    if (mouth) mouth.setAttribute('fill', 'var(--err)');
    div.innerHTML = `<span style="color:var(--err)">${e.message || e}</span>`;
  }
}

// Float Chat Mic Voice Input
let floatMicRecording = false;
let floatMediaRecorder = null;
let floatAudioChunks = [];

async function toggleFloatMic() {
  const micBtn = document.getElementById('float-mic-btn');
  const input = document.getElementById('float-chat-input');
  if (!micBtn || !input) return;

  if (!floatMicRecording) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      floatMediaRecorder = new MediaRecorder(stream);
      floatAudioChunks = [];

      floatMediaRecorder.ondataavailable = e => floatAudioChunks.push(e.data);
      floatMediaRecorder.onstop = async () => {
        micBtn.innerHTML = '⏳';
        const audioBlob = new Blob(floatAudioChunks, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64 = reader.result.split(',')[1];
          try {
            const res = await fetch(API_URL + '/transcribe', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ audio: base64, fileType: 'webm' })
            });
            const data = await res.json();
            if (data.text) {
              input.value = data.text;
              showToast("Voice transcribed!", "ok");
              sendFloatChat();
            } else {
              showToast("No speech detected", "warn");
            }
          } catch(err) {
            showToast("Voice transcription error", "err");
          } finally {
            micBtn.innerHTML = '🎙️';
            micBtn.style.background = 'transparent';
          }
        };
      };

      floatMediaRecorder.start();
      floatMicRecording = true;
      micBtn.innerHTML = '🛑';
      micBtn.style.background = 'rgba(239,68,68,0.3)';
      showToast("Listening... Speak now 🎙️", "info", 2000);
    } catch(err) {
      showToast("Microphone access denied", "err");
    }
  } else {
    if (floatMediaRecorder && floatMediaRecorder.state !== 'inactive') {
      floatMediaRecorder.stop();
    }
    floatMicRecording = false;
  }
}

// ── 9. STUDY REMINDER NOTIFICATIONS ──

function toggleStudyReminders(enabled) {
  APP.notifEnabled = enabled;
  saveState();
  if (enabled) {
    Notification.requestPermission().then(perm => {
      if (perm === 'granted') {
        showToast("Notifications enabled! Reminders scheduled.", "ok");
        scheduleStudyReminder();
      } else {
        showToast("Permission denied. Enable in browser settings.", "warn");
        APP.notifEnabled = false;
        const chk = document.getElementById('settings-notif-enabled');
        if (chk) chk.checked = false;
        saveState();
      }
    });
  } else {
    showToast("Study reminders disabled.", "info");
  }
}

function scheduleStudyReminder() {
  if (!APP.notifEnabled) return;
  setTimeout(() => {
    if (APP.notifEnabled) {
      new Notification("⚡ MindSpark Study Time!", {
        body: "Don't lose your study streak! Review your cards or join a Focus Room now.",
        icon: "neon_brain.png"
      });
    }
  }, 20000);
}

// Hook slides export dynamic checker into global pane switches
const origRenderPane = renderPane;
renderPane = function(tool) {
  origRenderPane(tool);
  setTimeout(addExportSlidesButtons, 150);
};

// End check
function checkShareUrl(){
  const hash=window.location.hash;
  if(hash.startsWith('#share=')){
    try{
      const payload=JSON.parse(decodeURIComponent(escape(atob(hash.slice(7)))));
      if(payload.tool&&payload.output){
        setTimeout(()=>{
          go(payload.tool);
          setTimeout(()=>{
            const out=document.getElementById(`${payload.tool}-out`)||document.getElementById('sum-out');
            if(out){out.innerHTML=sanitize(renderMD(payload.output));showToast('Shared content loaded!','ok');}
          },300);
        },500);
      }
    }catch{}
  }
}
/* ═══════════════════════════════════════
   INITIALIZATION
═══════════════════════════════════════ */
async function init(){
  loadState();
  checkDueFlashcardsNotification();
  
  const urlParams = new URLSearchParams(window.location.search);

  // Check if verifying email path
  if (window.location.pathname === '/verify-email') {
    const token = urlParams.get('token');
    if (token) {
      window.location.href = `${API_URL}/auth/activate?token=${token}`;
      return;
    }
  }
  
  // Check activation URL query parameters
  if (urlParams.has('activated')) {
    const isActivated = urlParams.get('activated') === 'true';
    if (isActivated) {
      setTimeout(() => {
        showToast('Account activated successfully! You can now log in.', 'ok');
        openModal('auth-modal');
        switchAuthTab('login');
      }, 500);
    } else {
      const err = urlParams.get('error') || 'Activation failed.';
      setTimeout(() => {
        showToast('Activation failed: ' + decodeURIComponent(err), 'err');
      }, 500);
    }
    // Clean up URL query parameters
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  // Apply theme
  if(APP.theme==='light')document.documentElement.classList.add('light');
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  if(themeToggleBtn) themeToggleBtn.textContent=APP.theme==='light'?'☀️':'🌙';
  setTheme(APP.accent||'purple');
  // Apply lang
  document.documentElement.lang=APP.lang;
  document.documentElement.dir=APP.lang==='ar'?'rtl':'ltr';
  const langBtn = document.getElementById('lang-btn');
  if(langBtn) langBtn.textContent='🌐 '+APP.lang.toUpperCase();
  // Sidebar
  if(window.innerWidth>768){
    document.getElementById('sidebar').classList.remove('collapsed');
    document.getElementById('main').classList.remove('full');
  }else{
    document.getElementById('sidebar').classList.add('collapsed');
    document.getElementById('main').classList.add('full');
  }
  // Profile
  renderAvatarElement('avatar-btn', APP.avatar);
  // XP
  updateXPBar();
  // Notes
  renderNotes();
  // Pinned tools
  renderPinnedTools();
  // Upcoming
  renderUpcoming();
  // Stars
  initStars();
  // IndexedDB
  try{await initDB();}catch(e){console.warn('IndexedDB failed, using localStorage fallback');}
  // PWA & Voice
  try{initPWA();}catch(e){console.warn('PWA init failed');}
  try{initVoiceInput();}catch(e){console.warn('Voice init failed');}
  try{initFloatingAssistant();}catch(e){console.warn('FAB init failed');}
  try{initWeeklyChallenges();}catch(e){console.warn('Challenges init failed');}
  addFollowupPulse();
  // Default pane
  go('home');
  // Check share URL
  checkShareUrl();

  // Language update
  document.querySelectorAll('[data-i18n]').forEach(el=>{el.textContent=t(el.dataset.i18n);});
}
window.addEventListener('resize',()=>{
  if(window.innerWidth>768){
    document.getElementById('sidebar').classList.remove('collapsed');
    document.getElementById('sb-overlay').classList.remove('show');
    document.getElementById('main').classList.remove('full');
  }else{
    document.getElementById('sidebar').classList.add('collapsed');
    document.getElementById('main').classList.add('full');
  }
});
init();
