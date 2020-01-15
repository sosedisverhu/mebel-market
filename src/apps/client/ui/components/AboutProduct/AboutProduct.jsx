import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import propOr from '@tinkoff/utils/object/propOr';
import setScrollToCharacteristic from '../../../actions/setScrollToCharacteristic';
import outsideClick from '../../hocs/outsideClick';

import formatMoney from '../../../utils/formatMoney';
import AboutProductTop from '../AboutProductTop/AboutProductTop';

import saveProductsToWishlist from '../../../services/client/saveProductsToWishlist';
import saveProductsToBasket from '../../../services/client/saveProductsToBasket';
import deleteFromWishlist from '../../../services/client/deleteFromWishlist';

import classNames from 'classnames';

import openBasket from '../../../actions/openBasket';
import styles from './AboutProduct.css';

const mapStateToProps = ({ application, data }) => {
    return {
        langMap: application.langMap,
        lang: application.lang,
        wishlist: data.wishlist,
        basket: data.basket,
        basketIsOpen: data.basketIsOpen
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setScrollToCharacteristic: payload => dispatch(setScrollToCharacteristic(payload)),
        saveProductsToWishlist: payload => dispatch(saveProductsToWishlist(payload)),
        saveProductsToBasket: payload => dispatch(saveProductsToBasket(payload)),
        deleteFromWishlist: payload => dispatch(deleteFromWishlist(payload)),
        openBasket: (payload) => dispatch(openBasket(payload))
    };
};

@outsideClick
class AboutProduct extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired,
        lang: PropTypes.string.isRequired,
        product: PropTypes.object.isRequired,
        setScrollToCharacteristic: PropTypes.func.isRequired,
        turnOnClickOutside: PropTypes.func.isRequired,
        outsideClickEnabled: PropTypes.bool,
        wishlist: PropTypes.array,
        saveProductsToWishlist: PropTypes.func.isRequired,
        saveProductsToBasket: PropTypes.func.isRequired,
        deleteFromWishlist: PropTypes.func.isRequired,
        basket: PropTypes.array,
        openBasket: PropTypes.func.isRequired,
        basketIsOpen: PropTypes.bool.isRequired
    };

    state = {
        sizes: [],
        activeSize: {},
        sizeListIsOpen: true,
        selectIsOpen: false,
        isInWishlist: false,
        isInBasket: false
    };

    componentDidMount () {
        const { product } = this.props;

        this.setState({
            sizes: product.sizes,
            activeSize: product.sizes[0]
        });
    }

    static getDerivedStateFromProps (props, state) {
        const { basket, wishlist, product } = props;
        let values = {};

        values.isInBasket = !!(basket.find(item => item.product.id === product.id) && basket.find(item => item.properties.size.name === state.activeSize.name));

        values.isInWishlist = !!wishlist.find(item => item.product.id === product.id);

        return values;
    }

    scrollToTitles = () => {
        this.props.setScrollToCharacteristic(true);
    };

    onChangeActiveSize = size => {
        this.setState({
            activeSize: size,
            sizeListIsOpen: false
        });
    };

    sizeListIsOpen = () => {
        this.setState({
            sizeListIsOpen: true
        });
    };

    selectIsOpen = () => {
        this.setState(state => ({
            selectIsOpen: !state.selectIsOpen
        }));
    };

    handleAddToWishlist = () => {
        const { saveProductsToWishlist, deleteFromWishlist, wishlist, product } = this.props;
        const { isInWishlist } = this.state;

        if (!isInWishlist) {
            saveProductsToWishlist({ productId: product.id });
        } else {
            const wishlistItemId = Object.values(wishlist.find(el => el.product.id === product.id))[1];
            deleteFromWishlist(wishlistItemId);
        }
    };

    handleBuyClick = () => {
        const { saveProductsToBasket, product } = this.props;
        const { activeSize } = this.state;
        saveProductsToBasket({
            productId: product.id,
            properties: {
                size: activeSize
            },
            quantity: 1
        });
    };

    handleOpenBasket = () => {
        const { basketIsOpen, openBasket } = this.props;

        window.scroll({ top: 0, left: 0, behavior: 'smooth' });
        document.body.style.overflowY = (!basketIsOpen) ? 'hidden' : 'visible';
        openBasket();
    };

    convertNewLinesToBr = str => {
        str = str.replace(/(?:\r\n|\r|\n)/g, '<br />');
        return str;
    };

    render () {
        const { product, langMap, lang } = this.props;
        const { sizes, activeSize, sizeListIsOpen, selectIsOpen, isInWishlist, isInBasket } = this.state;
        const text = propOr('product', {}, langMap);
        const isDiscount = product.price !== product.actualPrice;
        const shortDescription = product.texts[lang].shortDescription;
        let sizeCounter = 0;

        return <div className={styles.root}>
            <AboutProductTop product={product}/>
            <div className={styles.advantagesTitle}>{text.advantages}</div>
            {shortDescription &&
            <p className={styles.advantage} dangerouslySetInnerHTML = {{ __html: this.convertNewLinesToBr(shortDescription) }}/>}
            <div className={styles.details} onClick={this.scrollToTitles}>{text.details}</div>
            {isDiscount &&
            <span className={styles.priceOld}>
                {formatMoney(product.price)}
            </span>}
            <span className={classNames(styles.price, { [styles.discountPrice]: isDiscount })}>
                {formatMoney(product.actualPrice)}
            </span>
            <div>
                <span className={styles.sizesTitle}>
                    {text.size}
                </span>
                <ul className={classNames(styles.select, { [styles.active]: selectIsOpen })}
                    onMouseEnter={() => this.sizeListIsOpen()}
                    onClick={this.selectIsOpen}
                >
                    <li className={styles.activeOption}>{activeSize.name}</li>
                    {sizes.map(size => {
                        if (size.id !== activeSize.id && sizeListIsOpen) {
                            sizeCounter++;
                            return <li className={styles.option}
                                onClick={() => this.onChangeActiveSize(size)}
                                style={{ top: `${30 * sizeCounter}px` }}
                                key={size.id}>
                                {size.name}
                            </li>;
                        }
                    })}
                </ul>
            </div>
            <div className={styles.buttons}>
                <button
                    className={classNames(styles.btnBuy, { [styles.active]: isInBasket })}
                    onClick={!isInBasket ? this.handleBuyClick : this.handleOpenBasket}>
                    {!isInBasket
                        ? text.buy
                        : text.inBasket
                    }
                </button>
                <button className={classNames(styles.btnWishList, { [styles.active]: isInWishlist })}
                    onClick={this.handleAddToWishlist}/>
            </div>
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AboutProduct);
