/* ============================================================
   views/tokenizer.js — Tokenizer & kalkulator biaya
   ============================================================ */

import { el, card, stat, copyBtn, debounce, nf, usd, compact } from '../lib/ui.js';
import { tokenize, METHODS, displayToken } from '../lib/tokenizer.js';
import { MODELS, byId, cost, PRICE_NOTE } from '../data/models.js';

export const meta = { title: { id: 'Tokenizer', en: 'Tokenizer' } };

const S = {
  id: {
    h1: 'Teks Anda tidak ditagih per kata, tapi per token',
    lead: 'Model tidak membaca kata, melainkan potongan sub-kata. Tempelkan teks apa pun di bawah untuk melihat bagaimana model memecahnya, berapa biaya per panggilan, dan gaya tokenisasi mana yang paling hemat.',
    inputL: 'Teks yang mau diuji',
    samples: 'Contoh cepat',
    method: 'Gaya tokenisasi',
    usedBy: 'Dipakai oleh',
    tokens: 'Token',
    chars: 'Karakter',
    words: 'Kata',
    bytes: 'Bita (bytes)',
    cpt: 'Karakter / token',
    tpw: 'Token / kata',
    uniq: 'Token unik',
    viz: 'Pecahan token visual',
    vizHint: 'Arahkan kursor ke token untuk melihat ID semu dan ukuran bitanya. Spasi ditandai dengan titik tengah (·).',
    truncated: (n) => `Menampilkan ${n} token pertama agar peramban tetap responsif.`,
    compare: 'Perbandingan 3 gaya tokenisasi',
    compareHint: 'Teks yang sama dipecah oleh 3 pendekatan berbeda. Model modern (BPE 100k+) menghasilkan token lebih sedikit untuk teks non-Inggris dan kode.',
    calc: 'Kalkulator biaya dari teks di atas',
    calcHint: 'Anggap teks di atas sebagai prompt masukan. Tentukan panjang jawaban dan frekuensi panggilan per bulan.',
    outEst: 'Estimasi token keluaran per panggilan',
    reqs: 'Panggilan per bulan',
    perReq: 'Biaya per panggilan',
    perMonth: 'Biaya per bulan',
    ctxFit: 'Muat di context window',
    tblModel: 'Model',
    tblIn: 'Masukan / 1M',
    tblOut: 'Keluaran / 1M',
    tblReq: 'Per panggilan',
    tblMonth: 'Per bulan',
    why: 'Mengapa Anda harus peduli soal token?',
    w1t: 'Penagihan selalu dua arah',
    w1b: 'Anda membayar token masukan DAN keluaran. Token keluaran selalu 3–5× lebih mahal karena model harus menjalankan inferensi autoregresif satu demi satu.',
    w2t: 'Bahasa non-Inggris lebih boros token',
    w2b: 'Kosakata tokeniser dilatih dominan teks Inggris. Kata bahasa Indonesia seperti "mempertanggungjawabkan" bisa dipecah menjadi 5–7 token, sementara padanan Inggrisnya ("accountable") hanya 2 token.',
    w3t: 'Angka, spasi, dan emoji mahal',
    w3b: 'Satu emoji bisa bernilai 2–4 token. Angka panjang sering dipecah per digit atau per dua digit. Spasi berlebih dan indentasi kode juga memakan kuota.',
    w4t: 'Aturan praktis yang berguna',
    w4b: 'Untuk teks Inggris: 1 token ≈ 0,75 kata ≈ 4 karakter. Untuk teks Indonesia: 1 token ≈ 0,5–0,6 kata ≈ 3 karakter.',
    note: 'Catatan: Tokeniser di halaman ini adalah aproksimasi berbasis aturan di peramban untuk keperluan edukasi dan kalkulasi cepat. Hitungan model resmi via API bisa berbeda tipis (±5%).',
    sample: { en: 'Inggris (prosa)', id: 'Indonesia (formal)', code: 'Kode JavaScript', mixed: 'Campuran (ID + EN)', num: 'Data angka & JSON' },
  },
  en: {
    h1: 'Your text is billed per token, not per word',
    lead: 'Models do not read words; they process sub-word fragments. Paste any text below to inspect how it gets split, calculate per-call and monthly costs, and compare token efficiency.',
    inputL: 'Text to inspect',
    samples: 'Quick samples',
    method: 'Tokenisation style',
    usedBy: 'Used by',
    tokens: 'Tokens',
    chars: 'Characters',
    words: 'Words',
    bytes: 'Bytes',
    cpt: 'Chars / token',
    tpw: 'Tokens / word',
    uniq: 'Unique tokens',
    viz: 'Visual token breakdown',
    vizHint: 'Hover a token to see its pseudo ID and byte size. Spaces are marked with a middle dot (·).',
    truncated: (n) => `Showing first ${n} tokens to keep the browser responsive.`,
    compare: 'Side-by-side comparison across 3 tokeniser styles',
    compareHint: 'The exact same text processed by 3 different vocabularies. Modern models (100k+ BPE) use fewer tokens for non-English text and code.',
    calc: 'Cost calculator based on above text',
    calcHint: 'Treat the text above as your input prompt. Set estimated output length and monthly request volume.',
    outEst: 'Estimated output tokens per request',
    reqs: 'Requests per month',
    perReq: 'Cost per request',
    perMonth: 'Cost per month',
    ctxFit: 'Fits context window',
    tblModel: 'Model',
    tblIn: 'Input / 1M',
    tblOut: 'Output / 1M',
    tblReq: 'Per request',
    tblMonth: 'Per month',
    why: 'Why tokens matter to your wallet and latency',
    w1t: 'Billing is bidirectional',
    w1b: 'You pay for input tokens AND output tokens. Output tokens cost 3–5× more because generation is strictly sequential (one forward pass per token).',
    w2t: 'Non-English text is taxed more heavily',
    w2b: 'Vocabularies are trained predominantly on English. Words in other languages are split into more pieces, costing more money and context space for the same meaning.',
    w3t: 'Numbers, indentation, and emoji are expensive',
    w3b: 'A single emoji can cost 2–4 tokens. Long numbers are split into 1–3 digit chunks. Excessive whitespace and indentation eat into your quota fast.',
    w4t: 'Handy rules of thumb',
    w4b: 'For English prose: 1 token ≈ 0.75 words ≈ 4 characters. For code: 1 token ≈ 0.5 words ≈ 3.3 characters.',
    note: 'Note: This tokeniser runs rule-based approximations entirely inside your browser for fast interactive feedback. Official API counts may vary slightly (±5%).',
    sample: { en: 'English prose', id: 'Indonesian (formal)', code: 'JavaScript snippet', mixed: 'Bilingual (ID + EN)', num: 'Numbers & JSON' },
  },
  es: {
    h1: 'Tu texto no se factura por palabra, se factura por token',
    lead: 'Los modelos leen fragmentos de subpalabras. Pega cualquier texto y observa cómo se divide.',
    inputL: 'Texto a probar', samples: 'Muestras rápidas', method: 'Estilo de tokenización',
    usedBy: 'Usado por', tokens: 'Tokens', chars: 'Caracteres', words: 'Palabras', bytes: 'Bytes',
    cpt: 'Chars / token', tpw: 'Tokens / palabra', uniq: 'Tokens únicos',
    viz: 'Resultado dividido', vizHint: 'Pasa el cursor sobre un token para ver su ID y tamaño.',
    truncated: (n) => 'Solo se dibujan los primeros ' + n + ' tokens.',
    compare: 'Tres estilos lado a lado', compareHint: 'Mismo texto, tres algoritmos diferentes.',
    calc: 'Calculadora de costos', calcHint: 'Usa el texto de arriba como prompt de entrada.',
    outEst: 'Tokens de salida estimados por solicitud', reqs: 'Solicitudes por mes',
    perReq: 'Costo por solicitud', perMonth: 'Costo por mes', ctxFit: 'Cabe en la ventana',
    tblModel: 'Modelo', tblIn: 'Entrada / 1M', tblOut: 'Salida / 1M', tblReq: 'Por solicitud', tblMonth: 'Por mes',
    why: 'Por qué importa esto',
    w1t: 'La facturación funciona en ambas direcciones, por token', w1b: 'Pagas por tokens de entrada y salida a diferentes tarifas — la salida suele ser 3-5x más cara.',
    w2t: 'El texto no inglés cuesta más', w2b: 'La mayoría de los vocabularios se entrenaron principalmente en inglés, por lo que otros idiomas se dividen en más piezas.',
    w3t: 'Los números, emojis y errores tipográficos inflan', w3b: 'Los números largos se dividen en grupos de dígitos, un emoji puede consumir 2-3 tokens.',
    w4t: 'El recuento de tokens no es el recuento de palabras', w4b: 'Regla práctica para inglés: 1 token ≈ 0.75 palabras ≈ 4 caracteres.',
    note: 'Este tokenizador es una aproximación educativa: los recuentos pueden diferir ±10-15% de los tokenizadores oficiales.',
    sample: { en: 'Inglés', id: 'Indonesio', code: 'Código', mixed: 'Emoji y CJK', num: 'Números' },
  },
  zh: {
    h1: '您的文本不按字计费，而是按 Token 计费',
    lead: '模型读取子词片段。将任何文本粘贴进来，观察其如何被分割。',
    inputL: '待测文本', samples: '快速示例', method: 'Tokenization 方式',
    usedBy: '使用方', tokens: 'Token', chars: '字符', words: '词', bytes: '字节',
    cpt: '字符 / Token', tpw: 'Token / 词', uniq: '唯一 Token',
    viz: '分割结果', vizHint: '悬停在 Token 上查看伪 ID 和字节大小。',
    truncated: (n) => '仅绘制前 ' + n + ' 个 Token 以保持流畅。',
    compare: '三种方式横向对比', compareHint: '相同文本，三种算法。',
    calc: '成本计算器', calcHint: '将上方文本视为输入 Prompt，然后估算答案长度和月请求量。',
    outEst: '每次请求的估算输出 Token 数', reqs: '每月请求次数',
    perReq: '每次请求费用', perMonth: '每月费用', ctxFit: '适合窗口',
    tblModel: '模型', tblIn: '输入 / 1M', tblOut: '输出 / 1M', tblReq: '每次请求', tblMonth: '每月',
    why: '为什么这很重要',
    w1t: '双向按 Token 计费', w1b: '输入和输出 Token 按不同费率收费——输出通常贵 3-5 倍。',
    w2t: '非英文文本费用更高', w2b: '大多数词表以英文为主训练，其他语言会被分割成更多片段。',
    w3t: '数字、表情符号和拼写错误会膨胀', w3b: '长数字按数字组分割，一个 emoji 可能消耗 2-3 个 Token。',
    w4t: 'Token 数不等于词数', w4b: '英文实用规则：1 Token ≈ 0.75 词 ≈ 4 字符。',
    note: '此 Tokenizer 为教学近似：分割模式真实，但计数可能与官方 Tokenizer 相差 ±10-15%。',
    sample: { en: '英文', id: '印尼语', code: '代码', mixed: 'Emoji & CJK', num: '数字' },
  },
  ja: {
    h1: 'テキストは単語ではなくトークンで課金されます',
    lead: 'モデルはサブワードのチャンクを読みます。テキストを貼り付けて分割を観察してください。',
    inputL: 'テストするテキスト', samples: 'クイックサンプル', method: 'トークナイズスタイル',
    usedBy: '使用先', tokens: 'トークン', chars: '文字', words: '単語', bytes: 'バイト',
    cpt: '文字 / トークン', tpw: 'トークン / 単語', uniq: 'ユニークトークン',
    viz: '分割結果', vizHint: 'トークンにカーソルを合わせると擬似IDとバイトサイズが表示されます。',
    truncated: (n) => '高速化のため最初の ' + n + ' トークンのみ表示します。',
    compare: '3スタイル比較', compareHint: '同じテキスト、3つのアルゴリズム。',
    calc: 'コスト計算機', calcHint: '上のテキストを入力プロンプトとして、回答長と月間量を見積もります。',
    outEst: '1リクエストあたりの推定出力トークン数', reqs: '月間リクエスト数',
    perReq: '1リクエストあたりのコスト', perMonth: '月間コスト', ctxFit: 'ウィンドウに収まる',
    tblModel: 'モデル', tblIn: '入力 / 1M', tblOut: '出力 / 1M', tblReq: '1リクエストあたり', tblMonth: '月間',
    why: 'なぜこれが重要か',
    w1t: '課金は両方向にトークン単位で行われる', w1b: '入力と出力トークンは別の料金で課金されます—出力は通常3〜5倍高価です。',
    w2t: '非英語テキストはコストが高い', w2b: 'ほとんどの語彙は主に英語で訓練されているため、他の言語はより多くのピースに分割されます。',
    w3t: '数字、絵文字、タイポはトークンを増やす', w3b: '長い数字は数字グループに分割され、絵文字は2〜3トークン消費することがあります。',
    w4t: 'トークン数≠単語数', w4b: '英語の実用的なルール：1トークン≈0.75単語≈4文字。',
    note: 'このトークナイザーは教育的な近似です：分割パターンは現実的ですが、カウントは公式トークナイザーから±10〜15%異なる場合があります。',
    sample: { en: '英語', id: 'インドネシア語', code: 'コード', mixed: '絵文字&CJK', num: '数字' },
  },
  fr: {
    h1: "Votre texte n'est pas facture par mot, mais par token",
    lead: "Les modeles lisent des morceaux de sous-mots. Collez n'importe quoi et regardez-le se diviser.",
    inputL: "Texte a tester", samples: "Exemples rapides", method: "Style de tokenisation",
    usedBy: "Utilise par", tokens: "Tokens", chars: "Caracteres", words: "Mots", bytes: "Octets",
    cpt: "Chars / token", tpw: "Tokens / mot", uniq: "Tokens uniques",
    viz: "Resultat divise", vizHint: "Survolez un token pour voir son pseudo-ID et sa taille en octets.",
    truncated: (n) => 'Seulement les ' + n + ' premiers tokens sont affiches.',
    compare: "Trois styles cote a cote", compareHint: "Meme texte, trois algorithmes.",
    calc: "Calculateur de couts", calcHint: "Utilisez le texte ci-dessus comme prompt d'entree.",
    outEst: "Tokens de sortie estimes par requete", reqs: "Requetes par mois",
    perReq: "Cout par requete", perMonth: "Cout par mois", ctxFit: "Entre dans la fenetre",
    tblModel: "Modele", tblIn: "Entree / 1M", tblOut: "Sortie / 1M", tblReq: "Par requete", tblMonth: "Par mois",
    why: "Pourquoi cela compte",
    w1t: "La facturation fonctionne dans les deux sens, par token", w1b: "Vous payez pour les tokens d'entree et de sortie a des tarifs differents.",
    w2t: "Le texte non anglais coute plus cher", w2b: "La plupart des vocabulaires ont ete principalement entraines en anglais.",
    w3t: "Les nombres, emojis et fautes gonflent", w3b: "Les longs nombres se divisent en groupes de chiffres, un emoji peut consommer 2-3 tokens.",
    w4t: "Le nombre de tokens n'est pas le nombre de mots", w4b: "Regle pratique pour l'anglais : 1 token ≈ 0,75 mots ≈ 4 caracteres.",
    note: "Ce tokeniseur est une approximation educative : les comptes peuvent differer de ±10-15% des tokeniseurs officiels.",
    sample: { en: "Anglais", id: "Indonesien", code: "Code", mixed: "Emoji & CJK", num: "Nombres" },
  },
  de: {
    h1: 'Ihr Text wird nicht pro Wort, sondern pro Token abgerechnet',
    lead: 'Modelle lesen Teilwort-Blöcke. Fügen Sie beliebigen Text ein und beobachten Sie die Aufteilung.',
    inputL: 'Zu testender Text', samples: 'Schnelle Beispiele', method: 'Tokenisierungsstil',
    usedBy: 'Verwendet von', tokens: 'Token', chars: 'Zeichen', words: 'Wörter', bytes: 'Bytes',
    cpt: 'Zeichen / Token', tpw: 'Token / Wort', uniq: 'Eindeutige Token',
    viz: 'Aufteilungsergebnis', vizHint: 'Fahren Sie über einen Token, um seine Pseudo-ID und Bytegröße zu sehen.',
    truncated: (n) => 'Nur die ersten ' + n + ' Token werden angezeigt.',
    compare: 'Drei Stile nebeneinander', compareHint: 'Gleicher Text, drei Algorithmen.',
    calc: 'Kostenrechner', calcHint: 'Verwenden Sie den obigen Text als Eingabe-Prompt.',
    outEst: 'Geschätzte Ausgabe-Token pro Anfrage', reqs: 'Anfragen pro Monat',
    perReq: 'Kosten pro Anfrage', perMonth: 'Kosten pro Monat', ctxFit: 'Passt in Fenster',
    tblModel: 'Modell', tblIn: 'Eingabe / 1M', tblOut: 'Ausgabe / 1M', tblReq: 'Pro Anfrage', tblMonth: 'Pro Monat',
    why: 'Warum das wichtig ist',
    w1t: 'Abrechnung in beide Richtungen, pro Token', w1b: 'Sie zahlen für Eingabe- und Ausgabe-Token zu unterschiedlichen Sätzen.',
    w2t: 'Nicht-englischer Text kostet mehr', w2b: 'Die meisten Vokabulare wurden hauptsächlich auf Englisch trainiert.',
    w3t: 'Zahlen, Emojis und Tippfehler blähen auf', w3b: 'Lange Zahlen werden in Zifferngruppen aufgeteilt, ein Emoji kann 2-3 Token verbrauchen.',
    w4t: 'Token-Anzahl ist nicht Wort-Anzahl', w4b: 'Praktische Regel für Englisch: 1 Token ≈ 0,75 Wörter ≈ 4 Zeichen.',
    note: 'Dieser Tokenizer ist eine pädagogische Annäherung: Zählungen können ±10-15% von offiziellen Tokenizern abweichen.',
    sample: { en: 'Englisch', id: 'Indonesisch', code: 'Code', mixed: 'Emoji & CJK', num: 'Zahlen' },
  },
  ar: {
    h1: 'نصك لا يُحسب بالكلمة، بل بالرمز (Token)',
    lead: 'تقرأ النماذج قطع الكلمات الجزئية. الصق أي نص وشاهد كيف يُقسَّم.',
    inputL: 'نص للاختبار', samples: 'عينات سريعة', method: 'أسلوب الترميز',
    usedBy: 'مستخدم من قبل', tokens: 'رموز', chars: 'أحرف', words: 'كلمات', bytes: 'بايتات',
    cpt: 'حرف / رمز', tpw: 'رمز / كلمة', uniq: 'رموز فريدة',
    viz: 'نتيجة التقسيم', vizHint: 'مرر الفأرة على رمز لرؤية معرفه الزائف وحجمه بالبايت.',
    truncated: (n) => 'يُرسم أول ' + n + ' رموز فقط للحفاظ على السرعة.',
    compare: 'ثلاثة أساليب جنبًا إلى جنب', compareHint: 'نفس النص، ثلاثة خوارزميات مختلفة.',
    calc: 'حاسبة التكاليف', calcHint: 'استخدم النص أعلاه كموجه إدخال.',
    outEst: 'رموز الإخراج المقدرة لكل طلب', reqs: 'الطلبات شهرياً',
    perReq: 'تكلفة لكل طلب', perMonth: 'تكلفة شهرية', ctxFit: 'يناسب النافذة',
    tblModel: 'النموذج', tblIn: 'دخل / 1M', tblOut: 'خرج / 1M', tblReq: 'لكل طلب', tblMonth: 'شهرياً',
    why: 'لماذا هذا مهم',
    w1t: 'الفواتير تسير في كلا الاتجاهين، بالرمز', w1b: 'تدفع مقابل رموز الإدخال والإخراج بأسعار مختلفة.',
    w2t: 'النص غير الإنجليزي يكلف أكثر', w2b: 'معظم المفردات مُدرَّبة أساساً على الإنجليزية.',
    w3t: 'الأرقام والرموز التعبيرية والأخطاء تُضخم', w3b: 'الأرقام الطويلة تنقسم إلى مجموعات أرقام، قد يستهلك رمز تعبيري 2-3 رموز.',
    w4t: 'عدد الرموز ليس عدد الكلمات', w4b: 'قاعدة عملية للإنجليزية: 1 رمز ≈ 0.75 كلمة ≈ 4 أحرف.',
    note: 'هذا المرمز تقريب تعليمي: قد تختلف الأعداد ±10-15٪ عن المرمزات الرسمية.',
    sample: { en: 'إنجليزي', id: 'إندونيسي', code: 'كود', mixed: 'رموز & CJK', num: 'أرقام' },
  },
  pt: {
    h1: 'Seu texto não é cobrado por palavra, é cobrado por token',
    lead: 'Os modelos leem fragmentos de subpalavras. Cole qualquer coisa e observe a divisão.',
    inputL: 'Texto para testar', samples: 'Amostras rápidas', method: 'Estilo de tokenização',
    usedBy: 'Usado por', tokens: 'Tokens', chars: 'Caracteres', words: 'Palavras', bytes: 'Bytes',
    cpt: 'Chars / token', tpw: 'Tokens / palavra', uniq: 'Tokens únicos',
    viz: 'Resultado dividido', vizHint: 'Passe o mouse sobre um token para ver seu pseudo-ID e tamanho.',
    truncated: (n) => 'Apenas os primeiros ' + n + ' tokens são desenhados.',
    compare: 'Três estilos lado a lado', compareHint: 'Mesmo texto, três algoritmos.',
    calc: 'Calculadora de custos', calcHint: 'Use o texto acima como prompt de entrada.',
    outEst: 'Tokens de saída estimados por requisição', reqs: 'Requisições por mês',
    perReq: 'Custo por requisição', perMonth: 'Custo por mês', ctxFit: 'Cabe na janela',
    tblModel: 'Modelo', tblIn: 'Entrada / 1M', tblOut: 'Saída / 1M', tblReq: 'Por requisição', tblMonth: 'Por mês',
    why: 'Por que isso importa',
    w1t: 'A cobrança funciona em ambas as direções, por token', w1b: 'Você paga por tokens de entrada e saída a taxas diferentes.',
    w2t: 'Texto não inglês custa mais', w2b: 'A maioria dos vocabulários foi treinada principalmente em inglês.',
    w3t: 'Números, emojis e erros de digitação inflam', w3b: 'Números longos se dividem em grupos de dígitos, um emoji pode consumir 2-3 tokens.',
    w4t: 'Contagem de tokens não é contagem de palavras', w4b: 'Regra prática para inglês: 1 token ≈ 0,75 palavras ≈ 4 caracteres.',
    note: 'Este tokenizador é uma aproximação educativa: contagens podem diferir ±10-15% dos tokenizadores oficiais.',
    sample: { en: 'Inglês', id: 'Indonésio', code: 'Código', mixed: 'Emoji & CJK', num: 'Números' },
  },
  ru: {
    h1: 'Ваш текст тарифицируется не за слово, а за токен',
    lead: 'Модели читают куски подслов. Вставьте любой текст и наблюдайте за разделением.',
    inputL: 'Текст для тестирования', samples: 'Быстрые примеры', method: 'Стиль токенизации',
    usedBy: 'Используется', tokens: 'Токены', chars: 'Символы', words: 'Слова', bytes: 'Байты',
    cpt: 'Симв. / токен', tpw: 'Токенов / слово', uniq: 'Уникальные токены',
    viz: 'Результат разделения', vizHint: 'Наведите на токен, чтобы увидеть его псевдо-ID и размер.',
    truncated: (n) => 'Отображаются только первые ' + n + ' токенов.',
    compare: 'Три стиля рядом', compareHint: 'Тот же текст, три алгоритма.',
    calc: 'Калькулятор стоимости', calcHint: 'Используйте текст выше как входной промпт.',
    outEst: 'Оценочные выходные токены на запрос', reqs: 'Запросов в месяц',
    perReq: 'Стоимость за запрос', perMonth: 'Стоимость в месяц', ctxFit: 'Вмещается в окно',
    tblModel: 'Модель', tblIn: 'Вход / 1M', tblOut: 'Выход / 1M', tblReq: 'За запрос', tblMonth: 'В месяц',
    why: 'Почему это важно',
    w1t: 'Оплата идёт в обе стороны, за токен', w1b: 'Вы платите за входные и выходные токены по разным тарифам.',
    w2t: 'Нерусскоязычный текст стоит дороже', w2b: 'Большинство словарей обучено преимущественно на английском.',
    w3t: 'Числа, эмодзи и опечатки раздувают', w3b: 'Длинные числа разделяются на группы цифр, эмодзи может занять 2-3 токена.',
    w4t: 'Количество токенов не равно количеству слов', w4b: 'Практическое правило для английского: 1 токен ≈ 0,75 слова ≈ 4 символа.',
    note: 'Этот токенизатор является образовательным приближением: подсчёты могут отличаться ±10-15% от официальных.',
    sample: { en: 'Английский', id: 'Индонезийский', code: 'Код', mixed: 'Эмодзи & CJK', num: 'Числа' },
  },
  ko: {
    h1: '텍스트는 단어가 아닌 토큰으로 청구됩니다',
    lead: '모델은 하위 단어 청크를 읽습니다. 텍스트를 붙여넣고 분할을 관찰하세요.',
    inputL: '테스트할 텍스트', samples: '빠른 샘플', method: '토크나이제이션 스타일',
    usedBy: '사용 중', tokens: '토큰', chars: '문자', words: '단어', bytes: '바이트',
    cpt: '문자 / 토큰', tpw: '토큰 / 단어', uniq: '고유 토큰',
    viz: '분할 결과', vizHint: '토큰에 마우스를 올려 의사 ID와 바이트 크기를 확인하세요.',
    truncated: (n) => '속도를 위해 처음 ' + n + '개 토큰만 표시됩니다.',
    compare: '세 가지 스타일 비교', compareHint: '동일한 텍스트, 세 가지 알고리즘.',
    calc: '비용 계산기', calcHint: '위의 텍스트를 입력 프롬프트로 사용하세요.',
    outEst: '요청당 예상 출력 토큰', reqs: '월간 요청 수',
    perReq: '요청당 비용', perMonth: '월간 비용', ctxFit: '윈도우에 적합',
    tblModel: '모델', tblIn: '입력 / 1M', tblOut: '출력 / 1M', tblReq: '요청당', tblMonth: '월간',
    why: '이것이 중요한 이유',
    w1t: '청구는 양방향으로 토큰 단위로 이루어집니다', w1b: '입력과 출력 토큰은 다른 요금으로 청구됩니다.',
    w2t: '비영어 텍스트는 비용이 더 듭니다', w2b: '대부분의 어휘는 주로 영어로 훈련되었습니다.',
    w3t: '숫자, 이모지, 오타는 부풀립니다', w3b: '긴 숫자는 숫자 그룹으로 나뉘고, 이모지는 2-3 토큰을 차지할 수 있습니다.',
    w4t: '토큰 수는 단어 수가 아닙니다', w4b: '영어 실용 규칙: 1 토큰 ≈ 0.75 단어 ≈ 4 문자.',
    note: '이 토크나이저는 교육적 근사값입니다: 공식 토크나이저와 ±10-15% 차이가 날 수 있습니다.',
    sample: { en: '영어', id: '인도네시아어', code: '코드', mixed: 'Emoji & CJK', num: '숫자' },
  },
};

