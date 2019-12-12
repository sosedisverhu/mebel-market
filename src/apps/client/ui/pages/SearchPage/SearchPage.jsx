import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import queryString from 'query-string';
import classNames from 'classnames';

import { Link, withRouter } from 'react-router-dom';

import propOr from '@tinkoff/utils/object/propOr';
import searchByText from '../../../services/client/searchByText';

import ProductsGrid from '../../components/ProductsGrid/ProductsGrid';
import ArticlePreview from '../../components/ArticlePreview/ArticlePreview';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs.jsx';

import styles from './SearchPage.css';
import Sort from '../../components/Sort/Sort';

const mapStateToProps = ({ application, data }) => {
    return {
        langRoute: application.langRoute,
        langMap: application.langMap,
        products: data.products,
        labels: data.labels,
        articles: data.articles
    };
};

const mapDispatchToProps = dispatch => {
    return {
        searchByText: payload => dispatch(searchByText(payload))
    };
};

class SearchPage extends Component {
    static propTypes = {
        langRoute: PropTypes.string.isRequired,
        langMap: PropTypes.object.isRequired,
        searchByText: PropTypes.func.isRequired,
        location: PropTypes.object,
        history: PropTypes.object.isRequired
    };

    constructor (...args) {
        super(...args);

        this.state = {
            products: [],
            articles: [],
            searchText: '',
            newText: '',
            loading: true
        };
    }

    componentDidMount () {
        this.searchByText();
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.location !== this.props.location) {
            this.searchByText(nextProps);
        }
    }

    searchByText (props = this.props) {
        const { location: { search } } = props;
        const query = queryString.parse(search);

        if (!query.text) {
            return this.setState({
                loading: false
            });
        }

        this.setState({
            loading: true
        });

        this.props.searchByText(query.text)
            .then(({ products, articles }) => {
                this.setState({
                    products,
                    articles,
                    searchText: query.text,
                    loading: false
                });
            });
    }

    handleSearchSubmit = (e) => {
        e.preventDefault();
        const { langRoute } = this.props;
        const { newText } = this.state;

        if (newText) {
            this.props.history.push(`${langRoute}/search?text=${newText}`);
        }
    };

    handleInputChange = (e) => {
        this.setState({
            newText: e.target.value
        });
    }

    render () {
        const { langMap } = this.props;
        const { products, searchText, articles, loading, newText } = this.state;
        const text = propOr('searchPage', {}, langMap);

        if (loading) {
            return <div className={styles.loader}>
                <img src='/src/apps/client/ui/pages/SearchPage/img/loader.svg' alt='loader' />
            </div>;
        }

        return (
            <section className={styles.search}>
                <Breadcrumbs />
                {products.length
                    ? (<div>
                        <div className={styles.panelTop}>
                            <h3 className={styles.panelTopTitle}>{`${products.length + articles.length} ${text.results} “${searchText}”`}</h3>
                            <Sort />
                        </div>
                        <div className={styles.productsSectionWrap}>
                            <h1 className={styles.quantity}>{`${text.products} ${products.length}`}</h1>
                            <div>Test Products</div>
                            {/* <ProductsGrid products={products} /> */}
                        </div>
                    </div>)
                    : null}
                {articles.length
                    ? (<div className={styles.articlesSection}>
                        <h1 className={classNames(styles.quantity, styles.quantityArticle)}>{`${text.articles} ${articles.length}`}</h1>
                        <div className={styles.articlesContainer}>
                            {articles.map(article =>
                                <ArticlePreview key={article.id} article={article} />
                            )}
                        </div>
                    </div>)
                    : null}
                {(!products.length && !articles.length)
                    ? (
                        <div className={styles.searchSection}>
                            <div className={styles.searchNotFoundWrap}>
                                <div className={styles.searchNotFound}>
                                    <h2 className={styles.searchNotFoundText}>{`${text.noResults} “${searchText}”`}</h2>
                                    <h3 className={styles.tryAgain}>{text.tryAgain}</h3>
                                    <form className={styles.form} onSubmit={this.handleSearchSubmit}>
                                        <div className={styles.searchInputWrap}>
                                            <input
                                                className={styles.searchInput}
                                                type="text"
                                                placeholder={text.placeholder}
                                                value={newText}
                                                onChange={this.handleInputChange}
                                            />
                                        </div>
                                        <button className={styles.searchButton} type="submit"></button>
                                    </form>
                                    <p className={styles.needHelp}>{text.needHelp}</p>
                                    <Link className={styles.link} to="#" >{text.link}</Link>
                                </div>
                            </div>
                        </div>)
                    : null}
            </section>
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SearchPage));
