import FormFieldInput from '../Form/fields/FormFieldInput/FormFieldInput.jsx';
import FormFieldTitle from '../Form/fields/FormFieldTitle/FormFieldTitle.jsx';
import FormFieldButton from '../Form/fields/FormFieldButton/FormFieldButton';
import FormFieldCheckbox from '../Form/fields/FormFieldCheckbox/FormFieldCheckbox';
import FormFieldLangs from '../Form/fields/FormFieldLangs/FormFieldLangs';
import FormFieldFeaturesSubCategory from '../Form/fields/FormFieldFeaturesSubCategory/FormFieldFeaturesSubCategory';

export default function ({ data: { title } = {}, settings: { lang } } = {}) {
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
                    langs: ['ua', 'ru']
                },
                validators: [
                    {
                        name: 'requiredLangFields',
                        options: {
                            text: 'Заполните форму для всех языков',
                            fields: ['ru_name', 'ua_name']
                        }
                    }
                ]
            },
            {
                component: FormFieldInput,
                name: `${lang}_name`,
                schema: {
                    label: 'Название'
                },
                validators: [
                    { name: 'required', options: { text: 'Заполните название категории' } }
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
                component: FormFieldFeaturesSubCategory,
                name: `${lang}_subCategory`
            },
            {
                component: FormFieldCheckbox,
                name: 'hidden',
                schema: {
                    label: 'Скрыть категорию и все новости в ней'
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
