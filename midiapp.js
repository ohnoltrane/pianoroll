// midi
const rows = 12; // C to B
const cols = 32; // steps
const roll = document.getElementById("roll");

// create matrix
let grid = Array.from({ length: rows }, () => Array(cols).fill(false));

// build UI
const cells = [];
for (let r = 0; r < rows; r++) {
  cells[r] = [];
  for (let c = 0; c < cols; c++) {
    const div = document.createElement("div");
    div.className = "cell";
    div.onclick = () => {
      grid[r][c] = !grid[r][c];
      div.classList.toggle("active");
    };
    roll.appendChild(div);
    cells[r][c] = div;
  }
}

// simple synth
const ctx = new AudioContext();
function playFreq(freq) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.frequency.value = freq;
  o.connect(g);
  g.connect(ctx.destination);
  g.gain.setValueAtTime(0.3, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
  o.start();
  o.stop(ctx.currentTime + 0.25);
}

// midi -------------------------------------------------------------
navigator.requestMIDIAccess().then(access => {
  document.getElementById("midi-status").textContent = "MIDI Ready";

  access.inputs.forEach(input => {
    input.onmidimessage = (msg) => {
      const [cmd, note, vel] = msg.data;
      if (cmd === 144 && vel > 0) {
        const row = 11 - ((note - 60) % 12);
        if (row >= 0 && row < 12) {
          // flash UI
          cells[row][0].style.background = "#4ade80";
          setTimeout(() => cells[row][0].style.background = grid[row][0] ? "#4ade80" : "#222", 150);
        }
        playFreq(440 * Math.pow(2, (note - 69) / 12));
      }
    };
  });
});

// --- keyboard input ---
const keyMap = {
  'a': 60, // C4
  'w': 61,
  's': 62,
  'e': 63,
  'd': 64,
  'f': 65, // F
  't': 66,
  'g': 67,
  'y': 68,
  'h': 69,
  'u': 70,
  'j': 71 // B
};

document.addEventListener('keydown', (e) => {
  const note = keyMap[e.key];
  if (!note) return;

  // calculate which row this note corresponds to
  const row = 11 - ((note - 60) % 12);
  if (row >= 0 && row < 12) {
    // flash column 0 visually
    cells[row][0].style.background = "#4ade80";
    setTimeout(() => {
      cells[row][0].style.background = grid[row][0] ? "#4ade80" : "#222";
    }, 150);
  }

  // play audio
  playFreq(440 * Math.pow(2, (note - 69) / 12));
});
