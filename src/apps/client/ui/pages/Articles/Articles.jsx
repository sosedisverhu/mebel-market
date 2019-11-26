import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import propOr from '@tinkoff/utils/object/propOr';

import styles from './Articles.css';

const mapStateToProps = ({ application }) => {
    return {
        langMap: application.langMap
    };
};

class Articles extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired
    };

    render () {
        const { langMap } = this.props;
        const text = propOr('articles', {}, langMap);

        return (
            <section className={styles.articles}>
                
            </section>
        );
    }
}

export default connect(mapStateToProps)(Articles);
