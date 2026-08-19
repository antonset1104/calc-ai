/* ============================================================
   model.js — "model bohongan" yang jujur
   Balasan disusun dari templat lokal, lalu setiap token dilewatkan
   ke matematika sampling yang nyata (suhu, top-k, top-p, penalti).
   Tidak ada panggilan jaringan. Tidak ada bobot neural.
   ============================================================ */

/* ---------- 1. membaca system prompt ---------- */

const DIRECTIVES = [
  { key: 'brief',   re: /(singkat|ringkas|padat|brief|concise|short|max(imal)?\s*\d+)/i },
  { key: 'formal',  re: /(formal|profesional|professional|sopan|baku)/i },
  { key: 'casual',  re: /(santai|casual|friendly|akrab|ramah|kasual)/i },
  { key: 'expert',  re: /(ahli|pakar|expert|senior|teknis|technical)/i },
  { key: 'bullets', re: /(bullet|poin|point|daftar|list|langkah|steps)/i },
  { key: 'english', re: /(bahasa inggris|in english|english only|answer in english)/i },
  { key: 'indo',    re: /(bahasa indonesia|in indonesian|jawab.*indonesia)/i },
  { key: 'noguess', re: /(jangan mengarang|jangan berspekulasi|do not (make up|guess)|no hallucinat|akui.*tidak tahu|say i don)/i },
  { key: 'json',    re: /(json|schema|skema|format keluaran|output format)/i },
];

export function readSystem(sys = '') {
  const found = DIRECTIVES.filter((d) => d.re.test(sys)).map((d) => d.key);
  const role = /(kamu adalah|anda adalah|you are|act as|berperan sebagai)\s+([^.\n,;]{3,60})/i.exec(sys);
  return {
    keys: found,
    role: role ? role[2].trim() : null,
    brief: found.includes('brief'),
    bullets: found.includes('bullets'),
    lang: found.includes('english') ? 'en' : found.includes('indo') ? 'id' : null,
    json: found.includes('json'),
  };
}

/* ---------- 2. membaca user prompt ---------- */

const INTENTS = [
  { key: 'greeting',  re: /^\s*(hai|hi+|hello|halo+|hey|yo|selamat (pagi|siang|sore|malam)|assalam)/i },
  { key: 'define',    re: /(apa itu|apa yang dimaksud|apa sih|what is|what are|whats|jelaskan|explain|definisi|maksud dari)/i },
  { key: 'howto',     re: /(bagaimana cara|gimana cara|bagaimana|cara (untuk )?|how (do|to|can|should)|langkah|tutorial|tips)/i },
  { key: 'code',      re: /(kode|coding|code|function|fungsi|script|program|regex|sql|python|javascript|bug|error|debug)/i },
  { key: 'summarize', re: /(ringkas|rangkum|summar|tl;?dr|intisari|simpulkan)/i },
  { key: 'translate', re: /(terjemah|translate|artikan)/i },
  { key: 'ideas',     re: /(ide|idea|brainstorm|saran|rekomendasi|recommend|usul)/i },
  { key: 'write',     re: /(tulis|buat(kan)?|write|draft|email|caption|copy|artikel|post|slogan)/i },
  { key: 'compare',   re: /(bandingkan|banding|compare|versus| vs |bedanya|perbedaan|difference)/i },
];

const STOP = /^(apa|itu|yang|dimaksud|dengan|adalah|sih|dong|kah|tolong|mohon|coba|bisakah|please|jelaskan|explain|what|is|are|the|a|an|about|of|bagaimana|gimana|cara|untuk|buat|buatkan|tulis|write|draft|ringkas|rangkum|bandingkan|compare|ide|idea|dan|and|to|do|i|how)$/i;

export function readUser(text = '') {
  const clean = text.trim().replace(/\s+/g, ' ');
  const intent = INTENTS.find((i) => i.re.test(clean))?.key || 'general';
  const words = clean.replace(/[?!.,;:]/g, '').split(' ').filter((w) => w && !STOP.test(w));
  const topic = words.slice(0, 6).join(' ') || (clean ? clean.slice(0, 40) : '');
  return { intent, topic, length: clean.length };
}

