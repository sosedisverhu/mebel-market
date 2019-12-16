export default (value, options = {}, values) => {
    if (!value && values.discount) {
        return options.text || 'Введите значение скидки';
    }
};
