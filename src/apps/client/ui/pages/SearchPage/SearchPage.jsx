import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import queryString from 'query-string';

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
        lang: application.lang,
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
        lang: PropTypes.string.isRequired,
        searchByText: PropTypes.func.isRequired
    };

    constructor(...args) {
        super(...args);

        this.state = {
            products: [],
            articles: [],
            searchText: '',
            loading: true
        };
    }

    componentDidMount() {
        const { location: { search } } = this.props;
        const query = queryString.parse(search);

        this.searchByText(query.text)
            .then(() => {
                this.setState({
                    loading: false
                });
            });
    }

    searchByText(text) {
        return this.props.searchByText(text)
            .then(({ products, articles }) => {
                this.setState({
                    products,
                    articles,
                    searchText: text
                });
            });
    }

    render() {
        const { langMap } = this.props;
        const { products, searchText, articles, loading } = this.state;
        const text = propOr('searchPage', {}, langMap);

        console.log('products', products);
        console.log('articles', articles);

        if (loading) {
            return <div className={styles.loader}>
                <img src='/src/apps/client/ui/pages/SearchPage/img/loader.svg' alt='loader' />
            </div>;
        }

        return (
            <section className={styles.search}>
                <Breadcrumbs />
                {products.length
                    ? (
                        <div>
                            <div className={styles.panelTop}>
                                <h3 className={styles.panelTopTitle}>{`${products.length} ${text.results} “${searchText}”`}</h3>
                                <Sort />
                            </div>
                            <div className={styles.productsSectionWrap}>
                                <h1 className={styles.quantity}>{`${text.products} ${products.length}`}</h1>
                                <div>Test Products</div>
                                {/* <ProductsGrid products={products} /> */}
                                {articles.length
                                    ? (
                                        <div>
                                            <h1 className={styles.quantity}>{`${text.articles} ${articles.length}`}</h1>
                                            <div className={styles.articlesContainer}>
                                                {articles.map(article =>
                                                    <ArticlePreview key={article.id} article={article} />
                                                )}
                                            </div>
                                        </div>

                                            )
                                            : null}
                            </div>
                        </div>)
                        : null}
                {(!products.length && !articles.length)
                                ? (
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
                                                        value={this.state.searchText}
                                                        onChange={this.handleInputChange}
                                                    />
                                                </div>
                                                <button className={styles.searchButton} type="submit"></button>
                                            </form>
                                            <p className={styles.needHelp}>{text.needHelp}</p>
                                            <Link className={styles.link} to="#" >{text.link}</Link>
                                        </div>
                                    </div>)
                                : null}

            </section>
                    );
            }
        }
        
        export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SearchPage));
