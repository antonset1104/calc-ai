# Spesifikasi Fungsional Sistem (Functional Documentation)
## LLM Lab & BenchLM Feature & Functional Requirements Specification

> **Aplikasi:** LLM Lab & BenchLM  
> **Versi:** 2.6.0  
> **Klasifikasi:** Spesifikasi Kebutuhan & Panduan Fungsional Modul  
> **Akses Publik:** `https://bench.vijeron.com`

---

## 1. Pendahuluan & Tujuan Produk (Product Vision)

**LLM Lab & BenchLM** dirancang sebagai ekosistem evaluasi model kecerdasan buatan (AI) terpadu yang menggabungkan dua pilar utama:
1. **BenchLM Leaderboard & Analytics**: Tolok ukur komparatif independen untuk 30+ model bahasa besar (LLM) kelas dunia (frontier & open-weights), menyediakan visualisasi radar multi-dimensi, analisis efisiensi Pareto (harga vs kinerja), dan simulasi anggaran token produksi.
2. **LLM Lab Interactive Computing**: Simulator sampling matematika token real-time, visualisator tokenisasi 3-engine, penjelajah batas jendela konteks, penyusun prompt framework RISEN, serta glosarium istilah AI dwibahasa komprehensif.

---

## 2. Peta Fungsional Aplikasi (Functional Architecture Map)

```
LLM Lab & BenchLM (Shell)
│
├── 1. Leaderboard Model AI (#/leaderboard)
│   ├── Tabel Peringkat 30+ Model AI (Skor BenchLM 0-100, Harga 1M Token, Kecepatan, TTFT, Elo)
│   ├── Filter Dinamis (Penyedia/Vendor, Lisensi, Arsitektur, Kategori Khusus)
│   ├── Profil Pembobotan Use-Case (General, Agents, Coding, Content/SEO, STEM Logic, Vision)
│   ├── Model Dossier Modal (Detail Metrik Benchmark, Kelebihan/Kekurangan, Best For)
│   ├── Pin-to-Compare (Sematkan hingga 4 model ke modul perbandingan)
│   └── Ekspor Dataset Mentah (Format CSV & JSON)
│
├── 2. Komparasi Head-to-Head (#/compare)
│   ├── Slot Komparasi 4 Model Berdampingan
│   ├── 6 Matchup Preset Siap Pakai (Frontier, Reasoning, Coding, Budget, Vision, Open-Weights)
│   ├── Grafik Radar 8 Dimensi Native SVG (Spider Chart)
│   ├── Matriks Skor Benchmark Lengkap dengan Penanda Pemenang (Winner Badges)
│   ├── Kalkulator Simulasi Biaya Komparatif Bulanan
│   └── Ekspor Laporan Analisis ke Format Markdown (.md)
│
├── 3. Pencari Model Pintar & Kurva Pareto (#/selector)
│   ├── Wizard Pemilihan Model 4 Tahap (Use Case, Anggaran, Latensi, Volume Bulanan)
│   ├── Sistem Kalkulasi Match Score (%) & Rekomendasi Top 3 Model
│   └── Penjelajah Kurva Efisiensi Pareto Frontier Native SVG (Log-Price vs Overall Score)
│
├── 4. Direktori & Metodologi Benchmark (#/benchmarks)
│   ├── Direktori 8 Tolok Ukur Standar Industri (SWE-bench, LiveCodeBench, GPQA, MMLU-Pro, dll.)
│   ├── Rincian Metrik, Tingkat Kesulitan, Pengembang & Metodologi Pengujian
│   └── Dokumentasi Resmi Formula Pembobotan 8 Kategori BenchLM
│
├── 5. Simulator Sampling Token (#/simulator)
│   ├── Pipeline Autoregressive Decoding 9-Tahap
│   ├── Pengatur Hyperparameter Interaktif (Temperature, Top-K, Top-P, Freq & Pres Penalty)
│   ├── Seed Randomizer Deterministik (Mulberry32 PRNG)
│   ├── Preset Skenario Sampling (Faktual, Kreatif, Kode Ketat, Eksplorasi Halusinasi)
│   ├── Step Scrubber & Kontrol Pemutaran Token-demi-Token
│   ├── Visualisasi Distribusi Probabilitas 8 Kandidat Teratas & Indikator Potong (Cutoff)
│   └── Telemetri Real-Time (Entropi Shannon dlm bit, Pool Kandidat Aktif, Waktu Eksekusi)
│
├── 6. Tokenizer & Kalkulator Biaya (#/tokenizer)
│   ├── Visualisasi 3 Gaya Tokenisasi (BPE, WordPiece, SentencePiece)
│   ├── Pewarnaan Token, Penanda Byte, dan Pseudo-Token ID (FNV-1a Hash)
│   ├── Analisis Rasio Token-ke-Kata & Efisiensi Byte UTF-8
│   └── Kalkulator Biaya Permintaan Tunggal & Proyeksi Bulanan untuk 25+ Model
│
├── 7. Penjelajah Jendela Konteks (#/context)
│   ├── Skala Logaritmik Kapasitas Konteks (8K hingga 2.5 Juta Token)
│   ├── Kalkulator "Apa yang Muat dalam Memori" (Tweet, Blog, Bab Buku, Tesis, Harry Potter, Alkitab)
│   └── Simulasi Memori Percakapan (Sliding Window Discard vs Dynamic Summarization)
│
├── 8. Laboratorium Prompt Engineering (#/prompting)
│   ├── Penyusun Prompt Interaktif Framework RISEN (Role, Input, Steps, Expectation, Narrowing)
│   ├── Skor Kelengkapan Prompt Real-Time (8 Kriteria Kualitas) & Penghitung Token
│   ├── Panduan 8 Teknik Prompt Lanjutan dengan Tab Sebelum/Sesudah (Before/After)
│   └── 9 Templat Prompt Produksi Siap Pakai Berkategori
│
├── 9. Glosarium AI 150+ Istilah (#/glossary)
│   ├── 152 Istilah AI, LLM & Machine Learning dalam 8 Kategori
│   ├── Teks Dwibahasa Penuh (Bahasa Indonesia & English)
│   ├── Pencarian Instan dengan Penyorotan Teks (Live Text Highlighting)
│   ├── Penyaring Kategori, Indeks Alfabetis A–Z & Tautan Langsung URL (?q=...)
│
└── 10. Fitur Shell & Global Platform
    ├── Command Palette Cepat (Ctrl+K / ⌘+K / /)
    ├── Modal Pemilih Bahasa Global (11 Bahasa Dunia + RTL untuk Bahasa Arab)
    ├── Pengalih Tema Gelap / Terang (Dark / Light Theme Switcher)
    ├── Spanduk Provenance Status Data (Illustrative vs Verified Data)
    ├── Modal Newsletter Radar Morning Brief & Enterprise Advisory
    └── Dukungan Offline PWA & Navigasi Tab Bar Mobile
```

