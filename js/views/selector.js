/* ============================================================
   views/selector.js — Pencari Model Pintar & Kurva Pareto Harga/Kinerja
   ============================================================ */

import { el, card, stat, meter, slider, segmented, compact, usd, nf, toast } from '../lib/ui.js';
import { CATEGORIES, LEADERBOARD_MODELS, calcBlendedPrice } from '../data/leaderboard.js';
import { createParetoChart } from '../lib/charts.js';

export const meta = { title: { id: 'Pilih Model Pintar', en: 'Smart Model Selector' } };

const USE_CASES = [
  { id: 'coding',     icon: '💻', weightCat: 'coding',      name: { id: 'Coding & Rekayasa Software', en: 'Coding & Software Engineering' }, desc: { id: 'Pembuatan kode, debugging repositori, refactoring, dan verifikasi algoritma.', en: 'Code generation, repo debugging, refactoring, and algorithm verification.' } },
  { id: 'agentic',    icon: '🤖', weightCat: 'agentic',     name: { id: 'Agen Otonom & Tool Use', en: 'Autonomous Agents & Tool Use' },     desc: { id: 'Perencanaan multi-tahap, pemanggilan fungsi eksternal, dan aksi browser/sistem.', en: 'Multi-step planning, tool/function calling, and autonomous execution.' } },
  { id: 'reasoning',  icon: '🧠', weightCat: 'reasoning',   name: { id: 'Penalaran Rumit & Logika STEM', en: 'Complex STEM & Logic' },        desc: { id: 'Pemecahan masalah matematika tingkat olimpiade, pembuktian sains, dan analisis mendalam.', en: 'Olympiad math, scientific derivation, and PhD-level analytical deduction.' } },
  { id: 'rag_docs',   icon: '📚', weightCat: 'knowledge',   name: { id: 'RAG & Dokumen Panjang', en: 'Long-Doc RAG & Synthesis' },         desc: { id: 'Pencarian dokumen masif, sintesis basis pengetahuan gigabyte, dan pencegahan halusinasi.', en: 'Massive document search, knowledgebase synthesis, and low hallucination.' } },
  { id: 'chat_speed', icon: '⚡', weightCat: 'instruction', name: { id: 'Chat Interaktif Real-Time', en: 'Real-Time Interactive Chat' },      desc: { id: 'Latensi sub-300ms, throughput cepat untuk chatbot pelanggan, dan format JSON presisi.', en: 'Sub-300ms latency, high streaming throughput, and strict JSON output.' } },
  { id: 'multimodal', icon: '👁️', weightCat: 'multimodal',  name: { id: 'Visual, Diagram & Video QA', en: 'Vision, Charts & Video QA' },     desc: { id: 'Ekstraksi data PDF, analisis diagram arsitektur, pemahaman video dan audio native.', en: 'PDF data extraction, architecture chart parsing, and native video/audio QA.' } },
];

const BUDGET_TIERS = [
  { id: 'any',      name: { id: '👑 Bebas / Kualitas Maksimal', en: '👑 Any / Max Quality' }, maxPrice: 999 },
  { id: 'balanced', name: { id: '⚖️ Seimbang (< $3/1M)', en: '⚖️ Balanced (< $3/1M)' },       maxPrice: 3.0 },
  { id: 'budget',   name: { id: '🏷️ Super Hemat (< $0.50/1M)', en: '🏷️ Ultra Low-Cost (< $0.50/1M)' }, maxPrice: 0.50 },
  { id: 'open',     name: { id: '🔓 Bobot Terbuka (Open Weights)', en: '🔓 Open Weights Only' }, maxPrice: 999, openOnly: true },
];

const LATENCY_TIERS = [
  { id: 'any',      name: { id: 'Fleksibel', en: 'Any' }, minSpeed: 0, maxTtft: 9999 },
  { id: 'fast',     name: { id: 'Cepat (> 80 tok/s)', en: 'Fast (> 80 tok/s)' }, minSpeed: 80, maxTtft: 9999 },
  { id: 'realtime', name: { id: 'Real-Time (< 350ms TTFT)', en: 'Real-Time (< 350ms TTFT)' }, minSpeed: 0, maxTtft: 350 },
];