/* ---------- 3. templat balasan ---------- */

const T = {
  id: {
    greeting: (t) => 'Halo! Senang bertemu. Saya siap membantu menjelaskan konsep, menyusun draf, atau memeriksa ide Anda. Mau mulai dari mana?',
    define: (t) => `${cap(t)} adalah konsep yang menjelaskan bagaimana sebuah sistem memproses masukan menjadi keluaran yang berguna. Inti idenya ada tiga: prinsip dasar yang membuatnya bekerja, cara memakainya dalam praktik, dan batasan yang perlu Anda sadari. Contoh sederhananya, ketika Anda memberi satu masukan, sistem akan memecahnya menjadi bagian kecil, menilai setiap bagian, lalu menyusun kembali hasilnya secara berurutan. Kalau mau, saya bisa membahas salah satu dari tiga poin itu lebih dalam.`,
    howto: (t) => `Untuk ${t || 'itu'}, saya sarankan empat langkah berikut. Pertama, tentukan hasil akhir yang Anda inginkan secara spesifik agar mudah diukur. Kedua, siapkan bahan atau data yang dibutuhkan supaya prosesnya tidak terhenti di tengah jalan. Ketiga, kerjakan versi paling sederhana lebih dulu, lalu uji hasilnya. Keempat, perbaiki satu variabel setiap kali sampai hasilnya stabil. Cara ini membuat kesalahan mudah dilacak.`,
    code: (t) => `Untuk kasus ${t || 'ini'}, pendekatan paling aman adalah memisahkan logika menjadi fungsi kecil yang bisa diuji sendiri. Mulai dengan menuliskan masukan dan keluaran yang diharapkan, lalu tangani kasus tepi seperti nilai kosong dan tipe data yang salah. Setelah itu baru tambahkan penanganan galat, dan tulis satu pengujian untuk setiap perilaku yang Anda janjikan. Kalau Anda kirimkan potongan kodenya, saya bisa menunjukkan bagian mana yang perlu dirapikan.`,
    summarize: (t) => `Ringkasannya begini: inti persoalan ${t || 'tersebut'} berpusat pada satu hal, yaitu bagaimana masukan diubah menjadi keputusan. Ada tiga temuan utama, dan yang paling berdampak adalah temuan pertama karena menentukan sisanya. Tindak lanjut yang paling masuk akal adalah memilih satu perubahan kecil, mengukurnya selama satu pekan, lalu memutuskan apakah diteruskan.`,
    translate: (t) => `Berikut terjemahannya beserta catatan singkat. Saya mempertahankan makna dan nada asli, bukan menerjemahkan kata per kata, karena beberapa ungkapan tidak punya padanan langsung. Bagian yang saya ubah paling banyak adalah kalimat pembuka, supaya terasa wajar bagi pembaca sasaran. Beri tahu saya jika Anda ingin versi yang lebih formal atau lebih santai.`,
    ideas: (t) => `Ini beberapa ide untuk ${t || 'topik itu'}. Pertama, mulai dari versi terkecil yang sudah bisa dipakai orang lain hari ini. Kedua, ambil satu keluhan paling sering muncul dan selesaikan itu saja sampai tuntas. Ketiga, gabungkan dua hal yang biasanya dipakai terpisah agar terasa baru. Keempat, buat prosesnya terlihat, karena orang lebih percaya pada sesuatu yang bisa mereka amati. Saya bisa kembangkan salah satunya menjadi rencana konkret.`,
    write: (t) => `Berikut draf untuk ${t || 'permintaan Anda'}. Saya mulai dengan satu kalimat pembuka yang menyebut manfaat utama, lalu dua kalimat isi yang memberi bukti, dan ditutup dengan satu ajakan yang jelas. Nada tulisannya saya jaga tetap ringkas dan sopan. Jika Anda ingin versi yang lebih pendek untuk media sosial atau lebih panjang untuk surel resmi, sebutkan saja panjang yang Anda inginkan.`,
    compare: (t) => `Kalau dibandingkan, keduanya berbeda pada tiga sisi: biaya, kecepatan, dan tingkat kendali. Pilihan pertama lebih murah dan cepat disiapkan, tetapi kurang lentur ketika kebutuhan berubah. Pilihan kedua menuntut usaha awal lebih besar, namun lebih mudah disesuaikan dalam jangka panjang. Untuk kebutuhan yang masih berubah-ubah, saya cenderung memilih yang kedua.`,
    general: (t) => `Baik, saya tangkap maksud Anda tentang ${t || 'hal ini'}. Supaya jawabannya tepat, ada satu hal yang perlu saya pastikan: apakah Anda ingin penjelasan konseptual atau langkah praktis? Sementara itu, gambaran umumnya begini: proses dimulai dari memecah masukan menjadi bagian kecil, menilai bagian yang paling penting, lalu menyusun jawaban satu langkah demi satu langkah sampai tujuan tercapai.`,
    brief: (t) => `Singkatnya: ${t || 'hal itu'} bekerja dengan memecah masukan menjadi bagian kecil, menilai tiap bagian, lalu menyusun keluaran berurutan. Poin terpenting: mulai kecil, ukur, perbaiki.`,
  },
  en: {
    greeting: (t) => 'Hi there! Happy to help. I can explain a concept, draft something for you, or pressure-test an idea. Where would you like to start?',
    define: (t) => `${cap(t)} is the idea that describes how a system turns input into useful output. Three things matter most: the principle that makes it work, how you apply it in practice, and the limits you should keep in mind. In plain terms, when you provide an input the system splits it into small pieces, scores each piece, then rebuilds the result step by step. I can go deeper on any of those three points if you like.`,
    howto: (t) => `For ${t || 'that'}, I would take four steps. First, define the finished result precisely so you can measure it. Second, gather the inputs you need so the work does not stall halfway. Third, build the simplest version first and test it. Fourth, change one variable at a time until the result is stable. That order keeps mistakes easy to trace.`,
    code: (t) => `For ${t || 'this case'}, the safest approach is to split the logic into small functions you can test in isolation. Start by writing down the expected input and output, then handle edge cases such as empty values and wrong types. Add error handling after that, and write one test per behaviour you promise. Paste the snippet and I can point out what to tighten.`,
    summarize: (t) => `Here is the short version: the core of ${t || 'it'} comes down to how input becomes a decision. There are three findings, and the first one matters most because it determines the rest. The sensible next step is to pick one small change, measure it for a week, then decide whether to keep it.`,
    translate: (t) => `Here is the translation with a short note. I kept the meaning and tone rather than translating word for word, because a few phrases have no direct equivalent. The opening sentence changed the most so it reads naturally for the target audience. Tell me if you want a more formal or more casual version.`,
    ideas: (t) => `A few ideas for ${t || 'that'}. First, ship the smallest version someone could actually use today. Second, take the single most common complaint and solve only that, completely. Third, combine two things people normally use separately so it feels new. Fourth, make the process visible, because people trust what they can watch. I can turn any of these into a concrete plan.`,
    write: (t) => `Here is a draft for ${t || 'your request'}. It opens with one sentence naming the main benefit, adds two sentences of evidence, and closes with a clear call to action. The tone stays short and courteous. If you want a shorter social version or a longer formal email, just name the length you need.`,
    compare: (t) => `Compared side by side, they differ in cost, speed, and control. The first option is cheaper and faster to set up but bends poorly when requirements change. The second asks for more upfront work yet adapts far better over time. While requirements are still moving, I would lean towards the second.`,
    general: (t) => `Understood, you are asking about ${t || 'this'}. To answer precisely I need one detail: do you want the concept or the practical steps? In the meantime, the outline is this: split the input into small pieces, judge which pieces matter, then assemble the answer one step at a time until the goal is met.`,
    brief: (t) => `In short: ${t || 'it'} works by splitting input into small pieces, scoring each piece, then emitting output in order. Key point: start small, measure, refine.`,
  },
};