---

## 3. Spesifikasi Fungsional Per Modul

### 3.1. Modul 1: Leaderboard Model AI (`#/leaderboard`)

#### Deskripsi:
Papan peringkat komparatif untuk 30+ model frontier dan open-weights (Claude 3.7/Opus 5, GPT-5.6 Sol, Grok 4.6, DeepSeek V4/R1, Gemini 3 Pro/Flash, Qwen 3.8/Coder, Llama 4.5, dll.).

#### Fitur & Interaksi:
1. **Tabel Skor Komprehensif**:
   - **Skor BenchLM (0–100)**: Skor komposit terbobot.
   - **Harga API per 1M Token**: Menampilkan harga Input, Output, dan Blended (3:1).
   - **Metrik Performa**: Kecepatan streaming (`tok/s`), *Time to First Token* (`TTFT ms`), Jendela Konteks (`tokens`), Batas Output Maksimum, dan Skor LMSYS Chatbot Arena Elo.
2. **Pengubah Bobot Berbasis Use-Case**:
   - Dropdown pilihan: *General Purpose, AI Agents, Coding & Dev, Content & SEO, STEM Logic, Vision*.
   - Saat use-case dipilih, seluruh skor model dihitung ulang secara instan di sisi klien.
3. **Penyaring & Pengurutan Multi-Kriteria**:
   - Pencarian teks nama model atau vendor.
   - Filter Lisensi: *Proprietary (API)* vs *Open Weights (Hugging Face)*.
   - Filter Vendor: Anthropic, OpenAI, Google, DeepSeek, Meta, Alibaba, Mistral, dll.
   - Urutan: Tertinggi ke Terendah (atau sebaliknya) untuk semua kolom metrik.
