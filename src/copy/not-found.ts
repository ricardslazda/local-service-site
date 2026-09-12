import type { Locale } from '../site.ts';

export interface NotFoundCopy {
    title: string;
    heading: string;
    body: string;
    home: string;
    services: string;
    contact: string;
}

export const notFound: Record<Locale, NotFoundCopy> = {
    lv: {
        title: 'Lapa nav atrasta',
        heading: 'Lapa nav atrasta',
        body: 'Šādas lapas nav. Adrese varētu būt mainījusies vai ievadīta kļūdaini. Meklētais visdrīzāk ir kādā no šīm lapām.',
        home: 'Sākumlapa',
        services: 'Pakalpojumi',
        contact: 'Kontakti',
    },
    ru: {
        title: 'Страница не найдена',
        heading: 'Страница не найдена',
        body: 'Такой страницы нет. Адрес мог измениться или был введён с ошибкой. То, что вы искали, скорее всего на одной из этих страниц.',
        home: 'Главная',
        services: 'Услуги',
        contact: 'Контакты',
    },
};
