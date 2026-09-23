/* ============================================================
   HELPER UMUM & EFEK UI
   Semua efek suara dibuat langsung lewat Web Audio API (tanpa file
   audio eksternal) supaya website tetap ringan dan bisa jalan
   offline / lokal.
   ============================================================ */

function el(tag, className, textOrHtml) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (textOrHtml !== undefined) e.textContent = textOrHtml;
  return e;
}

/* ---------- Pengaturan (sound, music, dark mode) ---------- */
const Settings = {
  data: loadJSON(STORAGE_KEYS.settings, { sound: true, music: false, darkMode: false, fontSize: "normal" }),
  save() { saveJSON(STORAGE_KEYS.settings, this.data); },
  toggle(key) {
    this.data[key] = !this.data[key];
    this.save();
    return this.data[key];
  }
};

/* ---------- Efek suara sintetis ---------- */
let audioCtx = null;
function getAudioCtx() {
  if (!audioCtx) {
    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
    catch (e) { return null; }
  }
  return audioCtx;
}

function playTone(freqs, duration = 0.15, type = "sine", gainVal = 0.08) {
  if (!Settings.data.sound) return;
  const ctx = getAudioCtx();
  if (!ctx) return;
  const now = ctx.currentTime;
  freqs.forEach((f, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = f;
    gain.gain.setValueAtTime(gainVal, now + i * duration);
    gain.gain.exponentialRampToValueAtTime(0.001, now + (i + 1) * duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + i * duration);
    osc.stop(now + (i + 1) * duration + 0.02);
  });
}

function playSfx(kind) {
  switch (kind) {
    case "correct": playTone([523.25, 659.25, 783.99], 0.11, "triangle", 0.09); break;
    case "wrong": playTone([220, 174.6], 0.14, "sawtooth", 0.06); break;
    case "click": playTone([440], 0.05, "sine", 0.04); break;
    case "levelup": playTone([392, 523.25, 659.25, 783.99, 1046.5], 0.1, "triangle", 0.09); break;
    case "badge": playTone([659.25, 987.77], 0.15, "sine", 0.08); break;
    case "mission": playTone([523.25, 783.99], 0.15, "triangle", 0.08); break;
    default: break;
  }
}

/* ---------- Musik latar (ambient pad ringan, opsional) ---------- */
let musicNodes = null;
function toggleMusic(on) {
  const ctx = getAudioCtx();
  if (!ctx) return;
  if (on && !musicNodes) {
    const gain = ctx.createGain();
    gain.gain.value = 0.025;
    gain.connect(ctx.destination);
    const o1 = ctx.createOscillator();
    o1.type = "sine"; o1.frequency.value = 196;
    const o2 = ctx.createOscillator();
    o2.type = "sine"; o2.frequency.value = 246.94;
    o1.connect(gain); o2.connect(gain);
    o1.start(); o2.start();
    musicNodes = { gain, o1, o2 };
  } else if (!on && musicNodes) {
    musicNodes.o1.stop(); musicNodes.o2.stop();
    musicNodes = null;
  }
}

/* ---------- Text-to-Speech ---------- */
function speak(text) {
  if (!("speechSynthesis" in window)) {
    alert("Maaf, perangkat/browser ini tidak mendukung fitur baca teks.");
    return;
  }
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "id-ID";
  utter.rate = 0.98;
  window.speechSynthesis.speak(utter);
}
function stopSpeak() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
}

/* ---------- Popup / Toast ---------- */
const UI = {
  showXPPopup(amount, reason) {
    const toast = el("div", "toast toast-xp");
    toast.innerHTML = `<span class="toast-xp-amount">+${amount} XP</span><span class="toast-xp-reason">${reason || ""}</span>`;
    document.getElementById("toast-layer").appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("toast-show"));
    setTimeout(() => { toast.classList.remove("toast-show"); setTimeout(() => toast.remove(), 300); }, 2200);

    const prevLevel = UI._lastLevelIndex;
    const lvl = Progress.getLevel();
    if (prevLevel !== undefined && prevLevel !== lvl.index) {
      setTimeout(() => UI.showLevelUpPopup(lvl), 400);
    }
    UI._lastLevelIndex = lvl.index;
  },

  showLevelUpPopup(lvl) {
    playSfx("levelup");
    fireConfetti();
    const modal = el("div", "modal-backdrop");
    modal.innerHTML = `<div class="modal levelup-modal">
      <div class="levelup-icon">${lvl.current.ikon}</div>
      <h3>Naik Level!</h3>
      <p>Kamu sekarang <strong>Level ${lvl.index} — ${lvl.current.nama}</strong></p>
      <button class="btn btn-primary" id="closeLevelUp">Lanjutkan</button>
    </div>`;
    document.body.appendChild(modal);
    modal.querySelector("#closeLevelUp").addEventListener("click", () => modal.remove());
  },

  showBadgePopup(badgeId) {
    const b = BADGE_INFO[badgeId];
    if (!b) return;
    playSfx("badge");
    fireConfetti();
    const modal = el("div", "modal-backdrop");
    modal.innerHTML = `<div class="modal badge-modal">
      <div class="badge-icon-big">${b.ikon}</div>
      <h3>Badge Baru!</h3>
      <p><strong>${b.nama}</strong></p>
      <p class="badge-desc">${b.desc}</p>
      <button class="btn btn-primary" id="closeBadge">Keren!</button>
    </div>`;
    document.body.appendChild(modal);
    modal.querySelector("#closeBadge").addEventListener("click", () => modal.remove());
  },

  refreshHUD() {
    const lvl = Progress.getLevel();
    const xpEl = document.getElementById("hud-xp");
    const lvlEl = document.getElementById("hud-level");
    const streakEl = document.getElementById("hud-streak");
    if (xpEl) xpEl.textContent = Progress.data.xp;
    if (lvlEl) lvlEl.textContent = `${lvl.current.ikon} Lv.${lvl.index}`;
    if (streakEl) streakEl.textContent = Progress.data.streak;
    const bar = document.getElementById("hud-progress-bar");
    if (bar) bar.style.width = Progress.progressPercent() + "%";
  }
};

/* ---------- Confetti ringan (canvas-free, pakai DOM) ---------- */
function fireConfetti() {
  const layer = document.getElementById("confetti-layer");
  if (!layer) return;
  const colors = ["#2DD4BF", "#FFB454", "#FF6B6B", "#4ADE80", "#818CF8"];
  for (let i = 0; i < 40; i++) {
    const piece = el("div", "confetti-piece");
    piece.style.left = Math.random() * 100 + "vw";
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = 1.6 + Math.random() * 1.2 + "s";
    piece.style.animationDelay = Math.random() * 0.3 + "s";
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    layer.appendChild(piece);
    setTimeout(() => piece.remove(), 3200);
  }
}

/* ---------- Utilitas YouTube embed ---------- */
function toYoutubeEmbed(url) {
  try {
    const u = new URL(url);
    let id = "";
    if (u.hostname.includes("youtu.be")) id = u.pathname.slice(1);
    else if (u.searchParams.get("v")) id = u.searchParams.get("v");
    else if (u.pathname.includes("/embed/")) return url;
    if (!id) return null;
    return `https://www.youtube.com/embed/${id}`;
  } catch (e) { return null; }
}

/* ---------- Dark mode ---------- */
function applyDarkMode() {
  document.documentElement.classList.toggle("dark", !!Settings.data.darkMode);
}
