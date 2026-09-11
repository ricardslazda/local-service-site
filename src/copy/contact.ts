import type { Locale } from '../site.ts';

export interface ContactCopy {
    title: string;
    heading: string;
    description: string;
    intro: string;
    findUs: string;
    map: string;
    urgent: string;
}

export interface ThanksCopy {
    title: string;
    heading: string;
    description: string;
    body: string;
    urgent: string;
    backHome: string;
}

export const contact: Record<Locale, ContactCopy> = {
    lv: {
        title: 'Kontakti: zvaniet vai pieprasiet tāmi',
        heading: 'Kontakti',
        description:
            'Sazinieties ar mums: tālrunis, e-pasts, adrese Rīgā un darba laiks. Pieprasiet cenu vai uzdodiet jautājumu par pakalpojumu.',
        intro: 'Zvaniet darba laikā, rakstiet vai atstājiet pieteikumu. Uz e-pastu un pieteikumiem atbildam vienas darba dienas laikā.',
        findUs: 'Kur mēs atrodamies',
        map: 'Skatīt kartē',
        urgent: 'Ja jautājums ir steidzams, zvaniet: darba laikā atbildam uzreiz.',
    },
    ru: {
        title: 'Контакты: позвоните или запросите смету',
        heading: 'Контакты',
        description:
            'Свяжитесь с нами: телефон, эл. почта, адрес в Риге и время работы. Запросите цену или задайте вопрос об услуге.',
        intro: 'Звоните в рабочее время, пишите или оставьте заявку. На письма и заявки отвечаем в течение одного рабочего дня.',
        findUs: 'Где мы находимся',
        map: 'Посмотреть на карте',
        urgent: 'Если вопрос срочный, звоните: в рабочее время отвечаем сразу.',
    },
};

export const thanks: Record<Locale, ThanksCopy> = {
    lv: {
        title: 'Paldies, pieteikumu saņēmām',
        heading: 'Paldies, pieteikumu saņēmām',
        description:
            'Jūsu pieteikumu saņēmām. Sazināsimies vienas darba dienas laikā, lai precizētu darbu, laiku un cenu.',
        body: 'Sazināsimies vienas darba dienas laikā, lai precizētu darbu, laiku un cenu. Ja norādījāt e-pastu, atbildi saņemsiet arī tur.',
        urgent: 'Ja jautājums ir steidzams, negaidiet, bet zvaniet:',
        backHome: 'Atpakaļ uz sākumlapu',
    },
    ru: {
        title: 'Спасибо, заявка получена',
        heading: 'Спасибо, заявка получена',
        description:
            'Ваша заявка получена. Мы свяжемся с вами в течение одного рабочего дня, чтобы уточнить задачу, сроки и цену.',
        body: 'Мы свяжемся с вами в течение одного рабочего дня, чтобы уточнить задачу, сроки и цену. Если вы указали эл. почту, ответ придёт и туда.',
        urgent: 'Если вопрос срочный, не ждите, а звоните:',
        backHome: 'Вернуться на главную',
    },
};
