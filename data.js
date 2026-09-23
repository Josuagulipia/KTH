/* ============================================================
   DATA MATERI — EDIT DI SINI TANPA MENYENTUH KODE LAIN
   ============================================================
   Panduan singkat untuk guru ada di README.md.
   Setiap subbab punya SATU aktivitas. Jenis aktivitas yang didukung:
     "pilihanGanda" | "benarSalah" | "urutkan" | "cocokkan" | "kategorikan"
   Lihat js/activities.js kalau ingin tahu bentuk data tiap jenis.
   ============================================================ */

const DEFAULT_MATERI = {
  judul: "Analisis Data & Data yang Bisa Dipercaya",
  subjudul: "Belajar mengubah data mentah jadi keputusan yang masuk akal",
  mapel: "Koding & AI — Kelas X",
  tujuanPembelajaran: [
    "Menjelaskan pengertian analisis data dengan bahasa sendiri",
    "Mempraktikkan langkah Kumpulkan → Olah → Pahami → Putuskan pada kasus sederhana",
    "Membedakan data yang terbuka, terpercaya, dan legal",
    "Menilai kualitas sebuah data dari enam sisi: akurasi, kelengkapan, konsistensi, ketepatan waktu, keunikan, dan validitas",
  ],
  subbab: [
    {
      id: "sub1",
      judul: "Apa Itu Analisis Data?",
      tujuan:
        "Memahami bahwa data mentah perlu diolah dulu sebelum jadi keputusan.",
      cobaDulu: {
        pertanyaan:
          "HP kamu bilang 'kemungkinan hujan 80% hari ini'. Menurutmu, dari mana HP tahu itu?",
        opsi: [
          "HP bisa melihat masa depan",
          "HP menebak asal-asalan",
          "HP mengolah data cuaca sebelumnya",
        ],
        jawabanBenar: 2,
      },
      penjelasan: [
        {
          heading: "Data tidak muncul begitu saja jadi ramalan",
          text: "HP tidak benar-benar 'melihat' masa depan. Ia memakai data suhu, kelembapan, tekanan udara, dan cuaca hari-hari sebelumnya, lalu data itu dianalisis sampai keluar angka prediksi seperti '80% kemungkinan hujan'.",
        },
        {
          heading: "Alurnya sederhana",
          text: "DATA → DIOLAH / DIANALISIS → MENJADI INFORMASI → MEMBANTU KITA MENGAMBIL KEPUTUSAN. Ingat alur ini, karena semua contoh di bab ini akan mengikuti pola yang sama.",
        },
        {
          heading: "Contoh di kelas",
          text: "Bayangkan gurumu ingin tahu makanan favorit anak kelas XI. Ia mencatat: Andi–Bakso, Budi–Mie Ayam, Citra–Bakso, Deni–Nasi Goreng, Eka–Bakso, Fani–Mie Ayam. Kalau kamu jadi ketua kelas dan mau beli makanan buat teman-teman, makanan apa yang paling masuk akal dibeli paling banyak?",
        },
      ],
      contohSehariHari:
        "Waktu kamu buka aplikasi belanja online dan lihat rekomendasi produk, itu juga hasil analisis data — aplikasi mengolah riwayat pencarianmu supaya bisa menebak apa yang mungkin kamu suka.",
      tahukahKamu:
        "Kata 'data' berasal dari bahasa Latin 'datum', yang artinya 'sesuatu yang diberikan'. Jadi data adalah bahan mentah — baru berguna setelah diolah.",
      ringkasan: [
        "Data mentah belum berarti apa-apa sebelum diolah",
        "Alur dasarnya: Data → Diolah → Jadi Informasi → Bantu Keputusan",
        "Analisis data = mengolah & mempelajari data untuk menemukan informasi yang berguna",
      ],
      aktivitas: {
        type: "pilihanGanda",
        judul: "Studi Kasus: Makanan Favorit Kelas XI",
        tabel: {
          header: ["Nama Siswa", "Makanan Favorit"],
          baris: [
            ["Andi", "Bakso"],
            ["Budi", "Mie Ayam"],
            ["Citra", "Bakso"],
            ["Deni", "Nasi Goreng"],
            ["Eka", "Bakso"],
            ["Fani", "Mie Ayam"],
          ],
        },
        pertanyaan:
          "Perhatikan tabel hasil pendataan makanan favorit kelas XI di atas. Makanan apa yang paling tepat dibeli lebih banyak?",
        opsi: [
          "Nasi Goreng",
          "Bakso",
          "Mie Ayam",
          "Semua dibeli sama rata tanpa lihat data",
        ],
        jawabanBenar: 1,
        penjelasanBenar:
          "Tepat! Bakso dipilih 3 dari 6 siswa — paling banyak. Itulah gunanya analisis data: keputusan dibuat berdasar pola yang muncul, bukan tebakan.",
        penjelasanSalah:
          "Coba hitung lagi berapa siswa yang memilih tiap makanan dari tabel. Keputusan yang baik ikut angka yang paling banyak muncul, bukan urutan penulisan atau harga.",
        soalTambahan: [
          {
            pertanyaan:
              "Masih dari tabel yang sama, berapa jumlah siswa yang TIDAK memilih Bakso?",
            opsi: ["1 siswa", "2 siswa", "3 siswa", "4 siswa"],
            jawabanBenar: 2,
            penjelasanBenar:
              "Benar! Dari 6 siswa, 3 memilih Bakso, jadi 3 siswa sisanya (Budi, Deni, Fani) memilih makanan lain.",
            penjelasanSalah:
              "Hitung lagi baris tabel yang bukan 'Bakso': Budi (Mie Ayam), Deni (Nasi Goreng), Fani (Mie Ayam) — ada 3 siswa.",
          },
        ],
      },
    },
    {
      id: "sub2",
      judul: "Rumus: Kumpulkan → Olah → Pahami → Putuskan",
      tujuan: "Menghafal dan mempraktikkan 4 langkah dasar analisis data.",
      penjelasan: [
        {
          heading: "1. KUMPULKAN",
          text: "Cari atau kumpulkan data. Contoh: bertanya ke 30 siswa tentang makanan favorit mereka.",
        },
        {
          heading: "2. OLAH",
          text: "Data yang terkumpul dirapikan atau dihitung. Contoh: 'Bakso dipilih 15 siswa, mie ayam 8 siswa, nasi goreng 7 siswa.'",
        },
        {
          heading: "3. PAHAMI",
          text: "Cari tahu apa arti angka-angka itu. Contoh: 'Ternyata makanan yang paling disukai adalah bakso.'",
        },
        {
          heading: "4. PUTUSKAN",
          text: "Pakai hasilnya untuk mengambil keputusan. Contoh: 'Kita beli lebih banyak bakso untuk acara kelas.'",
        },
      ],
      contohSehariHari:
        "Waktu tim sepak bola sekolah memilih strategi lawan, pelatih 'mengumpulkan' rekaman pertandingan lawan, 'mengolah' jadi catatan pola serangan, 'memahami' kelemahan lawan, lalu 'memutuskan' strategi apa yang dipakai.",
      tahukahKamu:
        "Kalau kamu lupa urutannya, ingat saja 4 kata ini: KUMPULKAN → OLAH → PAHAMI → PUTUSKAN. Urutannya selalu sama, di kasus sesederhana apa pun.",
      ringkasan: [
        "KUMPULKAN: cari datanya dulu",
        "OLAH: rapikan / hitung datanya",
        "PAHAMI: cari tahu artinya",
        "PUTUSKAN: pakai untuk mengambil keputusan",
      ],
      aktivitas: {
        type: "urutkan",
        judul: "Susun Urutan yang Benar",
        instruksi:
          "Urutkan langkah analisis data berikut dari yang pertama sampai terakhir.",
        item: [
          "Putuskan lebih banyak beli bakso",
          "Bertanya ke 30 siswa makanan favorit",
          "Menghitung: bakso 15, mie ayam 8, nasi goreng 7",
          "Menyadari bakso adalah yang paling favorit",
        ],
        urutanBenar: [1, 2, 3, 0],
        penjelasanBenar:
          "Betul! Selalu mulai dari mengumpulkan data mentah, baru mengolah jadi angka, memahami maknanya, dan terakhir memutuskan tindakan.",
        penjelasanSalah:
          "Ingat lagi: kita tidak bisa 'memutuskan' sebelum tahu artinya, dan tidak bisa 'memahami' sebelum datanya diolah jadi angka. Datanya juga harus dikumpulkan dulu sebelum apa pun.",
      },
    },
    {
      id: "sub3",
      judul: "Data Terbuka",
      tujuan: "Memahami arti data terbuka dan batasannya.",
      cobaDulu: {
        pertanyaan:
          "Kamu dapat pesan WhatsApp berantai: 'Besok sekolah diliburkan karena hujan deras.' Apa yang sebaiknya kamu lakukan?",
        opsi: [
          "Langsung percaya dan sebar ke grup lain",
          "Cek dulu ke sumber resmi seperti sekolah atau BMKG",
          "Diam saja, nanti juga tahu sendiri",
        ],
        jawabanBenar: 1,
      },
      penjelasan: [
        {
          heading: "Analogi perpustakaan",
          text: "Bayangkan sebuah perpustakaan yang menyediakan buku untuk dibaca dan dipinjam. Kita boleh pakai informasi dari buku itu, tapi tetap harus menghargai penulisnya. Data terbuka mirip begitu — boleh dipakai ulang, tapi ikuti aturan atau lisensinya.",
        },
        {
          heading: "Contoh nyata",
          text: "BMKG menyediakan data prakiraan cuaca dan data gempa yang boleh dimanfaatkan siapa saja untuk kepentingan yang wajar.",
        },
        {
          heading: "Batas pentingnya",
          text: "Kalau kita pakai data BMKG, apakah boleh mengaku itu buatan kita sendiri? Tentu tidak. Ingat kalimat kunci: BOLEH DIGUNAKAN ≠ BOLEH MENGAKU SEBAGAI MILIK SENDIRI.",
        },
      ],
      contohSehariHari:
        "Saat kamu memakai data jumlah penduduk dari situs BPS untuk tugas sekolah, itu contoh memanfaatkan data terbuka — asal kamu tetap mencantumkan sumbernya.",
      tahukahKamu:
        "Banyak lembaga pemerintah Indonesia, seperti BMKG dan BPS, punya portal data terbuka yang bisa diakses gratis oleh siapa saja.",
      ringkasan: [
        "Data terbuka boleh dipakai ulang sesuai aturan/lisensinya",
        "Contoh: data cuaca dan gempa dari BMKG",
        "Boleh digunakan ≠ boleh diakui sebagai milik sendiri",
      ],
      aktivitas: {
        type: "benarSalah",
        judul: "Benar atau Salah?",
        pernyataan:
          "Karena data BMKG bersifat terbuka, kita boleh mengunggahnya dan mengaku itu adalah hasil riset kita sendiri.",
        jawabanBenar: false,
        penjelasanBenar:
          "Betul, ini SALAH. Data terbuka boleh dipakai, tapi kita tetap wajib jujur soal sumbernya — bukan mengaku sebagai karya sendiri.",
        penjelasanSalah:
          "Coba baca lagi kalimat kuncinya: boleh digunakan tidak sama dengan boleh diakui sebagai milik sendiri. Jadi pernyataan ini salah.",
      },
    },
    {
      id: "sub4",
      judul: "Data Terpercaya",
      tujuan: "Bisa menilai sumber data mana yang lebih layak dipercaya.",
      penjelasan: [
        {
          heading: "Permainan: mana yang lebih bisa dipercaya?",
          text: "A. 'Kata teman saya, besok akan terjadi gempa.' B. 'Postingan akun anonim bilang besok akan terjadi gempa.' C. 'Informasi gempa resmi dari BMKG.' Menurutmu, mana yang paling layak dijadikan sumber?",
        },
        {
          heading: "Yang membuat data terpercaya",
          text: "Kita perlu melihat siapa yang mengeluarkan data itu, bagaimana data itu diperoleh, dan apakah sumbernya memang punya kredibilitas — bukan sekadar 'katanya' atau akun tanpa identitas jelas.",
        },
      ],
      contohSehariHari:
        "Waktu mencari info kesehatan, informasi dari situs rumah sakit atau Kemenkes lebih terpercaya dibanding status media sosial orang yang tidak dikenal.",
      tahukahKamu:
        "Lembaga resmi biasanya punya proses verifikasi berlapis sebelum merilis data — itulah kenapa datanya lebih bisa dipercaya dibanding info yang menyebar dari mulut ke mulut.",
      ringkasan: [
        "Data terpercaya berasal dari sumber yang jelas dan kredibel",
        "Perhatikan siapa yang mengeluarkan dan bagaimana data diperoleh",
        "Sumber anonim atau 'kata orang' bukan sumber yang bisa diandalkan",
      ],
      aktivitas: {
        type: "pilihanGanda",
        judul: "Pilih Sumber Paling Terpercaya",
        pertanyaan:
          "Mana dari tiga sumber ini yang paling layak dijadikan acuan soal prediksi gempa besok?",
        opsi: [
          "Kata teman yang dengar dari orang lain",
          "Postingan akun anonim di media sosial",
          "Informasi resmi dari BMKG",
        ],
        jawabanBenar: 2,
        penjelasanBenar:
          "Tepat! BMKG adalah lembaga resmi dengan proses pengukuran dan verifikasi yang jelas, jauh lebih kredibel dibanding kabar dari mulut ke mulut atau akun anonim.",
        penjelasanSalah:
          "Pikirkan lagi: siapa yang punya alat, data, dan tanggung jawab resmi untuk mengukur gempa? Itu yang paling layak dipercaya.",
      },
    },
    {
      id: "sub5",
      judul: "Enam Sisi Kualitas Data",
      tujuan: "Menilai kualitas data dari enam sudut pandang sederhana.",
      penjelasan: [
        {
          heading: "Akurasi = Apakah datanya benar?",
          text: "Contoh: dalam data siswa, ada catatan 'Citra, umur 160 tahun'. Ini jelas salah — bukan akurasi yang baik.",
        },
        {
          heading: "Kelengkapan = Apakah datanya lengkap?",
          text: "Kalau kolom nomor HP Budi kosong padahal dibutuhkan, berarti datanya belum lengkap.",
        },
        {
          heading: "Konsistensi = Apakah datanya tidak bertentangan?",
          text: "Data pertama bilang Andi kelas XI, data kedua bilang Andi kelas X. Mana yang benar? Ini contoh data yang tidak konsisten.",
        },
        {
          heading: "Ketepatan Waktu = Apakah datanya masih terbaru?",
          text: "Info harga HP dari tahun 2020 belum tentu cocok dipakai untuk mengetahui harga sekarang.",
        },
        {
          heading: "Keunikan = Apakah ada data yang tercatat dua kali?",
          text: "Kalau 'Andi' sebenarnya satu orang tapi tercatat tiga kali dalam daftar, itu duplikasi — bukan data yang unik.",
        },
        {
          heading: "Validitas = Apakah datanya sesuai aturan/format?",
          text: "Umur siswa 17 tahun itu masuk akal. Tapi umur siswa −5 tahun jelas tidak valid.",
        },
      ],
      contohSehariHari:
        "Waktu kamu isi formulir pendaftaran lomba dan salah ketik nomor HP, itu langsung membuat datamu jadi tidak akurat — panitia bisa kesulitan menghubungimu.",
      tahukahKamu:
        "Perusahaan besar sering punya tim khusus yang tugasnya hanya membersihkan data yang tidak akurat, tidak lengkap, atau terduplikasi sebelum data itu dipakai untuk mengambil keputusan.",
      ringkasan: [
        "Akurasi: datanya benar",
        "Kelengkapan: tidak ada yang hilang",
        "Konsistensi: tidak saling bertentangan",
        "Ketepatan waktu: masih relevan dengan kondisi sekarang",
        "Keunikan: tidak ada duplikasi",
        "Validitas: sesuai format/aturan yang berlaku",
      ],
      aktivitas: {
        type: "cocokkan",
        judul: "Cocokkan Istilah dengan Pertanyaannya",
        pasangan: [
          { kiri: "Akurasi", kanan: "Apakah datanya benar?" },
          { kiri: "Kelengkapan", kanan: "Apakah datanya lengkap?" },
          { kiri: "Konsistensi", kanan: "Apakah datanya tidak bertentangan?" },
          { kiri: "Ketepatan Waktu", kanan: "Apakah datanya masih terbaru?" },
          {
            kiri: "Keunikan",
            kanan: "Apakah ada data yang tercatat dua kali?",
          },
          { kiri: "Validitas", kanan: "Apakah datanya sesuai aturan?" },
        ],
        penjelasanBenar:
          "Mantap! Enam pertanyaan sederhana ini jauh lebih mudah diingat daripada menghafal definisi kaku dari buku.",
        penjelasanSalah:
          "Coba pikirkan arti kata itu sendiri dulu — misalnya 'akurat' dalam percakapan sehari-hari biasanya berarti apa?",
      },
    },
    {
      id: "sub6",
      judul: "Data Legal",
      tujuan:
        "Memahami bahwa data yang bisa ditemukan belum tentu bebas dipakai.",
      penjelasan: [
        {
          heading: "Studi kasus",
          text: "Kamu menemukan foto seseorang di internet, lalu memasukkannya ke aplikasi buatanmu tanpa izin. Apakah karena fotonya ada di internet berarti kamu bebas memakainya?",
        },
        {
          heading: "Jawabannya: tidak otomatis",
          text: "Sesuatu yang bisa kita temukan di internet tidak otomatis berarti bebas digunakan. Data legal adalah data yang penggunaannya sesuai hukum dan aturan yang berlaku, seperti undang-undang, peraturan pemerintah, peraturan presiden, atau peraturan daerah.",
        },
        {
          heading: "Pertanyaan yang harus dibiasakan",
          text: "Sebelum memakai data, jangan cuma tanya 'Apakah datanya ada?' — tapi juga tanya 'Apakah aku boleh menggunakannya?'",
        },
      ],
      contohSehariHari:
        "Memakai lagu orang lain sebagai backsound video tanpa izin, walau lagunya mudah diunduh dari internet, tetap bisa melanggar aturan hak cipta.",
      tahukahKamu:
        "Di banyak negara, termasuk Indonesia, ada undang-undang khusus yang mengatur perlindungan data pribadi dan hak cipta karya digital.",
      ringkasan: [
        "Bisa ditemukan di internet ≠ bebas dipakai",
        "Data legal artinya penggunaannya sesuai hukum yang berlaku",
        "Selalu tanya: 'Apakah aku boleh menggunakan data ini?'",
      ],
      aktivitas: {
        type: "benarSalah",
        judul: "Benar atau Salah?",
        pernyataan:
          "Karena foto seseorang bisa ditemukan dengan mudah di internet, artinya foto itu bebas dipakai untuk aplikasi buatan siapa saja.",
        jawabanBenar: false,
        penjelasanBenar:
          "Tepat, ini SALAH. Mudah ditemukan bukan berarti bebas dipakai — tetap perlu izin atau memperhatikan aturan hak cipta dan privasi.",
        penjelasanSalah:
          "Ingat studi kasusnya: 'ada di internet' dan 'boleh dipakai' adalah dua hal yang berbeda. Pernyataan ini salah.",
      },
    },
    {
      id: "sub7",
      judul: "Rangkuman: Terbuka, Terpercaya, Legal",
      tujuan:
        "Membedakan tiga konsep yang sering tertukar: terbuka, terpercaya, dan legal.",
      penjelasan: [
        {
          heading: "Tiga kotak perbandingan",
          text: "TERBUKA — boleh digunakan sesuai ketentuan, perhatikan lisensinya, contohnya data terbuka BMKG. TERPERCAYA — sumbernya dapat dipercaya, perhatikan siapa sumbernya, contohnya lembaga resmi atau jurnal terpercaya. LEGAL — sesuai hukum, perhatikan aturannya, contohnya undang-undang atau peraturan resmi.",
        },
        {
          heading: "Kata kunci singkat",
          text: "🟢 Terbuka = boleh digunakan sesuai aturan. 🔵 Terpercaya = bisa dipercaya. 🟠 Legal = sesuai hukum. Tiga hal ini berbeda, dan sebuah data idealnya memenuhi ketiganya sekaligus.",
        },
      ],
      contohSehariHari:
        "Data cuaca dari BMKG itu terbuka (boleh dipakai ulang), terpercaya (dari lembaga resmi), dan legal (diatur oleh peraturan pemerintah) — ketiganya terpenuhi sekaligus.",
      tahukahKamu:
        "Sebuah data bisa saja terbuka tapi tidak terpercaya (misalnya forum internet bebas diakses tapi isinya belum tentu benar), jadi ketiga hal ini perlu dicek satu per satu.",
      ringkasan: [
        "Terbuka: boleh digunakan sesuai aturan/lisensi",
        "Terpercaya: sumbernya kredibel",
        "Legal: sesuai hukum yang berlaku",
        "Data yang baik idealnya memenuhi ketiga-tiganya",
      ],
      aktivitas: {
        type: "kategorikan",
        judul: "Masukkan ke Kotak yang Tepat",
        instruksi:
          "Tarik/tap tiap pernyataan ke kategori yang paling sesuai: Terbuka, Terpercaya, atau Legal.",
        kategori: ["Terbuka", "Terpercaya", "Legal"],
        item: [
          {
            teks: "Data cuaca BMKG boleh dipakai ulang sesuai lisensinya",
            kategori: "Terbuka",
          },
          {
            teks: "Informasi berasal dari lembaga resmi dengan proses verifikasi jelas",
            kategori: "Terpercaya",
          },
          {
            teks: "Penggunaan data diatur oleh undang-undang perlindungan data",
            kategori: "Legal",
          },
          {
            teks: "Siapa pun boleh mengunduh dan mengolah ulang data ini",
            kategori: "Terbuka",
          },
          {
            teks: "Sumbernya jurnal ilmiah yang sudah melalui proses tinjauan ahli",
            kategori: "Terpercaya",
          },
          {
            teks: "Memakai data ini tanpa izin bisa melanggar hak cipta",
            kategori: "Legal",
          },
        ],
        penjelasanBenar:
          "Kerja bagus! Kamu berhasil membedakan tiga konsep yang memang sering tertukar ini.",
        penjelasanSalah:
          "Coba baca ulang kata kuncinya: Terbuka soal BOLEH DIPAKAI, Terpercaya soal SUMBERNYA, Legal soal HUKUM.",
      },
    },
  ],
};

