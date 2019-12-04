import uniqid from 'uniqid';
import saveOrderQuery from '../queries/saveOrder';
import append from '@tinkoff/utils/array/append';
import reduce from '@tinkoff/utils/array/reduce';
import find from '@tinkoff/utils/array/find';
import format from 'date-fns/format';
import zonedTimeToUtc from 'date-fns-tz/zonedTimeToUtc';

import getProductsByIds from '../../product/queries/getProductsByIds';
import getBasketProducts from '../../basket/queries/getBasket';

import {
    NOT_FOUND_STATUS_CODE,
    OKEY_STATUS_CODE,
    SERVER_ERROR_STATUS_CODE,
    COOKIE_BASKET_ID
} from '../../../../constants/constants';
import editBasketProduct from '../../basket/queries/editBasket';
import sendOrderQuery from '../queries/sendOrderQuery';

const SUBJECT = 'Новый заказ';

export default function saveOrder (req, res) {
    const successCallback = () => res.sendStatus(OKEY_STATUS_CODE);
    const failureCallback = () => res.sendStatus(SERVER_ERROR_STATUS_CODE);
    const { paymentType, orderType, customer: { name, email, phone, comment } = {}, address: { region, city, department } = {} } = req.body;
    const id = req.cookies[COOKIE_BASKET_ID];

    getBasketProducts(id)
        .then(([[result], materials]) => {
            if (!result) {
                return res.status(NOT_FOUND_STATUS_CODE).end();
            }

            const { basket } = result;

            getProductsByIds(basket.map(basket => basket.productId))
                .then((baskedProducts) => {
                    const products = reduce((products, { productId, quantity, properties, id }) => {
                        const product = find(product => product.id === productId, baskedProducts);

                        if (!product || product.hidden) {
                            return products;
                        }

                        const isCustomSize = properties.size === 'custom';
                        const resultProperties = {
                            size: isCustomSize ? 'custom' : find(size => properties.size === size.id, product.sizes)
                        };
                        const productName = product.name;
                        return append({ product, quantity, properties: resultProperties, id, productName }, products);
                    }, [], basket);

                    const order = {
                        id: uniqid(),
                        shortId: uniqid.time(),
                        date: Date.now(),
                        customer: { name, email, phone, comment },
                        address: { region, city, department },
                        orderType,
                        paymentType,
                        products,
                        comment: '',
                        status: 'new'
                    };

                    const isPickup = orderType === 'pickup';
                    const content = `<table>
                                <tr>
                                    <td style="font-weight: bold" width='110'>Имя</td>
                                    <td width='200'>${order.customer.name}</td>
                                </tr>
                                <tr>
                                    <td style="font-weight: bold" width='110'>Номер</td>
                                    <td width='200'>${order.customer.phone}</td>
                                </tr>
                                <tr>
                                    <td style="font-weight: bold" width='110'>Доставка</td>
                                    <td width='200'>
                                        ${isPickup ? 'Самовывоз'
        : orderType === 'nova' ? 'Новая почта'
            : orderType === 'ukr' && 'УкрПочта'}
                                        ${!isPickup ? `#${department}` : ''}
                                    </td>
                                </tr>
                                <tr>
                                    <td style="font-weight: bold" width='110'>Оплата</td>
                                    <td width='200'>${paymentType === 'card' ? 'Перевод на банковскую карту' : 'Оплата при получении (Наложенный платеж)'}</td>
                                </tr>
                                 <tr>
                                    <td style="font-weight: bold" width='110'>${!isPickup ? 'Адрес доставки' : ''}</td>
                                    <td width='60'>${!isPickup ? `${region} ${city}. ${orderType === 'nova' ? 'Новая почта'
        : orderType === 'ukr' && 'УкрПочта'}, отделение #${department}` : ''}</td>
                                </tr>
                                 <tr>
                                    <td width='110' style="font-weight: bold" />
                                </tr>
                                <tr>
                                    <td width='110' style="font-weight: bold">Товары:</td>
                                </tr>
                                ${products.map((product) => {
        return `<tr>
                                    <td style="font-weight: bold" width='110'>Название</td>
                                    <td width='110'>${product.productName}</td>
                                </tr>`;
    })}
                            </table>`;

                    saveOrderQuery(order)
                        .then(() => {
                            const id = req.cookies[COOKIE_BASKET_ID];

                            return editBasketProduct({
                                basket: [],
                                id
                            })
                                .then(() => {
                                    res.status(OKEY_STATUS_CODE).send({ shortId: order.shortId });
                                });
                        })
                        .then(() => {
                            sendOrderQuery(
                                `${SUBJECT}. ${format(zonedTimeToUtc(new Date(), 'Europe/Kiev'), 'HH:mm - dd.MM.yyyy')}`,
                                content,
                                successCallback,
                                failureCallback
                            );
                        })
                        .catch(() => {
                            res.status(SERVER_ERROR_STATUS_CODE).end();
                        });
                });
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
