# LLM Lab & BenchLM

Situs edukasi interaktif dan platform leaderboard evaluasi AI independen — menggabungkan kekuatan **LLM Lab**
(Simulator sampling token · Tokenizer · Jendela Konteks · Prompting RISEN · Glosarium 150+ istilah) dengan
ekosistem benchmark komprehensif terinspirasi dari [BenchLM.ai](https://benchlm.ai/)
(Leaderboard terbobot 8 kategori · Komparasi Spider/Radar Chart · Penjelajah Pareto Harga vs Kinerja · Pencari Model Pintar · Direktori Tolok Ukur).

Semua perhitungan dan visualisasi grafik berjalan 100% di perangkat pengguna (client-side). Tanpa backend, tanpa kunci API, tanpa pelacakan.

---

## Fitur Utama

| Halaman | Isi & Kapabilitas |
| :-- | :-- |
| **Leaderboard** (`#/leaderboard`) | Peringkat 18+ model frontier dan open-weights (Claude 3.7 Sonnet, GPT-5 Preview, DeepSeek R1/V3, Gemini 2.5 Pro/Flash, Llama 3.3, Qwen 2.5 Coder, dll.) dengan skor **BenchLM (0–100)** di 8 kategori terbobot, harga API per 1M token (in/out/blended), kecepatan streaming (tok/s), TTFT (ms), ukuran konteks, Chatbot Arena Elo, filter dinamis, pin perbandingan, dan jendela **Model Dossier modal** interaktif. |
| **Bandingkan** (`#/compare`) | Perbandingan multi-model head-to-head (hingga 4 model berdampingan) dilengkapi **Grafik Radar 8 Dimensi (SVG)**, matriks skor benchmark lengkap dengan penanda pemenang (*winner badges*), tinjauan kelebihan/kekurangan, dan **Simulasi Biaya Komparatif** untuk menghitung selisih tagihan bulanan. |
| **Pilih Model** (`#/selector`) | **Smart Model Selector Wizard**: Menemukan model terbaik berdasarkan kebutuhan beban kerja (Coding, Agentic, Penalaran STEM, RAG, Chat Cepat, Multimodal), toleransi anggaran, dan target latensi dengan skor kecocokan (%) serta estimasi biaya. Dilengkapi **Kurva Efisiensi Pareto Frontier (SVG)** memetakan trade-off harga logaritmik vs performa. |
| **Benchmark** (`#/benchmarks`) | Direktori tolok ukur standar industri (SWE-bench Verified, LiveCodeBench, GPQA Diamond, MMLU-Pro, MMMU, IFEval, MATH-500, Chatbot Arena Elo) beserta metrik, tingkat kesulitan, model terdepan, dan dokumentasi formula pembobotan resmi 8 kategori BenchLM. |
| **Simulator** (`#/simulator`) | Dekode token demi token dengan matematika sampling asli: penalti frekuensi/kehadiran → softmax bersuhu → pemangkasan top-k/top-p → pengundian berseed. Menampilkan distribusi 8 kandidat teratas per langkah, penelusur langkah (step scrubber), pipeline 9 tahap, dan telemetri lengkap. |
| **Tokenizer** (`#/tokenizer`) | Tiga gaya tokenisasi (BPE, WordPiece, SentencePiece) dengan pewarnaan token, ID semu, ukuran byte, dan tabel perbandingan langsung. Kalkulator biaya per permintaan dan per bulan untuk model modern. |
| **Konteks** (`#/context`) | Perbandingan jendela konteks (skala logaritmik), kalkulator "apa yang muat" berbasis panjang bahan nyata, dan **simulasi memori percakapan**: giliran tertua tergeser keluar / diringkas. |
| **Prompting** (`#/prompting`) | Penyusun prompt RISEN dengan skor kelengkapan 8 kriteria dan hitungan token langsung, 8 teknik dengan contoh sebelum/sesudah, dan 9 templat siap pakai berkategori. |
| **Glosarium** (`#/glossary`) | 152 istilah dalam 8 kategori, dua bahasa (ID/EN), pencarian dengan penyorotan, penyaring kategori, urutan A–Z, dan tautan langsung. |

Fitur lintas halaman: dua bahasa penuh (ID/EN, dapat dipaksa lewat `?lang=en`), tema terang/gelap otomatis atau manual, command palette `Ctrl/⌘+K` (mencari model, benchmark, halaman, alat, dan glosarium), PWA offline, dan tab bar khusus mobile.

---

## Penerbitan ke Cloudflare Pages (bench.vijeron.com)

Situs live: **https://bench-vijeron.pages.dev** (Pages project `bench-vijeron`, akun Cloudflare `setiawan.anton@gmail.com`).

```bash
python build.py                                  # menyalin situs ke dist/ tanpa berkas dev & test
npx wrangler pages deploy dist --project-name bench-vijeron --branch main
```

`build.py` mengecualikan `dev-server.py`, `build.py`, `tools_gen_sw.py`, `test_*.mjs`, `README.md`, dan `.git/`.
`_headers` mengirim CSP ketat (`script-src 'self'`), `nosniff`, `Referrer-Policy`, dan aturan cache
(`/js/*` & `/css/*` 1 jam must-revalidate, `sw.js` dan `index.html` no-cache) supaya pembaruan cepat terlihat.

Kalau daftar berkas berubah, regenerasi precache service worker:

```bash
python tools_gen_sw.py
```

### Sisa satu langkah manual: DNS

Custom domain `bench.vijeron.com` sudah terdaftar di project Pages, tetapi record DNS-nya belum ada —
token OAuth wrangler di mesin ini hanya punya izin `zone:read`, tidak bisa menulis DNS. Tambahkan di
dashboard Cloudflare → zona `vijeron.com` → DNS → Add record:

| Type | Name | Target | Proxy |
| :-- | :-- | :-- | :-- |
| CNAME | `bench` | `bench-vijeron.pages.dev` | Proxied (awan oranye) |

Setelah record aktif, status domain di Pages berubah dari `pending` menjadi `active` dan sertifikat TLS
terbit otomatis (biasanya < 5 menit). Cek status:

```bash
npx wrangler pages deployment list --project-name bench-vijeron
```

Record ini tidak menyentuh apex `vijeron.com` yang masih mengarah ke GitHub Pages.

---

## Status data & kanal kontak (js/config.js)

Semua klaim yang butuh bukti dikumpulkan di satu berkas: `js/config.js`.

- `DATA_STATUS = 'illustrative'` (bawaan) menampilkan banner peringatan di halaman Leaderboard, Bandingkan,
  Pilih Model, dan Benchmark: angka skor/harga/Elo adalah data demonstrasi untuk memperagakan metodologi
  pembobotan, belum diverifikasi dari laporan resmi vendor. Ubah ke `'sourced'` **hanya** setelah setiap angka
  dicocokkan dengan sumber resmi — halaman ini menyebut nama benchmark dan vendor sungguhan.
- `CONTACT.email` / `CONTACT.newsletterEndpoint` / `CONTACT.advisoryEndpoint` kosong ⇒ signal bar Radar Brief,
  modal newsletter, dan tombol Enterprise Advisory otomatis disembunyikan, karena formulirnya belum terhubung
  ke tujuan mana pun. Isi salah satunya untuk menyalakan kembali.
- `SPONSOR_URL` kosong ⇒ tautan Sponsor & Tip Jar disembunyikan.
- Tautan partner inference di `js/lib/monetize.js` masih memakai parameter `?ref=llmlab` yang bukan ID afiliasi
  nyata; ganti dengan ID afiliasi Anda sebelum dipakai untuk monetisasi.

---

## Menjalankan secara lokal

Situs ini statis dan tanpa langkah build. Cukup layani foldernya lewat HTTP (modul ES tidak bisa dimuat dari `file://`):

```bash
python dev-server.py 8899
```

Lalu buka `http://127.0.0.1:8899/`. `dev-server.py` mengirim `Cache-Control: no-store` agar perubahan JS/CSS
langsung terlihat tanpa hard reload — jangan dipakai untuk produksi.

Alternatif tanpa skrip:

```bash
python -m http.server 8899
```

### Menerbitkan

Unggah seluruh isi folder apa adanya ke hosting statis mana pun (GitHub Pages, Cloudflare Pages, Netlify, Nginx).
Routing memakai hash (`#/tokenizer`), jadi tidak perlu aturan rewrite di server.

---

## Arsitektur

```
index.html          shell aplikasi (topbar, footer, tab bar, dialog palette)
css/style.css       satu design system: token warna, komponen, responsif, tema terang/gelap
js/app.js           router hash, lazy import per halaman, tema, bahasa, command palette, PWA
js/lib/ui.js        pembantu DOM (el/card/stat/meter/slider/copy/toast) — pengganti framework
js/lib/tokenizer.js mesin tokenisasi tiga gaya + byte fallback + hitungan statistik
js/lib/sampling.js  matematika sampling murni: penalti, softmax bersuhu, top-k/top-p, entropi, PRNG berseed
js/lib/model.js     pembaca system prompt, pendeteksi maksud, templat balasan, generator kandidat token
js/data/models.js   katalog 10 model: jendela konteks, batas keluaran, harga per 1M token
js/data/glossary.js 152 istilah dua bahasa dengan kategori
js/views/*.js       satu modul per halaman, dimuat saat dibutuhkan
sw.js               service worker: navigasi network-first, aset stale-while-revalidate
dev-server.py       server statis lokal tanpa cache
```

### Kenapa ringan

- **Nol dependensi, nol build step.** Vanilla ES modules; tidak ada React/Vue/Tailwind, tidak ada bundler.
- **Nol permintaan lintas domain.** Tanpa Google Fonts (memakai `system-ui`), tanpa CDN, tanpa analitik, tanpa ikon eksternal — ikon berupa SVG inline.
- **Muat awal ±36 KB gzip** (HTML + CSS + shell + satu halaman). Halaman lain diimpor saat diklik, lalu diprefetch saat browser menganggur (`requestIdleCallback`), sehingga perpindahan halaman terasa instan.
- **Glosarium 152 istilah dimuat malas** dan memakai `content-visibility: auto` sehingga entri di luar layar tidak dirender.
- Animasi hanya `opacity`/`transform`, patuh `prefers-reduced-motion`, dan seluruh pembaruan angka menulis ke node teks yang sudah ada, bukan membangun ulang DOM.

### Aksesibilitas

Tautan lewati konten, `aria-current` pada navigasi, label pada setiap kontrol, dialog `<dialog>` asli dengan
navigasi panah, fokus terlihat, tabel yang menggulir di dalam wadahnya sendiri, dan tidak ada horizontal
scroll pada 375 px.

---

## Menyesuaikan

- **Harga & jendela model** → `js/data/models.js`. Angka di sana adalah snapshot referensi untuk latihan hitung, bukan tarif resmi; perbarui dari halaman harga vendor sebelum dipakai membuat keputusan biaya.
- **Istilah glosarium** → `js/data/glossary.js` (satu objek per istilah: `t`, `c`, `alias`, `id`, `en`).
- **Templat & teknik prompting** → `js/views/prompting.js` (konstanta `TEMPLATES`, `TECHNIQUES`).
- **Warna, radius, tipografi** → blok `:root` di `css/style.css`.
- **Teks antarmuka** → objek `S` di dalam setiap modul view, plus `SHELL` di `js/app.js`.

---

## Batasan yang perlu dinyatakan terang

1. **Tokenizer adalah aproksimasi edukatif.** Pola pemotongannya realistis (sub-kata, spasi ikut token, angka dipecah, byte fallback untuk emoji/CJK), tetapi jumlah token bisa berbeda ±10–15% dari tokenizer resmi dan ID token bersifat semu (hash stabil), bukan ID vendor.
2. **Tidak ada bobot neural.** Teks balasan pada Simulator disusun dari templat lokal yang dipilih berdasarkan maksud pesan dan arahan pada system prompt. Yang nyata dan patut dipelajari adalah pipeline sampling, akuntansi token, dan biayanya.
3. **Latensi disimulasikan.** TTFT dan token/detik dihitung dari rumus sederhana untuk memberi rasa proses streaming, bukan hasil pengukuran jaringan.
4. **Harga bergerak.** Tabel biaya adalah snapshot referensi, lihat poin "Menyesuaikan" di atas.
