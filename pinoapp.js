const notes = [
  { note: "C", freq: 261.63 },
  { note: "C#", freq: 277.18, black: true },
  { note: "D", freq: 293.66 },
  { note: "D#", freq: 311.13, black: true },
  { note: "E", freq: 329.63 },
  { note: "F", freq: 349.23 },
  { note: "F#", freq: 369.99, black: true },
  { note: "G", freq: 392.0 },
  { note: "G#", freq: 415.3, black: true },
  { note: "A", freq: 440.0 },
  { note: "A#", freq: 466.16, black: true },
  { note: "B", freq: 493.88 },
  { note: "C2", freq: 523.25 },
];

const piano = document.getElementById("piano");
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

let keyCounter = 0;

// Create keys
notes.forEach((noteItem, i) => {
  const key = document.createElement("div");
  key.className = "key" + (noteItem.black ? " black" : "");
  key.dataset.freq = noteItem.freq;
  key.dataset.index = i;
  key.innerText = noteItem.note;
  piano.appendChild(key);

  // Position black keys
  if (noteItem.black) {
    key.style.left = `${keyCounter - 20}px`;
    keyCounter -= 62;
  }

  keyCounter += 62;
  // const keyCounter = notes.slice(0, i + 1).filter((note) => !note.black).length;
  // if (!noteItem.black) {
  //   key.style.left = `${keyCounter * 62}px`;
  // } else {
  //   key.style.left = `${keyCounter * 62 - 20}px`;
  // }
});

// Play sound
function play(freq) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.frequency.value = freq;
  osc.type = "sine";

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  gain.gain.setValueAtTime(1, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);

  osc.start();
  osc.stop(audioCtx.currentTime + 1);
}

// Mouse input
piano.addEventListener("mousedown", (keyItem) => {
  if (keyItem.target.classList.contains("key")) {
    keyItem.target.classList.add("active");
    play(keyItem.target.dataset.freq);
  }
});
document.addEventListener("mouseup", () => {
  document
    .querySelectorAll(".key")
    .forEach((k) => k.classList.remove("active"));
});

// Keyboard mapping
const keyMap = {
  a: 0,
  w: 1,
  s: 2,
  e: 3,
  d: 4,
  f: 5,
  t: 6,
  g: 7,
  y: 8,
  h: 9,
  u: 10,
  j: 11,
  k: 12,
};

// Fix repeated keydown events when holding a key
let keysPressed = new Set();

document.addEventListener("keydown", (keyItem) => {
  if (!(keyItem.key in keyMap)) return;
  const index = keyMap[keyItem.key];
  const keyEl = document.querySelector(`[data-index="${index}"]`);
  if (keyEl) {
    keyEl.classList.add("active");
    play(keyEl.dataset.freq);
  }
  // if (keysPressed.has(keyItem.key)) return;
  // keysPressed.add(keyItem.key); //these only prevent multiple keydown events
});

document.addEventListener("keyup", (keyItem) => {
  document
    .querySelectorAll(".key")
    .forEach((k) => k.classList.remove("active"));
  // keysPressed.delete(keyItem.key);
});

// TODO: Fix note length
// TODO: Volume control
// TODO: Add touch support
// TODO: Improve styling

// TODO: Waveform selection
// TODO: Sustain pedal simulation
// TODO: More octaves
