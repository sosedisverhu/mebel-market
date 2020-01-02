import FormFieldInput from '../Form/fields/FormFieldInput/FormFieldInput.jsx';
import FormFieldTitle from '../Form/fields/FormFieldTitle/FormFieldTitle.jsx';
import FormFieldButton from '../Form/fields/FormFieldButton/FormFieldButton';
import FormFieldDivider from '../Form/fields/FormFieldDivider/FormFieldDivider';
import FormFieldCheckboxes from '../Form/fields/FormFieldCheckboxes/FormFieldCheckboxes';

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
                component: FormFieldInput,
                name: 'login',
                schema: {
                    label: 'Логин'
                },
                validators: [
                    { name: 'required', options: { text: 'Добавьте логин админа' } }
                ]
            },
            {
                component: FormFieldInput,
                name: 'email',
                schema: {
                    label: 'Почта'
                },
                validators: [
                    { name: 'required', options: { text: 'Добавьте почту админа' } }
                ]
            },
            {
                component: FormFieldInput,
                name: 'password',
                schema: {
                    label: 'Пароль',
                    type: 'password',
                    autoComplete: 'new-password'
                },
                validators: [
                    { name: 'required', options: { text: 'Добавьте пароль админа' } }
                ]
            },
            {
                component: FormFieldDivider,
                name: 'divider'
            },
            {
                component: FormFieldTitle,
                name: 'titleSections',
                schema: {
                    label: 'Права на разделы',
                    variant: 'h5'
                }
            },
            {
                component: FormFieldCheckboxes,
                name: 'sections',
                schema: {
                    label: 'Права на разделы',
                    options: [
                        { label: 'Заказы', value: 'orders' },
                        { label: 'Продукты', value: 'products' },
                        { label: 'Партнёры', value: 'partners' },
                        { label: 'Статьи', value: 'articles' }
                    ]
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
