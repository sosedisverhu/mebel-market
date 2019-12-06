import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import ErrorIcon from '@material-ui/icons/Error';
import { withStyles } from '@material-ui/core/styles';

import getLangsValuesForArray from './utils/getLangsValuesForArray';
import getLangsValuesForObject from './utils/getLangsValuesForObject';

import noop from '@tinkoff/utils/function/noop';
import isEmpty from '@tinkoff/utils/is/empty';
import isObject from '@tinkoff/utils/is/plainObject';
import isArray from '@tinkoff/utils/is/array';
import isString from '@tinkoff/utils/is/string';
import forEach from '@tinkoff/utils/array/each';
import any from '@tinkoff/utils/array/any';
import clone from '@tinkoff/utils/clone';

import validatorsList from './validators';

const materialStyles = theme => ({
    form: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%'
    },
    error: {
        backgroundColor: theme.palette.error.dark
    },
    icon: {
        fontSize: 20
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing.unit
    },
    message: {
        display: 'flex',
        alignItems: 'center'
    },
    margin: {
        margin: theme.spacing.unit
    }
});

class Form extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        schema: PropTypes.object.isRequired,
        initialValues: PropTypes.object,
        langs: PropTypes.array,
        onChange: PropTypes.func,
        onSubmit: PropTypes.func
    };

    static defaultProps = {
        initialValues: {},
        langs: [],
        onChange: noop,
        onSubmit: noop
    };

    constructor (...args) {
        super(...args);

        this.state = {
            values: clone(this.props.initialValues),
            validationMessages: {},
            lang: this.props.langs[0]
        };
        this.validators = this.getFieldsValidators();
    }

    componentWillReceiveProps (nextProps, nextContext) {
        if (nextProps.schema !== this.props.schema) {
            this.validators = this.getFieldsValidators(nextProps);
        }
    }

    getFieldsValidators = (props = this.props) => props.schema.fields
        .reduce((validators, field) => {
            if (!field.validators) {
                return validators;
            }

            const { langs } = this.props;
            let newValidators = {};

            if (field.valueLangStructure) {
                newValidators = langs.reduce((result, lang) => {
                    return {
                        ...result,
                        [`${lang}_${field.name}`]: field.validators
                    };
                }, {});
            } else {
                newValidators[field.name] = field.validators;
            }

            return {
                ...validators,
                ...newValidators
            };
        }, {});

    getAnotherLangsChanges = (field, value) => {
        if (!field.valueLangStructure || isString(field.valueLangStructure)) {
            return {};
        }

        const { langs } = this.props;
        const { values, lang: currentLang } = this.state;
        const changesByLang = {};

        langs.forEach(lang => {
            if (currentLang !== lang) {
                if (isArray(field.valueLangStructure) && isArray(value)) {
                    return getLangsValuesForArray(
                        [`${lang}_${field.name}`],
                        [`${lang}_${field.name}`],
                        value,
                        field.valueLangStructure,
                        values, changesByLang
                    );
                }

                if (isObject(field.valueLangStructure) && isObject(value)) {
                    return getLangsValuesForObject(
                        [`${lang}_${field.name}`],
                        [`${lang}_${field.name}`],
                        value,
                        field.valueLangStructure,
                        values,
                        changesByLang
                    );
                }
            }
        }, {});

        return changesByLang;
    };

    createField = (field, i) => {
        const { values, validationMessages, lang } = this.state;
        const FieldComponent = field.component;
        const fieldName = field.valueLangStructure ? `${lang}_${field.name}` : field.name;
        const validationMessage = validationMessages[fieldName];
        const fieldProps = {
            onChange: this.handleFieldChange(field, fieldName),
            onBlur: this.handleFieldBlur(field),
            name: fieldName,
            value: values[fieldName],
            isRequired: any(validator => validator.name === 'required', field.validators || []),
            validationMessage,
            schema: field.schema || {},
            key: i,
            news: this.props.initialValues
        };

        return <FormControl key={i} error={!!validationMessage}>
            <FieldComponent {...fieldProps} />
            { field.hint && <FormHelperText>{field.hint}</FormHelperText> }
            { validationMessage && <FormHelperText>{validationMessage}</FormHelperText> }
        </FormControl>;
    };

    validateForm = () => {
        const { langs, schema } = this.props;
        const { lang: currentLang } = this.state;
        let validationMessages = {};
        let isValid = true;
        let isAnotherLangValid = true; // Todo: добавить подсказку "Поправьте валидацию для языков: langs"
        let isCurrentLangValid = true;

        schema.fields.map((field) => {
            let newValidationMessages = {};

            if (field.valueLangStructure) {
                newValidationMessages = langs.reduce((result, lang) => {
                    const validationMessage = this.validateField(`${lang}_${field.name}`);

                    if (validationMessage) {
                        if (isCurrentLangValid) {
                            if (currentLang === lang) {
                                isCurrentLangValid = false;
                            }
                        }
                        if (isAnotherLangValid) {
                            if (currentLang !== lang) {
                                isAnotherLangValid = false;
                            }
                        }

                        return {
                            ...result,
                            [`${lang}_${field.name}`]: validationMessage
                        };
                    }

                    return result;
                }, {});
            } else {
                const validationMessage = this.validateField(field.name);

                if (validationMessage) {
                    if (isCurrentLangValid) {
                        isCurrentLangValid = false;
                    }

                    newValidationMessages[field.name] = validationMessage;
                }
            }

            if (!isEmpty(newValidationMessages)) {
                isValid = false;
            }

            validationMessages = {
                ...validationMessages,
                ...newValidationMessages
            };
        });

        this.setState({
            validationMessages
        });

        return { isValid, isOnlyAnotherLangInvalid: !isAnotherLangValid && isCurrentLangValid };
    };

    validateField = (filedName) => {
        const { values } = this.state;
        const validators = this.validators[filedName] || [];
        let validationMessage = '';

        forEach(({ name, options }) => {
            const validatorOptions = isObject(options) ? options : {};
            const validator = validatorsList[name];

            if (validator && !validationMessage) {
                validationMessage = validator(values[filedName], validatorOptions, values, filedName);
            }
        }, validators);

        return validationMessage;
    };

    handleFieldChange = (field, fieldName) => (value) => {
        const changes = {
            ...this.getAnotherLangsChanges(field, value),
            [fieldName]: value
        };
        const { values, validationMessages } = this.state;
        const newValues = {
            ...values,
            ...changes
        };

        if ('lang' in changes) {
            this.setState({
                lang: newValues.lang
            });
        }

        this.props.onChange(newValues, changes);
        this.setState({
            values: newValues,
            validationMessages: {
                ...validationMessages,
                [fieldName]: ''
            }
        });
    };

    handleFieldBlur = (field) => () => {
        const { validationMessages, lang } = this.state;

        const fieldName = field.valueLangStructure ? `${lang}_${field.name}` : field.name;
        const validationMessage = this.validateField(fieldName);

        this.setState({
            validationMessages: {
                ...validationMessages,
                [fieldName]: validationMessage
            }
        });
    };

    handleSubmit = event => {
        event.preventDefault();

        const { isValid, isOnlyAnotherLangInvalid } = this.validateForm();

        if (isValid) {
            this.props.onSubmit(this.state.values);
        } else {
            if (isOnlyAnotherLangInvalid) {
                this.setState({
                    errorText: 'Поправьте валидацию для других языков'
                });
                return;
            }

            this.setState({
                errorText: 'Поправьте валидацию'
            });
        }
    };

    handleHideFailMessage = () => {
        this.setState({
            errorText: ''
        });
    };

    render () {
        const { schema, classes } = this.props;
        const { errorText } = this.state;

        return <div>
            <form onSubmit={this.handleSubmit} className={classes.form}>
                { schema.fields.map((field, i) => this.createField(field, i)) }
            </form>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                }}
                onClose={this.handleHideFailMessage}
                open={!!errorText}
                autoHideDuration={2000}
            >
                <SnackbarContent
                    className={classNames(classes.error, classes.margin)}
                    message={
                        <span id='client-snackbar' className={classes.message}>
                            <ErrorIcon className={classNames(classes.icon, classes.iconVariant)} />
                            { errorText }
                        </span>
                    }
                />
            </Snackbar>
        </div>;
    }
}

export default withStyles(materialStyles)(Form);
