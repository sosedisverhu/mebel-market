import FormFieldBlockButtons from '../Form/fields/FormFieldButtons/FormFieldButtons';
import FormFieldTitle from '../Form/fields/FormFieldTitle/FormFieldTitle';
import FormFieldInput from '../Form/fields/FormFieldInput/FormFieldInput';
import FormFieldInformation from '../Form/fields/FormFieldInformation/FormFieldInformation';

export default function ({ data: { date, contact, onSubmit } }) {
    return {
        fields: [
            {
                component: FormFieldTitle,
                name: 'form-title',
                schema: {
                    label: 'Отзыв',
                    variant: 'h5'
                }
            },
            {
                component: FormFieldInput,
                name: 'name',
                schema: {
                    label: 'Имя пользователя'
                },
                validators: [
                    { name: 'required', options: { text: 'Заполните имя пользователя' } }
                ]
            },
            {
                component: FormFieldInformation,
                schema: {
                    values: [{ name: 'Контактные данные:', value: contact }, { name: 'Дата:', value: date }]
                }
            },
            {
                component: FormFieldInput,
                name: 'mark',
                schema: {
                    label: 'Оценка товара',
                    type: 'number'
                },
                validators: [
                    { name: 'required', options: { text: 'Заполните оценку товара' } },
                    { name: 'isNumber' },
                    { name: 'max', options: { maxValue: 5 } },
                    { name: 'min', options: { minValue: 1 } }
                ]
            },
            {
                component: FormFieldInput,
                name: 'comment',
                schema: {
                    label: 'Комментарий пользователя',
                    multiline: true
                }
            },
            {
                component: FormFieldBlockButtons,
                schema: {
                    buttons: [
                        {
                            label: 'Сохранить',
                            type: 'submit'
                        },
                        {
                            label: 'Удалить',
                            type: 'reset',
                            color: 'secondary'
                        }
                    ]
                }
            }
        ]
    };
}
