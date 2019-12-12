export default (value, options = {}, values) => {
    if (!value && values.discountPercent) {
        return options.text || 'Введите значение скидки';
    }
};
