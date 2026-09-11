import type { Locale } from '../site.ts';

export interface HubCopy {
    title: string;
    heading: string;
    description: string;
    intro: string;
}

export interface ServicesHubCopy extends HubCopy {
    guarantee: { heading: string; body: string[] };
}

export const hubs: Record<
    Locale,
    {
        services: ServicesHubCopy;
        locations: HubCopy;
        guides: HubCopy;
        jobs: HubCopy;
    }
> = {
    lv: {
        services: {
            title: 'Pakalpojumi un cenas Rīgā',
            heading: 'Pakalpojumi',
            description:
                'Visi pakalpojumi vienā lapā: īss apraksts, sākuma cena un saite uz lapu, kur ir darba gaita, cenas un atbildes uz jautājumiem.',
            intro: 'Šajā lapā ir visi uzņēmuma pakalpojumi. Katram ir sava lapa ar aprakstu, darba soļiem, cenām un atbildēm uz biežākajiem jautājumiem.',
            guarantee: {
                heading: 'Garantija un atbildība',
                body: [
                    'Šajā rindkopā aprakstiet, kādu garantiju dodat darbam, cik ilgi tā ir spēkā un kā klients to var izmantot. Ja garantijas nav, sadaļu var pārdēvēt un tajā aprakstīt citu solījumu.',
                    'Otrajā rindkopā pastāstiet par apdrošināšanu, licencēm vai citiem dokumentiem, kas klientam dod drošību, un pasakiet, kur tos var apskatīt.',
                ],
            },
        },
        locations: {
            title: 'Kur strādājam: Rīga un apkārtne',
            heading: 'Pilsētas',
            description:
                'Vietas, kur uzņēmums strādā: Rīga un tuvākās pilsētas. Katrai vietai ir sava lapa ar attālumu, laiku ceļā un pakalpojumiem.',
            intro: 'Bāzējamies Rīgā un strādājam arī apkārtnē. Katrai vietai ir sava lapa, jo katrā vietā darbi un klientu jautājumi ir mazliet citādi.',
        },
        jobs: {
            title: 'Paveiktie darbi ar fotogrāfijām',
            heading: 'Paveiktie darbi',
            description:
                'Paveiktie darbi ar fotogrāfijām pirms un pēc: kāds bija uzdevums, ko izdarījām, cik ilgi tas aizņēma un cik tas maksāja.',
            intro: 'Katram darbam ir sava lapa: kāds bija uzdevums, ko izdarījām, cik ilgi tas aizņēma un cik maksāja. Fotogrāfijas pirms un pēc darba.',
        },
        guides: {
            title: 'Padomi un raksti klientiem',
            heading: 'Padomi',
            description:
                'Raksti ar atbildēm uz to, ko klienti jautā pirms pakalpojuma pasūtīšanas: cenas, termiņi, sagatavošanās un izvēle.',
            intro: 'Rakstām par to, ko klienti jautā visbiežāk: cik tas maksā, cik ilgi tas aizņem, kā sagatavoties un kā izvēlēties. Īsi un saprotami.',
        },
    },
    ru: {
        services: {
            title: 'Услуги и цены в Риге',
            heading: 'Услуги',
            description:
                'Все услуги на одной странице: краткое описание, начальная цена и ссылка на страницу с ходом работ, ценами и ответами на вопросы.',
            intro: 'На этой странице собраны все услуги компании. У каждой своя страница с описанием, этапами работы, ценами и ответами на частые вопросы.',
            guarantee: {
                heading: 'Гарантия и ответственность',
                body: [
                    'В этом абзаце опишите, какую гарантию вы даёте на работу, сколько она действует и как клиент может ею воспользоваться. Если гарантии нет, раздел можно переименовать и описать в нём другое обещание.',
                    'Во втором абзаце расскажите о страховке, лицензиях или других документах, которые дают клиенту уверенность, и скажите, где их можно посмотреть.',
                ],
            },
        },
        locations: {
            title: 'Где мы работаем: Рига и окрестности',
            heading: 'Города',
            description:
                'Места, где работает компания: Рига и ближайшие города. У каждого места своя страница с расстоянием, временем в пути и услугами.',
            intro: 'Базируемся в Риге и работаем в окрестностях. У каждого места своя страница, потому что в каждом месте работы и вопросы клиентов немного отличаются.',
        },
        jobs: {
            title: 'Выполненные работы с фотографиями',
            heading: 'Наши работы',
            description:
                'Выполненные работы с фотографиями до и после: какая была задача, что мы сделали, сколько времени это заняло и сколько стоило.',
            intro: 'У каждой работы своя страница: какая была задача, что мы сделали, сколько времени это заняло и сколько стоило. Фотографии до и после.',
        },
        guides: {
            title: 'Советы и статьи для клиентов',
            heading: 'Советы',
            description:
                'Статьи с ответами на то, что клиенты спрашивают перед заказом услуги: цены, сроки, подготовка и выбор.',
            intro: 'Пишем о том, что клиенты спрашивают чаще всего: сколько это стоит, сколько времени занимает, как подготовиться и как выбрать. Коротко и понятно.',
        },
    },
};
