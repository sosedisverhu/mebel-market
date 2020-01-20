import all from '@tinkoff/utils/array/all';

export default (value, options = {}) => {
    const isValid = all(({ name, value }) => !!name && !!value, value);

    if (!isValid) {
        return options.text || 'Заполните все поля';
    }
};
