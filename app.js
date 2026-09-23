/* ============================================================
   INISIALISASI APLIKASI
   ============================================================ */

const NAV_ITEMS = [
  { view: "beranda", icon: "🏠", label: "Beranda" },
  { view: "materi-list", icon: "📚", label: "Materi" },
  { view: "misi", icon: "🎯", label: "Misi" },
  { view: "kuis", icon: "🧠", label: "Kuis" },
  { view: "prestasi", icon: "🏆", label: "Prestasi" },
  { view: "glosarium", icon: "📖", label: "Kamus" }
];

const Nav = {
  build() {
    const sidebar = document.getElementById("sidebar-nav");
    const bottom = document.getElementById("bottom-nav");
    sidebar.innerHTML = ""; bottom.innerHTML = "";
    NAV_ITEMS.forEach(item => {
      const sBtn = el("button", "sidebar-btn");
      sBtn.dataset.view = item.view;
      sBtn.innerHTML = `<span class="nav-icon">${item.icon}</span><span class="nav-label">${item.label}</span>`;
      sBtn.addEventListener("click", () => { playSfx("click"); Router.go(item.view); });
      sidebar.appendChild(sBtn);

      const bBtn = el("button", "bottom-btn");
      bBtn.dataset.view = item.view;
      bBtn.innerHTML = `<span class="nav-icon">${item.icon}</span><span class="nav-label">${item.label}</span>`;
      bBtn.addEventListener("click", () => { playSfx("click"); Router.go(item.view); });
      bottom.appendChild(bBtn);
    });
  },
  highlight(view) {
    const isSubbab = view === "subbab";
    const activeView = isSubbab ? "materi-list" : view;
    const isGuru = view.startsWith("guru");
    [...document.querySelectorAll(".sidebar-btn, .bottom-btn")].forEach(b => {
      b.classList.toggle("nav-active", !isGuru && b.dataset.view === activeView);
    });
    document.getElementById("mode-toggle-btn").textContent = isGuru ? "🎓 Mode Siswa" : "🧑‍🏫 Mode Guru";
  }
};

function initTopBar() {
  document.getElementById("app-title").textContent = Content.materi.judul;

  const soundBtn = document.getElementById("sound-toggle-btn");
  const musicBtn = document.getElementById("music-toggle-btn");
  const darkBtn = document.getElementById("dark-toggle-btn");
  const updateToggleLabels = () => {
    soundBtn.textContent = Settings.data.sound ? "🔊" : "🔇";
    musicBtn.textContent = Settings.data.music ? "🎵" : "🎵‍🚫";
    musicBtn.classList.toggle("toggle-active", Settings.data.music);
    darkBtn.textContent = Settings.data.darkMode ? "☀️" : "🌙";
  };
  soundBtn.addEventListener("click", () => { Settings.toggle("sound"); updateToggleLabels(); if (Settings.data.sound) playSfx("click"); });
  musicBtn.addEventListener("click", () => { const on = Settings.toggle("music"); toggleMusic(on); updateToggleLabels(); });
  darkBtn.addEventListener("click", () => { Settings.toggle("darkMode"); applyDarkMode(); updateToggleLabels(); });
  updateToggleLabels();
  applyDarkMode();

  const modeBtn = document.getElementById("mode-toggle-btn");
  modeBtn.addEventListener("click", () => {
    if (Router.current.startsWith("guru")) {
      Router.go("beranda");
    } else {
      const pin = prompt("Masukkan PIN Mode Guru (default: 1234):");
      const savedPin = localStorage.getItem("pbl_guru_pin") || "1234";
      if (pin === savedPin) Router.go("guru");
      else if (pin !== null) alert("PIN salah.");
    }
  });

  const profileBtn = document.getElementById("profile-btn");
  profileBtn.addEventListener("click", promptStudentName);
}

function promptStudentName(forceAsk) {
  const existing = Progress.studentName;
  if (existing && !forceAsk) return;
  let name = prompt("Siapa namamu? (dipakai untuk menyimpan progres belajarmu di perangkat ini)", existing || "");
  if (name === null) name = existing || "Siswa";
  Progress.setStudent(name);
  document.getElementById("profile-btn").textContent = "👤 " + Progress.studentName;
  UI.refreshHUD();
}

function initApp() {
  Nav.build();
  initTopBar();
  Progress.load();
  document.getElementById("profile-btn").textContent = "👤 " + (Progress.studentName || "Siswa");
  if (!Progress.studentName) {
    setTimeout(() => promptStudentName(true), 300);
  }
  UI.refreshHUD();
  UI._lastLevelIndex = Progress.getLevel().index;
  Router.go("beranda");
}

document.addEventListener("DOMContentLoaded", initApp);