/* ============================================================
   DATA KUIS — soal diambil dari seluruh subbab di atas
   ============================================================ */
const DEFAULT_QUIZ = [
  {
    id: "q1",
    tipe: "pilihanGanda",
    soal: "Apa arti dari alur 'Data → Diolah → Menjadi Informasi'?",
    opsi: [
      "Data langsung jadi keputusan tanpa proses",
      "Data mentah perlu diproses dulu sebelum berguna",
      "Data tidak pernah bisa diolah",
      "Informasi selalu lebih besar dari data",
    ],
    jawabanBenar: 1,
    pembahasan:
      "Data mentah tidak langsung berguna. Ia perlu diolah/dianalisis dulu supaya menjadi informasi yang bisa dipakai mengambil keputusan.",
  },
  {
    id: "q2",
    tipe: "pilihanGanda",
    soal: "Urutan yang benar dalam rumus dasar analisis data adalah...",
    opsi: [
      "Olah → Kumpulkan → Putuskan → Pahami",
      "Kumpulkan → Olah → Pahami → Putuskan",
      "Putuskan → Pahami → Olah → Kumpulkan",
      "Pahami → Putuskan → Kumpulkan → Olah",
    ],
    jawabanBenar: 1,
    pembahasan:
      "Urutannya selalu: Kumpulkan datanya, Olah jadi angka/ringkasan, Pahami artinya, baru Putuskan tindakannya.",
  },
  {
    id: "q3",
    tipe: "benarSalah",
    soal: "Karena data BMKG bersifat terbuka, siapa pun boleh mengakuinya sebagai hasil riset pribadi.",
    jawabanBenar: false,
    pembahasan:
      "Salah. Data terbuka boleh dipakai ulang, tapi kita tetap wajib jujur soal sumber aslinya.",
  },
  {
    id: "q4",
    tipe: "pilihanGanda",
    soal: "Manakah sumber yang paling layak dipercaya untuk info soal potensi gempa?",
    opsi: [
      "Status media sosial akun anonim",
      "Kabar dari teman yang dengar dari orang lain",
      "Rilis resmi dari BMKG",
      "Grup WhatsApp keluarga",
    ],
    jawabanBenar: 2,
    pembahasan:
      "BMKG adalah lembaga resmi dengan alat ukur dan proses verifikasi, jauh lebih kredibel dibanding sumber tidak resmi.",
  },
  {
    id: "q5",
    tipe: "pilihanGanda",
    soal: "Data siswa mencatat umur Citra 160 tahun. Ini adalah masalah pada sisi kualitas data...",
    opsi: ["Akurasi", "Kelengkapan", "Ketepatan waktu", "Keunikan"],
    jawabanBenar: 0,
    pembahasan:
      "Umur 160 tahun jelas tidak masuk akal — ini soal akurasi, yaitu apakah datanya benar.",
  },
  {
    id: "q6",
    tipe: "pilihanGanda",
    soal: "Nama 'Andi' tercatat tiga kali padahal orangnya cuma satu. Ini contoh masalah pada sisi...",
    opsi: ["Validitas", "Keunikan", "Konsistensi", "Ketepatan waktu"],
    jawabanBenar: 1,
    pembahasan:
      "Data yang tercatat berulang untuk orang yang sama disebut duplikasi — masalah pada sisi keunikan.",
  },
  {
    id: "q7",
    tipe: "benarSalah",
    soal: "Karena foto seseorang mudah ditemukan di internet, foto itu otomatis boleh dipakai bebas di aplikasi apa pun.",
    jawabanBenar: false,
    pembahasan:
      "Salah. Mudah ditemukan tidak sama dengan bebas dipakai — tetap ada aturan hak cipta dan privasi yang berlaku (data legal).",
  },
  {
    id: "q8",
    tipe: "pilihanGanda",
    soal: "Sebuah data dari forum internet bebas diakses siapa saja, tapi isinya belum tentu benar. Data ini bisa dibilang...",
    opsi: [
      "Terbuka tapi belum tentu terpercaya",
      "Legal tapi tidak terbuka",
      "Terpercaya tapi tidak terbuka",
      "Tidak termasuk kategori apa pun",
    ],
    jawabanBenar: 0,
    pembahasan:
      "Terbuka (soal akses), terpercaya (soal kredibilitas sumber), dan legal (soal hukum) adalah tiga hal berbeda — sebuah data bisa memenuhi satu tapi tidak yang lain.",
  },
];

