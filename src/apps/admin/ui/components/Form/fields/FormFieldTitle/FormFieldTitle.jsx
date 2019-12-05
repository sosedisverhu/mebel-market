import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';

export default class FormFieldTitle extends Component {
    static propTypes = {
        schema: PropTypes.object
    };

    static defaultProps = {
        schema: {}
    };

    render () {
        const { schema } = this.props;

        return <Typography
            variant={schema.variant}
        >
            {schema.label}
        </Typography>;
    }
}
