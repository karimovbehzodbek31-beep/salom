// ==========================================
// 1. FOYDALANUVCHI HOLATI VA LOCALSTORAGE
// ==========================================
const STORAGE_KEY = 'brainup_user_data_v1';
const CUSTOM_GAMES_KEY = 'brainup_custom_games_v1';

let userState = {
    name: 'Yosh Daho',
    avatar: '🦊',
    age: null,
    totalScore: 0,
    gamesPlayed: 0,
    bestScores: {}, // { gameId: maxScore }
    history: []     // [{ title, score, date }]
};

// Yosh toifalari konfiguratsiyasi
const AGE_CATEGORIES = {
    '5-6': {
        tag: '5–6 yosh toifasi',
        title: 'Kichkintoylar uchun quvnoq kashfiyotlar',
        desc: 'Ranglar, shakllar, hayvonlar va ilk matematik qadamlar olami!',
        gradient: 'linear-gradient(135deg, #ff6b6b, #f59e0b)'
    },
    '7-9': {
        tag: '7–9 yosh toifasi',
        title: 'Boshlang‘ich sinf bilimdonlari',
        desc: 'Xotirani charxlash, so‘z boyligi va qiziqarli sonlar ketma-ketligi.',
        gradient: 'linear-gradient(135deg, #10b981, #06b6d4)'
    },
    '10-15': {
        tag: '10–15 yosh toifasi',
        title: 'O‘smirlar uchun intellektual maydon',
        desc: 'Labirintlar, kodlarni buzish, matematik jumboqlar va detektiv tergovlar.',
        gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)'
    },
    '16-17': {
        tag: '16–17 yosh toifasi',
        title: 'Akademik va algoritmik tafakkur',
        desc: 'Murakkab tenglamalar, algoritmlar va strategik qaror qabul qilish.',
        gradient: 'linear-gradient(135deg, #f97316, #e11d48)'
    },
    '18-20': {
        tag: '18–20 yosh toifasi',
        title: 'Intellektual usta va kriptografiya',
        desc: 'Shifrlarni yechish, oliy mantiq va chuqur strategik boshqotirmalar.',
        gradient: 'linear-gradient(135deg, #0284c7, #4f46e5)'
    }
};