/* ============================================================
   BOSS CHALLENGE — tantangan akhir, gabungan beberapa konsep
   ============================================================ */
const DEFAULT_BOSS = {
  judul: "Tantangan Akhir: Detektif Data",
  skenario:
    "Malam ini kamu terima pesan berantai: 'BESOK SEKOLAH LIBUR, ada info dari grup sebelah, sudah dikonfirmasi 100%!' Pesan itu juga menyertakan sebuah grafik curah hujan yang katanya dari BMKG, tapi sumbernya tidak jelas dan gambarnya buram.",
  langkah: [
    {
      pertanyaan: "Langkah pertama yang paling tepat kamu lakukan adalah...",
      opsi: [
        "Langsung sebar pesan itu ke grup kelas",
        "Cek dulu ke akun resmi sekolah / BMKG",
        "Anggap benar karena ada grafiknya",
      ],
      jawabanBenar: 1,
      feedback:
        "Betul, selalu cek ke sumber resmi dulu sebelum percaya atau menyebarkan info.",
    },
    {
      pertanyaan:
        "Ternyata grafik itu memang mirip data BMKG. Bolehkah kamu mengunggah ulang grafik itu dan mengaku itu hasil analisismu sendiri?",
      opsi: [
        "Boleh, karena datanya terbuka",
        "Tidak boleh, tetap harus jujur soal sumber aslinya",
        "Boleh asal tidak ketahuan",
      ],
      jawabanBenar: 1,
      feedback:
        "Tepat. Data terbuka boleh dipakai ulang, tapi kejujuran soal sumber tetap wajib.",
    },
    {
      pertanyaan:
        "Setelah dicek, ternyata itu hoaks — sekolah tidak libur. Apa pelajaran utama dari kasus ini?",
      opsi: [
        "Data yang terlihat meyakinkan belum tentu terpercaya dan perlu dicek sumbernya",
        "Semua pesan berantai pasti benar",
        "Grafik selalu berarti data itu valid",
      ],
      jawabanBenar: 0,
      feedback:
        "Persis! Tampilan meyakinkan bukan jaminan kebenaran — selalu cek keterbukaan, kepercayaan, dan legalitas sumber data.",
    },
  ],
};

