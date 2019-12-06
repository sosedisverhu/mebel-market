import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TextField from '@material-ui/core/TextField';

import noop from '@tinkoff/utils/function/noop';

export default class FormFieldInput extends Component {
    static propTypes = {
        value: PropTypes.string,
        schema: PropTypes.object,
        onChange: PropTypes.func,
        onBlur: PropTypes.func,
        validationMessage: PropTypes.string
    };

    static defaultProps = {
        value: '',
        schema: {},
        onChange: noop,
        onBlur: noop,
        validationMessage: ''
    };

    handleChange = event => {
        event.preventDefault();

        this.props.onChange(event.target.value);
    };

    render () {
        const { value, schema, validationMessage } = this.props;

        return <TextField
            label={schema.label}
            value={value}
            onChange={this.handleChange}
            onBlur={this.props.onBlur}
            error={!!validationMessage}
            margin='normal'
            variant='outlined'
            multiline={schema.multiline}
            type={schema.type || 'text'}
        />;
    }
}