const S = {
  id: {
    eyebrow: 'DECISION-READY MODEL SELECTOR',
    h1: 'Pencari Model Pintar & Kurva Pareto',
    lead: 'Gunakan panduan pintar berbasis bobot kebutuhan beban kerja Anda untuk menemukan model paling pas, atau pelajari trade-off harga vs performa pada grafik batas efisiensi Pareto.',
    wizardTitle: 'Panduan Pemilihan Model (Model Finder)',
    wizardSub: 'Pilih parameter beban kerja Anda untuk mendapatkan 3 rekomendasi model terbaik beserta rincian alasannya.',
    stepUseCase: '1. Kebutuhan Utama (Use Case)',
    stepBudget: '2. Toleransi Anggaran (Budget)',
    stepLatency: '3. Kebutuhan Kecepatan & Latensi',
    stepVolume: '4. Estimasi Volume Permintaan Bulanan',
    promptToks: 'Token Masukan Rata-rata',
    compToks: 'Token Keluaran Rata-rata',
    monthlyReqs: 'Permintaan per Bulan',
    resultsTitle: 'Hasil Rekomendasi Terbaik',
    matchScore: 'Kecocokan',
    estMoInvoice: 'Estimasi Biaya Bulanan',
    whyMatch: 'Mengapa model ini cocok:',
    btnCompare: 'Bandingkan di Matrix',
    btnDossier: 'Buka Dossier',
    paretoTitle: 'Penjelajah Kurva Efisiensi Pareto (Harga vs Performa)',
    paretoSub: 'Model yang berada di garis putus-putus mewakili "Pareto Frontier" — model dengan performa tertinggi pada masing-masing tingkatan harga.',
    paretoHint: 'Klik pada sembarang lingkaran model untuk membuka dossier evaluasi lengkap.',
  },
  en: {
    eyebrow: 'DECISION-READY MODEL SELECTOR',
    h1: 'Smart Model Selector & Pareto Frontier',
    lead: 'Find the optimal AI model tailored to your exact workload requirements, or explore price-to-performance trade-offs on the Pareto efficiency frontier curve.',
    wizardTitle: 'Interactive Model Selector Wizard',
    wizardSub: 'Select your workload constraints to get the top 3 ranked recommendations with custom matching rationales.',
    stepUseCase: '1. Primary Use Case',
    stepBudget: '2. Budget & Hosting Tolerance',
    stepLatency: '3. Speed & Latency Requirement',
    stepVolume: '4. Estimated Monthly Request Volume',
    promptToks: 'Avg Input Tokens (Prompt)',
    compToks: 'Avg Output Tokens (Completion)',
    monthlyReqs: 'Monthly Requests',
    resultsTitle: 'Top Recommended Models',
    matchScore: 'Match Score',
    estMoInvoice: 'Estimated Monthly Cost',
    whyMatch: 'Why this model fits:',
    btnCompare: 'Compare in Matrix',
    btnDossier: 'Open Dossier',
    paretoTitle: 'Pareto Efficiency Frontier (Price vs Performance)',
    paretoSub: 'Models along the dashed line define the "Pareto Frontier" — yielding peak benchmark performance for their respective price point.',
    paretoHint: 'Click any model bubble to inspect its complete evaluation dossier.',
  },
  es: {
    eyebrow: 'SELECTOR DE MODELOS INTELIGENTE',
    h1: 'Selector de Modelos Inteligente y Frontera de Pareto',
    lead: 'Encuentre el modelo de IA óptimo para sus requisitos de carga de trabajo, o explore los compromisos precio/rendimiento en la curva de eficiencia Pareto.',
    wizardTitle: 'Asistente Interactivo de Selección de Modelos',
    wizardSub: 'Seleccione sus parámetros de carga de trabajo para obtener las 3 mejores recomendaciones.',
    stepUseCase: '1. Caso de Uso Principal',
    stepBudget: '2. Presupuesto y Tolerancia',
    stepLatency: '3. Velocidad y Latencia',
    stepVolume: '4. Volumen Mensual Estimado',
    promptToks: 'Tokens de Entrada Promedio',
    compToks: 'Tokens de Salida Promedio',
    monthlyReqs: 'Solicitudes por Mes',
    resultsTitle: 'Modelos Recomendados',
    matchScore: 'Compatibilidad',
    estMoInvoice: 'Costo Mensual Estimado',
    whyMatch: '¿Por qué este modelo es ideal?',
    btnCompare: 'Comparar en Matriz',
    btnDossier: 'Abrir Informe',
    paretoTitle: 'Frontera de Eficiencia Pareto (Precio vs Rendimiento)',
    paretoSub: 'Los modelos en la línea discontinua definen la "Frontera Pareto" — máximo rendimiento por nivel de precio.',
    paretoHint: 'Haga clic en cualquier burbuja para ver el informe completo.',
  },
  zh: {
    eyebrow: '智能模型选型助手',
    h1: '智能模型选型 & 帕累托效率前沿',
    lead: '根据您的工作负载需求找到最优 AI 模型，或在帕累托效率前沿曲线上探索价格与性能的权衡。',
    wizardTitle: '交互式模型选型向导',
    wizardSub: '选择工作负载约束，获取前 3 名推荐模型及定制匹配理由。',
    stepUseCase: '1. 主要使用场景',
    stepBudget: '2. 预算与部署偏好',
    stepLatency: '3. 速度与延迟要求',
    stepVolume: '4. 预计月请求量',
    promptToks: '平均输入 Token 数',
    compToks: '平均输出 Token 数',
    monthlyReqs: '每月请求次数',
    resultsTitle: '最优推荐模型',
    matchScore: '匹配度',
    estMoInvoice: '预估月度费用',
    whyMatch: '推荐原因：',
    btnCompare: '加入对比矩阵',
    btnDossier: '查看评测档案',
    paretoTitle: '帕累托效率前沿（价格 vs 性能）',
    paretoSub: '虚线上的模型代表「帕累托前沿」——在各自价位上性能最优。',
    paretoHint: '点击任意模型气泡查看完整评测档案。',
  },
  ja: {
    eyebrow: 'スマートモデルセレクター',
    h1: 'スマートモデルセレクター & パレート最適フロンティア',
    lead: 'ワークロード要件に最適なAIモデルを見つけるか、パレート効率フロンティア曲線でコストとパフォーマンスのトレードオフを探索してください。',
    wizardTitle: 'インタラクティブモデル選定ウィザード',
    wizardSub: 'ワークロードの制約を選択して、上位3件の推奨モデルを取得してください。',
    stepUseCase: '1. 主要ユースケース',
    stepBudget: '2. 予算とホスティング',
    stepLatency: '3. 速度と遅延要件',
    stepVolume: '4. 月間リクエスト量の見積もり',
    promptToks: '平均入力トークン数',
    compToks: '平均出力トークン数',
    monthlyReqs: '月間リクエスト数',
    resultsTitle: 'おすすめモデル上位3件',
    matchScore: 'マッチ度',
    estMoInvoice: '推定月額コスト',
    whyMatch: 'このモデルが適している理由：',
    btnCompare: 'マトリクスで比較',
    btnDossier: '評価ファイルを開く',
    paretoTitle: 'パレート効率フロンティア（価格 vs パフォーマンス）',
    paretoSub: '点線上のモデルが「パレートフロンティア」を定義します。各価格帯で最高のパフォーマンスを発揮します。',
    paretoHint: 'モデルバブルをクリックして詳細評価ファイルを確認してください。',
  },
  fr: {
    eyebrow: 'SÉLECTEUR DE MODÈLE INTELLIGENT',
    h1: 'Sélecteur de Modèle Intelligent & Frontière de Pareto',
    lead: 'Trouvez le modèle IA optimal pour vos besoins, ou explorez les compromis prix/performance sur la courbe de Pareto.',
    wizardTitle: 'Assistant Interactif de Sélection de Modèle',
    wizardSub: 'Sélectionnez vos contraintes pour obtenir les 3 meilleures recommandations.',
    stepUseCase: '1. Cas d\'Usage Principal',
    stepBudget: '2. Budget et Hébergement',
    stepLatency: '3. Vitesse et Latence',
    stepVolume: '4. Volume de Requêtes Mensuel',
    promptToks: 'Tokens d\'Entrée Moyens',
    compToks: 'Tokens de Sortie Moyens',
    monthlyReqs: 'Requêtes par Mois',
    resultsTitle: 'Modèles Recommandés',
    matchScore: 'Compatibilité',
    estMoInvoice: 'Coût Mensuel Estimé',
    whyMatch: 'Pourquoi ce modèle convient :',
    btnCompare: 'Comparer dans la Matrice',
    btnDossier: 'Ouvrir le Dossier',
    paretoTitle: 'Frontière d\'Efficacité de Pareto (Prix vs Performance)',
    paretoSub: 'Les modèles sur la ligne pointillée définissent la "Frontière de Pareto" — performance maximale pour chaque niveau de prix.',
    paretoHint: 'Cliquez sur une bulle pour inspecter son dossier d\'évaluation complet.',
  },
  de: {
    eyebrow: 'INTELLIGENTER MODELL-SELEKTOR',
    h1: 'Intelligenter Modell-Selektor & Pareto-Effizienzgrenze',
    lead: 'Finden Sie das optimale KI-Modell für Ihre Anforderungen oder erkunden Sie Preis-Leistungs-Kompromisse auf der Pareto-Effizienzgrenze.',
    wizardTitle: 'Interaktiver Modell-Auswahlassistent',
    wizardSub: 'Wählen Sie Ihre Arbeitslastparameter, um die Top 3 Empfehlungen zu erhalten.',
    stepUseCase: '1. Hauptanwendungsfall',
    stepBudget: '2. Budget und Hosting',
    stepLatency: '3. Geschwindigkeit und Latenz',
    stepVolume: '4. Geschätztes monatliches Anfrageaufkommen',
    promptToks: 'Durchschnittliche Eingabe-Token',
    compToks: 'Durchschnittliche Ausgabe-Token',
    monthlyReqs: 'Anfragen pro Monat',
    resultsTitle: 'Empfohlene Modelle',
    matchScore: 'Übereinstimmung',
    estMoInvoice: 'Geschätzte monatliche Kosten',
    whyMatch: 'Warum dieses Modell passt:',
    btnCompare: 'In Matrix vergleichen',
    btnDossier: 'Dossier öffnen',
    paretoTitle: 'Pareto-Effizienzgrenze (Preis vs. Leistung)',
    paretoSub: 'Modelle auf der gestrichelten Linie definieren die "Pareto-Grenze" — maximale Leistung für jeweiligen Preis.',
    paretoHint: 'Klicken Sie auf eine Modellblase, um das vollständige Evaluierungs-Dossier zu sehen.',
  },
  ar: {
    eyebrow: 'محدد النماذج الذكي',
    h1: 'محدد النماذج الذكي وحدود كفاءة باريتو',
    lead: 'ابحث عن نموذج الذكاء الاصطناعي الأمثل لمتطلباتك، أو استكشف مقايضات السعر مقابل الأداء على منحنى كفاءة باريتو.',
    wizardTitle: 'معالج اختيار النموذج التفاعلي',
    wizardSub: 'اختر قيود عبء العمل للحصول على أفضل 3 توصيات مع مبررات مخصصة.',
    stepUseCase: '1. حالة الاستخدام الرئيسية',
    stepBudget: '2. الميزانية والاستضافة',
    stepLatency: '3. متطلبات السرعة والكمون',
    stepVolume: '4. حجم الطلبات الشهرية المتوقع',
    promptToks: 'متوسط رموز الإدخال',
    compToks: 'متوسط رموز الإخراج',
    monthlyReqs: 'الطلبات الشهرية',
    resultsTitle: 'أفضل النماذج الموصى بها',
    matchScore: 'درجة التطابق',
    estMoInvoice: 'التكلفة الشهرية المقدرة',
    whyMatch: 'لماذا يناسبك هذا النموذج:',
    btnCompare: 'مقارنة في المصفوفة',
    btnDossier: 'فتح الملف',
    paretoTitle: 'حدود كفاءة باريتو (السعر مقابل الأداء)',
    paretoSub: 'النماذج على الخط المتقطع تُعرِّف "حدود باريتو" — الأداء الأقصى عند كل مستوى سعر.',
    paretoHint: 'انقر على أي فقاعة نموذج لفحص ملف التقييم الكامل.',
  },
  pt: {
    eyebrow: 'SELETOR DE MODELOS INTELIGENTE',
    h1: 'Seletor de Modelos Inteligente & Fronteira de Pareto',
    lead: 'Encontre o modelo de IA ideal para seus requisitos ou explore os trade-offs de preço vs. desempenho na curva de eficiência de Pareto.',
    wizardTitle: 'Assistente Interativo de Seleção de Modelo',
    wizardSub: 'Selecione as restrições de carga de trabalho para obter as 3 melhores recomendações.',
    stepUseCase: '1. Caso de Uso Principal',
    stepBudget: '2. Orçamento e Hospedagem',
    stepLatency: '3. Velocidade e Latência',
    stepVolume: '4. Volume Mensal Estimado',
    promptToks: 'Tokens de Entrada Médios',
    compToks: 'Tokens de Saída Médios',
    monthlyReqs: 'Requisições por Mês',
    resultsTitle: 'Modelos Recomendados',
    matchScore: 'Compatibilidade',
    estMoInvoice: 'Custo Mensal Estimado',
    whyMatch: 'Por que este modelo é adequado:',
    btnCompare: 'Comparar na Matriz',
    btnDossier: 'Abrir Dossiê',
    paretoTitle: 'Fronteira de Eficiência de Pareto (Preço vs Desempenho)',
    paretoSub: 'Modelos na linha tracejada definem a "Fronteira de Pareto" — desempenho máximo para cada nível de preço.',
    paretoHint: 'Clique em qualquer bolha para inspecionar o dossiê de avaliação completo.',
  },
  ru: {
    eyebrow: 'УМНЫЙ ПОДБОР МОДЕЛЕЙ',
    h1: 'Умный подбор моделей и граница Парето',
    lead: 'Найдите оптимальную модель ИИ для ваших задач или исследуйте компромиссы между ценой и производительностью на кривой эффективности Парето.',
    wizardTitle: 'Интерактивный мастер выбора модели',
    wizardSub: 'Выберите параметры нагрузки, чтобы получить топ-3 рекомендации с обоснованием.',
    stepUseCase: '1. Основной сценарий использования',
    stepBudget: '2. Бюджет и хостинг',
    stepLatency: '3. Скорость и задержка',
    stepVolume: '4. Ожидаемый месячный объём запросов',
    promptToks: 'Средние входные токены',
    compToks: 'Средние выходные токены',
    monthlyReqs: 'Запросов в месяц',
    resultsTitle: 'Топ рекомендуемых моделей',
    matchScore: 'Совпадение',
    estMoInvoice: 'Оценочные месячные затраты',
    whyMatch: 'Почему подходит эта модель:',
    btnCompare: 'Сравнить в матрице',
    btnDossier: 'Открыть досье',
    paretoTitle: 'Граница эффективности Парето (цена vs производительность)',
    paretoSub: 'Модели на пунктирной линии определяют «границу Парето» — максимальная производительность для каждой ценовой точки.',
    paretoHint: 'Нажмите на пузырь модели, чтобы просмотреть полное досье оценки.',
  },
  ko: {
    eyebrow: '스마트 모델 선택기',
    h1: '스마트 모델 선택기 & 파레토 효율 프론티어',
    lead: '워크로드 요건에 맞는 최적의 AI 모델을 찾거나, 파레토 효율 프론티어 곡선에서 가격 대비 성능 트레이드오프를 탐색하세요.',
    wizardTitle: '인터랙티브 모델 선택 마법사',
    wizardSub: '워크로드 제약 조건을 선택하여 상위 3개 추천 모델을 확인하세요.',
    stepUseCase: '1. 주요 사용 사례',
    stepBudget: '2. 예산 및 호스팅',
    stepLatency: '3. 속도 및 지연 요건',
    stepVolume: '4. 예상 월간 요청량',
    promptToks: '평균 입력 토큰',
    compToks: '평균 출력 토큰',
    monthlyReqs: '월간 요청 수',
    resultsTitle: '추천 모델 상위 3개',
    matchScore: '매칭 점수',
    estMoInvoice: '예상 월 비용',
    whyMatch: '이 모델이 적합한 이유:',
    btnCompare: '매트릭스에서 비교',
    btnDossier: '상세 파일 열기',
    paretoTitle: '파레토 효율 프론티어 (가격 vs 성능)',
    paretoSub: '점선 위의 모델이 "파레토 프론티어"를 정의합니다 — 각 가격대에서 최고 성능.',
    paretoHint: '모델 버블을 클릭하여 전체 평가 파일을 확인하세요.',
  },
};

