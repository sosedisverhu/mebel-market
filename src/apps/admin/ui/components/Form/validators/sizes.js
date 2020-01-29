import all from '@tinkoff/utils/array/all';

export default (value) => {
    if (!all(({ name, price }) => !!name && !!price, value)) {
        return 'Заполните обязательные поля (размер и цену)';
    }

    if (!all(({ price }) => +price > 0, value)) {
        return 'Введите цены больше 0';
    }

    if (!all(({ price, discountPrice }) => +discountPrice < +price, value)) {
        return 'Скидочная цена должна быть меньше стандартной';
    }

    if (!all(({ discountPrice, discount }) => discount ? discountPrice : true, value)) {
        return 'Введите скидочную цену';
    }

    if (!all(({ discountPrice, discount }) => discountPrice ? discount : true, value)) {
        return 'Введите значение скидки';
    }

    if (!all(({ discount }) => discount ? +discount > 0 : true, value)) {
        return 'Введите размер скидки больше 0';
    }

    if (!all(({ discount }) => discount ? +discount < 100 : true, value)) {
        return 'Введите размер скидки меньше 100';
    }
};
