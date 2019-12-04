import React, { Component } from 'react';
import PropTypes from 'prop-types';

import List from '@material-ui/core/List';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import noop from '@tinkoff/utils/function/noop';
import find from '@tinkoff/utils/array/find';
import findIndex from '@tinkoff/utils/array/findIndex';

export default class FormFieldCheckboxes extends Component {
    static propTypes = {
        value: PropTypes.array,
        schema: PropTypes.object,
        onChange: PropTypes.func,
        validationMessage: PropTypes.string
    };

    static defaultProps = {
        value: [],
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
        const { value } = this.props;
        const newValue = [...value];

        if (checked) {
            newValue.push(currentId);
        } else {
            const currentIdIndex = findIndex(id => id === currentId, value);

            newValue.splice(currentIdIndex, 1);
        }

        this.props.onChange(newValue);
    };

    valueIsChecked = currentId => {
        const { value } = this.props;

        return !!find(id => currentId === id, value);
    };

    render () {
        const { schema, validationMessage } = this.props;

        return <div>
            <List dense>
                {schema.options.map((option, i) => {
                    return (
                        <FormControlLabel
                            key={i}
                            control={
                                <Checkbox
                                    error={!!validationMessage}
                                    onChange={this.handleToggle(option.value)}
                                    checked={this.valueIsChecked(option.value)}
                                    color='primary'
                                    disabled={schema.disabled}
                                />
                            }
                            label={option.label}
                        />
                    );
                })}
            </List>
        </div>;
    }
}
