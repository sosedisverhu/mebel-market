import React, { Component } from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';

import noop from '@tinkoff/utils/function/noop';

import { withStyles } from '@material-ui/core/styles';

const materialStyles = {
    root: {
        marginTop: '16px',
        marginBottom: '8px',
        width: 'calc(100% - 60px)',
        fontFamily: 'Roboto, Helvetica, Arial, sans-serif'
    }
};

const customSelectStyles = {
    valueContainer: (provided) => ({
        ...provided,
        padding: '8px 14px'
    }),
    menu: (provided) => ({
        ...provided,
        zIndex: 9999
    })
};

class FormFieldFeatureSelect extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        schema: PropTypes.object,
        onChange: PropTypes.func,
        value: PropTypes.array, // example [{ value: 'product1', label: 'Product1'}]
        options: PropTypes.array // example [{ value: 'product1', label: 'Product1'}, { value: 'product2', label: 'Product2'}]
    };

    static defaultProps = {
        value: [],
        options: [],
        onChange: noop,
        schema: {}
    };

    render () {
        const { classes, value, options, schema } = this.props;

        return <div className={classes.root}>
            <Select
                styles={customSelectStyles}
                closeMenuOnSelect={true}
                defaultValue={value}
                options={options}
                onChange={this.props.onChange}
                placeholder={schema.placeholder}
            />
        </div>;
    }
}

export default withStyles(materialStyles)(FormFieldFeatureSelect);
