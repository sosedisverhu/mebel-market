import FormFieldInput from '../Form/fields/FormFieldInput/FormFieldInput.jsx';
import FormFieldTitle from '../Form/fields/FormFieldTitle/FormFieldTitle.jsx';
import FormFieldButton from '../Form/fields/FormFieldButton/FormFieldButton';
import FormFieldCheckbox from '../Form/fields/FormFieldCheckbox/FormFieldCheckbox';
import FormFieldLangs from '../Form/fields/FormFieldLangs/FormFieldLangs';
import FormFieldDivider from '../Form/fields/FormFieldDivider/FormFieldDivider';
import FormFieldFilters from '../Form/fields/FormFieldFilters/FormFieldFilters';

export default function ({ data: { title, categoryHidden } = {} } = {}) {
    return {
        fields: [
            {
                component: FormFieldTitle,
                name: 'form-title',
                schema: {
                    label: title,
                    variant: 'h5'
                }
            },
            {
                component: FormFieldLangs,
                name: 'lang',
                schema: {
                    langs: ['ru', 'ua']
                }
            },
            {
                component: FormFieldInput,
                name: 'name',
                valueLangStructure: 'depend',
                schema: {
                    label: 'Название'
                },
                validators: [
                    { name: 'required', options: { text: 'Заполните название подкатегории' } }
                ]
            },
            {
                component: FormFieldInput,
                name: 'alias',
                schema: {
                    label: 'Alias'
                },
                validators: [
                    { name: 'required', options: { text: 'Заполните alias' } }
                ]
            },
            {
                component: FormFieldDivider,
                name: 'divider'
            },
            {
                component: FormFieldTitle,
                name: 'filtersTitle',
                schema: {
                    label: 'Фильтры для подкатегории',
                    variant: 'h6'
                }
            },
            {
                component: FormFieldFilters,
                name: 'filters',
                valueLangStructure: [{
                    id: 'notDepend',
                    type: 'notDepend',
                    name: 'depend',
                    options: [{
                        id: 'notDepend',
                        name: 'depend'
                    }],
                    dimension: 'depend'
                }],
                validators: [
                    { name: 'filters' }
                ]
            },
            {
                component: FormFieldDivider,
                name: 'divider'
            },
            {
                component: FormFieldTitle,
                name: 'filtersTitle',
                schema: {
                    label: 'Дефолтные фильтры для подкатегории',
                    variant: 'h6'
                }
            },
            {
                component: FormFieldCheckbox,
                name: 'sizeFilter',
                schema: {
                    label: 'Включить фильтр по размерам'
                }
            },
            {
                component: FormFieldCheckbox,
                name: 'colorFilter',
                schema: {
                    label: 'Включить фильтр по цветам'
                }
            },
            {
                component: FormFieldDivider,
                name: 'divider'
            },
            {
                component: FormFieldTitle,
                name: 'columnsTitle',
                valueLangStructure: 'depend',
                schema: {
                    label: 'Название для столбцов таблицы размеров товара',
                    variant: 'h5'
                }
            },
            {
                component: FormFieldInput,
                name: 'sizeColumn',
                valueLangStructure: 'depend',
                schema: {
                    label: 'Название столбца размеров',
                    type: 'string'
                }
            },
            {
                component: FormFieldInput,
                name: 'descriptionColumn',
                valueLangStructure: 'depend',
                schema: {
                    label: 'Название столбца свойств',
                    type: 'string'
                }
            },
            {
                component: FormFieldInput,
                name: 'valueColumn',
                valueLangStructure: 'depend',
                schema: {
                    label: 'Название столбца значения',
                    type: 'string'
                }
            },
            {
                component: FormFieldDivider,
                name: 'divider'
            },
            {
                component: FormFieldTitle,
                name: 'seoTitle',
                schema: {
                    label: 'Сео',
                    variant: 'h6'
                }
            },
            {
                component: FormFieldInput,
                name: 'seoTitle',
                valueLangStructure: 'depend',
                schema: {
                    label: 'Тайтл',
                    multiline: true
                },
                validators: [
                    { name: 'required', options: { text: 'Заполните сео тайтл' } }
                ]
            },
            {
                component: FormFieldInput,
                name: 'seoDescription',
                valueLangStructure: 'depend',
                schema: {
                    label: 'Описание',
                    multiline: true
                },
                validators: [
                    { name: 'required', options: { text: 'Заполните сео описание' } }
                ]
            },
            {
                component: FormFieldInput,
                name: 'seoKeywords',
                valueLangStructure: 'depend',
                schema: {
                    label: 'Ключевые слова'
                }
            },
            {
                component: FormFieldDivider,
                name: 'divider'
            },
            {
                component: FormFieldCheckbox,
                name: 'hidden',
                hint: categoryHidden && 'Подкатегория будет скрыта, т.к. она находится в скрытой категории',
                schema: {
                    label: 'Скрыть подкатегорию',
                    disabled: categoryHidden
                }
            },
            {
                component: FormFieldButton,
                name: 'submit',
                schema: {
                    label: 'Сохранить',
                    type: 'submit'
                }
            }
        ]
    };
}
