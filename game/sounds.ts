import { Audio } from 'expo-av';
import { Sound } from 'expo-av/build/Audio';

const sounds: Record<string, Sound> = {};
let bgmSound: Sound | null = null;

const SAMPLE_RATE = 22050;

// --- WAV encoding helpers ---

function makeWavHeader(buf: Uint8Array, dataSize: number) {
  const w = (o: number, s: string) => { for (let i = 0; i < s.length; i++) buf[o + i] = s.charCodeAt(i); };
  const w32 = (o: number, v: number) => { buf[o]=v&0xff; buf[o+1]=(v>>8)&0xff; buf[o+2]=(v>>16)&0xff; buf[o+3]=(v>>24)&0xff; };
  const w16 = (o: number, v: number) => { buf[o]=v&0xff; buf[o+1]=(v>>8)&0xff; };
  w(0,'RIFF'); w32(4,36+dataSize); w(8,'WAVE'); w(12,'fmt ');
  w32(16,16); w16(20,1); w16(22,1); w32(24,SAMPLE_RATE);
  w32(28,SAMPLE_RATE); w16(32,1); w16(34,8);
  w(36,'data'); w32(40,dataSize);
}

function toDataUri(buf: Uint8Array): string {
  let b = '';
  for (let i = 0; i < buf.length; i++) b += String.fromCharCode(buf[i]);
  return 'data:audio/wav;base64,' + btoa(b);
}

function clampSample(v: number): number {
  return Math.max(0, Math.min(255, Math.floor((v + 1) * 128)));
}

// --- Sound generators ---

function generateJump(): string {
  // Quick ascending arpeggio with pitch bend — retro hop sound
  const dur = 0.1;
  const n = Math.floor(SAMPLE_RATE * dur);
  const buf = new Uint8Array(44 + n);
  makeWavHeader(buf, n);
  let phase = 0;
  for (let i = 0; i < n; i++) {
    const t = i / n;
    // Rapid pitch rise from 350 to 800Hz
    const freq = 350 + 450 * t * t;
    phase += freq / SAMPLE_RATE;
    // Square wave with slight pulse width modulation
    const pw = 0.3 + 0.2 * t;
    const sq = (phase % 1) < pw ? 0.35 : -0.35;
    // Add a touch of triangle for warmth
    const tri = Math.abs((phase % 1) * 4 - 2) - 1;
    const mix = sq * 0.7 + tri * 0.15;
    // Envelope: quick attack, sustain, quick release
    let env = 1;
    if (t < 0.05) env = t / 0.05;
    if (t > 0.7) env = (1 - t) / 0.3;
    buf[44 + i] = clampSample(mix * env);
  }
  return toDataUri(buf);
}

function generateDeathCar(): string {
  // Crunchy impact: noise burst + low thud
  const dur = 0.25;
  const n = Math.floor(SAMPLE_RATE * dur);
  const buf = new Uint8Array(44 + n);
  makeWavHeader(buf, n);
  let rng = 42;
  let phase = 0;
  for (let i = 0; i < n; i++) {
    const t = i / n;
    // Noise
    rng = (rng * 1103515245 + 12345) & 0x7fffffff;
    const noise = ((rng / 0x7fffffff) * 2 - 1) * 0.35;
    // Low thud (descending from 120 to 40Hz)
    const freq = 120 - 80 * t;
    phase += freq / SAMPLE_RATE;
    const thud = Math.sin(2 * Math.PI * phase) * 0.4;
    // Mix: noise dominant early, thud late
    const mix = noise * (1 - t) * 0.8 + thud * 0.6;
    // Sharp attack envelope
    let env = 1;
    if (t < 0.01) env = t / 0.01;
    if (t > 0.5) env = (1 - t) / 0.5;
    buf[44 + i] = clampSample(mix * env);
  }
  return toDataUri(buf);
}

function generateDeathTrain(): string {
  // Horn blast + rumble
  const dur = 0.4;
  const n = Math.floor(SAMPLE_RATE * dur);
  const buf = new Uint8Array(44 + n);
  makeWavHeader(buf, n);
  let rng = 77;
  let phase1 = 0, phase2 = 0;
  for (let i = 0; i < n; i++) {
    const t = i / n;
    // Horn: two detuned square waves
    phase1 += 110 / SAMPLE_RATE;
    phase2 += 113 / SAMPLE_RATE;
    const sq1 = (phase1 % 1) < 0.5 ? 0.25 : -0.25;
    const sq2 = (phase2 % 1) < 0.5 ? 0.2 : -0.2;
    // Rumble noise
    rng = (rng * 1103515245 + 12345) & 0x7fffffff;
    const noise = ((rng / 0x7fffffff) * 2 - 1) * 0.15;
    const mix = sq1 + sq2 + noise;
    let env = 1;
    if (t < 0.05) env = t / 0.05;
    if (t > 0.6) env = (1 - t) / 0.4;
    buf[44 + i] = clampSample(mix * env);
  }
  return toDataUri(buf);
}

