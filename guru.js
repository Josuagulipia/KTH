/* ============================================================
   MODE GURU — tempat memasukkan & mengedit materi
   Semua perubahan langsung tersimpan ke localStorage (Content.save*)
   sehingga tidak perlu mengubah kode/file JavaScript apa pun.
   ============================================================ */

/* Helper: field berlabel sederhana */
function field(labelText, inputEl) {
  const wrap = el("div", "field");
  wrap.appendChild(el("label", "field-label", labelText));
  wrap.appendChild(inputEl);
  return wrap;
}

function textInput(value, placeholder) {
  const i = el("input", "text-input");
  i.type = "text";
  i.value = value || "";
  if (placeholder) i.placeholder = placeholder;
  return i;
}

function textArea(value, rows) {
  const t = el("textarea", "textarea-input");
  t.value = value || "";
  t.rows = rows || 3;
  return t;
}

/* Editor daftar dinamis (tambah/hapus baris), item diikat langsung by reference */
function repeatableEditor(items, renderRow, newItemFactory, addLabel) {
  const container = el("div", "repeatable");
  const list = el("div", "repeatable-list");
  const renderAll = () => {
    list.innerHTML = "";
    items.forEach((item, idx) => {
      const row = el("div", "repeatable-row");
      renderRow(row, item, idx);
      const delBtn = el("button", "repeatable-del", "✕");
      delBtn.type = "button";
      delBtn.title = "Hapus";
      delBtn.addEventListener("click", () => { items.splice(idx, 1); renderAll(); });
      row.appendChild(delBtn);
      list.appendChild(row);
    });
  };
  renderAll();
  container.appendChild(list);
  const addBtn = el("button", "btn btn-ghost btn-add", "+ " + addLabel);
  addBtn.type = "button";
  addBtn.addEventListener("click", () => { items.push(newItemFactory()); renderAll(); });
  container.appendChild(addBtn);
  return container;
}

function toastSaved(container, msg) {
  alertInline(container, msg || "✓ Tersimpan!");
}

function slugify(text) {
  return "sub_" + text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 24) + "_" + Date.now().toString(36).slice(-4);
}

