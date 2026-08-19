/* ============================================================
   monetize.js — Monetisasi Ramah Developer & Strategi Pertumbuhan
   1. Ekspor Dataset Benchmark (CSV / JSON)
   2. Ekspor Laporan Komparasi (Markdown)
   3. Tautan Referral Inference Partner (OpenRouter, Together AI, Groq, dll.)
   4. Modal Pendaftaran Radar Morning Brief & Konsultasi B2B
   ============================================================ */

import { el, toast } from './ui.js';
import { LEADERBOARD_MODELS, CATEGORIES, BENCHMARKS } from '../data/leaderboard.js';

/**
 * Tautan Partner Inference & Hosting (Referral B2B)
 */
export const PARTNERS = [
  {
    id: 'openrouter',
    name: 'OpenRouter',
    desc: { id: 'Akses 200+ model AI dengan 1 API key terpadu', en: 'Unified API for 200+ models with smart fallback' },
    url: 'https://openrouter.ai/?ref=llmlab',
    badge: '★ Rekomendasi API',
  },
  {
    id: 'together',
    name: 'Together AI',
    desc: { id: 'Inference ultra-cepat untuk model open-weights (DeepSeek, Llama, Qwen)', en: 'Blazing fast inference for open-weights models' },
    url: 'https://together.ai/?ref=llmlab',
    badge: '🚀 High Speed',
  },
  {
    id: 'groq',
    name: 'Groq LPU',
    desc: { id: 'Kecepatan inferensi instan 500+ tok/s dengan arsitektur LPU', en: 'Instant 500+ tok/s LPU inference speed' },
    url: 'https://groq.com/?ref=llmlab',
    badge: '⚡ 500+ tok/s',
  },
  {
    id: 'deepinfra',
    name: 'DeepInfra',
    desc: { id: 'Tarif API open-weights paling hemat dengan bayar per token', en: 'Lowest cost pay-per-token open model inference' },
    url: 'https://deepinfra.com/?ref=llmlab',
    badge: '🏷️ Best Price',
  },
];

export function getPartnerLink(model) {
  if (model.license === 'Open Weights') {
    if (model.id.includes('deepseek') || model.id.includes('llama')) {
      return { name: 'Deploy via Together AI', url: `https://together.ai/models/${model.id}?ref=llmlab` };
    }
    return { name: 'Run on OpenRouter', url: `https://openrouter.ai/models?q=${encodeURIComponent(model.name)}&ref=llmlab` };
  }
  return { name: 'API via OpenRouter', url: `https://openrouter.ai/models?q=${encodeURIComponent(model.name)}&ref=llmlab` };
}

/**
 * Download file bantuan di browser
 */