function generateDeathWater(): string {
  // Descending bubbly splash
  const dur = 0.35;
  const n = Math.floor(SAMPLE_RATE * dur);
  const buf = new Uint8Array(44 + n);
  makeWavHeader(buf, n);
  let phase = 0;
  let rng = 99;
  for (let i = 0; i < n; i++) {
    const t = i / n;
    // Descending sine 700 -> 150Hz
    const freq = 700 - 550 * t;
    phase += freq / SAMPLE_RATE;
    const sine = Math.sin(2 * Math.PI * phase) * 0.3;
    // Bubble modulation
    const bubble = Math.sin(2 * Math.PI * 18 * t) * 0.15 * (1 - t);
    // Water noise
    rng = (rng * 1103515245 + 12345) & 0x7fffffff;
    const noise = ((rng / 0x7fffffff) * 2 - 1) * 0.12 * (1 - t * 0.5);
    const mix = sine + bubble * Math.sin(2 * Math.PI * phase * 3) + noise;
    let env = 1;
    if (t < 0.02) env = t / 0.02;
    if (t > 0.7) env = (1 - t) / 0.3;
    buf[44 + i] = clampSample(mix * env);
  }
  return toDataUri(buf);
}

function generateDeathUfo(): string {
  // Eerie ascending beam with wobble
  const dur = 0.6;
  const n = Math.floor(SAMPLE_RATE * dur);
  const buf = new Uint8Array(44 + n);
  makeWavHeader(buf, n);
  let phase = 0;
  for (let i = 0; i < n; i++) {
    const t = i / n;
    // Exponential sweep 200 -> 2500Hz
    const freq = 200 * Math.pow(2500 / 200, t);
    // Vibrato
    const vibrato = Math.sin(2 * Math.PI * 8 * t) * freq * 0.05;
    phase += (freq + vibrato) / SAMPLE_RATE;
    const sine = Math.sin(2 * Math.PI * phase) * 0.3;
    // Ring modulation for alien feel
    const ring = Math.sin(2 * Math.PI * 60 * t) * 0.2;
    const mix = sine * (1 + ring);
    let env = 1;
    if (t < 0.05) env = t / 0.05;
    if (t > 0.8) env = (1 - t) / 0.2;
    buf[44 + i] = clampSample(mix * env);
  }
  return toDataUri(buf);
}

function generateScore(): string {
  // Quick happy ding — two-note chime
  const dur = 0.15;
  const n = Math.floor(SAMPLE_RATE * dur);
  const buf = new Uint8Array(44 + n);
  makeWavHeader(buf, n);
  let phase1 = 0, phase2 = 0;
  for (let i = 0; i < n; i++) {
    const t = i / n;
    phase1 += 880 / SAMPLE_RATE;
    phase2 += 1320 / SAMPLE_RATE;
    const s1 = Math.sin(2 * Math.PI * phase1) * 0.2;
    const tri = (Math.abs((phase2 % 1) * 4 - 2) - 1) * 0.15;
    const mix = s1 + tri;
    let env = 1;
    if (t < 0.03) env = t / 0.03;
    env *= Math.pow(1 - t, 2);
    buf[44 + i] = clampSample(mix * env);
  }
  return toDataUri(buf);
}

