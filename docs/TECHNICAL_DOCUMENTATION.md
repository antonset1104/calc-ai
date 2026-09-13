# Dokumentasi Teknis Sistem (Technical Documentation)
## LLM Lab & BenchLM Architecture, Engine & Implementation Specification

> **Versi:** 2.6.0  
> **Status:** Production Ready  
> **Lisensi:** MIT  
> **Arsitektur:** 100% Client-Side Single Page Application (Zero-Backend, Edge-Ready)  
> **Domain Live:** `https://bench.vijeron.com` (Cloudflare Pages: `bench-vijeron.pages.dev`)

---

## 1. Ikhtisar Arsitektur (System Architecture Overview)

LLM Lab & BenchLM adalah platform evaluasi model AI independen dan laboratorium komputasi interaktif yang dibangun menggunakan pendekatan **Zero-Backend Architecture**. Seluruh logika komputasi, simulasi sampling token, kalkulasi bobot benchmark, pemrosesan tokenisasi, rendering grafik vektor (SVG), internasionalisasi (i18n), dan perutean (routing) dieksekusi secara native di peramban (browser) pengguna menggunakan standar Web ECMAScript modern (ES2022+).

```
+---------------------------------------------------------------------------------------+
|                                    USER BROWSER                                       |
+---------------------------------------------------------------------------------------+
|                                                                                       |
|  [ DOM Viewport / Responsive UI ] <----------------------------------------+          |
|       |                                                                    |          |
|       v                                                                    |          |
|  [ Shell Controller (js/app.js) ]                                          |          |
|       |                                                                    |          |
|       +---> [ Hash Router & View Lifecycle ]                              |          |
|       |        |---> Dynamic Import: js/views/*.js                         |          |
|       |        |---> Render Token & Teardown Cleanup                       |          |
|       |                                                                    |          |
|       +---> [ Reactive State Store ]                                       |          |
|       |        |---> Language Preference (ID, EN, ES, ZH, JA, FR, ...)     |          |
|       |        |---> Theme Preference (Dark / Light)                       |          |
|       |        |---> LocalStorage Synchronization                          |          |
|       |                                                                    |          |
|       +---> [ Global Command Palette (Ctrl+K) ]                            |          |
|       |                                                                    |          |
|       +---> [ Core Computational Engines (js/lib/) ]                       |          |
|                |---> sampling.js   : Mulberry32 PRNG, Softmax, Top-K/Top-P |          |
|                |---> tokenizer.js  : BPE, WordPiece, SentencePiece         |          |
|                |---> charts.js     : Dynamic SVG Radar & Pareto Charts     |          |
|                |---> seo.js        : Dynamic Meta & Schema.org JSON-LD     |          |
|                |---> i18n.js       : 11-Language Engine + Arabic RTL       |          |
|                |---> ui.js         : Functional Virtual DOM Helpers        |          |
|                |---> model.js      : Cost & Context Calculations           |          |
|                +---> monetize.js   : Lead-Gen & Export Utilities           |          |
|                                                                            |          |
|  [ Static Datasets (js/data/) ]                                            |          |
|       |---> leaderboard.js : 30+ Models, 8-Category Benchmarks             |          |
|       |---> models.js      : Pricing Snapshot, Context Sizes & References  |          |
|       +---> glossary.js    : 152 Bilingual AI Terms                        |          |
|                                                                            |          |
|  [ Progressive Web App (PWA) Layer ]                                       |          |
|       |---> Service Worker (sw.js) : Cache-First Offline Pre-caching       |          |
|       +---> Web App Manifest (manifest.json)                               |          |
+----------------------------------------------------------------------------|----------+
                                                                             |
+----------------------------------------------------------------------------|----------+
|                             STATIC HOSTING EDGE                            |          |
|                 (Cloudflare Pages / GitHub Pages / NGINX)                  |          |
|  _headers (Strict CSP, nosniff, cache-control)                             |          |
|  index.html, css/style.css, assets/icon.svg                                +----------+
+---------------------------------------------------------------------------------------+
```

### Keunggulan Arsitektur:
1. **Zero Latency & 100% Privacy**: Tidak ada data teks input, prompt, atau kunci API yang dikirimkan ke server eksternal.
2. **Offline First (PWA)**: Aplikasi dapat diinstal ke perangkat dan berfungsi penuh tanpa koneksi internet setelah pemuatan pertama melalui Service Worker.
3. **High Performance**: Beban komputasi terdistribusi di CPU klien, mengurangi biaya infrastruktur server menjadi $0 (Zero Server Cost).
4. **Keamanan Maksimal**: Kebijakan Keamanan Konten (Content Security Policy) ketat tanpa injeksi `unsafe-eval` atau script pihak ketiga tak terpercaya.

