/* ============================================================
   models.js — katalog model untuk kalkulator biaya & context window
   Harga dalam USD per 1 juta token (snapshot referensi 2026).
   SATU tempat untuk diperbarui: ubah di sini saja.
   ============================================================ */

export const PRICE_NOTE = {
  id: 'Harga & ukuran jendela di bawah adalah snapshot referensi 2026 untuk latihan hitung dan komparasi produksi. Selalu cek halaman harga resmi vendor / OpenRouter sebelum memutuskan anggaran.',
  en: 'Prices and window sizes below are 2026 reference snapshots for calculation and production planning. Always confirm on the official vendor / OpenRouter console before final budgeting.',
};

export const MODELS = [
  { id: 'claude-opus-5',    name: 'Claude Opus 5',         vendor: 'Anthropic',      ctx: 1000000, maxOut: 128000, in: 5.00,  out: 25.00, tok: 'bpe' },
  { id: 'gpt-5-6-sol',      name: 'GPT-5.6 Sol',           vendor: 'OpenAI',         ctx: 1050000, maxOut: 128000, in: 5.00,  out: 20.00, tok: 'bpe' },
  { id: 'grok-4-6',         name: 'Grok 4.6',              vendor: 'xAI',            ctx: 2000000, maxOut: 64000,  in: 2.00,  out: 10.00, tok: 'bpe' },
  { id: 'claude-sonnet-5',  name: 'Claude Sonnet 5',       vendor: 'Anthropic',      ctx: 1000000, maxOut: 64000,  in: 3.00,  out: 15.00, tok: 'bpe' },
  { id: 'muse-spark-1-2',   name: 'Muse Spark 1.2',        vendor: 'Meta AI',        ctx: 500000,  maxOut: 64000,  in: 3.50,  out: 14.00, tok: 'bpe' },
  { id: 'gemini-3-1-pro',   name: 'Gemini 3.1 Pro',        vendor: 'Google',         ctx: 2500000, maxOut: 32768,  in: 1.50,  out: 6.00,  tok: 'sentencepiece' },
  { id: 'deepseek-v4-pro',  name: 'DeepSeek V4 Pro',       vendor: 'DeepSeek',       ctx: 500000,  maxOut: 64000,  in: 0.80,  out: 3.20,  tok: 'bpe' },
  { id: 'qwen-3-8-max',     name: 'Qwen3.8 Max',           vendor: 'Alibaba',        ctx: 1000000, maxOut: 64000,  in: 1.80,  out: 7.20,  tok: 'bpe' },
  { id: 'claude-fable-5',   name: 'Claude Fable 5',        vendor: 'Anthropic',      ctx: 500000,  maxOut: 64000,  in: 2.50,  out: 10.00, tok: 'bpe' },
  { id: 'gpt-5-6-terra',    name: 'GPT-5.6 Terra',         vendor: 'OpenAI',         ctx: 1000000, maxOut: 64000,  in: 2.50,  out: 10.00, tok: 'bpe' },
  { id: 'deepseek-v4-flash',name: 'DeepSeek V4 Flash',     vendor: 'DeepSeek',       ctx: 500000,  maxOut: 16384,  in: 0.14,  out: 0.28,  tok: 'bpe' },
  { id: 'gemini-3-flash',   name: 'Gemini 3 Flash',        vendor: 'Google',         ctx: 1500000, maxOut: 16384,  in: 0.10,  out: 0.40,  tok: 'sentencepiece' },
  { id: 'llama-4-5-405b',   name: 'Llama 4.5 405B',        vendor: 'Meta (HF)',      ctx: 256000,  maxOut: 16384,  in: 1.50,  out: 4.50,  tok: 'sentencepiece' },
  { id: 'llama-4-5-70b',    name: 'Llama 4.5 70B',         vendor: 'Meta (HF)',      ctx: 256000,  maxOut: 16384,  in: 0.20,  out: 0.60,  tok: 'sentencepiece' },
  { id: 'qwen-3-vl-235b',   name: 'Qwen3 VL 235B A22B',    vendor: 'Alibaba (HF)',   ctx: 256000,  maxOut: 16384,  in: 0.80,  out: 2.40,  tok: 'bpe' },
  { id: 'claude-37',        name: 'Claude 3.7 Sonnet',     vendor: 'Anthropic',      ctx: 200000,  maxOut: 64000,  in: 3.00,  out: 15.00, tok: 'bpe' },
  { id: 'deepseek-r1',      name: 'DeepSeek R1',           vendor: 'DeepSeek (HF)',  ctx: 128000,  maxOut: 64000,  in: 0.55,  out: 2.19,  tok: 'bpe' },
  { id: 'o3-mini',          name: 'o3-mini',               vendor: 'OpenAI',         ctx: 200000,  maxOut: 100000, in: 1.10,  out: 4.40,  tok: 'bpe' },
  { id: 'deepseek-v3',      name: 'DeepSeek V3',           vendor: 'DeepSeek (HF)',  ctx: 128000,  maxOut: 8192,   in: 0.14,  out: 0.28,  tok: 'bpe' },
  { id: 'qwen-coder',       name: 'Qwen 2.5 Coder 32B',    vendor: 'Alibaba (HF)',   ctx: 128000,  maxOut: 8192,   in: 0.20,  out: 0.60,  tok: 'bpe' },
  { id: 'qwq-32b',          name: 'QwQ-32B (Reasoning)',   vendor: 'Alibaba (HF)',   ctx: 128000,  maxOut: 32000,  in: 0.25,  out: 0.75,  tok: 'bpe' },
  { id: 'phi-4',            name: 'Phi-4 (14B)',           vendor: 'Microsoft (HF)', ctx: 16384,   maxOut: 4096,   in: 0.10,  out: 0.30,  tok: 'bpe' },
  { id: 'pixtral-large',    name: 'Pixtral Large 124B',    vendor: 'Mistral (HF)',   ctx: 128000,  maxOut: 8192,   in: 2.00,  out: 6.00,  tok: 'sentencepiece' },
  { id: 'codestral',        name: 'Codestral 2501',        vendor: 'Mistral (HF)',   ctx: 256000,  maxOut: 8192,   in: 0.30,  out: 0.90,  tok: 'sentencepiece' },
  { id: 'smollm2',          name: 'SmolLM2 1.7B',          vendor: 'Hugging Face',   ctx: 8192,    maxOut: 2048,   in: 0.05,  out: 0.15,  tok: 'bpe' },
];

