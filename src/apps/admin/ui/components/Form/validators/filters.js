export default function filters (value) {
    if (value.some(filter => !filter.name)) {
        return 'Заполните название для всех фильтров';
    }

    if (value.some(filter => !filter.type)) {
        return 'Выберите типы для всех фильтров';
    }

    if (value.some(filter => {
        if (!filter.options) {
            return true;
        }

        if (filter.type === 'checkbox') {
            return filter.options.length ? !filter.options.every(option => option.name) : true;
        }
    })) {
        return 'Добавьте опции для всех checkbox фильтров';
    }
}
