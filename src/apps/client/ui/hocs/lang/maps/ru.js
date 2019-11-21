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
            { option: <span>Доставка курьерскими<br/> службами</span> },
            { option: <span>Самовывоз</span> }
        ],
        paymentOptions: [
            { option: <span>Наличными в магазине</span> },
            { option: <span>Оплата банковской картой</span> },
            { option: <span>Приват 24</span> }
        ]
    }
};
