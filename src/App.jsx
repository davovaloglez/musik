import { useState, useRef, useEffect } from 'react';

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const NOTE_NAMES_ES = {
  'C': 'Do', 'C#': 'Do#', 'D': 'Re', 'D#': 'Re#', 'E': 'Mi',
  'F': 'Fa', 'F#': 'Fa#', 'G': 'Sol', 'G#': 'Sol#', 'A': 'La', 'A#': 'La#', 'B': 'Si'
};

const SCALE_STEPS = {
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10]
};

const DEGREES_INFO_MAJOR = [
  { roman: 'I', mode: 'Jónico', type: 'Maj', quality: 'Mayor', isMinor: false, function: 'Tónica Principal', tension: 'descanso', urgencyPercent: 0, colorText: 'text-emerald-400', badgeBg: 'bg-emerald-500/20', icon: '<svg class="w-8 h-8 stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M2 20h20M4 20v-6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6M3 10a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2H3v-2z"/><path d="M18 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/><path d="M16 4h-2"/></svg>' },
  { roman: 'II', mode: 'Dórico', type: 'm', quality: 'menor', isMinor: true, function: 'Subdominante', tension: 'movimiento', urgencyPercent: 40, colorText: 'text-amber-400', badgeBg: 'bg-amber-500/20', icon: '<svg class="w-8 h-8 stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="12" cy="5" r="2"/><path d="M12 7v6m0 0l-3 5m3-5l3 5m-5-8h4"/></svg>' },
  { roman: 'III', mode: 'Frigio', type: 'm', quality: 'menor', isMinor: true, function: 'Tónica Secundaria', tension: 'descanso', urgencyPercent: 20, colorText: 'text-emerald-300', badgeBg: 'bg-emerald-600/20', icon: '<svg class="w-8 h-8 stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M17 8h1a4 4 0 1 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8zM6 2v3M10 2v3M14 2v3"/></svg>' },
  { roman: 'IV', mode: 'Lidio', type: 'Maj', quality: 'Mayor', isMinor: false, function: 'Subdominante Principal', tension: 'movimiento', urgencyPercent: 60, colorText: 'text-amber-400', badgeBg: 'bg-amber-500/20', icon: '<svg class="w-8 h-8 stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="12" cy="5" r="2"/><path d="M12 7v5m0 0l-4 6m4-6l4 6m-6-8h5"/></svg>' },
  { roman: 'V', mode: 'Mixolidio', type: 'Maj', quality: 'Mayor (7ª Dom)', isMinor: false, function: 'Dominante Principal', tension: 'urgencia', urgencyPercent: 85, colorText: 'text-rose-400', badgeBg: 'bg-rose-600/20', icon: '<svg class="w-8 h-8 stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="8" cy="5" r="2"/><path d="M8 7l4 5m0 0l-2 5m2-5l3-1M5 14l3-2m9-7a5 5 0 1 1 0 10 5 5 0 0 1 0-10z"/><path d="M17 6v2l1 1"/></svg>' },
  { roman: 'VI', mode: 'Eólico', type: 'm', quality: 'menor (Relativa)', isMinor: true, function: 'Tónica Relativa', tension: 'descanso', urgencyPercent: 15, colorText: 'text-emerald-300', badgeBg: 'bg-emerald-600/20', icon: '<svg class="w-8 h-8 stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M17 8h1a4 4 0 1 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8zM6 2v3M10 2v3M14 2v3"/></svg>' },
  { roman: 'VII', mode: 'Locrio', type: 'dim', quality: 'Disminuido', isMinor: true, function: 'Dominante Inestable', tension: 'urgencia', urgencyPercent: 100, colorText: 'text-rose-300', badgeBg: 'bg-rose-700/20', icon: '<svg class="w-8 h-8 stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>' }
];

const DEGREES_INFO_MINOR = [
  { roman: 'i', mode: 'Eólico', type: 'm', quality: 'menor', isMinor: true, function: 'Tónica Principal', tension: 'descanso', urgencyPercent: 0, colorText: 'text-emerald-400', badgeBg: 'bg-emerald-500/20', icon: '<svg class="w-8 h-8 stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M2 20h20M4 20v-6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6M3 10a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2H3v-2z"/><path d="M18 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/><path d="M16 4h-2"/></svg>' },
  { roman: 'ii°', mode: 'Locrio', type: 'dim', quality: 'Disminuido', isMinor: true, function: 'Subdominante Inestable', tension: 'movimiento', urgencyPercent: 55, colorText: 'text-amber-400', badgeBg: 'bg-amber-500/20', icon: '<svg class="w-8 h-8 stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="12" cy="5" r="2"/><path d="M12 7v6m0 0l-3 5m3-5l3 5m-5-8h4"/></svg>' },
  { roman: 'III', mode: 'Jónico', type: 'Maj', quality: 'Mayor (Relativo)', isMinor: false, function: 'Tónica Relativa', tension: 'descanso', urgencyPercent: 15, colorText: 'text-emerald-300', badgeBg: 'bg-emerald-600/20', icon: '<svg class="w-8 h-8 stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M17 8h1a4 4 0 1 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8zM6 2v3M10 2v3M14 2v3"/></svg>' },
  { roman: 'iv', mode: 'Dórico', type: 'm', quality: 'menor', isMinor: true, function: 'Subdominante Principal', tension: 'movimiento', urgencyPercent: 45, colorText: 'text-amber-400', badgeBg: 'bg-amber-500/20', icon: '<svg class="w-8 h-8 stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="12" cy="5" r="2"/><path d="M12 7v5m0 0l-4 6m4-6l4 6m-6-8h5"/></svg>' },
  { roman: 'v', mode: 'Frigio', type: 'm', quality: 'menor', isMinor: true, function: 'Dominante Menor', tension: 'urgencia', urgencyPercent: 75, colorText: 'text-rose-400', badgeBg: 'bg-rose-600/20', icon: '<svg class="w-8 h-8 stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="8" cy="5" r="2"/><path d="M8 7l4 5m0 0l-2 5m2-5l3-1M5 14l3-2m9-7a5 5 0 1 1 0 10 5 5 0 0 1 0-10z"/><path d="M17 6v2l1 1"/></svg>' },
  { roman: 'VI', mode: 'Lidio', type: 'Maj', quality: 'Mayor', isMinor: false, function: 'Subdominante / Tónica Sec.', tension: 'descanso', urgencyPercent: 20, colorText: 'text-emerald-300', badgeBg: 'bg-emerald-600/20', icon: '<svg class="w-8 h-8 stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M17 8h1a4 4 0 1 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8zM6 2v3M10 2v3M14 2v3"/></svg>' },
  { roman: 'VII', mode: 'Mixolidio', type: 'Maj', quality: 'Mayor', isMinor: false, function: 'Dominante Subtónica', tension: 'urgencia', urgencyPercent: 90, colorText: 'text-rose-300', badgeBg: 'bg-rose-700/20', icon: '<svg class="w-8 h-8 stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>' }
];