function generateBgm(): string {
  const bpm = 150;
  const beatDur = 60 / bpm;
  // 32-beat loop (~12.8 seconds)
  const numBeats = 32;
  const totalDur = numBeats * beatDur;
  const n = Math.floor(SAMPLE_RATE * totalDur);
  const buf = new Uint8Array(44 + n);
  makeWavHeader(buf, n);

  // Melody (lead): catchy retro game theme in C major pentatonic
  const melody = [
    523, 659, 784, 659, 523, 587, 784, 1047,  // C5 E5 G5 E5 C5 D5 G5 C6
    784, 659, 523, 587, 523, 440, 523, 587,    // G5 E5 C5 D5 C5 A4 C5 D5
    659, 784, 1047, 784, 659, 523, 659, 784,   // E5 G5 C6 G5 E5 C5 E5 G5
    523, 587, 659, 523, 440, 523, 587, 523,    // C5 D5 E5 C5 A4 C5 D5 C5
  ];

  // Bass line
  const bass = [
    131, 131, 165, 165, 175, 175, 131, 131,    // C3 C3 E3 E3 F3 F3 C3 C3
    131, 131, 165, 165, 175, 175, 196, 196,    // repeat with G3
    131, 131, 165, 165, 175, 175, 131, 131,
    131, 131, 165, 165, 175, 175, 196, 131,
  ];

  // Arpeggio pattern (plays 4 sub-notes per beat)
  const arpNotes = [
    [262,330,392,523], [262,330,392,523], [330,392,523,659], [330,392,523,659],
    [349,440,523,659], [349,440,523,659], [262,330,392,523], [262,330,392,523],
    [262,330,392,523], [262,330,392,523], [330,392,523,659], [330,392,523,659],
    [349,440,523,659], [349,440,523,659], [392,494,587,784], [392,494,587,784],
    [262,330,392,523], [262,330,392,523], [330,392,523,659], [330,392,523,659],
    [349,440,523,659], [349,440,523,659], [262,330,392,523], [262,330,392,523],
    [262,330,392,523], [262,330,392,523], [330,392,523,659], [330,392,523,659],
    [349,440,523,659], [349,440,523,659], [392,494,587,784], [262,330,392,523],
  ];

  let leadPhase = 0;
  let bassPhase = 0;
  let arpPhase = 0;

  const samplesPerBeat = Math.floor(SAMPLE_RATE * beatDur);

  for (let i = 0; i < n; i++) {
    const beat = Math.floor(i / samplesPerBeat);
    const beatProgress = (i % samplesPerBeat) / samplesPerBeat;
    const beatIdx = beat % numBeats;

    // Lead: pulse wave with duty cycle variation
    const leadFreq = melody[beatIdx];
    leadPhase += leadFreq / SAMPLE_RATE;
    const duty = 0.25 + 0.1 * Math.sin(2 * Math.PI * 2 * (i / SAMPLE_RATE));
    const lead = (leadPhase % 1) < duty ? 0.18 : -0.18;
    // Lead envelope: percussive
    let leadEnv = 1;
    if (beatProgress < 0.03) leadEnv = beatProgress / 0.03;
    else leadEnv = Math.max(0.3, 1 - beatProgress * 0.7);

    // Bass: triangle wave
    const bassFreq = bass[beatIdx];
    bassPhase += bassFreq / SAMPLE_RATE;
    const bassTri = (Math.abs((bassPhase % 1) * 4 - 2) - 1) * 0.2;
    let bassEnv = 1;
    if (beatProgress < 0.02) bassEnv = beatProgress / 0.02;
    else bassEnv = Math.max(0.2, 1 - beatProgress * 0.5);

    // Arpeggio: 4 sub-notes per beat, sine wave
    const subBeat = Math.floor(beatProgress * 4);
    const subProgress = (beatProgress * 4) % 1;
    const arpFreq = arpNotes[beatIdx]?.[subBeat] ?? 262;
    arpPhase += arpFreq / SAMPLE_RATE;
    const arp = Math.sin(2 * Math.PI * arpPhase) * 0.08;
    let arpEnv = 1;
    if (subProgress < 0.05) arpEnv = subProgress / 0.05;
    else arpEnv = Math.max(0, 1 - subProgress * 1.2);

    const mix = lead * leadEnv + bassTri * bassEnv + arp * arpEnv;
    buf[44 + i] = clampSample(mix);
  }

  return toDataUri(buf);
}

// --- Public API ---

export async function initSounds() {
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
    });

    const defs: [string, string][] = [
      ['jump', generateJump()],
      ['score', generateScore()],
      ['deathCar', generateDeathCar()],
      ['deathTrain', generateDeathTrain()],
      ['deathWater', generateDeathWater()],
      ['deathUfo', generateDeathUfo()],
    ];

    for (const [name, uri] of defs) {
      const { sound } = await Audio.Sound.createAsync({ uri });
      sounds[name] = sound;
    }

    const bgmUri = generateBgm();
    const { sound } = await Audio.Sound.createAsync({ uri: bgmUri });
    bgmSound = sound;
  } catch (e) {
    console.warn('Sound init failed:', e);
  }
}

export async function playJump() {
  try {
    const s = sounds['jump'];
    if (s) {
      await s.setPositionAsync(0);
      await s.playAsync();
    }
  } catch {}
}

export async function playDeath(cause: string) {
  try {
    let key = 'deathCar';
    if (cause.includes('train')) key = 'deathTrain';
    else if (cause.includes('water')) key = 'deathWater';
    else if (cause.includes('alien') || cause.includes('Abducted')) key = 'deathUfo';

    const s = sounds[key];
    if (s) {
      await s.setPositionAsync(0);
      await s.playAsync();
    }
  } catch {}
}

export async function playBGM() {
  try {
    if (bgmSound) {
      await bgmSound.setIsLoopingAsync(true);
      await bgmSound.setPositionAsync(0);
      await bgmSound.setVolumeAsync(0.35);
      await bgmSound.playAsync();
    }
  } catch {}
}

export async function stopBGM() {
  try {
    if (bgmSound) {
      await bgmSound.stopAsync();
    }
  } catch {}
}

export async function cleanup() {
  try {
    for (const s of Object.values(sounds)) {
      await s.unloadAsync();
    }
    if (bgmSound) {
      await bgmSound.unloadAsync();
      bgmSound = null;
    }
  } catch {}
}
