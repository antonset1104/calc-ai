/* ============================================================
   leaderboard.js — Data BenchLM & Design for Online AI Model Leaderboard
   (Snapshot Lengkap 2026: Claude 5 Series, GPT-5.6, Grok 4.6,
   DeepSeek V4, Gemini 3, Qwen3.8, Muse Spark, Llama 4.5 & Hugging Face)
   ============================================================ */

export const CATEGORIES = [
  { id: 'agentic',     weight: 0.22, name: { id: 'Agentic & Tool Use', en: 'Agentic & Tool Use' },         icon: '🤖', desc: { id: 'Kemampuan menjalankan tugas multi-langkah, penggunaan alat/fungsi (tool use), dan penyelesaian issue coding nyata (SWE-bench Verified, WebVoyager, GAIA).', en: 'Multi-step autonomous planning, function calling, tool use, and real-world SWE resolution (SWE-bench Verified, WebVoyager, GAIA).' } },
  { id: 'coding',      weight: 0.20, name: { id: 'Coding & Rekayasa', en: 'Coding & Dev' },               icon: '💻', desc: { id: 'Pemrograman, sintaksis algoritma, refactoring, dan verifikasi kode (LiveCodeBench, HumanEval+, EvalPlus).', en: 'Code generation, algorithm synthesis, refactoring, and code correctness (LiveCodeBench, HumanEval+, EvalPlus).' } },
  { id: 'reasoning',   weight: 0.17, name: { id: 'Penalaran Rumit', en: 'Complex Reasoning' },           icon: '🧠', desc: { id: 'Penalaran logis mendalam, deduksi multi-tahap, dan pemecahan masalah tingkat ahli (GPQA Diamond, ARC-AGI, MATH-500, AIME).', en: 'Deep multi-step deductive reasoning and PhD-level problem solving (GPQA Diamond, ARC-AGI, MATH-500, AIME).' } },
  { id: 'knowledge',   weight: 0.12, name: { id: 'Pengetahuan & Fakta', en: 'Knowledge & Factuality' },  icon: '📚', desc: { id: 'Pemahaman akademik lintas disiplin dan akurasi faktual tanpa halusinasi (MMLU-Pro, SimpleQA).', en: 'Cross-disciplinary domain knowledge and factual accuracy without hallucination (MMLU-Pro, SimpleQA).' } },
  { id: 'multimodal',  weight: 0.12, name: { id: 'Multimodal & Visual', en: 'Multimodal & Vision' },      icon: '👁️', desc: { id: 'Pemahaman gambar, diagram teknis, bagan, dokumen PDF, video, dan grounding visual (MMMU, MathVista, DocVQA).', en: 'Image comprehension, technical charts, document AI, and visual grounding (MMMU, MathVista, DocVQA).' } },
  { id: 'multilingual',weight: 0.07, name: { id: 'Multibahasa', en: 'Multilingual' },                    icon: '🌐', desc: { id: 'Kemampuan translasi presisi, penalaran bahasa non-Inggris, dan pemahaman ragam budaya (MGSM, Flores-200).', en: 'High-precision translation, non-English reasoning, and cross-lingual understanding (MGSM, Flores-200).' } },
  { id: 'instruction', weight: 0.05, name: { id: 'Kepatuhan Arahan', en: 'Instruction Following' },      icon: '🎯', desc: { id: 'Kepatuhan ketat terhadap aturan format, batasan negatif, dan instruksi kompleks (IFEval, AlpacaEval 2).', en: 'Strict adherence to format constraints, negative constraints, and complex instructions (IFEval, AlpacaEval 2).' } },
  { id: 'math',        weight: 0.05, name: { id: 'Matematika Mahir', en: 'Advanced Math' },               icon: '📐', desc: { id: 'Komputasi simbolik, olimpiade matematika, kalkulus, dan aljabar tingkat lanjut (GSM8K, OlympiadBench, AIME).', en: 'Symbolic math, olympiad competitions, calculus, and advanced algebra (GSM8K, OlympiadBench, AIME).' } },
];

export const USE_CASE_PROFILES = {
  general: {
    id: 'general',
    label: { id: '⚡ Semua Tugas (Standar)', en: '⚡ General Purpose' },
    weights: { agentic: 0.22, coding: 0.20, reasoning: 0.17, knowledge: 0.12, multimodal: 0.12, multilingual: 0.07, instruction: 0.05, math: 0.05 },
  },
  agents: {
    id: 'agents',
    label: { id: '🤖 AI Agents & Workflows', en: '🤖 AI Agents & Workflows' },
    weights: { agentic: 0.45, coding: 0.25, reasoning: 0.18, knowledge: 0.05, multimodal: 0.04, multilingual: 0.01, instruction: 0.01, math: 0.01 },
  },
  coding: {
    id: 'coding',
    label: { id: '💻 Coding & Rekayasa Software', en: '💻 Coding & Software Dev' },
    weights: { agentic: 0.22, coding: 0.52, reasoning: 0.16, knowledge: 0.03, multimodal: 0.02, multilingual: 0.02, instruction: 0.01, math: 0.02 },
  },
  content_seo: {
    id: 'content_seo',
    label: { id: '✍️ Konten & SEO Copywriting', en: '✍️ Content & SEO Writing' },
    weights: { agentic: 0.04, coding: 0.02, reasoning: 0.18, knowledge: 0.36, multimodal: 0.10, multilingual: 0.20, instruction: 0.10, math: 0.00 },
  },
  stem_reasoning: {
    id: 'stem_reasoning',
    label: { id: '🧠 STEM & Penalaran Rumit', en: '🧠 STEM & Deep Reasoning' },
    weights: { agentic: 0.04, coding: 0.12, reasoning: 0.44, knowledge: 0.10, multimodal: 0.05, multilingual: 0.01, instruction: 0.04, math: 0.20 },
  },
  vision: {
    id: 'vision',
    label: { id: '👁️ Vision & Dokumen AI', en: '👁️ Vision & Document AI' },
    weights: { agentic: 0.08, coding: 0.04, reasoning: 0.14, knowledge: 0.14, multimodal: 0.52, multilingual: 0.06, instruction: 0.02, math: 0.00 },
  },
};

export const BENCHMARKS = [
  { id: 'swe_bench',      name: 'SWE-bench Verified', category: 'agentic',     metric: 'Resolved %', difficulty: 'Expert', developer: 'Princeton NLP', desc: { id: 'Menyelesaikan masalah bug & feature request nyata dari repositori GitHub open-source.', en: 'Resolves real-world GitHub issues and bug reports from popular open source repos.' } },
  { id: 'livecodebench',  name: 'LiveCodeBench',      category: 'coding',      metric: 'Pass@1 %',   difficulty: 'Hard',   developer: 'LiveCodeBench Team', desc: { id: 'Tolok ukur coding terkini yang diperbarui terus-menerus untuk mencegah kontaminasi data latih.', en: 'Continuously updated coding benchmark designed to prevent training data contamination.' } },
  { id: 'gpqa_diamond',   name: 'GPQA Diamond',       category: 'reasoning',   metric: 'Accuracy %', difficulty: 'PhD Level', developer: 'NYU / Anthropic', desc: { id: 'Pertanyaan pilihan ganda tingkat pascasarjana (Biologi, Fisika, Kimia) yang sulit bahkan bagi pakar.', en: 'PhD-level graduate questions in Biology, Physics, and Chemistry that stump domain experts.' } },
  { id: 'mmlu_pro',       name: 'MMLU-Pro',           category: 'knowledge',   metric: 'Accuracy %', difficulty: 'Hard',   developer: 'TIGER Lab', desc: { id: 'Versi MMLU yang ditingkatkan dengan 10 pilihan jawaban dan fokus penalaran ilmiah yang lebih mendalam.', en: 'Enhanced MMLU with 10 options per question, filtering out noisy questions to test true reasoning.' } },
  { id: 'mmmu',           name: 'MMMU (Val)',         category: 'multimodal',  metric: 'Accuracy %', difficulty: 'Expert', developer: 'MMMU Consortium', desc: { id: 'Evaluasi multimodal tingkat perguruan tinggi yang menggabungkan teks dan visual grafis kompleks.', en: 'College-level multimodal evaluation requiring advanced domain understanding with complex graphics.' } },
  { id: 'ifeval',         name: 'IFEval',             category: 'instruction', metric: 'Strict Acc %', difficulty: 'Medium', developer: 'Google Research', desc: { id: 'Menguji kepatuhan instruksi format objektif yang dapat diverifikasi mesin (misal: "tulis persis 3 paragraf").', en: 'Verifiable instruction following (e.g. "output exactly 3 paragraphs, include keyword X").' } },
  { id: 'math500',        name: 'MATH-500',           category: 'math',        metric: 'Accuracy %', difficulty: 'Competition', developer: 'UC Berkeley', desc: { id: '500 soal kompetisi matematika tingkat SMA/Olimpiade yang menuntut langkah penurunan akurat.', en: '500 challenging high-school math competition problems requiring multi-step derivation.' } },
  { id: 'arena_elo',      name: 'LMSYS Chatbot Arena', category: 'general',    metric: 'Elo Rating', difficulty: 'Crowdsourced', developer: 'LMSYS Org', desc: { id: 'Peringkat Elo berbasis pertarungan blind head-to-head manusia di Chatbot Arena.', en: 'Crowdsourced Elo rating based on blind head-to-head human preference battles.' } },
];

