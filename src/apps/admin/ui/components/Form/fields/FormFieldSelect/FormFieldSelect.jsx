import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

import noop from '@tinkoff/utils/function/noop';

export default class FormFieldSelect extends Component {
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
        const { value, schema, validationMessage, onBlur } = this.props;

        return <TextField
            label={schema.label}
            value={value}
            onChange={this.handleChange}
            onBlur={onBlur}
            error={!!validationMessage}
            margin='normal'
            variant='outlined'
            select
        >
            {
                (schema.options || []).map(({ value, name }, i) => (
                    <MenuItem key={i} value={value}>
                        {name}
                    </MenuItem>
                ))
            }
        </TextField>;
    }
}
