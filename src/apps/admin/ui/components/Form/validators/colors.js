import uniq from '@tinkoff/utils/array/uniq';
import map from '@tinkoff/utils/array/map';
import compose from '@tinkoff/utils/function/compose';

export default function colors (value) {
    if (value.some((color) => !color.name)) {
        return 'Введите названия всех цветов';
    }

    const uniqColorsNames = compose(
        uniq,
        map(color => color.name)
    )(value);

    if (uniqColorsNames.length !== value.length) {
        return 'Введите уникальные названия для цветов';
    }
}
