# Panduan Pengguna Lengkap (User Guide)
## LLM Lab & BenchLM User Manual & Interactive Playground Handbook

> **Aplikasi:** LLM Lab & BenchLM  
> **Versi Panduan:** 2.6.0  
> **Akses Aplikasi:** `https://bench.vijeron.com`  
> **Karakteristik:** Bebas Akun, Tanpa Kunci API, 100% Berjalan di Browser Anda

---

## 1. Memulai Cepat & Navigasi Antarmuka

### 1.1. Cara Mengakses & Mode Offline (PWA)
1. **Akses Web**: Buka peramban modern (Chrome, Edge, Safari, Firefox) dan kunjungi `https://bench.vijeron.com`.
2. **Instalasi PWA (Desktop & Mobile)**:
   - Pada Google Chrome / Microsoft Edge di desktop: Klik ikon **Install App (Unduh Aplikasi)** pada bilah URL peramban.
   - Pada iPhone / iPad (Safari): Ketuk tombol **Share (Bagikan)** $\to$ pilih **Add to Home Screen (Tambah ke Layar Utama)**.
   - Pada Android (Chrome): Ketuk menu titik tiga $\to$ pilih **Install App / Tambahkan ke Layar Utama**.
   - *Setelah terinstal, seluruh aplikasi dan alat komputasi dapat dibuka kapan saja tanpa memerlukan koneksi internet (100% Offline Ready).*

### 1.2. Navigasi Navigasi & Pintasan Universal
- **Bilah Navigasi Atas (Top Bar)**: Berisi pintasan ke 9 menu utama aplikasi.
- **Mobile Bottom Tab Bar**: Pada layar smartphone, 5 fitur terpopuler (Leaderboard, Compare, Selector, Simulator, Glossary) dapat diakses dengan cepat melalui tab bar bawah.
- **Pencarian Cepat / Command Palette (`Ctrl+K` / `⌘+K` / Tombol `/`)**:
  - Tekan kombinasi tombol `Ctrl + K` (Windows/Linux) atau `Cmd + K` (Mac), atau ketik tombol `/` pada keyboard saat tidak sedang mengetik teks.
  - Masukkan nama model AI (misal: *Claude*, *DeepSeek*, *GPT-5*), nama benchmark (misal: *SWE-bench*), halaman alat, atau istilah glosarium untuk melompat langsung ke tujuannya.
- **Pengubah Bahasa Dunia (World Language Selector)**:
  - Klik tombol bendera di bilah atas untuk membuka modal pilihan 11 bahasa: 🇮🇩 Indonesia, 🇺🇸 English, 🇪🇸 Español, 🇨🇳 简体中文, 🇯🇵 日本語, 🇫🇷 Français, 🇩🇪 Deutsch, 🇸🇦 العربية (dengan tata letak RTL), 🇧🇷 Português, 🇷🇺 Русский, 🇰🇷 한국어.
- **Pengalih Tema Gelap / Terang (Theme Toggle)**:
  - Klik ikon Matahari/Bulan di sudut kanan atas untuk beralih antara tema gelap (*Dark Mode*) yang nyaman di mata atau tema terang (*Light Mode*).

---

## 2. Panduan Langkah-demi-Langkah Penggunaan Modul

---

### 2.1. Leaderboard Model AI (`#/leaderboard`)

Halaman Leaderboard memberikan evaluasi objektif dan transparan terhadap 30+ model AI terkemuka di dunia.

```
+-----------------------------------------------------------------------------------------+
| [ Filter Vendor ] [ Filter Lisensi ] [ Dropdown Use-Case: 🤖 AI Agents ] [ 🔍 Cari ]    |
+-----------------------------------------------------------------------------------------+
| Pos | Model AI       | Vendor    | Skor BenchLM | Harga Blended | Speed   | Elo  | Aksi |
| --- | -------------- | --------- | ------------ | ------------- | ------- | ---- | ---- |
|  1  | Claude Opus 5  | Anthropic |    99.2      |    $10.00     | 65 t/s  | 1445 | [Pin]|
|  2  | GPT-5.6 Sol    | OpenAI    |    98.0      |    $8.75      | 80 t/s  | 1440 | [Pin]|
|  3  | DeepSeek R1    | DeepSeek  |    97.4      |    $0.96      | 75 t/s  | 1390 | [Pin]|
+-----------------------------------------------------------------------------------------+
```

