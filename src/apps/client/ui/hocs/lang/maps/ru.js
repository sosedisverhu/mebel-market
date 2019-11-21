/* eslint-disable max-len */
import React from 'react';

export default {
    main: {
        slider: 'Помочь с выбором'
    },
    deliveryAndPayment: {
        title: 'Доставка и оплата',
        deliveryTitle: 'Доставка:',
        paymentTitle: 'Оплата:',
        deliveryOptions: [
            { text: <span>Доставка курьерскими<br/> службами</span> },
            { text: <span>Самовывоз</span> }
        ],
        paymentOptions: [
            { text: <span>Наличными в магазине</span> },
            { text: <span>Оплата банковской картой</span> },
            { text: <span>Приват 24</span> }
        ]
    }
};
