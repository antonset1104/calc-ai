/* ============================================================
   monetize.js — Monetisasi Ramah Developer & Strategi Pertumbuhan
   Mendukung 11 Bahasa Global: ID, EN, ES, ZH, JA, FR, DE, AR, PT, RU, KO
   1. Ekspor Dataset Benchmark (CSV / JSON)
   2. Ekspor Laporan Komparasi (Markdown)
   3. Tautan Referral Inference Partner (OpenRouter, Together AI, Groq, dll.)
   4. Modal Pendaftaran Radar Morning Brief & Konsultasi B2B
   ============================================================ */

import { toast } from './ui.js';
import { LEADERBOARD_MODELS, CATEGORIES } from '../data/leaderboard.js';

/**
 * Tautan Partner Inference & Hosting (Referral B2B)
 */
export const PARTNERS = [
  {
    id: 'openrouter',
    name: 'OpenRouter',
    desc: {
      id: 'Akses 200+ model AI dengan 1 API key terpadu',
      en: 'Unified API for 200+ models with smart fallback',
      es: 'API unificada para más de 200 modelos con respaldo inteligente',
      zh: '统一接入 200+ 款 AI 模型的单 API 解决方案',
      ja: 'スマートフォールバック付き200以上のモデルに対応した統合API',
      fr: 'API unifiée pour plus de 200 modèles avec repli intelligent',
      de: 'Einheitliche API für über 200 Modelle mit intelligentem Fallback',
      ar: 'واجهة برمجة تطبيقات موحدة لأكثر من 200 نموذج مع دعم ذكي',
      pt: 'API unificada para mais de 200 modelos com fallback inteligente',
      ru: 'Единый API для 200+ моделей с умным переключением',
      ko: '스마트 대체 기능을 갖춘 200개 이상 모델용 통합 API',
    },
    url: 'https://openrouter.ai/?ref=llmlab',
    badge: '★ API Hub',
  },
  {
    id: 'together',
    name: 'Together AI',
    desc: {
      id: 'Inference ultra-cepat untuk model open-weights (DeepSeek, Llama, Qwen)',
      en: 'Blazing fast inference for open-weights models (DeepSeek, Llama, Qwen)',
      es: 'Inferencia ultrarrápida para modelos de código abierto',
      zh: '针对开源权重模型（DeepSeek、Llama、Qwen）的极速推理',
      ja: 'オープンモデル（DeepSeek、Llama、Qwen）の超高速推論',
      fr: 'Inférence ultra-rapide pour modèles open-weights',
      de: 'Blitzschnelle Inferenz für Open-Weights-Modelle',
      ar: 'استنتاج فائق السرعة للنماذج مفتوحة الأوزان',
      pt: 'Inferência ultrarrápida para modelos de pesos abertos',
      ru: 'Сверхбыстрый инференс для моделей с открытыми весами',
      ko: '오픈 가중치 모델(DeepSeek, Llama, Qwen)을 위한 초고속 추론',
    },
    url: 'https://together.ai/?ref=llmlab',
    badge: '🚀 High Speed',
  },
  {
    id: 'groq',
    name: 'Groq LPU',
    desc: {
      id: 'Kecepatan inferensi instan 500+ tok/s dengan arsitektur LPU',
      en: 'Instant 500+ tok/s LPU inference speed',
      es: 'Velocidad de inferencia instantánea de más de 500 tok/s con LPU',
      zh: '基于 LPU 硬件架构的 500+ tok/s 瞬时极速推理',
      ja: 'LPUアーキテクチャによる500+ tok/sの超高速推論',
      fr: 'Vitesse d\'inférence instantanée de 500+ tok/s avec LPU',
      de: 'Sofortige 500+ tok/s Inferenzgeschwindigkeit mit LPU',
      ar: 'سرعة استنتاج فورية تفوق 500 رمز/ثانية مع LPU',
      pt: 'Velocidade de inferência instantânea de 500+ tok/s com LPU',
      ru: 'Мгновенная скорость инференса 500+ токенов/с на LPU',
      ko: 'LPU 아키텍처를 통한 500+ tok/s의 즉각적인 추론 속도',
    },
    url: 'https://groq.com/?ref=llmlab',
    badge: '⚡ 500+ tok/s',
  },
  {
    id: 'deepinfra',
    name: 'DeepInfra',
    desc: {
      id: 'Tarif API open-weights paling hemat dengan bayar per token',
      en: 'Lowest cost pay-per-token open model inference',
      es: 'Inferencia de menor costo por token para modelos abiertos',
      zh: '极具性价比的按 Token 计费开源模型推理 API',
      ja: 'トークン課金制の最も経済的なオープンモデル推論',
      fr: 'Inférence de modèle ouvert au coût par token le plus bas',
      de: 'Kostengünstigste Pay-per-Token-Inferenz für offene Modelle',
      ar: 'أقل تكلفة دفع لكل رمز لاستنتاج النماذج المفتوحة',
      pt: 'Inferência de modelo aberto com o menor custo por token',
      ru: 'Самый доступный инференс открытых моделей с оплатой за токен',
      ko: '토큰당 결제 방식의 가장 경제적인 오픈 모델 추론',
    },
    url: 'https://deepinfra.com/?ref=llmlab',
    badge: '🏷️ Best Price',
  },
];

