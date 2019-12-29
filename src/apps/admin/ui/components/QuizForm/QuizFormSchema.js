import FormFieldInput from '../Form/fields/FormFieldInput/FormFieldInput.jsx';
import FormFieldTitle from '../Form/fields/FormFieldTitle/FormFieldTitle.jsx';
import FormFieldButton from '../Form/fields/FormFieldButton/FormFieldButton';
import FormFieldCheckbox from '../Form/fields/FormFieldCheckbox/FormFieldCheckbox';
import FormFieldLangs from '../Form/fields/FormFieldLangs/FormFieldLangs';
import FormFieldDivider from '../Form/fields/FormFieldDivider/FormFieldDivider';
import FormFieldQuizSteps from '../Form/fields/FormFieldQuizSteps/FormFieldQuizSteps';

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
                    label: 'Название опроса'
                },
                validators: [
                    { name: 'required', options: { text: 'Заполните название опроса' } }
                ]
            },
            {
                component: FormFieldDivider,
                name: 'divider'
            },
            {
                component: FormFieldTitle,
                name: 'steps-title',
                schema: {
                    label: 'Шаги опроса',
                    variant: 'h6'
                }
            },
            {
                component: FormFieldQuizSteps,
                name: 'steps',
                valueLangStructure: [{
                    name: 'depend',
                    id: 'notDepend',
                    options: [{
                        id: 'notDepend',
                        name: 'depend',
                        file: 'notDepend'
                    }]
                }],
                schema: {
                    name: 'Название шага',
                    value: 'Значения',
                    name2: 'Опции',
                    variant2: 'h5',
                    labelInput: 'Название опции'
                },
                validators: [
                    { name: 'required', options: { text: 'Добавьте шаги опроса' } },
                    {
                        name: 'quizSteps',
                        options: {
                            errorName: 'Заполните название шага',
                            errorOptions: 'Добавьте опции',
                            errorOptionName: 'Добавьте название опции',
                            errorOptionFile: 'Добавьте картинку опции'
                        }
                    }
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
                    label: 'Скрыть опрос',
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
