import uniqid from 'uniqid';
import saveOrderQuery from '../queries/saveOrder';
import append from '@tinkoff/utils/array/append';
import reduce from '@tinkoff/utils/array/reduce';
import find from '@tinkoff/utils/array/find';
import format from 'date-fns/format';
import zonedTimeToUtc from 'date-fns-tz/zonedTimeToUtc';

import getProductsByIds from '../../product/queries/getProductsByIds';
import getBasketProducts from '../../userProducts/queries/getUserProducts';

import {
    NOT_FOUND_STATUS_CODE,
    OKEY_STATUS_CODE,
    SERVER_ERROR_STATUS_CODE,
    COOKIE_USER_PRODUCT_ID
} from '../../../../constants/constants';
import editBasketProduct from '../../userProducts/queries/editUserProduct';
import sendOrderQuery from '../queries/sendOrderQuery';

const SUBJECT = 'Новый заказ';

export default function saveOrder (req, res) {
    const successCallback = () => res.sendStatus(OKEY_STATUS_CODE);
    const failureCallback = () => res.sendStatus(SERVER_ERROR_STATUS_CODE);
    const { payment, delivery, customer: { name, email, phone, comment, address } = {} } = req.body;

    const id = req.cookies[COOKIE_USER_PRODUCT_ID];

    getBasketProducts(id)
        .then(([result]) => {
            if (!result) {
                return res.status(NOT_FOUND_STATUS_CODE).end();
            }

            const { basket } = result;

            getProductsByIds(basket.map(basket => basket.productId))
                .then((baskedProducts) => {
                    const products = reduce((products, { productId, quantity, properties, id }) => {
                        const product = find(product => product.id === productId, baskedProducts);

                        if (!product || product.hidden) return products;

                        const productName = product.texts.ru.name;
                        const size = product.sizes.find(productSize => productSize.id === properties.size.id);

                        if (!size) return products;

                        properties.size.name = size.name;
                        return append({
                            product, quantity, properties, id, basePrice: size.price, price: size.discountPrice, productName, article: size.article
                        }, products);
                    }, [], basket);

                    const order = {
                        id: uniqid(),
                        shortId: uniqid.time(),
                        date: Date.now(),
                        customer: { name, email, phone, comment, address },
                        delivery: delivery,
                        payment: payment,
                        products,
                        comment: '',
                        status: 'new'
                    };

                    const content = `<table>
                                <tr>
                                    <td style="font-weight: bold" width='110'>Имя</td>
                                    <td width='200'>${name}</td>
                                </tr>
                                <tr>
                                    <td style="font-weight: bold" width='110'>Номер</td>
                                    <td width='200'>${phone}</td>
                                </tr>
                                <tr>
                                    <td style="font-weight: bold" width='110'>Доставка</td>
                                    <td width='200'>${delivery.texts.ru.option}</td>
                                </tr>
                                <tr>
                                    <td style="font-weight: bold" width='110'>Оплата</td>
                                    <td width='200'>${payment.texts.ru.option}</td>
                                </tr>
                                ${address
        ? `<tr>
                                            <td style="font-weight: bold" width='110'>Адрес доставки</td>
                                            <td width='60'>${address}</td>
                                        </tr>`
        : ''}
                                ${comment
        ? `<tr>
                                            <td style="font-weight: bold" width='110'>Комментарий</td>
                                            <td width='60'>${comment}</td>
                                        </tr>`
        : ''}
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
                                            </tr>
                                            <tr>
                                                <td style="font-weight: bold" width='110'>Артикул</td>
                                                <td width='110'>${product.article}</td>
                                            </tr> 
                                            <tr>
                                                <td style="font-weight: bold" width='110'>Цена</td>
                                                <td width='110'>${product.price || product.basePrice} грн</td>
                                            </tr> 
                                            <tr>
                                                <td style="font-weight: bold" width='110'>Количество</td>
                                                <td width='110'>${product.quantity} штк.</td>
                                            </tr>
                                            <tr>
                                                <td style="font-weight: bold" width='110'>Размер</td>
                                                <td width='110'>${product.properties.size.name}</td>
                                            </tr>`;
    })}
                            </table>`;

                    saveOrderQuery(order)
                        .then(() => {
                            const id = req.cookies[COOKIE_USER_PRODUCT_ID];

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
