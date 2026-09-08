import React, { useState, useEffect, useRef } from 'react';

// --- DATOS Y CONFIGURACIÓN TEÓRICA ---
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
  {
    roman: 'I', mode: 'Jónico', type: 'Maj', quality: 'Mayor', isMinor: false,
    function: 'Tónica Principal', tension: 'descanso', urgencyPercent: 0,
    colorText: 'text-emerald-400', badgeBg: 'bg-emerald-500/20',
    icon: `<svg class="w-8 h-8 stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M2 20h20M4 20v-6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6M3 10a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2H3v-2z"/><path d="M18 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/><path d="M16 4h-2"/></svg>`
  },
  {
    roman: 'II', mode: 'Dórico', type: 'm', quality: 'menor', isMinor: true,
    function: 'Subdominante', tension: 'movimiento', urgencyPercent: 40,
    colorText: 'text-amber-400', badgeBg: 'bg-amber-500/20',
    icon: `<svg class="w-8 h-8 stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="12" cy="5" r="2"/><path d="M12 7v6m0 0l-3 5m3-5l3 5m-5-8h4"/></svg>`
  },
  {
    roman: 'III', mode: 'Frigio', type: 'm', quality: 'menor', isMinor: true,
    function: 'Tónica Secundaria', tension: 'descanso', urgencyPercent: 20,
    colorText: 'text-emerald-300', badgeBg: 'bg-emerald-600/20',
    icon: `<svg class="w-8 h-8 stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M17 8h1a4 4 0 1 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8zM6 2v3M10 2v3M14 2v3"/></svg>`
  },
  {
    roman: 'IV', mode: 'Lidio', type: 'Maj', quality: 'Mayor', isMinor: false,
    function: 'Subdominante Principal', tension: 'movimiento', urgencyPercent: 60,
    colorText: 'text-amber-400', badgeBg: 'bg-amber-500/20',
    icon: `<svg class="w-8 h-8 stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="12" cy="5" r="2"/><path d="M12 7v5m0 0l-4 6m4-6l4 6m-6-8h5"/></svg>`
  },
  {
    roman: 'V', mode: 'Mixolidio', type: 'Maj', quality: 'Mayor (7ª Dom)', isMinor: false,
    function: 'Dominante Principal', tension: 'urgencia', urgencyPercent: 85,
    colorText: 'text-rose-400', badgeBg: 'bg-rose-600/20',
    icon: `<svg class="w-8 h-8 stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="8" cy="5" r="2"/><path d="M8 7l4 5m0 0l-2 5m2-5l3-1M5 14l3-2m9-7a5 5 0 1 1 0 10 5 5 0 0 1 0-10z"/><path d="M17 6v2l1 1"/></svg>`
  },
  {
    roman: 'VI', mode: 'Eólico', type: 'm', quality: 'menor (Relativa)', isMinor: true,
    function: 'Tónica Relativa', tension: 'descanso', urgencyPercent: 15,
    colorText: 'text-emerald-300', badgeBg: 'bg-emerald-600/20',
    icon: `<svg class="w-8 h-8 stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M17 8h1a4 4 0 1 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8zM6 2v3M10 2v3M14 2v3"/></svg>`
  },
  {
    roman: 'VII', mode: 'Locrio', type: 'dim', quality: 'Disminuido', isMinor: true,
    function: 'Dominante Inestable', tension: 'urgencia', urgencyPercent: 100,
    colorText: 'text-rose-300', badgeBg: 'bg-rose-700/20',
    icon: `<svg class="w-8 h-8 stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
  }
];

const DEGREES_INFO_MINOR = [
  {
    roman: 'i', mode: 'Eólico', type: 'm', quality: 'menor', isMinor: true,
    function: 'Tónica Principal', tension: 'descanso', urgencyPercent: 0,
    colorText: 'text-emerald-400', badgeBg: 'bg-emerald-500/20',
    icon: `<svg class="w-8 h-8 stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M2 20h20M4 20v-6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6M3 10a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2H3v-2z"/><path d="M18 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/><path d="M16 4h-2"/></svg>`
  },
  {
    roman: 'ii°', mode: 'Locrio', type: 'dim', quality: 'Disminuido', isMinor: true,
    function: 'Subdominante Inestable', tension: 'movimiento', urgencyPercent: 55,
    colorText: 'text-amber-400', badgeBg: 'bg-amber-500/20',
    icon: `<svg class="w-8 h-8 stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="12" cy="5" r="2"/><path d="M12 7v6m0 0l-3 5m3-5l3 5m-5-8h4"/></svg>`
  },
  {
    roman: 'III', mode: 'Jónico', type: 'Maj', quality: 'Mayor (Relativo)', isMinor: false,
    function: 'Tónica Relativa', tension: 'descanso', urgencyPercent: 15,
    colorText: 'text-emerald-300', badgeBg: 'bg-emerald-600/20',
    icon: `<svg class="w-8 h-8 stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M17 8h1a4 4 0 1 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8zM6 2v3M10 2v3M14 2v3"/></svg>`
  },
  {
    roman: 'iv', mode: 'Dórico', type: 'm', quality: 'menor', isMinor: true,
    function: 'Subdominante Principal', tension: 'movimiento', urgencyPercent: 45,
    colorText: 'text-amber-400', badgeBg: 'bg-amber-500/20',
    icon: `<svg class="w-8 h-8 stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="12" cy="5" r="2"/><path d="M12 7v5m0 0l-4 6m4-6l4 6m-6-8h5"/></svg>`
  },
  {
    roman: 'v', mode: 'Frigio', type: 'm', quality: 'menor', isMinor: true,
    function: 'Dominante Menor', tension: 'urgencia', urgencyPercent: 75,
    colorText: 'text-rose-400', badgeBg: 'bg-rose-600/20',
    icon: `<svg class="w-8 h-8 stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="8" cy="5" r="2"/><path d="M8 7l4 5m0 0l-2 5m2-5l3-1M5 14l3-2m9-7a5 5 0 1 1 0 10 5 5 0 0 1 0-10z"/><path d="M17 6v2l1 1"/></svg>`
  },
  {
    roman: 'VI', mode: 'Lidio', type: 'Maj', quality: 'Mayor', isMinor: false,
    function: 'Subdominante / Tónica Sec.', tension: 'descanso', urgencyPercent: 20,
    colorText: 'text-emerald-300', badgeBg: 'bg-emerald-600/20',
    icon: `<svg class="w-8 h-8 stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M17 8h1a4 4 0 1 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8zM6 2v3M10 2v3M14 2v3"/></svg>`
  },
  {
    roman: 'VII', mode: 'Mixolidio', type: 'Maj', quality: 'Mayor', isMinor: false,
    function: 'Dominante Subtónica', tension: 'urgencia', urgencyPercent: 90,
    colorText: 'text-rose-300', badgeBg: 'bg-rose-700/20',
    icon: `<svg class="w-8 h-8 stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
  }
];

export default function App() {
  // --- ESTADOS DE LA APLICACIÓN ---
  const [baseNoteChar, setBaseNoteChar] = useState('A');
  const [isSharpActive, setIsSharpActive] = useState(false);
  const [currentScaleType, setCurrentScaleType] = useState('major');
  const [selectedDegreeIndex, setSelectedDegreeIndex] = useState(0);
  const [currentProgression, setCurrentProgression] = useState([0, 3, 4, 0]);
  const [bpm, setBpm] = useState(120);
  const [beatsPerChord, setBeatsPerChord] = useState(2);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioCtxRef = useRef(null);

  // Sintetizador Web Audio
  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const playChordNotes = (noteIndices, duration = 1.5) => {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    noteIndices.forEach((noteIdx, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      let oct = idx === 0 ? 3 : 4;
      const semitonesFromC4 = noteIdx + (oct - 4) * 12;
      const freq = 261.63 * Math.pow(2, semitonesFromC4 / 12);

      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    });
  };

  // Cálculo de notas y grados
  const getRootNoteIndex = () => {
    let noteStr = baseNoteChar + (isSharpActive ? '#' : '');
    const idx = NOTES.indexOf(noteStr);
    return idx !== -1 ? idx : NOTES.indexOf(baseNoteChar);
  };

  const degreesInfo = currentScaleType === 'major' ? DEGREES_INFO_MAJOR : DEGREES_INFO_MINOR;

  const getScaleNotes = () => {
    const rootIdx = getRootNoteIndex();
    const steps = SCALE_STEPS[currentScaleType];
    return steps.map(step => (rootIdx + step) % 12);
  };

  const scaleNotes = getScaleNotes();

  const getChordTriad = (scaleN, degreeIdx) => {
    const root = scaleN[degreeIdx];
    const third = scaleN[(degreeIdx + 2) % 7];
    const fifth = scaleN[(degreeIdx + 4) % 7];
    return [root, third, fifth];
  };

  const handleSelectDegree = (idx) => {
    setSelectedDegreeIndex(idx);
    const triad = getChordTriad(scaleNotes, idx);
    playChordNotes(triad);
  };

  // Bucle de reproducción
  useEffect(() => {
    let intervalId = null;
    if (isPlaying) {
      let step = 0;
      const playStep = () => {
        const currentScaleNotes = getScaleNotes();
        const degIdx = currentProgression[step];
        const triad = getChordTriad(currentScaleNotes, degIdx);
        setSelectedDegreeIndex(degIdx);
        playChordNotes(triad, (60 / bpm) * beatsPerChord);
        step = (step + 1) % currentProgression.length;
      };

      playStep();
      const intervalMs = (60 / bpm) * beatsPerChord * 1000;
      intervalId = setInterval(playStep, intervalMs);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPlaying, bpm, beatsPerChord, currentProgression, baseNoteChar, isSharpActive, currentScaleType]);

  const rootName = NOTES[getRootNoteIndex()];
  const rootNameEs = NOTE_NAMES_ES[rootName] || rootName;
  const scaleNameLabel = currentScaleType === 'major' ? 'Mayor' : 'Menor';

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen font-sans flex flex-col justify-between">
      {/* Header principal */}
      <header className="bg-slate-800 border-b border-slate-700 py-4 px-6 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-amber-400 flex items-center gap-2">
              <i className="fa-solid fa-music"></i> Mapas de Tensión y Modos Griegos
            </h1>
            <p className="text-xs text-slate-400">
              Basado en las Funciones Armónicas: Tónica (Descanso), Subdominante (Movimiento) y Dominante (Urgencia)
            </p>
          </div>

          {/* Panel de Control */}
          <div className="flex flex-wrap items-center justify-center gap-3 bg-slate-900 p-2.5 rounded-xl border border-slate-700">
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

            <div className="flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">
              <span className="text-xs font-semibold text-slate-300">Sostenido (#):</span>
              <button
                onClick={() => setIsSharpActive(!isSharpActive)}
                className={`w-10 h-6 rounded-full p-0.5 transition-colors duration-200 focus:outline-none flex items-center ${
                  isSharpActive ? 'bg-amber-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-slate-400 rounded-full shadow-md transform transition-transform duration-200 flex items-center justify-center text-[10px] font-bold text-slate-900 ${
                    isSharpActive ? 'translate-x-4' : ''
                  }`}
                >
                  {isSharpActive ? '#' : ''}
                </div>
              </button>
            </div>

            <div className="flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700">
              <button
                onClick={() => setCurrentScaleType('major')}
                className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                  currentScaleType === 'major'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Mayor
              </button>
              <button
                onClick={() => setCurrentScaleType('minor')}
                className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                  currentScaleType === 'minor'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Menor
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto p-4 md:p-6 w-full flex-grow">
        {/* Tablero de Grados */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-slate-200 flex items-center gap-2">
            <i className="fa-solid fa-sliders text-amber-400"></i> Grados Armónicos y Modos
            <span className="text-xs font-bold text-amber-300 ml-2 px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full">
              Tonalidad de {rootNameEs} ({rootName}) {scaleNameLabel}
            </span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {degreesInfo.map((deg, idx) => {
              const chordNotes = getChordTriad(scaleNotes, idx);
              const rootNoteName = NOTES[chordNotes[0]];
              const chordFullName = `${rootNoteName}${deg.type}`;
              const chordNotesText = chordNotes.map(n => NOTES[n]).join(' - ');
              const isActive = idx === selectedDegreeIndex;

              const barColor = deg.urgencyPercent < 30 ? 'bg-emerald-500' :
                               deg.urgencyPercent < 70 ? 'bg-amber-500' : 'bg-rose-500';

              return (
                <div
                  key={idx}
                  onClick={() => handleSelectDegree(idx)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between items-center text-center relative overflow-hidden ${
                    isActive
                      ? 'bg-slate-800 border-amber-400 ring-4 ring-blue-500 -translate-y-1'
                      : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700'
                  }`}
                >
                  <div className={`w-full flex justify-between items-start text-xs font-bold ${deg.colorText} mb-1`}>
                    <div className="flex flex-col items-center">
                      <span>{deg.roman}</span>
                      {deg.isMinor && (
                        <span className="bg-indigo-500/20 text-indigo-300 font-bold text-[9px] px-1 rounded border border-indigo-500/40 leading-none mt-0.5">m</span>
                      )}
                    </div>
                    <span className={`px-2 py-0.5 rounded-full ${deg.badgeBg} text-[9px] border border-current`}>
                      {deg.tension.toUpperCase()}
                    </span>
                  </div>

                  <div
                    className={`my-1 p-2 rounded-full ${deg.badgeBg} ${deg.colorText}`}
                    dangerouslySetInnerHTML={{ __html: deg.icon }}
                  />

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

        {/* Reproductor y Secuencia */}
        <section className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 shadow-xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-200 flex items-center gap-2">
                <i className="fa-solid fa-play text-emerald-400"></i> Generador de Secuencia y Ritmo
              </h2>
              <p className="text-xs text-slate-400">Experimenta la alternancia entre descanso, movimiento y urgencia en el tiempo.</p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700">
                <label htmlFor="bpm" className="text-xs font-semibold text-slate-300">Tempo (BPM):</label>
                <input
                  type="number"
                  id="bpm"
                  min="60"
                  max="180"
                  value={bpm}
                  onChange={(e) => setBpm(parseInt(e.target.value) || 90)}
                  className="w-16 bg-slate-800 text-center font-bold text-amber-400 rounded border border-slate-600"
                />
              </div>

              <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700">
                <label htmlFor="beatsPerChord" className="text-xs font-semibold text-slate-300">Notas/Tiempos por Acorde:</label>
                <select
                  id="beatsPerChord"
                  value={beatsPerChord}
                  onChange={(e) => setBeatsPerChord(parseInt(e.target.value))}
                  className="bg-slate-800 text-amber-400 font-bold px-2 py-1 rounded border border-slate-600"
                >
                  <option value={1}>1 Tiempo (Rápido)</option>
                  <option value={2}>2 Tiempos</option>
                  <option value={4}>4 Tiempos (Estándar)</option>
                </select>
              </div>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`font-bold px-5 py-2 rounded-lg flex items-center gap-2 shadow-lg transition ${
                  isPlaying ? 'bg-rose-600 hover:bg-rose-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                <i className={`fa-solid ${isPlaying ? 'fa-square' : 'fa-play'}`}></i>
                {isPlaying ? 'Detener' : 'Reproducir Progresión'}
              </button>
            </div>
          </div>

          {/* Progresiones Populares */}
          <div className="flex flex-col gap-2 mb-4">
            <span class="text-xs text-slate-400 font-semibold flex items-center gap-1">
              <i className="fa-solid fa-wand-magic-sparkles text-amber-400"></i> Progresiones Populares:
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'I - IV - V - I (Clásica Reposo-Movimiento)', pattern: [0, 3, 4, 0] },
                { label: 'I - V - VI - IV (Pop Moderno / 4 Chords)', pattern: [0, 4, 5, 3] },
                { label: 'I - VI - IV - V (Pop Estándar / Balada)', pattern: [0, 5, 3, 4] },
                { label: 'II - V - I (Jazz Cadencia)', pattern: [1, 4, 0, 0] },
                { label: 'II - V - I - VI (Círculo de Jazz)', pattern: [1, 4, 0, 5] },
                { label: 'I - V - IV - V (Rock / Pop Clásico)', pattern: [0, 4, 3, 4] },
                { label: 'I - VI - III - V (Emotiva / Dramática)', pattern: [0, 5, 2, 4] },
                { label: 'I - IV - I - V (Blues / Tradicional)', pattern: [0, 3, 0, 4] }
              ].map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentProgression([...p.pattern])}
                  className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1.5 rounded-full border border-slate-600 transition"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Visualizador de Compases */}
          <div className="grid grid-cols-4 gap-3">
            {currentProgression.map((degIdx, stepIdx) => {
              const deg = degreesInfo[degIdx];
              const triad = getChordTriad(scaleNotes, degIdx);
              const chordName = `${NOTES[triad[0]]}${deg.type}`;

              return (
                <div key={stepIdx} className="bg-slate-900 p-3 rounded-xl border border-slate-700 flex flex-col items-center justify-between relative text-center">
                  <span className="text-[10px] font-mono text-slate-500 mb-1">Compás {stepIdx + 1}</span>
                  <div className="text-lg font-bold text-amber-300 my-1">{chordName}</div>
                  <span className={`text-xs font-semibold ${deg.colorText}`}>{deg.roman} ({deg.mode})</span>

                  <select
                    value={degIdx}
                    onChange={(e) => {
                      const newProg = [...currentProgression];
                      newProg[stepIdx] = parseInt(e.target.value);
                      setCurrentProgression(newProg);
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
        Teoría de Funciones Armónicas y Modos Griegos — Interfaz Educativa Interactiva
      </footer>
    </div>
  );
}