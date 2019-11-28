import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import propOr from '@tinkoff/utils/object/propOr';

import styles from './Articles.css';
import { Link, Redirect } from 'react-router-dom';

const mapStateToProps = ({ application, data }) => {
    return {
        langMap: application.langMap,
        lang: application.lang,
        articles: data.articles
    };
};

class Articles extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired,
        lang: PropTypes.string.isRequired
    };

    render () {
        const { langMap, lang, articles } = this.props;
        const text = propOr('articles', {}, langMap);

        return (
            <section className={styles.articles}>
                {text.sections.map(article =>
                    <div className={styles.article} key={article.id}>
                        <Link className={styles.titleLink} to={`/articles/${article.id}`}>
                            <h1 className={styles.title}><span className={styles.titleUnderline}>{article.title}</span></h1>
                        </Link>
                        {article.introduction}
                        <div className={styles.moreInfo}>
                            {/*<Link to={`/articles/${article.id}`}>
                                <button className={styles.readMoreBtn}>{text.moreBtn}</button>
                            </Link>*/}
                            <Link to={`/articles/${article.id}`}>
                                <button className={styles.readMoreBtn}>{text.moreBtn}</button>
                            </Link>
                            <span className={styles.date}>{article.date}</span>
                        </div>
                    </div>
                )}
            </section>
        );
    }
}

export default connect(mapStateToProps)(Articles);
