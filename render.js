/* ============================================================
   RENDER HALAMAN — MODE SISWA
   ============================================================ */

const Router = {
  current: "beranda",
  params: {},

  go(view, params = {}) {
    this.current = view;
    this.params = params;
    document.getElementById("app-main").scrollTo?.(0, 0);
    window.scrollTo(0, 0);
    Render.page(view, params);
    Nav.highlight(view);
  }
};

const Render = {
  page(view, params) {
    const main = document.getElementById("app-main");
    main.innerHTML = "";
    main.classList.remove("guru-mode");
    switch (view) {
      case "beranda": return main.appendChild(this.beranda());
      case "materi-list": return main.appendChild(this.materiList());
      case "subbab": return main.appendChild(this.subbab(params.id));
      case "misi": return main.appendChild(this.misi());
      case "kuis": return main.appendChild(this.kuis());
      case "prestasi": return main.appendChild(this.prestasi());
      case "boss": return main.appendChild(this.boss());
      case "glosarium": return main.appendChild(this.glosarium());
      case "guru": main.classList.add("guru-mode"); return main.appendChild(Guru.dashboard());
      case "guru-materi": main.classList.add("guru-mode"); return main.appendChild(Guru.editMateri());
      case "guru-subbab": main.classList.add("guru-mode"); return main.appendChild(Guru.editSubbab(params.id));
      case "guru-kuis": main.classList.add("guru-mode"); return main.appendChild(Guru.editKuis());
      case "guru-boss": main.classList.add("guru-mode"); return main.appendChild(Guru.editBoss());
      case "guru-pengaturan": main.classList.add("guru-mode"); return main.appendChild(Guru.pengaturan());
      default: return main.appendChild(this.beranda());
    }
  },

  /* ---------------- BERANDA ---------------- */
  beranda() {
    const wrap = el("div", "page page-beranda");
    const hero = el("div", "hero-card");
    hero.innerHTML = `
      <div class="hero-mascot" aria-hidden="true">🦉</div>
      <div class="hero-text">
        <p class="hero-eyebrow">${Content.materi.mapel}</p>
        <h1>Selamat Datang di Petualangan Belajar</h1>
        <h2>${Content.materi.judul}</h2>
        <p class="hero-sub">${Content.materi.subjudul}</p>
      </div>`;
    wrap.appendChild(hero);

    const actions = el("div", "hero-actions");
    const buttons = [
      ["🚀 Mulai Belajar", () => Router.go("subbab", { id: this.firstUnfinishedSubbab() })],
      ["📚 Lihat Materi", () => Router.go("materi-list")],
      ["🎯 Tantangan", () => Router.go("boss")],
      ["🧠 Kuis", () => Router.go("kuis")]
    ];
    buttons.forEach(([label, fn]) => {
      const b = el("button", "btn btn-hero", label);
      b.addEventListener("click", fn);
      actions.appendChild(b);
    });
    wrap.appendChild(actions);

    const progressCard = el("div", "card progress-summary");
    progressCard.innerHTML = `
      <div class="progress-summary-head">
        <span>Progres Belajarmu</span>
        <span>${Progress.progressPercent()}%</span>
      </div>
      <div class="progress-track"><div class="progress-fill" style="width:${Progress.progressPercent()}%"></div></div>
      <div class="progress-stats">
        <div><strong>${Progress.data.xp}</strong><span>XP</span></div>
        <div><strong>Lv.${Progress.getLevel().index}</strong><span>${Progress.getLevel().current.nama}</span></div>
        <div><strong>${Progress.data.badges.length}</strong><span>Badge</span></div>
        <div><strong>${Progress.data.streak}🔥</strong><span>Streak</span></div>
      </div>`;
    wrap.appendChild(progressCard);

    const todayMission = el("div", "card mission-teaser");
    const missionsLeft = this.getMissions().filter(m => !m.done).length;
    todayMission.innerHTML = `<h3>🎯 Misi Hari Ini</h3><p>${missionsLeft > 0 ? `Ada ${missionsLeft} misi menunggumu.` : "Semua misi hari ini sudah selesai. Mantap!"}</p>`;
    const missionBtn = el("button", "btn btn-secondary", "Lihat Misi");
    missionBtn.addEventListener("click", () => Router.go("misi"));
    todayMission.appendChild(missionBtn);
    wrap.appendChild(todayMission);

    return wrap;
  },

  firstUnfinishedSubbab() {
    const sub = Content.materi.subbab.find(s => !Progress.data.subbabSelesai[s.id]);
    return sub ? sub.id : Content.materi.subbab[0].id;
  },

  /* ---------------- PETA MATERI (learning path) ---------------- */
  materiList() {
    const wrap = el("div", "page page-materi-list");
    wrap.appendChild(el("h1", "page-title", "📚 Peta Materi"));
    wrap.appendChild(el("p", "page-desc", Content.materi.subjudul));

    const searchBox = el("input", "search-input");
    searchBox.type = "search";
    searchBox.placeholder = "🔍 Cari subbab...";
    searchBox.addEventListener("input", () => {
      const q = searchBox.value.toLowerCase();
      [...path.children].forEach((node, i) => {
        const sub = Content.materi.subbab[i];
        node.style.display = sub.judul.toLowerCase().includes(q) ? "" : "none";
      });
    });
    wrap.appendChild(searchBox);

    const path = el("div", "learning-path");
    Content.materi.subbab.forEach((sub, i) => {
      const done = !!Progress.data.subbabSelesai[sub.id];
      const activityDone = !!Progress.data.aktivitasSelesai[sub.id];
      const locked = false; // semua subbab bisa diakses bebas biar fleksibel
      const node = el("button", "path-node" + (done ? " path-done" : "") + (activityDone ? " path-activity-done" : ""));
      node.type = "button";
      node.innerHTML = `
        <span class="path-node-num">${done ? "✓" : i + 1}</span>
        <span class="path-node-body">
          <span class="path-node-title">${sub.judul}</span>
          <span class="path-node-meta">${done ? "Selesai dibaca" : "Belum dibaca"}${activityDone ? " · Praktik ✓" : ""}</span>
        </span>
        <span class="path-node-bookmark">${Progress.isBookmarked(sub.id) ? "🔖" : ""}</span>`;
      node.addEventListener("click", () => Router.go("subbab", { id: sub.id }));
      path.appendChild(node);
    });
    wrap.appendChild(path);
    return wrap;
  },

  /* ---------------- HALAMAN SUBBAB ---------------- */
  subbab(id) {
    const sub = Content.materi.subbab.find(s => s.id === id) || Content.materi.subbab[0];
    const idx = Content.materi.subbab.indexOf(sub);
    const wrap = el("div", "page page-subbab");

    // Breadcrumb + nav
    const top = el("div", "subbab-topbar");
    const backBtn = el("button", "icon-btn", "← Peta Materi");
    backBtn.addEventListener("click", () => Router.go("materi-list"));
    top.appendChild(backBtn);
    const bookmarkBtn = el("button", "icon-btn", Progress.isBookmarked(sub.id) ? "🔖 Ditandai" : "🔖 Tandai");
    bookmarkBtn.addEventListener("click", () => {
      Progress.toggleBookmark(sub.id);
      Router.go("subbab", { id: sub.id });
    });
    top.appendChild(bookmarkBtn);
    const ttsBtn = el("button", "icon-btn", "🔊 Bacakan");
    ttsBtn.addEventListener("click", () => {
      const text = sub.penjelasan.map(p => p.heading + ". " + p.text).join(" ");
      speak(sub.judul + ". " + text);
    });
    top.appendChild(ttsBtn);
    wrap.appendChild(top);

    wrap.appendChild(el("p", "subbab-eyebrow", `Subbab ${idx + 1} dari ${Content.materi.subbab.length}`));
    wrap.appendChild(el("h1", "page-title", sub.judul));
    wrap.appendChild(el("p", "page-desc", "🎯 " + sub.tujuan));

    if (sub.gambar || sub.video) {
      const media = el("div", "card subbab-media");
      if (sub.gambar) {
        const img = el("img", "subbab-image");
        img.src = sub.gambar; img.alt = sub.judul;
        media.appendChild(img);
      }
      if (sub.video) {
        const embedUrl = toYoutubeEmbed(sub.video);
        if (embedUrl) {
          const iframeWrap = el("div", "video-embed-wrap");
          iframeWrap.innerHTML = `<iframe src="${embedUrl}" title="Video materi" frameborder="0" allowfullscreen loading="lazy"></iframe>`;
          media.appendChild(iframeWrap);
        }
      }
      wrap.appendChild(media);
    }

    // COBA DULU
    if (sub.cobaDulu && !Progress.data.subbabSelesai[sub.id]) {
      const cd = el("div", "card coba-dulu-card");
      cd.innerHTML = `<h3>SEBELUM BELAJAR...</h3><p>${sub.cobaDulu.pertanyaan}</p>`;
      const optWrap = el("div", "activity-options");
      sub.cobaDulu.opsi.forEach((opt, i) => {
        const btn = el("button", "option-btn", opt);
        btn.addEventListener("click", () => {
          [...optWrap.children].forEach(c => c.disabled = true);
          btn.classList.add(i === sub.cobaDulu.jawabanBenar ? "opt-correct" : "opt-wrong");
          playSfx(i === sub.cobaDulu.jawabanBenar ? "correct" : "wrong");
        });
        optWrap.appendChild(btn);
      });
      cd.appendChild(optWrap);
      wrap.appendChild(cd);
    }

    // Materi dalam tab: Penjelasan | Contoh | Tahukah Kamu | Ringkasan
    const tabs = el("div", "tabs");
    const tabBar = el("div", "tab-bar");
    const tabContent = el("div", "tab-content");
    const tabDefs = [
      { key: "penjelasan", label: "📖 Penjelasan" },
      { key: "contoh", label: "📱 Contoh" },
      { key: "tahukah", label: "💡 Tahukah Kamu" },
      { key: "ringkasan", label: "📝 Ringkasan" }
    ];
    const renderTab = (key) => {
      tabContent.innerHTML = "";
      [...tabBar.children].forEach(b => b.classList.toggle("tab-active", b.dataset.key === key));
      if (key === "penjelasan") {
        const acc = el("div", "accordion");
        sub.penjelasan.forEach((p, i) => {
          const item = el("div", "accordion-item" + (i === 0 ? " accordion-open" : ""));
          const head = el("button", "accordion-head");
          head.innerHTML = `<span>${p.heading}</span><span class="accordion-arrow">▾</span>`;
          const body = el("div", "accordion-body");
          body.innerHTML = `<p>${p.text}</p>`;
          head.addEventListener("click", () => item.classList.toggle("accordion-open"));
          item.appendChild(head);
          item.appendChild(body);
          acc.appendChild(item);
        });
        tabContent.appendChild(acc);
      } else if (key === "contoh") {
        const c = el("div", "card contoh-card");
        c.innerHTML = `<h3>📱 Contoh dalam Kehidupan Sehari-hari</h3><p>${sub.contohSehariHari}</p>`;
        tabContent.appendChild(c);
      } else if (key === "tahukah") {
        const c = el("div", "card tahukah-card");
        c.innerHTML = `<h3>💡 Tahukah Kamu?</h3><p>${sub.tahukahKamu}</p>`;
        tabContent.appendChild(c);
      } else if (key === "ringkasan") {
        const c = el("div", "card ringkasan-card");
        c.innerHTML = `<h3>📝 Rangkuman Cepat</h3>`;
        const ul = el("ul");
        sub.ringkasan.forEach(pt => ul.appendChild(el("li", null, pt)));
        c.appendChild(ul);
        const q = el("div", "paham-check");
        q.innerHTML = `<p>Sudah paham?</p>`;
        const yes = el("button", "btn btn-secondary", "😊 Sudah");
        const no = el("button", "btn btn-ghost", "🤔 Masih bingung");
        yes.addEventListener("click", () => { Progress.markSubbabRead(sub.id); renderTab("ringkasan"); });
        no.addEventListener("click", () => renderTab("penjelasan"));
        q.appendChild(yes); q.appendChild(no);
        c.appendChild(q);
        tabContent.appendChild(c);
      }
    };
    tabDefs.forEach((t, i) => {
      const b = el("button", "tab-btn", t.label);
      b.dataset.key = t.key;
      b.addEventListener("click", () => renderTab(t.key));
      tabBar.appendChild(b);
    });
    tabs.appendChild(tabBar);
    tabs.appendChild(tabContent);
    wrap.appendChild(tabs);
    renderTab("penjelasan");

    // Praktik singkat
    const practiceSection = el("div", "practice-section");
    practiceSection.appendChild(el("h3", "section-heading", "🎮 Praktik Singkat"));
    const activityHost = el("div", "activity-host");
    if (Progress.data.aktivitasSelesai[sub.id]) {
      activityHost.appendChild(el("div", "already-done", "Kamu sudah menyelesaikan praktik ini. Kerja bagus!"));
      const retryBtn = el("button", "btn btn-ghost", "🔄 Ulangi Aktivitas");
      retryBtn.addEventListener("click", () => {
        activityHost.innerHTML = "";
        activityHost.appendChild(Activities.render(sub.aktivitas, (correct) => Progress.markAktivitasSelesai(sub.id, correct)));
      });
      activityHost.appendChild(retryBtn);
    } else {
      activityHost.appendChild(Activities.render(sub.aktivitas, (correct) => Progress.markAktivitasSelesai(sub.id, correct)));
    }
    practiceSection.appendChild(activityHost);
    wrap.appendChild(practiceSection);

    // Cek Pemahaman (textarea)
    const understand = el("div", "card understand-card");
    understand.innerHTML = `<h3>🧠 Cek Pemahamanmu</h3><p>Kalau kamu menjelaskan materi ini ke temanmu, apa yang akan kamu katakan?</p>`;
    const ta = el("textarea", "note-textarea");
    ta.placeholder = "Tulis penjelasanmu di sini...";
    ta.value = Progress.data.catatan[sub.id] || "";
    ta.addEventListener("blur", () => Progress.saveCatatan(sub.id, ta.value));
    understand.appendChild(ta);
    wrap.appendChild(understand);

    // Navigasi antar subbab
    const nav = el("div", "subbab-nav");
    if (idx > 0) {
      const prev = el("button", "btn btn-ghost", "← " + Content.materi.subbab[idx - 1].judul);
      prev.addEventListener("click", () => Router.go("subbab", { id: Content.materi.subbab[idx - 1].id }));
      nav.appendChild(prev);
    } else nav.appendChild(el("span"));
    if (idx < Content.materi.subbab.length - 1) {
      const next = el("button", "btn btn-primary", Content.materi.subbab[idx + 1].judul + " →");
      next.addEventListener("click", () => Router.go("subbab", { id: Content.materi.subbab[idx + 1].id }));
      nav.appendChild(next);
    } else {
      const toQuiz = el("button", "btn btn-primary", "Lanjut ke Kuis →");
      toQuiz.addEventListener("click", () => Router.go("kuis"));
      nav.appendChild(toQuiz);
    }
    wrap.appendChild(nav);

    return wrap;
  },

  /* ---------------- MISI HARIAN ---------------- */
  getMissions() {
    const anySubRead = Object.keys(Progress.data.subbabSelesai).length > 0;
    const anyActivity = Object.keys(Progress.data.aktivitasSelesai).length > 0;
    const quizDone = !!Progress.data.quizSkor;
    const scoreOk = Progress.data.quizSkor && (Progress.data.quizSkor.benar / Progress.data.quizSkor.total) * 100 >= 80;
    return [
      { label: "📖 Baca minimal 1 subbab", xp: 10, done: anySubRead, action: () => Router.go("materi-list") },
      { label: "🧠 Selesaikan 1 praktik", xp: 20, done: anyActivity, action: () => Router.go("materi-list") },
      { label: "🎯 Kerjakan kuis", xp: 30, done: quizDone, action: () => Router.go("kuis") },
      { label: "🏆 Dapatkan skor kuis ≥ 80%", xp: 50, done: !!scoreOk, action: () => Router.go("kuis") }
    ];
  },

  misi() {
    const wrap = el("div", "page page-misi");
    wrap.appendChild(el("h1", "page-title", "🎯 Misi Hari Ini"));
    const missions = this.getMissions();
    const list = el("div", "mission-list");
    missions.forEach((m, i) => {
      const card = el("div", "mission-card" + (m.done ? " mission-done" : ""));
      card.innerHTML = `<div class="mission-num">Misi ${i + 1}</div>
        <div class="mission-label">${m.label}</div>
        <div class="mission-xp">${m.done ? "✓ Selesai" : `+${m.xp} XP`}</div>`;
      if (!m.done) {
        card.style.cursor = "pointer";
        card.addEventListener("click", m.action);
      }
      list.appendChild(card);
    });
    wrap.appendChild(list);
    const allDone = missions.every(m => m.done);
    if (allDone) {
      const done = el("div", "card mission-complete");
      done.innerHTML = `<h2>🎉 MISI SELESAI!</h2><p>Kamu menyelesaikan semua misi hari ini. Sampai jumpa di misi berikutnya!</p>`;
      wrap.appendChild(done);
    }
    return wrap;
  },

  /* ---------------- KUIS ---------------- */
  kuis() {
    const wrap = el("div", "page page-kuis");
    wrap.appendChild(el("h1", "page-title", "🧠 Kuis Interaktif"));
    const quiz = Content.quiz;
    let current = 0;
    let benar = 0;
    const timerState = { seconds: 0, interval: null };

    const progressLine = el("div", "quiz-progress");
    const timerLine = el("div", "quiz-timer");
    const host = el("div", "quiz-host");
    wrap.appendChild(progressLine);
    wrap.appendChild(timerLine);
    wrap.appendChild(host);

    timerState.interval = setInterval(() => {
      timerState.seconds++;
      const m = String(Math.floor(timerState.seconds / 60)).padStart(2, "0");
      const s = String(timerState.seconds % 60).padStart(2, "0");
      timerLine.textContent = `⏱️ ${m}:${s}`;
    }, 1000);

    const renderQuestion = () => {
      host.innerHTML = "";
      if (current >= quiz.length) {
        clearInterval(timerState.interval);
        return renderResult();
      }
      const q = quiz[current];
      progressLine.textContent = `SOAL ${current + 1}/${quiz.length}`;
      const card = el("div", "card quiz-card");
      card.appendChild(el("h3", "quiz-question", q.soal));
      const optWrap = el("div", "activity-options");
      let answered = false;

      const finishQuestion = (correct) => {
        if (correct) benar++;
        const fb = el("div", "feedback-box " + (correct ? "feedback-correct" : "feedback-wrong"));
        fb.innerHTML = `<div class="feedback-title">${correct ? "✓ JAWABAN BENAR!" : "✗ JAWABAN KURANG TEPAT"}</div><p>${q.pembahasan}</p>`;
        card.appendChild(fb);
        const nextBtn = el("button", "btn btn-primary", current === quiz.length - 1 ? "Lihat Hasil" : "Soal Berikutnya →");
        nextBtn.addEventListener("click", () => { current++; renderQuestion(); });
        card.appendChild(nextBtn);
        playSfx(correct ? "correct" : "wrong");
      };

      if (q.tipe === "benarSalah") {
        [["Benar", true], ["Salah", false]].forEach(([label, val]) => {
          const btn = el("button", "option-btn", label);
          btn.addEventListener("click", () => {
            if (answered) return; answered = true;
            [...optWrap.children].forEach(c => c.disabled = true);
            const correct = val === q.jawabanBenar;
            btn.classList.add(correct ? "opt-correct" : "opt-wrong");
            finishQuestion(correct);
          });
          optWrap.appendChild(btn);
        });
      } else {
        q.opsi.forEach((opt, i) => {
          const btn = el("button", "option-btn", opt);
          btn.addEventListener("click", () => {
            if (answered) return; answered = true;
            [...optWrap.children].forEach((c, ci) => {
              c.disabled = true;
              if (ci === q.jawabanBenar) c.classList.add("opt-correct");
              if (ci === i && i !== q.jawabanBenar) c.classList.add("opt-wrong");
            });
            finishQuestion(i === q.jawabanBenar);
          });
          optWrap.appendChild(btn);
        });
      }
      card.appendChild(optWrap);
      host.appendChild(card);
    };

    const renderResult = () => {
      host.innerHTML = "";
      progressLine.textContent = "";
      Progress.saveQuizResult(benar, quiz.length);
      const pct = Math.round((benar / quiz.length) * 100);
      const card = el("div", "card quiz-result");
      card.innerHTML = `<h2>${pct >= 80 ? "🏆 Hasil Memuaskan!" : "📊 Hasil Kuis"}</h2>
        <p class="quiz-score">${benar} / ${quiz.length} benar (${pct}%)</p>`;
      const retry = el("button", "btn btn-secondary", "🔄 Ulangi Kuis");
      retry.addEventListener("click", () => Router.go("kuis"));
      const home = el("button", "btn btn-primary", "Ke Beranda");
      home.addEventListener("click", () => Router.go("beranda"));
      card.appendChild(retry); card.appendChild(home);
      host.appendChild(card);
      if (pct >= 80) fireConfetti();
    };

    renderQuestion();
    return wrap;
  },

  /* ---------------- PRESTASI / PROGRESS ---------------- */
  prestasi() {
    const wrap = el("div", "page page-prestasi");
    wrap.appendChild(el("h1", "page-title", "🏆 Prestasi & Progress"));

    const lvl = Progress.getLevel();
    const summary = el("div", "card prestasi-summary");
    summary.innerHTML = `
      <div class="prestasi-level">${lvl.current.ikon} Level ${lvl.index} — ${lvl.current.nama}</div>
      <div class="progress-track"><div class="progress-fill" style="width:${Progress.progressPercent()}%"></div></div>
      <div class="progress-stats">
        <div><strong>${Progress.data.xp}</strong><span>Total XP</span></div>
        <div><strong>${Progress.subbabSelesaiCount()}/${Progress.totalSubbab()}</strong><span>Subbab Selesai</span></div>
        <div><strong>${Object.keys(Progress.data.aktivitasSelesai).length}</strong><span>Praktik Selesai</span></div>
        <div><strong>${Progress.data.streak}🔥</strong><span>Hari Beruntun</span></div>
      </div>`;
    wrap.appendChild(summary);

    if (Progress.data.quizSkor) {
      const q = Progress.data.quizSkor;
      const qc = el("div", "card");
      qc.innerHTML = `<h3>Rekap Nilai Kuis</h3><p>${q.benar} / ${q.total} benar (${Math.round((q.benar / q.total) * 100)}%)</p>`;
      wrap.appendChild(qc);
    }

    wrap.appendChild(el("h3", "section-heading", "🎖️ Koleksi Badge"));
    const badgeGrid = el("div", "badge-grid");
    Object.entries(BADGE_INFO).forEach(([id, b]) => {
      const earned = Progress.data.badges.includes(id);
      const card = el("div", "badge-card" + (earned ? "" : " badge-locked"));
      card.innerHTML = `<div class="badge-card-icon">${earned ? b.ikon : "🔒"}</div><div class="badge-card-name">${b.nama}</div><div class="badge-card-desc">${b.desc}</div>`;
      badgeGrid.appendChild(card);
    });
    wrap.appendChild(badgeGrid);

    if (Progress.data.bookmark.length) {
      wrap.appendChild(el("h3", "section-heading", "🔖 Subbab Ditandai"));
      const list = el("div", "learning-path");
      Progress.data.bookmark.forEach(id => {
        const sub = Content.materi.subbab.find(s => s.id === id);
        if (!sub) return;
        const node = el("button", "path-node");
        node.innerHTML = `<span class="path-node-num">🔖</span><span class="path-node-body"><span class="path-node-title">${sub.judul}</span></span>`;
        node.addEventListener("click", () => Router.go("subbab", { id }));
        list.appendChild(node);
      });
      wrap.appendChild(list);
    }

    // Refleksi
    wrap.appendChild(el("h3", "section-heading", "🪞 Refleksi Pembelajaran"));
    const refCard = el("div", "card");
    const questions = [
      "Apa hal baru yang kamu pelajari?",
      "Bagian mana yang paling kamu pahami?",
      "Bagian mana yang masih membingungkan?",
      "Apa contoh penerapan materi ini dalam kehidupan sehari-hari?"
    ];
    const refValues = Progress.data.refleksi || {};
    const textareas = [];
    questions.forEach((q, i) => {
      refCard.appendChild(el("p", "reflection-q", q));
      const ta = el("textarea", "note-textarea");
      ta.value = refValues[i] || "";
      textareas.push(ta);
      refCard.appendChild(ta);
    });
    const saveRef = el("button", "btn btn-primary", "Simpan Refleksi");
    saveRef.addEventListener("click", () => {
      const obj = {};
      textareas.forEach((ta, i) => obj[i] = ta.value);
      Progress.saveRefleksi(obj);
      alertInline(refCard, "Refleksi tersimpan. Terima kasih!");
    });
    refCard.appendChild(saveRef);
    wrap.appendChild(refCard);

    return wrap;
  },

  /* ---------------- BOSS CHALLENGE ---------------- */
  boss() {
    const wrap = el("div", "page page-boss");
    const boss = Content.boss;
    wrap.appendChild(el("h1", "page-title", "👑 " + boss.judul));

    if (Progress.data.bossSelesai) {
      const done = el("div", "card boss-done-card");
      done.innerHTML = `<h2>🏆 SELAMAT! KAMU BERHASIL MENYELESAIKAN BOSS CHALLENGE!</h2><p>Kamu boleh mengulang tantangan ini kapan saja untuk berlatih lagi.</p>`;
      const retry = el("button", "btn btn-primary", "🔄 Ulangi Tantangan");
      retry.addEventListener("click", () => { Progress.data.bossSelesai = false; Progress.save(); Router.go("boss"); });
      done.appendChild(retry);
      wrap.appendChild(done);
      return wrap;
    }

    const scenario = el("div", "card boss-scenario-card");
    scenario.innerHTML = `<h3>Skenario</h3><p>${boss.skenario}</p>`;
    wrap.appendChild(scenario);

    let step = 0;
    let correctCount = 0;
    const host = el("div", "boss-host");
    wrap.appendChild(host);

    const renderStep = () => {
      host.innerHTML = "";
      if (step >= boss.langkah.length) {
        Progress.markBossSelesai();
        Router.go("boss");
        return;
      }
      const s = boss.langkah[step];
      const card = el("div", "card quiz-card");
      card.appendChild(el("div", "mission-num", `Langkah ${step + 1} dari ${boss.langkah.length}`));
      card.appendChild(el("h3", "quiz-question", s.pertanyaan));
      const optWrap = el("div", "activity-options");
      let answered = false;
      s.opsi.forEach((opt, i) => {
        const btn = el("button", "option-btn", opt);
        btn.addEventListener("click", () => {
          if (answered) return; answered = true;
          const correct = i === s.jawabanBenar;
          if (correct) correctCount++;
          [...optWrap.children].forEach((c, ci) => {
            c.disabled = true;
            if (ci === s.jawabanBenar) c.classList.add("opt-correct");
            if (ci === i && !correct) c.classList.add("opt-wrong");
          });
          const fb = el("div", "feedback-box " + (correct ? "feedback-correct" : "feedback-wrong"));
          fb.innerHTML = `<p>${s.feedback}</p>`;
          card.appendChild(fb);
          playSfx(correct ? "correct" : "wrong");
          const nextBtn = el("button", "btn btn-primary", step === boss.langkah.length - 1 ? "Selesaikan Tantangan" : "Lanjut →");
          nextBtn.addEventListener("click", () => { step++; renderStep(); });
          card.appendChild(nextBtn);
        });
        optWrap.appendChild(btn);
      });
      card.appendChild(optWrap);
      host.appendChild(card);
    };
    renderStep();
    return wrap;
  },

  /* ---------------- GLOSARIUM ---------------- */
  glosarium() {
    const wrap = el("div", "page page-glosarium");
    wrap.appendChild(el("h1", "page-title", "📚 Glosarium"));
    const searchBox = el("input", "search-input");
    searchBox.type = "search";
    searchBox.placeholder = "🔍 Cari istilah...";
    wrap.appendChild(searchBox);
    const list = el("div", "glossary-list");
    const renderList = (q = "") => {
      list.innerHTML = "";
      Content.glossary.filter(g => g.istilah.toLowerCase().includes(q.toLowerCase())).forEach(g => {
        const item = el("div", "glossary-item");
        item.innerHTML = `<strong>${g.istilah}</strong><p>${g.arti}</p>`;
        list.appendChild(item);
      });
    };
    searchBox.addEventListener("input", () => renderList(searchBox.value));
    renderList();
    wrap.appendChild(list);
    return wrap;
  }
};
