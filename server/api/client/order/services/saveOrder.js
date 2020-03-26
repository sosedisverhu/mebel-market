import uniqid from 'uniqid';
import saveOrderQuery from '../queries/saveOrder';
import append from '@tinkoff/utils/array/append';
import reduce from '@tinkoff/utils/array/reduce';
import find from '@tinkoff/utils/array/find';
import format from 'date-fns/format';
import zonedTimeToUtc from 'date-fns-tz/zonedTimeToUtc';

import getProductsByIds from '../../product/queries/getProductsByIds';
import getBasketProducts from '../../userProducts/queries/getUserProducts';
import getCategories from '../../category/queries/getAllCategories';
import getSubCategories from '../../subCategory/queries/getAllSubCategories';

import getCustomerLetterTemplate from '../templates/customerLetter';

import {
    NOT_FOUND_STATUS_CODE,
    OKEY_STATUS_CODE,
    SERVER_ERROR_STATUS_CODE,
    COOKIE_USER_PRODUCT_ID
} from '../../../../constants/constants';
import editBasketProduct from '../../userProducts/queries/editUserProduct';
import sendOrderQuery from '../queries/sendOrderQuery';

const SUBJECT = 'Новый заказ';
const SUBJECT_CLIENT = 'Заказ №';

export default function saveOrder (req, res) {
    const successCallback = () => res.sendStatus(OKEY_STATUS_CODE);
    const failureCallback = () => res.sendStatus(SERVER_ERROR_STATUS_CODE);
    const { payment, delivery, customer: { name, email, phone, comment, address } = {}, domain } = req.body;

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
                        const size = product.sizes.ru.find(productSize => productSize.id === properties.size.id);

                        if (!size) return products;

                        const color = size.colors.find(color => color.id === properties.size.color.id);

                        if (!color) return products;

                        properties.size.name = size.name;
                        properties.color = {
                            name: color.name,
                            file: color.file
                        };
                        properties.size.color.img = color.name;

                        const allFeatures = size.features || [];
                        const checkedFeatureIds = properties.features || {};
                        const checkedFeatures = allFeatures.filter(feature => checkedFeatureIds[feature.id]);
                        properties.features = checkedFeatures;

                        return append({
                            product,
                            quantity,
                            properties,
                            id,
                            basePrice: color.price,
                            price: color.discountPrice,
                            productName,
                            article: color.article
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
        const featuresPrice = product.properties.features.reduce((sum, { value }) => sum + value, 0);
        const unitPrice = (product.price || product.basePrice) + featuresPrice;

        return `                            <tr>
                                                <td style="font-weight: bold" width='110'>Название</td>
                                                <td width='110'>${product.productName}</td>
                                            </tr>
                                            ${product.article
        ? `<tr>
                                                <td style="font-weight: bold" width='110'>Артикул</td>
                                                <td width='110'>${product.article}</td>
                                            </tr>`
        : ''}
                                            <tr>
                                                <td style="font-weight: bold" width='110'>Цена</td>
                                                <td width='110'>${unitPrice} грн</td>
                                            </tr> 
                                            <tr>
                                                <td style="font-weight: bold" width='110'>Количество</td>
                                                <td width='110'>${product.quantity} штк.</td>
                                            </tr>
                                            ${product.properties.features.length
        ? `<tr>
                                            <td style="font-weight: bold" width='110'>Дополнительно</td>
                                            <td width='60'>${product.properties.features.map(feature => {
        return '+ ' + feature.name + '; <br>';
    }
    )}
                                            </td>
                                        </tr>`
        : ''}
                                            <tr>
                                                <td style="font-weight: bold" width='110'>Размер</td>
                                                <td width='110'>${product.properties.size.name}</td>
                                            </tr>
                                            <tr>
                                                <td style="font-weight: bold" width='110'>Цвет</td>
                                                <td width='110'>${product.properties.color.name}</td>
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
                            Promise.all([
                                getCategories(),
                                getSubCategories()
                            ])
                                .then(values => {
                                    const categories = values[0];
                                    const subCategories = values[1];
                                    const clientMessageContent = getCustomerLetterTemplate(order, categories, subCategories, domain);

                                    sendOrderQuery(
                                        `${SUBJECT_CLIENT} ${order.shortId}. ${format(zonedTimeToUtc(new Date(), 'Europe/Kiev'), 'HH:mm - dd.MM.yyyy')}`,
                                        clientMessageContent,
                                        successCallback,
                                        failureCallback,
                                        order.customer.email
                                    );
                                });
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
