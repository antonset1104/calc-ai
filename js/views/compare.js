import { el, card, stat, meter, slider, compact, usd, nf, toast } from '../lib/ui.js';
import { CATEGORIES, BENCHMARKS, LEADERBOARD_MODELS, getModelById } from '../data/leaderboard.js';
import { createRadarChart, PALETTE } from '../lib/charts.js';
import { exportComparisonMarkdown, getPartnerLink } from '../lib/monetize.js';

export const meta = { title: { id: 'Bandingkan Model', en: 'Compare Models' } };

const PRESETS = [
  {
    id: 'frontier',
    label: { id: '🏆 Pertarungan Frontier', en: '🏆 Frontier Titans' },
    models: ['claude-3-7-sonnet', 'gpt-5-preview', 'gemini-2-5-pro', 'qwen-2-5-max'],
  },
  {
    id: 'reasoning',
    label: { id: '🧠 Juara Penalaran (RL CoT)', en: '🧠 Reasoning Champions' },
    models: ['deepseek-r1', 'o3-mini', 'qwq-32b', 'claude-3-7-sonnet'],
  },
  {
    id: 'coding',
    label: { id: '💻 Spesialis Coding & SWE', en: '💻 Top Coding & SWE' },
    models: ['claude-3-7-sonnet', 'qwen-2-5-coder-32b', 'deepseek-coder-v2', 'codestral-2501'],
  },
  {
    id: 'budget',
    label: { id: '🏷️ Rajanya Nilai Hemat', en: '🏷️ Budget Value Kings' },
    models: ['deepseek-v3', 'gemini-2-5-flash', 'qwen-2-5-coder-32b', 'llama-3-3-70b'],
  },
  {
    id: 'multimodal',
    label: { id: '👁️ Vision & Dokumen AI', en: '👁️ Vision & Multimodal' },
    models: ['gemini-2-5-pro', 'pixtral-large', 'gpt-4o', 'claude-3-5-sonnet'],
  },
  {
    id: 'openweights',
    label: { id: '🔓 Bintang Open-Weights (HF)', en: '🔓 Open Weights Stars (HF)' },
    models: ['deepseek-r1', 'llama-3-3-70b', 'qwen-2-5-72b', 'phi-4'],
  },
];