// ==========================================
// 2. BARCHA YOSH TOIFALARI UCHUN O'YINLAR BAZASI
// ==========================================
const DEFAULT_GAMES = [
    // ---------------- 5–6 YOSH ----------------
    {
        id: 'g_5_colors',
        category: '5-6',
        title: 'Ranglarni topish',
        icon: '🎨',
        type: 'quiz',
        desc: 'Ko‘rsatilgan rasm yoki buyumning rangini toping.',
        rules: 'Ekranda ko‘rsatilgan narsaga qarang va uning to‘g‘ri rangini tanlang. Har bir to‘g‘ri javob uchun 10 ball beriladi!',
        questions: [
            { q: 'Quyoshning rangi qanday?', visual: '☀️', options: ['Sariq', 'Ko‘k', 'Qora'], answer: 'Sariq' },
            { q: 'Yangi unib chiqqan o‘t-o‘lanlar rangi?', visual: '🌿', options: ['Qizil', 'Yashil', 'Siyohrang'], answer: 'Yashil' },
            { q: 'Pishgan qulupnay qanday rangda bo‘ladi?', visual: '🍓', options: ['Ko‘k', 'Qizil', 'Kulrang'], answer: 'Qizil' },
            { q: 'Bulutsiz osmon rangi qanday?', visual: '🌌', options: ['Moviy (Ko‘k)', 'Sariq', 'Jigarrang'], answer: 'Moviy (Ko‘k)' },
            { q: 'Apelsin mevasining rangi qanday?', visual: '🍊', options: ['Zarg‘aldoq (Apelsin)', 'Pushti', 'Yashil'], answer: 'Zarg‘aldoq (Apelsin)' }
        ]
    },
    {
        id: 'g_5_shapes',
        category: '5-6',
        title: 'Shakllarni moslashtirish',
        icon: '🔺',
        type: 'quiz',
        desc: 'Geometrik shakllarni ularning nomi va ko‘rinishi bilan moslang.',
        rules: 'Shaklni diqqat bilan kuzating va uning to‘g‘ri nomini belgilang.',
        questions: [
            { q: 'Uchta burchagi bor shakl qaysi?', visual: '🔺', options: ['Uchburchak', 'Doira', 'Kvadrat'], answer: 'Uchburchak' },
            { q: 'Koptok qaysi shaklga o‘xshaydi?', visual: '⚽', options: ['Kvadrat', 'Doira', 'To‘rtburchak'], answer: 'Doira' },
            { q: 'Hamma 4 tomoni teng bo‘lgan shakl?', visual: '🟥', options: ['Kvadrat', 'Uchburchak', 'Yulduz'], answer: 'Kvadrat' },
            { q: 'Tunda osmonda porlaydigan shakl?', visual: '⭐', options: ['Yulduzcha', 'Doira', 'Kub'], answer: 'Yulduzcha' }
        ]
    },
    {
        id: 'g_5_animals',
        category: '5-6',
        title: 'Hayvonlarni topish',
        icon: '🦁',
        type: 'quiz',
        desc: 'Tavsif va belgilarga qarab qaysi hayvon ekanligini toping.',
        rules: 'Hayvon haqidagi qiziqarli topishmoqni o‘qing va to‘g‘ri hayvon rasmini tanlang!',
        questions: [
            { q: 'Qaysi hayvon "Miyov-miyov" deb ovoz chiqaradi?', visual: '🐾', options: ['🐱 Mushuk', '🐶 Kuchuk', '🐮 Sigir'], answer: '🐱 Mushuk' },
            { q: 'Uzun bo‘yinli va dog‘li hayvon qaysi?', visual: '🌿', options: ['🦒 Jirafa', '🐘 Fil', '🐇 Quyon'], answer: '🦒 Jirafa' },
            { q: 'Qaysi hayvon asalni juda yaxshi ko‘radi?', visual: '🍯', options: ['🐻 Ayiq', '🦊 Tulki', '🐺 Bo‘ri'], answer: '🐻 Ayiq' },
            { q: 'Sabzi yeyishni yaxshi ko‘radigan uzun quloqli hayvon?', visual: '🥕', options: ['🐇 Quyon', '🦁 Sher', '🐸 Qurbaqa'], answer: '🐇 Quyon' }
        ]
    },
    {
        id: 'g_5_math',
        category: '5-6',
        title: 'Oddiy matematik misollar',
        icon: '🍎',
        type: 'quiz',
        desc: 'Mevalarni sanash va 10 ichida qo‘shish-ayirish.',
        rules: 'Rasmdagi mevalarni sanang va to‘g‘ri sonni tanlang.',
        questions: [
            { q: '2 ta olmaga 1 ta olma qo‘shsak nechta bo‘ladi?', visual: '🍎🍎 + 🍎 = ?', options: ['2', '3', '4'], answer: '3' },
            { q: '4 ta banandan 2 tasini yesak nechta qoladi?', visual: '🍌🍌🍌🍌 - 🍌🍌 = ?', options: ['1', '2', '3'], answer: '2' },
            { q: '3 ta yulduzchaga 2 ta qo‘shsak nechta bo‘ladi?', visual: '⭐⭐⭐ + ⭐⭐ = ?', options: ['5', '4', '6'], answer: '5' },
            { q: 'Rasmda nechta apelsin bor?', visual: '🍊🍊🍊🍊', options: ['3', '4', '5'], answer: '4' }
        ]
    },
    {
        id: 'g_5_pairs',
        category: '5-6',
        title: 'Rasmlarni juftlash',
        icon: '🃏',
        type: 'memory',
        desc: 'Bir xil rasmli kartochkalarni topib juftlang.',
        rules: 'Kartochkalarni birma-bir oching va bir xil rasmlarni juftlang. Barcha juftliklarni topsangiz g‘olib bo‘lasiz!',
        pairs: ['🐶', '🐱', '🍎', '🚗']
    },

    // ---------------- 7–9 YOSH ----------------
    {
        id: 'g_7_memory',
        category: '7-9',
        title: 'Xotira o‘yinlari',
        icon: '🧩',
        type: 'memory',
        desc: '12 ta kartochka ichidan barcha juftliklarni eslab qoling va toping.',
        rules: 'Kartochkalar joylashuvini eslab qoling va barcha 6 ta juftlikni eng kam urinishda toping.',
        pairs: ['🚀', '🦖', '⚽', '🎸', '🍦', '💎']
    },
    {
        id: 'g_7_math',
        category: '7-9',
        title: 'Matematik misollar',
        icon: '➕',
        type: 'quiz',
        desc: 'Tezkor qo‘shish, ayirish va ko‘paytirish jadvali misollari.',
        rules: 'Misolni hisoblang va to‘g‘ri javobni tanlang. Har bir to‘g‘ri javob 15 ball!',
        questions: [
            { q: '24 + 18 = ?', visual: '🧮', options: ['42', '32', '44'], answer: '42' },
            { q: '50 - 23 = ?', visual: '➖', options: ['27', '37', '23'], answer: '27' },
            { q: '6 × 7 = ?', visual: '✖️', options: ['42', '36', '48'], answer: '42' },
            { q: '36 ÷ 4 = ?', visual: '➗', options: ['9', '8', '7'], answer: '9' },
            { q: '15 + 25 - 10 = ?', visual: '🔢', options: ['30', '40', '20'], answer: '30' }
        ]
    },
    {
        id: 'g_7_words',
        category: '7-9',
        title: 'So‘z topish',
        icon: '🔤',
        type: 'quiz',
        desc: 'Aralash harflardan to‘g‘ri so‘z tuzing yoki yetishmayotgan harfni toping.',
        rules: 'Harflarga diqqat bilan qarang va yashiringan so‘zni toping!',
        questions: [
            { q: 'Aralash harflardan so‘z tuzing: K - T - O - I - B', visual: '📚', options: ['KITOB', 'KOTIB', 'BITOK'], answer: 'KITOB' },
            { q: 'So‘zni to‘ldiring: M _ K T A B', visual: '🏫', options: ['A', 'O', 'U'], answer: 'A' },
            { q: 'Aralash harflardan meva nomini toping: N - A - R - O', visual: '🍊', options: ['ANOR', 'ORAN', 'NORA'], answer: 'ANOR' },
            { q: 'Qaysi so‘z ortiqcha?', visual: '🤔', options: ['Qalam', 'Daftar', 'Tarvuz'], answer: 'Tarvuz' }
        ]
    },
    {
        id: 'g_7_logic',
        category: '7-9',
        title: 'Mantiqiy savollar',
        icon: '💡',
        type: 'quiz',
        desc: 'Zukkolik va topqirlikni sinovchi qiziqarli savollar.',
        rules: 'Shoshilmang! Savolning mantiqiy ma’nosini o‘ylab, to‘g‘ri javobni tanlang.',
        questions: [
            { q: '1 kg paxta og‘irmi yoki 1 kg temir?', visual: '⚖️', options: ['Ikkalasi teng', 'Temir og‘ir', 'Paxta og‘ir'], answer: 'Ikkalasi teng' },
            { q: 'Daraxtda 5 ta qush bor edi. Ovchi 1 tasini otdi. Nechta qush qoldi?', visual: '🌳', options: ['0 ta (qolganlari uchib ketdi)', '4 ta', '5 ta'], answer: '0 ta (qolganlari uchib ketdi)' },
            { q: 'Qaysi oyda 28 kun bor?', visual: '📅', options: ['Barcha oylarda', 'Faqat Fevralda', 'Martda'], answer: 'Barcha oylarda' },
            { q: 'Stolning 4 ta burchagi bor. 1 tasini arralab tashlasak nechta burchak qoladi?', visual: '🪵', options: ['5 ta', '3 ta', '4 ta'], answer: '5 ta' }
        ]
    },
    {
        id: 'g_7_sequence',
        category: '7-9',
        title: 'Sonlar ketma-ketligi',
        icon: '🔢',
        type: 'quiz',
        desc: 'Qonuniyatni aniqlang va keyingi sonni toping.',
        rules: 'Sonlar qanday tartibda o‘sayotganini aniqlang va savol belgisi o‘rnidagi sonni toping.',
        questions: [
            { q: '2, 4, 6, 8, ?', visual: '📈', options: ['10', '9', '12'], answer: '10' },
            { q: '5, 10, 15, 20, ?', visual: '🚀', options: ['25', '30', '22'], answer: '25' },
            { q: '20, 18, 16, 14, ?', visual: '📉', options: ['12', '10', '13'], answer: '12' },
            { q: '1, 2, 4, 8, ?', visual: '✨', options: ['16', '10', '12'], answer: '16' }
        ]
    },

    // ---------------- 10–15 YOSH ----------------
    {
        id: 'g_10_maze',
        category: '10-15',
        title: 'Labirintdan chiqish',
        icon: '🌀',
        type: 'maze',
        desc: 'To‘siqlardan aylanib o‘tib, robotni oltin kubokka yetkazing!',
        rules: 'Klaviatura strelkalari yoki ekrandagi tugmalar yordamida 🤖 robotni 🏆 kubok tomon harakatlantiring.',
        levels: [
            {
                grid: [
                    [2, 0, 1, 0, 0],
                    [1, 0, 1, 0, 1],
                    [0, 0, 0, 0, 1],
                    [0, 1, 1, 0, 0],
                    [0, 0, 0, 1, 3]
                ]
            },
            {
                grid: [
                    [2, 0, 0, 1, 0, 0],
                    [1, 1, 0, 1, 0, 1],
                    [0, 0, 0, 0, 0, 1],
                    [0, 1, 1, 1, 0, 0],
                    [0, 0, 0, 1, 1, 0],
                    [1, 1, 0, 0, 0, 3]
                ]
            }
        ]
    },
    {
        id: 'g_10_math',
        category: '10-15',
        title: 'Matematik jumboqlar',
        icon: '📐',
        type: 'quiz',
        desc: 'Tenglamalar, foizlar va mantiqiy hisob-kitob masalalari.',
        rules: 'Har bir matematik jumboqni yeching va to‘g‘ri javobni belgilang.',
        questions: [
            { q: 'Agar 3x + 5 = 20 bo‘lsa, x nechaga teng?', visual: '✖️', options: ['5', '4', '6'], answer: '5' },
            { q: '200 sonining 25 foizi nechaga teng?', visual: '💯', options: ['50', '40', '75'], answer: '50' },
            { q: 'Kvadratning perimetri 36 sm. Uning yuzi necha sm²?', visual: '🟦', options: ['81', '36', '64'], answer: '81' },
            { q: 'Poyezd 60 km/soat tezlik bilan 2.5 soatda necha km yo‘l yuradi?', visual: '🚄', options: ['150 km', '120 km', '180 km'], answer: '150 km' }
        ]
    },
    {
        id: 'g_10_codes',
        category: '10-15',
        title: 'Kodlarni topish',
        icon: '🔐',
        type: 'input',
        desc: 'Mantiqiy ishoralar yordamida seyfning 3 xonali maxfiy kodini oching!',
        rules: 'Berilgan shartlarni tahlil qiling va 3 xonali raqamli kodni kiriting (masalan: 412).',
        questions: [
            {
                q: 'Seyf kodi 3 xonali son:\n• Birinchi raqam 4 dan katta va 6 dan kichik.\n• Ikkinchi raqam eng kichik juft musbat son.\n• Uchinchi raqam birinchi raqamdan 3 taga katta.',
                visual: '🔒 [ ? - ? - ? ]',
                answer: '528'
            },
            {
                q: 'Maxfiy kod:\n• Barcha raqamlar yig‘indisi 12 ga teng.\n• Birinchi raqam 3.\n• Ikkinchi va uchinchi raqamlar bir xil emas, ikkinchisi 4.',
                visual: '🔐 [ 3 - 4 - ? ]',
                answer: '345'
            },
            {
                q: 'Alifbo kodi: A=1, B=2, D=3, E=4...\n"B E D" so‘zining raqamli kodini yozing:',
                visual: '📟 B - E - D',
                answer: '243'
            }
        ]
    },
    {
        id: 'g_10_logic',
        category: '10-15',
        title: 'Mantiqiy savollar',
        icon: '🧠',
        type: 'quiz',
        desc: 'Tahliliy fikrlashni talab qiluvchi klassik mantiqiy masalalar.',
        rules: 'Barcha shartlarni diqqat bilan o‘qing va yagona to‘g‘ri xulosani tanlang.',
        questions: [
            { q: 'Ali Validan baland, lekin Sardordan past. Kim eng baland?', visual: '📏', options: ['Sardor', 'Ali', 'Vali'], answer: 'Sardor' },
            { q: 'Yugurish musobaqasida siz 2-o‘rindagi sportchini quvib o‘tdingiz. Hozir nechanchi o‘rindasiz?', visual: '🏃', options: ['2-o‘rinda', '1-o‘rinda', '3-o‘rinda'], answer: '2-o‘rinda' },
            { q: 'Soat 3:15 ni ko‘rsatmoqda. Soat va minut millari orasidagi burchak qanday?', visual: '🕒', options: ['7.5 daraja', '0 daraja', '15 daraja'], answer: '7.5 daraja' }
        ]
    },
    {
        id: 'g_10_detective',
        category: '10-15',
        title: 'Detektiv o‘yinlar',
        icon: '🕵️',
        type: 'quiz',
        desc: 'Dalillarni tahlil qiling va yolg‘onchini fosh eting!',
        rules: 'Jinoyat joyidagi dalillar va gumonlanuvchilarning ko‘rsatmalarini solishtiring.',
        questions: [
            {
                q: 'Muzeydan qimmatbaho olmos o‘g‘irlandi. Qorovul: "Men uxlab qolgandim, tushimda o‘g‘rini ko‘rdim". Direktor nega qorovulni ishdan bo‘shatdi?',
                visual: '💎',
                options: ['Ish vaqtida uxlagani uchun', 'Olmosni o‘zi olgani uchun', 'Tushi rost bo‘lgani uchun'],
                answer: 'Ish vaqtida uxlagani uchun'
            },
            {
                q: 'Qishning sovuq kunida derazasi ichkaridan muzlagan xonada jinoyat sodir bo‘ldi. Gumonlanuvchi: "Men tashqaridan derazadan qarab, ichkaridagi voqeani ko‘rdim" dedi. Nega u yolg‘on gapiryapti?',
                visual: '❄️',
                options: ['Muzlagan derazadan ichkari ko‘rinmaydi', 'Qishda deraza muzlamaydi', 'U ko‘zoynak taqmagan'],
                answer: 'Muzlagan derazadan ichkari ko‘rinmaydi'
            },
            {
                q: '3 do‘st kafega kirdi. Ofitsiant: "Pulingizni kim to‘laydi?" deb so‘radi. Jasur: "Menda pul yo‘q". Temur: "Jasur to‘lamaydi". Bekzod: "Men to‘layman". Ulardan faqat bittasi rost gapirdi. Pulni kim to‘laydi?',
                visual: '☕',
                options: ['Jasur', 'Temur', 'Bekzod'],
                answer: 'Jasur'
            }
        ]
    },

    // ---------------- 16–17 YOSH ----------------
    {
        id: 'g_16_math',
        category: '16-17',
        title: 'Murakkab matematik misollar',
        icon: '∫',
        type: 'quiz',
        desc: 'Logarifmlar, progressiyalar, trigonometriya va ehtimollar nazariyasi.',
        rules: 'Aniq hisob-kitob qiling va to‘g‘ri matematik qiymatni tanlang.',
        questions: [
            { q: 'log₂(32) + log₃(27) ning qiymati nechaga teng?', visual: '📊', options: ['8', '7', '9'], answer: '8' },
            { q: 'Arifmetik progressiyada a₁ = 3, d = 4 bo‘lsa, a₁₀ nechaga teng?', visual: '📈', options: ['39', '43', '36'], answer: '39' },
            { q: 'Ikkita o‘yin kubigi tashlanganda yig‘indi 12 chiqish ehtimoli qancha?', visual: '🎲', options: ['1/36', '1/12', '1/6'], answer: '1/36' },
            { q: 'x² - 7x + 12 = 0 tenglamaning ildizlari ko‘paytmasi nechaga teng?', visual: '🧮', options: ['12', '7', '-12'], answer: '12' }
        ]
    },
    {
        id: 'g_16_algo',
        category: '16-17',
        title: 'Algoritmik jumboqlar',
        icon: '💻',
        type: 'quiz',
        desc: 'Dasturlash mantiqi, sikllar va sanoq sistemalari.',
        rules: 'Algoritm bajarilishi natijasida o‘zgaruvchining yakuniy qiymatini toping.',
        questions: [
            { q: 'Ikkilik sanoq sistemasidagi 10110₂ soni o‘nlikda nechaga teng?', visual: '0101', options: ['22', '18', '26'], answer: '22' },
            { q: 'Algoritm: x = 2; for i in range(1, 5): x = x * i. Yakunda x nechaga teng?', visual: '⚙️', options: ['48', '24', '120'], answer: '48' },
            { q: 'Saralangan 1024 ta elementli massivdan Binary Search (ikkilik qidiruv) eng ko‘pi bilan nechta qadamda elementni topadi?', visual: '🔍', options: ['10', '512', '32'], answer: '10' }
        ]
    },
    {
        id: 'g_16_strategy',
        category: '16-17',
        title: 'Strategik o‘yinlar',
        icon: '♟️',
        type: 'quiz',
        desc: 'O‘yinlar nazariyasi va optimal yurish strategiyalari.',
        rules: 'Har ikki o‘yinchi ham ideal o‘ynaydi deb hisoblab, g‘alaba strategiyasini toping.',
        questions: [
            { q: 'Stolda 15 ta gugurt cho‘pi bor. Navbatma-navbat 1, 2 yoki 3 ta cho‘p olish mumkin. Oxirgi cho‘pni olgan yutadi. Birinchi o‘yinchi yutishi uchun nechta cho‘p olishi kerak?', visual: '🔥', options: ['3 ta', '1 ta', '2 ta'], answer: '3 ta' },
            { q: 'Shaxmat taxtasining qarama-qarshi ikkita burchak katagi kesib tashlandi (62 katak qoldi). Uni 2×1 o‘lchamli 31 ta domino bilan to‘liq qoplash mumkinmi?', visual: '🏁', options: ['Yo‘q, chunki bir xil rangdagi kataklar kesilgan', 'Ha, bemalol mumkin', 'Faqat chetidan boshlasa mumkin'], answer: 'Yo‘q, chunki bir xil rangdagi kataklar kesilgan' },
            { q: '3 ta quti bor: "Olmalar", "Apelsinlar", "Aralash". Barcha yorliqlar NOTO‘G‘RI yopishtirilgan. Faqat 1 ta qutidan 1 dona meva olib barchasini to‘g‘ri aniqlash uchun qaysi qutini ochish kerak?', visual: '📦', options: ['"Aralash" yozuvli qutini', '"Olmalar" yozuvli qutini', '"Apelsinlar" yozuvli qutini'], answer: '"Aralash" yozuvli qutini' }
        ]
    },
    {
        id: 'g_16_logic',
        category: '16-17',
        title: 'Mantiqiy masalalar',
        icon: '⚖️',
        type: 'quiz',
        desc: 'Deduksiya va paradoksal mantiqiy topshiriqlar.',
        rules: 'Mantiqiy ziddiyatlarni aniqlab, to‘g‘ri yechimni belgilang.',
        questions: [
            { q: '8 ta bir xil ko‘rinishdagi tangadan 1 tasi soxta (yengilroq). Pallali tarozida eng kamida necha marta o‘lchab soxta tangani aniq topish mumkin?', visual: '🪙', options: ['2 marta', '3 marta', '4 marta'], answer: '2 marta' },
            { q: 'Sayohatchi 2 eshik oldida turibdi: biri xazinaga, biri jarlikka olib boradi. 2 qo‘riqchi bor: biri doim rost, biri doim yolg‘on gapiradi. Bitta savol bilan xazinani qanday topish mumkin?', visual: '🚪', options: ['"Sherigingiz qaysi eshikni xazina deydi?" deb so‘rab, aksini tanlash', '"Siz rostgo‘ymisiz?" deb so‘rash', '"Bu eshik xazinami?" deb so‘rash'], answer: '"Sherigingiz qaysi eshikni xazina deydi?" deb so‘rab, aksini tanlash' }
        ]
    },

    // ---------------- 18–20 YOSH ----------------
    {
        id: 'g_18_cipher',
        category: '18-20',
        title: 'Shifrlarni yechish',
        icon: '🕵️‍♂️',
        type: 'input',
        desc: 'Sezar shifri, ASCII va mantiqiy kriptografiya topshiriqlari.',
        rules: 'Shifrlangan matnning kalitini toping va asl so‘zni KATTA HARFLARDA kiriting.',
        questions: [
            {
                q: 'Sezar shifri (+3 siljish): D -> A, E -> B...\nShifrlangan so‘z: "E U D L Q"\nAsl inglizcha so‘zni toping:',
                visual: '🔑 KEY = -3',
                answer: 'BRAIN'
            },
            {
                q: 'Teskari alifbo (Atbash) yoki raqamli shifr:\n3 - 15 - 4 - 5 (Ingliz alifbosidagi tartib raqamlari)\nSo‘zni kiriting:',
                visual: '📟 [3] [15] [4] [5]',
                answer: 'CODE'
            },
            {
                q: 'Mantiqiy kalit: Agar LAMP -> 4, SMART -> 5, INTELLIGENCE -> 12 bo‘lsa,\nALGORITHM -> nechaga teng?',
                visual: '🧩 WORD -> NUMBER',
                answer: '9'
            }
        ]
    },
    {
        id: 'g_18_logic',
        category: '18-20',
        title: 'Murakkab mantiqiy masalalar',
        icon: '🎓',
        type: 'quiz',
        desc: 'Oliy darajadagi analitik va kombinatorik masalalar.',
        rules: 'Barcha ehtimoliy ssenariylarni hisobga olib eng aniq javobni tanlang.',
        questions: [
            { q: 'Xonada 23 kishi bor. Ulardan kamida ikkitasining tug‘ilgan kuni bir xil oy va kunga to‘g‘ri kelish ehtimoli qanday? (Tug‘ilgan kun paradoksi)', visual: '🎂', options: ['50% dan yuqori (~50.7%)', 'Taxminan 6%', '15% atrofida'], answer: '50% dan yuqori (~50.7%)' },
            { q: '4 kishi tunda ko‘prikdan o‘tishi kerak. Ularda 1 ta fonar bor. Ko‘prikdan bir vaqtda ko‘pi bilan 2 kishi o‘ta oladi. Tezliklari: 1, 2, 5 va 10 daqiqa. Eng kamida necha daqiqada hammasi o‘tib bo‘ladi?', visual: '🔦', options: ['17 daqiqa', '19 daqiqa', '15 daqiqa'], answer: '17 daqiqa' },
            { q: 'Monti Xoll paradoksi: 3 ta eshik ortida 1 ta avtomobil va 2 ta echki bor. Siz 1-eshikni tanladingiz. Boshlovchi 3-eshikni ochdi — u yerda echki bor. Tanlovni 2-eshikka o‘zgartirsangiz yutish ehtimolingiz qancha bo‘ladi?', visual: '🏎️', options: ['2/3 (66.7%)', '1/2 (50%)', '1/3 (33.3%)'], answer: '2/3 (66.7%)' }
        ]
    },
    {
        id: 'g_18_math',
        category: '18-20',
        title: 'Murakkab matematik o‘yinlar',
        icon: '♾️',
        type: 'quiz',
        desc: 'Limitlar, hosilalar, kombinatorika va sonlar nazariyasi.',
        rules: 'Matematik formulalarni qo‘llab to‘g‘ri yechimni toping.',
        questions: [
            { q: 'f(x) = x³ - 3x² + 5 funksiyaning x = 2 nuqtadagi hosilasi f\'(2) nechaga teng?', visual: 'ƒ\'(x)', options: ['0', '4', '-2'], answer: '0' },
            { q: '6 ta turli kitobni javonga necha xil usul bilan terish mumkin (6!)?', visual: '📚', options: ['720', '120', '360'], answer: '720' },
            { q: '1 + 2 + 3 + ... + 100 barcha natural sonlar yig‘indisi nechaga teng?', visual: '∑', options: ['5050', '5000', '4950'], answer: '5050' }
        ]
    },
    {
        id: 'g_18_strategy',
        category: '18-20',
        title: 'Strategik boshqotirmalar',
        icon: '🌐',
        type: 'quiz',
        desc: 'Resurslarni taqsimlash, Nash muvozanati va mantiqiy optimallashtirish.',
        rules: 'Vaziyatni strategik baholang va optimal qarorni tanlang.',
        questions: [
            { q: '5 nafar aqlli qaroqchi 100 ta oltin tangani bo‘lishmoqchi. Eng katta qaroqchi taklif beradi: agar kamida 50% (o‘zi bilan) rozi bo‘lsa, shunday bo‘linadi, aks holda uni kemadan tashlashadi. Eng katta qaroqchi o‘ziga eng ko‘pi bilan nechta tanga olib qola oladi?', visual: '🏴‍☠️', options: ['98 ta', '51 ta', '95 ta'], answer: '98 ta' },
            { q: 'Mahbuslar dilemmasida (Prisoner\'s Dilemma) ikkala mahbus ham faqat o‘z manfaatini o‘ylasa, tizim qaysi holatga keladi?', visual: '⚖️', options: ['Ikkalasi ham bir-birini sotadi (Nash muvozanati)', 'Ikkalasi ham sukut saqlaydi', 'Biri ozod bo‘ladi'], answer: 'Ikkalasi ham bir-birini sotadi (Nash muvozanati)' }
        ]
    }
];

