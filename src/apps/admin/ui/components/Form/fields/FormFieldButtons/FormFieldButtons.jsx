import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import noop from '@tinkoff/utils/function/noop';

const materialStyles = {
    button: {
        margin: '15px 10px 0 0'
    }
};

class FormFieldBlockButtons extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        schema: PropTypes.object
    };

    static defaultProps = {
        schema: {}
    };

    render () {
        const { classes, schema } = this.props;

        return <div>
            {(schema.buttons || []).map((button, i) => {
                return <Button
                    variant='contained'
                    color={button.color || 'primary'}
                    className={classes.button}
                    onClick={button.onClick || noop}
                    type={button.type || 'button'}
                    key={i}
                >
                    {button.label}
                </Button>;
            })}
        </div>;
    }
}

export default withStyles(materialStyles)(FormFieldBlockButtons);
