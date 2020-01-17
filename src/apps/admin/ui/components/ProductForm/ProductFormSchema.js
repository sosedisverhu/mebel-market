import FormFieldInput from '../Form/fields/FormFieldInput/FormFieldInput.jsx';
import FormFieldTitle from '../Form/fields/FormFieldTitle/FormFieldTitle.jsx';
import FormFieldButton from '../Form/fields/FormFieldButton/FormFieldButton';
import FormFieldCheckbox from '../Form/fields/FormFieldCheckbox/FormFieldCheckbox';
import FormFieldFiles from '../Form/fields/FormFieldFiles/FormFieldFiles';
import FormFieldLangs from '../Form/fields/FormFieldLangs/FormFieldLangs';
import FormFieldDivider from '../Form/fields/FormFieldDivider/FormFieldDivider';
import FormFieldSelect from '../Form/fields/FormFieldSelect/FormFieldSelect.jsx';
import FormFieldFeaturesSingular from '../Form/fields/FormFieldFeaturesSingular/FormFieldFeaturesSingular';
import FormFieldFeaturesDouble from '../Form/fields/FormFieldFeaturesDouble/FormFieldFeaturesDouble';
import FormFieldKeywords from '../Form/fields/FormFieldWords/FormFieldWords';
import FormFieldEditor from '../Form/fields/FormFieldEditor/FormFieldEditor';

