import all from '@tinkoff/utils/array/all';

export default (value) => {
    if (!all(({ size, price }) => !!size && !!price, value)) {
        return 'Заполните все поля';
    }

    if (!all(({ price }) => +price > 0, value)) {
        return 'Введите цены больше 0';
    }
};
