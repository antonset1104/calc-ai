/* ============================================================
   views/simulator.js — Simulator dekode token demi token
   Yang benar-benar dihitung: penalti, softmax bersuhu, top-k,
   top-p, sampling acak berseed, biaya token, pemakaian konteks.
   ============================================================ */

import { el, card, stat, meter, slider, copyBtn, nf, usd, compact, toast } from '../lib/ui.js';
import { tokenize, countTokens, displayToken } from '../lib/tokenizer.js';
import { rng, step as decodeStep } from '../lib/sampling.js';
import { planReply, candidatesFor, latencyModel } from '../lib/model.js';
import { MODELS, byId, cost } from '../data/models.js';

export const meta = {
  title: { id: 'Simulator', en: 'Simulator' },
};

const S = {
  id: {
    h1: 'Lihat bagaimana LLM memilih kata berikutnya',
    lead: 'Setiap token di bawah ini dipilih dengan matematika yang sama persis seperti model sungguhan: logit dikurangi penalti, dibagi suhu, dipangkas top-k/top-p, lalu disampel.',
    local: '100% jalan di peramban', nonet: 'tanpa panggilan API', seedable: 'bisa diulang (seed)',
    sysL: 'Prompt sistem', sysP: 'Kamu adalah asisten yang cermat. Jawab singkat dan jangan pernah mengarang.',
    userL: 'Pesan pengguna', userP: 'Apa itu context window?',
    preset: 'Preset', run: 'Jalankan', stop: 'Hentikan', reset: 'Ulangi',
    temp: 'Suhu (temperature)', tempH: '0 = selalu token terkuat. Makin tinggi makin meratakan distribusi.',
    topp: 'Top-p (nucleus)', toppH: 'Hanya token teratas yang jumlah probabilitasnya mencapai angka ini yang ikut diundi.',
    topk: 'Top-k', topkH: '0 = tanpa batas. Angka kecil memotong ekor probabilitas sebelum top-p.',
    maxt: 'Token keluaran maks', maxtH: 'Batas keras. Saat tercapai, finish_reason menjadi "length".',
    freq: 'Penalti frekuensi', freqH: 'Menurunkan logit sebanding dengan seberapa sering token sudah muncul.',
    pres: 'Penalti kehadiran', presH: 'Begitu sebuah token pernah muncul sekali, logitnya langsung kena potongan tetap.',
    seed: 'Seed acak', speed: 'Kecepatan',
    pipeline: 'Alur pemrosesan', chat: 'Percakapan', dist: 'Distribusi token berikutnya',
    stats: 'Telemetri', model: 'Model untuk hitung biaya & jendela',
    stepOf: 'Langkah', chosen: 'Terpilih', ent: 'Entropi', cut: 'terpangkas',
    scrub: 'Geser langkah',
    driftNote: 'Token merah adalah undian yang tidak memilih token berpeluang terbesar — ini sumber "kreativitas" sekaligus "ngawur".',
    inTok: 'Token masukan', outTok: 'Token keluaran', totalTok: 'Total', costL: 'Estimasi biaya',
    ttft: 'TTFT (simulasi)', tps: 'Token/detik', ctxUse: 'Jendela terpakai', finish: 'finish_reason',
    drift: 'Jumlah pergeseran', avgEnt: 'Entropi rata-rata',
    explain: 'Apa yang sebenarnya terjadi di balik layar',
    ex1t: '1. Templat peran', ex1b: 'Pesan sistem, pengguna, dan asisten digabung menjadi satu deretan token dengan penanda khusus. Model tidak pernah tahu konsep "peran" selain dari penanda teks ini.',
    ex2t: '2. Logit, bukan kata', ex2b: 'Model mengeluarkan satu angka mentah (logit) untuk setiap token di kamus (vocabulary). Puluhan ribu angka sekaligus.',
    ex3t: '3. Suhu mengatur ketajaman', ex3b: 'Logit dibagi suhu sebelum dihitung softmax-nya. Suhu 0,2 membuat token terkuat hampir pasti menang; suhu 1,8 memberi pesaing lemah peluang nyata.',
    ex4t: '4. Top-k dan top-p membuang ekor', ex4b: 'Pemangkasan dilakukan setelah softmax, sehingga kombinasi suhu tinggi + top-p 0,9 tetap terdengar masuk akal.',
    ex5t: '5. Penalti melawan pengulangan', ex5b: 'Penalti frekuensi bertambah makin sering kata muncul; penalti kehadiran langsung aktif begitu kata muncul sekali.',
    honest: 'Teks balasan di demo ini dirakit dari templat lokal, bukan bobot neural riil. Yang riil adalah alur sampling, matematika logit, meteran token, dan kalkulasi biayanya.',
    presets: { det: 'Deterministik', bal: 'Seimbang', cre: 'Kreatif', chaos: 'Kacau' },
    idle: 'Tekan Jalankan untuk memulai.', running: 'Menghasilkan token…', done: 'Selesai',
  },
  en: {
    h1: 'Watch an LLM choose its next word',
    lead: 'Every token below is chosen with the exact same maths a real model uses: logits minus penalties, divided by temperature, truncated by top-k/top-p, then sampled.',
    local: '100% in-browser', nonet: 'no API calls', seedable: 'reproducible (seed)',
    sysL: 'System prompt', sysP: 'You are a careful assistant. Answer briefly and never make things up.',
    userL: 'User message', userP: 'What is a context window?',
    preset: 'Preset', run: 'Run', stop: 'Stop', reset: 'Replay',
    temp: 'Temperature', tempH: '0 = always the strongest token. Higher flattens the distribution.',
    topp: 'Top-p (nucleus)', toppH: 'Only the top tokens whose probabilities sum to this value stay in the draw.',
    topk: 'Top-k', topkH: '0 = no limit. Small values cut the tail off before top-p.',
    maxt: 'Max output tokens', maxtH: 'Hard stop. When reached, finish_reason becomes "length".',
    freq: 'Frequency penalty', freqH: 'Lowers a logit in proportion to how often the token has already appeared.',
    pres: 'Presence penalty', presH: 'Once a token appears even once, its logit takes a flat hit.',
    seed: 'Seed', speed: 'Speed',
    pipeline: 'Processing pipeline', chat: 'Conversation', dist: 'Next-token distribution',
    stats: 'Telemetry', model: 'Model for cost & window',
    stepOf: 'Step', chosen: 'Chosen', ent: 'Entropy', cut: 'pruned',
    scrub: 'Scrub steps',
    driftNote: 'Red-marked tokens are draws that did not pick the highest-probability token — the source of both "creativity" and nonsense.',
    inTok: 'Input tokens', outTok: 'Output tokens', totalTok: 'Total', costL: 'Estimated cost',
    ttft: 'TTFT (simulated)', tps: 'Tokens/sec', ctxUse: 'Context used', finish: 'finish_reason',
    drift: 'Drifts', avgEnt: 'Mean entropy',
    explain: 'What actually happened',
    ex1t: '1. Role template', ex1b: 'System, user and assistant messages are flattened into a single sequence of tokens with special markers.',
    ex2t: '2. Logits, not words', ex2b: 'The model outputs one raw score (logit) for every token in the vocabulary.',
    ex3t: '3. Temperature sets sharpness', ex3b: 'Logits are divided by temperature before softmax.',
    ex4t: '4. Top-k / top-p cut the tail', ex4b: 'Truncation happens after softmax.',
    ex5t: '5. Penalties fight repetition', ex5b: 'Frequency penalty scales with count, presence penalty is a one-off hit.',
    honest: 'Reply text here is assembled from local templates, not neural weights. What is real is the sampling pipeline, token metering, and costs.',
    presets: { det: 'Deterministic', bal: 'Balanced', cre: 'Creative', chaos: 'Chaotic' },
    idle: 'Press Run to start.', running: 'Generating…', done: 'Done',
  },
  es: {
    h1: 'Observa cómo un LLM elige la siguiente palabra',
    lead: 'Cada token se elige con la misma matemática que usa un modelo real: logits menos penalizaciones, divididos por temperatura, truncados por top-k/top-p, luego muestreados.',
    local: '100% en el navegador', nonet: 'sin llamadas a API', seedable: 'reproducible (seed)',
    sysL: 'System prompt', sysP: 'Eres un asistente cuidadoso. Responde brevemente y nunca inventes.',
    userL: 'Mensaje del usuario', userP: '¿Qué es una ventana de contexto?',
    preset: 'Preset', run: 'Ejecutar', stop: 'Detener', reset: 'Reiniciar',
    temp: 'Temperatura', tempH: '0 = siempre el token más fuerte. Mayor valor aplana la distribución.',
    topp: 'Top-p (nucleus)', toppH: 'Solo los tokens cuyas probabilidades suman este valor participan.',
    topk: 'Top-k', topkH: '0 = sin límite. Valores pequeños cortan la cola antes que top-p.',
    maxt: 'Tokens de salida máximos', maxtH: 'Límite duro. Al alcanzarse, finish_reason es "length".',
    freq: 'Penalización de frecuencia', freqH: 'Reduce el logit en proporción a las apariciones del token.',
    pres: 'Penalización de presencia', presH: 'Una vez que aparece un token, su logit recibe un golpe fijo.',
    seed: 'Semilla', speed: 'Velocidad',
    pipeline: 'Pipeline de procesamiento', chat: 'Conversación', dist: 'Distribución del siguiente token',
    stats: 'Telemetría', model: 'Modelo para costo y ventana',
    stepOf: 'Paso', chosen: 'Elegido', ent: 'Entropía', cut: 'podado', scrub: 'Navegar pasos',
    driftNote: 'Los tokens marcados en rojo son sorteos que no eligieron el token de mayor probabilidad.',
    inTok: 'Tokens de entrada', outTok: 'Tokens de salida', totalTok: 'Total', costL: 'Costo estimado',
    ttft: 'TTFT (simulado)', tps: 'Tokens/seg', ctxUse: 'Contexto usado', finish: 'finish_reason',
    drift: 'Derivas', avgEnt: 'Entropía media', explain: 'Qué sucedió realmente',
    ex1t: '1. Plantilla de rol', ex1b: 'Sistema, usuario y asistente se aplanan en una secuencia de tokens con marcadores especiales.',
    ex2t: '2. Logits, no palabras', ex2b: 'El modelo emite una puntuación bruta (logit) para cada token del vocabulario.',
    ex3t: '3. La temperatura establece la nitidez', ex3b: 'Los logits se dividen por la temperatura antes del softmax.',
    ex4t: '4. Top-k / top-p cortan la cola', ex4b: 'El truncamiento ocurre después del softmax.',
    ex5t: '5. Las penalizaciones combaten la repetición', ex5b: 'La penalización de frecuencia escala con el recuento, la de presencia es un golpe único.',
    honest: 'El texto de respuesta aquí se ensambla desde plantillas locales, no desde pesos neuronales.',
    presets: { det: 'Determinístico', bal: 'Equilibrado', cre: 'Creativo', chaos: 'Caótico' },
    idle: 'Presiona Ejecutar para comenzar.', running: 'Generando…', done: 'Listo',
  },
  zh: {
    h1: '观察大语言模型如何逐词选择',
    lead: '以下每个 Token 都通过与真实模型相同的数学逻辑选取：Logit 减去惩罚项，除以温度，经 top-k/top-p 截断，再进行采样。',
    local: '100% 在浏览器中运行', nonet: '无需 API 调用', seedable: '可复现（种子）',
    sysL: 'System 提示词', sysP: '你是一个细心的助手。请简短作答，不要捏造信息。',
    userL: '用户消息', userP: '什么是上下文窗口？',
    preset: '预设', run: '运行', stop: '停止', reset: '重播',
    temp: '温度（Temperature）', tempH: '0 = 始终选概率最高的 Token；越高分布越平缓。',
    topp: 'Top-p（核采样）', toppH: '只有概率累积达到该值的 Token 才参与抽取。',
    topk: 'Top-k', topkH: '0 = 不限制。较小值会优先裁剪分布尾部。',
    maxt: '最大输出 Token 数', maxtH: '硬性上限。达到后 finish_reason 变为 "length"。',
    freq: '频率惩罚', freqH: '按 Token 出现频率比例降低其 Logit。',
    pres: '存在惩罚', presH: '一旦某 Token 出现过，其 Logit 立即被固定削减。',
    seed: '随机种子', speed: '速度',
    pipeline: '处理流水线', chat: '对话', dist: '下一 Token 概率分布',
    stats: '遥测数据', model: '成本与上下文计算模型',
    stepOf: '步骤', chosen: '已选', ent: '熵值', cut: '已截断', scrub: '回溯步骤',
    driftNote: '标红的 Token 是未选概率最高 Token 的采样结果——这就是创造力与胡言乱语的来源。',
    inTok: '输入 Token', outTok: '输出 Token', totalTok: '总计', costL: '预估费用',
    ttft: 'TTFT（模拟）', tps: 'Token/秒', ctxUse: '上下文占用', finish: 'finish_reason',
    drift: '偏移次数', avgEnt: '平均熵', explain: '实际发生了什么',
    ex1t: '1. 角色模板', ex1b: 'System、User、Assistant 消息被展平为带特殊标记的单一 Token 序列。',
    ex2t: '2. Logit，而非词语', ex2b: '模型为词表中的每个 Token 输出一个原始分数（Logit）。',
    ex3t: '3. 温度控制锐度', ex3b: 'Logit 在 Softmax 之前除以温度；0.2 时结果几乎确定，1.8 时弱竞争者也有可观概率。',
    ex4t: '4. Top-k / Top-p 截断尾部', ex4b: 'Softmax 之后进行截断。',
    ex5t: '5. 惩罚抑制重复', ex5b: '频率惩罚按计数缩放，存在惩罚一次性生效。',
    honest: '此处的回复文本由本地模板组装而成，并非神经网络权重生成。',
    presets: { det: '确定性', bal: '均衡', cre: '创意', chaos: '混沌' },
    idle: '按「运行」开始。', running: '生成中…', done: '完成',
  },
  ja: {
    h1: 'LLMが次の単語を選ぶ様子を観察する',
    lead: '各トークンは実際のモデルと同じ数学で選ばれます：logitからペナルティを引き、温度で割り、top-k/top-pで切り詰め、サンプリングします。',
    local: '100%ブラウザ内で動作', nonet: 'API呼び出しなし', seedable: '再現可能（シード）',
    sysL: 'システムプロンプト', sysP: 'あなたは丁寧なアシスタントです。簡潔に答え、でたらめを言わないでください。',
    userL: 'ユーザーメッセージ', userP: 'コンテキストウィンドウとは何ですか？',
    preset: 'プリセット', run: '実行', stop: '停止', reset: 'リプレイ',
    temp: '温度（Temperature）', tempH: '0=常に最強トークン。高いほど分布が平坦になります。',
    topp: 'Top-p（nucleus）', toppH: '確率の合計がこの値に達するトップトークンのみが抽選に残ります。',
    topk: 'Top-k', topkH: '0=無制限。小さい値はtop-pより先にテールをカットします。',
    maxt: '最大出力トークン数', maxtH: 'ハードリミット。達すると finish_reason が"length"になります。',
    freq: '頻度ペナルティ', freqH: 'トークンの出現頻度に比例してlogitを下げます。',
    pres: '存在ペナルティ', presH: 'トークンが一度でも出現すると、そのlogitに固定のヒットが入ります。',
    seed: 'シード', speed: '速度',
    pipeline: '処理パイプライン', chat: '会話', dist: '次トークン分布',
    stats: 'テレメトリー', model: 'コスト＆ウィンドウ計算モデル',
    stepOf: 'ステップ', chosen: '選択済み', ent: 'エントロピー', cut: '切り詰め済み', scrub: 'ステップをスクラブ',
    driftNote: '赤でマークされたトークンは、最高確率のトークンを選ばなかった抽選結果です。',
    inTok: '入力トークン', outTok: '出力トークン', totalTok: '合計', costL: '推定コスト',
    ttft: 'TTFT（シミュレーション）', tps: 'トークン/秒', ctxUse: 'コンテキスト使用量', finish: 'finish_reason',
    drift: 'ドリフト数', avgEnt: '平均エントロピー', explain: '実際に何が起きたか',
    ex1t: '1. ロールテンプレート', ex1b: 'システム、ユーザー、アシスタントメッセージは特殊マーカー付きの1つのトークン列に結合されます。',
    ex2t: '2. Logit（言葉ではなく）', ex2b: 'モデルは語彙の全トークンに対して1つの生スコア（logit）を出力します。',
    ex3t: '3. 温度がシャープさを設定', ex3b: 'logitはsoftmax前に温度で割られます。',
    ex4t: '4. Top-k / Top-pがテールをカット', ex4b: '切り詰めはsoftmax後に行われます。',
    ex5t: '5. ペナルティが繰り返しと戦う', ex5b: '頻度ペナルティはカウントに比例し、存在ペナルティは1回限りのヒットです。',
    honest: 'ここの返信テキストはローカルテンプレートから組み立てられており、ニューラルウェイトからではありません。',
    presets: { det: '決定論的', bal: 'バランス', cre: 'クリエイティブ', chaos: 'カオス' },
    idle: '「実行」を押して開始してください。', running: '生成中…', done: '完了',
  },
  fr: {
    h1: "Observez un LLM choisir le mot suivant",
    lead: "Chaque token est choisi avec les memes mathematiques qu'un vrai modele : logits moins penalites, divises par la temperature, tronques par top-k/top-p, puis echantillonnes.",
    local: "100% dans le navigateur", nonet: "aucun appel API", seedable: "reproductible (graine)",
    sysL: "Invite systeme", sysP: "Vous etes un assistant attentif. Repondez brievement et n'inventez jamais.",
    userL: "Message utilisateur", userP: "Qu'est-ce qu'une fenetre de contexte ?",
    preset: "Prereglage", run: "Executer", stop: "Arreter", reset: "Rejouer",
    temp: "Temperature", tempH: "0 = toujours le token le plus fort. Plus eleve aplatit la distribution.",
    topp: "Top-p (nucleus)", toppH: "Seuls les tokens dont les probabilites somment a cette valeur restent.",
    topk: "Top-k", topkH: "0 = illimite. Les petites valeurs coupent la queue avant top-p.",
    maxt: "Tokens de sortie max", maxtH: 'Arret dur. Quand atteint, finish_reason devient "length".',
    freq: "Penalite de frequence", freqH: "Abaisse un logit en proportion des apparitions du token.",
    pres: "Penalite de presence", presH: "Quand un token apparait, son logit recoit un coup fixe.",
    seed: "Graine", speed: "Vitesse",
    pipeline: "Pipeline de traitement", chat: "Conversation", dist: "Distribution du token suivant",
    stats: "Telemetrie", model: "Modele pour cout et fenetre",
    stepOf: "Etape", chosen: "Choisi", ent: "Entropie", cut: "elague", scrub: "Parcourir les etapes",
    driftNote: "Les tokens marques en rouge sont des tirages qui n'ont pas choisi le token de plus haute probabilite.",
    inTok: "Tokens d'entree", outTok: "Tokens de sortie", totalTok: "Total", costL: "Cout estime",
    ttft: "TTFT (simule)", tps: "Tokens/sec", ctxUse: "Contexte utilise", finish: "finish_reason",
    drift: "Derives", avgEnt: "Entropie moyenne", explain: "Ce qui s'est reellement passe",
    ex1t: "1. Modele de role", ex1b: "Systeme, utilisateur et assistant sont aplatis en une sequence de tokens avec des marqueurs speciaux.",
    ex2t: "2. Logits, pas des mots", ex2b: "Le modele emet un score brut (logit) pour chaque token du vocabulaire.",
    ex3t: "3. La temperature definit la nettete", ex3b: "Les logits sont divises par la temperature avant le softmax.",
    ex4t: "4. Top-k / top-p coupent la queue", ex4b: "La troncature se produit apres le softmax.",
    ex5t: "5. Les penalites combattent la repetition", ex5b: "La penalite de frequence scale avec le compte, la penalite de presence est un coup unique.",
    honest: "Le texte de reponse ici est assemble a partir de modeles locaux, pas de poids neuronaux.",
    presets: { det: "Deterministe", bal: "Equilibre", cre: "Creatif", chaos: "Chaotique" },
    idle: "Appuyez sur Executer pour commencer.", running: "Generation en cours...", done: "Termine",
  },
  de: {
    h1: 'Beobachten Sie, wie ein LLM das nächste Wort wählt',
    lead: 'Jedes Token wird mit derselben Mathematik wie ein echtes Modell ausgewählt: Logits minus Strafen, geteilt durch Temperatur, abgeschnitten durch top-k/top-p, dann gesampelt.',
    local: '100% im Browser', nonet: 'keine API-Aufrufe', seedable: 'reproduzierbar (Seed)',
    sysL: 'System-Prompt', sysP: 'Sie sind ein sorgfältiger Assistent. Antworten Sie kurz und erfinden Sie nichts.',
    userL: 'Benutzernachricht', userP: 'Was ist ein Kontextfenster?',
    preset: 'Voreinstellung', run: 'Ausführen', stop: 'Stoppen', reset: 'Wiederholen',
    temp: 'Temperatur', tempH: '0 = immer das stärkste Token. Höher macht die Verteilung flacher.',
    topp: 'Top-p (Nucleus)', toppH: 'Nur die obersten Tokens, deren Wahrscheinlichkeiten diesen Wert ergeben, bleiben im Zug.',
    topk: 'Top-k', topkH: '0 = unbegrenzt. Kleine Werte schneiden den Schwanz vor top-p ab.',
    maxt: 'Max. Ausgabe-Tokens', maxtH: 'Harter Stopp. Bei Erreichen wird finish_reason zu "length".',
    freq: 'Häufigkeitsstrafe', freqH: 'Senkt einen Logit proportional zur Token-Häufigkeit.',
    pres: 'Präsenzstrafe', presH: 'Sobald ein Token erscheint, erhält sein Logit einen festen Treffer.',
    seed: 'Seed', speed: 'Geschwindigkeit',
    pipeline: 'Verarbeitungspipeline', chat: 'Gespräch', dist: 'Nächste-Token-Verteilung',
    stats: 'Telemetrie', model: 'Modell für Kosten & Fenster',
    stepOf: 'Schritt', chosen: 'Gewählt', ent: 'Entropie', cut: 'beschnitten', scrub: 'Schritte durchsuchen',
    driftNote: 'Rot markierte Tokens sind Ziehungen, die nicht das wahrscheinlichste Token wählten.',
    inTok: 'Eingabe-Tokens', outTok: 'Ausgabe-Tokens', totalTok: 'Gesamt', costL: 'Geschätzte Kosten',
    ttft: 'TTFT (simuliert)', tps: 'Tokens/Sek.', ctxUse: 'Kontext verwendet', finish: 'finish_reason',
    drift: 'Abweichungen', avgEnt: 'Mittlere Entropie', explain: 'Was wirklich passiert ist',
    ex1t: '1. Rollenvorlage', ex1b: 'System-, Benutzer- und Assistentennachrichten werden in eine Token-Sequenz mit Sondermarkierungen gefaltet.',
    ex2t: '2. Logits, keine Wörter', ex2b: 'Das Modell gibt für jedes Token im Vokabular einen Rohwert (Logit) aus.',
    ex3t: '3. Temperatur stellt Schärfe ein', ex3b: 'Logits werden vor dem Softmax durch die Temperatur geteilt.',
    ex4t: '4. Top-k / top-p schneiden den Schwanz', ex4b: 'Trunkierung findet nach dem Softmax statt.',
    ex5t: '5. Strafen bekämpfen Wiederholungen', ex5b: 'Häufigkeitsstrafe skaliert mit Anzahl, Präsenzstrafe ist ein Einmaltreffer.',
    honest: 'Der Antworttext wird aus lokalen Vorlagen zusammengestellt, nicht aus neuronalen Gewichten.',
    presets: { det: 'Deterministisch', bal: 'Ausgewogen', cre: 'Kreativ', chaos: 'Chaotisch' },
    idle: 'Drücken Sie Ausführen um zu beginnen.', running: 'Wird generiert…', done: 'Fertig',
  },
  ar: {
    h1: 'شاهد كيف يختار نموذج اللغة الكلمة التالية',
    lead: 'يُختار كل رمز بنفس الرياضيات التي يستخدمها النموذج الحقيقي: logits مطروحاً منها العقوبات، مقسومة على درجة الحرارة، مقطوعة بـ top-k/top-p، ثم مُعيَّنة.',
    local: '100% في المتصفح', nonet: 'بدون استدعاءات API', seedable: 'قابل للاستنساخ (seed)',
    sysL: 'موجه النظام', sysP: 'أنت مساعد دقيق. أجب باختصار ولا تختلق أبداً.',
    userL: 'رسالة المستخدم', userP: 'ما هي نافذة السياق؟',
    preset: 'إعداد مسبق', run: 'تشغيل', stop: 'إيقاف', reset: 'إعادة تشغيل',
    temp: 'درجة الحرارة', tempH: '0 = دائماً أقوى رمز. القيم الأعلى تُسطح التوزيع.',
    topp: 'Top-p (النواة)', toppH: 'فقط الرموز التي تبلغ احتمالاتها هذه القيمة تبقى في السحب.',
    topk: 'Top-k', topkH: '0 = غير محدود. القيم الصغيرة تقطع الذيل قبل top-p.',
    maxt: 'أقصى رموز الإخراج', maxtH: 'إيقاف صارم. عند الوصول، يصبح finish_reason "length".',
    freq: 'عقوبة التكرار', freqH: 'تخفض logit بنسبة تكرار الرمز.',
    pres: 'عقوبة الحضور', presH: 'بمجرد ظهور رمز، يتلقى logitه ضربة ثابتة.',
    seed: 'البذرة', speed: 'السرعة',
    pipeline: 'خط معالجة البيانات', chat: 'محادثة', dist: 'توزيع الرمز التالي',
    stats: 'القياس عن بعد', model: 'نموذج الحساب والنافذة',
    stepOf: 'خطوة', chosen: 'تم الاختيار', ent: 'الإنتروبيا', cut: 'مقطوع', scrub: 'تصفح الخطوات',
    driftNote: 'الرموز المميزة باللون الأحمر هي سحوبات لم تختر الرمز الأعلى احتمالاً.',
    inTok: 'رموز الإدخال', outTok: 'رموز الإخراج', totalTok: 'الإجمالي', costL: 'التكلفة المقدرة',
    ttft: 'TTFT (محاكاة)', tps: 'رموز/ثانية', ctxUse: 'السياق المستخدم', finish: 'finish_reason',
    drift: 'انحرافات', avgEnt: 'متوسط الإنتروبيا', explain: 'ما الذي حدث فعلاً',
    ex1t: '1. قالب الدور', ex1b: 'تُدمج رسائل النظام والمستخدم والمساعد في تسلسل رموز واحد مع علامات خاصة.',
    ex2t: '2. Logits وليس كلمات', ex2b: 'يُصدر النموذج درجة خام (logit) لكل رمز في المفردات.',
    ex3t: '3. درجة الحرارة تضبط الحدة', ex3b: 'تُقسم logits على درجة الحرارة قبل softmax.',
    ex4t: '4. Top-k / top-p يقطعان الذيل', ex4b: 'يحدث القطع بعد softmax.',
    ex5t: '5. العقوبات تحارب التكرار', ex5b: 'عقوبة التكرار تتدرج مع العدد، وعقوبة الحضور ضربة واحدة.',
    honest: 'نص الرد هنا مُجمَّع من قوالب محلية، وليس من أوزان عصبية.',
    presets: { det: 'حتمي', bal: 'متوازن', cre: 'إبداعي', chaos: 'فوضوي' },
    idle: 'اضغط تشغيل للبدء.', running: 'جارٍ التوليد…', done: 'مكتمل',
  },
  pt: {
    h1: 'Observe como um LLM escolhe a próxima palavra',
    lead: 'Cada token é escolhido com a mesma matemática que um modelo real usa: logits menos penalidades, divididos por temperatura, truncados por top-k/top-p, depois amostrados.',
    local: '100% no navegador', nonet: 'sem chamadas de API', seedable: 'reproduzível (semente)',
    sysL: 'Prompt do sistema', sysP: 'Você é um assistente cuidadoso. Responda brevemente e nunca invente.',
    userL: 'Mensagem do usuário', userP: 'O que é uma janela de contexto?',
    preset: 'Predefinição', run: 'Executar', stop: 'Parar', reset: 'Repetir',
    temp: 'Temperatura', tempH: '0 = sempre o token mais forte. Maior aplana a distribuição.',
    topp: 'Top-p (nucleus)', toppH: 'Apenas os tokens cujas probabilidades somam este valor permanecem.',
    topk: 'Top-k', topkH: '0 = ilimitado. Valores pequenos cortam a cauda antes do top-p.',
    maxt: 'Tokens de saída máximos', maxtH: 'Parada forçada. Quando atingida, finish_reason é "length".',
    freq: 'Penalidade de frequência', freqH: 'Reduz um logit em proporção às aparições do token.',
    pres: 'Penalidade de presença', presH: 'Uma vez que um token aparece, seu logit recebe um golpe fixo.',
    seed: 'Semente', speed: 'Velocidade',
    pipeline: 'Pipeline de processamento', chat: 'Conversa', dist: 'Distribuição do próximo token',
    stats: 'Telemetria', model: 'Modelo para custo e janela',
    stepOf: 'Passo', chosen: 'Escolhido', ent: 'Entropia', cut: 'podado', scrub: 'Navegar nos passos',
    driftNote: 'Tokens marcados em vermelho são sorteios que não escolheram o token de maior probabilidade.',
    inTok: 'Tokens de entrada', outTok: 'Tokens de saída', totalTok: 'Total', costL: 'Custo estimado',
    ttft: 'TTFT (simulado)', tps: 'Tokens/seg', ctxUse: 'Contexto usado', finish: 'finish_reason',
    drift: 'Desvios', avgEnt: 'Entropia média', explain: 'O que realmente aconteceu',
    ex1t: '1. Modelo de papel', ex1b: 'Mensagens de sistema, usuário e assistente são achatadas em uma sequência de tokens.',
    ex2t: '2. Logits, não palavras', ex2b: 'O modelo emite uma pontuação bruta (logit) para cada token do vocabulário.',
    ex3t: '3. Temperatura define a nitidez', ex3b: 'Os logits são divididos pela temperatura antes do softmax.',
    ex4t: '4. Top-k / top-p cortam a cauda', ex4b: 'O truncamento acontece após o softmax.',
    ex5t: '5. Penalidades combatem a repetição', ex5b: 'A penalidade de frequência escala com a contagem, a de presença é um golpe único.',
    honest: 'O texto de resposta aqui é montado a partir de modelos locais, não de pesos neurais.',
    presets: { det: 'Determinístico', bal: 'Equilibrado', cre: 'Criativo', chaos: 'Caótico' },
    idle: 'Pressione Executar para começar.', running: 'Gerando…', done: 'Concluído',
  },
  ru: {
    h1: 'Наблюдайте, как LLM выбирает следующее слово',
    lead: 'Каждый токен выбирается с той же математикой, что использует реальная модель: логиты минус штрафы, делённые на температуру, усечённые top-k/top-p, затем сэмплированные.',
    local: '100% в браузере', nonet: 'без вызовов API', seedable: 'воспроизводимо (seed)',
    sysL: 'Системный промпт', sysP: 'Вы внимательный помощник. Отвечайте кратко и не выдумывайте.',
    userL: 'Сообщение пользователя', userP: 'Что такое контекстное окно?',
    preset: 'Пресет', run: 'Запустить', stop: 'Остановить', reset: 'Повторить',
    temp: 'Температура', tempH: '0 = всегда самый сильный токен. Выше — распределение становится более равномерным.',
    topp: 'Top-p (nucleus)', toppH: 'Только токены, вероятности которых в сумме дают это значение, остаются в выборке.',
    topk: 'Top-k', topkH: '0 = без ограничений. Малые значения обрезают хвост раньше top-p.',
    maxt: 'Макс. выходных токенов', maxtH: 'Жёсткий стоп. При достижении finish_reason становится "length".',
    freq: 'Штраф за частоту', freqH: 'Снижает логит пропорционально частоте появления токена.',
    pres: 'Штраф за присутствие', presH: 'Как только токен появился, его логит получает фиксированный штраф.',
    seed: 'Зерно', speed: 'Скорость',
    pipeline: 'Конвейер обработки', chat: 'Диалог', dist: 'Распределение следующего токена',
    stats: 'Телеметрия', model: 'Модель для расчёта стоимости и окна',
    stepOf: 'Шаг', chosen: 'Выбран', ent: 'Энтропия', cut: 'усечено', scrub: 'Перебрать шаги',
    driftNote: 'Красные токены — это выборки, которые не выбрали токен с наибольшей вероятностью.',
    inTok: 'Входных токенов', outTok: 'Выходных токенов', totalTok: 'Итого', costL: 'Оценочная стоимость',
    ttft: 'TTFT (симуляция)', tps: 'Токенов/с', ctxUse: 'Использовано контекста', finish: 'finish_reason',
    drift: 'Отклонений', avgEnt: 'Средняя энтропия', explain: 'Что на самом деле произошло',
    ex1t: '1. Шаблон ролей', ex1b: 'Системные, пользовательские и ассистентские сообщения сворачиваются в одну последовательность токенов.',
    ex2t: '2. Логиты, а не слова', ex2b: 'Модель выдаёт один сырой балл (логит) для каждого токена в словаре.',
    ex3t: '3. Температура задаёт резкость', ex3b: 'Логиты делятся на температуру перед softmax.',
    ex4t: '4. Top-k / top-p отсекают хвост', ex4b: 'Усечение происходит после softmax.',
    ex5t: '5. Штрафы борются с повторениями', ex5b: 'Штраф за частоту масштабируется с количеством, штраф за присутствие — разовый.',
    honest: 'Текст ответа здесь собирается из локальных шаблонов, а не из нейронных весов.',
    presets: { det: 'Детерминированный', bal: 'Сбалансированный', cre: 'Творческий', chaos: 'Хаотичный' },
    idle: 'Нажмите «Запустить» для начала.', running: 'Генерация…', done: 'Готово',
  },
  ko: {
    h1: 'LLM이 다음 단어를 선택하는 과정 관찰하기',
    lead: '아래의 모든 토큰은 실제 모델과 동일한 수학으로 선택됩니다: 로짓에서 패널티를 빼고, 온도로 나누고, top-k/top-p로 잘라내고, 그런 다음 샘플링합니다.',
    local: '100% 브라우저 내 실행', nonet: 'API 호출 없음', seedable: '재현 가능 (시드)',
    sysL: '시스템 프롬프트', sysP: '당신은 신중한 어시스턴트입니다. 간결하게 답하고 절대 지어내지 마세요.',
    userL: '사용자 메시지', userP: '컨텍스트 윈도우란 무엇인가요?',
    preset: '프리셋', run: '실행', stop: '중지', reset: '다시 보기',
    temp: '온도 (Temperature)', tempH: '0 = 항상 가장 강한 토큰. 높을수록 분포가 평탄해집니다.',
    topp: 'Top-p (nucleus)', toppH: '확률 합이 이 값에 도달하는 상위 토큰만 추첨에 남습니다.',
    topk: 'Top-k', topkH: '0 = 무제한. 작은 값은 top-p보다 먼저 꼬리를 자릅니다.',
    maxt: '최대 출력 토큰', maxtH: '하드 정지. 도달 시 finish_reason이 "length"가 됩니다.',
    freq: '빈도 패널티', freqH: '토큰 출현 빈도에 비례해 로짓을 낮춥니다.',
    pres: '존재 패널티', presH: '토큰이 한 번이라도 나타나면 로짓이 고정 감소합니다.',
    seed: '시드', speed: '속도',
    pipeline: '처리 파이프라인', chat: '대화', dist: '다음 토큰 분포',
    stats: '텔레메트리', model: '비용 및 윈도우 계산 모델',
    stepOf: '단계', chosen: '선택됨', ent: '엔트로피', cut: '잘림', scrub: '단계 탐색',
    driftNote: '빨간색으로 표시된 토큰은 가장 높은 확률의 토큰을 선택하지 않은 샘플링 결과입니다.',
    inTok: '입력 토큰', outTok: '출력 토큰', totalTok: '총계', costL: '예상 비용',
    ttft: 'TTFT (시뮬레이션)', tps: '토큰/초', ctxUse: '사용된 컨텍스트', finish: 'finish_reason',
    drift: '드리프트', avgEnt: '평균 엔트로피', explain: '실제로 무슨 일이 일어났나',
    ex1t: '1. 역할 템플릿', ex1b: '시스템, 사용자, 어시스턴트 메시지가 특수 마커와 함께 하나의 토큰 시퀀스로 결합됩니다.',
    ex2t: '2. 로짓, 단어가 아님', ex2b: '모델은 어휘의 모든 토큰에 대해 하나의 원시 점수(로짓)를 출력합니다.',
    ex3t: '3. 온도가 선명도를 설정', ex3b: '로짓은 softmax 전에 온도로 나눠집니다.',
    ex4t: '4. Top-k / top-p가 꼬리를 자름', ex4b: '잘라내기는 softmax 이후에 발생합니다.',
    ex5t: '5. 패널티가 반복을 억제', ex5b: '빈도 패널티는 횟수에 비례하고, 존재 패널티는 일회성입니다.',
    honest: '여기의 응답 텍스트는 신경망 가중치가 아닌 로컬 템플릿에서 조합된 것입니다.',
    presets: { det: '결정론적', bal: '균형', cre: '창의적', chaos: '혼돈' },
    idle: '실행을 눌러 시작하세요.', running: '생성 중…', done: '완료',
  },
};