#### Langkah Penggunaan:
1. **Memilih Profil Kebutuhan (Use-Case Profile)**:
   - Klik dropdown profil pembobotan di atas tabel:
     - **⚡ Semua Tugas (Standar)**: Bobot umum berimbang.
     - **🤖 AI Agents & Workflows**: Memprioritaskan *Agentic & Tool Use* (45%) dan *Coding* (25%).
     - **💻 Coding & Rekayasa Software**: Menitikberatkan pada kemampuan pemrograman (52%).
     - **✍️ Konten & SEO Copywriting**: Mengutamakan *Knowledge* (36%) dan *Multilingual* (20%).
     - **🧠 STEM & Penalaran Rumit**: Menitikberatkan pada penalaran mendalam (44%) dan matematika (20%).
     - **👁️ Vision & Dokumen AI**: Mengutamakan kemampuan pemahaman visual (52%).
   - *Skor BenchLM seluruh model akan otomatis dihitung ulang secara instan sesuai bobot use-case yang Anda pilih.*
2. **Menyortir Kolom**:
   - Klik pada kepala kolom tabel (misal: *Skor BenchLM*, *Harga*, *Kecepatan*, *Elo*) untuk mengurutkan model dari yang tertinggi atau terendah.
3. **Membuka Model Dossier (Detail Lengkap Model)**:
   - Klik pada nama baris model AI untuk membuka jendela modal dossier.
   - Periksa sub-skor 8 dimensi, hasil pengujian benchmark resmi (SWE-bench, GPQA Diamond, dll.), kelebihan (*Pros*), kekurangan (*Cons*), dan rekomendasi beban kerja ideal (*Best For*).
4. **Sematkan Model untuk Komparasi (Pin to Compare)**:
   - Klik ikon pin `📌` di sisi kanan baris model. Anda dapat menyematkan hingga 4 model, lalu klik tombol **"Bandingkan (X) Model Terpilih"** untuk langsung beralih ke halaman komparasi.
5. **Mengunduh Data**:
   - Klik tombol **Ekspor CSV** atau **Ekspor JSON** di bawah tabel untuk menyimpan dataset lengkap.

---

### 2.2. Komparasi Head-to-Head Multi-Model (`#/compare`)

Modul ini memungkinkan Anda membandingkan hingga 4 model AI secara berdampingan dengan grafik visual dan kalkulator biaya komparatif.

#### Langkah Penggunaan:
1. **Memilih Model Komparasi**:
   - Pilih model pada Slot 1, 2, 3, atau 4 menggunakan kotak pencarian pilihan model.
   - Atau klik salah satu tombol **Preset Populer**:
     - *🏆 Frontier Titans* (Claude Opus 5 vs GPT-5.6 Sol vs Gemini 3 Pro vs Qwen3.8 Max).
     - *🧠 Juara Penalaran* (DeepSeek R1 vs o3-mini vs QwQ-32B vs Claude 3.7).
     - *💻 Spesialis Coding* (Claude 3.7 vs Qwen 2.5 Coder vs DeepSeek Coder vs Codestral).
     - *🏷️ Rajanya Nilai Hemat* (DeepSeek V3 vs Gemini Flash vs Llama 3.3 vs Qwen 32B).
2. **Menganalisis Grafik Radar 8 Dimensi (Spider Chart)**:
   - Grafik SVG interaktif menampilkan bentuk poligon kemampuan masing-masing model.
   - Model dengan poligon yang menjangkau sisi luar terjauh memiliki keunggulan dominan pada kategori tersebut.
3. **Membaca Matriks Skor & Penanda Pemenang**:
   - Telusuri baris metrik: Skor BenchLM, Value Index, Harga Input/Output, Jendela Konteks, Kecepatan, dan TTFT.
   - Lencana hijau `🏆 TERBAIK` secara otomatis menandai model dengan nilai terbaik pada setiap metrik.
4. **Menjalankan Simulasi Biaya Komparatif Bulanan**:
   - Geser slider **Token Masukan Rata-rata (Prompt)** (misal: 2.000 token).
   - Geser slider **Token Keluaran Rata-rata (Completion)** (misal: 800 token).
   - Geser slider **Volume Permintaan per Bulan** (misal: 100.000 request).
   - Perhatikan perbandingan total estimasi tagihan bulanan antar model dan persentase efisiensi penghematan biaya.
5. **Mengekspor Laporan Markdown**:
   - Klik tombol **"Ekspor Hasil ke Markdown (.md)"** untuk menyalin atau mengunduh tabel rangkuman komparasi ke dokumen proyek Anda.