const FAMOUS_PROGRESSIONS_CATEGORIES = [
  {
    category: 'Pop, Rock & Blues Clásico',
    icon: 'fa-guitar',
    color: 'text-amber-400/90',
    borderHover: 'hover:border-amber-400/50',
    items: [
      { arr: [0, 3, 4, 0], label: 'I - IV - V - I (Clásica Reposo-Movimiento)' },
      { arr: [0, 4, 5, 3], label: 'I - V - VI - IV (Pop Moderno / 4 Chords)' },
      { arr: [0, 5, 3, 4], label: 'I - VI - IV - V (Pop Estándar / Balada)' },
      { arr: [0, 4, 3, 4], label: 'I - V - IV - V (Rock / Pop Clásico)' },
      { arr: [0, 3, 0, 4], label: 'I - IV - I - V (Blues / Tradicional)' },
      { arr: [0, 4, 1, 3], label: 'I - V - II - IV (Indie / Alternative Folk)' }
    ]
  },
  {
    category: 'Jazz, Neo-Soul & Lo-Fi',
    icon: 'fa-saxhorn',
    color: 'text-indigo-400/90',
    borderHover: 'hover:border-indigo-400/50',
    items: [
      { arr: [1, 4, 0, 0], label: 'II - V - I (Cadencia Fundamental de Jazz)' },
      { arr: [1, 4, 0, 5], label: 'II - V - I - VI (Círculo Armónico de Jazz)' },
      { arr: [0, 2, 5, 3], label: 'I - III - VI - IV (Lo-Fi Nostálgico / Neo-Soul)' },
      { arr: [0, 3, 1, 4], label: 'I - IV - II - V (Gospel / Soft Soul)' },
      { arr: [0, 5, 1, 4], label: 'I - VI - II - V (Turnaround Clásico Doo-Wop)' }
    ]
  },
  {
    category: 'BSO, Cine, Épica & Videojuegos',
    icon: 'fa-film',
    color: 'text-rose-400/90',
    borderHover: 'hover:border-rose-400/50',
    items: [
      { arr: [0, 5, 2, 4], label: 'I - VI - III - V (Emotiva / Dramática)' },
      { arr: [0, 3, 5, 4], label: 'I - IV - VI - V (Épica Cinematográfica)' },
      { arr: [3, 4, 0, 5], label: 'IV - V - I - VI (Heroica RPG / Triunfal)' },
      { arr: [3, 0, 4, 5], label: 'IV - I - V - VI (Gran Aventura BSO)' },
      { arr: [0, 6, 5, 4], label: 'I - VII - VI - V (Descenso Tensión Épica)' }
    ]
  },
  {
    category: 'Anime, J-Pop & Exploración Modal',
    icon: 'fa-compact-disc',
    color: 'text-emerald-400/90',
    borderHover: 'hover:border-emerald-400/50',
    items: [
      { arr: [3, 4, 2, 5], label: 'IV - V - III - VI (Royal Road / 王道進行 - Anime & J-Pop)' },
      { arr: [5, 3, 0, 4], label: 'VI - IV - I - V (Axis Menor / Melancolía Pop)' },
      { arr: [5, 4, 3, 4], label: 'VI - V - IV - V (Cadencia Andaluza / Aire Flamenco-Rock)' },
      { arr: [0, 2, 3, 4], label: 'I - III - IV - V (Ascensión Escalofriante)' },
      { arr: [0, 3, 2, 1], label: 'I - IV - III - II (Cascada Flotante Modal)' }
    ]
  }
];

const ALL_FAMOUS_PROGRESSIONS = FAMOUS_PROGRESSIONS_CATEGORIES.flatMap(c =>
  c.items.map(it => ({
    ...it,
    category: c.category,
    icon: c.icon,
    color: c.color,
    borderHover: c.borderHover
  }))
);


