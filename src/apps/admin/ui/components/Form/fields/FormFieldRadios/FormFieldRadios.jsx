import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

import noop from '@tinkoff/utils/function/noop';

export default class FormFieldRadios extends Component {
    static propTypes = {
        value: PropTypes.string,
        schema: PropTypes.object,
        onChange: PropTypes.func,
        validationMessage: PropTypes.string
    };

    static defaultProps = {
        value: '',
        schema: {},
        onChange: noop,
        validationMessage: ''
    };

    constructor (...args) {
        super(...args);

        const { value } = this.props;

        this.state = {
            checked: value
        };
    }

    handleToggle = currentId => (event, checked) => {
        if (checked) {
            this.props.onChange(currentId);
        } else {
            this.props.onChange('');
        }
    };

    valueIsChecked = currentId => {
        const { value } = this.props;

        return currentId === value;
    };

    render () {
        const { schema, validationMessage } = this.props;

        return <FormControl>
            <RadioGroup>
                {schema.options.map((option, i) => {
                    return (
                        <FormControlLabel
                            key={i}
                            control={
                                <Radio
                                    error={!!validationMessage}
                                    color='primary'
                                    disabled={schema.disabled}
                                    onChange={this.handleToggle(option.value)}
                                    checked={this.valueIsChecked(option.value)}
                                />
                            }
                            label={option.label}
                        />
                    );
                })}
            </RadioGroup>
        </FormControl>;
    }
}