export const byId = (id) => MODELS.find((m) => m.id === id) || MODELS[0];

/* Referensi panjang teks nyata (jumlah kata) untuk membandingkan jendela konteks. */
export const REFERENCES = [
  { id: 'tweet',   words: 40,     id_label: 'Satu unggahan media sosial',  en_label: 'One social post' },
  { id: 'blog',    words: 1200,   id_label: 'Artikel blog',                en_label: 'Blog article' },
  { id: 'chapter', words: 4000,   id_label: 'Satu bab buku',               en_label: 'One book chapter' },
  { id: 'thesis',  words: 15000,  id_label: 'Skripsi tipis',               en_label: 'Short thesis' },
  { id: 'novel',   words: 77000,  id_label: 'Novel (Harry Potter #1)',     en_label: 'Novel (Harry Potter #1)' },
  { id: 'lotr',    words: 480000, id_label: 'Trilogi Lord of the Rings',   en_label: 'Lord of the Rings trilogy' },
  { id: 'bible',   words: 783000, id_label: 'Seluruh Alkitab (KJV)',       en_label: 'The whole Bible (KJV)' },
];

/* Rasio empiris kasar: 1 token ~ 0,75 kata bahasa Inggris; bahasa Indonesia lebih mahal ~1,25x. */
export const WORDS_PER_TOKEN = 0.75;
export const ID_PENALTY = 1.25;

export function tokensForWords(words, lang = 'en') {
  const t = words / WORDS_PER_TOKEN;
  return Math.round(lang === 'id' ? t * ID_PENALTY : t);
}

export function cost(model, inTokens, outTokens) {
  return (inTokens / 1e6) * model.in + (outTokens / 1e6) * model.out;
}
