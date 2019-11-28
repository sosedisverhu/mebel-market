import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import propOr from '@tinkoff/utils/object/propOr';

import styles from './Article.css';
import { withRouter, matchPath } from 'react-router-dom';

const mapStateToProps = ({ application }) => {
    return {
        langMap: application.langMap,
        lang: application.lang
    };
};

class Article extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired,
        lang: PropTypes.string.isRequired
    };

    render () {
        const { langMap, lang } = this.props;
        const text = propOr('articles', {}, langMap);

        const id = this.props.match.params.id - 1;
        const article = text.sections[id];

        return (
            <section className={styles.articles}>
                <div className={styles.article}>
                    <div className={styles.titleWrapper}>
                        <h1 className={styles.title}>{article.title}</h1>
                        {article.date}
                    </div>
                    <div className={styles.introduction}>
                        {article.introduction}
                    </div>
                    {article.content}
                </div>
            </section>
        );
    }
}

export default withRouter(connect(mapStateToProps)(Article));