function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : 'Konsep itu'; }

const BULLETS = {
  id: (body) => body.split(/(?<=\.)\s+/).filter(Boolean).map((s, i) => `${i + 1}. ${s}`).join('\n'),
  en: (body) => body.split(/(?<=\.)\s+/).filter(Boolean).map((s, i) => `${i + 1}. ${s}`).join('\n'),
};

/**
 * Susun balasan yang *akan direncanakan* model.
 * Token demi token nanti tetap harus lolos sampling.
 */
export function planReply({ system = '', user = '', lang = 'id' }) {
  const sys = readSystem(system);
  const u = readUser(user);
  const L = sys.lang || lang;
  const dict = T[L] || T.id;

  let body = sys.brief ? dict.brief(u.topic) : (dict[u.intent] || dict.general)(u.topic);
  if (sys.role) {
    const prefix = L === 'id'
      ? `Sebagai ${sys.role}, `
      : `As ${sys.role}, `;
    body = prefix + body.charAt(0).toLowerCase() + body.slice(1);
  }
  if (sys.bullets && !sys.brief) body = BULLETS[L === 'en' ? 'en' : 'id'](body);
  if (sys.json) {
    body = `{\n  "topic": "${u.topic || 'unknown'}",\n  "answer": "${body.replace(/"/g, "'").slice(0, 220)}",\n  "confidence": 0.72\n}`;
  }
  return { text: body, intent: u.intent, topic: u.topic, sys };
}

