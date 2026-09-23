/* ============================================================
   STATE & PENYIMPANAN
   - Materi/kuis/boss/glossary disimpan di localStorage supaya
     perubahan guru tersimpan otomatis di browser yang sama.
   - Progres siswa (XP, badge, subbab selesai) juga di localStorage,
     dipisah per "profil siswa" sederhana (nama yang diketik siswa).
   ============================================================ */

const STORAGE_KEYS = {
  materi: "pbl_materi_v1",
  quiz: "pbl_quiz_v1",
  boss: "pbl_boss_v1",
  glossary: "pbl_glossary_v1",
  progressPrefix: "pbl_progress_",
  activeStudent: "pbl_active_student",
  settings: "pbl_settings_v1"
};

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return structuredCloneSafe(fallback);
    return JSON.parse(raw);
  } catch (e) {
    console.warn("Gagal memuat", key, e);
    return structuredCloneSafe(fallback);
  }
}

function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.warn("Gagal menyimpan", key, e);
    return false;
  }
}

function structuredCloneSafe(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/* ---------- Konten aktif (bisa diedit guru) ---------- */
const Content = {
  materi: loadJSON(STORAGE_KEYS.materi, DEFAULT_MATERI),
  quiz: loadJSON(STORAGE_KEYS.quiz, DEFAULT_QUIZ),
  boss: loadJSON(STORAGE_KEYS.boss, DEFAULT_BOSS),
  glossary: loadJSON(STORAGE_KEYS.glossary, DEFAULT_GLOSSARY),

  saveMateri() { saveJSON(STORAGE_KEYS.materi, this.materi); },
  saveQuiz() { saveJSON(STORAGE_KEYS.quiz, this.quiz); },
  saveBoss() { saveJSON(STORAGE_KEYS.boss, this.boss); },
  saveGlossary() { saveJSON(STORAGE_KEYS.glossary, this.glossary); },

  resetToDefault() {
    this.materi = structuredCloneSafe(DEFAULT_MATERI);
    this.quiz = structuredCloneSafe(DEFAULT_QUIZ);
    this.boss = structuredCloneSafe(DEFAULT_BOSS);
    this.glossary = structuredCloneSafe(DEFAULT_GLOSSARY);
    this.saveMateri(); this.saveQuiz(); this.saveBoss(); this.saveGlossary();
  },

  exportAll() {
    return {
      materi: this.materi,
      quiz: this.quiz,
      boss: this.boss,
      glossary: this.glossary
    };
  },

  importAll(obj) {
    if (obj.materi) { this.materi = obj.materi; this.saveMateri(); }
    if (obj.quiz) { this.quiz = obj.quiz; this.saveQuiz(); }
    if (obj.boss) { this.boss = obj.boss; this.saveBoss(); }
    if (obj.glossary) { this.glossary = obj.glossary; this.saveGlossary(); }
  }
};

/* ---------- Progres siswa ---------- */
function defaultProgress() {
  return {
    xp: 0,
    subbabSelesai: {},      // { subId: true }
    aktivitasSelesai: {},   // { subId: true }
    quizSkor: null,         // { benar, total, tanggal }
    bossSelesai: false,
    bookmark: [],           // [subId]
    catatan: {},            // { subId: "teks catatan siswa" }
    refleksi: {},
    streak: 0,
    lastActiveDate: null,
    badges: []
  };
}

const Progress = {
  studentName: localStorage.getItem(STORAGE_KEYS.activeStudent) || "",
  data: defaultProgress(),

  key() { return STORAGE_KEYS.progressPrefix + (this.studentName || "tamu"); },

  load() {
    this.data = loadJSON(this.key(), defaultProgress());
    this.updateStreak();
  },

  save() { saveJSON(this.key(), this.data); },

  setStudent(name) {
    this.studentName = name.trim() || "tamu";
    localStorage.setItem(STORAGE_KEYS.activeStudent, this.studentName);
    this.load();
  },

  updateStreak() {
    const today = new Date().toDateString();
    if (this.data.lastActiveDate === today) return;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (this.data.lastActiveDate === yesterday) {
      this.data.streak += 1;
    } else if (this.data.lastActiveDate !== today) {
      this.data.streak = 1;
    }
    this.data.lastActiveDate = today;
    this.save();
  },

  addXP(amount, reason) {
    this.data.xp += amount;
    this.save();
    UI.showXPPopup(amount, reason);
    this.checkBadges();
    UI.refreshHUD();
  },

  markSubbabRead(subId) {
    if (this.data.subbabSelesai[subId]) return;
    this.data.subbabSelesai[subId] = true;
    this.save();
    this.addXP(10, "Membaca materi");
  },

  markAktivitasSelesai(subId, benar) {
    const already = this.data.aktivitasSelesai[subId];
    this.data.aktivitasSelesai[subId] = true;
    this.save();
    if (!already) {
      this.addXP(20, "Menyelesaikan praktik");
      if (benar) this.addXP(10, "Jawaban benar");
    }
  },

  saveQuizResult(benar, total) {
    this.data.quizSkor = { benar, total, tanggal: new Date().toISOString() };
    this.save();
    this.addXP(Math.round((benar / total) * 50), "Kuis selesai");
    this.checkBadges();
  },

  markBossSelesai() {
    this.data.bossSelesai = true;
    this.save();
    this.addXP(50, "Boss Challenge selesai");
    this.checkBadges();
  },

  toggleBookmark(subId) {
    const idx = this.data.bookmark.indexOf(subId);
    if (idx >= 0) this.data.bookmark.splice(idx, 1);
    else this.data.bookmark.push(subId);
    this.save();
  },

  isBookmarked(subId) { return this.data.bookmark.includes(subId); },

  saveCatatan(subId, text) {
    this.data.catatan[subId] = text;
    this.save();
  },

  saveRefleksi(obj) {
    this.data.refleksi = obj;
    this.save();
  },

  getLevel() {
    let current = LEVELS[0];
    for (const lvl of LEVELS) if (this.data.xp >= lvl.min) current = lvl;
    const idx = LEVELS.indexOf(current);
    const next = LEVELS[idx + 1] || null;
    return { current, next, index: idx + 1 };
  },

  totalSubbab() { return Content.materi.subbab.length; },

  subbabSelesaiCount() { return Object.keys(this.data.subbabSelesai).length; },

  progressPercent() {
    const total = this.totalSubbab();
    if (!total) return 0;
    return Math.round((this.subbabSelesaiCount() / total) * 100);
  },

  checkBadges() {
    const earn = (id) => {
      if (!this.data.badges.includes(id)) {
        this.data.badges.push(id);
        this.save();
        UI.showBadgePopup(id);
      }
    };
    if (this.subbabSelesaiCount() >= 1) earn("pemula");
    if (this.subbabSelesaiCount() >= Math.ceil(this.totalSubbab() / 2)) earn("aktif");
    if (this.subbabSelesaiCount() >= this.totalSubbab()) earn("pemaham");
    if (this.data.quizSkor && this.data.quizSkor.benar === this.data.quizSkor.total) earn("ahli");
    if (this.data.streak >= 2) earn("rajin");
    if (this.data.bossSelesai) earn("penyelesai");
  }
};

const BADGE_INFO = {
  pemula: { nama: "Pemula", ikon: "🥉", desc: "Menyelesaikan subbab pertama" },
  aktif: { nama: "Pembelajar Aktif", ikon: "🥈", desc: "Menyelesaikan separuh materi" },
  pemaham: { nama: "Pemaham", ikon: "🥇", desc: "Menyelesaikan semua subbab" },
  ahli: { nama: "Ahli Materi", ikon: "🏆", desc: "Nilai kuis sempurna" },
  rajin: { nama: "Rajin Belajar", ikon: "🔥", desc: "Belajar 2 hari berturut-turut" },
  penyelesai: { nama: "Penyelesai Misi", ikon: "🎯", desc: "Menaklukkan Boss Challenge" }
};
