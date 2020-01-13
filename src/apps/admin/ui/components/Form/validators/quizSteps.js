import all from '@tinkoff/utils/array/all';

export default (value, options = {}) => {
    const isValidName = all(({ name }) => !!name, value);
    const isValidOptions = all(({ options }) => options.length, value);
    const isValidOptionName = all(({ options }) => all(({ name }) => !!name, options), value);
    const isValidOptionFile = all(({ options }) => all(({ file }) => file.files && file.files.length, options), value);

    if (!isValidName) {
        return options.errorName || 'Заполните все поля';
    }

    if (!isValidOptions) {
        return options.errorOptions || 'Заполните все поля';
    }

    if (!isValidOptionName) {
        return options.errorOptionName || 'Заполните все поля';
    }

    if (!isValidOptionFile) {
        return options.errorOptionFile || 'Заполните все поля';
    }
};
