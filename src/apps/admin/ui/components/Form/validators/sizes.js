import all from '@tinkoff/utils/array/all';

export default (value) => {
    if (!all(({ name }) => !!name, value)) {
        return 'Заполните название размера';
    }
    if (!all(({ colors }) => !!colors.length, value)) {
        return 'У каждого размер должен быть цвет';
    }

    if (!all(({ colors }) => all(({ name, price, article }) => !!name && !!price && !!article, colors), value)) {
        return 'Заполните обязательные поля (цвет, артикул и цену)';
    }

    if (!all(({ colors }) => all(({ file }) => !!file, colors), value)) {
        return 'Загрузите картинку для каждого цвета';
    }

    if (!all(({ colors }) => all(({ price }) => +price > 0, colors), value)) {
        return 'Введите цены больше 0';
    }

    if (!all(({ colors }) => all(({ name, price, article }) => !!name && !!price && !!article, colors), value)) {
        return 'Заполните обязательные поля (цвет, артикул и цену)';
    }

    if (!all(({ colors }) => all(({ discountPrice, discount }) => discount ? discountPrice : true, colors), value)) {
        return 'Введите скидочную цену';
    }

    if (!all(({ colors }) => all(({ discountPrice, discount }) => discountPrice ? discount : true, colors), value)) {
        return 'Введите значение скидки';
    }

    if (!all(({ colors }) => all(({ discount }) => discount ? +discount > 0 : true, colors), value)) {
        return 'Введите размер скидки больше 0';
    }

    if (!all(({ colors }) => all(({ discount }) => discount ? +discount < 100 : true, colors), value)) {
        return 'Введите размер скидки меньше 100';
    }
};