4. **Model Dossier Modal (Popup Spesifikasi Mendalam)**:
   - Menampilkan grafik batang 8 dimensi sub-skor.
   - Matriks nilai benchmark mentah (SWE-bench, LiveCodeBench, GPQA Diamond, MMLU-Pro, MMMU, IFEval, MATH-500).
   - Rincian Kelebihan (*Pros*), Kekurangan (*Cons*), dan Rekomendasi Beban Kerja (*Best For*).
   - Tautan langsung ke penyedia hosting inference resmi.
5. **Fitur Sematkan (Pin to Compare)**:
   - Pengguna dapat mencentang/mengeklik ikon pin pada hingga 4 model untuk dibawa langsung ke halaman komparasi.
6. **Ekspor Data**:
   - Tombol unduh dataset ke berkas `benchlm_leaderboard.csv` atau `benchlm_leaderboard.json`.

---

### 3.2. Modul 2: Komparasi Head-to-Head (`#/compare`)

#### Deskripsi:
Halaman analisis komparatif multi-model berdampingan (side-by-side) hingga 4 model secara simultan.

#### Fitur & Interaksi:
1. **Pemilih Model 4 Slot**:
   - Slot 1 sampai 4 dengan dropdown pencarian cepat.
   - Tombol hapus slot atau tambah slot baru.
2. **Matchup Preset Populer**:
   - *🏆 Frontier Titans*: Claude Opus 5 vs GPT-5.6 Sol vs Gemini 3 Pro vs Qwen3.8 Max.
   - *🧠 Reasoning Champions*: DeepSeek R1 vs o3-mini vs QwQ-32B vs Claude 3.7 Sonnet.
   - *💻 Top Coding & SWE*: Claude 3.7 Sonnet vs Qwen 2.5 Coder vs DeepSeek Coder vs Codestral.
   - *🏷️ Budget Value Kings*: DeepSeek V3 vs Gemini Flash vs Llama 3.3 70B vs Qwen 2.5 32B.
   - *👁️ Vision & Multimodal*: Gemini Pro vs Pixtral Large vs GPT-4o vs Claude 3.5 Sonnet.
   - *🔓 Open Weights Stars*: DeepSeek R1 vs Llama 3.3 70B vs Qwen 72B vs Phi-4.
3. **Grafik Radar 8 Dimensi (Native SVG Spider Chart)**:
   - Menampilkan poligon bertumpuk dengan warna beraksen kontras.
   - Area poligon terisi semi-transparan untuk memudahkan perbandingan kekuatan/kelemahan visual.
4. **Matriks Benchmark dengan Penanda Pemenang (Winner Badges)**:
   - Setiap baris metrik otomatis menandai model peraih skor tertinggi dengan lencana hijau `🏆 TERBAIK`.
5. **Simulasi Biaya Komparatif Bulanan**:
   - Slider Input Tokens per Permintaan (default: 1.500 token).
   - Slider Output Tokens per Permintaan (default: 500 token).
   - Slider Volume Permintaan Bulanan (default: 50.000 request/bulan).
   - Menghitung total tagihan bulanan masing-masing model dan persentase penghematan biaya terhadap model termahal.
6. **Ekspor Laporan Markdown**:
   - Mengunduh rangkuman tabel perbandingan dalam format Markdown (`.md`) yang siap disalin ke dokumentasi tim atau Notion.

---

### 3.3. Modul 3: Pencari Model Pintar & Kurva Pareto (`#/selector`)

#### Deskripsi:
Panduan pintar 4-langkah untuk memilih model yang paling sesuai dengan batasan teknis dan anggaran, dilengkapi grafik batas efisiensi ekonomi AI (Pareto Frontier).

