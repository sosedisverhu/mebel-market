/* eslint-disable max-len */
import React from 'react';

export default {
    mainPage: {
        top: 'Топ продажів',
        discount: 'Акції',
        new: 'Новинки',
        slider: 'Допомогти з вибором',
        title: 'Наші переваги',
        qualityTitle: 'Якість',
        qualityText: 'Наш магазин працює тільки з перевіреними виробниками меблів, що дозволяє нам контролювати якість продукції і працювати в режимі зворотного зв\'язку, коли виробник негайно реагує на наші запити. Майже на всю нашу продукцію поширюється гарантія -18 місяців.',
        priceTitle: 'Ціна',
        priceText: 'Робота з виробниками напряму допомагає нам сформувати максимально доступні ціни для наших покупців, без втрати якості продукції.',
        deliveryTitle: 'Доставка',
        deliveryText: 'Ми відправляємо товар у день замовлення по Україні. Для Києва є послуги доставки до будинку, підйом вгору і збирання меблів професійними майстрами.'
    },
    product: {
        details: 'Детальні характеристики',
        buy: 'Купити',
        size: 'Оберіть розмір:',
        oneSize: 'Розмір:',
        tabs: [{ name: 'Опис', id: '1' }, { name: 'Характеристики', id: '2' }],
        inBasket: 'У кошику',
        chooseColor: 'Оберіть колір:',
        oneColor: 'Колір:',
        sizesMarkDescr: 'Відкрити таблицю з розмірами',
        tableSizesTitle: 'Таблиця розмірів',
        tableSizesRowTitle: 'Розмір товару',
        top: 'Топ продаж',
        new: 'Новинка',
        onScreen: 'На весь екран',
        selectThisColor: 'Вибрати даний колір'
    },
    breadcrumbs: {
        main: 'Головна'
    },
    header: {
        deliveryAndPayment: 'Доставка та оплата',
        partners: 'Партнери',
        articles: 'Статті',
        contacts: 'Контакти',
        search: 'Пошук',
        beds: 'Ліжка',
        mattresses: 'Матраци',
        softFurniture: `М'які меблі`,
        sleepAccessories: 'Аксесуари для сну',
        promotions: 'Акції'
    },
    wishList: {
        title: 'Обране:',
        size: 'Розмір:',
        continueShopping: 'Продовжити покупки',
        cartBtn: 'У кошик',
        noProduct: 'Ви не додали в обране жодного товару',
        article: 'Артикул:',
        inCartBtn: 'В корзині',
        color: 'Колір:'
    },
    cart: {
        title: 'Кошик:',
        product: {
            one: 'товар',
            several: 'товара',
            much: 'товарів'
        },
        totalPrice: 'Всього:',
        size: 'Розмір:',
        checkout: 'Оформити замовлення',
        continueShopping: 'Продовжити покупки',
        noProduct: 'Ви не додали в кошик жодного товару',
        color: 'Колір:'
    },
    productsPage: {
        filterBtn: 'Фільтри',
        results: {
            one: 'Результат',
            several: 'Результата',
            much: 'Результатів'
        },
        price: 'Ціна',
        popupTitle: 'Фільтри',
        popupBtnClear: 'Очистити',
        popupBtnDone: 'Готово',
        popupBtnApply: 'Застосувати',
        filter_actualPrice: 'Ціна',
        filter_size: 'Розмір',
        filter_color: 'Колір'
    },
    aboutProductTop: {
        warranty: 'Гарантія',
        months: {
            one: 'місяць',
            several: 'місяці',
            much: 'місяців'
        },
        article: 'Артикул'
    },
    deliveryAndPayment: {
        title: 'Доставка та оплата',
        deliveryTitle: 'Доставка:',
        paymentTitle: 'Оплата:',
        deliveryOptions: [
            { text: <span>Доставка кур'єрськимии<br/> службами</span> },
            { text: <span>Самовивіз</span> }
        ],
        paymentOptions: [
            { text: <span>Готівкою в магазині</span> },
            { text: <span>Оплата банківською картою</span> },
            { text: <span>Приват 24</span> }
        ]
    },
    partners: {
        title: 'Партнери'
    },
    contacts: {
        title: 'Контакти',
        phonesTitle: 'Наші телефони:',
        emailTitle: 'Наша пошта:',
        scheduleTitle: 'Графік роботи:',
        scheduleDays: 'ПН-НД:',
        addressTitle: 'Наша адреса:',
        addressText: 'Київ, вул. Велика Окружна, 4',
        getDirectionsBtn: 'Прокласти маршрут'
    },
    notFoundPage: {
        text1: 'На жаль, сторінка, яку ви шукаєте не існує :(',
        link: 'На главную'
    },
    article: {
        moreBtn: 'Докладніше',
        year: 'року',
        breadcrumbArticles: 'Статті'
    },
    searchPage: {
        results: 'результатів за запитом',
        products: 'Товари:',
        noResults: 'Нам не вдалось знайти результати за запитом:',
        tryAgain: 'Спробуйте ще:',
        placeholder: 'Пошук',
        needHelp: 'Потрібна допомога?',
        link: 'Зв\'яжіться з нами',
        articles: 'Статті:',
        search: 'Поиск'
    },
    checkoutPage: {
        checkout: 'Оформлення замовлення',
        details: 'Подробиці замовлення',
        delivery: 'Доставка',
        payment: 'Оплата',
        productPrice: 'Вартість товару:',
        deliveryPrice: 'Доставка:',
        allPrice: 'Всього:',
        btnConfirm: 'Підтвердити замовлення',
        popupTitle: 'Ваше замовлення',
        addressTitle: 'Чекаємо Вас за адресою:',
        addressText: 'Велика Кільцева вул., 4б, Київ, 08130',
        sms: 'Вам на телефон прийде код з відстеженням',
        cardTitle: 'Сплатіть на картку:',
        cardDescr: '(вкажіть номер замовлення в описі платежу)',
        price: 'Вартість замовлення:',
        toMain: 'На головну',
        noItemsInBasket: 'В кошику ще немає товарів'
    },
    comments: {
        showAll: 'Показати усі',
        feedbackBtn: 'Залишити відгук',
        firstFeedbackBtn: 'Будьте першим, хто залишить відгук',
        userRating: 'Ваша оцінка товару',
        inputName: 'Ваше ім\'я та прізвище *',
        inputEmailPhone: 'Ел. пошта або телефон *',
        inputText: 'Текст відгуку',
        cancelBtn: 'Скасувати',
        nameError: 'Введіть ваше ім\'я',
        emailPhoneError: 'Введіть ваш телефон або поштову адресу',
        ratingError: 'Оцініть товар'
    },
    reviewSent: {
        thanks: 'Дякуємо!',
        publication: 'Ваш відгук буде опублікований',
        moderation: 'після модерації'
    },
    callback: {
        btnConfirm: 'Підтвердити',
        title: "Зв'язатись з нами",
        firstField: "Ім'я",
        secondField: 'Телефон',
        text: 'lorem lorem lorem lorem',
        validationText: '*Введіть номер телефону'
    },
    articles: {
        searchResult: 'Статті:'
    }
};
