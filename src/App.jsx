import React, { useState, useRef, useEffect } from 'react';

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
  const [isPlayingCustom, setIsPlayingCustom] = useState(false);

  const audioCtxRef = useRef(null);
  const playIntervalRef = useRef(null);
  const customPlayIntervalRef = useRef(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
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
      gain.connect(audioCtxRef.current.destination);
      osc.start(now);
      osc.stop(now + duration);
    });
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
  isPlayingRef.current = isPlaying;

  const isPlayingCustomRef = useRef(isPlayingCustom);
  isPlayingCustomRef.current = isPlayingCustom;

  const startProgression = () => {
    initAudio();
    setIsPlaying(true);
    const totalStepDurationSec = (60 / currentBpm) * beatsPerChordValue;
    const intervalMs = totalStepDurationSec * 1000;
    let step = 0;

    const playStep = () => {
      if (!isPlayingRef.current) return;
      const scaleNotes = getScaleNotes();
      const degIdx = currentProgression[step];
      const triad = getChordTriad(scaleNotes, degIdx);
      setSelectedDegreeIndex(degIdx);
      triggerRhythmicChordHits(triad, totalStepDurationSec, isPlayingRef);
      step = (step + 1) % currentProgression.length;
    };

    playStep();
    playIntervalRef.current = setInterval(playStep, intervalMs);
  };

  const stopProgression = () => {
    setIsPlaying(false);
    if (playIntervalRef.current) clearInterval(playIntervalRef.current);
  };

  const startPlayCustom = () => {
    if (customProgression.length === 0) return;
    initAudio();
    setIsPlayingCustom(true);
    const totalStepDurationSec = (60 / currentBpm) * beatsPerChordValue;
    const intervalMs = totalStepDurationSec * 1000;
    let step = 0;

    const playStep = () => {
      if (!isPlayingCustomRef.current) return;
      const scaleNotes = getScaleNotes();
      const degIdx = customProgression[step];
      const triad = getChordTriad(scaleNotes, degIdx);
      setActiveCustomSlotIndex(step);
      triggerRhythmicChordHits(triad, totalStepDurationSec, isPlayingCustomRef);
      step = (step + 1) % customProgression.length;
    };

    playStep();
    customPlayIntervalRef.current = setInterval(playStep, intervalMs);
  };

  const stopPlayCustom = () => {
    setIsPlayingCustom(false);
    if (customPlayIntervalRef.current) clearInterval(customPlayIntervalRef.current);
  };

  const scaleNotes = getScaleNotes();
  const rootIdx = getRootNoteIndex();
  const rootName = NOTES[rootIdx];
  const rootNameEs = NOTE_NAMES_ES[rootName];
  const scaleName = currentScaleType === 'major' ? 'Mayor' : 'Menor';

  return (
    <div className="flex flex-col min-h-screen justify-between">
      <header className="bg-slate-800 border-b border-slate-700 py-4 px-6 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-amber-400 flex items-center gap-2">
              <i className="fa-solid fa-music"></i> Mapas de Tensión y Modos Griegos
            </h1>
            <p className="text-xs text-slate-400">Basado en las Funciones Armónicas: Tónica (Descanso), Subdominante (Movimiento) y Dominante (Urgencia)</p>
          </div>
          
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
                className={`w-10 h-6 rounded-full p-0.5 transition-colors duration-200 focus:outline-none flex items-center ${isSharpActive ? 'bg-amber-500' : 'bg-slate-700'}`}
              >
                <div className={`w-5 h-5 bg-slate-400 rounded-full shadow-md transform transition-transform duration-200 flex items-center justify-center text-[10px] font-bold text-slate-900 ${isSharpActive ? 'translate-x-4' : ''}`}>
                  {isSharpActive ? '#' : ''}
                </div>
              </button>
            </div>

            <div className="flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700">
              <button
                onClick={() => setCurrentScaleType('major')}
                className={`px-3 py-1 rounded text-xs font-bold transition-all ${currentScaleType === 'major' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Mayor
              </button>
              <button
                onClick={() => setCurrentScaleType('minor')}
                className={`px-3 py-1 rounded text-xs font-bold transition-all ${currentScaleType === 'minor' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Menor
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-6 w-full flex-grow space-y-8">
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-200 flex items-center gap-2">
              <i className="fa-solid fa-sliders text-amber-400"></i> Grados Armónicos y Modos
              <span className="text-xs font-bold text-amber-300 ml-2 px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full">
                Tonalidad de {rootNameEs} ({rootName}) {scaleName}
              </span>
            </h2>
            {isRecordingMode && (
              <div className="text-xs font-bold text-rose-400 bg-rose-500/20 px-3 py-1 rounded-full border border-rose-500/40 animate-pulse flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span> Modo Grabación: Haz clic en cualquier tarjeta para añadirla
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
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between items-center text-center relative overflow-hidden ${
                    idx === selectedDegreeIndex ? 'active-card bg-slate-800 border-amber-400' : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700'
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
                <i className="fa-solid fa-microphone-lines text-rose-400"></i> Creador y Grabador de Progresión Personalizada
              </h2>
              <p className="text-xs text-slate-400">Haz clic en los recuadros de arriba para ir armando o grabando tu propia secuencia de acordes paso a paso.</p>
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
                onClick={() => isPlayingCustom ? stopPlayCustom() : startPlayCustom()}
                title="Escuchar Secuencia"
                className={`w-10 h-10 rounded-lg flex items-center justify-center shadow transition text-base text-white ${isPlayingCustom ? 'bg-rose-600 hover:bg-rose-500' : 'bg-emerald-600 hover:bg-emerald-500'}`}
              >
                <i className={`fa-solid ${isPlayingCustom ? 'fa-square' : 'fa-play'}`}></i>
              </button>

              <button
                onClick={() => { setCustomProgression([]); setActiveCustomSlotIndex(0); if(isPlayingCustom) stopPlayCustom(); }}
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
                  Aún no has grabado acordes. Pulsa el botón de grabación y haz clic en las tarjetas de arriba para construir tu progresión.
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
                      className={`p-2.5 rounded-xl border flex flex-col items-center justify-between cursor-pointer transition-all min-w-[85px] relative group ${
                        isSelected ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/50' : 'bg-slate-800/90 border-slate-700 hover:border-slate-500'
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
              <span>Añadir / Quitar ranura manual:</span>
              <button onClick={() => setCustomProgression(prev => [...prev, 0])} className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-2 py-0.5 rounded font-bold border border-slate-600">+</button>
              <button onClick={() => setCustomProgression(prev => prev.slice(0, -1))} className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-2 py-0.5 rounded font-bold border border-slate-600">-</button>
            </div>
          </div>
        </section>

        <section className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 shadow-xl">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-200 flex items-center gap-2">
                <i className="fa-solid fa-play text-emerald-400"></i> Generador de Secuencia y Ritmo
              </h2>
              <p className="text-xs text-slate-400">Experimenta la alternancia entre descanso, movimiento y urgencia en el tiempo.</p>
            </div>

            <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
              <div className="flex flex-col gap-1.5 bg-slate-900 px-4 py-2 rounded-xl border border-slate-700 min-w-[180px] flex-grow sm:flex-grow-0">
                <div className="flex justify-between items-center">
                  <label htmlFor="bpmSlider" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <i className="fa-solid fa-gauge-high text-amber-400"></i> Tempo:
                  </label>
                  <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-mono">
                    {currentBpm} BPM
                  </span>
                </div>
                <input
                  type="range"
                  id="bpmSlider"
                  min="60"
                  max="180"
                  value={currentBpm}
                  onChange={(e) => setCurrentBpm(parseInt(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
                />
              </div>

              <div className="flex flex-col gap-1.5 bg-slate-900 px-4 py-2 rounded-xl border border-slate-700">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <i className="fa-solid fa-music text-amber-400"></i> Figura:
                </span>
                <div className="flex items-center gap-1.5">
                  {[
                    { val: 4, symbol: '𝅝', label: '4t' },
                    { val: 2, symbol: '𝅗𝅥', label: '2t' },
                    { val: 1, symbol: '♩', label: '1t' },
                    { val: 0.5, symbol: '♪', label: '½t' }
                  ].map(item => (
                    <button
                      key={item.val}
                      onClick={() => setBeatsPerChordValue(item.val)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                        beatsPerChordValue === item.val
                          ? 'bg-amber-500 text-slate-950 border border-amber-400 shadow'
                          : 'bg-slate-800 text-slate-300 border border-slate-700 hover:border-amber-400/50'
                      }`}
                    >
                      <span className="text-base font-serif leading-none">{item.symbol}</span>
                      <span className="text-[10px]">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5 bg-slate-900 px-4 py-2 rounded-xl border border-slate-700">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <i className="fa-solid fa-drum text-amber-400"></i> Golpes:
                </span>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 4, 8].map(hits => (
                    <button
                      key={hits}
                      onClick={() => setHitsPerChordValue(hits)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                        hitsPerChordValue === hits
                          ? 'bg-amber-500 text-slate-950 border border-amber-400 shadow'
                          : 'bg-slate-800 text-slate-300 border border-slate-700 hover:border-amber-400/50'
                      }`}
                    >
                      <span>{hits}x</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => isPlaying ? stopProgression() : startProgression()}
                className={`font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg transition self-stretch sm:self-auto justify-center text-white ${
                  isPlaying ? 'bg-rose-600 hover:bg-rose-500' : 'bg-emerald-600 hover:bg-emerald-500'
                }`}
              >
                <i className={`fa-solid ${isPlaying ? 'fa-square' : 'fa-play'}`}></i>
                {isPlaying ? 'Detener' : 'Reproducir Progresión'}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3 mb-6 bg-slate-900/60 p-4 rounded-xl border border-slate-700/80">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300 font-bold flex items-center gap-1.5">
                <i className="fa-solid fa-wand-magic-sparkles text-amber-400"></i> Biblioteca Ampliada de Progresiones y Cadencias:
              </span>
              <span className="text-[11px] text-slate-400 italic">Haz clic en cualquiera para cargarla al instante</span>
            </div>

            <div className="space-y-3 mt-1">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400/90 tracking-wider mb-1.5 block flex items-center gap-1">
                  <i className="fa-solid fa-guitar text-[9px]"></i> Pop, Rock & Blues Clásico
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { arr: [0, 3, 4, 0], label: 'I - IV - V - I (Clásica Reposo-Movimiento)' },
                    { arr: [0, 4, 5, 3], label: 'I - V - VI - IV (Pop Moderno / 4 Chords)' },
                    { arr: [0, 5, 3, 4], label: 'I - VI - IV - V (Pop Estándar / Balada)' },
                    { arr: [0, 4, 3, 4], label: 'I - V - IV - V (Rock / Pop Clásico)' },
                    { arr: [0, 3, 0, 4], label: 'I - IV - I - V (Blues / Tradicional)' },
                    { arr: [0, 4, 1, 3], label: 'I - V - II - IV (Indie / Alternative Folk)' }
                  ].map((p, i) => (
                    <button key={i} onClick={() => setCurrentProgression(p.arr)} className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-full border border-slate-600 hover:border-amber-400/50 transition">
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-400/90 tracking-wider mb-1.5 block flex items-center gap-1">
                  <i className="fa-solid fa-saxhorn text-[9px]"></i> Jazz, Neo-Soul & Lo-Fi
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { arr: [1, 4, 0, 0], label: 'II - V - I (Cadencia Fundamental de Jazz)' },
                    { arr: [1, 4, 0, 5], label: 'II - V - I - VI (Círculo Armónico de Jazz)' },
                    { arr: [0, 2, 5, 3], label: 'I - III - VI - IV (Lo-Fi Nostálgico / Neo-Soul)' },
                    { arr: [0, 3, 1, 4], label: 'I - IV - II - V (Gospel / Soft Soul)' },
                    { arr: [0, 5, 1, 4], label: 'I - VI - II - V (Turnaround Clásico Doo-Wop)' }
                  ].map((p, i) => (
                    <button key={i} onClick={() => setCurrentProgression(p.arr)} className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-full border border-slate-600 hover:border-indigo-400/50 transition">
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-rose-400/90 tracking-wider mb-1.5 block flex items-center gap-1">
                  <i className="fa-solid fa-film text-[9px]"></i> BSO, Cine, Épica & Videojuegos
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { arr: [0, 5, 2, 4], label: 'I - VI - III - V (Emotiva / Dramática)' },
                    { arr: [0, 3, 5, 4], label: 'I - IV - VI - V (Épica Cinematográfica)' },
                    { arr: [3, 4, 0, 5], label: 'IV - V - I - VI (Heroica RPG / Triunfal)' },
                    { arr: [3, 0, 4, 5], label: 'IV - I - V - VI (Gran Aventura BSO)' },
                    { arr: [0, 6, 5, 4], label: 'I - VII - VI - V (Descenso Tensión Épica)' }
                  ].map((p, i) => (
                    <button key={i} onClick={() => setCurrentProgression(p.arr)} className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-full border border-slate-600 hover:border-rose-400/50 transition">
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400/90 tracking-wider mb-1.5 block flex items-center gap-1">
                  <i className="fa-solid fa-compact-disc text-[9px]"></i> Anime, J-Pop & Exploración Modal
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { arr: [3, 4, 2, 5], label: 'IV - V - III - VI (Royal Road / 王道進行 - Anime & J-Pop)' },
                    { arr: [5, 3, 0, 4], label: 'VI - IV - I - V (Axis Menor / Melancolía Pop)' },
                    { arr: [5, 4, 3, 4], label: 'VI - V - IV - V (Cadencia Andaluza / Aire Flamenco-Rock)' },
                    { arr: [0, 2, 3, 4], label: 'I - III - IV - V (Ascensión Escalofriante)' },
                    { arr: [0, 3, 2, 1], label: 'I - IV - III - II (Cascada Flotante Modal)' }
                  ].map((p, i) => (
                    <button key={i} onClick={() => setCurrentProgression(p.arr)} className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-full border border-slate-600 hover:border-emerald-400/50 transition">
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
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
        Teoría de Funciones Armónicas y Modos Griegos — Interfaz Educativa Interactiva
      </footer>
    </div>
  );
}