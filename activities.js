/* ============================================================
   AKTIVITAS / PRAKTIK SINGKAT
   Semua fungsi di sini mengembalikan sebuah elemen DOM yang siap
   ditempel ke halaman. Interaksi memakai klik/tap supaya sama
   enaknya dipakai di laptop, tablet, HP, maupun layar sentuh kelas.
   ============================================================ */

const Activities = {
  render(activity, onComplete) {
    switch (activity.type) {
      case "pilihanGanda": return this.pilihanGanda(activity, onComplete);
      case "benarSalah": return this.benarSalah(activity, onComplete);
      case "urutkan": return this.urutkan(activity, onComplete);
      case "cocokkan": return this.cocokkan(activity, onComplete);
      case "kategorikan": return this.kategorikan(activity, onComplete);
      default: {
        const d = el("div", "activity-empty", "Jenis aktivitas belum dikenali.");
        return d;
      }
    }
  },

  feedbackBlock(correct, textCorrect, textWrong) {
    const box = el("div", "feedback-box " + (correct ? "feedback-correct" : "feedback-wrong"));
    box.innerHTML = `<div class="feedback-title">${correct ? "BENAR! 🎉" : "Belum tepat 🤔"}</div>
      <p>${correct ? textCorrect : textWrong}</p>`;
    return box;
  },

  pilihanGanda(a, onComplete) {
    const wrap = el("div", "activity pg");
    wrap.appendChild(el("h4", "activity-title", a.judul || "Pilih Jawaban"));

    // Tabel studi kasus (opsional) — ditampilkan sekali di atas, dipakai bersama semua soal
    if (a.tabel && Array.isArray(a.tabel.baris) && a.tabel.baris.length) {
      wrap.appendChild(this.renderTabel(a.tabel));
    }

    // Soal utama + soal tambahan (opsional) digabung jadi satu daftar soal berurutan
    const soalList = [{
      pertanyaan: a.pertanyaan,
      opsi: a.opsi,
      jawabanBenar: a.jawabanBenar,
      penjelasanBenar: a.penjelasanBenar,
      penjelasanSalah: a.penjelasanSalah
    }].concat(Array.isArray(a.soalTambahan) ? a.soalTambahan : []);

    const soalHost = el("div", "pg-soal-host");
    wrap.appendChild(soalHost);

    let soalIdx = 0;
    let semuaBenar = true;

    const renderSoal = () => {
      soalHost.innerHTML = "";
      const soal = soalList[soalIdx];
      const soalWrap = el("div", "activity-soal");
      if (soalList.length > 1) {
        soalWrap.appendChild(el("p", "activity-soal-num", `Soal ${soalIdx + 1} dari ${soalList.length}`));
      }
      if (soal.pertanyaan) soalWrap.appendChild(el("p", "activity-question", soal.pertanyaan));
      const optWrap = el("div", "activity-options");
      let answered = false;
      soal.opsi.forEach((opt, i) => {
        const btn = el("button", "option-btn", opt);
        btn.type = "button";
        btn.addEventListener("click", () => {
          if (answered) return;
          answered = true;
          const correct = i === soal.jawabanBenar;
          if (!correct) semuaBenar = false;
          [...optWrap.children].forEach((c, ci) => {
            c.disabled = true;
            if (ci === soal.jawabanBenar) c.classList.add("opt-correct");
            if (ci === i && !correct) c.classList.add("opt-wrong");
          });
          soalWrap.appendChild(this.feedbackBlock(correct, soal.penjelasanBenar, soal.penjelasanSalah));
          playSfx(correct ? "correct" : "wrong");

          if (soalIdx < soalList.length - 1) {
            const nextBtn = el("button", "btn btn-primary", "Lanjut ke Soal Berikutnya →");
            nextBtn.type = "button";
            nextBtn.addEventListener("click", () => { soalIdx++; renderSoal(); });
            soalWrap.appendChild(nextBtn);
          } else {
            onComplete(semuaBenar);
          }
        });
        optWrap.appendChild(btn);
      });
      soalWrap.appendChild(optWrap);
      soalHost.appendChild(soalWrap);
    };
    renderSoal();
    return wrap;
  },

  renderTabel(tabel) {
    const box = el("div", "activity-tabel-wrap");
    const table = document.createElement("table");
    table.className = "activity-tabel";
    if (Array.isArray(tabel.header) && tabel.header.length) {
      const thead = document.createElement("thead");
      const tr = document.createElement("tr");
      tabel.header.forEach((h) => {
        const th = document.createElement("th");
        th.textContent = h;
        tr.appendChild(th);
      });
      thead.appendChild(tr);
      table.appendChild(thead);
    }
    const tbody = document.createElement("tbody");
    tabel.baris.forEach((row) => {
      const tr = document.createElement("tr");
      row.forEach((cell) => {
        const td = document.createElement("td");
        td.textContent = cell;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    box.appendChild(table);
    return box;
  },

  benarSalah(a, onComplete) {
    const wrap = el("div", "activity bs");
    wrap.appendChild(el("h4", "activity-title", a.judul || "Benar atau Salah?"));
    wrap.appendChild(el("p", "activity-question", a.pernyataan));
    const optWrap = el("div", "activity-options two-col");
    let answered = false;
    [["Benar", true], ["Salah", false]].forEach(([label, val]) => {
      const btn = el("button", "option-btn", label);
      btn.type = "button";
      btn.addEventListener("click", () => {
        if (answered) return;
        answered = true;
        const correct = val === a.jawabanBenar;
        [...optWrap.children].forEach((c) => (c.disabled = true));
        btn.classList.add(correct ? "opt-correct" : "opt-wrong");
        wrap.appendChild(this.feedbackBlock(correct, a.penjelasanBenar, a.penjelasanSalah));
        playSfx(correct ? "correct" : "wrong");
        onComplete(correct);
      });
      optWrap.appendChild(btn);
    });
    wrap.appendChild(optWrap);
    return wrap;
  },

  urutkan(a, onComplete) {
    const wrap = el("div", "activity urutkan");
    wrap.appendChild(el("h4", "activity-title", a.judul || "Susun Urutan"));
    if (a.instruksi) wrap.appendChild(el("p", "activity-question", a.instruksi));

    let order = a.item.map((_, i) => i);
    // shuffle deterministically-ish but not equal to answer
    order = shuffleArray(order);

    const list = el("ol", "sortable-list");
    const renderList = () => {
      list.innerHTML = "";
      order.forEach((itemIdx, pos) => {
        const li = el("li", "sortable-item");
        li.innerHTML = `<span class="sortable-text">${a.item[itemIdx]}</span>`;
        const controls = el("div", "sortable-controls");
        const up = el("button", "sort-btn", "▲");
        up.type = "button";
        up.disabled = pos === 0;
        up.addEventListener("click", () => {
          [order[pos - 1], order[pos]] = [order[pos], order[pos - 1]];
          renderList();
        });
        const down = el("button", "sort-btn", "▼");
        down.type = "button";
        down.disabled = pos === order.length - 1;
        down.addEventListener("click", () => {
          [order[pos + 1], order[pos]] = [order[pos], order[pos + 1]];
          renderList();
        });
        controls.appendChild(up);
        controls.appendChild(down);
        li.appendChild(controls);
        list.appendChild(li);
      });
    };
    renderList();
    wrap.appendChild(list);

    const checkBtn = el("button", "btn btn-primary", "Periksa Urutan");
    checkBtn.type = "button";
    checkBtn.addEventListener("click", () => {
      const correct = order.every((v, i) => v === a.urutanBenar[i]);
      checkBtn.disabled = true;
      [...list.querySelectorAll(".sort-btn")].forEach((b) => (b.disabled = true));
      list.classList.add(correct ? "list-correct" : "list-wrong");
      wrap.appendChild(this.feedbackBlock(correct, a.penjelasanBenar, a.penjelasanSalah));
      playSfx(correct ? "correct" : "wrong");
      onComplete(correct);
    });
    wrap.appendChild(checkBtn);
    return wrap;
  },

  cocokkan(a, onComplete) {
    const wrap = el("div", "activity cocokkan");
    wrap.appendChild(el("h4", "activity-title", a.judul || "Cocokkan Pasangan"));
    const board = el("div", "match-board");
    const leftCol = el("div", "match-col");
    const rightCol = el("div", "match-col");

    const rightShuffled = shuffleArray(a.pasangan.map((p, i) => i));
    let selectedLeft = null;
    let matched = new Set();
    let wrongCount = 0;

    const leftBtns = [];
    const rightBtns = [];

    a.pasangan.forEach((p, i) => {
      const btn = el("button", "match-item", p.kiri);
      btn.type = "button";
      btn.dataset.idx = i;
      btn.addEventListener("click", () => {
        if (matched.has(i)) return;
        leftBtns.forEach((b) => b.classList.remove("match-selected"));
        selectedLeft = i;
        btn.classList.add("match-selected");
      });
      leftBtns.push(btn);
      leftCol.appendChild(btn);
    });

    rightShuffled.forEach((i) => {
      const p = a.pasangan[i];
      const btn = el("button", "match-item", p.kanan);
      btn.type = "button";
      btn.dataset.idx = i;
      btn.addEventListener("click", () => {
        if (matched.has(i) || selectedLeft === null) return;
        if (selectedLeft === i) {
          matched.add(i);
          btn.classList.add("match-correct");
          leftBtns[i].classList.add("match-correct");
          leftBtns[i].classList.remove("match-selected");
          btn.disabled = true;
          leftBtns[i].disabled = true;
          selectedLeft = null;
          if (matched.size === a.pasangan.length) {
            const correct = wrongCount === 0;
            wrap.appendChild(Activities.feedbackBlock(correct || matched.size === a.pasangan.length, a.penjelasanBenar, a.penjelasanSalah));
            playSfx("correct");
            onComplete(true);
          }
        } else {
          wrongCount++;
          btn.classList.add("match-shake");
          leftBtns[selectedLeft].classList.add("match-shake");
          playSfx("wrong");
          setTimeout(() => {
            btn.classList.remove("match-shake");
            leftBtns[selectedLeft] && leftBtns[selectedLeft].classList.remove("match-shake", "match-selected");
            selectedLeft = null;
          }, 500);
        }
      });
      rightBtns.push(btn);
      rightCol.appendChild(btn);
    });

    board.appendChild(leftCol);
    board.appendChild(rightCol);
    wrap.appendChild(board);
    wrap.appendChild(el("p", "hint-text", "Tap satu istilah di kiri, lalu tap pasangannya di kanan."));
    return wrap;
  },

  kategorikan(a, onComplete) {
    const wrap = el("div", "activity kategorikan");
    wrap.appendChild(el("h4", "activity-title", a.judul || "Kategorikan"));
    if (a.instruksi) wrap.appendChild(el("p", "activity-question", a.instruksi));

    const pool = el("div", "chip-pool");
    const zones = el("div", "drop-zones");
    let selectedChip = null;
    const placed = {};

    const items = shuffleArray(a.item.map((it, i) => i));
    const chips = {};

    items.forEach((i) => {
      const it = a.item[i];
      const chip = el("button", "chip", it.teks);
      chip.type = "button";
      chip.addEventListener("click", () => {
        if (chip.disabled) return;
        [...pool.querySelectorAll(".chip")].forEach((c) => c.classList.remove("chip-selected"));
        selectedChip = i;
        chip.classList.add("chip-selected");
      });
      chips[i] = chip;
      pool.appendChild(chip);
    });

    a.kategori.forEach((kat) => {
      const zone = el("div", "drop-zone");
      zone.appendChild(el("div", "drop-zone-title", kat));
      const list = el("div", "drop-zone-list");
      zone.appendChild(list);
      zone.addEventListener("click", () => {
        if (selectedChip === null) return;
        const i = selectedChip;
        const chip = chips[i];
        list.appendChild(chip);
        chip.classList.remove("chip-selected");
        chip.disabled = false;
        placed[i] = kat;
        selectedChip = null;
      });
      zones.appendChild(zone);
    });

    wrap.appendChild(pool);
    wrap.appendChild(zones);
    wrap.appendChild(el("p", "hint-text", "Tap satu pernyataan, lalu tap kotak kategori tujuannya."));

    const checkBtn = el("button", "btn btn-primary", "Periksa Jawaban");
    checkBtn.type = "button";
    checkBtn.addEventListener("click", () => {
      let allCorrect = true;
      let allPlaced = Object.keys(placed).length === a.item.length;
      if (!allPlaced) {
        alertInline(wrap, "Masih ada pernyataan yang belum dimasukkan ke kotak.");
        return;
      }
      a.item.forEach((it, i) => {
        const chip = chips[i];
        const correct = placed[i] === it.kategori;
        chip.classList.add(correct ? "chip-correct" : "chip-wrong");
        if (!correct) allCorrect = false;
      });
      checkBtn.disabled = true;
      wrap.appendChild(Activities.feedbackBlock(allCorrect, a.penjelasanBenar, a.penjelasanSalah));
      playSfx(allCorrect ? "correct" : "wrong");
      onComplete(allCorrect);
    });
    wrap.appendChild(checkBtn);
    return wrap;
  }
};

function alertInline(container, msg) {
  const existing = container.querySelector(".inline-alert");
  if (existing) existing.remove();
  const box = el("div", "inline-alert", msg);
  container.appendChild(box);
  setTimeout(() => box.remove(), 2500);
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  // avoid identity order for short arrays when possible
  if (a.length > 1 && a.every((v, i) => v === arr[i])) {
    [a[0], a[1]] = [a[1], a[0]];
  }
  return a;
}