const CTA_LABELS = {
  id: { deploy: 'Deploy via Together AI', api: 'API via OpenRouter' },
  en: { deploy: 'Deploy via Together AI', api: 'API via OpenRouter' },
  es: { deploy: 'Desplegar en Together AI', api: 'API en OpenRouter' },
  zh: { deploy: '在 Together AI 上部署', api: '在 OpenRouter 获取 API' },
  ja: { deploy: 'Together AIでデプロイ', api: 'OpenRouterでAPI利用' },
  fr: { deploy: 'Déployer sur Together AI', api: 'API sur OpenRouter' },
  de: { deploy: 'Auf Together AI bereitstellen', api: 'API auf OpenRouter' },
  ar: { deploy: 'النشر عبر Together AI', api: 'API عبر OpenRouter' },
  pt: { deploy: 'Implantar no Together AI', api: 'API no OpenRouter' },
  ru: { deploy: 'Развернуть на Together AI', api: 'API через OpenRouter' },
  ko: { deploy: 'Together AI에서 배포', api: 'OpenRouter API 연동' },
};

const NOTIFY = {
  id: { csv: 'Dataset CSV berhasil diunduh', json: 'Dataset JSON berhasil diunduh', md: 'Laporan Markdown berhasil diunduh' },
  en: { csv: 'CSV Dataset downloaded successfully', json: 'JSON Dataset downloaded successfully', md: 'Markdown Report downloaded successfully' },
  es: { csv: 'Conjunto de datos CSV descargado', json: 'Conjunto de datos JSON descargado', md: 'Informe Markdown descargado' },
  zh: { csv: 'CSV 数据集下载成功', json: 'JSON 数据集下载成功', md: 'Markdown 对比报告下载成功' },
  ja: { csv: 'CSVデータセットがダウンロードされました', json: 'JSONデータセットがダウンロードされました', md: 'Markdownレポートがダウンロードされました' },
  fr: { csv: 'Jeu de données CSV téléchargé', json: 'Jeu de données JSON téléchargé', md: 'Rapport Markdown téléchargé' },
  de: { csv: 'CSV-Datensatz heruntergeladen', json: 'JSON-Datensatz heruntergeladen', md: 'Markdown-Bericht heruntergeladen' },
  ar: { csv: 'تم تنزيل مجموعة بيانات CSV بنجاح', json: 'تم تنزيل مجموعة بيانات JSON بنجاح', md: 'تم تنزيل تقرير Markdown بنجاح' },
  pt: { csv: 'Dataset CSV baixado com sucesso', json: 'Dataset JSON baixado com sucesso', md: 'Relatório Markdown baixado com sucesso' },
  ru: { csv: 'Набор данных CSV успешно скачан', json: 'Набор данных JSON успешно скачан', md: 'Отчёт Markdown успешно скачан' },
  ko: { csv: 'CSV 데이터셋 다운로드 완료', json: 'JSON 데이터셋 다운로드 완료', md: 'Markdown 보고서 다운로드 완료' },
};

