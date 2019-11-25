import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Divider from '@material-ui/core/Divider';

import { withStyles } from '@material-ui/core/styles';

const materialStyles = theme => ({
    divider: {
        marginTop: 2 * theme.spacing.unit,
        marginBottom: 2 * theme.spacing.unit
    }
});

class FormFieldDivider extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired
    };

    render () {
        const { classes } = this.props;

        return <Divider className={classes.divider}/>;
    }
}

export default withStyles(materialStyles)(FormFieldDivider);