export const RAW_MODELS = [
  // 1. Claude Opus 5 (Design for Online #1 Overall)
  {
    id: 'claude-opus-5',
    name: 'Claude Opus 5',
    vendor: 'Anthropic',
    release: '2026-08',
    license: 'Proprietary',
    status: 'Supported',
    architecture: 'Super-Intelligence Reasoning MoE',
    hfRepo: 'anthropic/claude-opus-5',
    ctx: 1000000,
    maxOut: 128000,
    in: 5.00,
    out: 25.00,
    speed: 65,
    ttft: 520,
    elo: 1445,
    scores: { agentic: 99.2, coding: 98.8, reasoning: 99.0, knowledge: 98.0, multimodal: 97.5, multilingual: 96.0, instruction: 98.2, math: 98.0 },
    benchmarks: { swe_bench: 78.4, livecodebench: 58.2, gpqa_diamond: 88.5, mmlu_pro: 86.4, mmmu: 82.0, ifeval: 96.5, math500: 98.8 },
    pros: {
      id: ['Peringkat #1 Overall di Design for Online & BenchLM 2026', 'SWE-bench 78.4% memecahkan rekor agentic coding', 'Keluaran maksimal 128K token & jendela konteks 1M'],
      en: ['Ranked #1 Overall on Design for Online & BenchLM 2026', 'Record-breaking 78.4% SWE-bench Verified coding score', 'Massive 128K output token ceiling and 1M context window'],
    },
    cons: {
      id: ['Tarif API komputasi flagship ($5/$25 per 1M token)', 'Kecepatan streaming 65 tok/s untuk penalaran penuh'],
      en: ['Premium flagship pricing tier ($5/$25 per 1M tokens)', 'Throughput at 65 tok/s during deep multi-step reasoning'],
    },
    bestFor: { id: 'Tugas enterprise paling kritis, arsitektur software otonom, & pemecahan masalah riset sains terberat', en: 'Highest-stakes enterprise workloads, autonomous software architecture, & complex scientific discovery' },
  },

  // 2. GPT-5.6 Sol (OpenAI Flagship 2026)
  {
    id: 'gpt-5-6-sol',
    name: 'GPT-5.6 Sol',
    vendor: 'OpenAI',
    release: '2026-07',
    license: 'Proprietary',
    status: 'Supported',
    architecture: 'Adaptive Deep Reasoning Router',
    hfRepo: 'openai/gpt-5.6-sol',
    ctx: 1050000,
    maxOut: 128000,
    in: 5.00,
    out: 20.00,
    speed: 80,
    ttft: 480,
    elo: 1440,
    scores: { agentic: 98.0, coding: 98.2, reasoning: 98.8, knowledge: 98.2, multimodal: 96.8, multilingual: 95.5, instruction: 97.0, math: 98.6 },
    benchmarks: { swe_bench: 76.0, livecodebench: 56.4, gpqa_diamond: 86.2, mmlu_pro: 85.8, mmmu: 80.5, ifeval: 96.0, math500: 98.6 },
    pros: {
      id: ['Seri flagship OpenAI 2026 dengan penalaran adaptif', 'Konteks 1.05M token dengan latensi respon seimbang', 'Akurasi penalaran deduktif & sains tingkat tertinggi'],
      en: ['OpenAI 2026 flagship series with adaptive reasoning routing', '1.05M token context with balanced latency', 'Top-tier deductive logic and graduate scientific precision'],
    },
    cons: {
      id: ['Biaya output $20/1M token', 'Terkadang mode penalaran mendalam menambah latensi awal'],
      en: ['Output pricing at $20/1M tokens', 'Deep thinking modes increase initial TTFT on complex prompts'],
    },
    bestFor: { id: 'Deep research, analisis hukum enterprise, simulasi skenario bisnis, & rekayasa sistem', en: 'Deep research, enterprise legal analysis, strategic business simulation, & systems engineering' },
  },

  // 3. Grok 4.6 (xAI 1.5T MoE)
  {
    id: 'grok-4-6',
    name: 'Grok 4.6',
    vendor: 'xAI',
    release: '2026-08',
    license: 'Proprietary',
    status: 'Supported',
    architecture: '1.5T MoE Agentic Architecture',
    hfRepo: 'xai/grok-4-6',
    ctx: 2000000,
    maxOut: 64000,
    in: 2.00,
    out: 10.00,
    speed: 95,
    ttft: 360,
    elo: 1425,
    scores: { agentic: 97.0, coding: 96.5, reasoning: 97.2, knowledge: 97.5, multimodal: 94.0, multilingual: 93.0, instruction: 95.5, math: 96.0 },
    benchmarks: { swe_bench: 73.5, livecodebench: 53.0, gpqa_diamond: 82.0, mmlu_pro: 83.5, mmmu: 77.0, ifeval: 94.8, math500: 97.0 },
    pros: {
      id: ['Jendela konteks masif 2.000.000 token dengan tarif kompetitif ($2/$10)', 'Arsitektur 1.5T MoE dioptimalkan untuk agen otonom jangka panjang', 'Sintesis data real-time terdepan'],
      en: ['Massive 2,000,000 token context window at competitive pricing ($2/$10)', '1.5T MoE architecture tailored for long-horizon agentic workloads', 'Industry-leading real-time information synthesis'],
    },
    cons: {
      id: ['Ketersediaan API enterprise lebih selektif', 'Ukuran model memerlukan throughput tinggi'],
      en: ['Enterprise API access is more selective', 'Large parameter scale requires robust connection pipeline'],
    },
    bestFor: { id: 'Alur kerja agen otonom jangka panjang, pemrosesan dokumen masif 2M token, & analisis tren real-time', en: 'Long-horizon autonomous agent workflows, massive 2M token document synthesis, & real-time trend analytics' },
  },

  // 4. Claude Sonnet 5
  {
    id: 'claude-sonnet-5',
    name: 'Claude Sonnet 5',
    vendor: 'Anthropic',
    release: '2026-07',
    license: 'Proprietary',
    status: 'Supported',
    architecture: 'Hybrid Fast Reasoning Engine',
    hfRepo: 'anthropic/claude-sonnet-5',
    ctx: 1000000,
    maxOut: 64000,
    in: 3.00,
    out: 15.00,
    speed: 90,
    ttft: 340,
    elo: 1420,
    scores: { agentic: 96.8, coding: 97.5, reasoning: 96.0, knowledge: 95.0, multimodal: 96.0, multilingual: 93.5, instruction: 96.5, math: 95.5 },
    benchmarks: { swe_bench: 74.8, livecodebench: 54.0, gpqa_diamond: 85.0, mmlu_pro: 83.0, mmmu: 79.5, ifeval: 95.5, math500: 96.8 },
    pros: {
      id: ['Keseimbangan rasio performa-harga terbaik untuk software engineering', 'SWE-bench 74.8% dengan kecepatan streaming 90 tok/s', 'Jendela konteks 1.000.000 token'],
      en: ['Best performance-to-cost ratio for modern software engineering', '74.8% SWE-bench resolution at 90 tok/s streaming throughput', '1,000,000 token context window'],
    },
    cons: {
      id: ['Biaya lebih tinggi dibanding model open-weights', 'Output maksimal 64K token'],
      en: ['Higher cost compared to open-weights models', '64K output token limit'],
    },
    bestFor: { id: 'Pengembangan aplikasi full-stack sehari-hari, arsitektur frontend/backend, & agen CI/CD', en: 'Daily full-stack development, frontend/backend architecture, & autonomous CI/CD agents' },
  },

  // 5. Muse Spark 1.2 (Meta Superintelligence Labs)
  {
    id: 'muse-spark-1-2',
    name: 'Muse Spark 1.2',
    vendor: 'Meta AI',
    release: '2026-08',
    license: 'Proprietary',
    status: 'Supported',
    architecture: 'Agentic Frontier Engine',
    hfRepo: 'meta-llama/muse-spark-1-2',
    ctx: 500000,
    maxOut: 64000,
    in: 3.50,
    out: 14.00,
    speed: 110,
    ttft: 310,
    elo: 1415,
    scores: { agentic: 96.2, coding: 96.0, reasoning: 96.5, knowledge: 94.8, multimodal: 93.0, multilingual: 92.5, instruction: 96.0, math: 96.2 },
    benchmarks: { swe_bench: 74.0, livecodebench: 54.2, gpqa_diamond: 83.5, mmlu_pro: 82.2, mmmu: 76.0, ifeval: 95.0, math500: 97.2 },
    pros: {
      id: ['Model frontier Meta untuk agentic coding dan penalaran tingkat tinggi', 'Throughput cepat 110 tok/s', 'Performa konsisten pada tugas-tugas logika kompleks'],
      en: ['Meta frontier model built for agentic coding and high-level reasoning', 'Fast 110 tok/s throughput speed', 'Consistent multi-turn logical execution'],
    },
    cons: {
      id: ['Verbosity token perlu dipantau untuk optimasi biaya tugas riil', 'Konteks 500k'],
      en: ['Token verbosity should be monitored for true cost-per-task optimization', '500k context window'],
    },
    bestFor: { id: 'Agen eksekusi kode otomatis, debugging multi-modul, & perencanaan proyek teknik', en: 'Automated code execution agents, multi-module debugging, & technical project planning' },
  },

  // 6. Gemini 3.1 Pro (Google 2026 Flagship)
  {
    id: 'gemini-3-1-pro',
    name: 'Gemini 3.1 Pro',
    vendor: 'Google',
    release: '2026-06',
    license: 'Proprietary',
    status: 'Supported',
    architecture: 'Next-Gen Multimodal Transformer (2.5M Context)',
    hfRepo: 'google/gemini-3.1-pro',
    ctx: 2500000,
    maxOut: 32768,
    in: 1.50,
    out: 6.00,
    speed: 110,
    ttft: 380,
    elo: 1420,
    scores: { agentic: 95.5, coding: 94.8, reasoning: 96.0, knowledge: 98.5, multimodal: 99.2, multilingual: 97.0, instruction: 96.0, math: 95.5 },
    benchmarks: { swe_bench: 73.0, livecodebench: 51.5, gpqa_diamond: 82.5, mmlu_pro: 84.8, mmmu: 84.2, ifeval: 95.8, math500: 96.0 },
    pros: {
      id: ['Jendela konteks terbesar 2.500.000 token', 'Skor multimodal MMMU 84.2% terbaik di dunia', 'Tarif API sangat kompetitif ($1.50 in, $6.00 out)'],
      en: ['World largest 2,500,000 token context window', 'World-leading 84.2% MMMU multimodal benchmark score', 'Highly competitive API rates ($1.50 input, $6.00 output)'],
    },
    cons: {
      id: ['Batas token output 32K', 'Sedikit di bawah Opus 5 pada coding murni'],
      en: ['Output ceiling at 32K tokens', 'Slightly behind Opus 5 on pure algorithmic code'],
    },
    bestFor: { id: 'Pemrosesan multi-jam video & audio, audit dokumen hukum masif, & riset multimodal global', en: 'Multi-hour video/audio processing, massive legal document audits, & global multimodal research' },
  },

  // 7. DeepSeek V4 Pro (DeepSeek 2026 Flagship)
  {
    id: 'deepseek-v4-pro',
    name: 'DeepSeek V4 Pro',
    vendor: 'DeepSeek AI',
    release: '2026-05',
    license: 'Open Weights',
    status: 'Supported',
    architecture: '1.2T MoE (48B active) Deep Reasoning',
    hfRepo: 'deepseek-ai/DeepSeek-V4-Pro',
    ctx: 500000,
    maxOut: 64000,
    in: 0.80,
    out: 3.20,
    speed: 85,
    ttft: 450,
    elo: 1410,
    scores: { agentic: 94.5, coding: 96.0, reasoning: 98.2, knowledge: 95.5, multimodal: 82.0, multilingual: 96.0, instruction: 95.0, math: 99.0 },
    benchmarks: { swe_bench: 72.5, livecodebench: 52.8, gpqa_diamond: 84.0, mmlu_pro: 82.4, mmmu: 74.0, ifeval: 94.5, math500: 98.6 },
    pros: {
      id: ['Performa matematika SOTA (MATH-500 98.6%) & GPQA 84.0%', 'Lisensi terbuka dengan efisiensi MoE mutakhir', 'Harga sangat hemat ($0.80 in / $3.20 out dengan diskon cache 90%)'],
      en: ['SOTA math performance (MATH-500 98.6%) and 84.0% GPQA Diamond', 'Open-weights architecture with next-gen MoE efficiency', 'Extremely economical ($0.80/$3.20 with up to 90% cache discount)'],
    },
    cons: {
      id: ['Membutuhkan kluster GPU enterprise untuk hosting lokal penuh', 'Pemrosesan visual di bawah Gemini'],
      en: ['Requires enterprise GPU cluster for full unquantized local hosting', 'Vision capabilities slightly below Gemini'],
    },
    bestFor: { id: 'Pemecahan masalah matematika/STEM enterprise, deployment open-source privat, & reasoning berbiaya rendah', en: 'Enterprise STEM problem solving, private open-source deployments, & low-cost reasoning pipelines' },
  },

  // 8. Qwen3.8 Max (Alibaba 2026 Flagship)
  {
    id: 'qwen-3-8-max',
    name: 'Qwen3.8 Max',
    vendor: 'Alibaba Cloud',
    release: '2026-08',
    license: 'Proprietary',
    status: 'Supported',
    architecture: 'Next-Gen Ultra-Scale Dense',
    hfRepo: 'Qwen/Qwen3.8-Max',
    ctx: 1000000,
    maxOut: 64000,
    in: 1.80,
    out: 7.20,
    speed: 95,
    ttft: 320,
    elo: 1405,
    scores: { agentic: 94.0, coding: 95.2, reasoning: 95.0, knowledge: 97.0, multimodal: 88.0, multilingual: 97.5, instruction: 95.5, math: 96.5 },
    benchmarks: { swe_bench: 71.2, livecodebench: 50.5, gpqa_diamond: 80.4, mmlu_pro: 82.0, mmmu: 76.5, ifeval: 95.0, math500: 97.0 },
    pros: {
      id: ['Flagship Alibaba 2026 di Design for Online', 'Penguasaan 100+ bahasa Asia & global terbaik', 'Konteks 1.000.000 token dengan latensi rendah'],
      en: ['Alibaba 2026 flagship featured on Design for Online leaderboard', 'Top-tier fluency across 100+ Asian and global languages', '1,000,000 token context window with low latency'],
    },
    cons: {
      id: ['Tersedia melalui API komersial (bukan open weights penuh)', 'Biaya output $7.20/1M'],
      en: ['Served via commercial API tier rather than raw open weights', 'Output pricing at $7.20/1M tokens'],
    },
    bestFor: { id: 'Enterprise global Asia-Pasifik, penalaran bisnis lintas bahasa, & aplikasi agentic terdistribusi', en: 'Asia-Pacific global enterprise, cross-lingual business intelligence, & distributed agentic apps' },
  },

  // 9. Claude Fable 5
  {
    id: 'claude-fable-5',
    name: 'Claude Fable 5',
    vendor: 'Anthropic',
    release: '2026-07',
    license: 'Proprietary',
    status: 'Supported',
    architecture: 'High-Throughput Reasoning Transformer',
    hfRepo: 'anthropic/claude-fable-5',
    ctx: 500000,
    maxOut: 64000,
    in: 2.50,
    out: 10.00,
    speed: 120,
    ttft: 280,
    elo: 1395,
    scores: { agentic: 93.0, coding: 94.5, reasoning: 94.0, knowledge: 94.0, multimodal: 92.0, multilingual: 92.0, instruction: 95.0, math: 94.0 },
    benchmarks: { swe_bench: 69.5, livecodebench: 48.0, gpqa_diamond: 78.0, mmlu_pro: 80.5, mmmu: 74.0, ifeval: 94.0, math500: 95.0 },
    pros: {
      id: ['Kecepatan 120 tok/s dengan penalaran kuat', 'Konteks 500.000 token', 'Kualitas sintaksis coding dan percakapan sangat natural'],
      en: ['120 tok/s throughput speed with robust reasoning', '500k context window', 'High-quality syntax fidelity and natural conversation nuance'],
    },
    cons: {
      id: ['Plafon kemampuan sedikit di bawah Opus 5', 'Biaya output $10/1M'],
      en: ['Slightly behind Opus 5 on PhD-level logic benchmarks', 'Output pricing at $10/1M'],
    },
    bestFor: { id: 'Asisten interaktif berkecepatan tinggi, review PR harian, & pembuatan konten teknis', en: 'High-speed interactive assistants, daily PR code reviews, & technical content synthesis' },
  },

  // 10. GPT-5.6 Terra
  {
    id: 'gpt-5-6-terra',
    name: 'GPT-5.6 Terra',
    vendor: 'OpenAI',
    release: '2026-07',
    license: 'Proprietary',
    status: 'Supported',
    architecture: 'High-Speed Workhorse Engine',
    hfRepo: 'openai/gpt-5.6-terra',
    ctx: 1000000,
    maxOut: 64000,
    in: 2.50,
    out: 10.00,
    speed: 130,
    ttft: 260,
    elo: 1390,
    scores: { agentic: 92.5, coding: 93.0, reasoning: 93.5, knowledge: 95.0, multimodal: 94.5, multilingual: 93.0, instruction: 94.5, math: 93.0 },
    benchmarks: { swe_bench: 67.5, livecodebench: 47.0, gpqa_diamond: 76.5, mmlu_pro: 79.5, mmmu: 76.0, ifeval: 94.2, math500: 94.5 },
    pros: {
      id: ['Workhorse efisien OpenAI dengan kecepatan 130 tok/s', 'Jendela konteks 1.000.000 token', 'Dukungan penuh ekosistem OpenAI Tooling'],
      en: ['Efficient OpenAI workhorse engine with 130 tok/s throughput', '1,000,000 token context window', 'Seamless OpenAI Tooling and function calling integration'],
    },
    cons: {
      id: ['Kemampuan penalaran di bawah varian Sol', 'Output $10/1M'],
      en: ['Reasoning ceiling below flagship Sol variant', 'Output at $10/1M'],
    },
    bestFor: { id: 'Aplikasi produksi volume menengah-tinggi, ekstraksi data multimodal, & otomatisasi alur kerja', en: 'Mid-to-high volume production apps, multimodal document extraction, & workflow automation' },
  },

  // 11. DeepSeek V4 Flash (Design for Online Budget King 2026)
  {
    id: 'deepseek-v4-flash',
    name: 'DeepSeek V4 Flash',
    vendor: 'DeepSeek AI',
    release: '2026-06',
    license: 'Open Weights',
    status: 'Supported',
    architecture: 'High-Efficiency MoE (220 tok/s)',
    hfRepo: 'deepseek-ai/DeepSeek-V4-Flash',
    ctx: 500000,
    maxOut: 16384,
    in: 0.14,
    out: 0.28,
    speed: 220,
    ttft: 180,
    elo: 1355,
    scores: { agentic: 89.5, coding: 91.0, reasoning: 91.5, knowledge: 94.0, multimodal: 78.0, multilingual: 94.5, instruction: 93.5, math: 93.0 },
    benchmarks: { swe_bench: 60.5, livecodebench: 45.0, gpqa_diamond: 72.0, mmlu_pro: 77.5, mmmu: 71.0, ifeval: 93.0, math500: 93.5 },
    pros: {
      id: ['Model paling bernilai (Value King 2026) di Design for Online', 'Kecepatan 220+ tok/s dengan tarif hanya $0.14 in / $0.28 out', 'Konteks 500.000 token'],
      en: ['Value King 2026 on Design for Online leaderboard', '220+ tok/s speed at only $0.14 in / $0.28 out per 1M tokens', '500,000 token context window'],
    },
    cons: {
      id: ['Multimodal visual terbatas', 'Plafon penalaran di bawah model Pro'],
      en: ['Limited visual multimodal support', 'Reasoning ceiling below Pro tiers'],
    },
    bestFor: { id: 'Aplikasi produksi volume masif dengan anggaran hemat, klasifikasi real-time, & API berlatensi ultra-rendah', en: 'Massive scale production on a budget, real-time data classification, & ultra-low latency APIs' },
  },

  // 12. Gemini 3 Flash
  {
    id: 'gemini-3-flash',
    name: 'Gemini 3 Flash',
    vendor: 'Google',
    release: '2026-06',
    license: 'Proprietary',
    status: 'Supported',
    architecture: 'Ultra-Low Latency Multimodal (240 tok/s)',
    hfRepo: 'google/gemini-3-flash',
    ctx: 1500000,
    maxOut: 16384,
    in: 0.10,
    out: 0.40,
    speed: 240,
    ttft: 160,
    elo: 1350,
    scores: { agentic: 88.0, coding: 89.0, reasoning: 89.5, knowledge: 92.5, multimodal: 95.0, multilingual: 93.0, instruction: 92.5, math: 90.0 },
    benchmarks: { swe_bench: 62.0, livecodebench: 43.5, gpqa_diamond: 74.0, mmlu_pro: 76.0, mmmu: 78.0, ifeval: 92.5, math500: 91.0 },
    pros: {
      id: ['Kecepatan kilat 240 tok/s dengan TTFT 160ms', 'Jendela konteks 1.500.000 token dengan harga $0.10 in / $0.40 out', 'Multimodal audio, video, & teks real-time terbaik'],
      en: ['Blazing 240 tok/s speed with 160ms initial latency', '1,500,000 token context window at $0.10 input / $0.40 output', 'Top-tier real-time audio, video, and text multimodal streaming'],
    },
    cons: {
      id: ['Plafon penalaran di bawah model 3.1 Pro', 'Batas output 16K'],
      en: ['Reasoning depth below 3.1 Pro tier', '16K max output limit'],
    },
    bestFor: { id: 'AI suara real-time, pemrosesan video streaming langsung, & routing agen instan', en: 'Real-time voice AI, live video streaming analysis, & instant multi-agent routing' },
  },

  // 13. Llama 4.5 405B (Meta Open SOTA 2026)
  {
    id: 'llama-4-5-405b',
    name: 'Llama 4.5 405B',
    vendor: 'Meta AI',
    release: '2026-06',
    license: 'Open Weights',
    status: 'Supported',
    architecture: '405B Dense Open Weights Flagship',
    hfRepo: 'meta-llama/Llama-4.5-405B-Instruct',
    ctx: 256000,
    maxOut: 16384,
    in: 1.50,
    out: 4.50,
    speed: 45,
    ttft: 600,
    elo: 1375,
    scores: { agentic: 92.0, coding: 93.0, reasoning: 94.0, knowledge: 97.0, multimodal: 75.0, multilingual: 95.0, instruction: 96.0, math: 94.0 },
    benchmarks: { swe_bench: 65.0, livecodebench: 48.0, gpqa_diamond: 76.0, mmlu_pro: 81.0, mmmu: 72.0, ifeval: 95.5, math500: 94.0 },
    pros: {
      id: ['Model dense open-weights flagship terkuat dari Meta 2026', 'Jendela konteks 256k', 'Fondasi terbaik untuk distilasi model internal privat'],
      en: ['Most capable Meta open-weights dense flagship of 2026', '256k context window', 'Prime foundation for proprietary model distillation and synthetic data'],
    },
    cons: {
      id: ['Memerlukan infrastruktur kluster 8x H100 GPU untuk self-hosting', 'Throughput 45 tok/s'],
      en: ['Requires 8x H100 GPU cluster for unquantized self-hosting', 'Throughput at 45 tok/s'],
    },
    bestFor: { id: 'Distilasi model kustom perusahaan, riset AI otonom, & deployment berdaulat on-premise', en: 'Enterprise model distillation, autonomous AI research, & sovereign on-premise deployment' },
  },

  // 14. Llama 4.5 70B
  {
    id: 'llama-4-5-70b',
    name: 'Llama 4.5 70B',
    vendor: 'Meta AI',
    release: '2026-06',
    license: 'Open Weights',
    status: 'Supported',
    architecture: '70B Dense Open Workhorse',
    hfRepo: 'meta-llama/Llama-4.5-70B-Instruct',
    ctx: 256000,
    maxOut: 16384,
    in: 0.20,
    out: 0.60,
    speed: 130,
    ttft: 270,
    elo: 1345,
    scores: { agentic: 89.0, coding: 90.5, reasoning: 91.0, knowledge: 94.0, multimodal: 70.0, multilingual: 93.0, instruction: 94.8, math: 91.0 },
    benchmarks: { swe_bench: 58.0, livecodebench: 44.0, gpqa_diamond: 68.0, mmlu_pro: 76.5, mmmu: 68.0, ifeval: 94.8, math500: 91.0 },
    pros: {
      id: ['Model open-weights 70B generasi 2026 paling efisien', 'Konteks 256k dengan kecepatan 130 tok/s', 'Dapat di-host mandiri pada 2x GPU 80GB'],
      en: ['Most efficient 2026-generation 70B open-weights model', '256k context window with 130 tok/s throughput', 'Self-hostable on 2x 80GB enterprise GPUs'],
    },
    cons: {
      id: ['Visual terbatas dibanding model multimodal khusus', 'Penalaran di bawah model 405B'],
      en: ['Limited vision compared to dedicated multimodal models', 'Reasoning ceiling below 405B tier'],
    },
    bestFor: { id: 'Inference enterprise on-premise, pipeline RAG dokumen privat, & chatbot kustom', en: 'On-premise enterprise inference, private document RAG pipelines, & custom enterprise chat' },
  },

  // 15. Qwen3 VL 235B A22B (Alibaba Multimodal Open SOTA)
  {
    id: 'qwen-3-vl-235b',
    name: 'Qwen3 VL 235B (A22B)',
    vendor: 'Alibaba Cloud',
    release: '2026-07',
    license: 'Open Weights',
    status: 'Supported',
    architecture: '235B MoE (22B active) Vision Transformer',
    hfRepo: 'Qwen/Qwen3-VL-235B-A22B-Instruct',
    ctx: 256000,
    maxOut: 16384,
    in: 0.80,
    out: 2.40,
    speed: 90,
    ttft: 350,
    elo: 1360,
    scores: { agentic: 91.0, coding: 92.0, reasoning: 92.5, knowledge: 94.0, multimodal: 96.5, multilingual: 95.0, instruction: 94.0, math: 92.0 },
    benchmarks: { swe_bench: 60.0, livecodebench: 45.0, gpqa_diamond: 72.0, mmlu_pro: 78.0, mmmu: 82.5, ifeval: 94.0, math500: 92.0 },
    pros: {
      id: ['Model multimodal visual open-weights terbaik di Design for Online 2026', 'Skor MMMU 82.5% dengan arsitektur MoE hemat komputasi (22B active)', 'Konteks 256k'],
      en: ['Top open-weights visual multimodal model on Design for Online 2026', '82.5% MMMU score with compute-efficient MoE routing (22B active)', '256k context window'],
    },
    cons: {
      id: ['Memerlukan infrastruktur multi-GPU untuk bobot 235B', 'Kecepatan tergantung kuantisasi'],
      en: ['Multi-GPU infrastructure needed for full 235B footprint', 'Speed depends on quantization level'],
    },
    bestFor: { id: 'Analisis visual teknis open-source, OCR dokumen diagram multi-halaman, & agen GUI otonom', en: 'Open-source technical visual analysis, multi-page diagram OCR, & autonomous GUI agents' },
  },

  // 16. Claude 3.7 Sonnet
  {
    id: 'claude-3-7-sonnet',
    name: 'Claude 3.7 Sonnet',
    vendor: 'Anthropic',
    release: '2025-02',
    license: 'Proprietary',
    status: 'Supported',
    architecture: 'Hybrid Reasoning Transformer',
    hfRepo: 'anthropic/claude-3-7-sonnet',
    ctx: 200000,
    maxOut: 64000,
    in: 3.00,
    out: 15.00,
    speed: 78,
    ttft: 410,
    elo: 1395,
    scores: { agentic: 96.0, coding: 97.2, reasoning: 94.5, knowledge: 92.4, multimodal: 93.0, multilingual: 88.5, instruction: 94.8, math: 93.5 },
    benchmarks: { swe_bench: 70.3, livecodebench: 49.2, gpqa_diamond: 84.8, mmlu_pro: 78.4, mmmu: 70.4, ifeval: 93.2, math500: 96.2 },
    pros: {
      id: ['Mode penalaran adaptif (hybrid extended thinking)', 'Kinerja coding SWE-bench 70.3% terbukti andal', 'Keluaran maksimal hingga 64K token'],
      en: ['Adaptive hybrid extended thinking toggle', 'Proven 70.3% SWE-bench Verified coding benchmark', 'Massive 64K output token limit'],
    },
    cons: {
      id: ['Biaya komputasi lebih tinggi saat mode thinking aktif', 'Jendela konteks 200k'],
      en: ['Higher cost when extended thinking is enabled', '200k context window'],
    },
    bestFor: { id: 'Rekayasa perangkat lunak otonom, refactoring repositori besar, & agen coding kompleks', en: 'Autonomous SWE agents, large repo refactoring, & complex multi-step coding' },
  },

  // 17. DeepSeek-R1
  {
    id: 'deepseek-r1',
    name: 'DeepSeek-R1',
    vendor: 'DeepSeek AI',
    release: '2025-01',
    license: 'Open Weights',
    status: 'Supported',
    architecture: '671B MoE (37B active) Pure RL',
    hfRepo: 'deepseek-ai/DeepSeek-R1',
    ctx: 128000,
    maxOut: 64000,
    in: 0.55,
    out: 2.19,
    speed: 45,
    ttft: 750,
    elo: 1365,
    scores: { agentic: 88.5, coding: 92.4, reasoning: 97.5, knowledge: 90.5, multimodal: 72.0, multilingual: 91.0, instruction: 92.0, math: 98.2 },
    benchmarks: { swe_bench: 49.2, livecodebench: 45.4, gpqa_diamond: 71.5, mmlu_pro: 75.9, mmmu: 65.0, ifeval: 91.0, math500: 97.3 },
    pros: {
      id: ['Lisensi terbuka MIT (bobot bebas diunduh & di-host mandiri)', 'Performa penalaran setara o1 dengan 1/10 biaya', 'Diskon context caching hingga 90% ($0.14/1M)'],
      en: ['Open weights MIT license for self-hosting', 'o1-level reasoning performance at ~1/10th the cost', 'Up to 90% context caching discount ($0.14/1M)'],
    },
    cons: {
      id: ['Kemampuan multimodal gambar/video terbatas', 'Membutuhkan kluster GPU besar untuk self-hosting penuh'],
      en: ['Limited native multimodal vision capabilities', 'Requires heavy GPU cluster for full unquantized self-hosting'],
    },
    bestFor: { id: 'Pemecahan masalah matematika, analisis logis, pipeline penalaran open-source, & deployment privat', en: 'Math problem solving, logical analysis, open-source reasoning pipelines, & private deployments' },
  },

  // 18. o3-mini
  {
    id: 'o3-mini',
    name: 'o3-mini',
    vendor: 'OpenAI',
    release: '2025-01',
    license: 'Proprietary',
    status: 'Supported',
    architecture: 'Compact RL Reasoning Transformer',
    hfRepo: 'openai/o3-mini',
    ctx: 200000,
    maxOut: 100000,
    in: 1.10,
    out: 4.40,
    speed: 115,
    ttft: 380,
    elo: 1335,
    scores: { agentic: 89.2, coding: 92.5, reasoning: 94.8, knowledge: 88.5, multimodal: 70.0, multilingual: 87.5, instruction: 91.5, math: 96.8 },
    benchmarks: { swe_bench: 58.6, livecodebench: 46.2, gpqa_diamond: 74.8, mmlu_pro: 73.5, mmmu: 62.5, ifeval: 90.5, math500: 96.8 },
    pros: {
      id: ['Rasio harga-terhadap-penalaran terbaik di ekosistem OpenAI', 'Kecepatan streaming 115+ tok/s dengan 3 level reasoning effort', 'Konteks 200k & output 100k'],
      en: ['Best price-to-reasoning ratio in OpenAI ecosystem', '115+ tok/s high throughput with 3 reasoning effort levels', '200k context & 100k output limit'],
    },
    cons: {
      id: ['Hanya teks (tidak mendukung input gambar multimodal)', 'Terkadang menghasilkan token berpikir berlebih'],
      en: ['Text-only (no native vision/multimodal input)', 'Can be verbose with reasoning tokens on simple queries'],
    },
    bestFor: { id: 'Asisten coding berkecepatan tinggi, generator unit test otomatis, & problem solving STEM skala besar', en: 'High-speed coding assistant, automated unit test generation, & high-volume STEM problem solving' },
  },

  // 19. DeepSeek-V3
  {
    id: 'deepseek-v3',
    name: 'DeepSeek-V3',
    vendor: 'DeepSeek AI',
    release: '2024-12',
    license: 'Open Weights',
    status: 'Supported',
    architecture: '671B MoE (37B active) MLA',
    hfRepo: 'deepseek-ai/DeepSeek-V3',
    ctx: 128000,
    maxOut: 8192,
    in: 0.14,
    out: 0.28,
    speed: 82,
    ttft: 450,
    elo: 1325,
    scores: { agentic: 86.8, coding: 88.5, reasoning: 87.5, knowledge: 93.2, multimodal: 74.0, multilingual: 93.0, instruction: 92.2, math: 90.2 },
    benchmarks: { swe_bench: 48.0, livecodebench: 41.5, gpqa_diamond: 59.1, mmlu_pro: 74.2, mmmu: 68.2, ifeval: 91.2, math500: 90.2 },
    pros: {
      id: ['Efisiensi biaya luar biasa ($0.14/1M in, $0.28/1M out)', 'Arsitektur Multi-head Latent Attention (MLA) mutakhir', 'Performa umum mengungguli GPT-4o dengan biaya jauh lebih murah'],
      en: ['Incredible cost efficiency ($0.14/1M in, $0.28/1M out)', 'Cutting-edge Multi-head Latent Attention (MLA) architecture', 'General knowledge outperforms GPT-4o at a fraction of the price'],
    },
    cons: {
      id: ['Memerlukan infrastruktur MoE khusus untuk inference lokal', 'Multimodal tidak didukung secara natif'],
      en: ['Requires specialized MoE infrastructure for local inference', 'Multimodal vision not supported natively'],
    },
    bestFor: { id: 'Aplikasi produksi berskala besar hemat biaya, summarization masif, & asisten multibahasa', en: 'High-volume production applications on a budget, massive summarization, & multilingual assistants' },
  },

  // 20. Qwen 2.5 Coder 32B
  {
    id: 'qwen-2-5-coder-32b',
    name: 'Qwen 2.5 Coder 32B',
    vendor: 'Alibaba Cloud',
    release: '2024-11',
    license: 'Open Weights',
    status: 'Supported',
    architecture: '32.5B Dense Transformer (Apache 2.0)',
    hfRepo: 'Qwen/Qwen2.5-Coder-32B-Instruct',
    ctx: 128000,
    maxOut: 8192,
    in: 0.20,
    out: 0.60,
    speed: 95,
    ttft: 290,
    elo: 1275,
    scores: { agentic: 82.5, coding: 92.0, reasoning: 82.5, knowledge: 82.0, multimodal: 58.0, multilingual: 85.5, instruction: 89.0, math: 88.5 },
    benchmarks: { swe_bench: 44.2, livecodebench: 46.0, gpqa_diamond: 41.7, mmlu_pro: 65.4, mmmu: 52.0, ifeval: 88.0, math500: 89.2 },
    pros: {
      id: ['Model coding open-source terbaik di kelas 32B (mengalahkan GPT-4o di coding)', 'Dapat dijalankan di 1 GPU konsumen (RTX 4090/A5000 24GB)', 'Lisensi komersial terbuka Apache 2.0'],
      en: ['Top open-source coding model in 32B class (beats GPT-4o on code benchmarks)', 'Runs locally on a single 24GB consumer GPU (RTX 4090/A5000)', 'Fully permissive Apache 2.0 commercial license'],
    },
    cons: {
      id: ['Fokus khusus coding, kurang optimal untuk penulisan naratif sastra', 'Tidak mendukung input multimodal visual'],
      en: ['Specialized for coding, less nuanced for creative prose', 'No native visual multimodal input'],
    },
    bestFor: { id: 'Integrasi IDE coding lokal (Cursor/Continue/VS Code), refactoring kode, & review PR otomatis privat', en: 'Local IDE coding assistant (Cursor/Continue/VS Code), code refactoring, & private automated PR reviews' },
  },

  // 21. QwQ-32B
  {
    id: 'qwq-32b',
    name: 'QwQ-32B (Reasoning)',
    vendor: 'Alibaba Cloud',
    release: '2025-01',
    license: 'Open Weights',
    status: 'Supported',
    architecture: '32.5B RL Thinking Transformer',
    hfRepo: 'Qwen/QwQ-32B-Preview',
    ctx: 128000,
    maxOut: 32000,
    in: 0.25,
    out: 0.75,
    speed: 65,
    ttft: 580,
    elo: 1305,
    scores: { agentic: 78.5, coding: 87.0, reasoning: 94.2, knowledge: 84.5, multimodal: 60.0, multilingual: 86.5, instruction: 87.5, math: 96.0 },
    benchmarks: { swe_bench: 41.0, livecodebench: 50.0, gpqa_diamond: 65.2, mmlu_pro: 70.1, mmmu: 55.0, ifeval: 87.5, math500: 90.6 },
    pros: {
      id: ['Kemampuan penalaran STEM & matematika tingkat olimpiade pada model 32B', 'Rantai pemikiran (thinking trace) transparan & dapat diaudit', 'Bisa di-host lokal pada perangkat keras terjangkau'],
      en: ['Olympiad-level STEM and math reasoning density in a 32B parameter footprint', 'Transparent, auditable step-by-step thinking traces', 'Deployable locally on accessible consumer/workstation hardware'],
    },
    cons: {
      id: ['Generasi token lebih panjang karena proses berpikir mendalam', 'Kurang optimal untuk tugas klasifikasi teks instan sederhana'],
      en: ['More verbose output tokens due to step-by-step reasoning', 'Less ideal for simple single-turn classification tasks'],
    },
    bestFor: { id: 'Penyelesaian soal matematika kompleks, penalaran algoritmik, & riset STEM privat', en: 'Complex math problem solving, algorithmic reasoning, & private STEM research' },
  },

  // 22. Llama 3.3 70B
  {
    id: 'llama-3-3-70b',
    name: 'Llama 3.3 70B Instruct',
    vendor: 'Meta AI',
    release: '2024-12',
    license: 'Open Weights',
    status: 'Supported',
    architecture: '70.6B Dense Transformer',
    hfRepo: 'meta-llama/Llama-3.3-70B-Instruct',
    ctx: 128000,
    maxOut: 8192,
    in: 0.18,
    out: 0.60,
    speed: 110,
    ttft: 320,
    elo: 1295,
    scores: { agentic: 83.5, coding: 84.0, reasoning: 85.0, knowledge: 91.5, multimodal: 62.0, multilingual: 90.0, instruction: 92.1, math: 85.0 },
    benchmarks: { swe_bench: 39.8, livecodebench: 36.4, gpqa_diamond: 50.5, mmlu_pro: 68.9, mmmu: 58.0, ifeval: 92.1, math500: 77.0 },
    pros: {
      id: ['Kemampuan setara Llama 3.1 405B dengan efisiensi parameter 70B', 'Ekosistem tooling & fine-tuning terluas di dunia open-source', 'Kepatuhan instruksi format IFEval sangat tinggi (92.1%)'],
      en: ['Matches Llama 3.1 405B capabilities at 70B parameter efficiency', 'Deepest tooling and fine-tuning ecosystem in the open-source world', 'Very high IFEval instruction compliance (92.1%)'],
    },
    cons: {
      id: ['Tidak memiliki input visual multimodal natif', 'Plafon matematika di bawah model penalaran RL murni'],
      en: ['No native visual multimodal input', 'Math ceiling is lower than dedicated RL reasoning models'],
    },
    bestFor: { id: 'Inference enterprise on-premise pada 2x GPU, ekstraksi JSON terstruktur, & fine-tuning kustom industri', en: 'On-premise enterprise inference on 2x GPUs, structured JSON extraction, & domain fine-tuning' },
  },

  // 23. Phi-4 (14B)
  {
    id: 'phi-4',
    name: 'Phi-4 (14B)',
    vendor: 'Microsoft',
    release: '2024-12',
    license: 'Open Weights',
    status: 'Supported',
    architecture: '14.7B Dense Synthetic-Trained (MIT)',
    hfRepo: 'microsoft/phi-4',
    ctx: 16384,
    maxOut: 4096,
    in: 0.10,
    out: 0.30,
    speed: 160,
    ttft: 200,
    elo: 1245,
    scores: { agentic: 74.5, coding: 84.0, reasoning: 89.0, knowledge: 82.5, multimodal: 50.0, multilingual: 79.0, instruction: 86.5, math: 92.5 },
    benchmarks: { swe_bench: 32.0, livecodebench: 34.0, gpqa_diamond: 54.0, mmlu_pro: 63.0, mmmu: 45.0, ifeval: 85.0, math500: 89.0 },
    pros: {
      id: ['Kerapatan penalaran & matematika spektakuler untuk ukuran hanya 14B parameter', 'Lisensi MIT bebas digunakan untuk komersial', 'Sangat ringan: dapat berjalan di laptop & edge device'],
      en: ['Spectacular reasoning and math density in a compact 14B parameter footprint', 'Permissive MIT open license', 'Extremely lightweight: runnable on laptops and edge devices'],
    },
    cons: {
      id: ['Jendela konteks 16K', 'Pengetahuan ensiklopedis luas terbatas dibandingkan model 70B+'],
      en: ['16K context window limit', 'Broad factual knowledge depth is more limited than 70B+ models'],
    },
    bestFor: { id: 'Eksekusi offline di perangkat lokal/edge, asisten bimbingan matematika, & komputasi penalaran hemat daya', en: 'Offline edge/on-device execution, math tutoring assistant, & power-efficient reasoning pipelines' },
  },

  // 24. Pixtral Large (124B)
  {
    id: 'pixtral-large',
    name: 'Pixtral Large 124B',
    vendor: 'Mistral AI',
    release: '2024-11',
    license: 'Open Weights',
    status: 'Supported',
    architecture: '124B Multimodal Vision Transformer',
    hfRepo: 'mistralai/Pixtral-Large-Instruct-2411',
    ctx: 128000,
    maxOut: 8192,
    in: 2.00,
    out: 6.00,
    speed: 70,
    ttft: 480,
    elo: 1290,
    scores: { agentic: 85.0, coding: 87.0, reasoning: 88.0, knowledge: 92.0, multimodal: 94.5, multilingual: 93.0, instruction: 91.0, math: 86.0 },
    benchmarks: { swe_bench: 40.0, livecodebench: 38.0, gpqa_diamond: 52.0, mmlu_pro: 71.0, mmmu: 76.5, ifeval: 91.0, math500: 83.0 },
    pros: {
      id: ['Pemahaman visual beresolusi tinggi dengan 128k context', 'Arsitektur multimodal open-weights terbesar dari Mistral', 'Sangat akurat dalam membaca tabel, grafik teknis, dan dokumen'],
      en: ['High-resolution vision understanding with 128k context', 'Mistral flagship open-weights multimodal architecture', 'High precision on complex charts, technical graphics, and dense documents'],
    },
    cons: {
      id: ['Memerlukan infrastruktur hardware besar', 'Tarif API setara Mistral Large 2'],
      en: ['Large compute footprint for local hosting', 'Commercial API pricing comparable to Mistral Large 2'],
    },
    bestFor: { id: 'Ekstraksi dokumen visual, OCR cerdas, & audit bagan teknis kompleks', en: 'Visual document parsing, intelligent OCR, & complex technical chart auditing' },
  },

  // 25. Codestral 2501
  {
    id: 'codestral-2501',
    name: 'Codestral 2501',
    vendor: 'Mistral AI',
    release: '2025-01',
    license: 'Open Weights',
    status: 'Supported',
    architecture: '22B Dense Code Transformer (256k Context)',
    hfRepo: 'mistralai/Codestral-22B-v0.1',
    ctx: 256000,
    maxOut: 8192,
    in: 0.30,
    out: 0.90,
    speed: 130,
    ttft: 250,
    elo: 1235,
    scores: { agentic: 78.5, coding: 91.0, reasoning: 80.0, knowledge: 78.0, multimodal: 50.0, multilingual: 82.0, instruction: 87.0, math: 84.0 },
    benchmarks: { swe_bench: 37.0, livecodebench: 37.9, gpqa_diamond: 38.0, mmlu_pro: 58.0, mmmu: 48.0, ifeval: 86.0, math500: 82.0 },
    pros: {
      id: ['Konteks masif 256.000 token khusus kode repositori besar', 'Dukungan Fill-in-the-Middle (FIM) untuk autocomplete IDE instan', 'Kecepatan inferensi tinggi 130 tok/s'],
      en: ['Massive 256k context window tailored for entire code repositories', 'Native Fill-in-the-Middle (FIM) support for instant IDE autocomplete', 'High throughput speed of 130 tok/s'],
    },
    cons: {
      id: ['Terbatas hanya untuk use case pemrograman dan software engineering', 'Tidak dirancang untuk obrolan umum'],
      en: ['Strictly limited to coding and software engineering tasks', 'Not designed for general prose or chat dialogue'],
    },
    bestFor: { id: 'Autocomplete IDE real-time, pengisian bagian tengah kode (FIM), & generator dokumentasi API', en: 'Real-time IDE code completion, fill-in-the-middle code insertion, & API doc generation' },
  },

  // 26. DeepSeek-Coder-V2
  {
    id: 'deepseek-coder-v2',
    name: 'DeepSeek-Coder-V2',
    vendor: 'DeepSeek AI',
    release: '2024-06',
    license: 'Open Weights',
    status: 'Supported',
    architecture: '236B MoE (21B active) Code Expert',
    hfRepo: 'deepseek-ai/DeepSeek-Coder-V2-Instruct',
    ctx: 128000,
    maxOut: 8192,
    in: 0.14,
    out: 0.28,
    speed: 85,
    ttft: 410,
    elo: 1270,
    scores: { agentic: 82.0, coding: 91.5, reasoning: 85.0, knowledge: 80.0, multimodal: 50.0, multilingual: 88.0, instruction: 89.0, math: 90.0 },
    benchmarks: { swe_bench: 43.5, livecodebench: 42.0, gpqa_diamond: 42.5, mmlu_pro: 64.0, mmmu: 50.0, ifeval: 87.0, math500: 90.2 },
    pros: {
      id: ['Mendukung 338 bahasa pemrograman dengan akurasi sintaksis tinggi', 'Konteks 128k dengan arsitektur MoE hemat token', 'Performa coding mendekati model komersial tier-1'],
      en: ['Supports 338 programming languages with high syntax fidelity', '128k context with token-efficient MoE routing', 'Coding performance rivaling proprietary tier-1 engines'],
    },
    cons: {
      id: ['Ukuran bobot penuh (236B) memerlukan infrastruktur multi-GPU', 'Tidak memiliki vision capability'],
      en: ['Full 236B weight requires multi-GPU cluster', 'No visual multimodal features'],
    },
    bestFor: { id: 'Pipeline CI/CD otomatis, debugging bahasa khusus (Rust, Go, Solidity), & code generation skala besar', en: 'Automated CI/CD pipelines, polyglot debugging (Rust, Go, Solidity), & high-volume code synthesis' },
  },

  // 27. Mistral NeMo 12B
  {
    id: 'mistral-nemo-12b',
    name: 'Mistral NeMo 12B',
    vendor: 'Mistral AI & NVIDIA',
    release: '2024-07',
    license: 'Open Weights',
    status: 'Supported',
    architecture: '12.2B Dense (Tekken Tokenizer, Apache 2.0)',
    hfRepo: 'mistralai/Mistral-Nemo-Instruct-2407',
    ctx: 128000,
    maxOut: 4096,
    in: 0.12,
    out: 0.36,
    speed: 150,
    ttft: 220,
    elo: 1220,
    scores: { agentic: 72.0, coding: 76.0, reasoning: 77.0, knowledge: 81.0, multimodal: 50.0, multilingual: 88.5, instruction: 86.0, math: 76.0 },
    benchmarks: { swe_bench: 26.0, livecodebench: 28.0, gpqa_diamond: 36.0, mmlu_pro: 57.5, mmmu: 45.0, ifeval: 84.5, math500: 74.0 },
    pros: {
      id: ['Tokenizer Tekken ultra-efisien untuk kompresi token teks multibahasa & kode', 'Lisensi terbuka Apache 2.0', 'Konteks 128k pada model ukuran ringkas 12B'],
      en: ['Ultra-efficient Tekken tokenizer for superior multilingual token compression', 'Permissive Apache 2.0 license', 'Full 128k context window in a compact 12B footprint'],
    },
    cons: {
      id: ['Plafon penalaran matematika & coding kompleks terbatas di kelas 12B'],
      en: ['Complex reasoning and math capabilities naturally capped by 12B scale'],
    },
    bestFor: { id: 'Aplikasi edge multibahasa, chatbot hemat memori, & kompresi token efisien di produksi', en: 'Multilingual edge applications, memory-efficient chatbots, & high-efficiency token workflows' },
  },

  // 28. Gemma 2 27B
  {
    id: 'gemma-2-27b',
    name: 'Gemma 2 27B',
    vendor: 'Google',
    release: '2024-06',
    license: 'Open Weights',
    status: 'Supported',
    architecture: '27.2B Dense Transformer (Apache 2.0)',
    hfRepo: 'google/gemma-2-27b-it',
    ctx: 8192,
    maxOut: 4096,
    in: 0.15,
    out: 0.45,
    speed: 120,
    ttft: 260,
    elo: 1260,
    scores: { agentic: 76.0, coding: 80.0, reasoning: 83.0, knowledge: 88.0, multimodal: 50.0, multilingual: 84.0, instruction: 89.0, math: 82.0 },
    benchmarks: { swe_bench: 31.0, livecodebench: 32.5, gpqa_diamond: 42.0, mmlu_pro: 66.2, mmmu: 48.0, ifeval: 88.5, math500: 79.5 },
    pros: {
      id: ['Lisensi komersial terbuka Apache 2.0 sangat ramah enterprise', 'Arsitektur distilasi efisien dengan performa setara model 70B', 'Inference cepat pada hardware workstation tunggal'],
      en: ['Fully permissive Apache 2.0 commercial license', 'Efficient distillation architecture outperforming older 70B models', 'Fast inference on a single workstation GPU'],
    },
    cons: {
      id: ['Jendela konteks terbatas pada 8K token', 'Hanya mendukung input teks'],
      en: ['Context window limited to 8K tokens', 'Text-only (no visual multimodal support)'],
    },
    bestFor: { id: 'Deployment enterprise berlisensi Apache 2.0 bebas risiko, asisten tanya-jawab lokal, & fine-tuning', en: 'Risk-free Apache 2.0 enterprise deployment, local Q&A assistant, & domain fine-tuning' },
  },

  // 29. SmolLM2 1.7B
  {
    id: 'smollm2-1-7b',
    name: 'SmolLM2 1.7B',
    vendor: 'Hugging Face',
    release: '2024-11',
    license: 'Open Weights',
    status: 'Supported',
    architecture: '1.7B Compact Edge Transformer (Apache 2.0)',
    hfRepo: 'HuggingFaceTB/SmolLM2-1.7B-Instruct',
    ctx: 8192,
    maxOut: 2048,
    in: 0.05,
    out: 0.15,
    speed: 280,
    ttft: 120,
    elo: 1150,
    scores: { agentic: 58.0, coding: 65.0, reasoning: 64.0, knowledge: 68.0, multimodal: 40.0, multilingual: 70.0, instruction: 82.0, math: 62.0 },
    benchmarks: { swe_bench: 14.0, livecodebench: 18.0, gpqa_diamond: 28.0, mmlu_pro: 44.0, mmmu: 38.0, ifeval: 80.0, math500: 62.0 },
    pros: {
      id: ['Dapat berjalan 100% di browser/smartphone via WebGPU (RAM <2GB)', 'Kecepatan throughput 280+ tok/s', 'Lisensi Apache 2.0 dari tim Hugging Face'],
      en: ['Runs 100% locally in browser/mobile via WebGPU (RAM <2GB)', 'Blazing 280+ tok/s throughput', 'Apache 2.0 license by Hugging Face team'],
    },
    cons: {
      id: ['Tidak cocok untuk pemecahan masalah rumit atau penalaran tingkat pascasarjana', 'Jendela konteks 8K'],
      en: ['Not suitable for complex multi-step reasoning or deep graduate logic', '8K context window'],
    },
    bestFor: { id: 'Aplikasi mobile on-device, WebAssembly/WebGPU in-browser AI, & klasifikasi teks ultra-cepat', en: 'On-device mobile apps, in-browser WebAssembly/WebGPU AI, & ultra-fast text routing' },
  },

  // 30. Command R+
  {
    id: 'command-r-plus',
    name: 'Command R+',
    vendor: 'Cohere',
    release: '2024-04',
    license: 'Open Weights',
    status: 'Supported',
    architecture: '104B Dense Enterprise Transformer',
    hfRepo: 'CohereForAI/c4ai-command-r-plus',
    ctx: 128000,
    maxOut: 4096,
    in: 2.50,
    out: 10.00,
    speed: 70,
    ttft: 480,
    elo: 1235,
    scores: { agentic: 84.0, coding: 76.0, reasoning: 82.0, knowledge: 89.0, multimodal: 55.0, multilingual: 94.0, instruction: 91.0, math: 78.0 },
    benchmarks: { swe_bench: 28.0, livecodebench: 26.0, gpqa_diamond: 40.0, mmlu_pro: 60.5, mmmu: 49.0, ifeval: 90.0, math500: 72.0 },
    pros: {
      id: ['Sistem sitasi & verifikasi sumber (grounded citations) terdepan untuk pencegahan halusinasi', 'Penguasaan 10 bahasa bisnis utama dunia', 'Dirancang khusus untuk pipeline Retrieval-Augmented Generation (RAG)'],
      en: ['World-class verifiable source citations to minimize hallucination', 'Fluency across 10 major global business languages', 'Engineered ground-up for enterprise Retrieval-Augmented Generation (RAG)'],
    },
    cons: {
      id: ['Performa matematika dan coding di bawah model penalaran murni', 'Biaya output relatif tinggi'],
      en: ['Lower raw coding and math benchmark ceiling', 'Higher output pricing'],
    },
    bestFor: { id: 'Pencarian enterprise RAG dengan bukti sitasi dokumen, analisis laporan bisnis, & Q&A kepatuhan', en: 'Enterprise RAG with verifiable document citations, business report audits, & compliance Q&A' },
  },
];

