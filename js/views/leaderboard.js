import { el, card, stat, meter, slider, compact, usd, nf, toast } from '../lib/ui.js';
import { CATEGORIES, BENCHMARKS, LEADERBOARD_MODELS, USE_CASE_PROFILES, calcOverall, calcBlendedPrice, calcValueIndex } from '../data/leaderboard.js';
import { createRadarChart } from '../lib/charts.js';
import { exportLeaderboardCSV, exportLeaderboardJSON, getPartnerLink, openAdvisoryModal } from '../lib/monetize.js';
import { LEADGEN } from '../config.js';

export const meta = { title: { id: 'Leaderboard AI', en: 'AI Leaderboard' } };

const S = {
  id: {
    eyebrow: 'BENCHLM EVALUATION STANDARD',
    h1: 'Leaderboard Model AI & Skor Terbobot 8 Kategori',
    lead: 'Evaluasi independen model frontier dan open-weights berdasarkan 8 kategori kemampuan terbobot, harga API per 1 juta token, kecepatan streaming, dan kapasitas jendela konteks.',
    statModels: 'Model Dipantau', statCats: 'Kategori Terbobot', statFrontier: 'Model Frontier Tier-1', statOpen: 'Bobot Terbuka (Open)',
    searchPlh: 'Cari nama model, arsitektur, atau penyedia…',
    catAll: 'Semua Kategori',
    catFrontier: 'Frontier Only',
    catOpen: 'Open Weights',
    catBudget: 'Hemat (<$1/1M)',
    catLongCtx: 'Konteks Panjang (≥1M)',
    filterVendor: 'Penyedia (Lab)',
    allVendors: 'Semua Lab',
    minCtx: 'Min Konteks',
    allCtx: 'Semua Ukuran',
    sortBy: 'Urutkan berdasarkan',
    sortOverall: 'Skor Agregat BenchLM',
    sortValue: 'Value Index (Harga/Kinerja)',
    sortPriceAsc: 'Harga Termurah (Blended)',
    sortPriceDesc: 'Harga Tertinggi',
    sortSpeed: 'Kecepatan Tercepat (tok/s)',
    sortLatency: 'Latensi Terendah (TTFT)',
    sortCtx: 'Jendela Konteks Terbesar',
    sortElo: 'Chatbot Arena Elo',
    tblRank: 'Peringkat',
    tblModel: 'Model & Penyedia',
    tblScore: 'Skor BenchLM',
    tblCaps: 'Rincian Kemampuan',
    tblPrice: 'Biaya / 1M',
    tblSpeed: 'Kecepatan',
    tblCtx: 'Konteks',
    tblCompare: 'Pilih',
    viewDossier: 'Lihat Dossier',
    close: 'Tutup',
    supported: 'Supported',
    estimated: 'Estimated',
    openWeights: 'Open Weights',
    proprietary: 'Proprietary',
    compareSelected: 'Bandingkan',
    clearSelected: 'Bersihkan',
    modelsSelected: (n) => `${n} model dipilih untuk dibandingkan`,
    dossierTitle: 'Dossier Evaluasi Model',
    specs: 'Spesifikasi & Arsitektur',
    benchBreakdown: 'Skor Benchmark Spesifik',
    costCalc: 'Kalkulator Biaya Permintaan',
    promptToks: 'Token Masukan (Prompt)',
    compToks: 'Token Keluaran (Jawaban)',
    reqVol: 'Jumlah Permintaan',
    estCost: 'Perkiraan Biaya',
    strengths: 'Kelebihan Utama',
    weaknesses: 'Kelemahan & Batasan',
    idealFor: 'Rekomendasi Terbaik Untuk',
    compareWith: 'Bandingkan Model Ini',
    emptyMsg: 'Tidak ada model yang cocok dengan kriteria filter.',
  },
  en: {
    eyebrow: 'BENCHLM EVALUATION STANDARD',
    h1: 'AI Model Leaderboard & Verified Benchmarks',
    lead: 'Independent evaluation of frontier and open-weights models across 8 weighted capability categories, API pricing per million tokens, throughput speed, and context window limits.',
    statModels: 'Tracked Models', statCats: 'Weighted Categories', statFrontier: 'Frontier Tier-1', statOpen: 'Open Weights',
    searchPlh: 'Search model name, architecture, or provider…',
    catAll: 'All Categories',
    catFrontier: 'Frontier Only',
    catOpen: 'Open Weights',
    catBudget: 'Budget (<$1/1M)',
    catLongCtx: 'Long Context (≥1M)',
    filterVendor: 'Provider (Lab)',
    allVendors: 'All Labs',
    minCtx: 'Min Context',
    allCtx: 'Any Size',
    sortBy: 'Sort by',
    sortOverall: 'BenchLM Aggregate Score',
    sortValue: 'Value Index (Price/Perf)',
    sortPriceAsc: 'Lowest Price (Blended)',
    sortPriceDesc: 'Highest Price',
    sortSpeed: 'Fastest Speed (tok/s)',
    sortLatency: 'Lowest Latency (TTFT)',
    sortCtx: 'Largest Context Window',
    sortElo: 'Chatbot Arena Elo',
    tblRank: 'Rank',
    tblModel: 'Model & Provider',
    tblScore: 'BenchLM Score',
    tblCaps: 'Capabilities Breakdown',
    tblPrice: 'Price / 1M',
    tblSpeed: 'Speed',
    tblCtx: 'Context',
    tblCompare: 'Pick',
    viewDossier: 'View Dossier',
    close: 'Close',
    supported: 'Supported',
    estimated: 'Estimated',
    openWeights: 'Open Weights',
    proprietary: 'Proprietary',
    compareSelected: 'Compare',
    clearSelected: 'Clear',
    modelsSelected: (n) => `${n} models selected to compare`,
    dossierTitle: 'Model Evaluation Dossier',
    specs: 'Specifications & Architecture',
    benchBreakdown: 'Specific Benchmark Scores',
    costCalc: 'Request Cost Calculator',
    promptToks: 'Input Tokens (Prompt)',
    compToks: 'Output Tokens (Completion)',
    reqVol: 'Number of Requests',
    estCost: 'Estimated Cost',
    strengths: 'Key Strengths',
    weaknesses: 'Limitations & Trade-offs',
    idealFor: 'Best Suited For',
    compareWith: 'Compare This Model',
    emptyMsg: 'No models match the selected filter criteria.',
  },
  es: {
    eyebrow: 'ESTÁNDAR DE EVALUACIÓN BENCHLM',
    h1: 'Clasificación de Modelos de IA y Benchmarks',
    lead: 'Evaluación independiente de modelos frontier y de código abierto en 8 categorías ponderadas, precios de API, velocidad y límites de contexto.',
    statModels: 'Modelos Rastreados', statCats: 'Categorías Ponderadas', statFrontier: 'Frontier Tier-1', statOpen: 'Pesos Abiertos',
    searchPlh: 'Buscar modelo, arquitectura o proveedor…',
    catAll: 'Todas las categorías', catFrontier: 'Solo Frontier', catOpen: 'Pesos Abiertos', catBudget: 'Económicos (<$1/1M)', catLongCtx: 'Contexto Largo (≥1M)',
    filterVendor: 'Proveedor (Laboratorio)', allVendors: 'Todos los Labs', minCtx: 'Contexto Mín', allCtx: 'Cualquier tamaño',
    sortBy: 'Ordenar por', sortOverall: 'Puntuación Agregada BenchLM', sortValue: 'Índice de Valor (Precio/Rendimiento)',
    sortPriceAsc: 'Precio Más Bajo', sortPriceDesc: 'Precio Más Alto', sortSpeed: 'Más Rápido (tok/s)', sortLatency: 'Menor Latencia (TTFT)', sortCtx: 'Mayor Ventana de Contexto', sortElo: 'Chatbot Arena Elo',
    tblRank: 'Puesto', tblModel: 'Modelo y Proveedor', tblScore: 'Puntuación', tblCaps: 'Capacidades', tblPrice: 'Precio / 1M', tblSpeed: 'Velocidad', tblCtx: 'Contexto', tblCompare: 'Elegir',
    viewDossier: 'Ver Informe', close: 'Cerrar', supported: 'Verificado', estimated: 'Estimado', openWeights: 'Open Weights', proprietary: 'Propietario',
    compareSelected: 'Comparar', clearSelected: 'Limpiar', modelsSelected: (n) => `${n} modelos seleccionados`,
    dossierTitle: 'Informe de Evaluación del Modelo', specs: 'Especificaciones y Arquitectura', benchBreakdown: 'Puntuaciones de Referencia Específicas',
    costCalc: 'Calculadora de Costos de Solicitud', promptToks: 'Tokens de Entrada', compToks: 'Tokens de Salida', reqVol: 'Volumen de Peticiones', estCost: 'Costo Estimado',
    strengths: 'Fortalezas Principales', weaknesses: 'Limitaciones y Desventajas', idealFor: 'Recomendado Para', compareWith: 'Comparar este modelo',
    emptyMsg: 'Ningún modelo coincide con los filtros seleccionados.',
  },
  zh: {
    eyebrow: 'BENCHLM 权威评测标准',
    h1: 'AI 模型天梯榜与基准评测',
    lead: '基于 8 项加权能力维度、每百万 Token API 成本、吞吐速率及上下文窗口，对前沿大模型与开源权重模型进行独立评测。',
    statModels: '已收录模型', statCats: '加权能力维度', statFrontier: '前沿旗舰', statOpen: '开源权重',
    searchPlh: '搜索模型名称、架构或研发机构…',
    catAll: '全部分类', catFrontier: '仅前沿旗舰', catOpen: '开源权重', catBudget: '极致性价比 (<$1/1M)', catLongCtx: '超长上下文 (≥1M)',
    filterVendor: '研发机构 (Lab)', allVendors: '所有厂商', minCtx: '最小上下文', allCtx: '不限容量',
    sortBy: '排序依据', sortOverall: 'BenchLM 综合得分', sortValue: '性价比指数 (Value Index)',
    sortPriceAsc: '价格从低到高', sortPriceDesc: '价格从高到低', sortSpeed: '推理速度优先', sortLatency: '最低响应延迟', sortCtx: '最大上下文窗口', sortElo: 'Chatbot Arena Elo',
    tblRank: '排名', tblModel: '模型与厂商', tblScore: '综合评分', tblCaps: '核心能力', tblPrice: '成本 / 1M', tblSpeed: '生成速率', tblCtx: '上下文', tblCompare: '选择',
    viewDossier: '查看档案', close: '关闭', supported: '官方验证', estimated: '基准估算', openWeights: '开源权重', proprietary: '商业闭源',
    compareSelected: '对比所选', clearSelected: '清除', modelsSelected: (n) => `已选择 ${n} 个模型进行横向对比`,
    dossierTitle: '模型深度评测档案', specs: '技术规格与架构细节', benchBreakdown: '单项基准测试得分',
    costCalc: 'API 调用成本计算器', promptToks: '输入 Token (Prompt)', compToks: '输出 Token (Completion)', reqVol: '预计请求量', estCost: '预估费用',
    strengths: '核心优势', weaknesses: '局限与权衡', idealFor: '最佳适用场景', compareWith: '加入对比',
    emptyMsg: '未找到符合筛选条件的模型。',
  },
  ja: {
    eyebrow: 'BENCHLM 独立評価基準',
    h1: 'AIモデルリーダーボード＆検証済みベンチマーク',
    lead: '8つの加重機能カテゴリ、100万トークンあたりのAPI料金、推論スループット、コンテキスト長に基づく独立したAIモデル性能評価。',
    statModels: '収録モデル数', statCats: '評価カテゴリ', statFrontier: '最先端フラッグシップ', statOpen: 'オープンウェイト',
    searchPlh: 'モデル名、アーキテクチャ、提供元を検索…',
    catAll: 'すべてのカテゴリ', catFrontier: '最先端モデルのみ', catOpen: 'オープンウェイト', catBudget: '高コスパ (<$1/1M)', catLongCtx: '超長文コンテキスト (≥1M)',
    filterVendor: '提供元 (ラボ)', allVendors: 'すべてのラボ', minCtx: '最小コンテキスト', allCtx: '指定なし',
    sortBy: '並び順', sortOverall: 'BenchLM総合スコア', sortValue: 'コスパ指数 (Value Index)',
    sortPriceAsc: '料金が安い順', sortPriceDesc: '料金が高い順', sortSpeed: '生成速度が速い順', sortLatency: '初回応答が速い順', sortCtx: 'コンテキスト長順', sortElo: 'Chatbot Arena Elo',
    tblRank: '順位', tblModel: 'モデル＆提供元', tblScore: '総合スコア', tblCaps: '機能詳細', tblPrice: '料金 / 1M', tblSpeed: '生成速度', tblCtx: 'コンテキスト', tblCompare: '選択',
    viewDossier: '詳細データを見る', close: '閉じる', supported: '検証済み', estimated: '推定値', openWeights: 'オープンウェイト', proprietary: '商用プロプライエタリ',
    compareSelected: '比較する', clearSelected: 'クリア', modelsSelected: (n) => `${n} 件のモデルを選択中`,
    dossierTitle: 'モデル評価詳細ファイル', specs: '仕様とアーキテクチャ', benchBreakdown: '個別ベンチマーク詳細',
    costCalc: 'リクエスト料金シミュレータ', promptToks: '入力トークン', compToks: '出力トークン', reqVol: '想定リクエスト数', estCost: '推定総コスト',
    strengths: '主な強み', weaknesses: '制約と注意点', idealFor: 'おすすめの用途', compareWith: 'このモデルを比較',
    emptyMsg: '条件に一致するモデルが見つかりませんでした。',
  },
  fr: {
    eyebrow: 'STANDARD D\'ÉVALUATION BENCHLM',
    h1: 'Classement des Modèles IA & Benchmarks Vérifiés',
    lead: 'Évaluation indépendante des modèles frontier et open-weights sur 8 catégories pondérées, tarifs API, débit et limites de contexte.',
    statModels: 'Modèles suivis', statCats: 'Catégories pondérées', statFrontier: 'Frontier Tier-1', statOpen: 'Poids Ouverts',
    searchPlh: 'Rechercher un modèle, architecture ou fournisseur…',
    catAll: 'Toutes les catégories', catFrontier: 'Frontier uniquement', catOpen: 'Poids Ouverts', catBudget: 'Économique (<$1/1M)', catLongCtx: 'Long Contexte (≥1M)',
    filterVendor: 'Fournisseur (Lab)', allVendors: 'Tous les Labs', minCtx: 'Contexte Min', allCtx: 'Toutes tailles',
    sortBy: 'Trier par', sortOverall: 'Score Agrégé BenchLM', sortValue: 'Indice de Valeur (Prix/Perf)',
    sortPriceAsc: 'Prix le plus bas', sortPriceDesc: 'Prix le plus haut', sortSpeed: 'Plus rapide (tok/s)', sortLatency: 'Plus faible latence (TTFT)', sortCtx: 'Plus grand contexte', sortElo: 'Chatbot Arena Elo',
    tblRank: 'Rang', tblModel: 'Modèle & Lab', tblScore: 'Score', tblCaps: 'Capacités', tblPrice: 'Prix / 1M', tblSpeed: 'Vitesse', tblCtx: 'Contexte', tblCompare: 'Choisir',
    viewDossier: 'Voir Dossier', close: 'Fermer', supported: 'Vérifié', estimated: 'Estimé', openWeights: 'Open Weights', proprietary: 'Propriétaire',
    compareSelected: 'Comparer', clearSelected: 'Effacer', modelsSelected: (n) => `${n} modèles sélectionnés`,
    dossierTitle: 'Dossier d\'Évaluation du Modèle', specs: 'Spécifications & Architecture', benchBreakdown: 'Scores Détaillés des Benchmarks',
    costCalc: 'Calculateur de Coûts API', promptToks: 'Tokens d\'Entrée', compToks: 'Tokens de Sortie', reqVol: 'Nombre de requêtes', estCost: 'Coût Estimé',
    strengths: 'Forces Majeures', weaknesses: 'Limites & Compromis', idealFor: 'Recommandé Pour', compareWith: 'Comparer ce modèle',
    emptyMsg: 'Aucun modèle ne correspond aux critères de filtre.',
  },
  de: {
    eyebrow: 'BENCHLM BEWERTUNGSSTANDARD',
    h1: 'KI-Modell-Rangliste & Verifizierte Benchmarks',
    lead: 'Unabhängige Bewertung von Frontier- und Open-Weights-Modellen über 8 gewichtete Fähigkeiten, API-Preise, Durchsatz und Kontextlimits.',
    statModels: 'Modelle', statCats: 'Kategorien', statFrontier: 'Frontier Tier-1', statOpen: 'Open Weights',
    searchPlh: 'Modellname, Architektur oder Anbieter suchen…',
    catAll: 'Alle Kategorien', catFrontier: 'Nur Frontier', catOpen: 'Open Weights', catBudget: 'Budget (<$1/1M)', catLongCtx: 'Langer Kontext (≥1M)',
    filterVendor: 'Anbieter (Lab)', allVendors: 'Alle Labs', minCtx: 'Min. Kontext', allCtx: 'Alle Größen',
    sortBy: 'Sortieren nach', sortOverall: 'BenchLM-Gesamtpunktzahl', sortValue: 'Value Index (Preis/Leistung)',
    sortPriceAsc: 'Niedrigster Preis', sortPriceDesc: 'Höchster Preis', sortSpeed: 'Schnellste Geschwindigkeit', sortLatency: 'Geringste Latenz', sortCtx: 'Größter Kontext', sortElo: 'Chatbot Arena Elo',
    tblRank: 'Rang', tblModel: 'Modell & Anbieter', tblScore: 'Punktzahl', tblCaps: 'Fähigkeiten', tblPrice: 'Preis / 1M', tblSpeed: 'Speed', tblCtx: 'Kontext', tblCompare: 'Wählen',
    viewDossier: 'Dossier anzeigen', close: 'Schließen', supported: 'Verifiziert', estimated: 'Geschätzt', openWeights: 'Open Weights', proprietary: 'Proprietär',
    compareSelected: 'Vergleichen', clearSelected: 'Löschen', modelsSelected: (n) => `${n} Modelle ausgewählt`,
    dossierTitle: 'Modell-Evaluierungsdossier', specs: 'Spezifikationen & Architektur', benchBreakdown: 'Spezifische Benchmark-Ergebnisse',
    costCalc: 'API-Kostenrechner', promptToks: 'Eingabe-Tokens', compToks: 'Ausgabe-Tokens', reqVol: 'Anzahl der Anfragen', estCost: 'Geschätzte Kosten',
    strengths: 'Hauptstärken', weaknesses: 'Einschränkungen', idealFor: 'Bestens geeignet für', compareWith: 'Dieses Modell vergleichen',
    emptyMsg: 'Keine Modelle entsprechen den Filterkriterien.',
  },
  ar: {
    eyebrow: 'معيار تقييم BENCHLM',
    h1: 'لوحة صدارة نماذج الذكاء الاصطناعي والمعايير الموثقة',
    lead: 'تقييم مستقل لنماذج الذكاء الاصطناعي الرائدة ومفتوحة الأوزان عبر 8 فئات قدرات مرجحة، وأسعار واجهة برمجة التطبيقات، وسرعة المعالجة، وحدود السياق.',
    statModels: 'النماذج المسجلة', statCats: 'فئات مرجحة', statFrontier: 'النماذج الرائدة', statOpen: 'أوزان مفتوحة',
    searchPlh: 'ابحث عن اسم النموذج أو البنية أو المزود…',
    catAll: 'جميع الفئات', catFrontier: 'النماذج الرائدة فقط', catOpen: 'أوزان مفتوحة', catBudget: 'اقتصادي (<$1/1M)', catLongCtx: 'سياق طويل (≥1M)',
    filterVendor: 'المزود (المختبر)', allVendors: 'جميع المختبرات', minCtx: 'أدنى سياق', allCtx: 'أي حجم',
    sortBy: 'ترتيب حسب', sortOverall: 'التقييم الإجمالي لـ BenchLM', sortValue: 'مؤشر القيمة (السعر/الأداء)',
    sortPriceAsc: 'الأقل سعراً', sortPriceDesc: 'الأعلى سعراً', sortSpeed: 'الأسرع (رمز/ثانية)', sortLatency: 'الأقل تأخيراً', sortCtx: 'أكبر نافذة سياق', sortElo: 'تصنيف Chatbot Arena',
    tblRank: 'المرتبة', tblModel: 'النموذج والمزود', tblScore: 'التقييم', tblCaps: 'تفاصيل القدرات', tblPrice: 'التكلفة / 1M', tblSpeed: 'السرعة', tblCtx: 'السياق', tblCompare: 'اختيار',
    viewDossier: 'عرض الملف الكامل', close: 'إغلاق', supported: 'موثق', estimated: 'تقديري', openWeights: 'أوزان مفتوحة', proprietary: 'تجاري مغلق',
    compareSelected: 'مقارنة المختار', clearSelected: 'مسح', modelsSelected: (n) => `تم تحديد ${n} نماذج للمقارنة`,
    dossierTitle: 'ملف تقييم النموذج', specs: 'المواصفات والبنية التقنية', benchBreakdown: 'نتائج الاختبارات المعيارية',
    costCalc: 'حاسبة تكاليف الطلبات', promptToks: 'رموز الإدخال (Prompt)', compToks: 'رموز الإخراج (Completion)', reqVol: 'عدد الطلبات', estCost: 'التكلفة التقديرية',
    strengths: 'أبرز نقاط القوة', weaknesses: 'القيود والسلبيات', idealFor: 'مثالي للاستخدام في', compareWith: 'مقارنة هذا النموذج',
    emptyMsg: 'لا توجد نماذج تطابق شروط التصفية المحددة.',
  },
  pt: {
    eyebrow: 'PADRÃO DE AVALIAÇÃO BENCHLM',
    h1: 'Classificação de Modelos de IA e Benchmarks',
    lead: 'Avaliação independente de modelos de fronteira e de código aberto em 8 categorias ponderadas, preços de API, velocidade e limites de contexto.',
    statModels: 'Modelos', statCats: 'Categorias', statFrontier: 'Frontier Tier-1', statOpen: 'Pesos Abertos',
    searchPlh: 'Pesquisar modelo, arquitetura ou provedor…',
    catAll: 'Todas as categorias', catFrontier: 'Apenas Frontier', catOpen: 'Pesos Abertos', catBudget: 'Econômicos (<$1/1M)', catLongCtx: 'Contexto Longo (≥1M)',
    filterVendor: 'Provedor (Lab)', allVendors: 'Todos os Labs', minCtx: 'Contexto Mín', allCtx: 'Qualquer tamanho',
    sortBy: 'Ordenar por', sortOverall: 'Pontuação BenchLM', sortValue: 'Índice de Valor (Preço/Desempenho)',
    sortPriceAsc: 'Menor Preço', sortPriceDesc: 'Maior Preço', sortSpeed: 'Mais Rápido (tok/s)', sortLatency: 'Menor Latência', sortCtx: 'Maior Contexto', sortElo: 'Chatbot Arena Elo',
    tblRank: 'Posição', tblModel: 'Modelo & Provedor', tblScore: 'Pontuação', tblCaps: 'Capacidades', tblPrice: 'Preço / 1M', tblSpeed: 'Velocidade', tblCtx: 'Contexto', tblCompare: 'Escolher',
    viewDossier: 'Ver Dossiê', close: 'Fechar', supported: 'Verificado', estimated: 'Estimado', openWeights: 'Open Weights', proprietary: 'Proprietário',
    compareSelected: 'Comparar', clearSelected: 'Limpar', modelsSelected: (n) => `${n} modelos selecionados`,
    dossierTitle: 'Dossiê de Avaliação do Modelo', specs: 'Especificações & Arquitetura', benchBreakdown: 'Pontuações de Benchmarks Específicos',
    costCalc: 'Calculadora de Custos de Requisições', promptToks: 'Tokens de Entrada', compToks: 'Tokens de Saída', reqVol: 'Volume de Requisições', estCost: 'Custo Estimado',
    strengths: 'Principais Forças', weaknesses: 'Limitações & Desvantagens', idealFor: 'Recomendado Para', compareWith: 'Comparar este modelo',
    emptyMsg: 'Nenhum modelo corresponde aos critérios de filtro.',
  },
  ru: {
    eyebrow: 'СТАНДАРТ ОЦЕНКИ BENCHLM',
    h1: 'Рейтинг Моделей ИИ и Верифицированные Бенчмарки',
    lead: 'Независимая оценка флагманских и открытых моделей по 8 весовым категориям возможностей, ценам API, скорости генерации и лимитам контекста.',
    statModels: 'Моделей в базе', statCats: 'Категорий оценки', statFrontier: 'Флагманы Tier-1', statOpen: 'Открытые веса',
    searchPlh: 'Поиск по названию модели, архитектуре или разработчику…',
    catAll: 'Все категории', catFrontier: 'Только флагманы', catOpen: 'Открытые веса', catBudget: 'Бюджетные (<$1/1M)', catLongCtx: 'Длинный контекст (≥1M)',
    filterVendor: 'Разработчик (Lab)', allVendors: 'Все лаборатории', minCtx: 'Мин. контекст', allCtx: 'Любой объем',
    sortBy: 'Сортировать по', sortOverall: 'Общему баллу BenchLM', sortValue: 'Индексу цены/качества',
    sortPriceAsc: 'Сначала дешевые', sortPriceDesc: 'Сначала дорогие', sortSpeed: 'Самые быстрые (ток/с)', sortLatency: 'Минимальной задержке (TTFT)', sortCtx: 'Максимальному контексту', sortElo: 'Chatbot Arena Elo',
    tblRank: 'Место', tblModel: 'Модель и разработчик', tblScore: 'Балл', tblCaps: 'Возможности', tblPrice: 'Цена / 1M', tblSpeed: 'Скорость', tblCtx: 'Контекст', tblCompare: 'Выбрать',
    viewDossier: 'Открыть досье', close: 'Закрыть', supported: 'Проверено', estimated: 'Оценка', openWeights: 'Open Weights', proprietary: 'Проприетарная',
    compareSelected: 'Сравнить', clearSelected: 'Очистить', modelsSelected: (n) => `Выбрано моделей: ${n}`,
    dossierTitle: 'Досье Оценки Модели', specs: 'Спецификации и Архитектура', benchBreakdown: 'Результаты по отдельным тестам',
    costCalc: 'Калькулятор стоимости запросов', promptToks: 'Входные токены', compToks: 'Выходные токены', reqVol: 'Количество запросов', estCost: 'Оценочная стоимость',
    strengths: 'Ключевые преимущества', weaknesses: 'Ограничения и недостатки', idealFor: 'Лучше всего подходит для', compareWith: 'Сравнить эту модель',
    emptyMsg: 'Нет моделей, соответствующих выбранным фильтрам.',
  },
  ko: {
    eyebrow: 'BENCHLM 독립 평가 표준',
    h1: 'AI 모델 리더보드 & 검증된 벤치마크',
    lead: '8개 가중 역량 범주, 100만 토큰당 API 가격, 추론 속도 및 컨텍스트 한도를 기반으로 한 프론티어 및 오픈 소스 AI 모델 독립 평가.',
    statModels: '수록 모델 수', statCats: '평가 카테고리', statFrontier: '최상위 프론티어', statOpen: '오픈 가중치',
    searchPlh: '모델명, 아키텍처, 제공사 검색…',
    catAll: '전체 카테고리', catFrontier: '프론티어 모델만', catOpen: '오픈 가중치', catBudget: '가성비 최적 (<$1/1M)', catLongCtx: '초장문 컨텍스트 (≥1M)',
    filterVendor: '제공사 (Lab)', allVendors: '모든 연구소', minCtx: '최소 컨텍스트', allCtx: '제한 없음',
    sortBy: '정렬 기준', sortOverall: 'BenchLM 종합 점수', sortValue: '가성비 지수 (Value Index)',
    sortPriceAsc: '낮은 가격순', sortPriceDesc: '높은 가격순', sortSpeed: '빠른 속도순', sortLatency: '최저 지연 시간순', sortCtx: '최대 컨텍스트순', sortElo: 'Chatbot Arena Elo',
    tblRank: '순위', tblModel: '모델 및 제공사', tblScore: '종합 점수', tblCaps: '세부 역량', tblPrice: '가격 / 1M', tblSpeed: '속도', tblCtx: '컨텍스트', tblCompare: '선택',
    viewDossier: '상세 프로필 보기', close: '닫기', supported: '검증됨', estimated: '추정치', openWeights: '오픈 소스', proprietary: '상용 폐쇄형',
    compareSelected: '선택 모델 비교', clearSelected: '초기화', modelsSelected: (n) => `${n}개 모델 선택됨`,
    dossierTitle: '모델 종합 평가 파일', specs: '기술 사양 및 아키텍처', benchBreakdown: '세부 벤치마크 점수',
    costCalc: 'API 요청 비용 계산기', promptToks: '입력 토큰', compToks: '출력 토큰', reqVol: '예상 요청 횟수', estCost: '예상 총비용',
    strengths: '주요 강점', weaknesses: '한계점 및 고려사항', idealFor: '가장 적합한 용도', compareWith: '이 모델 비교하기',
    emptyMsg: '필터 조건과 일치하는 모델이 없습니다.',
  },
};

