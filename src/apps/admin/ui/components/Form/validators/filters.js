export default function filters (value) {
    if (value.some((filter) => !filter.name)) {
        return 'Заполните название для всех фильтров';
    }

    if (value.some((filter) => !filter.type)) {
        return 'Выберите типы для всех фильтров';
    }

    if (value.some((filter) => filter.type === 'range' ? false : !(filter.options || []).length)) {
        return 'Добавьте опции для всех checkbox фильтров';
    }

    if (value.some((filter) => filter.type === 'range' ? false : (filter.options || []).some(option => !option.name))) {
        return 'Нельзя использовать пустые опции для checkbox фильтров';
    }
}
