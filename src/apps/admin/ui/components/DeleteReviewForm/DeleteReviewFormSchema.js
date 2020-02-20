import FormFieldBlockButtons from '../Form/fields/FormFieldButtons/FormFieldButtons';
import FormFieldTitle from '../Form/fields/FormFieldTitle/FormFieldTitle';

export default function ({ data: { onCancellation } }) {
    return {
        fields: [
            {
                component: FormFieldTitle,
                name: 'form-title',
                schema: {
                    label: 'Вы действительно хотите удалить отзыв?',
                    variant: 'h4'
                }
            },
            {
                component: FormFieldBlockButtons,
                schema: {
                    buttons: [
                        {
                            label: 'Удалить',
                            type: 'submit'
                        },
                        {
                            label: 'Отменить',
                            type: 'reset',
                            color: 'secondary',
                            onClick: onCancellation
                        }
                    ]
                }
            }
        ]
    };
}