export function render(root, ctx) {
  const lang = ctx.lang;
  const s = S[lang] || S.en || S.id;

  // State lokal
  const state = {
    categoryTab: 'all', // 'all', 'frontier', 'open', 'budget', 'longctx', or category id like 'coding', 'reasoning', etc.
    vendor: 'all',
    minCtx: 0,
    search: '',
    sortBy: 'overall',
    pinned: new Set(),
    dossierModel: null,
  };

  // Baca params URL jika ada
  if (ctx.params.get('cat')) state.categoryTab = ctx.params.get('cat');
  if (ctx.params.get('model')) {
    const target = LEADERBOARD_MODELS.find((m) => m.id === ctx.params.get('model'));
    if (target) state.dossierModel = target;
  }

  // Container Elemen
  const heroEl = el('div.hero', {}, [
    el('div.eyebrow', { text: s.eyebrow }),
    el('h1', { text: s.h1 }),
    el('p', { text: s.lead }),
    el('div.hero-metrics', {}, [
      el('span.badge.badge-accent', { text: `✦ ${LEADERBOARD_MODELS.length} ${s.statModels}` }),
      el('span.badge.badge-ok', { text: `⚡ 8 ${s.statCats}` }),
      el('span.badge', { text: `🏆 ${LEADERBOARD_MODELS.filter((m) => m.blend >= 2.0 && m.overall >= 90).length} ${s.statFrontier}` }),
      el('span.badge', { text: `🔓 ${LEADERBOARD_MODELS.filter((m) => m.license === 'Open Weights').length} ${s.statOpen}` }),
    ]),
  ]);

  // Filter Bar
  const searchInput = el('input', {
    type: 'search',
    'aria-label': s.searchPlh,
    placeholder: s.searchPlh,
    value: state.search,
    oninput: (e) => {
      state.search = e.target.value.trim().toLowerCase();
      updateTable();
    },
  });

  const vendors = ['all', ...new Set(LEADERBOARD_MODELS.map((m) => m.vendor))];
  const vendorSelect = el('select', {
    'aria-label': s.allVendors,
    onchange: (e) => {
      state.vendor = e.target.value;
      updateTable();
    },
  }, vendors.map((v) => el('option', { value: v, selected: state.vendor === v }, [v === 'all' ? s.allVendors : v])));

  const sortSelect = el('select', {
    'aria-label': s.sortOverall,
    onchange: (e) => {
      state.sortBy = e.target.value;
      updateTable();
    },
  }, [
    el('option', { value: 'overall', selected: state.sortBy === 'overall' }, [s.sortOverall]),
    el('option', { value: 'value', selected: state.sortBy === 'value' }, [s.sortValue]),
    el('option', { value: 'price_asc', selected: state.sortBy === 'price_asc' }, [s.sortPriceAsc]),
    el('option', { value: 'price_desc', selected: state.sortBy === 'price_desc' }, [s.sortPriceDesc]),
    el('option', { value: 'speed', selected: state.sortBy === 'speed' }, [s.sortSpeed]),
    el('option', { value: 'latency', selected: state.sortBy === 'latency' }, [s.sortLatency]),
    el('option', { value: 'ctx', selected: state.sortBy === 'ctx' }, [s.sortCtx]),
    el('option', { value: 'elo', selected: state.sortBy === 'elo' }, [s.sortElo]),
  ]);

  // Category & Use-Case Tab Bar (Design for Online style re-ranking)
  const catTabsData = [
    { id: 'all', label: s.catAll, icon: '⚡' },
    { id: 'agents', label: 'AI Agents', icon: '🤖' },
    { id: 'coding', label: 'Coding & Dev', icon: '💻' },
    { id: 'content_seo', label: 'Content & SEO', icon: '✍️' },
    { id: 'stem_reasoning', label: 'STEM & Reasoning', icon: '🧠' },
    { id: 'vision', label: 'Vision & Doc AI', icon: '👁️' },
    { id: 'open', label: s.catOpen, icon: '🔓' },
    { id: 'budget', label: s.catBudget, icon: '🏷️' },
    { id: 'longctx', label: s.catLongCtx, icon: '📜' },
  ];

  const catChipsWrap = el('div.chips', { role: 'tablist', 'aria-label': 'Pilihan Kategori' });
  catTabsData.forEach((ct) => {
    const btn = el('button.chip', {
      type: 'button',
      role: 'tab',
      'aria-pressed': state.categoryTab === ct.id ? 'true' : 'false',
      onclick: () => {
        state.categoryTab = ct.id;
        [...catChipsWrap.children].forEach((c) => c.setAttribute('aria-pressed', 'false'));
        btn.setAttribute('aria-pressed', 'true');
        updateTable();
      },
    }, [`${ct.icon} ${ct.label}`]);
    catChipsWrap.appendChild(btn);
  });

  // Table Container
  const tableWrap = el('div.tbl-wrap');
  const tableEl = el('table.tbl.leaderboard-tbl');
  tableWrap.appendChild(tableEl);

  // Floating Compare Bar
  const floatingBar = el('div.floating-compare-bar', { style: { display: 'none' } });

  // Dialog Modal untuk Model Dossier
  const dossierDialog = el('dialog.palette.dossier-dialog', { id: 'dossierModal' });
  dossierDialog.addEventListener('click', (e) => {
    if (e.target === dossierDialog) dossierDialog.close();
  });

  // Filter & Sort Logic
  function getFilteredModels() {
    const isUseCase = state.categoryTab in USE_CASE_PROFILES;
    const weights = isUseCase ? USE_CASE_PROFILES[state.categoryTab].weights : null;

    return LEADERBOARD_MODELS.map((m) => {
      const taskScore = weights ? calcOverall(m.scores, weights) : m.overall;
      return { ...m, taskScore };
    }).filter((m) => {
      // Search
      if (state.search) {
        const text = `${m.name} ${m.vendor} ${m.architecture} ${m.license}`.toLowerCase();
        if (!text.includes(state.search)) return false;
      }
      // Vendor
      if (state.vendor !== 'all' && m.vendor !== state.vendor) return false;
      // Category Tab
      if (state.categoryTab === 'open' && m.license !== 'Open Weights') return false;
      if (state.categoryTab === 'budget' && m.blend >= 1.0) return false;
      if (state.categoryTab === 'longctx' && m.ctx < 1000000) return false;
      return true;
    }).sort((a, b) => {
      if (state.sortBy === 'overall') {
        return b.taskScore - a.taskScore;
      }
      if (state.sortBy === 'value') return b.valueIndex - a.valueIndex;
      if (state.sortBy === 'price_asc') return a.blend - b.blend;
      if (state.sortBy === 'price_desc') return b.blend - a.blend;
      if (state.sortBy === 'speed') return b.speed - a.speed;
      if (state.sortBy === 'latency') return a.ttft - b.ttft;
      if (state.sortBy === 'ctx') return b.ctx - a.ctx;
      if (state.sortBy === 'elo') return b.elo - a.elo;
      return b.taskScore - a.taskScore;
    });
  }

  // Render Table
  function updateTable() {
    const list = getFilteredModels();
    tableEl.textContent = '';

    // Thead
    const thead = el('thead', {}, [
      el('tr', {}, [
        el('th', { style: { width: '44px', textAlign: 'center' } }, [s.tblRank]),
        el('th', {}, [s.tblModel]),
        el('th', { style: { width: '130px' } }, [s.tblScore]),
        el('th', { style: { width: '180px' } }, [s.tblCaps]),
        el('th', { style: { width: '110px' } }, [s.tblPrice]),
        el('th', { style: { width: '110px' } }, [s.tblSpeed]),
        el('th', { style: { width: '90px' } }, [s.tblCtx]),
        el('th', { style: { width: '60px', textAlign: 'center' } }, [s.tblCompare]),
      ]),
    ]);
    tableEl.appendChild(thead);

    const tbody = el('tbody');
    if (list.length === 0) {
      tbody.appendChild(el('tr', {}, [
        el('td', { colspan: '8', style: { textAlign: 'center', padding: '36px', color: 'var(--text-mute)' } }, [s.emptyMsg]),
      ]));
    } else {
      list.forEach((m, idx) => {
        const isPinned = state.pinned.has(m.id);
        const tr = el('tr', {
          class: isPinned ? 'row-pinned' : '',
          onclick: (e) => {
            if (e.target.closest('input[type="checkbox"]') || e.target.closest('button')) return;
            openDossier(m);
          },
          style: { cursor: 'pointer' },
        });

        // Rank (#1 - #3 gold/silver/bronze badge)
        let rankBadge = el('span.rank-num', { text: `#${idx + 1}` });
        if (idx === 0) rankBadge = el('span.badge.badge-warn', { text: '🥇 #1' });
        else if (idx === 1) rankBadge = el('span.badge', { text: '🥈 #2' });
        else if (idx === 2) rankBadge = el('span.badge', { text: '🥉 #3' });

        // Model name + badges
        const modelCell = el('td', {}, [
          el('div.model-name-cell', {}, [
            el('strong.model-title', { text: m.name }),
            el('div.row', { style: { gap: '5px', marginTop: '3px' } }, [
              el('span.vendor-tag', { text: m.vendor }),
              m.license === 'Open Weights'
                ? el('span.badge.badge-ok.badge-xs', { text: 'Open' })
                : el('span.badge.badge-xs', { text: 'API' }),
              m.status === 'Supported'
                ? el('span.badge.badge-accent.badge-xs', { text: '✓ Verified' })
                : el('span.badge.badge-warn.badge-xs', { text: '⚡ Est' }),
            ]),
          ]),
        ]);

        // Score + mini meter
        const activeScore = m.taskScore != null ? m.taskScore : m.overall;
        const scoreCell = el('td', {}, [
          el('div.score-cell-box', {}, [
            el('div.score-val-row', {}, [
              el('strong.score-highlight', { text: String(activeScore) }),
              el('small.score-max', { text: '/100' }),
            ]),
            meter(activeScore),
          ]),
        ]);

        // Capabilities pill bars
        const capsCell = el('td', {}, [
          el('div.caps-micro-grid', {}, [
            el('span.cap-micro-item', { title: `Agentic: ${m.scores.agentic}` }, [`🤖 ${m.scores.agentic}`]),
            el('span.cap-micro-item', { title: `Coding: ${m.scores.coding}` }, [`💻 ${m.scores.coding}`]),
            el('span.cap-micro-item', { title: `Reasoning: ${m.scores.reasoning}` }, [`🧠 ${m.scores.reasoning}`]),
            el('span.cap-micro-item', { title: `Vision: ${m.scores.multimodal}` }, [`👁️ ${m.scores.multimodal}`]),
          ]),
        ]);

        // Price cell ($in / $out)
        const priceCell = el('td', {}, [
          el('div.price-cell-box', {}, [
            el('strong.price-blended', { text: `$${m.blend.toFixed(2)}` }),
            el('span.price-sub', { text: `in: $${m.in} / out: $${m.out}` }),
          ]),
        ]);

        // Speed cell (tok/s + ttft)
        const speedCell = el('td', {}, [
          el('div.speed-cell-box', {}, [
            el('strong.speed-val', { text: `${m.speed} tok/s` }),
            el('span.speed-ttft', { text: `TTFT: ${m.ttft}ms` }),
          ]),
        ]);

        // Context cell
        const ctxCell = el('td', {}, [
          el('span.ctx-badge', { text: compact(m.ctx) }),
        ]);

        // Compare Checkbox
        const chk = el('input', {
          type: 'checkbox',
          checked: isPinned,
          'aria-label': `Bandingkan ${m.name}`,
          onchange: (e) => {
            if (e.target.checked) {
              if (state.pinned.size >= 4) {
                e.target.checked = false;
                toast(lang === 'id' ? 'Maksimal 4 model dapat dibandingkan sekaligus' : 'Maximum 4 models can be compared at once');
                return;
              }
              state.pinned.add(m.id);
            } else {
              state.pinned.delete(m.id);
            }
            updateFloatingBar();
            updateTable();
          },
        });
        const chkCell = el('td', { style: { textAlign: 'center' } }, [chk]);

        tr.append(
          el('td', { style: { textAlign: 'center' } }, [rankBadge]),
          modelCell,
          scoreCell,
          capsCell,
          priceCell,
          speedCell,
          ctxCell,
          chkCell,
        );
        tbody.appendChild(tr);
      });
    }
    tableEl.appendChild(tbody);
  }

  // Update Floating Compare Bar
  function updateFloatingBar() {
    if (state.pinned.size === 0) {
      floatingBar.style.display = 'none';
      return;
    }
    floatingBar.style.display = 'flex';
    floatingBar.textContent = '';

    const count = state.pinned.size;
    const pinnedModels = [...state.pinned].map((id) => LEADERBOARD_MODELS.find((m) => m.id === id)).filter(Boolean);

    const info = el('div.floating-info', {}, [
      el('strong', { text: s.modelsSelected(count) }),
      el('div.floating-names', {}, pinnedModels.map((pm) => el('span.badge.badge-accent', { text: pm.name }))),
    ]);

    const actions = el('div.floating-actions', {}, [
      el('button.btn.btn-ghost.btn-sm', {
        type: 'button',
        onclick: () => {
          state.pinned.clear();
          updateFloatingBar();
          updateTable();
        },
      }, [s.clearSelected]),
      el('button.btn.btn-primary', {
        type: 'button',
        onclick: () => {
          const ids = [...state.pinned].join(',');
          ctx.go(`#/compare?models=${encodeURIComponent(ids)}`);
        },
      }, [
        el('span', { html: '⚡ ' }),
        s.compareSelected,
      ]),
    ]);

    floatingBar.append(info, actions);
  }

  // Open Model Dossier Dialog
  function openDossier(m) {
    state.dossierModel = m;
    dossierDialog.textContent = '';

    // Head
    const head = el('div.palette-head', { style: { justifyContent: 'space-between' } }, [
      el('div', {}, [
        el('span.eyebrow', { text: s.dossierTitle, style: { margin: 0 } }),
        el('h2', { text: `${m.name} (${m.vendor})`, style: { fontSize: '1.3rem', marginTop: '4px' } }),
      ]),
      el('button.btn.btn-icon.btn-ghost', {
        type: 'button',
        'aria-label': s.close,
        onclick: () => dossierDialog.close(),
      }, [el('span', { html: '✕' })]),
    ]);

    // Body
    const body = el('div.dossier-body', { style: { padding: '18px 20px', maxHeight: '72vh', overflowY: 'auto' } });

    // Radar Chart & Quick Stats Grid
    const radarChartSvg = createRadarChart([m], CATEGORIES, lang);
    const radarCard = el('div.card', {}, [
      el('div.card-head', {}, [el('h3', {}, ['🕸️ ' + (lang === 'id' ? 'Grafik Radar Kemampuan 8 Dimensi' : '8-Dimension Capability Radar')])]),
      el('div.radar-wrap', { style: { display: 'flex', justifyContent: 'center' } }, [radarChartSvg]),
    ]);

    // Specs Grid
    const specsCard = el('div.card', {}, [
      el('div.card-head', {}, [el('h3', {}, ['⚙️ ' + s.specs])]),
      el('div.grid.g-2', { style: { gap: '10px' } }, [
        stat(lang === 'id' ? 'Skor BenchLM' : 'BenchLM Score', `${m.overall}`, '/100'),
        stat('Value Index', `${m.valueIndex}`, 'pts/$'),
        stat(lang === 'id' ? 'Harga Blended' : 'Blended Cost', `$${m.blend}`, '/1M tokens'),
        stat(lang === 'id' ? 'Jendela Konteks' : 'Context Window', compact(m.ctx), 'tokens'),
        stat(lang === 'id' ? 'Batas Output' : 'Max Output', compact(m.maxOut), 'tokens'),
        stat(lang === 'id' ? 'Kecepatan' : 'Throughput', `${m.speed} tok/s`, `@ ${m.ttft}ms TTFT`),
        stat('Chatbot Arena Elo', `${m.elo}`, 'rating'),
        stat(lang === 'id' ? 'Arsitektur' : 'Architecture', m.architecture, m.license),
      ]),
    ]);

    // Benchmark Scores Breakdown
    const benchGrid = el('div.grid.g-3', { style: { gap: '10px', marginTop: '10px' } });
    BENCHMARKS.forEach((b) => {
      const val = m.benchmarks[b.id];
      if (val != null) {
        benchGrid.appendChild(stat(b.name, `${val}%`, b.difficulty));
      }
    });
    const benchCard = el('div.card', {}, [
      el('div.card-head', {}, [el('h3', {}, ['📊 ' + s.benchBreakdown])]),
      benchGrid,
    ]);

    // Pros, Cons & Best For
    const prosList = el('ul.check', {}, (m.pros[lang] || m.pros.id).map((p) => el('li.on', { text: p })));
    const consList = el('ul', { style: { paddingLeft: '1.2em', color: 'var(--text-mute)' } }, (m.cons[lang] || m.cons.id).map((c) => el('li', { text: c })));

    const analysisCard = el('div.card', {}, [
      el('div.grid.g-2', {}, [
        el('div', {}, [
          el('h4', { text: `✓ ${s.strengths}`, style: { color: 'var(--ok)', marginBottom: '8px' } }),
          prosList,
        ]),
        el('div', {}, [
          el('h4', { text: `⚠ ${s.weaknesses}`, style: { color: 'var(--warn)', marginBottom: '8px' } }),
          consList,
        ]),
      ]),
      el('div.hr'),
      el('div.note', {}, [
        el('span', { html: '💡 ' }),
        el('span', {}, [
          el('strong', { text: `${s.idealFor}: ` }),
          m.bestFor[lang] || m.bestFor.id,
        ]),
      ]),
    ]);

    // Interactive Cost Calculator
    let inTok = 1000;
    let outTok = 500;
    let reqCount = 10000;
    const costOutput = el('strong', { style: { fontSize: '1.3rem', color: 'var(--accent-2)' } });

    function recalcCost() {
      const totalIn = (inTok * reqCount) / 1e6;
      const totalOut = (outTok * reqCount) / 1e6;
      const costVal = totalIn * m.in + totalOut * m.out;
      costOutput.textContent = usd(costVal);
    }
    recalcCost();

    const calcCard = el('div.card', {}, [
      el('div.card-head', {}, [el('h3', {}, ['💰 ' + s.costCalc])]),
      el('div.grid.g-3', {}, [
        slider({
          label: s.promptToks,
          min: 100, max: 10000, step: 100, value: inTok,
          fmt: (v) => `${nf(v)} tok`,
          onInput: (v) => { inTok = v; recalcCost(); },
        }),
        slider({
          label: s.compToks,
          min: 50, max: 4000, step: 50, value: outTok,
          fmt: (v) => `${nf(v)} tok`,
          onInput: (v) => { outTok = v; recalcCost(); },
        }),
        slider({
          label: s.reqVol,
          min: 1000, max: 500000, step: 1000, value: reqCount,
          fmt: (v) => `${compact(v)} req`,
          onInput: (v) => { reqCount = v; recalcCost(); },
        }),
      ]),
      el('div.row-between', { style: { marginTop: '14px', padding: '12px 14px', background: 'var(--surface-2)', borderRadius: 'var(--r-sm)' } }, [
        el('span', { text: s.estCost, style: { fontWeight: '600' } }),
        costOutput,
      ]),
    ]);

    // Footer actions
    const partner = getPartnerLink(m);
    const hfLink = m.hfRepo ? el('a.btn.btn-sm.btn-ghost', {
      href: `https://huggingface.co/${m.hfRepo}`,
      target: '_blank',
      rel: 'noopener noreferrer',
      style: { color: 'var(--text-dim)' },
    }, ['🤗 Hugging Face']) : null;

    const foot = el('div.palette-foot', { style: { padding: '14px 20px', borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' } }, [
      el('div.row', { style: { gap: '8px' } }, [
        el('a.btn.btn-sm.btn-ghost', {
          href: partner.url,
          target: '_blank',
          rel: 'noopener noreferrer',
          style: { color: 'var(--accent-2)', borderColor: 'var(--accent-2)' },
        }, ['🚀 ' + partner.name]),
        hfLink,
      ]),
      el('div.row', { style: { gap: '8px' } }, [
        el('button.btn.btn-ghost', { type: 'button', onclick: () => dossierDialog.close() }, [s.close]),
        el('button.btn.btn-primary', {
          type: 'button',
          onclick: () => {
            dossierDialog.close();
            ctx.go(`#/compare?models=${m.id}`);
          },
        }, ['⚡ ' + s.compareWith]),
      ]),
    ]);

    body.append(
      el('div.grid.g-2', {}, [radarCard, specsCard]),
      el('div', { style: { marginTop: '14px' } }, [benchCard]),
      el('div', { style: { marginTop: '14px' } }, [analysisCard]),
      el('div', { style: { marginTop: '14px' } }, [calcCard]),
    );

    dossierDialog.append(head, body, foot);
    if (!dossierDialog.open) dossierDialog.showModal();
  }

  // Export Buttons
  const exportBtnCSV = el('button.btn.btn-sm.btn-ghost', {
    type: 'button',
    onclick: () => exportLeaderboardCSV(getFilteredModels()),
  }, [
    el('span', { html: '📥 ' }),
    lang === 'id' ? 'Ekspor CSV' : 'Export CSV',
  ]);

  const exportBtnJSON = el('button.btn.btn-sm.btn-ghost', {
    type: 'button',
    onclick: () => exportLeaderboardJSON(getFilteredModels()),
  }, [
    el('span', { html: '{ } ' }),
    lang === 'id' ? 'Ekspor JSON' : 'Export JSON',
  ]);

  // Filter Bar Container
  const filterCard = el('div.card.card-tight', { style: { marginBottom: '16px' } }, [
    el('div.row-between', { style: { gap: '12px' } }, [
      el('div', { style: { flex: '1 1 300px' } }, [searchInput]),
      el('div.row', { style: { gap: '8px' } }, [
        vendorSelect,
        sortSelect,
        exportBtnCSV,
        exportBtnJSON,
      ]),
    ]),
    el('div.hr', { style: { margin: '12px 0' } }),
    catChipsWrap,
  ]);

  // B2B Enterprise Advisory Callout Banner — hanya tampil kalau kanal kontak nyata sudah diisi (js/config.js)
  const advisoryBanner = !LEADGEN.advisory ? null : el('div.card.card-tight', {
    style: {
      marginTop: '24px',
      background: 'linear-gradient(135deg, var(--surface-2), var(--accent-soft))',
      border: '1px solid var(--line-strong)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      flexWrap: 'wrap',
    },
  }, [
    el('div', { style: { flex: '1 1 400px' } }, [
      el('strong', {
        text: lang === 'id' ? '🏢 Butuh Evaluasi LLM Khusus atau Panduan Deployment Enterprise?' : '🏢 Need Custom LLM Benchmarking or Enterprise Deployment Guidance?',
        style: { fontSize: '1rem', display: 'block', marginBottom: '4px' },
      }),
      el('p', {
        text: lang === 'id'
          ? 'Konsultasi arsitektur inferensi, seleksi model privat, audit biaya token, dan fine-tuning domain spesifik bersama tim ahli kami.'
          : 'Inference architecture review, private model selection, token budget auditing, and custom domain fine-tuning with our AI advisory team.',
        style: { fontSize: '0.84rem', color: 'var(--text-dim)' },
      }),
    ]),
    el('button.btn.btn-primary', {
      type: 'button',
      onclick: openAdvisoryModal,
    }, [
      lang === 'id' ? 'Hubungi Tim Advisory' : 'Contact Advisory Team',
    ]),
  ]);

  // Initial table render
  updateTable();

  // Susun elemen ke dalam root
  root.append(
    heroEl,
    filterCard,
    tableWrap,
    advisoryBanner,
    floatingBar,
    dossierDialog,
  );

  // Jika ada permintaan buka modal dari params
  if (state.dossierModel) {
    setTimeout(() => openDossier(state.dossierModel), 100);
  }

  return () => {
    if (dossierDialog.open) dossierDialog.close();
  };
}