// ==========================================
// 3. ILOVANI ISHGA TUSHIRISH VA SAQLASH
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
    loadUserData();
    if (userState.age && userState.age >= 5 && userState.age <= 20) {
        applyUserAgeUI(userState.age);
    }
});

function loadUserData() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            userState = { ...userState, ...JSON.parse(saved) };
        } catch (e) {
            console.error('Saqlangan maʼlumotni o‘qishda xatolik:', e);
        }
    }
    updateNavbarUI();
}

function saveUserData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userState));
    updateNavbarUI();
}

function getAllGames() {
    let customGames = [];
    try {
        const raw = localStorage.getItem(CUSTOM_GAMES_KEY);
        if (raw) customGames = JSON.parse(raw);
    } catch (e) {
        customGames = [];
    }
    return [...DEFAULT_GAMES, ...customGames];
}

function updateNavbarUI() {
    document.getElementById('navTotalScore').textContent = userState.totalScore;
    document.getElementById('navAvatar').textContent = userState.avatar;
    document.getElementById('navUsername').textContent = userState.name;
    if (userState.age) {
        document.getElementById('navAgeText').textContent = `${userState.age} yosh`;
    }
}

// ==========================================
// 4. YOSHNI ANIQLASH VA FILTRLASH MANTIQI
// ==========================================
function getCategoryByAge(age) {
    if (age >= 5 && age <= 6) return '5-6';
    if (age >= 7 && age <= 9) return '7-9';
    if (age >= 10 && age <= 15) return '10-15';
    if (age >= 16 && age <= 17) return '16-17';
    if (age >= 18 && age <= 20) return '18-20';
    return null;
}

