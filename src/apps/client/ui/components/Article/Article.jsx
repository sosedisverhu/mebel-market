import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import propOr from '@tinkoff/utils/object/propOr';

import styles from './Article.css';

const mapStateToProps = ({ application, data }) => {
    return {
        langMap: application.langMap,
        lang: application.lang,
        articles: data.articles
    };
};

class Article extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired,
        lang: PropTypes.string.isRequired
    };

    render () {
        const { langMap, lang, articles } = this.props;
        const text = propOr('articles', {}, langMap);

console.log(text.sections.title);
        return (
            <section className={styles.articles}>
                {text.sections.map(article =>
                    <div className={styles.article} key={article.id}>
                        <h1 className={styles.title}>{article.title}</h1>
                        {article.introduction}
                    </div>
                )}
            </section>
        );
    }
}

export default connect(mapStateToProps)(Article);
