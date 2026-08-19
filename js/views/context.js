/* ============================================================
   views/context.js — Jendela konteks & memori percakapan
   ============================================================ */

import { el, card, stat, meter, slider, nf, compact, usd } from '../lib/ui.js';
import { MODELS, byId, REFERENCES, tokensForWords, cost, PRICE_NOTE } from '../data/models.js';

export const meta = { title: { id: 'Konteks', en: 'Context' } };

const S = {
  id: {
    h1: 'Context window adalah seluruh memori model, habis per panggilan',
    lead: 'Model tidak punya ingatan antar panggilan. Yang ia "ingat" hanyalah token yang Anda kirimkan ulang setiap kali. Context window adalah batas keras seberapa banyak teks yang bisa ia proses sekaligus — dan Anda membayar seluruh teks itu di setiap giliran.',
    cmp: 'Perbandingan context window',
    cmpHint: 'Batang menggunakan skala logaritmik karena 2 juta token dan 16 ribu token tidak bisa dibandingkan di skala linear biasa.',
    fit: 'Muat apa saja di dalamnya?',
    fitHint: 'Pilih panjang bahan bacaan di bawah untuk melihat berapa kali bahan itu muat di context window masing-masing model, dan berapa biaya membacanya sekali.',
    refL: 'Bahan acuan',
    customL: 'Atau masukkan jumlah kata sendiri',
    langL: 'Bahasa bahan bacaan',
    words: 'kata',
    tokens: 'token',
    pages: 'halaman A4',
    minutes: 'menit dibacakan',
    fits: 'kali muat',
    once: 'sekali kirim',
    win: 'Simulasi memori percakapan',
    winHint: 'Percakapan panjang tidak "diingat" oleh model — giliran paling lama akan terlempar keluar dari jendela. Tambah giliran di bawah dan lihat apa yang hilang lebih dulu.',
    budget: 'Batas jendela (token)',
    addTurn: 'Tambah giliran',
    reset: 'Kosongkan',
    summarize: 'Ringkas giliran lama daripada dibuang',
    usedL: 'Terpakai',
    droppedL: 'Terbuang',
    turnsL: 'Giliran aktif',
    billedL: 'Biaya masukan giliran berikutnya',
    sysPin: 'sistem (tersemat)',
    sumTag: 'ringkasan',
    empty: 'Belum ada giliran percakapan. Tekan "Tambah giliran" untuk mencoba.',
    facts: 'Hal yang wajib dipahami soal context window',
    f1t: 'Setiap giliran membayar ulang seluruh riwayat',
    f1b: 'Di giliran ke-20, Anda mengirim ulang 19 giliran sebelumnya sebagai token masukan. Biaya percakapan bertambah kuadratik terhadap panjang giliran, bukan linear.',
    f2t: 'Jendela besar bukan berarti pemahaman merata',
    f2b: 'Riset needle-in-a-haystack berulang kali menunjukkan model lebih mudah mengingat informasi di awal dan akhir teks daripada di tengah-tengah (fenomena "lost in the middle").',
    f3t: 'Perhatian (attention) menghitung setiap token terhadap token lain',
    f3b: 'Biaya komputasi self-attention berskala O(N^2) terhadap panjang teks. Memproses 100 ribu token bukan 10x lebih berat dari 10 ribu token, melainkan mendekati 100x lebih berat di level perangkat keras.',
    f4t: 'Jendela besar bukan pengganti RAG',
    f4b: 'Menjejali seluruh dokumen perusahaan ke dalam prompt boros biaya dan menurunkan akurasi. RAG (retrieval-augmented generation) hanya mengambil 5–20 potongan paling relevan: lebih murah, lebih cepat, dan bisa diaudit.',
    f5t: 'Keluaran punya batas sendiri yang terpisah',
    f5b: 'Context window dan max output tokens adalah dua batas berbeda. Model dengan jendela 200 ribu token tetap hanya bisa mengeluarkan 4.096–8.192 token per jawaban.',
    chunks: 'potongan',
  },
  en: {
    h1: 'The context window is all the memory, spent every turn',
    lead: 'A model has zero memory between requests. Everything it "remembers" is the tokens you resend each time. The context window is the hard cap on how much text fits — and you pay for that entire history on every single turn.',
    cmp: 'Context window comparison',
    cmpHint: 'Bars use a logarithmic scale because 2M tokens and 16K tokens cannot be legibly rendered on a linear axis.',
    fit: 'What actually fits inside?',
    fitHint: 'Choose a reading material length below to see how many times it fits in each model, and what it costs to send once.',
    refL: 'Reference material',
    customL: 'Or your own word count',
    langL: 'Material language',
    words: 'words',
    tokens: 'tokens',
    pages: 'A4 pages',
    minutes: 'mins read aloud',
    fits: 'fits',
    once: 'per single send',
    win: 'Chat memory simulation',
    winHint: 'Long chats are not "remembered" — oldest turns slide out of the window. Add turns below and watch what drops first.',
    budget: 'Window budget (tokens)',
    addTurn: 'Add turn',
    reset: 'Clear',
    summarize: 'Summarise old turns instead of dropping',
    usedL: 'Used',
    droppedL: 'Dropped',
    turnsL: 'Active turns',
    billedL: 'Next turn input cost',
    sysPin: 'system (pinned)',
    sumTag: 'summary',
    empty: 'No chat turns yet. Press "Add turn" to try.',
    facts: 'What you need to understand about context windows',
    f1t: 'Every turn repays for the whole history',
    f1b: 'On turn 20 you resend the previous 19 turns as input tokens. Chat cost grows quadratically with turn count, not linearly.',
    f2t: 'A huge window is not uniform comprehension',
    f2b: 'Needle-in-a-haystack evaluations repeatedly show accuracy drops in the middle of long contexts ("lost in the middle").',
    f3t: 'Attention scales quadratically',
    f3b: 'Self-attention compute grows with the square of sequence length. 100K tokens is not 10x heavier than 10K — it is closer to 100x at the hardware level.',
    f4t: 'A huge window is not a replacement for RAG',
    f4b: 'Stuffing an entire company knowledge base into every prompt is wasteful and degrades accuracy. RAG fetches 5–20 relevant chunks: cheaper, faster, auditable.',
    f5t: 'Output has its own separate cap',
    f5b: 'Context window and max output tokens are different limits. A 200K-window model may still be allowed only 8K tokens per answer.',
    chunks: 'chunks',
  },
  es: {
    h1: 'La ventana de contexto es toda la memoria, gastada en cada turno',
    lead: 'Un modelo no tiene memoria entre solicitudes. Todo lo que "recuerda" son los tokens que reenvías cada vez.',
    cmp: 'Comparación de ventanas de contexto', cmpHint: 'Las barras usan una escala logarítmica.',
    fit: '¿Qué cabe realmente dentro?', fitHint: 'Elige una longitud y mira cuántas veces cabe.',
    refL: 'Material de referencia', customL: 'O tu propio recuento de palabras', langL: 'Idioma del material',
    words: 'palabras', tokens: 'tokens', pages: 'páginas A4', minutes: 'minutos en voz alta',
    fits: 'veces cabe', once: 'por envío único',
    win: 'Simulación de memoria de chat', winHint: 'Las conversaciones largas no se recuerdan — los turnos antiguos se caen.',
    budget: 'Presupuesto de ventana (tokens)',
    addTurn: 'Agregar turno', reset: 'Limpiar', summarize: 'Resumir turnos antiguos en vez de descartarlos',
    usedL: 'Usado', droppedL: 'Descartado', turnsL: 'Turnos activos', billedL: 'Costo de entrada próx. turno',
    sysPin: 'sistema (fijado)', sumTag: 'resumen',
    empty: 'Aún no hay turnos. Presiona "Agregar turno".',
    facts: 'Lo que debes entender sobre la ventana de contexto',
    f1t: 'Cada turno paga de nuevo por todo el historial', f1b: 'En el turno 20 reenvías los 19 turnos anteriores como tokens de entrada.',
    f2t: 'Una ventana grande no es comprensión uniforme', f2b: 'Las pruebas muestran que la precisión cae en el medio de contextos largos.',
    f3t: 'La atención escala cuadráticamente', f3b: 'El cálculo de autoatención crece con el cuadrado de la longitud.',
    f4t: 'Una ventana grande no reemplaza a RAG', f4b: 'Meter toda una base de conocimiento en cada prompt es ineficiente.',
    f5t: 'La salida tiene su propio límite', f5b: 'La ventana de contexto y el límite de salida son restricciones distintas.',
    chunks: 'fragmentos',
  },
  zh: {
    h1: '上下文窗口：每次调用都会消耗的全部记忆',
    lead: '模型在请求之间没有记忆。它所"记住"的，只是你每次重新发送的 Token。上下文窗口是这些 Token 的硬性上限——每轮对话都要重新付费。',
    cmp: '上下文窗口对比', cmpHint: '条形图使用对数刻度，因为 200 万与 1.6 万 Token 无法在线性轴上有效对比。',
    fit: '实际能装入什么？', fitHint: '选择一段材料的长度，查看它能装几次以及单次发送的费用。',
    refL: '参考材料', customL: '或自定义词数', langL: '材料语言',
    words: '词数', tokens: 'Token 数', pages: 'A4 页数', minutes: '朗读时长',
    fits: '适合', once: '每次发送',
    win: '对话记忆模拟器', winHint: '长对话不会被"记住"——最旧的轮次会滑出窗口。添加轮次，观察什么先消失。',
    budget: '窗口预算（Token）',
    addTurn: '添加轮次', reset: '清空', summarize: '摘要旧轮次而非丢弃',
    usedL: '已用', droppedL: '已丢弃', turnsL: '活跃轮次', billedL: '下轮输入费用',
    sysPin: 'system（固定）', sumTag: '摘要',
    empty: '暂无轮次。请按"添加轮次"。',
    facts: '必须了解的知识',
    f1t: '每轮都要为整个历史重新付费', f1b: '第 20 轮时，你需要将前 19 轮作为输入 Token 重新发送。对话成本与轮次数成平方增长，而非线性。',
    f2t: '大窗口并不意味着均匀理解', f2b: '大海捞针测试反复表明，在长上下文的中间部分准确率会下降。',
    f3t: '注意力机制二次方扩展', f3b: '自注意力计算量随序列长度的平方增长。上下文翻倍不只是翻倍成本——还会增加延迟。',
    f4t: '大窗口不能替代检索', f4b: '将整个知识库塞入每个请求既浪费又降低准确率。RAG 只获取 5-20 个相关片段：更便宜、更快、更易审计。',
    f5t: '输出有自己的独立上限', f5b: '上下文窗口和最大输出 Token 是不同的限制。20 万 Token 窗口的模型每次回答可能只允许 8000 Token。',
    chunks: '片段',
  },
  ja: {
    h1: 'コンテキストウィンドウは毎回消費される全メモリです',
    lead: 'モデルはリクエスト間で記憶を持ちません。記憶しているのは毎回再送信するトークンだけです。',
    cmp: 'コンテキストウィンドウ比較', cmpHint: 'バーは対数スケールを使用しています。',
    fit: '実際に何が入るか？', fitHint: '材料の長さを選んで、各モデルに何回入るか確認してください。',
    refL: '参照資料', customL: 'または単語数を入力', langL: '資料の言語',
    words: '単語', tokens: 'トークン', pages: 'A4ページ', minutes: '朗読分',
    fits: '回収容', once: '1回送信あたり',
    win: 'チャットメモリシミュレーション', winHint: '長いチャットは記憶されず、最も古いターンがウィンドウから外れます。',
    budget: 'ウィンドウ予算（トークン）',
    addTurn: 'ターン追加', reset: 'クリア', summarize: '破棄せずに古いターンを要約',
    usedL: '使用中', droppedL: '破棄済み', turnsL: 'アクティブターン', billedL: '次ターン入力コスト',
    sysPin: 'system（固定）', sumTag: '要約',
    empty: 'ターンがありません。「ターン追加」を押してください。',
    facts: '知っておくべき重要事項',
    f1t: '毎ターン全履歴に再課金される', f1b: '20ターン目には前の19ターンを入力トークンとして再送信します。',
    f2t: '大きなウィンドウ≠均一な理解', f2b: 'テストでは長いコンテキストの中央部で精度が低下することが示されています。',
    f3t: 'アテンションは二次関数的にスケール', f3b: '自己アテンションの計算量はシーケンス長の2乗で増加します。',
    f4t: '大きなウィンドウはRAGの代替にならない', f4b: '全社ナレッジベースを毎プロンプトに詰め込むのは無駄です。',
    f5t: '出力には独立した上限がある', f5b: 'コンテキストウィンドウと最大出力トークンは別個の制限です。',
    chunks: 'チャンク',
  },
  fr: {
    h1: "La fenetre de contexte est toute la memoire, depensee a chaque tour",
    lead: "Un modele n'a aucune memoire entre les requetes. Tout ce qu'il retient ce sont les tokens que vous renvoyez a chaque fois.",
    cmp: "Comparaison des fenetres de contexte", cmpHint: "Les barres utilisent une echelle logarithmique.",
    fit: "Ce qui tient vraiment dedans ?", fitHint: "Choisissez une longueur et voyez combien de fois elle tient.",
    refL: "Materiel de reference", customL: "Ou votre propre compte de mots", langL: "Langue du materiel",
    words: "Mots", tokens: "Tokens", pages: "Pages A4", minutes: "Minutes de lecture",
    fits: "Tient", once: "par envoi unique",
    win: "Simulation de memoire de chat", winHint: "Les longues conversations ne sont pas memorisees — les tours les plus anciens glissent.",
    budget: "Budget de fenetre (tokens)",
    addTurn: "Ajouter un tour", reset: "Effacer", summarize: "Resumer les anciens tours au lieu de les supprimer",
    usedL: "Utilise", droppedL: "Supprime", turnsL: "Tours actifs", billedL: "Cout entree prochain tour",
    sysPin: "systeme (epingle)", sumTag: "resume",
    empty: "Pas encore de tours. Appuyez sur Ajouter un tour.",
    facts: "Ce que vous devez savoir",
    f1t: "Chaque tour re-paye tout l'historique", f1b: "Au tour 20, vous renvoyez les 19 tours precedents comme tokens d'entree.",
    f2t: "Une grande fenetre n'est pas une comprehension uniforme", f2b: "Les tests montrent que la precision baisse au milieu des longs contextes.",
    f3t: "L'attention est quadratique", f3b: "Le calcul d'auto-attention croit avec le carre de la longueur de la sequence.",
    f4t: "Une grande fenetre ne remplace pas la recuperation", f4b: "Bourrer une base de connaissances entiere dans chaque requete est inefficace.",
    f5t: "La sortie a son propre plafond separe", f5b: "La fenetre de contexte et le max de tokens de sortie sont des limites differentes.",
    chunks: "fragments",
  },
  de: {
    h1: 'Das Kontextfenster ist das gesamte Gedächtnis, das bei jedem Schritt ausgegeben wird',
    lead: 'Ein Modell hat kein Gedächtnis zwischen Anfragen. Alles was es „erinnert" sind die Token, die Sie jedes Mal erneut senden.',
    cmp: 'Kontextfenster-Vergleich', cmpHint: 'Balken verwenden eine logarithmische Skala.',
    fit: 'Was passt tatsächlich hinein?', fitHint: 'Wählen Sie eine Länge und sehen Sie, wie oft sie passt.',
    refL: 'Referenzmaterial', customL: 'Oder eigene Wortzahl', langL: 'Materialsprache',
    words: 'Wörter', tokens: 'Token', pages: 'A4-Seiten', minutes: 'Minuten laut gelesen',
    fits: 'Passt', once: 'pro Einzelsendung',
    win: 'Chat-Gedächtnis-Simulation', winHint: 'Lange Gespräche werden nicht erinnert — älteste Schichten gleiten heraus.',
    budget: 'Fensterbudget (Token)',
    addTurn: 'Runde hinzufügen', reset: 'Löschen', summarize: 'Alte Runden zusammenfassen statt löschen',
    usedL: 'Verwendet', droppedL: 'Gelöscht', turnsL: 'Aktive Runden', billedL: 'Nächste Runde Eingabekosten',
    sysPin: 'System (angeheftet)', sumTag: 'Zusammenfassung',
    empty: 'Noch keine Runden. Drücken Sie „Runde hinzufügen".',
    facts: 'Was Sie wissen müssen',
    f1t: 'Jede Runde zahlt für die gesamte Geschichte erneut', f1b: 'In Runde 20 senden Sie die vorherigen 19 Runden als Eingabe-Token.',
    f2t: 'Ein großes Fenster ist kein gleichmäßiges Verstehen', f2b: 'Tests zeigen, dass die Genauigkeit in der Mitte langer Kontexte abnimmt.',
    f3t: 'Attention skaliert quadratisch', f3b: 'Self-Attention-Berechnung wächst mit dem Quadrat der Sequenzlänge.',
    f4t: 'Ein großes Fenster ist kein Ersatz für Retrieval', f4b: 'Eine gesamte Wissensbasis in jede Anfrage zu stecken ist verschwenderisch.',
    f5t: 'Ausgabe hat ein eigenes separates Limit', f5b: 'Kontextfenster und maximale Ausgabe-Token sind unterschiedliche Grenzen.',
    chunks: 'Abschnitte',
  },
  ar: {
    h1: 'نافذة السياق: الذاكرة الكاملة، تُستهلك في كل دورة',
    lead: 'النموذج ليس لديه ذاكرة بين الطلبات. كل ما يتذكره هو الرموز التي تُعيد إرسالها في كل مرة.',
    cmp: 'مقارنة نوافذ السياق', cmpHint: 'تستخدم الأشرطة مقياساً لوغاريتمياً.',
    fit: 'ما الذي يناسب بالفعل في الداخل؟', fitHint: 'اختر طول المادة وشاهد كم مرة تناسب.',
    refL: 'المادة المرجعية', customL: 'أو عدد كلماتك الخاص', langL: 'لغة المادة',
    words: 'كلمات', tokens: 'رموز', pages: 'صفحات A4', minutes: 'دقائق قراءة',
    fits: 'يناسب', once: 'لكل إرسال واحد',
    win: 'محاكاة ذاكرة المحادثة', winHint: 'لا تُحفظ المحادثات الطويلة — أقدم الأدوار تنزلق للخارج.',
    budget: 'ميزانية النافذة (رموز)',
    addTurn: 'إضافة دور', reset: 'مسح', summarize: 'تلخيص الأدوار القديمة بدلاً من حذفها',
    usedL: 'مستخدم', droppedL: 'محذوف', turnsL: 'أدوار نشطة', billedL: 'تكلفة الإدخال التالية',
    sysPin: 'النظام (مثبت)', sumTag: 'ملخص',
    empty: 'لا أدوار بعد. اضغط "إضافة دور".',
    facts: 'ما تحتاج معرفته',
    f1t: 'كل دور يدفع مجدداً عن كامل التاريخ', f1b: 'في الدور 20 تُعيد إرسال الأدوار الـ 19 السابقة كرموز إدخال.',
    f2t: 'النافذة الكبيرة ليست فهماً موحداً', f2b: 'تُظهر اختبارات "الإبرة في كومة القش" انخفاض الدقة في منتصف السياقات الطويلة.',
    f3t: 'الانتباه يتوسع تربيعياً', f3b: 'تنمو حسابات الانتباه الذاتي مع مربع طول التسلسل.',
    f4t: 'النافذة الكبيرة ليست بديلاً عن الاسترجاع', f4b: 'حشو قاعدة المعرفة بالكامل في كل طلب مكلف ويضر بالدقة.',
    f5t: 'للإخراج حده الخاص المنفصل', f5b: 'نافذة السياق ورموز الإخراج القصوى حدان مختلفان.',
    chunks: 'مقاطع',
  },
  pt: {
    h1: 'A janela de contexto é toda a memória, gasta a cada turno',
    lead: 'Um modelo não tem memória entre as requisições. Tudo que ele "lembra" são os tokens que você reenvie a cada vez.',
    cmp: 'Comparação da janela de contexto', cmpHint: 'As barras usam escala logarítmica.',
    fit: 'O que realmente cabe dentro?', fitHint: 'Escolha um comprimento e veja quantas vezes cabe.',
    refL: 'Material de referência', customL: 'Ou sua própria contagem de palavras', langL: 'Idioma do material',
    words: 'Palavras', tokens: 'Tokens', pages: 'Páginas A4', minutes: 'Minutos em voz alta',
    fits: 'Cabe', once: 'por envio único',
    win: 'Simulação de memória de chat', winHint: 'Conversas longas não são lembradas — os turnos mais antigos deslizam.',
    budget: 'Orçamento da janela (tokens)',
    addTurn: 'Adicionar turno', reset: 'Limpar', summarize: 'Resumir turnos antigos em vez de descartá-los',
    usedL: 'Usado', droppedL: 'Descartado', turnsL: 'Turnos ativos', billedL: 'Custo entrada próximo turno',
    sysPin: 'sistema (fixado)', sumTag: 'resumo',
    empty: 'Sem turnos ainda. Pressione "Adicionar turno".',
    facts: 'O que você precisa saber',
    f1t: 'Cada turno paga novamente por todo o histórico', f1b: 'No turno 20 você reenvia os 19 turnos anteriores como tokens de entrada.',
    f2t: 'Uma janela grande não é compreensão uniforme', f2b: 'Testes mostram que a precisão cai no meio de contextos longos.',
    f3t: 'Atenção escala quadraticamente', f3b: 'O cálculo de auto-atenção cresce com o quadrado do comprimento da sequência.',
    f4t: 'Uma janela grande não substitui a recuperação', f4b: 'Encher uma base de conhecimento inteira em cada requisição é dispendioso.',
    f5t: 'A saída tem seu próprio limite separado', f5b: 'Janela de contexto e max tokens de saída são limites diferentes.',
    chunks: 'fragmentos',
  },
  ru: {
    h1: 'Контекстное окно — это вся память, расходуемая на каждом шаге',
    lead: 'У модели нет памяти между запросами. Всё, что она «помнит» — это токены, которые вы отправляете снова при каждом запросе.',
    cmp: 'Сравнение контекстных окон', cmpHint: 'Столбцы используют логарифмическую шкалу.',
    fit: 'Что реально помещается внутрь?', fitHint: 'Выберите длину материала и посмотрите, сколько раз он помещается.',
    refL: 'Справочный материал', customL: 'Или введите своё количество слов', langL: 'Язык материала',
    words: 'Слова', tokens: 'Токены', pages: 'Страниц A4', minutes: 'Минут вслух',
    fits: 'Помещается', once: 'за одну отправку',
    win: 'Симуляция памяти чата', winHint: 'Длинные разговоры не «запоминаются» — старейшие шаги выскальзывают.',
    budget: 'Бюджет окна (токены)',
    addTurn: 'Добавить шаг', reset: 'Очистить', summarize: 'Суммировать старые шаги вместо удаления',
    usedL: 'Использовано', droppedL: 'Удалено', turnsL: 'Активных шагов', billedL: 'Стоимость входа след. шага',
    sysPin: 'система (закреплено)', sumTag: 'сводка',
    empty: 'Нет шагов. Нажмите «Добавить шаг».',
    facts: 'Что вам нужно знать',
    f1t: 'Каждый шаг оплачивает всю историю заново', f1b: 'На шаге 20 вы повторно отправляете 19 предыдущих шагов как входные токены.',
    f2t: 'Большое окно не обеспечивает равномерного понимания', f2b: 'Тесты показывают, что точность снижается в середине длинных контекстов.',
    f3t: 'Внимание масштабируется квадратично', f3b: 'Вычисление самовнимания растёт с квадратом длины последовательности.',
    f4t: 'Большое окно не заменяет поиск', f4b: 'Вставлять целую базу знаний в каждый запрос расточительно.',
    f5t: 'У вывода есть собственный отдельный лимит', f5b: 'Контекстное окно и максимальные токены вывода — разные ограничения.',
    chunks: 'фрагменты',
  },
  ko: {
    h1: '컨텍스트 윈도우는 매 턴마다 소비되는 전체 메모리입니다',
    lead: '모델은 요청 간 메모리가 없습니다. "기억"하는 것은 매번 다시 보내는 토큰뿐입니다.',
    cmp: '컨텍스트 윈도우 비교', cmpHint: '막대는 로그 척도를 사용합니다.',
    fit: '실제로 안에 들어가는 것은?', fitHint: '재료 길이를 선택하고 몇 번 들어가는지 확인하세요.',
    refL: '참조 자료', customL: '또는 직접 단어 수 입력', langL: '자료 언어',
    words: '단어', tokens: '토큰', pages: 'A4 페이지', minutes: '낭독 시간',
    fits: '들어감', once: '단일 전송당',
    win: '채팅 메모리 시뮬레이션', winHint: '긴 대화는 기억되지 않습니다 — 가장 오래된 턴이 밖으로 밀려납니다.',
    budget: '윈도우 예산 (토큰)',
    addTurn: '턴 추가', reset: '초기화', summarize: '이전 턴을 삭제 대신 요약',
    usedL: '사용됨', droppedL: '삭제됨', turnsL: '활성 턴', billedL: '다음 턴 입력 비용',
    sysPin: 'system (고정됨)', sumTag: '요약',
    empty: '턴이 없습니다. "턴 추가"를 누르세요.',
    facts: '알아야 할 사항',
    f1t: '각 턴은 전체 기록에 대해 다시 비용을 지불합니다', f1b: '턴 20에서 이전 19개 턴을 입력 토큰으로 다시 보냅니다.',
    f2t: '큰 윈도우가 균일한 이해를 보장하지 않습니다', f2b: '테스트에서 긴 컨텍스트 중간 부분에서 정확도가 떨어지는 것이 반복적으로 나타납니다.',
    f3t: '어텐션은 제곱으로 증가합니다', f3b: '자기 주의 계산은 시퀀스 길이의 제곱으로 증가합니다.',
    f4t: '큰 윈도우는 검색의 대체물이 아닙니다', f4b: '전체 지식 베이스를 모든 요청에 채우는 것은 낭비입니다.',
    f5t: '출력은 자체적인 별도 한도가 있습니다', f5b: '컨텍스트 윈도우와 최대 출력 토큰은 서로 다른 한도입니다.',
    chunks: '청크',
  },
};

