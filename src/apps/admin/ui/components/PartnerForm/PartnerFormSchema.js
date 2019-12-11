import FormFieldInput from '../Form/fields/FormFieldInput/FormFieldInput.jsx';
import FormFieldTitle from '../Form/fields/FormFieldTitle/FormFieldTitle.jsx';
import FormFieldButton from '../Form/fields/FormFieldButton/FormFieldButton';
import FormFieldCheckbox from '../Form/fields/FormFieldCheckbox/FormFieldCheckbox';
import FormFieldLangs from '../Form/fields/FormFieldLangs/FormFieldLangs';
import FormFieldDivider from '../Form/fields/FormFieldDivider/FormFieldDivider';
import FormFieldFiles from '../Form/fields/FormFieldFiles/FormFieldFiles';

export default function ({ data: { title } = {} } = {}) {
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
                },
                validators: [
                    {
                        name: 'requiredLangFields',
                        options: {
                            text: 'Заполните форму для всех языков',
                            fields: ['ru_name', 'ua_name', 'ru_description', 'ua_description']
                        }
                    }
                ]
            },
            {
                component: FormFieldInput,
                name: 'name',
                valueLangStructure: 'depend',
                schema: {
                    label: 'Название'
                },
                validators: [
                    { name: 'required', options: { text: 'Заполните название партнёра' } }
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
                name: 'title',
                schema: {
                    label: 'Логотип',
                    variant: 'h6'
                }
            },
            {
                component: FormFieldFiles,
                name: 'logo',
                schema: {
                    max: 1
                },
                validators: [
                    { name: 'requiredFiles', options: { text: 'Добавьте логотип' } }
                ]
            },
            {
                component: FormFieldInput,
                name: 'description',
                valueLangStructure: 'depend',
                schema: {
                    label: 'Описание',
                    multiline: true
                },
                validators: [
                    { name: 'required', options: { text: 'Заполните описание для партнёра' } }
                ]
            },
            {
                component: FormFieldDivider,
                name: 'divider'
            },
            {
                component: FormFieldCheckbox,
                name: 'hidden',
                schema: {
                    label: 'Скрыть партнёра',
                    disabled: false
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