function downloadFile(filename, content, type = 'text/plain') {
  const blob = new Blob([content], { type: `${type};charset=utf-8;` });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Ekspor Dataset Leaderboard ke format CSV
 */
export function exportLeaderboardCSV(models = LEADERBOARD_MODELS) {
  const headers = [
    'Rank', 'Model Name', 'Vendor', 'Architecture', 'License', 'Status',
    'BenchLM Score', 'Agentic (22%)', 'Coding (20%)', 'Reasoning (17%)',
    'Knowledge (12%)', 'Multimodal (12%)', 'Multilingual (7%)', 'Instruction (5%)', 'Math (5%)',
    'SWE-bench Verified', 'LiveCodeBench', 'GPQA Diamond', 'MMLU-Pro', 'MMMU', 'IFEval', 'MATH-500',
    'Arena Elo', 'Input Price ($/1M)', 'Output Price ($/1M)', 'Blended Price ($/1M)',
    'Speed (tok/s)', 'Latency TTFT (ms)', 'Context Window', 'Max Output',
  ];

  const rows = models.map((m, idx) => [
    idx + 1,
    `"${m.name}"`,
    `"${m.vendor}"`,
    `"${m.architecture}"`,
    m.license,
    m.status,
    m.overall,
    m.scores.agentic,
    m.scores.coding,
    m.scores.reasoning,
    m.scores.knowledge,
    m.scores.multimodal,
    m.scores.multilingual,
    m.scores.instruction,
    m.scores.math,
    m.benchmarks.swe_bench || '',
    m.benchmarks.livecodebench || '',
    m.benchmarks.gpqa_diamond || '',
    m.benchmarks.mmlu_pro || '',
    m.benchmarks.mmmu || '',
    m.benchmarks.ifeval || '',
    m.benchmarks.math500 || '',
    m.elo,
    m.in,
    m.out,
    m.blend,
    m.speed,
    m.ttft,
    m.ctx,
    m.maxOut,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const dateStr = new Date().toISOString().slice(0, 10);
  downloadFile(`benchlm_ai_leaderboard_${dateStr}.csv`, csvContent, 'text/csv');
  toast('Dataset CSV berhasil diunduh');
}

/**
 * Ekspor Dataset Leaderboard ke format JSON
 */
export function exportLeaderboardJSON(models = LEADERBOARD_MODELS) {
  const jsonContent = JSON.stringify({
    metadata: {
      platform: 'BenchLM & LLM Lab',
      exportedAt: new Date().toISOString(),
      modelsTracked: models.length,
      methodology: '8-category weighted scoring (Agentic 22%, Coding 20%, Reasoning 17%, Knowledge 12%, Vision 12%, Multilingual 7%, Instruction 5%, Math 5%)',
    },
    models,
  }, null, 2);

  const dateStr = new Date().toISOString().slice(0, 10);
  downloadFile(`benchlm_ai_leaderboard_${dateStr}.json`, jsonContent, 'application/json');
  toast('Dataset JSON berhasil diunduh');
}

/**
 * Ekspor Laporan Komparasi ke format Markdown
 */
export function exportComparisonMarkdown(models = [], lang = 'id') {
  if (!models.length) return;
  const isId = lang === 'id';
  const dateStr = new Date().toLocaleDateString(isId ? 'id-ID' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  let md = `# ${isId ? 'Laporan Perbandingan Model AI' : 'AI Model Comparison Report'}\n\n`;
  md += `*${isId ? 'Dibuat pada' : 'Generated on'}: ${dateStr} | Source: [BenchLM & LLM Lab](https://llmlab.ai)*\n\n`;
  md += `## ${isId ? 'Ringkasan Skor & Metrik' : 'Score & Metric Summary'}\n\n`;

  // Tabel Skor
  md += `| ${isId ? 'Metrik' : 'Metric'} | ` + models.map((m) => m.name).join(' | ') + ' |\n';
  md += '| :-- | ' + models.map(() => ':--:').join(' | ') + ' |\n';
  md += `| **${isId ? 'Skor Agregat BenchLM' : 'BenchLM Overall Score'}** | ` + models.map((m) => `**${m.overall}/100**`).join(' | ') + ' |\n';
  md += `| ${isId ? 'Biaya Blended ($/1M)' : 'Blended Cost ($/1M)'} | ` + models.map((m) => `$${m.blend}`).join(' | ') + ' |\n';
  md += `| ${isId ? 'Kecepatan Streaming' : 'Throughput Speed'} | ` + models.map((m) => `${m.speed} tok/s`).join(' | ') + ' |\n';
  md += `| ${isId ? 'Jendela Konteks' : 'Context Window'} | ` + models.map((m) => `${m.ctx / 1000}k`).join(' | ') + ' |\n';
  md += `| Chatbot Arena Elo | ` + models.map((m) => `${m.elo}`).join(' | ') + ' |\n';

  CATEGORIES.forEach((c) => {
    const cName = c.name[lang] || c.name.en;
    md += `| ${c.icon} ${cName} (${Math.round(c.weight * 100)}%) | ` + models.map((m) => `${m.scores[c.id]}%`).join(' | ') + ' |\n';
  });

  md += `\n## ${isId ? 'Analisis Kelebihan & Rekomendasi' : 'Strengths & Recommendations'}\n\n`;
  models.forEach((m) => {
    md += `### ${m.name} (${m.vendor})\n`;
    md += `- **${isId ? 'Lisensi' : 'License'}**: ${m.license} (${m.architecture})\n`;
    md += `- **${isId ? 'Kelebihan' : 'Strengths'}**: ${(m.pros[lang] || m.pros.id).join(', ')}\n`;
    md += `- **${isId ? 'Paling Cocok Untuk' : 'Best Suited For'}**: ${m.bestFor[lang] || m.bestFor.id}\n\n`;
  });

  downloadFile(`model_comparison_report.md`, md, 'text/markdown');
  toast(isId ? 'Laporan Markdown berhasil diunduh' : 'Markdown report downloaded');
}

/**
 * Membuka Dialog Radar Morning Brief
 */
export function openRadarModal() {
  const dlg = document.getElementById('radarModal');
  if (dlg) {
    if (!dlg.open) dlg.showModal();
    const input = dlg.querySelector('input[type="email"]');
    if (input) input.focus();
  }
}

/**
 * Membuka Dialog B2B Advisory & Enterprise Evaluation
 */
export function openAdvisoryModal() {
  const dlg = document.getElementById('advisoryModal');
  if (dlg && !dlg.open) dlg.showModal();
}
