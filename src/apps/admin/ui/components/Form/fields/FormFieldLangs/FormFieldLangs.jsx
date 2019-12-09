import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import findIndex from '@tinkoff/utils/array/findIndex';
import noop from '@tinkoff/utils/function/noop';

import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { withStyles } from '@material-ui/core/styles';

const materialStyles = {
    root: {
        justifyContent: 'flex-start',
        marginTop: '15px'
    },
    langNav: {
        maxWidth: '50px',
        textTransform: 'uppercase'
    },
    langNavError: {
        color: 'red !important'
    }
};

class FormFieldLangs extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        onChange: PropTypes.func,
        schema: PropTypes.object,
        value: PropTypes.string,
        validationMessage: PropTypes.string
    };

    static defaultProps = {
        onChange: noop,
        schema: {},
        value: '',
        validationMessage: ''
    };

    handleChange = (event, newValue) => {
        const { schema } = this.props;
        const langs = schema.langs || [];

        this.props.onChange(langs[newValue]);
    };

    render () {
        const { classes, schema, validationMessage, value } = this.props;
        const langs = schema.langs || [];
        let valueIndex = findIndex(lang => value === lang, langs);
        valueIndex = valueIndex < 0 ? 0 : valueIndex;

        return <BottomNavigation
            value={valueIndex}
            onChange={this.handleChange}
            showLabels
            className={classes.root}
        >
            { langs.map((lang, i) => {
                return <BottomNavigationAction className={classNames(classes.langNav, {
                    [classes.langNavError]: !!validationMessage
                })} key={i} label={lang} />;
            }) }
        </BottomNavigation>;
    }
}

export default withStyles(materialStyles)(FormFieldLangs);
