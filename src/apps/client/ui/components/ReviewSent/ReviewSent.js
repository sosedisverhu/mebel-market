import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import propOr from '@tinkoff/utils/object/propOr';

import styles from './ReviewSent.css';

const ReviewSent = props => {
    const { langMap } = props;
    const text = propOr('reviewSent', {}, langMap);

    return (
        <div className={styles.wrapper}>
            <h1>{text.thanks}</h1>
            <p>
                <span>{text.publication}</span>
                <br/>
                <span>{text.moderation}</span>
            </p>
        </div>
    );
};

const mapStateToProps = ({ application }) => {
    return {
        langMap: application.langMap
    };
};

ReviewSent.propTypes = {
    langMap: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(ReviewSent);
