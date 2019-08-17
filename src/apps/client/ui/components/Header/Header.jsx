import React, { Component } from 'react';
import PropTypes from 'prop-types';

import propOr from '@tinkoff/utils/object/propOr';

import { connect } from 'react-redux';

import styles from './Header.css';

const mapStateToProps = ({ application }) => {
    return {
        langMap: application.langMap
    };
};

class Header extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired
    };

    render () {
        const { langMap } = this.props;
        const text = propOr('header', {}, langMap);

        return <div className={styles.root}>
            {text.title}
        </div>;
    }
}

export default connect(mapStateToProps)(Header);