---

### 2.3. Pencari Model Pintar & Kurva Pareto (`#/selector`)

Membantu pengambil keputusan teknis, arsitek perangkat lunak, dan pengembang menemukan model LLM yang paling tepat berdasarkan batasan anggaran dan performa.

#### Langkah Penggunaan:
1. **Menjawab 4 Pertanyaan Wizard**:
   - **Langkah 1 (Use Case Utama)**: Pilih fokus beban kerja (misal: *Coding & Rekayasa Software*).
   - **Langkah 2 (Toleransi Anggaran)**: Pilih batas biaya (misal: *Seimbang < $3/1M token* atau *Khusus Open Weights*).
   - **Langkah 3 (Kebutuhan Latensi & Kecepatan)**: Pilih preferensi kecepatan (misal: *Cepat > 80 tok/s*).
   - **Langkah 4 (Estimasi Volume Permintaan)**: Tentukan rata-rata token dan jumlah request per bulan.
2. **Melihat Hasil Rekomendasi**:
   - Sistem menampilkan kartu 3 model teratas dengan skor kecocokan (*Match Score %*), estimasi biaya bulanan, serta argumen teknis mengapa model tersebut ideal.
3. **Mengeksplorasi Kurva Efisiensi Pareto**:
   - Gulir ke bawah untuk melihat grafik sebaran **Harga vs Performa**.
   - Model yang berada di sepanjang garis putus-putus (*Pareto Frontier*) mewakili pilihan dengan efisiensi tertinggi (performa puncak untuk rentang harga tersebut).
   - Klik pada titik lingkaran model mana saja di grafik untuk membuka Model Dossier.

---

### 2.4. Direktori & Metodologi Benchmark (`#/benchmarks`)

Memberikan transparansi metodologi ilmiah di balik evaluasi model AI.

#### Langkah Penggunaan:
1. Pelajari 8 tolok ukur standar industri:
   - **SWE-bench Verified**: Evaluasi kemampuan agen menyelesaikan tiket masalah nyata di GitHub.
   - **LiveCodeBench**: Evaluasi coding kontinu anti-bocoran data latih.
   - **GPQA Diamond**: Ujian penalaran biologi, fisika, kimia tingkat pascasarjana/PhD.
   - **MMLU-Pro**: Pengujian pemahaman akademis lintas disiplin ilmu.
   - **MMMU (Val)**: Evaluasi multimodal gambar, bagan, dan dokumen teknis.
   - **IFEval**: Kepatuhan format instruksi mesin terverifikasi.
   - **MATH-500**: Pemecahan 500 soal kompetisi olimpiade matematika.
   - **LMSYS Chatbot Arena**: Pertarungan preferensi jawaban blind manusia.
2. Pahami matriks distribusi bobot resmi 8 kategori yang mendasari perhitungan BenchLM.

---

### 2.5. Simulator Sampling Token Interaktif (`#/simulator`)

Laboratorium visual untuk memahami cara kerja mesin inferensi LLM dalam memprediksi dan memilih token berikutnya.

```
+-----------------------------------------------------------------------------------------+
| Pipeline Sampling: [Logit Mentah] -> [Penalti] -> [Suhu/Softmax] -> [Top-K/P] -> [Token]|
+-----------------------------------------------------------------------------------------+
| Teks Prompt: "Kecerdasan buatan masa depan akan berkembang ke arah..."                   |
| Hyperparameter: Temperature = 0.70 | Top-K = 40 | Top-P = 0.90 | Seed = 42              |
| Kontrol: [⏮ Reset] [▶ Auto Play] [⏭ Langkah Berikutnya (Step)]                           |
+-----------------------------------------------------------------------------------------+
| Distribusi 8 Kandidat Teratas:                                                           |
| 1. "otomasi"    [████████████████████] 42.5%                                            |
| 2. "sistem"     [██████████          ] 21.0%                                            |
| 3. "agen"       [██████              ] 14.2%                                            |
| 4. "kemampuan"  [████                ]  8.5% [Kandidat Terpilih: "otomasi"]              |
| 5. "robot"      [██                  ]  4.1%                                            |
| 6. "manusia"    [█                   ]  2.0%                                            |
| 7. "jaringan"   [░░░ DIPANGKAS TOP-P ]  0.8%                                            |
| 8. "algoritma"  [░░░ DIPANGKAS TOP-K ]  0.4%                                            |
+-----------------------------------------------------------------------------------------+
| Telemetri: Entropi Shannon = 2.14 bit | Pool Kandidat Aktif = 6 token                   |
+-----------------------------------------------------------------------------------------+
```

