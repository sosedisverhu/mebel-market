import isNumber from '@tinkoff/utils/is/number';

export default (value, options = {}) => {
    if (!isNumber(+value)) {
        return options.text || 'В поле можно ввести только числовые значения';
    }
};