const PRESETS = {
  det:   { temp: 0,    topP: 1,    topK: 0,  freqPen: 0,   presPen: 0 },
  bal:   { temp: 0.7,  topP: 0.9,  topK: 40, freqPen: 0,   presPen: 0 },
  cre:   { temp: 1.2,  topP: 0.95, topK: 0,  freqPen: 0.3, presPen: 0.1 },
  chaos: { temp: 1.9,  topP: 1,    topK: 0,  freqPen: 0,   presPen: 0 },
};

const STAGES = {
  id: ['Template peran & penggabungan pesan', 'Tokenisasi masukan', 'Embedding + posisi', 'Lapisan transformer (self-attention)', 'Logit vokabulari', 'Penalti pengulangan', 'Pembagian suhu', 'Pemangkasan top-k / top-p', 'Sampling & streaming'],
  en: ['Role template & message merge', 'Input tokenization', 'Embedding + positions', 'Transformer layers (self-attention)', 'Vocabulary logits', 'Repetition penalties', 'Temperature scaling', 'Top-k / top-p truncation', 'Sampling & streaming'],
  es: ['Plantilla de rol y fusión de mensajes', 'Tokenización de entrada', 'Embeddings + posiciones', 'Capas transformer (self-attention)', 'Logits del vocabulario', 'Penalizaciones de repetición', 'Escalado de temperatura', 'Truncamiento top-k / top-p', 'Muestreo y streaming'],
  zh: ['角色模板与消息合并', '输入 Tokenization', 'Embedding + 位置编码', 'Transformer 层（自注意力）', '词表 Logit', '重复惩罚', '温度缩放', 'Top-k / Top-p 截断', '采样与流式输出'],
  ja: ['ロールテンプレート & メッセージ結合', '入力トークナイズ', '埋め込み + 位置', 'Transformerレイヤー（自己注意）', '語彙Logit', '繰り返しペナルティ', '温度スケーリング', 'Top-k / Top-p切り詰め', 'サンプリング & ストリーミング'],
  fr: ["Modele de role & fusion des messages", "Tokenisation de l'entree", "Embeddings + positions", "Couches transformer (auto-attention)", "Logits du vocabulaire", "Penalites de repetition", "Mise a l'echelle de la temperature", "Troncature top-k / top-p", "Echantillonnage & streaming"],
  de: ['Rollenvorlage & Nachrichtenzusammenführung', 'Eingabe-Tokenisierung', 'Einbettungen + Positionen', 'Transformer-Schichten (Self-Attention)', 'Vokabular-Logits', 'Wiederholungsstrafen', 'Temperaturskalierung', 'Top-k / Top-p-Trunkierung', 'Sampling & Streaming'],
  ar: ['قالب الدور ودمج الرسائل', 'ترميز الإدخال', 'تضمينات + مواضع', 'طبقات المحول (الانتباه الذاتي)', 'لوجيتات المفردات', 'عقوبات التكرار', 'تحجيم درجة الحرارة', 'اقتطاع top-k / top-p', 'أخذ العينات والبث'],
  pt: ['Modelo de papel & mesclagem de mensagens', 'Tokenização da entrada', 'Embeddings + posições', 'Camadas transformer (auto-atenção)', 'Logits do vocabulário', 'Penalidades de repetição', 'Escalonamento de temperatura', 'Truncamento top-k / top-p', 'Amostragem & streaming'],
  ru: ['Шаблон ролей & объединение сообщений', 'Токенизация входа', 'Эмбеддинги + позиции', 'Слои трансформера (самовнимание)', 'Логиты словаря', 'Штрафы за повторение', 'Масштабирование температуры', 'Усечение top-k / top-p', 'Сэмплирование & стриминг'],
  ko: ['역할 템플릿 & 메시지 병합', '입력 토크나이제이션', '임베딩 + 위치', '트랜스포머 레이어 (자기 주의)', '어휘 로짓', '반복 패널티', '온도 스케일링', 'Top-k / Top-p 잘라내기', '샘플링 & 스트리밍'],
};

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