---

## 2. Struktur Direktori & Komponen File

```
calc-ai/
│
├── index.html                  # Dokumen induk HTML5, Shell UI, Modals & Metadata
├── manifest.json               # Konfigurasi PWA (Web App Manifest)
├── sw.js                       # Service Worker untuk precache dan offline cache
├── _headers                    # Header keamanan (CSP, HSTS, Cache-Control) Cloudflare Pages
├── robots.txt                  # Direktif pengindeksan crawler mesin pencari
├── sitemap.xml                 # XML Sitemap dengan alternate hreflang 11 bahasa
├── ads.txt                     # Konfigurasi otorisasi iklan Google AdSense
├── build.py                    # Skrip Python untuk build produksi (menghasilkan dist/)
├── dev-server.py               # Local HTTP dev server dengan Cache-Control: no-store
├── tools_gen_sitemap.py        # Generator otomatis XML sitemap multi-bahasa
├── tools_gen_sw.py             # Generator hash precache untuk Service Worker
├── test_sit.mjs                # Pengujian statis otomatis (SIT/UAT) Node.js ES Modules
├── test_i18n_standalone.mjs    # Validasi integritas terjemahan multi-bahasa
├── README.md                   # Dokumentasi ringkasan proyek
│
├── assets/
│   └── icon.svg                # Vektor ikon aplikasi adaptif SVG
│
├── css/
│   └── style.css               # Desain sistem modular, Token CSS, Tema Gelap/Terang, RTL
│
├── docs/
│   ├── TECHNICAL_DOCUMENTATION.md   # Dokumentasi teknis lengkap ini
│   ├── FUNCTIONAL_DOCUMENTATION.md  # Spesifikasi fungsional dan detail fitur
│   └── USER_GUIDE.md                # Panduan pengguna dan tutorial lengkap
│
└── js/
    ├── app.js                  # Entry point aplikasi: Router, State Store, Shell & Palette
    ├── config.js               # Konfigurasi data status, kontak, snapshot & sponsor
    │
    ├── data/
    │   ├── leaderboard.js      # Dataset 30+ model AI, 8 kategori bobot, 8 benchmark
    │   ├── models.js           # Dataset katalog harga API, context window & referensi teks
    │   └── glossary.js         # Dataset 152 istilah AI dwibahasa (ID/EN)
    │
    ├── lib/
    │   ├── ui.js               # Library DOM builder fungsional (el, card, stat, toast, slider)
    │   ├── sampling.js         # Algoritma sampling: Mulberry32 PRNG, Softmax, Top-K/P, Entropy
    │   ├── tokenizer.js        # Engine tokenisasi: BPE, WordPiece, SentencePiece, Byte-Fallback
    │   ├── charts.js           # Generator SVG responsif: Radar Chart & Pareto Frontier
    │   ├── i18n.js             # Engine multi-bahasa 11 bahasa & RTL controller
    │   ├── seo.js              # Injektor Dynamic Meta Tags & Schema.org JSON-LD
    │   ├── model.js            # Kalkulator biaya token & estimasi kapasitas konteks
    │   └── monetize.js         # Pengelola modal newsletter/advisory & eksportir markdown
    │
    └── views/
        ├── leaderboard.js      # View: Tabel peringkat model AI & Model Dossier modal
        ├── compare.js          # View: Komparasi 4 model, Radar Chart & simulasi biaya
        ├── selector.js         # View: Wizard pemilihan model pintar & Kurva Pareto
        ├── benchmarks.js       # View: Direktori tolok ukur & dokumentasi formula bobot
        ├── simulator.js        # View: Simulator sampling token 9-tahap interaktif
        ├── tokenizer.js        # View: Visualisator token & kalkulator biaya multi-model
        ├── context.js          # View: Penjelajah jendela konteks & simulasi memori chat
        ├── prompting.js        # View: Penyusun prompt RISEN & 8 teknik prompt engineering
        └── glossary.js         # View: Glosarium 152 istilah AI dengan pencarian instan
```

---

## 3. Formulasi Matematika & Algoritma Komputasi

### 3.1. Formula Skor Komposit BenchLM (Weighted Overall Score)

Skor BenchLM ($S_{\text{overall}}$) dihitung dengan menjumlahkan skor terbobot pada 8 kategori evaluasi utama:

$$S_{\text{overall}} = \frac{\sum_{i=1}^{8} (S_i \times w_i)}{\sum_{i=1}^{8} w_i}$$

Di mana:
- $S_i$ adalah skor performa model pada kategori ke-$i$ (skala $0 - 100$).
- $w_i$ adalah bobot kategori ke-$i$.

#### Matriks Bobot Standar dan Profil Use-Case:
| Kategori ($i$) | ID Kategori | Bobot Standar ($w_i$) | Agents | Coding | Content/SEO | STEM Logic | Vision |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| 1. Agentic & Tool Use | `agentic` | **0.22 (22%)** | 0.45 | 0.22 | 0.04 | 0.04 | 0.08 |
| 2. Coding & Rekayasa | `coding` | **0.20 (20%)** | 0.25 | 0.52 | 0.02 | 0.12 | 0.04 |
| 3. Penalaran Rumit | `reasoning` | **0.17 (17%)** | 0.18 | 0.16 | 0.18 | 0.44 | 0.14 |
| 4. Pengetahuan & Fakta | `knowledge` | **0.12 (12%)** | 0.05 | 0.03 | 0.36 | 0.10 | 0.14 |
| 5. Multimodal & Visual | `multimodal` | **0.12 (12%)** | 0.04 | 0.02 | 0.10 | 0.05 | 0.52 |
| 6. Multibahasa | `multilingual` | **0.07 (7%)** | 0.01 | 0.02 | 0.20 | 0.01 | 0.06 |
| 7. Kepatuhan Arahan | `instruction` | **0.05 (5%)** | 0.01 | 0.01 | 0.10 | 0.04 | 0.02 |
| 8. Matematika Mahir | `math` | **0.05 (5%)** | 0.01 | 0.02 | 0.00 | 0.20 | 0.00 |
| **Total** | | **1.00 (100%)** | **1.00** | **1.00** | **1.00** | **1.00** | **1.00** |

---

### 3.2. Formulasi Harga Blended (Blended API Price)

Untuk merefleksikan rasio konsumsi token umum pada aplikasi produksi (rasio 3 bagian prompt input berbanding 1 bagian completion output):

$$P_{\text{blended}} = \frac{3 \times P_{\text{in}} + 1 \times P_{\text{out}}}{4} \quad (\text{USD per 1M Token})$$

---

### 3.3. Indeks Efisiensi Nilai (Value Index Formula)

Value Index ($VI$) mengukur efisiensi komputasi terhadap biaya secara logaritmik agar model berbiaya ultra-rendah tidak mendistorsi skala secara eksponensial:

$$VI = \frac{S_{\text{overall}}}{1 + 1.8 \times \log_{10}(\max(0.1, P_{\text{blended}}) + 1)}$$

---

### 3.4. Pipeline Matematika Sampling Token (`js/lib/sampling.js`)

Pipeline sampling mensimulasikan proses autoregressive decoding LLM melalui 5 tahap matematis:

```
[ Logit Mentah (Raw Logits) ]
            │
            ▼
[ Penalti Frekuensi & Presensi ] ──> logit' = logit - (freqPen * count + presPen * [count > 0])
            │
            ▼
[ Suhu (Temperature Scaling) ] ───> z_i = (logit'_i - max(logit')) / T
            │
            ▼
[ Softmax Normalization ] ────────> p_i = exp(z_i) / Σ exp(z_j)
            │
            ▼
[ Pemangkasan Top-K & Top-P ] ────> Filter K tertinggi & kumulatif p <= topP; Renormalisasi
            │
            ▼
[ Seleksi Token (Mulberry32 PRNG) ] > Sampling acak berbobot p_final
```

#### Detail Persamaan Matematis:
1. **Penalti Pengulangan (Frequency & Presence Penalty)**:
   $$\text{logit}_i' = \text{logit}_i - \left( \alpha_{\text{freq}} \times c_i + \alpha_{\text{pres}} \times \mathbb{I}(c_i > 0) \right)$$
   Di mana $c_i$ adalah frekuensi kemunculan token $i$, $\alpha_{\text{freq}}$ adalah koefisien penalti frekuensi, dan $\alpha_{\text{pres}}$ adalah koefisien penalti kehadiran.

