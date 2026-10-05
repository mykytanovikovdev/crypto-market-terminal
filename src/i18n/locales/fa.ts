import type en from '@/i18n/locales/en';

const fa: typeof en = {
    app: {
        skipToContent: 'رفتن به محتوا',
        pageTitle: "{page} {'|'} Market Terminal",
    },
    nav: {
        label: 'منوی اصلی',
        markets: 'بازارها',
        watchlist: 'واچ‌لیست',
        about: 'درباره',
    },
    language: {
        label: 'زبان',
    },
    liveStatus: {
        idle: '',
        idleHint: '',
        connecting: 'در حال اتصال…',
        connectingHint: 'در حال اتصال به قیمت‌های زنده Binance.',
        live: 'زنده',
        liveHint: 'قیمت‌ها به‌صورت لحظه‌ای از Binance به‌روز می‌شوند.',
        reconnecting: 'اتصال مجدد…',
        reconnectingHint: 'اتصال به Binance قطع شد. در حال اتصال مجدد.',
        paused: 'متوقف',
        pausedHint: 'وقتی این تب در پس‌زمینه است، به‌روزرسانی زنده متوقف می‌شود.',
        unavailable: 'آفلاین',
        unavailableHint: 'قیمت‌های زنده در دسترس نیست. داده‌های CoinGecko نمایش داده می‌شود.',
    },
    theme: {
        switchToDark: 'رفتن به حالت تیره',
        switchToLight: 'رفتن به حالت روشن',
    },
    requestState: {
        loading: 'در حال بارگذاری داده‌های بازار…',
        empty: 'ارزی برای نمایش وجود ندارد.',
        retry: 'تلاش دوباره',
    },
    markets: {
        title: 'قیمت امروز ارزهای دیجیتال',
        description: '{count} ارز برتر بر اساس ارزش بازار، با قیمت دلار آمریکا.',
        updatedAt: 'به‌روزرسانی: {time}',
        noResults: 'هیچ ارزی با جستجو یا فیلترهای شما مطابقت ندارد.',
        resetFilters: 'پاک کردن جستجو و فیلترها',
    },
    marketToolbar: {
        movementLabel: 'فیلتر بر اساس تغییر 24 ساعته',
        all: 'همه',
        gainers: 'صعودی',
        losers: 'نزولی',
        searchLabel: 'جستجوی ارز',
        searchPlaceholder: 'جستجو با نام یا نماد',
        rowsLabel: 'تعداد ردیف',
    },
    watchlist: {
        title: 'واچ‌لیست',
        description: 'ارزهایی که در صفحه بازارها ستاره‌دار کرده‌اید.',
        emptyTitle: 'واچ‌لیست شما خالی است',
        emptyText: 'در صفحه بازارها روی ستاره کنار هر ارز بزنید تا اینجا نمایش داده شود.',
        emptyAction: 'رفتن به بازارها',
    },
    about: {
        title: 'درباره Market Terminal',
        intro: 'Market Terminal بزرگ‌ترین ارزهای دیجیتال را بر اساس ارزش بازار نشان می‌دهد: قیمت فعلی، تغییرات کوتاه‌مدت، حجم معاملات و روند هفت روز گذشته در یک نگاه.',
        dataTitle: 'داده‌ها',
        dataText:
            'داده‌های بازار از API عمومی CoinGecko دریافت می‌شود. برای ارزهایی که در Binance معامله می‌شوند، قیمت و تغییر 24 ساعته از طریق جریان عمومی داده‌های بازار به‌صورت زنده به‌روز می‌شود.',
        stackTitle: 'ساخته‌شده با',
        sourceTitle: 'کد منبع',
        sourceLink: 'مشاهده مخزن در GitHub',
        disclaimer: 'قیمت‌ها فقط جنبه اطلاع‌رسانی دارند و توصیه مالی نیستند.',
    },
    marketTable: {
        caption: 'قیمت ارزهای دیجیتال',
        columns: {
            watch: 'واچ‌لیست',
            rank: 'رتبه',
            rankShort: '#',
            name: 'نام',
            price: 'قیمت',
            change1h: '1 ساعت %',
            change24h: '24 ساعت %',
            change7d: '7 روز %',
            marketCap: 'ارزش بازار',
            volume24h: 'حجم (24 ساعت)',
            circulatingSupply: 'عرضه در گردش',
            last7Days: '7 روز گذشته',
        },
        addToWatchlist: 'افزودن {name} به واچ‌لیست',
        removeFromWatchlist: 'حذف {name} از واچ‌لیست',
        sparklineLabel: 'قیمت {name} در 7 روز گذشته',
    },
    priceChange: {
        up: 'افزایش',
        down: 'کاهش',
        notAvailable: 'در دسترس نیست',
    },
    errors: {
        rateLimited: 'به سقف درخواست‌های CoinGecko رسیدیم. یک دقیقه دیگر دوباره تلاش کنید.',
        network: 'اتصال به CoinGecko برقرار نشد. اتصال اینترنت را بررسی کنید و دوباره تلاش کنید.',
        http: 'CoinGecko با خطا پاسخ داد ({status}).',
        unknown: 'هنگام بارگذاری داده‌های بازار مشکلی پیش آمد.',
    },
};

export default fa;