/**
 * Menghitung Skor Keseluruhan BenchLM (0 - 100) berdasarkan pembobotan Kategori atau Use-Case
 */
export function calcOverall(scores, weights = null) {
  let total = 0;
  let weightSum = 0;
  CATEGORIES.forEach((cat) => {
    const w = weights ? (weights[cat.id] != null ? weights[cat.id] : cat.weight) : cat.weight;
    if (scores[cat.id] != null) {
      total += scores[cat.id] * w;
      weightSum += w;
    }
  });
  return weightSum > 0 ? Number((total / weightSum).toFixed(1)) : 0;
}

/**
 * Menghitung Harga Blended standar (Rasio 3:1 Input ke Output)
 */
export function calcBlendedPrice(inPrice, outPrice) {
  return Number(((inPrice * 3 + outPrice * 1) / 4).toFixed(3));
}

/**
 * Menghitung Indeks Nilai (Value Index: Skor Performa dibagi Log Biaya)
 */
export function calcValueIndex(overall, blendPrice) {
  const effectivePrice = Math.max(0.1, blendPrice);
  const logPrice = Math.log10(effectivePrice + 1);
  return Number((overall / (1 + logPrice * 1.8)).toFixed(1));
}

/**
 * Dataset Lengkap dengan Skor Agregat, Harga Blended, dan Value Index
 */
export const LEADERBOARD_MODELS = RAW_MODELS.map((m) => {
  const overall = calcOverall(m.scores);
  const blend = calcBlendedPrice(m.in, m.out);
  const valueIndex = calcValueIndex(overall, blend);
  return {
    ...m,
    overall,
    blend,
    valueIndex,
  };
}).sort((a, b) => b.overall - a.overall);

export function getModelById(id) {
  return LEADERBOARD_MODELS.find((m) => m.id === id) || LEADERBOARD_MODELS[0];
}
