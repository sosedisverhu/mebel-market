import React, { Component } from 'react';
import styles from './ArticlePage.css';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import getDateFormatted from '../../../../../../utils/getDateFormatted';
import { withRouter, matchPath } from 'react-router-dom';
import find from '@tinkoff/utils/array/find';
import propOr from '@tinkoff/utils/object/propOr';
import StyleRenderer from '../../components/StyleRenderer/StyleRenderer';

const mapStateToProps = ({ application, data }) => {
    return {
        articles: data.articles,
        langRoute: application.langRoute,
        lang: application.lang,
        langMap: application.langMap
    };
};

class ArticlePage extends Component {
    static propTypes = {
        // mediaWidth: PropTypes.number.isRequired,
        // activeCategoryIndex: PropTypes.number.isRequired,
        // setActiveCategoryIndex: PropTypes.func.isRequired,
        // news: PropTypes.array.isRequired,
        // categories: PropTypes.array.isRequired,
        // location: PropTypes.object.isRequired,
        // langRoute: PropTypes.string,
        // lang: PropTypes.string.isRequired,
        // langMap: PropTypes.object.isRequired
    };

    static defaultProps = {
        langRoute: ''
    };

    constructor (...args) {
        super(...args);

        this.state = {
            ...this.getNewState(this.props)
        };
    }

    getNewState = (props) => {
        const { location: { pathname }, langRoute, articles } = props;
        const PRODUCT_PATH = `${langRoute}/articles/:alias`;
        const match = matchPath(pathname, { path: PRODUCT_PATH, exact: true });
        const article = find(news => news.alias === match.params.alias, articles);
        this.notFoundPage = !article;

        return {
            article: article
        };
    };

    render () {
        const { article } = this.state;
        const { langMap, lang } = this.props;
        const text = propOr('news', {}, langMap);

        if (this.notFoundPage) {
            return <div>Not Article</div>;
        }

        return <section className={styles.newsContainer}>
            <div className={styles.newsDate}>
                {/* {getDateFormatted(article.date, lang)} */}
            </div>
            <div className={styles.newsTitle}>{article.texts[lang].name}</div>
            <div className={styles.newsTitle}>{article.texts[lang].preview}</div>
            <div className={styles.newsText}><StyleRenderer html={article.texts[lang].content} /></div>
        </section>;
    }
}

export default withRouter(connect(mapStateToProps)(ArticlePage));
