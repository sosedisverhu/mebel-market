import isNumber from '@tinkoff/utils/is/number';

function rule (value, options) {
    return !options || !isNumber(options.minValue) || isNaN(parseFloat(value)) || parseFloat(value) >= options.minValue;
}

export default (value, options = {}) => {
    const isValid = rule(value, options);

    if (!isValid) {
        return options.text || `Минимальное значение\u00a0- ${options.minValue}`;
    }
};
