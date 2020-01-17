export default (value, options = {}) => {
    const isValid = value.every(value => {
        for (let key in value) {
            if (!value[key] && value[key] !== 0) {
                return false;
            }
        }
        return true;
    });

    if (!isValid) {
        return options.text || 'Заполните все поля';
    }
};
