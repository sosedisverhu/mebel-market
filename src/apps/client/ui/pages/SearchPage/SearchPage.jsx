import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import queryString from 'query-string';

import { Link, withRouter } from 'react-router-dom';

import propOr from '@tinkoff/utils/object/propOr';
import searchByText from '../../../services/client/searchByText';

// import ProductsGrid from '../../components/ProductsGrid/ProductsGrid';

import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs.jsx';

import styles from './SearchPage.css';
import Sort from '../../components/Sort/Sort';

const mapStateToProps = ({ application, data }) => {
    return {
        langMap: application.langMap,
        products: data.products,
        labels: data.labels
    };
};

const mapDispatchToProps = dispatch => {
    return {
        searchByText: payload => dispatch(searchByText(payload))
    };
};

class SearchPage extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired
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

    componentDidMount () {
        const { location: { search } } = this.props;
        const query = queryString.parse(search);

        this.searchByText(query.text)
            .then(() => {
                this.setState({
                    loading: false
                });
            });
    }

    searchByText (text) {
        return this.props.searchByText(text)
            .then((result) => {                
                console.log('result', result);
                // console.log('products', products);
                // console.log('articles', articles);
                this.setState({
                    // products,
                    // articles,
                    searchText: text
                });
            });
    }

    render () {
        const { langMap } = this.props;
        const { products, searchText, articles } = this.state;
        const text = propOr('searchPage', {}, langMap);

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
                                <form className={styles.form} action="">
                                    <div className={styles.searchInputWrap}>
                                        <input className={styles.searchInput} type="text" placeholder={text.placeholder} />
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
