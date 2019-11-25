import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Editor from '../../../Editor/Editor';

import noop from '@tinkoff/utils/function/noop';

import { withStyles } from '@material-ui/core/styles';

const materialStyles = {
    field: {
        marginTop: '15px',
        marginBottom: '8px'
    }
};

class FormFieldEditor extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        value: PropTypes.string,
        onChange: PropTypes.func
    };

    static defaultProps = {
        value: '',
        onChange: noop
    };

    handleChange = event => {
        this.props.onChange(event.target.value);
    };

    render () {
        const { classes, value } = this.props;

        return <div className={classes.field}>
            <Editor
                value={value}
                onChange={this.handleChange}
            />
        </div>;
    }
}

export default withStyles(materialStyles)(FormFieldEditor);
