import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import noop from '@tinkoff/utils/function/noop';

export default class FormFieldCheckbox extends Component {
    static propTypes = {
        value: PropTypes.bool,
        schema: PropTypes.object,
        onChange: PropTypes.func,
        validationMessage: PropTypes.string
    };

    static defaultProps = {
        value: false,
        schema: {},
        onChange: noop,
        validationMessage: ''
    };

    handleChange = (event, checked) => {
        event.preventDefault();

        this.props.onChange(checked);
    };

    render () {
        const { value, validationMessage, schema } = this.props;

        return <FormControlLabel
            control={
                <Checkbox
                    error={!!validationMessage}
                    checked={value}
                    onChange={this.handleChange}
                    color='primary'
                    disabled={schema.disabled}
                />
            }
            label={schema.label}
        />;
    }
}
