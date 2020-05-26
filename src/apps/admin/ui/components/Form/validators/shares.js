import all from '@tinkoff/utils/array/all';

export default (value) => {
    if (!all(({ shares }) => all(({ products }) => !!products.length, shares), value)) {
        return 'Заполните поле \'Продукти\' для скидки';
    }

    if (!all(({ shares }) => all(({ type, value }) => {
        if (type === 'discount') return !!value;
        return true;
    }, shares), value)) {
        return 'Заполните поле \'Размер скидки\' для скидки';
    }
};
