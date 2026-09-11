import type { Locale, ServiceGroup } from '../site.ts';

export type WizardStep = 'work' | 'details' | 'place' | 'contact';
export type Urgency = 'asap' | 'month' | 'planning';

export interface Strings {
    tagline: string;
    openingHours: string;
    skipToContent: string;
    language: string;
    menu: string;
    close: string;
    breadcrumbs: string;
    base: {
        name: string;
        inPlace: string;
    };
    services: {
        from: string;
        priceFrom: string;
        onRequest: string;
        all: string;
        others: string;
        more: string;
        questions: string;
        whereWeDo: string;
        prices: string;
        asideLabel: string;
        asideHeading: string;
        groups: Record<ServiceGroup, string>;
    };
    locations: {
        all: string;
        distance: string;
        travelTime: string;
        km: string;
        minutes: string;
        more: string;
        servicesIn: string;
        questionsIn: string;
        testimonialsIn: string;
    };
    prices: {
        perService: string;
        examples: string;
        total: string;
    };
    faq: {
        more: string;
    };
    reviews: {
        leave: string;
    };
    jobs: {
        all: string;
        done: string;
        duration: string;
        price: string;
        year: string;
        before: string;
        after: string;
        service: string;
        town: string;
        view: string;
    };
    guides: {
        all: string;
        published: string;
        updated: string;
        relatedServices: string;
    };
    wizard: {
        title: string;
        lead: string;
        progress: string;
        step: string;
        of: string;
        steps: Record<WizardStep, string>;
        questions: Record<WizardStep, string>;
        urgency: string;
        urgencies: Record<Urgency, string>;
        message: string;
        address: string;
        place: string;
        contactLead: string;
        unanswered: string;
        back: string;
        next: string;
    };
    form: {
        heading: string;
        intro: string;
        name: string;
        phone: string;
        email: string;
        emailLabel: string;
        service: string;
        serviceOther: string;
        location: string;
        locationOther: string;
        choose: string;
        message: string;
        submit: string;
        consent: string;
        consentLink: string;
        honeypot: string;
    };
    nav: {
        home: string;
        services: string;
        prices: string;
        jobs: string;
        faq: string;
        reviews: string;
        locations: string;
        guides: string;
        about: string;
        contact: string;
        privacy: string;
    };
    cta: {
        call: string;
        callUs: string;
        requestQuote: string;
    };
    callBar: {
        lead: string;
        body: string;
    };
    footer: {
        hours: string;
        address: string;
        registration: string;
        vat: string;
        rights: string;
    };
}

