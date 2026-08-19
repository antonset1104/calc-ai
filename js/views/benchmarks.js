/* ============================================================
   views/benchmarks.js — Direktori Benchmark & Metodologi Evaluasi
   ============================================================ */

import { el, card, stat, meter, compact, nf } from '../lib/ui.js';
import { CATEGORIES, BENCHMARKS, LEADERBOARD_MODELS } from '../data/leaderboard.js';

export const meta = { title: { id: 'Benchmark AI', en: 'AI Benchmarks' } };

const S = {
  id: {
    eyebrow: 'BENCHMARK DIRECTORY & METHODOLOGY',
    h1: 'Direktori Benchmark AI & Metodologi',
    lead: 'Pelajari secara mendalam apa yang diuji oleh setiap tolok ukur AI terkemuka, mengapa tolok ukur tersebut penting, standar validasi bukti, dan formula pembobotan 8 kategori resmi BenchLM.',
    methodTitle: 'Formula Pembobotan 8 Kategori BenchLM',
    methodSub: 'Skor agregat BenchLM (0–100) dihitung dari rata-rata terbobot 8 dimensi kemampuan kritis untuk mencerminkan keandalan model di dunia nyata.',
    weight: 'Bobot',
    standardsTitle: 'Standar Bukti & Normalisasi',
    std1Title: '✓ Supported vs ⚡ Estimated Evidence',
    std1Body: 'Peringkat "Supported" didasarkan pada pengujian multi-run langsung yang independen dan dapat direproduksi. Peringkat "Estimated" diberikan pada model baru yang datanya diekstrapolasi dari model card vendor dan dikalibrasi secara statistik sebelum uji independen selesai.',
    std2Title: '📐 Formula Nilai Kinerja (Value Index)',
    std2Body: 'Value Index mengukur efisiensi kecerdasan per dolar: Skor BenchLM dibagi dengan logaritma biaya blended (3 prompt : 1 output). Model dengan Value Index tinggi memberikan nilai bisnis paling ekonomis.',
    std3Title: '🛡️ Mitigasi Kontaminasi Data Latih',
    std3Body: 'Kami memprioritaskan tolok ukur dinamis seperti LiveCodeBench dan SWE-bench Verified yang diperbarui secara berkala dengan soal baru untuk mencegah model hanya "menghafal" data latih internet.',
    dirTitle: 'Katalog Direktori Benchmark AI Terkemuka',
    dirSub: 'Daftar tolok ukur standar industri yang digunakan dalam evaluasi BenchLM beserta model-model terdepan saat ini.',
    developer: 'Pengembang',
    metric: 'Metrik Evaluasi',
    difficulty: 'Tingkat Kesulitan',
    topModels: 'Model Terdepan:',
    viewDossier: 'Buka Dossier',
  },
  en: {
    eyebrow: 'BENCHMARK DIRECTORY & METHODOLOGY',
    h1: 'AI Benchmark Directory & Methodology',
    lead: 'Deep dive into what modern AI benchmarks evaluate, why they matter, evidence verification standards, and the official BenchLM 8-category weighting methodology.',
    methodTitle: 'BenchLM 8-Category Weighting Methodology',
    methodSub: 'The overall BenchLM Score (0–100) is computed from a weighted average of 8 capability dimensions reflecting real-world production utility.',
    weight: 'Weight',
    standardsTitle: 'Evidence Standards & Normalization',
    std1Title: '✓ Supported vs ⚡ Estimated Evidence',
    std1Body: '"Supported" rankings rely on independent, reproducible multi-run evaluation suites. "Estimated" labels denote newly released models calibrated from vendor reports before full independent verification completes.',
    std2Title: '📐 Price-to-Performance Value Index',
    std2Body: 'The Value Index quantifies intelligence per dollar: BenchLM Score divided by the log of blended token cost. High Value Index models provide maximum ROI for production workloads.',
    std3Title: '🛡️ Training Data Contamination Mitigation',
    std3Body: 'We prioritize dynamic benchmarks such as LiveCodeBench and SWE-bench Verified that continuously refresh problems to prevent contamination from model pretraining corpora.',
    dirTitle: 'Industry Standard Benchmark Directory',
    dirSub: 'Catalog of standard evaluations tracked in BenchLM along with current leaderboard leaders.',
    developer: 'Developer',
    metric: 'Evaluation Metric',
    difficulty: 'Difficulty Level',
    topModels: 'Leading Models:',
    viewDossier: 'Open Dossier',
  },
  es: {
    eyebrow: 'DIRECTORIO DE BENCHMARKS Y METODOLOGÍA',
    h1: 'Directorio de Benchmarks de IA y Metodología',
    lead: 'Profundice en lo que evalúan los benchmarks de IA modernos, por qué importan y la metodología oficial de ponderación de 8 categorías de BenchLM.',
    methodTitle: 'Metodología de Ponderación de 8 Categorías de BenchLM',
    methodSub: 'La puntuación BenchLM (0–100) se calcula como un promedio ponderado de 8 dimensiones de capacidades.',
    weight: 'Peso', standardsTitle: 'Estándares de Evidencia y Normalización',
    std1Title: '✓ Evidencia Verificada vs ⚡ Estimada',
    std1Body: 'Los rankings "Verificados" se basan en evaluaciones independientes y reproducibles. Los "Estimados" son de modelos recientes calibrados a partir de informes de vendedores.',
    std2Title: '📐 Índice de Valor Precio-Rendimiento',
    std2Body: 'El Índice de Valor cuantifica la inteligencia por dólar: Puntuación BenchLM dividida por el logaritmo del costo de tokens combinado.',
    std3Title: '🛡️ Mitigación de Contaminación de Datos de Entrenamiento',
    std3Body: 'Priorizamos benchmarks dinámicos como LiveCodeBench que actualizan continuamente los problemas para evitar contaminación del preentrenamiento.',
    dirTitle: 'Directorio de Benchmarks Estándar de la Industria',
    dirSub: 'Catálogo de evaluaciones estándar rastreadas en BenchLM junto con los líderes actuales.',
    developer: 'Desarrollador', metric: 'Métrica de Evaluación', difficulty: 'Nivel de Dificultad',
    topModels: 'Modelos Líderes:', viewDossier: 'Abrir Informe',
  },
  zh: {
    eyebrow: '基准测试目录与评测方法论',
    h1: 'AI 基准测试目录与评测方法论',
    lead: '深入了解现代 AI 基准测试的评测内容、重要性，以及 BenchLM 官方 8 维度加权评测方法论。',
    methodTitle: 'BenchLM 8 维度加权评测方法论',
    methodSub: 'BenchLM 综合得分（0–100）由 8 项核心能力维度的加权平均值计算得出。',
    weight: '权重', standardsTitle: '证据标准与归一化',
    std1Title: '✓ 官方验证 vs ⚡ 估算数据',
    std1Body: '「官方验证」排名基于独立、可重现的多轮评测。「估算」标签表示依据厂商报告校准的新发布模型数据。',
    std2Title: '📐 性价比指数（Value Index）',
    std2Body: '性价比指数衡量每美元的智能效率：BenchLM 得分除以混合 Token 成本的对数。指数越高，商业价值越高。',
    std3Title: '🛡️ 训练数据污染防护',
    std3Body: '优先采用 LiveCodeBench、SWE-bench 等动态基准，持续更新题目以防止模型通过记忆预训练数据作弊。',
    dirTitle: '行业标准基准测试目录',
    dirSub: 'BenchLM 收录的标准评测列表及当前各项领先模型。',
    developer: '研发机构', metric: '评测指标', difficulty: '难度等级',
    topModels: '领先模型：', viewDossier: '查看档案',
  },
  ja: {
    eyebrow: 'ベンチマークディレクトリ＆評価方法論',
    h1: 'AIベンチマークディレクトリ＆評価方法論',
    lead: '現代AIベンチマークが何を評価するか、その重要性、そしてBenchLMの公式8カテゴリ加重評価方法論を詳しく解説します。',
    methodTitle: 'BenchLM 8カテゴリ加重評価方法論',
    methodSub: 'BenchLM総合スコア（0–100）は、8つの能力次元の加重平均から算出されます。',
    weight: '重み', standardsTitle: '証拠基準と正規化',
    std1Title: '✓ 検証済み vs ⚡ 推定値',
    std1Body: '「検証済み」ランキングは独立した再現可能な評価に基づきます。「推定値」はベンダーレポートから校正された新しいモデルのデータです。',
    std2Title: '📐 コスパ指数（Value Index）',
    std2Body: 'Value Indexはコスト効率を定量化します：BenchLMスコアをブレンドトークンコストの対数で割った値です。',
    std3Title: '🛡️ 学習データ汚染の軽減',
    std3Body: 'LiveCodeBenchなどのような動的ベンチマークを優先し、事前学習データの汚染を防ぎます。',
    dirTitle: '業界標準ベンチマークディレクトリ',
    dirSub: 'BenchLMで追跡されている標準評価のカタログと現在のリーダーボードリーダー。',
    developer: '開発者', metric: '評価指標', difficulty: '難易度',
    topModels: '上位モデル：', viewDossier: '詳細を見る',
  },
  fr: {
    eyebrow: 'RÉPERTOIRE DE BENCHMARKS ET MÉTHODOLOGIE',
    h1: 'Répertoire de Benchmarks IA et Méthodologie',
    lead: 'Plongez dans ce qu\'évaluent les benchmarks IA modernes, pourquoi ils comptent, et la méthodologie officielle de pondération à 8 catégories de BenchLM.',
    methodTitle: 'Méthodologie de Pondération à 8 Catégories de BenchLM',
    methodSub: 'Le score BenchLM global (0–100) est calculé à partir d\'une moyenne pondérée de 8 dimensions de capacités.',
    weight: 'Poids', standardsTitle: 'Normes de Preuves et Normalisation',
    std1Title: '✓ Preuves Vérifiées vs ⚡ Estimées',
    std1Body: 'Les classements "Vérifiés" reposent sur des suites d\'évaluation indépendantes et reproductibles. Les étiquettes "Estimés" désignent des modèles récemment publiés.',
    std2Title: '📐 Indice de Valeur Prix-Performance',
    std2Body: 'L\'Indice de Valeur quantifie l\'intelligence par dollar : Score BenchLM divisé par le log du coût de tokens combiné.',
    std3Title: '🛡️ Atténuation de la Contamination des Données d\'Entraînement',
    std3Body: 'Nous privilégions les benchmarks dynamiques tels que LiveCodeBench qui actualisent continuellement les problèmes.',
    dirTitle: 'Répertoire de Benchmarks Standard du Secteur',
    dirSub: 'Catalogue des évaluations standard suivies dans BenchLM avec les leaders actuels.',
    developer: 'Développeur', metric: 'Métrique d\'Évaluation', difficulty: 'Niveau de Difficulté',
    topModels: 'Modèles Leaders :', viewDossier: 'Ouvrir Dossier',
  },
  de: {
    eyebrow: 'BENCHMARK-VERZEICHNIS UND METHODIK',
    h1: 'KI-Benchmark-Verzeichnis und Methodik',
    lead: 'Tauchen Sie ein in das, was moderne KI-Benchmarks bewerten, und die offizielle BenchLM-Gewichtungsmethodik für 8 Kategorien.',
    methodTitle: 'BenchLM 8-Kategorie-Gewichtungsmethodik',
    methodSub: 'Die BenchLM-Gesamtpunktzahl (0–100) wird als gewichteter Durchschnitt von 8 Fähigkeitsdimensionen berechnet.',
    weight: 'Gewicht', standardsTitle: 'Nachweisstandards und Normalisierung',
    std1Title: '✓ Verifizierte vs ⚡ Geschätzte Beweise',
    std1Body: '"Verifizierte" Rankings basieren auf unabhängigen, reproduzierbaren Evaluierungssuiten. "Geschätzte" Labels bezeichnen kürzlich veröffentlichte Modelle.',
    std2Title: '📐 Preis-Leistungs-Value-Index',
    std2Body: 'Der Value Index quantifiziert Intelligenz pro Dollar: BenchLM-Punktzahl geteilt durch den Log der kombinierten Token-Kosten.',
    std3Title: '🛡️ Minderung von Trainingsdaten-Kontamination',
    std3Body: 'Wir priorisieren dynamische Benchmarks wie LiveCodeBench, die Probleme kontinuierlich aktualisieren.',
    dirTitle: 'Branchenstandard-Benchmark-Verzeichnis',
    dirSub: 'Katalog der in BenchLM verfolgten Standardbewertungen mit aktuellen Führern.',
    developer: 'Entwickler', metric: 'Bewertungsmetrik', difficulty: 'Schwierigkeitsgrad',
    topModels: 'Top-Modelle:', viewDossier: 'Dossier öffnen',
  },
  ar: {
    eyebrow: 'دليل المعايير والمنهجية',
    h1: 'دليل معايير الذكاء الاصطناعي والمنهجية',
    lead: 'تعمق في ما تقيسه معايير الذكاء الاصطناعي الحديثة، ولماذا تهم، ومنهجية الترجيح الرسمية لـ BenchLM ذات الـ 8 فئات.',
    methodTitle: 'منهجية الترجيح بـ 8 فئات لـ BenchLM',
    methodSub: 'يُحسب تقييم BenchLM الإجمالي (0–100) كمتوسط مرجح لـ 8 أبعاد قدرات.',
    weight: 'الوزن', standardsTitle: 'معايير الأدلة والتطبيع',
    std1Title: '✓ أدلة موثقة vs ⚡ مقدرة',
    std1Body: 'تعتمد التصنيفات "الموثقة" على مجموعات تقييم مستقلة وقابلة للتكرار. تشير ملصقات "مقدرة" إلى نماذج حديثة الإصدار.',
    std2Title: '📐 مؤشر القيمة السعر-الأداء',
    std2Body: 'يقيس مؤشر القيمة الذكاء مقابل الدولار: درجة BenchLM مقسومة على لوغاريتم تكلفة التوكنات المدمجة.',
    std3Title: '🛡️ التخفيف من تلوث بيانات التدريب',
    std3Body: 'نعطي الأولوية للمعايير الديناميكية مثل LiveCodeBench التي تجدد المسائل باستمرار.',
    dirTitle: 'دليل المعايير القياسية في الصناعة',
    dirSub: 'كتالوج التقييمات القياسية المتتبعة في BenchLM مع القادة الحاليين.',
    developer: 'المطور', metric: 'مقياس التقييم', difficulty: 'مستوى الصعوبة',
    topModels: 'النماذج الرائدة:', viewDossier: 'فتح الملف',
  },
  pt: {
    eyebrow: 'DIRETÓRIO DE BENCHMARKS E METODOLOGIA',
    h1: 'Diretório de Benchmarks de IA e Metodologia',
    lead: 'Aprofunde-se no que os benchmarks de IA modernos avaliam e na metodologia oficial de ponderação de 8 categorias do BenchLM.',
    methodTitle: 'Metodologia de Ponderação de 8 Categorias do BenchLM',
    methodSub: 'A pontuação BenchLM (0–100) é calculada como uma média ponderada de 8 dimensões de capacidades.',
    weight: 'Peso', standardsTitle: 'Padrões de Evidência e Normalização',
    std1Title: '✓ Evidência Verificada vs ⚡ Estimada',
    std1Body: 'Rankings "Verificados" baseiam-se em conjuntos de avaliação independentes e reprodutíveis. "Estimados" designam modelos recentemente lançados.',
    std2Title: '📐 Índice de Valor Preço-Desempenho',
    std2Body: 'O Índice de Valor quantifica inteligência por dólar: Pontuação BenchLM dividida pelo log do custo de tokens combinado.',
    std3Title: '🛡️ Mitigação de Contaminação de Dados de Treinamento',
    std3Body: 'Priorizamos benchmarks dinâmicos como LiveCodeBench que atualizam continuamente os problemas.',
    dirTitle: 'Diretório de Benchmarks Padrão da Indústria',
    dirSub: 'Catálogo de avaliações padrão rastreadas no BenchLM com os líderes atuais.',
    developer: 'Desenvolvedor', metric: 'Métrica de Avaliação', difficulty: 'Nível de Dificuldade',
    topModels: 'Modelos Líderes:', viewDossier: 'Abrir Dossiê',
  },
  ru: {
    eyebrow: 'КАТАЛОГ БЕНЧМАРКОВ И МЕТОДОЛОГИЯ',
    h1: 'Каталог бенчмарков ИИ и методология оценки',
    lead: 'Глубокое погружение в то, что оценивают современные ИИ-бенчмарки, и официальную методологию взвешивания BenchLM по 8 категориям.',
    methodTitle: 'Методология взвешивания BenchLM по 8 категориям',
    methodSub: 'Общий балл BenchLM (0–100) вычисляется как взвешенное среднее по 8 измерениям возможностей.',
    weight: 'Вес', standardsTitle: 'Стандарты доказательств и нормализация',
    std1Title: '✓ Верифицированные vs ⚡ Оценочные данные',
    std1Body: '«Верифицированные» рейтинги основаны на независимых воспроизводимых оценках. «Оценочные» — для новых моделей, откалиброванных по отчётам вендоров.',
    std2Title: '📐 Индекс ценность/качество',
    std2Body: 'Индекс ценности измеряет интеллект за доллар: балл BenchLM делится на логарифм смешанной стоимости токенов.',
    std3Title: '🛡️ Снижение контаминации обучающих данных',
    std3Body: 'Приоритет отдаётся динамическим бенчмаркам, таким как LiveCodeBench, которые постоянно обновляют задачи.',
    dirTitle: 'Отраслевой каталог стандартных бенчмарков',
    dirSub: 'Каталог стандартных оценок, отслеживаемых в BenchLM, с текущими лидерами.',
    developer: 'Разработчик', metric: 'Метрика оценки', difficulty: 'Уровень сложности',
    topModels: 'Ведущие модели:', viewDossier: 'Открыть досье',
  },
  ko: {
    eyebrow: '벤치마크 디렉토리 및 방법론',
    h1: 'AI 벤치마크 디렉토리 및 방법론',
    lead: '현대 AI 벤치마크가 무엇을 평가하는지, 왜 중요한지, BenchLM의 공식 8범주 가중치 방법론을 심층 분석합니다.',
    methodTitle: 'BenchLM 8범주 가중치 방법론',
    methodSub: 'BenchLM 종합 점수(0–100)는 8개 역량 차원의 가중 평균으로 계산됩니다.',
    weight: '가중치', standardsTitle: '증거 기준 및 정규화',
    std1Title: '✓ 검증된 증거 vs ⚡ 추정 데이터',
    std1Body: '"검증됨" 순위는 독립적이고 재현 가능한 평가에 기반합니다. "추정" 레이블은 벤더 보고서에서 보정된 새로 출시된 모델을 나타냅니다.',
    std2Title: '📐 가격 대비 성능 가치 지수',
    std2Body: '가치 지수는 달러당 지능을 정량화합니다: BenchLM 점수를 혼합 토큰 비용의 로그로 나눈 값입니다.',
    std3Title: '🛡️ 학습 데이터 오염 완화',
    std3Body: 'LiveCodeBench 같이 문제를 지속적으로 갱신하는 동적 벤치마크를 우선시합니다.',
    dirTitle: '업계 표준 벤치마크 디렉토리',
    dirSub: 'BenchLM에서 추적하는 표준 평가 카탈로그 및 현재 리더.',
    developer: '개발자', metric: '평가 지표', difficulty: '난이도 수준',
    topModels: '상위 모델:', viewDossier: '상세 파일 열기',
  },
};

