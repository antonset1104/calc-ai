# Dokumentasi Resmi LLM Lab & BenchLM

Selamat datang di pusat dokumentasi resmi **LLM Lab & BenchLM**. Dokumentasi ini disusun secara komprehensif untuk pengembang, arsitek perangkat lunak, data scientist, dan pengguna akhir.

---

## 📚 Dokumen Tersedia:

1. **[Dokumentasi Teknis (Technical Documentation)](./TECHNICAL_DOCUMENTATION.md)**
   - Arsitektur Client-Side Zero-Backend & PWA Offline-First
   - Struktur Komponen & Modul Direktori (`js/app.js`, `js/lib/*`, `js/data/*`, `js/views/*`)
   - Formulasi Matematika: Skor Komposit BenchLM, Harga Blended, Indeks Nilai (Value Index)
   - Pipeline Sampling Token: PRNG Mulberry32, Softmax Bersuhu, Top-K & Top-P Truncation, Entropi Shannon
   - Engine Tokenisasi: BPE, WordPiece, SentencePiece, Unicode & CJK Byte-Fallback, FNV-1a Hash
   - Rendering Vektor Native SVG (Radar Chart & Kurva Pareto Frontier)
   - Sistem Internasionalisasi (11 Bahasa Dunia + RTL untuk Bahasa Arab)
   - Dynamic SEO & Schema.org JSON-LD Structured Data
   - Keamanan (Strict CSP, no-eval) & Deployment Pipeline Cloudflare Pages

2. **[Spesifikasi Fungsional (Functional Documentation)](./FUNCTIONAL_DOCUMENTATION.md)**
   - Visi & Sasaran Produk
   - Rincian Fungsional 9 Modul Aplikasi:
     1. *Leaderboard Model AI (`#/leaderboard`)*: Peringkat 30+ model, profil use-case, Model Dossier modal, Pin-to-Compare, ekspor data.
     2. *Komparasi Multi-Model (`#/compare`)*: 4-slot head-to-head, 8-Axis Radar Chart, matriks benchmark, simulasi biaya bulanan, ekspor Markdown.
     3. *Pencari Model Pintar & Kurva Pareto (`#/selector`)*: Wizard 4-langkah, kalkulasi Match Score %, kurva efisiensi Pareto SVG.
     4. *Direktori Benchmark (`#/benchmarks`)*: Rincian 8 tolok ukur industri (SWE-bench, LiveCodeBench, GPQA, MMLU-Pro, dll.) dan metodologi bobot.
     5. *Simulator Sampling Token (`#/simulator`)*: Pipeline 9-tahap, slider hyperparameter, visualisasi kandidat token & pemangkasan, telemetri real-time.
     6. *Tokenizer & Kalkulator Biaya (`#/tokenizer`)*: Visualisator token subword, metrik efisiensi byte, kalkulator biaya inferensi multi-model.
     7. *Penjelajah Jendela Konteks (`#/context`)*: Skala kapasitas logaritmik, perbandingan bahan nyata, simulasi memori chat multi-turn.
     8. *Laboratorium Prompt Engineering (`#/prompting`)*: Builder framework RISEN, meteran kualitas 8 kriteria, 8 teknik prompt lanjutan, 9 templat produksi.
     9. *Glosarium AI 150+ Istilah (`#/glossary`)*: 152 istilah dwibahasa terkurasi, live search & text highlighting, filter kategori, jump bar A–Z.
   - Fitur Global Shell: Command Palette (`Ctrl+K`), World Language Picker, Dark/Light Theme, Data Notice Banner, Modal Newsletter & Advisory.

3. **[Panduan Pengguna (User Guide)](./USER_GUIDE.md)**
   - Panduan Memulai Cepat & Instalasi PWA Offline
   - Tutorial Lengkap Langkah-demi-Langkah Penggunaan Setiap Modul
   - Panduan Membaca Grafik (Radar Chart, Pareto Frontier, Bar Probabilitas Sampling)
   - Pintasan Keyboard & Tips Produktivitas
   - Tanya Jawab Umum (FAQ) seputar privasi, token bahasa Indonesia, status data, dan mode offline

4. **[XML Sitemap Standar SEO (`../sitemap.xml`)](../sitemap.xml)**
   - Terintegrasi untuk perutean dokumen dengan dukungan parameter multi-bahasa (`?lang=id`, `?lang=en`, `?lang=es`, `?lang=zh`, `?lang=ja`, `?lang=fr`, `?lang=de`, `?lang=ar`, `?lang=pt`, `?lang=ru`, `?lang=ko`) dan alternate link `xhtml:link` lengkap.

---

## 🛠️ Perintah Berguna:

- **Jalankan Pengujian Otomatis (SIT/UAT)**: `node test_sit.mjs`
- **Regenerasi XML Sitemap**: `python tools_gen_sitemap.py`
- **Regenerasi Precache Service Worker**: `python tools_gen_sw.py`
- **Build Dist Produksi**: `python build.py`
- **Jalankan Server Dev Lokal**: `python dev-server.py 8899`
