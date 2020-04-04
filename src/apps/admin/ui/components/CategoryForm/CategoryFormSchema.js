import FormFieldInput from '../Form/fields/FormFieldInput/FormFieldInput.jsx';
import FormFieldTitle from '../Form/fields/FormFieldTitle/FormFieldTitle.jsx';
import FormFieldButton from '../Form/fields/FormFieldButton/FormFieldButton';
import FormFieldCheckbox from '../Form/fields/FormFieldCheckbox/FormFieldCheckbox';
import FormFieldLangs from '../Form/fields/FormFieldLangs/FormFieldLangs';
import FormFieldKeywords from '../Form/fields/FormFieldWords/FormFieldWords';
import FormFieldFilters from '../Form/fields/FormFieldFilters/FormFieldFilters';
import FormFieldDivider from '../Form/fields/FormFieldDivider/FormFieldDivider';
import FormFieldFiles from '../Form/fields/FormFieldFiles/FormFieldFiles';

export default function ({ data: { title } = {} } = {}) {
    return {
        fields: [
            {
                component: FormFieldTitle,
                name: 'title',
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
                    { name: 'required', options: { text: 'Заполните название категории' } }
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
                name: 'title',
                schema: {
                    label: 'Картинка для категории',
                    variant: 'h6'
                }
            },
            {
                component: FormFieldFiles,
                name: 'image',
                schema: {
                    max: 1
                },
                validators: [
                    { name: 'requiredFiles', options: { text: 'Добавьте картинку' } }
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
                    label: 'Фильтры для категории',
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
                    dimension: 'depend',
                    viewInAnotherFilters: 'notDepend'
                }],
                schema: {
                    viewInAnotherFilters: true
                },
                validators: [
                    { name: 'filters' }
                ]
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
                component: FormFieldKeywords,
                name: 'seoKeywords',
                valueLangStructure: 'depend',
                schema: {
                    label: 'Ключевые слова',
                    multiline: false
                }
            },
            {
                component: FormFieldCheckbox,
                name: 'hidden',
                schema: {
                    label: 'Скрыть категорию и все товары в ней'
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