#### Fitur & Interaksi:
1. **Wizard 4 Langkah**:
   - **Langkah 1 (Use Case)**: Pilihan kategori prioritas (Coding, Agen Otonom, Penalaran STEM, RAG & Dokumen Panjang, Chat Real-Time, Vision).
   - **Langkah 2 (Anggaran)**: Bebas/Kualitas Maksimal, Seimbang (< $3/1M), Super Hemat (< $0.50/1M), atau Khusus Open Weights.
   - **Langkah 3 (Latensi)**: Fleksibel, Cepat (> 80 tok/s), atau Real-Time (< 350ms TTFT).
   - **Langkah 4 (Volume Permintaan)**: Parameter token input, output, dan jumlah request bulanan.
2. **Hasil Rekomendasi Top 3**:
   - Menampilkan kartu peringkat #1, #2, #3 dengan *Match Score* (%), estimasi biaya bulanan, dan ulasan alasan mengapa model tersebut cocok (*Why Match*).
3. **Kurva Efisiensi Pareto (SVG Chart)**:
   - Memetakan seluruh model dalam ruang 2D: Sumbu-X (Harga Blended logaritmik) vs Sumbu-Y (Skor BenchLM).
   - Garis putus-putus menghubungkan titik-titik optimal Pareto (model yang tidak dapat dikalahkan dalam hal performa tanpa menaikkan harga).
   - Mengklik lingkaran model pada grafik akan langsung membuka Model Dossier.

---

### 3.4. Modul 4: Direktori & Metodologi Benchmark (`#/benchmarks`)

#### Deskripsi:
Direktori tolok ukur evaluasi AI standar industri global dan dokumentasi transparansi formula pembobotan BenchLM.

#### Fitur & Interaksi:
1. **Daftar Tolok Ukur Standar**:
   - **SWE-bench Verified**: Resolusi bug GitHub dunia nyata (Pengembang: Princeton NLP).
   - **LiveCodeBench**: Evaluasi coding anti-kontaminasi (LiveCodeBench Team).
   - **GPQA Diamond**: Penalaran sains tingkat pascasarjana/PhD (NYU / Anthropic).
   - **MMLU-Pro**: Pengetahuan akademik 10-pilihan lanjutan (TIGER Lab).
   - **MMMU (Val)**: Pemahaman visual dan penalaran multimodal (MMMU Consortium).
   - **IFEval**: Kepatuhan instruksi format objektif (Google Research).
   - **MATH-500**: Pemecahan masalah olimpiade matematika (UC Berkeley).
   - **LMSYS Chatbot Arena**: Peringkat preferensi manusia *crowdsourced blind Elo* (LMSYS Org).
2. **Dokumentasi Formula Pembobotan**:
   - Menjelaskan rasio persentase 8 kategori, alasan ilmiah di balik pembobotan, serta dampak metrik terhadap stabilitas produksi.

---

### 3.5. Modul 5: Simulator Sampling Token (`#/simulator`)

#### Deskripsi:
Laboratorium visual interaktif untuk mempelajari bagaimana LLM memilih token berikutnya (*next-token prediction*) melalui manipulasi matematika logit dan probabilitas.

#### Fitur & Interaksi:
1. **Panel Kontrol Hyperparameter**:
   - **Temperature ($0.00 - 2.00$)**: Mengatur keacakan distribusi probabilitas (0 = Greedy/Argmax).
   - **Top-K ($1 - 100$)**: Membatasi sampling hanya pada $K$ kandidat teratas.
   - **Top-P / Nucleus ($0.00 - 1.00$)**: Membatasi kandidat pada ambang kumulatif probabilitas.
   - **Frequency Penalty ($0.00 - 2.00$)**: Mengurangi logit token proporsional terhadap frekuensi kemunculannya.
   - **Presence Penalty ($0.00 - 2.00$)**: Mengurangi logit token jika token sudah pernah muncul minimal 1 kali.
   - **PRNG Seed**: Angka integer untuk menjamin replikasi hasil pengacakan.
2. **Preset Eksperimen**:
   - *Faktual & Presisi*: $T=0.2, Top-P=0.9, Top-K=20$.
   - *Penulisan Kreatif*: $T=0.85, Top-P=0.95, Top-K=50$.
   - *Kode Program Ketat*: $T=0.0, Top-P=1.0$ (Greedy).
   - *Eksplorasi Halusinasi*: $T=1.6, Top-P=1.0, Top-K=100$.
