const pattern = /^([0-9 +()-]+|\d+)$/i;

export default (value, options = {}) => {
    const isValid = pattern.test(value);

    if (!isValid) {
        return options.text || 'Для ввода доступны только цифры и символы';
    }
};
