import type { Locale } from '../site.ts';

export interface Step {
    title: string;
    body: string;
}

export interface Question {
    question: string;
    answer: string;
}

export interface Reason {
    title: string;
    body: string;
}

export interface Figure {
    value: string;
    label: string;
}

export interface HomeCopy {
    title: string;
    description: string;
    hero: {
        heading: [string, string, string];
        lead: string;
        primary: string;
        photoAlt: string;
        badge: Figure;
    };
    trust: string[];
    stats: Figure[];
    services: { heading: string; lead: string };
    whyUs: {
        heading: string;
        lead: string;
        photoLargeAlt: string;
        photoSmallAlt: string;
        reasons: Reason[];
    };
    steps: { heading: string; lead: string; items: Step[] };
    testimonials: { heading: string; lead: string };
    area: { heading: string; lead: string; map: string };
    guides: { heading: string; lead: string };
    faq: { heading: string; note: string; items: Question[] };
    callBand: { heading: string; body: string };
}

export const home: Record<Locale, HomeCopy> = {
    lv: {
        title: 'Pakalpojumi Rīgā ar rakstisku tāmi',
        description:
            'Parauga sākumlapa uzņēmumam Rīgā un apkārtnē: ko darām, cik tas maksā, paveiktie darbi, klientu atsauksmes un kā sazināties.',
        hero: {
            heading: [
                'Pakalpojumi',
                'Rīgā:',
                'ātri, saprotami un ar rakstisku tāmi',
            ],
            lead: 'Šeit divos teikumos pastāstiet, ko uzņēmums dara un kam tas ir domāts. Otrajā teikumā pasakiet, kāpēc klientam ir vērts zvanīt tieši jums.',
            primary: 'Pieprasīt cenu',
            photoAlt: 'Parauga attēls sākumlapas galvenajai sadaļai',
            badge: {
                value: '00',
                label: 'Viens skaitlis, ar ko lepojaties',
            },
        },
        trust: [
            'Pirmais īsais solījums',
            'Otrais īsais solījums',
            'Trešais īsais solījums',
            'Ceturtais īsais solījums',
        ],
        stats: [
            { value: '01', label: 'Pirmais skaitlis par uzņēmumu' },
            { value: '02', label: 'Otrais, piemēram, atbildes laiks' },
            { value: '03', label: 'Trešais, piemēram, sākuma cena' },
            { value: '04', label: 'Ceturtais, piemēram, klientu skaits' },
        ],
        services: {
            heading: 'Ko mēs darām',
            lead: 'Katram pakalpojumam ir sava lapa ar aprakstu, darba gaitu, cenām un atbildēm uz jautājumiem.',
        },
        whyUs: {
            heading: 'Kāpēc klienti izvēlas mūs',
            lead: 'Šajā rindkopā uzrakstiet, ar ko jūsu darbs atšķiras no citiem un ko klients no tā iegūst. Trīs iemesli zemāk to izskaidro sīkāk.',
            photoLargeAlt:
                'Parauga attēls: lielā fotogrāfija sadaļai par uzņēmumu',
            photoSmallAlt:
                'Parauga attēls: mazā fotogrāfija sadaļai par uzņēmumu',
            reasons: [
                {
                    title: 'Pirmais iemesls',
                    body: 'Viens vai divi teikumi par to, kā jūs strādājat un kāpēc tas klientam ir svarīgi.',
                },
                {
                    title: 'Otrais iemesls',
                    body: 'Konkrēts piemērs, kas šo atšķirību parāda darbā, nevis tikai vārdos.',
                },
                {
                    title: 'Trešais iemesls',
                    body: 'Ko klients saņem pēc darba: dokumentu, atbalstu vai citu lietu, ko varat apsolīt.',
                },
            ],
        },
        steps: {
            heading: 'Kā notiek darbs',
            lead: 'Četri soļi no pirmā zvana līdz paveiktam darbam. Aizstājiet tos ar sava procesa soļiem.',
            items: [
                {
                    title: 'Zvans vai ziņa',
                    body: 'Klients pastāsta, kas vajadzīgs, un jūs vienojaties par nākamo soli.',
                },
                {
                    title: 'Cena un termiņš',
                    body: 'Pirms darbs sākas, klients saņem cenu un termiņu rakstiski.',
                },
                {
                    title: 'Darbs saskaņotā laikā',
                    body: 'Strādājat norunātajā laikā un par katru izmaiņu jautājat, pirms to darāt.',
                },
                {
                    title: 'Nodošana',
                    body: 'Parādāt paveikto un atstājat klientam visu, kas viņam vēlāk būs vajadzīgs.',
                },
            ],
        },
        testimonials: {
            heading: 'Ko saka klienti',
            lead: 'Atsauksmes no klientiem, katra ar darba veidu, vietu un mēnesi.',
        },
        area: {
            heading: 'Kur strādājam',
            lead: 'Bāzējamies Rīgā un strādājam arī tuvākajās apdzīvotajās vietās. Katrai vietai ir sava lapa.',
            map: 'Karte: Rīga un vietas, kur strādājam',
        },
        guides: {
            heading: 'Padomi',
            lead: 'Raksti ar atbildēm uz jautājumiem, ko klienti uzdod visbiežāk.',
        },
        faq: {
            heading: 'Biežāk uzdotie jautājumi',
            note: 'Neatradāt atbildi? Zvaniet darba laikā.',
            items: [
                {
                    question: 'Cik maksā jūsu pakalpojumi?',
                    answer: 'Šeit norādiet sākuma cenu vai paskaidrojiet, no kā cena ir atkarīga, un kur klients var atrast cenu lapu.',
                },
                {
                    question: 'Cik ātri varat sākt?',
                    answer: 'Šeit pasakiet, cik ātri parasti atbildat uz pieteikumu un pēc cik ilga laika varat sākt darbu.',
                },
                {
                    question: 'Vai strādājat arī ārpus Rīgas?',
                    answer: 'Šeit uzskaitiet vietas, kur strādājat, un pasakiet, vai izbraukšana ārpus pilsētas maksā papildus.',
                },
            ],
        },
        callBand: {
            heading: 'Vajadzīga cena vai padoms?',
            body: 'Zvaniet darba laikā vai atstājiet pieteikumu, un mēs sazināsimies darba dienas laikā.',
        },
    },
    ru: {
        title: 'Услуги в Риге с письменной сметой',
        description:
            'Пример главной страницы компании в Риге и окрестностях: что мы делаем, сколько это стоит, наши работы, отзывы клиентов и контакты.',
        hero: {
            heading: [
                'Услуги',
                'в Риге:',
                'быстро, понятно и с письменной сметой',
            ],
            lead: 'Здесь в двух предложениях расскажите, чем занимается компания и для кого она работает. Во втором предложении объясните, почему клиенту стоит позвонить именно вам.',
            primary: 'Запросить цену',
            photoAlt: 'Пример изображения для главного блока страницы',
            badge: {
                value: '00',
                label: 'Одна цифра, которой вы гордитесь',
            },
        },
        trust: [
            'Первое короткое обещание',
            'Второе короткое обещание',
            'Третье короткое обещание',
            'Четвёртое короткое обещание',
        ],
        stats: [
            { value: '01', label: 'Первая цифра о компании' },
            { value: '02', label: 'Вторая, например время ответа' },
            { value: '03', label: 'Третья, например начальная цена' },
            { value: '04', label: 'Четвёртая, например число клиентов' },
        ],
        services: {
            heading: 'Что мы делаем',
            lead: 'У каждой услуги своя страница с описанием, ходом работ, ценами и ответами на вопросы.',
        },
        whyUs: {
            heading: 'Почему клиенты выбирают нас',
            lead: 'В этом абзаце напишите, чем ваша работа отличается от других и что клиент от этого получает. Три причины ниже объясняют это подробнее.',
            photoLargeAlt:
                'Пример изображения: большая фотография для блока о компании',
            photoSmallAlt:
                'Пример изображения: маленькая фотография для блока о компании',
            reasons: [
                {
                    title: 'Первая причина',
                    body: 'Одно-два предложения о том, как вы работаете и почему это важно клиенту.',
                },
                {
                    title: 'Вторая причина',
                    body: 'Конкретный пример, который показывает это отличие в деле, а не только на словах.',
                },
                {
                    title: 'Третья причина',
                    body: 'Что клиент получает после работы: документ, поддержку или другое, что вы можете пообещать.',
                },
            ],
        },
        steps: {
            heading: 'Как проходит работа',
            lead: 'Четыре шага от первого звонка до готовой работы. Замените их шагами своего процесса.',
            items: [
                {
                    title: 'Звонок или заявка',
                    body: 'Клиент рассказывает, что нужно, и вы договариваетесь о следующем шаге.',
                },
                {
                    title: 'Цена и срок',
                    body: 'До начала работы клиент получает цену и срок в письменном виде.',
                },
                {
                    title: 'Работа в согласованный срок',
                    body: 'Работаете в оговорённое время и о каждом изменении спрашиваете, прежде чем его сделать.',
                },
                {
                    title: 'Сдача',
                    body: 'Показываете результат и оставляете клиенту всё, что понадобится ему позже.',
                },
            ],
        },
        testimonials: {
            heading: 'Что говорят клиенты',
            lead: 'Отзывы клиентов, у каждого указаны вид работы, место и месяц.',
        },
        area: {
            heading: 'Где мы работаем',
            lead: 'Базируемся в Риге и работаем в ближайших населённых пунктах. У каждого места своя страница.',
            map: 'Карта: Рига и места, где мы работаем',
        },
        guides: {
            heading: 'Советы',
            lead: 'Статьи с ответами на вопросы, которые клиенты задают чаще всего.',
        },
        faq: {
            heading: 'Частые вопросы',
            note: 'Не нашли ответ? Позвоните в рабочее время.',
            items: [
                {
                    question: 'Сколько стоят ваши услуги?',
                    answer: 'Здесь укажите начальную цену или объясните, от чего зависит цена и где клиент найдёт страницу цен.',
                },
                {
                    question: 'Как быстро вы можете начать?',
                    answer: 'Здесь скажите, как быстро вы обычно отвечаете на заявку и через сколько времени можете начать работу.',
                },
                {
                    question: 'Работаете ли вы за пределами Риги?',
                    answer: 'Здесь перечислите места, где вы работаете, и скажите, платный ли выезд за пределы города.',
                },
            ],
        },
        callBand: {
            heading: 'Нужна цена или совет?',
            body: 'Позвоните в рабочее время или оставьте заявку, и мы свяжемся с вами в течение рабочего дня.',
        },
    },
};