function handleAgeSubmit(event) {
    event.preventDefault();
    const ageInput = document.getElementById('ageInput');
    const errorBox = document.getElementById('ageError');
    const age = parseInt(ageInput.value, 10);

    // 7-talab: 5 yoshdan kichik yoki 20 yoshdan katta bo'lsa xatolik chiqsin
    if (isNaN(age) || age < 5 || age > 20) {
        errorBox.textContent = '⚠️ Kechirasiz! Platforma faqat 5 yoshdan 20 yoshgacha bo‘lgan foydalanuvchilar uchun mo‘ljallangan. Iltimos, 5–20 oralig‘idagi yoshni kiriting.';
        errorBox.style.display = 'block';
        return;
    }

    errorBox.style.display = 'none';
    userState.age = age;
    saveUserData();
    closeModal('ageModal');
    applyUserAgeUI(age);
}

function applyUserAgeUI(age) {
    const categoryKey = getCategoryByAge(age);
    if (!categoryKey) return;

    const catInfo = AGE_CATEGORIES[categoryKey];

    // Sahifalarni almashtirish
    document.getElementById('landingSection').style.display = 'none';
    document.getElementById('gameArenaSection').style.display = 'none';
    document.getElementById('dashboardSection').style.display = 'block';
    document.getElementById('navControls').style.display = 'flex';

    // Banner dizaynini yosh toifasiga moslash
    const banner = document.getElementById('categoryBanner');
    banner.style.background = catInfo.gradient;
    document.getElementById('categoryTag').textContent = `${catInfo.tag} (${age} yosh)`;
    document.getElementById('categoryTitle').textContent = catInfo.title;
    document.getElementById('categoryDesc').textContent = catInfo.desc;

    updateNavbarUI();
    renderGamesForCategory(categoryKey);
}

