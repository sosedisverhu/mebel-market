import all from '@tinkoff/utils/array/all';

export default function requiredFilesNames (value, options = {}) {
    if (!value.files.length) {
        return;
    }
    const isValid = all((valueItem) => valueItem.name, value.files);

    if (!isValid) {
        return options.text || 'Заполните названия для файлов';
    }
}
