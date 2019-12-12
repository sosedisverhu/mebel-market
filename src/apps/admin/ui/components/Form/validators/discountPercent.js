export default (value, options = {}, values) => {
    if (!value && values.discountPrice) {
        return options.text || 'Введите процент скидки';
    }
};