const S = {
  id: {
    eyebrow: 'HEAD-TO-HEAD MODEL EVIDENCE',
    h1: 'Perbandingan Model AI Multi-Dimensi',
    lead: 'Bandingkan hingga 4 model AI secara berdampingan dengan visualisasi radar 8 kategori, matriks tolok ukur spesifik, estimasi selisih biaya, dan rekomendasi kebutuhan.',
    presets: 'Preset Perbandingan Populer',
    pickSlot: 'Pilih Model',
    addModel: '+ Tambah Model',
    radarTitle: 'Visualisasi Distribusi Kemampuan (Radar Chart)',
    matrixTitle: 'Matriks Perbandingan Lengkap',
    simTitle: 'Simulasi Biaya Komparatif',
    simLead: 'Bandingkan perkiraan tagihan bulanan antar model untuk volume permintaan yang sama.',
    metric: 'Metrik / Tolok Ukur',
    overall: 'Skor BenchLM',
    valIdx: 'Value Index',
    inPrice: 'Harga Input (Prompt)',
    outPrice: 'Harga Output (Jawaban)',
    blendPrice: 'Harga Blended (3:1)',
    ctxWin: 'Jendela Konteks',
    maxOut: 'Batas Output per Respon',
    speed: 'Kecepatan Streaming',
    latency: 'Latensi Awal (TTFT)',
    license: 'Lisensi & Hosting',
    strengths: 'Kelebihan Utama',
    weaknesses: 'Kekurangan & Batasan',
    bestFor: 'Paling Cocok Untuk',
    bestTag: 'TERBAIK',
    moCost: 'Biaya Bulanan',
    cheapest: 'Paling Hemat',
    savings: (pct, diff) => `Hemat ${pct}% (${diff}/bln)`,
  },
  en: {
    eyebrow: 'HEAD-TO-HEAD MODEL EVIDENCE',
    h1: 'Multi-Model Capability Comparison',
    lead: 'Compare up to 4 AI models side-by-side with an 8-axis capability spider chart, benchmark score matrix, comparative monthly cost calculator, and trade-off analysis.',
    presets: 'Popular Comparison Matchups',
    pickSlot: 'Select Model',
    addModel: '+ Add Model',
    radarTitle: '8-Axis Capability Distribution (Radar Chart)',
    matrixTitle: 'Comprehensive Comparison Matrix',
    simTitle: 'Comparative Cost Simulation',
    simLead: 'Compare estimated monthly invoices across selected models for identical prompt volumes.',
    metric: 'Metric / Benchmark',
    overall: 'BenchLM Score',
    valIdx: 'Value Index',
    inPrice: 'Input Price (Prompt)',
    outPrice: 'Output Price (Completion)',
    blendPrice: 'Blended Price (3:1)',
    ctxWin: 'Context Window',
    maxOut: 'Max Output Tokens',
    speed: 'Streaming Speed',
    latency: 'Time to First Token (TTFT)',
    license: 'License & Hosting',
    strengths: 'Key Strengths',
    weaknesses: 'Limitations & Trade-offs',
    bestFor: 'Best Suited For',
    bestTag: 'BEST',
    moCost: 'Monthly Cost',
    cheapest: 'Most Affordable',
    savings: (pct, diff) => `Save ${pct}% (${diff}/mo)`,
  },
  es: {
    eyebrow: 'EVIDENCIA DE MODELOS CARA A CARA',
    h1: 'Comparación Multidimensional de Modelos de IA',
    lead: 'Compare hasta 4 modelos de IA lado a lado con gráfico de radar de 8 ejes, matriz de benchmarks, simulación de costos y análisis de compensaciones.',
    presets: 'Enfrentamientos Populares', pickSlot: 'Seleccionar Modelo', addModel: '+ Agregar Modelo',
    radarTitle: 'Distribución de Capacidades (Radar Chart)', matrixTitle: 'Matriz Comparativa Completa',
    simTitle: 'Simulación de Costos Comparativa', simLead: 'Compare facturas mensuales estimadas entre modelos para idéntico volumen.',
    metric: 'Métrica / Benchmark', overall: 'Puntuación BenchLM', valIdx: 'Índice de Valor',
    inPrice: 'Precio de Entrada', outPrice: 'Precio de Salida', blendPrice: 'Precio Combinado (3:1)',
    ctxWin: 'Ventana de Contexto', maxOut: 'Límite de Salida', speed: 'Velocidad', latency: 'Latencia (TTFT)',
    license: 'Licencia', strengths: 'Fortalezas', weaknesses: 'Limitaciones', bestFor: 'Ideal Para',
    bestTag: 'MEJOR', moCost: 'Costo Mensual', cheapest: 'Más Económico',
    savings: (pct, diff) => `Ahorra ${pct}% (${diff}/mes)`,
  },
  zh: {
    eyebrow: '模型深度横向评测',
    h1: '多维度大模型对比评测',
    lead: '并排对比最多 4 个 AI 模型：8 维雷达图分布、精细化基准评测矩阵、月度调用费用预估及技术架构优劣势分析。',
    presets: '经典对比预设', pickSlot: '选择模型', addModel: '+ 添加模型',
    radarTitle: '8 维能力分布雷达图', matrixTitle: '全维度对比矩阵',
    simTitle: 'Token 成本对比模拟', simLead: '在相同请求量与 Token 消耗下，对比各模型的月度账单差异。',
    metric: '指标 / 基准测试', overall: 'BenchLM 综合得分', valIdx: '性价比指数',
    inPrice: '输入价格 (Prompt)', outPrice: '输出价格 (Completion)', blendPrice: '混合价格 (3:1)',
    ctxWin: '上下文窗口', maxOut: '单次最大输出', speed: '生成速率', latency: '首字延迟 (TTFT)',
    license: '开源许可 / 部署模式', strengths: '核心优势', weaknesses: '局限与权衡', bestFor: '最适用场景',
    bestTag: '最优', moCost: '预估月成本', cheapest: '最具性价比',
    savings: (pct, diff) => `节省 ${pct}% (${diff}/月)`,
  },
  ja: {
    eyebrow: '直接対決モデル評価',
    h1: 'AIモデル多次元比較',
    lead: '最大4つのAIモデルを並べて比較。8軸レーダーチャート、詳細ベンチマーク、月額推定コストシミュレーション、トレードオフ分析。',
    presets: '注目の比較プリセット', pickSlot: 'モデルを選択', addModel: '+ モデルを追加',
    radarTitle: '8軸機能分布 (レーダーチャート)', matrixTitle: '詳細比較マトリクス',
    simTitle: '推定コスト比較シミュレーション', simLead: '同等のトークン量・リクエスト数における各モデルの月額想定費用を比較します。',
    metric: '評価項目 / ベンチマーク', overall: 'BenchLMスコア', valIdx: 'コスパ指数',
    inPrice: '入力料金', outPrice: '出力料金', blendPrice: '加重平均料金 (3:1)',
    ctxWin: 'コンテキスト長', maxOut: '最大出力トークン', speed: '生成速度', latency: '初回応答 (TTFT)',
    license: 'ライセンス', strengths: '主な強み', weaknesses: '制約と注意点', bestFor: 'おすすめ用途',
    bestTag: '最高', moCost: '月額推定コスト', cheapest: '最安モデル',
    savings: (pct, diff) => `${pct}% 削減 (${diff}/月)`,
  },
  fr: {
    eyebrow: 'ÉVALUATION COMPARATIVE DES MODÈLES',
    h1: 'Comparaison Multidimensionnelle de Modèles IA',
    lead: 'Comparez jusqu\'à 4 modèles IA côte à côte avec graphique radar 8 axes, matrice de benchmarks, simulateur de coûts mensuels et analyse d\'arbitrage.',
    presets: 'Duels Populaires', pickSlot: 'Sélectionner un Modèle', addModel: '+ Ajouter un Modèle',
    radarTitle: 'Distribution des Capacités (Graphique Radar)', matrixTitle: 'Matrice Comparative Complète',
    simTitle: 'Simulation Comparative des Coûts', simLead: 'Comparez les factures mensuelles estimées pour un même volume de requêtes.',
    metric: 'Métrique / Benchmark', overall: 'Score BenchLM', valIdx: 'Indice de Valeur',
    inPrice: 'Prix d\'Entrée', outPrice: 'Prix de Sortie', blendPrice: 'Prix Pondéré (3:1)',
    ctxWin: 'Fenêtre de Contexte', maxOut: 'Sortie Max', speed: 'Vitesse de Débit', latency: 'Latence Initiale (TTFT)',
    license: 'Licence & Hébergement', strengths: 'Points Forts', weaknesses: 'Limites', bestFor: 'Idéal Pour',
    bestTag: 'MEILLEUR', moCost: 'Coût Mensuel', cheapest: 'Plus Économique',
    savings: (pct, diff) => `Économie de ${pct}% (${diff}/mois)`,
  },
  de: {
    eyebrow: 'DIREKTER MODELLVERGLEICH',
    h1: 'Multidimensionaler KI-Modellvergleich',
    lead: 'Vergleichen Sie bis zu 4 KI-Modelle direkt miteinander mit 8-Achsen-Netzdiagramm, Benchmark-Matrix, monatlicher Kostensimulation und Trade-off-Analyse.',
    presets: 'Beliebte Modell-Matchups', pickSlot: 'Modell auswählen', addModel: '+ Modell hinzufügen',
    radarTitle: 'Fähigkeiten-Verteilung (Netzdiagramm)', matrixTitle: 'Umfassende Vergleichsmatrix',
    simTitle: 'Vergleichende Kostensimulation', simLead: 'Vergleichen Sie geschätzte monatliche Rechnungen für identische Token-Volumina.',
    metric: 'Metrik / Benchmark', overall: 'BenchLM-Punktzahl', valIdx: 'Value Index',
    inPrice: 'Eingabepreis', outPrice: 'Ausgabepreis', blendPrice: 'Mischpreis (3:1)',
    ctxWin: 'Kontextfenster', maxOut: 'Max. Ausgabetokens', speed: 'Geschwindigkeit', latency: 'Latenz (TTFT)',
    license: 'Lizenz & Hosting', strengths: 'Stärken', weaknesses: 'Einschränkungen', bestFor: 'Ideal für',
    bestTag: 'BESTER', moCost: 'Monatliche Kosten', cheapest: 'Günstigster',
    savings: (pct, diff) => `${pct}% sparen (${diff}/Monat)`,
  },
  ar: {
    eyebrow: 'مقارنة مباشرة بين النماذج',
    h1: 'مقارنة متعددة الأبعاد لنماذج الذكاء الاصطناعي',
    lead: 'قارن ما يصل إلى 4 نماذج جنباً إلى جنب مع مخطط راداري ثماني المحاور، ومصفوفة المعايير، وحاسبة التكلفة الشهرية المقارنة.',
    presets: 'مقارنات شائعة', pickSlot: 'اختر نموذجاً', addModel: '+ إضافة نموذج',
    radarTitle: 'توزيع القدرات (المخطط الراداري)', matrixTitle: 'مصفوفة المقارنة الشاملة',
    simTitle: 'محاكاة التكلفة المقارنة', simLead: 'قارن الفواتير الشهرية المقدرة لنفس حجم الطلبات والرموز.',
    metric: 'المقياس / الاختبار', overall: 'تقييم BenchLM', valIdx: 'مؤشر القيمة',
    inPrice: 'سعر الإدخال', outPrice: 'سعر الإخراج', blendPrice: 'السعر المدمج (3:1)',
    ctxWin: 'نافذة السياق', maxOut: 'الحد الأقصى للإخراج', speed: 'سرعة التدفق', latency: 'زمن الاستجابة (TTFT)',
    license: 'الترخيص والاستضافة', strengths: 'نقاط القوة', weaknesses: 'القيود', bestFor: 'مثالي لـ',
    bestTag: 'الأفضل', moCost: 'التكلفة الشهرية', cheapest: 'الأوفر تكلفة',
    savings: (pct, diff) => `وفر ${pct}% (${diff}/شهر)`,
  },
  pt: {
    eyebrow: 'COMPARAÇÃO DIRETA DE MODELOS',
    h1: 'Comparação Multidimensional de Modelos de IA',
    lead: 'Compare até 4 modelos de IA lado a lado com gráfico de radar de 8 eixos, matriz de benchmarks, simulador de custos mensais e análise de compensações.',
    presets: 'Confrontos Populares', pickSlot: 'Selecionar Modelo', addModel: '+ Adicionar Modelo',
    radarTitle: 'Distribuição de Capacidades (Gráfico de Radar)', matrixTitle: 'Matriz Comparativa Completa',
    simTitle: 'Simulação Comparativa de Custos', simLead: 'Compare faturas mensais estimadas para o mesmo volume de tokens.',
    metric: 'Métrica / Benchmark', overall: 'Pontuação BenchLM', valIdx: 'Índice de Valor',
    inPrice: 'Preço de Entrada', outPrice: 'Preço de Saída', blendPrice: 'Preço Combinado (3:1)',
    ctxWin: 'Janela de Contexto', maxOut: 'Limite de Saída', speed: 'Velocidade', latency: 'Latência (TTFT)',
    license: 'Licença & Hospedagem', strengths: 'Pontos Fortes', weaknesses: 'Limitações', bestFor: 'Melhor Para',
    bestTag: 'MELHOR', moCost: 'Custo Mensal', cheapest: 'Mais Econômico',
    savings: (pct, diff) => `Economize ${pct}% (${diff}/mês)`,
  },
  ru: {
    eyebrow: 'ПРЯМОЕ СРАВНЕНИЕ МОДЕЛЕЙ',
    h1: 'Многомерное Сравнение Моделей ИИ',
    lead: 'Сравнивайте до 4 моделей ИИ бок о бок с 8-осевой лепестковой диаграммой, матрицей бенчмарков, расчетом ежемесячных затрат и анализом компромиссов.',
    presets: 'Популярные матчапы', pickSlot: 'Выбрать модель', addModel: '+ Добавить модель',
    radarTitle: 'Распределение возможностей (Radar Chart)', matrixTitle: 'Полная матрица сравнения',
    simTitle: 'Сравнительная симуляция стоимости', simLead: 'Сравните расчетные ежемесячные расходы для одинакового объема токенов.',
    metric: 'Метрика / Бенчмарк', overall: 'Балл BenchLM', valIdx: 'Индекс ценности',
    inPrice: 'Цена за вход', outPrice: 'Цена за выход', blendPrice: 'Средневзвешенная цена (3:1)',
    ctxWin: 'Окно контекста', maxOut: 'Лимит выхода', speed: 'Скорость генерации', latency: 'Задержка (TTFT)',
    license: 'Лицензия и развертывание', strengths: 'Сильные стороны', weaknesses: 'Ограничения', bestFor: 'Лучше всего для',
    bestTag: 'ЛУЧШИЙ', moCost: 'Ежемесячно', cheapest: 'Самый выгодный',
    savings: (pct, diff) => `Экономия ${pct}% (${diff}/мес)`,
  },
  ko: {
    eyebrow: '직접 대결 모델 평가',
    h1: '다차원 AI 모델 비교 분석',
    lead: '최대 4개의 AI 모델을 8축 레이더 차트, 세부 벤치마크 매트릭스, 월간 예상 비용 시뮬레이터 및 장단점 분석과 함께 직접 비교하세요.',
    presets: '인기 비교 프리셋', pickSlot: '모델 선택', addModel: '+ 모델 추가',
    radarTitle: '8축 역량 분포 (레이더 차트)', matrixTitle: '종합 비교 매트릭스',
    simTitle: '비교 비용 시뮬레이션', simLead: '동일한 토큰 사용량에 대한 모델별 예상 월간 비용을 비교합니다.',
    metric: '평가 지표 / 벤치마크', overall: 'BenchLM 종합 점수', valIdx: '가성비 지수',
    inPrice: '입력 가격', outPrice: '출력 가격', blendPrice: '혼합 가격 (3:1)',
    ctxWin: '컨텍스트 윈도우', maxOut: '최대 출력 토큰', speed: '생성 속도', latency: '응답 지연 (TTFT)',
    license: '라이선스 및 호스팅', strengths: '주요 강점', weaknesses: '한계점', bestFor: '최적 활용 분야',
    bestTag: '최우수', moCost: '월간 비용', cheapest: '가장 저렴함',
    savings: (pct, diff) => `${pct}% 절감 (${diff}/월)`,
  },
};