function renderGamesForCategory(categoryKey) {
    const grid = document.getElementById('gamesGrid');
    grid.innerHTML = '';

    const allGames = getAllGames();
    // MUHIM TALAB: Faqat shu yosh oralig'iga mos o'yinlar chiqsin
    const filteredGames = allGames.filter(game => game.category === categoryKey);

    filteredGames.forEach(game => {
        const best = userState.bestScores[game.id] || 0;
        const card = document.createElement('div');
        card.className = 'game-card';
        card.innerHTML = `
            <div>
                <div class="game-card-top">
                    <div class="game-icon-box">${game.icon}</div>
                    <span class="best-score-pill">🏆 Rekord: ${best} ball</span>
                </div>
                <h3>${game.title}</h3>
                <p>${game.desc}</p>
            </div>
            <button class="btn-primary btn-block" onclick="openGame('${game.id}')">
                🎮 O‘ynash
            </button>
        `;
        grid.appendChild(card);
    });
}

function goHome() {
    document.getElementById('dashboardSection').style.display = 'none';
    document.getElementById('gameArenaSection').style.display = 'none';
    document.getElementById('landingSection').style.display = 'grid';
}

// ==========================================
// 5. O'YIN MEXANIKASI (ARENA)
// ==========================================
let currentGame = null;
let currentStep = 0;
let sessionScore = 0;
let correctAnswersCount = 0;
let totalSteps = 0;

