/* ============================================================
   seo.js — Dynamic Meta Tags & JSON-LD Structured Data (Schema.org)
   Mendukung 11 Bahasa Global: ID, EN, ES, ZH, JA, FR, DE, AR, PT, RU, KO
   ============================================================ */

import { LEADERBOARD_MODELS, BENCHMARKS } from '../data/leaderboard.js';

const BASE_URL = 'https://bench.vijeron.com';

export const SEO_DATA = {
  leaderboard: {
    title: {
      id: 'Leaderboard Model AI & Metodologi Benchmark 8 Kategori',
      en: 'AI Model Leaderboard & Verified Benchmarks 2026',
      es: 'Clasificación de Modelos de IA y Benchmarks Verificados 2026',
      zh: 'AI 模型天梯榜与官方验证基准测试 2026',
      ja: 'AIモデルリーダーボード＆検証済みベンチマーク 2026',
      fr: 'Classement des Modèles IA et Benchmarks Vérifiés 2026',
      de: 'KI-Modell-Rangliste & Verifizierte Benchmarks 2026',
      ar: 'لوحة صدارة نماذج الذكاء الاصطناعي والمقاييس الموثقة 2026',
      pt: 'Classificação de Modelos de IA e Benchmarks Verificados 2026',
      ru: 'Рейтинг моделей ИИ и проверенные бенчмарки 2026',
      ko: 'AI 모델 리더보드 & 검증된 벤치마크 2026',
    },
    desc: {
      id: 'Peringkat independen 30+ model AI dengan skor terbobot 8 kategori, harga token API, kecepatan streaming, dan context window.',
      en: 'Independent ranking of 30+ AI models across 8 weighted categories, token pricing, throughput speed, and context limits.',
      es: 'Clasificación independiente de más de 30 modelos de IA en 8 categorías ponderadas, precios de tokens, velocidad y límites de contexto.',
      zh: '独立评估 30+ 款前沿 AI 模型，覆盖 8 项加权维度得分、API Token 价格、生成速度及上下文窗口。',
      ja: '8つの加重カテゴリ、トークン価格、スループット速度、コンテキスト制限にわたる30以上のAIモデルの独立ランキング。',
      fr: 'Classement indépendant de plus de 30 modèles IA sur 8 catégories pondérées, tarifs de tokens, vitesse et limites de contexte.',
      de: 'Unabhängige Rangliste von über 30 KI-Modellen in 8 gewichteten Kategorien, Token-Preisen, Geschwindigkeit und Kontextgrenzen.',
      ar: 'تصنيف مستقل لأكثر من 30 نموذج ذكاء اصطناعي عبر 8 فئات مرجحة، وأسعار التوكنات، وسرعة المعالجة، وحدود السياق.',
      pt: 'Classificação independente de mais de 30 modelos de IA em 8 categorias ponderadas, preços de tokens, velocidade e limites de contexto.',
      ru: 'Независимый рейтинг более 30 моделей ИИ по 8 взвешенным категориям, ценам на токены, скорости и контекстному окну.',
      ko: '8개 가중치 카테고리, 토큰 가격, 처리 속도 및 컨텍스트 한도에 걸친 30개 이상의 AI 모델 독립 순위.',
    },
    keywords: 'AI leaderboard, LLM benchmarks, Claude 3.7 Sonnet, DeepSeek R1, GPT-5, Qwen 2.5 Coder, Llama 3.3, Phi-4, token pricing, SWE-bench, MMLU-Pro, GPQA Diamond',
    schema: (lang) => ({
      '@context': 'https://schema.org',
      '@type': 'Dataset',
      name: `BenchLM AI Model Benchmark Dataset (${lang.toUpperCase()})`,
      description: 'Comprehensive benchmark scores, API pricing, throughput, and context limits for frontier and open-weights LLMs.',
      url: `${BASE_URL}/?lang=${lang}#/leaderboard`,
      creator: { '@type': 'Organization', name: 'LLM Lab & BenchLM', url: BASE_URL },
      variableMeasured: [
        'BenchLM Overall Score (0-100)',
        'Coding (LiveCodeBench, SWE-bench)',
        'Reasoning (GPQA Diamond, MATH-500)',
        'Token Pricing per Million',
        'Output Speed (tokens/sec)',
        'Context Window Size',
      ],
      itemListElement: LEADERBOARD_MODELS.slice(0, 10).map((m, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: m.name,
        description: `${m.vendor} - BenchLM: ${m.overall}/100, $${m.blend}/1M tokens`,
      })),
    }),
  },
  compare: {
    title: {
      id: 'Perbandingan Model AI Head-to-Head & Radar Chart',
      en: 'Head-to-Head AI Model Comparison & Radar Chart',
      es: 'Comparación de Modelos de IA Frente a Frente y Gráfico Radar',
      zh: 'AI 模型横向对比与能力雷达图',
      ja: 'AIモデル直接比較＆レーダーチャート',
      fr: 'Comparaison des Modèles IA Face à Face et Graphique Radar',
      de: 'Direkter KI-Modell-Vergleich & Radar-Diagramm',
      ar: 'مقارنة نماذج الذكاء الاصطناعي ومخطط الرادار',
      pt: 'Comparação de Modelos de IA Frente a Frente e Gráfico Radar',
      ru: 'Сравнение моделей ИИ лицом к лицу и радарный график',
      ko: 'AI 모델 1:1 비교 & 레이더 차트',
    },
    desc: {
      id: 'Bandingkan hingga 4 model AI secara berdampingan dengan grafik spider/radar 8 dimensi, matriks tolok ukur spesifik, dan kalkulator selisih tagihan bulanan.',
      en: 'Compare up to 4 AI models side-by-side with an 8-axis capability spider chart, detailed benchmark score matrix, and comparative cost simulation.',
      es: 'Compare hasta 4 modelos de IA lado a lado con un gráfico de araña de 8 ejes, matriz de puntuaciones y simulación de costos.',
      zh: '支持最多 4 款模型横向对比，配备 8 维能力雷达图、详细基准测试矩阵及每月成本差异估算。',
      ja: '8軸スパイダーチャート、詳細ベンチマークマトリクス、コストシミュレーションで最大4つのAIモデルを並べて比較。',
      fr: 'Comparez jusqu\'à 4 modèles IA côte à côte avec un graphique radar à 8 axes, une matrice de scores et une simulation des coûts.',
      de: 'Vergleichen Sie bis zu 4 KI-Modelle nebeneinander mit einem 8-Achsen-Radar-Diagramm, Benchmark-Score-Matrix und Kostensimulation.',
      ar: 'قارن حتى 4 نماذج ذكاء اصطناعي جنبًا إلى جنب مع مخطط عنكبوتي بـ 8 محاور ومصفوفة تقييم ومحاكاة التكلفة.',
      pt: 'Compare até 4 modelos de IA lado a lado com gráfico aranha de 8 eixos, matriz de pontuação e simulação de custos.',
      ru: 'Сравните до 4 моделей ИИ бок о бок с 8-осевой лепестковой диаграммой, матрицей оценок и симуляцией затрат.',
      ko: '8축 레이더 차트, 상세 벤치마크 점수 매트릭스 및 비교 비용 시뮬레이션으로 최대 4개 AI 모델을 나란히 비교하세요.',
    },
    keywords: 'AI model comparison, compare LLMs, Claude vs GPT, DeepSeek vs OpenAI, LLM radar chart, AI benchmark matrix, token cost comparison',
    schema: (lang) => ({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: `Multi-Model AI Capability Comparator (${lang.toUpperCase()})`,
      url: `${BASE_URL}/?lang=${lang}#/compare`,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'All',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    }),
  },
  selector: {
    title: {
      id: 'Pencari Model AI Pintar & Kurva Batas Efisiensi Pareto',
      en: 'Smart AI Model Selector & Price-Performance Pareto Curve',
      es: 'Selector Inteligente de Modelos de IA y Curva de Pareto',
      zh: '智能模型选型助手与帕累托效率前沿曲线',
      ja: 'スマートAIモデル選定＆パレート効率曲線',
      fr: 'Sélecteur Intelligent de Modèle IA & Courbe de Pareto',
      de: 'Intelligenter KI-Modell-Selektor & Pareto-Effizienzkurve',
      ar: 'محدد نماذج الذكاء الاصطناعي الذكي ومنحنى باريتو',
      pt: 'Seletor Inteligente de Modelos de IA e Curva de Pareto',
      ru: 'Умный подбор моделей ИИ и кривая эффективности Парето',
      ko: '스마트 AI 모델 선택기 & 파레토 효율 곡선',
    },
    desc: {
      id: 'Temukan model AI terbaik sesuai kebutuhan beban kerja atau jelajahi efisiensi harga vs performa pada grafik batas Pareto.',
      en: 'Find the best AI model tailored to your workload constraints or explore the Pareto efficiency price-performance curve.',
      es: 'Encuentre el mejor modelo de IA según sus requisitos o explore la curva de eficiencia precio-rendimiento de Pareto.',
      zh: '根据工作负载约束匹配最佳 AI 模型，或在帕累托效率前沿曲线上探索价格与性能的平衡点。',
      ja: 'ワークロード要件に合わせた最適なAIモデルを見つけるか、パレート効率曲線でコストと性能のバランスを探索。',
      fr: 'Trouvez le modèle IA optimal pour vos besoins ou explorez la courbe d\'efficacité de Pareto prix-performance.',
      de: 'Finden Sie das optimale KI-Modell für Ihre Anforderungen oder erkunden Sie die Pareto-Effizienzkurve.',
      ar: 'ابحث عن نموذج الذكاء الاصطناعي الأنسب لقيود عملك أو استكشف منحنى كفاءة باريتو للسعر مقابل الأداء.',
      pt: 'Encontre o modelo de IA ideal para seus requisitos ou explore a curva de eficiência de Pareto preço-desempenho.',
      ru: 'Найдите оптимальную модель ИИ для ваших задач или исследуйте кривую эффективности Парето.',
      ko: '워크로드 제약 조건에 맞는 최적의 AI 모델을 찾거나 파레토 효율 가격 대비 성능 곡선을 탐색하세요.',
    },
    keywords: 'AI model selector, find best LLM, Pareto frontier AI, LLM price to performance, best AI for coding, cheapest LLM API',
    schema: (lang) => ({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: `Smart AI Model Finder & Pareto Explorer (${lang.toUpperCase()})`,
      url: `${BASE_URL}/?lang=${lang}#/selector`,
      applicationCategory: 'BusinessApplication',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    }),
  },
  benchmarks: {
    title: {
      id: 'Direktori Benchmark AI & Metodologi Penilaian Resmi',
      en: 'AI Benchmark Directory & Evaluation Methodology',
      es: 'Directorio de Benchmarks de IA y Metodología Oficial',
      zh: 'AI 基准测试目录与官方评测方法论',
      ja: 'AIベンチマークディレクトリ＆公式評価方法論',
      fr: 'Répertoire des Benchmarks IA et Méthodologie Officielle',
      de: 'KI-Benchmark-Verzeichnis & Offizielle Methodik',
      ar: 'دليل معايير الذكاء الاصطناعي والمنهجية الرسمية',
      pt: 'Diretório de Benchmarks de IA e Metodologia Oficial',
      ru: 'Каталог бенчмарков ИИ и официальная методология',
      ko: 'AI 벤치마크 디렉토리 및 공식 평가 방법론',
    },
    desc: {
      id: 'Panduan lengkap tolok ukur evaluasi AI modern (SWE-bench, GPQA, MMLU-Pro, IFEval, LiveCodeBench) dan formula pembobotan 8 kategori resmi BenchLM.',
      en: 'Deep dive into modern AI evaluation benchmarks (SWE-bench, GPQA, MMLU-Pro, IFEval, LiveCodeBench) and the official BenchLM 8-category weighting formula.',
      es: 'Guía detallada de benchmarks de evaluación de IA modernos y la fórmula oficial de ponderación de 8 categorías de BenchLM.',
      zh: '深入解析现代 AI 评测基准（SWE-bench、GPQA、MMLU-Pro、IFEval、LiveCodeBench）及 BenchLM 官方 8 维度加权公式。',
      ja: '最新AI評価ベンチマークとBenchLMの公式8カテゴリ加重計算式を詳しく解説。',
      fr: 'Plongée au cœur des benchmarks d\'évaluation IA modernes et de la formule officielle de pondération à 8 catégories de BenchLM.',
      de: 'Detaillierter Einblick in moderne KI-Evaluierungs-Benchmarks und die offizielle 8-Kategorien-Gewichtungsformel von BenchLM.',
      ar: 'تعمق في معايير تقييم الذكاء الاصطناعي الحديثة وصيغة ترجيح الفئات الثماني الرسمية لـ BenchLM.',
      pt: 'Guia aprofundado dos benchmarks de avaliação de IA modernos e fórmula oficial de ponderação de 8 categorias do BenchLM.',
      ru: 'Подробный обзор современных бенчмарков ИИ и официальной формулы взвешивания BenchLM по 8 категориям.',
      ko: '현대 AI 평가 벤치마크와 BenchLM 공식 8범주 가중치 산출 공식에 대한 심층 분석.',
    },
    keywords: 'AI benchmarks guide, SWE-bench verified, GPQA diamond, MMLU-pro, LiveCodeBench, IFEval, MATH-500, Chatbot Arena Elo, LLM evaluation methodology',
    schema: (lang) => ({
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: `AI Model Benchmark Directory & Methodology (${lang.toUpperCase()})`,
      url: `${BASE_URL}/?lang=${lang}#/benchmarks`,
      author: { '@type': 'Organization', name: 'LLM Lab & BenchLM' },
      about: BENCHMARKS.map((b) => ({
        '@type': 'DefinedTerm',
        name: b.name,
        description: b.desc[lang] || b.desc.en || b.desc.id,
      })),
    }),
  },
  simulator: {
    title: {
      id: 'Simulator Sampling Token & Generasi LLM Interaktif',
      en: 'Interactive Token Sampling & LLM Generation Simulator',
      es: 'Simulador Interactivo de Muestreo de Tokens y Generación LLM',
      zh: '交互式 Token 采样与大语言模型生成模拟器',
      ja: 'インタラクティブTokenサンプリング＆LLM生成シミュレータ',
      fr: 'Simulateur Interactif d\'Échantillonnage de Tokens et Génération LLM',
      de: 'Interaktiver Token-Sampling & LLM-Generierungssimulator',
      ar: 'محاكي أخذ عينات الرموز وتوليد نماذج اللغة التفاعلي',
      pt: 'Simulador Interativo de Amostragem de Tokens e Geração LLM',
      ru: 'Интерактивный симулятор сэмплирования токенов и генерации LLM',
      ko: '인터랙티브 토큰 샘플링 & LLM 생성 시뮬레이터',
    },
    desc: {
      id: 'Simulasi sampling token langkah demi langkah: penalti frekuensi, softmax bersuhu, pemangkasan top-k/top-p, entropi, dan pipeline 9 tahap.',
      en: 'Step-by-step token sampling simulation: frequency penalty, temperature softmax, top-k/top-p pruning, entropy, and 9-stage inference pipeline.',
      es: 'Simulación paso a paso del muestreo de tokens: penalización de frecuencia, temperatura, corte top-k/top-p, entropía y pipeline de 9 etapas.',
      zh: '单步执行 Token 采样模拟：频率惩罚、温度缩放 Softmax、Top-k/Top-p 截断、熵值分析与 9 阶段推理流水线。',
      ja: 'ステップバイステップのトークンサンプリングシミュレーション：頻度ペナルティ、温度、top-k/top-p、エントロピー、9段階パイプライン。',
      fr: 'Simulation pas à pas de l\'échantillonnage de tokens : pénalité de fréquence, température, élagage top-k/top-p, entropie et pipeline en 9 étapes.',
      de: 'Schritt-für-Schritt-Simulation der Token-Abtastung: Häufigkeitsstrafe, Temperatur-Softmax, Top-k/Top-p-Trunkierung und 9-Stufen-Pipeline.',
      ar: 'محاكاة خطوة بخطوة لأخذ عينات الرموز: عقوبة التكرار، ودرجة الحرارة، واقتطاع top-k/top-p، والإنتروبيا، ومسار من 9 مراحل.',
      pt: 'Simulação passo a passo de amostragem de tokens: penalidade de frequência, temperatura, truncamento top-k/top-p, entropia e pipeline de 9 etapas.',
      ru: 'Пошаговая симуляция сэмплирования токенов: штрафы частоты, температура softmax, усечение top-k/top-p, энтропия и 9-этапный пайплайн.',
      ko: '단계별 토큰 샘플링 시뮬레이션: 빈도 패널티, 온도 softmax, top-k/top-p 가지치기, 엔트로피 및 9단계 추론 파이프라인.',
    },
    keywords: 'LLM sampling simulator, temperature sampling, top-p nucleus sampling, token generation visualizer, how LLMs work',
    schema: (lang) => ({
      '@context': 'https://schema.org',
      '@type': 'LearningResource',
      name: `Interactive LLM Token Sampling Simulator (${lang.toUpperCase()})`,
      url: `${BASE_URL}/?lang=${lang}#/simulator`,
      educationalLevel: 'Beginner to Advanced',
      learningResourceType: 'Simulation',
    }),
  },
  tokenizer: {
    title: {
      id: 'Tokenizer BPE, WordPiece, SentencePiece & Kalkulator Biaya',
      en: 'BPE, WordPiece, SentencePiece Tokenizer & Cost Calculator',
      es: 'Tokenizador BPE, WordPiece, SentencePiece y Calculadora de Costos',
      zh: 'BPE、WordPiece、SentencePiece 分词器与成本计算器',
      ja: 'BPE、WordPiece、SentencePiece トークナイザー＆コスト計算機',
      fr: 'Tokeniseur BPE, WordPiece, SentencePiece & Calculateur de Coûts',
      de: 'BPE, WordPiece, SentencePiece Tokenizer & Kostenrechner',
      ar: 'أداة الترميز BPE وWordPiece وSentencePiece وحاسبة التكلفة',
      pt: 'Tokenizador BPE, WordPiece, SentencePiece e Calculadora de Custos',
      ru: 'Токенизатор BPE, WordPiece, SentencePiece и калькулятор затрат',
      ko: 'BPE, WordPiece, SentencePiece 토크나이저 & 비용 계산기',
    },
    desc: {
      id: 'Visualisasi pemotongan sub-kata tokenizer 3 gaya dengan byte fallback, ID semu, dan kalkulator biaya per permintaan serta per bulan.',
      en: 'Interactive 3-style sub-word tokenizer visualizer with byte fallback, pseudo-IDs, and monthly token pricing calculator.',
      es: 'Visualizador interactivo de subpalabras de 3 estilos con respaldo de bytes, pseudo-IDs y calculadora mensual de costos de tokens.',
      zh: '交互式 3 种分词算法可视化工具，支持字节回退、伪 ID 查看及月度 Token 费用实时计算。',
      ja: '3つのスタイルのサブワードトークナイザー視覚化ツール。疑似ID表示と月間トークンコスト計算機能を搭載。',
      fr: 'Visualiseur interactif de sous-mots à 3 styles avec repli d\'octets, pseudo-identifiants et calculateur de coûts mensuels.',
      de: 'Interaktiver 3-Stil-Teilwort-Tokenizer-Visualisierer mit Byte-Fallback, Pseudo-IDs und monatlichem Token-Kostenrechner.',
      ar: 'أداة تفاعلية لتصور ترميز الكلمات الجزئية بثلاثة أساليب مع دعم البايتات ومعرفات وهمية وحاسبة شهرية للأسعار.',
      pt: 'Visualizador interativo de subpalavras de 3 estilos com fallback de bytes, pseudo-IDs e calculadora de custos mensais.',
      ru: 'Интерактивная визуализация 3 стилей токенизации подслов с байтовым фолбэком, псевдо-ID и калькулятором затрат.',
      ko: '바이트 폴백, 의사 ID 및 월간 토큰 가격 계산기를 갖춘 인터랙티브 3스타일 하위 단어 토크나이저 시각화 도구.',
    },
    keywords: 'tokenizer online, BPE tokenizer, WordPiece, SentencePiece, token counter, LLM cost calculator, tokens per word',
    schema: (lang) => ({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: `Multi-Algorithm Tokenizer & Pricing Calculator (${lang.toUpperCase()})`,
      url: `${BASE_URL}/?lang=${lang}#/tokenizer`,
      applicationCategory: 'UtilityApplication',
    }),
  },
  context: {
    title: {
      id: 'Visualisasi Jendela Konteks & Simulasi Memori Percakapan',
      en: 'Context Window Visualizer & Chat Memory Simulation',
      es: 'Visualizador de Ventana de Contexto y Simulación de Memoria',
      zh: '上下文窗口可视化与对话记忆模拟器',
      ja: 'コンテキストウィンドウ可視化＆チャットメモリシミュレーション',
      fr: 'Visualiseur de Fenêtre de Contexte & Simulation de Mémoire',
      de: 'Kontextfenster-Visualisierer & Chat-Gedächtnis-Simulation',
      ar: 'أداة تصور نافذة السياق ومحاكاة ذاكرة المحادثة',
      pt: 'Visualizador de Janela de Contexto e Simulação de Memória',
      ru: 'Визуализатор контекстного окна и симуляция памяти чата',
      ko: '컨텍스트 윈도우 시각화 & 채팅 메모리 시뮬레이션',
    },
    desc: {
      id: 'Perbandingan jendela konteks skala logaritmik, kalkulator kapasitas bahan bacaan, dan simulasi sliding window memori percakapan.',
      en: 'Logarithmic context window comparison, reading material capacity calculator, and chat memory sliding window simulation.',
      es: 'Comparación logarítmica de ventanas de contexto, calculadora de capacidad de lectura y simulación de memoria deslizante.',
      zh: '对数尺度上下文窗口对比、阅读材料容量计算器及对话滑动窗口记忆模拟。',
      ja: '対数スケールのコンテキストウィンドウ比較、読み物容量計算機、チャットメモリスライディングウィンドウシミュレーション。',
      fr: 'Comparaison logarithmique des fenêtres de contexte, calculateur de capacité de lecture et simulation de mémoire glissante.',
      de: 'Logarithmischer Kontextfenster-Vergleich, Lesekapazitätsrechner und Chat-Gedächtnis-Sliding-Window-Simulation.',
      ar: 'مقارنة لوغاريتمية لنوافذ السياق، وحاسبة سعة المواد المقروءة، ومحاكاة النافذة المنزلقة لذاكرة المحادثة.',
      pt: 'Comparação logarítmica de janelas de contexto, calculadora de capacidade de leitura e simulação de memória deslizante.',
      ru: 'Логарифмическое сравнение контекстных окон, калькулятор объёма материалов и симуляция скользящего окна памяти.',
      ko: '로그 척도 컨텍스트 윈도우 비교, 읽기 자료 용량 계산기 및 채팅 메모리 슬라이딩 윈도우 시뮬레이션.',
    },
    keywords: 'context window comparison, LLM memory simulation, 2M context window, sliding window memory, RAG vs context',
    schema: (lang) => ({
      '@context': 'https://schema.org',
      '@type': 'LearningResource',
      name: `Context Window & Memory Simulation Guide (${lang.toUpperCase()})`,
      url: `${BASE_URL}/?lang=${lang}#/context`,
    }),
  },
  prompting: {
    title: {
      id: 'Panduan Prompt Engineering RISEN & Templat Siap Pakai',
      en: 'RISEN Prompt Engineering Framework & Ready Templates',
      es: 'Marco de Ingeniería de Prompts RISEN y Plantillas',
      zh: 'RISEN 提示词工程框架与即用型模板库',
      ja: 'RISENプロンプトエンジニアリングフレームワーク＆既製テンプレート',
      fr: 'Cadre d\'Ingénierie de Prompt RISEN & Modèles Prêts à l\'Emploi',
      de: 'RISEN Prompt-Engineering-Framework & Fertige Vorlagen',
      ar: 'إطار هندسة الأوامر RISEN والقوالب الجاهزة',
      pt: 'Estrutura de Engenharia de Prompts RISEN e Modelos Prontos',
      ru: 'Фреймворк промпт-инжиниринга RISEN и готовые шаблоны',
      ko: 'RISEN 프롬프트 엔지니어링 프레임워크 & 완성형 템플릿',
    },
    desc: {
      id: 'Penyusun prompt metode RISEN dengan skor kelengkapan 8 kriteria langsung, 8 teknik perbandingan sebelum/sesudah, dan katalog templat siap pakai.',
      en: 'RISEN framework prompt builder with 8-criteria real-time score grading, 8 before/after technique guides, and categorized prompt templates.',
      es: 'Constructor de prompts con marco RISEN, calificación de 8 criterios, 8 técnicas de comparación y plantillas categorizadas.',
      zh: '基于 RISEN 框架的提示词生成器，包含 8 项标准实时完整性评分、8 项前后对比技巧及分类模板。',
      ja: '8つの基準によるリアルタイムスコア評価、8つの事前/事後テクニックガイド、カテゴリ別テンプレートを備えたRISENビルダー。',
      fr: 'Constructeur de prompts avec cadre RISEN, notation sur 8 critères, 8 guides de techniques avant/après et modèles catégorisés.',
      de: 'RISEN-Framework-Prompt-Builder mit Echtzeit-Bewertung nach 8 Kriterien, 8 Vorher/Nachher-Technikanleitungen und kategorisierten Vorlagen.',
      ar: 'منشئ موجهات بإطار RISEN مع تقييم فوري وفق 8 معايير، و8 أدلة تقنيات قبل/بعد، وقوالب موجهات مصنفة.',
      pt: 'Construtor de prompts com estrutura RISEN, pontuação em tempo real em 8 critérios, 8 técnicas antes/depois e modelos categorizados.',
      ru: 'Конструктор промптов по фреймворку RISEN с оценкой по 8 критериям в реальном времени, 8 руководствами до/после и каталогом шаблонов.',
      ko: '8가지 기준 실시간 완성도 채점, 8가지 전/후 기법 가이드 및 카테고리별 프롬프트 템플릿을 갖춘 RISEN 프레임워크 빌더.',
    },
    keywords: 'prompt engineering guide, RISEN prompt framework, prompt optimizer, system prompts, few-shot prompting, chain of thought prompt',
    schema: (lang) => ({
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: `How to Write Effective Prompts with RISEN Framework (${lang.toUpperCase()})`,
      url: `${BASE_URL}/?lang=${lang}#/prompting`,
    }),
  },
  glossary: {
    title: {
      id: 'Glosarium AI & LLM — 150+ Istilah Dwi-Bahasa (ID/EN)',
      en: 'AI & LLM Glossary — 150+ Terms Multi-Language',
      es: 'Glosario de IA y LLM — Más de 150 Términos',
      zh: 'AI 与大语言模型术语表 — 150+ 核心概念',
      ja: 'AI＆LLM用語集 — 150以上の専門用語解説',
      fr: 'Glossaire IA & LLM — Plus de 150 Termes',
      de: 'KI & LLM Glossar — Über 150 Begriffe',
      ar: 'مسرد مصطلحات الذكاء الاصطناعي ونماذج اللغة — أكثر من 150 مصطلحاً',
      pt: 'Glossário de IA e LLM — Mais de 150 Termos',
      ru: 'Глоссарий по ИИ и LLM — более 150 терминов',
      ko: 'AI & LLM 용어집 — 150개 이상의 핵심 용어',
    },
    desc: {
      id: 'Kamus glosarium istilah kecerdasan buatan, machine learning, transformer, sampling, dan arsitektur LLM dalam multi-bahasa dunia.',
      en: 'Comprehensive dictionary of AI, machine learning, transformer architecture, sampling methods, and LLM terminology across global languages.',
      es: 'Diccionario completo de términos de inteligencia artificial, aprendizaje automático, transformers y LLMs.',
      zh: '涵盖人工智能、机器学习、Transformer 架构、采样方法及大语言模型核心术语的全面词典。',
      ja: 'AI、機械学習、Transformerアーキテクチャ、サンプリング手法、LLM用語の包括的な用語集。',
      fr: 'Dictionnaire complet de la terminologie de l\'IA, du machine learning, des transformers et des LLMs.',
      de: 'Umfassendes Wörterbuch für KI, maschinelles Lernen, Transformer-Architektur und LLM-Terminologie.',
      ar: 'قاموس شامل لمصطلحات الذكاء الاصطناعي وتعلم الآلة ومعمارية المحولات ونماذج اللغة.',
      pt: 'Dicionário abrangente de termos de IA, aprendizado de máquina, arquitetura transformer e LLMs.',
      ru: 'Полный словарь терминов искусственного интеллекта, машинного обучения, архитектуры трансформеров и LLM.',
      ko: '인공지능, 머신러닝, 트랜스포머 아키텍처, 샘플링 방법 및 LLM 핵심 용어에 대한 종합 사전.',
    },
    keywords: 'AI glossary, kamus AI, istilah kecerdasan buatan, LLM terms, transformer dictionary, AI terminology ID EN',
    schema: (lang) => ({
      '@context': 'https://schema.org',
      '@type': 'DefinedTermSet',
      name: `Comprehensive AI & LLM Glossary (${lang.toUpperCase()})`,
      url: `${BASE_URL}/?lang=${lang}#/glossary`,
    }),
  },
};