3. **Step Scrubber & Generator Token**:
   - Tombol *Langkah Berikutnya (Next Step)*: Menghasilkan 1 token baru.
   - Tombol *Jalankan Otomatis (Auto Play / Pause)*.
   - Tombol *Reset* dan *Penelusur Riwayat (Scrubber Slider)* untuk kembali ke langkah sebelumnya.
4. **Visualisasi Distribusi Probabilitas 8 Kandidat**:
   - Grafik batang horizontal menampilkan kandidat token, probabilitas asli ($p$), probabilitas setelah potong ($p_{\text{final}}$), dan status apakah dipangkas oleh Top-K/Top-P (`cut: true`).
5. **Dashboard Telemetri Real-Time**:
   - **Entropi Informasi Shannon ($H$)**: Indikator tingkat keraguan/ketidakpastian model dalam satuan bit.
   - **Ukuran Pool Kandidat Aktif**: Jumlah token yang lolos filter pemangkasan.

---

### 3.6. Modul 6: Tokenizer & Kalkulator Biaya (`#/tokenizer`)

#### Deskripsi:
Visualisator segmentasi teks ke dalam token subword menggunakan 3 arsitektur tokenizer utama dan kalkulator biaya inferensi API.

#### Fitur & Interaksi:
1. **Perbandingan 3 Tokenizer**:
   - **BPE (Byte-Pair Encoding)**: Gaya OpenAI GPT-4/GPT-5, Claude, DeepSeek.
   - **WordPiece**: Gaya BERT dengan penanda morfem `##`.
   - **SentencePiece**: Gaya LLaMA, Gemini, Mistral dengan karakter spasi meta `_`.
2. **Visualisasi Chip Token**:
   - Setiap token diwarnai dengan palet kontras bergantian.
   - Hover pada token menampilkan: Indeks Token, Teks Mentah, Ukuran Byte UTF-8, dan Pseudo-Token ID (FNV-1a).
3. **Metrik Statistik Tokenisasi**:
   - Jumlah Karakter, Jumlah Kata, Jumlah Byte, Jumlah Token, Rasio Karakter/Token, dan Rasio Token/Kata.
4. **Kalkulator Biaya Multi-Model**:
   - Memilih model dari katalog 25+ model AI.
   - Mengatur frekuensi permintaan (per hari / per bulan).
   - Menghitung estimasi biaya input, output, total biaya bulanan, dan proyeksi tahunan.

---

### 3.7. Modul 7: Penjelajah Jendela Konteks (`#/context`)

#### Deskripsi:
Alat eksplorasi batas memori LLM dan simulator strategi retensi memori percakapan panjang.

#### Fitur & Interaksi:
1. **Visualisasi Skala Konteks (Log Scale)**:
   - Membandingkan kapasitas model dari 8K token (SmolLM2), 128K (DeepSeek V3), 200K (Claude 3.7), 1M (Claude Opus 5, GPT-5.6), hingga 2.5M token (Gemini 3.1 Pro).
2. **Kalkulator "Apa yang Muat dalam Konteks"**:
   - Memilih materi dunia nyata: 1 Unggahan Medsos (40 kata), Artikel Blog (1.200 kata), Bab Buku (4.000 kata), Skripsi Tipis (15.000 kata), Novel Harry Potter (77.000 kata), Trilogi Lord of the Rings (480.000 kata), atau Seluruh Alkitab KJV (783.000 kata).
   - Menghitung berapa kali dokumen tersebut dapat dimuat sekaligus ke dalam jendela konteks model yang dipilih.
3. **Simulasi Memori Percakapan (Chat Memory Simulator)**:
   - Menyimulasikan percakapan multi-turn yang melebihi batas token.
   - Mode 1: *Sliding Window FIFO (First-In First-Out)* — pesan terlama langsung dibuang.
   - Mode 2: *Dynamic Summarization* — pesan lama dipadatkan menjadi rangkuman ringkas untuk mempertahankan konteks semantik.

---

### 3.8. Modul 8: Laboratorium Prompt Engineering (`#/prompting`)

#### Deskripsi:
Lingkungan penyusunan prompt berbasis kerangka kerja profesional RISEN dan panduan interaktif 8 teknik rekayasa prompt tingkat lanjut.

