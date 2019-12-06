import React, { Component } from 'react';
import styles from './ArticlePage.css';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import getDateFormatted from '../../../../../../utils/getDateFormatted';
import { withRouter, matchPath } from 'react-router-dom';
import find from '@tinkoff/utils/array/find';
import propOr from '@tinkoff/utils/object/propOr';

import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import NotFoundPage from '../../components/NotFoundPage/NotFoundPage';
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
        articles: PropTypes.array.isRequired,
        langRoute: PropTypes.string,
        lang: PropTypes.string.isRequired,
        langMap: PropTypes.object.isRequired
    };

    static defaultProps = {
        langRoute: '',
        articles: []
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
        const article = find(articles => articles.alias === match.params.alias, articles);
        this.notFoundPage = !article;

        return {
            article: article
        };
    };

    render () {
        const { article } = this.state;
        const { langMap, lang } = this.props;
        const text = propOr('article', {}, langMap);

        if (this.notFoundPage) {
            return <NotFoundPage />;
        }

        return <section className={styles.root}>
            <Breadcrumbs />
            <div className={styles.articleWrap}>
                <div className={styles.article}>
                    <h1 className={styles.title}>{article.texts[lang].name}</h1>
                    <div className={styles.date}>
                        {getDateFormatted(article.date, lang) + ' ' + text.year}
                    </div>
                    <div className={styles.content}><StyleRenderer html={article.texts[lang].content} /></div>
                </div>
            </div>
        </section>;
    }
}

export default withRouter(connect(mapStateToProps)(ArticlePage));