export function render(root, ctx) {
  const lang = ctx.lang;
  const s = S[lang] || S.en || S.id;

  // Hero Section
  const heroEl = el('div.hero', {}, [
    el('div.eyebrow', { text: s.eyebrow }),
    el('h1', { text: s.h1 }),
    el('p', { text: s.lead }),
  ]);

  // Section 1: 8 Categories Weighting Breakdown
  const catGrid = el('div.grid.g-2', { style: { gap: '12px' } });
  CATEGORIES.forEach((cat) => {
    const pct = Math.round(cat.weight * 100);
    const catCard = el('div.card.card-tight', {}, [
      el('div.row-between', { style: { marginBottom: '6px' } }, [
        el('strong', { text: `${cat.icon} ${cat.name[lang] || cat.name.en}` }),
        el('span.badge.badge-accent', { text: `${pct}% ${s.weight}` }),
      ]),
      meter(pct * 4),
      el('p', { text: cat.desc[lang] || cat.desc.en, style: { fontSize: '0.82rem', color: 'var(--text-mute)', marginTop: '8px' } }),
    ]);
    catGrid.appendChild(catCard);
  });

  const methodCard = el('section.card', {}, [
    el('div.card-head', {}, [el('h2', {}, ['⚖️ ' + s.methodTitle])]),
    el('p.card-sub', { text: s.methodSub }),
    catGrid,
  ]);

  // Section 2: Standards & Normalization
  const standardsCard = el('section.card', { style: { marginTop: '18px' } }, [
    el('div.card-head', {}, [el('h2', {}, ['🛡️ ' + s.standardsTitle])]),
    el('div.grid.g-3', {}, [
      el('div.card.card-tight', { style: { background: 'var(--surface-2)' } }, [
        el('h3', { text: s.std1Title, style: { fontSize: '0.95rem', marginBottom: '8px' } }),
        el('p', { text: s.std1Body, style: { fontSize: '0.84rem', color: 'var(--text-dim)' } }),
      ]),
      el('div.card.card-tight', { style: { background: 'var(--surface-2)' } }, [
        el('h3', { text: s.std2Title, style: { fontSize: '0.95rem', marginBottom: '8px' } }),
        el('p', { text: s.std2Body, style: { fontSize: '0.84rem', color: 'var(--text-dim)' } }),
      ]),
      el('div.card.card-tight', { style: { background: 'var(--surface-2)' } }, [
        el('h3', { text: s.std3Title, style: { fontSize: '0.95rem', marginBottom: '8px' } }),
        el('p', { text: s.std3Body, style: { fontSize: '0.84rem', color: 'var(--text-dim)' } }),
      ]),
    ]),
  ]);

  // Section 3: Benchmark Catalog Cards
  const benchGrid = el('div.grid.g-2', { style: { gap: '14px' } });
  BENCHMARKS.forEach((b) => {
    // Cari 3 model teratas untuk benchmark ini
    const leaders = [...LEADERBOARD_MODELS]
      .filter((m) => m.benchmarks[b.id] != null)
      .sort((a, bM) => bM.benchmarks[b.id] - a.benchmarks[b.id])
      .slice(0, 3);

    const leadersList = el('div.row', { style: { gap: '6px', marginTop: '8px' } });
    leaders.forEach((lm, idx) => {
      const val = lm.benchmarks[b.id];
      const rankIcon = idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉';
      const chip = el('button.chip', {
        type: 'button',
        style: { fontSize: '0.78rem', padding: '3px 8px' },
        onclick: () => ctx.go(`#/leaderboard?model=${lm.id}`),
      }, [`${rankIcon} ${lm.name} (${val}%)`]);
      leadersList.appendChild(chip);
    });

    const bCard = el('div.card.card-tight.benchmark-catalog-card', {}, [
      el('div.row-between', { style: { marginBottom: '8px' } }, [
        el('strong', { text: b.name, style: { fontSize: '1.05rem' } }),
        el('span.badge.badge-ok', { text: b.difficulty }),
      ]),
      el('p', { text: b.desc[lang] || b.desc.id, style: { fontSize: '0.86rem', color: 'var(--text-dim)', marginBottom: '10px' } }),
      el('div.grid.g-2', { style: { gap: '6px', fontSize: '0.8rem', background: 'var(--surface-2)', padding: '8px 10px', borderRadius: 'var(--r-sm)' } }, [
        el('span', {}, [el('strong', { text: `${s.developer}: ` }), b.developer]),
        el('span', {}, [el('strong', { text: `${s.metric}: ` }), b.metric]),
      ]),
      el('div', { style: { marginTop: '10px' } }, [
        el('span', { text: s.topModels, style: { fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-mute)' } }),
        leadersList,
      ]),
    ]);
    benchGrid.appendChild(bCard);
  });

  const catalogCard = el('section.card', { style: { marginTop: '18px' } }, [
    el('div.card-head', {}, [el('h2', {}, ['📚 ' + s.dirTitle])]),
    el('p.card-sub', { text: s.dirSub }),
    benchGrid,
  ]);

  root.append(
    heroEl,
    methodCard,
    standardsCard,
    catalogCard,
  );

  return () => {};
}
