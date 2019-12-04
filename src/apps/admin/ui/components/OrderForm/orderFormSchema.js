import FormFieldInput from '../Form/fields/FormFieldInput/FormFieldInput.jsx';
import FormFieldTitle from '../Form/fields/FormFieldTitle/FormFieldTitle.jsx';
import FormFieldSelect from '../Form/fields/FormFieldSelect/FormFieldSelect';
import FormFieldButton from '../Form/fields/FormFieldButton/FormFieldButton';

export default function ({ data: { statuses } }) {
    return {
        fields: [
            {
                component: FormFieldTitle,
                name: 'titleStatus',
                schema: {
                    label: 'Статус заказа',
                    variant: 'h6'
                }
            },
            {
                component: FormFieldSelect,
                name: 'status',
                schema: {
                    label: 'Статус',
                    options: statuses
                }
            },
            {
                component: FormFieldTitle,
                name: 'commentStatus',
                schema: {
                    label: 'Комментарий',
                    variant: 'h6'
                }
            },
            {
                component: FormFieldInput,
                name: 'comment',
                schema: {
                    label: 'Комментарий',
                    multiline: true
                }
            },
            {
                component: FormFieldButton,
                name: 'submit',
                schema: {
                    type: 'submit',
                    label: 'Сохранить'
                }
            }

        ]
    };
}