export function render(root, ctx) {
  const t = S[ctx.lang] || S.en || S.id;
  let method = 'bpe';
  let text = SAMPLES[ctx.lang === 'en' ? 'en' : 'id'];
  let outEst = 220;
  let reqs = 10000;
  let modelId = 'gpt-4o-mini';

  const area = el('textarea', { rows: 5, spellcheck: 'false', 'aria-label': t.inputL }, [text]);
  area.addEventListener('input', debounce(() => { text = area.value; update(); }, 120));

  const sampleRow = el('div.chips', {}, Object.keys(SAMPLES).map((k) =>
    el('button.chip', { type: 'button', onclick: () => { text = SAMPLES[k]; area.value = text; update(); } }, [t.sample[k]])));

  const methodRow = el('div.chips', {}, METHODS.map((m) =>
    el('button.chip', {
      type: 'button', 'aria-pressed': m.id === method ? 'true' : 'false', dataset: { m: m.id },
      onclick: () => {
        method = m.id;
        [...methodRow.children].forEach((c) => c.setAttribute('aria-pressed', c.dataset.m === method ? 'true' : 'false'));
        update();
      },
    }, [m.label])));
  const methodInfo = el('p.card-sub', { style: { marginBottom: 0 } });

  const statCells = {};
  const mkStat = (k, label, sub) => { const n = stat(label, '—', sub); statCells[k] = n.querySelector('.stat-v'); return n; };
  const statsGrid = el('div.grid.g-4', {}, [
    mkStat('tokens', t.tokens), mkStat('chars', t.chars), mkStat('words', t.words), mkStat('bytes', t.bytes),
    mkStat('cpt', t.cpt), mkStat('tpw', t.tpw), mkStat('uniq', t.uniq),
    mkStat('per100', ctx.lang === 'id' ? 'Token / 100 karakter' : 'Tokens / 100 chars'),
  ]);

  const tokBox = el('div.tok-out', { role: 'list' });
  const tokNote = el('p.card-sub', { style: { marginTop: '10px', marginBottom: 0 } });

  const cmpBody = el('tbody');
  const compareCard = card(t.compare, [
    el('p.card-sub', { text: t.compareHint }),
    el('div.tbl-wrap', {}, [el('table.tbl', {}, [
      el('thead', {}, [el('tr', {}, [
        el('th', { text: t.method }), el('th', { text: t.tokens }), el('th', { text: t.cpt }), el('th', { text: t.usedBy }),
      ])]),
      cmpBody,
    ])]),
  ], { h3: true, attrs: { id: 'panel-compare' } });

  const outInput = el('input', { type: 'number', min: 0, max: 100000, value: outEst, 'aria-label': t.outEst, oninput: (e) => { outEst = +e.target.value || 0; update(); } });
  const reqInput = el('input', { type: 'number', min: 0, max: 100000000, value: reqs, 'aria-label': t.reqs, oninput: (e) => { reqs = +e.target.value || 0; update(); } });
  const modelSel = el('select', { 'aria-label': t.tblModel, onchange: (e) => { modelId = e.target.value; update(); } },
    MODELS.map((m) => el('option', { value: m.id, selected: m.id === modelId }, [`${m.name} (${m.vendor})`])));
  const calcCells = {};
  const mkCalc = (k, label, sub) => { const n = stat(label, '—', sub); calcCells[k] = n.querySelector('.stat-v'); return n; };
  const priceBody = el('tbody');

  const calcCard = card(t.calc, [
    el('p.card-sub', { text: t.calcHint }),
    el('div.grid.g-3', {}, [
      el('div', {}, [el('label', {}, [t.tblModel]), modelSel]),
      el('div', {}, [el('label', {}, [t.outEst]), outInput]),
      el('div', {}, [el('label', {}, [t.reqs]), reqInput]),
    ]),
    el('hr.hr'),
    el('div.grid.g-3', {}, [mkCalc('perReq', t.perReq), mkCalc('perMonth', t.perMonth), mkCalc('fit', t.ctxFit)]),
    el('hr.hr'),
    el('div.tbl-wrap', {}, [el('table.tbl', {}, [
      el('thead', {}, [el('tr', {}, [
        el('th', { text: t.tblModel }), el('th.num', { text: t.tblIn }), el('th.num', { text: t.tblOut }),
        el('th.num', { text: t.tblReq }), el('th.num', { text: t.tblMonth }),
      ])]),
      priceBody,
    ])]),
    el('p.card-sub', { text: PRICE_NOTE[ctx.lang] || PRICE_NOTE.id, style: { marginTop: '10px', marginBottom: 0 } }),
  ], { h3: true, attrs: { id: 'panel-cost' } });

  const whyCard = card(t.why, [
    [['w1t', 'w1b'], ['w2t', 'w2b'], ['w3t', 'w3b'], ['w4t', 'w4b']].map(([a, b]) =>
      el('details.acc', {}, [el('summary', { text: t[a] }), el('div.acc-body', {}, [el('p', { text: t[b] })])])),
  ], { h3: true });

  root.append(
    el('header.head', {}, [
      el('span.eyebrow', { text: 'Tokenizer' }),
      el('h1', { text: t.h1 }),
      el('p', { text: t.lead }),
    ]),
    el('div.split-wide', {}, [
      el('div.stack', {}, [
        card(null, [
          el('div.stack', {}, [
            el('div', {}, [el('label', {}, [t.inputL]), area]),
            el('div.row-between', {}, [el('span.stat-k', { text: t.samples }), copyBtn(() => area.value, ctx.lang === 'id' ? 'Salin' : 'Copy')]),
            sampleRow,
            el('hr.hr'),
            el('div', {}, [el('label', {}, [t.method]), el('div', { style: { marginTop: '6px' } }, [methodRow]), methodInfo]),
          ]),
        ]),
        card(t.viz, [el('p.card-sub', { text: t.vizHint }), tokBox, tokNote], { h3: true }),
        compareCard,
        calcCard,
      ]),
      el('div.stack.sticky-side', {}, [
        card(ctx.lang === 'id' ? 'Ukuran' : 'Measurements', [statsGrid], { h3: true }),
        el('div.note', {}, [el('span', {}, [t.note])]),
        whyCard,
      ]),
    ]),
  );

  function update() {
    const res = tokenize(text, method);
    const s = res.stats;
    statCells.tokens.textContent = nf(s.tokens);
    statCells.chars.textContent = nf(s.chars);
    statCells.words.textContent = nf(s.words);
    statCells.bytes.textContent = nf(s.bytes);
    statCells.cpt.textContent = s.charsPerToken.toFixed(2);
    statCells.tpw.textContent = s.tokensPerWord.toFixed(2);
    statCells.uniq.textContent = nf(s.unique);

    statCells.per100.textContent = s.chars ? (s.tokens / s.chars * 100).toFixed(1) : '—';

    const active = METHODS.find((m) => m.id === method);
    if (active) methodInfo.textContent = `${t.usedBy}: ${active.models}`;

    tokBox.textContent = '';
    const draw = res.tokens.slice(0, MAX_DRAW);
    const f = document.createDocumentFragment();
    draw.forEach((tk, i) => {
      f.append(el('span.tok.' + COLOR_OF(i), {
        role: 'listitem',
        title: `#${i + 1} · id ${tk.id} · ${tk.bytes}B · ${tk.kind}`,
      }, [displayToken(tk.s)]));
    });
    tokBox.append(f);
    tokNote.textContent = res.tokens.length > MAX_DRAW ? t.truncated(MAX_DRAW) : '';

    cmpBody.textContent = '';
    METHODS.forEach((m) => {
      const r = tokenize(text, m.id).stats;
      cmpBody.append(el('tr', { style: m.id === method ? { background: 'var(--accent-soft)' } : {} }, [
        el('td', {}, [el('strong', { text: m.label })]),
        el('td.num', { text: nf(r.tokens) }),
        el('td.num', { text: r.charsPerToken.toFixed(2) }),
        el('td', { text: m.models, style: { color: 'var(--text-mute)', fontSize: '.82rem' } }),
      ]));
    });

    const inTok = s.tokens;
    const m = byId(modelId);
    const per = cost(m, inTok, outEst);
    calcCells.perReq.textContent = usd(per);
    calcCells.perMonth.textContent = usd(per * reqs);
    calcCells.fit.textContent = `${nf(Math.floor(m.ctx / Math.max(1, inTok + outEst)))}×`;

    priceBody.textContent = '';
    MODELS.forEach((mm) => {
      const c = cost(mm, inTok, outEst);
      priceBody.append(el('tr', { style: mm.id === modelId ? { background: 'var(--accent-soft)' } : {} }, [
        el('td', {}, [el('strong', { text: mm.name }), el('span', { text: ' · ' + compact(mm.ctx), style: { color: 'var(--text-mute)' } })]),
        el('td.num', { text: '$' + mm.in.toFixed(3) }),
        el('td.num', { text: '$' + mm.out.toFixed(2) }),
        el('td.num', { text: usd(c) }),
        el('td.num', { text: usd(c * reqs) }),
      ]));
    });
  }

  update();

  const panel = ctx.params.get('panel');
  if (panel === 'cost' || panel === 'compare') {
    requestAnimationFrame(() => document.getElementById('panel-' + panel)?.scrollIntoView({ block: 'start', behavior: 'smooth' }));
  }
}