#### Langkah Penggunaan:
1. **Memilih Preset Skenario**:
   - Klik tombol preset: *Faktual & Presisi*, *Penulisan Kreatif*, *Kode Program Ketat*, atau *Eksplorasi Halusinasi*.
2. **Menyesuaikan Hyperparameter Sampling**:
   - **Temperature ($T$)**:
     - Nilai rendah ($0.0 - 0.3$): Menghasilkan respon sangat deterministik, konsisten, dan minim variasi.
     - Nilai sedang ($0.7 - 0.9$): Keseimbangan ideal antara koherensi dan kreativitas.
     - Nilai tinggi ($> 1.2$): Meningkatkan variasi kata, namun berisiko halusinasi atau teks acak.
   - **Top-K**: Membatasi pemilihan hanya pada $K$ token paling probabel.
   - **Top-P (Nucleus Sampling)**: Memotong ekor distribusi probabilitas saat jumlah kumulatif mencapai ambang $P$.
   - **Frequency & Presence Penalty**: Mencegah pengulangan frasa atau kata yang sama secara berulang.
3. **Melihat Proses Sampling**:
   - Klik **"Langkah Berikutnya"** untuk menghasilkan satu token baru.
   - Amati grafik batang kandidat: Kandidat yang lolos seleksi berwarna cerah, sedangkan kandidat yang tersingkir ditandai dengan garis putus-putus dan label *DIPANGKAS*.
   - Perhatikan metrik **Entropi Shannon**: Nilai entropi tinggi menunjukkan model sedang bingung/memiliki banyak alternatif kata, sedangkan entropi rendah menunjukkan model sangat yakin dengan kata berikutnya.

---

### 2.6. Tokenizer & Kalkulator Biaya (`#/tokenizer`)

Visualisator pemotongan teks menjadi token dan kalkulator estimasi biaya penggunaan API LLM.

#### Langkah Penggunaan:
1. **Menganalisis Tokenisasi Teks**:
   - Ketik atau tempelkan teks apa saja ke dalam kotak input (atau pilih contoh teks multibahasa/kode yang disediakan).
   - Pilih gaya tokenizer: **BPE** (OpenAI/Claude), **WordPiece** (BERT), atau **SentencePiece** (LLaMA/Gemini).
   - Periksa visualisasi chip token berwarna-warni di panel bawah.
   - Dekatkan kursor (*hover*) pada chip token untuk melihat indeks token, karakter asli, jumlah byte UTF-8, dan ID pseudo-token.
2. **Melihat Analisis Efisiensi Bahasa**:
   - Perhatikan rasio *Karakter per Token* dan *Token per Kata*. Teks bahasa Indonesia umumnya membutuhkan ~25% lebih banyak token dibanding bahasa Inggris untuk jumlah kata yang sama.
3. **Menghitung Biaya API**:
   - Buka tab **Kalkulator Biaya**.
   - Pilih model LLM target dan atur perkiraan volume permintaan harian/bulanan untuk melihat proyeksi tagihan inferensi.

---

### 2.7. Penjelajah Jendela Konteks (`#/context`)

Memvisualisasikan kapasitas memori model LLM dan cara kerja manajemen konteks dalam aplikasi percakapan nyata.

#### Langkah Penggunaan:
1. **Membandingkan Skala Jendela Konteks**:
   - Lihat grafik skala logaritmik yang memetakan kapasitas memori mulai dari 8K token hingga 2.5 Juta token (Gemini 3.1 Pro).
2. **Kalkulator Kapasitas Nyata ("Apa yang Muat?")**:
   - Pilih dokumen referensi (misal: *Novel Harry Potter Buku 1* setara ~77.000 kata / ~102.000 token).
   - Sistem akan menghitung berapa kali novel tersebut dapat dimuat sekaligus ke dalam memori model AI pilihan Anda.
3. **Simulasi Retensi Memori Chat Multi-Turn**:
   - Pelajari perbedaan antara strategi **Sliding Window FIFO** (pesan lama langsung terhapus) vs **Dynamic Summarization** (pesan lama diringkas menjadi poin-poin memori esensial).

---

### 2.8. Laboratorium Prompt Engineering (`#/prompting`)

Menyusun instruksi prompt berkualitas produksi menggunakan kerangka kerja terstruktur RISEN.

