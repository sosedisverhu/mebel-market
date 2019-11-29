import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core';

const materialStyles = () => ({
    title: {
        padding: '16px 0',
        '@media (max-width: 600px)': {
            fontSize: '1.525rem',
            padding: '0'
        },
        '@media (max-width: 425px)': {
            fontSize: '1.2rem'
        }
    }
});

class FormFieldTitle extends Component {
    static propTypes = {
        schema: PropTypes.object,
        classes: PropTypes.object.isRequired
    };

    static defaultProps = {
        schema: {}
    };

    render () {
        const { schema, classes } = this.props;

        return <Typography
            variant={schema.variant}
            className={classes.title}
        >
            {schema.label}
        </Typography>;
    }
}

export default withStyles(materialStyles)(FormFieldTitle);