2. **Softmax Bersuhu dengan Stabilitas Numerik (Temperature Softmax)**:
   $$z_{\max} = \max_j(\text{logit}_j')$$
   $$p_i = \frac{\exp\left(\frac{\text{logit}_i' - z_{\max}}{T}\right)}{\sum_{j=1}^{V} \exp\left(\frac{\text{logit}_j' - z_{\max}}{T}\right)}$$
   *Catatan:* Jika $T \le 0.01$, algoritma beralih ke seleksi *Greedy* ($\text{argmax}$).

3. **Pemangkasan Nucleus (Top-K & Top-P Truncation)**:
   - Ambil subset $S_K$ berukuran $K$ dengan probabilitas $p_i$ tertinggi.
   - Urutkan menurun: $p_{(1)} \ge p_{(2)} \ge \dots \ge p_{(K)}$.
   - Tentukan indeks potong minimum $m$ sedemikian rupa sehingga:
     $$\sum_{j=1}^{m} p_{(j)} \ge P_{\text{top\_p}}$$
   - Renormalisasi probabilitas kandidat yang dipertahankan:
     $$p_{i,\text{final}} = \frac{p_i}{\sum_{j \in S_{\text{kept}}} p_j}$$

4. **Entropi Informasi Shannon (Shannon Entropy)**:
   Entropi diukur pada distribusi probabilitas sebelum pemangkasan untuk menggambarkan tingkat ketidakpastian model murni:
   $$H(X) = -\sum_{i=1}^{V} p_i \log_2(p_i) \quad (\text{bit})$$

5. **PRNG Deterministik (Mulberry32)**:
   Algoritma Pseudo-Random Number Generator 32-bit deterministik berbasis seed integer:
   ```javascript
   function rng(seed) {
     let a = seed >>> 0;
     return function next() {
       a = (a + 0x6D2B79F5) >>> 0;
       let t = a;
       t = Math.imul(t ^ (t >>> 15), t | 1);
       t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
       return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
     };
   }
   ```

---

### 3.5. Arsitektur Engine Tokenisasi (`js/lib/tokenizer.js`)

Sistem tokenisasi menyediakan 3 mode pendekatan representasi:
1. **BPE (Byte-Pair Encoding)**: Pola tokenisasi subword berbasis penggabungan pasangan byte berulang (standar OpenAI GPT-4/GPT-5, Claude, DeepSeek).
2. **WordPiece**: Pemecahan kata berbasis prefiks dan morfem dengan penanda kelanjutan `##` (standar BERT).
3. **SentencePiece**: Tokenisasi berbasis spasi eksplisit (karakter meta `_` / `\u2581`), cocok untuk model multilingual dan ragam skrip (standar LLaMA, Gemini, Mistral).

#### Penanganan Karakter Multibahasa & Unicode:
- **Karakter CJK (Chinese, Japanese, Korean)**: UTF-8 3-byte per karakter dihitung setara ~1 token per aksara.
- **Emoji & Karakter Non-BMP**: UTF-8 4-byte dialokasikan menjadi 2 token (karakter dasar + byte fallback).
- **Morfologi Bahasa Indonesia**: Dilengkapi aturan pemotongan afiks (prefiks: *mem-, ber-, ter-, peng-, di-*; sufiks: *-kan, -nya, -lah, -an, -isasi*).
- **ID Token Semu (FNV-1a Hash)**:
  $$h_0 = 2166136261$$
  $$h_k = (h_{k-1} \oplus c_k) \times 16777619 \pmod{2^{32}}$$
  $$\text{Token ID} = h_N \pmod{100000}$$

---

## 4. Manajemen State & Siklus Hidup Router (Router & Lifecycle)

Sistem menggunakan router berbasis `location.hash` (`#/leaderboard`, `#/compare`, dll.) tanpa ketergantungan library eksternal.

```javascript
// Siklus Eksekusi Navigasi Router:
1. window.addEventListener('hashchange', renderRoute);
2. renderRoute() diinvokasi:
   a. Inkrementasi renderToken (Mencegah race-condition asynchronous)
   b. Eksekusi destroyCurrent() jika view sebelumnya memiliki cleanup listener
   c. Tampilkan skeleton loading animation & progress bar aktif
   d. Dynamic import view module: await route.load()
   e. Verifikasi renderToken == currentToken
   f. Buat container view: const root = el('div.view')
   g. Eksekusi modul view: destroyCurrent = mod.render(root, ctx())
   h. Injeksi Data Notice Banner (js/config.js DATA_STATUS)
   i. Pasangkan aksesibilitas autoLabel(root)
   j. Update SEO Title, Meta Tags & Schema.org JSON-LD: updateSEO(id, store.lang)
   k. Reset progress bar dan scroll ke posisi atas
```

### Context Object (`ctx`) yang Disediakan ke Setiap View:
```typescript
interface ViewContext {
  lang: string;                         // Kode bahasa aktif ('id', 'en', ...)
  params: URLSearchParams;              // Query parameters dari URL hash
  go: (hash: string) => void;           // Fungsi navigasi programmatic
  toast: (msg: string) => void;         // Notifikasi toast non-blocking
  onLangChange: ((lang: string) => void) | null;
}
```

---

## 5. Sistem Internasionalisasi (i18n & RTL Engine)

Modul `js/lib/i18n.js` mengelola 11 bahasa dunia secara terintegrasi:

| Kode | Bahasa | Nama Asli | Arah Teks (`dir`) | Bendera |
| :---: | :--- | :--- | :---: | :---: |
| `id` | Bahasa Indonesia | Bahasa Indonesia | `ltr` | 🇮🇩 |
| `en` | English | English | `ltr` | 🇺🇸 |
| `es` | Español | Spanish | `ltr` | 🇪🇸 |
| `zh` | 简体中文 | Simplified Chinese | `ltr` | 🇨🇳 |
| `ja` | 日本語 | Japanese | `ltr` | 🇯🇵 |
| `fr` | Français | French | `ltr` | 🇫🇷 |
| `de` | Deutsch | German | `ltr` | 🇩🇪 |
| `ar` | العربية | Arabic | **`rtl`** | 🇸🇦 |
| `pt` | Português | Portuguese | `ltr` | 🇧🇷 |
| `ru` | Русский | Russian | `ltr` | 🇷🇺 |
| `ko` | 한국어 | Korean | `ltr` | 🇰🇷 |

### Hierarki Resolusi Bahasa:
$$\text{Bahasa Terpilih} \to \text{English ('en')} \to \text{Bahasa Indonesia ('id')} \to \text{Fallback Pertama}$$

---

## 6. Rendering Grafik Vektor Native SVG (`js/lib/charts.js`)

Semua grafik dirender murni dalam format SVG tanpa library charting pihak ketiga seperti Chart.js atau D3, menghasilkan output super ringan (<15KB) dan responsif.

### 6.1. Radar / Spider Chart 8 Dimensi (`createRadarChart`)
- Menghitung koordinat titik poligon pada bidang 2D berbasis radius polar:
  $$\theta_k = \frac{2\pi \cdot k}{N} - \frac{\pi}{2}$$
  $$x_k = x_0 + r_k \cdot \cos(\theta_k), \quad y_k = y_0 + r_k \cdot \sin(\theta_k)$$
  Di mana $r_k = \frac{S_k}{100} \cdot R_{\max}$, $x_0 = 200, y_0 = 190, R_{\max} = 130, N = 8$.

### 6.2. Penjelajah Kurva Efisiensi Pareto (`createParetoChart`)
- Sumbu X: Harga Blended logaritmik ($\log_{10}(P + 0.1)$).
- Sumbu Y: Skor Keseluruhan BenchLM ($S_{\text{overall}}$).
- Identifikasi batas efisiensi (Pareto Frontier): Model $A$ mendominasi model $B$ jika $S_A \ge S_B$ dan $P_A \le P_B$. Garis putus-putus SVG menghubungkan titik-titik optimal Pareto.

---

## 7. Keamanan, Optimasi Header & PWA

### 7.1. Header Keamanan (`_headers`)
```http
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; script-src 'self' https://pagead2.googlesyndication.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://www.google-analytics.com;

/js/*
  Cache-Control: public, max-age=3600, must-revalidate

/sw.js
  Cache-Control: no-cache, no-store, must-revalidate
```

### 7.2. Service Worker (`sw.js`)
Mengimplementasikan strategi **Cache-First dengan Network Fallback** untuk semua aset lokal (`/`, `index.html`, `css/style.css`, `js/**/*.js`, `assets/icon.svg`).

---

## 8. Build, Testing & Deployment Pipeline

### 8.1. Skrip Pengujian Otomatis (Static Integration Test)
Menjalankan verifikasi sintaks, integritas modul, kelengkapan dataset, dan konsistensi DOM ID:
```bash
node test_sit.mjs
```

### 8.2. Regenerasi Precache Service Worker
```bash
python tools_gen_sw.py
```

### 8.3. Regenerasi XML Sitemap
```bash
python tools_gen_sitemap.py
```

### 8.4. Build Produksi & Deploy ke Cloudflare Pages
```bash
python build.py
npx wrangler pages deploy dist --project-name bench-vijeron --branch main
```
