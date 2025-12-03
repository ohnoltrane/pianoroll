// pino ------------------------------------------------------------
const AudioCtx = new (window.AudioContext || window.webkitAudioContext)();
const piano = document.getElementById("piano");

// NOTES for one octave (C4–B4)
const whiteNotes = ["C", "D", "E", "F", "G", "A", "B"];
const blackNotes = ["C#", "D#", null, "F#", "G#", "A#"]; 
// null = skip black key (no black key after E/B)

const noteToFreq = note =>
  440 * Math.pow(2, (note - 69) / 12);

// map note names to numbers (C4 = 60)
const nameToMidi = {
  "C4": 60, "C#4": 61, "D4": 62, "D#4": 63, "E4": 64,
  "F4": 65, "F#4": 66, "G4": 67, "G#4": 68, "A4": 69,
  "A#4": 70, "B4": 71
};

//pino UI ----------------------------------------------
// build white keys
whiteNotes.forEach((note, i) => {
  const key = document.createElement("div");
  key.className = "white";
  key.dataset.note = note + "4";
  key.onclick = () => playNote(key.dataset.note);
  piano.appendChild(key);
});

// build black keys (positioned above whites)
blackNotes.forEach((note, i) => {
  if (!note) return;

  const key = document.createElement("div");
  key.className = "black";
  key.dataset.note = note + "4";
  key.style.left = `${(i * 40) + 28}px`;
  key.onclick = () => playNote(key.dataset.note);
  piano.appendChild(key);
});

function playNote(note) {
  const midi = nameToMidi[note];
  const freq = noteToFreq(midi);

  const osc = AudioCtx.createOscillator();
  const gain = AudioCtx.createGain();

  osc.frequency.value = freq;
  osc.connect(gain);
  gain.connect(AudioCtx.destination);

  gain.gain.setValueAtTime(0.3, AudioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, AudioCtx.currentTime + 0.5);

  osc.start();
  osc.stop(AudioCtx.currentTime + 0.6);

  flashKey(note);
}

// highlight key when played
function flashKey(note) {
  const key = document.querySelector(`[data-note='${note}']`);
  key.classList.add("active");
  setTimeout(() => key.classList.remove("active"), 150);
}

// keyboard input → piano
const keyBindings = {
  "a": "C4",
  "w": "C#4",
  "s": "D4",
  "e": "D#4",
  "d": "E4",
  "f": "F4",
  "t": "F#4",
  "g": "G4",
  "y": "G#4",
  "h": "A4",
  "u": "A#4",
  "j": "B4"
};

document.addEventListener("keydown", e => {
  const note = keyBindings[e.key];
  if (note) playNote(note);
});
