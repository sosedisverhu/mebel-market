import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import isString from '@tinkoff/utils/is/string';
import all from '@tinkoff/utils/array/all';
import format from 'date-fns/format';
import zonedTimeToUtc from 'date-fns-tz/zonedTimeToUtc';

import contactApplicationQuery from '../queries/contactApplicationQuery';

const SUBJECT = 'Форма заказа звонка (Нестандартный размер)';
const MAX_LENGTHS = {
    NAME: 1000,
    PHONE: 100,
    EMAIL: 1000,
    MESSAGE: 3000
};

export default function contactApplication (req, res) {
    const successCallback = () => res.sendStatus(OKEY_STATUS_CODE);
    const failureCallback = () => res.sendStatus(SERVER_ERROR_STATUS_CODE);

    try {
        const values = req.body;
        const { name = '-', phone = '-', email = '-', width = '-', height = '-' } = values;

        if (!all(isString, [name, phone, email, width, height])) {
            return failureCallback();
        }

        const content = `<table>
                <tr>
                    <td width='110'>Имя</td>
                    <td>${name.slice(0, MAX_LENGTHS.NAME)}</td>
                </tr>
                <tr>
                    <td width='110'>Номер</td>
                    <td>${phone.slice(0, MAX_LENGTHS.PHONE)}</td>
                </tr>
                <tr>
                    <td width='110'>Почта</td>
                    <td>${email}</td>
                </tr>
                <tr>
                    <td width='110'>Ширина</td>
                    <td>${width}</td>
                </tr>
                <tr>
                    <td width='110'>Высота</td>
                    <td>${height}</td>
                </tr>
            </table>`;

        return contactApplicationQuery(
            `${SUBJECT}. ${format(zonedTimeToUtc(new Date(), 'Europe/Kiev'), 'HH:mm - dd.MM.yyyy')}`,
            content,
            [],
            successCallback,
            failureCallback
        );
    } catch (err) {
        failureCallback();
    }
}
