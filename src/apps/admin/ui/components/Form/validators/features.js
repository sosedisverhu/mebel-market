import all from '@tinkoff/utils/array/all';

export default (value, options = {}) => {
    const isValid = all(({ name, value, featureType }) => !!name && !!value && !!featureType, value);

    if (!isValid) {
        return options.text || 'Заполните все поля';
    }
};