/* ---------- 4. kandidat token per langkah ---------- */

const FILLER = {
  id: ['yang', 'dan', 'juga', 'sangat', 'mungkin', 'sebenarnya', 'tentu', 'agak', 'lebih', 'saja', 'kira-kira', 'semacam', 'begitu', 'nah', 'jadi', 'ternyata', 'hampir', 'cukup'],
  en: ['the', 'and', 'also', 'very', 'maybe', 'actually', 'quite', 'rather', 'more', 'just', 'somewhat', 'kind', 'so', 'well', 'indeed', 'almost', 'fairly', 'perhaps'],
};
const WILD = ['🌀', 'banana', 'quantum', 'pisang', 'zebra', 'kosmik', 'entropy', 'tofu', 'meta', 'cheese'];

function hash(s, salt) {
  let h = 2166136261 ^ salt;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0);
}

/**
 * Kandidat untuk satu posisi: token rencana diberi logit tinggi,
 * pesaing diambil dari kata pengisi, token yang sudah muncul, dan
 * beberapa token liar (agar suhu ekstrem terlihat merusak).
 */
export function candidatesFor(planned, position, seenTokens, lang = 'id') {
  const pool = FILLER[lang === 'en' ? 'en' : 'id'];
  const out = [{ s: planned, logit: 8.5 + (hash(planned, position) % 50) / 500 }];
  const used = new Set([planned]);
  const pushCand = (s, logit) => {
    if (!s || used.has(s)) return;
    used.add(s);
    out.push({ s, logit });
  };

  const h = hash(planned, position + 7);
  // 4 pesaing "wajar"
  for (let i = 0; i < 4; i++) {
    const w = pool[(h + i * 37) % pool.length];
    pushCand((planned.startsWith(' ') ? ' ' : '') + w, 5.6 - i * 0.5 + ((h >> (i + 2)) % 30) / 300);
  }
  // 2 pesaing dari token yang sudah lewat (sumber pengulangan)
  const recent = seenTokens.slice(-14);
  for (let i = 0; i < 2 && recent.length; i++) {
    const t = recent[(h + i * 11) % recent.length];
    pushCand(t, 4.4 - i * 0.45);
  }
  // 1 token liar
  pushCand(' ' + WILD[h % WILD.length], 3.1);
  return out;
}

/** Tebakan biaya waktu: TTFT + kecepatan token (murni simulasi UI). */
export function latencyModel(inputTokens) {
  const ttft = 120 + Math.min(900, inputTokens * 1.6);
  const tps = 42 + ((inputTokens * 7) % 26);
  return { ttft: Math.round(ttft), tps };
}
