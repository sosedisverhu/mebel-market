import isNumber from '@tinkoff/utils/is/number';

function rule (value, options) {
    return !options || !isNumber(options.maxValue) || isNaN(parseFloat(value)) || parseFloat(value) <= options.maxValue;
}

export default (value, options = {}) => {
    const isValid = rule(value, options);

    if (!isValid) {
        return options.text || `Максимальное значение\u00a0- ${options.maxValue}`;
    }
};
