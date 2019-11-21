import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import propOr from '@tinkoff/utils/object/propOr';

import styles from './Partners.css';

const mapStateToProps = ({ application }) => {
    return {
        langMap: application.langMap
    };
};

class Partners extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired
    };

    render () {
        const { langMap } = this.props;
        const text = propOr('partners', {}, langMap);

        return (
            <section className={styles.partners}>
                <h1>{text.title}</h1>
                <div className={styles.partnersContainer}>
                </div>
            </section>
        );
    }
}

export default connect(mapStateToProps)(Partners);