// Xotira va labirint o'yini uchun yordamchi o'zgaruvchilar
let memoryFlipped = [];
let memoryMatchedCount = 0;
let memoryLock = false;
let mazeState = { grid: [], playerPos: { r: 0, c: 0 }, levelIdx: 0 };

function openGame(gameId) {
    // Yosh kiritilmagan bo'lsa o'yin ochilmasin
    if (!userState.age) {
        openAgeModal();
        return;
    }

    const allGames = getAllGames();
    currentGame = allGames.find(g => g.id === gameId);
    if (!currentGame) return;

    document.getElementById('dashboardSection').style.display = 'none';
    document.getElementById('gameArenaSection').style.display = 'block';

    // Intro ekranini tayyorlash
    document.getElementById('arenaIcon').textContent = currentGame.icon;
    document.getElementById('arenaTitle').textContent = currentGame.title;
    document.getElementById('introEmoji').textContent = currentGame.icon;
    document.getElementById('introTitle').textContent = currentGame.title;
    document.getElementById('introRules').textContent = currentGame.rules;

    document.getElementById('gameIntroScreen').style.display = 'block';
    document.getElementById('gamePlayScreen').style.display = 'none';
    document.getElementById('gameResultScreen').style.display = 'none';
    document.getElementById('arenaProgress').textContent = 'Tayyor';
    document.getElementById('arenaScore').textContent = '0';
}

function startCurrentGame() {
    currentStep = 0;
    sessionScore = 0;
    correctAnswersCount = 0;

    if (currentGame.type === 'quiz' || currentGame.type === 'input') {
        totalSteps = currentGame.questions.length;
    } else if (currentGame.type === 'memory') {
        totalSteps = 1;
    } else if (currentGame.type === 'maze') {
        totalSteps = currentGame.levels.length;
    }

    document.getElementById('gameIntroScreen').style.display = 'none';
    document.getElementById('gameResultScreen').style.display = 'none';
    document.getElementById('gamePlayScreen').style.display = 'block';
    document.getElementById('arenaScore').textContent = '0';

    renderGameStep();
}

function renderGameStep() {
    const contentArea = document.getElementById('gameContentArea');
    const feedback = document.getElementById('gameFeedback');
    const nextBtn = document.getElementById('nextQuestionBtn');

    feedback.style.display = 'none';
    nextBtn.style.display = 'none';
    contentArea.innerHTML = '';

    document.getElementById('arenaProgress').textContent = `${currentStep + 1}/${totalSteps}`;

    // A) TEST (QUIZ) O'YINLARI
    if (currentGame.type === 'quiz') {
        const qObj = currentGame.questions[currentStep];
        const shuffledOptions = [...qObj.options].sort(() => Math.random() - 0.5);

        contentArea.innerHTML = `
            <div class="question-prompt">${qObj.q.replace(/\n/g, '<br>')}</div>
            ${qObj.visual ? `<div class="visual-stage">${qObj.visual}</div>` : ''}
            <div class="options-grid" id="optionsGrid">
                ${shuffledOptions.map(opt => `
                    <button class="option-btn" onclick="checkQuizAnswer(this, '${escapeQuotes(opt)}', '${escapeQuotes(qObj.answer)}')">
                        ${opt}
                    </button>
                `).join('')}
            </div>
        `;
    }

    // B) KOD / MATN KIRITISH O'YINLARI
    else if (currentGame.type === 'input') {
        const qObj = currentGame.questions[currentStep];
        contentArea.innerHTML = `
            <div class="question-prompt">${qObj.q.replace(/\n/g, '<br>')}</div>
            ${qObj.visual ? `<div class="visual-stage">${qObj.visual}</div>` : ''}
            <form class="text-answer-box" onsubmit="checkInputAnswer(event, '${escapeQuotes(qObj.answer)}')">
                <input type="text" id="userTextAnswer" placeholder="Javobingizni kiriting..." autocomplete="off" required>
                <button type="submit" class="btn-primary" id="submitTextBtn">Tekshirish</button>
            </form>
        `;
        setTimeout(() => document.getElementById('userTextAnswer')?.focus(), 100);
    }

    // C) XOTIRA VA JUFTLASH O'YINI
    else if (currentGame.type === 'memory') {
        memoryFlipped = [];
        memoryMatchedCount = 0;
        memoryLock = false;

        const deck = [...currentGame.pairs, ...currentGame.pairs].sort(() => Math.random() - 0.5);
        contentArea.innerHTML = `
            <div class="question-prompt">Barcha ${currentGame.pairs.length} ta juftlikni toping!</div>
            <div class="memory-grid" id="memoryGrid">
                ${deck.map((symbol, idx) => `
                    <div class="mem-card" data-symbol="${symbol}" data-index="${idx}" onclick="flipMemoryCard(this)">
                        ❓
                    </div>
                `).join('')}
            </div>
        `;
    }

    // D) LABIRINT O'YINI
    else if (currentGame.type === 'maze') {
        const levelData = currentGame.levels[currentStep];
        mazeState.grid = levelData.grid.map(row => [...row]);
        mazeState.levelIdx = currentStep;

        // O'yinchi boshlang'ich koordinatasi (2)
        for (let r = 0; r < mazeState.grid.length; r++) {
            for (let c = 0; c < mazeState.grid[r].length; c++) {
                if (mazeState.grid[r][c] === 2) {
                    mazeState.playerPos = { r, c };
                }
            }
        }
        renderMazeBoard();
    }
}

// Quiz javobini tekshirish
function checkQuizAnswer(btnElement, selected, correct) {
    const allBtns = document.querySelectorAll('.option-btn');
    allBtns.forEach(b => b.disabled = true);

    const feedback = document.getElementById('gameFeedback');
    const nextBtn = document.getElementById('nextQuestionBtn');

    if (selected === correct) {
        btnElement.classList.add('correct');
        sessionScore += 15;
        correctAnswersCount++;
        feedback.className = 'game-feedback feedback-success';
        feedback.textContent = '🎉 Barakalla! To‘g‘ri javob (+15 ball)';
    } else {
        btnElement.classList.add('wrong');
        allBtns.forEach(b => {
            if (b.textContent.trim() === correct) b.classList.add('correct');
        });
        feedback.className = 'game-feedback feedback-error';
        feedback.textContent = `❌ Noto‘g‘ri! To‘g‘ri javob: ${correct}`;
    }

    document.getElementById('arenaScore').textContent = sessionScore;
    feedback.style.display = 'block';
    nextBtn.textContent = currentStep + 1 < totalSteps ? 'Keyingi savol ➡️' : 'Natijani ko‘rish 🏆';
    nextBtn.style.display = 'inline-flex';
}