#### Langkah Penggunaan:
1. **Menggunakan Penyusun Prompt RISEN**:
   - Isi 5 kolom input kerangka kerja:
     - **R (Role)**: Tentukan identitas ahli AI (misal: *"Senior Cloud Security Architect"*).
     - **I (Input Context)**: Masukkan kode, dokumen, atau data yang perlu dianalisis.
     - **S (Steps)**: Tuliskan langkah berurutan yang wajib dieksekusi model.
     - **E (Expectation)**: Nyatakan format jawaban spesifik yang diinginkan (misal: *"Tabel Markdown dengan kolom Temuan, Dampak, dan Solusi"*).
     - **N (Narrowing / Constraints)**: Berikan batasan larangan tegas (misal: *"Jangan gunakan jargon rumit, batas maksimal 200 kata"*).
2. **Memeriksa Skor Kelengkapan (Quality Meter)**:
   - Pantau meteran kualitas (0–100%). Indikator akan berubah hijau ketika seluruh 8 kriteria terpenuhi.
   - Klik tombol **"Salin Prompt Lengkap"** untuk langsung menggunakannya di ChatGPT, Claude, atau aplikasi AI Anda.
3. **Mempelajari 8 Teknik Lanjutan**:
   - Buka tab teknik untuk mempelajari *Few-Shot, Chain-of-Thought, ReAct, Role Prompting*, dll. Klik tombol **Sebelum / Sesudah** untuk membandingkan output prompt amatir vs prompt profesional.

---

### 2.9. Glosarium AI 150+ Istilah (`#/glossary`)

Kamus referensi istilah kecerdasan buatan terlengkap dengan definisi dwibahasa (Bahasa Indonesia & English).

#### Langkah Penggunaan:
1. **Mencari Istilah**:
   - Ketik istilah yang ingin Anda ketahui pada kotak pencarian (misal: *Temperature*, *LoRA*, *RAG*, *Quantization*, *Hallucination*).
   - Teks yang cocok akan otomatis disorot dengan warna kuning pada deskripsi istilah.
2. **Menyaring Kategori**:
   - Klik pil kategori (misal: *Arsitektur & Konsep Dasar*, *Inferensi & Sampling*, *Prompt Engineering*, *Keamanan AI*).
3. **Melompat Berdasarkan Abjad (A–Z Jump Bar)**:
   - Klik huruf awal (misal: `T`, `R`, `S`) pada baris abjad untuk melompat langsung ke istilah terkait.
4. **Membagikan Istilah**:
   - Salin URL di bilah browser (misal: `https://bench.vijeron.com/#/glossary?q=Temperature`) untuk membagikan definisi istilah tersebut ke rekan kerja Anda.

---

## 3. Tanya Jawab Umum (FAQ)

**Q: Apakah data teks, prompt, atau dokumen yang saya masukkan diunggah ke server?**  
*A: Sama sekali tidak. Seluruh komputasi, simulasi sampling token, tokenisasi teks, dan perhitungan biaya dijalankan 100% secara lokal di CPU peramban (browser) perangkat Anda. Tidak ada server backend, tidak ada database eksternal, dan tidak ada pelacakan pribadi.*

**Q: Mengapa skor pada beberapa halaman bertanda "Data Demonstrasi / Illustrative"?**  
*A: Sebagai platform yang menjunjung tinggi integritas data, status data diatur pada `js/config.js`. Status `illustrative` menandakan angka skor dan harga ditampilkan sebagai peragaan metodologi pembobotan BenchLM. Ketika data telah diverifikasi penuh dengan laporan benchmark resmi vendor, status akan beralih ke `sourced`.*

**Q: Mengapa teks bahasa Indonesia menghasilkan lebih banyak token dibanding bahasa Inggris?**  
*A: Sebagian besar model LLM dilatih dengan porsi korpus data bahasa Inggris yang dominan, sehingga vokabulari tokenizer (BPE/WordPiece) memiliki token kata utuh untuk bahasa Inggris. Kata bahasa Indonesia sering dipecah menjadi beberapa potongan subword (morfin/suku kata), menghasilkan rasio token ~1.25x lebih tinggi.*

**Q: Bagaimana cara menjalankan aplikasi ini saat tidak ada jaringan internet?**  
*A: Cukup buka aplikasi sekali saat online, lalu instal aplikasi sebagai PWA (melalui menu peramban Anda). Setelah itu, Anda dapat mematikan koneksi internet dan aplikasi tetap dapat dibuka serta digunakan secara penuh.*
