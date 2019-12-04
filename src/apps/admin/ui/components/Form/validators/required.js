import trim from '@tinkoff/utils/string/trim';
import cond from '@tinkoff/utils/function/cond';
import T from '@tinkoff/utils/function/T';
import isString from '@tinkoff/utils/is/string';
import isNumber from '@tinkoff/utils/is/number';
import isArray from '@tinkoff/utils/is/array';

const isEmptyValue = cond([
    [isString, value => !trim(value)],
    [isNumber, value => isNaN(value)],
    [isArray, value => !value.length],
    [T, value => !value]
]);

export default function required (value, options = {}) {
    const isValid = !isEmptyValue(value);

    if (!isValid) {
        return options.text || 'Поле обязательное';
    }
}