// Kiritilgan kod/matn javobini tekshirish
function checkInputAnswer(event, correct) {
    event.preventDefault();
    const input = document.getElementById('userTextAnswer');
    const btn = document.getElementById('submitTextBtn');
    const userVal = input.value.trim().toUpperCase();
    const correctVal = correct.trim().toUpperCase();

    input.disabled = true;
    btn.disabled = true;

    const feedback = document.getElementById('gameFeedback');
    const nextBtn = document.getElementById('nextQuestionBtn');

    if (userVal === correctVal) {
        sessionScore += 20;
        correctAnswersCount++;
        feedback.className = 'game-feedback feedback-success';
        feedback.textContent = '🔓 Ajoyib! Maxfiy kod to‘g‘ri topildi (+20 ball)';
    } else {
        feedback.className = 'game-feedback feedback-error';
        feedback.textContent = `❌ Xato kod! To‘g‘ri javob: ${correct}`;
    }

    document.getElementById('arenaScore').textContent = sessionScore;
    feedback.style.display = 'block';
    nextBtn.textContent = currentStep + 1 < totalSteps ? 'Keyingi topshiriq ➡️' : 'Natijani ko‘rish 🏆';
    nextBtn.style.display = 'inline-flex';
}

// Xotira o'yini kartasini ochish
function flipMemoryCard(cardEl) {
    if (memoryLock || cardEl.classList.contains('flipped') || cardEl.classList.contains('matched')) return;

    cardEl.classList.add('flipped');
    cardEl.textContent = cardEl.dataset.symbol;
    memoryFlipped.push(cardEl);

    if (memoryFlipped.length === 2) {
        memoryLock = true;
        const [c1, c2] = memoryFlipped;

        if (c1.dataset.symbol === c2.dataset.symbol) {
            c1.classList.add('matched');
            c2.classList.add('matched');
            memoryMatchedCount++;
            sessionScore += 15;
            document.getElementById('arenaScore').textContent = sessionScore;
            memoryFlipped = [];
            memoryLock = false;

            if (memoryMatchedCount === currentGame.pairs.length) {
                correctAnswersCount = 1;
                const feedback = document.getElementById('gameFeedback');
                feedback.className = 'game-feedback feedback-success';
                feedback.textContent = '🏆 Barcha juftliklar topildi! Ajoyib xotira!';
                feedback.style.display = 'block';

                const nextBtn = document.getElementById('nextQuestionBtn');
                nextBtn.textContent = 'Natijani ko‘rish 🏆';
                nextBtn.style.display = 'inline-flex';
            }
        } else {
            setTimeout(() => {
                c1.classList.remove('flipped');
                c2.classList.remove('flipped');
                c1.textContent = '❓';
                c2.textContent = '❓';
                memoryFlipped = [];
                memoryLock = false;
            }, 750);
        }
    }
}

// Labirint taxtasini chizish va boshqarish
function renderMazeBoard() {
    const contentArea = document.getElementById('gameContentArea');
    const cols = mazeState.grid[0].length;

    let cellsHTML = '';
    for (let r = 0; r < mazeState.grid.length; r++) {
        for (let c = 0; c < cols; c++) {
            const val = mazeState.grid[r][c];
            if (val === 1) {
                cellsHTML += `<div class="maze-cell maze-wall">🧱</div>`;
            } else if (val === 2) {
                cellsHTML += `<div class="maze-cell maze-path">🤖</div>`;
            } else if (val === 3) {
                cellsHTML += `<div class="maze-cell maze-path">🏆</div>`;
            } else {
                cellsHTML += `<div class="maze-cell maze-path"></div>`;
            }
        }
    }

    contentArea.innerHTML = `
        <div class="question-prompt">${currentStep + 1}-bosqich: Robotni oltin kubokka olib boring!</div>
        <div class="maze-grid" style="grid-template-columns: repeat(${cols}, 42px);">
            ${cellsHTML}
        </div>
        <div class="maze-controls">
            <div></div>
            <button class="maze-btn" onclick="moveMazePlayer(-1, 0)">⬆️</button>
            <div></div>
            <button class="maze-btn" onclick="moveMazePlayer(0, -1)">⬅️</button>
            <button class="maze-btn" onclick="moveMazePlayer(1, 0)">⬇️</button>
            <button class="maze-btn" onclick="moveMazePlayer(0, 1)">➡️</button>
        </div>
    `;
}

function moveMazePlayer(dr, dc) {
    if (!currentGame || currentGame.type !== 'maze') return;
    if (document.getElementById('nextQuestionBtn').style.display !== 'none') return;

    const nr = mazeState.playerPos.r + dr;
    const nc = mazeState.playerPos.c + dc;

    if (nr < 0 || nr >= mazeState.grid.length || nc < 0 || nc >= mazeState.grid[0].length) return;
    const targetCell = mazeState.grid[nr][nc];
    if (targetCell === 1) return; // Devor

    mazeState.grid[mazeState.playerPos.r][mazeState.playerPos.c] = 0;
    mazeState.playerPos = { r: nr, c: nc };

    if (targetCell === 3) {
        mazeState.grid[nr][nc] = 2;
        renderMazeBoard();
        sessionScore += 25;
        correctAnswersCount++;
        document.getElementById('arenaScore').textContent = sessionScore;

        const feedback = document.getElementById('gameFeedback');
        feedback.className = 'game-feedback feedback-success';
        feedback.textContent = '🎯 Labirintdan muvaffaqiyatli chiqdingiz! (+25 ball)';
        feedback.style.display = 'block';

        const nextBtn = document.getElementById('nextQuestionBtn');
        nextBtn.textContent = currentStep + 1 < totalSteps ? 'Keyingi bosqich ➡️' : 'Natijani ko‘rish 🏆';
        nextBtn.style.display = 'inline-flex';
    } else {
        mazeState.grid[nr][nc] = 2;
        renderMazeBoard();
    }
}

// Klaviatura strelkalari bilan labirintni boshqarish
document.addEventListener('keydown', (e) => {
    if (document.getElementById('gamePlayScreen').style.display === 'block' && currentGame?.type === 'maze') {
        if (e.key === 'ArrowUp') { e.preventDefault(); moveMazePlayer(-1, 0); }
        if (e.key === 'ArrowDown') { e.preventDefault(); moveMazePlayer(1, 0); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); moveMazePlayer(0, -1); }
        if (e.key === 'ArrowRight') { e.preventDefault(); moveMazePlayer(0, 1); }
    }
});

function nextQuestion() {
    currentStep++;
    if (currentStep < totalSteps) {
        renderGameStep();
    } else {
        finishCurrentGame();
    }
}

