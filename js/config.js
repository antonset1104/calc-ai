/* ============================================================
   config.js — satu tempat untuk semua klaim yang butuh bukti
   dan semua kanal yang butuh backend.

   Ubah di sini saja; UI menyesuaikan diri secara otomatis.
   ============================================================ */

export const SITE = {
  name: 'LLM Lab & BenchLM',
  url: 'https://bench.vijeron.com',
};

/**
 * Status data leaderboard.
 *   'illustrative' → angka dipakai untuk memperagakan metodologi pembobotan.
 *                    Banner peringatan tampil di semua halaman berbasis data.
 *   'sourced'      → setiap skor, harga, dan Elo sudah dicocokkan dengan
 *                    laporan resmi vendor / papan skor benchmark, dan
 *                    kolom sumber sudah diisi. Banner berubah jadi netral.
 *
 * JANGAN ubah ke 'sourced' sebelum angka benar-benar diverifikasi:
 * halaman ini menyebut nama benchmark dan vendor sungguhan.
 */
export const DATA_STATUS = 'illustrative';

/** Tanggal snapshot data (dipakai pada banner & ekspor). */
export const DATA_SNAPSHOT = '2026-08';

/**
 * Kanal kontak. Selama kosong, formulir newsletter & konsultasi disembunyikan
 * supaya situs tidak menjanjikan sesuatu yang tidak bisa ditepati.
 *   email             → formulir membuka draf surel pengguna (mailto), berfungsi tanpa server.
 *   newsletterEndpoint→ URL POST (mis. Google Apps Script, Formspree, Worker) untuk daftar email.
 *   advisoryEndpoint  → URL POST untuk permintaan konsultasi.
 */
export const CONTACT = {
  email: '',
  newsletterEndpoint: '',
  advisoryEndpoint: '',
};

/** Tautan dukungan (GitHub Sponsors / Ko-fi / dsb). Kosong = tombol disembunyikan. */
export const SPONSOR_URL = '';

export const LEADGEN = {
  newsletter: Boolean(CONTACT.newsletterEndpoint || CONTACT.email),
  advisory: Boolean(CONTACT.advisoryEndpoint || CONTACT.email),
};

/** Rute yang menampilkan angka model dan karena itu wajib menyertakan status data. */
export const DATA_ROUTES = ['leaderboard', 'compare', 'selector', 'benchmarks'];

