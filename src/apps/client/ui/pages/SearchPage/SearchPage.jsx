import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import searchByText from '../../../services/client/searchByText';
import { Link, withRouter } from 'react-router-dom';

import propOr from '@tinkoff/utils/object/propOr';
import queryString from 'query-string';
// import ProductsGrid from '../../components/ProductsGrid/ProductsGrid';

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

const mapDispatchToProps = (dispatch) => ({
    searchByText: payload => dispatch(searchByText(payload))
});

class SearchPage extends Component {
    static propTypes = {
        langRoute: PropTypes.string.isRequired,
        langMap: PropTypes.object.isRequired,
        lang: PropTypes.string.isRequired,
        searchByText: PropTypes.func.isRequired
    };

    constructor (...args) {
        super(...args);

        this.state = {
            products: [],
            articles: [],
            searchText: '',
            loading: true
        };
    }

    // componentDidMount () {
    //     const { location: { searchText } } = this.props;
    //     const query = queryString.parse(searchText);
    //
    //     this.searchByText(query.text)
    //         .then(() => {
    //             this.setState({
    //                 loading: false
    //             });
    //         });
    // }
    //
    // searchByText (text) {
    //     return this.props.searchByText(text)
    //     .then(({ products, articles }) => {
    //         this.setState({
    //             products,
    //             articles,
    //             searchedText: text
    //         });
    //     });
    // }
    //
    // handleInputSubmit = inputValue => {
    //     e.preventDefault();
    //     if (inputValue) {
    //         const { langRoute } = this.props;
    //
    //         this.searchByText(inputValue)
    //         .then(() => {
    //             this.props.history.push(`${langRoute}/search?text=${inputValue}`);
    //         });
    //     }
    // };


    render () {
        const { langMap, lang } = this.props;
        const { products, articles, searchText, loading } = this.state;
        const text = propOr('searchPage', {}, langMap);

        if (loading) {
            return <div className={styles.loader}>
                <img src='/src/apps/client/ui/pages/SearchPage/img/loader.svg' alt='loader'/>
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
                                <h1 className={styles.quantity}>{`${text.products}: ${products.length}`}</h1>
                                {/* <ProductsGrid products={products} /> */}
                            </div>
                        </div>)
                    : (
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
                        </div>)}

            </section>
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SearchPage));