function finishCurrentGame() {
    document.getElementById('gamePlayScreen').style.display = 'none';
    document.getElementById('gameResultScreen').style.display = 'block';

    // Umumiy ball va statistikani yangilash
    userState.totalScore += sessionScore;
    userState.gamesPlayed += 1;

    const prevBest = userState.bestScores[currentGame.id] || 0;
    if (sessionScore > prevBest) {
        userState.bestScores[currentGame.id] = sessionScore;
    }

    userState.history.unshift({
        title: currentGame.title,
        score: sessionScore,
        date: new Date().toLocaleDateString('uz-UZ')
    });
    if (userState.history.length > 15) userState.history.pop();

    saveUserData();

    // Natija ekranini to'ldirish
    document.getElementById('finalEarnedScore').textContent = `+${sessionScore}`;
    document.getElementById('finalCorrectCount').textContent = `${correctAnswersCount} / ${totalSteps}`;
    document.getElementById('finalTotalUserScore').textContent = userState.totalScore;

    const trophy = document.getElementById('resultTrophy');
    const heading = document.getElementById('resultHeading');
    if (sessionScore === 0) {
        trophy.textContent = '💪';
        heading.textContent = 'Yana bir bor urinib ko‘ring!';
    } else if (correctAnswersCount === totalSteps) {
        trophy.textContent = '👑';
        heading.textContent = 'Mukammal natija! Haqiqiy daho!';
    } else {
        trophy.textContent = '🏆';
        heading.textContent = 'Barakalla! Ajoyib o‘yin!';
    }
}

function restartCurrentGame() {
    startCurrentGame();
}

function exitGame() {
    document.getElementById('gameArenaSection').style.display = 'none';
    if (userState.age) {
        applyUserAgeUI(userState.age);
    } else {
        goHome();
    }
}

// ==========================================
// 6. MODALLAR: PROFIL, REYTING VA YANGI O'YIN
// ==========================================
function openAgeModal() {
    document.getElementById('ageError').style.display = 'none';
    document.getElementById('ageInput').value = userState.age || '';
    document.getElementById('ageModal').classList.add('active');
    setTimeout(() => document.getElementById('ageInput').focus(), 100);
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Profil modali
function openProfileModal() {
    document.getElementById('profileNameInput').value = userState.name;
    document.getElementById('profAge').textContent = userState.age ? `${userState.age} yosh` : '-';
    document.getElementById('profScore').textContent = `${userState.totalScore} ball`;
    document.getElementById('profGamesPlayed').textContent = userState.gamesPlayed;

    document.querySelectorAll('.avatar-opt').forEach(el => {
        el.classList.toggle('selected', el.textContent === userState.avatar);
    });

    const historyList = document.getElementById('gameHistoryList');
    if (userState.history.length === 0) {
        historyList.innerHTML = '<li>Hali birorta o‘yin o‘ynalmagan.</li>';
    } else {
        historyList.innerHTML = userState.history.map(item => `
            <li>
                <span>🎮 ${item.title} <small style="color:#94a3b8">(${item.date})</small></span>
                <strong style="color:#34d399">+${item.score} ball</strong>
            </li>
        `).join('');
    }

    document.getElementById('profileModal').classList.add('active');
}

function selectAvatar(emoji) {
    userState.avatar = emoji;
    document.querySelectorAll('.avatar-opt').forEach(el => {
        el.classList.toggle('selected', el.textContent === emoji);
    });
}

function saveProfile() {
    const newName = document.getElementById('profileNameInput').value.trim();
    if (newName) userState.name = newName;
    saveUserData();
    closeModal('profileModal');
}

function resetAllData() {
    if (confirm('Barcha ballar va natijalar o‘chirilsinmi?')) {
        localStorage.removeItem(STORAGE_KEY);
        location.reload();
    }
}

// Eng yaxshi natijalar (Leaderboard)
function openLeaderboardModal() {
    document.getElementById('leaderboardModal').classList.add('active');
    renderLeaderboard('records');
}

function switchLeaderboardTab(tab, btnEl) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btnEl.classList.add('active');
    renderLeaderboard(tab);
}

function renderLeaderboard(tab) {
    const container = document.getElementById('leaderboardContent');
    const allGames = getAllGames();

    if (tab === 'records') {
        const entries = Object.entries(userState.bestScores);
        if (entries.length === 0) {
            container.innerHTML = '<p style="text-align:center; padding:20px;">Hali rekordlar o‘rnatilmagan. O‘yinlarni boshlang!</p>';
            return;
        }
        container.innerHTML = entries.map(([gameId, score]) => {
            const game = allGames.find(g => g.id === gameId);
            const title = game ? `${game.icon} ${game.title}` : gameId;
            return `
                <div class="lb-item">
                    <span>${title}</span>
                    <strong style="color:#fbbf24">${score} ball</strong>
                </div>
            `;
        }).join('');
    } else {
        const mockTop = [
            { name: '🦁 Amirbek (14 yosh)', score: 480 },
            { name: '🦄 Madina (11 yosh)', score: 420 },
            { name: '🤖 Sardor (17 yosh)', score: 390 },
            { name: `${userState.avatar} ${userState.name} (Siz)`, score: userState.totalScore },
            { name: '🐼 Aziz (8 yosh)', score: 210 }
        ].sort((a, b) => b.score - a.score);

        container.innerHTML = mockTop.map((p, idx) => `
            <div class="lb-item">
                <span><strong>#${idx + 1}</strong> ${p.name}</span>
                <strong style="color:#38bdf8">${p.score} ball</strong>
            </div>
        `).join('');
    }
}

// Yangi o'yin qo'shish
function openAddGameModal() {
    if (userState.age) {
        document.getElementById('customCategory').value = getCategoryByAge(userState.age);
    }
    document.getElementById('addGameModal').classList.add('active');
}

function handleCreateCustomGame(event) {
    event.preventDefault();

    const title = document.getElementById('customTitle').value.trim();
    const category = document.getElementById('customCategory').value;
    const icon = document.getElementById('customEmoji').value.trim() || '🌟';
    const desc = document.getElementById('customDesc').value.trim();

    const q1 = {
        q: document.getElementById('cq1_q').value.trim(),
        visual: icon,
        options: [
            document.getElementById('cq1_opt1').value.trim(),
            document.getElementById('cq1_opt2').value.trim(),
            document.getElementById('cq1_opt3').value.trim()
        ],
        answer: document.getElementById('cq1_opt1').value.trim()
    };

    const q2 = {
        q: document.getElementById('cq2_q').value.trim(),
        visual: icon,
        options: [
            document.getElementById('cq2_opt1').value.trim(),
            document.getElementById('cq2_opt2').value.trim(),
            document.getElementById('cq2_opt3').value.trim()
        ],
        answer: document.getElementById('cq2_opt1').value.trim()
    };

    const newGame = {
        id: 'custom_' + Date.now(),
        category,
        title,
        icon,
        type: 'quiz',
        desc,
        rules: desc,
        questions: [q1, q2]
    };

    let customGames = [];
    try {
        const raw = localStorage.getItem(CUSTOM_GAMES_KEY);
        if (raw) customGames = JSON.parse(raw);
    } catch (e) {
        customGames = [];
    }

    customGames.push(newGame);
    localStorage.setItem(CUSTOM_GAMES_KEY, JSON.stringify(customGames));

    document.getElementById('addGameForm').reset();
    closeModal('addGameModal');

    if (userState.age && getCategoryByAge(userState.age) === category) {
        renderGamesForCategory(category);
    } else {
        alert(`✅ "${title}" o‘yini ${category} yosh toifasiga muvaffaqiyatli qo‘shildi!`);
    }
}

function escapeQuotes(str) {
    return String(str).replace(/'/g, "\\'").replace(/"/g, '"');
}