const SYS_TOKENS = 180;   // system prompt selalu tersemat di jendela

/* Kalimat contoh untuk simulasi giliran percakapan. */
const TURN_TEXT = {
  id: ['Bisa jelaskan ulang bagian tadi?', 'Tolong buatkan ringkasan poin utamanya.', 'Bagaimana kalau anggarannya setengah?', 'Apa risiko terbesar dari rencana itu?', 'Berikan contoh nyata yang mirip.', 'Ubah nadanya jadi lebih santai.', 'Bandingkan dengan pilihan sebelumnya.', 'Apa langkah pertama yang harus saya ambil?'],
  en: ['Can you restate that part?', 'Give me a summary of the key points.', 'What if the budget were halved?', 'What is the biggest risk in that plan?', 'Show a real example close to this.', 'Make the tone more casual.', 'Compare it with the earlier option.', 'What is the very first step I should take?'],
};

export function render(root, ctx) {
  const t = S[ctx.lang] || S.en || S.id;
  let refId = 'novel';
  let customWords = 0;
  let matLang = ctx.lang;
  let modelId = 'sonnet-35';
  let budget = 2000;
  let summarize = false;
  let turns = [];
  let turnSeq = 0;

  /* ---------- 1. perbandingan jendela ---------- */
  const maxCtx = Math.max(...MODELS.map((m) => m.ctx));
  const cmpRows = MODELS.slice().sort((a, b) => b.ctx - a.ctx).map((m) => {
    const pct = (Math.log10(m.ctx) / Math.log10(maxCtx)) * 100;
    const words = Math.round(m.ctx * 0.75);
    return el('div.ctxbar', {}, [
      el('div.ctxbar-top', {}, [
        el('span', {}, [el('b', { text: m.name }), el('span', { text: ' · ' + m.vendor, style: { color: 'var(--text-mute)' } })]),
        el('span.ctxbar-meta', { text: compact(m.ctx) + ' tok' }),
      ]),
      meter(pct),
      el('div.ctxbar-top', {}, [
        el('span.ctxbar-meta', { text: `≈ ${compact(words)} ${t.words.toLowerCase()} · ≈ ${nf(Math.round(words / 500))} ${t.pages.toLowerCase()}` }),
        el('span.ctxbar-meta', { text: `max out ${compact(m.maxOut)}` }),
      ]),
    ]);
  });

  /* ---------- 2. apa yang muat ---------- */
  const refSel = el('select', { 'aria-label': t.refL, onchange: (e) => { refId = e.target.value; customWords = 0; wordsInput.value = ''; paintFit(); } },
    REFERENCES.map((r) => el('option', { value: r.id, selected: r.id === refId }, [`${ctx.lang === 'id' ? r.id_label : r.en_label} · ${compact(r.words)} ${t.words.toLowerCase()}`])));
  const wordsInput = el('input', { type: 'number', min: 0, placeholder: '0', 'aria-label': t.customL, oninput: (e) => { customWords = +e.target.value || 0; paintFit(); } });
  const langSel = el('select', { 'aria-label': t.langL, onchange: (e) => { matLang = e.target.value; paintFit(); } }, [
    el('option', { value: 'en', selected: matLang === 'en' }, ['English']),
    el('option', { value: 'id', selected: matLang === 'id' }, ['Indonesia']),
  ]);
  const fitCells = {};
  const mkFit = (k, label, sub) => { const n = stat(label, '—', sub); fitCells[k] = n.querySelector('.stat-v'); return n; };
  const fitBody = el('tbody');

  /* ---------- 3. simulasi memori ---------- */
  const winBox = el('div.win');
  const winCells = {};
  const mkWin = (k, label, sub) => { const n = stat(label, '—', sub); winCells[k] = n.querySelector('.stat-v'); return n; };
  const winMeter = meter(0);
  const modelSel = el('select', { 'aria-label': 'model', onchange: (e) => { modelId = e.target.value; paintFit(); paintWin(); } },
    MODELS.map((m) => el('option', { value: m.id, selected: m.id === modelId }, [m.name])));
  const budgetSlider = slider({
    label: t.budget, min: 600, max: 8000, step: 100, value: budget,
    fmt: (v) => nf(v) + ' tok', onInput: (v) => { budget = v; paintWin(); },
  });
  const sumToggle = el('label.row', { style: { fontSize: '.86rem', cursor: 'pointer' } }, [
    el('input', { type: 'checkbox', style: { width: 'auto' }, onchange: (e) => { summarize = e.target.checked; paintWin(); } }),
    t.summarize,
  ]);

  root.append(
    el('header.head', {}, [
      el('span.eyebrow', { text: ctx.lang === 'id' ? 'Konteks' : 'Context' }),
      el('h1', { text: t.h1 }),
      el('p', { text: t.lead }),
    ]),
    el('div.split-wide', {}, [
      el('div.stack', {}, [
        card(t.win, [
          el('p.card-sub', { text: t.winHint }),
          el('div.grid.g-2', {}, [budgetSlider, el('div', {}, [el('label', {}, ['Model']), modelSel])]),
          el('div.row', { style: { marginTop: '10px' } }, [
            el('button.btn.btn-primary', { type: 'button', onclick: addTurn }, [t.addTurn]),
            el('button.btn', { type: 'button', onclick: () => { turns = []; turnSeq = 0; paintWin(); } }, [t.reset]),
            sumToggle,
          ]),
          el('hr.hr'),
          el('div.grid.g-4', {}, [mkWin('used', t.usedL), mkWin('dropped', t.droppedL), mkWin('turns', t.turnsL), mkWin('billed', t.billedL)]),
          el('div', { style: { margin: '10px 0 14px' } }, [winMeter]),
          winBox,
        ], { h3: true, attrs: { id: 'panel-window' } }),
        card(t.fit, [
          el('p.card-sub', { text: t.fitHint }),
          el('div.grid.g-3', {}, [
            el('div', {}, [el('label', {}, [t.refL]), refSel]),
            el('div', {}, [el('label', {}, [t.customL]), wordsInput]),
            el('div', {}, [el('label', {}, [t.langL]), langSel]),
          ]),
          el('hr.hr'),
          el('div.grid.g-4', {}, [mkFit('words', t.words), mkFit('tokens', t.tokens), mkFit('pages', t.pages), mkFit('minutes', t.minutes)]),
          el('hr.hr'),
          el('div.tbl-wrap', {}, [el('table.tbl', {}, [
            el('thead', {}, [el('tr', {}, [
              el('th', { text: 'Model' }), el('th.num', { text: ctx.lang === 'id' ? 'Jendela' : 'Window' }),
              el('th.num', { text: t.fits }), el('th.num', { text: t.once }),
            ])]),
            fitBody,
          ])]),
          el('p.card-sub', { text: PRICE_NOTE[ctx.lang] || PRICE_NOTE.id, style: { marginTop: '10px', marginBottom: 0 } }),
        ], { h3: true }),
      ]),
      el('div.stack.sticky-side', {}, [
        card(t.cmp, [el('p.card-sub', { text: t.cmpHint }), el('div.stack', {}, cmpRows)], { h3: true }),
        card(t.facts, [
          [['f1t', 'f1b'], ['f2t', 'f2b'], ['f3t', 'f3b'], ['f4t', 'f4b'], ['f5t', 'f5b']].map(([a, b]) =>
            el('details.acc', {}, [el('summary', { text: t[a] }), el('div.acc-body', {}, [el('p', { text: t[b] })])])),
        ], { h3: true }),
      ]),
    ]),
  );

  /* ---------- logika: apa yang muat ---------- */
  function paintFit() {
    const ref = REFERENCES.find((r) => r.id === refId) || REFERENCES[0];
    const words = customWords > 0 ? customWords : ref.words;
    const tokens = tokensForWords(words, matLang);
    fitCells.words.textContent = nf(words);
    fitCells.tokens.textContent = nf(tokens);
    fitCells.pages.textContent = nf(Math.round(words / 500));
    fitCells.minutes.textContent = nf(Math.round(words / 130));

    fitBody.textContent = '';
    MODELS.slice().sort((a, b) => b.ctx - a.ctx).forEach((m) => {
      const times = tokens ? m.ctx / tokens : 0;
      const ok = times >= 1;
      fitBody.append(el('tr', { style: m.id === modelId ? { background: 'var(--accent-soft)' } : {} }, [
        el('td', {}, [el('strong', { text: m.name })]),
        el('td.num', { text: compact(m.ctx) }),
        el('td.num', {}, [el('span', { class: 'badge ' + (ok ? 'badge-ok' : 'badge-danger'), text: ok ? times.toFixed(times < 10 ? 1 : 0) + '×' : (times * 100).toFixed(0) + '%' })]),
        el('td.num', { text: usd(cost(m, Math.min(tokens, m.ctx), 0)) }),
      ]));
    });
  }

  /* ---------- logika: memori percakapan ---------- */
  function addTurn() {
    const list = TURN_TEXT[ctx.lang === 'en' ? 'en' : 'id'];
    const text = list[turnSeq % list.length];
    const userTok = 12 + ((turnSeq * 7) % 40);
    const aiTok = 90 + ((turnSeq * 53) % 260);
    turnSeq++;
    turns.push({ n: turnSeq, text, tokens: userTok + aiTok });
    paintWin();
  }

  /** Isi jendela dari giliran terbaru ke belakang, dengan ruang cadangan untuk ringkasan. */
  function pack(reserve) {
    let free = budget - SYS_TOKENS - reserve;
    const live = [];
    const dropped = [];
    for (let i = turns.length - 1; i >= 0; i--) {
      if (turns[i].tokens <= free) { free -= turns[i].tokens; live.unshift(turns[i]); }
      else dropped.unshift(turns[i]);
    }
    return { live, dropped, free, droppedTok: dropped.reduce((a, x) => a + x.tokens, 0) };
  }

  const summaryCost = (droppedTok) => Math.min(320, Math.max(60, Math.round(droppedTok * 0.12)));

  function paintWin() {
    // sistem selalu disematkan; giliran terbaru diprioritaskan
    let res = pack(0);
    let summaryTok = 0;
    if (summarize && res.droppedTok) {
      // dua putaran: sisihkan ruang ringkasan lebih dulu, lalu sesuaikan ukurannya
      summaryTok = summaryCost(res.droppedTok);
      res = pack(summaryTok);
      if (res.droppedTok) summaryTok = summaryCost(res.droppedTok);
      else summaryTok = 0;
      res = pack(summaryTok);
    }
    const { live, dropped, free, droppedTok } = res;
    const used = budget - free;

    winBox.textContent = '';
    winBox.append(el('div.turn.pinned', {}, [
      el('span.turn-tag', { text: t.sysPin }),
      el('span', {}, [el('span', { text: ctx.lang === 'id' ? 'Instruksi tetap' : 'Standing instructions' }), el('span.ctxbar-meta', { text: '  ' + SYS_TOKENS + ' tok' })]),
    ]));
    if (summaryTok) {
      winBox.append(el('div.turn.pinned', {}, [
        el('span.turn-tag', { text: t.sumTag }),
        el('span', {}, [
          el('span', { text: ctx.lang === 'id' ? `Padatan dari ${dropped.length} giliran lama` : `Compressed from ${dropped.length} old turns` }),
          el('span.ctxbar-meta', { text: `  ${summaryTok} tok (${nf(droppedTok)} → ${summaryTok})` }),
        ]),
      ]));
    }
    dropped.forEach((x) => winBox.append(el('div.turn.dropped', {}, [
      el('span.turn-tag', { text: '#' + x.n }),
      el('span', {}, [el('span', { text: x.text }), el('span.ctxbar-meta', { text: '  ' + x.tokens + ' tok' })]),
    ])));
    live.forEach((x) => winBox.append(el('div.turn', {}, [
      el('span.turn-tag', { text: '#' + x.n }),
      el('span', {}, [el('span', { text: x.text }), el('span.ctxbar-meta', { text: '  ' + x.tokens + ' tok' })]),
    ])));
    if (!turns.length) winBox.append(el('p.empty', { text: t.empty }));

    winCells.used.textContent = `${nf(used)} / ${nf(budget)}`;
    winCells.dropped.textContent = nf(droppedTok);
    winCells.turns.textContent = `${live.length} / ${turns.length}`;
    winCells.billed.textContent = usd(cost(byId(modelId), used, 300));
    const pct = (used / budget) * 100;
    winMeter.querySelector('i').style.width = Math.min(100, pct) + '%';
    winMeter.className = 'meter' + (pct > 88 ? ' meter-danger' : '');
  }

  paintFit();
  addTurn(); addTurn(); addTurn();

  if (ctx.params.get('panel') === 'window') {
    requestAnimationFrame(() => document.getElementById('panel-window')?.scrollIntoView({ block: 'start', behavior: 'smooth' }));
  }
}