// --- FUNCIONES DE DIBUJO DE GEOMETRÍA SAGRADA (CANVAS D'VORTEX) ---
function drawFlowerOfLife(ctx, canvas, cx, cy, rotation, intensity, matrixLevel) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-rotation * 0.4); // Rotación sutil contra-armónica

  const baseRadius = Math.min(canvas.width, canvas.height) * 0.085 * (1 + intensity * 0.15);

  ctx.lineWidth = 1.2 + intensity * 1.5;
  ctx.strokeStyle = '#10b981';
  ctx.shadowColor = '#00f0ff';
  ctx.shadowBlur = 8 + intensity * 15;
  ctx.globalAlpha = 0.5 + intensity * 0.35;

  // 1. Círculo Central
  ctx.beginPath();
  ctx.arc(0, 0, baseRadius, 0, Math.PI * 2);
  ctx.stroke();

  // 2. Primera Capa (6 Círculos de la Semilla de la Vida - Nivel 1+)
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i;
    const x = baseRadius * Math.cos(angle);
    const y = baseRadius * Math.sin(angle);
    ctx.beginPath();
    ctx.arc(x, y, baseRadius, 0, Math.PI * 2);
    ctx.stroke();
  }

  // 3. Segunda Capa (12 Círculos - Nivel 2+)
  if (matrixLevel >= 2) {
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const x = 2 * baseRadius * Math.cos(angle);
      const y = 2 * baseRadius * Math.sin(angle);
      ctx.beginPath();
      ctx.arc(x, y, baseRadius, 0, Math.PI * 2);
      ctx.stroke();
    }

    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i + Math.PI / 6;
      const dist = baseRadius * Math.sqrt(3);
      const x = dist * Math.cos(angle);
      const y = dist * Math.sin(angle);
      ctx.beginPath();
      ctx.arc(x, y, baseRadius, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // 4. Tercera Capa Expandida (Nivel 3+)
  if (matrixLevel >= 3) {
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const x = 4 * baseRadius * Math.cos(angle);
      const y = 4 * baseRadius * Math.sin(angle);
      ctx.beginPath();
      ctx.arc(x, y, baseRadius, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // 5. Cubo de Metatrón (Conexiones Líneales - Nivel 4)
  if (matrixLevel >= 4) {
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 10 + intensity * 20;

    const points = [{ x: 0, y: 0 }];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      points.push({ x: 2 * baseRadius * Math.cos(angle), y: 2 * baseRadius * Math.sin(angle) });
      points.push({ x: 4 * baseRadius * Math.cos(angle), y: 4 * baseRadius * Math.sin(angle) });
    }

    ctx.beginPath();
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        ctx.moveTo(points[i].x, points[i].y);
        ctx.lineTo(points[j].x, points[j].y);
      }
    }
    ctx.stroke();
  }

  // Anillos Sagrados Envolventes Exteriores
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = '#00f0ff';
  const ringMultiplier = matrixLevel >= 3 ? 5 : 3;

  ctx.beginPath();
  ctx.arc(0, 0, baseRadius * ringMultiplier, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, 0, baseRadius * (ringMultiplier + 0.08), 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

function drawGoldenSpiral(ctx, cx, cy, rotation, intensity, branches) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotation + intensity * 0.5);

  const a = 1;
  const b = 0.3063; // ln(Phi) / (PI/2) aprox.
  const loops = 4;

  for (let j = 0; j < branches; j++) {
    ctx.save();
    ctx.rotate(((Math.PI * 2) / branches) * j);

    ctx.beginPath();
    for (let i = 0; i < loops * 2 * Math.PI; i += 0.1) {
      const dynamicA = a * (1 + intensity * 0.5);
      const r = dynamicA * Math.exp(b * i);
      const x = r * Math.cos(i);
      const y = r * Math.sin(i);

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.lineWidth = 2 + intensity * 2;
    ctx.strokeStyle = j % 2 === 0 ? '#10b981' : '#00f0ff';
    ctx.shadowColor = j % 2 === 0 ? '#10b981' : '#00f0ff';
    ctx.shadowBlur = 10 + intensity * 20;
    ctx.globalAlpha = 0.6 + intensity * 0.4;
    ctx.stroke();

    ctx.restore();
  }

  ctx.restore();
}

function drawD(ctx, cx, cy, scale, intensity) {
  ctx.save();
  ctx.translate(cx, cy);

  const currentScale = scale * (1 + intensity * 0.3);
  ctx.scale(currentScale, currentScale);

  ctx.lineWidth = 3;
  ctx.strokeStyle = '#00f0ff';
  ctx.shadowColor = '#00f0ff';
  ctx.shadowBlur = 15 + intensity * 30;

  ctx.beginPath();
  // Tallo de la 'D'
  ctx.moveTo(-15, -30);
  ctx.lineTo(-15, 30);
  // Curva de la 'D'
  ctx.bezierCurveTo(25, 30, 35, 15, 35, 0);
  ctx.bezierCurveTo(35, -15, 25, -30, -15, -30);
  ctx.stroke();

  ctx.lineWidth = 1;
  ctx.strokeStyle = '#ffffff';
  ctx.shadowBlur = 5;
  ctx.stroke();

  ctx.restore();
}