export default function ({ data: { title, categoriesOptions, subCategoriesOptions, categoryHidden, categoryFilters, subCategoryFilters } = {} } = {}) {
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
                    { name: 'required', options: { text: 'Заполните название товара' } }
                ]
            },
            {
                component: FormFieldTitle,
                name: 'content-title',
                schema: {
                    label: 'Описание',
                    variant: 'h6'
                }
            },
            {
                component: FormFieldEditor,
                name: `description`,
                valueLangStructure: 'depend',
                schema: {
                    label: 'Описание',
                    multiline: true
                },
                validators: [
                    { name: 'required', options: { text: 'Заполните описание товара' } }
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
                component: FormFieldSelect,
                name: 'categoryId',
                schema: {
                    label: 'Категория',
                    options: categoriesOptions
                },
                validators: [
                    { name: 'required', options: { text: 'Выберите категорию новости' } }
                ]
            },
            {
                component: FormFieldSelect,
                name: 'subCategoryId',
                schema: {
                    label: 'Подкатегория',
                    options: subCategoriesOptions
                },
                validators: [
                    { name: 'required', options: { text: 'Выберите подкатегорию новости' } }
                ]
            },
            {
                component: FormFieldInput,
                name: 'price',
                schema: {
                    label: 'Цена',
                    type: 'number'
                },
                validators: [
                    { name: 'required', options: { text: 'Заполните цену товара' } }
                ]
            },
            {
                component: FormFieldInput,
                name: 'discountPrice',
                schema: {
                    label: 'Скидочная цена (грн)',
                    type: 'number'
                },
                validators: [
                    { name: 'discountPrice', options: { text: 'Введите значение скидки' } }
                ]
            },
            {
                component: FormFieldInput,
                name: 'discount',
                schema: {
                    label: 'Размер скидки (%)',
                    type: 'number'
                },
                validators: [
                    { name: 'discount', options: { text: 'Введите процент скидки' } },
                    { name: 'min', options: { minValue: 0 } },
                    { name: 'max', options: { maxValue: 100 } }
                ]
            },
            {
                component: FormFieldTitle,
                name: 'size-title',
                schema: {
                    label: 'Размеры товара',
                    variant: 'h5'
                }
            },
            {
                component: FormFieldFeaturesSingular,
                name: 'sizes',
                schema: {
                    name: 'Размер'
                },
                validators: [
                    { name: 'required', options: { text: 'Заполните размеры товара' } }
                ]
            },
            {
                component: FormFieldDivider,
                name: 'divider'
            },
            {
                component: FormFieldTitle,
                name: 'characteristics-title',
                schema: {
                    label: 'Характеристики товара',
                    variant: 'h5'
                }
            },
            {
                component: FormFieldFeaturesDouble,
                name: 'characteristics',
                valueLangStructure: [{
                    name: 'depend',
                    value: 'depend',
                    id: 'notDepend'
                }],
                schema: {
                    name: 'Название характеристики',
                    value: 'Значения'
                },
                validators: [
                    { name: 'featuresDouble', options: { text: 'Заполните характеристики товара' } }
                ]
            },
            {
                component: FormFieldDivider,
                name: 'divider'
            },
            ...(categoryFilters.length ? [{
                component: FormFieldTitle,
                name: 'categoryFiltersTitle',
                schema: {
                    label: 'Фильтры категории для продукта',
                    variant: 'h6'
                }
            }] : []),
            ...(categoryFilters.map(categoryFilter => {
                if (categoryFilter.type === 'checkbox') {
                    return ({
                        component: FormFieldSelect,
                        name: `categoryFilter-${categoryFilter.id}`,
                        schema: {
                            label: categoryFilter.name,
                            options: categoryFilter.options.map(option => ({
                                value: option.name,
                                name: option.name
                            }))
                        },
                        validators: [
                            { name: 'required', options: { text: 'Выберите значение фильтра' } }
                        ]
                    });
                }

                return ({
                    component: FormFieldInput,
                    name: `categoryFilter-${categoryFilter.id}`,
                    schema: {
                        label: categoryFilter.name,
                        type: 'number'
                    },
                    validators: [
                        { name: 'required', options: { text: 'Заполните значение фильтра' } }
                    ]
                });
            })),
            {
                component: FormFieldDivider,
                name: 'divider'
            },
            ...(subCategoryFilters.length ? [{
                component: FormFieldTitle,
                name: 'subCategoryFiltersTitle',
                schema: {
                    label: 'Фильтры подкатегории для продукта',
                    variant: 'h6'
                }
            }] : []),
            ...(subCategoryFilters.map(subCategoryFilter => {
                if (subCategoryFilter.type === 'checkbox') {
                    return ({
                        component: FormFieldSelect,
                        name: `subCategoryFilter-${subCategoryFilter.id}`,
                        schema: {
                            label: subCategoryFilter.name,
                            options: subCategoryFilter.options.map(option => ({
                                value: option.name,
                                name: option.name
                            }))
                        },
                        validators: [
                            { name: 'required', options: { text: 'Выберите значение фильтра' } }
                        ]
                    });
                }

                return ({
                    component: FormFieldInput,
                    name: `subCategoryFilter-${subCategoryFilter.id}`,
                    schema: {
                        label: subCategoryFilter.name,
                        type: 'number'
                    },
                    validators: [
                        { name: 'required', options: { text: 'Заполните значение фильтра' } }
                    ]
                });
            })),
            {
                component: FormFieldDivider,
                name: 'divider'
            },
            {
                component: FormFieldTitle,
                name: 'avatar-title',
                schema: {
                    label: 'Аватар',
                    variant: 'h6'
                }
            },
            {
                component: FormFieldFiles,
                name: 'avatar',
                schema: {
                    max: 1
                },
                validators: [
                    { name: 'requiredFiles', options: { text: 'Добавьте аватар' } }
                ]
            },
            {
                component: FormFieldDivider,
                name: 'divider'
            },
            {
                component: FormFieldTitle,
                name: 'photos-title',
                schema: {
                    label: 'Фотографии',
                    variant: 'h6'
                }
            },
            {
                component: FormFieldFiles,
                name: 'files',
                schema: {
                    max: 6
                },
                validators: [
                    { name: 'requiredFiles', options: { text: 'Добавьте фото' } }
                ]
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
                component: FormFieldDivider,
                name: 'divider'
            },
            {
                component: FormFieldCheckbox,
                name: 'hidden',
                hint: categoryHidden && 'Товар будет скрыт, т.к. он находится в скрытой категории',
                schema: {
                    label: 'Скрыть товар',
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
