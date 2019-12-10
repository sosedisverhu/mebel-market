import FormFieldInput from '../Form/fields/FormFieldInput/FormFieldInput.jsx';
import FormFieldTitle from '../Form/fields/FormFieldTitle/FormFieldTitle.jsx';
import FormFieldButton from '../Form/fields/FormFieldButton/FormFieldButton';
import FormFieldCheckbox from '../Form/fields/FormFieldCheckbox/FormFieldCheckbox';
import FormFieldLangs from '../Form/fields/FormFieldLangs/FormFieldLangs';
import FormFieldFeaturesDouble from '../Form/fields/FormFieldFeaturesDouble/FormFieldFeaturesDouble';
import FormFieldFilters from '../Form/fields/FormFieldFilters/FormFieldFilters';
import FormFieldDivider from '../Form/fields/FormFieldDivider/FormFieldDivider';

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
                component: FormFieldTitle,
                name: 'subCategories-title',
                schema: {
                    label: 'Подкатегории',
                    variant: 'h6'
                }
            },
            {
                component: FormFieldFeaturesDouble,
                name: 'subCategory',
                valueLangStructure: [{
                    name: 'depend',
                    value: 'notDepend',
                    id: 'notDepend'
                }],
                schema: {
                    name: 'Название подкатегории',
                    value: 'Alias'
                },
                validators: [
                    { name: 'required', options: { text: 'Заполните подкатегории' } }
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
                    label: 'Фильтры категории',
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
                    options: ['depend']
                }],
                validators: [
                    { name: 'filters' }
                ]
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