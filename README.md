# Petualangan Belajar — Media Pembelajaran Interaktif

Website pembelajaran interaktif untuk siswa SMA/SMK, dibuat dengan HTML, CSS, dan JavaScript murni (tanpa server/database). Materi contoh yang sudah dimasukkan: **Analisis Data & Data yang Bisa Dipercaya** (mapel Koding & AI).

## 1. Cara Menjalankan

**Paling gampang:** klik dua kali file `index.html`. Cukup untuk mencoba sendiri.

**Disarankan untuk dipakai di kelas** (supaya semua fitur, termasuk penyimpanan progres, berjalan mulus di semua perangkat):
1. Buka folder ini di terminal / command prompt.
2. Jalankan server lokal sederhana, contoh dengan Python:
   ```
   python -m http.server 8000
   ```
3. Buka `http://localhost:8000` di browser laptop/HP/tablet yang terhubung ke jaringan yang sama (ganti `localhost` dengan alamat IP laptop guru kalau diakses dari HP siswa).

**Untuk di-hosting online (gratis):** unggah seluruh folder ini ke [GitHub Pages](https://pages.github.com/), Netlify, atau Vercel — tidak perlu database atau server backend.

## 2. Struktur Folder

```
index.html          → kerangka halaman (jangan diedit kalau belum paham HTML)
css/style.css        → tampilan & warna
js/data.js            → ISI MATERI, SOAL KUIS, BOSS CHALLENGE, GLOSARIUM (paling penting bagi guru)
js/state.js           → sistem XP, level, badge, penyimpanan progres siswa
js/activities.js       → mesin untuk semua jenis praktik/aktivitas
js/render.js           → tampilan halaman-halaman siswa
js/guru.js             → tampilan & logika Mode Guru
js/app.js              → navigasi & pengaturan umum
```

## 3. Cara Mengganti/Menambah Materi (Tanpa Coding)

Cara termudah — **lewat website itu sendiri**:
1. Buka website, klik tombol **🧑‍🏫 Mode Guru** di pojok kanan atas.
2. Masukkan PIN default: **1234**
3. Buka menu **📘 Materi & Subbab** untuk mengedit judul, tujuan pembelajaran, dan daftar subbab.
4. Klik **+ Tambah Subbab Baru** atau **✏️ Edit** pada subbab yang ada untuk mengisi:
   - Judul & tujuan subbab
   - Video YouTube (opsional, tempel link videonya)
   - Gambar ilustrasi (opsional, unggah dari perangkat)
   - Penjelasan materi (bisa lebih dari satu bagian)
   - Contoh kehidupan sehari-hari
   - Fakta "Tahukah Kamu?"
   - Ringkasan (poin-poin singkat)
   - **Aktivitas/praktik** — pilih salah satu jenis: Pilihan Ganda, Benar/Salah, Susun Urutan, Cocokkan Pasangan, atau Kategorikan (drag & drop).
5. Klik **💾 Simpan Subbab**. Perubahan langsung tersimpan di browser tersebut.
6. Untuk kuis, buka menu **🧠 Kuis**; untuk tantangan akhir, buka **👑 Boss Challenge**.
7. Klik **👁️ Preview Siswa** kapan saja untuk melihat hasilnya sebagai siswa.

> Perubahan tersimpan secara otomatis di browser (localStorage) yang sedang dipakai. Kalau berpindah komputer, gunakan fitur **Ekspor Data (JSON)** di menu **⚙️ Pengaturan Data**, lalu **Impor** file itu di komputer lain.

**Cara lanjutan (untuk yang familier JavaScript):** edit langsung isi objek `DEFAULT_MATERI`, `DEFAULT_QUIZ`, `DEFAULT_BOSS`, `DEFAULT_GLOSSARY` di file `js/data.js`. Strukturnya sudah diberi komentar dan mengikuti pola yang sama dengan materi contoh — tinggal ikuti pola yang ada.

## 4. Cara Kerja Sistem Aktivitas

Setiap subbab hanya butuh **satu** objek `aktivitas`. Jenis yang tersedia:

| Jenis | Cocok untuk |
|---|---|
| `pilihanGanda` | Studi kasus, konsep, pemahaman umum |
| `benarSalah` | Miskonsepsi, pernyataan singkat |
| `urutkan` | Proses/langkah berurutan |
| `cocokkan` | Istilah ↔ definisi |
| `kategorikan` | Mengelompokkan beberapa contoh ke beberapa kategori |

Semua interaksi memakai **tap/klik** (bukan drag-and-drop native browser) supaya sama nyamannya dipakai di laptop, tablet, HP, maupun proyektor sentuh di kelas.

## 5. Mode Guru vs Mode Siswa

- **Mode Siswa** (tampilan default): Beranda, Materi, Misi, Kuis, Prestasi, Kamus (glosarium).
- **Mode Guru**: dashboard konten, editor materi/subbab, editor kuis, editor boss challenge, dan pengaturan data (ekspor/impor/reset). Dikunci PIN sederhana (bisa diganti lewat console browser: `localStorage.setItem('pbl_guru_pin','PIN-BARU')`).

## 6. Fitur yang Sudah Tersedia

Gamifikasi (XP, level, badge, streak harian) • Misi harian • Kuis dengan timer & pembahasan • Boss Challenge multi-langkah • Learning path bergaya peta petualangan • Pencarian materi & glosarium • Bookmark subbab • Dark mode • Text-to-Speech (bacakan materi) • Catatan siswa per subbab • Refleksi pembelajaran • Efek suara & musik latar (bisa dimatikan) • Confetti saat naik level/dapat badge/selesai tantangan • Sepenuhnya responsif (sidebar di layar besar, bottom navigation di HP) • Ekspor/impor data materi (JSON) • Progres tersimpan per nama siswa di perangkat yang sama.

## 7. Menambahkan Soal Kuis atau Langkah Boss Challenge

Semua dilakukan lewat Mode Guru → menu **Kuis** atau **Boss Challenge**, tombol "+ Tambah..." ada di bagian bawah tiap halaman.

Selamat mengajar! 🦉
