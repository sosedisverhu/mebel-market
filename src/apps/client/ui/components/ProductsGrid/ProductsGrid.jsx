import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Card from '../Card/Card';
import styles from './ProductsGrid.css';

import openBasket from '../../../actions/openBasket';

const mapStateToProps = ({ application, data }) => {
    return {
        langMap: application.langMap,
        langRoute: application.langRoute,
        lang: application.lang,
        basket: data.basket,
        basketIsOpen: data.basketIsOpen,
        width: application.media.width
    };
};

const mapDispatchToProps = dispatch => {
    return {
        openBasket: (payload) => dispatch(openBasket(payload))
    };
};

class ProductsGrid extends Component {
    static propTypes = {
        products: PropTypes.array.isRequired,
        isPromotion: PropTypes.bool,
        activeSizes: PropTypes.array,
        basketIsOpen: PropTypes.bool.isRequired,
        openBasket: PropTypes.func.isRequired,
        width: PropTypes.number.isRequired
    };

    constructor (props) {
        super(props);

        this.state = {
            checkedFeatureIds: {},
            itemsInRow: 4
        };
    }

    componentDidMount () {
        const width = this.props.width;
        this.setState({
            itemsInRow: width >= 1275 ? 4 : width >= 961 ? 3 : 2
        });
    }

    handleOpenBasket = () => {
        const { basketIsOpen, openBasket } = this.props;

        window.scroll({ top: 0, left: 0, behavior: 'smooth' });
        document.body.style.overflowY = (!basketIsOpen) ? 'hidden' : 'visible';
        openBasket();
    };

    render () {
        const { products, isPromotion, activeSizes } = this.props;
        const { itemsInRow } = this.state;
        const lastItems = products.length % itemsInRow ? products.length % itemsInRow : itemsInRow;

        return (
            <div className={styles.products}>
                {products.map((product, i) => {
                    return products.length - (i + 1) >= lastItems
                        ? <Card
                            isPromotion={isPromotion}
                            key={product.id}
                            product={product}
                            activeSizes = {activeSizes}
                            sizes = {product.sizes}
                            handleOpenBasket = {this.handleOpenBasket}
                        />
                        : <Card
                            isPromotion={isPromotion}
                            key={product.id}
                            product={product}
                            activeSizes = {activeSizes}
                            sizes = {product.sizes}
                            handleOpenBasket = {this.handleOpenBasket}
                            lastItem = {true}
                        />;
                })
                }
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductsGrid);
