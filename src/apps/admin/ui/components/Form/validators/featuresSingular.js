import all from '@tinkoff/utils/array/all';

export default (value, options = {}) => {
    const isValid = all((valueItem) => !!valueItem, value);

    if (!isValid) {
        return options.text || 'Заполните все поля';
    }
};