export function render(root, ctx) {
  const t = S[ctx.lang] || S.en || S.id;
  const p = { ...PRESETS.bal, maxTokens: 120, seed: 42, speed: 4, model: 'gpt-4o-mini' };
  let alive = true;
  let running = false;
  let steps = [];

  /* ---------- kolom kiri: kontrol ---------- */
  const sysBox = el('textarea', { id: 'simSys', rows: 3, spellcheck: 'false' }, [t.sysP]);
  const userBox = el('textarea', { id: 'simUser', rows: 3, spellcheck: 'false' }, [t.userP]);

  const presetRow = el('div.chips', {}, Object.entries(t.presets).map(([k, label]) =>
    el('button.chip', {
      type: 'button',
      onclick: () => {
        Object.assign(p, PRESETS[k]);
        [...presetRow.children].forEach((c) => c.setAttribute('aria-pressed', 'false'));
        presetRow.querySelector(`[data-k="${k}"]`).setAttribute('aria-pressed', 'true');
        syncSliders();
      },
      'aria-pressed': k === 'bal' ? 'true' : 'false',
      dataset: { k },
    }, [label])));

  const sliderRefs = {};
  const mkSlider = (key, label, hint, min, max, stp, fmt) => {
    const s = slider({ label, hint, min, max, step: stp, value: p[key], fmt, onInput: (v) => { p[key] = v; } });
    sliderRefs[key] = { node: s, fmt };
    return s;
  };
  function syncSliders() {
    for (const [key, ref] of Object.entries(sliderRefs)) {
      const input = ref.node.querySelector('input');
      input.value = p[key];
      ref.node.querySelector('.param-val').textContent = ref.fmt(p[key]);
    }
  }

  const runBtn = el('button.btn.btn-primary', { type: 'button', onclick: () => (running ? stop() : run()) }, [t.run]);
  const seedInput = el('input', {
    type: 'number', min: 1, max: 99999, value: p.seed, 'aria-label': t.seed,
    oninput: (e) => { p.seed = parseInt(e.target.value || '1', 10); },
  });
  const speedSel = el('select', { 'aria-label': t.speed, onchange: (e) => { p.speed = parseFloat(e.target.value); } }, [
    el('option', { value: '1' }, ['1x']),
    el('option', { value: '4', selected: true }, ['4x']),
    el('option', { value: '12' }, ['12x']),
    el('option', { value: '999' }, [ctx.lang === 'id' ? 'instan' : 'instant']),
  ]);
  const modelSel = el('select', { 'aria-label': t.model, onchange: (e) => { p.model = e.target.value; paint(); } },
    MODELS.map((m) => el('option', { value: m.id, selected: m.id === p.model }, [`${m.name} · ${compact(m.ctx)}`])));

  const controls = card(null, [
    el('div.stack', {}, [
      el('div', {}, [el("label", { for: "simSys" }, [t.sysL]), sysBox]),
      el('div', {}, [el('label', { for: 'simUser' }, [t.userL]), userBox]),
      el('div.row', {}, [runBtn, el('button.btn', { type: 'button', onclick: reset }, [t.reset])]),
      el('hr.hr'),
      el('div.row-between', {}, [el('label', {}, [t.preset]), el('span')]),
      presetRow,
      mkSlider('temp', t.temp, t.tempH, 0, 2, 0.05, (v) => v.toFixed(2)),
      mkSlider('topP', t.topp, t.toppH, 0.05, 1, 0.01, (v) => v.toFixed(2)),
      mkSlider('topK', t.topk, t.topkH, 0, 50, 1, (v) => (v === 0 ? '∞' : String(v))),
      mkSlider('maxTokens', t.maxt, t.maxtH, 8, 400, 4, (v) => String(v)),
      mkSlider('freqPen', t.freq, t.freqH, 0, 2, 0.05, (v) => v.toFixed(2)),
      mkSlider('presPen', t.pres, t.presH, 0, 2, 0.05, (v) => v.toFixed(2)),
      el('hr.hr'),
      el('div.grid.g-2', {}, [
        el('div', {}, [el('label', {}, [t.seed]), seedInput]),
        el('div', {}, [el('label', {}, [t.speed]), speedSel]),
      ]),
      el('div', {}, [el('label', {}, [t.model]), modelSel]),
    ]),
  ], { cls: 'sticky-side' });

  /* ---------- pipeline ---------- */
  const stageNodes = STAGES[ctx.lang === 'en' ? 'en' : 'id'].map((label, i) =>
    el('div.stage', { dataset: { i } }, [el('i', { text: String(i + 1) }), el('span', { text: label }), el('span.stage-note')]));
  const pipeCard = card(t.pipeline, [el('div.pipeline', {}, stageNodes)], { h3: true });

  /* ---------- chat ---------- */
  const aiBody = el('div.msg-body');
  const caret = el('span.caret', { hidden: true });
  const chatBox = el('div.chat', {}, [
    el('div.msg.msg-sys', {}, [el('span.msg-role', { text: 'system' }), el('div.msg-body', { text: sysBox.value })]),
    el('div.msg.msg-user', {}, [el('span.msg-role', { text: 'user' }), el('div.msg-body', { text: userBox.value })]),
    el('div.msg.msg-ai', {}, [el('span.msg-role', { text: 'assistant' }), el('div', {}, [aiBody, caret])]),
  ]);
  const statusBadge = el('span.badge', { text: t.idle });
  const chatCard = card(t.chat, [chatBox, el('p.card-sub', { text: t.driftNote, style: { marginTop: '10px', marginBottom: 0 } })], {
    h3: true,
    aside: el('div.row', {}, [statusBadge, copyBtn(() => aiBody.textContent, ctx.lang === 'id' ? 'Salin' : 'Copy')]),
  });

  /* ---------- distribusi ---------- */
  const distBox = el('div.dist');
  const distMeta = el('div.row-between', {}, [el('span.badge', { text: '—' }), el('span.badge', { text: 'H = —' })]);
  const scrub = el('input', {
    type: 'range', min: 0, max: 0, value: 0, disabled: true, 'aria-label': t.scrub,
    oninput: (e) => showStep(parseInt(e.target.value, 10)),
  });
  const distCaption = el('p.card-sub', {
    text: ctx.lang === 'id'
      ? 'Persen = peluang setelah pembagian suhu, sebelum pemangkasan. Baris bergaris dibuang oleh top-k/top-p sehingga peluangnya menjadi nol saat pengundian.'
      : 'Percentages are probabilities after temperature, before truncation. Struck-through rows are removed by top-k/top-p, so their odds at draw time are zero.',
    style: { marginTop: '10px', marginBottom: 0 },
  });
  const distCard = card(t.dist, [distMeta, distBox, distCaption, el('div', { style: { marginTop: '10px' } }, [el('label', {}, [t.scrub]), scrub])], { h3: true });

  /* ---------- telemetri ---------- */
  const cells = {};
  const mkStat = (key, label, sub) => { const n = stat(label, '—', sub); cells[key] = n.querySelector('.stat-v'); return n; };
  const ctxMeter = meter(0);
  const statsCard = card(t.stats, [
    el('div.grid.g-4', {}, [
      mkStat('inTok', t.inTok), mkStat('outTok', t.outTok), mkStat('totalTok', t.totalTok), mkStat('cost', t.costL),
    ]),
    el('hr.hr'),
    el('div.grid.g-4', {}, [
      mkStat('ttft', t.ttft, 'ms'), mkStat('tps', t.tps, 'tok/s'), mkStat('drift', t.drift), mkStat('ent', t.avgEnt, 'bit'),
    ]),
    el('hr.hr'),
    el('div.stack', {}, [
      el('div.row-between', {}, [el('span.stat-k', { text: t.ctxUse }), el('span.stat-k', {}, [cells.ctxTxt = el('span', { text: '—' })])]),
      ctxMeter,
      el('div.row-between', {}, [el('span.stat-k', { text: t.finish }), el('code', {}, [cells.finish = el('span', { text: '—' })])]),
    ]),
  ], { h3: true });

  /* ---------- penjelasan ---------- */
  const explainCard = card(t.explain, [
    [['ex1t', 'ex1b'], ['ex2t', 'ex2b'], ['ex3t', 'ex3b'], ['ex4t', 'ex4b'], ['ex5t', 'ex5b']].map(([a, b]) =>
      el('details.acc', {}, [el('summary', { text: t[a] }), el('div.acc-body', {}, [el('p', { text: t[b] })])])),
  ], { h3: true });

  root.append(
    el('header.head', {}, [
      el('span.eyebrow', { text: 'Simulator' }),
      el('h1', { text: t.h1 }),
      el('p', { text: t.lead }),
      el('div.hero-metrics', { style: { marginTop: '12px' } }, [
        el('span.badge.badge-ok', { text: t.local }),
        el('span.badge', { text: t.nonet }),
        el('span.badge', { text: t.seedable }),
      ]),
    ]),
    el('div.split', {}, [controls, el('div.stack', {}, [pipeCard, chatCard, distCard, statsCard, explainCard])]),
    el('div.note', { style: { marginTop: '16px' } }, [el('span', {}, [el('strong', { text: ctx.lang === 'id' ? 'Catatan jujur: ' : 'Honest note: ' }), t.honest])]),
  );

  /* ---------- logika ---------- */
  function setStage(i, state) {
    stageNodes.forEach((n, k) => {
      n.className = 'stage' + (k === i ? ' active' : k < i ? ' done' : '');
    });
    if (state && stageNodes[i]) stageNodes[i].querySelector('.stage-note').textContent = state;
  }

  function paint(res = {}) {
    const m = byId(p.model);
    const inTok = res.inTok ?? 0, outTok = res.outTok ?? 0;
    cells.inTok.textContent = nf(inTok);
    cells.outTok.textContent = nf(outTok);
    cells.totalTok.textContent = nf(inTok + outTok);
    cells.cost.textContent = usd(cost(m, inTok, outTok));
    const used = inTok + outTok;
    const pct = (used / m.ctx) * 100;
    cells.ctxTxt.textContent = `${nf(used)} / ${compact(m.ctx)} (${pct < 0.1 && used ? '<0,1' : nf(pct, 2)}%)`;
    ctxMeter.querySelector('i').style.width = Math.min(100, Math.max(pct, used ? 0.6 : 0)) + '%';
  }

  function distRows(dist, chosen) {
    distBox.textContent = '';
    dist.slice(0, 8).forEach((c) => {
      // Persen & panjang batang selalu peluang hasil softmax (setelah suhu,
      // sebelum pemangkasan). Baris bergaris = dibuang oleh top-k/top-p.
      const row = el('div.dist-row' + (c.cut ? '.cut' : '') + (c === chosen ? '.picked' : ''), {}, [
        el('span.dist-tok', { text: displayToken(c.s), title: `logit ${c.logit.toFixed(2)}${c.penalty ? ` − penalti ${c.penalty.toFixed(2)}` : ''}` }),
        el('div.dist-bar', {}, [el('i', { style: { width: (c.p * 100).toFixed(1) + '%' } })]),
        el('span.dist-p', { text: c.p.toLocaleString(undefined, { style: 'percent', maximumFractionDigits: 1 }) }),
      ]);
      distBox.append(row);
    });
  }

  function showStep(i) {
    const s = steps[i];
    if (!s) return;
    distMeta.children[0].textContent = `${t.stepOf} ${i + 1}/${steps.length} · ${t.chosen}: "${displayToken(s.chosen.s)}"`;
    distMeta.children[1].textContent = `H = ${s.entropy.toFixed(2)} bit · ${s.kept} ${ctx.lang === 'id' ? 'lolos pangkas' : 'survive truncation'}`;
    distRows(s.dist, s.chosen);
  }

  function reset() {
    stop();
    steps = [];
    aiBody.textContent = '';
    distBox.textContent = '';
    distMeta.children[0].textContent = '—';
    distMeta.children[1].textContent = 'H = —';
    scrub.disabled = true; scrub.max = 0; scrub.value = 0;
    statusBadge.textContent = t.idle;
    statusBadge.className = 'badge';
    cells.finish.textContent = '—';
    setStage(-1);
    paint();
  }

  function stop() {
    running = false;
    runBtn.textContent = t.run;
    caret.hidden = true;
  }

  async function run() {
    if (running) return;
    running = true;
    runBtn.textContent = t.stop;
    steps = [];
    aiBody.textContent = '';
    caret.hidden = false;
    statusBadge.textContent = t.running;
    statusBadge.className = 'badge badge-accent';
    chatBox.children[0].querySelector('.msg-body').textContent = sysBox.value;
    chatBox.children[1].querySelector('.msg-body').textContent = userBox.value;

    const plan = planReply({ system: sysBox.value, user: userBox.value, lang: ctx.lang });
    const inTok = countTokens(sysBox.value) + countTokens(userBox.value) + 8; // +8: penanda peran
    const planned = tokenize(plan.text, 'bpe').tokens.map((x) => x.s);
    const lat = latencyModel(inTok);
    cells.ttft.textContent = nf(lat.ttft);
    cells.tps.textContent = nf(lat.tps);
    paint({ inTok, outTok: 0 });

    const stepDelay = p.speed >= 999 ? 0 : Math.max(0, (1000 / lat.tps) / p.speed);
    const preDelay = reduced() || p.speed >= 999 ? 0 : Math.min(260, 90 * (4 / Math.min(p.speed, 4)));

    for (let i = 0; i < 4; i++) {
      if (!alive || !running) return stop();
      const note = i === 1 ? `${inTok} tok` : i === 3 ? '32 layers ×' : '';
      setStage(i, note);
      if (preDelay) await wait(preDelay);
    }
    if (!alive || !running) return stop();

    const rand = rng(p.seed);
    const counts = new Map();
    const seen = [];
    let planIdx = 0;
    let driftRun = 0;
    let drifts = 0;
    let entSum = 0;
    let out = '';
    const parts = [];

    while (running && alive && planIdx < planned.length && parts.length < p.maxTokens) {
      const target = planned[planIdx];
      const cands = candidatesFor(target, planIdx, seen, ctx.lang);
      const res = decodeStep(cands, p, counts, rand);
      const isDrift = res.chosen.s !== target;

      setStage(4 + Math.min(4, (parts.length % 5)));
      steps.push(res);
      entSum += res.entropy;
      parts.push({ s: res.chosen.s, drift: isDrift });
      counts.set(res.chosen.s, (counts.get(res.chosen.s) || 0) + 1);
      seen.push(res.chosen.s);
      out += res.chosen.s;

      if (isDrift) { drifts++; driftRun++; if (driftRun >= 2) { driftRun = 0; planIdx++; } }
      else { driftRun = 0; planIdx++; }

      // gambar keluaran (token menyimpang diberi latar merah)
      aiBody.textContent = '';
      parts.forEach((x) => aiBody.append(x.drift ? el('span.drift', { text: x.s }) : document.createTextNode(x.s)));
      showStep(steps.length - 1);
      cells.drift.textContent = nf(drifts);
      cells.ent.textContent = (entSum / steps.length).toFixed(2);
      paint({ inTok, outTok: parts.length });
      if (stepDelay) await wait(stepDelay);
    }

    setStage(8, `${parts.length} tok`);
    stageNodes.forEach((n) => n.classList.add('done'));
    cells.finish.textContent = parts.length >= p.maxTokens ? 'length' : 'stop';
    statusBadge.textContent = t.done;
    statusBadge.className = 'badge badge-ok';
    scrub.disabled = steps.length === 0;
    scrub.max = Math.max(0, steps.length - 1);
    scrub.value = Math.max(0, steps.length - 1);
    stop();
    if (parts.length >= p.maxTokens) toast(ctx.lang === 'id' ? 'Berhenti karena batas maks token' : 'Stopped by max token limit');
    void out;
  }

  paint();
  return () => { alive = false; running = false; };
}
