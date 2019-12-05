import all from '@tinkoff/utils/array/all';

export default (value, options = {}) => {
    const isValid = all(({ prop, value }) => !!prop && !!value, value);

    if (!isValid) {
        return options.text || 'Заполните все поля';
    }
};