#### Fitur & Interaksi:
1. **Penyusun Prompt Interaktif RISEN**:
   - Form input 5 komponen inti:
     - **R (Role)**: Peran & identitas AI (mis. *"Senior Security Engineer"*).
     - **I (Input Context)**: Data masukan, kode sumber, atau latar belakang masalah.
     - **S (Steps)**: Langkah-langkah instruksi bertahap yang wajib diikuti.
     - **E (Expectation)**: Format keluaran yang diharapkan (JSON, Markdown, Tabel, dll.).
     - **N (Narrowing / Constraints)**: Batasan negatif (apa yang dilarang/tidak boleh dilakukan).
   - **Meteran Kualitas Real-Time (8 Kriteria Kelengkapan)**:
     - Memeriksa kelengkapan peran, kejelasan konteks, instruksi berurutan, spesifikasi format, batasan negatif, variabel dinamis, panjang teks optimal, dan keterbacaan.
   - **Penghitung Token Otomatis**: Memantau konsumsi token prompt sebelum dikirim.
2. **Koleksi 8 Teknik Prompt Lanjutan (Dengan Tab Before / After)**:
   - *Few-Shot Prompting, Chain-of-Thought (CoT), Zero-Shot CoT, ReAct (Reason + Act), Role Prompting, Directional Stimulus, Structured Output Constraint, Self-Consistency*.
3. **9 Templat Prompt Produksi Siap Pakai**:
   - Kategori: *Code Review, Architecture Design, SQL Optimization, Bug Debugging, Security Audit, Unit Testing, API Documentation, Executive Summary, RAG Query Expansion*.

---

### 3.9. Modul 9: Glosarium AI 150+ Istilah (`#/glossary`)

#### Deskripsi:
Kamus referensi istilah AI, Machine Learning, dan rekayasa LLM terlengkap dengan teks dwibahasa (Bahasa Indonesia & English).

#### Fitur & Interaksi:
1. **152 Istilah Terkurasi dalam 8 Kategori**:
   - *Arsitektur & Konsep Dasar, Pelatihan & Fine-Tuning, Inferensi & Sampling, Evaluasi & Benchmark, Prompt Engineering, Keamanan & AI Alignment, Infrastruktur & Hardware, RAG & AI Agents*.
2. **Pencarian Instan dengan Penyorotan Teks (Live Text Highlighting)**:
   - Mengetikkan kata kunci langsung memfilter daftar dan memberikan highlight warna kuning pada teks yang cocok.
3. **Penyaring Kategori & Indeks Alfabetis (A–Z Jump Bar)**:
   - Tombol pintas untuk melompat langsung ke huruf abjad tertentu.
4. **URL Deep-Linking**:
   - Mendukung parameter URL seperti `#/glossary?q=temperature` untuk dibagikan secara langsung.

---

### 3.10. Fitur Lintas Aplikasi (Global Shell & Utilities)

1. **Command Palette (`Ctrl+K` / `⌘+K` / `/`)**:
   - Akses pencarian universal cepat mencakup seluruh halaman aplikasi, alat kalkulator, 30+ model AI, 8 tolok ukur benchmark, dan 152 istilah glosarium.
2. **Pemilih Bahasa Dunia (11 Bahasa + Dukungan RTL)**:
   - Modal pilihan bahasa: ID, EN, ES, ZH, JA, FR, DE, AR, PT, RU, KO.
   - Mendukung otomatisasi perataan kanan-ke-kiri (*Right-to-Left / RTL*) untuk Bahasa Arab (`dir="rtl"`).
3. **Pengalih Tema Gelap / Terang (Dark/Light Switcher)**:
   - Deteksi preferensi sistem operasi (`prefers-color-scheme`) otomatis dan penyimpanan pilihan manual ke `localStorage`.
4. **Modal Newsletter & Enterprise Advisory (Konfigurasi Fleksibel)**:
   - Diatur terpusat di `js/config.js` (`LEADGEN.newsletter` dan `LEADGEN.advisory`).
   - Formulir dapat terhubung ke endpoint kustom atau draf email pengguna (*mailto*).
5. **Dukungan Progressive Web App (PWA) & Mobile Tab Bar**:
   - Navigasi bawah 5 menu utama yang dioptimalkan untuk layar smartphone dan tablet.
   - Kemampuan berfungsi offline 100%.