export function getPartnerLink(model, lang = 'id') {
  const cta = CTA_LABELS[lang] || CTA_LABELS.en || CTA_LABELS.id;
  if (model.license === 'Open Weights') {
    if (model.id.includes('deepseek') || model.id.includes('llama')) {
      return { name: cta.deploy, url: `https://together.ai/models/${model.id}?ref=llmlab` };
    }
    return { name: cta.api, url: `https://openrouter.ai/models?q=${encodeURIComponent(model.name)}&ref=llmlab` };
  }
  return { name: cta.api, url: `https://openrouter.ai/models?q=${encodeURIComponent(model.name)}&ref=llmlab` };
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
export function exportLeaderboardCSV(models = LEADERBOARD_MODELS, lang = 'id') {
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
  const n = NOTIFY[lang] || NOTIFY.en || NOTIFY.id;
  toast(n.csv);
}

/**
 * Ekspor Dataset Leaderboard ke format JSON
 */
export function exportLeaderboardJSON(models = LEADERBOARD_MODELS, lang = 'id') {
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
  const n = NOTIFY[lang] || NOTIFY.en || NOTIFY.id;
  toast(n.json);
}

/**
 * Ekspor Laporan Komparasi ke format Markdown Multilingual
 */
export function exportComparisonMarkdown(models = [], lang = 'id') {
  if (!models.length) return;
  const isId = lang === 'id';
  const localeMap = { id: 'id-ID', en: 'en-US', es: 'es-ES', zh: 'zh-CN', ja: 'ja-JP', fr: 'fr-FR', de: 'de-DE', ar: 'ar-SA', pt: 'pt-BR', ru: 'ru-RU', ko: 'ko-KR' };
  const dateStr = new Date().toLocaleDateString(localeMap[lang] || 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const HEADINGS = {
    id: { title: 'Laporan Perbandingan Model AI', gen: 'Dibuat pada', summary: 'Ringkasan Skor & Metrik', metric: 'Metrik', overall: 'Skor Agregat BenchLM', blend: 'Biaya Blended ($/1M)', speed: 'Kecepatan Streaming', ctx: 'Jendela Konteks', elo: 'Chatbot Arena Elo', analysis: 'Analisis Kelebihan & Rekomendasi', license: 'Lisensi', pros: 'Kelebihan', bestFor: 'Paling Cocok Untuk' },
    en: { title: 'AI Model Comparison Report', gen: 'Generated on', summary: 'Score & Metric Summary', metric: 'Metric', overall: 'BenchLM Overall Score', blend: 'Blended Cost ($/1M)', speed: 'Throughput Speed', ctx: 'Context Window', elo: 'Chatbot Arena Elo', analysis: 'Strengths & Recommendations', license: 'License', pros: 'Strengths', bestFor: 'Best Suited For' },
    es: { title: 'Informe de Comparación de Modelos de IA', gen: 'Generado el', summary: 'Resumen de Puntuaciones y Métricas', metric: 'Métrica', overall: 'Puntuación General BenchLM', blend: 'Costo Combinado ($/1M)', speed: 'Velocidad de Salida', ctx: 'Ventana de Contexto', elo: 'Chatbot Arena Elo', analysis: 'Fortalezas y Recomendaciones', license: 'Licencia', pros: 'Fortalezas', bestFor: 'Ideal Para' },
    zh: { title: 'AI 模型横向对比综合报告', gen: '生成时间', summary: '得分与核心指标汇总', metric: '指标', overall: 'BenchLM 综合评分', blend: '混合 Token 成本 ($/1M)', speed: '生成速度', ctx: '上下文窗口', elo: 'Chatbot Arena Elo', analysis: '优势分析与选型建议', license: '开源协议/许可', pros: '核心优势', bestFor: '最适用场景' },
    ja: { title: 'AIモデル比較総合レポート', gen: '生成日時', summary: 'スコアおよび指標サマリー', metric: '指標', overall: 'BenchLM総合スコア', blend: 'ブレンドコスト ($/1M)', speed: 'ストリーミング速度', ctx: 'コンテキストウィンドウ', elo: 'Chatbot Arena Elo', analysis: '強み分析と推奨事項', license: 'ライセンス', pros: '主な強み', bestFor: '最適なユースケース' },
    fr: { title: 'Rapport de Comparaison des Modèles IA', gen: 'Généré le', summary: 'Résumé des Scores & Métriques', metric: 'Métrique', overall: 'Score Global BenchLM', blend: 'Coût Moyen ($/1M)', speed: 'Vitesse de Débit', ctx: 'Fenêtre de Contexte', elo: 'Chatbot Arena Elo', analysis: 'Points Forts & Recommandations', license: 'Licence', pros: 'Forces', bestFor: 'Idéal Pour' },
    de: { title: 'KI-Modell-Vergleichsbericht', gen: 'Erstellt am', summary: 'Score- & Metrik-Übersicht', metric: 'Metrik', overall: 'BenchLM-Gesamtbewertung', blend: 'Durchschnittskosten ($/1M)', speed: 'Streaming-Geschwindigkeit', ctx: 'Kontextfenster', elo: 'Chatbot Arena Elo', analysis: 'Stärken & Empfehlungen', license: 'Lizenz', pros: 'Stärken', bestFor: 'Bestens geeignet für' },
    ar: { title: 'تقرير مقارنة نماذج الذكاء الاصطناعي', gen: 'تاريخ الإنشاء', summary: 'ملخص الدرجات والمقاييس', metric: 'المقياس', overall: 'درجة BenchLM الإجمالية', blend: 'التكلفة المدمجة ($/1M)', speed: 'سرعة التدفق', ctx: 'نافذة السياق', elo: 'Chatbot Arena Elo', analysis: 'نقاط القوة والتوصيات', license: 'الترخيص', pros: 'نقاط القوة', bestFor: 'الأفضل لـ' },
    pt: { title: 'Relatório de Comparação de Modelos de IA', gen: 'Gerado em', summary: 'Resumo de Pontuações e Métricas', metric: 'Métrica', overall: 'Pontuação Geral BenchLM', blend: 'Custo Combinado ($/1M)', speed: 'Velocidade de Saída', ctx: 'Janela de Contexto', elo: 'Chatbot Arena Elo', analysis: 'Pontos Fortes e Recomendações', license: 'Licença', pros: 'Vantagens', bestFor: 'Ideal Para' },
    ru: { title: 'Сравнительный отчёт по моделям ИИ', gen: 'Сформировано', summary: 'Сводка оценок и метрик', metric: 'Метрика', overall: 'Общий балл BenchLM', blend: 'Смешанная стоимость ($/1M)', speed: 'Скорость вывода', ctx: 'Контекстное окно', elo: 'Chatbot Arena Elo', analysis: 'Сильные стороны и рекомендации', license: 'Лицензия', pros: 'Преимущества', bestFor: 'Лучше всего для' },
    ko: { title: 'AI 모델 종합 비교 보고서', gen: '생성 일시', summary: '점수 및 핵심 지표 요약', metric: '지표', overall: 'BenchLM 종합 점수', blend: '혼합 비용 ($/1M)', speed: '출력 속도', ctx: '컨텍스트 윈도우', elo: 'Chatbot Arena Elo', analysis: '강점 분석 및 권장 사항', license: '라이선스', pros: '주요 강점', bestFor: '가장 적합한 분야' },
  };

  const h = HEADINGS[lang] || HEADINGS.en || HEADINGS.id;

  let md = `# ${h.title}\n\n`;
  md += `*${h.gen}: ${dateStr} | Source: [BenchLM & LLM Lab](https://llmlab.ai/?lang=${lang})*\n\n`;
  md += `## ${h.summary}\n\n`;

  // Tabel Skor
  md += `| ${h.metric} | ` + models.map((m) => m.name).join(' | ') + ' |\n';
  md += '| :-- | ' + models.map(() => ':--:').join(' | ') + ' |\n';
  md += `| **${h.overall}** | ` + models.map((m) => `**${m.overall}/100**`).join(' | ') + ' |\n';
  md += `| ${h.blend} | ` + models.map((m) => `$${m.blend}`).join(' | ') + ' |\n';
  md += `| ${h.speed} | ` + models.map((m) => `${m.speed} tok/s`).join(' | ') + ' |\n';
  md += `| ${h.ctx} | ` + models.map((m) => `${m.ctx / 1000}k`).join(' | ') + ' |\n';
  md += `| ${h.elo} | ` + models.map((m) => `${m.elo}`).join(' | ') + ' |\n';

  CATEGORIES.forEach((c) => {
    const cName = c.name[lang] || c.name.en || c.name.id;
    md += `| ${c.icon} ${cName} (${Math.round(c.weight * 100)}%) | ` + models.map((m) => `${m.scores[c.id]}%`).join(' | ') + ' |\n';
  });

  md += `\n## ${h.analysis}\n\n`;
  models.forEach((m) => {
    md += `### ${m.name} (${m.vendor})\n`;
    md += `- **${h.license}**: ${m.license} (${m.architecture})\n`;
    md += `- **${h.pros}**: ${(m.pros[lang] || m.pros.en || m.pros.id).join(', ')}\n`;
    md += `- **${h.bestFor}**: ${m.bestFor[lang] || m.bestFor.en || m.bestFor.id}\n\n`;
  });

  downloadFile(`model_comparison_report_${lang}.md`, md, 'text/markdown');
  const n = NOTIFY[lang] || NOTIFY.en || NOTIFY.id;
  toast(n.md);
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