const Guru = {
  menuBar() {
    const bar = el("div", "guru-menu");
    const items = [
      ["📊 Dashboard", "guru"],
      ["📘 Materi & Subbab", "guru-materi"],
      ["🧠 Kuis", "guru-kuis"],
      ["👑 Boss Challenge", "guru-boss"],
      ["⚙️ Pengaturan Data", "guru-pengaturan"],
      ["👁️ Preview Siswa", "beranda"]
    ];
    items.forEach(([label, view]) => {
      const b = el("button", "guru-menu-btn", label);
      b.addEventListener("click", () => Router.go(view));
      bar.appendChild(b);
    });
    return bar;
  },

  dashboard() {
    const wrap = el("div", "page page-guru");
    wrap.appendChild(el("h1", "page-title", "🧑‍🏫 Mode Guru"));
    wrap.appendChild(this.menuBar());
    const stats = el("div", "card guru-stats");
    stats.innerHTML = `
      <div class="progress-stats">
        <div><strong>${Content.materi.subbab.length}</strong><span>Subbab</span></div>
        <div><strong>${Content.quiz.length}</strong><span>Soal Kuis</span></div>
        <div><strong>${Content.boss.langkah.length}</strong><span>Langkah Boss</span></div>
        <div><strong>${Content.glossary.length}</strong><span>Istilah Glosarium</span></div>
      </div>`;
    wrap.appendChild(stats);
    wrap.appendChild(el("p", "page-desc", "Semua perubahan yang kamu simpan di sini otomatis tersimpan di browser ini. Gunakan Ekspor/Impor JSON di halaman Pengaturan Data untuk mencadangkan atau memindahkan materi ke perangkat lain."));
    return wrap;
  },

  /* -------- MATERI & SUBBAB -------- */
  editMateri() {
    const wrap = el("div", "page page-guru");
    wrap.appendChild(el("h1", "page-title", "📘 Materi & Subbab"));
    wrap.appendChild(this.menuBar());

    const m = Content.materi;
    const form = el("div", "card guru-form");
    const judulInput = textInput(m.judul);
    const subjudulInput = textInput(m.subjudul);
    const mapelInput = textInput(m.mapel);
    const tujuanTextarea = textArea(m.tujuanPembelajaran.join("\n"), 4);
    form.appendChild(field("Judul Materi", judulInput));
    form.appendChild(field("Subjudul", subjudulInput));
    form.appendChild(field("Mata Pelajaran / Kelas", mapelInput));
    form.appendChild(field("Tujuan Pembelajaran (satu baris = satu tujuan)", tujuanTextarea));

    const saveBtn = el("button", "btn btn-primary", "💾 Simpan Materi");
    saveBtn.addEventListener("click", () => {
      m.judul = judulInput.value;
      m.subjudul = subjudulInput.value;
      m.mapel = mapelInput.value;
      m.tujuanPembelajaran = tujuanTextarea.value.split("\n").map(s => s.trim()).filter(Boolean);
      Content.saveMateri();
      toastSaved(form);
    });
    form.appendChild(saveBtn);
    wrap.appendChild(form);

    // Daftar subbab
    wrap.appendChild(el("h3", "section-heading", "Daftar Subbab"));
    const list = el("div", "guru-subbab-list");
    m.subbab.forEach((sub, i) => {
      const row = el("div", "guru-subbab-row");
      row.innerHTML = `<span class="guru-subbab-num">${i + 1}</span><span class="guru-subbab-title">${sub.judul}</span>`;
      const upBtn = el("button", "sort-btn", "▲"); upBtn.disabled = i === 0;
      upBtn.addEventListener("click", () => { [m.subbab[i - 1], m.subbab[i]] = [m.subbab[i], m.subbab[i - 1]]; Content.saveMateri(); Router.go("guru-materi"); });
      const downBtn = el("button", "sort-btn", "▼"); downBtn.disabled = i === m.subbab.length - 1;
      downBtn.addEventListener("click", () => { [m.subbab[i + 1], m.subbab[i]] = [m.subbab[i], m.subbab[i + 1]]; Content.saveMateri(); Router.go("guru-materi"); });
      const editBtn = el("button", "btn btn-secondary btn-sm", "✏️ Edit");
      editBtn.addEventListener("click", () => Router.go("guru-subbab", { id: sub.id }));
      const delBtn = el("button", "btn btn-ghost btn-sm", "🗑️ Hapus");
      delBtn.addEventListener("click", () => {
        if (confirm(`Hapus subbab "${sub.judul}"?`)) { m.subbab.splice(i, 1); Content.saveMateri(); Router.go("guru-materi"); }
      });
      row.appendChild(upBtn); row.appendChild(downBtn); row.appendChild(editBtn); row.appendChild(delBtn);
      list.appendChild(row);
    });
    wrap.appendChild(list);

    const addSubBtn = el("button", "btn btn-hero", "+ Tambah Subbab Baru");
    addSubBtn.addEventListener("click", () => Router.go("guru-subbab", { id: null }));
    wrap.appendChild(addSubBtn);

    return wrap;
  },

  editSubbab(id) {
    const wrap = el("div", "page page-guru");
    const isNew = !id;
    let sub = isNew ? null : Content.materi.subbab.find(s => s.id === id);
    if (!isNew && !sub) { Router.go("guru-materi"); return wrap; }
    if (isNew) {
      sub = {
        id: slugify("subbab-baru"),
        judul: "Subbab Baru", tujuan: "", penjelasan: [{ heading: "", text: "" }],
        contohSehariHari: "", tahukahKamu: "", ringkasan: [""], video: "", gambar: "",
        aktivitas: { type: "pilihanGanda", judul: "", pertanyaan: "", opsi: ["", ""], jawabanBenar: 0, penjelasanBenar: "", penjelasanSalah: "" }
      };
    }

    wrap.appendChild(el("h1", "page-title", (isNew ? "➕ Tambah Subbab" : "✏️ Edit Subbab")));
    wrap.appendChild(this.menuBar());

    const form = el("div", "card guru-form");

    const judulInput = textInput(sub.judul);
    const tujuanInput = textInput(sub.tujuan);
    form.appendChild(field("Judul Subbab", judulInput));
    form.appendChild(field("Tujuan Subbab", tujuanInput));

    // Video & Gambar
    const videoInput = textInput(sub.video || "", "https://youtube.com/watch?v=...");
    form.appendChild(field("Link Video YouTube (opsional)", videoInput));
    const imgWrap = el("div");
    const imgPreview = el("img", "guru-img-preview");
    if (sub.gambar) { imgPreview.src = sub.gambar; imgPreview.style.display = "block"; } else imgPreview.style.display = "none";
    const imgInput = el("input");
    imgInput.type = "file"; imgInput.accept = "image/*";
    let gambarData = sub.gambar || "";
    imgInput.addEventListener("change", () => {
      const f = imgInput.files[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = () => { gambarData = reader.result; imgPreview.src = gambarData; imgPreview.style.display = "block"; };
      reader.readAsDataURL(f);
    });
    const removeImgBtn = el("button", "btn btn-ghost btn-sm", "Hapus Gambar");
    removeImgBtn.type = "button";
    removeImgBtn.addEventListener("click", () => { gambarData = ""; imgPreview.style.display = "none"; imgInput.value = ""; });
    imgWrap.appendChild(imgInput); imgWrap.appendChild(imgPreview); imgWrap.appendChild(removeImgBtn);
    form.appendChild(field("Gambar Ilustrasi (opsional, upload dari perangkat)", imgWrap));

    // Penjelasan (repeatable heading+text)
    form.appendChild(el("label", "field-label", "Penjelasan Materi (bisa lebih dari satu bagian)"));
    const penjelasanEditor = repeatableEditor(
      sub.penjelasan, (row, item) => {
        const h = textInput(item.heading, "Judul bagian, mis. 'Contoh Sederhana'");
        h.addEventListener("input", () => item.heading = h.value);
        const t = textArea(item.text, 3);
        t.addEventListener("input", () => item.text = t.value);
        row.appendChild(field("Judul Bagian", h));
        row.appendChild(field("Isi Penjelasan", t));
      },
      () => ({ heading: "", text: "" }), "Tambah Bagian Penjelasan"
    );
    form.appendChild(penjelasanEditor);

    const contohTextarea = textArea(sub.contohSehariHari, 3);
    form.appendChild(field("📱 Contoh dalam Kehidupan Sehari-hari", contohTextarea));
    const tahukahTextarea = textArea(sub.tahukahKamu, 2);
    form.appendChild(field("💡 Tahukah Kamu? (fakta menarik)", tahukahTextarea));

    form.appendChild(el("label", "field-label", "📝 Ringkasan (poin-poin singkat)"));
    let ringkasanItems = sub.ringkasan.map(r => ({ text: r }));
    const ringkasanEditor2 = repeatableEditor(ringkasanItems, (row, item) => {
      const t = textInput(item.text);
      t.addEventListener("input", () => item.text = t.value);
      row.appendChild(t);
    }, () => ({ text: "" }), "Tambah Poin Ringkasan");
    form.appendChild(ringkasanEditor2);

    // Aktivitas
    form.appendChild(el("h3", "section-heading", "🎮 Aktivitas / Praktik"));
    const typeSelect = el("select", "text-input");
    [["pilihanGanda", "Pilihan Ganda"], ["benarSalah", "Benar / Salah"], ["urutkan", "Susun Urutan"], ["cocokkan", "Cocokkan Pasangan"], ["kategorikan", "Kategorikan (Drag & Drop)"]].forEach(([val, label]) => {
      const o = el("option", null, label); o.value = val;
      if (sub.aktivitas.type === val) o.selected = true;
      typeSelect.appendChild(o);
    });
    form.appendChild(field("Jenis Aktivitas", typeSelect));
    const activityHost = el("div", "guru-activity-editor");
    form.appendChild(activityHost);

    let activityDraft = JSON.parse(JSON.stringify(sub.aktivitas));
    const renderActivityEditor = () => {
      activityHost.innerHTML = "";
      if (activityDraft.type !== typeSelect.value) {
        activityDraft = this.blankActivity(typeSelect.value);
      }
      activityHost.appendChild(this.activityFields(activityDraft));
    };
    typeSelect.addEventListener("change", renderActivityEditor);
    renderActivityEditor();

    const saveBtn = el("button", "btn btn-primary", "💾 Simpan Subbab");
    saveBtn.addEventListener("click", () => {
      sub.judul = judulInput.value || "Subbab Tanpa Judul";
      sub.tujuan = tujuanInput.value;
      sub.video = videoInput.value.trim();
      sub.gambar = gambarData;
      sub.contohSehariHari = contohTextarea.value;
      sub.tahukahKamu = tahukahTextarea.value;
      sub.ringkasan = ringkasanItems.map(r => r.text).filter(t => t.trim());
      sub.aktivitas = activityDraft;
      if (isNew) Content.materi.subbab.push(sub);
      Content.saveMateri();
      toastSaved(form, "✓ Subbab tersimpan!");
      setTimeout(() => Router.go("guru-materi"), 700);
    });
    form.appendChild(saveBtn);

    const previewBtn = el("button", "btn btn-secondary", "👁️ Preview Sebagai Siswa");
    previewBtn.addEventListener("click", () => {
      sub.judul = judulInput.value; sub.tujuan = tujuanInput.value;
      sub.contohSehariHari = contohTextarea.value; sub.tahukahKamu = tahukahTextarea.value;
      sub.ringkasan = ringkasanItems.map(r => r.text).filter(Boolean);
      sub.aktivitas = activityDraft; sub.gambar = gambarData; sub.video = videoInput.value;
      if (isNew && !Content.materi.subbab.includes(sub)) Content.materi.subbab.push(sub);
      Router.go("subbab", { id: sub.id });
    });
    form.appendChild(previewBtn);

    wrap.appendChild(form);
    return wrap;
  },

  blankActivity(type) {
    switch (type) {
      case "pilihanGanda": return { type, judul: "", pertanyaan: "", opsi: ["", ""], jawabanBenar: 0, penjelasanBenar: "", penjelasanSalah: "" };
      case "benarSalah": return { type, judul: "", pernyataan: "", jawabanBenar: true, penjelasanBenar: "", penjelasanSalah: "" };
      case "urutkan": return { type, judul: "", instruksi: "", item: ["", ""], urutanBenar: [0, 1], penjelasanBenar: "", penjelasanSalah: "" };
      case "cocokkan": return { type, judul: "", pasangan: [{ kiri: "", kanan: "" }], penjelasanBenar: "", penjelasanSalah: "" };
      case "kategorikan": return { type, judul: "", instruksi: "", kategori: ["Kategori 1", "Kategori 2"], item: [{ teks: "", kategori: "Kategori 1" }], penjelasanBenar: "", penjelasanSalah: "" };
    }
  },

  activityFields(a) {
    const box = el("div");
    const judulInput = textInput(a.judul);
    judulInput.addEventListener("input", () => a.judul = judulInput.value);
    box.appendChild(field("Judul Aktivitas", judulInput));

    if (a.type === "pilihanGanda") {
      // Tabel studi kasus (opsional)
      if (!a.tabel) a.tabel = { header: [], baris: [] };
      box.appendChild(el("label", "field-label", "📊 Tabel Studi Kasus (opsional — kosongkan kalau tidak perlu tabel)"));
      const headerInput = textInput((a.tabel.header || []).join(", "), "Contoh: Nama Siswa, Makanan Favorit");
      headerInput.addEventListener("input", () => {
        a.tabel.header = headerInput.value.split(",").map(s => s.trim()).filter(Boolean);
      });
      box.appendChild(field("Judul Kolom Tabel (pisahkan dengan koma)", headerInput));

      let barisItems = (a.tabel.baris || []).map(r => ({ text: r.join(", ") }));
      const syncBaris = () => { a.tabel.baris = barisItems.map(x => x.text.split(",").map(s => s.trim()).filter(Boolean)); };
      syncBaris();
      box.appendChild(el("label", "field-label", "Isi Baris Tabel (satu baris tabel per kotak, pisahkan tiap sel dengan koma)"));
      const barisEditor = repeatableEditor(barisItems, (row, item) => {
        const t = textInput(item.text, "Contoh: Andi, Bakso");
        t.addEventListener("input", () => { item.text = t.value; syncBaris(); });
        row.appendChild(t);
      }, () => { const ni = { text: "" }; return ni; }, "Tambah Baris Tabel");
      box.appendChild(barisEditor);

      const q = textArea(a.pertanyaan, 2); q.addEventListener("input", () => a.pertanyaan = q.value);
      box.appendChild(field("Pertanyaan / Studi Kasus (Soal Utama)", q));
      box.appendChild(el("label", "field-label", "Pilihan Jawaban Soal Utama (klik radio untuk pilih jawaban benar)"));
      const optEditor = repeatableEditor(a.opsi.map((o, i) => ({ text: o, i })), (row, item, idx) => {
        const radio = el("input"); radio.type = "radio"; radio.name = "jbBenar"; radio.checked = a.jawabanBenar === idx;
        radio.addEventListener("change", () => a.jawabanBenar = idx);
        const t = textInput(item.text); t.addEventListener("input", () => a.opsi[idx] = t.value);
        row.appendChild(radio); row.appendChild(t);
      }, () => { a.opsi.push(""); return { text: "" }; }, "Tambah Pilihan");
      box.appendChild(optEditor);
      const pb = textArea(a.penjelasanBenar, 2); pb.addEventListener("input", () => a.penjelasanBenar = pb.value);
      const ps = textArea(a.penjelasanSalah, 2); ps.addEventListener("input", () => a.penjelasanSalah = ps.value);
      box.appendChild(field("Penjelasan jika BENAR", pb));
      box.appendChild(field("Penjelasan jika SALAH", ps));

      // Soal tambahan (opsional, memakai tabel yang sama)
      if (!Array.isArray(a.soalTambahan)) a.soalTambahan = [];
      box.appendChild(el("h4", "field-label", "➕ Soal Tambahan (opsional — siswa akan lanjut ke soal ini setelah soal utama, memakai tabel yang sama)"));
      const soalTambahanEditor = repeatableEditor(a.soalTambahan, (row, soal, outerIdx) => {
        if (!Array.isArray(soal.opsi)) soal.opsi = ["", ""];
        if (typeof soal.jawabanBenar !== "number") soal.jawabanBenar = 0;
        const sq = textArea(soal.pertanyaan, 2); sq.addEventListener("input", () => soal.pertanyaan = sq.value);
        row.appendChild(field("Pertanyaan Soal Tambahan", sq));
        const sOptEditor = repeatableEditor(soal.opsi.map(o => ({ text: o })), (r2, item2, idx2) => {
          const radio = el("input"); radio.type = "radio"; radio.name = "soalTambahan" + outerIdx; radio.checked = soal.jawabanBenar === idx2;
          radio.addEventListener("change", () => soal.jawabanBenar = idx2);
          const t = textInput(item2.text); t.addEventListener("input", () => soal.opsi[idx2] = t.value);
          r2.appendChild(radio); r2.appendChild(t);
        }, () => { soal.opsi.push(""); return { text: "" }; }, "Tambah Pilihan");
        row.appendChild(sOptEditor);
        const spb = textArea(soal.penjelasanBenar, 2); spb.addEventListener("input", () => soal.penjelasanBenar = spb.value);
        const sps = textArea(soal.penjelasanSalah, 2); sps.addEventListener("input", () => soal.penjelasanSalah = sps.value);
        row.appendChild(field("Penjelasan jika BENAR", spb));
        row.appendChild(field("Penjelasan jika SALAH", sps));
      }, () => ({ pertanyaan: "", opsi: ["", ""], jawabanBenar: 0, penjelasanBenar: "", penjelasanSalah: "" }), "Tambah Soal Tambahan");
      box.appendChild(soalTambahanEditor);
    }

    if (a.type === "benarSalah") {
      const p = textArea(a.pernyataan, 2); p.addEventListener("input", () => a.pernyataan = p.value);
      box.appendChild(field("Pernyataan", p));
      const sel = el("select", "text-input");
      [["true", "Benar"], ["false", "Salah"]].forEach(([v, l]) => {
        const o = el("option", null, l); o.value = v; o.selected = String(a.jawabanBenar) === v; sel.appendChild(o);
      });
      sel.addEventListener("change", () => a.jawabanBenar = sel.value === "true");
      box.appendChild(field("Jawaban yang Benar", sel));
      const pb = textArea(a.penjelasanBenar, 2); pb.addEventListener("input", () => a.penjelasanBenar = pb.value);
      const ps = textArea(a.penjelasanSalah, 2); ps.addEventListener("input", () => a.penjelasanSalah = ps.value);
      box.appendChild(field("Penjelasan jika BENAR", pb));
      box.appendChild(field("Penjelasan jika SALAH", ps));
    }

    if (a.type === "urutkan") {
      const instr = textInput(a.instruksi); instr.addEventListener("input", () => a.instruksi = instr.value);
      box.appendChild(field("Instruksi", instr));
      box.appendChild(el("label", "field-label", "Masukkan item SESUAI URUTAN YANG BENAR (dari atas ke bawah)"));
      const items = a.item.map(t => ({ text: t }));
      a.urutanBenar = items.map((_, i) => i);
      const editor = repeatableEditor(items, (row, item, idx) => {
        const t = textInput(item.text); t.addEventListener("input", () => { item.text = t.value; a.item = items.map(x => x.text); });
        row.appendChild(t);
      }, () => { const ni = { text: "" }; return ni; }, "Tambah Langkah");
      // sync on add/remove too
      const observer = new MutationObserver(() => { a.item = items.map(x => x.text); a.urutanBenar = items.map((_, i) => i); });
      observer.observe(editor, { childList: true, subtree: true });
      a.item = items.map(x => x.text);
      box.appendChild(editor);
      const pb = textArea(a.penjelasanBenar, 2); pb.addEventListener("input", () => a.penjelasanBenar = pb.value);
      const ps = textArea(a.penjelasanSalah, 2); ps.addEventListener("input", () => a.penjelasanSalah = ps.value);
      box.appendChild(field("Penjelasan jika BENAR", pb));
      box.appendChild(field("Penjelasan jika SALAH", ps));
    }

    if (a.type === "cocokkan") {
      box.appendChild(el("label", "field-label", "Pasangan Istilah ↔ Definisi"));
      const editor = repeatableEditor(a.pasangan, (row, item) => {
        const k = textInput(item.kiri, "Istilah"); k.addEventListener("input", () => item.kiri = k.value);
        const kn = textInput(item.kanan, "Definisi/pasangan"); kn.addEventListener("input", () => item.kanan = kn.value);
        row.appendChild(k); row.appendChild(kn);
      }, () => ({ kiri: "", kanan: "" }), "Tambah Pasangan");
      box.appendChild(editor);
      const pb = textArea(a.penjelasanBenar, 2); pb.addEventListener("input", () => a.penjelasanBenar = pb.value);
      const ps = textArea(a.penjelasanSalah, 2); ps.addEventListener("input", () => a.penjelasanSalah = ps.value);
      box.appendChild(field("Penjelasan jika BENAR SEMUA", pb));
      box.appendChild(field("Penjelasan jika ADA YANG SALAH", ps));
    }

    if (a.type === "kategorikan") {
      const instr = textInput(a.instruksi); instr.addEventListener("input", () => a.instruksi = instr.value);
      box.appendChild(field("Instruksi", instr));
      box.appendChild(el("label", "field-label", "Nama Kategori / Kotak"));
      const katEditor = repeatableEditor(a.kategori.map(k => ({ text: k })), (row, item, idx) => {
        const t = textInput(item.text); t.addEventListener("input", () => { item.text = t.value; a.kategori[idx] = t.value; });
        row.appendChild(t);
      }, () => { a.kategori.push("Kategori Baru"); return { text: "Kategori Baru" }; }, "Tambah Kategori");
      box.appendChild(katEditor);
      box.appendChild(el("label", "field-label", "Pernyataan & Kategori yang Tepat"));
      const itemEditor = repeatableEditor(a.item, (row, item) => {
        const t = textInput(item.teks, "Pernyataan"); t.addEventListener("input", () => item.teks = t.value);
        const sel = el("select", "text-input");
        a.kategori.forEach(k => { const o = el("option", null, k); o.value = k; o.selected = item.kategori === k; sel.appendChild(o); });
        sel.addEventListener("change", () => item.kategori = sel.value);
        row.appendChild(t); row.appendChild(sel);
      }, () => ({ teks: "", kategori: a.kategori[0] || "" }), "Tambah Pernyataan");
      box.appendChild(itemEditor);
      const pb = textArea(a.penjelasanBenar, 2); pb.addEventListener("input", () => a.penjelasanBenar = pb.value);
      const ps = textArea(a.penjelasanSalah, 2); ps.addEventListener("input", () => a.penjelasanSalah = ps.value);
      box.appendChild(field("Penjelasan jika BENAR SEMUA", pb));
      box.appendChild(field("Penjelasan jika ADA YANG SALAH", ps));
    }

    return box;
  },

  /* -------- KUIS -------- */
  editKuis() {
    const wrap = el("div", "page page-guru");
    wrap.appendChild(el("h1", "page-title", "🧠 Editor Kuis"));
    wrap.appendChild(this.menuBar());

    const list = el("div", "guru-quiz-list");
    const renderList = () => {
      list.innerHTML = "";
      Content.quiz.forEach((q, i) => {
        const card = el("div", "card guru-quiz-card");
        card.appendChild(el("div", "mission-num", `Soal ${i + 1} · ${q.tipe === "benarSalah" ? "Benar/Salah" : "Pilihan Ganda"}`));
        const soalInput = textArea(q.soal, 2);
        soalInput.addEventListener("input", () => q.soal = soalInput.value);
        card.appendChild(field("Soal", soalInput));

        if (q.tipe === "benarSalah") {
          const sel = el("select", "text-input");
          [["true", "Benar"], ["false", "Salah"]].forEach(([v, l]) => {
            const o = el("option", null, l); o.value = v; o.selected = String(q.jawabanBenar) === v; sel.appendChild(o);
          });
          sel.addEventListener("change", () => q.jawabanBenar = sel.value === "true");
          card.appendChild(field("Jawaban Benar", sel));
        } else {
          const optEditor = repeatableEditor(q.opsi.map((o, oi) => ({ text: o })), (row, item, oi) => {
            const radio = el("input"); radio.type = "radio"; radio.name = "quizAns" + i; radio.checked = q.jawabanBenar === oi;
            radio.addEventListener("change", () => q.jawabanBenar = oi);
            const t = textInput(item.text); t.addEventListener("input", () => q.opsi[oi] = t.value);
            row.appendChild(radio); row.appendChild(t);
          }, () => { q.opsi.push(""); return { text: "" }; }, "Tambah Opsi");
          card.appendChild(optEditor);
        }
        const pb = textArea(q.pembahasan, 2); pb.addEventListener("input", () => q.pembahasan = pb.value);
        card.appendChild(field("Pembahasan", pb));

        const delBtn = el("button", "btn btn-ghost btn-sm", "🗑️ Hapus Soal");
        delBtn.addEventListener("click", () => { Content.quiz.splice(i, 1); renderList(); });
        card.appendChild(delBtn);
        list.appendChild(card);
      });
    };
    renderList();
    wrap.appendChild(list);

    const addBar = el("div", "guru-add-bar");
    const addMC = el("button", "btn btn-ghost", "+ Tambah Soal Pilihan Ganda");
    addMC.addEventListener("click", () => { Content.quiz.push({ id: "q" + Date.now(), tipe: "pilihanGanda", soal: "", opsi: ["", ""], jawabanBenar: 0, pembahasan: "" }); renderList(); });
    const addBS = el("button", "btn btn-ghost", "+ Tambah Soal Benar/Salah");
    addBS.addEventListener("click", () => { Content.quiz.push({ id: "q" + Date.now(), tipe: "benarSalah", soal: "", jawabanBenar: true, pembahasan: "" }); renderList(); });
    addBar.appendChild(addMC); addBar.appendChild(addBS);
    wrap.appendChild(addBar);

    const saveBtn = el("button", "btn btn-primary", "💾 Simpan Semua Soal");
    saveBtn.addEventListener("click", () => { Content.saveQuiz(); toastSaved(wrap); });
    wrap.appendChild(saveBtn);
    return wrap;
  },

  /* -------- BOSS CHALLENGE -------- */
  editBoss() {
    const wrap = el("div", "page page-guru");
    wrap.appendChild(el("h1", "page-title", "👑 Editor Boss Challenge"));
    wrap.appendChild(this.menuBar());

    const boss = Content.boss;
    const form = el("div", "card guru-form");
    const judulInput = textInput(boss.judul);
    const skenarioInput = textArea(boss.skenario, 3);
    form.appendChild(field("Judul Tantangan", judulInput));
    form.appendChild(field("Skenario / Cerita Pembuka", skenarioInput));

    form.appendChild(el("label", "field-label", "Langkah-langkah Keputusan"));
    const editor = repeatableEditor(boss.langkah, (row, item) => {
      const q = textArea(item.pertanyaan, 2); q.addEventListener("input", () => item.pertanyaan = q.value);
      row.appendChild(field("Pertanyaan", q));
      const optEditor = repeatableEditor(item.opsi.map(o => ({ text: o })), (r2, it2, oi) => {
        const radio = el("input"); radio.type = "radio"; radio.checked = item.jawabanBenar === oi;
        radio.addEventListener("change", () => item.jawabanBenar = oi);
        const t = textInput(it2.text); t.addEventListener("input", () => item.opsi[oi] = t.value);
        r2.appendChild(radio); r2.appendChild(t);
      }, () => { item.opsi.push(""); return { text: "" }; }, "Tambah Opsi");
      row.appendChild(optEditor);
      const fb = textArea(item.feedback, 2); fb.addEventListener("input", () => item.feedback = fb.value);
      row.appendChild(field("Feedback", fb));
    }, () => ({ pertanyaan: "", opsi: ["", ""], jawabanBenar: 0, feedback: "" }), "Tambah Langkah");
    form.appendChild(editor);

    const saveBtn = el("button", "btn btn-primary", "💾 Simpan Boss Challenge");
    saveBtn.addEventListener("click", () => {
      boss.judul = judulInput.value; boss.skenario = skenarioInput.value;
      Content.saveBoss(); toastSaved(form);
    });
    form.appendChild(saveBtn);
    wrap.appendChild(form);
    return wrap;
  },

  /* -------- PENGATURAN DATA -------- */
  pengaturan() {
    const wrap = el("div", "page page-guru");
    wrap.appendChild(el("h1", "page-title", "⚙️ Pengaturan Data"));
    wrap.appendChild(this.menuBar());

    const card = el("div", "card");
    card.appendChild(el("p", null, "Ekspor semua materi, kuis, dan tantangan menjadi satu file JSON untuk dicadangkan atau dipindahkan ke komputer lain. Impor file JSON untuk memuat kembali."));
    const exportBtn = el("button", "btn btn-secondary", "⬇️ Ekspor Data (JSON)");
    exportBtn.addEventListener("click", () => {
      const data = JSON.stringify(Content.exportAll(), null, 2);
      const blob = new Blob([data], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "materi-pembelajaran.json";
      a.click();
    });
    const importInput = el("input");
    importInput.type = "file"; importInput.accept = ".json,application/json";
    importInput.addEventListener("change", () => {
      const f = importInput.files[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const obj = JSON.parse(reader.result);
          Content.importAll(obj);
          alert("Data berhasil diimpor!");
          Router.go("guru");
        } catch (e) { alert("File JSON tidak valid."); }
      };
      reader.readAsText(f);
    });
    const resetBtn = el("button", "btn btn-ghost", "↩️ Kembalikan ke Materi Contoh (Default)");
    resetBtn.addEventListener("click", () => {
      if (confirm("Ini akan menghapus semua perubahan dan kembali ke materi contoh bawaan. Lanjutkan?")) {
        Content.resetToDefault();
        Router.go("guru");
      }
    });
    card.appendChild(exportBtn);
    card.appendChild(field("Impor Data", importInput));
    card.appendChild(resetBtn);
    wrap.appendChild(card);
    return wrap;
  }
};