export function render(root, ctx) {
  const lang = ctx.lang;
  const s = S[lang] || S.en || S.id;

  const state = {
    useCase: 'coding',
    budget: 'any',
    latency: 'any',
    inToks: 1200,
    outToks: 400,
    reqs: 20000,
  };

  // Hero Section
  const heroEl = el('div.hero', {}, [
    el('div.eyebrow', { text: s.eyebrow }),
    el('h1', { text: s.h1 }),
    el('p', { text: s.lead }),
  ]);

  // Section 1: Selector Wizard
  const useCaseGrid = el('div.grid.g-3', { style: { gap: '10px' } });
  USE_CASES.forEach((uc) => {
    const isSel = state.useCase === uc.id;
    const cardEl = el('div.card.card-tight.usecase-pick-card', {
      style: { cursor: 'pointer', border: isSel ? '2px solid var(--accent)' : '1px solid var(--line)', background: isSel ? 'var(--accent-soft)' : 'var(--surface)' },
      onclick: () => {
        state.useCase = uc.id;
        updateWizard();
      },
    }, [
      el('div.row', { style: { gap: '8px', marginBottom: '4px' } }, [
        el('span', { style: { fontSize: '1.2rem' } }, [uc.icon]),
        el('strong', { text: uc.name[lang] || uc.name.en }),
      ]),
      el('p', { text: uc.desc[lang] || uc.desc.en, style: { fontSize: '0.78rem', color: 'var(--text-mute)' } }),
    ]);
    useCaseGrid.appendChild(cardEl);
  });

  const budgetGrid = el('div.chips', { style: { marginBottom: '14px' } });
  BUDGET_TIERS.forEach((bt) => {
    const btn = el('button.chip', {
      type: 'button',
      'aria-pressed': state.budget === bt.id ? 'true' : 'false',
      onclick: () => {
        state.budget = bt.id;
        updateWizard();
      },
    }, [bt.name[lang] || bt.name.en]);
    budgetGrid.appendChild(btn);
  });

  const latencyGrid = el('div.chips', { style: { marginBottom: '14px' } });
  LATENCY_TIERS.forEach((lt) => {
    const btn = el('button.chip', {
      type: 'button',
      'aria-pressed': state.latency === lt.id ? 'true' : 'false',
      onclick: () => {
        state.latency = lt.id;
        updateWizard();
      },
    }, [lt.name[lang] || lt.name.en]);
    latencyGrid.appendChild(btn);
  });

  const volumeSliders = el('div.grid.g-3', {}, [
    slider({
      label: s.promptToks,
      min: 100, max: 15000, step: 100, value: state.inToks,
      fmt: (v) => `${nf(v)} tok`,
      onInput: (v) => { state.inToks = v; updateWizard(); },
    }),
    slider({
      label: s.compToks,
      min: 50, max: 5000, step: 50, value: state.outToks,
      fmt: (v) => `${nf(v)} tok`,
      onInput: (v) => { state.outToks = v; updateWizard(); },
    }),
    slider({
      label: s.monthlyReqs,
      min: 1000, max: 500000, step: 1000, value: state.reqs,
      fmt: (v) => `${compact(v)} req`,
      onInput: (v) => { state.reqs = v; updateWizard(); },
    }),
  ]);

  // Results Container
  const resultsGrid = el('div.grid.g-3', { style: { marginTop: '16px', gap: '14px' } });

  const wizardCard = el('section.card', {}, [
    el('div.card-head', {}, [el('h2', {}, ['🎯 ' + s.wizardTitle])]),
    el('p.card-sub', { text: s.wizardSub }),

    el('h3', { text: s.stepUseCase, style: { fontSize: '0.92rem', color: 'var(--text-dim)', margin: '14px 0 8px' } }),
    useCaseGrid,

    el('div.hr'),

    el('div.grid.g-2', {}, [
      el('div', {}, [
        el('h3', { text: s.stepBudget, style: { fontSize: '0.92rem', color: 'var(--text-dim)', marginBottom: '8px' } }),
        budgetGrid,
      ]),
      el('div', {}, [
        el('h3', { text: s.stepLatency, style: { fontSize: '0.92rem', color: 'var(--text-dim)', marginBottom: '8px' } }),
        latencyGrid,
      ]),
    ]),

    el('div.hr'),

    el('h3', { text: s.stepVolume, style: { fontSize: '0.92rem', color: 'var(--text-dim)', marginBottom: '8px' } }),
    volumeSliders,

    el('div.hr'),

    el('h3', { text: s.resultsTitle, style: { fontSize: '1.05rem', color: 'var(--text)' } }),
    resultsGrid,
  ]);

  // Section 2: Pareto Chart
  const paretoWrap = el('div.pareto-chart-container', { style: { overflowX: 'auto', display: 'flex', justifyContent: 'center', minHeight: '420px' } });

  const paretoCard = el('section.card', { style: { marginTop: '24px' } }, [
    el('div.card-head', {}, [el('h2', {}, ['📈 ' + s.paretoTitle])]),
    el('p.card-sub', { text: s.paretoSub }),
    paretoWrap,
    el('div.note', { style: { marginTop: '12px' } }, [
      el('span', { html: '💡 ' }),
      el('span', { text: s.paretoHint }),
    ]),
  ]);

  // Algoritma Scoring Rekomendasi
  function computeRecommendations() {
    const ucObj = USE_CASES.find((u) => u.id === state.useCase) || USE_CASES[0];
    const bTier = BUDGET_TIERS.find((b) => b.id === state.budget) || BUDGET_TIERS[0];
    const lTier = LATENCY_TIERS.find((l) => l.id === state.latency) || LATENCY_TIERS[0];

    const scored = LEADERBOARD_MODELS.map((m) => {
      // 1. Capability match (skor kategori yang bersangkutan vs skor agregat)
      const catScore = m.scores[ucObj.weightCat] || m.overall;
      let match = catScore * 0.70 + m.overall * 0.30;

      // 2. Budget constraint penalty
      if (bTier.openOnly && m.license !== 'Open Weights') match -= 40;
      if (m.blend > bTier.maxPrice) {
        const overRatio = m.blend / bTier.maxPrice;
        match -= Math.min(30, (overRatio - 1) * 15);
      }

      // 3. Latency constraint penalty
      if (lTier.minSpeed > 0 && m.speed < lTier.minSpeed) {
        match -= Math.min(20, (lTier.minSpeed - m.speed) * 0.4);
      }
      if (lTier.maxTtft < 9999 && m.ttft > lTier.maxTtft) {
        match -= Math.min(20, (m.ttft - lTier.maxTtft) * 0.05);
      }

      // Hitung biaya bulanan
      const inM = (state.inToks * state.reqs) / 1e6;
      const outM = (state.outToks * state.reqs) / 1e6;
      const moCost = inM * m.in + outM * m.out;

      const finalMatch = Math.max(45, Math.min(99, Math.round(match)));

      return {
        model: m,
        matchScore: finalMatch,
        moCost,
        catScore,
      };
    });

    return scored.sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);
  }

  function updateWizard() {
    // Update useCase buttons state
    [...useCaseGrid.children].forEach((cardNode, i) => {
      const isSel = state.useCase === USE_CASES[i].id;
      cardNode.style.border = isSel ? '2px solid var(--accent)' : '1px solid var(--line)';
      cardNode.style.background = isSel ? 'var(--accent-soft)' : 'var(--surface)';
    });

    // Update budget buttons
    [...budgetGrid.children].forEach((btn, i) => {
      btn.setAttribute('aria-pressed', state.budget === BUDGET_TIERS[i].id ? 'true' : 'false');
    });

    // Update latency buttons
    [...latencyGrid.children].forEach((btn, i) => {
      btn.setAttribute('aria-pressed', state.latency === LATENCY_TIERS[i].id ? 'true' : 'false');
    });

    // Render results
    resultsGrid.textContent = '';
    const topPicks = computeRecommendations();

    topPicks.forEach((rec, idx) => {
      const m = rec.model;
      const rankBadge = idx === 0
        ? el('span.badge.badge-ok', { text: '🥇 #1 Rekomendasi Utama' })
        : idx === 1
          ? el('span.badge.badge-accent', { text: '🥈 #2 Pilihan Alternatif' })
          : el('span.badge', { text: '🥉 #3 Alternatif Nilai' });

      const cardEl = el('div.card.card-tight.recommend-card', {
        style: {
          borderTop: idx === 0 ? '4px solid var(--ok)' : '4px solid var(--accent)',
          background: idx === 0 ? 'var(--accent-soft)' : 'var(--surface)',
        },
      }, [
        el('div.row-between', { style: { marginBottom: '8px' } }, [
          el('strong', { text: m.name, style: { fontSize: '1.1rem' } }),
          rankBadge,
        ]),
        el('div.row', { style: { gap: '6px', marginBottom: '10px' } }, [
          el('span.badge.badge-xs', { text: m.vendor }),
          el('span.badge.badge-xs', { text: m.license }),
          el('span.badge.badge-accent.badge-xs', { text: `${rec.matchScore}% ${s.matchScore}` }),
        ]),
        el('div.grid.g-2', { style: { gap: '8px', marginBottom: '10px' } }, [
          stat(s.estMoInvoice, usd(rec.moCost), '/bln'),
          stat(lang === 'id' ? 'Skor Kemampuan' : 'Capability Score', `${rec.catScore}%`, 'use-case'),
        ]),
        el('div.note', { style: { fontSize: '0.82rem', marginBottom: '12px' } }, [
          el('strong', { text: `${s.whyMatch} ` }),
          m.bestFor[lang] || m.bestFor.id,
        ]),
        el('div.row', { style: { gap: '8px' } }, [
          el('button.btn.btn-sm.btn-primary', {
            type: 'button',
            onclick: () => ctx.go(`#/compare?models=${m.id}`),
          }, ['⚡ ' + s.btnCompare]),
          el('button.btn.btn-sm.btn-ghost', {
            type: 'button',
            onclick: () => ctx.go(`#/leaderboard?model=${m.id}`),
          }, [s.btnDossier]),
        ]),
      ]);
      resultsGrid.appendChild(cardEl);
    });
  }

  function updatePareto() {
    paretoWrap.textContent = '';
    const chart = createParetoChart(LEADERBOARD_MODELS, lang, (pickedModel) => {
      ctx.go(`#/leaderboard?model=${pickedModel.id}`);
    });
    paretoWrap.appendChild(chart);
  }

  // Initial render
  updateWizard();
  updatePareto();

  root.append(
    heroEl,
    wizardCard,
    paretoCard,
  );

  return () => {};
}
