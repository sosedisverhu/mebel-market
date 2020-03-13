import all from '@tinkoff/utils/array/all';
import isEmpty from '@tinkoff/utils/is/empty';

export default (value) => {
    if (!all(({ name }) => !!name, value)) {
        return 'Заполните название размера';
    }
    if (!all(({ colors }) => !!colors.length, value)) {
        return 'У каждого размер должен быть цвет';
    }

    if (!all(({ colors }) => all(({ name }) => !!name, colors), value)) {
        return 'Заполните обязательные поля для цвета (цвет)';
    }

    if (!all(({ colors }) => all(({ file }) => !!file && !isEmpty(file), colors), value)) {
        return 'Загрузите картинку для каждого цвета';
    }

    if (!all(({ features }) => all(({ name, value }) => !!name && !!value, features), value)) {
        return 'Заполните обязательные поля (Название услуги и значение)';
    }
};
