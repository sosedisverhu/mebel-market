import FormFieldInput from '../Form/fields/FormFieldInput/FormFieldInput.jsx';
import FormFieldTitle from '../Form/fields/FormFieldTitle/FormFieldTitle.jsx';
import FormFieldButton from '../Form/fields/FormFieldButton/FormFieldButton';
import FormFieldCheckbox from '../Form/fields/FormFieldCheckbox/FormFieldCheckbox';
import FormFieldFiles from '../Form/fields/FormFieldFiles/FormFieldFiles';
import FormFieldLangs from '../Form/fields/FormFieldLangs/FormFieldLangs';
import FormFieldDivider from '../Form/fields/FormFieldDivider/FormFieldDivider';
import FormFieldSelect from '../Form/fields/FormFieldSelect/FormFieldSelect.jsx';
import FormFieldSizes from '../Form/fields/FormFieldSizes/FormFieldSizes';
import FormFieldFeaturesDouble from '../Form/fields/FormFieldFeaturesDouble/FormFieldFeaturesDouble';
import FormFieldFeature from '../Form/fields/FormFieldFeature/FormFieldFeature';
import FormFieldEditor from '../Form/fields/FormFieldEditor/FormFieldEditor';
import FormFieldCheckboxes from '../Form/fields/FormFieldCheckboxes/FormFieldCheckboxes';
import FormFieldButtonCopyFilters from '../Form/fields/FormFieldButtonCopyFilters/FormFieldButtonCopyFilters';
import FormFieldRadios from '../Form/fields/FormFieldRadios/FormFieldRadios';

export default function ({ data: {
    title,
    categoriesOptions,
    subCategoriesOptions,
    categoryHidden,
    categoryFilters,
    subCategoryFilters,
    categories,
    allSubCategories
} = {} } = {}) {
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
                    label: 'Короткое описание',
                    variant: 'h6'
                }
            },
            {
                component: FormFieldInput,
                name: 'shortDescription',
                valueLangStructure: 'depend',
                schema: {
                    label: 'Короткое описание',
                    multiline: true
                },
                validators: [
                    { name: 'required', options: { text: 'Заполните короткое описание' } }
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
                name: 'description',
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
                    { name: 'required', options: { text: 'Выберите категорию товара' } }
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
                    { name: 'required', options: { text: 'Выберите подкатегорию товара' } }
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
                component: FormFieldSizes,
                name: 'sizes',
                valueLangStructure: [{
                    name: 'notDepend',
                    article: 'notDepend',
                    price: 'notDepend',
                    discountPrice: 'notDepend',
                    discount: 'notDepend',
                    id: 'notDepend',
                    colors: [{
                        id: 'notDepend',
                        name: 'depend',
                        article: 'notDepend',
                        price: 'notDepend',
                        discountPrice: 'notDepend',
                        discount: 'notDepend',
                        file: 'notDepend',
                        action: 'notDepend'
                    }],
                    features: [{
                        id: 'notDepend',
                        name: 'depend',
                        value: 'notDepend'
                    }],
                    tableSizes: [{
                        id: 'notDepend',
                        name: 'depend',
                        value: 'notDepend'
                    }],
                    shares: [{
                        id: 'notDepend',
                        type: 'notDepend',
                        value: 'notDepend',
                        products: 'notDepend'
                    }]
                }],
                validators: [
                    { name: 'required', options: { text: 'Добавьте хотя бы 1 размер для товара' } },
                    { name: 'sizes' },
                    { name: 'shares' }
                ]
            },
            {
                component: FormFieldDivider,
                name: 'divider'
            },
            {
                component: FormFieldTitle,
                name: 'form-title',
                schema: {
                    label: 'Гарантия на товар',
                    variant: 'h5'
                }
            },
            {
                component: FormFieldInput,
                name: 'warranty',
                schema: {
                    label: 'Гарантия (в месяцах)',
                    type: 'number'
                },
                validators: [
                    { name: 'required', options: { text: 'Заполните гарантию товара' } }
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
                                value: option.id,
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
                                value: option.id,
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
                component: FormFieldButtonCopyFilters,
                name: 'copyFilters',
                schema: {
                    label: 'Скопировать фильтры в характеристики',
                    type: 'button',
                    categories: categories,
                    allSubCategories: allSubCategories
                }
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
            {
                component: FormFieldTitle,
                name: 'characteristics-title',
                schema: {
                    label: 'Особенности товара',
                    variant: 'h5'
                }
            },
            {
                component: FormFieldFeature,
                name: 'features',
                valueLangStructure: [{
                    name: 'depend',
                    value: 'depend',
                    featureType: 'notDepend',
                    id: 'notDepend'
                }],
                schema: {
                    name: 'Название',
                    value: 'Описание',
                    featureType: 'Тип'
                },
                validators: [
                    { name: 'features', options: { text: 'Заполните все поля' } }
                ]
            },
            {
                component: FormFieldDivider,
                name: 'divider'
            },
            {
                component: FormFieldTitle,
                name: 'titleExist',
                schema: {
                    label: 'Наличие товара',
                    variant: 'h5'
                }
            },
            {
                component: FormFieldRadios,
                name: 'exist',
                validators: [
                    { name: 'required', options: { text: 'Подтвердите наявность в наличии' } }
                ],
                schema: {
                    options: [
                        {
                            label: 'Есть в наличии',
                            value: 'true'
                        },
                        {
                            label: 'Под заказ',
                            value: 'false'
                        }
                    ]
                }
            },
            {
                component: FormFieldDivider,
                name: 'divider'
            },
            {
                component: FormFieldTitle,
                name: 'titleLabels',
                schema: {
                    label: 'Лейблы товара',
                    variant: 'h5'
                }
            },
            {
                component: FormFieldCheckboxes,
                name: 'labels',
                schema: {
                    label: 'Лейбл',
                    options: [
                        { label: 'Топ продаж', value: 'top' },
                        { label: 'Новинка', value: 'new' },
                        { label: 'Бесплатная доставка', value: 'delivery' }
                    ]
                }
            },
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
                name: 'viewOneColor',
                schema: {
                    label: 'Показывать цвет, если он один'
                }
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