/* ============================================================
   GLOSARIUM — istilah penting
   ============================================================ */
const DEFAULT_GLOSSARY = [
  {
    istilah: "Analisis Data",
    arti: "Kegiatan mengolah dan mempelajari data untuk menemukan informasi yang berguna bagi pengambilan keputusan.",
  },
  {
    istilah: "Data Terbuka",
    arti: "Data yang boleh digunakan ulang dan dibagikan oleh orang lain sesuai ketentuan atau lisensi yang berlaku.",
  },
  {
    istilah: "Data Terpercaya",
    arti: "Data yang berasal dari sumber kredibel dan jelas cara memperolehnya.",
  },
  {
    istilah: "Data Legal",
    arti: "Data yang penggunaannya sesuai dengan hukum dan aturan yang berlaku.",
  },
  { istilah: "Akurasi", arti: "Sejauh mana data tersebut benar." },
  {
    istilah: "Kelengkapan",
    arti: "Sejauh mana data yang dibutuhkan tersedia, tidak ada yang hilang.",
  },
  {
    istilah: "Konsistensi",
    arti: "Sejauh mana data tidak saling bertentangan satu sama lain.",
  },
  {
    istilah: "Ketepatan Waktu",
    arti: "Sejauh mana data masih relevan dengan kondisi terkini.",
  },
  {
    istilah: "Keunikan",
    arti: "Sejauh mana data tidak mengalami duplikasi/tercatat berulang.",
  },
  {
    istilah: "Validitas",
    arti: "Sejauh mana data sesuai dengan format atau aturan yang ditetapkan.",
  },
];

/* Level & badge yang dipakai sistem gamifikasi (lihat js/state.js) */
const LEVELS = [
  { min: 0, nama: "Penjelajah", ikon: "🧭" },
  { min: 100, nama: "Pemahami", ikon: "🔍" },
  { min: 250, nama: "Ahli Data", ikon: "📊" },
  { min: 450, nama: "Master Analisis", ikon: "🏆" },
];
