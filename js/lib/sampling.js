/* ============================================================
   sampling.js — matematika sampling yang sesungguhnya dipakai LLM
   Semua fungsi murni supaya mudah diuji & divisualkan.
   ============================================================ */

/** PRNG deterministik (mulberry32) supaya hasil bisa direproduksi lewat seed. */
export function rng(seed) {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Penalti pengulangan pada logit (mengikuti definisi OpenAI):
 *   logit -= frequencyPenalty * jumlahKemunculan + presencePenalty * (muncul ? 1 : 0)
 */
export function applyPenalties(cands, counts, freqPen, presPen) {
  if (!freqPen && !presPen) return cands.map((c) => ({ ...c, penalty: 0 }));
  return cands.map((c) => {
    const n = counts.get(c.s) || 0;
    const penalty = n ? freqPen * n + presPen : 0;
    return { ...c, penalty, logit: c.logit - penalty };
  });
}

/** Softmax dengan suhu. temp <= 0 diperlakukan sebagai argmax (greedy). */
export function softmax(cands, temp) {
  if (temp <= 0.01) {
    let best = 0;
    cands.forEach((c, i) => { if (c.logit > cands[best].logit) best = i; });
    return cands.map((c, i) => ({ ...c, p: i === best ? 1 : 0 }));
  }
  const max = Math.max(...cands.map((c) => c.logit));
  const exps = cands.map((c) => Math.exp((c.logit - max) / temp));
  const sum = exps.reduce((a, b) => a + b, 0);
  return cands.map((c, i) => ({ ...c, p: exps[i] / sum }));
}

/**
 * top-k lalu top-p (nucleus). Kandidat yang tersingkir ditandai cut:true,
 * bukan dibuang, supaya UI bisa menunjukkan apa yang dipangkas.
 */
export function truncate(cands, topK, topP) {
  const sorted = [...cands].sort((a, b) => b.p - a.p);
  const keep = new Set();
  const k = topK > 0 ? Math.min(topK, sorted.length) : sorted.length;
  let acc = 0;
  for (let i = 0; i < k; i++) {
    keep.add(sorted[i]);
    acc += sorted[i].p;
    if (topP < 1 && acc >= topP) break;   // token pertama yang melewati ambang tetap disimpan
  }
  const kept = sorted.filter((c) => keep.has(c));
  const norm = kept.reduce((a, c) => a + c.p, 0) || 1;
  return sorted.map((c) => (keep.has(c)
    ? { ...c, cut: false, pFinal: c.p / norm }
    : { ...c, cut: true, pFinal: 0 }));
}

/** Ambil satu token dari distribusi ternormalisasi. */
export function pick(cands, rand) {
  const r = rand();
  let acc = 0;
  for (const c of cands) {
    acc += c.pFinal;
    if (r <= acc) return c;
  }
  return cands.find((c) => !c.cut) || cands[0];
}

/**
 * Entropi (bit). Diukur pada distribusi *sebelum* pemangkasan, karena itulah
 * ukuran keraguan model — bukan akibat pilihan top-k/top-p kita.
 */
export function entropy(cands, key = 'p') {
  let h = 0;
  for (const c of cands) {
    const p = c[key] ?? 0;
    if (p > 0) h -= p * Math.log2(p);
  }
  return h;
}

/** Satu langkah dekode lengkap: penalti -> suhu -> top-k/p -> sampling. */
export function step(cands, opts, counts, rand) {
  const withPen = applyPenalties(cands, counts, opts.freqPen, opts.presPen);
  const probs = softmax(withPen, opts.temp);
  const dist = truncate(probs, opts.topK, opts.topP);
  const chosen = pick(dist, rand);
  return { dist, chosen, entropy: entropy(probs, 'p'), kept: dist.filter((c) => !c.cut).length };
}
