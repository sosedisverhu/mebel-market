import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import propOr from '@tinkoff/utils/object/propOr';

import styles from './NotFoundPage.css';

const mapStateToProps = ({ application }) => {
    return {
        langMap: application.langMap,
        langRoute: application.langRoute
    };
};

const NotFoundPage = props => {
    const { langMap, langRoute } = props;
    const text = propOr('notFoundPage', {}, langMap);

    return <div className={styles.root}>
        <div className={styles.contentWrap}>
            <div className={styles.content}>
                <h1 className={styles.title}>404</h1>
                <p className={styles.text}>{text.text1}<br/>{text.text2}</p>
                <Link to={`${langRoute}/`} className={styles.link}>{text.link}</Link>
            </div>
        </div>
    </div>;
};

NotFoundPage.propTypes = {
    langMap: PropTypes.object.isRequired,
    langRoute: PropTypes.string.isRequired
};

export default connect(mapStateToProps)(NotFoundPage);