/** Peringatan provenance data, 11 bahasa. */
export const DATA_NOTICE = {
  illustrative: {
    id: 'Data demonstrasi. Skor, harga, kecepatan, dan Elo di halaman ini adalah angka ilustratif untuk memperagakan cara kerja pembobotan BenchLM — belum diverifikasi dari laporan resmi vendor atau papan skor benchmark. Jangan dipakai sebagai dasar keputusan pengadaan.',
    en: 'Demonstration data. The scores, prices, speeds, and Elo values on this page are illustrative figures used to show how the BenchLM weighting works — they are not verified against vendor reports or official benchmark boards. Do not use them for procurement decisions.',
    es: 'Datos de demostración. Las puntuaciones, precios y valores Elo son cifras ilustrativas para mostrar la metodología de ponderación; no están verificadas con informes oficiales. No las use para decisiones de compra.',
    zh: '演示数据。本页的分数、价格、速度与 Elo 均为用于说明 BenchLM 加权方法的示例数值，未经厂商官方报告或基准榜单核实，请勿用于采购决策。',
    ja: 'デモ用データです。本ページのスコア・価格・速度・Eloは重み付け手法を示すための例示値であり、公式レポートやベンチマークボードで検証されていません。調達判断には使用しないでください。',
    fr: 'Données de démonstration. Les scores, prix et valeurs Elo sont des chiffres illustratifs servant à montrer la méthode de pondération ; ils ne sont pas vérifiés auprès des rapports officiels. Ne les utilisez pas pour des décisions d\'achat.',
    de: 'Demonstrationsdaten. Die Werte, Preise und Elo-Zahlen auf dieser Seite sind Beispielzahlen zur Veranschaulichung der Gewichtungsmethode und nicht anhand offizieller Berichte verifiziert. Nicht für Beschaffungsentscheidungen verwenden.',
    ar: 'بيانات توضيحية. الدرجات والأسعار وقيم Elo في هذه الصفحة أرقام إيضاحية لبيان طريقة الترجيح، وغير مُتحقَّق منها من تقارير الجهات الرسمية. لا تستخدمها لقرارات الشراء.',
    pt: 'Dados de demonstração. As pontuações, preços e valores Elo desta página são números ilustrativos para mostrar a metodologia de ponderação e não foram verificados em relatórios oficiais. Não use para decisões de compra.',
    ru: 'Демонстрационные данные. Оценки, цены и рейтинги Elo на этой странице — иллюстративные значения для показа методики взвешивания, они не проверены по официальным отчётам. Не используйте их для закупочных решений.',
    ko: '데모 데이터입니다. 이 페이지의 점수, 가격, 속도, Elo 값은 가중치 산정 방식을 보여주기 위한 예시 수치이며 공식 보고서나 벤치마크 보드로 검증되지 않았습니다. 구매 결정에 사용하지 마세요.',
  },
  sourced: {
    id: 'Snapshot data terverifikasi. Angka dikutip dari laporan resmi vendor dan papan skor benchmark publik; harga dan skor bisa berubah kapan saja — selalu cek sumber sebelum keputusan biaya.',
    en: 'Verified data snapshot. Figures are quoted from vendor reports and public benchmark boards; prices and scores change often — always confirm at the source before budgeting.',
    es: 'Instantánea verificada. Las cifras provienen de informes oficiales y tableros públicos; verifique en la fuente antes de decidir.',
    zh: '已核实的数据快照。数值引自厂商官方报告与公开基准榜单；价格与分数经常变动，决策前请核对来源。',
    ja: '検証済みデータのスナップショットです。数値はベンダー公式レポートと公開ベンチマークからの引用です。判断前に出典をご確認ください。',
    fr: 'Instantané de données vérifiées. Les chiffres proviennent de rapports officiels et de classements publics ; vérifiez la source avant toute décision.',
    de: 'Geprüfter Datenstand. Die Zahlen stammen aus offiziellen Berichten und öffentlichen Benchmark-Boards; vor Entscheidungen bitte an der Quelle prüfen.',
    ar: 'لقطة بيانات مُتحقَّق منها. الأرقام مقتبسة من تقارير رسمية ولوحات معيارية عامة؛ تحقَّق من المصدر قبل القرار.',
    pt: 'Instantâneo de dados verificados. Os números vêm de relatórios oficiais e placares públicos; confirme na fonte antes de decidir.',
    ru: 'Проверенный срез данных. Значения взяты из официальных отчётов и публичных бенчмарк-таблиц; проверяйте источник перед решением.',
    ko: '검증된 데이터 스냅샷입니다. 수치는 공식 보고서와 공개 벤치마크 보드에서 인용했습니다. 결정 전 출처를 확인하세요.',
  },
};

export const DATA_NOTICE_TITLE = {
  illustrative: {
    id: 'Angka di halaman ini belum terverifikasi',
    en: 'Figures on this page are unverified',
    es: 'Cifras sin verificar', zh: '本页数值未经核实', ja: 'このページの数値は未検証です',
    fr: 'Chiffres non vérifiés', de: 'Unbestätigte Zahlen', ar: 'أرقام غير مُتحقَّق منها',
    pt: 'Números não verificados', ru: 'Непроверенные данные', ko: '검증되지 않은 수치',
  },
  sourced: {
    id: 'Snapshot data', en: 'Data snapshot', es: 'Instantánea de datos', zh: '数据快照',
    ja: 'データスナップショット', fr: 'Instantané des données', de: 'Datenstand',
    ar: 'لقطة بيانات', pt: 'Instantâneo de dados', ru: 'Срез данных', ko: '데이터 스냅샷',
  },
};
