import FormFieldInput from '../Form/fields/FormFieldInput/FormFieldInput.jsx';
import FormFieldTitle from '../Form/fields/FormFieldTitle/FormFieldTitle.jsx';
import FormFieldButton from '../Form/fields/FormFieldButton/FormFieldButton';
import FormFieldCheckbox from '../Form/fields/FormFieldCheckbox/FormFieldCheckbox';
import FormFieldLangs from '../Form/fields/FormFieldLangs/FormFieldLangs';
import FormFieldEditor from '../Form/fields/FormFieldEditor/FormFieldEditor';
import FormFieldKeywords from '../Form/fields/FormFieldWords/FormFieldWords';

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
                            fields: ['ru_name', 'ua_name']
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
                    { name: 'required', options: { text: 'Заполните название новости' } }
                ]
            },
            {
                component: FormFieldInput,
                name: 'preview',
                valueLangStructure: 'depend',
                schema: {
                    label: 'Описание'
                },
                validators: [
                    { name: 'required', options: { text: 'Заполните описание новости' } }
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
                name: 'content-title',
                schema: {
                    label: 'Контент',
                    variant: 'h6'
                }
            },
            {
                component: FormFieldEditor,
                name: `content`,
                valueLangStructure: 'depend',
                schema: {
                    label: 'Описание',
                    multiline: true
                },
                validators: [
                    { name: 'required', options: { text: 'Наполните контент' } }
                ]
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
                    label: 'Скрыть статью',
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
