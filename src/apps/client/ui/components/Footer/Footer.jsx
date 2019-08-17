import React, { Component } from 'react';
import PropTypes from 'prop-types';

import propOr from '@tinkoff/utils/object/propOr';

import { connect } from 'react-redux';

import styles from './Footer.css';

const mapStateToProps = ({ application }) => {
    return {
        langMap: application.langMap
    };
};

class Footer extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired
    };

    render () {
        const { langMap } = this.props;
        const text = propOr('footer', {}, langMap);

        return <div className={styles.root}>
            {text.title}
        </div>;
    }
}

export default connect(mapStateToProps)(Footer);