/**
 * Memperbarui Meta Tags, Canonical Link, OpenGraph, Twitter Card, & JSON-LD
 */
export function updateSEO(routeId, lang = 'id') {
  const meta = SEO_DATA[routeId] || SEO_DATA.leaderboard;
  const titleText = `${meta.title[lang] || meta.title.en || meta.title.id} — LLM Lab & BenchLM`;
  const descText = meta.desc[lang] || meta.desc.en || meta.desc.id;
  // Canonical tanpa fragment: mesin pencari mengabaikan bagian setelah '#',
  // jadi URL yang benar-benar dapat diindeks adalah varian bahasa.
  const canonicalUrl = `${BASE_URL}/?lang=${lang}`;
  // og:url tetap membawa rute supaya tautan yang dibagikan membuka tampilan yang sama.
  const shareUrl = `${BASE_URL}/?lang=${lang}#/${routeId}`;

  // Title
  document.title = titleText;

  // Meta Description
  let descTag = document.querySelector('meta[name="description"]');
  if (!descTag) {
    descTag = document.createElement('meta');
    descTag.name = 'description';
    document.head.appendChild(descTag);
  }
  descTag.content = descText;

  // Meta Keywords
  let kwTag = document.querySelector('meta[name="keywords"]');
  if (!kwTag) {
    kwTag = document.createElement('meta');
    kwTag.name = 'keywords';
    document.head.appendChild(kwTag);
  }
  kwTag.content = meta.keywords;

  // Canonical Link
  let canTag = document.querySelector('link[rel="canonical"]');
  if (!canTag) {
    canTag = document.createElement('link');
    canTag.rel = 'canonical';
    document.head.appendChild(canTag);
  }
  canTag.href = canonicalUrl;

  // Open Graph
  const setOG = (property, content) => {
    let tag = document.querySelector(`meta[property="${property}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('property', property);
      document.head.appendChild(tag);
    }
    tag.content = content;
  };
  setOG('og:title', titleText);
  setOG('og:description', descText);
  setOG('og:url', shareUrl);
  setOG('og:type', 'website');
  setOG('og:site_name', 'LLM Lab & BenchLM');
  setOG('og:locale', lang === 'id' ? 'id_ID' : lang === 'en' ? 'en_US' : `${lang}_${lang.toUpperCase()}`);

  // Twitter Card
  const setTwitter = (name, content) => {
    let tag = document.querySelector(`meta[name="${name}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.name = name;
      document.head.appendChild(tag);
    }
    tag.content = content;
  };
  setTwitter('twitter:card', 'summary_large_image');
  setTwitter('twitter:title', titleText);
  setTwitter('twitter:description', descText);

  // Dynamic JSON-LD Schema
  let schemaScript = document.getElementById('jsonld-schema');
  if (!schemaScript) {
    schemaScript = document.createElement('script');
    schemaScript.id = 'jsonld-schema';
    schemaScript.type = 'application/ld+json';
    document.head.appendChild(schemaScript);
  }
  const schemaObj = meta.schema ? meta.schema(lang) : null;
  if (schemaObj) {
    schemaScript.textContent = JSON.stringify(schemaObj, null, 2);
  }
}