export default function App() {
  const [baseNoteChar, setBaseNoteChar] = useState('A');
  const [isSharpActive, setIsSharpActive] = useState(false);
  const [currentScaleType, setCurrentScaleType] = useState('major');
  const [selectedDegreeIndex, setSelectedDegreeIndex] = useState(0);

  const [currentProgression, setCurrentProgression] = useState([0, 3, 4, 0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBpm, setCurrentBpm] = useState(120);
  const [beatsPerChordValue, setBeatsPerChordValue] = useState(2);
  const [hitsPerChordValue, setHitsPerChordValue] = useState(1);

  const [customProgression, setCustomProgression] = useState([]);
  const [activeCustomSlotIndex, setActiveCustomSlotIndex] = useState(0);
  const [isRecordingMode, setIsRecordingMode] = useState(false);
  const [selectedFamousProgression, setSelectedFamousProgression] = useState(null);
  const [selectedGenreIndex, setSelectedGenreIndex] = useState(0);
  const [activeFamousProgression, setActiveFamousProgression] = useState(null);
  const [isLibraryExpanded, setIsLibraryExpanded] = useState(false);

  // Estados del Visualizador de Geometría Sagrada (D'VORTEX)
  const [isMatrixActive, setIsMatrixActive] = useState(true);
  const [isEmblemDActive, setIsEmblemDActive] = useState(true);
  const [cfgParticles, setCfgParticles] = useState(100);
  const [cfgSpeed, setCfgSpeed] = useState(1.0);
  const [cfgSpiralBranches, setCfgSpiralBranches] = useState(6);
  const [cfgMatrixLevel, setCfgMatrixLevel] = useState(2);

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const particlesRef = useRef([]);

  const configRef = useRef({
    isMatrixActive: true,
    isEmblemDActive: true,
    cfgParticles: 100,
    cfgSpeed: 1.0,
    cfgSpiralBranches: 6,
    cfgMatrixLevel: 2,
  });

  useEffect(() => {
    configRef.current = {
      isMatrixActive,
      isEmblemDActive,
      cfgParticles,
      cfgSpeed,
      cfgSpiralBranches,
      cfgMatrixLevel,
    };
  }, [isMatrixActive, isEmblemDActive, cfgParticles, cfgSpeed, cfgSpiralBranches, cfgMatrixLevel]);

  const adjustParticles = (targetCount) => {
    const cian = 'rgba(0, 240, 255, ';
    const esmeralda = 'rgba(16, 185, 129, ';
    const current = particlesRef.current;
    if (current.length < targetCount) {
      const diff = targetCount - current.length;
      for (let i = 0; i < diff; i++) {
        current.push({
          x: Math.random() * 2 - 1,
          y: Math.random() * 2 - 1,
          size: Math.random() * 3 + 0.5,
          speed: Math.random() * 0.02 + 0.005,
          angle: Math.random() * Math.PI * 2,
          colorType: Math.random() > 0.5 ? cian : esmeralda,
        });
      }
    } else if (current.length > targetCount) {
      current.splice(targetCount);
    }
  };

  useEffect(() => {
    adjustParticles(cfgParticles);
  }, [cfgParticles]);

  const audioCtxRef = useRef(null);
  const masterGainRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);

  const playIntervalRef = useRef(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtxClass();
      const masterGain = ctx.createGain();
      masterGain.connect(ctx.destination);

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128; // Resolución para frecuencias bajas/medias
      masterGain.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      audioCtxRef.current = ctx;
      masterGainRef.current = masterGain;
      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const noteToFreq = (noteIndex, octave = 4) => {
    const semitonesFromC4 = noteIndex + (octave - 4) * 12;
    return 261.63 * Math.pow(2, semitonesFromC4 / 12);
  };

  const playChordNotes = (noteIndices, duration = 1.5) => {
    initAudio();
    const now = audioCtxRef.current.currentTime;
    noteIndices.forEach((noteIdx, idx) => {
      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();
      osc.type = 'triangle';
      const oct = idx === 0 ? 3 : 4;
      osc.frequency.setValueAtTime(noteToFreq(noteIdx, oct), now);
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      osc.connect(gain);
      gain.connect(masterGainRef.current);
      osc.start(now);
      osc.stop(now + duration);
    });
  };

  // Loop de animación del Canvas Vortex
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let rotationAngle = 0;

    const resizeCanvas = () => {
      const container = containerRef.current;
      if (container && canvas) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    if (particlesRef.current.length === 0) {
      adjustParticles(configRef.current.cfgParticles);
    }

    const animateVortex = () => {
      const cfg = configRef.current;
      const analyser = analyserRef.current;
      const dataArray = dataArrayRef.current;

      let audioIntensity = 0;
      if (analyser && dataArray) {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        const range = 20;
        for (let i = 0; i < range; i++) {
          sum += dataArray[i];
        }
        audioIntensity = (sum / range) / 255;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const radiusScale = Math.min(cx, cy);

      // Fondo sutil con rastro de movimiento
      ctx.fillStyle = 'rgba(3, 7, 18, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Rotación continua reactiva al audio y acelerada por la velocidad configurada
      rotationAngle += (0.005 + (audioIntensity * 0.02)) * cfg.cfgSpeed;

      // Dibujar Partículas (Matriz cósmica)
      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.angle += p.speed * cfg.cfgSpeed;
        let r = Math.sqrt(p.x * p.x + p.y * p.y) + (0.001 + audioIntensity * 0.005);
        if (r > 1) {
          r = 0.01;
          p.angle = Math.random() * Math.PI * 2;
        }
        p.x = r * Math.cos(p.angle);
        p.y = r * Math.sin(p.angle);

        const absX = cx + p.x * radiusScale;
        const absY = cy + p.y * radiusScale;

        ctx.beginPath();
        ctx.arc(absX, absY, p.size * (1 + audioIntensity), 0, Math.PI * 2);
        const alpha = Math.min(1, r * 2);
        ctx.fillStyle = p.colorType + alpha + ')';
        ctx.shadowBlur = 5;
        ctx.shadowColor = p.colorType + '1)';
        ctx.fill();
      }

      // Dibujar Espiral Áurea
      drawGoldenSpiral(ctx, cx, cy, rotationAngle, audioIntensity, cfg.cfgSpiralBranches);

      // Dibujar Flor de la Vida (Matrix) si está activa
      if (cfg.isMatrixActive) {
        drawFlowerOfLife(ctx, canvas, cx, cy, rotationAngle, audioIntensity, cfg.cfgMatrixLevel);
      }

      // Dibujar Emblema 'D' en el centro si está activo
      if (cfg.isEmblemDActive) {
        const dScale = Math.min(canvas.width, canvas.height) / 400;
        drawD(ctx, cx, cy, dScale, audioIntensity);
      }

      // Núcleo luminoso central
      ctx.beginPath();
      ctx.arc(cx, cy, 5 + audioIntensity * 15, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 20 + audioIntensity * 40;
      ctx.fill();

      animationId = requestAnimationFrame(animateVortex);
    };

    animationId = requestAnimationFrame(animateVortex);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const toggleEmblemD = () => {
    setIsEmblemDActive(prev => !prev);
  };

  const toggleMatrixMode = () => {
    setIsMatrixActive(prev => !prev);
  };

  const toggleVortexFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const getRootNoteIndex = () => {
    const noteStr = isSharpActive ? `${baseNoteChar}#` : baseNoteChar;
    const idx = NOTES.indexOf(noteStr);
    return idx !== -1 ? idx : NOTES.indexOf(baseNoteChar);
  };

  const degreesInfo = currentScaleType === 'major' ? DEGREES_INFO_MAJOR : DEGREES_INFO_MINOR;

  const getScaleNotes = () => {
    const rootIdx = getRootNoteIndex();
    const steps = SCALE_STEPS[currentScaleType];
    return steps.map(step => (rootIdx + step) % 12);
  };

  const getChordTriad = (scaleNotes, degreeIdx) => {
    const root = scaleNotes[degreeIdx];
    const third = scaleNotes[(degreeIdx + 2) % 7];
    const fifth = scaleNotes[(degreeIdx + 4) % 7];
    return [root, third, fifth];
  };

  const triggerRhythmicChordHits = (triad, totalStepDurationSec, checkPlayingRef) => {
    const hits = hitsPerChordValue;
    const subHitIntervalSec = totalStepDurationSec / hits;
    const singleHitAudioDuration = Math.min(subHitIntervalSec * 0.85, 1.2);

    for (let i = 0; i < hits; i++) {
      const offsetMs = i * subHitIntervalSec * 1000;
      setTimeout(() => {
        if (checkPlayingRef.current) {
          playChordNotes(triad, singleHitAudioDuration);
        }
      }, offsetMs);
    }
  };

  const onCardClicked = (degreeIdx) => {
    setSelectedDegreeIndex(degreeIdx);
    const triad = getChordTriad(getScaleNotes(), degreeIdx);
    playChordNotes(triad);

    if (isRecordingMode) {
      setCustomProgression(prev => [...prev, degreeIdx]);
      setActiveCustomSlotIndex(customProgression.length);
    } else if (customProgression.length > 0 && activeCustomSlotIndex >= 0 && activeCustomSlotIndex < customProgression.length) {
      setCustomProgression(prev => {
        const copy = [...prev];
        copy[activeCustomSlotIndex] = degreeIdx;
        return copy;
      });
    }
  };

  const isPlayingRef = useRef(isPlaying);
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const startProgression = () => {
    initAudio();
    setIsPlaying(true);

    let progressionToPlay = [];
    let isPlayingCustomMode = false;

    if (customProgression.length > 0) {
      // Si existe una progresión guardada, reproducir la progresión grabada
      progressionToPlay = [...customProgression];
      isPlayingCustomMode = true;
      setActiveFamousProgression(null);
    } else {
      // Si no existe una progresión guardada, reproducir una pre-selección aleatoria de las famosas
      let chosen = selectedFamousProgression;
      if (!chosen) {
        const randomIndex = Math.floor(Math.random() * ALL_FAMOUS_PROGRESSIONS.length);
        chosen = ALL_FAMOUS_PROGRESSIONS[randomIndex];
      }

      const genreIdx = FAMOUS_PROGRESSIONS_CATEGORIES.findIndex(cat =>
        cat.items.some(it => it.label === chosen.label)
      );
      if (genreIdx !== -1) {
        setSelectedGenreIndex(genreIdx);
      }

      setActiveFamousProgression(chosen);
      setSelectedFamousProgression(chosen);
      setIsLibraryExpanded(false); // Ocultar todas las demás para mantener la línea visual limpia

      progressionToPlay = [...chosen.arr];
      setCurrentProgression([...chosen.arr]);
    }

    const totalStepDurationSec = (60 / currentBpm) * beatsPerChordValue;
    const intervalMs = totalStepDurationSec * 1000;
    let step = 0;

    const playStep = () => {
      if (!isPlayingRef.current) return;
      const currentScaleNotes = getScaleNotes();
      const degIdx = progressionToPlay[step];
      const triad = getChordTriad(currentScaleNotes, degIdx);

      setSelectedDegreeIndex(degIdx);
      if (isPlayingCustomMode) {
        setActiveCustomSlotIndex(step);
      }

      triggerRhythmicChordHits(triad, totalStepDurationSec, isPlayingRef);
      step = (step + 1) % progressionToPlay.length;
    };

    playStep();
    playIntervalRef.current = setInterval(playStep, intervalMs);
  };

  const stopProgression = () => {
    setIsPlaying(false);
    if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    setIsLibraryExpanded(false);
  };

  const scaleNotes = getScaleNotes();
  const rootIdx = getRootNoteIndex();
  const rootName = NOTES[rootIdx];
  const rootNameEs = NOTE_NAMES_ES[rootName];
  const scaleName = currentScaleType === 'major' ? 'Mayor' : 'Menor';

  return (
    <div className="flex flex-col min-h-screen justify-between">
      {/* Header principal */}
      <header className="bg-slate-800 border-b border-slate-700 py-4 px-6 shadow-md relative z-30">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-amber-400 flex items-center gap-2">
              <i className="fa-solid fa-music"></i> Mapas de Tensión y Modos Griegos
            </h1>
          </div>

          {/* Panel de Control de Tonalidad, Alteración e Inclinación (Mayor/Menor) */}
          <div className="flex flex-wrap items-center justify-center gap-3 bg-slate-900 p-2.5 rounded-xl border border-slate-700">
            {/* Selector de Nota Base (Sólo Notas Naturales) */}
            <div className="flex items-center gap-2">
              <label htmlFor="rootNote" className="text-xs font-semibold text-slate-300">Nota Base:</label>
              <select
                id="rootNote"
                value={baseNoteChar}
                onChange={(e) => setBaseNoteChar(e.target.value)}
                className="bg-slate-800 text-amber-300 font-bold px-3 py-1.5 rounded border border-slate-600 focus:outline-none focus:border-amber-400 text-sm"
              >
                <option value="C">Do (C)</option>
                <option value="D">Re (D)</option>
                <option value="E">Mi (E)</option>
                <option value="F">Fa (F)</option>
                <option value="G">Sol (G)</option>
                <option value="A">La (A)</option>
                <option value="B">Si (B)</option>
              </select>
            </div>

            {/* Toggle Sostenido (#) */}
            <div className="flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">
              <span className="text-xs font-semibold text-slate-300">S (#):</span>
              <button
                onClick={() => setIsSharpActive(!isSharpActive)}
                className={`w-10 h-6 rounded-full p-0.5 transition-colors duration-200 focus:outline-none flex items-center ${isSharpActive ? 'bg-amber-500' : 'bg-slate-700'}`}
              >
                <div className={`w-5 h-5 bg-slate-400 rounded-full shadow-md transform transition-transform duration-200 flex items-center justify-center text-[10px] font-bold text-slate-900 ${isSharpActive ? 'translate-x-4' : ''}`}>
                  {isSharpActive ? '#' : ''}
                </div>
              </button>
            </div>

            {/* Switch Modo Mayor / Menor */}
            <div className="flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700">
              <button
                onClick={() => setCurrentScaleType('major')}
                className={`px-3 py-1 rounded text-xs font-bold transition-all ${currentScaleType === 'major' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'}`}
              >
                M
              </button>
              <button
                onClick={() => setCurrentScaleType('minor')}
                className={`px-3 py-1 rounded text-xs font-bold transition-all ${currentScaleType === 'minor' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'}`}
              >
                m
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Visualizador de Geometría Sagrada (D'VORTEX) */}
      <section id="vortex-container" ref={containerRef}>
        <canvas id="vortexCanvas" ref={canvasRef}></canvas>

        <div className="vortex-ui-overlay">
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-2.5">
            {/* Lado Izquierdo: Badge D'VORTEX + Controles Rítmicos (Tempo, Figura, Golpes, Play) */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="vortex-panel flex items-center gap-3 rounded-full">
                <span className="flex items-center gap-1.5 font-bold tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span> D`VORTEX
                </span>
                <span className="text-slate-500">|</span>
                <span className="text-emerald-neon font-bold">Φ = 1.618</span>
              </div>

              {/* Control de Tempo (BPM) */}
              <div className="vortex-panel flex items-center gap-2" title="Tempo (BPM)">
                <i className="fa-solid fa-gauge-high text-amber-400 text-xs"></i>
                <span className="text-[11px] font-bold text-amber-300 font-mono min-w-[55px]">
                  {currentBpm} BPM
                </span>
                <input
                  type="range"
                  id="bpmSlider"
                  min="60"
                  max="180"
                  value={currentBpm}
                  onChange={(e) => setCurrentBpm(parseInt(e.target.value))}
                  className="w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>

              {/* Control de Figura Rítmica */}
              <div className="vortex-panel flex items-center gap-1.5" title="Figura Rítmica (Tiempos por acorde)">
                <i className="fa-solid fa-music text-amber-400 text-xs mr-0.5"></i>
                {[
                  { val: 4, symbol: '𝅝', label: '4' },
                  { val: 2, symbol: '𝅗𝅥', label: '2' },
                  { val: 1, symbol: '♩', label: '1' },
                  { val: 0.5, symbol: '♪', label: '½' }
                ].map(item => (
                  <button
                    key={item.val}
                    onClick={() => setBeatsPerChordValue(item.val)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition flex items-center gap-0.5 ${beatsPerChordValue === item.val
                      ? 'bg-amber-500 text-slate-950 border border-amber-400 shadow'
                      : 'bg-slate-800 text-slate-300 border border-slate-700 hover:border-amber-400/50'
                      }`}
                    title={`${item.label} (${item.val} tiempos)`}
                  >
                    <span className="text-xs font-serif leading-none">{item.symbol}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              {/* Control de Golpes */}
              <div className="vortex-panel flex items-center gap-1.5" title="Golpes por Acorde">
                <i className="fa-solid fa-drum text-amber-400 text-xs mr-0.5"></i>
                {[1, 2, 4, 8].map(hits => (
                  <button
                    key={hits}
                    onClick={() => setHitsPerChordValue(hits)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition ${hitsPerChordValue === hits
                      ? 'bg-amber-500 text-slate-950 border border-amber-400 shadow'
                      : 'bg-slate-800 text-slate-300 border border-slate-700 hover:border-amber-400/50'
                      }`}
                    title={`${hits} golpes por acorde`}
                  >
                    {hits}x
                  </button>
                ))}
              </div>

              {/* Botón rápido Play/Stop en el Visualizador */}
              <button
                onClick={() => isPlaying ? stopProgression() : startProgression()}
                className={`vortex-panel flex items-center gap-1.5 font-bold cursor-pointer transition ${isPlaying
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]'
                  : 'bg-emerald-500/20 text-emerald-400 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                  }`}
                title={
                  isPlaying
                    ? 'Detener'
                    : customProgression.length > 0
                      ? `Progresión Grabada (${customProgression.length} acordes)`
                      : 'Aleatoria de Biblioteca)'
                }
              >
                <i className={`fa-solid ${isPlaying ? 'fa-square' : 'fa-play'} text-[10px]`}></i>
                <span>{isPlaying ? 'S' : 'P'}</span>
                {customProgression.length > 0 && !isPlaying && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" title="Progresión grabada lista"></span>
                )}
              </button>
            </div>

            {/* Lado Derecho: Controles de Geometría y Visualización */}
            <div className="flex flex-wrap items-center justify-end gap-2">
              <div className="vortex-panel flex items-center gap-2" title="Cantidad de Partículas">
                <i className="fa-solid fa-sparkles text-[10px]"></i>
                <input
                  type="range"
                  id="ctrlParticles"
                  min="10"
                  max="400"
                  step="10"
                  value={cfgParticles}
                  onChange={(e) => setCfgParticles(parseInt(e.target.value))}
                  className="w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>
              <div className="vortex-panel flex items-center gap-2" title="Velocidad del Tiempo">
                <i className="fa-solid fa-gauge-high text-[10px]"></i>
                <input
                  type="range"
                  id="ctrlSpeed"
                  min="0.1"
                  max="3"
                  step="0.1"
                  value={cfgSpeed}
                  onChange={(e) => setCfgSpeed(parseFloat(e.target.value))}
                  className="w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>
              <div className="vortex-panel flex items-center gap-2" title="Ramas de la Espiral Áurea">
                <i className="fa-solid fa-hurricane text-[10px]"></i>
                <input
                  type="range"
                  id="ctrlSpiral"
                  min="2"
                  max="12"
                  step="2"
                  value={cfgSpiralBranches}
                  onChange={(e) => setCfgSpiralBranches(parseInt(e.target.value))}
                  className="w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
              </div>
              <div className="vortex-panel flex items-center gap-2" title="Nivel Evolutivo: Matrix a Metatrón">
                <i className="fa-solid fa-cube text-[10px]"></i>
                <input
                  type="range"
                  id="ctrlMatrix"
                  min="1"
                  max="4"
                  step="1"
                  value={cfgMatrixLevel}
                  onChange={(e) => setCfgMatrixLevel(parseInt(e.target.value))}
                  className="w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
              </div>

              <div className="flex gap-2">
                <button
                  id="btnMatrixMode"
                  onClick={toggleMatrixMode}
                  className={`vortex-panel hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer ${isMatrixActive
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                    : 'text-slate-400 border-slate-700 opacity-60'
                    }`}
                  title={isMatrixActive ? 'Desactivar Matrix' : 'Activar Matrix'}
                >
                  <i className="fa-solid fa-circle-nodes"></i> M
                </button>
                <button
                  id="btnEmblemaD"
                  onClick={toggleEmblemD}
                  className={`vortex-panel hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer ${isEmblemDActive
                    ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                    : 'text-slate-400 border-slate-700 opacity-60'
                    }`}
                  title={isEmblemDActive ? 'Ocultar Emblema' : 'Mostrar Emblema'}
                >
                  <i className="fa-solid fa-hurricane text-[10px]"></i> D
                </button>
                <button
                  className="vortex-panel hover:bg-slate-800 transition-colors cursor-pointer"
                  onClick={toggleVortexFullscreen}
                  title="Pantalla Completa"
                >
                  <i className="fa-solid fa-expand"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto p-4 md:p-6 w-full flex-grow space-y-8">
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-200 flex items-center gap-2">
              <i className="fa-solid fa-sliders text-amber-400"></i> Grados, Modos y Urgencia
              <span className="text-xs font-bold text-amber-300 ml-2 px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full">
                Tono de {rootNameEs} ({rootName}) {scaleName}
              </span>
            </h2>
            {isRecordingMode && (
              <div className="text-xs font-bold text-rose-400 bg-rose-500/20 px-3 py-1 rounded-full border border-rose-500/40 animate-pulse flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span> Recording: clic card
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {degreesInfo.map((deg, idx) => {
              const chordNotes = getChordTriad(scaleNotes, idx);
              const rootNoteName = NOTES[chordNotes[0]];
              const chordFullName = `${rootNoteName}${deg.type}`;
              const chordNotesText = chordNotes.map(n => NOTES[n]).join(' - ');
              const barColor = deg.urgencyPercent < 30 ? 'bg-emerald-500' : deg.urgencyPercent < 70 ? 'bg-amber-500' : 'bg-rose-500';

              return (
                <div
                  key={idx}
                  onClick={() => onCardClicked(idx)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between items-center text-center relative overflow-hidden ${idx === selectedDegreeIndex ? 'active-card bg-slate-800 border-amber-400' : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700'
                    }`}
                >
                  <div className={`w-full flex justify-between items-start text-xs font-bold ${deg.colorText} mb-1`}>
                    <div className="flex flex-col items-center">
                      <span>{deg.roman}</span>
                      {deg.isMinor && <span className="bg-indigo-500/20 text-indigo-300 font-bold text-[9px] px-1 py-0.2 rounded border border-indigo-500/40 leading-none mt-0.5">m</span>}
                    </div>
                    <span className={`px-2 py-0.5 rounded-full ${deg.badgeBg} text-[9px] border border-current`}>{deg.tension.toUpperCase()}</span>
                  </div>

                  <div className={`my-1 p-2 rounded-full ${deg.badgeBg} ${deg.colorText}`} dangerouslySetInnerHTML={{ __html: deg.icon }} />

                  <div className="mt-1 w-full">
                    <div className="text-xl font-extrabold text-white">{chordFullName}</div>
                    <div className="text-xs text-slate-400 font-medium">{deg.mode}</div>
                    <div className="mt-2 text-[11px] font-mono font-semibold text-amber-300/90 bg-slate-900/80 py-1 px-2 rounded border border-slate-700">
                      {chordNotesText}
                    </div>
                  </div>

                  <div className="w-full mt-3">
                    <div className="flex justify-between text-[9px] text-slate-400 font-semibold mb-1">
                      <span>Urgencia</span>
                      <span className={deg.colorText}>{deg.urgencyPercent}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div className={`h-full ${barColor} transition-all duration-300`} style={{ width: `${deg.urgencyPercent}%` }}></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 shadow-xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-200 flex items-center gap-2">
                <i className="fa-solid fa-microphone-lines text-rose-400"></i> Progresión Personalizada
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsRecordingMode(!isRecordingMode)}
                title="Grabar en Vivo"
                className={`w-10 h-10 rounded-lg flex items-center justify-center shadow transition text-base text-white ${isRecordingMode ? 'bg-rose-600 recording-pulse' : 'bg-rose-600 hover:bg-rose-500'}`}
              >
                <i className="fa-solid fa-circle"></i>
              </button>

              <button
                onClick={() => { setCustomProgression([]); setActiveCustomSlotIndex(0); if (isPlaying) stopProgression(); }}
                title="Limpiar Secuencia"
                className="bg-slate-700 hover:bg-slate-600 text-slate-300 w-10 h-10 rounded-lg transition border border-slate-600 flex items-center justify-center text-base"
              >
                <i className="fa-solid fa-trash"></i>
              </button>

              <button
                onClick={() => customProgression.length > 0 && setCurrentProgression([...customProgression])}
                title="Exportar al Generador"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 w-10 h-10 rounded-lg transition shadow flex items-center justify-center text-base font-bold"
              >
                <i className="fa-solid fa-arrow-down-long"></i>
              </button>
            </div>
          </div>

          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-700 min-h-[110px] flex flex-col justify-center">
            <div className="flex flex-wrap gap-2.5 items-center">
              {customProgression.length === 0 ? (
                <div className="text-xs text-slate-500 italic py-2 px-1">
                  No has grabado acordes.
                </div>
              ) : (
                customProgression.map((degIdx, slotIdx) => {
                  const deg = degreesInfo[degIdx];
                  const triad = getChordTriad(scaleNotes, degIdx);
                  const chordName = `${NOTES[triad[0]]}${deg.type}`;
                  const isSelected = slotIdx === activeCustomSlotIndex;

                  return (
                    <div
                      key={slotIdx}
                      onClick={() => setActiveCustomSlotIndex(slotIdx)}
                      className={`p-2.5 rounded-xl border flex flex-col items-center justify-between cursor-pointer transition-all min-w-[85px] relative group ${isSelected ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/50' : 'bg-slate-800/90 border-slate-700 hover:border-slate-500'
                        }`}
                    >
                      <div className="flex justify-between w-full items-center text-[10px] text-slate-400">
                        <span>#{slotIdx + 1}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCustomProgression(prev => prev.filter((_, i) => i !== slotIdx));
                          }}
                          className="text-slate-500 hover:text-rose-400 px-1 font-bold"
                        >
                          ×
                        </button>
                      </div>
                      <div className="text-base font-extrabold text-amber-300 my-0.5">{chordName}</div>
                      <span className={`text-[10px] font-semibold ${deg.colorText}`}>{deg.roman} ({deg.mode})</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Compases grabados: {customProgression.length}</span>
            <div className="flex items-center gap-2">
              <span>Añadir/Quitar:</span>
              <button onClick={() => setCustomProgression(prev => [...prev, 0])} className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-2 py-0.5 rounded font-bold border border-slate-600">+</button>
              <button onClick={() => setCustomProgression(prev => prev.slice(0, -1))} className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-2 py-0.5 rounded font-bold border border-slate-600">-</button>
            </div>
          </div>
        </section>

        <section className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-200 flex items-center gap-2">
                <i className="fa-solid fa-play text-emerald-400"></i> Generador de Secuencia y Ritmo
              </h2>
              <p className="text-xs text-slate-400">
                Info (Tempo: <span className="text-amber-400 font-bold">{currentBpm} BPM</span> | Figura: <span className="text-amber-400 font-bold">{beatsPerChordValue}t</span> | Golpes: <span className="text-amber-400 font-bold">{hitsPerChordValue}x</span>)
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 mb-6 bg-slate-900/60 p-4 rounded-xl border border-slate-700/80">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300 font-bold flex items-center gap-1.5">
                <i className="fa-solid fa-wand-magic-sparkles text-amber-400"></i> Progresiones y Cadencias:
              </span>
              <span className="text-[11px] text-slate-400 italic">
                {isPlaying && activeFamousProgression && !isLibraryExpanded
                  ? 'Mostrando únicamente la progresión activa'
                  : '-'}
              </span>
            </div>

            {isPlaying && activeFamousProgression && !isLibraryExpanded ? (
              /* Vista compacta y limpia durante la reproducción: SOLO la progresión seleccionada */
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-950/80 p-3 rounded-xl border border-emerald-500/40 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                    <i className="fa-solid fa-volume-high animate-pulse text-xs"></i>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] uppercase font-bold ${activeFamousProgression.color || 'text-amber-400'} tracking-wider flex items-center gap-1`}>
                        <i className={`fa-solid ${activeFamousProgression.icon || 'fa-compact-disc'} text-[9px]`}></i>
                        {activeFamousProgression.category || 'Progresión Famosa'}
                      </span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-full border border-emerald-500/30 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                        En reproducción
                      </span>
                    </div>
                    <div className="text-sm font-bold text-amber-300 mt-0.5">
                      {activeFamousProgression.label}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsLibraryExpanded(true)}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-500 transition flex items-center gap-1.5 self-end sm:self-auto cursor-pointer"
                  title="Mostrar el catálogo completo por género"
                >
                  <i className="fa-solid fa-layer-group text-[10px] text-amber-400"></i>
                  <span>Explorar otros géneros</span>
                </button>
              </div>
            ) : (
              /* Vista con Selector por Género y Lista Filtrada */
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  {/* Selector por Género */}
                  <div className="flex flex-wrap gap-1.5 bg-slate-950/70 p-1 rounded-xl border border-slate-800">
                    {FAMOUS_PROGRESSIONS_CATEGORIES.map((cat, catIdx) => {
                      const isGenreActive = selectedGenreIndex === catIdx;
                      return (
                        <button
                          key={catIdx}
                          onClick={() => setSelectedGenreIndex(catIdx)}
                          className={`text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${isGenreActive
                            ? 'bg-slate-800 text-amber-300 border border-amber-400/40 shadow ring-1 ring-amber-400/20'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                            }`}
                        >
                          <i className={`fa-solid ${cat.icon} ${isGenreActive ? cat.color : 'text-slate-500'} text-[10px]`}></i>
                          <span>{cat.category}</span>
                        </button>
                      );
                    })}
                  </div>

                  {isPlaying && isLibraryExpanded && (
                    <button
                      onClick={() => setIsLibraryExpanded(false)}
                      className="text-xs bg-slate-800 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg border border-slate-700 transition flex items-center gap-1 cursor-pointer"
                    >
                      <i className="fa-solid fa-compress text-[10px]"></i>
                      <span>Ocultar otras</span>
                    </button>
                  )}
                </div>

                {/* Progresiones del género seleccionado */}
                <div className="flex flex-wrap gap-2 pt-0.5">
                  {FAMOUS_PROGRESSIONS_CATEGORIES[selectedGenreIndex]?.items.map((p, i) => {
                    const isSelected = selectedFamousProgression?.label === p.label ||
                      (currentProgression.length === p.arr.length && currentProgression.every((val, idx) => val === p.arr[idx]));

                    return (
                      <button
                        key={i}
                        onClick={() => {
                          const fullItem = {
                            ...p,
                            category: FAMOUS_PROGRESSIONS_CATEGORIES[selectedGenreIndex].category,
                            icon: FAMOUS_PROGRESSIONS_CATEGORIES[selectedGenreIndex].icon,
                            color: FAMOUS_PROGRESSIONS_CATEGORIES[selectedGenreIndex].color
                          };
                          setCurrentProgression(p.arr);
                          setSelectedFamousProgression(fullItem);
                          if (isPlaying) {
                            setActiveFamousProgression(fullItem);
                            setIsLibraryExpanded(false);
                          }
                        }}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 cursor-pointer ${isSelected
                          ? 'bg-amber-500/20 text-amber-200 border-amber-400 ring-2 ring-amber-400/50 font-bold shadow'
                          : `bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-600 ${FAMOUS_PROGRESSIONS_CATEGORIES[selectedGenreIndex].borderHover}`
                          }`}
                      >
                        {isSelected && <i className="fa-solid fa-check text-[9px] text-amber-400"></i>}
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-4 gap-3">
            {currentProgression.map((degIdx, stepIdx) => {
              const deg = degreesInfo[degIdx];
              const triad = getChordTriad(scaleNotes, degIdx);
              const chordName = `${NOTES[triad[0]]}${deg.type}`;

              return (
                <div key={stepIdx} className="bg-slate-900 p-3 rounded-xl border border-slate-700 flex flex-col items-center justify-between relative group text-center">
                  <span className="text-[10px] font-mono text-slate-500 mb-1">Compás {stepIdx + 1}</span>
                  <div className="text-lg font-bold text-amber-300 my-1">{chordName}</div>
                  <span className={`text-xs font-semibold ${deg.colorText}`}>{deg.roman} ({deg.mode})</span>

                  <select
                    value={degIdx}
                    onChange={(e) => {
                      const newDeg = parseInt(e.target.value);
                      setCurrentProgression(prev => {
                        const copy = [...prev];
                        copy[stepIdx] = newDeg;
                        return copy;
                      });
                    }}
                    className="mt-2 text-xs bg-slate-800 text-slate-300 border border-slate-600 rounded px-1 py-0.5 w-full"
                  >
                    {degreesInfo.map((d, i) => (
                      <option key={i} value={i}>{d.roman} - {d.mode}</option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="bg-slate-950 border-t border-slate-800 py-4 px-6 text-center text-xs text-slate-500">
        Funciones Armónicas y Modos Griegos — Interfaz Interactiva Cognitivizadora
      </footer>
    </div>
  );
}