export const strings: Record<Locale, Strings> = {
    lv: {
        tagline: 'Pakalpojumi Rīgā un apkārtnē',
        openingHours: 'P.–Pk. 8:00–18:00, S. 9:00–14:00',
        skipToContent: 'Pāriet uz saturu',
        language: 'Valoda',
        menu: 'Izvēlne',
        close: 'Aizvērt',
        breadcrumbs: 'Navigācijas ceļš',
        base: { name: 'Rīga', inPlace: 'Rīgā' },
        services: {
            from: 'no',
            priceFrom: 'Cena no',
            onRequest: 'Pēc pieprasījuma',
            all: 'Visi pakalpojumi',
            others: 'Citi pakalpojumi',
            more: 'Vairāk',
            questions: 'Jautājumi par šo darbu',
            whereWeDo: 'Kur veicam šo darbu',
            prices: 'Cenas',
            asideLabel: 'Vajadzīga palīdzība?',
            asideHeading:
                'Zvaniet vai atstājiet pieteikumu, atbildam darba dienas laikā',
            groups: {
                core: 'Pamatpakalpojumi',
                extra: 'Papildu pakalpojumi',
            },
        },
        locations: {
            all: 'Visas pilsētas',
            distance: 'Attālums no Rīgas',
            travelTime: 'Ceļā no bāzes',
            km: 'km',
            minutes: 'min',
            more: 'Vairāk par pakalpojumu',
            servicesIn: 'Pakalpojumi',
            questionsIn: 'Jautājumi par darbiem',
            testimonialsIn: 'Klientu atsauksmes',
        },
        prices: {
            perService: 'Cenas pa pakalpojumiem',
            examples: 'Tāmes piemēri',
            total: 'Kopā',
        },
        faq: {
            more: 'Vairāk',
        },
        reviews: {
            leave: 'Atstāt atsauksmi Google kartēs',
        },
        jobs: {
            all: 'Visi darbi',
            done: 'Paveiktie darbi',
            duration: 'Ilgums',
            price: 'Cena',
            year: 'Gads',
            before: 'Pirms',
            after: 'Pēc',
            service: 'Pakalpojums',
            town: 'Pilsēta',
            view: 'Skatīt darbu',
        },
        guides: {
            all: 'Visi raksti',
            published: 'Publicēts',
            updated: 'Atjaunināts',
            relatedServices: 'Saistītie pakalpojumi',
        },
        wizard: {
            title: 'Pieprasīt cenu pāris jautājumos',
            lead: 'Četras atbildes, un vienas darba dienas laikā sazināsimies ar cenas piedāvājumu. Precīzu cenu apstiprinām, kad darbs ir saskaņots.',
            progress: 'Soļi',
            step: 'Solis',
            of: 'no',
            steps: {
                work: 'Darbs',
                details: 'Detaļas',
                place: 'Vieta',
                contact: 'Kontakti',
            },
            questions: {
                work: 'Kas jādara?',
                details: 'Cik steidzami un kas mums jāzina?',
                place: 'Kur atrodas objekts?',
                contact: 'Kā ar jums sazināties?',
            },
            urgency: 'Cik steidzami?',
            urgencies: {
                asap: 'Pēc iespējas ātrāk',
                month: 'Mēneša laikā',
                planning: 'Plānoju, laiks nespiež',
            },
            message: 'Ziņa',
            address: 'Adrese vai apdzīvota vieta (nav obligāts)',
            place: 'Vieta',
            contactLead:
                'Sazināsimies vienas darba dienas laikā un piedāvāsim cenu. Ja jautājums ir steidzams, labāk zvaniet.',
            unanswered: 'Nav norādīts',
            back: 'Atpakaļ',
            next: 'Tālāk',
        },
        form: {
            heading: 'Pieprasīt tāmi',
            intro: 'Aizpildiet formu, un vienas darba dienas laikā sazināsimies, lai precizētu darbu, laiku un cenu. Ja jautājums ir steidzams, labāk zvaniet.',
            name: 'Vārds',
            phone: 'Tālrunis',
            email: 'E-pasts (nav obligāts)',
            emailLabel: 'E-pasts',
            service: 'Kāds pakalpojums vajadzīgs',
            serviceOther: 'Nezinu vai cits darbs',
            location: 'Kur atrodas objekts',
            locationOther: 'Cita vieta',
            choose: 'Izvēlieties',
            message: 'Īsi par darbu (nav obligāts)',
            submit: 'Nosūtīt pieteikumu',
            consent: 'Nosūtot pieteikumu, piekrītat datu apstrādei saskaņā ar',
            consentLink: 'privātuma politiku',
            honeypot: 'Atstājiet šo lauku tukšu',
        },
        nav: {
            home: 'Sākums',
            services: 'Pakalpojumi',
            prices: 'Cenas',
            jobs: 'Darbi',
            faq: 'Jautājumi',
            reviews: 'Atsauksmes',
            locations: 'Pilsētas',
            guides: 'Padomi',
            about: 'Par mums',
            contact: 'Kontakti',
            privacy: 'Privātuma politika',
        },
        cta: {
            call: 'Zvanīt',
            callUs: 'Zvaniet mums',
            requestQuote: 'Pieprasīt cenu',
        },
        callBar: {
            lead: 'Steidzami?',
            body: 'Zvaniet, atbildam uzreiz.',
        },
        footer: {
            hours: 'Darba laiks',
            address: 'Adrese',
            registration: 'Reģ. Nr.',
            vat: 'PVN Nr.',
            rights: 'Visas tiesības aizsargātas.',
        },
    },
    ru: {
        tagline: 'Услуги в Риге и окрестностях',
        openingHours: 'Пн–Пт 8:00–18:00, Сб 9:00–14:00',
        skipToContent: 'Перейти к содержимому',
        language: 'Язык',
        menu: 'Меню',
        close: 'Закрыть',
        breadcrumbs: 'Навигация',
        base: { name: 'Рига', inPlace: 'в Риге' },
        services: {
            from: 'от',
            priceFrom: 'Цена от',
            onRequest: 'По запросу',
            all: 'Все услуги',
            others: 'Другие услуги',
            more: 'Подробнее',
            questions: 'Вопросы об этой работе',
            whereWeDo: 'Где выполняем эту работу',
            prices: 'Цены',
            asideLabel: 'Нужна помощь?',
            asideHeading:
                'Позвоните или оставьте заявку, ответим в течение рабочего дня',
            groups: {
                core: 'Основные услуги',
                extra: 'Дополнительные услуги',
            },
        },
        locations: {
            all: 'Все города',
            distance: 'Расстояние от Риги',
            travelTime: 'В пути от базы',
            km: 'км',
            minutes: 'мин',
            more: 'Подробнее об услуге',
            servicesIn: 'Услуги',
            questionsIn: 'Вопросы о работах',
            testimonialsIn: 'Отзывы клиентов',
        },
        prices: {
            perService: 'Цены по услугам',
            examples: 'Примеры сметы',
            total: 'Итого',
        },
        faq: {
            more: 'Подробнее',
        },
        reviews: {
            leave: 'Оставить отзыв в Google Картах',
        },
        jobs: {
            all: 'Все работы',
            done: 'Выполненные работы',
            duration: 'Срок',
            price: 'Цена',
            year: 'Год',
            before: 'До',
            after: 'После',
            service: 'Услуга',
            town: 'Город',
            view: 'Посмотреть работу',
        },
        guides: {
            all: 'Все статьи',
            published: 'Опубликовано',
            updated: 'Обновлено',
            relatedServices: 'Связанные услуги',
        },
        wizard: {
            title: 'Запросить цену за пару вопросов',
            lead: 'Четыре ответа, и в течение одного рабочего дня мы свяжемся с вами с предложением цены. Точную цену подтвердим, когда согласуем работу.',
            progress: 'Шаги',
            step: 'Шаг',
            of: 'из',
            steps: {
                work: 'Работа',
                details: 'Детали',
                place: 'Место',
                contact: 'Контакты',
            },
            questions: {
                work: 'Что нужно сделать?',
                details: 'Насколько срочно и что нам нужно знать?',
                place: 'Где находится объект?',
                contact: 'Как с вами связаться?',
            },
            urgency: 'Насколько срочно?',
            urgencies: {
                asap: 'Как можно скорее',
                month: 'В течение месяца',
                planning: 'Планирую, время терпит',
            },
            message: 'Сообщение',
            address: 'Адрес или населённый пункт (необязательно)',
            place: 'Место',
            contactLead:
                'Свяжемся с вами в течение одного рабочего дня и предложим цену. Если вопрос срочный, лучше позвоните.',
            unanswered: 'Не указано',
            back: 'Назад',
            next: 'Далее',
        },
        form: {
            heading: 'Запросить смету',
            intro: 'Заполните форму, и в течение одного рабочего дня мы свяжемся с вами, чтобы уточнить задачу, сроки и цену. Если вопрос срочный, лучше позвоните.',
            name: 'Имя',
            phone: 'Телефон',
            email: 'Эл. почта (необязательно)',
            emailLabel: 'Эл. почта',
            service: 'Какая услуга нужна',
            serviceOther: 'Не знаю или другая работа',
            location: 'Где находится объект',
            locationOther: 'Другое место',
            choose: 'Выберите',
            message: 'Коротко о задаче (необязательно)',
            submit: 'Отправить заявку',
            consent:
                'Отправляя заявку, вы соглашаетесь на обработку данных согласно',
            consentLink: 'политике конфиденциальности',
            honeypot: 'Оставьте это поле пустым',
        },
        nav: {
            home: 'Главная',
            services: 'Услуги',
            prices: 'Цены',
            jobs: 'Работы',
            faq: 'Вопросы',
            reviews: 'Отзывы',
            locations: 'Города',
            guides: 'Советы',
            about: 'О нас',
            contact: 'Контакты',
            privacy: 'Политика конфиденциальности',
        },
        cta: {
            call: 'Позвонить',
            callUs: 'Позвоните нам',
            requestQuote: 'Запросить цену',
        },
        callBar: {
            lead: 'Срочно?',
            body: 'Звоните, ответим сразу.',
        },
        footer: {
            hours: 'Время работы',
            address: 'Адрес',
            registration: 'Рег. №',
            vat: 'НДС №',
            rights: 'Все права защищены.',
        },
    },
};

export function t(locale: Locale): Strings {
    return strings[locale];
}