export function render(root, ctx) {
  const lang = ctx.lang;
  const s = S[lang] || S.en || S.id;

  // Baca model dari params URL
  let initialIds = ['claude-3-7-sonnet', 'gpt-5-preview', 'gemini-2-5-pro'];
  if (ctx.params.get('models')) {
    const parsed = ctx.params.get('models').split(',').map((id) => id.trim()).filter(Boolean);
    if (parsed.length > 0) initialIds = parsed.slice(0, 4);
  }

  const state = {
    selectedIds: initialIds,
    simInToks: 1500,
    simOutToks: 600,
    simReqs: 25000,
  };

  // Hero Section
  const heroEl = el('div.hero', {}, [
    el('div.eyebrow', { text: s.eyebrow }),
    el('h1', { text: s.h1 }),
    el('p', { text: s.lead }),
  ]);

  // Preset Buttons
  const presetChips = el('div.chips', { style: { marginBottom: '16px' } });
  PRESETS.forEach((p) => {
    const btn = el('button.chip', {
      type: 'button',
      onclick: () => {
        state.selectedIds = [...p.models];
        updateView();
      },
    }, [p.label[lang] || p.label.id]);
    presetChips.appendChild(btn);
  });

  const presetCard = el('div.card.card-tight', { style: { marginBottom: '18px' } }, [
    el('span', { text: s.presets, style: { fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-mute)', display: 'block', marginBottom: '8px' } }),
    presetChips,
  ]);

  // Model Picker Slots Grid
  const pickerGrid = el('div.grid.g-3', { id: 'pickerGrid', style: { marginBottom: '18px' } });

  // Radar Chart Card
  const radarWrap = el('div.radar-container', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '440px' } });
  const radarLegend = el('div.radar-legend-bar', { style: { display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '10px' } });

  const radarCard = el('section.card', {}, [
    el('div.card-head', {}, [el('h2', {}, ['🕸️ ' + s.radarTitle])]),
    radarWrap,
    radarLegend,
  ]);

  // Matrix Table Card
  const matrixWrap = el('div.tbl-wrap');
  const matrixTable = el('table.tbl.compare-matrix-tbl');
  matrixWrap.appendChild(matrixTable);

  const exportMdBtn = el('button.btn.btn-sm.btn-ghost', {
    type: 'button',
    onclick: () => exportComparisonMarkdown(getSelectedModels(), lang),
  }, [
    el('span', { html: '📄 ' }),
    lang === 'id' ? 'Ekspor Laporan (Markdown)' : 'Export Report (Markdown)',
  ]);

  const matrixCard = el('section.card', { style: { marginTop: '18px' } }, [
    el('div.card-head', {}, [
      el('h2', {}, ['📊 ' + s.matrixTitle]),
      exportMdBtn,
    ]),
    matrixWrap,
  ]);

  // Cost Simulation Card
  const simResultGrid = el('div.grid.g-3', { style: { marginTop: '16px', gap: '12px' } });
  const simCard = el('section.card', { style: { marginTop: '18px' } }, [
    el('div.card-head', {}, [
      el('h2', {}, ['💰 ' + s.simTitle]),
    ]),
    el('p.card-sub', { text: s.simLead }),
    el('div.grid.g-3', {}, [
      slider({
        label: lang === 'id' ? 'Token Masukan (Prompt)' : 'Input Tokens (Prompt)',
        min: 100, max: 20000, step: 100, value: state.simInToks,
        fmt: (v) => `${nf(v)} tok`,
        onInput: (v) => { state.simInToks = v; updateCostSim(); },
      }),
      slider({
        label: lang === 'id' ? 'Token Keluaran (Jawaban)' : 'Output Tokens (Completion)',
        min: 50, max: 8000, step: 50, value: state.simOutToks,
        fmt: (v) => `${nf(v)} tok`,
        onInput: (v) => { state.simOutToks = v; updateCostSim(); },
      }),
      slider({
        label: lang === 'id' ? 'Permintaan / Bulan' : 'Monthly Requests',
        min: 1000, max: 1000000, step: 2000, value: state.simReqs,
        fmt: (v) => `${compact(v)} req`,
        onInput: (v) => { state.simReqs = v; updateCostSim(); },
      }),
    ]),
    simResultGrid,
  ]);

  function getSelectedModels() {
    return state.selectedIds.map((id) => LEADERBOARD_MODELS.find((m) => m.id === id)).filter(Boolean);
  }

  function updatePickers() {
    pickerGrid.textContent = '';
    const models = getSelectedModels();
    pickerGrid.className = `grid g-${Math.max(2, Math.min(4, models.length + (models.length < 4 ? 1 : 0)))}`;

    models.forEach((m, idx) => {
      const palette = PALETTE[idx % PALETTE.length];
      const slot = el('div.card.card-tight.model-pick-slot', {
        style: { borderLeft: `4px solid ${palette.stroke}` },
      }, [
        el('div.row-between', { style: { marginBottom: '6px' } }, [
          el('span.badge', { text: `Model ${idx + 1}`, style: { background: palette.fill, color: palette.stroke, borderColor: palette.stroke } }),
          models.length > 2
            ? el('button.btn.btn-icon.btn-ghost.btn-sm', {
                type: 'button',
                'aria-label': 'Hapus model',
                onclick: () => {
                  state.selectedIds = state.selectedIds.filter((id) => id !== m.id);
                  updateView();
                },
              }, [el('span', { html: '✕' })])
            : null,
        ]),
        el('select', {
          'aria-label': (lang === 'id' ? 'Pilih model slot ' : 'Select model slot ') + (idx + 1),
          onchange: (e) => {
            state.selectedIds[idx] = e.target.value;
            updateView();
          },
        }, LEADERBOARD_MODELS.map((opt) => el('option', { value: opt.id, selected: opt.id === m.id }, [`${opt.name} (${opt.vendor})`]))),
      ]);
      pickerGrid.appendChild(slot);
    });

    // Tombol tambah model jika slot < 4
    if (models.length < 4) {
      const available = LEADERBOARD_MODELS.filter((m) => !state.selectedIds.includes(m.id));
      if (available.length > 0) {
        const addBtn = el('button.btn.btn-ghost', {
          type: 'button',
          style: { minHeight: '80px', border: '1px dashed var(--line-strong)', display: 'flex', flexDirection: 'column', gap: '4px' },
          onclick: () => {
            state.selectedIds.push(available[0].id);
            updateView();
          },
        }, [
          el('span', { style: { fontSize: '1.2rem' } }, ['+']),
          el('span', { text: s.addModel }),
        ]);
        pickerGrid.appendChild(addBtn);
      }
    }
  }

  function updateRadar() {
    radarWrap.textContent = '';
    radarLegend.textContent = '';
    const models = getSelectedModels();
    if (models.length === 0) return;

    const chart = createRadarChart(models, CATEGORIES, lang);
    radarWrap.appendChild(chart);

    models.forEach((m, idx) => {
      const palette = PALETTE[idx % PALETTE.length];
      const item = el('div.radar-legend-item', { style: { display: 'flex', alignItems: 'center', gap: '6px' } }, [
        el('span.radar-legend-dot', { style: { width: '12px', height: '12px', borderRadius: '50%', background: palette.stroke } }),
        el('strong', { text: m.name }),
        el('span.badge.badge-xs', { text: `${m.overall} pts` }),
      ]);
      radarLegend.appendChild(item);
    });
  }

  function updateMatrix() {
    matrixTable.textContent = '';
    const models = getSelectedModels();
    if (models.length === 0) return;

    // Header baris nama model
    const thead = el('thead', {}, [
      el('tr', {}, [
        el('th', { style: { width: '220px' } }, [s.metric]),
        ...models.map((m, idx) => {
          const pal = PALETTE[idx % PALETTE.length];
          return el('th', { style: { borderTop: `3px solid ${pal.stroke}` } }, [
            el('div', {}, [
              el('strong', { text: m.name, style: { fontSize: '1.02rem', display: 'block' } }),
              el('span', { text: m.vendor, style: { fontSize: '0.78rem', color: 'var(--text-mute)' } }),
            ]),
          ]);
        }),
      ]),
    ]);
    matrixTable.appendChild(thead);

    const tbody = el('tbody');

    // Helper: Buat baris dengan penanda nilai tertinggi
    function addRow(label, getVal, formatVal = (v) => v, higherIsBetter = true) {
      const vals = models.map(getVal);
      let bestVal = higherIsBetter ? Math.max(...vals) : Math.min(...vals);

      const tr = el('tr', {}, [
        el('td', { style: { fontWeight: '600', color: 'var(--text-dim)' } }, [label]),
        ...models.map((m, i) => {
          const v = vals[i];
          const isBest = v === bestVal && vals.some((other) => other !== v);
          return el('td', {}, [
            el('div.row-between', {}, [
              el('span', { text: String(formatVal(v)) }),
              isBest ? el('span.badge.badge-ok.badge-xs', { text: '★ ' + s.bestTag }) : null,
            ]),
          ]);
        }),
      ]);
      tbody.appendChild(tr);
    }

    // Section 1: Skor Agregat & Nilai
    addRow(s.overall, (m) => m.overall, (v) => `${v} / 100`);
    addRow(s.valIdx, (m) => m.valueIndex, (v) => `${v} pts/$`);
    addRow('Chatbot Arena Elo', (m) => m.elo, (v) => `${v}`);

    // Section 2: 8 Kategori Kemampuan
    CATEGORIES.forEach((cat) => {
      const catName = cat.name[lang] || cat.name.en;
      addRow(`${cat.icon} ${catName} (${Math.round(cat.weight * 100)}%)`, (m) => m.scores[cat.id], (v) => `${v}%`);
    });

    // Section 3: Tolok Ukur Spesifik
    BENCHMARKS.forEach((b) => {
      const tr = el('tr', {}, [
        el('td', { style: { color: 'var(--text-dim)' } }, [`📊 ${b.name} (${b.metric})`]),
        ...models.map((m) => {
          const val = m.benchmarks[b.id];
          return el('td', {}, [val != null ? `${val}%` : '—']);
        }),
      ]);
      tbody.appendChild(tr);
    });

    // Section 4: Metrik Operasional & Biaya
    addRow(s.blendPrice, (m) => m.blend, (v) => `$${v.toFixed(3)} / 1M`, false);
    addRow(s.inPrice, (m) => m.in, (v) => `$${v.toFixed(2)} / 1M`, false);
    addRow(s.outPrice, (m) => m.out, (v) => `$${v.toFixed(2)} / 1M`, false);
    addRow(s.speed, (m) => m.speed, (v) => `${v} tok/s`);
    addRow(s.latency, (m) => m.ttft, (v) => `${v} ms`, false);
    addRow(s.ctxWin, (m) => m.ctx, (v) => compact(v) + ' tokens');
    addRow(s.maxOut, (m) => m.maxOut, (v) => compact(v) + ' tokens');

    // Section 5: Lisensi & Tinjauan
    const licenseTr = el('tr', {}, [
      el('td', { style: { fontWeight: '600' } }, [s.license]),
      ...models.map((m) => el('td', {}, [
        el('span.badge', { text: m.license, class: m.license === 'Open Weights' ? 'badge-ok' : '' }),
      ])),
    ]);
    tbody.appendChild(licenseTr);

    const prosTr = el('tr', {}, [
      el('td', { style: { fontWeight: '600' } }, [s.strengths]),
      ...models.map((m) => el('td', {}, [
        el('ul.check', { style: { fontSize: '0.8rem' } }, (m.pros[lang] || m.pros.id).map((p) => el('li.on', { text: p }))),
      ])),
    ]);
    tbody.appendChild(prosTr);

    const consTr = el('tr', {}, [
      el('td', { style: { fontWeight: '600' } }, [s.weaknesses]),
      ...models.map((m) => el('td', {}, [
        el('ul', { style: { fontSize: '0.8rem', paddingLeft: '1.2em', color: 'var(--text-mute)' } }, (m.cons[lang] || m.cons.id).map((c) => el('li', { text: c }))),
      ])),
    ]);
    tbody.appendChild(consTr);

    const bestForTr = el('tr', {}, [
      el('td', { style: { fontWeight: '600' } }, [s.bestFor]),
      ...models.map((m) => el('td', {}, [
        el('span', { style: { fontSize: '0.84rem', color: 'var(--text-dim)' }, text: m.bestFor[lang] || m.bestFor.id }),
      ])),
    ]);
    tbody.appendChild(bestForTr);

    const deployTr = el('tr', {}, [
      el('td', { style: { fontWeight: '600' } }, [lang === 'id' ? 'Akses & Deployment' : 'Access & Deployment']),
      ...models.map((m) => {
        const p = getPartnerLink(m);
        return el('td', {}, [
          el('a.btn.btn-sm.btn-ghost', {
            href: p.url,
            target: '_blank',
            rel: 'noopener noreferrer',
            style: { color: 'var(--accent-2)', borderColor: 'var(--accent-2)', fontSize: '0.78rem' },
          }, ['🚀 ' + p.name]),
        ]);
      }),
    ]);
    tbody.appendChild(deployTr);

    matrixTable.appendChild(tbody);
  }

  function updateCostSim() {
    simResultGrid.textContent = '';
    const models = getSelectedModels();
    if (models.length === 0) return;

    simResultGrid.className = `grid g-${models.length}`;

    const totalInM = (state.simInToks * state.simReqs) / 1e6;
    const totalOutM = (state.simOutToks * state.simReqs) / 1e6;

    const costs = models.map((m) => {
      const total = totalInM * m.in + totalOutM * m.out;
      return { model: m, total };
    });

    const minCost = Math.min(...costs.map((c) => c.total));
    const maxCost = Math.max(...costs.map((c) => c.total));

    costs.forEach(({ model, total }, idx) => {
      const pal = PALETTE[idx % PALETTE.length];
      const isCheapest = total === minCost && costs.length > 1;
      const savingsPct = maxCost > 0 ? Math.round(((maxCost - total) / maxCost) * 100) : 0;
      const savingsDiff = usd(maxCost - total);

      const cardEl = el('div.card.card-tight', {
        style: {
          borderTop: `4px solid ${pal.stroke}`,
          background: isCheapest ? 'var(--accent-soft)' : 'var(--surface)',
        },
      }, [
        el('div.row-between', { style: { marginBottom: '8px' } }, [
          el('strong', { text: model.name }),
          isCheapest ? el('span.badge.badge-ok', { text: '✓ ' + s.cheapest }) : null,
        ]),
        el('div.stat', {}, [
          el('span.stat-k', { text: s.moCost }),
          el('span.stat-v', { style: { color: pal.stroke, fontSize: '1.5rem' } }, [usd(total)]),
        ]),
        savingsPct > 0 && !isCheapest
          ? el('p', { style: { fontSize: '0.78rem', color: 'var(--text-mute)', marginTop: '6px' }, text: s.savings(savingsPct, savingsDiff) })
          : null,
      ]);
      simResultGrid.appendChild(cardEl);
    });
  }

  function updateView() {
    updatePickers();
    updateRadar();
    updateMatrix();
    updateCostSim();
  }

  // Initial render
  updateView();

  root.append(
    heroEl,
    presetCard,
    pickerGrid,
    radarCard,
    matrixCard,
    simCard,
  );

  return () => {};
}
