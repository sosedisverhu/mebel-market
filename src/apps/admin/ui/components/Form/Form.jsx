import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';

import noop from '@tinkoff/utils/function/noop';
import isObject from '@tinkoff/utils/is/object';
import forEach from '@tinkoff/utils/array/each';
import any from '@tinkoff/utils/array/any';

import { withStyles } from '@material-ui/core/styles';

import validatorsList from './validators';

const materialStyles = {
    form: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%'
    }
};

class Form extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        schema: PropTypes.object.isRequired,
        initialValues: PropTypes.object,
        onChange: PropTypes.func,
        onSubmit: PropTypes.func
    };

    static defaultProps = {
        initialValues: {},
        onChange: noop,
        onSubmit: noop
    };

    constructor (...args) {
        super(...args);

        this.state = {
            values: this.props.initialValues,
            validationMessages: {}
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

            return {
                ...validators,
                [field.name]: field.validators
            };
        }, {});

    createField = (field, i) => {
        const { values, validationMessages } = this.state;
        const FieldComponent = field.component;
        const validationMessage = validationMessages[field.name];
        const fieldProps = {
            onChange: this.handleFieldChange(field.name),
            onBlur: this.handleFieldBlur(field.name),
            name: field.name,
            value: values[field.name],
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
        const validationMessages = {};
        let isValid = true;

        this.props.schema.fields.map((field) => {
            const validationMessage = this.validateField(field.name);

            if (validationMessage) {
                isValid = false;
            }

            validationMessages[field.name] = validationMessage;
        });

        this.setState({
            validationMessages
        });

        return isValid;
    };

    validateField = (filedName) => {
        const { values } = this.state;
        const validators = this.validators[filedName] || [];
        let validationMessage = '';

        forEach(({ name, options }) => {
            const validatorOptions = isObject(options) ? options : {};
            const validator = validatorsList[name];

            if (validator && !validationMessage) {
                validationMessage = validator(values[filedName], validatorOptions, values);
            }
        }, validators);

        return validationMessage;
    };

    handleFieldChange = (name) => (value) => {
        const changes = {
            [name]: value
        };
        const { values, validationMessages } = this.state;
        const newValues = {
            ...values,
            ...changes
        };

        this.props.onChange(newValues, changes);
        this.setState({
            values: newValues,
            validationMessages: {
                ...validationMessages,
                [name]: ''
            }
        });
    };

    handleFieldBlur = (name) => () => {
        const { validationMessages } = this.state;
        const validationMessage = this.validateField(name);

        this.setState({
            validationMessages: {
                ...validationMessages,
                [name]: validationMessage
            }
        });
    };

    handleSubmit = event => {
        event.preventDefault();

        const isValid = this.validateForm();

        isValid && this.props.onSubmit(this.state.values);
    };

    render () {
        const { schema, classes } = this.props;

        return <form onSubmit={this.handleSubmit} className={classes.form}>
            { schema.fields.map((field, i) => this.createField(field, i)) }
        </form>;
    }
}

export default withStyles(materialStyles)(Form);
